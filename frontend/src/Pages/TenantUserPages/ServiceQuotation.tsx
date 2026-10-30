import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import ServiceQuotationHeader from '@/components/TenantUsers/ServiceQuotation/ServiceQuotationHeader'
import ServiceQuotationListTable from '@/components/TenantUsers/ServiceQuotation/ServiceQuotationListTable'

const ServiceQuotation = () => {
  return (
    <TenantDashboardLayout>
      <div className='max-w-7xl mx-auto px-7 py-5'>
        <section>
          <ServiceQuotationHeader />
        </section>
        <section>
          <ServiceQuotationListTable />
        </section>
      </div>
    </TenantDashboardLayout>
  )
}

export default ServiceQuotation
