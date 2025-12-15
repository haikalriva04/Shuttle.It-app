import BookLayout from "@/components/BookLayout";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import { Text, View } from "react-native";

const BookBus = () => {
    const { userAddress, 
        destinationAddress, 
        setDestinationLocation, 
        setUserLocation,
     } = useLocationStore();

    return( 
    <BookLayout title="Booking Bus">
        <View className="my-3">
        <Text className="text-lg font-PoppinsSemiBold mb-1">Kampus Asal</Text>
        <GoogleTextInput 
        icon={icons.pickupPin} 
        initialLocation={userAddress!}
        containerStyle="bg-neutral-100" 
        textInputBackgroundColor="#f5f5f5"
        handlePress={(location) => setUserLocation(location)}
        />
        </View>

             <View className="my-3">
        <Text className="text-lg font-PoppinsSemiBold mb-1">Kampus Tujuan</Text>
        <GoogleTextInput 
        icon={icons.destination} 
        initialLocation={destinationAddress!}
        containerStyle="bg-neutral-100" 
        textInputBackgroundColor="transparent"
        handlePress={(location) => setDestinationLocation(location)}
        />
        </View>
    </BookLayout>
    );
};

export default BookBus;
