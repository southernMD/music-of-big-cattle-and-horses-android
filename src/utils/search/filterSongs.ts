import { Song } from '@/types/Song';
import { djItemSong } from '@/types/api/djItem';
import * as wanakana from 'wanakana';
import { pinyin } from 'pinyin-pro';

/**
 * 过滤歌曲列表
 * 
 * @description 根据搜索查询过滤歌曲列表，支持拼音和罗马音查询
 * 对于普通歌曲(playList)，搜索歌曲名称、艺术家名称和专辑名称
 * 对于电台节目(dj)，搜索节目名称和电台名称
 * 
 * @param songList - 要过滤的歌曲列表
 * @param query - 搜索查询字符串
 * @returns 过滤后的歌曲列表，如果没有查询参数则返回空列表
 */
export const filterSongs = (songList: (Song | djItemSong)[], query: string): (Song | djItemSong)[] => {
    if (!query || query.trim() === '') {
        return []; // 在没有查询参数时返回空列表
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    const romajiQuery = wanakana.toRomaji(normalizedQuery).toLowerCase();

    return songList.filter(song => {
        // 检查歌曲是普通歌曲还是电台节目
        if ('ar' in song) {
            // 普通歌曲 (Song)
            // 搜索歌曲名称
            const songName = song.name.toLowerCase();
            // 转换为拼音，使用 pinyin-pro
            const songNamePinyin = pinyin(songName, { toneType: 'none', type: 'array' }).join('').toLowerCase();
            const songNameRomaji = wanakana.toRomaji(songName).toLowerCase();
            
            if (
                songName.includes(normalizedQuery) ||
                songNamePinyin.includes(normalizedQuery) ||
                songNameRomaji.includes(romajiQuery)
            ) {
                return true;
            }
            
            // 搜索艺术家名称
            const artistMatch = song.ar.some(artist => {
                const artistName = artist.name.toLowerCase();
                // 转换为拼音，使用 pinyin-pro
                const artistNamePinyin = pinyin(artistName, { toneType: 'none', type: 'array' }).join('').toLowerCase();
                const artistNameRomaji = wanakana.toRomaji(artistName).toLowerCase();
                
                return (
                    artistName.includes(normalizedQuery) ||
                    artistNamePinyin.includes(normalizedQuery) ||
                    artistNameRomaji.includes(romajiQuery)
                );
            });
            
            if (artistMatch) {
                return true;
            }
            
            // 搜索专辑名称
            const albumName = song.al.name.toLowerCase();
            // 转换为拼音，使用 pinyin-pro
            const albumNamePinyin = pinyin(albumName, { toneType: 'none', type: 'array' }).join('').toLowerCase();
            const albumNameRomaji = wanakana.toRomaji(albumName).toLowerCase();
            
            return (
                albumName.includes(normalizedQuery) ||
                albumNamePinyin.includes(normalizedQuery) ||
                albumNameRomaji.includes(romajiQuery)
            );
        } else {
            // 电台节目 (djItemSong)
            // 搜索节目名称
            const programName = song.name.toLowerCase();
            // 转换为拼音，使用 pinyin-pro
            const programNamePinyin = pinyin(programName, { toneType: 'none', type: 'array' }).join('').toLowerCase();
            const programNameRomaji = wanakana.toRomaji(programName).toLowerCase();
            
            if (
                programName.includes(normalizedQuery) ||
                programNamePinyin.includes(normalizedQuery) ||
                programNameRomaji.includes(romajiQuery)
            ) {
                return true;
            }
            
            // 搜索电台名称 (如果有)
            if (song.radio && song.radio.name) {
                const radioName = song.radio.name.toLowerCase();
                // 转换为拼音，使用 pinyin-pro
                const radioNamePinyin = pinyin(radioName, { toneType: 'none', type: 'array' }).join('').toLowerCase();
                const radioNameRomaji = wanakana.toRomaji(radioName).toLowerCase();
                
                return (
                    radioName.includes(normalizedQuery) ||
                    radioNamePinyin.includes(normalizedQuery) ||
                    radioNameRomaji.includes(romajiQuery)
                );
            }
            
            return false;
        }
    });
}; 