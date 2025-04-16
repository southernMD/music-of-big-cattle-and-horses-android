import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, Pressable } from 'react-native';
import { Shield, MapPin } from 'lucide-react-native';
import { useFullScreenImage } from '@/utils/imgFullPreview';

export function ProfileHeader() {
    const { showFullScreenImage } = useFullScreenImage();
    return (
        <ImageBackground source={{ uri: 'img' }} style={styles.container}>

            <Pressable onPress={()=>showFullScreenImage('img')} style={styles.overlay}>
                <View  />
            </Pressable>

            <Image
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop' }}
                style={styles.avatar}
            />
            <Text style={styles.name}>南山有壶酒</Text>

            <TouchableOpacity style={styles.vipButton}>
                <View style={styles.vipBadge} />
                <Text style={styles.vipText}>VIP</Text>
                <Text style={styles.vipPrice}>¥4.8开通</Text>
                <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <Text style={styles.bio}>个人简介被吃了，宣传一下我的blog: www.southernmd.top</Text>

            <View style={styles.badgeContainer}>
                <View style={styles.badge}>
                    <Shield size={16} color="#fff" />
                    <Text style={styles.badgeText}>13枚徽章</Text>
                </View>
                <View style={styles.badge}>
                    <MapPin size={16} color="#666" />
                    <Text style={styles.badgeText}>魂音泉乐迷 · 浙江 杭州</Text>
                </View>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>14</Text>
                    <Text style={styles.statLabel}>关注</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>16</Text>
                    <Text style={styles.statLabel}>粉丝</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>Lv.9</Text>
                    <Text style={styles.statLabel}>等级</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>7081</Text>
                    <Text style={styles.statLabel}>小时</Text>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingTop: 100,
        paddingHorizontal: 16,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject, // 覆盖整个背景
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明黑色蒙版
      },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12,
    },
    name: {
        fontSize: 24,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 12,
    },
    vipButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 16,
    },
    vipBadge: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ff4757',
        marginRight: 6,
    },
    vipText: {
        color: '#ff4757',
        fontWeight: '600',
        marginRight: 6,
    },
    vipPrice: {
        color: '#fff',
        fontSize: 12,
    },
    chevron: {
        color: '#666',
        marginLeft: 4,
    },
    bio: {
        color: '#999',
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 14,
    },
    badgeContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    badgeText: {
        color: '#666',
        fontSize: 12,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingVertical: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 4,
    },
    statLabel: {
        color: '#666',
        fontSize: 12,
    },
});