import { useState } from 'react';
import { IMaskInput } from 'react-imask';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

export function CadastroVisitaModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    tipoPessoa: '',
    razaoSocial: '',
    cnpj: '',
    ieRg: '',
    email: '',
    telefone: '',
    celularContato: '',
    estado: '',
    cidade: '',
    cep: '',
    tipoBairro: '',
    bairro: '',
    numero: '',
    tipoEndereco: '',
    endereco: '',
    complemento: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateCNPJ = (cnpj: string) => {
    const numeros = cnpj.replace(/[^\d]/g, '');
    if (numeros.length !== 14) return false;
    return true;
  };

  const buscarCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/[^\d]/g, '');
    if (cepLimpo.length !== 8) return;

    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data: EnderecoViaCEP = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          endereco: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.razaoSocial) {
      newErrors.razaoSocial = 'Campo obrigatório';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.tipoPessoa === 'juridica' && !validateCNPJ(formData.cnpj)) {
      newErrors.cnpj = 'CNPJ inválido';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      const supabase = createBrowserClient();

      try {
        // Verificar autenticação
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError || !session) {
          toast.error("Sessão expirada. Por favor, faça login novamente.");
          return;
        }

        // Inserir cliente no banco
        const { error: insertError } = await supabase
          .from("clientes")
          .insert([{
            tipo_pessoa: formData.tipoPessoa,
            razao_social: formData.razaoSocial,
            cnpj_cpf: formData.cnpj,
            ie_rg: formData.ieRg,
            email: formData.email,
            telefone: formData.telefone,
            celular: formData.celularContato,
            estado: formData.estado,
            cidade: formData.cidade,
            cep: formData.cep,
            tipo_bairro: formData.tipoBairro,
            bairro: formData.bairro,
            numero: formData.numero,
            tipo_endereco: formData.tipoEndereco,
            endereco: formData.endereco,
            complemento: formData.complemento
          }]);

        if (insertError) {
          if (insertError.code === "23505") { // Violação de chave única
            toast.error("Este cliente já está cadastrado");
          } else {
            console.error("Erro ao salvar cliente:", insertError);
            toast.error(`Erro ao salvar cliente: ${insertError.message}`);
          }
          return;
        }

        toast.success("Cliente cadastrado com sucesso!");
        setFormData({
          tipoPessoa: '',
          razaoSocial: '',
          cnpj: '',
          ieRg: '',
          email: '',
          telefone: '',
          celularContato: '',
          estado: '',
          cidade: '',
          cep: '',
          tipoBairro: '',
          bairro: '',
          numero: '',
          tipoEndereco: '',
          endereco: '',
          complemento: ''
        });
        setOpen(false);
      } catch (error) {
        console.error("Erro ao salvar cliente:", error);
        toast.error("Erro ao salvar cliente. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'cep') {
      buscarCEP(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Registrar Novo Cliente</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cadastro de Novo Cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipoPessoa">Tipo de Pessoa</Label>
              <Select onValueChange={(value) => handleChange('tipoPessoa', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fisica">Física</SelectItem>
                  <SelectItem value="juridica">Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="razaoSocial">Razão Social</Label>
              <Input
                id="razaoSocial"
                value={formData.razaoSocial}
                onChange={(e) => handleChange('razaoSocial', e.target.value)}
                className={errors.razaoSocial ? 'border-red-500' : ''}
              />
              {errors.razaoSocial && (
                <span className="text-red-500 text-sm">{errors.razaoSocial}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <IMaskInput
                mask={formData.tipoPessoa === 'juridica' ? "00.000.000/0000-00" : "000.000.000-00"}
                value={formData.cnpj}
                onAccept={(value) => handleChange('cnpj', value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.cnpj && (
                <span className="text-red-500 text-sm">{errors.cnpj}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ieRg">IE/RG</Label>
              <Input
                id="ieRg"
                value={formData.ieRg}
                onChange={(e) => handleChange('ieRg', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <IMaskInput
                mask="(00) 0000-0000"
                value={formData.telefone}
                onAccept={(value) => handleChange('telefone', value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="celularContato">Celular Contato</Label>
              <IMaskInput
                mask="(00) 00000-0000"
                value={formData.celularContato}
                onAccept={(value) => handleChange('celularContato', value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <IMaskInput
                mask="00000-000"
                value={formData.cep}
                onAccept={(value) => handleChange('cep', value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                value={formData.estado}
                onChange={(e) => handleChange('estado', e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => handleChange('cidade', e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoBairro">Tipo do Bairro</Label>
              <Input
                id="tipoBairro"
                value={formData.tipoBairro}
                onChange={(e) => handleChange('tipoBairro', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                value={formData.bairro}
                onChange={(e) => handleChange('bairro', e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => handleChange('numero', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoEndereco">Tipo Endereço</Label>
              <Input
                id="tipoEndereco"
                value={formData.tipoEndereco}
                onChange={(e) => handleChange('tipoEndereco', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleChange('endereco', e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                value={formData.complemento}
                onChange={(e) => handleChange('complemento', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Carregando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
