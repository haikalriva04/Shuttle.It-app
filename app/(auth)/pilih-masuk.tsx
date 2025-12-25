import { images } from "@/constants";
import { router } from "expo-router";
import { Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

const PilihMasuk = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#0097DA] justify-center items-center">
      <View className="w-full px-8 items-center">
        
        {/* Logo */}
        <Image 
            source={images.shuttleItLogo}
            className="w-40 h-40 mb-10"
            resizeMode="contain"
        />

        
        <TouchableOpacity
          onPress={() => router.push("/(auth)/sign-in")}
          className="w-full bg-white py-4 rounded-full items-center shadow-sm"
        >
          <Text className="text-[#0097DA] font-PoppinsBold text-lg">
            Masuk sebagai pengguna
          </Text>
        </TouchableOpacity>

        
        <View className="flex-row items-center my-6 w-full">
            <View className="flex-1 h-[1px] bg-white/50" />
            <Text className="mx-4 text-white font-Poppins text-sm">atau</Text>
            <View className="flex-1 h-[1px] bg-white/50" />
        </View>

    
        <TouchableOpacity
          onPress={() => router.push("/(rootdriver)/(tabsdriver)/driverhomepage")}
          className="w-full bg-white/20 border border-white py-4 rounded-full items-center"
        >
          <Text className="text-white font-PoppinsMedium text-lg">
            Masuk sebagai supir bus
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default PilihMasuk;