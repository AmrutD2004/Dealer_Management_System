import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import type { PlatformUsersListType } from "@/Types/platformUserType"
import dayjs from "dayjs"

type props = {
  user: PlatformUsersListType | null,
  open: boolean,
  onClose: () => void
}
export function ViewPlatformUserDetailsModal({ user, open, onClose }: props) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm lg:max-w-2xl md:max-w-xl" showCloseButton={false}>
        <DialogHeader >
          <DialogTitle>Platform User Details</DialogTitle>
          <DialogDescription>
            Read-only view of the platform administrator record.
          </DialogDescription>
          <FieldGroup className="grid grid-cols-2 mt-5">
            <Field>
              <Label className="text-sm font-medium text-muted-foreground tracking-tight leading-tight">User Id</Label>
              <span className="text-md font-semibold tracking-tight">{user?.id}</span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground tracking-tight leading-tight">Role</Label>
              <span><Badge>{user?.role === "SUPER_ADMIN" ? 'Super Admin' : 'Support'}</Badge></span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground tracking-tight leading-tight">Email</Label>
              <span className="text-md font-semibold tracking-tight">{user?.email}</span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground tracking-tight leading-tight">Status</Label>
              <span className="text-md font-semibold tracking-tight"><Badge variant={user?.isActive ? 'success' : 'destructive'}>{user?.isActive ? 'Active' : 'Deactive'}</Badge></span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground tracking-tight leading-tight">Created At</Label>
              <span className="text-md font-semibold tracking-tight">{dayjs(user?.createdAt).format('DD MMM YYYY')}</span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground tracking-tight leading-tight">Updated At</Label>
              <span className="text-md font-semibold tracking-tight">{dayjs(user?.updatedAt).format('DD MMM YYYY')}</span>
            </Field>
          </FieldGroup>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
