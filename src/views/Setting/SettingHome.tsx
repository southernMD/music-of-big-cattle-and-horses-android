import { ScrollView, StyleSheet } from 'react-native';
import { Section } from '@/components/Setting/Section';
import { Item } from '@/components/Setting/Item';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProps } from '@/types/NavigationType';
import { useSnapshot } from 'valtio';
import { useBasicApi } from '@/store';
import { Toast } from '@ant-design/react-native';

export const SettingHome = () => {
  const { reqQuitLogin } = useSnapshot(useBasicApi);

  const handlePress = (setting: string) => {
    console.log(`Pressed: ${setting}`);
  };

  const navigation = useNavigation<RootStackNavigationProps>();
  const quit = async () => {
    const flag = await reqQuitLogin()
    if (flag) {
      navigation.navigate('Main', { screen: 'HomeTab' })
      Toast.show({
        content: '退出成功',
        position: 'bottom'
      });
    } else {
      Toast.show({
        content: '退出失败',
        position: 'bottom'
      });
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Section title="插放和下载">
        <Item
          label="使用3G/4G/5G网络播放"
          rightElement="switch"
          switchValue={true}
          onSwitchChange={(value) => console.log('Network playback:', value)}
          onPress={() => handlePress('Network playback')}
        />
        <Item
          label="使用3G/4G/5G网络下载"
          rightElement="switch"
          switchValue={false}
          onSwitchChange={(value) => console.log('Network download:', value)}
          onPress={() => handlePress('Network download')}
        />
      </Section>

      <Section>
        <Item
          label="在线播放音质"
          description="标准/较高"
          onPress={() => handlePress('在线播放音质')}
        />
        <Item
          label="下载音质"
          description="较高"
          onPress={() => handlePress('下载音质')}
        />
      </Section>

      <Section title="音效">
        <Item
          label="音量均衡"
          description="平衡不同音频内容之间的音量大小"
          onPress={() => handlePress('音量均衡')}
        />
        <Item
          label="淡入淡出"
          rightElement="switch"
          switchValue={false}
          onSwitchChange={(value) => console.log('Fade:', value)}
        />
        <Item
          label="允许与其他应用同时播放"
          rightElement="switch"
          switchValue={false}
          onSwitchChange={(value) => console.log('Background play:', value)}
        />
      </Section>

      <Section>
        <Item
          label="自动播放"
          rightElement="switch"
          switchValue={true}
          onSwitchChange={(value) => console.log('Auto play:', value)}
        />
        <Item
          label="后台播放保护"
          description="锁屏系统音量过小后自动暂停"
          onPress={() => handlePress('后台播放保护')}
        />
        <Item
          label="跨端续播"
          rightElement="chevron"
          onPress={() => handlePress('跨端续播')}
        />
        <Item
          label="更多播放下载设置"
          rightElement="chevron"
          onPress={() => handlePress('更多播放下载设置')}
        />
      </Section>

      <Section
        title='账号设置'
      >
        {useBasicApi.account ? 
        <>
          <Item
            label='切换用户'
            onPress={() => navigation.navigate('Setting',{screen:'Login'})} />

          <Item
            label='退出登录'
            onPress={() => quit()}
            labelStyle={{color: 'red'}} />
        </> :
          <Item
            label='登录'
            onPress={() => navigation.navigate('Setting',{screen:'Login'})} />
        }

      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});