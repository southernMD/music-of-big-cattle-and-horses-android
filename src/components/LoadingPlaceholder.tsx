import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, StyleSheet, Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
interface LoadingPlaceholderProps {
    visible: boolean;
    timeout?: number; // 可选超时，单位：ms
    message?: string; // 可选提示信息
}

const LoadingPlaceholder: React.FC<LoadingPlaceholderProps> = ({
    visible,
    timeout,
    message = "暂无数据",
}) => {
    const [timedOut, setTimedOut] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (visible && timeout) {
            timer = setTimeout(() => setTimedOut(true), timeout);
        }

        return () => {
            if (timer) clearTimeout(timer);
            setTimedOut(false); // 重置
        };
    }, [visible, timeout]);

    if (!visible) return null;

    const styles = StyleSheet.create({
        container: {
            width: screenWidth,
            paddingVertical: 40,
            alignItems: "center",
            justifyContent: "center",
        },
        message: {
            fontSize: 16,
            color: "#666",
            marginTop: 12,
        },
    });

    return (
        <View style={styles.container}>
            {timedOut ? (
                <Text style={styles.message}>{message}</Text>
            ) : (
                <ActivityIndicator size="large" color="#888" />
            )}
        </View>
    );
};

export default LoadingPlaceholder;

