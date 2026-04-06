import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function RouteErrorFallback({ error }: { error: Error }) {
  const [, setLocation] = useLocation();

  return (
    <div className="flex items-center justify-center min-h-dvh p-8 bg-background">
      <div className="flex flex-col items-center w-full max-w-2xl p-8 text-center">
        <AlertTriangle
          size={64}
          className="text-destructive mb-6 flex-shrink-0"
        />

        <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
        
        <p className="text-muted-foreground mb-6 max-w-md">
          We encountered an unexpected error while loading this page. 
          You can try refreshing or return to the home page.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="p-4 w-full rounded bg-muted overflow-auto mb-6 text-left">
            <h3 className="font-semibold mb-2">Error Details:</h3>
            <pre className="text-sm text-muted-foreground whitespace-break-spaces">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </div>
        )}

        <div className="flex gap-4 flex-wrap justify-center">
          <Button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Refresh Page
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setLocation('/')}
            className="flex items-center gap-2"
          >
            <Home size={16} />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
