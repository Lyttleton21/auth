"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { FaGithub } from "react-icons/fa";

const Socials = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <Button
        variant={"outline"}
        className="flex w-full gap-2"
        onClick={() =>
          signIn("github", {
            redirect: false,
            callbackUrl: "/",
          })
        }
      >
        <p>Sign in with Github</p>
        <FaGithub className="w-5 h-5" />
      </Button>
      {/* <Button
        onClick={() =>
          signIn("github", {
            redirect: false,
            callbackUrl: "/",
          })
        }
      >
        Sign in with Github
      </Button> */}
    </div>
  );
};

export default Socials;
