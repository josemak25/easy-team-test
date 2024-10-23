import pick from 'lodash/pick';
import noop from 'lodash/noop';
import {useMutation} from '@tanstack/react-query';

import {network} from '../config';
import {useSession} from '../providers/session';
import {BasicResponseInterface} from '../../typings/global';
import {withAnalyticEvent, withCrashlyticsEvent} from '../helpers';
import {AuthUserInterface, UserSessionInterface} from '../../typings/user';

const signInUser = async (payload: AuthUserInterface) => {
  const {data} = await network.post<
    BasicResponseInterface<UserSessionInterface>
  >('/auth/signin', payload);

  return data.payload;
};

const signUpUser = async (payload: AuthUserInterface) => {
  const {data} = await network.post<
    BasicResponseInterface<UserSessionInterface>
  >('/auth/signup', payload);

  return data.payload;
};

const refreshAccessToken = async (
  payload: Pick<UserSessionInterface, 'refresh_token'>,
) => {
  const {data} = await network.post<
    BasicResponseInterface<UserSessionInterface>
  >('/auth/refresh-token', payload);

  return data.payload;
};

const logoutUser = async () => {
  const {data} = await network.post<BasicResponseInterface>('/auth/signout');

  return data.payload;
};

export const useSignUpMutation = () => {
  const sigInSuccessEvent = (
    _: UserSessionInterface,
    variables: AuthUserInterface,
  ) => {
    const eventCallback = withCrashlyticsEvent(
      'user_signed_up',
      noop,
      pick(variables, 'email_address'),
    );

    eventCallback(variables);
  };

  return useMutation({
    mutationFn: signUpUser,
    onSuccess: sigInSuccessEvent,
  });
};

export const useSignInMutation = () => {
  const {updateSession} = useSession();

  const sigInSuccessEvent = (session: UserSessionInterface) => {
    const eventCallback = withCrashlyticsEvent('user_signed_in', noop, {
      user_id: session.user?.id,
      ...pick(session.user, ['id', 'avatar', 'email_address']),
    });

    updateSession(session);
    eventCallback(session);
  };

  return useMutation({
    mutationFn: signInUser,
    onSuccess: sigInSuccessEvent,
  });
};

export const useLogoutMutation = () => {
  const {updateSession} = useSession();

  const logoutEvent = withAnalyticEvent('logout_user_account', updateSession);

  return useMutation({
    mutationFn: logoutUser,
    onSettled: logoutEvent,
  });
};

export const useRefreshAccessTokenMutation = () => {
  const {refresh_token, updateSession} = useSession();

  const refreshAccessTokenEvent = withAnalyticEvent(
    'refresh_user_access_token',
    updateSession,
  );

  return useMutation({
    onSuccess: refreshAccessTokenEvent,
    mutationFn: () =>
      refreshAccessToken({refresh_token: `Bearer ${refresh_token}`}),
  });
};
