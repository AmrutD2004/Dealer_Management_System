import type { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";

interface FormSectionProps {
  title: ReactNode;
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
        <div className="mb-2 bg-muted/40 px-2 py-1">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">{title}</h3>
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2 xl:grid-cols-3">{children}</div>
      </div>

      {withSeparator && <Separator className="hidden" />}
    </>
  );
}
