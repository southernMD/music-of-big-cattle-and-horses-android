import { View, Text, StyleSheet, Image, DeviceEventEmitter } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { PlayListDetailStackParamList } from "@/types/NavigationType";
import { useBasicApi, useUserCenter } from '@/store'
import { useSnapshot } from "valtio";
import { Icon } from "@ant-design/react-native";
import { useEffect, useMemo, useState } from "react";
import { subscribeKey } from "valtio/utils";
import { useTheme } from "@/hooks/useTheme";

export const PlayListDetailHeader = () => {
    const { profile } = useSnapshot(useBasicApi)
    const { typography } = useTheme();
    
    const route = useRoute<RouteProp<PlayListDetailStackParamList>>();
    const { id, name, type,createId } = useMemo(() => route.params, [route.params]);
    console.log(id, name, type,createId,"你干嘛");
    

    const styles = StyleSheet.create({
        centerContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between', // 左右两侧和中间内容均匀分布
            width: '100%', 
        },
        name: {
            width: '80%',
            fontSize: 16,
            fontWeight: 'bold',
            color: typography.colors.medium.default,
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
            marginLeft: 16,
        },
    });

    return (
        <View style={styles.centerContent}>
            <View style={styles.left}>
                <Text 
                style={styles.name}
                ellipsizeMode='tail' numberOfLines={1}
                >{name ? name : type === 'dj'?'未知电台':'未知歌单'}</Text>
            </View>
            <View style={styles.rightIcons}>
                <Icon name="search" size={20} style={styles.icon} color={typography.colors.small.default} onPress={() => console.log("Search clicked")} />
                <Icon name="more" size={20} style={styles.icon} color={typography.colors.small.default} onPress={() => console.log("More clicked")}/>
            </View>
        </View>
    );
};
