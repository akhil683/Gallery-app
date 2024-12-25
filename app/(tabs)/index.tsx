import { AntDesign } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { FlatList, Image, Text, TouchableOpacity } from 'react-native';
import { useMedia } from '~/providers/MediaProvider';
import { getImagekitUrlFromPath } from '~/utils/imagekit';

export default function Home() {
  const { loadLocalAssets, assets } = useMedia();


  return (
    <>
      <FlatList
        data={assets}
        numColumns={4}
        columnWrapperStyle={{ gap: 2 }}
        contentContainerStyle={{ gap: 2, backgroundColor: 'black' }}
        onEndReached={loadLocalAssets} //Pagination: Load more when image list ended
        onEndReachedThreshold={2} // unit in visible height. e.g -> load more when when we have 2 more visible height images.
        // refreshing={loading}
        renderItem={({ item }) => (
          <Link href={`/asset?id=${item.id}`} asChild>
            <TouchableOpacity
              style={{ width: '25%' }}
            >
              <Image
                source={{
                  uri: item.isLocalAsset
                    ? item.uri
                    : getImagekitUrlFromPath(item.path, [
                      { width: 600, height: 600 },
                    ])
                }}
                style={{
                  width: '100%',
                  aspectRatio: 1,
                }}
              />
              {!assets.isBackedUp && item.isLocalAsset &&
                <AntDesign name='cloudupload' size={18} color={"white"} className='absolute right-2 bottom-2' />
              }
            </TouchableOpacity>
          </Link>
        )}
      />
      {/* <TouchableOpacity onPress={loadLocalAssets}> */}
      {/*   <Text className="text-center">Next Page</Text> */}
      {/* </TouchableOpacity> */}
    </>
  );
}
