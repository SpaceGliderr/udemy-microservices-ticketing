import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signup: () => string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "1234";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signup = () => {
  // Can't reach over to Auth service to send a request
  // Don't want to introduce inter-service dependency
  // Tests must be self-contained and independent
  // Need to create a fake JWT and Cookie object

  // Build a JWT object
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object
  const session = { jwt: token };

  // Turn session into JSON
  const sessionJSON = JSON.stringify(session);

  // Encode JSON as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // Build string with encoded data
  return [`session=${base64}`];
};
