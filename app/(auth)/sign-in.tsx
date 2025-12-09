import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";



const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling for more info on error handling
        console.log(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  }, [isLoaded, form, router, setActive, signIn]);

  return (
    
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
            <Text className="text-3xl text-black font-PoppinsBold absolute bottom-5 left-5">
              Login
            </Text>
        </View>

      <View className="p-5">
           <InputField 
        label="Email" 
        placeholder="Masukan Email" 
        icon={icons.email} 
        value={form.email} 
        onChangeText={(value) => setForm({
          ...form, email: value})}/>

           <InputField 
        label="Password" 
        placeholder="Masukan password" 
        icon={icons.greyLock}
        secureTextEntry={true}
        value={form.password} 
        onChangeText={(value) => setForm({
          ...form, password: value})}/>

          <CustomButton title="Login" onPress={onSignInPress} className="mt-16"/>

          <OAuth />
     

          <Link href="/sign-up" className="text-lg text-center text-general-200 mt-20">
          <Text>Tidak punya akun ? </Text>
          <Text className="text-primary-500">Sign Up</Text>
          </Link>
      </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;