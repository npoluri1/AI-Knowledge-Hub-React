# -*- coding: utf-8 -*-
"""Category definitions for the book catalog generator."""

CATEGORIES = [
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
]

KEY_MAP = {c["key"]: c for c in CATEGORIES}
