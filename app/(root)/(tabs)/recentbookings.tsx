import BookingCard from "@/components/BookingCard";
import { images } from "@/constants";
import { ActivityIndicator, FlatList, Image, ImageBackground, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const recentBookings = [
    {
        "ride_id": "1",
        "origin_address": "BINUS University @Alam Sutera",
        "destination_address": "BINUS University @Anggrek",
        "origin_latitude": "-6.223078756118827",
        "origin_longitude": "106.64897587120757",
        "destination_latitude": "-6.201572320039744",
        "destination_longitude": "106.78222123830047",
        "ride_time": 391,
        "driver_id": 2,
        "user_id": "1",
        "created_at": "2024-08-12 05:19:20.620007",
        "driver": {
            "driver_id": "1",
            "first_name": "Joko",
            "last_name": "Priyono",
            "profile_image_url": "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
            "car_seats": 30,
            "rating": "4.60"
        }
    },
    {
        "ride_id": "2",
        "origin_address": "BINUS University @Anggrek",
        "destination_address": "BINUS University @Alam Sutera",
        "origin_latitude": "-6.201572320039744",
        "origin_longitude": "106.78222123830047",
        "destination_latitude": "-6.223078756118827",
        "destination_longitude": "106.64897587120757",
        "ride_time": 491,
        "driver_id": 1,
        "user_id": "1",
        "created_at": "2024-08-12 06:12:17.683046",
        "driver": {
            "driver_id": "2",
            "first_name": "Budi",
            "last_name": "Santoso",
            "profile_image_url": "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
            "car_image_url": "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
            "car_seats": 30,
            "rating": "4.80"
        }
    },
    {
        "ride_id": "3",
        "origin_address": "BINUS University @Anggrek",
        "destination_address": "BINUS University @Senayan",
        "origin_latitude": "-6.201572320039744",
        "origin_longitude": "106.78222123830047",
        "destination_latitude": "-6.228945820174364",
        "destination_longitude": "106.79674458002944",
        "ride_time": 124,
        "driver_id": 1,
        "user_id": "1",
        "created_at": "2024-08-12 08:49:01.809053",
        "driver": {
            "driver_id": "3",
            "first_name": "Gatot",
            "last_name": "Rusdiansyah",
            "profile_image_url": "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
            "car_image_url": "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
            "car_seats": 30,
            "rating": "4.80"
        }
    },
    {
        "ride_id": "4",
        "origin_address": "Binus @Alam Sutera",
        "destination_address": "Binus @Senayan",
        "origin_latitude": "-6.223078756118827",
        "origin_longitude": "106.64897587120757",
        "destination_latitude": "-6.228945820174364",
        "destination_longitude": "106.79674458002944",
        "ride_time": 159,
        "driver_id": 3,
        "user_id": "1",
        "created_at": "2024-08-12 18:43:54.297838",
        "driver": {
            "driver_id": "4",
            "first_name": "Muhammad",
            "last_name": "Sumbul",
            "profile_image_url": "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
            "car_image_url": "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
            "car_seats": 30,
            "rating": "4.70"
        }
    }
];

const RecentBookings = () => {
  const loading = false; 

  return (
    <ImageBackground
        source={images.backgroundShuttleit}
        style={{ flex: 1 }}
        resizeMode="cover"
    >
        <SafeAreaView className="flex-1 bg-transparent">
            <Text className="text-2xl font-PoppinsBold text-white my-5 px-5">Recent Bookings</Text>
            <FlatList 
                data={recentBookings} 
                renderItem={({ item }) => <BookingCard ride={item} />} 
                className="px-5" 
                keyboardShouldPersistTaps="handled" 
                contentContainerStyle={{
                    paddingBottom: 80,
                }} 
                ListEmptyComponent={() => (
                    <View className="flex flex-col items-center justify-center">
                        {!loading ? (
                            <>
                                <Image source={images.noResult} className="w-40 h-40" alt="No bookings found" resizeMode="contain" />
                                <Text className="text-sm font-PoppinsMedium text-white">Tidak ada booking perjalanan ditemukan</Text>
                            </>
                        ): (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        )}
                    </View>
                )} 
            />
        </SafeAreaView>
    </ImageBackground>
  );
};

export default RecentBookings;