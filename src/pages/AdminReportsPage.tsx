import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Download, UserCheck, AlertTriangle, Clock, Filter, FileText } from 'lucide-react';
import { DataTable, DataTableRow } from '../components/data-display/DataTable';
import { Surface } from '../components/ui/Surface';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/data-display/Badge';
import { SearchInput } from '../components/forms/SearchInput';
import { Select } from '../components/forms/Select';
import { Pagination } from '../components/navigation/Pagination';
import { Spinner } from '../components/feedback/Spinner';
import { useReports } from '../hooks/useReports';
import { ReportStatusEnum, RiskLevelEnum, PriorityLevelEnum, Report } from '../types';
import { ReportStatus } from '../components/data-display/StatusBadge';
import { RiskLevel } from '../components/data-display/RiskBadge';
import { PriorityLevel } from '../components/data-display/PriorityBadge';
import { formatDate } from '../lib/dateUtils';

import { ExportButton } from '../components/ui/ExportButton';

export function AdminReportsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const filtro = searchParams.get('filtro') || 'todos';

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Configuração visual e de filtros conforme a aba selecionada na Sidebar
  let pageTitle = 'Manifestações & Chamados';
  let pageSubtitle = 'Gerenciamento completo do acervo de relatos recebidos';
  let headerBadge: { label: string; variant: 'yellow' | 'danger' | 'warning' | 'info' } | null = null;

  const queryFilters: any = {
    search: search || undefined,
  };

  if (filtro === 'minhas') {
    pageTitle = 'Minhas Atribuições';
    pageSubtitle = 'Manifestações sob sua responsabilidade e acompanhamento direto';
    headerBadge = { label: 'Atribuídos a você', variant: 'info' };
    queryFilters.assignedToMe = true;
  } else if (filtro === 'criticos') {
    pageTitle = 'Casos Críticos';
    pageSubtitle = 'Manifestações com nível de risco Alto ou Crítico que requerem ação urgente';
    headerBadge = { label: 'Prioridade Alta / Crítica', variant: 'danger' };
    queryFilters.criticalOnly = true;
  } else if (filtro === 'atraso') {
    pageTitle = 'Casos em Atraso';
    pageSubtitle = 'Manifestações com estouro de SLA ou prazo de resposta estipulado vencido';
    headerBadge = { label: 'Fora do SLA', variant: 'warning' };
    queryFilters.delayedOnly = true;
  }

  if (selectedStatus !== 'all') {
    queryFilters.status = [selectedStatus];
  }

  if (selectedRisk !== 'all') {
    queryFilters.riskLevel = [selectedRisk];
  }

  const { data: paginatedData, isLoading } = useReports(queryFilters, { page: currentPage, limit: 10 });

  const reportsList = paginatedData?.data || [];
  const totalPages = paginatedData?.meta?.totalPages || 1;

  // Mapeamento de enums para os rótulos visuais da tabela
  const mapStatusToLabel = (status: ReportStatusEnum): ReportStatus => {
    switch (status) {
      case ReportStatusEnum.RECEIVED: return 'Recebida';
      case ReportStatusEnum.TRIAGE: return 'Em triagem';
      case ReportStatusEnum.PENDING_INFO: return 'Informações pendentes';
      case ReportStatusEnum.ANALYSIS: return 'Em análise';
      case ReportStatusEnum.INVESTIGATION: return 'Em investigação';
      case ReportStatusEnum.FORWARDED: return 'Encaminhada';
      case ReportStatusEnum.ACTION_PLAN: return 'Plano de ação';
      case ReportStatusEnum.RESOLVED: return 'Concluída';
      case ReportStatusEnum.COMPLETED: return 'Concluída';
      case ReportStatusEnum.ARCHIVED: return 'Arquivada';
      case ReportStatusEnum.REOPENED: return 'Reaberta';
      default: return 'Em triagem';
    }
  };

  const mapRiskToLabel = (risk: RiskLevelEnum): RiskLevel => {
    switch (risk) {
      case RiskLevelEnum.LOW: return 'baixo';
      case RiskLevelEnum.MEDIUM: return 'médio';
      case RiskLevelEnum.HIGH: return 'alto';
      case RiskLevelEnum.CRITICAL: return 'crítico';
      default: return 'médio';
    }
  };

  const mapPriorityToLabel = (priority: PriorityLevelEnum): PriorityLevel => {
    switch (priority) {
      case PriorityLevelEnum.LOW: return 'baixa';
      case PriorityLevelEnum.NORMAL: return 'normal';
      case PriorityLevelEnum.HIGH: return 'alta';
      case PriorityLevelEnum.URGENT: return 'urgente';
      default: return 'normal';
    }
  };

  const tableData: DataTableRow[] = reportsList.map((rep) => ({
    id: rep.id,
    protocol: rep.protocol,
    title: rep.title,
    status: mapStatusToLabel(rep.status),
    risk: mapRiskToLabel(rep.riskLevel),
    priority: mapPriorityToLabel(rep.priorityLevel),
    createdAt: formatDate(rep.createdAt),
  }));

  const exportHeaders = ['Protocolo', 'Título / Resumo', 'Status', 'Nível de Risco', 'Prioridade', 'Data de Criação'];
  const exportRows = reportsList.map((r) => [
    r.protocol,
    r.title,
    mapStatusToLabel(r.status),
    mapRiskToLabel(r.riskLevel).toUpperCase(),
    mapPriorityToLabel(r.priorityLevel).toUpperCase(),
    formatDate(r.createdAt),
  ]);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Typography variant="h2">{pageTitle}</Typography>
            {headerBadge && (
              <Badge variant={headerBadge.variant} size="sm">
                {headerBadge.label}
              </Badge>
            )}
          </div>
          <p className="text-xs text-[#737373] mt-1">{pageSubtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton
            title={pageTitle}
            subtitle={pageSubtitle}
            filename={`manifestacoes_${filtro}`}
            headers={exportHeaders}
            rows={exportRows}
          />
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { label: 'Todos os Status', value: 'all' },
              { label: 'Em triagem', value: ReportStatusEnum.TRIAGE },
              { label: 'Em análise', value: ReportStatusEnum.ANALYSIS },
              { label: 'Em investigação', value: ReportStatusEnum.INVESTIGATION },
              { label: 'Plano de ação', value: ReportStatusEnum.ACTION_PLAN },
              { label: 'Concluídas', value: ReportStatusEnum.COMPLETED },
            ]}
          />
          <Select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            options={[
              { label: 'Todos os Riscos', value: 'all' },
              { label: 'Crítico', value: RiskLevelEnum.CRITICAL },
              { label: 'Alto', value: RiskLevelEnum.HIGH },
              { label: 'Médio', value: RiskLevelEnum.MEDIUM },
              { label: 'Baixo', value: RiskLevelEnum.LOW },
            ]}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" label="Carregando manifestações..." />
          </div>
        ) : (
          <>
            <DataTable
              data={tableData}
              onRowClick={(id) => navigate(`/admin/manifestacoes/${id}`)}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </Surface>
    </div>
  );
}
