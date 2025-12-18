import CampusScheduleButton from "@/components/CampusScheduleButton";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import { icons, images } from "@/constants";
import { useLocationStore } from "@/store";
import { useClerk, useUser } from "@clerk/clerk-expo";
import * as Location from 'expo-location';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const binusLocations = [
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
    {
        description: "Binus @ Bandung Paskal Campus",
        geometry: { location: { lat: -6.9151309757579, lng: 107.59350735169079 } },
    },
    {
        description: "Binus @ Bandung Dago Campus",
        geometry: { location: { lat: -6.870128790988036, lng: 107.6336820805264 } },
    },
];

const campusSchedules = [
    {
        title: "Binus @ Alam Sutera",
        image: images.binusAlamSutera,
        route: "/(root)/jadwal-alsut"
    },
    {
        title: "Binus @ Kemanggisan Anggrek",
        image: images.binusKemanggisan,
        route: "/(root)/jadwal-anggrek"
    },
    {
        title: "Binus @ Bekasi",
        image: images.binusBekasi,
        route: "/(root)/jadwal-bekasi"
    },
    {
        title: "Binus @ Bandung Paskal",
        image: images.binusPaskal,
        route: "/(root)/jadwal-paskal" // Assuming this page exists or will be made
    },
    {
        title: "Binus @ Bandung Dago",
        image: images.binusDago,
        route: "/(root)/jadwal-dago" // Assuming this page exists or will be made
    },
];

export default function Page() {
    const { setUserLocation, setDestinationLocation } = useLocationStore();
    const { user } = useUser();
    const { signOut } = useClerk();
    const loading = true;

    const [hasPermissions, setHasPermissions] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace("/(auth)/sign-in");
        } catch (err) {
            console.error("Error signing out:", err);
        }
    };

    const handleDestinationPress = (location: { 
        latitude: number; 
        longitude: number; 
        address: string; 
    }) => {
        setDestinationLocation(location);
        router.push("/(root)/book-bus");
    };

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
                    data={[]} 
                    renderItem={null}
                    className="px-5" 
                    keyboardShouldPersistTaps="handled" 
                    contentContainerStyle={{
                        paddingBottom: 95,
                    }} 
                    ListHeaderComponent={() => (
                        <>
                            <View className="flex flex-row items-center justify-between pt-1">
                                <Image source={images.shuttleItLogo} className="w-36 h-36" />
                                <TouchableOpacity 
                                    onPress={handleSignOut} 
                                    className="justify-center items-center w-13 h-13 rounded-full bg-transparent"
                                >
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

                            <GoogleTextInput 
                                icon={icons.search} 
                                containerStyle="bg-white shadow-md shadow-neutral-300"
                                handlePress={handleDestinationPress}
                                initialPlaces={binusLocations} 
                            />

                            <>
                                <Text className="text-lg font-PoppinsBold text-white mt-5 mb-2">Lokasi Live Map</Text>
                                <View className="flex flex-row items-center bg-transparent h-[450px]">
                                    <Map />
                                </View>
                            </>

                            <View className="mt-5">
                                <Text className="text-lg font-PoppinsBold text-white mb-3">Jadwal Bus Setiap Kampus</Text>
                                <FlatList
                                    data={campusSchedules}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item) => item.title}
                                    renderItem={({ item }) => (
                                        <CampusScheduleButton 
                                            title={item.title} 
                                            image={item.image} 
                                            onPress={() => {
                                                if (item.route) {
                                                    router.push(item.route as any);
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </View>
                        </>
                    )}
                />
            </SafeAreaView>
        </ImageBackground>
    );
}