import React from 'react';
import SectionDetailPage from './SectionDetailPage';
import { QUANTUM_DATA } from '../data/quantumData';
export default function QuantumPage() {
  return <SectionDetailPage data={QUANTUM_DATA} sectionSlug="quantum-computing" />;
}
