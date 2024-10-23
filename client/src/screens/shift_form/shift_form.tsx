import React, {useEffect, useRef} from 'react';
import noop from 'lodash/noop';
import dayjs from 'dayjs';
import {Alert, Platform} from 'react-native';
import {ShiftFormRef, ShiftForm} from '@easyteam/ui';
import {HeaderBackButton} from 'react-navigation-stack';
import {UNSTABLE_usePreventRemove} from '@react-navigation/native';

import {MainStackScreenProps} from '../../../typings/navigation';

export const ShiftFormScreen: React.FC<
  MainStackScreenProps<'ShiftFormScreen'>
> = ({navigation, route}) => {
  const {shiftDate} = route.params;
  const ref = useRef<ShiftFormRef>(null);

  useEffect(() => {
    // use dayjs here
    const screenTitle = shiftDate
      ? dayjs(shiftDate).format('ddd, MMM, DD')
      : 'Add Shift';

    const headerLeft = Platform.select({
      default: undefined,
      // eslint-disable-next-line react/no-unstable-nested-components
      ios: () => (
        <HeaderBackButton tintColor="#ff3479" onPress={navigation.goBack} />
      ),
    });

    navigation.setOptions({headerLeft, title: screenTitle});
  }, [navigation, shiftDate]);

  // TODO: UPDATE TO usePreventRemove on react-navigation v7 release
  UNSTABLE_usePreventRemove(ref.current?.unsavedChanges || false, ({data}) => {
    // Prompt the user before leaving the screen
    Alert.alert(
      'Unsaved Changes',
      'Are you sure you want to discard the changes?',
      [
        {
          onPress: noop,
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => navigation.dispatch(data.action),
        },
      ],
    );
  });

  return (
    <ShiftForm
      ref={ref}
      {...route.params}
      onSaveSuccess={navigation.goBack}
      onCancelPress={navigation.goBack}
    />
  );
};
