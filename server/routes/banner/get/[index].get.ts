import { getBanners } from '~~/server/utils/banner'

export default defineEventHandler(async ({ event }) => {
  const { index: tryIndex } = event.context.params as Record<string, string>
  const query = new URLSearchParams(useQuery(event) as Record<string, string>)

  const index = Number.parseInt(tryIndex)
  if (Number.isNaN(index)) {
    // fallback to 0 if the index is not a number
    return sendRedirect(event, `/banner/get/0?${query}`, 301)
  }

  const banners = await getBanners()
  if (index >= banners.length) {
    return sendRedirect(
      event,
      `/banner/get/${index % banners.length}?${query}`,
      301
    )
  }

  const banner = banners[index]

  const filename = banner.id.replaceAll(/[^A-Za-z0-9]/g, '')
  const width = Math.min(
    Number.parseInt(query.get('w')!) || 500,
    banner.imageMediaMetadata.width
  ).toString()

  const searchParams = new URLSearchParams({
    url: banner.url,
    output: 'webp',
    filename,
    w: width,
  })

  return sendRedirect(event, `https://images.weserv.nl/?${searchParams}`)
})
