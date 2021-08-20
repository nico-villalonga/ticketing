import { Publisher, Subjects, OrderCreatedEvent } from "@tickex/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
