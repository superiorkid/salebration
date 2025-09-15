import { Skeleton } from "@/components/ui/skeleton";

interface FormSkeletonProps {
  fields?: {
    type: "input" | "textarea" | "select" | "switch";
    label?: boolean;
    fullWidth?: boolean;
  }[];
  showSubmitButton?: boolean;
}

export function FormSkeleton({
  fields = [
    { type: "input", label: true },
    { type: "input", label: true },
    { type: "textarea", label: true },
  ],
  showSubmitButton = true,
}: FormSkeletonProps) {
  const renderField = (
    field: NonNullable<FormSkeletonProps["fields"]>[0],
    index: number,
  ) => {
    switch (field.type) {
      case "textarea":
        return (
          <div key={index} className="space-y-2">
            {field.label && <Skeleton className="h-4 w-16" />}
            <Skeleton className="h-24 w-full" />
          </div>
        );
      case "select":
        return (
          <div key={index} className="space-y-2">
            {field.label && <Skeleton className="h-4 w-16" />}
            <Skeleton className="h-10 w-full" />
          </div>
        );
      case "switch":
        return (
          <div key={index} className="flex items-center gap-2">
            <Skeleton className="h-6 w-10 rounded-full" />
            {field.label && <Skeleton className="h-4 w-14" />}
          </div>
        );
      default:
        return (
          <div
            key={index}
            className={`space-y-2 ${field.fullWidth ? "w-full" : "flex-1"}`}
          >
            {field.label && <Skeleton className="h-4 w-16" />}
            <Skeleton className="h-10 w-full" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => renderField(field, index))}
      {showSubmitButton && <Skeleton className="h-10 w-28" />}
    </div>
  );
}
