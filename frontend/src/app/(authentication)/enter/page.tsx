import { env } from "@/env";
import { Metadata } from "next";
import LoginForm from "./_components/login-form";

export const metadata: Metadata = {
  title: `Sign In`,
  description: `Sign in to ${env.APP_NAME} to access your sales and inventory dashboard.`,
  robots: {
    index: false,
    follow: false,
  },
};

const SignInPage = () => {
  return (
    <div className="flex w-full flex-col justify-center space-y-7 px-16">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Sign in to continue.
        </p>
      </div>
      <LoginForm />
      <div className="text-muted-foreground mt-4 text-center text-xs">
        © {new Date().getFullYear()} - All rights reserved
      </div>
    </div>
  );
};

export default SignInPage;
