import React from 'react';
import SectionDetailPage from './SectionDetailPage';
import { AI_AGENTS_DATA } from '../data/aiAgentsData';
export default function AiAgentsPage() {
  return <SectionDetailPage data={AI_AGENTS_DATA} sectionSlug="ai-agents" />;
}
