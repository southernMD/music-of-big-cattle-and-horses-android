import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, Download, Upload, ShirtIcon, Grid } from 'lucide-react-native';

export function ActionBar() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.action}>
        <Clock color="#fff" size={24} />
        <Text style={styles.actionText}>最近</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.action}>
        <Download color="#fff" size={24} />
        <Text style={styles.actionText}>本地</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.action}>
        <Upload color="#fff" size={24} />
        <Text style={styles.actionText}>网盘</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.action}>
        <ShirtIcon color="#fff" size={24} />
        <Text style={styles.actionText}>装扮</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.action}>
        <Grid color="#fff" size={24} />
        <Text style={styles.actionText}>更多</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  action: {
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
  },
});