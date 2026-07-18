import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import swaggerUi from "swagger-ui-express";
import passport from "./config/passport.js";
import carsRouter from "./routes/cars.js";
import authRouter from "./routes/auth.js";
import { generateOpenApiDocument } from "./openapi/document.js";

export function createApp(opts: {
  sessionSecret: string;
  mongoUri: string;
  clientOrigin: string;
}) {
  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: opts.clientOrigin,
      credentials: true,
    })
  );

  app.use(
    session({
      secret: opts.sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: opts.mongoUri }),
      cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api/cars", carsRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(generateOpenApiDocument()));

  return app;
}
