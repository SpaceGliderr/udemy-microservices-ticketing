import { OrderStatus } from "@nickiii-microservices-course/common";
import mongoose from "mongoose";
import { TicketDoc } from "./ticket";

// Describes the attributes needed to create Order
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// Describes the attributes possessed by Order Mongoose Model
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

// Describes the attributes possessed by Order Mongoose Document
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order, OrderStatus };
