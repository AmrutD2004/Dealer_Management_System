import type { ReactNode } from "react";

import {
  Building2,
  CheckCircle2,
  CirclePause,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getActiveStatusClass,
  getActiveStatusLabel,
  getPlanLabel,
  getSubscriptionStatusClass,
  getSubscriptionStatusLabel,
} from "./helpers";

import type { Tenant } from "./types";



export function TenantsTable() {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-base">All Tenants</CardTitle>

        <p className="text-sm text-slate-500">
           found
        </p>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          
        </div>

        
      </CardContent>
    </Card>
  );
}
