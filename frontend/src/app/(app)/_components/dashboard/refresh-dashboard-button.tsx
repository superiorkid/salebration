"use client";

import { Button } from "@/components/ui/button";
import { useDashboardMetrics } from "@/hooks/tanstack/dashboard";
import { RepeatIcon } from "lucide-react";
import React from "react";

const RefreshDashboardButton = () => {
  const { refetch } = useDashboardMetrics();
  return (
    <Button
      onClick={() => refetch()}
      size="sm"
      variant="outline"
      className="hover:cursor-pointer"
    >
      <RepeatIcon strokeWidth={2} size={16} className="mr-1" />
      Refresh Data
    </Button>
  );
};

export default RefreshDashboardButton;
