import { FormEvent, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Axios from "axios";
import classNames from "classnames";

export default function Register() {
  // simple state for our form fields, checkbox and form errors
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // event handler for our form
  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    try {
      // we can use this simplified URL since we defined a baseURL in the app.tsx file
      const res = await Axios.post("/auth/register", {
        email,
        password,
        username,
      });

      console.log(res.data);
    } catch (error) {
      console.log(error);
      setErrors(error.response.data);
    }
  };

  return (
    <div className="flex">
      <Head>
        <title>Register</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/stars.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy.
          </p>
          <form action="" onSubmit={submitForm}>
            <div className="mb-6">
              <input
                type="checkbox"
                className="mr-1 cursor-pointer"
                id="agreement"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
              />
              <label htmlFor="agreement" className="text-xs cursor-pointer">
                agree to get emails about cool stuff on Reddit
              </label>
            </div>

            <div className="mb-2">
              <input
                type="text"
                className="w-full px-3 py-3 transition duration-200 border border-gray-300 outline-none bg-gray-50 rouded focus:bg-white hover:bg-white"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <input
                type="password"
                className="w-full px-3 py-3 transition duration-200 border border-gray-300 outline-none bg-gray-50 rouded focus:bg-white hover:bg-white"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
              Sign Up
            </button>
          </form>
          <small>
            Already a redditor ?{" "}
            <Link href="/login">
              <a className="ml-1 text-blue-500 uppercase">Log In</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}