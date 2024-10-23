import _ from "lodash";
import httpStatus from "http-status";
import * as Sentry from "@sentry/node";
import { isCelebrateError } from "celebrate";
import { JsonWebTokenError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ValidationError as JoiValidationError } from "joi";

import config from "@app/config";
import APIError from "@app/helpers/api.errors";
import { ErrorServiceInterface } from "typings/error";
import { joiErrorFormatter } from "@app/helpers/joi_error_formatter";
import { ErrorResponseInterface, ExpressErrorInterface } from "typings/config";

/**
 *
 * @class ErrorService
 * @classdesc Class representing the error service
 * @description App error service class
 * @name ErrorService
 * @exports ErrorServiceInterface
 */

export default class ErrorService extends ErrorServiceInterface {
  /**
   * @method handler
   * @description app error handler
   * @param {ExpressErrorInterface} error - ExpressErrorInterface object
   * @param {Request} _req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} _next - HTTP NextFunction function
   * @returns {void}
   * @memberof ErrorService
   */

  public static handler = (
    error: ExpressErrorInterface,
    _req: Request,
    res: Response,
    _next?: NextFunction
  ): void => {
    const response: ErrorResponseInterface = {
      payload: null,
      stack: error.stack,
      error: error.errors,
      status: error.status,
      errorData: error.errorData,
      message: error.message || String(httpStatus[error.status as keyof typeof httpStatus]),
    };

    if (config.env !== "development") {
      delete response?.stack;
    }

    ErrorService.reportError(response);
    res.status(response.status).json(_.pick(response, ["payload", "message", "status"]));
  };

  /**
   * @method converter
   * @description converter all app errors
   * @param {ExpressErrorInterface} error - ExpressErrorInterface object
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} _next - HTTP NextFunction function
   * @returns {void}
   * @memberof ErrorService
   */

  public static converter = (
    error: ExpressErrorInterface,
    req: Request,
    res: Response,
    _next: NextFunction
  ): void => {
    let convertedError: Error = error;

    if (isCelebrateError(error)) {
      convertedError = new APIError({
        status: httpStatus.BAD_REQUEST,
        message: JSON.stringify(
          joiErrorFormatter(error.details as unknown as Map<string, JoiValidationError>)
        ),
      });
    }

    if (error instanceof JsonWebTokenError) {
      convertedError = new APIError({ message: error.message, status: httpStatus.UNAUTHORIZED });
    }

    if (!(convertedError instanceof APIError)) {
      convertedError = new APIError({
        message: error.message,
        status: error.status,
        stack: error.stack,
      });
    }

    return ErrorService.handler(convertedError as unknown as ExpressErrorInterface, req, res);
  };

  /**
   * @method converter
   * @description catch app 404 errors
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @returns {void}
   * @memberof ErrorService
   */

  public static notFound = (req: Request, res: Response): void => {
    const error = new APIError({
      message: "Not found",
      status: httpStatus.NOT_FOUND,
      stack: undefined,
    });

    return ErrorService.handler(error as unknown as ExpressErrorInterface, req, res);
  };

  /**
   * @method reportError
   * @description report api errors to our custom error service provider
   * @param {ErrorResponseInterface} error - HTTP Request object
   * @memberof ErrorService
   */

  public static reportError = (error: ErrorResponseInterface): ErrorResponseInterface => {
    // report to sentry or google crashlytics
    Sentry.captureException(error);

    return error;
  };
}
