/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { Fragment, useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useSWR from "swr";

import { Post } from "../types";
import PostCard from "../components/PostCard";

dayjs.extend(relativeTime);

// To implement server side dering for the posts all we need to do is destructure props in the
// functional component below. These props are returned by the function at the bottom, getServerSideProps©

export default function Home() {
  // The below code is replaced by the call to useSWR below

  // const [posts, setPosts] = useState<Post[]>([]);

  // // use effect hook for fetching all of the posts

  // useEffect(() => {
  //   axios
  //     .get("/posts")
  //     .then((res) => setPosts(res.data))
  //     .catch((err) => console.log(err));
  // }, []);
  const { data: posts } = useSWR("/posts");

  return (
    <Fragment>
      <Head>
        <title>Reddit: The frontpage of the internet</title>
      </Head>
      <div className="container flex pt-4 mx-auto">
        {/* Posts feed */}
        <div className="w-160">
          {posts?.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>
      </div>
    </Fragment>
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
