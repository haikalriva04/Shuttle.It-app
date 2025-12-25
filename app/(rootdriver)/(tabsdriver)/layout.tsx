import { icons } from "@/constants";
import { Tabs } from "expo-router";
import { Image, View } from "react-native";

const DriverTabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#333333",
          borderRadius: 50,
          marginBottom: 20,
          marginHorizontal: 20,
          height: 78,
          position: "absolute",
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="driverhomepage"
        options={{
          title: "Scan",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View className={`items-center justify-center rounded-full w-12 h-12 ${focused ? "bg-[#0097DA]" : ""}`}>
              <Image
                source={icons.point}
                resizeMode="contain"
                className="w-7 h-7"
                style={{ tintColor: "white" }}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

export default DriverTabsLayout;