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

  /**
   * Route: POST: /auth/verify-otp
   * @async
   * @method verifyOtp
   * @description verify users otp
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof AuthController
   */

  public static async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const { otp, email_address }: UserInterface & { otp: string } = req.body;

      const user = await UserModel.findOne({
        email_address,
        is_verified: false,
      }).orFail(new APIError({ message: "Incorrect OTP", status: httpStatus.BAD_REQUEST }));

      await SessionModel.findOne({
        "otp.code": otp,
        user_id: user._id,
        "otp.expire_at": { $gte: new Date() },
      }).orFail(
        new APIError({ status: httpStatus.BAD_REQUEST, message: "Incorrect or Expired OTP" })
      );

      const session = await user.getSession();

      await SessionModel.findOneAndUpdate(
        { user_id: user._id },
        {
          otp: null,
          ..._.pick(session, ["refresh_token", "access_token"]),
        },
        { new: true }
      );

      return res
        .status(httpStatus.OK)
        .json(sendResponse({ message: "success", status: httpStatus.OK, payload: session }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: POST: /auth/refresh-token
   * @async
   * @method refreshToken
   * @description refresh user expired access token
   * @param {Request} _req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof AuthController
   */

  static async refreshToken(
    _req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const { user } = useSession();
      const session = await user.getSession();

      return res
        .status(httpStatus.OK)
        .json(sendResponse({ payload: session, message: "success", status: httpStatus.OK }));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Route: POST: /auth/signout
   * @async
   * @method signout
   * @description invalidates a user session
   * @param {Request} _req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof AuthController
   */

  static async signout(_req: Request, res: Response, next: NextFunction): ExpressResponseInterface {
    try {
      const { user_id } = useSession();

      await SessionModel.findOneAndUpdate({ user_id }, { access_token: null, refresh_token: null });

      return res
        .status(httpStatus.OK)
        .json(sendResponse({ message: "success", status: httpStatus.OK }));
    } catch (error) {
      next(error);
    }
  }
}
