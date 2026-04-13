import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { loadAssetManifest } from "@/lib/assets";
import { MediaControllerProvider } from "./contexts/MediaControllerContext";
import { useMediaState } from "./contexts/MediaStateContext";
import { useMediaActions } from "./contexts/MediaActionsContext";
import { GlobalMediaLayer } from "@/components/GlobalMediaLayer";
import { PlayerSkeleton, ModelSkeleton, PageSkeleton } from "@/components/LoadingSkeletons";
import { useSmartPreloader } from "@/utils/preloading";
import { usePerformanceMonitor } from "@/utils/performance";

// Lazy load heavy components for code splitting
const MainPlayer = lazy(() => import("@/components/MainPlayer"));
const OsirisAIModel = lazy(() => import("./pages/OsirisAIModel"));
const ComponentShowcase = lazy(() => import("./pages/ComponentShowcase"));
const FullScript = lazy(() => import("./pages/FullScript"));
const AssetDemoPage = lazy(() => import("./pages/AssetDemoPage"));
const EnhancedHome = lazy(() => import("./pages/EnhancedHome"));

// Lazy load part pages (these are large and only used for specific routes)
const PartOne = lazy(() => import("./pages/PartOne"));
const PartTwo = lazy(() => import("./pages/PartTwo"));
const PartThree = lazy(() => import("./pages/PartThree"));
const PartFour = lazy(() => import("./pages/PartFour"));
const PartFive = lazy(() => import("./pages/PartFive"));
const PartSix = lazy(() => import("./pages/PartSix"));
const PartZero = lazy(() => import("./pages/PartZero"));

function PlayRoute() {
  const params = new URLSearchParams(window.location.search);
  const sceneId = params.get('scene') || 'zero-1-1-summons';
  return (
    <Suspense fallback={<PlayerSkeleton />}>
      <ErrorBoundary>
        <MainPlayer initialSceneId={sceneId} />
      </ErrorBoundary>
    </Suspense>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Suspense fallback={<PageSkeleton />}>
          <EnhancedHome />
        </Suspense>
      </Route>
      <Route path="/model">
        <Suspense fallback={<ModelSkeleton />}>
          <OsirisAIModel />
        </Suspense>
      </Route>
      <Route path="/play" component={PlayRoute} />
      <Route path="/showcase">
        <Suspense fallback={<PageSkeleton />}>
          <ComponentShowcase />
        </Suspense>
      </Route>
      <Route path="/script">
        <Suspense fallback={<PageSkeleton />}>
          <FullScript />
        </Suspense>
      </Route>
      <Route path="/demo">
        <Suspense fallback={<PageSkeleton />}>
          <AssetDemoPage />
        </Suspense>
      </Route>
      <Route path="/part-0">
        <Suspense fallback={<PageSkeleton />}>
          <PartZero />
        </Suspense>
      </Route>
      <Route path="/part-1">
        <Suspense fallback={<PageSkeleton />}>
          <PartOne />
        </Suspense>
      </Route>
      <Route path="/part-2">
        <Suspense fallback={<PageSkeleton />}>
          <PartTwo />
        </Suspense>
      </Route>
      <Route path="/part-3">
        <Suspense fallback={<PageSkeleton />}>
          <PartThree />
        </Suspense>
      </Route>
      <Route path="/part-4">
        <Suspense fallback={<PageSkeleton />}>
          <PartFour />
        </Suspense>
      </Route>
      <Route path="/part-5">
        <Suspense fallback={<PageSkeleton />}>
          <PartFive />
        </Suspense>
      </Route>
      <Route path="/part-6">
        <Suspense fallback={<PageSkeleton />}>
          <PartSix />
        </Suspense>
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const mediaState = useMediaState();
  const preloader = useSmartPreloader();
  const performanceMonitor = usePerformanceMonitor();
  const isArabic = mediaState.uiLang === "ar";

  useEffect(() => {
    // Start performance monitoring
    performanceMonitor.startRuntimeMonitoring();
    
    // Preload critical assets on idle (only if they exist in manifest)
    // Note: Assets are loaded via manifest system, see lib/assets.ts
    const criticalAssets: string[] = [];
    
    if (criticalAssets.length > 0) {
      preloader.preloadOnIdle(criticalAssets);
    }
    
    // Cleanup on unmount
    return () => {
      performanceMonitor.cleanup();
    };
  }, [preloader, performanceMonitor]);

  return (
    <div dir={isArabic ? "rtl" : "ltr"}>
      <a href="#main-content" className="sr-only focus:not-sr-only absolute left-0 top-0 z-[999] bg-black p-4 text-white underline">
        Skip to main content
      </a>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="dark" switchable={false}>
          <TooltipProvider>
            <Toaster />
            <GlobalMediaLayer primaryAudioSources={[]} />
            <main id="main-content" tabIndex={-1} className="focus:outline-none">
              <Router />
            </main>
          </TooltipProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Initialize asset manifest on app startup
    loadAssetManifest().catch((err) => {
      console.warn('[App] Failed to load asset manifest:', err);
    });
  }, []);

  return (
    <MediaControllerProvider>
      <AppContent />
    </MediaControllerProvider>
  );
}

export default App;
