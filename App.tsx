/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Navigation } from '@/router';
import { Provider } from '@ant-design/react-native';
import { getCredentials } from '@/utils/keychain';
import { useSnapshot } from 'valtio';
import { useBasicApi } from '@/store';
import { FullScreenImageProvider } from '@/context/imgFullPreviewContext';
import { Dark, Light } from '@/utils/theme';
import { setItem, getItem,clearItem, usePersistentStore } from '@/hooks/usePersistentStore';

if (__DEV__) {
  require("./ReactotronConfig");
}
function App(): React.JSX.Element {
  const { reqLogin } = useSnapshot(useBasicApi)
  useEffect(() => {
    getCredentials().then((credentials) => {
      if (credentials) {
        reqLogin(credentials.password)
      }
    });
  }, []);
  const primaryColor = usePersistentStore<string>('primaryColor', 'rgba(102, 204, 255,1)');
  const isDark = usePersistentStore<boolean>('isDark', false);
  
  const theme = useMemo(() => {
    const base = isDark ? Dark : Light;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: primaryColor,
      },
      button:{
        solid: {
          ...base.button.solid,
          background: primaryColor,
        },
        outline: {
          ...base.button.outline,
          border: primaryColor,
          text: primaryColor
        }
      }
    };
  }, [isDark, primaryColor]);
  return (
    <FullScreenImageProvider>
      <Provider>
        <Navigation linking={{
          enabled: 'auto',
          prefixes: ['mychat://'],
        }}
          theme={theme}
        />
      </Provider>
    </FullScreenImageProvider>
  );
}

export default App;