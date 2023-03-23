// This file serves to extract the setup code for the express App so that the App instance can be re-used and imported elsewhere

import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import cookieSession from "cookie-session";

const app = express();
// Tells express that requests will be coming in from a proxy (ingress nginx)
// Tells express to trust the proxy request
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false, // Disable encryption on cookies
    secure: true, // Make sure cookies are sent via HTTPS
  })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
