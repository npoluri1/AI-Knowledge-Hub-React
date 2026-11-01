import React from 'react';
import SectionDetailPage from './SectionDetailPage';
import { INFRASTRUCTURE_DATA } from '../data/infrastructureData';
export default function InfrastructurePage() {
  return <SectionDetailPage data={INFRASTRUCTURE_DATA} sectionSlug="ai-infrastructure" />;
}
