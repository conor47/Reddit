import { Router, Request, Response, request } from "express";
import { off } from "process";
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import Sub from "../entities/Sub";

import auth from "../middleware/auth";
import user from "../middleware/user";

const createPost = async (req: Request, res: Response) => {
  const { title, body, sub } = req.body;

  const user = res.locals.user;

  if (title.trim() === "") {
    res.status(400).json({ title: "Title must not be empty" });
  }

  try {
    const subRecord = await Sub.findOneOrFail({ name: sub });

    const post = new Post({ title, body, user, sub: subRecord });
    await post.save();

    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "something went wrong" });
  }
};

// A route for returning all of the recent posts across the subs

const getPosts = async (_: Request, res: Response) => {
  try {
    // we fetch all posts. We order them by createdAt in descending order
    const posts = await Post.find({
      order: { createdAt: "DESC" },
      relations: ["comments", "votes", "sub"],
    });

    // if the user is logged in we want to return the users vote on each post. This will allow us to
    // display on the frontend which posts a user has voted on

    if (res.locals.user) {
      posts.forEach((p) => p.setUserVote(res.locals.user));
    }
    return res.json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// A route for fetching a single post

const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;

  try {
    // we fetch all posts. We order them by createdAt in descending order
    const post = await Post.findOneOrFail(
      { identifier, slug },
      {
        relations: ["sub", "votes", "comments"],
      }
    );

    if (res.locals.user) {
      post.setUserVote(res.locals.user);
    }

    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Post not found" });
  }
};

const commentOnPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const body = req.body.body;

  try {
    const post = await Post.findOneOrFail({ identifier, slug });

    const comment = new Comment({
      body,
      user: res.locals.user,
      post,
    });

    await comment.save();
    return res.json(comment);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Post not found" });
  }
};

// route for fetching all comments on a post

const getPostComments = async (req: Request, res: Response) => {
  const { identifier, slug } = request.params;
  try {
    const post = await Post.findOneOrFail({ identifier, slug });

    const comments = await Comment.find({
      where: { post },
      order: { createdAt: "DESC" },
      relations: ["votes"],
    });

    if (res.locals.user) {
      comments.forEach((comment) => comment.setUserVote(res.locals.user));
    }

    return res.json(comments);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const router = Router();

// if we get to the createPost function it means we have a user as if not an error would have been thrown
// from inside the auth middleware
router.post("/", user, auth, createPost);

router.get("/", user, getPosts);

router.get("/:identifier/:slug", user, getPost);

router.post("/:identifier/:slug/comments", user, auth, commentOnPost);

router.get("/:identifier/:slug/comments", user, commentOnPost);

export default router;
