import Image from "next/image";
import React from "react";

interface AuthenticationLayoutProps {
  children: React.ReactNode;
}

const AuthenticationLayout = async ({
  children,
}: AuthenticationLayoutProps) => {
  return (
    <div className="flex h-screen items-center justify-center bg-[#EBEFFF]">
      <div className="bg-background flex h-[473px] w-[64rem] border shadow-lg">
        <div className="relative flex-1 bg-zinc-100">
          <Image
            fill
            src="https://images.unsplash.com/photo-1648712789242-55e6f3550d04?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="auth bg image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            loading="eager"
          />
        </div>
        <div className="flex flex-1">{children}</div>
      </div>
    </div>
  );
};

export default AuthenticationLayout;
