import { useTheme } from "@/hooks/useTheme";
import { View, Text, StyleSheet } from "react-native";

export const CustomHeaderTitle = ({ title }: { title: string }) => {
    const { box, typography } = useTheme();
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        title: {
            fontSize: typography.sizes.large,
            fontWeight: 'bold',
            color: typography.colors.large.default,
            marginLeft: 8,
        },
    });
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

