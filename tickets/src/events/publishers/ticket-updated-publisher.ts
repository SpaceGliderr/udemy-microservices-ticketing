import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@nickiii-microservices-course/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
