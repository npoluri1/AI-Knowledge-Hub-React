import React from 'react';
import SectionDetailPage from './SectionDetailPage';
import { PYTHON_CODE_DATA } from '../data/pythonCodeData';
export default function PythonCodePage() {
  return <SectionDetailPage data={PYTHON_CODE_DATA} sectionSlug="python-code" />;
}
