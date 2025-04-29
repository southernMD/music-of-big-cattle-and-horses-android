import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Share2, MessageSquare, Plus } from 'lucide-react-native';
import { useFullScreenImage } from '@/context/imgFullPreviewContext';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';

interface PlaylistHeaderProps {
    image: string;
    title: string;
    author: string;
    playCount: number;
    description?: string;
}

export function PlaylistHeader({ image, title, author, playCount, description }: PlaylistHeaderProps) {
    const { showFullScreenImage, isVisible } = useFullScreenImage();
    const { typography, box, borderRadius,line } = useTheme()
    const pressHandler = (url: string) => {
        showFullScreenImage(url)
    };
    const [startFlag, setStartFlag] = useState(false)

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
            width: 150,
            height: 150,
            borderRadius: 8,
            marginRight: 16,
        },
        info: {
            // marginBottom: 20,
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
            color: startFlag?typography.colors.large.disabled:typography.colors.large.default,
        }
    });

    const [isExpanded, setIsExpanded] = useState(false); // 控制展开/收起状态

    const toggleExpand = () => {
        setIsExpanded(!isExpanded); // 切换状态
    };

    return (
        <View style={styles.container}>
            <View style={styles.details}>
                <Pressable onPress={() => pressHandler(image)}>
                    <Image source={{ uri: image }} style={styles.coverImage} />
                </Pressable>

                <View style={styles.info}>
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.tags}>
                        <Text style={styles.tag}>流行</Text>
                        <Text style={styles.tag}>流行</Text>
                        <Text style={styles.tag}>流行</Text>
                    </View>
                    <View style={styles.authorRow}>
                        <Image
                            source={{ uri: 'https://images.pexels.com/photos/1535713/pexels-photo-1535713.jpeg' }}
                            style={styles.avatar}
                        />

                        <Text style={styles.author}>{author}</Text>
                        <Text style={styles.playCount}>{playCount}次播放</Text>
                    </View>

                    <TouchableOpacity onPress={toggleExpand} style={styles.descriptionContainer}>
                        <Text
                            style={styles.description}
                            numberOfLines={isExpanded ? undefined : 1} // 展开时取消行数限制
                            ellipsizeMode={isExpanded ? undefined : "tail"} // 展开时取消省略号
                        >
                            这是一个很长的描述文本，默认显示一行，点击后展开显示全部内容。
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
                <TouchableOpacity style={styles.actionButton} disabled={startFlag}>
                    <Plus color={startFlag?typography.colors.large.disabled:typography.colors.large.default} size={24} />
                    <Text style={[styles.actionText,styles.actionTextStart]}>{startFlag?'已':''}收藏</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

