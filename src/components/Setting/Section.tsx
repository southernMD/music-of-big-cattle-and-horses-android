import { View, Text, StyleSheet } from 'react-native';
import type { PropsWithChildren } from 'react';

interface SettingsSectionProps extends PropsWithChildren {
  title?: string;
}

export function Section({ title, children }: SettingsSectionProps) {
  return (
    <View style={styles.section}>
      {title && (
        <View style={styles.titleRow}>
          <Text style={styles.label}>{title}</Text>
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  titleRow: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
});