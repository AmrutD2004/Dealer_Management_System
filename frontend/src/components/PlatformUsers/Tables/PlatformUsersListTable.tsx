import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import dayjs from 'dayjs'
import { useContext, useState } from 'react'
import { PlatformUserContext } from '@/Contexts/PlatformUserContext.tsx/PlatformUserContext'
import { Button } from '@/components/ui/button'
import { cn } from 'cn'
import { type PlatformUserEditType, type PlatformUsersListType } from '@/Types/platformUserType'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Check, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ViewPlatformUserDetailsModal } from '../Modals/ViewPlatformUserDetailsModal'
import EditPlatformUserModal from '../Modals/EditPlatformUserModal'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toast'
import { activatePlatformUser, deactivatePlatformUser } from '@/api/endpoints'

const PlatformUsersListTable = () => {
  const { platformUserCount, setPlatformUserSkip, platformUserSkip, platformUserTake, platformUsersList, fetchPlatformUsersList, activePlatformUserCount } = useContext(PlatformUserContext)
  const [viewAllUser, setViewAllUser] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<PlatformUsersListType | null>(null)
  const [editSelectedUser, setEditSelectedUser] = useState<PlatformUserEditType | null>(null)

  const userCount = viewAllUser ? platformUserCount : activePlatformUserCount
  const noOfPages = Math.ceil(userCount / platformUserTake)
  const handlePrevious = () => {
    setPlatformUserSkip((prev: number) =>
      Math.max(prev - platformUserTake, 0)
    )
  }

  const handleNext = () => {
    if (platformUserSkip + platformUserTake < userCount) {
      setPlatformUserSkip((prev: number) => prev + platformUserTake)
    }
  }

  const handleDeactive = async(id: number)=>{
    try{
      const data = await deactivatePlatformUser(Number(id))
      if(data?.success){
        toast.add({
          type : 'success',
          description : data?.message
        })
        fetchPlatformUsersList(platformUserSkip, platformUserTake)
      }
    }catch(err : any){
      toast.add({
        type : 'error',
        description : err?.response?.data?.message
      })
    }
  }
  const handleActive = async(id : number)=>{
    try{
      const data = await activatePlatformUser(Number(id))
      if(data?.success){
        toast.add({
          type : 'success',
          description : data?.message
        })
        fetchPlatformUsersList(platformUserSkip, platformUserTake)
      }
    }catch(err : any){
      toast.add({
        type : 'error',
        description : err?.response?.data?.message
      })
    }
  }
  return (
    <div className='w-full'>
      <div className="flex w-full items-center justify-end space-x-2">
        <Switch checked={viewAllUser} onCheckedChange={setViewAllUser} id="view-all-user" />
        <Label htmlFor="view-all-user">View All User</Label>
      </div>
      <Table className='w-full mt-5'>
        <TableCaption>A list of your platform users.</TableCaption>
        <TableHeader>
          <TableRow className='w-full'>
            <TableHead className="text-left w-[20px]">Sr no.</TableHead>
            <TableHead className='text-left font-medium'>Email</TableHead>
            <TableHead className='text-center'>Role</TableHead>
            <TableHead className='text-center'>Status</TableHead>
            <TableHead className="text-right">Created At</TableHead>
            <TableHead className="text-right">Updated At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        {!viewAllUser ? (
          <TableBody>
            {platformUsersList.filter((user: PlatformUsersListType) => user.isActive).map((user: PlatformUsersListType, idx: number) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell className='text-left flex items-center gap-3'><Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
                    {user.email.split("@")[0].slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>{user?.email}</TableCell>
                <TableCell className='text-center'><Badge variant={'outline'}>{user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Support Admin'}</Badge></TableCell>
                <TableCell className='text-center'><Badge variant={user?.isActive ? 'success' : 'destructive'}>{user?.isActive ? 'Active' : 'Deactive'}</Badge></TableCell>
                <TableCell className="text-right">{dayjs(user?.createdAt).format('DD MMM YYYY')}</TableCell>
                <TableCell className="text-right">{dayjs(user?.updatedAt).format('DD MMM YYYY')}</TableCell>
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
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => setEditSelectedUser(user)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

<DropdownMenuItem
                        onClick={!user?.isActive ? ()=>handleActive(user?.id) : ()=>handleDeactive(user?.id)}
                        className={`${!user?.isActive ? 'text-green-600 focus:text-green-600' : 'text-destructive focus:text-destructive'}`}

                      >
                        {!user?.isActive ?<Check className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                        {!user?.isActive ? "Activate" : "Deactivate"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            {platformUsersList.map((user: PlatformUsersListType, idx: number) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell className='text-left flex items-center gap-3'><Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
                    {user.email.split("@")[0].slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>{user?.email}</TableCell>
                <TableCell className='text-center'><Badge variant={'outline'}>{user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Support Admin'}</Badge></TableCell>
                <TableCell className='text-center'><Badge variant={user?.isActive ? 'success' : 'destructive'}>{user?.isActive ? 'Active' : 'Deactive'}</Badge></TableCell>
                <TableCell className="text-right">{dayjs(user?.createdAt).format('DD MMM YYYY')}</TableCell>
                <TableCell className="text-right">{dayjs(user?.updatedAt).format('DD MMM YYYY')}</TableCell>
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
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => setEditSelectedUser(user)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

<DropdownMenuItem
                        onClick={!user?.isActive ? ()=>handleActive(user?.id) : ()=>handleDeactive(user?.id)}
                        className={`${!user?.isActive ? 'text-green-600 focus:text-green-600' : 'text-destructive focus:text-destructive'}`}

                      >
                        {!user?.isActive ?<Check className="mr-2 h-4 w-4 " /> : <Trash2 className="mr-2 h-4 w-4" />}
                        {!user?.isActive ? "Activate" : "Deactivate"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        )}
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
                disabled={platformUserSkip + platformUserTake >= userCount}
                onClick={handleNext}

              >
                <PaginationNext />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <ViewPlatformUserDetailsModal user={selectedUser} open={!!selectedUser} onClose={() => setSelectedUser(null)} />
      <EditPlatformUserModal user={editSelectedUser} open={!!editSelectedUser} onClose={() => setEditSelectedUser(null)} />
    </div>
  )
}

export default PlatformUsersListTable
