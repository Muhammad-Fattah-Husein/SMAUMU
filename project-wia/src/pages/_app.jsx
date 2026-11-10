import '@/styles/globals.css';
import { useEffect } from 'react';
import Head from 'next/head';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { setupClientApiInterceptor } from '@/utils/fetchInterceptor';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    setupClientApiInterceptor();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Head>
          <title>SMAUMU - SMAN UntukMu | Designing Digital Futures</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="description"
            content="Portal transparansi penerimaan siswa baru SMAN berbasis pengolahan data real-time, komparasi validitas, dan pelacakan publik untuk Web In Action (WIA) MIA 2026."
          />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </Head>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}
