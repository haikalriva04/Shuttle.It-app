import { calculateRegion } from "@/lib/map";
import { useLocationStore } from "@/store";
import { View } from "react-native";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";



const Map = () => {
    const {
        userLongitude, 
        userLatitude, 
        destinationLatitude, 
        destinationLongitude, 
    } = useLocationStore();


    const region = calculateRegion({
        userLongitude, 
        userLatitude, 
        destinationLatitude, 
        destinationLongitude,
    });

    return(
<View style={{flex:1}}>
       <MapView style={{flex:1}} provider={PROVIDER_DEFAULT} 
       className="w-full h-full rounded-2xl" showsPointsOfInterest={false} 
       tintColor="black"
       initialRegion={region} 
       showsUserLocation={true}
       userInterfaceStyle="dark"
       >
       </MapView>
</View>
    );
};

export default Map;