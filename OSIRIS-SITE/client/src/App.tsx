import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import EnhancedHome from "./pages/EnhancedHome";
import { initAssetOverrides } from "@/lib/assetOverrides";
import { MediaControllerProvider, useMediaController } from "./contexts/MediaControllerContext";
import { GlobalMediaLayer } from "@/components/GlobalMediaLayer";
import { MediaTransportBar } from "@/components/MediaTransportBar";
const MainPlayer = lazy(() => import("@/components/MainPlayer").then((m) => ({ default: m.MainPlayer })));
const OsirisAIModel = lazy(() => import("./pages/OsirisAIModel"));
function PlayRoute() {
  // Support ?scene=xxx query param for direct scene access
  const params = new URLSearchParams(window.location.search);
  const sceneId = params.get('scene') || 'zero-1-1-summons';
  return (
    <Suspense fallback={null}>
      <MainPlayer initialSceneId={sceneId} />
    </Suspense>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={EnhancedHome} />
      <Route path="/model">
        <Suspense fallback={null}>
          <OsirisAIModel />
        </Suspense>
      </Route>
      <Route path="/play" component={PlayRoute} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}
function AppContent() {
  const { state: mediaState } = useMediaController();
  const isArabic = mediaState.uiLang === "ar";

  return (
    <div dir={isArabic ? "rtl" : "ltr"}>
      <a href="#main-content" className="sr-only focus:not-sr-only absolute left-0 top-0 z-[999] bg-black p-4 text-white underline">
        Skip to main content
      </a>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="dark" switchable={false}>
          <TooltipProvider>
            <Toaster />
            <GlobalMediaLayer />
            <main id="main-content" tabIndex={-1} className="focus:outline-none">
              <Router />
              <MediaTransportBar />
            </main>
          </TooltipProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </div>
  );
}

function App() {
  useEffect(() => {
    initAssetOverrides({ timeoutMs: 1200 }).catch(() => undefined);
  }, []);

  return (
    <MediaControllerProvider>
      <AppContent />
    </MediaControllerProvider>
  );
}


export default App;
