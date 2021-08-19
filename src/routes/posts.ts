import { Router, Request, Response } from "express";
import Post from "../entities/Post";

import auth from '../middleware/auth'

const createPost = async(req : Request, res : Response) => {
    const {title, body, sub} = req.body

    const user = res.locals.user

    if(title.trim() === ''){
        res.status(400).json({title : "Title must not be empty"})
    }

    try {
        // todo find sub

        const post = new Post({title, body, user, subName: sub})
        await post.save()

        return res.json(post)


    } catch (error) {
        console.log(error);
        return res.status(500).json({error : "something went wrong"})
        
    }
}


const router = Router()

// if we get to the createPost function it means we have a user as if not an error would have been thrown
// from inside the auth middleware
router.post('/', auth, createPost)

export default router