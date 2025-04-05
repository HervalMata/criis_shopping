import {Link, Stack} from "expo-router";
import {StyleSheet,View} from "react-native";

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Oops! This screen does not exist!.' }} />
            <View style={styles.container}>
                <Link href="/">Go to home screen</Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});