export const DEVICES = [
  { id: 'phone', label: 'iPhone', short: 'iPhone', icon: '📱', frame: 'phone', width: 390, height: 844, note: '390 × 844 · pocket' },
  { id: 'tablet', label: 'iPad', short: 'iPad', icon: '📲', frame: 'tablet', width: 1024, height: 768, note: '1024 × 768 · tablet' },
  { id: 'laptop', label: 'MacBook Pro', short: 'MacBook', icon: '💻', frame: 'laptop', width: 1512, height: 982, note: '1512 × 982 · laptop' },
  { id: 'desktop', label: 'iMac', short: 'iMac', icon: '🖥️', frame: 'desktop', width: 2560, height: 1440, note: '2560 × 1440 · desktop' },
  { id: 'pro', label: 'Mac Pro', short: 'Mac Pro', icon: '🖥️', frame: 'pro', width: 3440, height: 1440, note: '3440 × 1440 · ultrawide' },
  { id: 'proMax', label: 'Mac Pro Max', short: 'Pro Max', icon: '🖥️', frame: 'proMax', width: 5120, height: 2880, note: '5120 × 2880 · 5K studio' },
]

export const DEVICE_MAP = Object.fromEntries(DEVICES.map(d => [d.id, d]))

export const HERO_PICKS = {
  phone: '/screens',
  tablet: '/screens',
  laptop: '/screens',
  desktop: '/screens',
  pro: '/screens',
  proMax: '/screens',
}

export function deviceForWidth(width) {
  if (width <= 768) return DEVICE_MAP.phone
  if (width <= 1180) return DEVICE_MAP.tablet
  if (width <= 1728) return DEVICE_MAP.laptop
  if (width <= 2399) return DEVICE_MAP.desktop
  if (width <= 3439) return DEVICE_MAP.pro
  return DEVICE_MAP.proMax
}

export function deviceForPath(path) {
  const p = String(path || '/')
  if (p === '/screens') return DEVICE_MAP.desktop
  if (p.startsWith('/video-hub') || p.startsWith('/linked-posts')) return DEVICE_MAP.phone
  if (p.startsWith('/books') || p.startsWith('/learn') || p.startsWith('/playbook')) return DEVICE_MAP.tablet
  if (p.startsWith('/trading') || p.startsWith('/design-space') || p.startsWith('/ai-jobs-global')) return DEVICE_MAP.pro
  return DEVICE_MAP.laptop
}
