import React from 'react';
import {Settings} from '@easyteam/ui';

import {MainStackScreenProps} from '../../../typings/navigation';

export const SettingsScreen: React.FC<
  MainStackScreenProps<'SettingsScreen'>
> = () => {
  return (
    <Settings
      onSave={_payload => {
        //Send the payload data to the backend
      }}
    />
  );
};
