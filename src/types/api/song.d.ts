import { Song, SongUrl } from "../Song"
import { CodeEnum } from "@/constants/network"

export type SongUrlType = {
    code: CodeEnum
    data: [SongUrl]
}

export type SongDetailsType = {
    code: CodeEnum
    songs:Array<Song>
    privileges:Array<SongPrivilege>
}