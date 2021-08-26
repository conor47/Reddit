// collection of miscellaneous routes
import { Router } from "express";
import { Request, Response } from "express-serve-static-core";
import { getConnection } from "typeorm";

import Comment from "../entities/Comment";
import Post from "../entities/Post";
import Sub from "../entities/Sub";
import User from "../entities/User";
import Vote from "../entities/Vote";
import auth from "../middleware/auth";
import user from "../middleware/user";

const router = Router();

const vote = async (req: Request, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body;

  // todo Validate vote value
  if (![-1, 0, 1].includes(value)) {
    return res.status(400).json({ value: "value must be -1, 0 or 1" });
  }
  try {
    const user: User = res.locals.user;
    let post = await Post.findOneOrFail({ identifier, slug });
    let vote: Vote | undefined;
    let comment: Comment | undefined;

    if (commentIdentifier) {
      // If there is a comment identifier, find a vote by comment
      comment = await Comment.findOneOrFail({ identifier: commentIdentifier });
      vote = await Vote.findOne({ user, comment });
    } else {
      // Else find vote by this user on this post
      vote = await Vote.findOne({ user, post });
    }

    if (!vote && value === 0) {
      // if no vote and value is 0 return error
      return res.status(404).json({ error: "vote not found" });
    } else if (!vote) {
      // if we reach here we know that we have a value but have not voted yet , thus we create the vote
      // and add the comment if its a vote on a comment or add the post if its a vote on a post
      vote = new Vote({ user, value });
      if (comment) vote.comment = comment;
      else vote.post = post;
      await vote.save();

      //   if we reach here then we know that the vote and the value exists. We will now have to update it.
    } else if (value === 0) {
      // Remote vote
      await vote.remove();
    } else if (vote.value !== value) {
      // update vote
      vote.value = value;
      await vote.save();
    }

    post = await Post.findOneOrFail(
      { identifier, slug },
      { relations: ["comments", "sub", "votes", "comments.votes"] }
    );

    post.setUserVote(user);
    post.comments.forEach((comment) => comment.setUserVote(user));

    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "something went wrong" });
  }
};

const topSubs = async (_: Request, res: Response) => {
  try {
    const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' || s."imageUrn" , 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')`;
    const subs = await getConnection()
      .createQueryBuilder()
      .select(
        `s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`
      )
      .from(Sub, "s")
      .leftJoin(Post, "p", `s.name = p."subName"`)
      .groupBy('s.title, s.name, "imageUrl"')
      .orderBy(`"postCount"`, "DESC")
      .limit(5)
      .execute();

    return res.json(subs);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "something went wrong" });
  }
};

router.post("/vote", user, auth, vote);
router.get("/top-subs", topSubs);

export default router;
