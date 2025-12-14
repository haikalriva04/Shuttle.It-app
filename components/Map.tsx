import { calculateRegion, generateMarkersFromData } from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { MarkerData } from "@/types/type";
import { useEffect, useState } from "react";
import { View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

import { icons } from "@/constants";

const drivers = [
    {
            "driver_id": "1",
            "first_name": "Joko",
            "last_name": "Priyono",
            "profile_image_url": "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
            "car_seats": 30,
            "rating": "4.60"
        },
        {
            "driver_id": "2",
            "first_name": "Budi",
            "last_name": "Santoso",
            "profile_image_url": "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
            "car_image_url": "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
            "car_seats": 30,
            "rating": "4.80"
        },
        {
            "driver_id": "3",
            "first_name": "Gatot",
            "last_name": "Rusdiansyah",
            "profile_image_url": "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
            "car_image_url": "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
            "car_seats": 30,
            "rating": "4.80"
        },
        {
            "driver_id": "4",
            "first_name": "Muhammad",
            "last_name": "Sumbul",
            "profile_image_url": "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
            "car_image_url": "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
            "car_seats": 30,
            "rating": "4.70"
        }
]


const Map = () => {
    const {
        userLongitude, 
        userLatitude, 
        destinationLatitude, 
        destinationLongitude, 
    } = useLocationStore();
    const { selectedDriver, setDrivers } = useDriverStore();
    const[ markers, setMarkers ] = useState<MarkerData[]>([])



    const region = calculateRegion({
        userLongitude, 
        userLatitude, 
        destinationLatitude, 
        destinationLongitude,
    });

    useEffect(() => {
        if(Array.isArray(drivers)) {
            if(!userLatitude || !userLongitude) return;

            const newMarkers = generateMarkersFromData
            ({
                data: drivers,
                userLatitude,
                userLongitude,
            });

            setMarkers(newMarkers)
        }
    }, [drivers]);

        return(
<View style={{flex:1}}>
       <MapView style={{flex:1}} provider={PROVIDER_DEFAULT} 
       className="w-full h-full rounded-2xl" showsPointsOfInterest={false} 
       tintColor="black"
       initialRegion={region} 
       // showsUserLocation={true}
       userInterfaceStyle="dark"
       >
              {markers.map((marker) => (
            <Marker 
            key={marker.id} 
            coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude
            }}
            title={marker.title} 
            image={
                selectedDriver === marker.id ? icons.selectedMarker : icons.marker
            }
            />
        ))}
       </MapView>
</View>
    );
};

export default Map;