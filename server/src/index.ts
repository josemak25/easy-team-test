import cors from "cors";
import logger from "morgan";
import helmet from "helmet";
import express from "express";
import flow from "lodash/fp/flow";
import compress from "compression";
import { createServer } from "http";
import * as Sentry from "@sentry/node";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import methodOverride from "method-override";
import httpContext from "express-http-context";
import expressFormData from "express-form-data";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

import routes from "./routes";
import config from "./config";
import * as database from "./config/database";
import EmailService from "./services/email.service";
import ErrorService from "./services/error.service";

// express application
const app = express();

const server = createServer(app);

Sentry.init({
  dsn: config.SENTRY_DSN,
  environment: config.NODE_ENV,
  enabled: config.IS_PRODUCTION,
  integrations: [
    // Add our Profiling integration
    nodeProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

flow([
  database.connect, // connect to database
  EmailService.init, // initialize email service
])();

// secure apps by setting various HTTP headers
app.use(helmet({ dnsPrefetchControl: false, frameguard: false, ieNoOpen: false }));

// Apply the rate limiting middleware to all requests
app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 5 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);

// compress request data for easy transport
app.use(compress());
app.use(cookieParser());
app.use(methodOverride());

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors({ credentials: true, methods: ["GET", "PUT", "POST", "DELETE"] }));

// parse body params and attach them to res.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse form-data params and attach them to res.files && [req.fields]
app.use(expressFormData.parse({ autoClean: false }));

app.set("trust proxy", 1);

// express context middleware
app.use(httpContext.middleware);

// enable detailed API logging in dev env
if (config.NODE_ENV === "development") {
  app.use(logger("dev"));
}

// all API versions are mounted here within the app
app.use("/api/v1", routes);

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

// if error is not an instanceOf APIError, convert it.
app.use(ErrorService.converter);

// catch 404 and forward to error handler
app.use(ErrorService.notFound);

// error handler, send stacktrace only during development
app.use(ErrorService.handler);

// opens a port if the NODE_ENV environment is not test
if (config.NODE_ENV !== "test") {
  server.listen(config.PORT, () =>
    console.info(
      `local server started on port http://localhost:${config.PORT} (${config.NODE_ENV})`
    )
  );
}
