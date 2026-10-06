import DashboardLayout from '@/components/layout/PlatformLayout/DashboardLayout'
import PlatformUserHeader from '@/components/PlatformUsers/PlatformUserHeader'
import PlatformUsersListTable from '@/components/PlatformUsers/Tables/PlatformUsersListTable'
import React from 'react'

const PlatformUser = () => {
    return (
        <DashboardLayout>
            <div className='max-w-7xl mx-auto px-7 py-5'>
                <section>
                    <PlatformUserHeader />
                </section>
                <section>
                    <PlatformUsersListTable />
                </section>
            </div>
        </DashboardLayout>
    )
}

export default PlatformUser
