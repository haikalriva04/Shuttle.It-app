import { icons } from "@/constants";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import QRCode from "react-native-qrcode-svg";

interface TicketModalProps {
  isVisible: boolean;
  onClose: () => void;
  type: "booking" | "history"; // Membedakan tampilan Booking baru vs History
  data: {
    id: string; // Data untuk QR Code
    date: string;
    time: string;
    origin: string;
    destination: string;
    createdAt?: string; // Tanggal booking dilakukan
  };
}

const TicketModal = ({ isVisible, onClose, type, data }: TicketModalProps) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={type === "history" ? onClose : undefined} // History bisa tutup tap luar
      backdropOpacity={0.7} // Layer hitam transparan gelap
      animationIn="zoomIn"
      animationOut="zoomOut"
      useNativeDriver
    >
      <View className="flex-1 justify-center items-center">
        {/* Container Bentuk Tiket Vertikal */}
        <View className="bg-white w-[85%] rounded-3xl p-6 items-center shadow-lg relative overflow-hidden">
          
          {/* Tombol Close (Hanya untuk History) */}
          {type === "history" && (
            <TouchableOpacity 
              onPress={onClose} 
              className="absolute top-4 right-4 z-50 p-2 bg-neutral-100 rounded-full"
            >
              <Image source={icons.close} className="w-4 h-4" resizeMode="contain" />
            </TouchableOpacity>
          )}

          {/* Header Text */}
          <View className="items-center mb-6 mt-2">
            <Text className="font-PoppinsExtraBold text-xl text-black text-center">
              Booking Berhasil !
            </Text>
            <Text className="font-PoppinsMedium text-xs text-gray-500 text-center mt-2">
              Silahkan tunjukan QR Code tiket ke supir
            </Text>
          </View>

          {/* QR Code Area */}
          <View className="mb-6 border-2 border-dashed border-gray-200 p-4 rounded-xl">
            <QRCode
              value={data.id || "INVALID"}
              size={180}
            />
          </View>

               {/* Tanggal Booking Dilakukan (Opsional/Footer info) */}
             <View className="mb-3 items-center">
                <Text className="text-[10px] text-gray-400 font-PoppinsRegular">
                    Booking ID: {data.id}
                </Text>
            </View>

          {/* Informasi Detail Tiket */}
          <View className="w-full space-y-4">
            {/* Kampus Asal & Tujuan */}
            <View>
                <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-xs font-PoppinsMedium text-gray-400 uppercase">Asal</Text>
                    <Text className="text-xs font-PoppinsMedium text-gray-400 uppercase">Tujuan</Text>
                </View>
                <View className="flex-row items-center justify-between mb-2">
                    <Text className="font-PoppinsSemiBold text-black text-sm max-w-[45%]">{data.origin}</Text>
                    <Image source={icons.rightArrow} className="w-4 h-4 opacity-30" resizeMode="contain"/>
                    <Text className="font-PoppinsSemiBold text-black text-sm text-right max-w-[45%]">{data.destination}</Text>
                </View>
            </View>

            <View className="h-[1px] bg-neutral-100 w-full" />

            {/* Jadwal */}
            <View className="flex-row justify-between items-center mt-2">
                <View>
                    <Text className="text-xs font-PoppinsMedium text-gray-400 mb-1">Jadwal Keberangkatan</Text>
                    <Text className="font-PoppinsBold text-black text-sm">
                        {data.date}
                    </Text>
                </View>
                <View className="bg-blue-50 px-1 py-1 rounded-lg">
                    <Text className="font-PoppinsBold text-blue-600 text-base">{data.time}</Text>
                </View>
            </View>
          </View>

          {/* Tombol 'Kembali ke Home' (Hanya untuk Booking Baru) */}
          {type === "booking" && (
            <TouchableOpacity
              onPress={() => {
                  onClose();
                  router.replace("/(root)/(tabs)/home");
              }}
              className="mt-8 bg-[#0286FF] w-full py-3.5 rounded-full items-center justify-center shadow-md shadow-blue-200"
            >
              <Text className="text-white font-PoppinsBold text-base">Kembali ke Home</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default TicketModal;