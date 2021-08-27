import axios from 'axios'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import React, {useState} from 'react'



export default function Create() {
    const [name, setName] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [errors, setErrors] = useState<Partial<any>>([])
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
              <form >
                  <p className="font-medium">Name</p>
                  <p className="text-xs text-gray-500">Community names including capitalization cannot be changed</p>
                  <input type="text" className="p-3 border border-gray-200 rounded hover:border-gray-500" />
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



