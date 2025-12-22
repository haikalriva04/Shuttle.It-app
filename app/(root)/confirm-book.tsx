import BookLayout from "@/components/BookLayout";
import CustomButton from "@/components/CustomButton";
import { useUser } from "@clerk/clerk-expo";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

const ConfirmBook = () => {
    const { user } = useUser();
    
    // Menerima data dari halaman sebelumnya
    const params = useLocalSearchParams();
    const { date, timeSlot, origin, destination } = params;

    const [isBooking, setIsBooking] = useState(false);

    // Format Tanggal ke Bahasa Indonesia (Contoh: Senin, 22 Desember 2025)
    const formattedDate = date 
        ? new Date(date as string).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
        : "-";

    const handleConfirmBooking = async () => {
        setIsBooking(true);
        try {
            const dateStr = new Date(date as string).toISOString().split('T')[0];
            
            const response = await fetch("/(api)/trips", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
                // Arahkan ke halaman sukses atau home
                Alert.alert("Sukses", "Tiket berhasil dibooking!");
                router.replace("/(root)/(tabs)/home"); 
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
        // 1. Judul Halaman diubah
        <BookLayout title="Konfirmasi Booking">
            <View className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 mb-5">
                
                {/* Visualisasi Rute (Garis Biru ke Merah) */}
                <View className="flex-row items-start mb-6">
                    <View className="items-center mr-3 mt-1">
                        <View className="w-3 h-3 rounded-full bg-blue-500" />
                        <View className="w-0.5 h-10 bg-gray-200 my-1" />
                        <View className="w-3 h-3 rounded-full bg-red-500" />
                    </View>
                    <View className="flex-1">
                        {/* 2. Label Kampus Asal */}
                        <View className="mb-4">
                            <Text className="text-gray-400 font-PoppinsMedium text-xs uppercase mb-0.5">
                                Kampus Asal
                            </Text>
                            <Text className="font-PoppinsSemiBold text-black text-base leading-5">
                                {origin || "Lokasi asal belum dipilih"}
                            </Text>
                        </View>

                        {/* 3. Label Kampus Tujuan */}
                        <View>
                            <Text className="text-gray-400 font-PoppinsMedium text-xs uppercase mb-0.5">
                                Kampus Tujuan
                            </Text>
                            <Text className="font-PoppinsSemiBold text-black text-base leading-5">
                                {destination || "Lokasi tujuan belum dipilih"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Garis Pemisah */}
                <View className="h-[1px] bg-neutral-100 w-full mb-4" />

                {/* 4. Label Jadwal Keberangkatan */}
                <View>
                    <Text className="text-gray-500 mb-2 font-PoppinsMedium text-sm">
                        Jadwal Keberangkatan
                    </Text>
                    <View className="flex-row items-center justify-between bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                        {/* 5. Tanggal & Jam Dinamis */}
                        <View>
                            <Text className="text-gray-400 text-xs font-PoppinsMedium mb-1">Tanggal</Text>
                            <Text className="font-PoppinsSemiBold text-black text-sm">
                                {formattedDate}
                            </Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-gray-400 text-xs font-PoppinsMedium mb-1">Jam</Text>
                            <Text className="font-PoppinsBold text-blue-600 text-lg">
                                {timeSlot || "--:--"}
                            </Text>
                        </View>
                    </View>
                </View>

            </View>

            <View className="mt-auto mb-10">
                <CustomButton 
                    title={isBooking ? "Memproses..." : "Konfirmasi Booking"}
                    onPress={handleConfirmBooking}
                    bgVariant={isBooking ? "secondary" : "primary"}
                    disabled={isBooking}
                    className="shadow-md shadow-neutral-300"
                />
            </View>
        </BookLayout>
    );
};

export default ConfirmBook;