import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@nickiii-microservices-course/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
