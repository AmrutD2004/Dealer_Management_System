import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import { CreateMRNModal } from '@/components/TenantUsers/MRN/CreateMRNModal'
import MRNHeader from '@/components/TenantUsers/MRN/MRNHeader'
import MRNListTable from '@/components/TenantUsers/MRN/MRNListTable'
import { useState } from 'react'

const MRN = () => {
  const [createOpen, setCreateOpen] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section>
          <MRNHeader onCreate={() => setCreateOpen(true)} />
        </section>
        <section>
          <MRNListTable refreshKey={reloadKey} />
        </section>
      </div>
      <CreateMRNModal
        open={createOpen}
        setOpen={setCreateOpen}
        onCreated={() => setReloadKey((key) => key + 1)}
      />
    </TenantDashboardLayout>
  )
}

export default MRN
