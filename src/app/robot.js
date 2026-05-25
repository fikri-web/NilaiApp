export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // Opsional: jika ada folder yang ingin disembunyikan
    },
    sitemap: 'https://nilai-app-pi.vercel.app/sitemap.xml',
  }
}