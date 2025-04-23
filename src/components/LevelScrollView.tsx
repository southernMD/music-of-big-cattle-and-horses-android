// UserCenterHome.tsx

import React, { useState, useCallback } from 'react';
import { View, Dimensions, FlatList, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TABS = ['音乐', '播客', '收藏'];

const DATA = {
  music: Array.from({ length: 10 }, (_, i) => `音乐 ${i + 1}`),
  broadcast: Array.from({ length: 10 }, (_, i) => `播客 ${i + 1}`),
  start: Array.from({ length: 10 }, (_, i) => `收藏 ${i + 1}`),
};

const TabContent = ({ data }: { data: string[] }) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item}</Text>
        </View>
      )}
    />
  );
};

const UserCenterHome = () => {
  const translateX = useSharedValue(0);
  const [activeTab, setActiveTab] = useState(0);

  const onGestureEvent = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = -activeTab * SCREEN_WIDTH + event.translationX;
    },
    onEnd: (event) => {
      const threshold = SCREEN_WIDTH / 4;
      let nextTab = activeTab;
      if (event.translationX < -threshold && activeTab < TABS.length - 1) {
        nextTab += 1;
      } else if (event.translationX > threshold && activeTab > 0) {
        nextTab -= 1;
      }
      translateX.value = withTiming(-nextTab * SCREEN_WIDTH, { duration: 300 });
      runOnJS(setActiveTab)(nextTab);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    flexDirection: 'row',
    width: SCREEN_WIDTH * TABS.length,
  }));

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {TABS.map((tab, index) => (
        <Text
          key={tab}
          style={[
            styles.tab,
            activeTab === index && { borderBottomColor: 'blue', color: 'blue' },
          ]}
          onPress={() => {
            translateX.value = withTiming(-index * SCREEN_WIDTH, { duration: 300 });
            setActiveTab(index);
          }}
        >
          {tab}
        </Text>
      ))}
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {renderTabBar()}
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          <View style={{ width: SCREEN_WIDTH }}>
            <TabContent data={DATA.music} />
          </View>
          <View style={{ width: SCREEN_WIDTH }}>
            <TabContent data={DATA.broadcast} />
          </View>
          <View style={{ width: SCREEN_WIDTH }}>
            <TabContent data={DATA.start} />
          </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default UserCenterHome;

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tab: {
    fontSize: 16,
    paddingVertical: 6,
    color: '#333',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
