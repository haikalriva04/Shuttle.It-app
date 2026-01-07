import { icons } from "@/constants";
import { calculateRegion } from "@/lib/map";
import { useLocationStore } from "@/store";
import { useRef } from "react";
import { Dimensions, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const { height } = Dimensions.get("window");

interface MapProps {
    showDirections?: boolean;
}

const Map = ({ showDirections = false }: MapProps) => {
    const {
        userLongitude, 
        userLatitude, 
        destinationLatitude, 
        destinationLongitude, 
    } = useLocationStore();

    const mapRef = useRef<MapView>(null);

    const region = calculateRegion({
        userLongitude, 
        userLatitude, 
        destinationLatitude, 
        destinationLongitude,
    });

    return(
        <View style={{flex:1}}>
            <MapView 
                ref={mapRef}
                style={{flex:1}} 
                provider={PROVIDER_DEFAULT} 
                className="w-full h-full rounded-2xl" 
                showsPointsOfInterest={false} 
                tintColor="black"
                initialRegion={region} 
                userInterfaceStyle="dark"
                showsUserLocation={true}
            >
                {destinationLatitude && destinationLongitude && (
                    <Marker
                        key="destination"
                        coordinate={{
                            latitude: destinationLatitude,
                            longitude: destinationLongitude,
                        }}
                        title="Kampus Tujuan"
                        image={icons.pinKampusTujuan}
                    />
                )}

                {showDirections && userLatitude && userLongitude && destinationLatitude && destinationLongitude && (
                    <MapViewDirections
                        origin={{
                            latitude: userLatitude,
                            longitude: userLongitude,
                        }}
                        destination={{
                            latitude: destinationLatitude,
                            longitude: destinationLongitude,
                        }}
                        apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY!}
                        strokeWidth={4}
                        strokeColor="#0286FF"
                        onReady={(result) => {
                            mapRef.current?.fitToCoordinates(result.coordinates, {
                                edgePadding: {
                                    top: 60,     
                                    right: 20,   
                                    left: 20,    
                                    bottom: (height * 0.5) + 30,
                                },
                                animated: true,
                            });
                        }}
                        onError={(errorMessage) => {
                           console.log("Direction Error: ", errorMessage);
                        }}
                    />
                )}
            </MapView>
        </View>
    );
};

export default Map;