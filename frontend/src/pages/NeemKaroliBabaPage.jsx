import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './NeemKaroliBabaPage.css'

const IMAGES = [
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Neemkaroli%2014.jpg?width=900',
    alt: 'Neem Karoli Baba seated in a shawl',
    title: 'Maharaj-ji',
    caption: 'A widely shared archival portrait of Neem Karoli Baba, affectionately called Maharaj-ji by devotees.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Neem_Karoli_Baba',
    sourceLabel: 'View file and license',
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Neem%20Karoli%20Baba%2C%20Samadhi%20Mandir%2C%20Vrindavan.JPG?width=1200',
    alt: 'Neem Karoli Baba Samadhi Mandir in Vrindavan',
    title: 'Samadhi Mandir · Vrindavan',
    caption: 'The temple at Vrindavan associated with his samadhi and remembrance.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Neem_Karoli_Baba',
    sourceLabel: 'View file and license',
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Early%20morning%20Glimpse%20of%20Kainchi%20Dham%20Nainital%202023.jpg?width=1200',
    alt: 'Kainchi Dham in the early morning',
    title: 'Kainchi Dham',
    caption: 'Kainchi Dham, the Himalayan ashram founded by Maharaj-ji and known for its Hanuman temple.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Neem_Karoli_Baba',
    sourceLabel: 'View file and license',
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Statue%20and%20Samadhi%20of%20Neem%20Karoli%20Baba%20at%20Kainchi%20Dham.jpg?width=1000',
    alt: 'Statue and samadhi of Neem Karoli Baba at Kainchi Dham',
    title: 'A place of remembrance',
    caption: 'A quiet visual reminder of the tradition of devotion, service, and remembrance.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Neem_Karoli_Baba',
    sourceLabel: 'View file and license',
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kainchi%20Dhaam%20Neem%20Karoli%20Temple.jpg?width=1200',
    alt: 'Kainchi Dham Neem Karoli temple',
    title: 'Kainchi Dham temple',
    caption: 'The temple complex and mountain setting connected with Maharaj-ji’s legacy.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Neem_Karoli_Baba',
    sourceLabel: 'View file and license',
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Neem%20Karoli%20Baba%20Sculpture%20in%20Ram%20Dass%20Library.jpg?width=1200',
    alt: 'Neem Karoli Baba sculpture in the Ram Dass Library',
    title: 'A contemporary remembrance',
    caption: 'A sculpture preserved in the Ram Dass Library at the Omega Institute.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Neem_Karoli_Baba_Sculpture_in_Ram_Dass_Library.jpg',
    sourceLabel: 'View file and license',
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/2017-12-25-18-26-41-631%20Neem%20karoli%20baba%20ji%20ka%20ashram%202.jpg?width=1200',
    alt: 'Neem Karoli Baba ashram building',
    title: 'Ashram life',
    caption: 'An ashram view that evokes the ordinary places where prayer, hospitality, and service meet.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Neem_Karoli_Baba',
    sourceLabel: 'View file and license',
  },
]

const TIMELINE = [
  ['c. 1900', 'Birth and early life', 'Neem Karoli Baba was born as Lakshman Narayan Sharma in Akbarpur, in present-day Uttar Pradesh. Public sources give an approximate birth year rather than a certain date.'],
  ['Early 20th century', 'A life of renunciation', 'He became known as a sadhu and spiritual teacher. Stories of his travels and service circulated through devotees; many details belong to oral and devotional tradition.'],
  ['Mid-century', 'Ashrams and service', 'His work became associated with places including Kainchi Dham, Vrindavan, and other Hanuman temples and ashrams. The community around him served visitors through food, prayer, and practical care.'],
  ['1960s–1970s', 'Western students arrive', 'Richard Alpert, later known as Ram Dass, met him in India. The meeting influenced Ram Dass’s life and helped introduce Maharaj-ji’s teachings of love and service to a wider audience.'],
  ['11 Sep 1973', 'Mahasamadhi in Vrindavan', 'Neem Karoli Baba died in Vrindavan. His devotees continue to gather at Kainchi Dham and other sites connected with his life and teachings.'],
]

const TEACHINGS = [
  { icon: '❤️', title: 'Love everyone', text: 'Meet people with compassion rather than reducing them to status, identity, success, or failure. Love here is a practice of seeing the person in front of you and responding with kindness.' },
  { icon: '🤲', title: 'Serve everyone', text: 'Turn spirituality into useful action: feed someone, listen carefully, do honest work, care for family, and help without needing applause.' },
  { icon: '🙏', title: 'Remember God', text: 'Keep a thread of remembrance through prayer, mantra, silence, gratitude, or sincere attention. The form can differ; the intention is to return the mind to what is sacred.' },
  { icon: '🪞', title: 'Tell the truth', text: 'Truth means honesty with others and yourself. Speak responsibly, admit mistakes quickly, and do not use spirituality as an excuse to avoid reality.' },
  { icon: '🍚', title: 'Feed and care for people', text: 'The ashram tradition placed strong emphasis on prasad, hospitality, and practical care. A better life is built through ordinary generosity as much as extraordinary experiences.' },
  { icon: '🌱', title: 'Let the ego become useful', text: 'Achievement can become service when it is not only for personal praise. Use your skills, money, influence, and time to reduce suffering and create something beneficial.' },
]

const QUOTES = [
  { text: 'Love everyone, serve everyone, remember God, and tell the truth.', note: 'Widely attributed to Neem Karoli Baba; wording varies across books and oral accounts.', sourceUrl: 'https://www.ramdass.org/neem-karoli-baba-maharaji-stories-lessons-wisdom/' },
  { text: 'Love is the strongest medicine. It is more powerful than electricity.', note: 'Commonly attributed to Maharaj-ji in devotional quote collections; preserve as an attributed saying, not a verbatim archival transcript.', sourceUrl: 'https://maharajji.love/quotes-from-maharajji/' },
  { text: 'Sub Ek — all is one.', note: 'A short expression associated with his teaching and the devotional tradition around him.', sourceUrl: 'https://www.ramdass.org/teacher/neem-karoli-baba/' },
  { text: 'How do I know?', note: 'A recurring answer remembered by devotees and recorded in stories about his deliberately elusive way of teaching.', sourceUrl: 'https://www.ramdass.org/neem-karoli-baba-maharaji-stories-devotees/' },
]

const RESOURCES = [
  { icon: '🏔️', label: 'Ashram & practice', title: 'Neem Karoli Baba Ashram', description: 'Ashram information, Kainchi Dham background, and devotional resources from the Love Serve Remember Foundation.', href: 'https://nkbashram.org/' },
  { icon: '📖', label: 'First-hand stories', title: 'Ram Dass archive', description: 'Talks, stories, and reflections from Ram Dass about his teacher and the path of love and service.', href: 'https://www.ramdass.org/teacher/neem-karoli-baba/' },
  { icon: '🖼️', label: 'Open image archive', title: 'Wikimedia Commons', description: 'Browse individual image files, metadata, creators, and reuse licenses before downloading or publishing.', href: 'https://commons.wikimedia.org/wiki/Category:Neem_Karoli_Baba' },
  { icon: '🛕', label: 'Temple information', title: 'Shree Kainchi Mandir Trust', description: 'Temple-focused information for visitors seeking the Kainchi Dham tradition and current notices.', href: 'https://shreekainchimandirtrust.org/' },
]

const DAILY_PRACTICE = [
  ['Morning remembrance', 'Before your phone, take three quiet minutes. Breathe, pray, or repeat a name that brings steadiness.'],
  ['One act of service', 'Do one useful thing for another person without announcing it: share food, answer patiently, or make someone’s work lighter.'],
  ['Truth check', 'Ask: “Where am I pretending?” Choose one honest conversation or one small correction you have been avoiding.'],
  ['Work as offering', 'Give full attention to one important task. Excellence, when it helps others, can be a form of service.'],
  ['Evening review', 'Write three lines: where I gave love, where I caused harm, and what I will do differently tomorrow.'],
]

// ── God-related devotional video library ────────────────────────────────
// A universal, date-aware video section: every shared/pastable video URL is
// stored locally, filtered by platform + date range, sorted, and played
// inline through official embeds (YouTube, X/Twitter, Instagram, TikTok,
// Facebook). Nothing is stored on a server — the library lives in the browser.

const NK_VIDEO_KEY = 'nk-gods-videos-v2'

// Traditional liturgical chant texts (Telugu script) — read along while the
// video plays. These are standard, widely published prayer verses.
const MANTRA = {
  maharajji: {
    type: 'Maharaj-ji refrain',
    telugu: 'అందరినీ ప్రేమించండి, అందరికి సేవ చేయండి, దైవాన్ని తలచుకోండి, నిజం చెప్పండి',
    translit: 'Andarini preminchandi · andariki seva cheyandi · daivanni talachukondi · nijam cheppandi',
    meaning: '“Love everyone, serve everyone, remember God, and tell the truth.” — the heartbeat of this tradition.',
    blessing: 'Maharaj-ji’s own instruction for a blessed life of love and service.',
  },
  hanuman: {
    type: 'Hanuman Chalisa (opening Doha, Telugu)',
    telugu: 'శ్రీ గురు చరణ సరోజ రజ నిజమన ముకుర సుధారి । వరణౌ రఘువర విమలయశ జో దాయక ఫలచారి ॥ బుద్ధిహీన తనుజానికై సుమిరౌ పవన కుమార । బల బుద్ధి విద్యా దేహు మోహి హరహు కలేశ వికార ॥',
    translit: 'Sri Guru charana saroja raja, nija mana mukura sudhaari | Varanau Raghuvara vimalayasha, jo daayaka phala chaari | Buddheheen tanu jaanike, sumirau Pavan Kumara | Bala buddhi vidya dehu mohi, harahu kalesha vikaara.',
    meaning: 'The opening doha prays: through Hanuman’s grace, may strength, wisdom, and learning be granted and all distress removed.',
    blessing: 'Chant for courage, protection, removal of obstacles, and divine blessing.',
  },
  suprabhatam: {
    type: 'Venkateswara Suprabhatam (first verse)',
    telugu: 'కౌసల్యా సుప్రజా రామ పూర్వా సంధ్యా ప్రవర్తతే । ఉత్తిష్ఠ నరశార్దూల కర్తవ్యం దైవమాహ్నికమ్ ॥',
    translit: 'Kausalya supraja Rama, poorva sandhya pravartate | Uttishta narashardula, kartavyam daivamahnikam.',
    meaning: '“Awake, Rama, beloved son of Kausalya — the dawn is at hand; rise and do the work the day demands.”',
    blessing: 'The classic Tirumala sunrise invocation — chanted for a blessed, fortunate new day.',
  },
  gayatri: {
    type: 'Gayatri Mantra',
    telugu: 'ఓం భూర్భువః స్వః । తత్సవితుర్వరేణ్యం । భర్గో దేవస్య ధీమహి । ధియో యో నః ప్రచోదయాత్ ॥',
    translit: 'Om Bhur Bhuvah Svah | Tat Savitur Varenyam | Bhargo Devasya Dheemahi | Dhiyo Yo Nah Prachodayat.',
    meaning: '“We meditate on the glorious light of the divine Sun — may it awaken our intellect and guide us.”',
    blessing: 'The supreme Vedic mantra, chanted for wisdom, clarity, inner peace, and grace.',
  },
  mrityunjaya: {
    type: 'Maha Mrityunjaya Mantra',
    telugu: 'ఓం త్ర్యంబకం యజామహే సుగంధిం పుష్టివర్ధనమ్ । ఉర్వారుకమివ బంధనాన్మృత్యోర్ముక్షీయ మామృతాత్ ॥',
    translit: 'Om Tryambakam Yajamahe, Sugandhim Pushtivardhanam | Urvarukamiva Bandhanan, Mrityor Muksheeya Maamritat.',
    meaning: '“We worship the Three-Eyed One, fragrant and nourishing of all life — may we be released from bondage like a ripened cucumber from its stem.”',
    blessing: 'The great healing and protection mantra — chanted for health, longevity, and auspicious fortune.',
  },
  venkatesha: {
    type: 'Venkateswara mantra',
    telugu: 'ఓం నమో వేంకటేశాయ । శ్రీ వేంకటేశాయ స్వాహా ।',
    translit: 'Om Namo Venkateshaya | Sri Venkateshaya Svaha.',
    meaning: '“I bow to Lord Venkateswara of Tirumala, the granter of blessings and fortune.”',
    blessing: 'Invoked every day at Tirumala for prosperity, good luck, and divine grace.',
  },
  lakshmi: {
    type: 'Lakshmi mantra',
    telugu: 'ఓం శ్రీం మహాలక్ష్మ్యై నమః ।',
    translit: 'Om Shreem Mahalakshmyai Namah.',
    meaning: '“I bow to Goddess Mahalakshmi, giver of wealth and abundance.”',
    blessing: 'Recited on Fridays for wealth, abundance, and good fortune.',
  },
  lakshminarayana: {
    type: 'Lakshmi Narayana mantra',
    telugu: 'ఓం శ్రీ లక్ష్మీనారాయణాయ నమః ।',
    translit: 'Om Sri Lakshminarayanaya Namah.',
    meaning: '“I bow to Lakshmi Narayana — abundance and divine protection in union.”',
    blessing: 'A power mantra for wealth, prosperity, and blessing on home and work.',
  },
  rama: {
    type: 'Rama mantra',
    telugu: 'శ్రీ రామ జయ రామ జయ జయ రామ ।',
    translit: 'Sri Rama Jaya Rama Jaya Jaya Rama.',
    meaning: '“Victory to Lord Rama” — a simple, beloved name-mantra of the Ram tradition.',
    blessing: 'Chanted for peace, protection, and the removal of obstacles.',
  },
}

const TODAY = new Date().toISOString()

// Curated, real devotional videos — Telugu prayers, bhajans and mantras for
// blessing and good fortune. Plays inline via official embeds.
const DEFAULT_VIDEOS = [
  {
    url: 'https://www.facebook.com/reel/1101035592387473',
    title: 'Devotional prayer — Maharaj-ji reel',
    note: 'The “pa prayer” reel shared with this page — it plays here in full through the official Facebook embed, and can be opened on Facebook anytime.',
    addedAt: '1980-01-01T00:00:00.000Z',
    mantra: MANTRA.maharajji,
  },
  {
    url: 'https://www.youtube.com/watch?v=v64T8Mk5_Tc',
    title: 'Hanuman Chalisa (Telugu) — from HanuMan',
    note: 'Powerful Telugu rendition of the Hanuman Chalisa from the film “HanuMan” (Prashanth Varma). A favourite for courage and blessing.',
    addedAt: TODAY,
    mantra: MANTRA.hanuman,
  },
  {
    url: 'https://www.youtube.com/watch?v=OR7NhpYEdXs',
    title: 'Hanuman Chalisa — official full video',
    note: 'Sacred full bhakti rendition of the Hanuman Chalisa in 4K — chant along for strength and protection.',
    addedAt: TODAY,
    mantra: MANTRA.hanuman,
  },
  {
    url: 'https://www.youtube.com/watch?v=iTEOon2KndA',
    title: 'Venkateswara Suprabhatam with Telugu lyrics',
    note: 'Sri Venkateswara Suprabhatam original with Telugu lyrics — the beloved sunrise prayer of Tirumala.',
    addedAt: TODAY,
    mantra: MANTRA.suprabhatam,
  },
  {
    url: 'https://www.youtube.com/watch?v=InQs4mTuoMM',
    title: 'Venkateswara Suprabhatam — full original (Tirumala)',
    note: 'Full Venkateswara Suprabhatam with Telugu lyrics, straight from the Tirumala tradition.',
    addedAt: TODAY,
    mantra: MANTRA.suprabhatam,
  },
  {
    url: 'https://www.youtube.com/watch?v=FhtDvEC62jE',
    title: 'Venkateswara Suprabhatam — M. S. Subbulakshmi',
    note: 'The legendary rendering of the Venkateswara Suprabhatam by M. S. Subbulakshmi — pure and uplifting.',
    addedAt: TODAY,
    mantra: MANTRA.suprabhatam,
  },
  {
    url: 'https://www.youtube.com/watch?v=5qurOU7qHEA',
    title: 'Sri Venkateswara Swamy songs (Telugu)',
    note: 'Peaceful Telugu devotional songs of Lord Venkateswara Swamy — Venkat ramamurthy suprabhatam and more.',
    addedAt: TODAY,
    mantra: MANTRA.venkatesha,
  },
  {
    url: 'https://www.youtube.com/watch?v=Z8C0WKUsWM8',
    title: 'Gayatri Mantra — 108 times, with meaning',
    note: 'The supreme Vedic Gayatri Mantra chanted 108 times with a clear meditation atmosphere.',
    addedAt: TODAY,
    mantra: MANTRA.gayatri,
  },
  {
    url: 'https://www.youtube.com/watch?v=ZDuhp5o8Ybw',
    title: 'Maha Mrityunjaya Mantra — 108 times (21 Brahmins)',
    note: 'The great healing mantra chanted 108 times by 21 Brahmins — protective and deeply calming.',
    addedAt: TODAY,
    mantra: MANTRA.mrityunjaya,
  },
  {
    url: 'https://www.youtube.com/watch?v=c0PpUpJ3ct8',
    title: 'Maha Mrityunjaya Mantra — 108 times (official video)',
    note: 'Official video chant of the Maha Mrityunjaya Mantra — invoked for health, peace and long life.',
    addedAt: TODAY,
    mantra: MANTRA.mrityunjaya,
  },
  {
    url: 'https://www.youtube.com/watch?v=VvoFPZq_pCY',
    title: 'Lakshmi devotional songs — mantras for wealth',
    note: 'A collection of Lakshmi mantras, stotras and aartis for wealth and prosperity (Lakshmi Gayatri, Kubera mantra, Mahalakshmi Ashtakam, Kanakadhara Stotram).',
    addedAt: TODAY,
    mantra: MANTRA.lakshmi,
  },
  {
    url: 'https://www.youtube.com/watch?v=Od2Egf9yRsU',
    title: 'Powerful Lakshmi Narayan Mantra',
    note: 'Sacred Lakshmi Narayana mantra invoking abundance, balance and the removal of negative energy.',
    addedAt: TODAY,
    mantra: MANTRA.lakshminarayana,
  },
  {
    url: 'https://www.youtube.com/watch?v=-qnx_qrIs2I',
    title: 'Sri Rama Navami special — Telugu devotional songs',
    note: 'Beautiful Telugu bhakti songs celebrating Lord Rama — refreshing and spiritually uplifting.',
    addedAt: TODAY,
    mantra: MANTRA.rama,
  },
]

const PLATFORMS = {
  yt: { label: 'YouTube', icon: '▶️', color: '#ff0000' },
  tt: { label: 'TikTok', icon: '🎵', color: '#25f4ee' },
  ig: { label: 'Instagram', icon: '📸', color: '#e1306c' },
  fb: { label: 'Facebook', icon: '👥', color: '#1877f2' },
  x: { label: 'X', icon: '𝕏', color: '#000000' },
}

const PLATFORM_KEYS = Object.keys(PLATFORMS)

const DATE_RANGES = [
  { key: 'all', label: 'All dates', days: null },
  { key: '30', label: 'Last 30 days', days: 30 },
  { key: '90', label: 'Last 90 days', days: 90 },
  { key: '365', label: 'Last 12 months', days: 365 },
  { key: '1095', label: 'Last 3 years', days: 1095 },
]

const SORTS = [
  { key: 'new', label: 'Newest added' },
  { key: 'old', label: 'Oldest added' },
  { key: 'platform', label: 'By platform' },
]

function detectVideo(url) {
  const u = (url || '').trim()
  let m
  if ((m = u.match(/(?:v=|youtu\.be\/|shorts\/)([\w-]{6,})/i))) return { src: `https://www.youtube-nocookie.com/embed/${m[1]}`, platform: 'yt' }
  if ((m = u.match(/youtube\.com\/embed\/([\w-]+)/i))) return { src: `https://www.youtube-nocookie.com/embed/${m[1]}`, platform: 'yt' }
  if ((m = u.match(/instagram\.com\/(?:reel|reels|p|tv)\/([\w-]+)/i))) return { src: `https://www.instagram.com/p/${m[1]}/embed`, platform: 'ig' }
  if ((m = u.match(/tiktok\.com\/.*?\/(?:video|photo)\/(\d+)/i))) return { src: `https://www.tiktok.com/embed/v2/${m[1]}`, platform: 'tt' }
  if (/facebook\.com\/(?:reel|watch|videos)|facebook\.com\/share|fb\.watch/i.test(u)) return { src: 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(u) + '&show_text=false', platform: 'fb' }
  if ((m = u.match(/(?:x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/(\d+)/i))) return { src: `https://platform.twitter.com/embed/Tweet.html?id=${m[1]}`, platform: 'x' }
  return null
}

function fmtDate(iso) {
  if (!iso) return 'added recently'
  try {
    if (iso.startsWith('1980')) return 'shared with this page'
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return 'added recently'
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return 'added recently'
  }
}

function SourceLink({ href, children }) {
  return <a href={href} target="_blank" rel="noreferrer">{children} ↗</a>
}

function handleImageError(event) {
  event.currentTarget.classList.add('nk-image-unavailable')
  event.currentTarget.alt = `${event.currentTarget.alt} (image unavailable; open the source link below)`
}

function BabaImage({ image, featured = false }) {
  return (
    <figure className={`nk-image-card ${featured ? 'nk-image-featured' : ''}`}>
      <img src={image.src} alt={image.alt} loading={featured ? 'eager' : 'lazy'} onError={handleImageError} />
      <figcaption>
        <strong>{image.title}</strong>
        <span>{image.caption}</span>
        <SourceLink href={image.sourceUrl}>{image.sourceLabel || 'Open image source'}</SourceLink>
      </figcaption>
    </figure>
  )
}

function VideoItem({ video, active, onSelect, onRemove }) {
  const meta = detectVideo(video.url)
  const p = meta ? PLATFORMS[meta.platform] : null
  return (
    <article className={`nk-video-item ${active ? 'nk-video-item-active' : ''}`} onClick={() => onSelect(video.url)} role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelect(video.url) }}>
      <span className="nk-video-item-icon" style={p ? { color: p.color, borderColor: p.color } : undefined}>{p ? p.icon : '🎬'}</span>
      <div className="nk-video-item-body">
        <h4>{video.mantra ? '🕉 ' : ''}{video.title}</h4>
        <p>{video.note}</p>
        <span className="nk-video-item-meta">
          {p ? <b style={{ color: p.color }}>{p.icon} {p.label}</b> : null}
          <i>📅 Added {fmtDate(video.addedAt)}</i>
        </span>
      </div>
      <div className="nk-video-item-actions">
        <button type="button" className="nk-video-watch" onClick={(e) => { e.stopPropagation(); onSelect(video.url) }}>▶ {active ? 'Playing' : 'Watch'}</button>
        <button type="button" className="nk-video-open" onClick={(e) => { e.stopPropagation(); window.open(video.url, '_blank', 'noopener,noreferrer') }} title="Open original ↗">↗</button>
        <button type="button" className="nk-video-remove" onClick={(e) => { e.stopPropagation(); onRemove(video.url) }} title="Remove from library">✕</button>
      </div>
    </article>
  )
}

export default function NeemKaroliBabaPage() {
  const [videos, setVideos] = useState(DEFAULT_VIDEOS)
  const [active, setActive] = useState(DEFAULT_VIDEOS[0].url)
  const [platformFilter, setPlatformFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [sortBy, setSortBy] = useState('new')
  const [draft, setDraft] = useState('')
  const [draftError, setDraftError] = useState('')
  const [playerTick, setPlayerTick] = useState(0)
  const [mantraOpen, setMantraOpen] = useState(true)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(NK_VIDEO_KEY) || '[]')
      if (Array.isArray(saved) && saved.length && detectVideo(saved[0].url)) {
        setVideos(saved)
        setActive(saved[0].url)
      }
    } catch { /* stay on the curated library */ }
  }, [])

  const persist = (next) => {
    setVideos(next)
    setActive(next[0] ? next[0].url : DEFAULT_VIDEOS[0].url)
    try { localStorage.setItem(NK_VIDEO_KEY, JSON.stringify(next)) } catch { /* private mode — session only */ }
  }

  const addVideo = () => {
    const url = draft.trim()
    if (!url) { setDraftError('Paste a Facebook / YouTube / Instagram / TikTok / X video URL first.'); return }
    if (!detectVideo(url)) { setDraftError('That URL does not look like a supported video link.'); return }
    const meta = detectVideo(url)
    const next = [...videos.filter(v => v.url !== url), { url, title: 'God-related devotional video', note: `Added to this page’s prayer library from a shared link — plays via the official ${PLATFORMS[meta.platform].label} embed.`, addedAt: new Date().toISOString() }]
    persist(next)
    setActive(url)
    setDraft('')
    setDraftError('')
  }

  const removeVideo = (url) => {
    let next = videos.filter(v => v.url !== url)
    if (!next.length) next = DEFAULT_VIDEOS.map(v => ({ ...v }))
    persist(next)
  }

  const selected = videos.find(v => v.url === active) || videos[0] || DEFAULT_VIDEOS[0]
  const selectedMeta = detectVideo(selected.url)

  const counts = useMemo(() => {
    const c = {}
    PLATFORM_KEYS.forEach(p => { c[p] = videos.filter(v => detectVideo(v.url)?.platform === p).length })
    return c
  }, [videos])

  const visible = useMemo(() => {
    const cutoff = dateRange === 'all' ? null : Date.now() - Number(dateRange) * 86400000
    let list = videos.filter(v => {
      if (platformFilter !== 'all' && detectVideo(v.url)?.platform !== platformFilter) return false
      if (cutoff && new Date(v.addedAt).getTime() < cutoff) return false
      return true
    })
    if (sortBy === 'platform') list = [...list].sort((a, b) => (PLATFORMS[detectVideo(a.url)?.platform]?.label || '~').localeCompare(PLATFORMS[detectVideo(b.url)?.platform]?.label || '~'))
    else if (sortBy === 'old') list = [...list].sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt))
    else list = [...list].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
    return list
  }, [videos, platformFilter, dateRange, sortBy])

  const hasFilters = platformFilter !== 'all' || dateRange !== 'all'

  const clearFilters = () => {
    setPlatformFilter('all')
    setDateRange('all')
  }
  return (
    <div className="nk-page">
      <div className="nk-topbar">
        <Link to="/" className="nk-back">← Back to AI Knowledge Hub</Link>
        <span className="nk-topbar-label">A reflection on love, service &amp; remembrance</span>
      </div>

      <nav className="nk-section-nav" aria-label="Neem Karoli Baba page sections">
        <span className="nk-nav-title">Explore</span>
        <a href="#history">History</a><a href="#timeline">Timeline</a><a href="#teachings">Teachings</a><a href="#words">Words</a><a href="#images">Images</a><a href="#videos">Videos</a><a href="#resources">Websites</a><a href="#daily-practice">Practice</a>
      </nav>

      <header className="nk-hero">
        <div className="nk-hero-glow nk-hero-glow-one" />
        <div className="nk-hero-glow nk-hero-glow-two" />
        <div className="nk-hero-copy">
          <span className="nk-eyebrow">🕉️ LIFE &amp; WISDOM COLLECTION</span>
          <h1>Neem Karoli Baba</h1>
          <p className="nk-hero-title">Maharaj-ji · A life remembered through love and service</p>
          <p className="nk-hero-intro">
            A respectful introduction to the life, places, teachings, and practical wisdom associated with Neem Karoli Baba — written for anyone who wants to live with a clearer head, a softer heart, and a useful purpose.
          </p>
          <div className="nk-hero-actions">
            <a href="#teachings" className="nk-primary-btn">Explore his teachings ↓</a>
            <a href="#daily-practice" className="nk-secondary-btn">Build a daily practice</a>
          </div>
          <div className="nk-hero-facts">
            <span><b>c. 1900</b> born in Akbarpur</span>
            <span><b>1973</b> remembered in Vrindavan</span>
            <span><b>Kainchi Dham</b> Himalayan ashram</span>
          </div>
        </div>
        <div className="nk-hero-image-wrap">
          <BabaImage image={IMAGES[0]} featured />
          <div className="nk-image-badge">Love · Serve · Remember</div>
        </div>
      </header>

      <main className="nk-content">
        <section className="nk-section nk-story-section" id="history">
          <div className="nk-section-heading">
            <span className="nk-section-number">01</span>
            <div><span className="nk-eyebrow">THE STORY</span><h2>A life larger than a biography</h2></div>
          </div>
          <div className="nk-story-grid">
            <div className="nk-prose">
              <p className="nk-lead">Neem Karoli Baba, also called Neeb Karori Baba or Maharaj-ji, was an Indian Hindu spiritual teacher and devotee of Hanuman. His public biography is intentionally incomplete: the dates of his early life are uncertain, and many stories come from devotees rather than formal records.</p>
              <p>He is remembered less for a systematic philosophy than for the atmosphere of his presence and the directness of his example. People from very different backgrounds gathered around him. Accounts describe an ashram life where prayer existed alongside cooking, feeding visitors, cleaning, travel, humor, and sometimes sharp correction.</p>
              <p>His teaching was often conveyed through action, a short sentence, a story, or an unexpected response. For that reason, the most reliable way to approach his legacy is with both devotion and discernment: appreciate the wisdom, distinguish documented history from oral tradition, and do not feel pressured to accept every miracle story literally.</p>
              <div className="nk-note"><span>📌</span><p><strong>How to read this page:</strong> “Widely attributed” and “remembered by devotees” indicate sayings or stories preserved through oral and devotional sources. They are not presented as authenticated word-for-word transcripts.</p></div>
            </div>
            <aside className="nk-fact-card">
              <span className="nk-card-kicker">AT A GLANCE</span>
              <h3>What he is remembered for</h3>
              <ul>
                <li><span>◉</span><div><b>Name</b><small>Neem Karoli Baba · Maharaj-ji</small></div></li>
                <li><span>◉</span><div><b>Birth</b><small>c. 1900, Akbarpur, India</small></div></li>
                <li><span>◉</span><div><b>Tradition</b><small>Hindu bhakti, Hanuman devotion, seva</small></div></li>
                <li><span>◉</span><div><b>Known places</b><small>Kainchi Dham · Vrindavan · Allahabad region</small></div></li>
                <li><span>◉</span><div><b>Death</b><small>11 September 1973, Vrindavan</small></div></li>
              </ul>
            </aside>
          </div>
        </section>

        <section className="nk-section nk-timeline-section" id="timeline">
          <div className="nk-section-heading">
            <span className="nk-section-number">02</span>
            <div><span className="nk-eyebrow">A SIMPLE TIMELINE</span><h2>From wandering sadhu to a global legacy</h2></div>
          </div>
          <div className="nk-timeline">
            {TIMELINE.map(([date, title, text]) => (
              <article className="nk-timeline-item" key={date + title}>
                <div className="nk-timeline-date">{date}</div>
                <div className="nk-timeline-dot" />
                <div className="nk-timeline-copy"><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="nk-section nk-teachings-section" id="teachings">
          <div className="nk-section-heading nk-heading-light">
            <span className="nk-section-number">03</span>
            <div><span className="nk-eyebrow">THE HEART OF THE MESSAGE</span><h2>Six ideas for a better life</h2></div>
          </div>
          <p className="nk-section-subtitle">These are not instructions to imitate a saint. They are simple principles to test in ordinary life — at home, at work, and in the way we treat people who cannot benefit us.</p>
          <div className="nk-teaching-grid">
            {TEACHINGS.map((teaching, index) => (
              <article className="nk-teaching-card" key={teaching.title}>
                <span className="nk-teaching-index">0{index + 1}</span><span className="nk-teaching-icon">{teaching.icon}</span>
                <h3>{teaching.title}</h3><p>{teaching.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="nk-section nk-quotes-section" id="words">
          <div className="nk-section-heading"><span className="nk-section-number">04</span><div><span className="nk-eyebrow">WORDS REMEMBERED</span><h2>Sayings to carry with you</h2></div></div>
          <div className="nk-quotes-grid">
            {QUOTES.map(quote => <blockquote className="nk-quote" key={quote.text}><span className="nk-quote-mark">“</span><p>{quote.text}</p><footer>{quote.note} <SourceLink href={quote.sourceUrl}>Read context</SourceLink></footer></blockquote>)}
          </div>
          <p className="nk-source-note">For deeper stories and context, see <SourceLink href="https://www.ramdass.org/neem-karoli-baba-maharaji-stories-devotees/">Ram Dass’s collection of devotee stories</SourceLink> and the <SourceLink href="https://commons.wikimedia.org/wiki/Category:Neem_Karoli_Baba">Wikimedia Commons image category</SourceLink>.</p>
        </section>

        <section className="nk-section nk-gallery-section" id="images">
          <div className="nk-section-heading"><span className="nk-section-number">05</span><div><span className="nk-eyebrow">PLACES OF REMEMBRANCE</span><h2>Images from the tradition</h2></div></div>
          <p className="nk-section-subtitle">Images are loaded from Wikimedia Commons. Open the source page to review the individual file’s license and attribution details before reuse.</p>
          <div className="nk-gallery-grid">{IMAGES.slice(1).map(image => <BabaImage image={image} key={image.src} />)}</div>
        </section>

        <section className="nk-section nk-videos-section" id="videos">
          <div className="nk-section-heading nk-heading-light">
            <span className="nk-section-number">06</span>
            <div><span className="nk-eyebrow">VIDEOS OF DEVOTION</span><h2>God’s videos — prayer, bhajan &amp; remembrance</h2></div>
          </div>
          <p className="nk-section-subtitle">The best Telugu devotional prayers, bhajans and sacred mantra videos for divine blessing and a lucky, fortunate life — plays right here through official embeds, organised by platform and by date, so everyone can filter, sort, add, and watch whatever speaks to them. Every chanting video shows the mantra to read along. Everything you add is saved privately in your own browser.</p>

          <div className="nk-video-player">
            <div className="nk-video-player-stage">
              {selectedMeta ? (
                <iframe
                  key={`${selected.url}-${playerTick}`}
                  src={selectedMeta.src}
                  title={selected.title}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  scrolling="no"
                />
              ) : (
                <div className="nk-video-stage-empty">
                  <span>🎬</span><p>Video player is empty — add a valid video URL below.</p>
                </div>
              )}
            </div>
            <div className="nk-video-player-bar">
              <div>
                <span className="nk-video-now-playing">NOW PLAYING</span>
                <h3>{selected.title}</h3>
                <p>{selected.note} {selectedMeta ? `Plays inline from ${PLATFORMS[selectedMeta.platform]?.label}.` : ''}</p>
              </div>
              <div className="nk-video-player-controls">
                <button type="button" className="nk-video-reload" onClick={() => setPlayerTick(t => t + 1)} title="Reload player">⟳ Reload</button>
                <a className="nk-video-open-link" href={selected.url} target="_blank" rel="noreferrer">Open original ↗</a>
              </div>
            </div>
            {selected.mantra && (
              <div className="nk-video-mantra">
                <button type="button" className="nk-video-mantra-toggle" onClick={() => setMantraOpen(o => !o)} aria-expanded={mantraOpen}>
                  <span className="nk-video-mantra-om">🕉</span>
                  <span>Read the {selected.mantra.type} while you listen — for blessing, protection &amp; luck</span>
                  <span className="nk-video-mantra-chevron">{mantraOpen ? '▲' : '▼'}</span>
                </button>
                {mantraOpen && (
                  <div className="nk-video-mantra-body">
                    <p className="nk-mantra-telugu">{selected.mantra.telugu}</p>
                    <p className="nk-mantra-translit">{selected.mantra.translit}</p>
                    <p className="nk-mantra-meaning">{selected.mantra.meaning}</p>
                    {selected.mantra.blessing && <p className="nk-mantra-blessing">✨ {selected.mantra.blessing}</p>}
                    <p className="nk-mantra-source">Traditional liturgical verse — recite with devotion alongside the video. Telugu script with transliteration and meaning.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="nk-video-toolbar">
            <div className="nk-video-filters">
              <span className="nk-video-tool-label">Platform</span>
              <div className="nk-video-chips">
                <button type="button" className={`nk-chip ${platformFilter === 'all' ? 'active' : ''}`} onClick={() => setPlatformFilter('all')}>All <b>{videos.length}</b></button>
                {PLATFORM_KEYS.map(p => (
                  <button key={p} type="button" className={`nk-chip ${platformFilter === p ? 'active' : ''}`} style={platformFilter === p ? { borderColor: PLATFORMS[p].color } : undefined} onClick={() => setPlatformFilter(p)}>
                    {PLATFORMS[p].icon} {PLATFORMS[p].label} <b>{counts[p] || 0}</b>
                  </button>
                ))}
              </div>
            </div>
            <div className="nk-video-filters">
              <span className="nk-video-tool-label">Date</span>
              <div className="nk-video-chips">
                {DATE_RANGES.map(r => <button key={r.key} type="button" className={`nk-chip ${dateRange === r.key ? 'active' : ''}`} onClick={() => setDateRange(r.key)}>{r.label}</button>)}
              </div>
            </div>
            <div className="nk-video-filters">
              <span className="nk-video-tool-label">Sort</span>
              <select className="nk-video-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                {SORTS.map(s => <option value={s.key} key={s.key}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div className="nk-video-summary">
            Showing <b>{visible.length}</b> {visible.length === 1 ? 'video' : 'videos'}
            {platformFilter !== 'all' ? <> on <b>{PLATFORMS[platformFilter].label}</b></> : <> across all {PLATFORM_KEYS.filter(p => (counts[p] || 0) > 0).length} platforms</>}
            {dateRange !== 'all' ? <> from <b>{DATE_RANGES.find(r => r.key === dateRange)?.label}</b></> : <> from <b>all dates</b></>}
          </div>

          {visible.length ? (
            <div className="nk-video-list">
              {visible.map(v => <VideoItem key={v.url} video={v} active={v.url === selected.url} onSelect={setActive} onRemove={removeVideo} />)}
            </div>
          ) : (
            <div className="nk-video-empty">
              <span className="nk-video-empty-icon">🙏</span>
              <h3>No videos in this view</h3>
              <p>There is plenty of space here — this filter has no videos yet. Clear the filters to see everything, or add a devotional video URL from Facebook, YouTube, Instagram, TikTok, or X.</p>
              <div className="nk-video-empty-actions">
                {hasFilters && <button type="button" className="nk-video-add-btn" onClick={clearFilters}>Clear platform &amp; date filters</button>}
                <button type="button" className="nk-video-add-btn ghost" onClick={() => document.getElementById('nk-video-add-input')?.focus()}>Add a video URL</button>
              </div>
            </div>
          )}

          <div className="nk-video-add">
            <span className="nk-video-add-icon">➕</span>
            <input id="nk-video-add-input" className="nk-video-input" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addVideo() }} placeholder="Paste a Facebook / YouTube / Instagram / TikTok / X video URL to add it to the prayer library…" />
            <button type="button" className="nk-video-add-btn" onClick={addVideo}>Add to library</button>
            {draftError && <span className="nk-video-error" role="alert">{draftError}</span>}
          </div>
          <p className="nk-video-note">Videos you add are stored only in this browser and never leave your device. Embeds come from the official players of each platform, so playback, sound, and privacy remain with the original creator.</p>
        </section>

        <section className="nk-section nk-resources-section" id="resources">
          <div className="nk-section-heading"><span className="nk-section-number">07</span><div><span className="nk-eyebrow">GO DEEPER</span><h2>Trusted places to continue reading</h2></div></div>
          <p className="nk-section-subtitle">These links are provided for learning and context. They represent different kinds of sources, so read each page with attention to whether it is an archival account, an ashram resource, a devotional interpretation, or an image repository.</p>
          <div className="nk-resources-grid">
            {RESOURCES.map(resource => <a className="nk-resource-card" href={resource.href} target="_blank" rel="noreferrer" key={resource.title}><span className="nk-resource-icon">{resource.icon}</span><span className="nk-resource-label">{resource.label}</span><h3>{resource.title} ↗</h3><p>{resource.description}</p></a>)}
          </div>
        </section>

        <section className="nk-section nk-practice-section" id="daily-practice">
          <div className="nk-section-heading nk-heading-light"><span className="nk-section-number">08</span><div><span className="nk-eyebrow">PUT IT INTO PRACTICE</span><h2>A 10-minute Maharaj-ji-inspired reset</h2></div></div>
          <div className="nk-practice-layout">
            <div className="nk-practice-intro"><p className="nk-lead">A meaningful life is not built from quotes alone. Start small, repeat what helps, and measure your spirituality by the quality of your actions.</p><div className="nk-mantra">Love everyone.<br />Serve everyone.<br />Remember God.<br />Tell the truth.</div><p className="nk-practice-disclaimer">Use “God” in the way that is honest for you: God, truth, conscience, compassion, or the highest good.</p></div>
            <div className="nk-practice-list">{DAILY_PRACTICE.map(([title, text], index) => <div className="nk-practice-item" key={title}><span>{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>
          </div>
        </section>

        <section className="nk-section nk-reflection-section" id="reflection">
          <div className="nk-reflection-card"><span className="nk-eyebrow">A QUESTION FOR TODAY</span><h2>Can my success make someone else’s life a little lighter?</h2><p>Take the skill you already have — coding, business, teaching, caregiving, listening, organizing — and use one part of it in service of another person. That is where inspiration becomes a life.</p><a href="#daily-practice" className="nk-primary-btn">Start with one small act ↑</a></div>
        </section>

        <footer className="nk-footer"><p><strong>Jai Maharaj-ji.</strong> May love become action, and may action become service.</p><p className="nk-footer-links"><SourceLink href="https://www.ramdass.org/about-ram-dass/">Ram Dass biography</SourceLink><span>·</span><SourceLink href="https://commons.wikimedia.org/wiki/Category:Neem_Karoli_Baba">Image sources</SourceLink><span>·</span><Link to="/">AI Knowledge Hub home</Link></p></footer>
      </main>
    </div>
  )
}
