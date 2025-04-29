import { View, StyleSheet, ScrollView } from 'react-native';
import { PlaylistHeader } from '@/components/PlayListDetail/PlayListHeader';
import { SongList } from '@/components/PlayListDetail/SongList';
import { RouteProp, useRoute } from '@react-navigation/native';
import { PlayListDetailStackParamList } from '@/types/NavigationType';
import { useMemo } from 'react';

const mockSongs = [
    {
        id: '1',
        title: 'Torauma - 椿',
        artist: '椿',
        cover: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
        quality: '超清母带',
    },
    {
        id: '2',
        title: '幼き自分へ',
        artist: '偽物',
        album: '幼き自分へ',
        cover: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg',
        quality: 'Hi-Res',
    },
    {
        id: '3',
        title: '4H',
        artist: 'Z²',
        album: '4H',
        cover: 'https://images.pexels.com/photos/1616096/pexels-photo-1616096.jpeg',
        quality: '超清母带',
    },
    {
        id: '4',
        title: '君と地球で（地球和你）',
        artist: 'Hayato Yoshida',
        album: 'ボク',
        cover: 'https://images.pexels.com/photos/3721941/pexels-photo-3721941.jpeg',
        quality: '沉浸声',
    },
    {
        id: '5',
        title: 'Jus Like Me (feat. Sekunda)',
        artist: "Kno'Mo'/SEKUNDA",
        cover: 'https://images.pexels.com/photos/1835712/pexels-photo-1835712.jpeg',
    },
    {
        id: '7',
        title: 'Poetry',
        artist: 'GOMESS',
        album: 'てる',
        cover: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
        quality: '超清母带',
    },
    {
        id: '8',
        title: 'Poetry',
        artist: 'GOMESS',
        album: 'てる',
        cover: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
        quality: '超清母带',
    },{
        id: '9',
        title: 'Poetry',
        artist: 'GOMESS',
        album: 'てる',
        cover: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
        quality: '超清母带',
    },{
        id: '10',
        title: 'Poetry',
        artist: 'GOMESS',
        album: 'てる',
        cover: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
        quality: '超清母带',
    },{
        id: '11',
        title: 'Poetry',
        artist: 'GOMESS',
        album: 'てる',
        cover: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
        quality: '超清母带',
    },{
        id: '12',
        title: 'Poetry',
        artist: 'GOMESS',
        album: 'てる',
        cover: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
        quality: '超清母带',
    },{
        id: '13',
        title: 'Poetry',
        artist: 'GOMESS',
        album: 'てる',
        cover: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
        quality: '超清母带',
    },
];

export default function PlayListDetail() {
    const route = useRoute<RouteProp<PlayListDetailStackParamList>>();
    const { id, name, type, createId } = useMemo(() => route.params, [route.params]);
    return (
        <SongList
            songs={mockSongs}
            onSongPress={(song) => console.log('Pressed song:', song.title)}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
});