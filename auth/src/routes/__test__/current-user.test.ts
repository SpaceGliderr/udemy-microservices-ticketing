import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  // One way of transferring cookies from the previous request to the current one is to extract it from the response
  // Then, provide the cookie using .set("Cookie", cookie)
  const cookie = await global.signup();
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
