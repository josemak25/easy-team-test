import { Joi } from "celebrate";
import { config as configEnv } from "dotenv";

import appPackage from "../../package.json";
import { EnvironmentInterface } from "typings/config";
import { getJwtKeys } from "@app/helpers/get_jwt_keys";

configEnv();

const envVarsSchema = Joi.object<EnvironmentInterface>({
  PORT: Joi.number().default(4040),

  EASY_TEAM_PARTNER_ID: Joi.string(),

  SENTRY_DSN: Joi.string().required(),

  EMAIL_PORT: Joi.number().default(587),

  EMAIL_SERVICE: Joi.string().default("gmail"),

  APP_NAME: Joi.string().default(appPackage.name),

  EMAIL_HOST: Joi.string().default("smtp.gmail.com"),

  EMAIL_PASSWORD: Joi.string().default("scwlryaenoaijvyr"),

  EMAIL_USERNAME: Joi.string().default("amakirij@gmail.com"),

  IS_PRODUCTION: Joi.boolean().when("NODE_ENV", {
    is: Joi.string().equal("production"),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false),
  }),

  NODE_ENV: Joi.string()
    .valid("development", "staging", "production", "test")
    .default("development"),

  DEBUG_DATA_BASE: Joi.boolean().when("NODE_ENV", {
    is: Joi.string().equal("development"),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false),
  }),

  OTP_MIN_NUMBER: Joi.number().default(100000),

  OTP_MAX_NUMBER: Joi.number().default(900000),

  DEFAULT_OTP_CODE: Joi.string().default("000000"),

  ACCESS_TOKEN_EXPIRY: Joi.string().default("30d"),

  REFRESH_TOKEN_EXPIRY: Joi.string().default("1yr"),

  SENTRY_ORG: Joi.string().default(appPackage.name),

  DEFAULT_PAGINATION_LIMIT: Joi.number().default(10),

  SENTRY_PROJECT: Joi.string().default(appPackage.name),

  SENTRY_AUTH_TOKEN: Joi.string().default(appPackage.name),

  ACCESS_TOKEN_SECRET: Joi.string().default(getJwtKeys().privateKey),

  REFRESH_TOKEN_SECRET: Joi.string().default(getJwtKeys().privateKey),

  DEFAULT_USER_AVATAR: Joi.string().default(
    "https://drive.google.com/uc?id=1HYgWNwKgbBjacBsMNfUgkUHsZCBp9JXi&export=download"
  ),

  IS_PRODUCTION_OR_STAGING: Joi.boolean().when("NODE_ENV", {
    is: Joi.string().equal("production", "staging"),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false),
  }),

  DATA_BASE_URL: Joi.string()
    .default(`mongodb://127.0.0.1:27017/${appPackage.name}`)
    .description("Database host name"),
})
  .unknown()
  .required();

const { error, value: envVariables } = envVarsSchema.validate(process.env, { abortEarly: false });

if (error) throw new Error(`Config validation error: ${error.message}`);

if (
  envVariables!!.NODE_ENV !== "production" &&
  envVariables!!.NODE_ENV !== "staging" &&
  envVariables!!.NODE_ENV !== "development" &&
  envVariables!!.NODE_ENV !== "test"
) {
  console.error(
    `NODE_ENV is set to ${
      envVariables!!.NODE_ENV
    }, but only production, staging, development and test environments are valid.`
  );
  process.exit(1);
}

export default envVariables as EnvironmentInterface;
