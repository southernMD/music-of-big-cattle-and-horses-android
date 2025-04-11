import { apiTest } from "@/api"
import { useBasicApi } from "@/store"
import { getCredentials } from "@/utils/keychain"
import { useEffect } from "react"
import { View, Text } from "react-native"
import { useSnapshot } from "valtio"
import { customFetch as fetch } from "@/api/init";

export const Test: React.FC = () => {
    // apiTest().then((data)=>{
    //     console.log(data);
    // }).catch((err)=>{
    //     console.error(err);
    // })
    const { account, profile } = useSnapshot(useBasicApi);
    (() => {
        fetch(`/login/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    })()
    return (
        <View>
            <Text>{JSON.stringify(account)}</Text>
            <Text>{JSON.stringify(profile)}</Text>
        </View>
    )
}