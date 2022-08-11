interface CfGdriveResponse {
  url: string
  id: string
  imageMediaMetadata: {
    width: number
    height: number
  }
}

let banners: CfGdriveResponse[] = []
export default defineEventHandler(async ({ event }) => {
  const { index: tryIndex } = event.context.params as Record<string, string>

  const query = useQuery(event) as Record<string, string | undefined>
  const searchParams = new URLSearchParams(
    query as Record<string, string>
  ).toString()

  const index = Number.parseInt(tryIndex)
  if (Number.isNaN(index)) {
    // fallback to 0 if the index is not a number
    return sendRedirect(event, `/banner/0?${searchParams}`, 301)
  }

  if (banners.length === 0) {
    banners = await $fetch<CfGdriveResponse[]>(
      'https://cf-gdrive.terworking.workers.dev/?list'
    ).then((it) =>
      it.filter(({ imageMediaMetadata: { height, width } }) => width > height)
    )
  }

  // redirect wrap-around index
  const actualIndex = index === 0 ? 0 : index % banners.length
  if (actualIndex !== index) {
    return sendRedirect(event, `/banner/${actualIndex}?${searchParams}`, 301)
  }

  const banner = banners.at(actualIndex)!

  const url = new URL('https://images.weserv.nl')
  url.searchParams.append('url', banner.url)

  // set the output format to webp
  url.searchParams.append('output', 'webp')

  // set the (webp) quality
  url.searchParams.append('q', query.q ?? '80')

  // the filename must only contain alphanumeric characters
  const filename = banner.id.replaceAll(/[^A-Za-z0-9]/g, '')
  url.searchParams.append('filename', filename)

  const maybeWidth = Number.parseInt(query.w!)
  const width = Math.max(
    // defaults to 1440 if the query is invalid
    Number.isNaN(maybeWidth) || maybeWidth <= 0 ? 1440 : maybeWidth,
    // set the max width to the original's width
    banner.imageMediaMetadata.width
  )
  url.searchParams.append('w', width.toString())

  return sendRedirect(event, url.href)
})
