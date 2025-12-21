import BookLayout from "@/components/BookLayout";
import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Image, Modal, Platform, Text, TouchableOpacity, View } from "react-native";


const BINUS_LOCATIONS = [
    {
        description: "BINUS @ Alam Sutera Campus",
        geometry: { location: { lat: -6.223078756118827, lng: 106.64897587120757 } },
    },
    {
        description: "BINUS Anggrek Campus",
        geometry: { location: { lat: -6.201572320039744, lng: 106.78222123830047 } },
    },
    {
        description: "BINUS @ Bekasi",
        geometry: { location: { lat: -6.21946951140796, lng: 106.99979693819046 } },
    },
];


const SCHEDULES: Record<string, { [key: string]: string[] }> = {
    // Rute: Binus Anggrek -> Binus Alam Sutera
    "BINUS Anggrek Campus-BINUS @ Alam Sutera Campus": {
        "Mon-Thu": ["06:05 AM", "07:30 AM", "10:10 AM", "12:10 PM", "14:10 PM", "15:30 PM", "17:30 PM"],
        "Fri":     ["06:05 AM", "07:30 AM", "10:10 AM", "12:40 PM", "14:10 PM", "15:30 PM", "17:30 PM"],
        "Sat":     ["06:05 AM", "07:30 AM", "10:10 AM", "12:10 PM", "15:30 PM"],
    },
    // Rute: Binus Alam Sutera -> Binus Anggrek
    "BINUS @ Alam Sutera Campus-BINUS Anggrek Campus": {
        "Mon-Thu": ["07:30 AM", "09:30 AM", "11:30 AM", "13:30 PM", "15:30 PM", "17:30 PM", "19:10 PM"],
        "Fri":     ["07:30 AM", "09:30 AM", "11:10 AM", "13:30 PM", "15:30 PM", "17:30 PM", "19:10 PM"],
        "Sat":     ["07:30 AM", "11:30 AM", "13:30 PM", "15:30 PM", "17:10 PM"],
    },
    // Rute: Binus Bekasi -> Binus Anggrek
    "BINUS @ Bekasi-BINUS Anggrek Campus": {
        "Mon-Thu": ["07:30 AM", "15:30 PM", "19:10 PM"],
        "Fri":     ["07:30 AM", "13:30 PM", "19:10 PM"],
        "Sat":     ["07:30 AM", "17:10 PM"],
    },
    // Rute: Binus Anggrek -> Binus Bekasi
    "BINUS Anggrek Campus-BINUS @ Bekasi": {
        "Mon-Thu": ["06:00 AM", "09:30 AM", "17:10 PM"],
        "Fri":     ["06:00 AM", "11:10 AM", "17:10 PM"],
        "Sat":     ["06:00 AM", "11:10 AM"],
    },
};

const BookBus = () => {
    const { 
        userAddress, 
        destinationAddress, 
        setDestinationLocation, 
        setUserLocation 
    } = useLocationStore();

    const [date, setDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    
    
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimeModal, setShowTimeModal] = useState(false);

    
    const validOrigins = useMemo(() => {
        if (!destinationAddress) return BINUS_LOCATIONS;

        
        if (destinationAddress.includes("Alam Sutera")) {
            return BINUS_LOCATIONS.filter(loc => loc.description === "BINUS Anggrek Campus");
        }
        
        if (destinationAddress.includes("Anggrek")) {
            return BINUS_LOCATIONS.filter(loc => 
                loc.description === "BINUS @ Alam Sutera Campus" || 
                loc.description === "BINUS @ Bekasi"
            );
        }
        
        if (destinationAddress.includes("Bekasi")) {
            return BINUS_LOCATIONS.filter(loc => loc.description === "BINUS Anggrek Campus");
        }
        
        return BINUS_LOCATIONS;
    }, [destinationAddress]);

    
    useEffect(() => {
        if (userAddress && validOrigins.length > 0) {
            const isValid = validOrigins.some(loc => loc.description === userAddress);
            if (!isValid) {
                // Opsional: Reset atau biarkan user memilih ulang
                // setUserLocation({ latitude: 0, longitude: 0, address: "" }); 
            }
        }
    }, [destinationAddress, validOrigins]);

    
    const availableTimes = useMemo(() => {
        if (!userAddress || !destinationAddress) return [];

        const routeKey = `${userAddress}-${destinationAddress}`;
        const schedule = SCHEDULES[routeKey];

        if (!schedule) return [];

        const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

        if (dayOfWeek >= 1 && dayOfWeek <= 4) return schedule["Mon-Thu"];
        if (dayOfWeek === 5) return schedule["Fri"];
        if (dayOfWeek === 6) return schedule["Sat"];
        
        return []; 
    }, [userAddress, destinationAddress, date]);

    
    useEffect(() => {
        if (selectedTime && !availableTimes.includes(selectedTime)) {
            setSelectedTime(null);
        }
    }, [availableTimes]);

    const onDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (event.type === 'set' && selectedDate) {
            setDate(selectedDate);
            setSelectedTime(null); 
        }
    };

    const handleBook = () => {
        if (!userAddress || !destinationAddress) {
            Alert.alert("Error", "Mohon pilih lokasi asal dan tujuan.");
            return;
        }
        if (!selectedTime) {
            Alert.alert("Error", "Mohon pilih jadwal keberangkatan.");
            return;
        }

        
        router.push({
            pathname: "/(root)/confirm-book",
            params: { 
                date: date.toISOString(),
                timeSlot: selectedTime, 
            }
        });
    };

    return (
        <BookLayout title="Booking Bus">
            
            {/* Input 1: Kampus Tujuan (Dipilih Dulu) */}
            <View className="my-3">
                <Text className="text-lg font-PoppinsSemiBold mb-1">Kampus Tujuan</Text>
                <GoogleTextInput 
                    icon={icons.destination} 
                    initialLocation={destinationAddress!}
                    containerStyle="bg-neutral-100" 
                    textInputBackgroundColor="transparent"
                    handlePress={(location) => {
                        setDestinationLocation(location);
                        
                        setUserLocation({ latitude: 0, longitude: 0, address: "" });
                    }}
                    initialPlaces={BINUS_LOCATIONS} 
                />
            </View>

            {/* Input 2: Kampus Asal (Difilter berdasarkan Tujuan) */}
            <View className="my-3">
                <Text className="text-lg font-PoppinsSemiBold mb-1">Kampus Asal</Text>
                <GoogleTextInput 
                    icon={icons.pickupPin} 
                    initialLocation={userAddress!}
                    containerStyle="bg-neutral-100" 
                    textInputBackgroundColor="#f5f5f5"
                    handlePress={(location) => setUserLocation(location)}
                    initialPlaces={validOrigins} 
                />
            </View>

            {/* Input 3: Jadwal (Date & Time) */}
            <View className="my-3">
                <Text className="text-lg font-PoppinsSemiBold mb-1">Jadwal Keberangkatan</Text>
                <View className="flex-row justify-between gap-3">
                    {/* Tombol Pilih Tanggal */}
                    <TouchableOpacity 
                        onPress={() => setShowDatePicker(true)}
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

                    {/* Tombol Pilih Jam (Modal) */}
                    <TouchableOpacity 
                        onPress={() => {
                            if (!userAddress || !destinationAddress) {
                                Alert.alert("Pilih Rute", "Silakan pilih kampus asal dan tujuan terlebih dahulu.");
                            } else if (availableTimes.length === 0) {
                                Alert.alert("Jadwal Kosong", "Tidak ada jadwal tersedia untuk rute/hari ini (Minggu Libur).");
                            } else {
                                setShowTimeModal(true);
                            }
                        }}
                        className={`flex-1 p-3 rounded-full flex-row items-center justify-center shadow-sm shadow-neutral-300 ${availableTimes.length === 0 ? "bg-neutral-200" : "bg-neutral-100"}`}
                    >
                         <Image 
                            source={icons.clock} 
                            className="w-5 h-5 mr-2" 
                            resizeMode="contain"
                            tintColor={availableTimes.length === 0 ? "gray" : "black"}
                        />
                        <Text className={`font-PoppinsMedium text-sm ${availableTimes.length === 0 ? "text-gray-500" : "text-black"}`}>
                            {selectedTime || "Pilih Jam"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Native Date Picker */}
                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={onDateChange}
                        // Batasi tanggal min hari ini? Opsional: minimumDate={new Date()}
                    />
                )}

                {/* Custom Time Picker Modal */}
                <Modal
                    visible={showTimeModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowTimeModal(false)}
                >
                    <View className="flex-1 justify-end bg-black/50">
                        <View className="bg-white rounded-t-3xl p-5 h-[50%]">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-lg font-PoppinsBold">Pilih Jam Keberangkatan</Text>
                                <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                                    <Image source={icons.close} className="w-6 h-6" />
                                </TouchableOpacity>
                            </View>
                            
                            <FlatList 
                                data={availableTimes}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity 
                                        onPress={() => {
                                            setSelectedTime(item);
                                            setShowTimeModal(false);
                                        }}
                                        className={`p-4 mb-3 rounded-xl border ${selectedTime === item ? "bg-blue-100 border-blue-500" : "bg-neutral-50 border-neutral-200"}`}
                                    >
                                        <Text className={`text-center font-PoppinsMedium ${selectedTime === item ? "text-blue-600" : "text-black"}`}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={() => (
                                    <Text className="text-center text-gray-500 mt-5">Tidak ada jadwal tersedia.</Text>
                                )}
                            />
                        </View>
                    </View>
                </Modal>
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