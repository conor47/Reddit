import Axios from 'axios';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr';

import { AuthProvider } from '../context/auth';

import '../styles/tailwind.css';
import '../styles/icons.css';

import Navbar from '../components/Navbar';
import axios from 'axios';

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/api';
Axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  // some logic using the useRouter hook to determine what page we are on. We use this to conditionally render the
  // navebar so that we do not render the navbar on the login and register page
  const { pathname } = useRouter();
  const authRoutes = ['/register', '/login'];
  const authRoute = authRoutes.includes(pathname);

  const fetcher = async (url: string) => {
    try {
      const res = await Axios.get(url);
      return res.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  return (
    <SWRConfig
      value={{
        fetcher,
        dedupingInterval: 1000,
      }}
    >
      <AuthProvider>
        {!authRoute && <Navbar />}
        <div className={authRoute ? '' : 'pt-12'}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
