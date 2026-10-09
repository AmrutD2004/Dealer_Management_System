import DashboardLayout from '@/components/layout/PlatformLayout/DashboardLayout'
import PermissionHeader from '@/components/Permissions/PermissionHeader'
import PermissionListTable from '@/components/Permissions/Tables/PermissionListTable'

const Permission = () => {
    return (
        <DashboardLayout>
            <div className='max-w-7xl mx-auto px-7 py-5'>
                <section>
                    <PermissionHeader />
                </section>
                <section>
                    <PermissionListTable />
                </section>
            </div>
        </DashboardLayout>
    )
}

export default Permission
