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

/**
 * User Controller Interface
 */
export abstract class UserControllerInterface {
  /**
   * @async
   * @method update
   * @param {object} req
   * @param {object} res
   * @returns {ExpressResponseInterface}
   * @memberof UserControllerInterface
   */
  public static update: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;

  /**
   * @async
   * @method get
   * @param {object} req
   * @param {object} res
   * @returns {ExpressResponseInterface}
   * @memberof UserControllerInterface
   */
  public static get: (req: Request, res: Response, next: NextFunction) => ExpressResponseInterface;

  /**
   * @async
   * @method delete
   * @param {object} req
   * @param {object} res
   * @returns {ExpressResponseInterface}
   * @memberof UserControllerInterface
   */
  public static delete: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;
}
