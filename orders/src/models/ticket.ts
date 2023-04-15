import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

// Describes the attributes needed to create Ticket
interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

// Describes the attributes possessed by Ticket Mongoose Model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// Describes the attributes possessed by Ticket Mongoose Document
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String, // Using mongoose types and not the TypeScript types
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      // A property that controls the way the document information is presented
      transform(_, ret) {
        // Transforms the document information to the specified JSON structure
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false, // Removes the `__v` attribute from the document information
    },
  }
);

// If we want to enforce the TS attribute checking, create a static function using the interface as the arguments
// Then feed it into the schema
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.methods.isReserved = async function () {
  // `this` is the ticket document that the method is called on
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
