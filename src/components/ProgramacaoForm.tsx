import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Form } from "@/components/ui/form"

const ProgramacaoForm = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Programação de Embarque</h2>
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <Input type="date" className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Colaborador</label>
            <Select>
              <option value="">Selecione um colaborador</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Função</label>
            <Select>
              <option value="">Selecione uma função</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ordem de Serviço</label>
            <Input type="text" placeholder="Digite a ordem de serviço" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cliente</label>
            <Select>
              <option value="">Selecione um cliente</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <Select>
              <option value="">Selecione um tipo</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Local Região</label>
            <Input type="text" placeholder="Digite a região" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Origem</label>
            <Input type="text" placeholder="Fazenda ou Armazém" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Produto</label>
            <Select>
              <option value="">Selecione um produto</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">OGM / Aflatoxina</label>
            <Select>
              <option value="">Selecione uma opção</option>
            </Select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Destino da Carga</label>
            <Input type="text" placeholder="Digite o destino" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="bg-teal-800 text-white hover:bg-teal-700">
            + Adicionar
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ProgramacaoForm
