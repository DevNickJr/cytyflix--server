import amqplib, { ChannelModel, Channel } from "amqplib";
import env from "@/configs/env.config";

const EXCHANGE_NAME = "cytyflix.events";
const RECONNECT_DELAY = 5000;

const QUEUES = {
  EMAIL_NOTIFICATIONS: "email.notifications",
  DB_NOTIFICATIONS: "db.notifications",
} as const;

const ROUTING_KEYS = ["booking.*", "inquiry.*", "verification.*"];

class RabbitMQManager {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private reconnecting = false;

  async connect(): Promise<void> {
    if (!env.RABBITMQ_URL) {
      console.warn("RABBITMQ_URL is not set. RabbitMQ will not be used.");
      return;
    }

    try {
      this.connection = await amqplib.connect(env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();

      // Declare exchange
      await this.channel.assertExchange(EXCHANGE_NAME, "topic", { durable: true });

      // Declare queues
      await this.channel.assertQueue(QUEUES.EMAIL_NOTIFICATIONS, { durable: true });
      await this.channel.assertQueue(QUEUES.DB_NOTIFICATIONS, { durable: true });

      // Bind queues to exchange with routing keys
      for (const key of ROUTING_KEYS) {
        await this.channel.bindQueue(QUEUES.EMAIL_NOTIFICATIONS, EXCHANGE_NAME, key);
        await this.channel.bindQueue(QUEUES.DB_NOTIFICATIONS, EXCHANGE_NAME, key);
      }

      console.log("RabbitMQ connected and queues configured.");

      this.connection.on("close", () => {
        console.warn("RabbitMQ connection closed. Attempting to reconnect...");
        this.channel = null;
        this.connection = null;
        this.scheduleReconnect();
      });

      this.connection.on("error", (err: Error) => {
        console.error("RabbitMQ connection error:", err.message);
      });
    } catch (error) {
      console.error("Failed to connect to RabbitMQ:", error);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnecting) return;
    this.reconnecting = true;
    setTimeout(async () => {
      this.reconnecting = false;
      await this.connect();
    }, RECONNECT_DELAY);
  }

  getChannel(): Channel | null {
    return this.channel;
  }

  isConnected(): boolean {
    return this.channel !== null;
  }

  async close(): Promise<void> {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
    } catch (error) {
      console.error("Error closing RabbitMQ connection:", error);
    } finally {
      this.channel = null;
      this.connection = null;
    }
  }
}

export const rabbitMQ = new RabbitMQManager();
export { EXCHANGE_NAME, QUEUES };
