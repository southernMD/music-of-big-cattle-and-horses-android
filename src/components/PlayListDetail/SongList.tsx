import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Play, MoveVertical as MoreVertical, CircleArrowDown, ListCheck } from 'lucide-react-native';
import { PlaylistHeader } from './PlayListHeader';
import StickBarScrollingFlatList from '../StickBarScrollingFlatList/StickBarScrollingFlatList';
import { FlatList } from 'react-native-gesture-handler';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from '@ant-design/react-native';
import { usePersistentStore } from '@/hooks/usePersistentStore';

interface Song {
    id: string;
    title: string;
    artist: string;
    album?: string;
    cover: string;
    quality?: string;
}

interface SongListProps {
    songs: Song[];
    onSongPress?: (song: Song) => void;
}
const screenWidth = Dimensions.get("window").width;

export function SongList({ songs, onSongPress }: SongListProps) {
    const { box, typography, boxReflect } = useTheme()
    const primaryColor = usePersistentStore<string>('primaryColor');

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 10,
            backgroundColor: box.background.shallow,
        },
        playAllButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        playButtonIcon: {
            backgroundColor: primaryColor,
            width: 30,
            height: 30,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
        },
        playAllText: {
            color: typography.colors.large.default,
            fontSize: typography.sizes.medium,
            fontWeight: '500',
        },
        songCount: {
            color: typography.colors.small.default,
            fontSize: typography.sizes.small,
        },
        btns: {
            display: 'flex',
            gap: 8,
            flexDirection: 'row',
        },
        downloadButton: {
            paddingHorizontal: 8,
            paddingVertical: 8,
        },
        downloadText: {
            color: typography.colors.small.default,
            fontSize: typography.sizes.small,
        },
        songItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            backgroundColor: box.background.shallow,
            marginBottom: 1,
        },
        songIndex: {
            width: 32,
            color: typography.colors.small.default,
            fontSize: typography.sizes.small,
            textAlign: 'center',
        },
        songCover: {
            width: 48,
            height: 48,
            borderRadius: 4,
        },
        songInfo: {
            flex: 1,
            gap: 4,
            marginLeft: 8,
        },
        songTitle: {
            color: typography.colors.medium.default,
            fontSize: typography.sizes.medium,
        },
        songDetails: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        qualityBadge: {
            backgroundColor: boxReflect.background.shallow,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
        },
        qualityText: {
            color: primaryColor,
            fontSize: 12,
        },
        artistText: {
            color: typography.colors.small.default,
            fontSize: typography.sizes.small,
        },
        moreButton: {
            padding: 8,
        },
    });
    return (
        <StickBarScrollingFlatList
            loading={false}
            children={{
                HeaderBar: <>
                    <View style={styles.header}>
                        <View style={styles.playAllButton}>
                            <TouchableOpacity >
                                <View style={styles.playButtonIcon}>
                                    <Play color='#fff' size={20} fill='#fff' />
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.playAllText}>播放全部</Text>
                            <Text style={styles.songCount}>{songs.length}首</Text>
                        </View>

                        <View style={styles.btns}>
                            <TouchableOpacity style={styles.downloadButton}>
                                <CircleArrowDown color={typography.colors.large.default} size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.downloadButton}>
                                <ListCheck color={typography.colors.large.default} size={25} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </>,
                HeaderContent:
                    <PlaylistHeader
                        image="https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg"
                        title="nicorap netrap"
                        author="南山有壶酒"
                        playCount={288}
                        description="日语rap"
                    />,
                FlatListContent: <>
                    <FlatList
                        style={{ width: screenWidth }}
                        data={songs}
                        keyExtractor={(item) => item.id.toString()}
                        removeClippedSubviews={false}
                        renderItem={({ item,index }) => {
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.songItem}
                                    onPress={() => onSongPress?.(item)}
                                >
                                    <Text style={styles.songIndex}>{(index + 1).toString().padStart(2, '0')}</Text>
                                    <Image source={{ uri: item.cover }} style={styles.songCover} />
                                    <View style={styles.songInfo}>
                                        <Text style={styles.songTitle}>{item.title}</Text>
                                        <View style={styles.songDetails}>
                                            {item.quality && (
                                                <View style={styles.qualityBadge}>
                                                    <Text style={styles.qualityText}>{item.quality}</Text>
                                                </View>
                                            )}
                                            <Text style={styles.artistText}>
                                                {item.artist}{item.album ? ` - ${item.album}` : ''}
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.moreButton}>
                                        <Icon name="more" size={20} color={typography.colors.medium.default} />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            )
                        }}

                    />
                </>
            }}
        >

        </StickBarScrollingFlatList>
    );
}

