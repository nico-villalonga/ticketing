import { Publisher, Subjects, TicketCreatedEvent } from "@tickex/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
