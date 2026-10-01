import { useContext, type ReactNode } from "react";

import {
  Building2,
  CheckCircle2,
  CirclePause,
  Eye,
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

import { PlatformUserContext } from "@/contexts/PlatformUserContext";
import type { tenantType } from "@/Types/tenantTypes";
import { cn } from "cn";



export function TenantsTable() {
  const { tenantList, totalTenantCount, take, skip, setSkip } = useContext(PlatformUserContext);
  const noOfPages = Math.ceil(totalTenantCount / take)

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
                    <Badge className={`${tenant.subscriptionPlan === 'Basic' ? 'bg-muted-foreground/20 border-muted-foreground text-accent-foreground': tenant.subscriptionPlan === 'Pro' ? 'bg-blue-200 border border-blue-300 text-blue-500' : 'bg-yellow-200 text-yellow-500 border border-yellow-300'}`} variant="outline">{tenant.subscriptionPlan}</Badge>
                  </TableCell>

                  {/* Subscription */}
                  <TableCell>
                    <Badge
                    >
                      {tenant.subscriptionStatus}
                    </Badge>
                  </TableCell>

                  {/* Active Status */}
                  <TableCell>
                    <Badge className={`${tenant.isActive ? 'bg-green-100 border-green-300 text-green-500' : 'bg-red-100 border-red-300 text-red-500'}`}>
                      {tenant.isActive ? 'Active' : 'Deactive'}
                    </Badge>
                  </TableCell>

                  {/* Created */}
                  <TableCell className="text-slate-600 text-sm">
                    {dayjs(tenant.createdAt).format('DD MMM YYYY')}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        {tenant.isActive ? (
                          <DropdownMenuItem>
                            <CirclePause className="mr-2 h-4 w-4" />
                            Suspend
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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
    </Card>
  );
}