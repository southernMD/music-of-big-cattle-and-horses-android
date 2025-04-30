import { CodeEnum } from "@/constants/network"
import { Playlist } from "../PlayList"

export type PlayListType = {
    code: CodeEnum,
    playlist:Playlist,
    privileges:any[]
}