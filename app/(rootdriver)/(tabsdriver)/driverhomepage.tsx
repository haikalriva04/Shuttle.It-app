import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { Camera, CameraView } from "expo-camera";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DriverHomePage() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    
    try {
        const response = await fetchAPI(`/booking?booking_code=${data}`);
        
        if (response.data && response.data.length > 0) {
            const ticket = response.data[0];
            Alert.alert(
                "Tiket Valid ✅",
                `Penumpang: ${ticket.username || 'User'}\nRute: ${ticket.origin} -> ${ticket.destination}\nJadwal: ${ticket.departure_time}`,
                [{ text: "OK", onPress: () => setScanned(false) }]
            );
        } else {
            throw new Error("Data tidak ditemukan");
        }

    } catch (error) {
        Alert.alert(
            "Tiket Tidak Valid ❌",
            "Data booking tidak ditemukan di sistem.",
            [{ text: "Scan Lagi", onPress: () => setScanned(false) }]
        );
    }
  };

  if (hasPermission === null) {
    return <View className="flex-1 justify-center items-center"><Text>Requesting permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View className="flex-1 justify-center items-center"><Text>No access to camera</Text></View>;
  }

  return (
    <ImageBackground 
        source={images.backgroundShuttleit}
        style={{ flex: 1 }}
        resizeMode="cover"
    >
        <SafeAreaView className="flex-1 bg-transparent">
            {/* 1. Header */}
            <View className="px-5 py-1 flex-row justify-between items-center mt-2">
                {/* Logo Shuttle It (Kiri) */}
                <Image 
                    source={images.shuttleItLogo} 
                    className="w-36 h-36" 
                    resizeMode="contain" 
                />
                
                {/* Tombol Logout (Kanan) */}
                <TouchableOpacity 
                    onPress={() => router.replace("/(auth)/pilih-masuk")}
                    className="bg-black/20 rounded-full"
                >
                    <Image 
                        source={icons.out} // Pastikan icons.out ada di constants
                        className="w-13 h-13" 
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            {/* 2. Text Sambutan */}
            <View className="px-6 mt-1 mb-8">
                <Text className="text-white font-PoppinsBold text-2xl">
                    Halo Driver !
                </Text>
                <Text className="text-white/80 font-PoppinsMedium text-base mt-1">
                    Silahkan scan ticket penumpang dibawah
                </Text>
            </View>

            {/* 3 & 4. QR Scanner Area */}
            <View className="flex-1 items-center justify-start mt-5">
                <View 
                    style={{ 
                        width: 300, 
                        height: 400, 
                        overflow: 'hidden', 
                        borderRadius: 20,
                        borderWidth: 4,
                        borderColor: '#0097DA',
                        backgroundColor: 'black'
                    }}
                >
                    <CameraView
                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                        barcodeScannerSettings={{
                            barcodeTypes: ["qr"],
                        }}
                        style={StyleSheet.absoluteFillObject}
                    />
                </View>

                {/* Indikator Status */}
                <Text className="text-white font-PoppinsMedium mt-6 bg-black/40 px-4 py-2 rounded-lg overflow-hidden">
                    {scanned ? "Memproses Data..." : "Arahkan kamera ke QR Code"}
                </Text>

                {scanned && (
                    <TouchableOpacity 
                        onPress={() => setScanned(false)} 
                        className="mt-5 bg-[#0097DA] px-8 py-3 rounded-full shadow-lg"
                    >
                        <Text className="text-white font-PoppinsBold text-lg">Scan Lagi</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    </ImageBackground>
  );
}