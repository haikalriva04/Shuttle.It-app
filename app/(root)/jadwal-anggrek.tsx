import { icons, images } from "@/constants";
import { router } from "expo-router";
import { FlatList, Image, ImageBackground, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

const JadwalAnggrek = () => {
  const scheduleImages = [images.jadwalAnggrek, images.jadwalBekasi];

  return (
    <ImageBackground
      source={images.backgroundShuttleit}
      resizeMode="cover"
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-transparent">
        <View className="flex-row items-center px-5 pt-10 mb-7">
             <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Image source={icons.backArrowLight} className="w-8 h-8" resizeMode="contain" />
            </TouchableOpacity>
            <Text className="text-lg font-PoppinsSemiBold text-white">
              Jadwal @ Kemanggisan Anggrek
            </Text>
        </View>

        <FlatList
          data={scheduleImages}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          ListHeaderComponent={() => (
            <View className="mb-1 mt-2">
              
              <View className="bg-black/75 p-6 rounded-xl">
                <Text className="text-white font-PoppinsSemiBold text-center text-sm">
                  Tersedia 2 Jalur (Anggrek → Alam Sutera) (Anggrek → Bekasi)
                </Text>
              </View>
            </View>
          )}
          renderItem={({ item }) => (
            <View className="mb-1 items-center">
              <Image
                source={item}
                className="w-full h-[500px]"
                resizeMode="contain"
              />
            </View>
          )}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default JadwalAnggrek;