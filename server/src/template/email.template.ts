import config from "@app/config";
import { EmailTemplateParams, emailTemplate } from "./email.form.template";

export const signupMessageTemplate = (p: Required<Pick<EmailTemplateParams, "otp_code">>) => {
  return emailTemplate({
    ...p,
    title: "Confirm your email address",
    otp_subtitle: "Verification codes expire after two hours.",
    subtitle: `Please enter this verification code to get started on ${config.APP_NAME}:`,
    body: `There’s one quick step you need to complete before creating your ${config.APP_NAME} account. Let’s make sure this is the right email address for you — please confirm this is the right address to use for your new account.`,
  });
};

export const forgotPasswordMessageTemplate = (
  p: Required<Pick<EmailTemplateParams, "otp_code">>
) => {
  return emailTemplate({
    ...p,
    title: "Reset Your Password",
    subtitle: "Enter the following verification code to reset your password:",
    otp_subtitle: `Verification codes expire after two hours. \n\n\nIf you did not request a password reset, please ignore this email.`,
    body: `We received a request to reset the password for your ${config.APP_NAME} account. Please confirm this is the right email address to use for your account.`,
  });
};
