import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it("returns a 404 if the ticket is not found", async () => {
  await request(app)
    .get(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`) // Auto-generates a valid Mongo DB ID
    .send()
    .expect(404);
});
it("returns the ticket if the ticket is not found", async () => {
  const title = "Title";
  const price = 10.23;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
