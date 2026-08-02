import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando Seeding de Permissões, Perfis, Usuários, Categorias e Unidades...');

  // 1. Permissões
  const permissions = [
    { code: 'VIEW_CASES', name: 'Visualizar Manifestações', module: 'Manifestações' },
    { code: 'VIEW_IDENTITY', name: 'Visualizar Identidade de Manifestante', module: 'Manifestações' },
    { code: 'CHANGE_CLASSIFICATION', name: 'Alterar Classificação de Risco/Categoria', module: 'Triagem' },
    { code: 'ASSIGN_CASES', name: 'Atribuir Casos e Relatores', module: 'Triagem' },
    { code: 'CHANGE_STATUS', name: 'Alterar Status da Manifestação', module: 'Tratativa' },
    { code: 'ACCESS_ATTACHMENTS', name: 'Acessar Evidências e Anexos Sigilosos', module: 'Tratativa' },
    { code: 'SEND_MESSAGES', name: 'Enviar Mensagens ao Manifestante', module: 'Comunicação' },
    { code: 'ADD_INTERNAL_COMMENTS', name: 'Adicionar Notas Internas da Apuração', module: 'Tratativa' },
    { code: 'CREATE_ACTION_PLAN', name: 'Criar e Gerenciar Planos de Ação', module: 'Planos de Ação' },
    { code: 'CONCLUDE_CASE', name: 'Concluir Casos e Emitir Parecer Final', module: 'Encerramento' },
    { code: 'REOPEN_CASE', name: 'Reabrir Manifestações Encerradas', module: 'Encerramento' },
    { code: 'EXPORT_DATA', name: 'Exportar Relatórios Governamentais/PDF', module: 'Relatórios' },
    { code: 'ACCESS_AUDIT', name: 'Acessar Logs de Auditoria do Sistema', module: 'Governança' },
    { code: 'MANAGE_USERS', name: 'Gerenciar Usuários e Atribuições', module: 'Administração' },
    { code: 'MANAGE_SETTINGS', name: 'Gerenciar Parâmetros e SLAs do Sistema', module: 'Administração' },
  ];

  const createdPerms: Record<string, string> = {};

  for (const perm of permissions) {
    const p = await prisma.permission.upsert({
      where: { code: perm.code },
      update: { name: perm.name, module: perm.module },
      create: perm,
    });
    createdPerms[perm.code] = p.id;
  }

  // 2. Perfis (Roles)
  const roles = [
    {
      code: 'SUPER_ADMIN',
      name: 'Superadministrador',
      description: 'Acesso total a todos os recursos do sistema',
      isSystemRole: true,
      permissions: Object.keys(createdPerms),
    },
    {
      code: 'ETHICS_MANAGER',
      name: 'Gestor de Ética',
      description: 'Gestão executiva, apuração de casos e condução das reuniões do comitê',
      isSystemRole: true,
      permissions: [
        'VIEW_CASES',
        'VIEW_IDENTITY',
        'CHANGE_CLASSIFICATION',
        'ASSIGN_CASES',
        'CHANGE_STATUS',
        'ACCESS_ATTACHMENTS',
        'SEND_MESSAGES',
        'ADD_INTERNAL_COMMENTS',
        'CREATE_ACTION_PLAN',
        'CONCLUDE_CASE',
        'REOPEN_CASE',
        'EXPORT_DATA',
        'ACCESS_AUDIT',
      ],
    },
    {
      code: 'TRIAGE_ANALYST',
      name: 'Analista de Triagem',
      description: 'Triagem inicial, validação de admissibilidade e encaminhamento de casos',
      isSystemRole: false,
      permissions: [
        'VIEW_CASES',
        'CHANGE_CLASSIFICATION',
        'ASSIGN_CASES',
        'ACCESS_ATTACHMENTS',
        'SEND_MESSAGES',
        'ADD_INTERNAL_COMMENTS',
      ],
    },
    {
      code: 'INVESTIGATOR',
      name: 'Investigador',
      description: 'Condução de investigações internas, coleta de evidências e pareceres',
      isSystemRole: false,
      permissions: [
        'VIEW_CASES',
        'ACCESS_ATTACHMENTS',
        'ADD_INTERNAL_COMMENTS',
        'CREATE_ACTION_PLAN',
      ],
    },
    {
      code: 'AREA_MANAGER',
      name: 'Responsável por Área',
      description: 'Execução e acompanhamento de planos de ação',
      isSystemRole: false,
      permissions: ['VIEW_CASES', 'CREATE_ACTION_PLAN'],
    },
    {
      code: 'AUDITOR',
      name: 'Auditor',
      description: 'Acompanhamento do cumprimento de prazos, conformidade e auditoria',
      isSystemRole: false,
      permissions: ['VIEW_CASES', 'EXPORT_DATA', 'ACCESS_AUDIT'],
    },
    {
      code: 'EXECUTIVE_VIEWER',
      name: 'Visualizador Executivo',
      description: 'Acesso a relatórios gerenciais e dashboards sem identificadores',
      isSystemRole: false,
      permissions: ['VIEW_CASES', 'EXPORT_DATA'],
    },
  ];

  for (const roleDef of roles) {
    const role = await prisma.role.upsert({
      where: { code: roleDef.code },
      update: { name: roleDef.name, description: roleDef.description },
      create: {
        code: roleDef.code,
        name: roleDef.name,
        description: roleDef.description,
        isSystemRole: roleDef.isSystemRole,
      },
    });

    for (const permCode of roleDef.permissions) {
      const permId = createdPerms[permCode];
      if (permId) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permId,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permId,
          },
        });
      }
    }
  }

  // 3. Categorias de Manifestação
  const categories = [
    { code: 'MORAL_HARASSMENT', name: 'Assédio Moral', description: 'Condutas abusivas frequentes no ambiente de trabalho', slaDays: 15 },
    { code: 'SEXUAL_HARASSMENT', name: 'Assédio Sexual', description: 'Insinuações, propostas não solicitadas ou constrangimento sexual', slaDays: 10 },
    { code: 'DISCRIMINATION', name: 'Discriminação e Diversidade', description: 'Tratamento diferencial por raça, gênero, religião ou orientação', slaDays: 15 },
    { code: 'FRAUD_CORRUPTION', name: 'Fraude, Suborno ou Corrupção', description: 'Fraude financeira, pagamentos indevidos ou vantagens ilícitas', slaDays: 20 },
    { code: 'ETHICAL_DEVIATION', name: 'Desvio de Conduta Ética', description: 'Inobservância do Código de Conduta e Valores do Grupo Bairral', slaDays: 15 },
    { code: 'PATIENT_SAFETY_LGPD', name: 'Segurança do Paciente / LGPD', description: 'Violação de protocolos assistenciais ou vazamento de dados de pacientes', slaDays: 10 },
    { code: 'ASSET_MISUSE', name: 'Uso Indevido de Patrimônio', description: 'Uso inadequado de insumos, equipamentos ou estruturas do hospital', slaDays: 15 },
    { code: 'CONFLICT_OF_INTEREST', name: 'Conflito de Interesses', description: 'Situações em que interesses pessoais se contrapõem aos do hospital', slaDays: 15 },
    { code: 'OTHER', name: 'Outros Assuntos', description: 'Outras manifestações não enquadradas nas categorias específicas', slaDays: 15 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { code: cat.code },
      update: { name: cat.name, description: cat.description, slaDays: cat.slaDays },
      create: cat,
    });
  }

  // 4. Unidades e Departamentos
  const unitsData = [
    {
      code: 'HOSPITAL_CENTRAL',
      name: 'Complexo Hospitalar Bairral',
      city: 'Itapira',
      state: 'SP',
      departments: [
        { code: 'ENFERMAGEM', name: 'Enfermagem e Assistência' },
        { code: 'CORPO_MEDICO', name: 'Corpo Médico' },
        { code: 'RH', name: 'Recursos Humanos' },
        { code: 'FINANCEIRO', name: 'Financeiro e Suprimentos' },
        { code: 'MANUTENCAO', name: 'Manutenção e Infraestrutura' },
        { code: 'TI', name: 'Tecnologia da Informação' },
      ],
    },
    {
      code: 'UNIDADE_INTERNACAO',
      name: 'Unidade de Internação Psiquiátrica',
      city: 'Itapira',
      state: 'SP',
      departments: [
        { code: 'ASSISTENCIA', name: 'Equipe Multidisciplinar' },
        { code: 'RECEPCAO', name: 'Atendimento e Recepção' },
      ],
    },
    {
      code: 'RESIDENCIA_TERAPEUTICA',
      name: 'Residência Terapêutica',
      city: 'Itapira',
      state: 'SP',
      departments: [
        { code: 'CUIDADORES', name: 'Equipe de Cuidadores' },
      ],
    },
  ];

  for (const uData of unitsData) {
    const unit = await prisma.unit.upsert({
      where: { code: uData.code },
      update: { name: uData.name, city: uData.city, state: uData.state },
      create: {
        code: uData.code,
        name: uData.name,
        city: uData.city,
        state: uData.state,
      },
    });

    for (const dData of uData.departments) {
      await prisma.department.upsert({
        where: {
          unitId_code: {
            unitId: unit.id,
            code: dData.code,
          },
        },
        update: { name: dData.name },
        create: {
          unitId: unit.id,
          code: dData.code,
          name: dData.name,
        },
      });
    }
  }

  // 5. Usuário Administrador Inicial
  const superAdminRole = await prisma.role.findUnique({ where: { code: 'SUPER_ADMIN' } });
  if (superAdminRole) {
    const defaultPasswordHash = await bcrypt.hash('Admin@Bairral2026', 10);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@bairral.com.br' },
      update: { name: 'Administrador do Sistema' },
      create: {
        name: 'Administrador do Sistema',
        email: 'admin@bairral.com.br',
        passwordHash: defaultPasswordHash,
        status: 'ACTIVE',
        isFirstAccess: false,
      },
    });

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: superAdminRole.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
      },
    });
  }

  console.log('Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
