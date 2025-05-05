//orpheuswidget://

import { AlbumView } from "@/components/MusicPlayer/AlbumView";
import { PlayerControls } from "@/components/MusicPlayer/PlayerControls";
import { View, Text, StyleSheet } from "react-native";

//orpheus://
export const MusicPlayer: React.FC = () => {
    return (
        <View
            style={styles.container}
        >
            <AlbumView />
            <PlayerControls />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});