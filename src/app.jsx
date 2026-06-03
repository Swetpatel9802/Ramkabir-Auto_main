import { Suspense, lazy } from "react"
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { LanguageProvider } from '@/context/LanguageContext'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';

const BrandInventory = lazy(() => import('./pages/BrandInventory'));
const FullInventory = lazy(() => import('./pages/FullInventory'));
const Admin = lazy(() => import('./pages/Admin'));
const ProductPage = lazy(() => import('./pages/ProductPage'));

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

function RouteFallback() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-lg text-slate-500 animate-pulse">Loading...</div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <LanguageProvider>
        <Router>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={
                <LayoutWrapper currentPageName={mainPageKey}>
                  <MainPage />
                </LayoutWrapper>
              } />
              {Object.entries(Pages).map(([path, Page]) => (
                <Route
                  key={path}
                  path={`/${path}`}
                  element={
                    <LayoutWrapper currentPageName={path}>
                      <Page />
                    </LayoutWrapper>
                  }
                />
              ))}
              <Route path="/inventory" element={<FullInventory />} />
              <Route path="/inventory/:vehicleType/:brand" element={<BrandInventory />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </Router>
        <Toaster />
      </LanguageProvider>
    </QueryClientProvider>
  )
}

export default App
