import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { Tag, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"

export function EditBinModal({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const [binCode, setBinCode] = useState('')
  const [binName, setBinName] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)

  const onSubmit = async () => {
    setLoading(true)
    try {
      setLoading(false)
      setOpen(false)
      toast.add({
        type: 'success',
        description: 'Bin updated successfully',
      })
    } catch (err) {
      setLoading(false)
      toast.add({
        type: 'error',
        description: 'Unable to update bin.',
      })
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-3 w-3" /> Edit Bin
          </DialogTitle>
          <DialogDescription>Update bin details</DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <Input
            value={binCode}
            onChange={(e) => setBinCode(e.target.value)}
            disabled={loading}
            placeholder="Bin Code"
            className="w-full"
            required
          />
          <Input
            value={binName}
            onChange={(e) => setBinName(e.target.value)}
            disabled={loading}
            placeholder="Bin Name"
            className="w-full"
            required
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            placeholder="Description"
            className="w-full"
          />
          <div className="flex items-center gap-2">
            <Badge
              variant={isActive ? 'default' : 'outline'}
              className="h-3 w-3"
            >
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
            <span className="text-sm text-muted-foreground ml-2">Active</span>
            <Input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={loading}
            />
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setOpen(false)} variant="outline" disabled={loading}>
              Close
            </Button>
            <Button type="submit" onClick={onSubmit} disabled={loading}>
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}