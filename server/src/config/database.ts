import mongoose from "mongoose";
import httpStatus from "http-status";

import config from "./index";
import ErrorService from "@app/services/error.service";

// connect to mongo database
export const connect = () => {
  mongoose.set("strictQuery", true);

  mongoose
    .connect(config.DATA_BASE_URL)
    .then(() => {
      console.info(
        `successfully connected to mongo database ${config.DATA_BASE_URL.substring(0, 24)}`
      );
    })
    .catch((error) => {
      ErrorService.reportError({
        error,
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: `unable to connect to database: ${config.DATA_BASE_URL.substring(0, 24)}`,
      });
    });
};

// report mongoose disconnect log
mongoose.connection.on("disconnected", (error) => {
  ErrorService.reportError({
    error,
    status: httpStatus.INTERNAL_SERVER_ERROR,
    message: `disconnected from database: ${config.DATA_BASE_URL.substring(0, 24)}`,
  });
});
