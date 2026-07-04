import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { LuxuryButton } from '../ui/LuxuryButton';
import { logClientError } from '../../lib/monitoring';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    logClientError(error);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-pearl dark:bg-obsidian flex flex-col items-center justify-center p-6 text-center transition-colors duration-300 font-sans">
          <GlassCard className="p-8 max-w-md border-gold-primary/20" hoverEffect={false}>
            <div className="w-16 h-16 bg-gold-primary/10 border border-gold-primary/30 text-gold-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h1 className="font-serif text-2xl text-gold-primary mb-3">Showroom Interrupted</h1>
            <p className="text-xs text-obsidian/60 dark:text-pearl/50 leading-relaxed mb-6 font-light">
              An unexpected client-side exception has occurred. We have logged this event for production monitoring.
            </p>

            {this.state.error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/25 text-rose-500 rounded text-[10px] font-mono text-left mb-6 overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="flex gap-4">
              <LuxuryButton 
                variant="outline" 
                size="sm" 
                className="flex-1 text-[11px]" 
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </LuxuryButton>
              <LuxuryButton 
                variant="gold" 
                size="sm" 
                className="flex-1 text-[11px] flex items-center justify-center gap-1.5" 
                onClick={this.handleReset}
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reload Page
              </LuxuryButton>
            </div>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
