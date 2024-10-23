# Easyteam Server

## What is Easyteam?

Evarfinance is the partner that drives seamless payments around the world by making transactions with cryptocurrency easy.
With Evarfinance you can scale your business across borders and receive international payments seamlessly in cryptocurrency.

- authentication via [JWT](https://jwt.io/)
- database is [Mongodb](https://www.mongodb.com/docs/atlas/)
- application environments are `development`, `testing`, `staging`, and `production`
- linting via [eslint](https://github.com/eslint/eslint) and [prettier](https://prettier.io/)
- integration tests running with [Jest](https://github.com/facebook/jest)
- built with [node scripts](#npm-scripts)

## Table of Contents

- [Install & Start](#install-and-start)
- [Folder Structure](#folder-structure)
- [Controllers](#controllers)
  - [Create a controller](#create-a-controller)
- [Models](#models)
  - [Create a model](#create-a-model)
- [Policies](#policies)
  - [auth.policy](#authpolicy)
- [Services](#services)
- [Config](#config)
  - [connection and database](#connection-and-database)
- [Routes](#routes)
  - [Create routes](#create-routes)
- [Test](#test)
  - [setup](#setup)
- [npm scripts](#npm-scripts)

## Install and Start

#### clone

```sh
# Start by cloning this repository

# Clone with HTTPS
$ git clone https://github.com/josemak25/easy-team-test.git

# Clone with SSH
$ git clone git@github.com:josemak25/easy-team-test.git
```

#### Create environment variable

First, you will need to create **.env** file.

```bash
PORT = 9999
BCRYPT_ROUND = 10
NODE_ENV = development
ACCESS_TOKEN_EXPIRY = 30d

# SENTRY
SENTRY_DSN = https://b10774149d66582741032a6a406e34e5@o4506600339668992.ingest.sentry.io/4506715746112543
SENTRY_AUTH_TOKEN = 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

# EASY TEAM
EASY_TEAM_PARTNER_ID = d40e2f92-2523-4833-a9cc-a95cef576876
```

#### install

```sh
# Start the app by installing all dependencies

# cd into project root run the this command to install all dependencies
$ yarn

# start the development build
$ yarn dev

# start the staging build
$ yarn staging

# start the production build
$ yarn start
```

## Folder Structure

This project has 11 main directories:

- config - for database, errors and environment variables.
- controllers - for api controllers.
- helpers - this is the directory for all helper methods you can as well call it your `utils` folder
- middlewares - this is the directory for all app api related [middlewares](http://expressjs.com/en/guide/writing-middleware.html#writing-middleware-for-use-in-express-apps)
- models - this is the directory for all database [models](https://mongoosejs.com/docs/models.html)
- policies - this directory handles all api based policies example of this is the authentication and authorization policy.
- routes - this directory handles all api [routes](https://expressjs.com/en/guide/routing.html)
- services - this is the directory for all api based services example of this is an email, auth services etc.
- validations - this is the directory for all api request [validations](https://github.com/arb/celebrate)
- templates - this is the directory for all app templates like email sms etc

## Controllers

### Create a Controller

Controllers in this project have a naming convention: `model_name.controller.ts` and uses class based pattern.
To use a model inside of your controller you have to import it.
We use [Mongoose](https://mongoosejs.com/) to define our Models, if you want further information read the [Docs](https://mongoosejs.com/docs/guide.html).

Example Controller for user `signin` and `signup` operation:

```ts
import _ from "lodash";
import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";

import { UserInterface } from "typings/user";
import APIError from "@app/helpers/api.errors";
import UserModel from "@app/models/user.model";
import { useSession } from "@app/helpers/use_session";
import SessionModel from "@app/models/session.models";
import LocationModel from "@app/models/location.model";
import { AuthControllerInterface } from "typings/auth";
import { sendResponse } from "@app/helpers/send_response";
import { ExpressResponseInterface } from "typings/helpers";

/**
 *
 * @class
 * @extends AuthControllerInterface
 * @classdesc Class representing the authentication controller
 * @description App authentication controller
 * @name AuthController
 *
 */
export default class AuthController extends AuthControllerInterface {
  /**
   * Route: POST: /auth/signup
   * @async
   * @method signup
   * @description signup to user account
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof AuthController
   */

  public static async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const userExists = await UserModel.findOne({ ..._.pick(req.body, "email_address") });

      if (userExists) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: "Account already registered with us",
        });
      }

      // Get a random location on user signup
      const location = await LocationModel.getRandomLocation();

      await UserModel.create({ ...req.body, location_id: location._id });

      return res
        .status(httpStatus.CREATED)
        .json(sendResponse({ message: "success", status: httpStatus.CREATED }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: POST: /auth/signin
   * @async
   * @method signin
   * @description signin to user account
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof AuthController
   */

  public static async signin(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const user = await UserModel.findOne({
        // is_verified: true, TODO: implement otp on signup to verify accounts
        ..._.pick(req.body, "email_address"),
      }).orFail(
        new APIError({
          status: httpStatus.BAD_REQUEST,
          message: "Invalid login credentials",
        })
      );

      const isPasswordCorrect = user.isPasswordCorrect(req.body.password);

      if (!isPasswordCorrect) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: "Invalid login credentials",
        });
      }

      const session = await user.getSession();

      await SessionModel.findOneAndUpdate(
        { user_id: user._id },
        { ..._.pick(session, ["refresh_token", "access_token"]) }
      );

      return res
        .status(httpStatus.OK)
        .json(sendResponse({ payload: session, status: httpStatus.OK, message: "successful" }));
    } catch (error) {
      next(error);
    }
  }
}
```

## Models

Models in this project have a naming convention: `model_name.model.ts` and uses [Mongoose](https://mongoosejs.com/) to define our Models, if you want further information read the [Docs](https://mongoosejs.com/docs/guide.html).

Example user model:

### Create typings for the user Model

```ts
import { JwtPayload } from "jsonwebtoken";
import { Document, ObjectId } from "mongoose";
import { Request, Response, NextFunction } from "express";

import { ExpressResponseInterface } from "./helpers";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface UserInterface {
  role: Role;
  id: string;
  avatar: string;
  password: string;
  updated_at: Date;
  created_at: Date;
  payroll_id: string;
  location_id: string;
  is_verified: boolean;
  email_address: string;
  organization_id: string;
  employer_payroll_id: string;
  unread_notification_count?: number;
  is_global_time_tracking_enabled: boolean;
}

export interface UserSessionInterface {
  access_token: string;
  /**
   * A timestamp of when the token was issued. Returned when a login is confirmed.
   */
  issued_at: number;
  /**
   * The number of seconds until the token expires (since it was issued). Returned when a login is confirmed.
   */
  expires_in: number;
  /**
   * A timestamp of when the token will expire. Returned when a login is confirmed.
   */
  expires_at: string;
  refresh_token: string;
  user: Partial<UserInterface> | null;
}

export interface UserTokenType extends Omit<JwtPayload, "aud">, UserInterface {
  aud: ObjectId;
}

export interface UserDocumentInterface extends Omit<UserInterface, "id" | "location_id">, Document {
  _id: ObjectId;
  location_id: ObjectId;
  sendEmailOTP: () => Promise<void>;
  getSession: () => Promise<UserSessionInterface>;
  isPasswordCorrect: (password: string) => boolean;
}
```

### Create merchant Model

```ts
const UserSchema = new Schema<UserDocumentInterface>(
  {
    password: {
      minlength: 6,
      required: true,
      type: Schema.Types.String,
    },

    email_address: {
      trim: true,
      minlength: 1,
      maxlength: 255,
      lowercase: true,
      type: Schema.Types.String,
    },

    avatar: {
      trim: true,
      type: Schema.Types.String,
      default: config.DEFAULT_USER_AVATAR,
    },

    is_global_time_tracking_enabled: {
      default: false,
      type: Schema.Types.Boolean,
    },

    payroll_id: {
      trim: true,
      type: Schema.Types.String,
    },

    organization_id: {
      trim: true,
      type: Schema.Types.String,
    },

    employer_payroll_id: {
      trim: true,
      type: Schema.Types.String,
    },

    role: {
      trim: true,
      default: Role.USER,
      type: Schema.Types.String,
      enum: [Role.ADMIN, Role.USER],
    },

    is_verified: { type: Schema.Types.Boolean, default: false },

    location_id: { type: Schema.Types.ObjectId, ref: "location", required: true },
  },

  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

/**
 * pre-save hooks
 */
UserSchema.pre("save", async function (next) {
  const { password } = this.toObject();

  try {
    const encrypted_password = await BcryptService.hashPassword(password);
    this.password = encrypted_password;

    next();
  } catch (error: any) {
    next(error as CallbackError);
  }
});

/**
 * pre-update hooks
 */
UserSchema.pre("findOneAndUpdate", async function (next) {
  const update = { ...this.getUpdate() } as UserDocumentInterface;

  // If update does not contain password then return
  if (!update.password) return next();

  try {
    update.password = await BcryptService.hashPassword(update.password);
    this.setUpdate(update as any);

    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

/**
 * methods
 */
UserSchema.methods = {
  isPasswordCorrect(password: string): boolean {
    const { password: userPassword } = this.toObject();
    return BcryptService.comparePassword(password, userPassword);
  },

  async getSession(): Promise<UserSessionInterface> {
    const user = this.toJSON() as unknown as UserInterface;

    const [access_token, refresh_token] = await Promise.all([
      AuthService.issueAccessToken(user),
      AuthService.issueRefreshToken(user),
    ]);

    const date = dayjs();
    const issued_at = date.unix(); // convert to unix timestamp
    const [token_expiry, unit] = config.ACCESS_TOKEN_EXPIRY.split(/(\d+)/).filter((e: string) => e); // Matching for the numbers
    const expires_in = date.add(Number(token_expiry), unit as dayjs.ManipulateType).unix(); // convert to unix timestamp;
    const expires_at = dayjs(expires_in * 1000).toISOString();

    return {
      issued_at,
      expires_at,
      expires_in,
      access_token,
      refresh_token,
      user: { ...user, unread_notification_count: 0 },
    };
  },

  toJSON() {
    const { _id: id, ...rest } = omit(this.toObject(), ["__v", "role", "password", "is_verified"]);
    return { ...rest, id: String(id) };
  },
};

export default model<UserDocumentInterface>("user", UserSchema);
```

## Policies

Policies are middleware functions that can run before hitting a specific or more specified route(s).

Example policy:

> Note: This Middleware only allows the user to the next route if the user is authorized.

## auth.policy

The `auth.policy` checks wether a `JSON Web Token` ([further information](https://jwt.io/)) is send in the header of an request as `Authorization: Bearer [JSON Web Token]` or inside of the body of an request as `token: [JSON Web Token]`.
The policy runs default on all api routes that are are `private`.

```ts
import APIError from "../helpers/api_errors";
import sendResponse from "../helpers/response";
import SessionModel from "../models/session.model";
import authService from "../services/auth.service";
import { AuthPolicyInterface } from "../../typings/policies";
import { ExpressResponseInterface } from "../../typings/helpers";
import { SessionInterface, MerchantTokenType } from "../../typings/merchant";

/**
 *
 * @class
 * @extends AuthPolicyInterface
 * @classdesc Authenticate users, admins and super admins middleware
 * @description App authentication policy controller
 * @name AuthController
 *
 */

export default class AuthPolicy extends AuthPolicyInterface {
  /**
   * Function representing the Authorization check for authenticated users
   * @method hasAccessToken
   * @description Authenticate users, admins and super admins middleware who has valid access_token
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction function
   * @returns {ExpressResponseInterface} {ExpressResponseInterface} Returns the Response object containing token field with the verified token assigned to the user
   * @memberof AuthPolicyInterface
   */
  static async hasAccessToken(
    req: Request,
    res: Response,
    next?: NextFunction
  ): ExpressResponseInterface {
    const [bearer, signature] = req?.header("Authorization")?.split(" ") || [];
    if (signature && bearer === "Bearer") {
      try {
        const token = await authService.verifyAccessToken(signature);
        req.token = token as unknown as MerchantTokenType;
        return next?.();
      } catch (error) {
        const message = `${error instanceof TokenExpiredError ? "Expired" : "Invalid"} token`;
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json(sendResponse({ message, status: httpStatus.UNAUTHORIZED }));
      }
    }

    return res
      .status(httpStatus.UNAUTHORIZED)
      .json(sendResponse({ message: "No Token found", status: httpStatus.UNAUTHORIZED }));
  }

  /**
   * Function representing the Authorization token refresher for unauthorized users
   * @method hasRefreshToken
   * @description Refresh users, admins and super admins access_token middleware
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction function
   * @returns {ExpressResponseInterface} {ExpressResponseInterface} Returns the Response object containing token field with the refreshed token assigned to the user
   * @memberof AuthPolicyInterface
   */
  static async hasRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    const { refresh_token }: Pick<SessionInterface, "refresh_token"> = req.body;
    try {
      const token = await authService.verifyRefreshToken(refresh_token);
      const session = await SessionModel.findOne({ user_id: token?.aud!! as unknown as ObjectId });

      if (!session || refresh_token !== session?.refresh_token) {
        throw new APIError({ message: "Invalid Token", status: httpStatus.UNAUTHORIZED });
      }

      req.token = token as unknown as MerchantTokenType;
      return next();
    } catch (error) {
      const message = `${error instanceof TokenExpiredError ? "Expired" : "Invalid"} token`;
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json(sendResponse({ message, status: httpStatus.UNAUTHORIZED }));
    }
  }
}
```

To use this policy on all routes that only authorized users are allowed:

index.ts file inside the route folder

```ts
import { Router } from "express";
import AuthPolicy from "@app/policies/auth.policy";
import AuthController from "@app/controllers/auth.controller";

const router = Router();

/**
 * Check user refresh_token and refresh user access_token to perform HTTPS requests
 * @description Validate the request, check if user has a valid refresh_token and is authorized to perform this request
 */

router.use(AuthPolicy.hasAccessToken);

router.route("/signout").post(AuthController.signout);

router.route("/refresh-token").post(AuthController.refreshToken);

export default router;
```

## Services

Services are little useful snippets, or calls to another API that are not the main focus of your API.

Example service:

encrypting and decrypting user password on signup and signin:

```ts
import bcrypt from "bcryptjs";
import config from "@app/config";
import { BcryptServiceInterface } from "typings/services";

/**
 *
 * @class BcryptService
 * @extends BcryptServiceInterface
 * @classdesc Class representing user password encryption and decryption service
 * @description User password encryption and decryption service class
 * @name ErrorService
 * @exports BcryptServiceInterface
 */

export default class BcryptService extends BcryptServiceInterface {
  /**
   * @method hashPassword
   * @param {string} password - user registration password
   * @returns {Promise<string>} Returns the signed encrypted user password
   */
  public static hashPassword = async (password: string): Promise<string> => {
    const salt = bcrypt.genSaltSync(Number(config.BCRYPT_ROUND));
    return bcrypt.hash(password, salt);
  };

  /**
   * @method comparePassword
   * @param {string} password - user registered password
   * @param {string} hash - user encrypted registration password
   * @returns {boolean} Returns boolean if the both the registration password and encrypted password matches after decrypting it
   */
  public static comparePassword = (password: string, hash: string): boolean => {
    return bcrypt.compareSync(password, hash);
  };
}
```

## Config

Holds all the server configurations.

### Connection and Database

> Note: make sure your mongodb connection url is added to the .env file.

This two files are the way to establish a connection to a database.

You only need to touch database.ts, point the `DATA_BASE_URL` to your url.

To start the DB, add the credentials for your work environment `production | development | testing`. on a `.env` file.

```ts
import mongoose from "mongoose";
import httpStatus from "http-status";

import config from "./index";
import ErrorService from "@app/services/error.service";

// connect to mongo database
export const connect = () => {
  mongoose.set("strictQuery", true);

  mongoose
    .connect(config.DATA_BASE_URL)
    .then(() => {
      console.info(
        `successfully connected to mongo database ${config.DATA_BASE_URL.substring(0, 24)}`
      );
    })
    .catch((error) => {
      ErrorService.reportError({
        error,
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: `unable to connect to database: ${config.DATA_BASE_URL.substring(0, 24)}`,
      });
    });
};

// report mongoose disconnect log
mongoose.connection.on("disconnected", (error) => {
  ErrorService.reportError({
    error,
    status: httpStatus.INTERNAL_SERVER_ERROR,
    message: `disconnected from database: ${config.DATA_BASE_URL.substring(0, 24)}`,
  });
});
```

## Routes

Here you define all your routes for your api. It doesn't matter how you structure them. By default they are mapped on `authenticated routes` and `non-authenticated routes`. You can define as much routes files as you want e.g. for every model or for specific use cases, e.g. normal user and admins.

### Create Routes

For further information read the [docs](https://expressjs.com/en/guide/routing.html) of express routing.

Example for authentication routes when users signin or signup:

> Note: The only supported Methods are **POST**, **GET**, **PUT**, and **DELETE**.

```ts
/* ************************************************************************************** *
 * ******************************                           ***************************** *
 * ******************************         AUTH ROUTES       ***************************** *
 * ******************************                           ***************************** *
 * ************************************************************************************** */

import { Router } from "express";
import { celebrate as validate } from "celebrate";

import AuthPolicy from "@app/policies/auth.policy";
import AuthValidation from "@app/validations/auth.validation";
import AuthController from "@app/controllers/auth.controller";

const router = Router();

router
  .route("/signin")
  .post([validate(AuthValidation.signin, { abortEarly: false })], AuthController.signin);

router
  .route("/signup")
  .post([validate(AuthValidation.signin, { abortEarly: false })], AuthController.signup);

router
  .route("/verify-otp")
  .post([validate(AuthValidation.verifyOtp, { abortEarly: false })], AuthController.verifyOtp);
```

To use these routes in the application, require them in the router index.ts and export the base router.

```ts
import httpStatus from "http-status";
import { Request, Response, Router } from "express";

import config from "@app/config";
import authRoute from "@app/routes/auth.routes";
import AuthPolicy from "@app/policies/auth.policy";

const router = Router();

/** GET /health-check - Check service health */
router.get("/health-check", (_req: Request, res: Response) =>
  res.status(httpStatus.OK).json({ check: `${config.APP_NAME} server started ok*-*` })
);

// mount Auth routes
router.use("/auth", authRoute);

export default router;
```

```ts
// index.ts
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
```

## Test

All test for this project uses [Jest](https://github.com/facebook/jest) and [supertest](https://github.com/visionmedia/superagent) for integration testing. So read their docs on further information.

### setup

```ts
// jest.config.js

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePaths: ["<rootDir>"],
  testPathIgnorePatterns: ["/node_modules/"],
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["js", "json", "ts", "node"],
  transformIgnorePatterns: ["/node_modules/(?!(DEPENDENCY_NAME)/)"],
  globals: {
    "ts-jest": {
      isolatedModules: true,
      tsconfig: "tsconfig.json",
      allowSyntheticDefaultImports: true,
    },
  },
};
```

## LICENSE

MIT © Evarfinance
