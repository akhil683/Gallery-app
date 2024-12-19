import { Link, Redirect, Tabs } from "expo-router";
import { HeaderButton } from '../../components/HeaderButton';
import { AntDesign } from "@expo/vector-icons";
import { useAuth } from "~/providers/AuthProvider";



export default function TabLayout() {
  const { user } = useAuth()
  console.log(user)

  if (!user) return <Redirect href={"/(auth)/login"} />

  return (
    <Tabs
      screenOptions={{
        tabBarInactiveBackgroundColor: "#111",
        tabBarActiveBackgroundColor: "#111",
        tabBarInactiveTintColor: "white",
        tabBarActiveTintColor: "yellow",
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 0,
        }
      }}>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
          headerRight: () => (
            <Link href='/modal' asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

