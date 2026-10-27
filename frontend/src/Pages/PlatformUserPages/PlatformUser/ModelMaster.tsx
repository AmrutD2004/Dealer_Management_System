import DashboardLayout from '@/components/layout/PlatformLayout/DashboardLayout'
import ModelMasterHeader from '@/components/ModelMaster/ModelMasterHeader'
import ModelMasterListTable from '@/components/ModelMaster/ModelMasterListTable'
import { useState } from 'react'

const ModelMaster = () => {
    const [refreshKey, setRefreshKey] = useState(0)

    return (
        <DashboardLayout>
            <div className='max-w-7xl mx-auto px-7 py-5'>
                <section>
                    <ModelMasterHeader onCreated={() => setRefreshKey(key => key + 1)} />
                </section>
                <section>
                    <ModelMasterListTable refreshKey={refreshKey} />
                </section>
            </div>
        </DashboardLayout>
    )
}

export default ModelMaster
