import { H3Event } from 'h3';

const getClientIp = (event: H3Event) => {
  const fallback = '127.0.0.1';
  if (process.env.NODE_ENV === 'development') return fallback;

  const headers = event.req.headers;
  return (
    // netlify
    (headers['x-nf-client-connection-ip'] ??
      // vercel
      headers['x-vercel-forwarded-for'] ??
      // cloudflare workers
      headers['cf-connecting-ip'] ??
      // others?
      headers['x-forwarded-for'] ??
      headers['x-real-ip'] ??
      fallback) as string
  );
};

export default defineEventHandler(({ event }) => {
  const clientIp = getClientIp(event.event);

  event.context.shared = { clientIp };
});
