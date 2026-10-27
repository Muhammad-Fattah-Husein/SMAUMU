import React from 'react';
import { AlertTriangle, RefreshCw, Trash2, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.hash = '#/';
    window.location.reload();
  };

  handleResetStorage = () => {
    try {
      localStorage.clear();
    } catch (_) {}
    window.location.hash = '#/';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-smaumu-base flex items-center justify-center p-4 font-body text-gray-800">
          <div className="max-w-lg w-full bg-smaumu-surface rounded-3xl p-8 border border-gray-200 shadow-2xl space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-2xl bg-smaumu-primary text-white flex items-center justify-center mx-auto shadow-lg shadow-smaumu-primary/20">
              <AlertTriangle className="w-8 h-8 text-smaumu-accent" />
            </div>

            <div className="space-y-2">
              <span className="font-heading px-3 py-1 rounded-full text-xs font-black bg-smaumu-primary text-white">
                TERJADI KESALAHAN TAMPILAN
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Oops, Halaman Tidak Dapat Dimuat
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                Terjadi kendala saat merender komponen. Anda dapat memuat ulang halaman atau mereset data sesi lokal Anda di bawah ini.
              </p>
            </div>

            {this.state.error && (
              <details className="text-left bg-gray-50 p-3.5 rounded-2xl border border-gray-200 text-xs">
                <summary className="font-bold text-smaumu-primary cursor-pointer select-none">
                  Lihat Detail Teknis Error
                </summary>
                <pre className="mt-2 text-[11px] text-gray-700 overflow-x-auto whitespace-pre-wrap font-mono">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="font-heading flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-smaumu-primary text-white font-bold text-xs sm:text-sm hover:bg-[#B30F20] shadow-md transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Muat Ulang Halaman</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="font-heading flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gray-100 border border-gray-300 text-gray-800 font-bold text-xs sm:text-sm hover:bg-gray-200 shadow-sm transition"
              >
                <Home className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </button>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={this.handleResetStorage}
                className="font-body inline-flex items-center space-x-1.5 text-xs text-smaumu-primary hover:underline font-bold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Cache &amp; Data Sesi Lokal (Storage)</span>
              </button>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
