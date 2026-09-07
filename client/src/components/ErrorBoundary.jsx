import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error(
        "Uygulama render hatası:",
        error,
        errorInfo
      );
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="page-state app-error-boundary">
          <span>Unexpected error / 500</span>

          <h1>Bir şeyler ters gitti.</h1>

          <p>
            Sayfa görüntülenirken beklenmeyen bir hata oluştu.
            Tekrar deneyebilir veya ana sayfaya dönebilirsin.
          </p>

          <div className="app-error-boundary__actions">
            <button
              className="light-button"
              type="button"
              onClick={this.handleReload}
            >
              Tekrar dene
            </button>

            <a className="inline-link" href="/">
              Ana sayfaya dön
            </a>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;