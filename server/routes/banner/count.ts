import { getBanners } from '~~/server/utils/banner'

export default defineEventHandler(() =>
  getBanners().then((banners) => banners.length)
)
