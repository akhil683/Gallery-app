import { MediaContextProvider } from '~/providers/MediaProvider';
import '../global.css';
import { Stack } from "expo-router";
import AuthContextProvider from '~/providers/AuthProvider';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

export default function RootLayout() {


  return (
    <AuthContextProvider>
      <MediaContextProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            statusBarBackgroundColor: 'black',
            presentation: "fullScreenModal",
            contentStyle: {
              backgroundColor: "black",
            }
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              presentation: "fullScreenModal",
              statusBarBackgroundColor: 'black',
            }}
          />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </MediaContextProvider>
    </AuthContextProvider>
  );
}
