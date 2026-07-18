import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Lazy loaded pages for performance optimization
const Home = React.lazy(() => import('./pages/Home'))
const Layout = React.lazy(() => import('./pages/Layout'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const BlogTitles = React.lazy(() => import('./pages/BlogTitles'))
const WriteArticle = React.lazy(() => import('./pages/WriteArticle'))
const RemoveBackground = React.lazy(() => import('./pages/RemoveBackground'))
const RemoveObject = React.lazy(() => import('./pages/RemoveObject'))
const ResumeAnalyzer = React.lazy(() => import('./pages/ResumeAnalyzer'))
const GenerateImages = React.lazy(() => import('./pages/GenerateImages'))
const AiChat = React.lazy(() => import('./pages/AiChat'))
const PdfSummarizer = React.lazy(() => import('./pages/PdfSummarizer'))
const CodeGenerator = React.lazy(() => import('./pages/CodeGenerator'))
const Settings = React.lazy(() => import('./pages/Settings'))

const App = () => {
  return (
    <div>
      <Toaster />
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-app-bg"><div className="animate-spin rounded-full h-12 w-12 border-4 border-app-border border-t-primary"></div></div>}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/ai' element={<Layout />}>
            <Route index element={<Dashboard/>}/>
            <Route path='write-article' element={<WriteArticle/>}/>
            <Route path='blog-titles' element={<BlogTitles/>}/>
            <Route path='generate-images' element={<GenerateImages/>}/>
            <Route path='remove-background' element={<RemoveBackground/>}/>
            <Route path='remove-object' element={<RemoveObject/>}/>
            <Route path='resume-analyzer' element={<ResumeAnalyzer/>}/>
            <Route path='ai-chat' element={<AiChat/>}/>
            <Route path='pdf-summarizer' element={<PdfSummarizer/>}/>
            <Route path='code-generator' element={<CodeGenerator/>}/>
            <Route path='settings' element={<Settings/>}/>
          </Route>
        </Routes>
      </Suspense>
    </div>
  )
}

export default App