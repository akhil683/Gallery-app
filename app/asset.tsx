import { AntDesign } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useMedia } from "~/providers/MediaProvider";

export default function AssetPage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { getAssetById, syncToCloud } = useMedia()
  const asset = getAssetById(id)

  if (!asset) {
    return <Text>Media Not Found</Text>
  }

  return (
    <View className="bg-black">
      {/* <Stack.Screen options={{ */}
      {/*   title: 'Photo', */}
      {/*   headerRight: () => <AntDesign name="cloudupload" size={24} color="black" /> */}
      {/* }} */}
      {/* /> */}
      <TouchableOpacity onPress={() => syncToCloud(asset)} className="z-50 absolute top-3 right-4">
        <AntDesign name="cloudupload" size={24} color="white" />
      </TouchableOpacity>
      <Image
        source={{ uri: asset.uri }}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </View>
  )
}
