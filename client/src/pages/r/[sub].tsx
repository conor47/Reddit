import Head from "next/head";
import { useRouter } from "next/router";
import {  Fragment, useRef } from "react";
import useSWR from "swr";
import Image from "next/image";
import classnames from 'classnames'

import PostCard from "../../components/PostCard";
import { Sub } from "../../types";
import {useAuthState} from "../../context/auth"

export default function SubName() {
  // Local state
  // Global state
  const {authenticated,user} = useAuthState()
  // Utils
  const fileInputRef = useRef()
  const router = useRouter();

  const subName = router.query.sub;

  const { data: sub, error } = useSWR<Sub>(subName ? `/subs/${subName}` : null);

  if (error) {
    router.push("/");
  }

  let postsMarkup;
  if (!sub) {
    postsMarkup = <p className="text-center text-large">Loading...</p>;
  } else if (sub.posts.length === 0) {
    postsMarkup = (
      <p className="text-center text-large">No posts submitted yet</p>
    );
  } else {
    postsMarkup = sub.posts.map((post) => (
      <PostCard key={post.identifier} post={post} />
    ));
  }

  return (
    <div>
      <Head>
        <title>{sub?.title}</title>
      </Head>
      {sub && (
        <Fragment>
          input type="file" hidden={true} ref={fileInputRef} />
          {/* sub info and images */}
          <div>
            {/* Banner image */}
            <div className="bg-blue-500">
              {sub.bannerUrl ? (
                <div
                  className="h-40 bg-blue-500"
                  style={{
                    backgroundImage: `url(${sub.bannerUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              ) : (
                <div className="h-20 bg-blue-500"> </div>
              )}
            </div>
            {/* Sub meta data */}
            <div className="h-20 bg-white">
              <div className="container relative flex">
                <div className="absolute" style={{ top: -15 }}>
                  <Image
                    src={sub.imageUrl}
                    alt="Sub"
                    className="rounded-full"
                    width={70}
                    height={70}
                  />
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items center">
                    <h1 className="mb-1 text-3xl font-bold">{sub.title}</h1>
                  </div>
                  <p className="font-bold text-gray-500 text-small">
                    /r/{sub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* posts and sidebar */}
          <div className="container flex pt-5">
            <div className="w-160">{postsMarkup}</div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
