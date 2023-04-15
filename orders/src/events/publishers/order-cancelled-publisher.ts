import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from "@nickiii-microservices-course/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
