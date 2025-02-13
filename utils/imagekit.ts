import ImageKit from "imagekit-javascript";

const urlEndpoint = process.env.EXPO_PUBLIC_IMAGEKIT_URL!
const publicKey = process.env.EXPO_PUBLIC_IMAGEKIT_KEY!

const imagekit = new ImageKit({
  urlEndpoint,
  publicKey
})

export const getImagekitUrlFromPath = function(
  imagePath: string,
  transformationArray: any[],
) {
  const ikOptions = {
    urlEndpoint,
    path: imagePath,
    tranformation: transformationArray,
  }
  const imageURL = imagekit.url(ikOptions)

  return imageURL
}
