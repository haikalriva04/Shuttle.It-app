import { useClerk, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants";
import background from "../../../assets/images/background-shuttleit.png";
import logo from "../../../assets/images/shuttleit-logo.png";

export default function Page() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <ImageBackground
        source={background}
        style={{ flex: 1 }}
    >
        {/* Changed paddingHorizontal to px-5 (approx 20px) for better spacing */}
        <SafeAreaView className="flex-1 px-5">
       
          {/* Header Row: Added mt-2 for top spacing and mb-6 to separate from text */}
          <View className="flex-row justify-between items-center mt-2 mb-6">
            {/* Adjusted logo size to be rectangular (wider than it is tall) */}
            <Image
              source={logo}
              className="w-32 h-20"
            />
            
            {/* Adjusted button size to standard icon dimensions */}
            <TouchableOpacity onPress={handleSignOut}>
                <Image source={icons.out} className="w-15 h-15" />
            </TouchableOpacity>
          </View>

          <View>
            <Text className="text-white text-lg font-PoppinsBold">
              Halo {user?.emailAddresses[0].emailAddress}
            </Text>
            <Text className="text-white text-base font-PoppinsLight">
              Hari ini kamu mau pergi kemana ?
            </Text>
          </View>
        </SafeAreaView>
    </ImageBackground>
  );
}