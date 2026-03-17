import jsPDF from "jspdf"
import * as QRCode from "qrcode"
import { LaudoData } from "./laudoPDFSimple"

export const generateCorporatePDFV3 = async (laudo: LaudoData): Promise<string> => {

  const pdf = new jsPDF()

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const primaryColor:[number,number,number] = [0,51,102]
  const gray:[number,number,number] = [200,200,200]

  const line = 6
  const section = 12
  const sub = 8

  let y = 15

  /* HEADER */

  pdf.setFillColor(...primaryColor)
  pdf.rect(0,0,pageWidth,4,"F")

  /* LOGO ESQUERDA */

  pdf.setTextColor(...primaryColor)
  pdf.setFont("helvetica","bold")
  pdf.setFontSize(16)
  pdf.text("AGROCLASS",20,y)

  pdf.setFont("helvetica","normal")
  pdf.setFontSize(9)
  pdf.text("Sistemas de Classificação",20,y+5)

  /* TITULO CENTRAL */

  pdf.setFont("helvetica","bold")
  pdf.setFontSize(12)

  const title = pdf.splitTextToSize(
    "LAUDO DE ACOMPANHAMENTO DE EMBARQUE",
    90
  )

  pdf.text(title,pageWidth/2,y+2,{align:"center"})

  /* INFO DIREITA */

  pdf.setFont("helvetica","normal")
  pdf.setFontSize(8)

  let rightY = y

  pdf.text("CNPJ: 12.345.678/0001-90",pageWidth-20,rightY,{align:"right"})
  rightY+=4
  pdf.text("End.: Rua Principal, 123",pageWidth-20,rightY,{align:"right"})
  rightY+=4
  pdf.text("Tel: (11) 3456-7890",pageWidth-20,rightY,{align:"right"})
  rightY+=4
  pdf.text("WhatsApp: (11) 98765-4321",pageWidth-20,rightY,{align:"right"})

  y += 18

  pdf.setDrawColor(...gray)
  pdf.line(20,y,pageWidth-20,y)

  y += 8

  /* IDENTIFICAÇÃO */

  pdf.setFont("helvetica","bold")
  pdf.setFontSize(11)
  pdf.setTextColor(...primaryColor)

  pdf.text(`LAUDO Nº: ${laudo.id || "1"}`,20,y)

  pdf.text(
    `DATA: ${new Date(laudo.created_at).toLocaleDateString("pt-BR")}`,
    pageWidth-20,
    y,
    {align:"right"}
  )

  y += 10

  pdf.setDrawColor(...gray)
  pdf.line(20,y,pageWidth-20,y)

  y += 8

  /* COLUNAS */

  const leftX = 20
  const rightX = pageWidth/2 + 5
  const colWidth = pageWidth/2 - 25

  let leftY = y
  let rightColY = y

  /* CLIENTE */

  pdf.setFont("helvetica","bold")
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(10)
  pdf.text("CLIENTE",leftX,leftY)

  leftY += sub

  pdf.setFont("helvetica","normal")
  pdf.setTextColor(0,0,0)
  pdf.setFontSize(9)

  const client = [
    ["Empresa",laudo.client_name || "—"],
    ["CNPJ","—"],
    ["Contrato","—"]
  ]

  client.forEach(([l,v])=>{
    pdf.setFont("helvetica","bold")
    pdf.text(l+":",leftX,leftY)

    pdf.setFont("helvetica","normal")
    pdf.text(String(v),leftX+28,leftY)

    leftY+=line
  })

  leftY+=section

  /* CARGA */

  pdf.setFont("helvetica","bold")
  pdf.setTextColor(...primaryColor)
  pdf.text("CARGA",leftX,leftY)

  leftY+=sub

  const cargo = [
    ["OS",laudo.os_id],
    ["Placa",laudo.license_plate],
    ["Produto",laudo.product_name],
    ["Peso",`${laudo.weight_kg || "—"} kg`],
    ["Vistoriado",laudo.classifier_name]
  ]

  cargo.forEach(([l,v])=>{
    pdf.setFont("helvetica","bold")
    pdf.text(l+":",leftX,leftY)

    pdf.setFont("helvetica","normal")
    pdf.text(String(v||"—"),leftX+28,leftY)

    leftY+=line
  })

  leftY+=section

  /* TRANSPORTE */

  pdf.setFont("helvetica","bold")
  pdf.setTextColor(...primaryColor)
  pdf.text("TRANSPORTE",leftX,leftY)

  leftY+=sub

  const transport = [
    ["Transportadora",laudo.carrier],
    ["TAG pedágio","—"]
  ]

  transport.forEach(([l,v])=>{
    pdf.setFont("helvetica","bold")
    pdf.text(l+":",leftX,leftY)

    pdf.setFont("helvetica","normal")
    pdf.text(String(v||"—"),leftX+28,leftY)

    leftY+=line
  })

  /* CLASSIFICAÇÃO */

  pdf.setFont("helvetica","bold")
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(10)

  pdf.text("ITENS DE CLASSIFICAÇÃO",rightX,rightColY)

  rightColY+=sub

  pdf.setFont("helvetica","normal")
  pdf.setTextColor(0,0,0)
  pdf.setFontSize(9)

  const items = [
    ["Umidade",laudo.moisture],
    ["Impurezas",laudo.impurities],
    ["Quebrados",laudo.damaged],
    ["Ardidos",laudo.burnt],
    ["Fermentados",laudo.fermented],
    ["Mofados",laudo.moldy],
    ["Germinados",laudo.germinated],
    ["Imaturos",laudo.immature],
    ["Fragmentos",laudo.fragments],
    ["Insetos",laudo.insect_damage]
  ]

  items.forEach(([l,v])=>{
    pdf.setFont("helvetica","bold")
    pdf.text(l+":",rightX,rightColY)

    pdf.setFont("helvetica","normal")
    pdf.text(
      `${v || "N/A"} %`,
      rightX+colWidth,
      rightColY,
      {align:"right"}
    )

    rightColY+=line
  })

  /* ASSINATURAS */

  let signY = Math.max(leftY,rightColY) + 12

  pdf.setDrawColor(...gray)
  pdf.line(20,signY,pageWidth-20,signY)

  signY+=10

  pdf.setFont("helvetica","bold")
  pdf.setTextColor(...primaryColor)
  pdf.text("ASSINATURAS",20,signY)

  signY+=10

  pdf.setDrawColor(0,0,0)

  pdf.line(30,signY+15,80,signY+15)
  pdf.text("Classificador",55,signY+20,{align:"center"})
  pdf.text(String(laudo.classifier_name||"—"),55,signY+10,{align:"center"})

  pdf.line(120,signY+15,170,signY+15)
  pdf.text("Responsável Técnico",145,signY+20,{align:"center"})
  pdf.text("—",145,signY+10,{align:"center"})

  /* QR CODE */

  const qrUrl = `https://agroclass.com/laudo/${laudo.id || "1"}`
  const qrBase64 = await QRCode.toDataURL(qrUrl)

  pdf.addImage(
    qrBase64,
    "PNG",
    pageWidth - 45,
    pageHeight - 45,
    25,
    25
  )

  pdf.setFontSize(7)
  pdf.setTextColor(0,0,0)

  pdf.text(
    "Validar laudo",
    pageWidth - 32,
    pageHeight - 18,
    { align: "center" }
  )

  /* RODAPÉ */

  const footer = pageHeight-10

  pdf.setDrawColor(...gray)
  pdf.line(20,footer-6,pageWidth-20,footer-6)

  pdf.setFontSize(8)
  pdf.setFont("helvetica","italic")
  pdf.setTextColor(...primaryColor)

  pdf.text(
    `Laudo gerado pelo sistema AgroClass em ${new Date().toLocaleString("pt-BR")}`,
    pageWidth/2,
    footer,
    {align:"center"}
  )

  return pdf.output("datauristring")
}