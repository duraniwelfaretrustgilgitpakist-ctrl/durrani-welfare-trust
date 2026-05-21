import { MetadataRoute } from 'next';

const BASE = 'https://durrani-welfare-trust.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE,                         lastModified: now, changeFrequency: 'weekly',  priority: 1 },
    { url: `${BASE}/about`,              lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/about/team`,         lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/services`,           lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/services/orphanage-for-girls`,        lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/services/ambulance-services`,         lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/services/women-empowerment`,          lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/services/education-programmes`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/services/clean-water-infrastructure`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/services/food-distribution`,          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/services/marriage-support`,           lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/services/infant-care-adoption`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/donate`,             lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/volunteer`,          lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/gallery`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/news`,               lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/contact`,            lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
