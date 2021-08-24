import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../entities/User";

// we have split the original auth middleware into two middleware, auth and user. Now if we have a route that
// requires the user to be logged in we use both. If we have a route that does not require the user to be logged in
// but if the user is logged in the functionality of the route changes then we will just include the user middleware

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) return next;

    const { username }: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findOne({ username });

    // here we are adding the user to the res.locals object. According to express this is preferable over
    // adding it to the req object itself
    res.locals.user = user;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Unauthenticated" });
  }
};
