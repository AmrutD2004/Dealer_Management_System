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
import type { PermissionListType } from "@/Types/permissionType"
import dayjs from "dayjs"
import { KeyRound } from "lucide-react"
import { useContext } from "react"
import { PlatformUserContext } from "@/Contexts/PlatformUserContext.tsx/PlatformUserContext"

type props = {
  permission: PermissionListType | null,
  open: boolean,
  onClose: () => void
}

const Detail = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
    <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
    <span className="text-xs font-medium">{value}</span>
  </div>
)

export function ViewPermissionModal({ permission, open, onClose }: props) {
  const { closeAllPermissionModals } = useContext(PlatformUserContext)

  const handleClose = () => {
    closeAllPermissionModals()
    onClose()
  }

  if (!permission) return null

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm lg:max-w-3xl md:max-w-xl" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <KeyRound className="h-8 w-8 text-primary" />
            <div>
              <DialogTitle className="text-lg">Permission Details</DialogTitle>
              <DialogDescription>
                Read-only view of the permission record.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-3">
          <div>
            <div className="mb-2 bg-muted/40 px-2 py-1">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Permission Details</h3>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
              <Detail label="Permission ID" value={<span className="font-mono">{permission.id}</span>} />
              <Detail label="Permission Code" value={<span className="font-mono">{permission.permissionCode}</span>} />
              <Detail label="Status" value={<Badge variant={permission.isActive ? "success" : "destructive"}>{permission.isActive ? "Active" : "Inactive"}</Badge>} />
              <Detail label="Permission Name" value={permission.permissionName} />
              <Detail label="Description" value={permission.description || "—"} />
              <Detail label="Created At" value={dayjs(permission.createdAt).format('DD MMM YYYY')} />
              <Detail label="Updated At" value={dayjs(permission.updatedAt).format('DD MMM YYYY')} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleClose} variant="outline" size="sm" className="h-7 px-3 text-xs">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
