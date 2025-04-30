import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable, Dimensions } from 'react-native';
import { Share2, MessageSquare, Plus } from 'lucide-react-native';
import { useFullScreenImage } from '@/context/imgFullPreviewContext';
import { useTheme } from '@/hooks/useTheme';
import { useMemo, useState } from 'react';
import { userProfile } from '@/types/user/user';
import { convertHttpToHttps } from '@/utils/fixHttp';
import FastImage from 'react-native-fast-image';
import { useSnapshot } from 'valtio';
import { useBasicApi } from '@/store';
import { Playlist } from '@/types/PlayList';

interface PlaylistHeaderProps {
    playlistDetailMsg: Playlist
}
const { width } = Dimensions.get('screen');
export function PlaylistHeader({ playlistDetailMsg }: PlaylistHeaderProps) {
    const { showFullScreenImage, isVisible } = useFullScreenImage();
    const { typography, box, borderRadius,line } = useTheme()
    const { profile } = useSnapshot(useBasicApi)
    const pressHandler = (url: string) => {
        showFullScreenImage(url)
    };
    const startFlag = useMemo(()=>{
        return Boolean(playlistDetailMsg.subscribed)
    },[playlistDetailMsg.subscribed])
    const image = useMemo(()=>convertHttpToHttps(playlistDetailMsg.coverImgUrl),[playlistDetailMsg.coverImgUrl])
    const isMyCreate = useMemo(()=>{
        return profile?.userId == playlistDetailMsg.creator.userId
    },[profile,playlistDetailMsg.creator.userId])
    const styles = StyleSheet.create({
        container: {
            padding: 20,
            backgroundColor: box.background.middle,
            marginTop: 56,
        },
        details: {
            display: 'flex',
            flexDirection: 'row',
            marginBottom: 16,
        },
        coverImage: {
            width: width * 0.35,
            height: width * 0.35,
            borderRadius: 8,
            marginRight: 16,
        },
        info: {
            width: width * 0.5,
        },
        title: {
            fontSize: 24,
            fontWeight: '600',
            color: typography.colors.large.default,
            marginBottom: 8,
        },
        tags: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 8,
        },
        tag: {
            width: 40,
            color: typography.colors.medium.default,
            borderWidth: 1,
            borderRadius: 4,
            textAlign: 'center',
            borderColor: typography.colors.medium.default,
        },
        authorRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        avatar: {
            width: 24,
            height: 24,
            borderRadius: 12,
            marginRight: 8,
        },
        author: {
            color: typography.colors.small.default,
            fontSize: 14,
            marginRight: 8,
        },
        playCount: {
            color: typography.colors.xsmall.default,
            fontSize: 14,
        },
        descriptionContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        description: {
            color: typography.colors.xsmall.default,
            fontSize: 14,
            flex: 1,
        },
        chevron: {
            color: typography.colors.xsmall.default,
            fontSize: 16,
            marginLeft: 4,
        },
        actions: {
            justifyContent: 'center',
            flexDirection: 'row',
            paddingTop: 20,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: line.light,
            gap: 100,
        },
        actionButton: {
            alignItems: 'center',
            gap: 8,
        },
        actionText: {
            color: typography.colors.large.default,
            fontSize: 12,
        },
        actionTextStart:{
            color: startFlag || isMyCreate?typography.colors.large.disabled:typography.colors.large.default,
        }
    });

    const [isExpanded, setIsExpanded] = useState(false); // 控制展开/收起状态

    const toggleExpand = () => {
        setIsExpanded(!isExpanded); // 切换状态
    };
    console.log(playlistDetailMsg.subscribed);
    return (
        <View style={styles.container}>
            <View style={styles.details}>
                <Pressable onPress={() => pressHandler(image)}>
                    <FastImage source={{ uri: image }} style={styles.coverImage} />
                </Pressable>

                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={2}>{playlistDetailMsg.name}</Text>
                    {playlistDetailMsg.tags?.length == 0 ?null:
                        <View style={styles.tags}>
                            {playlistDetailMsg.tags?.map((tag, index) => {
                                return (
                                    <Text style={styles.tag}>{tag}</Text>
                                )
                            })}
                        </View>
                    }
                    <View style={styles.authorRow}>
                        <FastImage
                            source={{ uri: convertHttpToHttps(playlistDetailMsg.creator.avatarUrl) }}
                            style={styles.avatar}
                        />

                        <Text style={styles.author}>{playlistDetailMsg.creator.nickname}</Text>
                        <Text style={styles.playCount}>{playlistDetailMsg.playCount}次播放</Text>
                    </View>

                    <TouchableOpacity onPress={toggleExpand} style={styles.descriptionContainer}>
                        <Text
                            style={styles.description}
                            numberOfLines={isExpanded ? undefined : 1} 
                            ellipsizeMode={isExpanded ? undefined : "tail"}
                        >
                            {playlistDetailMsg.description}
                        </Text>
                        {!isExpanded && <Text style={styles.chevron}>›</Text>}
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Share2 color={typography.colors.large.default} size={24} />
                    <Text style={styles.actionText}>分享</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <MessageSquare color={typography.colors.large.default} size={24} />
                    <Text style={styles.actionText}>评论</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} disabled={isMyCreate}>
                    <Plus color={startFlag || isMyCreate?typography.colors.large.disabled:typography.colors.large.default} size={24} />
                    <Text style={[styles.actionText,styles.actionTextStart]}>{startFlag && !isMyCreate ?'已':''}收藏</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

