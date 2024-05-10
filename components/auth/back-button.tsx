"use client";

import Link from "next/link";
import { Button } from "../ui/button";

interface Props {
  href: string;
  label: string;
}

const BackButton = ({ href, label }: Props) => {
  return (
    <Button variant={"link"} asChild className="w-full font-medium">
      <Link aria-label={label} href={href}>
        {label}
      </Link>
    </Button>
  );
};

export default BackButton;
