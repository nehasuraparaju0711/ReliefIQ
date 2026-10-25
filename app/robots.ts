import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/app/settings',
    },
    sitemap: 'https://reliefiq.vercel.app/sitemap.xml',
  };
}
