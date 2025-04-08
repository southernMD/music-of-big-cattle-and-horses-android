import { Icon, Input } from "@ant-design/react-native";
import { View, Text, StyleSheet } from "react-native";

export const CustomHeaderTitle = ({ title }: { title: string }) => {
    return (
        <View style={styles.container}>
            <Icon name="percentage" size={20} color="#fff" />
            <Text style={styles.title}>{title}</Text>
            <Input style={styles.input}></Input>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 8,
    },
    input: {
        width: "50%",
        backgroundColor: "#fff",
    }
});