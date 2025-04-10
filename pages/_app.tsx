import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AppProvider } from '../context/AppContext';
import { ThemeProvider, THEME_ID } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../utils/createEmotionCache';
import theme from '../styles/theme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import CustomDateAdapter from '../lib/dateAdapter';

// Client-side cache, shared for the whole session of the user in the browser
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }: MyAppProps) {

  return (
    <CacheProvider value={emotionCache}>
      <AppProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Bean Counter - Coffee Shop ERP</title>
          <meta name="description" content="A comprehensive ERP system for coffee shops" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <LocalizationProvider dateAdapter={CustomDateAdapter}>
            <Component {...pageProps} />
          </LocalizationProvider>
        </ThemeProvider>
      </AppProvider>
    </CacheProvider>
  );
}

export default MyApp; 