import { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { UserInterface } from "./user";
import { ExpressResponseInterface } from "./helpers";

/**
 * Authentication Controller Interface
 */
export abstract class AuthControllerInterface {
  /**
   * @async
   * @method signin
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {ExpressResponseInterface}
   * @memberof AuthControllerInterface
   */
  public static signin: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;

  /**
   * @async
   * @method verifyOtp
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {ExpressResponseInterface}
   * @memberof AuthControllerInterface
   */
  public static verifyOtp: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;

  /**
   * @async
   * @method refreshToken
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {ExpressResponseInterface}
   * @memberof AuthControllerInterface
   */
  public static refreshToken: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;

  /**
   * @async
   * @method signout
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {ExpressResponseInterface}
   * @memberof AuthControllerInterface
   */
  public static signout: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;
}

/**
 * Auth Service Interface
 */

export abstract class AuthServiceInterface {
  /**
   * @method issueAccessToken
   * @param {UserInterface} payload
   * @returns {Promise<string>}
   */
  public static issueAccessToken: (payload: UserInterface) => Promise<string>;

  /**
   * @method issueRefreshToken
   * @param { UserInterface} payload
   * @returns {Promise<string>}
   */
  public static issueRefreshToken: (payload: UserInterface) => Promise<string>;

  /**
   * @method verifyAccessToken
   * @param {string} access_token
   * @returns {Promise<JwtPayload | undefined>}
   */
  public static verifyAccessToken: (access_token: string) => Promise<JwtPayload | undefined>;

  /**
   * @method verifyRefreshToken
   * @param {string} refresh_token
   * @returns {Promise<JwtPayload | undefined>}
   */
  public static verifyRefreshToken: (refresh_token: string) => Promise<JwtPayload | undefined>;
}
