import DashboardLayout from '@/components/layout/PlatformLayout/DashboardLayout'
import BrandHeader from '@/components/BrandMaster/BrandHeader'
import BrandListTable from '@/components/BrandMaster/BrandListTable'
import { useState } from 'react'

const Brand = () => {
    const [refreshKey, setRefreshKey] = useState(0)

    return (
        <DashboardLayout>
            <div className='max-w-7xl mx-auto px-7 py-5'>
                <section>
                    <BrandHeader onCreated={() => setRefreshKey(key => key + 1)} />
                </section>
                <section>
                    <BrandListTable refreshKey={refreshKey} />
                </section>
            </div>
        </DashboardLayout>
    )
}

export default Brand
