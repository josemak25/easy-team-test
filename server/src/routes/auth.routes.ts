/* ************************************************************************************** *
 * ******************************                           ***************************** *
 * ******************************         AUTH ROUTES       ***************************** *
 * ******************************                           ***************************** *
 * ************************************************************************************** */

import { Router } from "express";
import { celebrate as validate } from "celebrate";

import AuthPolicy from "@app/policies/auth.policy";
import AuthValidation from "@app/validations/auth.validation";
import AuthController from "@app/controllers/auth.controller";

const router = Router();

router
  .route("/signin")
  .post([validate(AuthValidation.signin, { abortEarly: false })], AuthController.signin);

router
  .route("/signup")
  .post([validate(AuthValidation.signin, { abortEarly: false })], AuthController.signup);

router
  .route("/verify-otp")
  .post([validate(AuthValidation.verifyOtp, { abortEarly: false })], AuthController.verifyOtp);

/**
 * Check user refresh_token and refresh user access_token to perform HTTPS requests
 * @description Validate the request, check if user has a valid refresh_token and is authorized to perform this request
 */

router.use(AuthPolicy.hasAccessToken);

router.route("/signout").post(AuthController.signout);

router.route("/refresh-token").post(AuthController.refreshToken);

export default router;
