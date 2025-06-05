import { RootStackNavigationProps } from "@/types/NavigationType";
import { Icon } from "@ant-design/react-native";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useBasicApi } from '@/store';
import { useSnapshot } from "valtio";
import { convertHttpToHttps } from "@/utils/fixHttp";
import { useTheme } from "@/hooks/useTheme";
import FastImage from "react-native-fast-image";

export const CustomHeaderTitle = ({ title }: { title: string }) => {

  const navigation = useNavigation<RootStackNavigationProps>();
  const { profile } = useSnapshot(useBasicApi)
  const { typography, } = useTheme()
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between', // 标题和图标区域分开
      width: '100%', // 占满整个宽度
      paddingHorizontal: 5, // 左右内边距
    },
    title: {
      fontSize: typography.sizes.large,
      fontWeight: 'bold',
      color: typography.colors.large.default,
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16, // 图标之间的间距
    },
    iconPressable: {
      padding: 8, // 增加点击区域
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20, // 圆形头像
      borderWidth: 2,
      borderColor: typography.colors.small.default, 
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.iconContainer}>
        <Pressable onPress={() => console.log("Search clicked")} style={styles.iconPressable}>
          <Icon name="search" size={20} color={typography.colors.small.default} />
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Setting',{screen:'SettingHome'})} style={styles.iconPressable}>
          <Icon name="setting" size={20} color={typography.colors.small.default} />
        </Pressable>

        <Pressable onPress={() =>
          navigation.navigate('UserCenter', {
            screen: 'UserCenterHome',
            params: { 
              uid: profile?.userId!,
              avatarUrl: convertHttpToHttps(profile?.avatarUrl!),
              nickname: profile?.nickname!
             }
          })} 
          style={styles.iconPressable}>
          <FastImage
            source={{
              uri: profile ? convertHttpToHttps(profile.avatarUrl) : 'avatar', // 替换为实际头像 URL
            }}
            style={styles.avatar}
          />
        </Pressable>
      </View>
    </View>
  );
};

