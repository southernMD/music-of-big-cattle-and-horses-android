import { usePersistentStore } from "@/hooks/usePersistentStore";
import { createContext, memo, useContext, useState } from "react";
import { Modal, View, ActivityIndicator, StyleSheet } from "react-native";

type LoadingMaodalContextValue = {
    showLoadingModal: (time?:number) => { clear: () => void };
};

const LoadingMaodalContext = createContext<LoadingMaodalContextValue>({
    showLoadingModal: () => { return { clear: () => { }} },
});

export const LoadingMaodalProvider: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const primaryColor = usePersistentStore<string>('primaryColor')
    
    const showLoadingModal = (time?:number) => {
        console.log('showLoadingModal');
        
        setIsVisible(true)
        if(time){
            const t = setTimeout(() => {
                clearTimeout(t)
                setIsVisible(false)
            }, time)
        }
        return  {
            clear: () => setIsVisible(false)
        };
    }

    const styles = StyleSheet.create({
        loadingOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
    })

    const contextValue: LoadingMaodalContextValue = {
        showLoadingModal
    };
    return (
        <LoadingMaodalContext.Provider value={contextValue}>
            {children}
            <Modal visible={isVisible} transparent animationType="fade">
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={primaryColor} />
                </View>
            </Modal>
        </LoadingMaodalContext.Provider>
    )
})

export const useLoadingModal = () => {
    return useContext(LoadingMaodalContext);
};