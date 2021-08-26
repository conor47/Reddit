import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import classnames from "classnames";

import Sidebar from "../../components/Sidebar";
import PostCard from "../../components/PostCard";
import { Sub } from "../../types";
import { useAuthState } from "../../context/auth";
import axios from "axios";

export default function SubName() {
  // Local state
  const [ownSub, setOwnSub] = useState(false);
  // Global state
  const { authenticated, user } = useAuthState();
  // Utils
  const fileInputRef = useRef(null);
  const router = useRouter();

  const subName = router.query.sub;

  const {
    data: sub,
    error,
    revalidate,
  } = useSWR<Sub>(subName ? `/subs/${subName}` : null);

  // we will compare the logged in user with the owner of the sub. If they match we set ownSub state to the true.
  // we do this in a useffect call becuase initally upon first render there will not be a sub. we are getting the sub through a
  // useSWR call

  useEffect(() => {
    if (!sub) return;
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub]);

  if (error) {
    router.push("/");
  }

  const openFileInput = (type: string) => {
    if (!ownSub) return;
    fileInputRef.current.name = type;
    fileInputRef.current.click();
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileInputRef.current.name);

    try {
      const res = await axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      revalidate();
    } catch (error) {
      console.log(error);
    }
  };

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
          <input
            type="file"
            hidden={true}
            ref={fileInputRef}
            onChange={uploadImage}
          />
          {/* sub info and images */}
          <div>
            {/* Banner image */}
            <div
              className={classnames("bg-blue-500", {
                "cursor-pointer": ownSub,
              })}
              onClick={() => openFileInput("banner")}
            >
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
                    className={classnames("rounded-full", {
                      "cursor-pointer": ownSub,
                    })}
                    width={70}
                    height={70}
                    onClick={() => openFileInput("image")}
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
            <Sidebar sub={sub} />
          </div>
        </Fragment>
      )}
    </div>
  );
}
