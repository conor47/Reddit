/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { GetServerSideProps } from "next";
import { Fragment, useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useSWR, { useSWRInfinite } from "swr";
import Image from "next/image";

import { Post, Sub } from "../types";
import PostCard from "../components/PostCard";
import Link from "next/link";
import { useAuthState } from "../context/auth";

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

  // for tracking the bottom post for infinite loading
  const [observedPost, setObservedPost] = useState('')

  // const { data: posts } = useSWR<Post[]>("/posts");
  const { data: topSubs } = useSWR<Sub[]>("/misc/top-subs");

  const {authenticated} = useAuthState()

  const { data, error, mutate, size: page, setSize: setPage, isValidating } = useSWRInfinite<Post[]>(
    index =>
      `/posts/?page=${index}`,
  );


  const posts: Post[] = data ? [].concat(...data) : [];
  const isLoadingInitialData = !data && !error;

  useEffect(() => {
    if(!posts || posts.length === 0) return
    
    const id = posts[posts.length - 1].identifier
    if(id !== observedPost){
      setObservedPost(id)
      observerElement(document.getElementById(id))
    }
  },[posts])

  // we will use the intersection API to observe the last post on the page and track when the bottom of that post / div comes 
  // into view on the viewport
  const observerElement = (element: HTMLElement) => {
    if(!element) return
    const observer = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting === true){
        setPage(page+1)
        observer.unobserve(element)
      }
    }, { threshold: 1})
    observer.observe(element)
  }

  return (
    <Fragment>
      <Head>
        <title>Reddit: The frontpage of the internet</title>
      </Head>
      <div className="container flex pt-4 mx-auto">
        {/* Posts feed */}
        <div className="w-full px-4 md:w-160 md:p-0">
          {posts?.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>
        {/* Sidebar */}
        <div className="hidden ml-6 md:block w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top Communities
              </p>
            </div>
            <div>
              {topSubs?.map((sub ) => (
                <div
                  key={sub.name}
                  className="flex items-center px-4 py-2 text-xs border-b"
                >
                
                    <Link href={`/r/${sub.name}`}  >
                      <a>
                      <Image
                        src={sub.imageUrl}
                        className="rounded-full cursor-pointer"
                        alt="Sub"
                        width={(6 * 16) / 4}
                        height={(6 * 16) / 4}
                      />
                      </a>
                    </Link>
  
                  <Link href={`/r/${sub.name}`}>
                    <a className="ml-2 font-bold hover:cursor-pointer">
                      /r/{sub.name}
                    </a>
                  </Link>
                  <p className="ml-auto font-medium">{sub.postCount}</p>
                </div>
              ))}
            </div>
            {authenticated && (
              <div className="p-4 border-t-2">
                <Link href="/subs/create" >
                  <a className="w-full px-2 py-1 blue button">Create Community</a>
                </Link>
              </div>
            )}
            
          </div>
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
