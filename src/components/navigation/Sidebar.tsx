import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  UserCheck,
  AlertTriangle,
  Clock,
  CheckSquare,
  BarChart3,
  Users,
  Shield,
  FolderTree,
  Building2,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Lock,
} from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';
import { Badge } from '../data-display/Badge';
import { Tooltip } from '../data-display/Tooltip';
import { cn } from '../../lib/utils';
import { usePermission } from '../../context/PermissionContext';
import { useAuth } from '../../context/AuthContext';
import { AdminPermissionEnum } from '../../types/auth';

export interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  permission?: string;
  badge?: { text: string; variant: 'yellow' | 'danger' | 'warning' | 'neutral' };
}

export interface NavGroup {
  groupName?: string;
  items: NavItem[];
}

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const location = useLocation();
  const { hasPermission } = usePermission();
  const { user } = useAuth();

  const navGroups: NavGroup[] = [
    {
      groupName: 'Atendimento & Casos',
      items: [
        { label: 'Visão Geral', href: '/admin', icon: LayoutDashboard },
        { label: 'Manifestações', href: '/admin/manifestacoes', icon: FileText, permission: AdminPermissionEnum.VIEW_CASES },
        {
          label: 'Minhas Atribuições',
          href: '/admin/manifestacoes?filtro=minhas',
          icon: UserCheck,
          permission: AdminPermissionEnum.VIEW_CASES,
          badge: { text: '3', variant: 'neutral' },
        },
        {
          label: 'Casos Críticos',
          href: '/admin/manifestacoes?filtro=criticos',
          icon: AlertTriangle,
          permission: AdminPermissionEnum.VIEW_CASES,
          badge: { text: '2', variant: 'danger' },
        },
        {
          label: 'Casos em Atraso',
          href: '/admin/manifestacoes?filtro=atraso',
          icon: Clock,
          permission: AdminPermissionEnum.VIEW_CASES,
          badge: { text: '5', variant: 'warning' },
        },
        { label: 'Planos de Ação', href: '/admin/planos-de-acao', icon: CheckSquare, permission: AdminPermissionEnum.CREATE_ACTION_PLAN },
      ],
    },
    {
      groupName: 'Análise & Gestão',
      items: [
        { label: 'Relatórios', href: '/admin/relatorios', icon: BarChart3, permission: AdminPermissionEnum.EXPORT_DATA }
      ],
    },
    {
      groupName: 'Configurações do Sistema',
      items: [
        { label: 'Usuários', href: '/admin/usuarios', icon: Users, permission: AdminPermissionEnum.MANAGE_USERS },
        { label: 'Perfis e Permissões', href: '/admin/perfis', icon: Shield, permission: AdminPermissionEnum.MANAGE_USERS },
        { label: 'Categorias', href: '/admin/categorias', icon: FolderTree, permission: AdminPermissionEnum.MANAGE_SETTINGS },
        { label: 'Unidades', href: '/admin/unidades', icon: Building2, permission: AdminPermissionEnum.MANAGE_SETTINGS },
        { label: 'Auditoria', href: '/admin/auditoria', icon: History, permission: AdminPermissionEnum.ACCESS_AUDIT },
        { label: 'Configurações', href: '/admin/configuracoes', icon: Settings, permission: AdminPermissionEnum.MANAGE_SETTINGS },
      ],
    },
  ];

  const checkIsActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin' && !location.search;
    }
    const [basePath, search] = href.split('?');
    if (search) {
      return location.pathname === basePath && location.search.includes(search);
    }
    return location.pathname === basePath && !location.search.includes('filtro=');
  };

  const renderNavContent = () => (
    <div className="flex flex-col h-full bg-[#171717] text-white select-none">
      {/* Top Sidebar Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#262626]">
        {!isCollapsed ? (
          <Link to="/admin" className="flex items-center gap-2">
            <BrandLogo size="sm" variant="light" />
          </Link>
        ) : (
          <div className="w-full flex justify-center">
            <BrandLogo size="sm" variant="compact" />
          </div>
        )}

        {/* Close button on mobile */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1 text-[#A3A3A3] hover:text-white rounded cursor-pointer"
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 space-y-6 px-3 custom-scrollbar">
        {navGroups.map((group, idx) => {
          // Filtra itens com permissão concedida para visualização limpa
          const visibleItems = group.items.filter(
            (item) => !item.permission || hasPermission(item.permission as any)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-1">
              {group.groupName && !isCollapsed && (
                <h5 className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#737373] mb-1.5">
                  {group.groupName}
                </h5>
              )}

              {visibleItems.map((item) => {
                const isActive = checkIsActive(item.href);
                const IconComp = item.icon;

                const linkElement = (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onCloseMobile}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-md transition-all group cursor-pointer',
                      isActive
                        ? 'bg-[#FDC503] text-[#0A0A0A] shadow-xs font-bold'
                        : 'text-[#D4D4D4] hover:bg-[#262626] hover:text-white'
                    )}
                  >
                    <IconComp
                      className={cn(
                        'w-4 h-4 shrink-0 transition-transform group-hover:scale-110',
                        isActive ? 'text-[#0A0A0A]' : 'text-[#A3A3A3] group-hover:text-white'
                      )}
                    />

                    {!isCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}

                    {!isCollapsed && item.badge && (
                      <Badge variant={item.badge.variant} size="sm">
                        {item.badge.text}
                      </Badge>
                    )}
                  </Link>
                );

                return isCollapsed ? (
                  <Tooltip key={item.href} content={item.label} position="right">
                    {linkElement}
                  </Tooltip>
                ) : (
                  linkElement
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer com indicação do usuário e perfil ativo */}
      <div className="p-3 border-t border-[#262626] bg-[#0A0A0A] space-y-2">
        {!isCollapsed && user && (
          <div className="px-2 py-1 bg-[#171717] rounded border border-[#262626] text-[10px]">
            <p className="text-[#A3A3A3] truncate">{user.name}</p>
            <p className="font-bold text-[#FDC503] truncate">{user.roleName}</p>
          </div>
        )}

        <div className="hidden md:flex items-center justify-between">
          {!isCollapsed && (
            <span className="text-[10px] text-[#737373] font-medium truncate">
              Painel de Governança
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded bg-[#262626] hover:bg-[#333333] text-[#D4D4D4] hover:text-white transition-colors cursor-pointer mx-auto"
            title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 border-r border-[#262626]',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {renderNavContent()}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40 animate-in fade-in duration-150"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          'md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#171717] transition-transform duration-200 shadow-2xl',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {renderNavContent()}
      </aside>
    </>
  );
}
