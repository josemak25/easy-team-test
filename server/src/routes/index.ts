import httpStatus from "http-status";
import { Request, Response, Router } from "express";

import config from "@app/config";
import authRoute from "@app/routes/auth.routes";
import AuthPolicy from "@app/policies/auth.policy";

const router = Router();

/** GET /health-check - Check service health */
router.get("/health-check", (_req: Request, res: Response) =>
  res.status(httpStatus.OK).json({ check: `${config.APP_NAME} server started ok*-*` })
);

// mount Auth routes
router.use("/auth", authRoute);

/**
 * Check user access_token and authenticate user to perform HTTP requests
 * @description Validate the request, check if user is signed in and is authorized to perform this request
 */
router.use(AuthPolicy.hasAccessToken);

export default router;
