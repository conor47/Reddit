import { Request, Response, Router } from "express";
import { isEmpty } from "class-validator";
import { getRepository } from "typeorm";

import User from "../entities/User";
import Sub from "../entities/Sub";
import auth from "../middleware/auth";

const createSub = async (req : Request, res : Response) => {
    const {name, title, description} = req.body

    const user : User = res.locals.user

    try {
        let errors: any = {}

        if(isEmpty(name.trim)) errors.name = "Name must not be empty"
        if(isEmpty(title.trim)) errors.title = "Title must not be empty"

        const sub = await getRepository(Sub)
        .createQueryBuilder('sub')
        // the : indicates that we are going to pass a variable. we passed the name variable
        .where('lower(sub.name) = :name', {name: name.toLowerCase()})
        .getOne()

        if(sub) errors.name = "Sub exists already"

        if(Object.keys(errors).length > 0){
            throw errors
        }
        
    } catch (err) {
        return res.status(400).json(err)
    }

    try {

        // if we reach this point then everything is valid and we want to create and persist the sub
        
        const sub = new Sub({name, description, title, user})
        await sub.save()

        return res.json(sub)

    } catch (error) {
        console.log(error);
        return res.status(500).json({error : "Something went wrong"})
        
    }
}

const router = Router()

router.post('/',auth, createSub)

export default router