import { Request, Response, Router } from "express";

import { User } from "../entities/User";


const register = async (req: Request, res: Response) => {
    const {email, username, password} = req.body

    try{
        // todo Validate data

        // todo Create the user
        const user = new User({email, password, username})
        await user.save()

        // todo Return the user
        return res.json(user)
    } catch (err){
        console.log(err);
        return res.status(500).json(err)
        
    }
}

const router = Router()
router.post('/register', register)

export default router
