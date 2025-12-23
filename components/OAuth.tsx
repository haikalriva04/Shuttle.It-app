import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import { Alert, Image, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const OAuth = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_microsoft" });

  const handleMicrosoftSignIn = async () => {
    try {
      const redirectUrl = Linking.createURL("/(root)/(tabs)/home", { scheme: "shuttleit" });

      const { createdSessionId, setActive, signUp, signIn } = await startOAuthFlow({
        redirectUrl,
      });

      if (createdSessionId) {
        if (setActive) {
          await setActive({ session: createdSessionId });
          router.replace("/(root)/(tabs)/home");
        }
      } else {
      }
    } catch (err) {
      console.error("OAuth error", err);
      Alert.alert("Error", "Login failed. Please try again.");
    }
  };

  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>

      <CustomButton
        title="Login dengan akun Microsoft"
        className="mt-5 w-full shadow-none"
        IconLeft={() => (
          <Image
            source={icons.microsoft}
            resizeMode="contain"
            className="w-5 h-5 mx-5"
          />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={handleMicrosoftSignIn}
      />
    </View>
  );
};

export default OAuth;