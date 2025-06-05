import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@ant-design/react-native';
import { useTheme } from '@/hooks/useTheme';


export const SongListSearchHeader: React.FC= () => {
  const navigation = useNavigation();
  const inputRef = useRef<TextInput>(null);
  const theme = useTheme();
  const [searchQuery,setSearchQuery] = useState('');
  
  // 进入页面时自动选中输入框
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => { 
    DeviceEventEmitter.emit('searchQuery', searchQuery);
  }, [searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: theme.box.background.deep }]}>
      <TextInput
        ref={inputRef}
        style={[styles.input, { 
          color: theme.typography.colors.medium.default,
          borderBottomColor: theme.line.light
        }]}
        placeholder="搜索歌单内歌曲"
        placeholderTextColor={theme.typography.colors.xsmall.default}
        autoFocus={true}
        selectionColor={theme.colors.primary}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    height: 40,
    borderBottomWidth: 1,
  },
});
