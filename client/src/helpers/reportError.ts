/**
 *
 * @description Reports any thrown error to our error service example Sentry.
 * @function reportError
 * @property Error
 * @property stackTrace
 * @returns void
 */

export const reportError = (error: Error | string): void => {
  // Report error to external service like sentry or firebase crashlytics

  if (__DEV__) {
    console.error('Reported Error to our external service:', error);
  }
};
