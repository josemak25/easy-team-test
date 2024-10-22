import React from 'react';
import {View, Modal, SafeAreaView, TouchableOpacity} from 'react-native';

import {Text} from '../text';
import {reportError} from '../../helpers';
import {FallbackComponentProps} from '../../../typings/global';

import {useStyles} from './fallback.styles';

type FallbackScreenProps = FallbackComponentProps & {
  title?: string;
  subtitle?: string;
  isVisible?: boolean;
  buttonText?: string;
};

const FallbackScreenComponent: React.FC<FallbackScreenProps> = ({
  error,
  resetError,
  isModal = true,
  isVisible = false,
  buttonText = 'Try again',
  title = 'Oops, Something Went Wrong.',
  subtitle = 'The app ran into a problem and could \nnot continue. We apologize for any inconvenience this has caused! \n\nPress the button below to restart the app. \nPlease contact us if this issue persists.',
}) => {
  const {styles} = useStyles();

  const handleClearError = () => {
    if (error) {
      reportError(error);
    }
    resetError();
  };

  const Contents = (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.title, styles.subtitle]}>{subtitle}</Text>

        <TouchableOpacity style={styles.button} onPress={handleClearError}>
          <Text style={[styles.title, styles.text]}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return isModal ? (
    <Modal animationType="slide" visible={isVisible}>
      {Contents}
    </Modal>
  ) : (
    Contents
  );
};

export const FallbackScreen = React.memo(FallbackScreenComponent);
