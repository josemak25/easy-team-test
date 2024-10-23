import React, {PropsWithChildren} from 'react';
import {StatusBar} from 'react-native';

import {makeUseStyles} from '../../helpers';

export const StatusBarProvider: React.FC<PropsWithChildren> = ({children}) => {
  const {isDarkMode, palette} = useStyle();

  return (
    <>
      <StatusBar
        animated
        translucent
        backgroundColor={palette.background}
        barStyle={isDarkMode ? 'dark-content' : 'light-content'}
      />
      {children}
    </>
  );
};

const useStyle = makeUseStyles(() => {});
