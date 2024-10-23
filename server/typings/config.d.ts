export interface ErrorResponseInterface {
  error: string;
  stack?: string;
  status: number;
  message: string;
  payload?: object | null;
  errorData?: object | null;
}

export type PaginationQueryInterface = {
  page: number;
  limit: number;
};

export interface ExpressErrorInterface extends Error {
  errors: string;
  status: number;
  stack: string | undefined;
  errorData?: object | null;
}

export interface EnvironmentInterface extends NodeJS.ProcessEnv {
  PORT: string;
  APP_NAME: string;
  EMAIL_PORT: string;
  SENTRY_ORG: string;
  SENTRY_DSN: string;
  EMAIL_HOST: string;
  EMAIL_SERVICE: string;
  DATA_BASE_URL: string;
  EMAIL_PASSWORD: string;
  EMAIL_USERNAME: string;
  IS_PRODUCTION: boolean;
  OTP_MIN_NUMBER: number;
  OTP_MAX_NUMBER: number;
  SENTRY_PROJECT: string;
  DEBUG_DATA_BASE: string;
  DEFAULT_OTP_CODE: string;
  SENTRY_AUTH_TOKEN: string;
  DEFAULT_USER_AVATAR: string;
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRY: string;
  EASY_TEAM_PARTNER_ID: string;
  REFRESH_TOKEN_EXPIRY: string;
  REFRESH_TOKEN_SECRET: string;
  DEFAULT_PAGINATION_LIMIT: number;
  IS_PRODUCTION_OR_STAGING: boolean;
  NODE_ENV: "production" | "staging" | "development" | "test";
}
