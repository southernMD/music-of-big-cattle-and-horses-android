/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect } from 'react';
import { Navigation } from '@/router';
import { Provider } from '@ant-design/react-native';
import { getCredentials } from '@/utils/keychain';
import { useSnapshot } from 'valtio';
import { useBasicApi } from '@/store';
import { FullScreenImageProvider } from '@/utils/imgFullPreview';

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

  return (
    <FullScreenImageProvider>
      <Provider>
        <Navigation linking={{
          enabled: 'auto',
          prefixes: ['mychat://'],
        }} />
      </Provider>
    </FullScreenImageProvider>

  );
}

export default App;