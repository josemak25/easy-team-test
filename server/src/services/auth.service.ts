import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

import config from "@app/config";
import { UserInterface } from "typings/user";
import { AuthServiceInterface } from "typings/auth";

/**
 *
 * @class AuthService
 * @extends AuthServiceInterface
 * @classdesc Class representing the auth service
 * @description User authentication service class
 * @name ErrorService
 * @exports AuthServiceInterface
 */

export default class AuthService extends AuthServiceInterface {
  /**
   * @method issueAccessToken
   * @param {Partial<UserInterface>} payload - user payload object
   * @returns {Promise<string>} Returns the signed encrypted user issued object as string
   */
  public static issueAccessToken = (user: Partial<UserInterface>): Promise<string> => {
    return new Promise((resolve, reject) =>
      jwt.sign(
        {
          employeeId: user.id,
          role: { name: user.role },
          payrollId: user.payroll_id,
          locationId: user.location_id,
          organizationId: user.organization_id,
          partnerId: config.EASY_TEAM_PARTNER_ID,
          employerPayrollId: user.employer_payroll_id,
          accessRole: {
            name: user.role,
            permissions: [
              "SHIFT_ADD",
              "SHIFT_READ",
              "SHIFT_WRITE",
              "LOCATION_READ",
              "LOCATION_ADMIN",
            ],
          },
        },
        config.ACCESS_TOKEN_SECRET,
        {
          audience: user.id,
          algorithm: "RS256",
          issuer: `${config.APP_NAME}.app`,
          expiresIn: config.ACCESS_TOKEN_EXPIRY,
        },
        (error, access_token) => (error ? reject(error) : resolve(access_token!))
      )
    );
  };

  /**
   * @method issueRefreshToken
   * @param {Partial<UserInterface>} payload - user payload object
   * @returns {Promise<string>} Returns the a newly signed encrypted user issued object as string
   */
  public static issueRefreshToken = (user: Partial<UserInterface>): Promise<string> => {
    return new Promise((resolve, reject) =>
      jwt.sign(
        {
          employeeld: user.id,
          role: { name: user.role },
          payrollId: user.payroll_id,
          locationId: user.location_id,
          organizationid: user.organization_id,
          partnerId: config.EASY_TEAM_PARTNER_ID,
          employerPayrollId: user.employer_payroll_id,
          accessRole: {
            name: user.role,
            permissions: [
              "SHIFT_ADD",
              "SHIFT_READ",
              "SHIFT_WRITE",
              "LOCATION_READ",
              "LOCATION_ADMIN",
            ],
          },
        },
        config.REFRESH_TOKEN_SECRET,
        {
          audience: user.id,
          algorithm: "RS256",
          issuer: `${config.APP_NAME}.app`,
          expiresIn: config.REFRESH_TOKEN_EXPIRY,
        },
        (error, refresh_token) => (error ? reject(error) : resolve(refresh_token!))
      )
    );
  };

  /**
   * @method verifyAccessToken
   * @param {string} access_token - user token issued string
   * @returns {Promise<JwtPayload | undefined>} Returns the verified decrypted user issued object
   */
  public static verifyAccessToken = (access_token: string): Promise<JwtPayload | undefined> => {
    return new Promise((resolve, reject) =>
      jwt.verify(
        access_token,
        config.ACCESS_TOKEN_SECRET,
        (error: VerifyErrors | null, decoded) => {
          error ? reject(error) : resolve(decoded as JwtPayload);
        }
      )
    );
  };

  /**
   * @method verifyRefreshToken
   * @param {string} refresh_token - user refresh token issued string
   * @returns {Promise<JwtPayload | undefined>} Returns the verified decrypted user issued object
   */
  public static verifyRefreshToken = (refresh_token: string): Promise<JwtPayload | undefined> => {
    return new Promise((resolve, reject) =>
      jwt.verify(
        refresh_token,
        config.REFRESH_TOKEN_SECRET,
        (error: VerifyErrors | null, decoded: Object | undefined) => {
          error ? reject(error) : resolve(decoded!!);
        }
      )
    );
  };
}
