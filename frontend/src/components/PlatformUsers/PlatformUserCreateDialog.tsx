import { useState } from "react";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Field } from "@/components/Field";

import { asChoice } from "@/lib/utils";

import { emptyPlatformUserForm, isPlatformUserDraftValid } from "./helpers";

import type { PlatformUserDraft, PlatformUserRole, PlatformUserStatus } from "./types";
import type { platformNewuserCreateType } from "@/Types/platformUserType";
import { createNewPlatformUser } from "@/api/endpoint";
import { toast } from "../ui/toast";

interface PlatformUserCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (draft: PlatformUserDraft) => void;
  loading?: boolean;
}

export function PlatformUserCreateDialog({
  open,
  onOpenChange,
  onCreate,
}: PlatformUserCreateDialogProps) {
const emptyForm: platformNewuserCreateType = {
  email: "",
  passwordHash: "",
  role: "",
};

const [loading, setLoading] = useState<boolean>(false);
const [formData, setFormData] = useState<platformNewuserCreateType>({ ...emptyForm });

const [wasOpen, setWasOpen] = useState(open);

if (open !== wasOpen) {
  setWasOpen(open);

  if (open) {
    setFormData({ ...emptyForm });
    setLoading(false);
  }
}

const handleChange = (e : React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
  const {name, value} = e.target;
  setFormData(prev=>({...prev, [name] : value}))
}

const handleSubmit = async(e : React.FormEvent)=>{
  e.preventDefault();
  setLoading(true)
  try{
    const payload = {
      email : formData.email,
      passwordHash : formData.passwordHash,
      role : formData.role
    }
    const data = await createNewPlatformUser(payload)
    if(data?.success){
      toast.add({
        type : 'success',
        description : data?.message
      })
      setTimeout(()=>{
        !open
      }, 2000)
    }
    if(!data?.success){
      toast.add({
        type : 'error',
        description : data?.message
      })
    }
  }catch (err : any){
    toast.add({
        type : 'error',
        description : err?.response?.data?.message
      })
      setLoading(false)
  }finally{
    setLoading(false)
  }
}
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add Platform User</DialogTitle>

          <DialogDescription>
            Create an admin account for the DMS platform and grant an initial
            role.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Profile */}

            <div>
              <h3 className="mb-4 text-sm font-semibold text-slate-900">
                Profile
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                
                <Field label="Email *" className="sm:col-span-2">
                  <Input
                    name='email'
                    type='email'
                    placeholder="name@redogroup.com"
                    onChange={handleChange}
                    value={formData.email}
                  />
                </Field>
              </div>
            </div>

            {/* Role */}

            <div>
              <h3 className="mb-4 text-sm font-semibold text-slate-900">
                Role Assignment
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Platform Role" >
                  <Select name='role'
                  
                  value={formData.role}
                  onValueChange={(value)=> setFormData((prev : any)=> ({...prev, role : value}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="Select Role">Select Role</SelectItem>
                      <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>

                      <SelectItem value="SUPPORT_ADMIN">
                        Support Admin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </div>

            {/* Credentials */}

            <div>
              <h3 className="mb-4 text-sm font-semibold text-slate-900">
                Credentials
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Initial Password *" className="sm:col-span-2">
                  <Input
                    type="password"
                    name='passwordHash'
                    placeholder="Set a temporary password"
                    onChange={handleChange}
                    value={formData.passwordHash}
                  />
                </Field>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
            
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

              Create Platform User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
