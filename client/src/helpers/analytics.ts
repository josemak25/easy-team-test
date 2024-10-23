import {AxiosResponse, InternalAxiosRequestConfig} from 'axios';

export const startNetworkPerformanceEvent = async (
  config: InternalAxiosRequestConfig<any>,
  _user_id: string = `guest_user_${Date.now()}`,
) => {
  // Define the network metric
  // Example:::: const httpMetric = perf().newHttpMetric(config.url, config.method);
  // Start the metric
  // httpMetric.putAttribute('user_id', user_id);
  // Example:::: await httpMetric.start();
};

export const stoptNetworkPerformanceEvent = async (
  _response: AxiosResponse<any, any>,
) => {
  // Get httpMetric from the network context
  // Example:::: const { httpMetric } = response.config.metadata;
  // Stop the metric
  // Example:::: await httpMetric.stop();
};

export function withAnalyticEvent(
  eventName: string,
  effect: (...args: any) => any,
  _metadata: {[key: string]: any} = {},
) {
  return ((...args) => {
    effect(...args);
    // Log our analytics data here,
    // Example:::: analytics().logEvent(eventName, {...metadata, ...args});
  }) as typeof effect;
}

export function withCrashlyticsEvent(
  eventName: string,
  effect: (...args: any) => any,
  {}: // user_id = `guest_user_${Date.now()}`,
  // ...metadata
  {user_id?: string; [key: string]: any},
) {
  return ((...args) => {
    effect(...args);
    // Log our crashlytics data here
    // Example:::: crashlytics().log(eventName);
    // Example:::: crashlytics().setUserId(user_id);
    // Example:::: crashlytics().setAttributes({...metadata, ...args});
  }) as typeof effect;
}
