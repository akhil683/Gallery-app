// eslint-disable
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system"
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { decode } from "base64-arraybuffer";
import { supabase } from "~/utils/supabase";
import { useAuth } from "./AuthProvider";
import mime from "mime";

type MediaContextType = {
  assets: MediaLibrary.Asset[],
  loadLocalAssets: () => void,
  getAssetById: (id: string) => MediaLibrary.Asset | undefined
  syncToCloud: (asset: MediaLibrary.Asset) => void
}

const MediaContext = createContext<MediaContextType>({
  assets: [],
  loadLocalAssets: () => { },
  getAssetById: () => undefined,
  syncToCloud: () => { }
})

export function MediaContextProvider({ children }: PropsWithChildren) {

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [localAssets, setLocalAssets] = useState<MediaLibrary.Asset[]>([])
  const [hasNextPage, setHasNextPage] = useState(true);
  const [endCursor, setEndCursor] = useState<string>();
  const [loading, setLoading] = useState(false)

  const [remoteAssets, setRemoteAssets] = useState<any[]>([])

  const assets = [
    ...remoteAssets,
    ...localAssets.filter(assets => !assets.isBackedUp)
  ]

  useEffect(() => {
    loadRemoteAssets()
  }, [])

  const { user } = useAuth()

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

  const loadRemoteAssets = async () => {
    const { data, error } = await supabase.from('assets').select('*')
    setRemoteAssets(data)
  }
  const loadLocalAssets = async () => {
    if (loading || !hasNextPage) {
      return;
    }
    setLoading(true);

    const assetsPage = await MediaLibrary.getAssetsAsync({ after: endCursor });
    const newAssets = await Promise.all(assetsPage.assets.map(async (asset) => {
      //check if asset is already backedup 
      //check id of the asset in supabase assets collection
      const { count } = await supabase
        .from("assets")
        .select("*", { count: 'exact', head: true })
        .eq('id', asset.id)
      return {
        ...asset,
        isBackedUp: !!count && count > 0,
        isLocalAsset: true,
      }
    }))

    setLocalAssets((existingItems) => [...existingItems, ...newAssets]);
    setHasNextPage(assetsPage?.hasNextPage);
    setEndCursor(assetsPage?.endCursor);

    setLoading(false);
  };

  const getAssetById = (id: string) => {
    return assets.find((asset) => asset.id === id);
  }

  const syncToCloud = async (asset: MediaLibrary.Asset) => {
    const info = await MediaLibrary.getAssetInfoAsync(asset)

    if (!info.localUri || !user) return

    const base64string = await FileSystem.readAsStringAsync(
      info.localUri,
      { encoding: 'base64' }
    )
    const arrayBuffer = decode(base64string)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('assets')
      .upload(`${user?.id}/${asset.filename}`, arrayBuffer, {
        contentType: mime.getType(asset.filename) ?? "image/jpg",
        upsert: true, //replace existing url
      })
    console.log(uploadData, uploadError)
    if (uploadData) {
      const { data, error } = await supabase.from('assets').upsert({
        id: asset.id,
        path: uploadData?.path,
        user_id: user.id,
        object_id: uploadData?.id,
        mediaType: asset.mediaType,
      })
        .select()
        .single()
      console.log(data, error)
    }
  }

  return (
    <MediaContext.Provider value={{
      assets,
      loadLocalAssets,
      getAssetById,
      syncToCloud
    }}>
      {children}
    </MediaContext.Provider>
  )
}

export const useMedia = () => useContext(MediaContext)

