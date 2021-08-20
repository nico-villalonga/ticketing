import { Publisher, Subjects, TicketUpdatedEvent } from "@tickex/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
