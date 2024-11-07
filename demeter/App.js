import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import "./global.css";

export default function App() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-4xl text-amber-400">Demeter test</Text>
      <StatusBar style="auto" />
    </View>
  );
}
