import { Image, Text, TouchableOpacity, View } from "react-native";

interface CampusButtonData {
  id: string;
  name: string;
  image: NodeRequire;
}

const campusData: CampusButtonData[] = [
  {
    id: "1",
    name: "BINUS @ Alam Sutera",
    image: require("../assets/images/binus-alam-sutera.png"),
  },
  {
    id: "2",
    name: "BINUS @ Kemanggisan Anggrek",
    image: require("../assets/images/binus-kemanggisan-anggrek.png"),
  },
  {
    id: "3",
    name: "BINUS @ Senayan",
    image: require("../assets/images/binus-senayan.png"),
  },
];

interface CampusDestinationButtonProps {
  onPress?: (campusId: string, campusName: string) => void;
}

const CampusDestinationButton = ({ onPress }: CampusDestinationButtonProps) => {
  return (
    <View className="flex-wrap flex-row gap-3">
      {campusData.map((campus) => (
        <TouchableOpacity
          key={campus.id}
          onPress={() => onPress?.(campus.id, campus.name)}
          className="relative overflow-hidden rounded-2xl"
          style={{ width: "48%" }}
        >
          <Image
            source={campus.image}
            className="w-full"
            style={{ aspectRatio: 165 / 122 }}
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/20" />
          <View className="absolute inset-0 flex justify-center items-center px-2">
            <Text className="text-white text-center font-PoppinsBold text-xs">
              {campus.name}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CampusDestinationButton;