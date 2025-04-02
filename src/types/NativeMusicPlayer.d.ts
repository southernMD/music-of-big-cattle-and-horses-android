interface HeadlessTaskMusicPlayer {
    taskId:number
    taskKey:string,
    payload: {
      mp3FileName:string
      playerStatus: string,
      taskId:number,
      playWay:'native' | 'online'
    },
}