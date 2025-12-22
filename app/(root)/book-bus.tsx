import BookLayout from "@/components/BookLayout";
import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Modal, Platform, Text, TouchableOpacity, View } from "react-native";

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

const LOCATION_LABELS: Record<string, string> = {
    "BINUS @ Alam Sutera Campus": "Alam Sutera",
    "BINUS Anggrek Campus": "Anggrek",
    "BINUS @ Bekasi": "Bekasi",
};

// Interface untuk data jadwal dari API
interface ScheduleItem {
    time: string;
    seats_available: number;
    is_full: boolean;
}

const BookBus = () => {
    const { userAddress, destinationAddress, setDestinationLocation, setUserLocation } = useLocationStore();

    const [date, setDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimeModal, setShowTimeModal] = useState(false);

    // State baru untuk data API
    const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Filter Lokasi Asal
    const validOrigins = useMemo(() => {
        if (!destinationAddress) return BINUS_LOCATIONS;
        if (destinationAddress.includes("Alam Sutera")) {
            return BINUS_LOCATIONS.filter(loc => loc.description === "BINUS Anggrek Campus");
        }
        if (destinationAddress.includes("Anggrek")) {
            return BINUS_LOCATIONS.filter(loc => loc.description === "BINUS @ Alam Sutera Campus" || loc.description === "BINUS @ Bekasi");
        }
        if (destinationAddress.includes("Bekasi")) {
            return BINUS_LOCATIONS.filter(loc => loc.description === "BINUS Anggrek Campus");
        }
        return BINUS_LOCATIONS;
    }, [destinationAddress]);

    // Fetch API setiap kali parameter berubah (Asal, Tujuan, Tanggal)
    useEffect(() => {
        const fetchSchedules = async () => {
            if (!userAddress || !destinationAddress) return;
            
            setIsLoading(true);
            setSchedules([]); // Reset jadwal saat loading
            setSelectedTime(null); // Reset pilihan jam

            try {
                // Format YYYY-MM-DD
                const dateStr = date.toISOString().split('T')[0];
                
                const response = await fetch(
                    `/(api)/trips?origin=${encodeURIComponent(userAddress)}&destination=${encodeURIComponent(destinationAddress)}&date=${dateStr}`
                );
                const json = await response.json();

                if (json.data) {
                    setSchedules(json.data);
                }
            } catch (error) {
                console.error("Error fetching schedules:", error);
                Alert.alert("Gagal memuat jadwal", "Periksa koneksi internet Anda.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchedules();
    }, [userAddress, destinationAddress, date]);


    const onDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') setShowDatePicker(false);
        if (event.type === 'set' && selectedDate) {
            setDate(selectedDate);
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
                // Kirim juga parameter ini untuk mempermudah di halaman confirm
                origin: userAddress,
                destination: destinationAddress
            }
        });
    };

    const handleQuickSelect = (loc: typeof BINUS_LOCATIONS[0], type: 'origin' | 'destination') => {
        const locationData = {
            latitude: loc.geometry.location.lat,
            longitude: loc.geometry.location.lng,
            address: loc.description,
        };
        if (type === 'destination') {
            setDestinationLocation(locationData);
            setUserLocation({ latitude: 0, longitude: 0, address: "" });
        } else {
            setUserLocation(locationData);
        }
    };

    return (
        <BookLayout title="Booking Bus">
            
            {/* 1. Kampus Tujuan */}
            <View className="mb-6">
                <Text className="text-lg font-PoppinsSemiBold mb-1">Kampus Tujuan</Text>
                <GoogleTextInput 
                    icon={icons.destination} 
                    initialLocation={destinationAddress!}
                    containerStyle="bg-white shadow-md shadow-neutral-300" 
                    handlePress={(location) => {
                        setDestinationLocation(location);
                        setUserLocation({ latitude: 0, longitude: 0, address: "" });
                    }}
                    initialPlaces={BINUS_LOCATIONS} 
                />
                <View className="flex-row gap-3 mt-[-15px]">
                    {BINUS_LOCATIONS.map((loc) => (
                        <TouchableOpacity
                            key={loc.description}
                            onPress={() => handleQuickSelect(loc, 'destination')}
                            className={`flex-1 p-3 rounded-xl shadow-md shadow-neutral-300 items-center justify-center 
                                ${destinationAddress === loc.description ? "bg-blue-500" : "bg-white"}`}
                        >
                            <Text className={`font-bold text-sm ${destinationAddress === loc.description ? "text-white" : "text-black"}`}>
                                {LOCATION_LABELS[loc.description]}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* 2. Kampus Asal */}
            <View className="mb-6">
                <Text className="text-lg font-PoppinsSemiBold mb-1">Kampus Asal</Text>
                <GoogleTextInput 
                    icon={icons.pickupPin} 
                    initialLocation={userAddress!}
                    containerStyle="bg-white shadow-md shadow-neutral-300" 
                    handlePress={(location) => setUserLocation(location)}
                    initialPlaces={validOrigins} 
                />
                <View className="flex-row gap-3 mt-[-15px]">
                    {validOrigins.length > 0 ? (
                        validOrigins.map((loc) => (
                            <TouchableOpacity
                                key={loc.description}
                                onPress={() => handleQuickSelect(loc, 'origin')}
                                className={`flex-1 p-3 rounded-xl shadow-md shadow-neutral-300 items-center justify-center 
                                    ${userAddress === loc.description ? "bg-blue-500" : "bg-white"}`}
                            >
                                <Text className={`font-bold text-sm ${userAddress === loc.description ? "text-white" : "text-black"}`}>
                                    {LOCATION_LABELS[loc.description]}
                                </Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text className="text-gray-500 italic text-sm ml-1">Pilih tujuan terlebih dahulu</Text>
                    )}
                </View>
            </View>

            {/* 3. Jadwal */}
            <View className="my-3">
                <Text className="text-lg font-PoppinsSemiBold mb-1">Jadwal Keberangkatan</Text>
                <View className="flex-row justify-between gap-3">
                    <TouchableOpacity 
                        onPress={() => setShowDatePicker(true)}
                        className="flex-1 bg-white p-3 rounded-xl flex-row items-center justify-center shadow-md shadow-neutral-300"
                    >
                        <Image source={icons.schedule} className="w-5 h-5 mr-2" resizeMode="contain" tintColor="black"/>
                        <Text className="font-PoppinsMedium text-sm text-black">
                            {date.toLocaleDateString()}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => {
                            if (!userAddress || !destinationAddress) Alert.alert("Pilih Rute", "Silakan pilih kampus asal dan tujuan.");
                            else setShowTimeModal(true);
                        }}
                        className={`flex-1 p-3 rounded-xl flex-row items-center justify-center shadow-md shadow-neutral-300 bg-white`}
                    >
                         <Image source={icons.clock} className="w-5 h-5 mr-2" resizeMode="contain" tintColor="black"/>
                        <Text className="font-PoppinsMedium text-sm text-black">
                            {selectedTime || "Pilih Jam"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {showDatePicker && (
                    <DateTimePicker value={date} mode="date" is24Hour={true} display="default" onChange={onDateChange} />
                )}

                <Modal visible={showTimeModal} transparent={true} animationType="slide" onRequestClose={() => setShowTimeModal(false)}>
                    <View className="flex-1 justify-end bg-black/50">
                        <View className="bg-white rounded-t-3xl p-5 h-[60%]">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-lg font-PoppinsBold">Pilih Jam</Text>
                                <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                                    <Image source={icons.close} className="w-6 h-6" />
                                </TouchableOpacity>
                            </View>

                            {isLoading ? (
                                <ActivityIndicator size="large" color="#0286FF" />
                            ) : (
                                <FlatList 
                                    data={schedules}
                                    keyExtractor={(item) => item.time}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity 
                                            disabled={item.is_full}
                                            onPress={() => { setSelectedTime(item.time); setShowTimeModal(false); }}
                                            className={`p-4 mb-3 rounded-xl border flex-row justify-between items-center
                                                ${item.is_full ? "bg-gray-100 border-gray-200" : 
                                                  selectedTime === item.time ? "bg-blue-100 border-blue-500" : "bg-neutral-50 border-neutral-200"}`}
                                        >
                                            <View>
                                                <Text className={`font-PoppinsMedium ${selectedTime === item.time ? "text-blue-600" : "text-black"} ${item.is_full && "text-gray-400"}`}>
                                                    {item.time}
                                                </Text>
                                            </View>
                                            <View className="flex-row items-center">
                                                <Text className={`text-xs font-bold mr-1 ${item.is_full ? "text-red-500" : "text-green-600"}`}>
                                                    {item.is_full ? "PENUH" : `${item.seats_available} Kursi`}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    ListEmptyComponent={() => (
                                        <Text className="text-center text-gray-500 mt-5">
                                            Tidak ada jadwal tersedia untuk rute/tanggal ini.
                                        </Text>
                                    )}
                                />
                            )}
                        </View>
                    </View>
                </Modal>
            </View>

            <View className="mt-5 mb-10">
                <CustomButton 
                    title="Book Bus"
                    onPress={handleBook}
                    className="w-full shadow-md shadow-neutral-400"
                />
            </View>
        </BookLayout>
    );
};

export default BookBus;