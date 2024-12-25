import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useMedia } from "~/providers/MediaProvider";
import { getImagekitUrlFromPath } from "~/utils/imagekit";

export default function AssetPage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { getAssetById, syncToCloud } = useMedia()
  const asset = getAssetById(id)

  if (!asset) {
    return <Text>Media Not Found</Text>
  }
  let uri
  if (asset.isLocalAsset) {
    uri = asset.uri
  } else {
    uri = getImagekitUrlFromPath(asset.path, [
      { width: 600, height: 600 }
    ])
  }

  return (
    <View className="bg-black">
      <TouchableOpacity onPress={() => syncToCloud(asset)} className="z-50 absolute top-3 right-4">
        <AntDesign name="cloudupload" size={24} color="white" />
      </TouchableOpacity>
      <Image
        source={{ uri }}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </View>
  )
}
