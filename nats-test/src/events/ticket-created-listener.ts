import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName: string = "payments-service";

  //   constructor(client: Stan) {
  //     super(client);

  //     this.ackWait = 30;
  //   }

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Event data: ", data);

    msg.ack();
  }
}
