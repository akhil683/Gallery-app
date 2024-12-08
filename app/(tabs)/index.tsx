import * as MediaLibrary from 'expo-media-library';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, Text } from 'react-native';

export default function Home() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [localAssets, setLocalAssets] = useState<MediaLibrary.Asset[]>([])

  useEffect(() => {
    if (permissionResponse?.status !== 'granted') {
      requestPermission();
    }
  }, []);
  useEffect(() => {
    if (permissionResponse?.status === 'granted') {
      loadLocalAssets();
    }
  }, [permissionResponse]);

  const loadLocalAssets = async () => {
    const assetsPage = await MediaLibrary.getAssetsAsync();
    setLocalAssets(assetsPage?.assets);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Photos' }} />
      <FlatList
        data={localAssets}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.uri }}
            style={{
              width: 250,
              height: 250,
            }}
          />
        )}
      />
    </>
  );
}
