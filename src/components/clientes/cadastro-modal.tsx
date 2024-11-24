"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createBrowserClient } from "@/lib/supabase";
import { toast } from 'sonner';

interface EnderecoViaCEP {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

interface CadastroModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CadastroModal({ open, onOpenChange, onSuccess }: CadastroModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState<'fisica' | 'juridica'>('juridica');
  const supabase = createBrowserClient();

  const [formData, setFormData] = useState({
    razao_social: '',
    cnpj_cpf: '',
    ie_rg: '',
    email: '',
    telefone: '',
    celular: '',
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    tipo_bairro: '',
    endereco: '',
    tipo_endereco: '',
    numero: '',
    complemento: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const buscarCEP = async (cep: string) => {
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data: EnderecoViaCEP = await response.json();

      if (data.logradouro) {
        setFormData(prev => ({
          ...prev,
          endereco: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf
        }));
      }
    } catch (error) {
      toast.error('Erro ao buscar CEP');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('clientes')
        .insert([
          {
            tipo_pessoa: tipoPessoa,
            ...formData
          }
        ]);

      if (error) throw error;

      toast.success('Cliente cadastrado com sucesso!');
      onSuccess?.();
      onOpenChange(false);
      
      // Limpa o formulário
      setFormData({
        razao_social: '',
        cnpj_cpf: '',
        ie_rg: '',
        email: '',
        telefone: '',
        celular: '',
        cep: '',
        estado: '',
        cidade: '',
        bairro: '',
        tipo_bairro: '',
        endereco: '',
        tipo_endereco: '',
        numero: '',
        complemento: ''
      });
    } catch (error) {
      toast.error('Erro ao cadastrar cliente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastro de Cliente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Pessoa</Label>
              <Select 
                value={tipoPessoa} 
                onValueChange={(value: 'fisica' | 'juridica') => setTipoPessoa(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="juridica">Jurídica</SelectItem>
                  <SelectItem value="fisica">Física</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                {tipoPessoa === 'juridica' ? 'Razão Social' : 'Nome Completo'}
              </Label>
              <Input
                name="razao_social"
                value={formData.razao_social}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{tipoPessoa === 'juridica' ? 'CNPJ' : 'CPF'}</Label>
              <Input
                name="cnpj_cpf"
                value={formData.cnpj_cpf}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{tipoPessoa === 'juridica' ? 'Inscrição Estadual' : 'RG'}</Label>
              <Input
                name="ie_rg"
                value={formData.ie_rg}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Celular</Label>
              <Input
                name="celular"
                value={formData.celular}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>CEP</Label>
              <Input
                name="cep"
                value={formData.cep}
                onChange={(e) => {
                  handleInputChange(e);
                  if (e.target.value.length === 8) {
                    buscarCEP(e.target.value);
                  }
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <Input
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo do Bairro</Label>
              <Select 
                value={formData.tipo_bairro} 
                onValueChange={(value) => handleSelectChange('tipo_bairro', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bairro">Bairro</SelectItem>
                  <SelectItem value="jardim">Jardim</SelectItem>
                  <SelectItem value="parque">Parque</SelectItem>
                  <SelectItem value="vila">Vila</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input
                name="bairro"
                value={formData.bairro}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo do Endereço</Label>
              <Select 
                value={formData.tipo_endereco} 
                onValueChange={(value) => handleSelectChange('tipo_endereco', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rua">Rua</SelectItem>
                  <SelectItem value="avenida">Avenida</SelectItem>
                  <SelectItem value="alameda">Alameda</SelectItem>
                  <SelectItem value="praca">Praça</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Endereço</Label>
              <Input
                name="endereco"
                value={formData.endereco}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Número</Label>
              <Input
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Complemento</Label>
              <Input
                name="complemento"
                value={formData.complemento}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
