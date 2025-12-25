import { icons } from "@/constants";
import { Tabs } from "expo-router";
import { Image, View } from "react-native";

const DriverTabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // PENTING: Hilangkan header default Tabs
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#333333",
          borderRadius: 50,
          marginBottom: 20,
          marginHorizontal: 20,
          height: 78,
          position: "absolute",
          borderTopWidth: 0, // Hilangkan garis border atas default
        },
      }}
    >
      <Tabs.Screen
        name="driverhomepage"
        options={{
          title: "Scan",
          headerShown: false, // Double check: matikan header per screen juga
          tabBarIcon: ({ focused }) => (
            <View className={`items-center justify-center rounded-full w-12 h-12 ${focused ? "bg-[#0097DA]" : ""}`}>
              <Image
                source={icons.point} // Ganti dengan icon yang sesuai (misal qr-code icon)
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