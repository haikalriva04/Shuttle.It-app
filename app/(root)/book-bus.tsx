import BookLayout from "@/components/BookLayout";
import { useLocationStore } from "@/store";
import { Text } from "react-native";

const BookBus = () => {
    const { userAddress, 
        destinationAddress, 
        setDestinationLocation, 
        setUserLocation,
     } = useLocationStore();

    return( 
    <BookLayout>
        <Text className="text-2xl">Booking Bus</Text>
    </BookLayout>
    );
};

export default BookBus;
