import {createContext, useContext} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

import {UserSessionInterface} from '../../../typings/user';

export const PERSISTER_KEY = '@persister-state-key-for-session';

export interface SessionInterfaceState extends UserSessionInterface {
  isAuthenticated: boolean;
}

export type ContextState = SessionInterfaceState & {
  updateSession: (session: UserSessionInterface | null) => void;
};

export const storeInitialState = {
  isAuthenticated: false,
} as SessionInterfaceState;

export const Context = createContext<ContextState>(
  storeInitialState as ContextState,
);

export const useSession = () => useContext(Context);

export const getUserSession = async () => {
  const data = await EncryptedStorage.getItem(PERSISTER_KEY);
  return data ? (JSON.parse(data) as UserSessionInterface) : null;
};
