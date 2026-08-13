export const CERTS = [
  { name: 'Claude Certified Associate', level: 'Foundations', price: 99, icon: '🎓' },
  { name: 'Claude Certified Architect', level: 'Foundations', price: 125, icon: '🏛️' },
  { name: 'Claude Certified Developer', level: 'Foundations', price: 125, icon: '🧑‍💻' },
  { name: 'Claude Certified Architect', level: 'Professional', price: 175, icon: '🚀' },
]

export const CERTS_TOTAL = CERTS.reduce((sum, c) => sum + c.price, 0)

export const VIDEOS = [
  {
    url: 'https://www.youtube.com/watch?v=reDRM0tqhNs',
    label: 'Claude Certification — study walkthrough',
  },
  {
    url: 'https://www.youtube.com/watch?v=of9PPnuBedU',
    label: 'Claude Certified — prep video',
  },
  {
    url: 'https://www.youtube.com/watch?v=rcpNFm_poQs&list=PLviC8AFqAj5A9MHkRIn2fU5Ac2lEdJxNf',
    label: 'Claude Certification playlist (peace of code)',
  },
  {
    url: 'https://www.youtube.com/@peaceofcode/videos',
    label: 'Peace of Code — channel videos',
  },
]

export const STUDY_LINKS = [
  {
    url: 'https://jacinthpaul.github.io/Claude-Certified-Architect/',
    label: 'Claude Certified Architect — study guide (GitHub Pages)',
  },
  {
    url: 'https://www.certsafari.com/anthropic/claude-certified-architect-foundations',
    label: 'CertSafari — Claude Certified Architect Foundations',
  },
  {
    url: 'https://drive.google.com/file/d/1z1lTiI9w4O7ZFZ33LWgdyWUU_irwzl2i/view',
    label: 'Certification study notes (Google Drive PDF)',
  },
  {
    url: 'https://www.pearsonvue.com/us/en/anthropic.html',
    label: 'Pearson VUE — Anthropic exam booking',
    note: 'not yet public',
  },
  {
    url: 'https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification',
    label: 'Anthropic Partner Skilljar — Architect Foundations Certification',
  },
]
