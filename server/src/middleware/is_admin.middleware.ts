import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";

import { Role } from "typings/user";
import APIError from "@app/helpers/api.errors";
import { useSession } from "@app/helpers/use_session";

/**
 * Function representing the Authorization check for app admins
 * @function isAdmin
 * @description Authenticate admins middleware
 * @param {Request} _req - HTTP Request object
 * @param {Response} _res - HTTP Response object
 * @param {NextFunction} next - HTTP NextFunction function
 * @returns {void | Response<any, Record<string, any>>} {void | Response<any, Record<string, any>>} Response object containing an error due to invalid privileges or no valid super access credentials in the request
 */

export default function isAdmin(
  _req: Request,
  _res: Response,
  next: NextFunction
): void | Response<any, Record<string, any>> {
  try {
    const { role } = useSession();

    if (role !== Role.ADMIN) {
      throw new APIError({
        status: httpStatus.UNAUTHORIZED,
        message: "You are not Authorized to perform this operation!",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}
