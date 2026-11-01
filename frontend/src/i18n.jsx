import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import LANGUAGES_DATA from './languages.json'
import COUNTRY_LANG from './countryLang.json'

// ─────────────────────────────────────────────────────────────────────────────
// Global language support — 109 languages, app-wide (generated from the
// backend's catalog in video_hub_api.py so backend & frontend always agree).
// useLang() → { lang, resolved, setLang, t }. "auto" follows the country
// selected in the Video Hub; translations fall back to English per key.
// ─────────────────────────────────────────────────────────────────────────────

export const LANGUAGES = LANGUAGES_DATA
export const LANG_BY_CODE = Object.fromEntries(LANGUAGES.map(l => [l.code.toLowerCase(), l]))

const LS_KEY = 'app-language'

export function resolveLanguage(code, countryCode = 'global') {
  const c = (code || 'auto').toLowerCase()
  if (!c || c === 'auto') return COUNTRY_LANG[countryCode] || 'en'
  return c
}

// ── Core UI translations (missing keys fall back to English) ──
const STRINGS = {
  'Back to Home': {
    es: 'Volver al inicio', fr: "Retour à l'accueil", de: 'Zurück zur Startseite',
    pt: 'Voltar ao início', it: 'Torna alla home', ru: 'На главную', zh: '返回首页',
    ja: 'ホームに戻る', ko: '홈으로 돌아가기', ar: 'العودة إلى الرئيسية', hi: 'होम पर वापस',
    'zh-Hant': '返回首頁', tr: 'Ana sayfaya dön', id: 'Kembali ke Beranda', vi: 'Về trang chủ',
    th: 'กลับไปหน้าแรก', pl: 'Wróć do strony głównej',
  },
  'AI Knowledge Hub': {
    es: 'Centro de Conocimiento de IA', fr: 'Hub de Connaissances IA', de: 'KI-Wissens-Hub',
    pt: 'Hub de Conhecimento de IA', it: 'Hub di Conoscenza IA', ru: 'Хаб знаний ИИ',
    zh: 'AI 知识中心', ja: 'AI ナレッジハブ', ko: 'AI 지식 허브',
    ar: 'مركز معرفة الذكاء الاصطناعي', hi: 'AI ज्ञान केंद्र', 'zh-Hant': 'AI 知識中心',
    tr: 'Yapay Zeka Bilgi Merkezi', id: 'Pusat Pengetahuan AI', vi: 'Trung tâm Tri thức AI',
    th: 'ศูนย์ความรู้ AI', pl: 'Baza Wiedzy AI',
  },
  'Research workspace': {
    es: 'Espacio de trabajo de investigación', fr: 'Espace de recherche', de: 'Forschungsarbeitsbereich',
    pt: 'Espaço de pesquisa', it: 'Area di ricerca', ru: 'Исследовательское рабочее пространство',
    zh: '研究工作区', ja: 'リサーチワークスペース', ko: '연구 워크스페이스',
    ar: 'مساحة عمل بحثية', hi: 'अनुसंधान कार्यक्षेत्र', 'zh-Hant': '研究工作區',
  },
  'Worldwide': {
    es: 'Mundial', fr: 'Mondial', de: 'Weltweit', pt: 'Mundial', it: 'Mondiale', ru: 'Весь мир',
    'zh-Hant': '全球', ja: '世界中', ko: '전 세계', ar: 'عالمي', hi: 'विश्वव्यापी', zh: '全球',
  },
  'Auto — follow country': {
    es: 'Automático — seguir al país', fr: 'Auto — suivre le pays', de: 'Auto — Land folgen',
    pt: 'Automático — seguir país', ru: 'Авто — по стране', zh: '自动 — 跟随国家',
    ja: '自動 — 国に従う', ar: 'تلقائي — حسب البلد', hi: 'स्वतः — देश के अनुसार',
  },
  // ── App-wide chrome & navigation (translated for es/fr/de/pt/hi/te) ──
  'Explore Hub': {
    es: 'Explora el Hub', fr: 'Explorer le Hub', de: 'Hub erkunden', pt: 'Explorar o Hub',
    hi: 'हब एक्सप्लोर करें', te: 'హబ్ను అన్వేషించండి',
  },
  'Learn · build · ship': {
    es: 'Aprende · crea · publica', fr: 'Apprendre · créer · livrer', de: 'Lernen · bauen · liefern',
    pt: 'Aprenda · crie · publique', hi: 'सीखें · बनाएँ · लॉन्च करें', te: 'నేర్చుకోండి · నిర్మించండి · పంపిణీ చేయండి',
  },
  'Home': {
    es: 'Inicio', fr: 'Accueil', de: 'Startseite', pt: 'Início', hi: 'होम', te: 'హోమ్',
  },
  'Images Gallery': {
    es: 'Galería de imágenes', fr: 'Galerie d’images', de: 'Bildergalerie', pt: 'Galeria de imagens',
    hi: 'चित्र गैलरी', te: 'చిత్రాల గ్యాలరీ',
  },
  'File Reference': {
    es: 'Referencia de archivos', fr: 'Référence des fichiers', de: 'Dateireferenz', pt: 'Referência de arquivos',
    hi: 'फ़ाइल संदर्भ', te: 'ఫైల్ రిఫరెన్స్',
  },
  'Knowledge Base': {
    es: 'Base de conocimiento', fr: 'Base de connaissances', de: 'Wissensbasis', pt: 'Base de conhecimento',
    hi: 'ज्ञान आधार', te: 'నాలెడ్జ్ బేస్',
  },
  'AI Jobs': {
    es: 'Empleos IA', fr: 'Emplois IA', de: 'KI-Jobs', pt: 'Empregos de IA', hi: 'AI नौकरियाँ', te: 'AI ఉద్యోగాలు',
  },
  'Edureka AI Docs': {
    es: 'Documentos AI de Edureka', fr: 'Docs IA d’Edureka', de: 'Edureka-KI-Dokumentation', pt: 'Documentos de IA da Edureka',
    hi: 'Edureka AI दस्तावेज़', te: 'Edureka AI పత్రాలు',
  },
  'AI News Dashboard': {
    es: 'Panel de noticias IA', fr: 'Tableau de bord IA', de: 'KI-News-Dashboard', pt: 'Painel de notícias de IA',
    hi: 'AI समाचार डैशबोर्ड', te: 'AI వార్తల డాష్బోర్డ్',
  },
  'Live News Fetcher': {
    es: 'Buscador de noticias en vivo', fr: 'Actualités en direct', de: 'Live-News-Fetcher', pt: 'Buscador de notícias ao vivo',
    hi: 'लाइव समाचार फ़ेचर', te: 'లైవ్ వార్తల ఫెచర్',
  },
  'AI Tools Catalog': {
    es: 'Catálogo de herramientas IA', fr: 'Catalogue d’outils IA', de: 'KI-Tool-Katalog', pt: 'Catálogo de ferramentas de IA',
    hi: 'AI टूल्स कैटलॉग', te: 'AI సాధనాల జాబితా',
  },
  'GitHub Repos': {
    es: 'Repos de GitHub', fr: 'Dépôts GitHub', de: 'GitHub-Repos', pt: 'Repositórios GitHub',
    hi: 'GitHub रिपॉज़िटरीज़', te: 'GitHub రిపోజిటరీలు',
  },
  'Open Alternatives': {
    es: 'Alternativas abiertas', fr: 'Alternatives open source', de: 'Offene Alternativen', pt: 'Alternativas abertas',
    hi: 'खुले विकल्प', te: 'ఓపెన్ ప్రత్యామ్నాయాలు',
  },
  'Integrations': {
    es: 'Integraciones', fr: 'Intégrations', de: 'Integrationen', pt: 'Integrações', hi: 'इंटीग्रेशन्स', te: 'ఇంటిగ్రేషన్లు',
  },
  'Book Catalog': {
    es: 'Catálogo de libros', fr: 'Catalogue de livres', de: 'Buchkatalog', pt: 'Catálogo de livros',
    hi: 'पुस्तक सूची', te: 'పుస్తకాల జాబితా',
  },
  'AI Engineering Playbook': {
    es: 'Manual de ingeniería IA', fr: 'Guide d’ingénierie IA', de: 'KI-Ingenieur-Handbuch', pt: 'Guia de engenharia de IA',
    hi: 'AI इंजीनियरिंग प्लेबुक', te: 'AI ఇంజనీరింగ్ ప్లేబుక్',
  },
  'Rapid Fire Playbook': {
    es: 'Manual de preguntas rápidas', fr: 'Guide questions rapides', de: 'Rapid-Fire-Handbuch', pt: 'Guia de perguntas rápidas',
    hi: 'रैपिड फ़ायर प्लेबुक', te: 'రాపిడ్ ఫైర్ ప్లేబుక్',
  },
  'AI Stack': {
    es: 'Pila de IA', fr: 'Stack IA', de: 'KI-Stack', pt: 'Stack de IA', hi: 'AI स्टैक', te: 'AI స్టాక్',
  },
  'Claude Certification': {
    es: 'Certificación Claude', fr: 'Certification Claude', de: 'Claude-Zertifizierung', pt: 'Certificação Claude',
    hi: 'क्लॉड प्रमाणन', te: 'క్లాడ్ సర్టిఫికేషన్',
  },
  'Snowflake Guide': {
    es: 'Guía de Snowflake', fr: 'Guide Snowflake', de: 'Snowflake-Leitfaden', pt: 'Guia Snowflake',
    hi: 'स्नोफ़्लेक गाइड', te: 'స్నోఫ్లేక్ గైడ్',
  },
  'ETL & Data Eng Guide': {
    es: 'Guía de ETL e ingeniería de datos', fr: 'Guide ETL & Data', de: 'ETL- und Data-Guide', pt: 'Guia de ETL e dados',
    hi: 'ETL और डेटा इंजीनियरिंग गाइड', te: 'ETL & డేటా ఇంజనీరింగ్ గైడ్',
  },
  'AI Jobs Global': {
    es: 'Empleos IA Global', fr: 'Emplois IA monde', de: 'KI-Jobs weltweit', pt: 'Empregos de IA global',
    hi: 'AI नौकरियाँ वैश्विक', te: 'AI ఉద్యోగాలు - గ్లోబల్',
  },
  'All Projects': {
    es: 'Todos los proyectos', fr: 'Tous les projets', de: 'Alle Projekte', pt: 'Todos os projetos',
    hi: 'सभी प्रोजेक्ट', te: 'అన్ని ప్రాజెక్టులు',
  },
  'AI LinkedIn Posts': {
    es: 'Publicaciones IA de LinkedIn', fr: 'Posts IA LinkedIn', de: 'KI-LinkedIn-Posts', pt: 'Publicações de IA no LinkedIn',
    hi: 'AI लिंक्डइन पोस्ट', te: 'AI లింక్డ్ఇన్ పోస్టులు',
  },
  'AI Video Hub': {
    es: 'Video Hub de IA', fr: 'Hub vidéo IA', de: 'KI-Video-Hub', pt: 'Video Hub de IA',
    hi: 'AI वीडियो हब', te: 'AI వీడియో హబ్',
  },
  'AI Design Space': {
    es: 'Espacio de diseño IA', fr: 'Espace design IA', de: 'KI-Design-Raum', pt: 'Espaço de design de IA',
    hi: 'AI डिज़ाइन स्पेस', te: 'AI డిజైన్ స్పేస్',
  },
  'AI Prep · Learning Hub': {
    es: 'Preparación · Aprendizaje', fr: 'Préparation · Apprentissage', de: 'KI-Vorbereitung · Lernen', pt: 'Preparação · Aprendizado',
    hi: 'AI तैयारी · सीखने का हब', te: 'AI ప్రిపరేషన్ · లెర్నింగ్ హబ్',
  },
  'Python MasterHub': {
    es: 'Python MasterHub', fr: 'Python MasterHub', de: 'Python MasterHub', pt: 'Python MasterHub',
    hi: 'पायथन मास्टरहब', te: 'పైథాన్ మాస్టర్హబ్',
  },
  'AI TechStack Reference': {
    es: 'Referencia de stack IA', fr: 'Référence stack IA', de: 'KI-Techstack-Referenz', pt: 'Referência de techstack de IA',
    hi: 'AI टेकस्टैक रेफ़रेंस', te: 'AI టెక్స్టాక్ రిఫరెన్స్',
  },
  'Reference Library': {
    es: 'Biblioteca de referencia', fr: 'Bibliothèque de référence', de: 'Referenzbibliothek', pt: 'Biblioteca de referência',
    hi: 'संदर्भ पुस्तकालय', te: 'రిఫరెన్స్ లైబ్రరీ',
  },
  'AI Blogs & Market Demand': {
    es: 'Blogs de IA y demanda de mercado', fr: 'Blogs IA & demande', de: 'KI-Blogs & Marktnachfrage', pt: 'Blogs de IA e demanda',
    hi: 'AI ब्लॉग और बाज़ार माँग', te: 'AI బ్లాగులు & మార్కెట్ డిమాండ్',
  },
  'AI-Python HTML Guides': {
    es: 'Guías HTML IA-Python', fr: 'Guides HTML IA-Python', de: 'AI-Python-HTML-Guides', pt: 'Guias HTML de IA-Python',
    hi: 'AI-पायथन HTML गाइड', te: 'AI-పైథాన్ HTML గైడ్లు',
  },
  'AI Chatbots Global': {
    es: 'Chatbots IA global', fr: 'Chatbots IA monde', de: 'KI-Chatbots weltweit', pt: 'Chatbots de IA global',
    hi: 'AI चैटबॉट वैश्विक', te: 'AI చాట్బాట్లు - గ్లోబల్',
  },
  'AI Agents Global': {
    es: 'Agentes IA global', fr: 'Agents IA monde', de: 'KI-Agenten weltweit', pt: 'Agentes de IA global',
    hi: 'AI एजेंट वैश्विक', te: 'AI ఏజెంట్లు - గ్లోబల్',
  },
  'Communication Channels': {
    es: 'Canales de comunicación', fr: 'Canaux de communication', de: 'Kommunikationskanäle', pt: 'Canais de comunicação',
    hi: 'संचार चैनल', te: 'కమ్యూనికేషన్ ఛానళ్ళు',
  },
  'Technologies & Tutorials': {
    es: 'Tecnologías y tutoriales', fr: 'Technologies & tutoriels', de: 'Technologien & Tutorials', pt: 'Tecnologias e tutoriais',
    hi: 'तकनीक और ट्यूटोरियल', te: 'టెక్నాలజీలు & ట్యుటోరియల్స్',
  },
  'Python Tutorials': {
    es: 'Tutoriales de Python', fr: 'Tutoriels Python', de: 'Python-Tutorials', pt: 'Tutoriais de Python',
    hi: 'पायथन ट्यूटोरियल', te: 'పైథాన్ ట్యుటోరియల్స్',
  },
  'Python Tech Hub': {
    es: 'Hub técnico de Python', fr: 'Hub tech Python', de: 'Python-Tech-Hub', pt: 'Hub técnico de Python',
    hi: 'पायथन टेक हब', te: 'పైథాన్ టెక్ హబ్',
  },
  'Trading Guides': {
    es: 'Guías de trading', fr: 'Guides de trading', de: 'Trading-Guides', pt: 'Guias de trading',
    hi: 'ट्रेडिंग गाइड', te: 'ట్రేడింగ్ గైడ్లు',
  },
  'Neem Karoli Baba Wisdom': {
    es: 'Sabiduría de Neem Karoli Baba', fr: 'Sagesse de Neem Karoli Baba', de: 'Neem-Karoli-Baba-Weisheit', pt: 'Sabedoria de Neem Karoli Baba',
    hi: 'नीम करोली बाबा की शिक्षा', te: 'నీం కరోలీ బాబా జ్ఞానం',
  },
  'Study By Doing — AI Course Map': {
    es: 'Aprende haciendo — mapa del curso IA', fr: 'Apprendre en faisant — parcours IA', de: 'Durch Tun lernen — KI-Kurskarte', pt: 'Aprender fazendo — mapa do curso de IA',
    hi: 'करके सीखें — AI कोर्स मैप', te: 'చేస్తూ నేర్చుకోండి — AI కోర్సు మ్యాప్',
  },
  'MortalApps Hub': {
    es: 'Hub MortalApps', fr: 'Hub MortalApps', de: 'MortalApps-Hub', pt: 'Hub MortalApps',
    hi: 'MortalApps हब', te: 'MortalApps హబ్',
  },
  'Models & Inference': {
    es: 'Modelos e inferencia', fr: 'Modèles et inférence', de: 'Modelle & Inferenz', pt: 'Modelos e inferência',
    hi: 'मॉडल और इन्फ़रेंस', te: 'మోడల్స్ & ఇన్ఫరెన్స్',
  },
  'Core AI Systems': {
    es: 'Sistemas centrales de IA', fr: 'Systèmes IA fondamentaux', de: 'Kern-KI-Systeme', pt: 'Sistemas centrais de IA',
    hi: 'कोर AI सिस्टम', te: 'కోర్ AI సిస్టమ్స్',
  },
  'Development Stack': {
    es: 'Stack de desarrollo', fr: 'Stack de développement', de: 'Entwicklungs-Stack', pt: 'Stack de desenvolvimento',
    hi: 'डेवलपमेंट स्टैक', te: 'డెవలప్మెంట్ స్టాక్',
  },
  'Emerging & Future Tech': {
    es: 'Tecnología emergente y futura', fr: 'Technologies émergentes et futures', de: 'Neue & Zukunftstechnik', pt: 'Tecnologia emergente e futura',
    hi: 'उभरती और भविष्य की तकनीक', te: 'ఎమర్జింగ్ & ఫ్యూచర్ టెక్',
  },
  'Enterprise & Governance': {
    es: 'Empresa y gobernanza', fr: 'Entreprise et gouvernance', de: 'Enterprise & Governance', pt: 'Empresa e governança',
    hi: 'एंटरप्राइज़ और शासन', te: 'ఎంటర్ప్రైజ్ & గవర్నెన్స్',
  },
  'Tools & Resources': {
    es: 'Herramientas y recursos', fr: 'Outils et ressources', de: 'Tools & Ressourcen', pt: 'Ferramentas e recursos',
    hi: 'टूल्स और संसाधन', te: 'సాధనాలు & వనరులు',
  },
  'Projects & Architecture': {
    es: 'Proyectos y arquitectura', fr: 'Projets et architecture', de: 'Projekte & Architektur', pt: 'Projetos e arquitetura',
    hi: 'प्रोजेक्ट और आर्किटेक्चर', te: 'ప్రాజెక్టులు & ఆర్కిటెక్చర్',
  },
  '📖 All Chapters': {
    es: '📖 Todos los capítulos', fr: '📖 Tous les chapitres', de: '📖 Alle Kapitel', pt: '📖 Todos os capítulos',
    hi: '📖 सभी अध्याय', te: '📖 అన్ని అధ్యాయాలు',
  },
  'Deep Dives': {
    es: 'Análisis profundos', fr: 'Analyses approfondies', de: 'Deep-Dives', pt: 'Análises profundas',
    hi: 'डीप डाइव्स', te: 'డీప్ డైవ్స్',
  },
  'Reference Guide — All Tables': {
    es: 'Guía de referencia — todas las tablas', fr: 'Guide de référence — tous les tableaux', de: 'Referenzleitfaden — alle Tabellen', pt: 'Guia de referência — todas as tabelas',
    hi: 'रेफ़रेंस गाइड — सभी टेबल', te: 'రిఫరెన్స్ గైడ్ — అన్ని పట్టికలు',
  },
  'Chapters': {
    es: 'Capítulos', fr: 'Chapitres', de: 'Kapitel', pt: 'Capítulos', hi: 'अध्याय', te: 'అధ్యాయాలు',
  },
  'Code Examples': {
    es: 'Ejemplos de código', fr: 'Exemples de code', de: 'Codebeispiele', pt: 'Exemplos de código',
    hi: 'कोड उदाहरण', te: 'కోడ్ ఉదాహరణలు',
  },
  'Architecture Diagrams': {
    es: 'Diagramas de arquitectura', fr: 'Diagrammes d’architecture', de: 'Architekturdiagramme', pt: 'Diagramas de arquitetura',
    hi: 'आर्किटेक्चर आरेख', te: 'ఆర్కిటెక్చర్ రేఖాచిత్రాలు',
  },
  // ── Video Hub ──
  'AI Tech-Stack Video Hub': {
    es: 'Video Hub Tech-Stack IA', fr: 'Hub vidéo Tech-Stack IA', de: 'KI-Tech-Stack-Video-Hub', pt: 'Video Hub de Tech-Stack de IA',
    hi: 'AI टेक-स्टैक वीडियो हब', te: 'AI టెక్-స్టాక్ వీడియో హబ్',
  },
  'Load ALL videos — every network (YT + X + IG + TikTok + FB), all 44 topics': {
    es: 'Cargar TODOS los vídeos — todas las redes (YT + X + IG + TikTok + FB), 44 temas',
    fr: 'Charger TOUTES les vidéos — tous les réseaux (YT + X + IG + TikTok + FB), 44 sujets',
    de: 'ALLE Videos laden — jedes Netzwerk (YT + X + IG + TikTok + FB), alle 44 Themen',
    pt: 'Carregar TODOS os vídeos — todas as redes (YT + X + IG + TikTok + FB), 44 tópicos',
    hi: 'सभी वीडियो लोड करें — सभी नेटवर्क (YT + X + IG + TikTok + FB), 44 टॉपिक',
    te: 'అన్ని వీడియోలను లోడ్ చేయండి — అన్ని నెట్వర్క్లు (YT + X + IG + TikTok + FB), 44 టాపిక్లు',
  },
  'Loading all networks…': {
    es: 'Cargando todas las redes…', fr: 'Chargement de tous les réseaux…', de: 'Alle Netzwerke werden geladen…', pt: 'Carregando todas as redes…',
    hi: 'सभी नेटवर्क लोड हो रहे हैं…', te: 'అన్ని నెట్వర్క్లు లోడ్ అవుతున్నాయి…',
  },
  'Fetch latest': {
    es: 'Obtener lo más reciente', fr: 'Récupérer les dernières', de: 'Neueste abrufen', pt: 'Buscar os mais recentes',
    hi: 'नवीनतम लाएँ', te: 'తాజా వీడియోలు పొందండి',
  },
  'Fetching…': {
    es: 'Obteniendo…', fr: 'Récupération…', de: 'Wird abgerufen…', pt: 'Buscando…',
    hi: 'लाए जा रहे हैं…', te: 'తెస్తున్నాము…',
  },
  'Auto-refresh': {
    es: 'Actualizar automáticamente', fr: 'Actualisation auto', de: 'Auto-Refresh', pt: 'Atualização automática',
    hi: 'ऑटो-रिफ़्रेश', te: 'ఆటో-రిఫ్రెష్',
  },
  'Days': {
    es: 'Días', fr: 'Jours', de: 'Tage', pt: 'Dias', hi: 'दिन', te: 'రోజులు',
  },
  'Grid': {
    es: 'Cuadrícula', fr: 'Grille', de: 'Raster', pt: 'Grade', hi: 'ग्रिड', te: 'గ్రిడ్',
  },
  'Search country…': {
    es: 'Buscar país…', fr: 'Rechercher un pays…', de: 'Land suchen…', pt: 'Buscar país…',
    hi: 'देश खोजें…', te: 'దేశం వెతకండి…',
  },
  'Search language…': {
    es: 'Buscar idioma…', fr: 'Rechercher une langue…', de: 'Sprache suchen…', pt: 'Buscar idioma…',
    hi: 'भाषा खोजें…', te: 'భాష వెతకండి…',
  },
  'Mixed / AI': {
    es: 'Mixto / IA', fr: 'Mixte / IA', de: 'Gemischt / KI', pt: 'Misto / IA',
    hi: 'मिक्स / AI', te: 'మిక్స్డ్ / AI',
  },
  'All lengths': {
    es: 'Todas las duraciones', fr: 'Toutes les durées', de: 'Alle Längen', pt: 'Todas as durações',
    hi: 'सभी अवधि', te: 'అన్ని పొడవులు',
  },
  'Shorts (≤60s)': {
    es: 'Cortos (≤60s)', fr: 'Courts (≤60s)', de: 'Shorts (≤60s)', pt: 'Curtos (≤60s)',
    hi: 'शॉर्ट्स (≤60s)', te: 'షార్ట్స్ (≤60s)',
  },
  'Long-form': {
    es: 'Formato largo', fr: 'Long format', de: 'Langformat', pt: 'Formato longo',
    hi: 'लॉन्ग-फ़ॉर्म', te: 'లాంగ్-ఫారమ్',
  },
  'Latest first': {
    es: 'Más reciente primero', fr: 'Plus récents d’abord', de: 'Neueste zuerst', pt: 'Mais recentes primeiro',
    hi: 'नवीनतम पहले', te: 'తాజావి ముందు',
  },
  'Most viewed': {
    es: 'Más vistos', fr: 'Les plus vus', de: 'Meistgesehene', pt: 'Mais vistos',
    hi: 'सबसे ज़्यादा देखे गए', te: 'ఎక్కువగా చూసినవి',
  },
  'Last 7 days': {
    es: 'Últimos 7 días', fr: '7 derniers jours', de: 'Letzte 7 Tage', pt: 'Últimos 7 dias',
    hi: 'पिछले 7 दिन', te: 'చివరి 7 రోజులు',
  },
  'Last month': {
    es: 'Último mes', fr: 'Dernier mois', de: 'Letzter Monat', pt: 'Último mês',
    hi: 'पिछला महीना', te: 'చివరి నెల',
  },
  'Last 3 months': {
    es: 'Últimos 3 meses', fr: '3 derniers mois', de: 'Letzte 3 Monate', pt: 'Últimos 3 meses',
    hi: 'पिछले 3 महीने', te: 'చివరి 3 నెలలు',
  },
  'Last 6 months': {
    es: 'Últimos 6 meses', fr: '6 derniers mois', de: 'Letzte 6 Monate', pt: 'Últimos 6 meses',
    hi: 'पिछले 6 महीने', te: 'చివరి 6 నెలలు',
  },
  'Last 1 year': {
    es: 'Último año', fr: 'Dernier an', de: 'Letztes Jahr', pt: 'Último ano',
    hi: 'पिछला 1 वर्ष', te: 'చివరి 1 సంవత్సరం',
  },
  'Last 2 years': {
    es: 'Últimos 2 años', fr: '2 dernières années', de: 'Letzte 2 Jahre', pt: 'Últimos 2 anos',
    hi: 'पिछले 2 वर्ष', te: 'చివరి 2 సంవత్సరాలు',
  },
  'Last 5 years': {
    es: 'Últimos 5 años', fr: '5 dernières années', de: 'Letzte 5 Jahre', pt: 'Últimos 5 anos',
    hi: 'पिछले 5 वर्ष', te: 'చివరి 5 సంవత్సరాలు',
  },
  'Custom range': {
    es: 'Rango personalizado', fr: 'Plage personnalisée', de: 'Benutzerdefinierter Bereich', pt: 'Intervalo personalizado',
    hi: 'कस्टम रेंज', te: 'అనుకూల పరిధి',
  },
  'Refresh': {
    es: 'Actualizar', fr: 'Actualiser', de: 'Aktualisieren', pt: 'Atualizar', hi: 'रिफ़्रेश', te: 'రిఫ్రెష్',
  },
  'Retry now': {
    es: 'Reintentar ahora', fr: 'Réessayer', de: 'Jetzt erneut', pt: 'Tentar novamente',
    hi: 'अभी फिर से करें', te: 'ఇప్పుడే మళ్లీ ప్రయత్నించండి',
  },
  'Loading…': {
    es: 'Cargando…', fr: 'Chargement…', de: 'Lädt…', pt: 'Carregando…', hi: 'लोड हो रहा…', te: 'లోడ్ అవుతోంది…',
  },
  'No videos in this date range for this topic yet': {
    es: 'Aún no hay vídeos en este rango de fechas para este tema',
    fr: 'Aucune vidéo dans cette période pour ce sujet',
    de: 'Noch keine Videos in diesem Zeitraum für dieses Thema',
    pt: 'Ainda não há vídeos neste intervalo para este tópico',
    hi: 'इस तिथि सीमा में इस टॉपिक के वीडियो अभी नहीं हैं',
    te: 'ఈ తేదీ పరిధిలో ఈ టాపిక్కు ఇంకా వీడియోలు లేవు',
  },
  'Widen the date range, try another tech-stack topic — or search directly:': {
    es: 'Amplía el rango de fechas, prueba otro tema o busca directamente:',
    fr: 'Élargissez la période, essayez un autre sujet ou recherchez directement :',
    de: 'Erweitern Sie den Zeitraum, versuchen Sie ein anderes Thema — oder suchen Sie direkt:',
    pt: 'Amplie o intervalo, tente outro tópico — ou busque diretamente:',
    hi: 'तिथि सीमा बढ़ाएँ, दूसरा टॉपिक आज़माएँ — या सीधे खोजें:',
    te: 'తేదీ పరిధిని పెంచండి, మరో టాపిక్ ప్రయత్నించండి — లేదా నేరుగా వెతకండి:',
  },
  'Watch': {
    es: 'Ver', fr: 'Regarder', de: 'Ansehen', pt: 'Assistir', hi: 'देखें', te: 'చూడండి',
  },
  'Download': {
    es: 'Descargar', fr: 'Télécharger', de: 'Herunterladen', pt: 'Baixar', hi: 'डाउनलोड', te: 'డౌన్లోడ్',
  },
  'topics': {
    es: 'temas', fr: 'sujets', de: 'Themen', pt: 'tópicos', hi: 'टॉपिक', te: 'టాపిక్లు',
  },
  'videos loaded': {
    es: 'vídeos cargados', fr: 'vidéos chargées', de: 'geladene Videos', pt: 'vídeos carregados',
    hi: 'वीडियो लोड हुए', te: 'వీడియోలు లోడ్ అయ్యాయి',
  },
  'networks': {
    es: 'redes', fr: 'réseaux', de: 'Netzwerke', pt: 'redes', hi: 'नेटवर्क', te: 'నెట్వర్క్లు',
  },
  'shorts': {
    es: 'cortos', fr: 'courts', de: 'Shorts', pt: 'curtos', hi: 'शॉर्ट्स', te: 'షార్ట్స్',
  },
  'channels': {
    es: 'canales', fr: 'chaînes', de: 'Kanäle', pt: 'canais', hi: 'चैनल', te: 'ఛానళ్ళు',
  },
  'Reference Images & Documents Gallery': {
    es: 'Galería de imágenes y documentos de referencia', fr: 'Galerie d’images et de documents de référence',
    de: 'Galerie der Referenzbilder und Dokumente', pt: 'Galeria de imagens e documentos de referência',
    hi: 'संदर्भ छवियाँ और दस्तावेज़ गैलरी', te: 'సూచన చిత్రాలు మరియు డాక్యుమెంట్ల గ్యాలరీ',
  },
  'Images': {
    es: 'Imágenes', fr: 'Images', de: 'Bilder', pt: 'Imagens', hi: 'छवियाँ', te: 'చిత్రాలు',
  },
  'Documents': {
    es: 'Documentos', fr: 'Documents', de: 'Dokumente', pt: 'Documentos', hi: 'दस्तावेज़', te: 'డాక్యుమెంట్లు',
  },
  'PDFs': {
    es: 'PDF', fr: 'PDF', de: 'PDFs', pt: 'PDFs', hi: 'पीडीएफ', te: 'PDFలు',
  },
  'Data': {
    es: 'Datos', fr: 'Données', de: 'Daten', pt: 'Dados', hi: 'डेटा', te: 'డేటా',
  },
  'unavailable': {
    es: 'no disponible', fr: 'indisponible', de: 'nicht verfügbar', pt: 'indisponível', hi: 'अनुपलब्ध', te: 'అందుబాటులో లేదు',
  },
  'Fetch Files': {
    es: 'Obtener archivos', fr: 'Récupérer les fichiers', de: 'Dateien abrufen', pt: 'Buscar arquivos',
    hi: 'फ़ाइलें लाएँ', te: 'ఫైళ్ళను పొందండి',
  },
  'Market & language': {
    es: 'Mercado e idioma', fr: 'Marché et langue', de: 'Markt & Sprache', pt: 'Mercado e idioma',
    hi: 'बाज़ार और भाषा', te: 'మార్కెట్ & భాష',
  },
  'Topic · length · order · period': {
    es: 'Tema · duración · orden · período', fr: 'Sujet · durée · tri · période',
    de: 'Thema · Länge · Reihenfolge · Zeitraum', pt: 'Tópico · duração · ordem · período',
    hi: 'विषय · लंबाई · क्रम · अवधि', te: 'టాపిక్ · పొడవు · క్రమం · వ్యవధి',
  },
  'Network': {
    es: 'Red', fr: 'Réseau', de: 'Netzwerk', pt: 'Rede', hi: 'नेटवर्क', te: 'నెట్వర్క్',
  },
  'downloaded': {
    es: 'descargados', fr: 'téléchargés', de: 'heruntergeladen', pt: 'baixados', hi: 'डाउनलोड', te: 'డౌన్లోడ్లు',
  },
  'Fetch Latest': {
    es: 'Obtener lo último', fr: 'Actualiser', de: 'Neueste abrufen', pt: 'Obter as mais recentes', hi: 'नवीनतम लाएँ', te: 'తాజా వాటిని పొందండి',
  },
  'AI Chatbots & Habots Global Directory': {
    es: 'Directorio Global de Chatbots y Habots de IA', fr: 'Annuaire mondial des chatbots et habots IA', de: 'Globales Verzeichnis für Chatbots & Habots', pt: 'Diretório global de chatbots e habots de IA', hi: 'AI चैटबॉट और हैबॉट ग्लोबल डायरेक्ट्री', te: 'AI చాట్బాట్లు & హాబాట్ల గ్లోబల్ డైరెక్టరీ',
  },
  'AI / ML Resources': {
    es: 'Recursos de IA / ML', fr: 'Ressources IA / ML', de: 'KI-/ML-Ressourcen', pt: 'Recursos de IA / ML', hi: 'AI / ML संसाधन', te: 'AI / ML వనరులు',
  },
  'AI/ML Resources': {
    es: 'Recursos de IA/ML', fr: 'Ressources IA/ML', de: 'KI/ML-Ressourcen', pt: 'Recursos de IA/ML', hi: 'AI/ML संसाधन', te: 'AI/ML వనరులు',
  },
  'AI Daily News & Resources Dashboard': {
    es: 'Panel de Noticias y Recursos Diarios de IA', fr: 'Tableau de bord des actualités et ressources IA', de: 'KI-Tagesnachrichten-&-Ressourcen-Dashboard', pt: 'Painel de notícias e recursos diários de IA', hi: 'AI दैनिक समाचार और संसाधन डैशबोर्ड', te: 'AI రోజువారీ వార్తలు & వనరుల డాష్‌బోర్డ్',
  },
  'AI · PYTHON · ENGINEERING MASTERHUB': {
    es: 'MASTERHUB DE IA · PYTHON · INGENIERÍA', fr: 'MASTERHUB IA · PYTHON · INGÉNIERIE', de: 'KI · PYTHON · ENGINEERING-MASTERHUB', pt: 'MASTERHUB IA · PYTHON · ENGENHARIA', hi: 'AI · पायथन · इंजीनियरिंग मास्टरहब', te: 'AI · పైథాన్ · ఇంజనీరింగ్ మాస్టర్‌హబ్',
  },
  'Technology Selection Map': {
    es: 'Mapa de Selección de Tecnología', fr: 'Carte de sélection des technologies', de: 'Technologie-Auswahlkarte', pt: 'Mapa de seleção de tecnologia', hi: 'टेक्नोलॉजी चयन मानचित्र', te: 'టెక్నాలజీ ఎంపిక మ్యాప్',
  },
  'AI Tech Blogs & Market Demand Hub': {
    es: 'Blogs de IA y Centro de Demanda del Mercado', fr: 'Blogs IA et hub de demande marché', de: 'KI-Blogs & Marktnachfrage-Hub', pt: 'Blogs de IA e hub de demanda de mercado', hi: 'AI टेक ब्लॉग और मार्केट डिमांड हब', te: 'AI టెక్ బ్లాగ్లు & మార్కెట్ డిమాండ్ హబ్',
  },
  'AI Tools & Agents Catalog': {
    es: 'Catálogo de Herramientas y Agentes de IA', fr: 'Catalogue des outils et agents IA', de: 'Katalog für KI-Tools & Agenten', pt: 'Catálogo de ferramentas e agentes de IA', hi: 'AI टूल्स और एजेंट कैटलॉग', te: 'AI సాధనాలు & ఏజెంట్ల కేటలాగ్',
  },
  'AI TechStack Reference': {
    es: 'Referencia del Stack Tecnológico de IA', fr: 'Référence de la pile technologique IA', de: 'KI-Techstack-Referenz', pt: 'Referência da stack tecnológica de IA', hi: 'AI टेकस्टैक संदर्भ', te: 'AI టెక్స్టాక్ రిఫరెన్స్',
  },
  'Book Catalog': {
    es: 'Catálogo de Libros', fr: 'Catalogue de livres', de: 'Buchkatalog', pt: 'Catálogo de livros', hi: 'पुस्तक कैटलॉग', te: 'పుస్తక కేటలాగ్',
  },
  'Free (Public Domain)': {
    es: 'Gratis (Dominio público)', fr: 'Gratuit (domaine public)', de: 'Gratis (Public Domain)', pt: 'Gratuitos (domínio público)', hi: 'मुफ़्त (सार्वजनिक डोमेन)', te: 'ఉచిత (పబ్లిక్ డొమైన్)',
  },
  'Premium': {
    es: 'Premium', fr: 'Premium', de: 'Premium', pt: 'Premium', hi: 'प्रीमियम', te: 'ప్రీమియం',
  },
  'Best Star Reads': {
    es: 'Mejores Lecturas', fr: 'Meilleures lectures', de: 'Beste Stern-Lesungen', pt: 'Melhores leituras', hi: 'बेस्ट स्टार रीड्स', te: 'బెస్ట్ స్టార్ రీడ్స్',
  },
  'Authors': {
    es: 'Autores', fr: 'Auteurs', de: 'Autoren', pt: 'Autores', hi: 'लेखक', te: 'రచయితలు',
  },
  'Avg Rating': {
    es: 'Valoración media', fr: 'Note moyenne', de: 'Ø Bewertung', pt: 'Nota média', hi: 'औसत रेटिंग', te: 'సగటు రేటింగ్',
  },
  'Best Star Books — Top 100 Highest Rated': {
    es: 'Mejores Libros — Top 100 Mejor Valorados', fr: 'Meilleurs livres — Top 100 mieux notés', de: 'Beste Bücher — Top 100 am besten bewertet', pt: 'Melhores livros — Top 100 mais bem avaliados', hi: 'बेस्ट स्टार बुक्स — टॉप 100 सर्वोच्च रेटेड', te: 'బెస్ట్ స్టార్ పుస్తకాలు — టాప్ 100 అత్యధిక రేటింగ్',
  },
  'Claude Certification Guide': {
    es: 'Guía de Certificación Claude', fr: 'Guide de certification Claude', de: 'Claude-Zertifizierungsleitfaden', pt: 'Guia de certificação Claude', hi: 'क्लॉड प्रमाणन गाइड', te: 'క్లాడ్ సర్టిఫికేషన్ గైడ్',
  },
  'Certifications': {
    es: 'Certificaciones', fr: 'Certifications', de: 'Zertifizierungen', pt: 'Certificações', hi: 'प्रमाणपत्र', te: 'సర్టిఫికేషన్లు',
  },
  'Supporting Tools': {
    es: 'Herramientas de apoyo', fr: 'Outils d’appui', de: 'Unterstützende Tools', pt: 'Ferramentas de apoio', hi: 'सहायक उपकरण', te: 'సహాయక సాధనాలు',
  },
  'Official proctoring provider': {
    es: 'Proveedor oficial de supervisión', fr: 'Fournisseur officiel de surveillance', de: 'Offizieller Aufsichts-Anbieter', pt: 'Provedor oficial de supervisão', hi: 'आधिकारिक प्रॉक्टरिंग प्रदाता', te: 'అధికారిక ప్రాక్టరింగ్ ప్రొవైడర్',
  },
  'Communication': {
    es: 'Comunicación', fr: 'Communication', de: 'Kommunikation', pt: 'Comunicação', hi: 'संचार', te: 'కమ్యూనికేషన్',
  },
  'Commodities Command Center': {
    es: 'Centro de Mando de Materias Primas', fr: 'Centre de commande des matières premières', de: 'Rohstoff-Kommandozentrale', pt: 'Centro de comando de commodities', hi: 'कमोडिटीज़ कमांड सेंटर', te: 'కమోడిటీల కమాండ్ సెంటర్',
  },
  'Country Trading Hub': {
    es: 'Centro de Trading por País', fr: 'Hub de trading par pays', de: 'Länder-Trading-Hub', pt: 'Hub de trading por país', hi: 'देश ट्रेडिंग हब', te: 'దేశ ట్రేడింగ్ హబ్',
  },
  'Daily Trading Dashboard': {
    es: 'Panel Diario de Trading', fr: 'Tableau de trading quotidien', de: 'Tägliches Trading-Dashboard', pt: 'Painel diário de trading', hi: 'दैनिक ट्रेडिंग डैशबोर्ड', te: 'రోజువారీ ట్రేడింగ్ డాష్‌బోర్డ్',
  },
  '📚 Edureka Generative AI Master Program': {
    es: '📚 Programa Máster de IA Generativa de Edureka', fr: '📚 Programme Master IA générative Edureka', de: '📚 Edureka Generative-AI-Masterprogramm', pt: '📚 Programa Master de IA generativa da Edureka', hi: '📚 एड्यूरेका जनरेटिव AI मास्टर प्रोग्राम', te: '📚 ఎడురేకా జనరేటివ్ AI మాస్టర్ ప్రోగ్రామ్',
  },
  '📐 AI Knowledge Tables': {
    es: '📐 Tablas de Conocimiento de IA', fr: '📐 Tableaux de connaissances IA', de: '📐 KI-Wissenstabellen', pt: '📐 Tabelas de conhecimento de IA', hi: '📐 AI ज्ञान तालिकाएँ', te: '📐 AI జ్ఞాన పట్టికలు',
  },
  '📂 AI Master Reference — All Files by Folder': {
    es: '📂 Referencia Maestra de IA — Todos los Archivos por Carpeta', fr: '📂 Référence maîtresse IA — Tous les fichiers par dossier', de: '📂 KI-Master-Referenz — Alle Dateien nach Ordner', pt: '📂 Referência-mestra de IA — Todos os arquivos por pasta', hi: '📂 AI मास्टर संदर्भ — सभी फ़ाइलें फ़ोल्डर द्वारा', te: '📂 AI మాస్టర్ రిఫరెన్స్ — అన్ని ఫైళ్ళు ఫోల్డర్ వారీగా',
  },
  '📊 ETL Tools & Data Engineering — Complete Global Guide 2026': {
    es: '📊 Herramientas ETL e Ingeniería de Datos — Guía Global Completa 2026', fr: '📊 Outils ETL et ingénierie des données — Guide mondial complet 2026', de: '📊 ETL-Tools & Data Engineering — Vollständiger Globaler Leitfaden 2026', pt: '📊 Ferramentas ETL e engenharia de dados — Guia global completo 2026', hi: '📊 ETL टूल्स और डेटा इंजीनियरिंग — पूर्ण ग्लोबल गाइड 2026', te: '📊 ETL సాధనాలు & డేటా ఇంజనీరింగ్ — పూర్తి గ్లోబల్ గైడ్ 2026',
  },
  '🌐 Industry Regulatory & Compliance Matrix': {
    es: '🌐 Matriz Regulatoria y de Cumplimiento por Industria', fr: '🌐 Matrice de conformité et réglementaire par industrie', de: '🌐 Branchen-Regulierungs-&-Compliance-Matrix', pt: '🌐 Matriz regulatória e de conformidade por indústria', hi: '🌐 उद्योग विनियामक और अनुपालन मैट्रिक्स', te: '🌐 పరిశ్రమ నియంత్రణ & సమ్మతి మ్యాట్రిక్స్',
  },
  '💼 AI Engineering Jobs': {
    es: '💼 Empleos de Ingeniería de IA', fr: '💼 Emplois en ingénierie IA', de: '💼 KI-Engineering-Jobs', pt: '💼 Empregos de engenharia de IA', hi: '💼 AI इंजीनियरिंग नौकरियाँ', te: '💼 AI ఇంజనీరింగ్ ఉద్యోగాలు',
  },
  '📋 Investment Playbook — Complete End-to-End Guide': {
    es: '📋 Playbook de Inversión — Guía Completa de Principio a Fin', fr: '📋 Guide d’investissement — Guide complet de bout en bout', de: '📋 Investment-Playbook — Vollständiger End-to-End-Leitfaden', pt: '📋 Playbook de investimento — Guia completa', hi: '📋 निवेश प्लेबुक — संपूर्ण एंड-टू-एंड गाइड', te: '📋 పెట్టుబడి ప్లేబుక్ — పూర్తి ఎండ్-టు-ఎండ్ గైడ్',
  },
  '📡 Live AI News Dashboard': {
    es: '📡 Panel de Noticias de IA en Vivo', fr: '📡 Tableau de bord des actualités IA en direct', de: '📡 Live-KI-Nachrichten-Dashboard', pt: '📡 Painel de notícias de IA ao vivo', hi: '📡 लाइव AI समाचार डैशबोर्ड', te: '📡 లైవ్ AI వార్తల డాష్‌బోర్డ్',
  },
  '💰 Live Investment Dashboard': {
    es: '💰 Panel de Inversiones en Vivo', fr: '💰 Tableau d’investissement en direct', de: '💰 Live-Investment-Dashboard', pt: '💰 Painel de investimentos ao vivo', hi: '💰 लाइव निवेश डैशबोर्ड', te: '💰 లైవ్ ఇన్వెస్ట్మెంట్ డాష్‌బోర్డ్',
  },
  'Live Financial Advisor': {
    es: 'Asesor Financiero en Vivo', fr: 'Conseiller financier en direct', de: 'Live-Finanzberater', pt: 'Assessor financeiro ao vivo', hi: 'लाइव वित्तीय सलाहकार', te: 'లైవ్ ఫైనాన్షియల్ అడ్వైజర్',
  },
  'THE KNOWLEDGE LIBRARY': {
    es: 'LA BIBLIOTECA DEL CONOCIMIENTO', fr: 'LA BIBLIOTHÈQUE DU SAVOIR', de: 'DIE WISSENSBIBLIOTHEK', pt: 'A BIBLIOTECA DO CONHECIMENTO', hi: 'द नॉलेज लाइब्रेरी', te: 'నాలెడ్జ్ లైబ్రరీ',
  },
  'CURATED LEARNING PATH': {
    es: 'RUTA DE APRENDIZAJE CURADA', fr: 'PARCOURS D’APPRENTISSAGE CURÉ', de: 'KURIERTER LERN-PFAD', pt: 'TRILHA DE APRENDIZADO CURADA', hi: 'क्यूरेटेड लर्निंग पाथ', te: 'క్యూరేటెడ్ లెర్నింగ్ పాత్',
  },
  'Learn technology by building.': {
    es: 'Aprende tecnología construyendo.', fr: 'Apprenez la technologie en construisant.', de: 'Lerne Technologie durch Bauen.', pt: 'Aprenda tecnologia construindo.', hi: 'बनाकर टेक्नोलॉजी सीखें।', te: 'నిర్మించడం ద్వారా సాంకేతికత నేర్చుకోండి.',
  },
  'AI Tech Stack GitHub Repos': {
    es: 'Repositorios GitHub del Stack de IA', fr: 'Dépôts GitHub de la pile IA', de: 'KI-Techstack-GitHub-Repos', pt: 'Repositórios GitHub da stack de IA', hi: 'AI टेक स्टैक गिटहब रिपोजिटरीज़', te: 'AI టెక్ స్టాక్ గిట్‌హబ్ రిపోజిటరీలు',
  },
  'Practice with the Full Question Bank': {
    es: 'Practica con el banco completo de preguntas', fr: 'Entraînez-vous avec l’intégralité du questionnement', de: 'Üben mit der vollständigen Fragenbank', pt: 'Pratique com o banco completo de questões', hi: 'पूर्ण प्रश्न बैंक के साथ अभ्यास करें', te: 'పూర్తి ప్రశ్నల బ్యాంక్తో ప్రాక్టీస్ చేయండి',
  },
  'Back to AI agents': {
    es: 'Volver a agentes de IA', fr: 'Retour aux agents IA', de: 'Zurück zu KI-Agenten', pt: 'Voltar aos agentes de IA', hi: 'AI एजेंट पर वापस', te: 'AI ఏజెంట్లకు తిరిగి',
  },
  'Back to AI agent directory': {
    es: 'Volver al directorio de agentes', fr: 'Retour à l’annuaire des agents IA', de: 'Zurück zum KI-Agenten-Verzeichnis', pt: 'Voltar ao diretório de agentes de IA', hi: 'AI एजेंट डायरेक्ट्री पर वापस', te: 'AI ఏజెంట్ డైరెక్టరీకి తిరిగి',
  },
  'Back to knowledge hub': {
    es: 'Volver al centro de conocimiento', fr: 'Retour au hub de connaissances', de: 'Zurück zum Wissens-Hub', pt: 'Voltar ao hub de conhecimento', hi: 'नॉलेज हब पर वापस', te: 'నాలెడ్జ్ హబ్కి తిరిగి',
  },
  'Back to directory': {
    es: 'Volver al directorio', fr: 'Retour à l’annuaire', de: 'Zurück zum Verzeichnis', pt: 'Voltar ao diretório', hi: 'डायरेक्ट्री पर वापस', te: 'డైరెక్టరీకి తిరిగి',
  },
  'Back to AI chatbot directory': {
    es: 'Volver al directorio de chatbots', fr: 'Retour à l’annuaire des chatbots IA', de: 'Zurück zum KI-Chatbot-Verzeichnis', pt: 'Voltar ao diretório de chatbots de IA', hi: 'AI चैटबॉट डायरेक्ट्री पर वापस', te: 'AI చాట్బాట్ డైరెక్టరీకి తిరిగి',
  },
  'Back to Dashboard': {
    es: 'Volver al panel', fr: 'Retour au tableau de bord', de: 'Zurück zum Dashboard', pt: 'Voltar ao painel', hi: 'डैशबोर्ड पर वापस', te: 'డాష్‌బోర్డ్కి తిరిగి',
  },
  'Back to guide icons': {
    es: 'Volver a iconos de guía', fr: 'Retour aux icônes du guide', de: 'Zurück zu den Guide-Icons', pt: 'Voltar aos ícones do guia', hi: 'गाइड आइकन पर वापस', te: 'గైడ్ ఐకాన్లకు తిరిగి',
  },
  'Back to Books': {
    es: 'Volver a libros', fr: 'Retour aux livres', de: 'Zurück zu Büchern', pt: 'Voltar aos livros', hi: 'पुस्तकों पर वापस', te: 'పుస్తకాలకు తిరిగి',
  },
  'Back to Book Catalog': {
    es: 'Volver al catálogo de libros', fr: 'Retour au catalogue de livres', de: 'Zurück zum Buchkatalog', pt: 'Voltar ao catálogo de livros', hi: 'पुस्तक कैटलॉग पर वापस', te: 'పుస్తక కేటలాగ్కి తిరిగి',
  },
  'Back to Learning Hub': {
    es: 'Volver al centro de aprendizaje', fr: 'Retour au hub d’apprentissage', de: 'Zurück zum Lern-Hub', pt: 'Voltar ao hub de aprendizado', hi: 'लर्निंग हब पर वापस', te: 'లెర్నింగ్ హబ్కి తిరిగి',
  },
  'Back to AI/ML Resources': {
    es: 'Volver a recursos IA/ML', fr: 'Retour aux ressources IA/ML', de: 'Zurück zu KI/ML-Ressourcen', pt: 'Voltar aos recursos de IA/ML', hi: 'AI/ML संसाधन पर वापस', te: 'AI/ML వనరులకు తిరిగి',
  },
  'Back to Blog': {
    es: 'Volver al blog', fr: 'Retour au blog', de: 'Zurück zum Blog', pt: 'Voltar ao blog', hi: 'ब्लॉग पर वापस', te: 'బ్లాగ్‌కి తిరిగి',
  },
  'Back to Jobs': {
    es: 'Volver a empleos', fr: 'Retour aux emplois', de: 'Zurück zu Jobs', pt: 'Voltar aos empregos', hi: 'नौकरियों पर वापस', te: 'ఉద్యోగాలకు తిరిగి',
  },
  'Back to learning': {
    es: 'Volver al aprendizaje', fr: 'Retour à l’apprentissage', de: 'Zurück zum Lernen', pt: 'Voltar ao aprendizado', hi: 'सीखने पर वापस', te: 'నేర్చుకోవడానికి తిరిగి',
  },
  'Back to catalog': {
    es: 'Volver al catálogo', fr: 'Retour au catalogue', de: 'Zurück zum Katalog', pt: 'Voltar ao catálogo', hi: 'कैटलॉग पर वापस', te: 'కేటలాగ్‌కి తిరిగి',
  },
  'Back to Python Tutorials': {
    es: 'Volver a tutoriales de Python', fr: 'Retour aux tutoriels Python', de: 'Zurück zu den Python-Tutorials', pt: 'Voltar aos tutoriais de Python', hi: 'पायथन ट्यूटोरियल पर वापस', te: 'పైథాన్ ట్యుటోరియల్స్‌కి తిరిగి',
  },
  'Total Jobs': {
    es: 'Total de empleos', fr: 'Total des emplois', de: 'Gesamtzahl der Jobs', pt: 'Total de empregos', hi: 'कुल नौकरियाँ', te: 'మొత్తం ఉద్యోగాలు',
  },
  'Salary Range (USD)': {
    es: 'Rango salarial (USD)', fr: 'Fourchette de salaire (USD)', de: 'Gehaltsspanne (USD)', pt: 'Faixa salarial (USD)', hi: 'वेतन सीमा (USD)', te: 'జీతం పరిధి (USD)',
  },
  'Complete JDs': {
    es: 'Descripciones completas', fr: 'Descriptifs complets', de: 'Vollständige Stellenbeschreibungen', pt: 'Descrições completas', hi: 'पूर्ण जॉब विवरण', te: 'పూర్తి JDలు',
  },
  'Clear filters': {
    es: 'Limpiar filtros', fr: 'Effacer les filtres', de: 'Filter zurücksetzen', pt: 'Limpar filtros', hi: 'फ़िल्टर साफ़ करें', te: 'ఫిల్టర్లను క్లియర్ చేయండి',
  },
  'Browse by area': {
    es: 'Explorar por área', fr: 'Parcourir par domaine', de: 'Nach Bereich durchsuchen', pt: 'Navegar por área', hi: 'क्षेत्र से ब्राउज़ करें', te: 'ప్రాంతం వారీగా బ్రౌజ్ చేయండి',
  },
  'Total agent blueprints': {
    es: 'Total de planos de agentes', fr: 'Total de modèles d’agents', de: 'Gesamtzahl Agenten-Blueprints', pt: 'Total de blueprints de agentes', hi: 'कुल एजेंट ब्लूप्रिंट', te: 'మొత్తం ఏజెంట్ బ్లూప్రింట్లు',
  },
  'Countries and markets': {
    es: 'Países y mercados', fr: 'Pays et marchés', de: 'Länder und Märkte', pt: 'Países e mercados', hi: 'देश और बाज़ार', te: 'దేశాలు మరియు మార్కెట్లు',
  },
  'Industry areas': {
    es: 'Áreas de industria', fr: 'Secteurs d’industrie', de: 'Industriebereiche', pt: 'Áreas de indústria', hi: 'उद्योग क्षेत्र', te: 'పరిశ్రమ ప్రాంతాలు',
  },
  'Agent models': {
    es: 'Modelos de agentes', fr: 'Modèles d’agents', de: 'Agentenmodelle', pt: 'Modelos de agentes', hi: 'एजेंट मॉडल', te: 'ఏజెంట్ మోడల్స్',
  },
  'Total Chatbots': {
    es: 'Total de chatbots', fr: 'Total de chatbots', de: 'Gesamtzahl Chatbots', pt: 'Total de chatbots', hi: 'कुल चैटबॉट', te: 'మొత్తం చాట్బాట్లు',
  },
  'In Production': {
    es: 'En producción', fr: 'En production', de: 'In Produktion', pt: 'Em produção', hi: 'प्रोडक्शन में', te: 'ప్రొడక్షన్‌లో',
  },
  'By Country': {
    es: 'Por país', fr: 'Par pays', de: 'Nach Land', pt: 'Por país', hi: 'देश द्वारा', te: 'దేశం వారీగా',
  },
  'By Industry': {
    es: 'Por industria', fr: 'Par industrie', de: 'Nach Branche', pt: 'Por indústria', hi: 'उद्योग द्वारा', te: 'పరిశ్రమ వారీగా',
  },
  'Export CSV': {
    es: 'Exportar CSV', fr: 'Exporter CSV', de: 'CSV exportieren', pt: 'Exportar CSV', hi: 'CSV निर्यात करें', te: 'CSV ఎక్స్పోర్ట్',
  },
  'Reset View': {
    es: 'Restablecer vista', fr: 'Réinitialiser la vue', de: 'Ansicht zurücksetzen', pt: 'Redefinir visualização', hi: 'दृश्य रीसेट करें', te: 'వీక్షణను రీసెట్ చేయండి',
  },
  'All markets': {
    es: 'Todos los mercados', fr: 'Tous les marchés', de: 'Alle Märkte', pt: 'Todos os mercados', hi: 'सभी बाज़ार', te: 'అన్ని మార్కెట్లు',
  },
  'What if I buy?': {
    es: '¿Qué pasa si compro?', fr: 'Et si j’achète ?', de: 'Was, wenn ich kaufe?', pt: 'E se eu comprar?', hi: 'अगर मैं खरीदूँ तो क्या?', te: 'నేను కొన్నట్లయితే?',
  },
  'Important words': {
    es: 'Palabras clave', fr: 'Mots importants', de: 'Wichtige Begriffe', pt: 'Palavras importantes', hi: 'महत्वपूर्ण शब्द', te: 'ముఖ్యమైన పదాలు',
  },
  'Quick Start — How to Invest in': {
    es: 'Inicio rápido — Cómo invertir en', fr: 'Démarrage rapide — Comment investir dans', de: 'Schnellstart — So investieren Sie in', pt: 'Início rápido — Como investir em', hi: 'क्विक स्टार्ट — कैसे निवेश करें', te: 'క్విక్ స్టార్ట్ — ఎలా పెట్టుబడి పెట్టాలి',
  },
  'LIVE MARKET DATA': {
    es: 'DATOS DE MERCADO EN VIVO', fr: 'DONNÉES DE MARCHÉ EN DIRECT', de: 'LIVE-MARKTDATEN', pt: 'DADOS DE MERCADO AO VIVO', hi: 'लाइव मार्केट डेटा', te: 'లైవ్ మార్కెట్ డేటా',
  },
  'Retry': {
    es: 'Reintentar', fr: 'Réessayer', de: 'Erneut versuchen', pt: 'Tentar novamente', hi: 'पुनः प्रयास करें', te: 'మళ్లీ ప్రయత్నించండి',
  },
  'On this page': {
    es: 'En esta página', fr: 'Sur cette page', de: 'Auf dieser Seite', pt: 'Nesta página', hi: 'इस पृष्ठ पर', te: 'ఈ పేజీలో',
  },
  'Explore More Categories': {
    es: 'Explorar más categorías', fr: 'Explorer plus de catégories', de: 'Weitere Kategorien entdecken', pt: 'Explorar mais categorias', hi: 'और श्रेणियाँ देखें', te: 'మరిన్ని వర్గాలు అన్వేషించండి',
  },
  'Production notes': {
    es: 'Notas de producción', fr: 'Notes de production', de: 'Produktionsnotizen', pt: 'Notas de produção', hi: 'प्रोडक्शन नोट्स', te: 'ప్రొడక్షన్ నోట్స్',
  },
  'Theory & Concepts': {
    es: 'Teoría y conceptos', fr: 'Théorie et concepts', de: 'Theorie & Konzepte', pt: 'Teoria e conceitos', hi: 'सिद्धांत और अवधारणाएँ', te: 'సిద్ధాంతం & భావనలు',
  },
  'Key Concepts': {
    es: 'Conceptos clave', fr: 'Concepts clés', de: 'Kernkonzepte', pt: 'Conceitos-chave', hi: 'मुख्य अवधारणाएँ', te: 'కీ భావనలు',
  },
  'Use Cases': {
    es: 'Casos de uso', fr: 'Cas d’usage', de: 'Anwendungsfälle', pt: 'Casos de uso', hi: 'उपयोग के मामले', te: 'ఉపయోగ సందర్భాలు',
  },
  'Best Practices': {
    es: 'Mejores prácticas', fr: 'Bonnes pratiques', de: 'Bewährte Vorgehensweisen', pt: 'Boas práticas', hi: 'सर्वोत्तम अभ्यास', te: 'ఉత్తమ పద్ధతులు',
  },
  'Common Errors & Fixes': {
    es: 'Errores comunes y soluciones', fr: 'Erreurs courantes et correctifs', de: 'Häufige Fehler & Fixes', pt: 'Erros comuns e correções', hi: 'सामान्य त्रुटियाँ और समाधान', te: 'సాధారణ లోపాలు & పరిష్కారాలు',
  },
  'Prerequisites': {
    es: 'Requisitos previos', fr: 'Prérequis', de: 'Voraussetzungen', pt: 'Pré-requisitos', hi: 'पूर्वापेक्षाएँ', te: 'ముందస్తు అవసరాలు',
  },
  'Scenarios & use cases': {
    es: 'Escenarios y casos de uso', fr: 'Scénarios et cas d’usage', de: 'Szenarien & Anwendungsfälle', pt: 'Cenários e casos de uso', hi: 'परिदृश्य और उपयोग के मामले', te: 'దృశ్యాలు & ఉపయోగ సందర్భాలు',
  },
  'Production scope': {
    es: 'Alcance de producción', fr: 'Portée de production', de: 'Produktionsumfang', pt: 'Escopo de produção', hi: 'प्रोडक्शन दायरा', te: 'ప్రొడక్షన్ పరిధి',
  },
  'Continue learning': {
    es: 'Seguir aprendiendo', fr: 'Continuer l’apprentissage', de: 'Weiter lernen', pt: 'Continuar aprendendo', hi: 'सीखना जारी रखें', te: 'నేర్చుకోవడం కొనసాగించండి',
  },
  'View all topics →': {
    es: 'Ver todos los temas →', fr: 'Voir tous les sujets →', de: 'Alle Themen anzeigen →', pt: 'Ver todos os tópicos →', hi: 'सभी विषय देखें →', te: 'అన్ని టాపిక్లను చూడండి →',
  },
  'Blog & Deep Dives': {
    es: 'Blog y análisis a fondo', fr: 'Blog et analyses approfondies', de: 'Blog & Deep Dives', pt: 'Blog e análises aprofundadas', hi: 'ब्लॉग और डीप डाइव्स', te: 'బ్లాగ్ & డీప్ డైవ్స్',
  },
  'More articles →': {
    es: 'Más artículos →', fr: 'Plus d’articles →', de: 'Weitere Artikel →', pt: 'Mais artigos →', hi: 'और लेख →', te: 'మరిన్ని కథనాలు →',
  },
  'Overview': {
    es: 'Resumen', fr: 'Aperçu', de: 'Übersicht', pt: 'Visão geral', hi: 'अवलोकन', te: 'అవలోకనం',
  },
  'Structure': {
    es: 'Estructura', fr: 'Structure', de: 'Struktur', pt: 'Estrutura', hi: 'संरचना', te: 'నిర్మాణం',
  },
  'Architecture': {
    es: 'Arquitectura', fr: 'Architecture', de: 'Architektur', pt: 'Arquitetura', hi: 'वास्तुकला', te: 'ఆర్కిటెక్చర్',
  },
  'Design Patterns': {
    es: 'Patrones de diseño', fr: 'Modèles de conception', de: 'Entwurfsmuster', pt: 'Padrões de design', hi: 'डिज़ाइन पैटर्न', te: 'డిజైన్ ప్యాటర్న్లు',
  },
  'Code': {
    es: 'Código', fr: 'Code', de: 'Code', pt: 'Código', hi: 'कोड', te: 'కోడ్',
  },
  'Ideas': {
    es: 'Ideas', fr: 'Idées', de: 'Ideen', pt: 'Ideias', hi: 'विचार', te: 'ఆలోచనలు',
  },
  'Source Code': {
    es: 'Código fuente', fr: 'Code source', de: 'Quellcode', pt: 'Código-fonte', hi: 'स्रोत कोड', te: 'సోర్స్ కోడ్',
  },
  'Diagrams': {
    es: 'Diagramas', fr: 'Diagrammes', de: 'Diagramme', pt: 'Diagramas', hi: 'आरेख', te: 'రేఖాచిత్రాలు',
  },
  'Generate AI Project': {
    es: 'Generar proyecto de IA', fr: 'Générer un projet IA', de: 'KI-Projekt generieren', pt: 'Gerar projeto de IA', hi: 'AI प्रोजेक्ट बनाएँ', te: 'AI ప్రాజెక్ట్ రూపొందించండి',
  },
  'Layer View': {
    es: 'Vista por capas', fr: 'Vue par couches', de: 'Ebenenansicht', pt: 'Visão em camadas', hi: 'लेयर दृश्य', te: 'లేయర్ వీక్షణ',
  },
  'Flow View': {
    es: 'Vista de flujo', fr: 'Vue de flux', de: 'Flussansicht', pt: 'Visão de fluxo', hi: 'फ्लो दृश्य', te: 'ఫ్లో వీక్షణ',
  },
  'Mermaid': {
    es: 'Mermaid', fr: 'Mermaid', de: 'Mermaid', pt: 'Mermaid', hi: 'मरमेड', te: 'మెర్మైడ్',
  },
  'Source Files': {
    es: 'Archivos fuente', fr: 'Fichiers sources', de: 'Quelldateien', pt: 'Arquivos-fonte', hi: 'स्रोत फ़ाइलें', te: 'సోర్స్ ఫైళ్ళు',
  },
  'Data Flows': {
    es: 'Flujos de datos', fr: 'Flux de données', de: 'Datenflüsse', pt: 'Fluxos de dados', hi: 'डेटा फ़्लो', te: 'డేటా ఫ్లోలు',
  },
  'Market demand': {
    es: 'Demanda del mercado', fr: 'Demande du marché', de: 'Marktnachfrage', pt: 'Demanda de mercado', hi: 'बाज़ार मांग', te: 'మార్కెట్ డిమాండ్',
  },
  'Languages': {
    es: 'Idiomas', fr: 'Langues', de: 'Sprachen', pt: 'Idiomas', hi: 'भाषाएँ', te: 'భాషలు',
  },
  'Tutorial Not Found': {
    es: 'Tutorial no encontrado', fr: 'Tutoriel introuvable', de: 'Tutorial nicht gefunden', pt: 'Tutorial não encontrado', hi: 'ट्यूटोरियल नहीं मिला', te: 'ట్యుటోరియల్ కనుగొనబడలేదు',
  },
  'Chapter not found': {
    es: 'Capítulo no encontrado', fr: 'Chapitre introuvable', de: 'Kapitel nicht gefunden', pt: 'Capítulo não encontrado', hi: 'अध्याय नहीं मिला', te: 'అధ్యాయం కనుగొనబడలేదు',
  },
  'Loading chapter…': {
    es: 'Cargando capítulo…', fr: 'Chargement du chapitre…', de: 'Kapitel wird geladen…', pt: 'Carregando capítulo…', hi: 'अध्याय लोड हो रहा है…', te: 'అధ్యాయం లోడ్ అవుతోంది…',
  },
  'Loading deep dive…': {
    es: 'Cargando análisis…', fr: 'Chargement de l’analyse…', de: 'Deep Dive wird geladen…', pt: 'Carregando análise…', hi: 'डीप डाइव लोड हो रहा है…', te: 'డీప్ డైవ్ లోడ్ అవుతోంది…',
  },
  'Deep dive not found': {
    es: 'Análisis no encontrado', fr: 'Analyse introuvable', de: 'Deep Dive nicht gefunden', pt: 'Análise não encontrada', hi: 'डीप डाइव नहीं मिला', te: 'డీప్ డైవ్ కనుగొనబడలేదు',
  },
  'Concept Not Found': {
    es: 'Concepto no encontrado', fr: 'Concept introuvable', de: 'Konzept nicht gefunden', pt: 'Conceito não encontrado', hi: 'अवधारणा नहीं मिली', te: 'భావన కనుగొనబడలేదు',
  },
  'Open original': {
    es: 'Abrir original', fr: 'Ouvrir l’original', de: 'Original öffnen', pt: 'Abrir original', hi: 'मूल खोलें', te: 'అసలైనది తెరవండి',
  },
  'delphitools': {
    es: 'herramientas_delphi', fr: 'outils_delphi', de: 'delphiwerkzeuge', pt: 'ferramentas_delphi', hi: 'डेल्फ़ी_टूल्स', te: 'డెల్ఫీ_సాధనాలు',
  },
  'All Client-Side': {
    es: 'Todo en el lado del cliente', fr: '100 % côté client', de: 'Alles clientseitig', pt: 'Todo no lado do cliente', hi: 'पूरी तरह क्लाइंट-साइड', te: 'పూర్తిగా క్లయింట్-సైడ్',
  },
  'No Data Collection': {
    es: 'Sin recopilación de datos', fr: 'Aucune collecte de données', de: 'Keine Datenerfassung', pt: 'Sem coleta de dados', hi: 'कोई डेटा संग्रह नहीं', te: 'డేటా సేకరణ లేదు',
  },
  'iOS App Available': {
    es: 'App iOS disponible', fr: 'App iOS disponible', de: 'iOS-App verfügbar', pt: 'App iOS disponível', hi: 'iOS ऐप उपलब्ध', te: 'iOS యాప్ అందుబాటులో ఉంది',
  },
  'Open Source': {
    es: 'Código abierto', fr: 'Open source', de: 'Open Source', pt: 'Código aberto', hi: 'ओपन सोर्स', te: 'ఓపెన్ సోర్స్',
  },
}

export function translate(key, langCode) {
  const norm = resolveLanguage(langCode)
  const pick = (k) => {
    const e = STRINGS[k]
    if (!e) return ''
    return e[norm] || e[norm.split('-')[0]] || ''
  }
  let out = pick(key)
  if (out) return out
  const clean = String(key)
    .replace(/^&larr;\s*/i, '← ')
    .replace(/^[←↩↗➜]+[\s]*/, '')
    .replace(/^[^\p{L}\p{N}@0-9\\u.{}/-]*/u, '')
    .trim()
  out = pick(clean)
  if (out) return out
  out = pick(clean.replace(/[…]+$/, ''))
  return out || key
}

const I18N_CONTEXT = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem(LS_KEY) || 'auto' } catch { return 'auto' }
  })

  const setLang = (code) => {
    setLangState(code)
    try { localStorage.setItem(LS_KEY, code) } catch { /* private mode */ }
  }

  // "auto" resolves via the country persisted by the Video Hub prefs, so the
  // whole app follows the selected market's language.
  const resolved = useMemo(() => {
    let cc = 'global'
    try { cc = (JSON.parse(localStorage.getItem('vh-prefs-v1')) || {}).country || 'global' } catch { /* ignore */ }
    return resolveLanguage(lang, cc)
  }, [lang])

  useEffect(() => {
    const meta = LANG_BY_CODE[resolved.toLowerCase()]
    document.documentElement.lang = resolved
    document.documentElement.dir = meta?.rtl ? 'rtl' : 'ltr'
  }, [resolved])

  const value = useMemo(() => ({
    lang,
    resolved,
    setLang,
    t: (key) => translate(key, resolved),
  }), [lang, resolved])

  return <I18N_CONTEXT.Provider value={value}>{children}</I18N_CONTEXT.Provider>
}

export function useLang() {
  const ctx = useContext(I18N_CONTEXT)
  if (!ctx) return { lang: 'auto', resolved: 'en', setLang: () => {}, t: (k) => k }
  return ctx
}
