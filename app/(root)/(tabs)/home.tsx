import BookingCard from "@/components/BookingCard";
import Map from "@/components/Map";
import { icons, images } from "@/constants";
import { useLocationStore } from "@/store";
import { useUser } from "@clerk/clerk-expo";
import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
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

export default function Page() {
    const { setUserLocation, setDestinationLocation } = useLocationStore();
  const { user } = useUser();
  const loading = true;

    const [hasPermissions, setHasPermissions] = useState(false);

    const handleSignOut = () => {};
    const handleDestinationPress = () => {};

    useEffect(() => {
        const requestLocation = async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();

          if(status !== 'granted') {
            setHasPermissions(false)
            return;
          }
     

        let location = await Location.getCurrentPositionAsync();

        const address = await Location.reverseGeocodeAsync({
            latitude: location.coords?.latitude!,
            longitude: location.coords?.longitude!,
        });

        setUserLocation({
           // latitude: location.coords.latitude,
           // longitude: location.coords.longitude,
            latitude: -6.2227893183819,
            longitude: 106.64902751112118,
            address: `${address[0].name}, ${address[0].region}`,
        });
   };
        requestLocation();
    }, [])

  return (

        <ImageBackground source={images.backgroundShuttleit} resizeMode="cover" className="flex-1" >
        <SafeAreaView className="bg-transparent" edges={['left', 'right', 'bottom']}>
          <FlatList 
          data={recentBookings?.slice(0, 2)} 
          renderItem={({ item }) => <BookingCard ride={item} />} 
          className="px-5" 
          keyboardShouldPersistTaps="handled" 
          contentContainerStyle={{
            paddingBottom:80,
          }} 
          ListEmptyComponent={() => (
            <View className="flex flex-col items-center justify-center">
               {!loading ? (
      <>
               <Image source={images.noResult} className="w-40 h-40" alt="Tidak ada booking perjalanan ditemukan" resizeMode="contain" />
               <Text className="text-sm font-PoppinsMedium">Tidak ada booking perjalanan ditemukan</Text>
               </>
               ): (
                <ActivityIndicator size="small" color="#FFFFFF" />
               ) }
            </View>
          )} 
          ListHeaderComponent={() => (
            <>
            <View className="flex flex-row items-center justify-between pt-1">
            <Image source={images.shuttleItLogo} className="w-36 h-36" />
                        <TouchableOpacity onPress={handleSignOut} className="justify-center items-center w-13 h-13 rounded-full bg-transparent">
                <Image source={icons.out} className="w-13 h-13"/>
            </TouchableOpacity>


            </View>
            <View className="flex flex-row items-center justify-between">
            <Text className="text-xl font-PoppinsExtraBold text-white">
                Halo{", "}{user?.firstName || user?.emailAddresses[0].emailAddress.split("@")[0]} !
            </Text>

            </View>
            <View>
                <Text className="text-md font-PoppinsMedium text-white">Mau ke kampus mana hari ini ?</Text>
            </View>

            <>
            <Text className="text-md font-PoppinsBold text-white mt-5 mb-2">Lokasi Live Map</Text>
            <View className="flex flex-row items-center bg-transparent h-[500px]">
            <Map />
            </View>
        </>

        <Text className="text-xl font-PoppinsBold text-white my-5">Booking History</Text>
     </>
          )}
          />
        </SafeAreaView>
        </ImageBackground>
  );
}