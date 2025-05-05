
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ChevronDown, Share2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
const screenWidth = Dimensions.get("window").width;

export function CustomHeaderTitle() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <ChevronDown color="#fff" size={24} />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>あっかんべーだ (Cover 瀬名航)</Text>
                <Text style={styles.artist}>Shikako</Text>
            </View>
            <TouchableOpacity>
                <Share2 color="#fff" size={24} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height:60,
        marginLeft:-16,
        width:screenWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#000',
        paddingHorizontal: 16,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 16,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    artist: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        marginTop: 4,
    },
});