import { rabbitMQ, EXCHANGE_NAME } from "./rabbitmq";

export interface DomainEvent {
  type: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export function publishEvent(routingKey: string, event: DomainEvent): void {
  const channel = rabbitMQ.getChannel();
  if (!channel) {
    console.warn(`RabbitMQ channel unavailable. Event not published: ${event.type}`);
    return;
  }

  try {
    channel.publish(
      EXCHANGE_NAME,
      routingKey,
      Buffer.from(JSON.stringify(event)),
      { persistent: true },
    );
  } catch (error) {
    console.error(`Failed to publish event ${event.type}:`, error);
  }
}
