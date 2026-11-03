import { getServiceQuotationList } from "@/api/endpoints"
import TenantDashboardLayout from "@/components/layout/TenantLayout/DashboardLayout"
import { ServiceQuotationDetails } from "@/components/TenantUsers/ServiceQuotation/ServiceQuotationDetails"
import {
  statusLabels,
  statusVariants,
} from "@/components/TenantUsers/ServiceQuotation/serviceQuotationUtils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { downloadServiceQuotationPdf } from "@/lib/serviceQuotationPdf"
import type { serviceQuotationListType } from "@/Types/serviceQuotationType"
import { ArrowLeft, Download, FileText, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const ServiceQuotationView = () => {
  const navigate = useNavigate()
  const { id, quotationId } = useParams()
  const [quotation, setQuotation] = useState<serviceQuotationListType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const goBack = () => navigate(`/tenant/${id}/service-quotation`)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getServiceQuotationList()
        if (cancelled) return
        const list: serviceQuotationListType[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : []
        const found = list.find(
          (item) => String(item.id) === String(quotationId)
        )
        if (!found) {
          setError("Service quotation not found")
          return
        }
        setQuotation(found)
      } catch (err: unknown) {
        if (cancelled) return
        const message = (
          err as { response?: { data?: { message?: string } } }
        )?.response?.data?.message
        toast.add({
          type: "error",
          description: message ?? "Failed to load service quotation",
        })
        setError(message ?? "Failed to load service quotation")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [quotationId])

  const handleDownload = () => {
    if (!quotation) return
    downloadServiceQuotationPdf(quotation)
  }

  return (
    <TenantDashboardLayout>
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-start justify-between gap-4 px-7 py-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    View Service Quotation
                  </h1>
                  {quotation ? (
                    <Badge variant={statusVariants[quotation.status]}>
                      {statusLabels[quotation.status]}
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {quotation?.quotationNo ??
                    "Review the complete service quotation details."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={goBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleDownload}
                disabled={!quotation}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>

          <div className="mx-5 mb-5 rounded-2xl border px-6 shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading service quotation...
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button variant="outline" onClick={goBack}>
                  Back to Service Quotations
                </Button>
              </div>
            ) : quotation ? (
              <ServiceQuotationDetails quotation={quotation} />
            ) : null}
          </div>
        </div>
      </div>
    </TenantDashboardLayout>
  )
}

export default ServiceQuotationView
