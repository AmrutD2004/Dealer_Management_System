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

interface TenantsTableProps {
  tenants: Tenant[];
  totalCount: number;
  onView: (tenant: Tenant) => void;
  onEdit: (tenant: Tenant) => void;
  onActivate: (tenantId: string) => void;
  onSuspend: (tenantId: string) => void;
  onDelete: (tenant: Tenant) => void;
  footer?: ReactNode;
}

export function TenantsTable({
  tenants,
  totalCount,
  onView,
  onEdit,
  onActivate,
  onSuspend,
  onDelete,
  footer,
}: TenantsTableProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-base">All Tenants</CardTitle>

        <p className="text-sm text-slate-500">
          {totalCount} tenant{totalCount !== 1 ? "s" : ""} found
        </p>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="min-w-[240px]">Tenant</TableHead>

                <TableHead>Plan</TableHead>

                <TableHead>Subscription</TableHead>

                <TableHead>Status</TableHead>

                <TableHead>GST Number</TableHead>

                <TableHead>Created</TableHead>

                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {tenants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Building2 className="mb-2 h-8 w-8 text-slate-300" />

                      <p className="font-medium text-slate-700">
                        No tenants found
                      </p>

                      <p className="text-sm text-slate-500">
                        Try changing your search or filters.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                tenants.map((tenant) => (
                  <TableRow key={tenant.id} className="hover:bg-slate-50">
                    {/* Tenant */}

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                          <Building2 className="h-5 w-5 text-slate-600" />
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            {tenant.tenantName}
                          </p>

                          <p className="text-xs text-slate-500">
                            {tenant.tenantCode}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Plan */}

                    <TableCell>
                      <span className="font-medium text-slate-700">
                        {getPlanLabel(tenant.plan)}
                      </span>
                    </TableCell>

                    {/* Subscription */}

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getSubscriptionStatusClass(
                          tenant.subscriptionStatus,
                        )}
                      >
                        {getSubscriptionStatusLabel(tenant.subscriptionStatus)}
                      </Badge>
                    </TableCell>

                    {/* Status */}

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getActiveStatusClass(tenant.isActive)}
                      >
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />

                        {getActiveStatusLabel(tenant.isActive)}
                      </Badge>
                    </TableCell>

                    {/* GST Number */}

                    <TableCell>
                      <span className="font-mono text-sm text-slate-700">
                        {tenant.gstNumber || "-"}
                      </span>
                    </TableCell>

                    {/* Created */}

                    <TableCell className="text-sm text-slate-500">
                      {tenant.createdAt}
                    </TableCell>

                    {/* Actions */}

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Actions for ${tenant.tenantName}`}
                            />
                          }
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => onView(tenant)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => onEdit(tenant)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Tenant
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {
                          tenant.isActive ? (
                            <DropdownMenuItem
                              onClick={() => onSuspend(tenant.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <CirclePause className="mr-2 h-4 w-4" />
                              Suspend Tenant
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => onActivate(tenant.id)}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                              Activate Tenant
                            </DropdownMenuItem>
                          )
                        }

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => onDelete(tenant)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Tenant
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {footer}
      </CardContent>
    </Card>
  );
}
