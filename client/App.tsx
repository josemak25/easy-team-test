import 'react-native-url-polyfill/auto';
import React from 'react';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {reportError} from './src/helpers';
import {Providers} from './src/providers';
import {Navigation} from './src/navigation';
import {LIGHT_MODE_COLORS} from './src/constants/theme';
import {ErrorBoundary} from './src/components/error_boundary';

if (__DEV__) {
  // Configure Reactotron in dev environment
  require('./src/config/reactotron');
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Providers>
        <ErrorBoundary onError={reportError}>
          <Navigation />
        </ErrorBoundary>
      </Providers>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_MODE_COLORS.transparent,
  },
});
