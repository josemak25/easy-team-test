import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Timesheet, TimesheetRef, AddButton} from '@easyteam/ui';
import {useFocusEffect} from '@react-navigation/native';

import {MainStackScreenProps} from '../../../typings/navigation';

export const TimeSheetScreen: React.FC<
  MainStackScreenProps<'TimeSheetScreen'>
> = ({navigation, route}) => {
  const ref = useRef<TimesheetRef>(null);
  const [endDate, setEndDate] = useState<string>(route.params.endDate);
  const [startDate, setStartDate] = useState<string>(route.params.startDate);

  const headerRight = useCallback(
    () => (
      <AddButton
        onPress={() =>
          navigation.navigate('ShiftFormScreen', {
            employeeId: route.params.employeeId,
          })
        }
      />
    ),
    [navigation, route.params.employeeId],
  );

  useEffect(() => {
    if (ref.current?.adminWritePermissions) {
      navigation.setOptions({headerRight});
    }
  }, [headerRight, navigation]);

  useFocusEffect(
    useCallback(() => {
      ref.current?.reloadData();
    }, []),
  );

  return (
    <Timesheet
      ref={ref}
      {...route.params}
      endDate={endDate}
      startDate={startDate}
      onDateRangeChange={(newStartDate, newEndDate) => {
        setEndDate(newEndDate);
        setStartDate(newStartDate);
      }}
      onEditPress={(shiftDate, employeeId) => {
        navigation.navigate('ShiftFormScreen', {shiftDate, employeeId});
      }}
    />
  );
};
