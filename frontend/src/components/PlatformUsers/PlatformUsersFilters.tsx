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

interface PlatformUsersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  roleFilter: string;
  onRoleFilterChange: (value: string | null) => void;

  statusFilter: string;
  onStatusFilterChange: (value: string | null) => void;

  onResetFilters: () => void;
}

export function PlatformUsersFilters({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  onResetFilters,
}: PlatformUsersFiltersProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          {/* Search */}

          <div className="flex-1">
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search name, code, email or phone..."
            />
          </div>

          {/* Role */}

          <Select value={roleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger className="w-full xl:w-[190px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>

              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>

              <SelectItem value="SUPPORT_ADMIN">Support Admin</SelectItem>
            </SelectContent>
          </Select>

          {/* Access status */}

          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full xl:w-[190px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>

              <SelectItem value="ACTIVE">Active</SelectItem>

              <SelectItem value="INACTIVE">Inactive</SelectItem>

              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset */}

          <Button variant="outline" className="gap-2" onClick={onResetFilters}>
            <Filter className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
