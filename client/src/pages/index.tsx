/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { Fragment, useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Post } from "../types";

dayjs.extend(relativeTime);

// To implement server side dering for the posts all we need to do is destructure props in the
// functional component below. These props are returned by the function at the bottom, getServerSideProps

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
                <div className="flex items-center">
                  <Link href={`/r/${post.subName}`}>
                    <Fragment>
                      <img
                        src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                        alt="gravatar"
                        className="h-6 mr-1 rounded-full cursor-pointer"
                      />
                      <a className="text-xs font-bold cursor-pointer hover:underline">
                        /r/{post.subName}
                      </a>
                    </Fragment>
                  </Link>
                  <p className="text-gray-500 text-excess">
                    <span className="mx-1">•</span>
                    Posted by
                    <Link href={`/u/${post.username}`}>
                      <a href="" className="mx-1 hover:underline">
                        /u/{post.username}
                      </a>
                    </Link>
                    <Link
                      href={`/r/${post.subName}/${post.identifier}/${post.slug}`}
                    >
                      <a href="" className="mx-1 hover:underline">
                        {dayjs(post.createdAt).fromNow()}
                      </a>
                    </Link>
                  </p>
                </div>
                <Link href={post.url}>
                  <a className="my-1 text-lg font-medium">{post.title}</a>
                </Link>
                {post.body && <p className="my-1 text-sm">{post.body}</p>}
                <div className="flex">
                  <Link href={post.url}>
                    <a>
                      <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                        <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                        <span className="font-bold">20 comments</span>
                      </div>
                    </a>
                  </Link>
                  <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                    <i className="mr-1 fas fa-bookmark fa-xs"></i>
                    <span className="font-bold">Share</span>
                  </div>
                  <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                    <i className="mr-1 fas fa-share fa-xs"></i>
                    <span className="font-bold">Save</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// This is a function that will run on the server side before the page is created and rendered and it perform some action. We could fetch
// data and send that data with the page to render with the page

// This is an alternative to the current approach where we are performing client side rendering. We initially load the page. Using the useEffect hook
// we then perform a server request for the data (posts) and we the render again

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const res = await axios.get("/posts");

//     return { props: { posts: res.data } };
//   } catch (error) {
//     return { props: { error: "Something went wrong" } };
//   }
// };
