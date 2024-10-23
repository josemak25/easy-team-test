import { Request, Response, NextFunction } from "express";

import { UserTokenType } from "./user";
import { ExpressResponseInterface } from "./helpers";

export abstract class AuthPolicyInterface {
  /**
   * @async
   * @method hasAccessToken
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {ExpressResponseInterface}
   * @memberof AuthPolicyInterface
   */
  public static hasAccessToken: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;

  /**
   * @async
   * @method hasRefreshToken
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {ExpressResponseInterface}
   * @memberof AuthPolicyInterface
   */
  public static hasRefreshToken: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;

  /**
   * @async
   * @method hasMagicLinkToken
   * @param {string} verify_token
   * @returns {UserTokenType}
   * @memberof AuthPolicyInterface
   */
  public static hasMagicLinkToken: (verify_token: string) => Promise<UserTokenType>;
}
