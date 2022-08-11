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

  const query = useQuery(event)
  const searchParams = new URLSearchParams(
    query as Record<string, string>
  ).toString()

  const index = Number.parseInt(tryIndex)
  if (Number.isNaN(index)) {
    return sendRedirect(event, `/banner/0?${searchParams}`, 301)
  }

  if (banners.length === 0) {
    banners = await $fetch<CfGdriveResponse[]>(
      'https://cf-gdrive.terworking.workers.dev/?list'
    ).then((it) =>
      it.filter(({ imageMediaMetadata: { height, width } }) => width > height)
    )
  }

  const actualIndex = index === 0 ? 0 : index % banners.length
  if (actualIndex !== index) {
    return sendRedirect(event, `/banner/${actualIndex}?${searchParams}`, 301)
  }

  const banner = banners.at(actualIndex)!

  const url = new URL('https://images.weserv.nl')
  url.searchParams.append('url', banner.url)
  url.searchParams.append('output', 'webp')
  url.searchParams.append('q', '80')

  const width = Math.min(
    Number.parseInt(query.w as string),
    banner.imageMediaMetadata.height
  )
  url.searchParams.append(
    'w',
    Number.isNaN(width) || width <= 0 ? '1440' : width.toString()
  )

  const filename = `${banner.id}.webp`
  const response = await fetch(url.href)
  appendHeader(event, 'Content-Type', 'image/webp')
  appendHeader(event, 'Cache-Control', 'public, max-age=604800')
  appendHeader(event, 'Content-Disposition', `inline; filename="${filename}"`)
  appendHeader(event, 'Content-Length', response.headers.get('Content-Length')!)

  return response.body
})
