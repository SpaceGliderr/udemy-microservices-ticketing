// This file serves to extract the setup code for the express App so that the App instance can be re-used and imported elsewhere

import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
} from "@nickiii-microservices-course/common";

const app = express();
// Tells express that requests will be coming in from a proxy (ingress nginx)
// Tells express to trust the proxy request
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false, // Disable encryption on cookies
    // To enable the tests to work
    secure: process.env.NODE_ENV !== "test", // Make sure cookies are sent via HTTPS
  })
);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
