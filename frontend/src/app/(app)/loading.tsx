import { Label } from "@/components/ui/label";
import { LoaderCircleIcon } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="flex h-[75dvh] items-center justify-center">
      <div className="text-muted-foreground flex animate-pulse flex-col items-center justify-center space-y-3.5">
        <LoaderCircleIcon
          size={38}
          strokeWidth={2}
          className="stroke-muted-foreground animate-spin"
        />
        <Label className="font-medium">Please wait...</Label>
      </div>
    </div>
  );
};

export default LoadingPage;
