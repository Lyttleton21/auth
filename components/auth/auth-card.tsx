import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Socials from "./socials";
import BackButton from "./back-button";

interface Props {
  children: React.ReactNode;
  cardTitle: string;
  backButtonHref: string;
  backButtonlabel: string;
  showSocials?: boolean;
}

const AuthCard = ({
  children,
  cardTitle,
  backButtonHref,
  backButtonlabel,
  showSocials,
}: Props) => {
  return (
    <Card>
      <CardHeader className="text-center">{cardTitle}</CardHeader>
      <CardContent>{children}</CardContent>
      {showSocials && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton href={backButtonHref} label={backButtonlabel} />
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
