import { ImageBackground, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";

interface CampusScheduleButtonProps {
    title: string;
    image: ImageSourcePropType;
    onPress?: () => void;
}

const CampusScheduleButton = ({ title, image, onPress }: CampusScheduleButtonProps) => {
    return (
        <TouchableOpacity 
            onPress={onPress} 
            className="mr-4 rounded-xl overflow-hidden shadow-sm shadow-neutral-300"
            style={{ width: 140, height: 100 }} 
        >
            <ImageBackground 
                source={image} 
                resizeMode="cover" 
                className="flex-1 justify-end"
            >
                {/* Transparent Black Overlay */}
                <View className="w-full h-full absolute bg-black/40" />
                
                {/* Text Content */}
                <View className="p-2 items-center justify-center flex-1">
                    <Text className="text-white font-PoppinsBold text-center text-xs">
                        {title}
                    </Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

export default CampusScheduleButton;