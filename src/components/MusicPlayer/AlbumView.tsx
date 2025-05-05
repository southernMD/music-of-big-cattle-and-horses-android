import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Heart, History, Send, MessageSquare, MoveVertical as MoreVertical } from 'lucide-react-native';
import { Icon } from '@ant-design/react-native';
import { useTheme } from '@/hooks/useTheme';
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
import { useEffect } from 'react';
export function AlbumView() {
    const { box, typography } = useTheme()
    useEffect(() => {
        const path = 'https://images.pexels.com/photos/1835712/pexels-photo-1835712.jpeg'
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.recordContainer}>
                <View style={styles.record}>
                    <Image
                        source={{ uri: 'https://images.pexels.com/photos/1835712/pexels-photo-1835712.jpeg' }}
                        style={styles.albumImage}
                    />
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Heart color="#fff" size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <History color="#fff" size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Send color="#fff" size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <MessageSquare color="#fff" size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="more" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#000',
    },
    recordContainer: {
        marginTop: screenHeight * 0.05,
        width: screenWidth * 0.7,
        height: screenWidth * 0.7,
        position: 'relative',
    },
    record: {
        width: '100%',
        height: '100%',
        borderRadius: screenWidth * 0.35,
        backgroundColor: '#fff',
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    albumImage: {
        width: '100%',
        height: '100%',
        borderRadius: screenWidth * 0.35,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: screenHeight * 0.05,
    },
    actionButton: {
        padding: 12,
    },
});