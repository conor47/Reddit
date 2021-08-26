import { request, Request, Response, Router } from "express";
import { isEmpty } from "class-validator";
import { getRepository } from "typeorm";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

import User from "../entities/User";
import Post from "../entities/Post";
import Sub from "../entities/Sub";
import auth from "../middleware/auth";
import user from "../middleware/user";
import { makeId } from "../util/helpers";
import { NextFunction } from "express-serve-static-core";

const createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;

  const user: User = res.locals.user;

  try {
    let errors: any = {};

    if (isEmpty(name.trim)) errors.name = "Name must not be empty";
    if (isEmpty(title.trim)) errors.title = "Title must not be empty";

    const sub = await getRepository(Sub)
      // using querybuilder we build a custom query on the subs table
      .createQueryBuilder("sub")
      // the : indicates that we are going to pass a variable. we passed the name variable
      .where("lower(sub.name) = :name", { name: name.toLowerCase() })
      .getOne();

    if (sub) errors.name = "Sub exists already";

    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (err) {
    return res.status(400).json(err);
  }

  try {
    // if we reach this point then everything is valid and we want to create and persist the sub

    const sub = new Sub({ name, description, title, user });
    await sub.save();

    return res.json(sub);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// an api endpoint which fetches the subreddit

const getSub = async (req: Request, res: Response) => {
  const name = req.params.name;

  try {
    const sub = await Sub.findOneOrFail({ name });
    const posts = await Post.find({
      where: { sub },
      order: { createdAt: "DESC" },
      relations: ["comments", "votes"],
    });

    sub.posts = posts;

    // if the user is logged in it will fetch their votes for each post
    if (res.locals.user) {
      sub.posts.forEach((p) => p.setUserVote(res.locals.user));
    }
    return res.json(sub);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: "Sub not found" });
  }
};

// piece of middleware to check that the logged in user owns the sub

const ownSub = async (req: Request, res: Response, next: NextFunction) => {
  console.log("In the ownsub middleware");

  const user: User = res.locals.user;
  try {
    const sub = await Sub.findOneOrFail({
      where: { name: req.params.name },
    });

    if (sub.username !== user.username) {
      return res.status(403).json({ error: "You don't own this sub" });
    }

    console.log("sub:", sub);

    res.locals.sub = sub;
    return next();
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Something went wrong" });
  }
};

// multer image upload middleware

const upload = multer({
  storage: multer.diskStorage({
    destination: "public/images",
    filename: (_, file, callback) => {
      const name = makeId(15);
      callback(null, name + path.extname(file.originalname));
    },
  }),
  fileFilter: (_, file: any, callback: FileFilterCallback) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      callback(null, true);
    } else {
      callback(new Error("not an image"));
    }
  },
});

// route for handling image uploads to subs

const uploadSubImage = async (req: Request, res: Response) => {
  console.log("In the upload image route handler");
  const sub: Sub = res.locals.sub;
  console.log("sub:", sub);

  try {
    const type = req.body.type;

    if (type !== "image" && type !== "banner") {
      // if the type is incorrect we instantly delete the file
      fs.unlinkSync(req.file?.path || "");
      return res.status(400).json({ error: "invalid type" });
    }

    // if the sub already has a an image or a banner we want to delete the old value before uploading a new one
    let oldImageUrn: string = "";
    if (type === "image") {
      oldImageUrn = sub.imageUrn || "";
      sub.imageUrn = req.file?.filename;
    } else if (type === "banner") {
      oldImageUrn = sub.bannerUrn || "";
      sub.bannerUrn = req.file?.filename;
    }

    await sub.save();

    console.log(oldImageUrn);

    if (
      oldImageUrn !== "" &&
      fs.existsSync(`public\/images\/ser${oldImageUrn}`)
    )
      console.log("removing old image...");

    fs.unlinkSync(`public\/images\/${oldImageUrn}`);

    return res.json(sub);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const router = Router();

router.post("/", user, auth, createSub);
router.get("/:name", user, getSub);
router.post(
  "/:name/image",
  user,
  auth,
  ownSub,
  upload.single("file"),
  uploadSubImage
);

export default router;
