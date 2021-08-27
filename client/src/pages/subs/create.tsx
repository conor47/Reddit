import axios from 'axios'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import React, {FormEvent, useState} from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'



export default function Create() {
    const [name, setName] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [errors, setErrors] = useState<Partial<any>>([])

    const router = useRouter()

    const submitForm = async(e : FormEvent) => {
        e.preventDefault()
        try {
            const res = await axios.post('/subs', {name, title, description})
            router.push(`/r/${res.data.name}`)
        } catch (error) {
            console.log();
            setErrors(error.response.data)
        }
    }
    return (
        <div className="flex bg-white">
            <Head>
                <title>Create a Community</title>
            </Head>
            <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/stars.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
          <div className="w-98">
              <h1 className="mb-2 text-lg font medium">Create a Community</h1>
              <hr />
              <form onSubmit={submitForm}>
              <div className="my-6">
                  <p className="font-medium">Name</p>
                  <p className="mb-2 text-xs text-gray-500">Community names including capitalization cannot be changed</p>
                  <input 
                    type="text" 
                    className={classnames("w-full p-3 border border-gray-200 rounded hover:border-gray-500", {'border-red-600' : errors.name} )}
                    value={name}
                    onChange={e => setName(e.target.value)}  
                  />
                  <small className="font-medium text-red-600">
                    {errors.name}
                  </small>
                  </div>
              <div className="my-6">
                  <p className="font-medium">Title</p>
                  <p className="mb-2 text-xs text-gray-500">Community title represents the topic, you can change it </p>
                  <input 
                    type="text" 
                    className={classnames("w-full p-3 border border-gray-200 rounded hover:border-gray-500", {'border-red-600' : errors.title} )}
                    value={title}
                    onChange={e => setTitle(e.target.value)}  
                  />
                  <small className="font-medium text-red-600">
                    {errors.title}
                  </small>
                  </div>
              <div className="my-6">
                  <p className="font-medium">Description</p>
                  <p className="mb-2 text-xs text-gray-500">This is how members come to understand your community</p>
                  <textarea
                    className={"w-full p-3 border border-gray-200 rounded hover:border-gray-500"}
                    value={description}
                    onChange={e => setDescription(e.target.value)}  
                  />
                  <small className="font-medium text-red-600">
                    {errors.description}
                  </small>
                  </div>
                  <div className="flex justify-end">
                      <button className="px-4 py-1 text-sm font-semibold capitalize blue button">Create Community</button>
                  </div>
              </form>
          </div>
      </div>
        </div>
    )
}

// we will perform a server side check to see whether the current user is authenticated.
// If the user is not logged in they will be redirected to the login page when to try to visit this submit page. This page 
// will be server side rendered so that the user will not see the /submit page at all

export const getServerSideProps : GetServerSideProps = async({req,res}) => {
    try {
        const cookie = req.headers.cookie
        if(!cookie) throw new Error('Missing auth token cookie')

        await axios.get('/auth/me', {headers : {cookie}})
        return {props :{}}
    } catch (error) {
        res.writeHead(307, {location : '/login'}).end()
    }
}



