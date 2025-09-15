import React from "react";

interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader = ({ description, title }: PageHeaderProps) => {
  return (
    <div>
      <h1 className="text-xl font-bold 2xl:text-2xl">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default PageHeader;
