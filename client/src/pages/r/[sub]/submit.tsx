import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import useSWR from "swr";


import Sidebar from "../../../components/Sidebar";
import { Post, Sub } from "../../../types";

export default function Submit() {
    // Local state
    const [title, setTitle] = useState('')

    // Utils
    const router = useRouter()
    const {sub : subName} = router.query
    const [body, setBody] = useState('')

    const {data:sub, error} = useSWR<Sub>(subName ? `/subs/${subName}` : null)
    if(error) router.push('/')

    const submitPost = async (event : FormEvent) => {
        event.preventDefault()
        if(title.trim() === '') return
        try {
           const {data : post} = await axios.post<Post>('/posts', {title : title.trim(), body , sub : subName})

           router.push(`/r/${sub.name}/${post.identifier}/${post.slug}`)
        } catch (error) {
            console.log(error);
            
        }
    }

    return (

        <div className="container flex pt-5">
            <Head>
                <title>Submit to Reddit</title>
            </Head>
            <div className="w-160">
                <div className="p-4 bg-white rounded">
                    <h1 className="mb-3 text-lg">Submit a post to /r/{subName}</h1>
                    <form onSubmit={submitPost}>
                        <div className="relative mb-2">
                            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none" 
                            placeholder="Title" maxLength={300} value={title} onChange={e => setTitle(e.target.value)}/>
                            <div className="absolute mb-2 text-sm text-gray-300 select-none focus:border-gray-600" style={{top: 10, right: 10}}>
                                {title.trim().length}/300
                            </div>
                        </div>
                        <textarea className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600" 
                        value={body} 
                        placeholder="Text (optional)" 
                        onChange={e => setBody(e.target.value)}
                        rows={4}></textarea>
                        <div className="flex justify-end">
                            <button className="px-3 py-1 blue button" type="submit" disabled={title.trim().length === 0}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            {sub && <Sidebar sub={sub} /> }
        </div>
    )
}
