import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Image from 'next/image'

import { useAuthDispatch, useAuthState } from "../context/auth";
import RedditLogo from "../../public/images/redditLogo.svg";
import axios from "axios";
import { Sub } from "../types";
import { useRouter } from "next/router";

const Navbar: React.FC = () => {
  const [name, setName] = useState('')
  const [subs, setSubs] = useState<Sub[]>([])
  const [timer, setTimer] = useState(null)

  const { authenticated, loading } = useAuthState();
  const dispatch = useAuthDispatch();

  const router = useRouter()

  useEffect(() => {
    if(name.trim() === ''){
      setSubs([])
      return
    }
    searchSubs()
  }, [name])

 

  // function for logging a user out
  const logout = () => {
    axios
      .get("/auth/logout")
      .then(() => {
        dispatch("LOGOUT");
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  // function for implementing sub search. We use a setTimout to limit the user requests. 
  const searchSubs = async () => {
    clearTimeout(timer)
    setTimer(setTimeout(async() => {
      try {
        const {data } = await axios.get(`/subs/search/${name}`)
        setSubs(data)
        console.log(data);
        
      } catch (error) {
        console.log(error);
        
      }
    },250 ))
   
  }

  // function for direction a user to a subreddit when clicked in the search bar. Clears setName so that the search bar clears
  const goToSub = (subName:string) => {
    router.push(`/r/${subName}`)
    setName('')
  }

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 bg-white">
      {/* logo and title */}
      <div className="flex items-center">
        <Link href="/">
          <a>
            <RedditLogo className="w-8 h-8 mr-2"></RedditLogo>
          </a>
        </Link>
        {/* the hidden class below means that on small screens this span will be hidden. We then specify lg:block which means on large
        screens it will display. Tailwind takes a small screen up approach by default */}
        <span className="hidden text-2xl font-semibold lg:block">
          <Link href="/">reddit</Link>
        </span>
      </div>
      {/* Search bar */}
      <div className="max-w-full px-4 w-160">
      <div className="relative flex items-center bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
        <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          type="text"
          className="py-1 pr-3 bg-transparent rounded focus:outline-none "
          placeholder="Search"
        />
        <div className="absolute left-0 right-0 bg-white" style={{top:'100%'}}>
          {subs?.map(sub => (
            <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200" key={sub.name} onClick={() => goToSub(sub.name)}>
                <Image src={sub.imageUrl} alt="Sub" height={8 * 16/4} width={8 *16/4} className="rounded-full" />
                <div className="ml-4 text-sm">
                  <p className="font-medium">{sub.name}</p>
                  <p className="font-gray-600">{sub.title}</p>
                </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      {/* Auth buttons */}
      <div className="flex">
        {!loading &&
          (authenticated ? (
            // show logout button
            <button
              className="hidden w-20 py-1 mr-4 leading-5 sm:block lg:w-32 hollow blue button"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <Fragment>
              <Link href="/login">
                <a className="hidden w-20 py-1 mr-4 leading-5 sm:block lg:w-32 hollow blue button">
                  Log in
                </a>
              </Link>
              <Link href="/register">
                <a className="hidden w-20 py-1 leading-5 sm:block lg:w-32 blue button">Sign Up</a>
              </Link>
            </Fragment>
          ))}
      </div>
    </div>
  );
};

export default Navbar;
