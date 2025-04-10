import { RootStackNavigationProps } from "@/types/NavigationType";
import { Icon } from "@ant-design/react-native";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";

export const CustomHeaderTitle = ({ title }: { title: string }) => {
    const navigation = useNavigation<RootStackNavigationProps>();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.iconContainer}>
        <Pressable onPress={() => console.log("Search clicked")} style={styles.iconPressable}>
          <Icon name="search" size={20} color="#fff" />
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Setting')} style={styles.iconPressable}>
          <Icon name="setting" size={20} color="#fff" />
        </Pressable>

        <Pressable onPress={() => console.log("Avatar clicked")} style={styles.iconPressable}>
          <Image
            source={{
              uri: 'avatar', // 替换为实际头像 URL
            }}
            style={styles.avatar}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 标题和图标区域分开
    width: '100%', // 占满整个宽度
    paddingHorizontal: 5, // 左右内边距
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
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
    borderColor: '#fff', // 白色边框
  },
});