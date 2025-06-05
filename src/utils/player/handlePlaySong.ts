import { Song } from '@/types/Song';
import { djItemSong } from '@/types/api/djItem';
import { useMusicPlayer } from '@/store';
import { SongDetail } from '@/api';

/**
 * 处理歌曲播放逻辑
 * 
 * @description 该函数处理单曲播放逻辑，根据不同类型（普通歌曲或电台节目）执行相应的播放操作。
 * 主要功能包括：
 * 1. 检查歌曲是否已在播放列表中
 * 2. 对于普通歌曲，获取详细信息并添加到播放列表
 * 3. 对于电台节目，直接添加到播放列表
 * 4. 更新当前播放索引和ID
 * 
 * @param song - 要播放的歌曲或电台节目对象
 * @param type - 内容类型，可以是 'playList'（普通歌曲）或 'dj'（电台节目）
 * @returns Promise<void> - 异步操作完成的Promise
 * 
 * @example
 * // 播放普通歌曲
 * await handlePlaySong(songObject, 'playList');
 * 
 * // 播放电台节目
 * await handlePlaySong(djProgramObject, 'dj');
 */
export const handlePlaySong = async (song: Song | djItemSong, type: 'dj' | 'playList'): Promise<void> => {
    console.log('Pressed song:', song.name);
    
    //以下实现的是将歌曲添加到播放列表并播放
    if(true){
        const indexInPlayingList = useMusicPlayer.playingList.findIndex((item) => item.id === song.id);
        
        if (type === 'playList') {
            if (indexInPlayingList === -1) {
                // 歌曲不在播放列表中，获取详情并添加
                await SongDetail([song.id]).then(({ privileges, songs }) => {
                    const newIndex = useMusicPlayer.playingIndex + 1;
                    useMusicPlayer.playingIndex = newIndex;
                    useMusicPlayer.playingList.splice(newIndex, 0, ...songs);
                    useMusicPlayer.playingPrivileges.splice(newIndex, 0, ...privileges);
                });
            } else {
                // 歌曲已在播放列表中，直接切换到该索引
                useMusicPlayer.playingIndex = indexInPlayingList;
            }
            // 设置播放列表ID为-1（表示自定义播放列表）
            useMusicPlayer.PlayingListId = -1;
            useMusicPlayer.playingId = song.id;
        } else if (type === 'dj') {
            if (indexInPlayingList === -1) {
                // 电台节目不在播放列表中，添加到列表
                (song as djItemSong).id = (song as djItemSong).mainTrackId;
                
                const newIndex = useMusicPlayer.playingIndex + 1;
                useMusicPlayer.playingIndex = newIndex;
                useMusicPlayer.playingList.splice(newIndex, 0, song);
                
                // 添加权限信息
                useMusicPlayer.playingPrivileges.splice(newIndex, 0, {
                    id: (song as djItemSong).mainTrackId,
                    maxBrLevel: "DJ",
                    playMaxBrLevel: "DJ",
                    downloadMaxBrLevel: "DJ",
                    plLevel: "DJ",
                    dlLevel: "DJ",
                    flLevel: "DJ",
                } as any);
                
                useMusicPlayer.PlayingListId = -1;
                useMusicPlayer.playingId = song.id;
            } else {
                // 电台节目已在播放列表中，直接切换到该索引
                useMusicPlayer.playingIndex = indexInPlayingList;
            }
        }
    } else {
        //歌单全部歌曲添加到播放列表
        useMusicPlayer.PlayingListId = song.id;
    }
}; 