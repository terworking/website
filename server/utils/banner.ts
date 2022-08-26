interface CfGdriveResponse {
  url: string
  id: string
  imageMediaMetadata: {
    width: number
    height: number
  }
}

let banners: CfGdriveResponse[] = []
export const getBanners = async () => {
  if (banners.length === 0)
    banners = await $fetch<CfGdriveResponse[]>(
      'https://cf-gdrive.terworking.workers.dev/?list'
    ).then((it) =>
      it.filter(({ imageMediaMetadata: { height, width } }) => width > height)
    )

  return banners
}
