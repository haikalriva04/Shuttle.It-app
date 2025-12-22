import Map from "@/components/Map";
import { icons } from "@/constants";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useRef } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const BookLayout = ({ title, children }: { title: string;
     children: React.ReactNode;
    }) => {
        const bottomSheetRef = useRef<BottomSheet>(null);


    return(
            <GestureHandlerRootView>
                <View className="flex-1 bg-white">
                    <View className="flex flex-col h-screen bg-blue-500">
                        <View className="flex flex-row absolute z-10 top-16 items-center justify-start px-5">
                    <TouchableOpacity onPress={() => router.back()}>
                        <View className="w-10 h-10 bg-black rounded-full items-center justify-center"> 
                            <Image source={icons.backArrowLight}
                            resizeMode="contain" className="w-6 h-6" />
                        </View>
                    </TouchableOpacity>
                        <Text className="text-xl font-PoppinsSemiBold text-white ml-5">
                            {title || "Kembali"}
                        </Text>

                        
                        </View>
                        <Map />
                    </View>
                    <BottomSheet keyboardBehavior="extend" ref={bottomSheetRef} snapPoints={["50%", "85%"]} 
                    index={0}>
                        <BottomSheetScrollView style={{flex: 1, padding: 20}}>
                            {children}
                        </BottomSheetScrollView>
                    </BottomSheet>
                </View>
            </GestureHandlerRootView>


    );
};
export default BookLayout;