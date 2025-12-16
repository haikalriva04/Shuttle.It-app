import { icons, images } from "@/constants";
import { useClerk, useUser } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Account = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const handleOpenLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error("Don't know how to open this URL: " + url);
    }
  };

  const handleWhatsApp = () => {
    // WhatsApp format: https://wa.me/<number>?text=<encoded_message>
    // Number format must remove '+' and dashes.
    const url = "https://wa.me/6287801724687?text=Live%20Agent";
    handleOpenLink(url);
  };

  // Reusable component for the menu buttons
  const MenuButton = ({
    title,
    icon,
    onPress,
  }: {
    title: string;
    icon: any;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between bg-transparent p-4 rounded-2xl mb-3"
    >
      <View className="flex-row items-center gap-4">
        <View className="w-10 h-10 bg-transparent rounded-full items-center justify-center">
          <Image source={icon} className="w-6 h-6" resizeMode="contain" />
        </View>
        <Text className="text-base font-PoppinsLight text-white">
          {title}
        </Text>
      </View>
      <Image
        source={icons.rightArrow}
        className="w-6 h-6"
        tintColor="#CDD1D6"
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={images.backgroundShuttleit}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          className="px-5"
        >
          {/* 1. Header: Profile Picture & Edit Button */}
          <View className="items-center mt-10 mb-8">
            <View className="relative">
              <Image
                source={{
                  uri: user?.imageUrl || "https://placehold.co/150",
                }}
                className="w-28 h-28 rounded-full border-4 border-white shadow-sm"
              />
              <TouchableOpacity
                className="absolute bottom-0 right-0 w-8 h-8 bg-gray-400 rounded-full items-center justify-center border-2 border-white"
                onPress={() => {
                  /* Handle Image Upload Logic Later */
                }}
              >
                <Image
                  source={icons.changeProfile}
                  className="w-8 h-8"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <Text className="text-2xl font-PoppinsBold text-white mt-4">
              {user?.firstName || user?.emailAddresses[0].emailAddress.split("@")[0]}
            </Text>
          </View>

          {/* 2. Account Information Section */}
          <View className="bg-black/50 rounded-3xl p-5 mb-6">
            <Text className="text-lg font-PoppinsBold mb-4 text-white">
              Account Info
            </Text>

            {/* Username Field */}
            <View className="mb-4">
              <Text className="text-xs font-PoppinsMedium text-white mb-1 ml-1">
                Username
              </Text>
              <View className="bg-neutral-100 p-3 rounded-xl border border-neutral-200">
                <Text className="text-gray-800 font-PoppinsSemiBold">
                  {user?.username ||
                    user?.emailAddresses[0].emailAddress.split("@")[0]}
                </Text>
              </View>
            </View>

            {/* Email Field */}
            <View className="mb-4">
              <Text className="text-xs font-PoppinsMedium text-white mb-1 ml-1">
                Email
              </Text>
              <View className="bg-neutral-100 p-3 rounded-xl border border-neutral-200">
                <Text className="text-gray-800 font-PoppinsSemiBold">
                  {user?.emailAddresses[0].emailAddress}
                </Text>
              </View>
            </View>

            {/* Password Field (Masked) */}
            <View>
              <Text className="text-xs font-PoppinsMedium text-white mb-1 ml-1">
                Password
              </Text>
              <View className="bg-neutral-100 p-3 rounded-xl border border-neutral-200">
                <Text className="text-gray-800 font-PoppinsSemiBold">
                  ••••••••••••
                </Text>
              </View>
            </View>
          </View>

          {/* 3. Action Buttons Section */}
          <View>
            <MenuButton
              title="Privacy Policy"
              icon={icons.privacyPolicy}
              onPress={() =>
                handleOpenLink("https://binus.ac.id/privacy-policy/")
              }
            />
            <MenuButton
              title="Chat with Us"
              icon={icons.chat}
              onPress={handleWhatsApp}
            />
            <MenuButton
              title="Send Feedback"
              icon={icons.sendFeedback}
              onPress={() =>
                handleOpenLink("https://forms.office.com/r/ciSDNJUgQH")
              }
            />
          </View>

          <View className="mt-8 items-center gap-4">
            <Text className="text-white font-PoppinsMedium text-sm">
              Version 1.0.0.1
            </Text>

            <TouchableOpacity
              onPress={handleLogout}
              className="w-full bg-transparent p-4 rounded-full border border-red-500 items-center flex-row justify-center gap-2"
            >
              <Text className="text-red-500 font-PoppinsBold text-lg">
                Logout Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Account;