import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SkipBack, Play, SkipForward, List, Pause } from 'lucide-react-native';
import { useMusicPlayer } from '@/store';
import { useCallback, useMemo } from 'react';
import { useSnapshot } from 'valtio'
import { isLightColor } from '@/utils/isLightColor';
import { playingSongListRef, useMiniPlayer } from '@/context/MusicPlayerContext';
import { dayjsMMSS } from '@/utils/dayjs';
import { PlayModeToggle } from './PlayModeToggle';

export function PlayerControls() {
  const musicPlayer = useSnapshot(useMusicPlayer)
  const fontColor = useMemo(() => {
    return isLightColor(musicPlayer.playingSongAlBkColor.average!) ? musicPlayer.playingSongAlBkColor.darkVibrant : musicPlayer.playingSongAlBkColor.lightMuted
  }, [musicPlayer.playingSongAlBkColor.average])

  const { getMiniPlayer, changeSoundPlaying, playNext, playPrev } = useMiniPlayer()
  const { currentTime, progress, durationTime } = useMemo(() => {
    return getMiniPlayer()
  }, [getMiniPlayer()])

  const openPlayingList = useCallback(() => {
    playingSongListRef.current?.snapToIndex(0)
  },[])
  return (
    <View style={[styles.container, { backgroundColor: musicPlayer.playingSongAlBkColor.average }]}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${progress}%` }]} />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{dayjsMMSS(currentTime)}</Text>
          <Text style={styles.timeText}>{dayjsMMSS(durationTime)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <View style={styles.sideButton}>
          <PlayModeToggle messageAlert={true} showLabel={false} size={24} color={fontColor} style={{
            iconContainer: {
              backgroundColor: 'rgba(0,0,0,0)'
            }
          }} />
        </View>
        <TouchableOpacity style={styles.controlButton} onPress={playPrev}>
          <SkipBack color={fontColor} size={32} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton} onPress={changeSoundPlaying}>
          {
            useMusicPlayer.playStatus === 'play' ?
              <Pause color={fontColor} size={32} fill={fontColor} />
              : <Play color={fontColor} size={32} fill={fontColor} />
          }
          
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={playNext}>
          <SkipForward color={fontColor} size={32} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideButton} onPress={openPlayingList}>
          <List color={fontColor} size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    padding: 40,
    backgroundColor: "#000"
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