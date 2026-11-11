import { Html, Head, Main, NextScript } from 'next/document';

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').trim();

export default function Document() {
  return (
    <Html lang="id" className="dark scroll-smooth">
      <Head>
        <link rel="icon" type="image/svg+xml" href={`${basePath}/favicon.svg?v=5`} />
        <link rel="shortcut icon" type="image/svg+xml" href={`${basePath}/favicon.svg?v=5`} />
        <link rel="apple-touch-icon" href={`${basePath}/favicon.svg?v=5`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-[#121212] text-[#E2E8F0] antialiased selection:bg-[#F97316] selection:text-white">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('smaumu_theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('theme-light');}}catch(e){}})();`
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
