import DashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import AssignPermissionHeader from '@/components/TenantUsers/Masters/AssignPermission/AssignPermissionHeader'
import AssignPermissionListTable from '@/components/TenantUsers/Masters/AssignPermission/AssignPermissionListTable'

const AssignPermission = () => {
  return (
    <DashboardLayout>
        <div className='max-w-7xl mx-auto px-7 py-5'>
            <section>
                <AssignPermissionHeader />
            </section>
            <section>
                <AssignPermissionListTable />
            </section>
        </div>
    </DashboardLayout>
  )
}

export default AssignPermission
