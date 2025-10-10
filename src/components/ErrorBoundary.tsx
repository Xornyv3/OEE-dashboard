import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-white bg-[#020202]">
          <h1 className="text-xl mb-2">Something went wrong.</h1>
          <pre className="whitespace-pre-wrap text-[#9B9BA6]">{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
