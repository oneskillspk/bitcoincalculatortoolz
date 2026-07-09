import React, { Component, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const isTR = typeof window !== 'undefined' && window.location.pathname.startsWith('/tr');
      const heading = isTR ? 'Bir şeyler ters gitti' : 'Something went wrong';
      const body = isTR
        ? 'İsteğiniz işlenirken beklenmeyen bir hata oluştu.'
        : 'An unexpected error occurred while processing your request.';
      const unknown = isTR ? 'Bilinmeyen hata' : 'Unknown error';
      const retry = isTR ? 'Tekrar Dene' : 'Try Again';

      return this.props.fallback || (
        <Card className="glass-morphism-card border-destructive/20">
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-destructive" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <h3 className="text-h3 font-bold text-foreground">{heading}</h3>
                <p className="text-foreground/70">{body}</p>
                <p className="text-sm text-muted-foreground font-mono bg-background/50 p-2 rounded border break-words">
                  {this.state.error?.message || unknown}
                </p>
              </div>
              <Button
                onClick={() => this.setState({ hasError: false })}
                className="btn-premium"
              >
                <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                {retry}
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}