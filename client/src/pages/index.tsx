import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";

import RedditLogo from "../../public/images/redditLogo.svg";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Reddit: The frontpage of the internet</title>
      </Head>
      <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 bg-white">
        {/* logo and title */}
        <div className="flex items-center">
          <Link href="/">
            <a>
              <RedditLogo className="w-8 h-8 mr-2"></RedditLogo>
            </a>
          </Link>
          <span className="text-2xl font-semibold">
            <Link href="/">reddit</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
