import fs from "node:fs";
import path from "node:path";

import config from "@app/config";

export type EmailTemplateParams = {
  body: string;
  title: string;
  subtitle?: string;
  otp_code?: string;
  otp_subtitle?: string;
};

const matchers: Record<keyof EmailTemplateParams, string> & {
  app_name: string;
  start_of_otp_code: string;
} = {
  body: "[template_body]",
  title: "[template_title]",
  subtitle: "[template_subtitle]",
  otp_code: "[template_otp_code]",
  app_name: "[template_app_name]",
  otp_subtitle: "[template_otp_subtitle]",
  start_of_otp_code: "data-otp-code=[start_of_otp_code]",
};

const DEFAULT_OTP_SUBTITLE = "Verification codes expire after two hours.";
const DEFAULT_SUBTITLE = `Please enter this verification code to get started on ${config.APP_NAME}`;

export const emailTemplate = (params: EmailTemplateParams) => {
  const template = fs.readFileSync(path.resolve("/base_template.html")).toString("utf8");

  const payload = {
    ...params,
    app_name: config.APP_NAME,
    subtitle: params?.subtitle || DEFAULT_SUBTITLE,
    otp_subtitle: params?.subtitle || DEFAULT_OTP_SUBTITLE,
  } as typeof matchers;

  let result = Object.entries(matchers).reduce((acc, [key, value]) => {
    acc = acc.replaceAll(value, payload[key as keyof EmailTemplateParams] || value);
    return acc;
  }, template);

  if (!payload?.otp_code) {
    // Construct regex dynamically for OTP code placeholder
    const otpCodeMatcher = matchers.start_of_otp_code.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`<tbody (${otpCodeMatcher})">[\\s\\S]*?<\\/tbody>`, "g");
    // Replace all occurrences with an empty string
    result = result.replace(regex, "");
  }

  return result;
};
