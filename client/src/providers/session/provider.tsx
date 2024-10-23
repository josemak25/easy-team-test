import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

import {Context, storeInitialState, ContextState, PERSISTER_KEY} from './store';

export const SessionProvider: React.FC<PropsWithChildren> = ({children}) => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState(storeInitialState);

  useEffect(() => {
    // First init
    (async () => {
      try {
        const data = await EncryptedStorage.getItem(PERSISTER_KEY);

        if (data) {
          setState(JSON.parse(data));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateSession = useRef<ContextState['updateSession']>(session => {
    const payload = {...state, ...session, isAuthenticated: !!session};
    setState(payload);
    EncryptedStorage.setItem(PERSISTER_KEY, JSON.stringify(payload));
  }).current;

  const value: ContextState = useMemo(
    () => ({...state, updateSession}),
    [state, updateSession],
  );

  return (
    <Context.Provider value={value}>
      {loading ? null : children}
    </Context.Provider>
  );
};
