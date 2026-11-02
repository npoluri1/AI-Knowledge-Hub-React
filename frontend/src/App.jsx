import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense } from 'react'
import Layout from './components/Layout'
import { LangProvider } from './components/DesignLang'
import { lazyRetry } from './lazyRetry'
import Home from './pages/Home'

const ChapterView = lazyRetry(() => import('./pages/ChapterView'))
const DeepDiveView = lazyRetry(() => import('./pages/DeepDiveView'))
const ImagesGallery = lazyRetry(() => import('./pages/ImagesGallery'))
const FileReferenceView = lazyRetry(() => import('./pages/FileReferenceView'))
const JobsView = lazyRetry(() => import('./pages/JobsView'))
const KnowledgeBaseView = lazyRetry(() => import('./pages/KnowledgeBaseView'))
const EdurekaDocsView = lazyRetry(() => import('./pages/EdurekaDocsView'))
const AiNewsDashboard = lazyRetry(() => import('./pages/AiNewsDashboard'))
const LiveNewsDashboard = lazyRetry(() => import('./pages/LiveNewsDashboard'))
const JobsProjectView = lazyRetry(() => import('./pages/JobsProjectView'))
const AiToolsCatalog = lazyRetry(() => import('./pages/AiToolsCatalog'))
const GithubRepos = lazyRetry(() => import('./pages/GithubRepos'))
const DelphiTools = lazyRetry(() => import('./pages/DelphiTools'))
const OpenAlternatives = lazyRetry(() => import('./pages/OpenAlternatives'))
const WebIntegrationsCatalog = lazyRetry(() => import('./pages/WebIntegrationsCatalog'))
const BooksCatalog = lazyRetry(() => import('./pages/BooksCatalog'))
const BookDetail = lazyRetry(() => import('./pages/BookDetail'))
const LibraryHome = lazyRetry(() => import('./pages/LibraryHome'))
const OpenLibraryBook = lazyRetry(() => import('./pages/OpenLibraryBook'))
const RapidFireView = lazyRetry(() => import('./pages/RapidFireView'))
const PlaybookView = lazyRetry(() => import('./pages/PlaybookView'))
const AiStackScreen = lazyRetry(() => import('./pages/AiStackScreen'))
const ClaudeCertView = lazyRetry(() => import('./pages/ClaudeCertView'))
const SnowflakeView = lazyRetry(() => import('./pages/SnowflakeView'))
const ProjectsView = lazyRetry(() => import('./pages/ProjectsView'))
const LinkedPostsView = lazyRetry(() => import('./pages/LinkedPostsView'))
const VideoHub = lazyRetry(() => import('./pages/VideoHub'))
const EtlGuideView = lazyRetry(() => import('./pages/EtlGuideView'))
const AiEngineerJobs = lazyRetry(() => import('./pages/AiEngineerJobs'))
const ProjectZoomView = lazyRetry(() => import('./pages/ProjectZoomView'))
const PythonMasterHub = lazyRetry(() => import('./pages/PythonMasterHub'))
const AiTechStackReference = lazyRetry(() => import('./pages/AiTechStackReference'))
const ReferenceLibrary = lazyRetry(() => import('./pages/ReferenceLibrary'))
const AiTechBlogsDemand = lazyRetry(() => import('./pages/AiTechBlogsDemand'))
const AiPythonMasterHubPages = lazyRetry(() => import('./pages/AiPythonMasterHubPages'))
const AiDesignSpace = lazyRetry(() => import('./pages/AiDesignSpace'))
const AiDesignSpaceDetail = lazyRetry(() => import('./pages/AiDesignSpaceDetail'))
const DesignPatternDetail = lazyRetry(() => import('./pages/DesignPatternDetail'))
const GlobalDesignSpace = lazyRetry(() => import('./pages/GlobalDesignSpace'))
const CountryDesignSpace = lazyRetry(() => import('./pages/CountryDesignSpace'))
const SectorDesignSpace = lazyRetry(() => import('./pages/SectorDesignSpace'))
const TechnologyFlow = lazyRetry(() => import('./pages/TechnologyFlow'))
const LibraryView = lazyRetry(() => import('./pages/LibraryView'))
const LearnTopic = lazyRetry(() => import('./pages/LearnTopic'))
const LearnBlog = lazyRetry(() => import('./pages/LearnBlog'))
const InterviewTests = lazyRetry(() => import('./pages/InterviewTests'))
const Calculators = lazyRetry(() => import('./pages/Calculators'))
const AiChatbotsPage = lazyRetry(() => import('./pages/AiChatbotsPage'))
const AiChatbotDetailPage = lazyRetry(() => import('./pages/AiChatbotDetailPage'))
const AiAgentDetailPage = lazyRetry(() => import('./pages/AiAgentDetailPage'))
const AiAgentsPage = lazyRetry(() => import('./pages/AiAgentsPage'))
const CommunicationChannelsPage = lazyRetry(() => import('./pages/CommunicationChannelsPage'))
const TechnologiesPage = lazyRetry(() => import('./pages/TechnologiesPage'))
const LearningCatalogPage = lazyRetry(() => import('./pages/LearningCatalogPage').then(m => ({ default: m.LearningCatalogPage })))
const LearningHomePage = lazyRetry(() => import('./pages/LearningCatalogPage').then(m => ({ default: m.LearningHomePage })))
const LearningTopicPage = lazyRetry(() => import('./pages/LearningTopicPage'))
const PythonTutorialsPage = lazyRetry(() => import('./pages/PythonTutorialsPage'))
const PythonTutorialPage = lazyRetry(() => import('./pages/PythonTutorialPage'))
const PythonTechHubPage = lazyRetry(() => import('./pages/PythonTechHubPage'))
const MortalAppsHub = lazyRetry(() => import('./pages/MortalAppsHub'))
const MortalAppsSysDesignPage = lazyRetry(() => import('./pages/MortalAppsSysDesignPage'))
const MortalAppsPythonCodePage = lazyRetry(() => import('./pages/MortalAppsPythonCodePage'))
const MortalAppsAgentsPage = lazyRetry(() => import('./pages/MortalAppsAgentsPage'))
const MortalAppsInfraPage = lazyRetry(() => import('./pages/MortalAppsInfraPage'))
const MortalAppsQuantumPage = lazyRetry(() => import('./pages/MortalAppsQuantumPage'))
const MortalAppsSemiPage = lazyRetry(() => import('./pages/MortalAppsSemiPage'))
const TradingPage = lazyRetry(() => import('./pages/TradingPage'))
const CommoditiesDashboard = lazyRetry(() => import('./pages/CommoditiesDashboard'))
const NeemKaroliBabaPage = lazyRetry(() => import('./pages/NeemKaroliBabaPage'))
const MortalAppsFullPage = lazyRetry(() => import('./pages/MortalAppsFullPage'))
const StudyByDoingView = lazyRetry(() => import('./pages/StudyByDoingView'))
const SbdSection = lazyRetry(() => import('./pages/SbdSection'))
const SbdFlashcards = lazyRetry(() => import('./pages/SbdFlashcards'))
const SbdProjects = lazyRetry(() => import('./pages/SbdProjects'))
const StudyByDoingReader = lazyRetry(() => import('./pages/StudyByDoingReader'))
const StudyByDoingResources = lazyRetry(() => import('./pages/StudyByDoingResources'))
const EuropeSettlementBlueprint = lazyRetry(() => import('./pages/EuropeSettlementBlueprint'))
const LearnHub = lazyRetry(() => import('./pages/LearnHub'))

export default function App() {
  return (
    <LangProvider>
      <Layout>
        <Suspense fallback={<div className="route-loading">Loading…</div>}>
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
        <Route path="/books" element={<LibraryHome />} />
        <Route path="/books/catalog" element={<BooksCatalog />} />
        <Route path="/book/ol/:id" element={<OpenLibraryBook />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/playbook/*" element={<PlaybookView />} />
        <Route path="/rapid-fire" element={<RapidFireView />} />
        <Route path="/rapid-fire/:deckId" element={<RapidFireView />} />
        <Route path="/ai-stack" element={<AiStackScreen />} />
        <Route path="/claude-cert" element={<ClaudeCertView />} />
        <Route path="/snowflake" element={<SnowflakeView />} />
        <Route path="/etl-guide" element={<EtlGuideView />} />
        <Route path="/ai-jobs-global" element={<AiEngineerJobs />} />
        <Route path="/projects" element={<ProjectsView />} />
        <Route path="/project/:id" element={<ProjectZoomView />} />
        <Route path="/linked-posts" element={<LinkedPostsView />} />
        <Route path="/video-hub" element={<VideoHub />} />
        <Route path="/python-masterhub" element={<PythonMasterHub />} />
        <Route path="/ai-techstack-ref" element={<AiTechStackReference />} />
        <Route path="/reference-library" element={<ReferenceLibrary />} />
        <Route path="/ai-tech-blogs" element={<AiTechBlogsDemand />} />
        <Route path="/ai-python-masterhub-pages" element={<AiPythonMasterHubPages />} />
        <Route path="/ai-python-masterhub-pages/:file" element={<AiPythonMasterHubPages />} />
        <Route path="/design-space" element={<AiDesignSpace />} />
        <Route path="/design-space/global" element={<GlobalDesignSpace />} />
        <Route path="/design-space/country/:slug" element={<CountryDesignSpace />} />
        <Route path="/design-space/pattern/:id" element={<DesignPatternDetail />} />
        <Route path="/design-space/sector/:id" element={<SectorDesignSpace />} />
        <Route path="/design-space/technology/:id" element={<TechnologyFlow />} />
        <Route path="/design-space/:id" element={<AiDesignSpaceDetail />} />
        <Route path="/learn" element={<LearnHub />} />
        <Route path="/learn/:libId/:topicId" element={<LearnTopic />} />
        <Route path="/learn/:libId" element={<LibraryView />} />
        <Route path="/learn/blog/:id?" element={<LearnBlog />} />
        <Route path="/learn/tests/:id?" element={<InterviewTests />} />
        <Route path="/learn/calculators" element={<Calculators />} />
        <Route path="/learn/*" element={<Navigate to="/learn" replace />} />
        <Route path="/ai-chatbots" element={<AiChatbotsPage />} />
        <Route path="/ai-chatbots/:chatbotId" element={<AiChatbotDetailPage />} />
        <Route path="/ai-agents" element={<AiAgentsPage />} />
        <Route path="/ai-agents/:agentId" element={<AiAgentDetailPage />} />
        <Route path="/communication-channels" element={<CommunicationChannelsPage />} />
        <Route path="/technologies" element={<TechnologiesPage />} />
        <Route path="/python-tutorials" element={<PythonTutorialsPage />} />
        <Route path="/python-tutorials/:tutorialId" element={<PythonTutorialPage />} />
        <Route path="/python-tech-hub" element={<PythonTechHubPage />} />
        <Route path="/trading" element={<TradingPage />} />
        <Route path="/commodities" element={<CommoditiesDashboard />} />
        <Route path="/neem-karoli-baba" element={<NeemKaroliBabaPage />} />
        <Route path="/study-by-doing" element={<StudyByDoingView />} />
        <Route path="/study-by-doing/study/:sectionId" element={<SbdSection />} />
        <Route path="/study-by-doing/flashcards" element={<SbdFlashcards />} />
        <Route path="/study-by-doing/projects" element={<SbdProjects />} />
        <Route path="/study-by-doing/resources" element={<StudyByDoingResources />} />
        <Route path="/europe-settlement" element={<EuropeSettlementBlueprint />} />
        <Route path="/study-by-doing/:slug" element={<StudyByDoingReader />} />
        <Route path="/mortalapps-hub" element={<MortalAppsFullPage />} />
        <Route path="/system-design" element={<MortalAppsSysDesignPage />} />
        <Route path="/python-code" element={<MortalAppsPythonCodePage />} />
        <Route path="/ai-agents-guide" element={<MortalAppsAgentsPage />} />
        <Route path="/ai-infrastructure" element={<MortalAppsInfraPage />} />
        <Route path="/quantum-computing" element={<MortalAppsQuantumPage />} />
        <Route path="/semiconductors" element={<MortalAppsSemiPage />} />
        <Route path="/learning" element={<LearningHomePage />} />
        <Route path="/learning/:catalogId" element={<LearningCatalogPage />} />
        <Route path="/learning/:catalogId/:topicId" element={<LearningTopicPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      </Layout>
    </LangProvider>
  )
}