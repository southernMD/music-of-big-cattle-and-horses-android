import { MusicPlayer } from "@/views/MusicPlayer";
import { CustomHeaderTitle } from "./MusicPlayerHeader";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MusicPlayerStackParamList } from "@/types/NavigationType";

export const MusicPlayerStack = createNativeStackNavigator<MusicPlayerStackParamList>({
  screens: {
    MusicPlayer: {
      screen: MusicPlayer,
      options: {
        headerLeft:()=> <></>, 
        headerTintColor: '#66ccff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitle: () => <CustomHeaderTitle/>,
      },
    },
  },
});
