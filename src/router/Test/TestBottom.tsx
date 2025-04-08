import { RootStackNavigationProps } from '@/types/NavigationType';
import { Icon } from '@ant-design/react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Pressable, View, Text, StyleSheet } from 'react-native';
export const TabBarButton = ({}: any) => {

    const Navigation = useNavigation<RootStackNavigationProps>()
    const onPress = ()=>{
        Navigation.navigate("TestTab")
    }
    const isFocused = useIsFocused()
    console.log(isFocused);
    
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.button,
                isFocused && styles.activeButton
            ]}
        >
            <Icon
                name="folder"
                size={24}
                color={isFocused ? '#FF0000' : '#999999'}
            />
            <Text style={[
                styles.label,
                isFocused && styles.activeLabel
            ]}>
                测试
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    activeButton: {
        borderTopWidth: 2,
        borderTopColor: '#FF0000',
    },
    label: {
        fontSize: 12,
        marginTop: 4,
    },
    activeLabel: {
        color: '#FF0000',
        fontWeight: 'bold',
    },
});