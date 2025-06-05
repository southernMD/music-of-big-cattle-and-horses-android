import { PlayListDetailStackParamList } from "@/types/NavigationType";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PlayListDetailHeader } from "./PlayListDetailHeader";
import PlayListDetail from "@/views/PlayListDetail";
import SongListSearch from "@/views/SongListSearch/SongListSearch";
import { useTheme } from "@/hooks/useTheme";
import { SongListSearchHeader } from "./SongListSearchHeader";

const Stack = createNativeStackNavigator<PlayListDetailStackParamList>();

export const PlayListDetailStack = () => {
  const { box,typography } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTintColor:typography.colors.large.default,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        animation: 'slide_from_right',
        animationDuration: 300,
      }}
    >
      <Stack.Screen
        name="PlayListDetailHome"
        component={PlayListDetail}
        options={{
          headerStyle: {
            backgroundColor: box.background.deep,
          },
          headerTitle: () => <PlayListDetailHeader />,
        }}
      />
      <Stack.Screen
        name="SongListSearch"
        component={SongListSearch}
        options={{
          animation: 'none',
          headerStyle: {
            backgroundColor: box.background.deep,
          },
          headerTitle: () => <SongListSearchHeader />,
        }}
      />
    </Stack.Navigator>
  );
};