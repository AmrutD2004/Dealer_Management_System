import type { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  withSeparator?: boolean;
}

export function FormSection({
  title,
  children,
  withSeparator = true,
}: FormSectionProps) {
  return (
    <>
      <div>
        <h3 className="mb-4 text-sm font-semibold text-slate-900">{title}</h3>

        <div className="grid gap-4 sm:grid-cols-2">{children}</div>
      </div>

      {withSeparator && <Separator />}
    </>
  );
}
