import mongoose from "mongoose";
import { Password } from "../services/password";

// Describes the attributes needed to create User
interface UserAttrs {
  email: string;
  password: string;
}

// Describes the attributes possessed by User Mongoose Model
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// Describes the attributes possessed by User Mongoose Document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String, // Using mongoose types and not the TypeScript types
      required: true,
    },
    password: {
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
        delete ret.password;
      },
      versionKey: false, // Removes the `__v` attribute from the document information
    },
  }
);

userSchema.pre("save", async function (done) {
  // Using function keyword instead of the arrow function because of the `this` context
  // The function keyword takes the `this` context in terms of the User Document
  // The arrow function takes the `this` context in terms of the current file
  if (this.isModified("password")) {
    // Ensure that the password is modified first before hashing it (don't want to hash an already hashed password)
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

// If we want to enforce the TS attribute checking, create a static function using the interface as the arguments
// Then feed it into the schema
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
