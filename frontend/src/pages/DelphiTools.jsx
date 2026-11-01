import { useState } from 'react'
import FetchButton from '../components/FetchButton'
import { useLang } from '../i18n'
import './DelphiTools.css'

const TOOL_CATEGORIES = [
  {
    id: 'greatest-hits',
    label: 'Greatest Hits',
    icon: '⭐',
    tools: [
      { name: 'Substrata', desc: 'New — Edit, arrange and mark up images in the browser', url: 'https://tools.rmv.fyi/editor', badge: 'Beta' },
      { name: 'QR Generator', desc: 'Generate styled QR codes with custom colors, shapes, and logos', url: 'https://tools.rmv.fyi/tools/qr-genny' },
      { name: 'Palette Generator', desc: 'Generate beautiful colour palettes', url: 'https://tools.rmv.fyi/tools/palette-genny' },
      { name: 'Background Remover', desc: 'Remove backgrounds from images automatically', url: 'https://tools.rmv.fyi/tools/background-remover', badge: 'Beta' },
    ]
  },
  {
    id: 'social-media',
    label: 'Social Media',
    icon: '📱',
    tools: [
      { name: 'Matte Generator', desc: 'Put non-square images on a square matte', url: 'https://tools.rmv.fyi/tools/matte-generator' },
      { name: 'Seamless Scroll Generator', desc: 'Split images for Instagram carousel scrolls', url: 'https://tools.rmv.fyi/tools/scroll-generator' },
      { name: 'Social Media Cropper', desc: 'Crop images for Instagram, Bluesky & Threads', url: 'https://tools.rmv.fyi/tools/social-cropper' },
      { name: 'Watermarker', desc: 'Add watermarks to images', url: 'https://tools.rmv.fyi/tools/watermarker' },
    ]
  },
  {
    id: 'colour',
    label: 'Colour',
    icon: '🎨',
    tools: [
      { name: 'Colour Blindness Simulator', desc: 'Simulate how colours appear to colour blind users', url: 'https://tools.rmv.fyi/tools/colorblind-sim' },
      { name: 'Colour Converter', desc: 'Convert between colour formats', url: 'https://tools.rmv.fyi/tools/colour-converter' },
      { name: 'Contrast Checker', desc: 'Check WCAG colour contrast compliance', url: 'https://tools.rmv.fyi/tools/contrast-checker' },
      { name: 'Gradient Generator', desc: 'Create linear, corner, and mesh gradients', url: 'https://tools.rmv.fyi/tools/gradient-genny' },
      { name: 'Harmony Generator', desc: 'Generate colour harmonies', url: 'https://tools.rmv.fyi/tools/harmony-genny' },
      { name: 'Palette Collection', desc: 'Browse curated colour palettes', url: 'https://tools.rmv.fyi/tools/palette-collection' },
      { name: 'Palette Extractor', desc: 'Extract colour palettes from images', url: 'https://tools.rmv.fyi/tools/palette-extractor' },
      { name: 'Pixel Picker', desc: 'Sample colours from any image with a zoom loupe', url: 'https://tools.rmv.fyi/tools/pixel-picker' },
      { name: 'Tailwind Shade Generator', desc: 'Generate Tailwind colour scales', url: 'https://tools.rmv.fyi/tools/tailwind-shades' },
    ]
  },
  {
    id: 'images-assets',
    label: 'Images & Assets',
    icon: '🖼️',
    tools: [
      { name: 'Artwork Enhancer', desc: 'Add colour noise overlay to artwork', url: 'https://tools.rmv.fyi/tools/artwork-enhancer' },
      { name: 'Base64 Image Encoder', desc: 'Convert images to Base64 strings for CSS/HTML embedding', url: 'https://tools.rmv.fyi/tools/base64-image-encoder', badge: 'New' },
      { name: 'Favicon Generator', desc: 'Generate favicons from any image', url: 'https://tools.rmv.fyi/tools/favicon-genny' },
      { name: 'Image Clipper', desc: 'Trim transparent edges from PNGs to the smallest dimensions', url: 'https://tools.rmv.fyi/tools/image-clipper' },
      { name: 'Image Converter', desc: 'Convert between PNG, JPEG, WebP, JXL, GIF, BMP, TIFF, ICO, ICNS', url: 'https://tools.rmv.fyi/tools/image-converter' },
      { name: 'Image Splitter', desc: 'Split images into tiles', url: 'https://tools.rmv.fyi/tools/image-splitter' },
      { name: 'Image Stitcher', desc: 'Combine multiple images into one', url: 'https://tools.rmv.fyi/tools/image-stitcher', badge: 'New' },
      { name: 'Image Tracer', desc: 'Trace raster images to SVG vectors', url: 'https://tools.rmv.fyi/tools/image-tracer' },
      { name: 'Placeholder Generator', desc: 'Generate placeholder images', url: 'https://tools.rmv.fyi/tools/placeholder-genny' },
      { name: 'SVG Optimiser', desc: 'Optimise and minify SVG files', url: 'https://tools.rmv.fyi/tools/svg-optimiser' },
    ]
  },
  {
    id: 'typography-text',
    label: 'Typography & Text',
    icon: '✏️',
    tools: [
      { name: 'Document Converter', desc: 'Convert documents between Markdown, HTML, Word, LaTeX, EPUB and more', url: 'https://tools.rmv.fyi/tools/doc-converter', badge: 'New' },
      { name: 'Text Editor', desc: 'Distraction-free Markdown writer', url: 'https://tools.rmv.fyi/tools/text-editor', badge: 'New' },
      { name: 'Font File Explorer', desc: 'Explore font file contents', url: 'https://tools.rmv.fyi/tools/font-explorer' },
      { name: 'Glyph Browser', desc: 'Browse unicode glyphs', url: 'https://tools.rmv.fyi/tools/glyph-browser' },
      { name: 'Large Type', desc: 'Text, but big', url: 'https://tools.rmv.fyi/tools/large-type', badge: 'New' },
      { name: 'Line Height Calculator', desc: 'Calculate optimal line heights', url: 'https://tools.rmv.fyi/tools/line-height-calc' },
      { name: 'Paper Sizes', desc: 'Reference for paper dimensions', url: 'https://tools.rmv.fyi/tools/paper-sizes' },
      { name: 'PX to REM', desc: 'Convert pixels to rem units', url: 'https://tools.rmv.fyi/tools/px-to-rem' },
      { name: 'Text Diff', desc: 'Compare two texts and highlight differences', url: 'https://tools.rmv.fyi/tools/text-diff' },
      { name: 'Typography Calculator', desc: 'Convert between typographic units', url: 'https://tools.rmv.fyi/tools/typo-calc' },
      { name: 'Word Counter', desc: 'Count words, characters and more', url: 'https://tools.rmv.fyi/tools/word-counter' },
    ]
  },
  {
    id: 'print-production',
    label: 'Print & Production',
    icon: '🖨️',
    tools: [
      { name: 'PDF Preflight', desc: 'Analyse PDFs for print-readiness issues', url: 'https://tools.rmv.fyi/tools/pdf-preflight' },
      { name: 'Print Imposer', desc: 'Impose PDF pages for booklet, saddle-stitch, and N-up printing', url: 'https://tools.rmv.fyi/tools/imposer' },
      { name: 'Zine Imposer', desc: 'Impose single-sheet zines: 8-page mini-zine and accordion folds', url: 'https://tools.rmv.fyi/tools/zine-imposer' },
    ]
  },
  {
    id: 'other-tools',
    label: 'Other Tools',
    icon: '🔧',
    tools: [
      { name: 'Barcode Generator', desc: 'Generate Data Matrix, Aztec, PDF417, Code 128, EAN-13, and more', url: 'https://tools.rmv.fyi/tools/code-genny' },
      { name: 'Cipher Decoder', desc: 'Decode classical ciphers manually or auto-detect the cipher', url: 'https://tools.rmv.fyi/tools/decoder', badge: 'New' },
      { name: 'Meta Tag Generator', desc: 'Generate HTML meta tags', url: 'https://tools.rmv.fyi/tools/meta-tag-genny' },
      { name: 'Regex Tester', desc: 'Test regular expressions', url: 'https://tools.rmv.fyi/tools/regex-tester' },
      { name: 'Tailwind Cheat Sheet', desc: 'Quick reference for Tailwind classes', url: 'https://tools.rmv.fyi/tools/tailwind-cheatsheet' },
      { name: 'Text Scratchpad', desc: 'Text editor with manipulation tools', url: 'https://tools.rmv.fyi/tools/markdown-writer' },
    ]
  },
  {
    id: 'calculators',
    label: 'Calculators',
    icon: '🧮',
    tools: [
      { name: 'Algebra Calculator', desc: 'Symbolic algebra: simplify, factor, solve, derivatives', url: 'https://tools.rmv.fyi/tools/algebra-calc' },
      { name: 'Base Converter', desc: 'Convert between decimal, hex, binary, and octal', url: 'https://tools.rmv.fyi/tools/base-converter' },
      { name: 'Encoding Tools', desc: 'Base64, URL encoding, and hash generation', url: 'https://tools.rmv.fyi/tools/encoder' },
      { name: 'Graph Calculator', desc: 'Plot and visualise mathematical functions', url: 'https://tools.rmv.fyi/tools/graph-calc' },
      { name: 'Scientific Calculator', desc: 'Full-featured scientific calculator with history', url: 'https://tools.rmv.fyi/tools/sci-calc' },
      { name: 'Time Calculator', desc: 'Unix timestamps, date arithmetic, timezone conversion', url: 'https://tools.rmv.fyi/tools/time-calc' },
      { name: 'Unit Converter', desc: 'Convert between units of length, weight, data, and more', url: 'https://tools.rmv.fyi/tools/unit-converter' },
    ]
  },
]

const TOOL_COUNT = TOOL_CATEGORIES.reduce((sum, c) => sum + c.tools.length, 0)

export default function DelphiTools() {
  const { t } = useLang()
  const [activeCat, setActiveCat] = useState(null)
  const [search, setSearch] = useState('')

  const filteredCategories = TOOL_CATEGORIES
    .filter(c => !activeCat || c.id === activeCat)
    .map(c => ({
      ...c,
      tools: c.tools.filter(t =>
        !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.desc.toLowerCase().includes(search.toLowerCase())
      )
    }))
    .filter(c => c.tools.length > 0)

  return (
    <div className="delphi-page">
      <div className="delphi-hero">
        <div className="delphi-hero-icon">🛠️</div>
        <div className="page-header-row">
          <h1>{t('delphitools')}</h1>
          <FetchButton onFetch={() => setSearch('')} label={t('Fetch Latest')} staticMode />
        </div>
        <p className="delphi-subtitle">
          {TOOL_COUNT} privacy-first browser tools · No logins · No tracking · Long live the handmade web
        </p>
        <div className="delphi-meta">
          <span className="delphi-badge">🌐 {t('All Client-Side')}</span>
          <span className="delphi-badge">🔒 {t('No Data Collection')}</span>
          <span className="delphi-badge">📱 {t('iOS App Available')}</span>
          <a href="https://github.com/1612elphi/delphitools" target="_blank" rel="noopener noreferrer" className="delphi-badge delphi-badge-link">
            💻 {t('Open Source')}
          </a>
        </div>
      </div>

      <div className="delphi-search-bar">
        <input
          type="text"
          placeholder="Search tools… (e.g. QR, colour, calculator)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="delphi-search"
        />
        {search && (
          <button className="delphi-clear" onClick={() => setSearch('')}>✕ {t('Clear')}</button>
        )}
      </div>

      <div className="delphi-cat-tabs">
        <button
          className={`delphi-cat-tab ${!activeCat ? 'active' : ''}`}
          onClick={() => setActiveCat(null)}
        >
          🌐 {t('All')} ({TOOL_COUNT})
        </button>
        {TOOL_CATEGORIES.map(c => (
          <button
            key={c.id}
            className={`delphi-cat-tab ${activeCat === c.id ? 'active' : ''}`}
            onClick={() => setActiveCat(activeCat === c.id ? null : c.id)}
          >
            {c.icon} {c.label} ({c.tools.length})
          </button>
        ))}
      </div>

      {filteredCategories.map(cat => (
        <div key={cat.id} className="delphi-section">
          <h2 className="delphi-section-title">
            {cat.icon} {cat.label}
            <span className="delphi-count">{cat.tools.length} tools</span>
          </h2>
          <div className="delphi-grid">
            {cat.tools.map(tool => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="delphi-card"
              >
                <div className="delphi-card-name">
                  {tool.name}
                  {tool.badge && (
                    <span className={`delphi-badge-sm ${tool.badge === 'Beta' ? 'beta' : tool.badge === 'New' ? 'new' : ''}`}>
                      {tool.badge}
                    </span>
                  )}
                </div>
                <div className="delphi-card-desc">{tool.desc}</div>
                <div className="delphi-card-url">{tool.url.replace('https://tools.rmv.fyi/', '')}</div>
              </a>
            ))}
          </div>
        </div>
      ))}

      <div className="delphi-footer">
        <p>Made by <a href="https://rmv.fyi" target="_blank" rel="noopener noreferrer">delphi</a> ·
        <a href="https://github.com/1612elphi/delphitools" target="_blank" rel="noopener noreferrer"> Source on GitHub</a></p>
        <p className="delphi-footer-note">
          Donations: please give to <a href="https://donate.wikimedia.org" target="_blank" rel="noopener noreferrer">Wikipedia</a> or <a href="https://www.eff.org/donate" target="_blank" rel="noopener noreferrer">EFF</a> instead
        </p>
      </div>
    </div>
  )
}
