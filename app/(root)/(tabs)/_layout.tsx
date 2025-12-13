import { icons } from "@/constants";
import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View } from "react-native";


const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => (
  <View
    className={`flex flex-row justify-center items-center rounded-full ${focused ? "bg-general-300" : ""}`}
  >
    <View
      className={`rounded-full w-8 h-8 items-center justify-center ${focused ? "bg-sky-400" : ""}`}
    >
      <Image
        source={source}
        tintColor="white"
        resizeMode="contain"
        className="w-8 h-8"
      />
    </View>
  </View>
);

const Layout = () => (
    <Tabs initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "#000000",
          overflow: "hidden",
          height: 78,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
          position: "absolute",
        },
      }}>
    <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.homeIcon} focused={focused} />
          ),
        }}
    />
       <Tabs.Screen
        name="recentbookings"
        options={{
          title: "Recent Bookings",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.bookingTicket} focused={focused} />
          ),
        }}
    />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.myAccountIcon} focused={focused} />
          ),
        }}
    />
    </Tabs>
);

export default Layout;