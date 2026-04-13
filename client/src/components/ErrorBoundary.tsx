import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Error Boundary — catches runtime errors in child components
 * and displays a recovery UI instead of a white screen.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to error tracking service in production
    if (typeof window !== "undefined" && (window as any).__OSIRIS_REPORT_ERROR__) {
      (window as any).__OSIRIS_REPORT_ERROR__(error, errorInfo);
    } else {
      console.error("[ErrorBoundary]", error, errorInfo);
    }
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-6"
          dir="rtl"
        >
          <div className="max-w-md text-center space-y-6">
            <div className="text-6xl">⚠️</div>
            <h1 className="text-2xl font-bold text-amber-400">حدث خطأ غير متوقع</h1>
            <p className="text-gray-400 text-sm">
              عذراً، واجه التطبيق خطأ تقنياً. يمكنك محاولة إعادة تحميل الصفحة.
            </p>
            {this.state.error && process.env.NODE_ENV === "development" && (
              <details className="text-left text-xs text-gray-500 bg-gray-900 p-4 rounded-lg max-h-48 overflow-auto">
                <summary className="cursor-pointer text-gray-400 mb-2">Error Details (Dev Only)</summary>
                <pre className="whitespace-pre-wrap break-all">{this.state.error.message}</pre>
                <pre className="whitespace-pre-wrap break-all mt-2">{this.state.error.stack}</pre>
              </details>
            )}
            <button
              onClick={this.handleRetry}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-black font-semibold rounded-lg transition-colors"
            >
              إعادة تحميل الصفحة
            </button>
            <a
              href="/"
              className="block text-amber-400 hover:text-amber-300 text-sm underline"
            >
              العودة إلى الصفحة الرئيسية
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
