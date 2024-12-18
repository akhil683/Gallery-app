import { Link, Stack } from 'expo-router';
import { FlatList, Image, Text, TouchableOpacity } from 'react-native';
import { useMedia } from '~/providers/MediaProvider';

export default function Home() {
  const { loadLocalAssets, assets } = useMedia();


  return (
    <>
      <Stack.Screen options={{ title: 'Photos' }} />
      <Link href={"/asset"}>Go to asset Page</Link>
      <FlatList
        data={assets}
        numColumns={4}
        columnWrapperStyle={{ gap: 2 }}
        contentContainerStyle={{ gap: 2 }}
        onEndReached={loadLocalAssets} //Pagination: Load more when image list ended
        onEndReachedThreshold={2} // unit in visible height. e.g -> load more when when we have 2 more visible height images.
        // refreshing={loading}
        renderItem={({ item }) => (
          <Link href={`/asset?id=${item.id}`} asChild>
            <TouchableOpacity
              style={{ width: '25%' }}
            >
              <Image
                source={{ uri: item.uri }}
                style={{
                  width: '100%',
                  aspectRatio: 1,
                }}
              />
            </TouchableOpacity>
          </Link>
        )}
      />
      <TouchableOpacity onPress={loadLocalAssets}>
        <Text className="text-center">Next Page</Text>
      </TouchableOpacity>
    </>
  );
}
