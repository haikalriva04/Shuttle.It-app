import { icons, images } from "@/constants";
import { router } from "expo-router";
import { Image, ImageBackground, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

const JadwalAlsut = () => {
  return (
    <ImageBackground
      source={images.backgroundShuttleit}
      resizeMode="cover"
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-transparent">
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          
          <View className="flex-row items-center px-5 pt-10 mb-7">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Image source={icons.backArrowLight} className="w-8 h-8" resizeMode="contain" />
            </TouchableOpacity>
            <Text className="text-lg font-PoppinsSemiBold text-white">
              Jadwal @ Alam Sutera
            </Text>
          </View>

          
          <View className="mx-5 mb-1 bg-black/75 p-4 rounded-xl">
            <Text className="text-white font-PoppinsSemiBold text-center text-sm">
              Tersedia 1 Jalur (Alam Sutera → Anggrek)
            </Text>
          </View>

          
          <View className="items-center px-5">
            <Image
              source={images.jadwalAnggrek} 
              className="w-full h-[500px]"
              resizeMode="contain"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default JadwalAlsut;