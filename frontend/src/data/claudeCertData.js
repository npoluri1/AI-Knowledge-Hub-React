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
    url: 'https://github.com/paullarionov/claude-certified-architect/blob/main/guide_en.md',
    label: 'Architect Foundations study guide (GitHub, paullarionov)',
    note: 'embedded below',
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
    note: 'schedule, reschedule & retakes',
  },
  {
    url: 'https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification',
    label: 'Anthropic Partner Skilljar — Architect Foundations Certification',
  },
]

export const PEARSON = {
  certs: [
    { code: 'CCAO-F', label: 'Claude Certified Associate — Foundations', url: 'https://anthropic-partners.skilljar.com/claude-certified-associate-foundations-certification' },
    { code: 'CCAR-F', label: 'Claude Certified Architect — Foundations', url: 'https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification' },
    { code: 'CCAR-P', label: 'Claude Certified Architect — Professional', url: 'https://anthropic-partners.skilljar.com/claude-certified-architect-professional-certification' },
    { code: 'CCDV-F', label: 'Claude Certified Developer — Foundations', url: 'https://anthropic-partners.skilljar.com/claude-certified-developer-foundations-certification' },
  ],
  scheduling: [
    'Register at the Anthropic Partner Academy to begin the scheduling process.',
    'First-time Pearson exam takers receive an email with their Pearson username and password.',
    'Log in to Pearson VUE to schedule, reschedule, or cancel your exam.',
    'Test-center appointments can be rescheduled or cancelled up to 24 hours before the appointment.',
    'Training/prep courses are available in the Partner Academy to members of the Claude Partner Network.',
  ],
  retakes: [
    { attempt: 'After 1st attempt', wait: '14 days' },
    { attempt: 'After 2nd attempt', wait: '30 days' },
    { attempt: 'After 3rd attempt', wait: '90 days' },
  ],
  maxAttempts: 'Up to 4 attempts per exam in any rolling 12-month period.',
  badges: 'Digital certification badges are issued by Anthropic through Credly.',
  onvueDomains: [
    '*.ably-realtime.com', '*.ably.io', '*.certiport.com', '*.gettesting.com', '*.onvue.com', '*.pdricloud.net',
    '*.pearson.com', '*.pearsonvue.com', '*.programworkshop.com', '*.programworkshop2.com', '*.pvue1.com',
    '*.pvue2.com', '*.startpractice.com', '*.starttest.com', '*.starttest2.com', '*.twilio.com',
    '*.verifyreadiness.com', '*.wowza.com',
  ],
  links: [
    { label: 'Pearson VUE — Anthropic page', url: 'https://www.pearsonvue.com/us/en/anthropic.html' },
    { label: 'Log in to schedule / reschedule / cancel', url: 'https://wsr.pearsonvue.com/testtaker/signin/SignInPage/ANTHROPIC?locale=en_US' },
    { label: 'Find a test center', url: 'https://wsr.pearsonvue.com/testtaker/find/testcenter/ANTHROPIC?locale=en_US' },
    { label: 'View exams', url: 'https://wsr.pearsonvue.com/testtaker/registration/examlist/ANTHROPIC?locale=en_US' },
    { label: 'OnVUE online testing info', url: 'https://www.pearsonvue.com/us/en/anthropic/onvue.html' },
    { label: 'Anthropic Partner Academy', url: 'https://anthropic-partners.skilljar.com/' },
  ],
}

