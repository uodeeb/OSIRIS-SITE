import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
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

const EMPTY_PRIMARY_AUDIO_SOURCES: string[] = [];
const SITE_URL = "https://osirisnovel.online";
const AR_SITE_TITLE = "OSIRIS \u2014 \u0627\u0644\u0645\u0641\u0633\u062f\u0648\u0646 \u0641\u064a \u0627\u0644\u0623\u0631\u0636";
const AR_SITE_DESCRIPTION = "OSIRIS \u2014 \u0631\u0648\u0627\u064a\u0629 \u062a\u0641\u0627\u0639\u0644\u064a\u0629 \u0633\u064a\u0646\u0645\u0627\u0626\u064a\u0629 \u0639\u0646 \u0627\u0644\u0648\u0639\u064a \u0648\u0627\u0644\u0641\u0633\u0627\u062f \u0648\u0627\u0644\u062e\u0648\u0627\u0631\u0632\u0645\u064a\u0627\u062a \u0639\u0628\u0631 \u062e\u0637 \u0632\u0645\u0646\u064a \u062a\u0627\u0631\u064a\u062e\u064a.";

type SeoText = { title: string; description: string };

const ROUTE_SEO: Record<string, { en: SeoText; ar: SeoText }> = {
  "/": {
    en: {
      title: "OSIRIS \u2014 Interactive Cinematic Novel",
      description: "A bilingual cinematic web novel about consciousness, corruption, history, and algorithms.",
    },
    ar: { title: AR_SITE_TITLE, description: AR_SITE_DESCRIPTION },
  },
  "/play": {
    en: {
      title: "Play OSIRIS \u2014 Cinematic Reader",
      description: "Read and watch OSIRIS as a large-screen cinematic bilingual experience.",
    },
    ar: { title: AR_SITE_TITLE, description: AR_SITE_DESCRIPTION },
  },
  "/script": {
    en: {
      title: "OSIRIS Full Script",
      description: "Browse the recovered bilingual OSIRIS script and launch the canonical cinematic player.",
    },
    ar: { title: AR_SITE_TITLE, description: AR_SITE_DESCRIPTION },
  },
  "/model": {
    en: {
      title: "OSIRIS AI Model",
      description: "Explore the OSIRIS multimodal narrative model and cinematic generation system.",
    },
    ar: { title: AR_SITE_TITLE, description: AR_SITE_DESCRIPTION },
  },
  "/404": {
    en: {
      title: "Page not found \u2014 OSIRIS",
      description: "The requested OSIRIS page could not be found.",
    },
    ar: { title: AR_SITE_TITLE, description: AR_SITE_DESCRIPTION },
  },
};

function setMeta(selector: string, attribute: "content" | "href", value: string) {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

function useRouteSeo(location: string, lang: "en" | "ar") {
  useEffect(() => {
    const path = window.location.pathname;
    const routeKey = ROUTE_SEO[path] ? path : path.startsWith("/part-") ? "/script" : "/404";
    const seo = ROUTE_SEO[routeKey][lang];
    const scene = new URLSearchParams(window.location.search).get("scene");
    const canonicalPath = path === "/play" && scene ? "/play?scene=" + encodeURIComponent(scene) : path;
    const canonicalUrl = SITE_URL + (canonicalPath === "/" ? "/" : canonicalPath);

    document.title = seo.title;
    setMeta('meta[name="description"]', "content", seo.description);
    setMeta('meta[property="og:title"]', "content", seo.title);
    setMeta('meta[property="og:description"]', "content", seo.description);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[name="twitter:title"]', "content", seo.title);
    setMeta('meta[name="twitter:description"]', "content", seo.description);
    setMeta('link[rel="canonical"]', "href", canonicalUrl);
  }, [location, lang]);
}

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
  const [location] = useLocation();
  const showGlobalBackdrop = location !== "/play";

  useRouteSeo(location, isArabic ? "ar" : "en");

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
            <GlobalMediaLayer primaryAudioSources={EMPTY_PRIMARY_AUDIO_SOURCES} showBackdrop={showGlobalBackdrop} />
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
