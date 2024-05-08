"use client";

import AuthCard from "./auth-card";

const LoginForm = () => {
  return (
    <div>
      <AuthCard
        showSocials
        cardTitle={"Login"}
        backButtonHref={"/auth/register"}
        backButtonlabel={"Create a New Accout"}
      >
        <form></form>
      </AuthCard>
    </div>
  );
};

export default LoginForm;
