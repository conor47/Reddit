import "../styles/globals.css";
import Axios from "axios";

Axios.defaults.baseURL = "http://localhost:5000/api";

import { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
