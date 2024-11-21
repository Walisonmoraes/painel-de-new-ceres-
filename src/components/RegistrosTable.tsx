import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, FileSpreadsheet, Printer } from "lucide-react"

const RegistrosTable = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Colaborador</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Ordem de Serviço</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Local Região</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>OGM / Aflatoxina</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Exemplo de linha */}
            <TableRow>
              <TableCell>01/01/2024</TableCell>
              <TableCell>João Silva</TableCell>
              <TableCell>Motorista</TableCell>
              <TableCell>OS123456</TableCell>
              <TableCell>Cliente A</TableCell>
              <TableCell>Tipo 1</TableCell>
              <TableCell>Região Sul</TableCell>
              <TableCell>Fazenda X</TableCell>
              <TableCell>Soja</TableCell>
              <TableCell>Sim</TableCell>
              <TableCell>Porto Y</TableCell>
              <TableCell className="space-x-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Trash2 className="h-4 w-4" />
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 flex justify-end space-x-4">
        <Button variant="outline" className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Exportar Excel
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Imprimir
        </Button>
      </div>
    </div>
  )
}

export default RegistrosTable
