import React, {useCallback, useRef} from 'react';
import {EmployeeListRef, EmployeesTimesheet} from '@easyteam/ui';

import {MainStackScreenProps} from '../../../typings/navigation';
import {useFocusEffect} from '@react-navigation/native';

export const EmployeeListScreen: React.FC<
  MainStackScreenProps<'EmployeeListScreen'>
> = ({route, navigation}) => {
  const ref = useRef<EmployeeListRef>(null);

  useFocusEffect(
    useCallback(() => {
      ref.current?.reloadData();
    }, []),
  );

  return (
    <EmployeesTimesheet
      ref={ref}
      {...route.params}
      onEmployeeReportPress={data =>
        navigation.navigate('TimeSheetScreen', {...data})
      }
    />
  );
};
