import { FormEvent, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Axios from "axios";
import { useRouter } from "next/router";

import { useAuthDispatch, useAuthState } from "../context/auth";
import InputGroup from "../components/InputGroup";

export default function Register() {
  // simple state for our form fields, checkbox and form errors
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});

  const dispatch = useAuthDispatch();
  const { authenticated } = useAuthState();

  const router = useRouter();
  if (authenticated) router.push("/");

  // event handler for our form
  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    try {
      // we can use this simplified URL since we defined a baseURL in the app.tsx file
      const res = await Axios.post(
        "/auth/login",
        {
          password,
          username,
        },
        { withCredentials: true } // this option allows the server to set cookies
      );

      dispatch("LOGIN", res.data);
      router.back();
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Login</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/stars.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Login</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy.
          </p>
          <form action="" onSubmit={submitForm}>
            <InputGroup
              className="mb-2"
              value={username}
              setValue={setUsername}
              placeholder="USERNAME"
              error={errors.username}
              type="text"
            />
            <InputGroup
              className="mb-4"
              value={password}
              setValue={setPassword}
              placeholder="PASSWORD"
              error={errors.password}
              type="password"
            />
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
              Login
            </button>
          </form>
          <small>
            New to Reddit ?{" "}
            <Link href="/register ">
              <a className="ml-1 text-blue-500 uppercase">Sign Up</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
