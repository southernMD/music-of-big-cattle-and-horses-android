import { apiTest } from "@/api"
import { View,Text } from "react-native"


export const Test: React.FC = ()=>{
    apiTest().then((data)=>{
        console.log(data);
    }).catch((err)=>{
        console.error(err);
    })
    return(
        <View>
            <Text>Test</Text>
        </View>
    )
}