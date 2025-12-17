import { Stack } from "expo-router";

const Layout = () => {
  return (
      <Stack>
        <Stack.Screen name ="(tabs)" options ={{ headerShown: false }} />
        <Stack.Screen name ="book-bus" options ={{ headerShown: false }} />
        <Stack.Screen name ="confirm-book" options ={{ headerShown: false }} />
        <Stack.Screen name ="jadwal-alsut" options ={{ headerShown: false }} />
        <Stack.Screen name ="jadwal-anggrek" options ={{ headerShown: false }} />
        <Stack.Screen name ="jadwal-senayan" options ={{ headerShown: false }} />
        <Stack.Screen name ="jadwal-paskal" options ={{ headerShown: false }} />
        <Stack.Screen name ="jadwal-dago" options ={{ headerShown: false }} />
      </Stack>
  );
}

export default Layout;