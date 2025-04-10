import { View, Text, StyleSheet, TouchableOpacity, Switch, TouchableHighlight, StyleProp, TextStyle } from 'react-native';
import type { CSSProperties, PropsWithChildren } from 'react';
import { Icon } from '@ant-design/react-native';

interface SettingsRowProps extends PropsWithChildren {
  label: string;
  onPress?: () => void;
  rightElement?: 'switch' | 'chevron';
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  description?: string;
  labelStyle?:StyleProp<TextStyle>
}

export function Item({
  label,
  onPress,
  rightElement,
  switchValue,
  onSwitchChange,
  description,
  children,
  labelStyle
}: SettingsRowProps) {
  const content = (
    <>
      <Text style={labelStyle}>{label}</Text>
      {description ? (
        <View style={styles.rightContent}>
            <Text style={styles.secondaryText}>{description}</Text>
            <Icon size={20} color="#666" name='right'/>
        </View>
      ) : rightElement === 'switch' ? (
        <Switch value={switchValue} onValueChange={onSwitchChange} />
      ) : rightElement === 'chevron' ? (
        <Icon size={20} color="#666" name='right'/>
      ) : (
        children
      )}
    </>
  );

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress && !onSwitchChange}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  secondaryText: {
    fontSize: 14,
    color: '#999',
  },
});
