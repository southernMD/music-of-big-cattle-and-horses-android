import { CodeEnum } from "@/constants/network"
import { Playlist } from "../PlayList"
import { Song, SongPrivilege } from '@/types/Song'
export type PlayListType = {
    code: CodeEnum,
    playlist:Playlist,
    privileges:Array<SongPrivilege>
}

export type PlaylistTrackType = {
    code: CodeEnum,
    songs:Array<Song>,
    privileges:Array<SongPrivilege>
}