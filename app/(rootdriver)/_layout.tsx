import { Stack } from "expo-router";

const DriverLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}> 
      <Stack.Screen name="(tabsdriver)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default DriverLayout;