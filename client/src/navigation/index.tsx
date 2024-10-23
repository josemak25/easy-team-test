import {
  Theme,
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {makeUseStyles} from '../helpers';
import {AuthScreen} from '../screens/auth';
import {useSession} from '../providers/session';
import {WelcomeScreen} from '../screens/welcome';
import {SettingsScreen} from '../screens/settings';
import {TimeSheetScreen} from '../screens/timesheet';
import {ShiftFormScreen} from '../screens/shift_form';
import {EmployeeListScreen} from '../screens/employee_list';
import {type MainStackParamList} from '../../typings/navigation';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const Navigation: React.FC = () => {
  const {isAuthenticated} = useSession();
  const {isDarkMode, colors, palette, styles} = useStyles();

  const theme: Theme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
        text: palette.text,
        card: palette.background,
        background: palette.background,
      },
    }),
    [isDarkMode, palette.background, palette.text],
  );

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName={
          isAuthenticated ? 'EmployeeListScreen' : 'WelcomeScreen'
        }
        screenOptions={{
          headerShown: true,
          freezeOnBlur: true,
          headerBlurEffect: 'light',
          headerBackTitleVisible: false,
          headerStyle: styles.headerStyle,
          headerTintColor: colors.light.white,
          headerTitleStyle: styles.headerTitleStyle,
        }}>
        {isAuthenticated ? (
          <Stack.Group navigationKey="AUTHENTICATED_SCREEN">
            <Stack.Screen
              name="EmployeeListScreen"
              component={EmployeeListScreen}
              options={{title: 'Employee List'}}
            />

            <Stack.Screen
              name="SettingsScreen"
              component={SettingsScreen}
              options={{title: 'Settings'}}
            />

            <Stack.Screen
              name="TimeSheetScreen"
              component={TimeSheetScreen}
              options={{title: 'Timesheet'}}
            />

            <Stack.Screen
              name="ShiftFormScreen"
              component={ShiftFormScreen}
              options={{title: 'Shift Form'}}
            />
          </Stack.Group>
        ) : (
          <Stack.Group navigationKey="UNAUTHENTICATED_SCREEN">
            <Stack.Screen name="AuthScreen" component={AuthScreen} />

            <Stack.Screen
              name="WelcomeScreen"
              component={WelcomeScreen}
              options={{headerShown: false}}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const useStyles = makeUseStyles(({palette, colors, fonts, scale}) => ({
  headerTitleStyle: {
    fontSize: scale(18),
    color: colors.light.white,
    fontFamily: fonts.variants.montserratMedium,
  },
  groupedHeaderTitleStyle: {
    fontWeight: '800',
    fontSize: scale(18),
    color: colors.light.white,
    fontFamily: fonts.variants.montserratBold,
  },
  headerStyle: {
    backgroundColor: palette.background,
  },
}));
