import {KeyboardProvider} from 'react-native-keyboard-controller';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import {SessionProvider} from './session';
import {SafeAreaProvider} from './safearea';
import {EasyTeamProvider} from './easyteam';
import {buildProvidersTree} from '../helpers';
import {StatusBarProvider} from './statusbar';

const queryClient = new QueryClient();

export const Providers = buildProvidersTree([
  SafeAreaProvider,
  StatusBarProvider,
  KeyboardProvider,
  [QueryClientProvider, {client: queryClient}],
  SessionProvider,
  EasyTeamProvider,
]);
