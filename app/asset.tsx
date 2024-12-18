import { AntDesign } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { Image, Text } from "react-native";
import { useMedia } from "~/providers/MediaProvider";

export default function AssetPage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { getAssetById } = useMedia()
  const asset = getAssetById(id)

  if (!asset) {
    return <Text>Media Not Found</Text>
  }

  return (
    <>
      <Stack.Screen options={{
        title: 'Photo',
        headerRight: () => <AntDesign name="cloudupload" size={24} color="black" />
      }}
      />
      <Image
        source={{ uri: asset.uri }}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </>
  )
}
