import { ImageBackground, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import background from "../../../assets/images/background-shuttleit.png";

const CampusInfo = () => {
  return (
    <ImageBackground
        source={background}
        style={{ flex: 1 }}
    >
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
            <Text>CampusInfo</Text>
        </SafeAreaView>
    </ImageBackground>
  );
};

export default CampusInfo;