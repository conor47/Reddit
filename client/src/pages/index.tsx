import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";

import { Post } from "../types";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  // use effect hook for fetching all of the posts

  useEffect(() => {
    axios
      .get("/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="pt-12">
      <Head>
        <title>Reddit: The frontpage of the internet</title>
      </Head>
      <div className="container flex pt-4 mx-auto">
        {/* Posts feed */}
        <div className="w-160">
          {posts.map((post) => (
            <div key={post.identifier} className="flex mb-4 bg-white rounded">
              {/* vote section */}
              <div className="w-10 text-center bg-gray-200 rounded-l">
                <p>V</p>
              </div>
              {/* post data section */}
              <div className="w-full p-2">
                <p>{post.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
