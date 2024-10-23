import {BASE_API_URL} from '@env';
import axios, {AxiosError} from 'axios';
import {APP_VERSION} from '../constants';
import {
  reportError,
  stoptNetworkPerformanceEvent,
  startNetworkPerformanceEvent,
} from '../helpers';
import {getUserSession} from '../providers/session';

// Set config defaults when creating the instance
export const network = axios.create({
  baseURL: `${BASE_API_URL}/api/v1`,
  headers: {'App-Version': APP_VERSION},
});

// Add a request interceptor
network.interceptors.request.use(
  async config => {
    try {
      // get the JWT token out of it
      const session = await getUserSession();
      config.headers.setAuthorization(
        session?.access_token ? `Bearer ${session?.access_token}` : null,
      );
      await startNetworkPerformanceEvent(config, session?.user?.id);
    } finally {
      return config;
    }
  },
  (error: AxiosError) => {
    reportError(error?.response?.data as Error);
    return Promise.reject(error?.response?.data as Error);
  },
);

// Add a response interceptor
network.interceptors.response.use(
  async response => {
    try {
      await stoptNetworkPerformanceEvent(response);
    } finally {
      return response;
    }
  },
  async (error: AxiosError) => {
    const response = error.response;

    try {
      await stoptNetworkPerformanceEvent(response!);
    } finally {
      reportError(response?.data as Error);
      return Promise.reject(response?.data as Error);
    }
  },
);
