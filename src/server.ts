import "reflect-metadata" // to allow decorators work well (typeorm)
import env from "@/configs/env.config"
import { connectDB } from "@/infrastructure/database/connect.db"
import { rabbitMQ } from "@/infrastructure/messaging/rabbitmq"
import { startEmailConsumer, startNotificationConsumer } from "@/infrastructure/messaging/consumers"
import { app } from "./app";

const PORT = Number(process.env.PORT) || env.PORT;

async function bootstrap() {
  await connectDB(); // initialize DB

  // Initialize RabbitMQ (non-blocking -- server starts regardless)
  try {
    await rabbitMQ.connect();
    if (rabbitMQ.isConnected()) {
      const channel = rabbitMQ.getChannel()!;
      await startEmailConsumer(channel);
      await startNotificationConsumer(channel);
    }
  } catch (error) {
    console.error("RabbitMQ initialization failed (non-blocking):", error);
  }

  app.listen(PORT, (err) => {
    if (err) {
        console.log(`Failed to start DB - Shutting down`)
    }
    console.log(`Server running on ${PORT}`);
  })
}




bootstrap();