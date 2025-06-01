/*
 * @Description: create by southernMD
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Navigation } from '@/router';
import { Provider } from '@ant-design/react-native';
import { getCredentials } from '@/utils/keychain';
import { useSnapshot } from 'valtio';
import { useBasicApi } from '@/store';
import { FullScreenImageProvider } from '@/context/imgFullPreviewContext';
import { Dark, Light } from '@/utils/theme';
import { setItem, getItem, clearItem, usePersistentStore } from '@/hooks/usePersistentStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LoadingMaodalProvider, useLoadingModal } from '@/context/LoadingModalContext';
import { MiniPlayerProvider, useMiniPlayer } from '@/context/MusicPlayerContext';
import { NavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '@/types/NavigationType';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/context/ThemeContext';
if (__DEV__) {
  require("./ReactotronConfig");
}
function App(): React.JSX.Element {
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
      button: {
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
  const navigationRef= useRef<NavigationContainerRef<RootStackParamList>>(null);
  const [currentRoute, setCurrentRoute] = useState(undefined);

  const openMusicPlayer = () => {
    navigationRef.current?.navigate('MusicPlayer');
  };
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <MiniPlayerProvider currentRoute={currentRoute} openMusicPlayer={openMusicPlayer}>
            <LoadingMaodalProvider>
              <FullScreenImageProvider>
                <Provider>
                  <Navigation 
                    ref={navigationRef}
                    linking={{
                      enabled: 'auto',
                      prefixes: ['mychat://'],
                    }}
                    theme={theme}
                    onReady={() => {
                      setCurrentRoute(navigationRef.current?.getCurrentRoute());
                    }}
                    onStateChange={() => {
                      setCurrentRoute(navigationRef.current?.getCurrentRoute());
                    }}
                  />
                </Provider>
              </FullScreenImageProvider>
            </LoadingMaodalProvider>
          </MiniPlayerProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default App;