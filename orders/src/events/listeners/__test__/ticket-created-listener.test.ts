import { TicketCreatedEvent } from "@nickiii-microservices-course/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";

const setup = async () => {
  // Create instance of listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // Create fake data event and fake message object
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "New Title",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // TS Ignore the next lines because it doesn't need to be a complete implementation of the `Message` class
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();

  // Call onMessage function with data and message objects
  await listener.onMessage(data, msg);

  // Make sure ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  // Call onMessage function with data and message objects
  await listener.onMessage(data, msg);

  // Make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
