import { icons } from "@/constants";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import QRCode from "react-native-qrcode-svg";

interface TicketModalProps {
  isVisible: boolean;
  onClose: () => void;
  type: "booking" | "history";
  data: {
    id: string; 
    origin: string;
    destination: string;
    date: string;
    time: string;
    status?: string;
  };
  allowCancellation?: boolean;
  onCancelBooking?: () => void;
  isCancelling?: boolean;
}

const TicketModal = ({ 
    isVisible, 
    onClose, 
    type, 
    data, 
    allowCancellation = false, 
    onCancelBooking,
    isCancelling = false
}: TicketModalProps) => {
  
  const isVerified = data.status === 'verified';

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={type === "history" && !isCancelling ? onClose : undefined}
      backdropOpacity={0.7}
      animationIn="zoomIn"
      animationOut="zoomOut"
      useNativeDriver
    >
      <View className="flex-1 justify-center items-center">
        <View className="bg-white w-[85%] rounded-3xl p-6 items-center shadow-lg relative overflow-hidden">
          
          {type === "history" && !isCancelling && (
            <TouchableOpacity 
              onPress={onClose} 
              className="absolute top-4 right-4 z-50 p-2 bg-neutral-100 rounded-full"
            >
              <Image source={icons.close} className="w-4 h-4" resizeMode="contain" />
            </TouchableOpacity>
          )}

          <View className="items-center mb-6 mt-2">
            <Text className="font-PoppinsExtraBold text-xl text-black text-center">
              {type === "booking" ? "Booking Berhasil !" : "E-Tiket Bus"}
            </Text>
            
            {isVerified ? (
                <View className="bg-green-100 px-3 py-1 rounded-full mt-2">
                    <Text className="font-PoppinsBold text-green-600 text-xs">TIKET TERVERIFIKASI</Text>
                </View>
            ) : (
                <Text className="font-PoppinsMedium text-md text-gray-500 text-center mt-1">
                  Silahkan tunjukan tiket ke supir bus
                </Text>
            )}
          </View>

          <View className="mb-6 border-2 border-dashed border-gray-200 p-4 rounded-xl">
            <QRCode value={data.id || "INVALID"} size={180} />
          </View>

          <View className="w-full space-y-4">
            <View>
                <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-xs font-PoppinsMedium text-gray-400 uppercase">Asal</Text>
                    <Text className="text-xs font-PoppinsMedium text-gray-400 uppercase">Tujuan</Text>
                </View>
                <View className="flex-row items-center justify-between">
                    <Text className="font-PoppinsSemiBold text-black text-sm max-w-[45%]">{data.origin}</Text>
                    <Image source={icons.rightArrow} className="w-4 h-4 opacity-30" resizeMode="contain"/>
                    <Text className="font-PoppinsSemiBold text-black text-sm text-right max-w-[45%]">{data.destination}</Text>
                </View>
            </View>

            <View className="h-[1px] bg-neutral-100 w-full" />

            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-xs font-PoppinsMedium text-gray-400 mb-1">Jadwal Keberangkatan</Text>
                    <Text className="font-PoppinsBold text-black text-base">{data.date}</Text>
                </View>
                <View className="bg-blue-50 px-3 py-2 rounded-lg">
                    <Text className="font-PoppinsBold text-blue-600 text-base">{data.time}</Text>
                </View>
            </View>
             
             <View className="mt-2 items-center">
                <Text className="text-[10px] text-gray-400 font-PoppinsRegular">Booking ID: {data.id}</Text>
            </View>
          </View>

          {type === "booking" ? (
            <TouchableOpacity
              onPress={() => { onClose(); router.replace("/(root)/(tabs)/home"); }}
              className="mt-8 bg-[#0286FF] w-full py-3.5 rounded-full items-center justify-center shadow-md shadow-blue-200"
            >
              <Text className="text-white font-PoppinsBold text-base">Kembali ke Home</Text>
            </TouchableOpacity>
          ) : (
             allowCancellation && (
                <TouchableOpacity
                    onPress={onCancelBooking}
                    // Disable jika sedang loading ATAU sudah verified
                    disabled={isCancelling || isVerified}
                    className={`mt-6 w-full py-3.5 rounded-full items-center justify-center shadow-md 
                        ${(isCancelling || isVerified) ? 'bg-neutral-300' : 'bg-red-500 shadow-red-200'}`}
                >
                    {isCancelling ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className={`font-PoppinsBold text-base ${isVerified ? 'text-neutral-500' : 'text-white'}`}>
                            {isVerified ? "Tiket Terverifikasi" : "Batalkan Booking"}
                        </Text>
                    )}
                </TouchableOpacity>
             )
          )}

        </View>
      </View>
    </Modal>
  );
};

export default TicketModal;