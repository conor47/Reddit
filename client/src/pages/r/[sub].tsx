import { useRouter } from "next/router";
import useSWR from "swr";

import PostCard from "../../components/PostCard";

export default function Sub() {
  const router = useRouter();

  const subName = router.query.sub;

  const { data: sub } = useSWR(subName ? `/subs/${subName}` : null);

  return (
    <div className="container flex pt-5">
      {sub && (
        <div className="w-160">
          {sub.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
