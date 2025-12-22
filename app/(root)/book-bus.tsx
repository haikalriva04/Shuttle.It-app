import BookLayout from "@/components/BookLayout";
import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Image, Modal, Platform, Text, TouchableOpacity, View } from "react-native";

// 1. Data Lokasi Tetap (Tanpa modifikasi struktur)
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

// 2. Mapping Nama Pendek (Sederhana & Langsung)
const LOCATION_LABELS: Record<string, string> = {
    "BINUS @ Alam Sutera Campus": "Alam Sutera",
    "BINUS Anggrek Campus": "Anggrek",
    "BINUS @ Bekasi": "Bekasi",
};

const SCHEDULES: Record<string, { [key: string]: string[] }> = {
    "BINUS Anggrek Campus-BINUS @ Alam Sutera Campus": {
        "Mon-Thu": ["06:05 AM", "07:30 AM", "10:10 AM", "12:10 PM", "14:10 PM", "15:30 PM", "17:30 PM"],
        "Fri":     ["06:05 AM", "07:30 AM", "10:10 AM", "12:40 PM", "14:10 PM", "15:30 PM", "17:30 PM"],
        "Sat":     ["06:05 AM", "07:30 AM", "10:10 AM", "12:10 PM", "15:30 PM"],
    },
    "BINUS @ Alam Sutera Campus-BINUS Anggrek Campus": {
        "Mon-Thu": ["07:30 AM", "09:30 AM", "11:30 AM", "13:30 PM", "15:30 PM", "17:30 PM", "19:10 PM"],
        "Fri":     ["07:30 AM", "09:30 AM", "11:10 AM", "13:30 PM", "15:30 PM", "17:30 PM", "19:10 PM"],
        "Sat":     ["07:30 AM", "11:30 AM", "13:30 PM", "15:30 PM", "17:10 PM"],
    },
    "BINUS @ Bekasi-BINUS Anggrek Campus": {
        "Mon-Thu": ["07:30 AM", "15:30 PM", "19:10 PM"],
        "Fri":     ["07:30 AM", "13:30 PM", "19:10 PM"],
        "Sat":     ["07:30 AM", "17:10 PM"],
    },
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
                 // Logic reset jika diperlukan
            }
        }
    }, [destinationAddress, validOrigins]);

    const availableTimes = useMemo(() => {
        if (!userAddress || !destinationAddress) return [];
        const routeKey = `${userAddress}-${destinationAddress}`;
        const schedule = SCHEDULES[routeKey];
        if (!schedule) return [];

        const dayOfWeek = date.getDay(); 
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
        if (Platform.OS === 'android') setShowDatePicker(false);
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
            
            {/* --- Kampus Tujuan --- */}
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

                {/* Tombol Pilihan Cepat */}
                <View className="flex-row gap-3 mt-[-15px]">
                    {BINUS_LOCATIONS.map((loc) => (
                        <TouchableOpacity
                            key={loc.description}
                            onPress={() => handleQuickSelect(loc, 'destination')}
                            className={`flex-1 p-3 rounded-xl shadow-md shadow-neutral-300 items-center justify-center 
                                ${destinationAddress === loc.description ? "bg-blue-500" : "bg-white"}`}
                        >
                            {/* Menggunakan Mapping Object langsung */}
                            <Text className={`font-bold text-sm ${destinationAddress === loc.description ? "text-white" : "text-black"}`}>
                                {LOCATION_LABELS[loc.description]}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* --- Kampus Asal --- */}
            <View className="mb-6">
                <Text className="text-lg font-PoppinsSemiBold mb-1">Kampus Asal</Text>
                
                <GoogleTextInput 
                    icon={icons.pickupPin} 
                    initialLocation={userAddress!}
                    containerStyle="bg-white shadow-md shadow-neutral-300" 
                    handlePress={(location) => setUserLocation(location)}
                    initialPlaces={validOrigins} 
                />

                {/* Tombol Pilihan Cepat */}
                <View className="flex-row gap-3 mt-[-15px]">
                    {validOrigins.length > 0 ? (
                        validOrigins.map((loc) => (
                            <TouchableOpacity
                                key={loc.description}
                                onPress={() => handleQuickSelect(loc, 'origin')}
                                className={`flex-1 p-3 rounded-xl shadow-md shadow-neutral-300 items-center justify-center 
                                    ${userAddress === loc.description ? "bg-blue-500" : "bg-white"}`}
                            >
                                {/* Menggunakan Mapping Object langsung */}
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

            {/* --- Jadwal (Date & Time) --- */}
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
                            else if (availableTimes.length === 0) Alert.alert("Jadwal Kosong", "Tidak ada jadwal tersedia.");
                            else setShowTimeModal(true);
                        }}
                        className={`flex-1 p-3 rounded-xl flex-row items-center justify-center shadow-md shadow-neutral-300 
                            ${availableTimes.length === 0 ? "bg-neutral-200" : "bg-white"}`}
                    >
                         <Image source={icons.clock} className="w-5 h-5 mr-2" resizeMode="contain" tintColor={availableTimes.length === 0 ? "gray" : "black"}/>
                        <Text className={`font-PoppinsMedium text-sm ${availableTimes.length === 0 ? "text-gray-500" : "text-black"}`}>
                            {selectedTime || "Pilih Jam"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={onDateChange}
                    />
                )}

                <Modal
                    visible={showTimeModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowTimeModal(false)}
                >
                    <View className="flex-1 justify-end bg-black/50">
                        <View className="bg-white rounded-t-3xl p-5 h-[50%]">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-lg font-PoppinsBold">Pilih Jam</Text>
                                <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                                    <Image source={icons.close} className="w-6 h-6" />
                                </TouchableOpacity>
                            </View>
                            <FlatList 
                                data={availableTimes}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity 
                                        onPress={() => { setSelectedTime(item); setShowTimeModal(false); }}
                                        className={`p-4 mb-3 rounded-xl border ${selectedTime === item ? "bg-blue-100 border-blue-500" : "bg-neutral-50 border-neutral-200"}`}
                                    >
                                        <Text className={`text-center font-PoppinsMedium ${selectedTime === item ? "text-blue-600" : "text-black"}`}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={() => <Text className="text-center text-gray-500 mt-5">Tidak ada jadwal.</Text>}
                            />
                        </View>
                    </View>
                </Modal>
            </View>

            <View className="mt-5 mb-10">
                <CustomButton 
                    title="Book Now"
                    onPress={handleBook}
                    className="w-full shadow-md shadow-neutral-400"
                />
            </View>
        </BookLayout>
    );
};

export default BookBus;