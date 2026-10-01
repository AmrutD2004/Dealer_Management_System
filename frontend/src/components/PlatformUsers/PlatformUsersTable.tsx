import {
  Ban,
  CheckCircle2,
  Eye,
  MoreHorizontal,
  Pencil,
  ShieldCheck,
  Trash2,
  UserX,
} from "lucide-react";

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
  formatLastLogin,
  getFullName,
  getInitials,
  getRoleClass,
  getRoleLabel,
  getStatusClass,
  getStatusLabel,
} from "./helpers";

import type { PlatformUser } from "./types";

interface PlatformUsersTableProps {
  platformUsers: PlatformUser[];

  onView: (user: PlatformUser) => void;
  onEdit: (user: PlatformUser) => void;
  onAssignRole: (user: PlatformUser) => void;
  onActivate: (userId: string) => void;
  onDeactivate: (userId: string) => void;
  onSuspend: (userId: string) => void;
  onDelete: (user: PlatformUser) => void;
}

export function PlatformUsersTable({
  platformUsers,
  onView,
  onEdit,
  onAssignRole,
  onActivate,
  onDeactivate,
  onSuspend,
  onDelete,
}: PlatformUsersTableProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-base">All Platform Users</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {platformUsers.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <p className="text-sm font-medium text-slate-900">
              No platform users found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try a different search, or add a new platform user.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>

                <TableHead>Contact</TableHead>

                <TableHead>Role</TableHead>

                <TableHead>Status</TableHead>

                <TableHead>Last Sign In</TableHead>

                <TableHead className="w-12 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {platformUsers.map((user) => (
                <TableRow key={user.id}>
                  {/* User */}

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-600">
                          {getInitials(user)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">
                          {getFullName(user)}
                        </p>

                        <p className="text-xs text-slate-500">{user.userCode}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Contact */}

                  <TableCell>
                    <p className="text-slate-700">{user.email}</p>

                    <p className="text-xs text-slate-500">{user.phone}</p>
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

                  {/* Status */}

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusClass(user.status)}
                    >
                      {getStatusLabel(user.status)}
                    </Badge>
                  </TableCell>

                  {/* Last sign in */}

                  <TableCell className="text-slate-600">
                    {formatLastLogin(user.lastLoginAt)}
                  </TableCell>

                  {/* Actions */}

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Actions for ${getFullName(user)}`}
                          />
                        }
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem onClick={() => onView(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => onEdit(user)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => onAssignRole(user)}>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Assign Role
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {user.status === "ACTIVE" ? (
                          <>
                            <DropdownMenuItem
                              onClick={() => onDeactivate(user.id)}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Revoke Access
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => onSuspend(user.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend User
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem onClick={() => onActivate(user.id)}>
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                            Activate User
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => onDelete(user)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
