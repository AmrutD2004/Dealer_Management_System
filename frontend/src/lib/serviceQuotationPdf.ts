import type { serviceQuotationListType } from "@/Types/serviceQuotationType"
import dayjs from "dayjs"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import {
  sourceLabels,
  statusLabels,
} from "@/components/TenantUsers/ServiceQuotation/serviceQuotationUtils"

const money = (value: string | number) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

const text = (value?: string | number | null) =>
  value === null || value === undefined || value === "" ? "-" : String(value)

const getFinalY = (doc: jsPDF) =>
  (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
    ?.finalY ?? 0

const navy: [number, number, number] = [29, 48, 70]
const teal: [number, number, number] = [0, 127, 139]
const pale: [number, number, number] = [239, 246, 247]
const ink: [number, number, number] = [43, 52, 60]
const muted: [number, number, number] = [105, 116, 125]

export function downloadServiceQuotationPdf(quotation: serviceQuotationListType) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 13
  const contentWidth = pageWidth - margin * 2
  const customerName = quotation.customer
    ? `${quotation.customer.title ? `${quotation.customer.title} ` : ""}${quotation.customer.firstName} ${quotation.customer.lastName}`.trim()
    : "-"
  const vehicleName = quotation.vehicle
    ? `${quotation.vehicle.brand?.brandName ?? ""} ${quotation.vehicle.model?.modelName ?? ""} ${quotation.vehicle.variant?.variantName ?? ""}`.trim()
    : ""
  const vehicleNumber = quotation.vehicle?.vehicleNumber || quotation.vehicle?.chassisNumber || "-"
  const address = quotation.customer
    ? [
        quotation.customer.address1,
        quotation.customer.address2,
        quotation.customer.city,
        quotation.customer.state,
        quotation.customer.pincode,
      ].filter(Boolean).join(", ")
    : ""

  const sectionTitle = (title: string, y: number) => {
    doc.setFillColor(...teal)
    doc.roundedRect(margin, y - 4.2, 2, 5.2, 0.8, 0.8, "F")
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(...navy)
    doc.text(title.toUpperCase(), margin + 5, y)
  }

  const addPageHeader = (continued = false) => {
    doc.setFillColor(...navy)
    doc.rect(0, 0, pageWidth, 34, "F")
    doc.setFillColor(...teal)
    doc.rect(0, 32, pageWidth, 2, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(17)
    doc.text("SERVICE QUOTATION", margin, 14)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.text(text(quotation.branch?.branchName), margin, 21)
    doc.setFontSize(8)
    doc.setTextColor(210, 222, 230)
    doc.text(continued ? "QUOTATION DETAILS • CONTINUED" : "SERVICE ESTIMATE", margin, 28)

    doc.setFont("helvetica", "bold")
    doc.setFontSize(8)
    doc.setTextColor(198, 224, 225)
    doc.text("QUOTATION NO.", pageWidth - margin, 9, { align: "right" })
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(13)
    doc.text(text(quotation.quotationNo), pageWidth - margin, 15, { align: "right" })
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.setTextColor(230, 237, 241)
    doc.text(`Date  ${quotation.createdAt ? dayjs(quotation.createdAt).format("DD MMM YYYY") : "-"}`, pageWidth - margin, 22, { align: "right" })
    doc.text(`Status  ${statusLabels[quotation.status]}`, pageWidth - margin, 28, { align: "right" })
  }

  const tableTheme = {
    theme: "grid" as const,
    styles: { font: "helvetica", fontSize: 7.5, cellPadding: 2.2, textColor: ink, lineColor: [218, 225, 229] as [number, number, number], lineWidth: 0.15, valign: "middle" as const },
    headStyles: { fillColor: navy, textColor: 255, fontStyle: "bold" as const, fontSize: 7 },
    alternateRowStyles: { fillColor: [247, 249, 250] as [number, number, number] },
    margin: { left: margin, right: margin },
    rowPageBreak: "avoid" as const,
  }

  addPageHeader()

  // Customer and vehicle details are grouped as two compact estimate panels.
  const panelY = 40
  const panelGap = 5
  const panelWidth = (contentWidth - panelGap) / 2
  const panelHeight = 39
  const drawPanel = (x: number, title: string, rows: [string, string][]) => {
    doc.setFillColor(248, 250, 251)
    doc.setDrawColor(222, 229, 233)
    doc.roundedRect(x, panelY, panelWidth, panelHeight, 2, 2, "FD")
    doc.setFillColor(...pale)
    doc.roundedRect(x, panelY, panelWidth, 8, 2, 2, "F")
    doc.rect(x, panelY + 6, panelWidth, 2, "F")
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8)
    doc.setTextColor(...navy)
    doc.text(title.toUpperCase(), x + 3, panelY + 5.5)
    let y = panelY + 13
    rows.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(7)
      doc.setTextColor(...muted)
      doc.text(label, x + 3, y)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(...ink)
      const lines = doc.splitTextToSize(text(value), panelWidth - 25)
      doc.text(lines, x + 25, y)
      y += lines.length > 1 ? 7 : 5
    })
  }

  drawPanel(margin, "Customer", [
    ["Name", customerName],
    ["Mobile", text(quotation.customer?.mobileNo)],
    ["Address", address || "-"],
  ])
  drawPanel(margin + panelWidth + panelGap, "Vehicle & service", [
    ["Registration", vehicleNumber],
    ["Vehicle", vehicleName || "-"],
    ["Reading", `${text(quotation.currentReading)} km`],
    ["Service", [quotation.serviceCategory?.name, quotation.serviceType?.name].filter(Boolean).join(" / ") || "-"],
  ])

  let y = panelY + panelHeight + 10
  if (quotation.repairOrderType?.name || quotation.insurancePartyName) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.setTextColor(...muted)
    const extra = [
      quotation.repairOrderType?.name ? `Repair order: ${quotation.repairOrderType.name}` : "",
      quotation.insurancePartyName ? `Insurance party: ${quotation.insurancePartyName}` : "",
    ].filter(Boolean).join("     •     ")
    doc.text(extra, margin, y)
    y += 7
  }

  const parts = quotation.serviceQuotationParts ?? []
  if (parts.length) {
    sectionTitle("Parts & materials", y)
    y += 3
    autoTable(doc, {
      ...tableTheme,
      startY: y,
      head: [["#", "Part no.", "Description", "Qty", "Rate", "Disc.", "Tax", "Amount"]],
      body: parts.map((part, index) => [
        String(index + 1), text(part.partNo), text(part.partDescription), String(part.quantity),
        money(part.rate), money(part.discountAmount), money(part.taxAmount), money(part.totalAmount),
      ]),
      columnStyles: {
        0: { cellWidth: 7 }, 1: { cellWidth: 22 }, 2: { cellWidth: "auto" }, 3: { cellWidth: 10, halign: "right" },
        4: { cellWidth: 23, halign: "right" }, 5: { cellWidth: 21, halign: "right" }, 6: { cellWidth: 20, halign: "right" }, 7: { cellWidth: 24, halign: "right", fontStyle: "bold" },
      },
    })
    y = getFinalY(doc) + 8
  }

  const labours = quotation.serviceQuotationLabours ?? []
  if (labours.length) {
    if (y > pageHeight - 48) {
      doc.addPage()
      addPageHeader(true)
      y = 43
    }
    sectionTitle("Labour & services", y)
    y += 3
    autoTable(doc, {
      ...tableTheme,
      startY: y,
      head: [["#", "Code", "Description", "Rate", "Discount", "Tax", "Amount"]],
      body: labours.map((labour, index) => [
        String(index + 1), text(labour.labourCode), `${text(labour.labourName)}${labour.labourDescription ? ` — ${labour.labourDescription}` : ""}`,
        money(labour.rate), money(labour.discountAmount), money(labour.taxAmount), money(labour.totalAmount),
      ]),
      columnStyles: {
        0: { cellWidth: 7 }, 1: { cellWidth: 20 }, 2: { cellWidth: "auto" }, 3: { cellWidth: 25, halign: "right" },
        4: { cellWidth: 22, halign: "right" }, 5: { cellWidth: 21, halign: "right" }, 6: { cellWidth: 25, halign: "right", fontStyle: "bold" },
      },
    })
    y = getFinalY(doc) + 8
  }

  if (quotation.serviceQuotationCustomerVoices?.length) {
    if (y > pageHeight - 55) {
      doc.addPage()
      addPageHeader(true)
      y = 43
    }
    sectionTitle("Customer concerns / requested work", y)
    y += 3
    autoTable(doc, {
      ...tableTheme,
      startY: y,
      head: [["Concern / request", "Reported by"]],
      body: quotation.serviceQuotationCustomerVoices.map((voice) => [
        voice.customerVoice,
        sourceLabels[voice.source] ?? voice.source,
      ]),
      columnStyles: { 1: { cellWidth: 40 } },
    })
    y = getFinalY(doc) + 8
  }

  if (y > pageHeight - 70) {
    doc.addPage()
    addPageHeader(true)
    y = 43
  }

  sectionTitle("Estimate summary", y)
  y += 3
  const summaryX = pageWidth - margin - 82
  autoTable(doc, {
    ...tableTheme,
    startY: y,
    head: [["Description", "Amount"]],
    body: [
      ["Parts subtotal", money(quotation.partsBasicAmount)],
      ["Parts discount", money(quotation.partsDiscountAmount)],
      ["Parts tax", money(quotation.partsTaxAmount)],
      ["Parts total", money(quotation.partsTotalAmount)],
      ["Labour subtotal", money(quotation.labourBasicAmount)],
      ["Labour discount", money(quotation.labourDiscountAmount)],
      ["Labour tax", money(quotation.labourTaxAmount)],
      ["Labour total", money(quotation.labourTotalAmount)],
      ["Grand total", money(quotation.grandTotal)],
    ],
    tableWidth: 82,
    margin: { left: summaryX, right: margin },
    styles: { ...tableTheme.styles, fontSize: 7.5, cellPadding: 1.7 },
    columnStyles: { 0: { fontStyle: "bold" }, 1: { halign: "right" } },
    didParseCell: (data) => {
      if (data.section === "body" && data.row.index === 8) {
        data.cell.styles.fontStyle = "bold"
        data.cell.styles.fillColor = navy
        data.cell.styles.textColor = [255, 255, 255]
      }
    },
  })
  y = getFinalY(doc) + 8

  // Signature area is kept clear for the printed estimate workflow.
  if (y > pageHeight - 35) {
    doc.addPage()
    addPageHeader(true)
    y = 50
  }
  doc.setDrawColor(190, 200, 205)
  doc.line(margin, y + 12, margin + 55, y + 12)
  doc.line(pageWidth - margin - 55, y + 12, pageWidth - margin, y + 12)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7.5)
  doc.setTextColor(...muted)
  doc.text("Customer approval", margin, y + 17)
  doc.text("For service centre", pageWidth - margin, y + 17, { align: "right" })

  const pageCount = doc.getNumberOfPages()
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page)
    doc.setDrawColor(224, 230, 233)
    doc.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7)
    doc.setTextColor(...muted)
    doc.text("Thank you for choosing our service centre.", margin, pageHeight - 8)
    doc.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: "right" })
  }

  const fileName = `${(quotation.quotationNo || "service-quotation").replace(/[^\w-]+/g, "_")}.pdf`
  doc.save(fileName)
}
