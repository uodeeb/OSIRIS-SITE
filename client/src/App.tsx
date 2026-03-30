import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { MainPlayer } from "@/components/MainPlayer";
import FullScript from "./pages/FullScript";
import { initAssetOverrides } from "@/lib/assetOverrides";
function PlayRoute() {
  // Support ?scene=xxx query param for direct scene access
  const params = new URLSearchParams(window.location.search);
  const sceneId = params.get('scene') || 'zero-1-1-summons';
  return <MainPlayer initialSceneId={sceneId} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/script" component={FullScript} />
      <Route path="/play" component={PlayRoute} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}
function App() {
  useEffect(() => {
    initAssetOverrides({ timeoutMs: 1200 }).catch(() => undefined);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}


export default App;
