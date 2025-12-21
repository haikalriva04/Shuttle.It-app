import BookLayout from "@/components/BookLayout";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Text, View } from "react-native";

const ConfirmBook = () => {
    const { userAddress, destinationAddress } = useLocationStore();
    const { date } = useLocalSearchParams();
    
    const bookingDate = date ? new Date(date as string) : new Date();

    // List of items to display in the "slider"
    const bookingDetails = [
        {
            id: '1',
            label: 'Pick Up',
            value: userAddress,
            icon: icons.pickupPin,
        },
        {
            id: '2',
            label: 'Destination',
            value: destinationAddress,
            icon: icons.destination,
        },
        {
            id: '3',
            label: 'Schedule',
            value: bookingDate.toLocaleString([], { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            icon: icons.schedule, 
        }
    ];

    const handleConfirm = () => {
        
        router.push("/(root)/(tabs)/home"); 
    };

    return (
        <BookLayout title="Confirm Booking">
            <View className="flex-1 pb-5">
                <Text className="text-xl font-PoppinsBold mb-5 text-center">
                    Trip Summary
                </Text>

                {/* Render the details as a list */}
                <View className="flex-col gap-4">
                    {bookingDetails.map((item) => (
                        <View 
                            key={item.id} 
                            className="flex-row items-center justify-between bg-neutral-100 p-4 rounded-xl shadow-sm shadow-neutral-200"
                        >
                            <View className="flex-row items-center gap-4 flex-1">
                                <View className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm">
                                    <Image 
                                        source={item.icon} 
                                        className="w-6 h-6" 
                                        resizeMode="contain" 
                                        tintColor="black"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs text-gray-500 font-PoppinsMedium uppercase tracking-wider">
                                        {item.label}
                                    </Text>
                                    <Text className="text-base font-PoppinsSemiBold text-black mt-1" numberOfLines={2}>
                                        {item.value || "Not selected"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Action Buttons */}
                <View className="mt-8 gap-3">
                    <CustomButton 
                        title="Confirm Ride"
                        onPress={handleConfirm}
                        className="w-full shadow-md shadow-blue-300"
                    />
                    <CustomButton 
                        title="Cancel"
                        bgVariant="outline"
                        textVariant="primary"
                        onPress={() => router.back()}
                        className="w-full"
                    />
                </View>
            </View>
        </BookLayout>
    );
};

export default ConfirmBook;