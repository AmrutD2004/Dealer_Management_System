import DashboardLayout from '@/components/layout/PlatformLayout/DashboardLayout'
import VariantMasterHeader from '@/components/VariantMaster/VariantMasterHeader'
import VariantMasterListTable from '@/components/VariantMaster/VariantMasterListTable'
import { useState } from 'react'

const VariantMaster = () => {
    const [refreshKey, setRefreshKey] = useState(0)

    return (
        <DashboardLayout>
            <div className='max-w-7xl mx-auto px-7 py-5'>
                <section>
                    <VariantMasterHeader onCreated={() => setRefreshKey(key => key + 1)} />
                </section>
                <section>
                    <VariantMasterListTable refreshKey={refreshKey} />
                </section>
            </div>
        </DashboardLayout>
    )
}

export default VariantMaster
