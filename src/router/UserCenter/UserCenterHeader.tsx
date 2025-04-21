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
        <View style={styles.centerContent}>
            <View style={styles.left}>
                <Image
                    source={{ uri: avatarUrl || '默认头像URL' }}
                    style={styles.avatar}
                />
                <Text style={styles.nickname}>{nickname || '未知用户'}</Text>
            </View>
            <View style={styles.rightIcons}>
                <Icon name="search" size={20} color="#fff" style={styles.icon} onPress={() => console.log("Search clicked")} />
                <Icon name="more" size={20} color="#fff" style={styles.icon} onPress={() => console.log("More clicked")}/>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({

    centerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // 左右两侧和中间内容均匀分布
        width: '80%', // 占满整个宽度
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
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 16, // 图标之间的间距
    },
});