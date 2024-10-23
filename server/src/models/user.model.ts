import dayjs from "dayjs";
import omit from "lodash/omit";
import { faker } from "@faker-js/faker";
import { CallbackError, Schema, model } from "mongoose";

import config from "@app/config";
import SessionModel from "./session.models";
import * as EmailTemplate from "@app/template";
import AuthService from "@app/services/auth.service";
import EmailService from "@app/services/email.service";
import { generateOTP } from "@app/helpers/generate_otp";
import BcryptService from "@app/services/bcrypt.service";
import { Role, UserInterface, UserSessionInterface, UserDocumentInterface } from "typings/user";

const UserSchema = new Schema<UserDocumentInterface>(
  {
    password: {
      minlength: 6,
      required: true,
      type: Schema.Types.String,
    },

    email_address: {
      trim: true,
      minlength: 1,
      maxlength: 255,
      lowercase: true,
      type: Schema.Types.String,
    },

    avatar: {
      trim: true,
      type: Schema.Types.String,
      default: config.DEFAULT_USER_AVATAR,
    },

    is_global_time_tracking_enabled: {
      default: false,
      type: Schema.Types.Boolean,
    },

    payroll_id: {
      trim: true,
      type: Schema.Types.String,
    },

    organization_id: {
      trim: true,
      type: Schema.Types.String,
    },

    employer_payroll_id: {
      trim: true,
      type: Schema.Types.String,
    },

    role: {
      trim: true,
      default: Role.USER,
      type: Schema.Types.String,
      enum: [Role.ADMIN, Role.USER],
    },

    is_verified: { type: Schema.Types.Boolean, default: false },

    location_id: { type: Schema.Types.ObjectId, ref: "location", required: true },
  },

  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

/**
 * pre-save hooks
 */
UserSchema.pre("save", async function (next) {
  const { password } = this.toObject();

  try {
    const encrypted_password = await BcryptService.hashPassword(password);

    this.password = encrypted_password;
    this.payroll_id = faker.string.uuid();
    this.organization_id = faker.string.uuid();
    this.employer_payroll_id = faker.string.uuid();

    next();
  } catch (error: any) {
    next(error as CallbackError);
  }
});

/**
 * pre-update hooks
 */
UserSchema.pre("findOneAndUpdate", async function (next) {
  const update = { ...this.getUpdate() } as UserDocumentInterface;

  // If update does not contain password then return
  if (!update.password) return next();

  try {
    update.password = await BcryptService.hashPassword(update.password);
    this.setUpdate(update as any);

    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

/**
 * methods
 */
UserSchema.methods = {
  isPasswordCorrect(password: string): boolean {
    const { password: userPassword } = this.toObject();
    return BcryptService.comparePassword(password, userPassword);
  },

  async sendEmailOTP() {
    const user = this.toJSON() as unknown as UserInterface;
    const code = config.IS_PRODUCTION_OR_STAGING ? generateOTP() : config.DEFAULT_OTP_CODE;

    await SessionModel.findOneAndUpdate({ user_id: user.id }, { otp: { code } }, { upsert: true });

    EmailService.sendMail({
      to: user.email_address,
      subject: "Verify your account",
      html: EmailTemplate.signupMessageTemplate({ otp_code: String(code) }),
    });
  },

  async getSession(): Promise<UserSessionInterface> {
    const user = this.toJSON() as unknown as UserInterface;

    const [access_token, refresh_token] = await Promise.all([
      AuthService.issueAccessToken(user),
      AuthService.issueRefreshToken(user),
    ]);

    const date = dayjs();
    const issued_at = date.unix(); // convert to unix timestamp
    const [token_expiry, unit] = config.ACCESS_TOKEN_EXPIRY.split(/(\d+)/).filter((e: string) => e); // Matching for the numbers
    const expires_in = date.add(Number(token_expiry), unit as dayjs.ManipulateType).unix(); // convert to unix timestamp;
    const expires_at = dayjs(expires_in * 1000).toISOString();

    return {
      issued_at,
      expires_at,
      expires_in,
      access_token,
      refresh_token,
      user: { ...user, unread_notification_count: 0 },
    };
  },

  toJSON() {
    const { _id: id, ...rest } = omit(this.toObject(), ["__v", "role", "password", "is_verified"]);
    return { ...rest, id: String(id) };
  },
};

export default model<UserDocumentInterface>("user", UserSchema);
