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
        
        <SafeAreaView className="flex-1 px-5">
       
          
          <View className="flex-row justify-between items-center mt-2 mb-6">
           
            <Image
              source={logo}
              className="w-32 h-20"
            />
            

            <TouchableOpacity onPress={handleSignOut}>
                <Image source={icons.out} className="w-15 h-15" />
            </TouchableOpacity>
          </View>

          <View>
            <Text className="text-white text-lg font-PoppinsBold">
              Halo {user?.emailAddresses[0].emailAddress}
            </Text>
            <Text className="text-white text-base font-PoppinsLight">
              Hari ini mau pergi ke kampus mana ?
            </Text>
          </View>
        </SafeAreaView>
    </ImageBackground>
  );
}