
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ChevronDown, Share2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSnapshot } from 'valtio';
import { useMusicPlayer } from '@/store';
import { isLightColor } from '@/utils/isLightColor';
import { useMemo } from 'react';
import { useMiniPlayer } from '@/context/MusicPlayerContext';
const screenWidth = Dimensions.get("window").width;

export function CustomHeaderTitle() {
    const navigation = useNavigation();
    const musicPlayer = useSnapshot(useMusicPlayer)
    const fontColor = useMemo(() => {
        return isLightColor(musicPlayer.playingSongAlBkColor.average!) ? musicPlayer.playingSongAlBkColor.darkVibrant : musicPlayer.playingSongAlBkColor.lightMuted
    }, [musicPlayer.playingSongAlBkColor.average])

    const { getMiniPlayer } = useMiniPlayer()
    const obj = useMemo(() => {
        return getMiniPlayer()
    }, [])
    return (
        <View style={[styles.container, { backgroundColor: musicPlayer.playingSongAlBkColor.average }]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <ChevronDown color={fontColor} size={24} />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: fontColor }]}>{obj.title}</Text>
                <Text style={[styles.artist, { color: fontColor }]}>{obj.artist}</Text>
            </View>
            <TouchableOpacity>
                <Share2 color={fontColor} size={24} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        marginLeft: -16,
        width: screenWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    artist: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        marginTop: 4,
    },
});