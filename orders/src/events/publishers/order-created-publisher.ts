import {
  OrderCreatedEvent,
  Publisher,
  Subjects,
} from "@nickiii-microservices-course/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
