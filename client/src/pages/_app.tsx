import Axios from "axios";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

import { AuthProvider } from "../context/auth";

import "../styles/tailwind.css";
import "../styles/icons.css";

import Navbar from "../components/Navbar";

Axios.defaults.baseURL = "http://localhost:5000/api";
Axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  // some logic using the useRouter hook to determine what page we are on. We use this to conditionally render the
  // navebar so that we do not render the navbar on the login and register page
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);

  return (
    <AuthProvider>
      {!authRoute && <Navbar />}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default App;
