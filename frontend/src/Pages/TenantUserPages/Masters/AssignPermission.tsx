import DashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import AssignPermissionHeader from '@/components/TenantUsers/Masters/AssignPermission/AssignPermissionHeader'
import React from 'react'

const AssignPermission = () => {
  return (
    <DashboardLayout>
        <div className='max-w-7xl mx-auto px-7 py-5'>
            <section>
                <AssignPermissionHeader />
            </section>
            <section>

            </section>
        </div>
    </DashboardLayout>
  )
}

export default AssignPermission
