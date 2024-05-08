"use client";

import Link from "next/link";
import { Button } from "../ui/button";

interface Props {
  href: string;
  label: string;
}

const BackButton = ({ href, label }: Props) => {
  return (
    <div>
      <Button className="font-medium w-full">
        <Link aria-label={label} href={href}>
          {label}
        </Link>
      </Button>
    </div>
  );
};

export default BackButton;
