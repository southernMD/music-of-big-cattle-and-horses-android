import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Repeat, SkipBack, Play, SkipForward, List } from 'lucide-react-native';

export function PlayerControls() {
  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progress} />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>00:02</Text>
          <Text style={styles.timeText}>02:54</Text>
        </View>
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity style={styles.sideButton}>
          <Repeat color="#fff" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <SkipBack color="#fff" size={32} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton}>
          <Play color="#fff" size={32} fill="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <SkipForward color="#fff" size={32} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideButton}>
          <List color="#fff" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    padding: 40,
    backgroundColor:"#000"
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
  },
  progress: {
    width: '2%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  sideButton: {
    padding: 12,
  },
  controlButton: {
    padding: 12,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});