import BookLayout from "@/components/BookLayout";
import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router"; // Import router
import { useState } from "react";
import { Alert, Image, Platform, Text, TouchableOpacity, View } from "react-native";

const BookBus = () => {
    const { 
        userAddress, 
        destinationAddress, 
        setDestinationLocation, 
        setUserLocation 
    } = useLocationStore();

    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [mode, setMode] = useState<'date' | 'time'>('date');

    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }
        if (event.type === 'set') {
            setDate(currentDate);
        }
    };

    const showMode = (currentMode: 'date' | 'time') => {
        setMode(currentMode);
        setShowPicker(true);
    };

    const handleBook = () => {
        if (!userAddress || !destinationAddress) {
            Alert.alert("Error", "Please select both pickup and destination locations.");
            return;
        }

        
        router.push({
            pathname: "/(root)/confirm-book",
            params: { 
                date: date.toISOString() 
            }
        });
    };

    return (
        <BookLayout title="Booking Bus">
            <View className="my-3">
                <Text className="text-lg font-PoppinsSemiBold mb-1">Kampus Asal</Text>
                <GoogleTextInput 
                    icon={icons.pickupPin} 
                    initialLocation={userAddress!}
                    containerStyle="bg-neutral-100" 
                    textInputBackgroundColor="#f5f5f5"
                    handlePress={(location) => setUserLocation(location)}
                />
            </View>

            <View className="my-3">
                <Text className="text-lg font-PoppinsSemiBold mb-1">Kampus Tujuan</Text>
                <GoogleTextInput 
                    icon={icons.destination} 
                    initialLocation={destinationAddress!}
                    containerStyle="bg-neutral-100" 
                    textInputBackgroundColor="transparent"
                    handlePress={(location) => setDestinationLocation(location)}
                />
            </View>

            <View className="my-3">
                <Text className="text-lg font-PoppinsSemiBold mb-1">Jadwal Keberangkatan</Text>
                <View className="flex-row justify-between gap-3">
                    <TouchableOpacity 
                        onPress={() => showMode('date')}
                        className="flex-1 bg-neutral-100 p-3 rounded-full flex-row items-center justify-center shadow-sm shadow-neutral-300"
                    >
                        <Image 
                            source={icons.schedule} 
                            className="w-5 h-5 mr-2" 
                            resizeMode="contain"
                            tintColor="black"
                        />
                        <Text className="font-PoppinsMedium text-sm text-black">
                            {date.toLocaleDateString()}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => showMode('time')}
                        className="flex-1 bg-neutral-100 p-3 rounded-full flex-row items-center justify-center shadow-sm shadow-neutral-300"
                    >
                         <Image 
                            source={icons.schedule} 
                            className="w-5 h-5 mr-2" 
                            resizeMode="contain"
                            tintColor="black"
                        />
                        <Text className="font-PoppinsMedium text-sm text-black">
                            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </TouchableOpacity>
                </View>

                {showPicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                        style={{ marginTop: 10 }} 
                    />
                )}
            </View>

            <View className="mt-5 mb-10">
                <CustomButton 
                    title="Book Now"
                    onPress={handleBook}
                    className="w-full"
                />
            </View>
        </BookLayout>
    );
};

export default BookBus;
