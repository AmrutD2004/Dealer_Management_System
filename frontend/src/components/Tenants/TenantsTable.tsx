import { useContext, useState } from "react";

import {
  Building2,
  CirclePause,
  Eye,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import dayjs from 'dayjs'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
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
import { toast } from "@/components/ui/toast";

import {
  getActiveStatusClass,
  getActiveStatusLabel,
  getPlanClass,
  getPlanLabel,
  getSubscriptionStatusClass,
  getSubscriptionStatusLabel,
} from "./helpers";
import { TenantDeleteDialog } from "./TenantDeleteDialog";
import { TenantEditDialog } from "./TenantEditDialog";
import { TenantViewDialog } from "./TenantViewDialog";

import { PlatformUserContext } from "@/contexts/PlatformUserContext";
import { suspendTenant } from "@/api/endpoint";
import { getApiErrorMessage } from "@/lib/utils";

import type { tenantType } from "@/Types/tenantTypes";
import { cn } from "cn";

type RowAction = "view" | "edit" | "delete" | null;

export function TenantsTable() {
  const { tenantList, totalTenantCount, take, skip, setSkip, fetchTenantList } = useContext(PlatformUserContext);
  const noOfPages = Math.ceil(totalTenantCount / take)

  const [selectedTenant, setSelectedTenant] = useState<tenantType | null>(null);
  const [action, setAction] = useState<RowAction>(null);
  const [suspendingId, setSuspendingId] = useState<number | null>(null);

  const isOpen = (target: Exclude<RowAction, null>) => action === target;

  const close = () => setAction(null);

  const openFor = (target: Exclude<RowAction, null>, tenant: tenantType) => {
    setSelectedTenant(tenant);
    setAction(target);
  }

  /* Mutations refetch so the table always reflects the server. */

  const refresh = () => fetchTenantList(skip, take);

  /*
   * Suspend only moves subscriptionStatus, so it needs no confirmation
   * dialog the way deactivation does.
   */

  const handleSuspend = async (tenant: tenantType) => {
    setSuspendingId(tenant.id);

    try {
      const data = await suspendTenant(tenant.id, "SUSPENDED");

      if (data?.success) {
        toast.add({ type: "success", description: data?.message });

        refresh();
      } else {
        toast.add({ type: "error", description: data?.message });
      }
    } catch (err) {
      toast.add({
        type: "error",
        description: getApiErrorMessage(err, "Failed to suspend tenant"),
      });
    } finally {
      setSuspendingId(null);
    }
  }

  const handlePrevious = () => {
    setSkip((prev: number) =>
      Math.max(prev - take, 0)
    )
  }

  const handleNext = () => {
    if (skip + take < totalTenantCount) {
      setSkip((prev: number) => prev + take)
    }
  }
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
        <CardTitle className="text-base">All Tenants</CardTitle>
        <span className="text-sm text-slate-500">
          {totalTenantCount} {totalTenantCount === 1 ? "tenant" : "tenants"}
        </span>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tenantList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-slate-500">
                  No tenants found.
                </TableCell>
              </TableRow>
            ) : (
              tenantList.map((tenant: tenantType) => (
                <TableRow key={tenant.id}>
                  {/* Tenant */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                        <Building2 className="h-4 w-4 text-slate-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">
                          {tenant.tenantName}
                        </span>
                        <span className="text-xs text-slate-500">
                          {tenant.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Code */}
                  <TableCell>
                    <span className="font-mono text-xs text-slate-600">
                      {tenant.tenantCode}
                    </span>
                  </TableCell>

                  {/* Contact */}
                  <TableCell className="text-slate-700">
                    {tenant.phone}
                  </TableCell>

                  {/* Plan */}
                  <TableCell>
                    <Badge variant="outline" className={getPlanClass(tenant.subscriptionPlan)}>{getPlanLabel(tenant.subscriptionPlan)}</Badge>
                  </TableCell>

                  {/* Subscription */}
                  <TableCell>
                    <Badge variant="outline" className={getSubscriptionStatusClass(tenant.subscriptionStatus)}>
                      {getSubscriptionStatusLabel(tenant.subscriptionStatus)}
                    </Badge>
                  </TableCell>

                  {/* Active Status */}
                  <TableCell>
                    <Badge variant="outline" className={getActiveStatusClass(tenant.isActive)}>
                      {getActiveStatusLabel(tenant.isActive)}
                    </Badge>
                  </TableCell>

                  {/* Created */}
                  <TableCell className="text-slate-600 text-sm">
                    {dayjs(tenant.createdAt).format('DD MMM YYYY')}
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

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openFor("view", tenant)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => openFor("edit", tenant)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          disabled={suspendingId === tenant.id}
                          onClick={() => handleSuspend(tenant)}
                        >
                          {suspendingId === tenant.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CirclePause className="mr-2 h-4 w-4" />
                          )}
                          Suspend
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => openFor("delete", tenant)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="w-full flex items-center justify-center gap-4 mt-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem><Button
                variant="outline"
                disabled={skip === 0}
                onClick={handlePrevious}
              >
                <PaginationPrevious />
              </Button>
              </PaginationItem>
              {[...Array(noOfPages).keys()].map((i) => {
                const pageNext = i * take
                return (
                  <PaginationItem>
                    <Button className={cn('rounded-lg')} onClick={() => setSkip(pageNext)} variant={skip === pageNext ? 'default' : 'outline'} >{i + 1}</Button>
                  </PaginationItem>
                )
              })}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  disabled={skip + take >= totalTenantCount}
                  onClick={handleNext}

                >
                  <PaginationNext />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>

      <TenantViewDialog
        open={isOpen("view")}
        onOpenChange={(open) => !open && close()}
        tenantId={selectedTenant?.id ?? null}
      />

      <TenantEditDialog
        open={isOpen("edit")}
        onOpenChange={(open) => !open && close()}
        tenant={selectedTenant}
        onSaved={refresh}
      />

      <TenantDeleteDialog
        open={isOpen("delete")}
        onOpenChange={(open) => !open && close()}
        tenant={selectedTenant}
        onDeleted={refresh}
      />
    </Card>
  );
}