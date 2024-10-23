import httpStatus from "http-status";
import { FilterQuery } from "mongoose";
import { TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import UserModel from "@app/models/user.model";
import { SessionInterface } from "typings/session";
import AuthService from "@app/services/auth.service";
import { UserDocumentInterface } from "typings/user";
import { useSession } from "@app/helpers/use_session";
import SessionModel from "@app/models/session.models";
import { AuthPolicyInterface } from "typings/policies";
import { sendResponse } from "@app/helpers/send_response";
import { ExpressResponseInterface } from "typings/helpers";

const userFilter: FilterQuery<UserDocumentInterface> = { is_verified: true };

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
    const access_token = req?.header("Authorization");
    const [bearer, signature] = access_token?.split(" ") || [];

    if (signature && bearer === "Bearer") {
      try {
        const token = await AuthService.verifyAccessToken(signature);

        const filter: FilterQuery<UserDocumentInterface> = { ...userFilter, _id: token?.aud };

        const user = await UserModel.findOne(filter).orFail(Error("Invalid Token"));

        const session = await SessionModel.findOne({ access_token, user_id: token?.aud }).orFail(
          Error("Invalid Token")
        );

        const { setSession } = useSession();

        setSession({
          session,
          ...token,
          ...session?.toJSON(),
          ...user.toJSON(),
          user,
        });

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
   * @description Refresh users access_token middleware
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
      const token = await AuthService.verifyRefreshToken(refresh_token);

      const filter: FilterQuery<UserDocumentInterface> = { ...userFilter, _id: token?.aud };

      const user = await UserModel.findOne(filter).orFail(Error("Invalid Token"));

      const session = await SessionModel.findOne({
        user_id: token?.aud,
        refresh_token: { $ne: null },
      }).orFail(Error("Invalid Token"));

      if (refresh_token !== session?.refresh_token) {
        throw new Error("Invalid Token");
      }

      const { setSession } = useSession();
      setSession({ ...token, ...session?.toJSON(), ...user.toJSON(), user });

      return next();
    } catch (error) {
      const message = `${error instanceof TokenExpiredError ? "Expired" : "Invalid"} token`;
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json(sendResponse({ message, status: httpStatus.UNAUTHORIZED }));
    }
  }
}
