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
        className="w-7 h-7"
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
          backgroundColor: "#333333",
          overflow: "hidden",
          height: 61,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
        name="campusinfo"
        options={{
          title: "Campus Info",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.Info} focused={focused} />
          ),
        }}
    />
      <Tabs.Screen
        name="myaccount"
        options={{
          title: "My Account",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.myAccountIcon} focused={focused} />
          ),
        }}
    />
    </Tabs>
);

export default Layout;