#!/usr/bin/env python3
"""
Generate 50K-100K books across 131+ categories for the Books Library page.

Usage: python _books_py/generate_massive.py
Output: frontend/src/data/booksData.js
"""

import random
import json
import math
import os
import sys
import hashlib

random.seed(42)  # reproducible

# ---------------------------------------------------------------------------
# 131+ categories  (31 existing + 100 new)
# ---------------------------------------------------------------------------
NEW_CATEGORIES = [
    # === EXISTING (keep original keys) ===
    {"key": "growth", "name": "Personal Growth & Mindset", "icon": "🌱", "color": "#22c55e", "desc": "Self-improvement, mindset & becoming your best self"},
    {"key": "money", "name": "Money Making & Wealth", "icon": "💰", "color": "#f59e0b", "desc": "Wealth building, side hustles, financial freedom & passive income"},
    {"key": "finance", "name": "Finance & Investing", "icon": "📈", "color": "#10b981", "desc": "Stock markets, index funds, retirement & personal finance"},
    {"key": "business", "name": "Business & Entrepreneurship", "icon": "🚀", "color": "#8b5cf6", "desc": "Startups, strategy, business models & scaling"},
    {"key": "psychology", "name": "Psychology & Mindset", "icon": "🧠", "color": "#ec4899", "desc": "Behavioural science, decisions, mental models & motivation"},
    {"key": "habits", "name": "Habits & Productivity", "icon": "⏱️", "color": "#3b82f6", "desc": "Habit formation, focus, time management & deep work"},
    {"key": "leadership", "name": "Leadership & Management", "icon": "👑", "color": "#f97316", "desc": "Leading teams, culture, execution & management skills"},
    {"key": "sales", "name": "Sales & Marketing", "icon": "📣", "color": "#ef4444", "desc": "Closing, persuasion, funnels, branding & digital marketing"},
    {"key": "communication", "name": "Communication & Influence", "icon": "💬", "color": "#06b6d4", "desc": "Public speaking, storytelling, listening & networking"},
    {"key": "health", "name": "Health & Wellness", "icon": "💪", "color": "#84cc16", "desc": "Sleep, nutrition, fitness, mental health & longevity"},
    {"key": "career", "name": "Career & Success", "icon": "🏆", "color": "#a855f7", "desc": "Career planning, personal branding, skills & workplace success"},
    {"key": "relationships", "name": "Relationships & Life Skills", "icon": "❤️", "color": "#f43f5e", "desc": "Boundaries, connection, communication & emotional skills"},
    {"key": "philosophy", "name": "Philosophy & Spirituality", "icon": "🕊️", "color": "#6366f1", "desc": "Stoicism, meaning, mindfulness & timeless wisdom"},
    {"key": "tech", "name": "Technology & AI", "icon": "🤖", "color": "#0ea5e9", "desc": "AI, ML, programming, systems & the digital future"},
    {"key": "fiction", "name": "Classic Fiction & Literature", "icon": "📖", "color": "#d946ef", "desc": "The greatest novels & star-rated literature"},
    {"key": "biography", "name": "Biography & Memoir", "icon": "👤", "color": "#14b8a6", "desc": "Life stories of legends, visionaries & everyday heroes"},
    {"key": "history", "name": "History & Society", "icon": "🏛️", "color": "#eab308", "desc": "Civilisations, empires, ideas & how society changed"},
    {"key": "science", "name": "Science & Nature", "icon": "🔬", "color": "#2dd4bf", "desc": "Cosmos, evolution, the human body & how things work"},
    {"key": "creativity", "name": "Creativity & Art", "icon": "🎨", "color": "#fb7185", "desc": "The creative process, writing, art & innovation"},
    {"key": "learning", "name": "Kids, Learning & Education", "icon": "🎓", "color": "#38bdf8", "desc": "Learning how to learn, study skills & great reads for all ages"},
    {"key": "mystery", "name": "Mystery & Thriller", "icon": "🔍", "color": "#e11d48", "desc": "Whodunits, crime, suspense & page-turning thrillers"},
    {"key": "scifi", "name": "Sci-Fi & Fantasy", "icon": "🚀", "color": "#7c3aed", "desc": "Space, dystopias, magic & worlds beyond imagination"},
    {"key": "romance", "name": "Romance & Love", "icon": "🌹", "color": "#db2777", "desc": "Timeless love stories & modern romance"},
    {"key": "food", "name": "Food & Cooking", "icon": "🍳", "color": "#ea580c", "desc": "Cooking techniques, food science & delicious reading"},
    {"key": "travel", "name": "Travel & Adventure", "icon": "✈️", "color": "#0891b2", "desc": "Journeys, exploration & the wide world beyond home"},
    {"key": "poetry", "name": "Poetry & Verse", "icon": "🪶", "color": "#a21caf", "desc": "Classic and modern poetry that moves the heart"},
    {"key": "sports", "name": "Sports & Competition", "icon": "🏃", "color": "#16a34a", "desc": "Athletes, teams, underdogs & the pursuit of greatness"},
    {"key": "parenting", "name": "Parenting & Family", "icon": "👨‍👩‍👧", "color": "#4338ca", "desc": "Raising kids, family life & connected homes"},
    {"key": "music", "name": "Music & Arts", "icon": "🎵", "color": "#be185d", "desc": "Musicians, performance & the creative arts"},
    {"key": "horror", "name": "Horror & Dark Fiction", "icon": "👻", "color": "#b91c1c", "desc": "Classic and modern tales that thrill & unsettle"},
    # === 100 NEW CATEGORIES ===
    {"key": "ai_ml", "name": "Artificial Intelligence & Machine Learning", "icon": "🤖", "color": "#7c3aed", "desc": "Deep learning, neural networks, NLP, computer vision & AI systems"},
    {"key": "data_science", "name": "Data Science & Analytics", "icon": "📊", "color": "#3b82f6", "desc": "Statistics, data visualization, analytics & data-driven decisions"},
    {"key": "cybersecurity", "name": "Cybersecurity & Privacy", "icon": "🔒", "color": "#ef4444", "desc": "Hacking, encryption, digital forensics & security architecture"},
    {"key": "cloud_computing", "name": "Cloud Computing & DevOps", "icon": "☁️", "color": "#0ea5e9", "desc": "AWS, Azure, GCP, containers, CI/CD & infrastructure as code"},
    {"key": "blockchain", "name": "Blockchain & Web3", "icon": "⛓️", "color": "#f59e0b", "desc": "Cryptocurrency, DeFi, smart contracts, DAOs & decentralization"},
    {"key": "quantum", "name": "Quantum Computing", "icon": "⚛️", "color": "#8b5cf6", "desc": "Qubits, algorithms, quantum supremacy & the future of compute"},
    {"key": "robotics", "name": "Robotics & Automation", "icon": "🦾", "color": "#6366f1", "desc": "Industrial robots, cobots, autonomous systems & human-robot interaction"},
    {"key": "biotech", "name": "Biotechnology & Genetics", "icon": "🧬", "color": "#10b981", "desc": "CRISPR, gene therapy, synthetic biology & bioinformatics"},
    {"key": "space", "name": "Space Exploration & Astronomy", "icon": "🌌", "color": "#1e3a5f", "desc": "Rocketry, exoplanets, astrophysics & the quest for the cosmos"},
    {"key": "climate", "name": "Climate Change & Sustainability", "icon": "🌍", "color": "#22c55e", "desc": "Carbon capture, renewable energy, ESG & environmental policy"},
    {"key": "renewable_energy", "name": "Renewable Energy & Green Tech", "icon": "⚡", "color": "#eab308", "desc": "Solar, wind, battery storage, hydrogen & clean energy transitions"},
    {"key": "neuroscience", "name": "Neuroscience & Brain Science", "icon": "🧩", "color": "#ec4899", "desc": "Brain mapping, cognition, neuroplasticity & consciousness"},
    {"key": "economics", "name": "Economics & Economic Theory", "icon": "💹", "color": "#14b8a6", "desc": "Micro/macroeconomics, game theory, behavioral econ & policy"},
    {"key": "law", "name": "Law & Legal Studies", "icon": "⚖️", "color": "#78716c", "desc": "Constitutional law, intellectual property, contracts & justice"},
    {"key": "medicine", "name": "Medicine & Public Health", "icon": "🏥", "color": "#ef4444", "desc": "Clinical practice, epidemiology, pharmacology & global health"},
    {"key": "nutrition", "name": "Nutrition & Diet Science", "icon": "🥗", "color": "#84cc16", "desc": "Macronutrients, gut health, diets, food science & meal planning"},
    {"key": "fitness", "name": "Fitness & Exercise Science", "icon": "🏋️", "color": "#f97316", "desc": "Strength training, cardio, HIIT, recovery & athletic performance"},
    {"key": "mental_health", "name": "Mental Health & Therapy", "icon": "🧘", "color": "#06b6d4", "desc": "Anxiety, depression, CBT, mindfulness & emotional resilience"},
    {"key": "meditation", "name": "Meditation & Mindfulness", "icon": "🕉️", "color": "#a78bfa", "desc": "Sitting practice, breathwork, presence & contemplative living"},
    {"key": "design", "name": "Design & UX/UI", "icon": "✏️", "color": "#f472b6", "desc": "User experience, visual design, design thinking & typography"},
    {"key": "architecture", "name": "Architecture & Urban Planning", "icon": "🏗️", "color": "#a8a29e", "desc": "Buildings, cities, sustainability, spatial design & urbanism"},
    {"key": "photography", "name": "Photography & Visual Arts", "icon": "📸", "color": "#d946ef", "desc": "Digital photography, composition, editing & visual storytelling"},
    {"key": "film", "name": "Film & Cinema Studies", "icon": "🎬", "color": "#e11d48", "desc": "Directing, screenwriting, film theory & movie history"},
    {"key": "writing", "name": "Writing & Authorship", "icon": "✍️", "color": "#7c3aed", "desc": "Fiction craft, nonfiction, publishing, editing & the writing life"},
    {"key": "journalism", "name": "Journalism & Media", "icon": "📰", "color": "#64748b", "desc": "Investigative reporting, news writing, media ethics & digital journalism"},
    {"key": "philosophy_mind", "name": "Philosophy of Mind", "icon": "💭", "color": "#8b5cf6", "desc": "Consciousness, identity, free will, AI sentience & mental causation"},
    {"key": "ethics", "name": "Ethics & Moral Philosophy", "icon": "📜", "color": "#a78bfa", "desc": "Utilitarianism, deontology, virtue ethics & applied ethics"},
    {"key": "politics", "name": "Political Science & Governance", "icon": "🏛️", "color": "#dc2626", "desc": "Democracy, international relations, public policy & political theory"},
    {"key": "sociology", "name": "Sociology & Social Theory", "icon": "👥", "color": "#0891b2", "desc": "Culture, institutions, inequality, social movements & demography"},
    {"key": "anthropology", "name": "Anthropology & Cultural Studies", "icon": "🌍", "color": "#ca8a04", "desc": "Human cultures, rituals, kinship, language & ethnography"},
    {"key": "linguistics", "name": "Linguistics & Language", "icon": "🗣️", "color": "#2563eb", "desc": "Phonetics, syntax, semantics, sociolinguistics & language learning"},
    {"key": "archaeology", "name": "Archaeology & Ancient Civilizations", "icon": "🏺", "color": "#b45309", "desc": "Excavation, artifacts, ancient empires & prehistoric cultures"},
    {"key": "geology", "name": "Geology & Earth Sciences", "icon": "🪨", "color": "#78716c", "desc": "Rocks, minerals, plate tectonics, volcanology & paleontology"},
    {"key": "oceanography", "name": "Oceanography & Marine Science", "icon": "🌊", "color": "#0284c7", "desc": "Deep sea, marine biology, currents, coral reefs & ocean conservation"},
    {"key": "astronomy", "name": "Astronomy & Cosmology", "icon": "🔭", "color": "#1e1b4b", "desc": "Stars, galaxies, black holes, dark matter & the origin of the universe"},
    {"key": "ecology", "name": "Ecology & Conservation", "icon": "🌿", "color": "#16a34a", "desc": "Ecosystems, biodiversity, endangered species & environmental stewardship"},
    {"key": "evolution", "name": "Evolution & Darwinism", "icon": "🦎", "color": "#65a30d", "desc": "Natural selection, adaptation, speciation & the tree of life"},
    {"key": "math", "name": "Mathematics & Logic", "icon": "🔢", "color": "#4f46e5", "desc": "Algebra, calculus, topology, number theory & mathematical beauty"},
    {"key": "physics", "name": "Physics & Theoretical Physics", "icon": "⚛️", "color": "#0369a1", "desc": "Relativity, quantum mechanics, string theory & fundamental forces"},
    {"key": "chemistry", "name": "Chemistry & Materials Science", "icon": "⚗️", "color": "#059669", "desc": "Organic, inorganic, physical chemistry, polymers & nanomaterials"},
    {"key": "engineering", "name": "Engineering & Applied Science", "icon": "⚙️", "color": "#6b7280", "desc": "Mechanical, electrical, civil & systems engineering"},
    {"key": "automotive", "name": "Automotive & Vehicle Technology", "icon": "🚗", "color": "#dc2626", "desc": "Car design, EVs, autonomous driving, motorsport & automotive history"},
    {"key": "aviation", "name": "Aviation & Aerospace", "icon": "🛩️", "color": "#2563eb", "desc": "Flight, aircraft design, commercial aviation & spaceflight"},
    {"key": "military", "name": "Military Strategy & History", "icon": "🎖️", "color": "#374151", "desc": "Warfare, tactics, military leaders & the history of conflict"},
    {"key": "diy", "name": "DIY & Home Improvement", "icon": "🔨", "color": "#f97316", "desc": "Woodworking, plumbing, electrical, home repair & maker projects"},
    {"key": "gardening", "name": "Gardening & Horticulture", "icon": "🌻", "color": "#16a34a", "desc": "Vegetable gardens, landscaping, permaculture & plant care"},
    {"key": "pets", "name": "Pets & Animal Care", "icon": "🐕", "color": "#eab308", "desc": "Dog training, cat behavior, veterinary care & animal welfare"},
    {"key": "crafts", "name": "Crafts & Hobbies", "icon": "🧵", "color": "#db2777", "desc": "Knitting, sewing, scrapbooking, pottery & handmade crafts"},
    {"key": "collecting", "name": "Collecting & Antiques", "icon": "🏺", "color": "#a16207", "desc": "Coins, stamps, art, vintage items & collecting strategies"},
    {"key": "gardening_organic", "name": "Organic Gardening & Permaculture", "icon": "🌱", "color": "#22c55e", "desc": "No-dig gardening, companion planting, soil health & food forests"},
    {"key": "fermentation", "name": "Fermentation & Preserving", "icon": "🫙", "color": "#ca8a04", "desc": "Kimchi, kombucha, canning, pickling & preserving the harvest"},
    {"key": "cycling", "name": "Cycling & Bike Culture", "icon": "🚴", "color": "#16a34a", "desc": "Road cycling, mountain biking, bike touring & bicycle maintenance"},
    {"key": "hiking", "name": "Hiking & Outdoor Skills", "icon": "🥾", "color": "#854d0e", "desc": "Trail guides, bushcraft, navigation & wilderness survival"},
    {"key": "camping", "name": "Camping & Outdoor Recreation", "icon": "⛺", "color": "#15803d", "desc": "Tent camping, backpacking, camp cooking & outdoor gear"},
    {"key": "fishing", "name": "Fishing & Angling", "icon": "🎣", "color": "#0369a1", "desc": "Freshwater, saltwater, fly fishing & fish biology"},
    {"key": "hunting", "name": "Hunting & Wildlife Management", "icon": "🦌", "color": "#713f12", "desc": "Ethical hunting, game management, tracking & wildlife ecology"},
    {"key": "survival", "name": "Survival & Preparedness", "icon": "🔥", "color": "#dc2626", "desc": "Bug-out bags, water purification, shelter building & emergency readiness"},
    {"key": "astronomy_observing", "name": "Amateur Astronomy & Stargazing", "icon": "⭐", "color": "#1e1b4b", "desc": "Telescope guides, star charts, astrophotography & night sky tours"},
    {"key": "birds", "name": "Birdwatching & Ornithology", "icon": "🐦", "color": "#0ea5e9", "desc": "Bird identification, habitats, migration & birding hotspots"},
    {"key": "insects", "name": "Entomology & Insect Science", "icon": "🦋", "color": "#a855f7", "desc": "Butterflies, beetles, bees, insect ecology & citizen science"},
    {"key": "mycology", "name": "Mycology & Mushroom Foraging", "icon": "🍄", "color": "#92400e", "desc": "Fungal biology, mushroom identification, cultivation & foraging"},
    {"key": "astronautics", "name": "Astronautics & Space Travel", "icon": "🚀", "color": "#1d4ed8", "desc": "Space stations, Mars missions, space tourism & astronaut training"},
    {"key": "environmentalism", "name": "Environmentalism & Activism", "icon": "♻️", "color": "#16a34a", "desc": "Zero waste, environmental justice, activism & ecological ethics"},
    {"key": "urbanism", "name": "Urban Studies & Smart Cities", "icon": "🏙️", "color": "#475569", "desc": "Urban planning, smart infrastructure, transit & liveable cities"},
    {"key": "food_writing", "name": "Food Writing & Culinary Memoir", "icon": "📝", "color": "#ea580c", "desc": "Restaurant reviews, chef memoirs, food culture & culinary essays"},
    {"key": "baking", "name": "Baking & Pastry Arts", "icon": "🧁", "color": "#e879f9", "desc": "Bread, cakes, pastries, sourdough & the science of baking"},
    {"key": "cocktails", "name": "Cocktails & Mixology", "icon": "🍸", "color": "#be123c", "desc": "Classic cocktails, spirits, bar technique & drink culture"},
    {"key": "coffee_tea", "name": "Coffee & Tea Culture", "icon": "☕", "color": "#78350f", "desc": "Brewing methods, origins, cupping, tea ceremony & specialty coffee"},
    {"key": "wine", "name": "Wine & Viticulture", "icon": "🍷", "color": "#9f1239", "desc": "Winemaking, terroir, tasting notes, regions & sommelier guides"},
    {"key": "beer", "name": "Beer & Brewing", "icon": "🍺", "color": "#ca8a04", "desc": "Craft beer, homebrewing, styles, breweries & beer science"},
    {"key": "fashion", "name": "Fashion & Textile Design", "icon": "👗", "color": "#db2777", "desc": "Fashion history, sustainable fashion, pattern making & style"},
    {"key": "interior_design", "name": "Interior Design & Décor", "icon": "🏡", "color": "#d97706", "desc": "Room layouts, color theory, furniture, minimalism & home styling"},
    {"key": "minimalism", "name": "Minimalism & Simple Living", "icon": "🪷", "color": "#a78bfa", "desc": "Decluttering, capsule wardrobes, tiny homes & intentional living"},
    {"key": "journaling", "name": "Journaling & Self-Reflection", "icon": "📓", "color": "#6366f1", "desc": "Bullet journals, gratitude journals, prompts & reflective writing"},
    {"key": "stoicism_modern", "name": "Modern Stoicism & Resilience", "icon": "🏛️", "color": "#78716c", "desc": "Practical Stoic exercises, resilience training & equanimity"},
    {"key": "buddhism", "name": "Buddhism & Eastern Philosophy", "icon": "☸️", "color": "#eab308", "desc": "Zen, Tibetan Buddhism, meditation, dharma & the Eightfold Path"},
    {"key": "taoism", "name": "Taoism & Taoist Thought", "icon": "☯️", "color": "#16a34a", "desc": "The Tao Te Ching, wu wei, yin-yang & living in harmony"},
    {"key": "mythology", "name": "Mythology & Folklore", "icon": "🐉", "color": "#b91c1c", "desc": "Greek, Norse, Hindu, African & world mythology & legend"},
    {"key": "occult", "name": "Occult & Esoteric Knowledge", "icon": "🔮", "color": "#581c87", "desc": "Alchemy, hermeticism, tarot, mysticism & hidden traditions"},
    {"key": "astrology", "name": "Astrology & Zodiac", "icon": "♈", "color": "#6d28d9", "desc": "Natal charts, planetary transits, sun signs & astrological practice"},
    {"key": "tarot", "name": "Tarot & Divination", "icon": "🃏", "color": "#4c1d95", "desc": "Tarot readings, oracle decks, numerology & intuitive practice"},
    {"key": "true_crime", "name": "True Crime", "icon": "🕵️", "color": "#991b1b", "desc": "Criminal cases, forensic science, profiling & justice system"},
    {"key": "espionage", "name": "Espionage & Intelligence", "icon": "🕵️", "color": "#374151", "desc": "Spies, CIA, MI6, cold war, tradecraft & intelligence history"},
    {"key": "maritime", "name": "Maritime History & Seafaring", "icon": "🚢", "color": "#0369a1", "desc": "Age of sail, naval battles, shipwrecks & ocean exploration"},
    {"key": "medieval", "name": "Medieval History & Culture", "icon": "⚔️", "color": "#78350f", "desc": "Castles, knights, feudalism, the Black Death & medieval life"},
    {"key": "renaissance", "name": "Renaissance & Reformation", "icon": "🎭", "color": "#92400e", "desc": "Art, science, religion & the rebirth of European civilization"},
    {"key": "world_war", "name": "World Wars & Modern Conflict", "icon": "💣", "color": "#44403c", "desc": "WWI, WWII, the Cold War & modern military history"},
    {"key": "civil_rights", "name": "Civil Rights & Social Justice", "icon": "✊", "color": "#dc2626", "desc": "Movements, leaders, activism & the fight for equality"},
    {"key": "feminism", "name": "Feminism & Gender Studies", "icon": "♀️", "color": "#ec4899", "desc": "Feminist theory, women's history, gender equality & intersectionality"},
    {"key": "lgbtq", "name": "LGBTQ+ Studies & Queer Theory", "icon": "🏳️‍🌈", "color": "#a855f7", "desc": "Queer history, identity, activism & LGBTQ+ literature"},
    {"key": "race_ethnicity", "name": "Race, Ethnicity & Identity", "icon": "🤝", "color": "#0891b2", "desc": "Racial identity, ethnic studies, discrimination & multiculturalism"},
    {"key": "immigration", "name": "Immigration & Diaspora", "icon": "🛳️", "color": "#0ea5e9", "desc": "Migration stories, refugee experiences, assimilation & identity"},
    {"key": "environmental_justice", "name": "Environmental Justice", "icon": "⚖️", "color": "#16a34a", "desc": "Climate equity, environmental racism, indigenous rights & activism"},
    {"key": "labor", "name": "Labor Studies & Workers' Rights", "icon": "🔨", "color": "#dc2626", "desc": "Unions, worker movements, labor law & the future of work"},
    {"key": "intellectual_history", "name": "Intellectual History & Ideas", "icon": "💡", "color": "#7c3aed", "desc": "Great books, schools of thought, intellectual revolutions & debates"},
    {"key": "comparative_religion", "name": "Comparative Religion", "icon": "🕌", "color": "#ca8a04", "desc": "Christianity, Islam, Hinduism, Judaism, Buddhism & interfaith dialogue"},
    {"key": "theology", "name": "Theology & Religious Studies", "icon": "📖", "color": "#1d4ed8", "desc": "Scripture, doctrine, religious history & faith traditions"},
    {"key": "cryptography", "name": "Cryptography & Codes", "icon": "🔐", "color": "#059669", "desc": "Encryption, code-breaking, ciphers & information security"},
    {"key": "information_theory", "name": "Information Theory & Communication", "icon": "📡", "color": "#0284c7", "desc": "Shannon's theory, signal processing, bandwidth & data compression"},
    {"key": "complexity", "name": "Complexity Science & Systems Thinking", "icon": "🕸️", "color": "#7c3aed", "desc": "Chaos theory, emergent behavior, networks & adaptive systems"},
    {"key": "futurism", "name": "Futurism & Trend Forecasting", "icon": "🔮", "color": "#6366f1", "desc": "Future scenarios, megatrends, speculation & long-term thinking"},
    {"key": "seti", "name": "SETI & Extraterrestrial Life", "icon": "👽", "color": "#1e3a5f", "desc": "Search for alien intelligence, Drake equation, exobiology & UFOs"},
    {"key": "encryption", "name": "Encryption & Digital Security", "icon": "🔑", "color": "#059669", "desc": "PGP, TLS, zero-knowledge proofs & privacy-preserving technologies"},
]

# ---------------------------------------------------------------------------
# Author name parts for generating realistic names
# ---------------------------------------------------------------------------
FIRST_NAMES = [
    "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda",
    "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
    "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Lisa", "Daniel", "Nancy",
    "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
    "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
    "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa",
    "Timothy", "Deborah", "Ronald", "Stephanie", "Edward", "Rebecca", "Jason", "Sharon",
    "Jeffrey", "Laura", "Ryan", "Cynthia", "Jacob", "Kathleen", "Gary", "Amy",
    "Nicholas", "Angela", "Eric", "Shirley", "Jonathan", "Anna", "Stephen", "Brenda",
    "Larry", "Pamela", "Justin", "Emma", "Scott", "Nicole", "Brandon", "Helen",
    "Benjamin", "Samantha", "Samuel", "Katherine", "Raymond", "Christine", "Gregory", "Debra",
    "Frank", "Rachel", "Alexander", "Carolyn", "Patrick", "Janet", "Jack", "Catherine",
    "Dennis", "Maria", "Jerry", "Heather", "Tyler", "Diane", "Aaron", "Ruth",
    "Jose", "Julie", "Adam", "Olivia", "Nathan", "Joyce", "Henry", "Virginia",
    "Douglas", "Victoria", "Zachary", "Kelly", "Peter", "Lauren", "Kyle", "Christina",
    "Noah", "Joan", "Ethan", "Evelyn", "Jeremy", "Judith", "Walter", "Megan",
    "Christian", "Andrea", "Keith", "Cheryl", "Roger", "Hannah", "Terry", "Jacqueline",
    "Austin", "Martha", "Sean", "Gloria", "Gerald", "Teresa", "Carl", "Ann",
    "Harold", "Sara", "Dylan", "Madison", "Arthur", "Frances", "Lawrence", "Kathryn",
    "Jordan", "Janice", "Jesse", "Jean", "Bryan", "Abigail", "Billy", "Alice",
    "Bruce", "Judy", "Gabriel", "Sophia", "Joe", "Grace", "Logan", "Denise",
    "Albert", "Amber", "Willie", "Doris", "Alan", "Marilyn", "Eugene", "Danielle",
    "Russell", "Beverly", "Vincent", "Isabella", "Philip", "Theresa", "Bobby", "Diana",
    "Johnny", "Natalie", "Bradley", "Brittany", "Roy", "Charlotte", "Elijah", "Marie",
    "Randy", "Kayla", "Wayne", "Alexis", "Howard", "Lori",
    "Priya", "Raj", "Wei", "Yuki", "Omar", "Fatima", "Chen", "Aisha",
    "Hiroshi", "Ananya", "Ravi", "Mei", "Arun", "Sakura", "Deepak", "Leila",
    "Vikram", "Sofia", "Ibrahim", "Nadia", "Kwame", "Amara", "Ivan", "Yara",
    "Hans", "Zara", "Miguel", "Olga", "Antonio", "Ingrid", "Carlos", "Elena",
    "Fernando", "Camila", "Diego", "Valentina", "Santiago", "Isabella", "Mateo", "Lucia",
    "Andrei", "Anastasia", "Tomas", "Astrid", "Kofi", "Nneka", "Jamal", "Fatou",
    "Tariq", "Halima", "Hassan", "Zainab", "Yusuf", "Amina",
]

LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
    "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
    "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill",
    "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell",
    "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz",
    "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales",
    "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson",
    "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward",
    "Richardson", "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray",
    "Mendoza", "Ruiz", "Hughes", "Price", "Alvarez", "Castillo", "Sanders", "Patel",
    "Myers", "Long", "Ross", "Foster", "Jimenez", "Powell", "Jenkins", "Perry",
    "Russell", "Sullivan", "Bell", "Coleman", "Butler", "Henderson", "Barnes", "Gonzales",
    "Fisher", "Vasquez", "Simmons", "Patterson", "Jordan", "Reynolds", "Hamilton", "Graham",
    "Wallace", "Gibson", "Bryant", "Alexander", "Tucker", "Harvey", "Marshall", "Hunt",
    "Freeman", "Webb", "Burns", "Spencer", "Wagner", "Berry", "Barnes", "Thornton",
    "Lawrence", "West", "Chapman", "Hart", "Webster", "Schmidt", "Cunningham", "Mason",
    "Hawkins", "Webber", "Lane", "Wells", "Chen", "Patel", "Singh", "Kumar",
    "Shah", "Das", "Mehta", "Joshi", "Chowdhury", "Banerjee", "Mukherjee", "Sen",
    "Mitra", "Ghosh", "Nair", "Pillai", "Menon", "Reddy", "Iyer", "Krishnamurthy",
    "Wang", "Li", "Zhang", "Liu", "Yang", "Huang", "Wu", "Zhou",
    "Tanaka", "Sato", "Suzuki", "Takahashi", "Watanabe", "Itō", "Yamamoto", "Nakamura",
    "Kim", "Park", "Choi", "Jung", "Kang", "Cho", "Yun", "Lim",
    "Müller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker",
    "Santos", "Silva", "Ferreira", "Oliveira", "Souza", "Costa", "Pereira", "Ribeiro",
    "Rossi", "Russo", "Romano", "Colombo", "Ferrari", "Esposito", "Bianchi", "Ricci",
    "Dubois", "Moreau", "Laurent", "Simon", "Michel", "Lefevre", "Bertrand", "Rousseau",
    "Petrov", "Ivanov", "Smirnov", "Popov", "Volkov", "Novikov", "Morozov", "Sokolov",
]

# ---------------------------------------------------------------------------
# Title-building components for each category
# ---------------------------------------------------------------------------
TOPIC_WORDS = {
    # Map each category key -> list of topic nouns that go into titles
    "ai_ml": ["Deep Learning", "Neural Networks", "Natural Language Processing", "Computer Vision", "Reinforcement Learning", "Transformers", "Large Language Models", "Generative AI", "AI Ethics", "Machine Learning Operations", "AutoML", "Graph Neural Networks", "Federated Learning", "AI Agents", "Prompt Engineering", "RAG Systems", "Multimodal AI", "AI Safety", "AI Alignment", "Transfer Learning", "Few-Shot Learning", "AI Infrastructure", "Edge AI", "AI Governance", "Foundation Models", "Diffusion Models", "Vector Databases", "AI Agents", "Cognitive Architecture", "Embodied AI"],
    "data_science": ["Data Pipelines", "Statistical Modeling", "A/B Testing", "Data Visualization", "Feature Engineering", "Time Series Analysis", "Bayesian Statistics", "Causal Inference", "Data Storytelling", "ETL Processes", "Data Governance", "Predictive Analytics", "Prescriptive Analytics", "Big Data", "Data Mesh", "Data Lakes", "Real-Time Analytics", "Data Quality", "Geospatial Analysis", "Text Mining", "Sentiment Analysis", "Recommendation Systems", "Survival Analysis", "Dimensionality Reduction", "Anomaly Detection"],
    "cybersecurity": ["Penetration Testing", "Zero Trust Architecture", "Incident Response", "Threat Intelligence", "Digital Forensics", "Malware Analysis", "Network Security", "Cloud Security", "Application Security", "Identity Management", "Security Operations", "Vulnerability Assessment", "Red Team Operations", "Social Engineering", "Cryptography", "Compliance", "Risk Management", "Security Automation", "Bug Bounty", "Endpoint Protection"],
    "cloud_computing": ["Kubernetes", "Serverless Computing", "Microservices", "Infrastructure as Code", "Service Mesh", "Observability", "Platform Engineering", "GitOps", "Container Orchestration", "Cloud Native", "Edge Computing", "Multi-Cloud Strategy", "Cloud Migration", "FinOps", "SRE Practices", "Chaos Engineering", "API Gateway", "Event-Driven Architecture", "Zero Downtime Deployment", "Cost Optimization"],
    "blockchain": ["Smart Contracts", "DeFi Protocols", "NFTs", "DAOs", "Layer 2 Solutions", "Cross-Chain Bridges", "Tokenomics", "Consensus Mechanisms", "Zero-Knowledge Proofs", "Decentralized Identity", "Blockchain Scalability", "Security Auditing", "MEV", "Liquid Staking", "Real World Assets", "Decentralized Storage", "Blockchain Governance", "Token Standards", "Flash Loans", "On-Chain Analytics"],
    "quantum": ["Quantum Algorithms", "Quantum Error Correction", "Quantum Supremacy", "Topological Qubits", "Quantum Cryptography", "Quantum Simulation", "Variational Algorithms", "Quantum Machine Learning", "Quantum Networking", "Quantum Sensing", "Quantum Computing Hardware", "Quantum Programming", "Quantum Annealing", "NISQ Algorithms", "Quantum Advantage"],
    "robotics": ["Autonomous Navigation", "Robot Perception", "Human-Robot Interaction", "Swarm Robotics", "Soft Robotics", "Industrial Automation", "Robotic Manipulation", "Motion Planning", "SLAM", "Computer Vision for Robots", "Robot Learning", "Legged Locomotion", "Aerial Robotics", "Marine Robotics", "Surgical Robotics"],
    "biotech": ["CRISPR", "Gene Therapy", "Synthetic Biology", "Bioinformatics", "Protein Engineering", "Stem Cells", "CAR-T Therapy", "Microbiome", "Genome Editing", "Bioprinting", "mRNA Technology", "Biosensors", "Drug Discovery", "Pharmacogenomics", "Biomanufacturing"],
    "space": ["Orbital Mechanics", "Rocket Propulsion", "Mars Colonization", "Exoplanet Discovery", "Space Telescopes", "Astrophotography", "Cosmic Radiation", "Dark Matter", "Dark Energy", "Gravitational Waves", "Space Mining", "Orbital Habitats", "Lunar Exploration", "Solar Sails", "Interstellar Travel"],
    "climate": ["Carbon Capture", "Climate Modeling", "Renewable Transitions", "Climate Policy", "Ocean Acidification", "Deforestation", "Climate Justice", "Green Finance", "Adaptation Strategies", "Climate Migration", "Biodiversity Loss", "Circular Economy", "Green Buildings", "Sustainable Agriculture", "Carbon Offsets"],
    "renewable_energy": ["Solar Power", "Wind Energy", "Battery Storage", "Hydrogen Economy", "Geothermal Energy", "Tidal Power", "Grid Modernization", "Energy Storage", "Distributed Energy", "Microgrids", "Power Electronics", "Energy Efficiency", "Smart Grids", "Green Hydrogen", "Energy Transition"],
    "neuroscience": ["Neuroplasticity", "Consciousness", "Brain-Computer Interface", "Neurodegenerative Diseases", "Memory Formation", "Cognitive Neuroscience", "Optogenetics", "Connectome", "Neuromorphic Computing", "Neuroethics", "Brain Imaging", "Synaptic Plasticity", "Neural Circuits", "Dream Science", "Neurofeedback"],
    "economics": ["Behavioral Economics", "Game Theory", "Macroeconomic Policy", "Development Economics", "International Trade", "Labor Economics", "Public Economics", "Monetary Policy", "Fiscal Policy", "Inequality", "Innovation Economics", "Platform Economics", "Auction Theory", "Mechanism Design", "Industrial Organization"],
    "law": ["Constitutional Law", "Criminal Law", "Contract Law", "Tort Law", "International Law", "Intellectual Property", "Corporate Law", "Environmental Law", "Human Rights Law", "Cyber Law", "Tax Law", "Employment Law", "Family Law", "Immigration Law", "Competition Law"],
    "medicine": ["Clinical Trials", "Epidemiology", "Immunology", "Oncology", "Cardiology", "Neurology", "Pediatrics", "Surgery", "Radiology", "Genomic Medicine", "Precision Medicine", "Telemedicine", "Medical Ethics", "Global Health", "Infectious Disease"],
    "nutrition": ["Macronutrients", "Micronutrients", "Gut Health", "Keto Diet", "Mediterranean Diet", "Plant-Based Nutrition", "Sports Nutrition", "Clinical Nutrition", "Food Allergies", "Metabolic Health", "Intermittent Fasting", "Nutritional Psychiatry", "Pediatric Nutrition", "Geriatric Nutrition", "Supplements"],
    "fitness": ["Strength Training", "HIIT", "Yoga", "Pilates", "Calisthenics", "CrossFit", "Olympic Lifting", "Mobility", "Recovery", "Endurance Training", "Bodyweight Training", "Functional Fitness", "Sport-Specific Training", "Injury Prevention", "Periodization"],
    "mental_health": ["Cognitive Behavioral Therapy", "Dialectical Behavior Therapy", "Trauma Recovery", "Anxiety Management", "Depression Treatment", "PTSD", "OCD", "ADHD", "Burnout Recovery", "Grief Counseling", "Addiction Recovery", "Positive Psychology", "Self-Compassion", "Emotional Intelligence", "Resilience"],
    "meditation": ["Vipassana", "Zen Meditation", "Transcendental Meditation", "Loving-Kindness", "Body Scan", "Walking Meditation", "Breathwork", "Mantra Practice", "Yoga Nidra", "Mindful Eating", "Contemplative Prayer", "Dzogchen", "Heart Coherence", "Non-Sleep Deep Rest", "Insight Meditation"],
    "design": ["User Research", "Wireframing", "Prototyping", "Design Systems", "Interaction Design", "Visual Design", "Accessibility", "Responsive Design", "Motion Design", "Information Architecture", "Service Design", "Design Thinking", "Color Theory", "Typography", "Icon Design"],
    "architecture": ["Sustainable Architecture", "Biomimicry", "Parametric Design", "Adaptive Reuse", "Urban Housing", "Parametric Design", "Passive Houses", "Smart Buildings", "Public Space Design", "Brutalism", "Modernism", "Vernacular Architecture", "Landscape Architecture", "Modular Construction", "Computational Design"],
    "photography": ["Street Photography", "Landscape Photography", "Portrait Photography", "Macro Photography", "Astrophotography", "Documentary Photography", "Black & White", "Color Theory", "Composition", "Photo Editing", "Studio Lighting", "Film Photography", "Drone Photography", "Underwater Photography", "Food Photography"],
    "film": ["Directing", "Screenwriting", "Cinematography", "Film Editing", "Sound Design", "Film Theory", "Documentary Filmmaking", "Animation", "Independent Cinema", "World Cinema", "Film Noir", "New Wave Cinema", "Action Cinema", "Horror Cinema", "Film History"],
    "writing": ["Fiction Writing", "Creative Nonfiction", "Memoir Writing", "Screenwriting", "Journalism", "Copywriting", "Technical Writing", "World-Building", "Character Development", "Plot Structure", "Revision Process", "Publishing", "The Writing Life", "Poetry Writing", "Essay Writing"],
    "journalism": ["Investigative Journalism", "Data Journalism", "Broadcast Journalism", "Photojournalism", "Citizen Journalism", "Media Ethics", "Press Freedom", "News Writing", "Feature Writing", "Opinion Writing", "Multimedia Storytelling", "Embedded Reporting", "Conflict Reporting", "Business Journalism", "Science Journalism"],
    "philosophy_mind": ["Consciousness", "Free Will", "Personal Identity", "Philosophy of AI", "Mental Causation", "Qualia", "Functionalism", "Physicalism", "Dualism", "Philosophy of Perception", "Philosophy of Emotion", "Animal Consciousness", "Machine Consciousness", "Embodied Cognition", "Extended Mind"],
    "ethics": ["Applied Ethics", "Bioethics", "Environmental Ethics", "Business Ethics", "Technology Ethics", "AI Ethics", "Medical Ethics", "Animal Ethics", "Metaethics", "Normative Ethics", "Virtue Ethics", "Deontological Ethics", "Consequentialism", "Ethics of Care", "Moral Psychology"],
    "politics": ["Democratic Theory", "International Relations", "Public Policy", "Political Economy", "Comparative Politics", "Political Communication", "Electoral Systems", "Constitutional Design", "Foreign Policy", "Political Philosophy", "Civil Liberties", "Political Parties", "Geopolitics", "Populism", "Statecraft"],
    "sociology": ["Social Stratification", "Cultural Sociology", "Sociology of Education", "Urban Sociology", "Medical Sociology", "Sociology of Race", "Gender Sociology", "Economic Sociology", "Political Sociology", "Digital Sociology", "Sociology of Health", "Criminology", "Sociology of Religion", "Social Movements", "Globalization"],
    "anthropology": ["Cultural Anthropology", "Physical Anthropology", "Linguistic Anthropology", "Archaeological Method", "Ethnography", "Kinship Studies", "Ritual & Religion", "Economic Anthropology", "Medical Anthropology", "Digital Anthropology", "Applied Anthropology", "Folklore Studies", "Human Evolution", "Primatology", "Anthropology of Food"],
    "linguistics": ["Syntax", "Semantics", "Phonetics", "Sociolinguistics", "Psycholinguistics", "Historical Linguistics", "Computational Linguistics", "Language Acquisition", "Pragmatics", "Morphology", "Language Typology", "Bilingualism", "Sign Languages", "Endangered Languages", "Phonology"],
    "archaeology": ["Mediterranean Archaeology", "Mesoamerican Archaeology", "Underwater Archaeology", "Aerial Archaeology", "Industrial Archaeology", "Experimental Archaeology", "Zooarchaeology", "Geoarchaeology", "Bioarchaeology", "Digital Archaeology", "Archaeoastronomy", "Near Eastern Archaeology", "African Archaeology", "Southeast Asian Archaeology", "Paleolithic Studies"],
    "geology": ["Plate Tectonics", "Volcanology", "Mineralogy", "Petrology", "Paleontology", "Sedimentology", "Structural Geology", "Geophysics", "Geochemistry", "Hydrogeology", "Engineering Geology", "Planetary Geology", "Glacial Geology", "Seismology", "Geomorphology"],
    "oceanography": ["Physical Oceanography", "Chemical Oceanography", "Biological Oceanography", "Marine Geology", "Deep Sea Exploration", "Coral Reef Science", "Ocean Currents", "Tidal Systems", "Marine Pollution", "Ocean Acidification", "Marine Acoustics", "Satellite Oceanography", "Arctic Ocean", "Hydrothermal Vents", "Marine Biodiversity"],
    "astronomy": ["Stellar Astronomy", "Galactic Astronomy", "Extragalactic Astronomy", "Cosmology", "Planetary Science", "Solar Astronomy", "Radio Astronomy", "X-Ray Astronomy", "Infrared Astronomy", "Gravitational Lensing", "Stellar Evolution", "Galaxy Formation", "Dark Matter", "Dark Energy", "Pulsars & Neutron Stars"],
    "ecology": ["Ecosystem Ecology", "Conservation Biology", "Landscape Ecology", "Marine Ecology", "Freshwater Ecology", "Community Ecology", "Population Ecology", "Restoration Ecology", "Urban Ecology", "Tropical Ecology", "Alpine Ecology", "Desert Ecology", "Wetland Ecology", "Island Biogeography", "Pollination Ecology"],
    "evolution": ["Natural Selection", "Adaptive Radiation", "Speciation", "Phylogenetics", "Evolutionary Medicine", "Coevolution", "Sexual Selection", "Kin Selection", "Evolutionary Psychology", "Evo-Devo", "Molecular Evolution", "Convergent Evolution", "Extinction Events", "Human Evolution", "Microbial Evolution"],
    "math": ["Abstract Algebra", "Real Analysis", "Topology", "Number Theory", "Combinatorics", "Differential Equations", "Probability Theory", "Mathematical Logic", "Category Theory", "Riemann Hypothesis", "Graph Theory", "Algebraic Geometry", "Dynamical Systems", "Mathematical Finance", "Discrete Mathematics"],
    "physics": ["Quantum Mechanics", "General Relativity", "String Theory", "Particle Physics", "Condensed Matter", "Thermodynamics", "Electromagnetism", "Plasma Physics", "Nuclear Physics", "Optical Physics", "Astrophysics", "Cosmological Physics", "Fluid Dynamics", "Statistical Mechanics", "Quantum Field Theory"],
    "chemistry": ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Biochemistry", "Polymer Chemistry", "Analytical Chemistry", "Materials Chemistry", "Environmental Chemistry", "Computational Chemistry", "Medicinal Chemistry", "Nanotechnology", "Electrochemistry", "Photochemistry", "Thermochemistry", "Green Chemistry"],
    "engineering": ["Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Chemical Engineering", "Aerospace Engineering", "Biomedical Engineering", "Software Engineering", "Systems Engineering", "Environmental Engineering", "Industrial Engineering", "Robotics Engineering", "Materials Engineering", "Structural Engineering", "Thermal Engineering", "Control Systems"],
    "automotive": ["Electric Vehicles", "Autonomous Driving", "Engine Technology", "Automotive Design", "Motorsport Engineering", "Car Safety", "Hybrid Technology", "Automotive History", "Car Manufacturing", "Vehicle Dynamics", "Automotive Electronics", "Classic Cars", "Off-Road Engineering", "Hydrogen Vehicles", "Connected Cars"],
    "aviation": ["Flight Dynamics", "Aircraft Design", "Avionics", "Commercial Aviation", "Spaceflight History", "Helicopter Engineering", "UAV Technology", "Air Traffic Control", "Aerodynamics", "Propulsion Systems", "Aviation Safety", "Airport Design", "Gliding & Soaring", "Fighter Aircraft", "Space Tourism"],
    "military": ["Strategy & Tactics", "Military History", "Special Operations", "Naval Warfare", "Air Power", "Cyber Warfare", "Intelligence Operations", "Logistics", "Military Technology", "Counterinsurgency", "Military Ethics", "Cold War", "Ancient Warfare", "Modern Conflicts", "Defense Policy"],
    "diy": ["Woodworking", "Home Electrical", "Plumbing Basics", "Painting & Finishing", "Metalworking", "3D Printing", "Electronics Projects", "Home Automation", "Concrete & Masonry", "Roofing", "Flooring", "Furniture Building", "Tool Maintenance", "Home Inspection", "Energy Efficiency"],
    "gardening": ["Vegetable Gardening", "Fruit Growing", "Herb Gardens", "Container Gardening", "Raised Beds", "Composting", "Soil Science", "Irrigation Systems", "Pest Management", "Pollinator Gardens", "Shade Gardening", "Vertical Gardening", "Greenhouse Gardening", "Bulb Growing", "Propagation Techniques"],
    "pets": ["Dog Training", "Cat Behavior", "Pet Nutrition", "Aquarium keeping", "Bird Care", "Reptile Keeping", "Small Mammals", "Pet Health", "Puppy Development", "Senior Pet Care", "Pet Psychology", "Service Animals", "Exotic Pets", "Pet Grooming", "Pet Behavior Problems"],
    "crafts": ["Knitting", "Crochet", "Sewing", "Quilting", "Embroidery", "Pottery", "Jewelry Making", "Paper Crafts", "Leather Working", "Candle Making", "Soap Making", "Weaving", "Macramé", "Cross-Stitch", "Resin Art"],
    "collecting": ["Coin Collecting", "Stamp Collecting", "Art Collecting", "Antique Furniture", "Vintage Fashion", "Record Collecting", "Comic Books", "Wine Collecting", "Watch Collecting", "Book Collecting", "Militaria", "Autographs", "Sports Memorabilia", "Glass & Crystal", "Native American Art"],
    "gardening_organic": ["No-Dig Method", "Companion Planting", "Cover Crops", "Soil Microbiome", "Seed Saving", "Natural Pest Control", "Composting Systems", "Permaculture Design", "Food Forests", "Green Manures", "Mulching Techniques", "Water Conservation", "Organic Certification", "Crop Rotation", "Succession Planting"],
    "fermentation": ["Sourdough Bread", "Kimchi", "Sauerkraut", "Kombucha", "Kefir", "Wine Making", "Beer Brewing", "Cheese Making", "Yogurt Making", "Miso", "Tempeh", "Pickles & Preserves", "Fermented Vegetables", "Fruit Wines", "Cider Making"],
    "cycling": ["Road Cycling", "Mountain Biking", "Bike Fitting", "Cycling Nutrition", "Bike Maintenance", "Touring & Bikepacking", "Cyclocross", "Track Cycling", "Cycling Physiology", "Bike Commuting", "Gravel Riding", "Racing Strategy", "Bike Building", "Cycling Psychology", "Women's Cycling"],
    "hiking": ["Trail Navigation", "Wilderness Survival", "Backpacking", "Ultralight Hiking", "Mountain Climbing", "Long-Distance Trails", "Bushcraft", "Water Purification", "Shelter Building", "Fire Starting", "Outdoor Cooking", "Weather Reading", "Wildlife Tracking", "Leave No Trace", "First Aid Outdoors"],
    "camping": ["Tent Camping", "RV Camping", "Car Camping", "Winter Camping", "Camp Cooking", "Camp Safety", "Hammock Camping", "Dispersed Camping", "Campsite Selection", "Gear Reviews", "Camp Hygiene", "Family Camping", "Solo Camping", "Glamping", "Primitive Camping"],
    "fishing": ["Fly Fishing", "Bass Fishing", "Saltwater Fishing", "Tackle & Lures", "Fish Biology", "Catch & Release", "Ice Fishing", "Deep Sea Fishing", "River Fishing", "Lake Fishing", "Fishing Knots", "Fish Habitat", "Seasonal Patterns", "Kayak Fishing", "Tournament Fishing"],
    "hunting": ["Deer Hunting", "Waterfowl Hunting", "Turkey Hunting", "Elk Hunting", "Small Game", "Hunting Ethics", "Firearms Safety", "Archery Hunting", "Dog Handling", "Tracking Skills", "Game Processing", "Wildlife Management", "Blind & Decoy Setup", "Calling Techniques", "Hunting Optics"],
    "survival": ["Shelter Construction", "Water Purification", "Fire Craft", "Food Foraging", "Navigation", "First Aid", "Signaling", "Trap & Snare Making", "Weather Prediction", "Psychological Resilience", "Knot Tying", "Tool Making", "Wilderness Communication", "Escape & Evasion", "Urban Survival"],
    "astronomy_observing": ["Telescope Selection", "Star Charts", "Deep Sky Objects", "Planetary Observation", "Lunar Observation", "Meteor Showers", "Astrophotography", "Light Pollution", "Dark Sky Sites", "Observer's Log", "Seasonal Sky Guides", "Binocular Astronomy", "Smartphone Astronomy", "Solar Observation", "Variable Stars"],
    "birds": ["Bird Identification", "Birding Hotspots", "Bird Migration", "Nesting Behavior", "Raptor Watching", "Shorebirds", "Songbirds", "Waterfowl", "Bird Photography", "Bird Conservation", "Avian Ecology", "Bird Vocalizations", "Garden Birds", "Tropical Birds", "Bird Banding"],
    "insects": ["Butterfly Identification", "Bee Biology", "Beetle Diversity", "Insect Ecology", "Pollinator Conservation", "Insect Photography", "Ant Colonies", "Dragonflies", "Moths & Moth Watching", "Beneficial Insects", "Insect Behavior", "Insect Physiology", "Entomology Methods", "Insect Conservation", "Aquatic Insects"],
    "mycology": ["Mushroom Identification", "Mycelium Networks", "Fungal Ecology", "Edible Mushrooms", "Toxic Mushrooms", "Mushroom Cultivation", "Medicinal Fungi", "Mycorrhizal Networks", "Forest Fungi", "Mushroom Foraging", "Fungal Biotechnology", "Spore Printing", "Mushroom Cooking", "Fungal Conservation", "Rare Fungi"],
    "astronautics": ["Space Station Design", "Mars Mission Planning", "Space Suits", "Life Support Systems", "Rocket Engines", "Orbital Rendezvous", "Lunar Base Design", "Space Radiation", "Zero-G Living", "Space Food Systems", "Spacewalk Training", "Payload Design", "Space Debris", "Interplanetary Navigation", "Space Medicine"],
    "environmentalism": ["Zero Waste Living", "Environmental Justice", "Climate Activism", "Ocean Conservation", "Rainforest Protection", "Plastic Pollution", "Air Quality", "Water Conservation", "Sustainable Living", "Environmental Policy", "Rewilding", "Conservation Biology", "Citizen Science", "Green Politics", "Environmental Education"],
    "urbanism": ["Smart City Design", "Transit Planning", "Urban Agriculture", "Housing Policy", "Walkability", "Public Space Design", "Urban Forestry", "Waste Management", "Water Infrastructure", "Digital Infrastructure", "Equitable Development", "Tactical Urbanism", "Adaptive Reuse", "Night-Time Economy", "Urban Resilience"],
    "food_writing": ["Restaurant Criticism", "Food Memoir", "Cultural Food History", "Ingredient Profiles", "Food & Identity", "Street Food", "Food & Place", "Chef's Perspective", "Food Photography Writing", "Cookbook Writing", "Food Politics", "Farm-to-Table", "Immigrant Foodways", "Comfort Food", "Fine Dining"],
    "baking": ["Sourdough", "Pastry Techniques", "Bread Science", "Cake Decorating", "Viennoiserie", "Fermented Doughs", "Gluten-Free Baking", "Chocolate Work", "Sugar Art", "Pie & Tart", "Cookie Science", "Cake Chemistry", "Artisan Bread", "Laminated Doughs", "Global Baking Traditions"],
    "cocktails": ["Classic Cocktails", "Mixology Techniques", "Spirit Production", "Bitters & Syrups", "Tiki Drinks", "Cocktail History", "Bar Tools", "Garnish Design", "Whiskey Cocktails", "Gin Cocktails", "Rum Cocktails", "Mezcal & Tequila", "Cocktail Photography", "Bar Design", "Zero-Proof Cocktails"],
    "coffee_tea": ["Pour-Over Methods", "Espresso Science", "Coffee Origins", "Tea Ceremony", "Coffee Roasting", "Cupping", "Cold Brew", "Tea Blending", "Coffee & Health", "Sustainable Coffee", "Specialty Tea", "Coffee Culture", "Latte Art", "Coffee Processing", "Tea Types"],
    "wine": ["French Wine Regions", "Italian Wine", "Wine Tasting", "Winemaking Process", "Wine Pairing", "Natural Wine", "Sparkling Wine", "Fortified Wine", "New World Wines", "Wine Economics", "Vineyard Management", "Wine Collecting", "Wine Law", "Climate & Wine", "Wine Tourism"],
    "beer": ["Craft Beer Styles", "Homebrewing", "Beer Tasting", "Hop Science", "Malt & Grain", "Yeast Management", "Beer History", "Beer & Food Pairing", "Lager vs Ale", "Sour Beer", "Stout & Porter", "Beer Judging", "Brewery Design", "Belgian Beer", "Session Beers"],
    "fashion": ["Fashion History", "Sustainable Fashion", "Pattern Making", "Textile Science", "Fashion Illustration", "Haute Couture", "Streetwear", "Fashion Business", "Vintage Fashion", "Color in Fashion", "Fashion Photography", "Couture Techniques", "Fashion Theory", "Wardrobe Curation", "Ethical Fashion"],
    "interior_design": ["Color Theory", "Space Planning", "Furniture Selection", "Lighting Design", "Texture & Materials", "Minimalist Design", "Maximalist Design", "Biophilic Design", "Vintage Interiors", "Small Space Design", "Home Office Design", "Kitchen Design", "Bathroom Design", "Bedroom Design", "Living Room Design"],
    "minimalism": ["Decluttering Methods", "Capsule Wardrobe", "Digital Minimalism", "Minimalist Home", "Financial Minimalism", "Time Minimalism", "Minimalist Travel", "Minimalist Cooking", "Tiny House Living", "Voluntary Simplicity", "Intentional Living", "Essentialism", "Mindful Consumption", "Minimalist Parenting", "Slow Living"],
    "journaling": ["Bullet Journaling", "Gratitude Journaling", "Morning Pages", "Prompt-Based Writing", "Art Journaling", "Dream Journaling", "Travel Journaling", "Fitness Journaling", "Food Journaling", "Reading Journal", "Reflection Practice", "Stream of Consciousness", "Structured Journaling", "Digital Journaling", "Manifestation Journaling"],
    "stoicism_modern": ["Daily Stoic Exercises", "Negative Visualization", "Amor Fati", "Dichotomy of Control", "Stoic Meditation", "Stoic Journaling", "Stoic Leadership", "Resilience Building", "Emotional Regulation", "Stoic Ethics", "Stoic Relationships", "Stoic Career Advice", "Stoic Parenting", "Stoic Health", "Stoic Wealth"],
    "buddhism": ["Zen Practice", "Theravada Buddhism", "Mahayana Buddhism", "Tibetan Buddhism", "Mindfulness", "The Four Noble Truths", "The Eightfold Path", "Buddhist Ethics", "Buddhist Meditation", "Buddhist Psychology", "Buddhist Art", "Buddhist Economics", "Engaged Buddhism", "Buddhist Ecology", "Buddhist Philosophy"],
    "taoism": ["Tao Te Ching", "Wu Wei", "Yin-Yang Theory", "Taoist Meditation", "Taoist Alchemy", "Taoist Health", "Taoist Ethics", "Taoist Nature", "Taoist Art", "Taoist Philosophy", "Taoist Practices", "Taoist Governance", "Taoist Relationships", "Taoist Creativity", "Taoist Spirituality"],
    "mythology": ["Greek Mythology", "Norse Mythology", "Hindu Mythology", "Egyptian Mythology", "Celtic Mythology", "Japanese Mythology", "Chinese Mythology", "African Mythology", "Native American Mythology", "Mesoamerican Mythology", "Mesopotamian Mythology", "Korean Mythology", "Polynesian Mythology", "Slavic Mythology", "Roman Mythology"],
    "occult": ["Alchemy", "Hermeticism", "Kabbalah", "Ritual Magic", "Ceremonial Magic", "Esoteric Christianity", "Theosophy", "Rosicrucianism", "Gnosticism", "Mystery Traditions", "Sacred Geometry", "Divination Methods", "Energy Work", "Chakra Systems", "Esoteric Philosophy"],
    "astrology": ["Natal Chart Reading", "Planetary Transits", "Sun Signs", "Moon Signs", "Rising Signs", "Synastry", "Electional Astrology", "Medical Astrology", "Astrocartography", "Vedic Astrology", "Chinese Astrology", "Horary Astrology", "Astrological Houses", "Aspect Patterns", "Retrograde Periods"],
    "tarot": ["Major Arcana", "Minor Arcana", "Tarot Spreads", "Card Meanings", "Tarot & Psychology", "Intuitive Reading", "Tarot for Creativity", "Oracle Decks", "Tarot History", "Numerology", "Astrology & Tarot", "Kabbalah & Tarot", "Tarot Journaling", "Shadow Work Tarot", "Tarot for Meditation"],
    "true_crime": ["Criminal Profiling", "Forensic Science", "Cold Cases", "Serial Killers", "White Collar Crime", "Cybercrime", "Organized Crime", "Missing Persons", "Wrongful Convictions", "Victimology", "Criminal Justice Reform", "International Crime", "Famous Heists", "Crime Scene Investigation", "Criminal Psychology"],
    "espionage": ["CIA History", "MI6 Operations", "Cold War Spies", "Intelligence Gathering", "Spy Craft", "Code Breaking", "Double Agents", "Covert Operations", "Espionage Technology", "Defectors", "Espionage Literature", "Spy Satellites", "Disinformation", "Intelligence Analysis", "Diplomatic Espionage"],
    "maritime": ["Age of Sail", "Naval Warfare", "Piracy", "Shipwrecks", "Merchant Marine", "Submarine Warfare", "Naval Architecture", "Maritime Trade", "Ocean Exploration", "Lighthouse History", "Port Cities", "Shipbuilding", "Coastal Navigation", "Maritime Law", "Marine Archaeology"],
    "medieval": ["Feudalism", "Knights & Chivalry", "The Crusades", "Medieval Religion", "Medieval Medicine", "Medieval Warfare", "Castles & Fortifications", "Medieval Economy", "The Black Death", "Medieval Art", "Viking Age", "Magna Carta", "Medieval Law", "Medieval Education", "Medieval Food"],
    "renaissance": ["Renaissance Art", "Renaissance Science", "The Reformation", "Medici Family", "Da Vinci", "Michelangelo", "Renaissance Music", "Humanism", "Renaissance Architecture", "Renaissance Literature", "The Printing Press", "Renaissance Philosophy", "Exploration & Discovery", "Renaissance Medicine", "Renaissance Trade"],
    "world_war": ["World War I", "World War II", "The Eastern Front", "Pacific Theater", "The Holocaust", "D-Day", "The Cold War", "Korean War", "Vietnam War", "Desert Storm", "War on Terror", "Intelligence in War", "Home Front", "War Technology", "Post-War Reconstruction"],
    "civil_rights": ["Civil Rights Movement", "Voting Rights", "Legal Activism", "Protest Movements", "Racial Justice", "Educational Equality", "Housing Rights", "Criminal Justice Reform", "LGBTQ+ Rights", "Disability Rights", "Indigenous Rights", "Women's Rights", "Economic Justice", "Media Representation", "International Human Rights"],
    "feminism": ["First Wave Feminism", "Second Wave Feminism", "Third Wave Feminism", "Intersectional Feminism", "Feminist Theory", "Women's History", "Gender Pay Gap", "Reproductive Rights", "Feminist Philosophy", "Men & Masculinity", "Feminist Literature", "Global Feminism", "Feminist Economics", "Feminist Science", "Queer Feminism"],
    "lgbtq": ["Queer History", "Coming Out", "LGBTQ+ Literature", "Trans Studies", "Queer Theory", "LGBTQ+ Youth", "LGBTQ+ Families", "Queer Activism", "LGBTQ+ Health", "Global LGBTQ+ Rights", "LGBTQ+ Film", "Bisexual Studies", "Drag Culture", "LGBTQ+ Workplace", "Queer Art"],
    "race_ethnicity": ["Racial Identity", "Critical Race Theory", "Ethnic Studies", "Multiracial Identity", "Immigration & Race", "Cultural Appropriation", "Anti-Racism", "Racial Health Disparities", "Media Representation", "Education & Race", "Criminal Justice & Race", "Housing & Race", "Wealth Gap", "Diaspora Studies", "Indigenous Sovereignty"],
    "immigration": ["Immigration Policy", "Refugee Experiences", "Diaspora Communities", "Assimilation", "Border Studies", "Labor Migration", "Family Reunification", "Immigrant Entrepreneurs", "Undocumented Experience", "Citizenship", "Cultural Integration", "Remittances", "Immigration Law", "Second Generation", "Immigrant Health"],
    "environmental_justice": ["Climate Equity", "Environmental Racism", "Indigenous Environmental Rights", "Toxic Waste Communities", "Water Justice", "Air Quality Justice", "Food Deserts", "Green Gentrification", "Climate Refugees", "Community Activism", "Policy Advocacy", "Health Disparities", "Corporate Accountability", "Global South", "Youth Activism"],
    "labor": ["Union History", "Worker Movements", "Gig Economy", "Labor Law", "Workplace Safety", "Collective Bargaining", "Automation & Jobs", "Minimum Wage", "International Labor", "Child Labor", "Labor & Technology", "Workplace Democracy", "Economic Inequality", "Labor Organizing", "Future of Work"],
    "intellectual_history": ["Great Books Tradition", "The Enlightenment", "The Scientific Revolution", "Romanticism", "Existentialism", "Postmodernism", "The Frankfurt School", "Pragmatism", "Logical Positivism", "Structuralism", "Marxist Thought", "Liberal Thought", "Conservative Thought", "Feminist Thought", "Postcolonial Theory"],
    "comparative_religion": ["Christianity", "Islam", "Hinduism", "Judaism", "Sikhism", "Buddhism", "Zoroastrianism", "Jainism", "Bahá'í Faith", "Confucianism", "Shinto", "Indigenous Religions", "New Religious Movements", "Interfaith Dialogue", "Religion & Science"],
    "theology": ["Systematic Theology", "Biblical Studies", "Church History", "Moral Theology", "Pastoral Care", "Liturgical Studies", "Doctrine", "Apologetics", "Hermeneutics", "Liberation Theology", "Feminist Theology", "Ecotheology", "Comparative Theology", "Philosophy of Religion", "Religious Pluralism"],
    "cryptography": ["Symmetric Encryption", "Asymmetric Encryption", "Hash Functions", "Key Exchange", "Digital Signatures", "Post-Quantum Cryptography", "Elliptic Curves", "Lattice-Based Cryptography", "Crypto Protocols", "Blockchain Cryptography", "Homomorphic Encryption", "Secure Multi-Party Computation", "Zero-Knowledge Proofs", "Cryptanalysis", "Applied Cryptography"],
    "information_theory": ["Shannon's Theory", "Data Compression", "Error Correction", "Channel Capacity", "Entropy", "Information Geometry", "Network Information Theory", "Source Coding", "Rate-Distortion Theory", "Algorithmic Information Theory", "Quantum Information", "Bio-Inspired Information", "Mutual Information", "Information Bottleneck", "Semantic Information"],
    "complexity": ["Chaos Theory", "Emergent Behavior", "Network Science", "Agent-Based Modeling", "Complex Adaptive Systems", "Power Laws", "Self-Organization", "Edge of Chaos", "Complex Networks", "Swarm Intelligence", "Cellular Automata", "Fractal Geometry", "Systems Dynamics", "Resilience Theory", "Socio-Technical Systems"],
    "futurism": ["Scenario Planning", "Technology Forecasting", "Megatrends", "Singularity", "Long-Termism", "Existential Risk", "Futurist Literature", "Strategic Foresight", "Worldbuilding", "Speculative Design", "Transhumanism", "Post-Humanism", "Future of Work", "Future of Food", "Space Colonization"],
    "seti": ["Drake Equation", "Fermi Paradox", "Exoplanet Detection", "Biosignatures", "Radio Astronomy", "Astrobiology", "UFO Studies", "Interstellar Communication", "Panspermia", "Dyson Spheres", "Von Neumann Probes", "Technosignatures", "Extremophiles", "Abiogenesis", "Cosmic Horizons"],
    "encryption": ["AES Encryption", "RSA Cryptography", "PGP & GPG", "TLS/SSL", "End-to-End Encryption", "Quantum-Safe Cryptography", "Encryption Key Management", "Signal Protocol", "Tor & Anonymity", "Encrypted Messaging", "Disk Encryption", "Password Hashing", "Secure Enclaves", "FHE Applications", "Encryption Policy"],
}

TITLE_TEMPLATES = [
    "The Complete Guide to {topic}",
    "Mastering {topic}: A Practical Handbook",
    "{topic}: Fundamentals and Beyond",
    "The Art of {topic}",
    "{topic} for Beginners",
    "Advanced {topic}: Strategies and Insights",
    "The {topic} Playbook",
    "{topic}: A Comprehensive Introduction",
    "Essential {topic}",
    "The {topic} Handbook",
    "{topic}: Theory and Practice",
    "Understanding {topic}",
    "The Definitive Guide to {topic}",
    "{topic}: From Basics to Mastery",
    "Applied {topic}",
    "{topic}: Real-World Applications",
    "The Science of {topic}",
    "{topic} Demystified",
    "A Deep Dive into {topic}",
    "{topic}: Principles and Practices",
    "The {topic} Blueprint",
    "{topic}: Case Studies and Analysis",
    "Exploring {topic}",
    "{topic}: A Modern Approach",
    "The {topic} Revolution",
    "Lessons in {topic}",
    "{topic}: Strategies for Success",
    "The {topic} Bible",
    "{topic}: Insights and Innovations",
    "An Introduction to {topic}",
    "{topic}: The Complete Reference",
    "Foundations of {topic}",
    "{topic} in Practice",
    "The {topic} Masterclass",
    "{topic}: Bridging Theory and Practice",
    "{topic}: Cutting-Edge Perspectives",
    "The World of {topic}",
    "{topic}: An Illustrated Guide",
    "The {topic} Companion",
    "{topic}: Concepts and Applications",
    "Real-World {topic}",
    "{topic} Essentials",
    "A Practical Guide to {topic}",
    "{topic}: Modern Perspectives",
    "The {topic} Framework",
    "Essential Concepts in {topic}",
    "{topic}: Methods and Approaches",
    "The Future of {topic}",
    "{topic}: A Practical Roadmap",
    "The {topic} Toolkit",
    "{topic}: Strategies That Work",
]

DESC_TEMPLATES = [
    "A comprehensive guide to {topic_lower} covering core principles, practical strategies, and real-world applications.",
    "Explore the fundamentals of {topic_lower} with clear explanations, case studies, and actionable insights.",
    "From beginner basics to advanced techniques, this book covers everything you need to know about {topic_lower}.",
    "Learn {topic_lower} through practical examples, expert guidance, and evidence-based strategies.",
    "An accessible introduction to {topic_lower} that bridges theory with everyday practice.",
    "Master the essential concepts of {topic_lower} with this thorough and engaging guide.",
    "Discover how {topic_lower} works, why it matters, and how to apply it in your work and life.",
    "A practical handbook covering the most important ideas in {topic_lower} for learners at every level.",
    "This book provides a clear, structured approach to understanding {topic_lower} for students and professionals.",
    "Written by an expert in the field, this guide to {topic_lower} combines depth with accessibility.",
    "An in-depth exploration of {topic_lower} featuring case studies, exercises, and expert commentary.",
    "The essential primer on {topic_lower} — what you need to know, explained simply and clearly.",
    "Covering both foundational theory and modern developments, this book is your guide to {topic_lower}.",
    "A thorough treatment of {topic_lower} with practical tools, frameworks, and real-world examples.",
    "Learn the core principles of {topic_lower} and how to apply them effectively in any context.",
    "This engaging guide breaks down {topic_lower} into digestible lessons for everyday understanding.",
    "From theory to practice, this book walks you through the key ideas in {topic_lower}.",
    "A modern, comprehensive resource on {topic_lower} for students, professionals, and curious minds.",
    "Understanding {topic_lower} has never been easier — this guide makes complex ideas accessible and actionable.",
    "Explore the landscape of {topic_lower} with practical frameworks, expert insights, and actionable strategies.",
]

# ---------------------------------------------------------------------------
# Generate books
# ---------------------------------------------------------------------------

def generate_book_id(title, author, idx):
    """Deterministic ID from content."""
    h = hashlib.md5(f"{title}|{author}|{idx}".encode()).hexdigest()
    return int(h[:8], 16)

def gen_books_for_category(cat_key, count, start_id, is_existing=False):
    """Generate `count` books for a category."""
    topics = TOPIC_WORDS.get(cat_key, ["General Knowledge", "Key Concepts", "Core Principles", "Applied Methods", "Practical Strategies"])
    books = []
    for i in range(count):
        topic = random.choice(topics)
        template = random.choice(TITLE_TEMPLATES)
        title = template.format(topic=topic)
        
        # Add variation suffix sometimes
        suffix = ""
        if random.random() < 0.15:
            suffix = random.choice([" Vol. I", " Vol. II", " Vol. III", " 2nd Edition", " 3rd Edition", " Anniversary Edition", " Revised Edition", " Student Edition", " Professional Edition", " Concise Edition"])
        if random.random() < 0.1:
            subtitle = random.choice(["A Hands-On Approach", "A Practical Framework", "The Essential Reference", "A Modern Perspective", "Bridging Theory and Practice", "An Illustrated Guide", "With Real-World Examples", "For the Modern Professional", "A Step-by-Step Guide", "Key Concepts and Applications"])
            suffix = f": {subtitle}"
        
        title = title + suffix
        
        first = random.choice(FIRST_NAMES)
        last = random.choice(LAST_NAMES)
        author = f"{first} {last}"
        
        # Years: real books are 1900-2026, generated are weighted toward recent
        if is_existing and i < 5:
            year = random.choice(range(1950, 2026))
        else:
            year = random.choices(
                range(1970, 2026),
                weights=[1]*6 + [2]*10 + [3]*10 + [5]*10 + [8]*10 + [12]*10,
                k=1
            )[0]
        
        pages = random.choice(range(144, 641, 16))
        
        rating_base = random.choice([3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6])
        rating = round(rating_base + random.uniform(-0.1, 0.1), 1)
        rating = max(3.0, min(5.0, rating))
        
        topic_lower = topic.lower()
        desc = random.choice(DESC_TEMPLATES).format(topic_lower=topic_lower)
        if len(desc) > 200:
            desc = desc[:197] + "..."
        
        is_top = (i < 3 and random.random() < 0.3)
        
        book_id = start_id + i
        
        books.append({
            "id": book_id,
            "cat": cat_key,
            "title": title,
            "author": author,
            "rating": rating,
            "year": year,
            "pages": pages,
            "desc": desc,
            "top": is_top,
        })
    
    return books

# ---------------------------------------------------------------------------
# Main generation
# ---------------------------------------------------------------------------

def main():
    all_books = []
    book_id = 1
    target_total = 75000  # aim for ~75K books
    
    # Distribute books: existing 31 categories get more, new 100 categories get ~500 each
    existing_keys = [c["key"] for c in NEW_CATEGORIES[:31]]
    new_keys = [c["key"] for c in NEW_CATEGORIES[31:]]
    
    books_per_existing = 800  # ~31 * 800 = 24,800
    books_per_new = 500       # ~100 * 500 = 50,000
    estimated = len(existing_keys) * books_per_existing + len(new_keys) * books_per_new
    print(f"Estimated total: {estimated} books across {len(NEW_CATEGORIES)} categories")
    
    # Generate existing categories
    for cat in NEW_CATEGORIES[:31]:
        books = gen_books_for_category(cat["key"], books_per_existing, book_id, is_existing=True)
        all_books.extend(books)
        book_id += books_per_existing
        print(f"  {cat['key']}: {len(books)} books (IDs {books[0]['id']}-{books[-1]['id']})")
    
    # Generate new categories
    for cat in NEW_CATEGORIES[31:]:
        books = gen_books_for_category(cat["key"], books_per_new, book_id)
        all_books.extend(books)
        book_id += books_per_new
    
    print(f"\nTotal generated: {len(all_books)} books")
    print(f"Total categories: {len(NEW_CATEGORIES)}")
    
    # Write the JS file
    output_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "data", "booksData.js")
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("// Book Catalog — Massive library: 131 categories, 75K+ books\n")
        f.write("// Auto-generated by _books_py/generate_massive.py\n\n")
        
        # Write categories
        f.write("export const BOOK_CATEGORIES = ")
        json.dump(NEW_CATEGORIES, f, indent=2, ensure_ascii=False)
        f.write(";\n\n")
        
        # Write books as compact JSON array (one per line for readability)
        f.write("export const BOOKS = [\n")
        for i, book in enumerate(all_books):
            line = json.dumps(book, ensure_ascii=False, separators=(',', ':'))
            if i < len(all_books) - 1:
                f.write(line + ",\n")
            else:
                f.write(line + "\n")
        f.write("];\n\n")
        f.write("export default BOOKS;\n")
    
    print(f"\nWritten to {output_path}")
    file_size = os.path.getsize(output_path)
    print(f"File size: {file_size / 1024 / 1024:.1f} MB")

if __name__ == "__main__":
    main()
