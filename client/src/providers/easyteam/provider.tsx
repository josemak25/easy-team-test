import React, {PropsWithChildren} from 'react';
import {EASY_TEAM_BASE_URL} from '@env';
import {EasyTeamProvider as Provider} from '@easyteam/ui';

import {useTheme} from '../../hooks';
import {useSession} from '../session';

export const EasyTeamProvider: React.FC<PropsWithChildren> = ({children}) => {
  const {fonts} = useTheme();
  const {isAuthenticated, user, access_token} = useSession();

  const employees = [{...user!, name: user?.email_address!}];

  return isAuthenticated ? (
    <Provider
      token={access_token}
      employees={employees}
      basePath={EASY_TEAM_BASE_URL}
      isGlobalTimeTrackingEnabled={user?.is_global_time_tracking_enabled}
      customFont={{
        bold: fonts.variants.montserratBold,
        regular: fonts.variants.montserratRegular,
        semiBold: fonts.variants.montserratSemibold,
      }}>
      {children}
    </Provider>
  ) : (
    children
  );
};
