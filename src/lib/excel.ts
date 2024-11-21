import { utils, writeFile } from "xlsx"

interface ExcelColumn {
  header: string
  key: string
  width?: number
}

export function exportToExcel(
  data: any[],
  columns: ExcelColumn[],
  filename: string
) {
  // Preparar os dados para o Excel
  const excelData = data.map((item) => {
    const row: any = {}
    columns.forEach((col) => {
      row[col.header] = item[col.key]
    })
    return row
  })

  // Criar uma planilha
  const worksheet = utils.json_to_sheet(excelData)

  // Definir larguras das colunas
  const colWidths: { [key: string]: number } = {}
  columns.forEach((col, index) => {
    const colLetter = String.fromCharCode(65 + index) // A, B, C, etc.
    if (col.width) {
      colWidths[colLetter] = col.width
    }
  })
  worksheet["!cols"] = Object.keys(colWidths).map((key) => ({
    wch: colWidths[key],
  }))

  // Criar um workbook e adicionar a planilha
  const workbook = {
    Sheets: {
      data: worksheet,
    },
    SheetNames: ["data"],
  }

  // Exportar para arquivo
  writeFile(workbook, `${filename}.xlsx`)
}
