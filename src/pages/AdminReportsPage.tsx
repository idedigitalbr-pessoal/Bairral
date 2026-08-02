import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, Filter, Plus, Download } from 'lucide-react';
import { DataTable, DataTableRow } from '../components/data-display/DataTable';
import { Surface } from '../components/ui/Surface';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/forms/SearchInput';
import { Select } from '../components/forms/Select';
import { Pagination } from '../components/navigation/Pagination';

export function AdminReportsPage() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filtro') || 'todos';
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const sampleData: DataTableRow[] = [
    {
      id: '1',
      protocol: 'REL-2026-089',
      title: 'Ausência de Equipamento de Proteção Individual no pavilhão C',
      status: 'Em triagem',
      risk: 'crítico',
      priority: 'urgente',
      createdAt: '01/08/2026 14:20',
    },
    {
      id: '2',
      protocol: 'REL-2026-042',
      title: 'Solicitação de Ajuste no Horário de Visitação Familiar',
      status: 'Em análise',
      risk: 'baixo',
      priority: 'baixa',
      createdAt: '01/08/2026 11:05',
    },
    {
      id: '3',
      protocol: 'REL-2026-033',
      title: 'Ruído Excessivo em Gerador Noturno - Unidade Prados',
      status: 'Em investigação',
      risk: 'médio',
      priority: 'normal',
      createdAt: '31/07/2026 17:10',
    },
    {
      id: '4',
      protocol: 'REL-2026-021',
      title: 'Inconsistência no Lançamento de Medicamentos da Farmácia Central',
      status: 'Plano de ação',
      risk: 'alto',
      priority: 'alta',
      createdAt: '31/07/2026 10:15',
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4">
        <div>
          <Typography variant="h2">Manifestações & Chamados</Typography>
          <p className="text-xs text-[#737373]">Gerenciamento completo do acervo de relatos recebidos</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
            Exportar CSV
          </Button>
        </div>
      </div>

      <Surface variant="card" className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            placeholder="Buscar por protocolo, título..."
          />
          <Select
            options={[
              { label: 'Todos os Status', value: 'all' },
              { label: 'Em triagem', value: 'triagem' },
              { label: 'Em análise', value: 'analise' },
              { label: 'Resolvidas', value: 'resolvida' },
            ]}
          />
          <Select
            options={[
              { label: 'Todos os Riscos', value: 'all' },
              { label: 'Crítico / Alto', value: 'high' },
              { label: 'Médio', value: 'medium' },
              { label: 'Baixo', value: 'low' },
            ]}
          />
        </div>

        <DataTable data={sampleData} />

        <Pagination currentPage={currentPage} totalPages={4} onPageChange={setCurrentPage} />
      </Surface>
    </div>
  );
}
