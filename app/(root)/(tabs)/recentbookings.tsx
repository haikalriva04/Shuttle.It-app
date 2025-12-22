import { images } from "@/constants";
import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const RecentBookings = () => {
  return (
    <ImageBackground
        source={images.backgroundShuttleit}
        style={{ flex: 1 }}
        resizeMode="cover"
    >
        <SafeAreaView className="flex-1 bg-transparent">
        </SafeAreaView>
    </ImageBackground>
  );
};

export default RecentBookings;