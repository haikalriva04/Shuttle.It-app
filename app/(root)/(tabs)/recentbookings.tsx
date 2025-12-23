import BookingCard from "@/components/BookingCard";
import { images } from "@/constants";
import { useState } from "react";
import { ActivityIndicator, FlatList, Image, ImageBackground, SafeAreaView, Text, View } from "react-native";

// Data Dummy untuk testing (Bisa diganti dengan data fetch API nanti)
// Kosongkan array ini [] untuk mengetes tampilan ListEmptyComponent
const MOCK_DATA = [
    {
        id: "BOOK-17348922-001",
        origin: "Binus @Alam Sutera",
        destination: "Binus @Kemanggisan",
        date: "Senin, 22 Des 2025",
        time: "09:00 WIB",
        bookingDate: "20 Des 2025"
    },
    {
        id: "BOOK-17348922-002",
        origin: "Binus @Kemanggisan",
        destination: "Binus @Bekasi",
        date: "Selasa, 23 Des 2025",
        time: "13:00 WIB",
        bookingDate: "21 Des 2025"
    }
];

const RecentBookings = () => {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState(MOCK_DATA); // Gunakan MOCK_DATA atau []

  return (
    <ImageBackground
        source={images.backgroundShuttleit}
        style={{ flex: 1 }}
        resizeMode="cover"
    >
        <SafeAreaView className="flex-1 bg-transparent">
             {/* Header */}
             <View className="px-5 py-6">
                <Text className="text-2xl font-PoppinsBold text-white">
                    Recent Bookings
                </Text>
            </View>

            {/* List Booking */}
            <FlatList
                data={bookings}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <BookingCard item={item} />}
                contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                
                // Komponen ketika data kosong
                ListEmptyComponent={() => (
                    <View className="flex flex-col items-center justify-center h-[60vh]">
                        {!loading ? (
                            <>
                                <Image 
                                    source={images.noResult} 
                                    className="w-40 h-40" 
                                    alt="No bookings found" 
                                    resizeMode="contain" 
                                />
                                <Text className="text-sm font-PoppinsMedium text-gray-500 mt-4">
                                    Tidak ada booking bus ditemukan
                                </Text>
                            </>
                        ) : (
                            <ActivityIndicator size="small" color="#0286FF" />
                        )}
                    </View>
                )}
            />
        </SafeAreaView>
    </ImageBackground>
  );
};

export default RecentBookings;