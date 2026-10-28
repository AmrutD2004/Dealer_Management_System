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
import { Label } from "@/components/ui/label"
import type { PlatformUsersListType } from "@/Types/platformUserType"
import dayjs from "dayjs"

type props = {
  user: PlatformUsersListType | null,
  open: boolean,
  onClose: () => void
}

const Detail = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
    <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
    <span className="text-xs font-medium">{value}</span>
  </div>
)
export function ViewPlatformUserDetailsModal({ user, open, onClose }: props) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm lg:max-w-2xl md:max-w-xl" showCloseButton={false}>
        <DialogHeader >
          <DialogTitle>Platform User Details</DialogTitle>
          <DialogDescription>
            Read-only view of the platform administrator record.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-3">
          <div>
            <div className="mb-2 bg-muted/40 px-2 py-1">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">User Information</h3>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
              <Detail label="User Id" value={user?.id} />
              <Detail label="Role" value={<Badge>{user?.role === "SUPER_ADMIN" ? 'Super Admin' : 'Support'}</Badge>} />
              <Detail label="Email" value={user?.email} />
              <Detail label="Status" value={<Badge variant={user?.isActive ? 'success' : 'destructive'}>{user?.isActive ? 'Active' : 'Deactive'}</Badge>} />
              <Detail label="Created At" value={dayjs(user?.createdAt).format('DD MMM YYYY')} />
              <Detail label="Updated At" value={dayjs(user?.updatedAt).format('DD MMM YYYY')} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline"  >Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
