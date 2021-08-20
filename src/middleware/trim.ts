import { NextFunction, Request, Response } from "express";

// here we will write a piece of custom middleware that will trim request object values. This is for trimming
// emails, usernames etc. We will not be trimming passwords as passwords are allowed to have whitespace

export default (req : Request, _  : Response, next : NextFunction) => {
    const exceptions = ['password']
    Object.keys(req.body).forEach(key => {
        if (!exceptions.includes(key) && typeof req.body[key] === 'string'){
            req.body[key] = req.body[key].trim()
        }
    })

    next()
}