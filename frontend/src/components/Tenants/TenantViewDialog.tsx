import { Building2, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { InfoItem } from "./InfoItem";

import {
  getActiveStatusClass,
  getActiveStatusLabel,
  getPlanLabel,
  getSubscriptionStatusClass,
  getSubscriptionStatusLabel,
} from "./helpers";

import type { Tenant } from "./types";



export function TenantViewDialog() {
  return (
    <Dialog >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        
      </DialogContent>
    </Dialog>
  );
}
