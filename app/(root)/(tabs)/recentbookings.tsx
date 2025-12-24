import BookingCard from "@/components/BookingCard";
import { images } from "@/constants";
import { useUser } from "@clerk/clerk-expo";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Image, ImageBackground, RefreshControl, SafeAreaView, Text, View } from "react-native";

const RecentBookings = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    if (!user) return;
    if(!refreshing) setLoading(true); 
    
    try {
        // FIXED: URL menjadi "/booking"
        const response = await fetch(`/booking?user_id=${user.id}`);
        const result = await response.json();

        if (response.ok) {
            const mappedData = result.data.map((item: any) => ({
                id: item.booking_code,
                origin: item.origin,
                destination: item.destination,
                date: item.departure_date,
                time: item.departure_time,
                bookingDate: new Date(item.created_at).toLocaleDateString('id-ID'),
            }));
            setBookings(mappedData);
        }
    } catch (error) {
        console.error("Fetch history error:", error);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
        fetchBookings();
    }, [user])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  return (
    <ImageBackground
        source={images.backgroundShuttleit}
        style={{ flex: 1 }}
        resizeMode="cover"
    >
        <SafeAreaView className="flex-1 bg-transparent">
             <View className="px-5 py-6">
                <Text className="text-2xl font-PoppinsBold text-white mt-3">
                    Recent Bookings
                </Text>
            </View>

            {loading && !refreshing ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0286FF" />
                </View>
            ) : (
                <FlatList
                    data={bookings}
                    keyExtractor={(item: any) => item.id}
                    renderItem={({ item }) => (
                        <BookingCard 
                            item={item} 
                            onBookingCancelled={() => fetchBookings()} 
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={() => (
                        <View className="flex flex-col items-center justify-center h-[50vh]">
                            <Image 
                                source={images.noResult} 
                                className="w-40 h-40" 
                                resizeMode="contain" 
                            />
                            <Text className="text-sm font-PoppinsMedium text-white mt-4">
                                Tidak ada booking bus ditemukan
                            </Text>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    </ImageBackground>
  );
};

export default RecentBookings;