import { icons, images } from "@/constants";
import { router } from "expo-router";
import { Image, ImageBackground, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

const JadwalPaskal = () => {
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
              Jadwal @ Bandung Paskal
            </Text>
          </View>
          
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default JadwalPaskal;