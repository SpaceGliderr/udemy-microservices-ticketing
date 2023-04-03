import { randomBytes } from "crypto";
import nats from "node-nats-streaming";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
}); // Stan is a NATS Server client, specific terminology to NATS

// Function will execute after client instance successfully connects to the NATS server
stan.on("connect", () => {
  console.log("Listener connected to NATS");

  // Listens to the close event, and will gracefully exit the process
  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  // Manually listening to the channel
  //   const options = stan
  //     .subscriptionOptions()
  //     .setManualAckMode(true)
  //     .setDeliverAllAvailable() // Delivers all events that has been sent in the past
  //     .setDurableName("orders-service");

  //   const subscription = stan.subscribe(
  //     "ticket:created",
  //     "order-service-queue-group",
  //     options
  //   );

  //   subscription.on("message", (msg: Message) => {
  //     const data = msg.getData();

  //     if (typeof data === "string") {
  //       console.log(
  //         `Received event #${msg.getSequence()}, with data: ${JSON.parse(data)}`
  //       );
  //     }

  //     msg.ack();
  //   });

  // Using the listener class
  new TicketCreatedListener(stan).listen();
});

// Signals sent to the process when ts-node-dev restarts the client or when Ctrl C is pressed on the terminal
// Calls the close event which tells NATS that the client is dead
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
