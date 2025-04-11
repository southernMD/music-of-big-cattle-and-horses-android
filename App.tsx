/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import { Navigation } from '@/router';
import { Provider } from '@ant-design/react-native';

if (__DEV__) {
  require("./ReactotronConfig");
}

function App(): React.JSX.Element {
  return (
      <Provider>
        <Navigation linking={{
          enabled: 'auto',
          prefixes: ['mychat://'],
        }} />
      </Provider>
  );
}

export default App;