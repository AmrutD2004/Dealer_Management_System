import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { asChoice } from "./helpers";


export function TenantsFilters() {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          {/* Search */}

          <div className=" flex-1">
            

            <Input
              // value={search}
              // onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search tenant, code, email, phone or GST..."
              
            />
          </div>

          {/* Tenant Status */}

          <Select
            // value={statusFilter}
           
          >
            <SelectTrigger className="w-full xl:w-[180px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>

              <SelectItem value="ACTIVE">Active</SelectItem>

              <SelectItem value="SUSPENDED">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Plan */}

          <Select
            // value={planFilter}
            
          >
            <SelectTrigger className="w-full xl:w-[180px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All Plans</SelectItem>

              <SelectItem value="BASIC">Basic</SelectItem>

              <SelectItem value="PRO">Pro</SelectItem>

              <SelectItem value="PREMIUM">Premium</SelectItem>
            </SelectContent>
          </Select>

          {/* Subscription */}

          <Select
            
          >
            <SelectTrigger className="w-full xl:w-[190px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All Subscriptions</SelectItem>

              <SelectItem value="TRIAL">Trial</SelectItem>

              <SelectItem value="ACTIVE">Active</SelectItem>

              <SelectItem value="SUSPENDED">Suspended</SelectItem>

              <SelectItem value="EXPIRED">Expired</SelectItem>

              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset */}

          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
