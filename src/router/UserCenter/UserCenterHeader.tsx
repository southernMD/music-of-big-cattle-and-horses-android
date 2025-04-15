import { View, Text, StyleSheet, Image, DeviceEventEmitter } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { UserCenterStackParamList } from "@/types/NavigationType";
import { useBasicApi, useUserCenter } from '@/store'
import { useSnapshot } from "valtio";
import { Icon } from "@ant-design/react-native";
import { useEffect, useMemo, useState } from "react";
import { subscribeKey } from "valtio/utils";

export const CustomHeaderTitle = ({ title }: { title: string }) => {
    const { profile } = useSnapshot(useBasicApi)
    const route = useRoute<RouteProp<UserCenterStackParamList>>();
    const { uid, nickname, avatarUrl } = useMemo(() => route.params, [route.params]);
    console.log(uid, "头顶尖尖");
    if (uid === profile?.userId) {

    } else {
        //发起请求
    }


    return (
        <View style={styles.container}>
            {/* 左侧留空 */}
            <View style={styles.leftPlaceholder} />

            {/* 中间：头像和昵称 */}
            <View style={styles.centerContent}>
                <Image
                    source={{ uri: avatarUrl || '默认头像URL' }}
                    style={styles.avatar}
                />
                <Text style={styles.nickname}>{nickname || '未知用户'}</Text>
            </View>

            {/* 右侧：搜索图标和三个竖点图标 */}
            <View style={styles.rightIcons}>
                <Icon name="search" size={20} color="#fff" style={styles.icon} />
                <Icon name="more" size={20} color="#fff" style={styles.icon} />
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // 左右两侧和中间内容均匀分布
        width: '100%', // 占满整个宽度
    },
    leftPlaceholder: {
        width: 24, // 左侧占位宽度
    },
    centerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16, // 圆形头像
        marginRight: 8, // 头像和昵称之间的间距
    },
    nickname: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 16, // 图标之间的间距
    },
});