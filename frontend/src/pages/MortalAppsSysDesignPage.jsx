import React from 'react';
import SectionDetailPage from './SectionDetailPage';
import { SYSTEM_DESIGN_DATA } from '../data/systemDesignData';

export default function SystemDesignPage() {
  return <SectionDetailPage data={SYSTEM_DESIGN_DATA} sectionSlug="system-design" />;
}
