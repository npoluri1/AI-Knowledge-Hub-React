import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ChapterView from './pages/ChapterView'
import DeepDiveView from './pages/DeepDiveView'
import ImagesGallery from './pages/ImagesGallery'
import FileReferenceView from './pages/FileReferenceView'
import JobsView from './pages/JobsView'
import KnowledgeBaseView from './pages/KnowledgeBaseView'
import EdurekaDocsView from './pages/EdurekaDocsView'
import AiNewsDashboard from './pages/AiNewsDashboard'
import LiveNewsDashboard from './pages/LiveNewsDashboard'
import JobsProjectView from './pages/JobsProjectView'
import AiToolsCatalog from './pages/AiToolsCatalog'
import GithubRepos from './pages/GithubRepos'
import DelphiTools from './pages/DelphiTools'
import OpenAlternatives from './pages/OpenAlternatives'
import WebIntegrationsCatalog from './pages/WebIntegrationsCatalog'
import BooksCatalog from './pages/BooksCatalog'
import RapidFireView from './pages/RapidFireView'
import PlaybookView from './pages/PlaybookView'
import AiStackScreen from './pages/AiStackScreen'
import ClaudeCertView from './pages/ClaudeCertView'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chapter/:id" element={<ChapterView />} />
        <Route path="/deep-dive/:id" element={<DeepDiveView />} />
        <Route path="/images" element={<ImagesGallery />} />
        <Route path="/files" element={<FileReferenceView />} />
        <Route path="/jobs" element={<JobsView />} />
        <Route path="/knowledge" element={<KnowledgeBaseView />} />
        <Route path="/edureka" element={<EdurekaDocsView />} />
        <Route path="/ai-news" element={<AiNewsDashboard />} />
        <Route path="/live-news" element={<LiveNewsDashboard />} />
        <Route path="/job-project" element={<JobsProjectView />} />
        <Route path="/ai-tools" element={<AiToolsCatalog />} />
        <Route path="/github-repos" element={<GithubRepos />} />
        <Route path="/tools" element={<DelphiTools />} />
        <Route path="/open-alternatives" element={<OpenAlternatives />} />
        <Route path="/integrations" element={<WebIntegrationsCatalog />} />
        <Route path="/books" element={<BooksCatalog />} />
        <Route path="/playbook/*" element={<PlaybookView />} />
        <Route path="/rapid-fire" element={<RapidFireView />} />
        <Route path="/rapid-fire/:deckId" element={<RapidFireView />} />
        <Route path="/ai-stack" element={<AiStackScreen />} />
        <Route path="/claude-cert" element={<ClaudeCertView />} />
      </Routes>
    </Layout>
  )
}
