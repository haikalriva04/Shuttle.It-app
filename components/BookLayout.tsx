import { View } from "react-native";


const BookLayout = ({ children }: { children: React.ReactNode}) => {
    return(
            <GestureHandler>
                <View>
            {children}
                </View>
            </GestureHandler>

    );
};
export default BookLayout;