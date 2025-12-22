import BookLayout from "@/components/BookLayout";
import CustomButton from "@/components/CustomButton";
import { useUser } from "@clerk/clerk-expo";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

const ConfirmBook = () => {
    const { user } = useUser();
    const params = useLocalSearchParams();
    
    const { date, timeSlot, origin, destination } = params;
    const [isBooking, setIsBooking] = useState(false);

    const handleConfirmBooking = async () => {
        setIsBooking(true);
        try {
            const dateStr = new Date(date as string).toISOString().split('T')[0];

            const response = await fetch("/(api)/trips", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user?.id,
                    user_name: user?.firstName || "User",
                    user_email: user?.emailAddresses[0].emailAddress,
                    origin: origin,
                    destination: destination,
                    date: dateStr,
                    time: timeSlot,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                router.replace("/(root)/book-success"); // Pastikan page ini ada, atau arahkan ke home
                Alert.alert("Sukses", "Tiket berhasil dibooking!");
            } else {
                Alert.alert("Gagal", result.error || "Terjadi kesalahan.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Gagal menghubungi server.");
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <BookLayout title="Konfirmasi Booking">
            <View className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 mb-5">
                <Text className="text-gray-500 mb-1">Rute Perjalanan</Text>
                <View className="flex-row items-center mb-4">
                     <View className="items-center mr-3">
                        <View className="w-3 h-3 rounded-full bg-blue-500" />
                        <View className="w-0.5 h-8 bg-gray-200" />
                        <View className="w-3 h-3 rounded-full bg-red-500" />
                    </View>
                    <View>
                        <Text className="font-PoppinsSemiBold text-lg">{origin}</Text>
                        <View className="h-4" /> 
                        <Text className="font-PoppinsSemiBold text-lg">{destination}</Text>
                    </View>
                </View>

                <View className="flex-row justify-between bg-neutral-50 p-3 rounded-xl mb-2">
                    <Text className="text-gray-500">Tanggal</Text>
                    <Text className="font-PoppinsMedium">{new Date(date as string).toLocaleDateString()}</Text>
                </View>
                <View className="flex-row justify-between bg-neutral-50 p-3 rounded-xl">
                    <Text className="text-gray-500">Jam</Text>
                    <Text className="font-PoppinsMedium">{timeSlot}</Text>
                </View>
            </View>

            <View className="mt-auto mb-10">
                <CustomButton 
                    title={isBooking ? "Memproses..." : "Konfirmasi & Book"}
                    onPress={handleConfirmBooking}
                    bgVariant={isBooking ? "secondary" : "primary"}
                    disabled={isBooking}
                />
            </View>
        </BookLayout>
    );
};

export default ConfirmBook;