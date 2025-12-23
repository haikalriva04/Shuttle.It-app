import { icons } from "@/constants";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import TicketModal from "./TicketModal";

interface BookingData {
  id: string;
  origin: string;
  destination: string;
  date: string;      
  time: string;      
  bookingDate: string; 
}

const BookingCard = ({ item }: { item: BookingData }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        className="bg-white rounded-2xl mb-4 shadow-sm border border-neutral-100 flex-row overflow-hidden mx-5 h-[100px]"
        activeOpacity={0.7}
      >
        <View className="w-[85px] bg-blue-50/50 justify-center items-center border-r border-dashed border-gray-200 relative">
            <View className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white rounded-full z-10" />
            <View className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white rounded-full z-10" />
            
            <QRCode value={item.id} size={50} color="black" backgroundColor="transparent"/>
        </View>

        <View className="flex-1 p-3 justify-center bg-white">
            <View className="flex-row items-center mb-2">
                <Text className="text-xs font-PoppinsBold text-neutral-800 flex-1" numberOfLines={1}>
                    {item.origin}
                </Text>
                <Image source={icons.rightArrow} className="w-3 h-3 mx-2 opacity-40" resizeMode="contain" />
                <Text className="text-xs font-PoppinsBold text-neutral-800 flex-1 text-right" numberOfLines={1}>
                    {item.destination}
                </Text>
            </View>

            <View className="h-[1px] bg-neutral-100 w-full mb-2" />

            <View className="flex-row justify-between items-end">
                <View>
                    <Text className="text-[10px] text-gray-400 font-PoppinsMedium">Jadwal</Text>
                    <Text className="text-xs font-PoppinsSemiBold text-blue-600">
                        {item.date} • {item.time}
                    </Text>
                </View>
                <View className="items-end">
                     <Text className="text-[9px] text-gray-300 font-PoppinsRegular">Dipesan</Text>
                     <Text className="text-[9px] text-gray-400 font-PoppinsRegular">{item.bookingDate}</Text>
                </View>
            </View>
        </View>
      </TouchableOpacity>

      <TicketModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        type="history"
        data={{
            id: item.id,
            origin: item.origin,
            destination: item.destination,
            date: item.date,
            time: item.time,
        }}
      />
    </>
  );
};

export default BookingCard;