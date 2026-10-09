import { activateEmployee, deactivateEmployee } from "@/api/endpoints"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast"
import { type employeeListType } from "@/Types/tenantCreateType"
import { useContext, useEffect } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { Check, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { TenantContext } from "@/Contexts/Tenant/TenantContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ViewEmployeeModal } from "../Modals/ViewEmployeeModal"
import { EditEmployeeModal } from "../Modals/EditEmployeeModal"

const EmployeeListTable = () => {
  const {
    employeeList,
    employeeSkip,
    setEmployeeSkip,
    employeeTake,
    totalEmployees,
    selectedEmployee,
    viewEmployeeModalOpen,
    editEmployeeModalOpen,
    openViewEmployee,
    openEditEmployee,
    closeAllEmployeeModals,
    fetchEmployeeList,
  } = useContext(TenantContext)

  useEffect(() => {
    fetchEmployeeList(employeeSkip, employeeTake)
  }, [employeeSkip, employeeTake, fetchEmployeeList])

  const noOfPages = Math.ceil(totalEmployees / employeeTake)

  const handleDeactive = async (id: number) => {
    try {
      const data = await deactivateEmployee(Number(id))
      if (data?.success) {
        toast.add({
          type: "success",
          description: data?.message,
        })
        fetchEmployeeList(employeeSkip, employeeTake)
      }
    } catch (err: unknown) {
      toast.add({
        type: "error",
        description: (err as any)?.response?.data?.message,
      })
    }
  }

  const handleActive = async (id: number) => {
    try {
      const data = await activateEmployee(Number(id))
      if (data?.success) {
        toast.add({
          type: "success",
          description: data?.message,
        })
        fetchEmployeeList(employeeSkip, employeeTake)
      }
    } catch (err: unknown) {
      toast.add({
        type: "error",
        description: (err as any)?.response?.data?.message,
      })
    }
  }

  const handlePrevious = () => {
    setEmployeeSkip((prev: number) => Math.max(prev - employeeTake, 0))
  }

  const handleNext = () => {
    if (employeeSkip + employeeTake < totalEmployees) {
      setEmployeeSkip((prev: number) => prev + employeeTake)
    }
  }

  return (
    <div className="w-full">
      <Table className="mt-5 w-full">
        <TableCaption>A list of employees.</TableCaption>
        <TableHeader>
          <TableRow className="w-full">
            <TableHead className="text-left text-muted-foreground">
              Sr No.
            </TableHead>
            <TableHead className="text-left text-muted-foreground">
              Employee Code
            </TableHead>
            <TableHead className="text-left text-muted-foreground">
              Name
            </TableHead>
            <TableHead className="text-left text-muted-foreground">
              Email
            </TableHead>
            <TableHead className="text-left text-muted-foreground">
              Mobile No
            </TableHead>
            <TableHead className="text-left text-muted-foreground">
              Branch
            </TableHead>

            <TableHead className="text-left text-muted-foreground">
              Designation
            </TableHead>
            <TableHead className="text-center text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="text-right text-muted-foreground">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {employeeList.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center text-muted-foreground"
              >
                No employees is created
              </TableCell>
            </TableRow>
          ) : (
            employeeList.map((employee: employeeListType, idx: number) => {
              const fullName = [
                employee.firstName,
                employee.middleName,
                employee.lastName,
              ]
                .filter(Boolean)
                .join(" ")
              return (
                <TableRow key={employee.id}>
                  <TableCell className="text-left font-medium">
                    {employeeSkip + idx + 1}
                  </TableCell>
                  <TableCell className="text-left font-mono font-medium">
                    {employee.employeeCode}
                  </TableCell>
                  <TableCell className="text-left font-medium">
                    {fullName}
                  </TableCell>
                  <TableCell className="text-left font-medium">
                    {employee.email}
                  </TableCell>
                  <TableCell className="text-left font-medium">
                    {employee.mobileNo}
                  </TableCell>
                  <TableCell className="text-left font-medium">
                    {employee.branch?.branchName || "—"}
                  </TableCell>

                  <TableCell className="text-left font-medium">
                    {employee.designation?.name || "—"}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    <Badge
                      variant={employee.isActive ? "success" : "destructive"}
                    >
                      {employee.isActive ? "Active" : "Deactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Actions for ${fullName}`}
                          />
                        }
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openViewEmployee(employee.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => openEditEmployee(employee.id)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={
                            !employee?.isActive
                              ? () => handleActive(employee.id)
                              : () => handleDeactive(employee.id)
                          }
                          className={`${!employee?.isActive ? "text-green-600 focus:text-green-600" : "text-destructive focus:text-destructive"}`}
                        >
                          {!employee?.isActive ? (
                            <Check className="mr-2 h-4 w-4" />
                          ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                          )}
                          {!employee?.isActive ? "Activate" : "Deactivate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
      <div className="mt-10 flex w-full items-center justify-center gap-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                disabled={employeeSkip === 0}
                onClick={handlePrevious}
              >
                <PaginationPrevious />
              </Button>
            </PaginationItem>
            {[...Array(noOfPages).keys()].map((i) => {
              const pageNext = i * employeeTake
              return (
                <PaginationItem key={i}>
                  <Button
                    className={cn("rounded-lg")}
                    onClick={() => setEmployeeSkip(pageNext)}
                    variant={employeeSkip === pageNext ? "default" : "outline"}
                  >
                    {i + 1}
                  </Button>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                disabled={employeeSkip + employeeTake >= totalEmployees}
                onClick={handleNext}
              >
                <PaginationNext />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <ViewEmployeeModal
        employee={selectedEmployee}
        open={viewEmployeeModalOpen}
        onClose={closeAllEmployeeModals}
      />
      <EditEmployeeModal
        employee={selectedEmployee}
        open={editEmployeeModalOpen}
        onClose={closeAllEmployeeModals}
      />
    </div>
  )
}

export default EmployeeListTable
