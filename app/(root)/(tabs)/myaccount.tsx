import { ImageBackground, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import background from "../../../assets/images/background-shuttleit.png";

const MyAccount = () => {
  return (

    <ImageBackground
        source={background}
        style={{ flex: 1 }}
    >
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
            <Text>MyAccount</Text>
        </SafeAreaView>
    </ImageBackground>
  );
};

export default MyAccount;