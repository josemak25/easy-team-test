import { Joi, Segments } from "celebrate";
import { UserInterface } from "typings/user";
import { SessionInterface } from "typings/session";

/**
 * Object representing the Validation check for app auth HTTP requests
 * @description Validate user inputs on both POST, PUT, UPDATE and PATCH request
 */

export default {
  /**
   * @description Validate user signup inputs
   * @param {body} req - Request property object gotten from the request
   * @property {password} body.password - User password
   * @property {email_address} body.email_address - User full_name
   * @returns {Partial<UserInterface>} {Partial<UserInterface>} Returns the Request object after validating user inputs from req.body
   */
  signupUser: {
    [Segments.BODY]: Joi.object<
      Pick<UserInterface, "email_address" | "password">
    >().keys({
      password: Joi.string().trim().required(),

      email_address: Joi.string().trim().email().required(),
    }),
  },

  /**
   * @description Validate user signin inputs
   * @param {body} req - Request property object gotten from the request
   * @property {password} body.password - User password
   * @property {email_address} body.email_address - User email_address
   * @returns {Partial<UserInterface>} {Partial<UserInterface>} Returns the Request object after validating user inputs from req.body
   */
  signin: {
    [Segments.BODY]: Joi.object<Pick<UserInterface, "email_address" | "password">>().keys({
      password: Joi.string().required(),

      email_address: Joi.string().required(),
    }),
  },

  /**
   * @description Validate user forgot-password inputs
   * @param {body} req - Request property object gotten from the request
   * @property {email_address} body.email_address - User email_address
   * @returns {Partial<UserInterface>} {Partial<UserInterface>} Returns the Request object after validating user inputs from req.body
   */
  forgotPassword: {
    [Segments.BODY]: Joi.object<Pick<UserInterface, "email_address">>().keys({
      email_address: Joi.string().required(),
    }),
  },

  /**
   * @description Validate user verify otp inputs
   * @param {body} req - Request property object gotten from the request
   * @property {otp} body.otp - User otp
   * @property {email_address} body.email_address - User email_address
   * @returns {Partial<UserInterface>} {Partial<UserInterface>} Returns the Request object after validating user inputs from req.body
   */
  verifyOtp: {
    [Segments.BODY]: Joi.object<Pick<UserInterface, "email_address"> & { otp: string }>().keys({
      otp: Joi.string().required(),

      email_address: Joi.string().required(),
    }),
  },

  /**
   * @description Validate user refresh token inputs
   * @param {body} req - Request property object gotten from the request
   * @property {phone_number} body.refresh_token - User refresh token
   * @returns {Pick<SessionInterface, "refresh_token">} {Pick<SessionInterface, "refresh_token">} Returns the Request object after validating user inputs from req.body
   */
  refreshToken: {
    [Segments.BODY]: Joi.object<Pick<SessionInterface, "refresh_token">>().keys({
      refresh_token: Joi.string().required(),
    }),
  },
};
