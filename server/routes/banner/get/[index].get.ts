import { getBanners } from '~~/server/utils/banner'

export default defineEventHandler(async ({ event }) => {
  const { index: index } = event.context.params as Record<string, string>
  const query = new URLSearchParams(useQuery(event) as Record<string, string>)

  const banner = await getBanners().then(
    (banners) => banners[Number.parseInt(index)]
  )

  if (banner === undefined) return

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
