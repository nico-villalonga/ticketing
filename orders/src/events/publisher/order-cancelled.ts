import { Publisher, Subjects, OrderCancelledEvent } from "@tickex/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
