import {NavigationProp} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type MainStackParamList = {
  WelcomeScreen: undefined;
  SettingsScreen: undefined;
  AuthScreen: {title?: 'Sign Up' | 'Sign In'};
  EmployeeListScreen: {endDate: string; startDate: string};
  ShiftFormScreen: {employeeId: string; shiftDate?: string};
  TimeSheetScreen: {employeeId: string; endDate: string; startDate: string};
};

export type MainStackScreenProps<Screen extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, Screen>;

export type MainStackNavigationProps = NavigationProp<MainStackParamList>;
