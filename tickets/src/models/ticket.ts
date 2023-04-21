import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// Describes the attributes needed to create Ticket
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// Describes the attributes possessed by Ticket Mongoose Model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// Describes the attributes possessed by Ticket Mongoose Document
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
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
    },
    userId: {
      type: String,
      required: true,
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

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

// If we want to enforce the TS attribute checking, create a static function using the interface as the arguments
// Then feed it into the schema
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
