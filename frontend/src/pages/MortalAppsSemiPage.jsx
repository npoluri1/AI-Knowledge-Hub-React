import React from 'react';
import SectionDetailPage from './SectionDetailPage';
import { SEMICONDUCTOR_DATA } from '../data/semiconductorData';
export default function SemiconductorPage() {
  return <SectionDetailPage data={SEMICONDUCTOR_DATA} sectionSlug="semiconductors" />;
}
