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
        const response = await fetchAPI('/booking', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ booking_code: data })
        });
        
        if (response.success || response.alreadyVerified) {
            const ticket = response.data || {}; 

            
            const title = response.alreadyVerified ? "Sudah Terverifikasi ⚠️" : "Verifikasi Berhasil ✅";
            const message = response.alreadyVerified 
                ? "Tiket ini sudah digunakan sebelumnya." 
                : `Tiket Valid!\nPenumpang: ${ticket.username || 'User'}\nRute: ${ticket.origin} -> ${ticket.destination}`;

            Alert.alert(
                title,
                message,
                [{ text: "OK", onPress: () => setScanned(false) }]
            );
        } else {
            throw new Error(response.error || "Gagal verifikasi");
        }

    } catch (error: any) {
        Alert.alert(
            "Gagal Verifikasi ❌",
            error.message || "QR Code tidak valid atau tidak ditemukan.",
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
            <View className="px-5 py-4 flex-row justify-between items-center mt-2">
              <Image 
                    source={images.shuttleItLogo} 
                    className="w-36 h-36" 
                    resizeMode="contain" 
                />
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

            <View className="px-6 mt-1 mb-8">
                <Text className="text-white font-PoppinsBold text-2xl">
                    Halo Driver !
                </Text>
                <Text className="text-white/80 font-PoppinsMedium text-base mt-1">
                    Silahkan scan ticket penumpang dibawah
                </Text>
            </View>

            <View className="flex-1 items-center justify-start mt-5">
                <View 
                    style={{ 
                        width: 300, 
                        height: 300, 
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

                <Text className="text-white font-PoppinsMedium mt-6 bg-black/40 px-4 py-2 rounded-lg overflow-hidden">
                    {scanned ? "Memproses Data..." : "Kamera Aktif"}
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