import { BarChart3, Download, Calendar } from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { MetricCard } from '../components/data-display/MetricCard';
import { Grid } from '../components/ui/Grid';

export function ReportsAnalyticsPage() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
        <div>
          <Typography variant="h2">Relatórios & Estatísticas</Typography>
          <p className="text-xs text-[#737373]">Consolidado de dados operacionais e indicadores de governança</p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
          Exportar Relatório PDF
        </Button>
      </div>

      <Grid cols={3} gap="4">
        <MetricCard
          title="Manifestações este Ano"
          value="1.480"
          icon={BarChart3}
          highlightColor="yellow"
          subtitle="Acumulado 2026"
        />
        <MetricCard
          title="Tempo Médio de Resolução"
          value="4.2 dias"
          icon={Calendar}
          highlightColor="success"
          subtitle="SLA meta: 7 dias"
        />
        <MetricCard
          title="Índice de Resolutividade"
          value="98.1%"
          icon={BarChart3}
          highlightColor="info"
          subtitle="Casos encerrados"
        />
      </Grid>

      <Surface variant="card" className="p-8 text-center space-y-3">
        <div className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto text-[#171717]">
          <BarChart3 className="w-6 h-6" />
        </div>
        <Typography variant="h3">Módulo de Gráficos e BI</Typography>
        <p className="text-xs text-[#737373] max-w-md mx-auto">
          Estrutura gráfica pronta para integração com d3 / recharts nas fases subsequentes de dados reais.
        </p>
      </Surface>
    </div>
  );
}
