// authentication context

import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import { User } from "../types";

interface State {
  authenticated: boolean;
  user: User | undefined;
}

interface Action {
  type: string;
  payload: any;
}

// creating the state context
const StateContent = createContext<State>({
  authenticated: false,
  user: null,
});

const DispatchContext = createContext(null);

// our reducer handles the logic of how each action mutates the state
const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
    case "LOGOUT":
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    default:
      throw new Error(`Unknown action type : ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // we pass in our reducer and the initial state
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
  });

  // this is just a quality of life improvment. Saves us having to pass objects each time we are using the dispatch
  const dispatch = (type: string, payload?: any) => {
    defaultDispatch({ type, payload });
  };

  useEffect(() => {
    // this is an alternative format we can use if we wish to async / await in our useEffect calls
    async function loadUser() {
      try {
        const res = await axios.get("/auth/me");
        dispatch("LOGIN", res.data);
      } catch (error) {
        console.log(error);
      }
    }
    loadUser();
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContent.Provider value={state}>{children}</StateContent.Provider>
    </DispatchContext.Provider>
  );
};

// Custom hooks for consuming the contexts
export const useAuthState = () => useContext(StateContent);
export const useAuthDispatch = () => useContext(DispatchContext);
