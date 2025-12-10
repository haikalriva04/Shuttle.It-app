import { SignedIn, useUser } from "@clerk/clerk-expo";
import { ImageBackground, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import background from "../../../assets/images/background-shuttleit.png";


export default function Page() {
  const { user } = useUser();

  return (
    <ImageBackground
        source={background}
        style={{ flex: 1 }} // Ensures it fills the screen
    >
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
            <SignedIn>
                <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
            </SignedIn>
        </SafeAreaView>
    </ImageBackground>
  );
}