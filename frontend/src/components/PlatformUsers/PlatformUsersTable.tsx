import { useContext, useState } from "react";
import dayjs from "dayjs";

import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { getRoleClass, getRoleLabel } from "./helpers";
import { PlatformUserDeleteDialog } from "./PlatformUserDeleteDialog";
import { PlatformUserEditDialog } from "./PlatformUserEditDialog";
import { PlatformUserViewDialog } from "./PlatformUserViewDialog";

import type { platformUserInfo } from "@/Types/platformUserType";
import { PlatformUserContext } from "@/contexts/PlatformUserContext";
import { cn } from "cn";

type RowAction = "view" | "edit" | "delete" | null;

export function PlatformUsersTable() {
  const { platfornUserList, platformUserCount, fetchPlatformUsersList, platformUserSkip, platformUserTake, setPlatformUserSkip, setPlatformUserTake } =
    useContext(PlatformUserContext);

  const [selectedUser, setSelectedUser] = useState<platformUserInfo | null>(
    null,
  );

  const [action, setAction] = useState<RowAction>(null);

  const isOpen = (target: Exclude<RowAction, null>) => action === target;

  const close = () => setAction(null);

  const openFor = (target: Exclude<RowAction, null>, user: platformUserInfo) => {
    setSelectedUser(user);
    setAction(target);
  };

  /* Mutations refetch so the table always reflects the server. */

  const refresh = () => fetchPlatformUsersList(platformUserSkip, platformUserTake);

  const noOfPages = Math.ceil(platformUserCount / platformUserTake)
  const handlePrevious = () => {
    setPlatformUserSkip((prev: number) =>
      Math.max(prev - platformUserTake, 0)
    )
  }

  const handleNext = () => {
    if (platformUserSkip + platformUserTake < platformUserCount) {
      setPlatformUserSkip((prev: number) => prev + platformUserTake)
    }
  }
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
        <CardTitle className="text-base">All Platform Users</CardTitle>
        <span className="text-sm text-slate-500">
          {platformUserCount} {platformUserCount === 1 ? "user" : "users"}
        </span>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-12 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {platfornUserList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-slate-500"
                >
                  No platform users found.
                </TableCell>
              </TableRow>
            ) : (
              platfornUserList.map((user: platformUserInfo, idx: number) => (
                <TableRow key={user.id}>
                  {/* ID */}

                  <TableCell>
                    <span className="font-mono text-xs text-slate-600">
                      {user.id}
                    </span>
                  </TableCell>

                  {/* Email */}

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-600">
                          {user.email.split("@")[0].slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <span className="text-slate-700">{user.email}</span>
                    </div>
                  </TableCell>

                  {/* Role */}

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getRoleClass(user.role)}
                    >
                      {getRoleLabel(user.role)}
                    </Badge>
                  </TableCell>

                  {/* Created */}

                  <TableCell className="text-slate-600 text-sm">
                    {dayjs(user.createdAt).format("DD MMM YYYY")}
                  </TableCell>

                  {/* Updated */}

                  <TableCell className="text-slate-600 text-sm">
                    {dayjs(user.updatedAt).format("DD MMM YYYY")}
                  </TableCell>

                  {/* Actions */}

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Actions for ${user.email}`}
                          />
                        }
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openFor("view", user)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => openFor("edit", user)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => openFor("delete", user)}
                        >
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
                disabled={platformUserSkip === 0}
                onClick={handlePrevious}
              >
                <PaginationPrevious />
              </Button>
              </PaginationItem>
              {[...Array(noOfPages).keys()].map((i) => {
                const pageNext = i * platformUserTake
                return (
                  <PaginationItem>
                    <Button className={cn('rounded-lg')} onClick={() => setPlatformUserSkip(pageNext)} variant={platformUserSkip === pageNext ? 'default' : 'outline'} >{i + 1}</Button>
                  </PaginationItem>
                )
              })}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  disabled={platformUserSkip + platformUserTake >= platformUserCount}
                  onClick={handleNext}

                >
                  <PaginationNext />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>

      <PlatformUserViewDialog
        open={isOpen("view")}
        onOpenChange={(open) => !open && close()}
        user={selectedUser}
      />

      <PlatformUserEditDialog
        open={isOpen("edit")}
        onOpenChange={(open) => !open && close()}
        user={selectedUser}
        onSaved={refresh}
      />

      <PlatformUserDeleteDialog
        open={isOpen("delete")}
        onOpenChange={(open) => !open && close()}
        user={selectedUser}
        onDeleted={refresh}
      />
    </Card>
  );
}