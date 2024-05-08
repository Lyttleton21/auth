"use client";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

interface Props {
  user: Session | null;
}

const UserButton = ({ user }: Session) => {
  return (
    <div>
      <h6>{user?.email}</h6>
      <Button onClick={() => signOut()}>Sign-Out</Button>
    </div>
  );
};

export default UserButton;
