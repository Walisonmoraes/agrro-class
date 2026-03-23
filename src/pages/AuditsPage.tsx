import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  RefreshCw,
  Calendar,
  FileCheck,
  FileText,
  MapPin,
  Users,
  BarChart3,
  Eye,
  Printer,
  Share2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  TrendingUp
} from 'lucide-react';

interface AuditData {
  id: string;
  date: string;
  product: string;
  productCategory: string;
  serviceOrder: string;
  coordination: string;
  supervision: string;
  location: string;
  auditType: 'quality' | 'safety' | 'operational' | 'compliance';
  status: 'approved' | 'rejected' | 'pending' | 'in_progress';
  auditor: string;
  findings: number;
  nonConformities: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendations: string;
  nextAudit: string;
  plate: string; // Novo campo
  // Parâmetros de Classificação
  classificationItems: ClassificationItem[];
}

interface ClassificationItem {
  parameter: string;
  currentValue: number;
  standardValue: number;
  unit: string;
  tolerance: number;
  status: 'compliant' | 'non_compliant' | 'warning';
  deviation: number;
}

interface AuditStats {
  totalAudits: number;
  approvedAudits: number;
  rejectedAudits: number;
  pendingAudits: number;
  averageFindings: number;
  criticalIssues: number;
  classificationCompliance: number;
}

export const AuditsPage: React.FC = () => {
  const [auditData, setAuditData] = useState<AuditData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AuditStats>({
    totalAudits: 0,
    approvedAudits: 0,
    rejectedAudits: 0,
    pendingAudits: 0,
    averageFindings: 0,
    criticalIssues: 0,
    classificationCompliance: 0
  });

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [serviceOrderFilter, setServiceOrderFilter] = useState<string>('all');
  const [coordinationFilter, setCoordinationFilter] = useState<string>('all');
  const [supervisionFilter, setSupervisionFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [plateFilter, setPlateFilter] = useState<string>('all'); // Novo filtro
  const [plateSearch, setPlateSearch] = useState<string>(''); // Busca por placa quando personalizado
  
  // Filtros de período
  const [periodFilter, setPeriodFilter] = useState<string>('custom');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      const mockData: AuditData[] = [
        {
          id: '1',
          date: '2024-03-20',
          product: 'Soja',
          productCategory: 'Grãos',
          serviceOrder: 'OS-2024-001',
          coordination: 'Qualidade',
          supervision: 'Carlos Mendes',
          location: 'Armazém 1',
          auditType: 'quality',
          status: 'approved',
          auditor: 'Ana Silva',
          findings: 3,
          nonConformities: 1,
          riskLevel: 'medium',
          description: 'Auditoria de qualidade do processo de classificação',
          recommendations: 'Implementar checklists adicionais de verificação',
          nextAudit: '2024-06-20',
          plate: 'ABC-1234',
          classificationItems: [
            { parameter: 'Umidade', currentValue: 13.5, standardValue: 14.0, unit: '%', tolerance: 1.0, status: 'compliant', deviation: -0.5 },
            { parameter: 'Impurezas', currentValue: 1.2, standardValue: 2.0, unit: '%', tolerance: 0.5, status: 'compliant', deviation: -0.8 },
            { parameter: 'Avariados', currentValue: 3.5, standardValue: 4.0, unit: '%', tolerance: 1.0, status: 'compliant', deviation: -0.5 },
            { parameter: 'Matéria Estranha', currentValue: 0.1, standardValue: 0.5, unit: '%', tolerance: 0.2, status: 'compliant', deviation: -0.4 }
          ]
        },
        {
          id: '2',
          date: '2024-03-18',
          product: 'Milho',
          productCategory: 'Grãos',
          serviceOrder: 'OS-2024-002',
          coordination: 'Segurança',
          supervision: 'Pedro Oliveira',
          location: 'Armazém 2',
          auditType: 'safety',
          status: 'rejected',
          auditor: 'João Santos',
          findings: 5,
          nonConformities: 3,
          riskLevel: 'high',
          description: 'Auditoria de segurança do trabalho em altura',
          recommendations: 'Treinamento obrigatório para equipe',
          nextAudit: '2024-04-18',
          plate: 'DEF-5678',
          classificationItems: [
            { parameter: 'Umidade', currentValue: 16.5, standardValue: 14.5, unit: '%', tolerance: 1.0, status: 'non_compliant', deviation: 2.0 },
            { parameter: 'Impurezas', currentValue: 3.2, standardValue: 2.5, unit: '%', tolerance: 0.5, status: 'non_compliant', deviation: 0.7 },
            { parameter: 'Avariados', currentValue: 6.5, standardValue: 5.0, unit: '%', tolerance: 1.0, status: 'non_compliant', deviation: 1.5 },
            { parameter: 'Matéria Estranha', currentValue: 0.8, standardValue: 0.5, unit: '%', tolerance: 0.2, status: 'non_compliant', deviation: 0.3 }
          ]
        },
        {
          id: '3',
          date: '2024-03-15',
          product: 'Trigo',
          productCategory: 'Grãos',
          serviceOrder: 'OS-2024-003',
          coordination: 'Operacional',
          supervision: 'Maria Costa',
          location: 'Armazém 3',
          auditType: 'operational',
          status: 'pending',
          auditor: 'Roberto Almeida',
          findings: 2,
          nonConformities: 0,
          riskLevel: 'low',
          description: 'Auditoria operacional de processos',
          recommendations: 'Nenhuma ação corretiva necessária',
          nextAudit: '2024-06-15',
          plate: 'GHI-9012',
          classificationItems: [
            { parameter: 'Umidade', currentValue: 12.8, standardValue: 13.0, unit: '%', tolerance: 1.0, status: 'compliant', deviation: -0.2 },
            { parameter: 'Impurezas', currentValue: 0.8, standardValue: 1.5, unit: '%', tolerance: 0.5, status: 'compliant', deviation: -0.7 },
            { parameter: 'Avariados', currentValue: 2.5, standardValue: 3.0, unit: '%', tolerance: 1.0, status: 'compliant', deviation: -0.5 },
            { parameter: 'Matéria Estranha', currentValue: 0.2, standardValue: 0.5, unit: '%', tolerance: 0.2, status: 'compliant', deviation: -0.3 }
          ]
        },
        {
          id: '4',
          date: '2024-03-10',
          product: 'Arroz',
          productCategory: 'Grãos',
          serviceOrder: 'OS-2024-004',
          coordination: 'Compliance',
          supervision: 'Fernanda Lima',
          location: 'Armazém 1',
          auditType: 'compliance',
          status: 'in_progress',
          auditor: 'Lucas Souza',
          findings: 4,
          nonConformities: 2,
          riskLevel: 'medium',
          description: 'Auditoria de conformidade regulatória',
          recommendations: 'Atualizar procedimentos internos',
          nextAudit: '2024-06-10',
          plate: 'JKL-3456',
          classificationItems: [
            { parameter: 'Umidade', currentValue: 14.2, standardValue: 13.5, unit: '%', tolerance: 1.0, status: 'warning', deviation: 0.7 },
            { parameter: 'Impurezas', currentValue: 2.8, standardValue: 2.0, unit: '%', tolerance: 0.5, status: 'non_compliant', deviation: 0.8 },
            { parameter: 'Avariados', currentValue: 4.5, standardValue: 4.0, unit: '%', tolerance: 1.0, status: 'warning', deviation: 0.5 },
            { parameter: 'Matéria Estranha', currentValue: 0.6, standardValue: 0.5, unit: '%', tolerance: 0.2, status: 'non_compliant', deviation: 0.1 }
          ]
        },
        {
          id: '5',
          date: '2024-03-05',
          product: 'Feijão',
          productCategory: 'Grãos',
          serviceOrder: 'OS-2024-005',
          coordination: 'Qualidade',
          supervision: 'Diego Costa',
          location: 'Armazém 4',
          auditType: 'quality',
          status: 'approved',
          auditor: 'Juliana Ramos',
          findings: 1,
          nonConformities: 0,
          riskLevel: 'low',
          description: 'Auditoria de qualidade de produto final',
          recommendations: 'Manter padrões atuais',
          nextAudit: '2024-06-05',
          plate: 'MNO-7890',
          classificationItems: [
            { parameter: 'Umidade', currentValue: 11.5, standardValue: 12.0, unit: '%', tolerance: 1.0, status: 'compliant', deviation: -0.5 },
            { parameter: 'Impurezas', currentValue: 0.5, standardValue: 1.0, unit: '%', tolerance: 0.5, status: 'compliant', deviation: -0.5 },
            { parameter: 'Avariados', currentValue: 2.0, standardValue: 2.5, unit: '%', tolerance: 1.0, status: 'compliant', deviation: -0.5 },
            { parameter: 'Matéria Estranha', currentValue: 0.1, standardValue: 0.3, unit: '%', tolerance: 0.2, status: 'compliant', deviation: -0.2 }
          ]
        }
      ];

      setAuditData(mockData);

      // Calcular estatísticas
      const totalAudits = mockData.length;
      const approvedAudits = mockData.filter(item => item.status === 'approved').length;
      const rejectedAudits = mockData.filter(item => item.status === 'rejected').length;
      const pendingAudits = mockData.filter(item => item.status === 'pending').length;
      const averageFindings = mockData.reduce((sum, item) => sum + item.findings, 0) / totalAudits;
      const criticalIssues = mockData.filter(item => item.riskLevel === 'critical').length;
      
      // Calcular conformidade da classificação
      let totalClassificationItems = 0;
      let compliantClassificationItems = 0;
      
      mockData.forEach(audit => {
        audit.classificationItems.forEach(item => {
          totalClassificationItems++;
          if (item.status === 'compliant') {
            compliantClassificationItems++;
          }
        });
      });
      
      const classificationCompliance = totalClassificationItems > 0 
        ? (compliantClassificationItems / totalClassificationItems) * 100 
        : 0;

      setStats({
        totalAudits,
        approvedAudits,
        rejectedAudits,
        pendingAudits,
        averageFindings,
        criticalIssues,
        classificationCompliance
      });

      setLoading(false);
    }, 1000);
  }, []);

  const filteredData = auditData.filter(item => {
    const matchesSearch = 
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serviceOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.auditor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.plate.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = dateFilter === 'all' || item.date === dateFilter;
    const matchesProduct = productFilter === 'all' || item.product === productFilter;
    const matchesServiceOrder = serviceOrderFilter === 'all' || item.serviceOrder === serviceOrderFilter;
    const matchesCoordination = coordinationFilter === 'all' || item.coordination === coordinationFilter;
    const matchesSupervision = supervisionFilter === 'all' || item.supervision === supervisionFilter;
    const matchesLocation = locationFilter === 'all' || item.location === locationFilter;
    const matchesPlate = plateFilter === 'all' || item.plate === plateFilter;
    
    // Busca por placa (sempre disponível)
    const matchesPlateSearch = plateSearch === '' || item.plate.toLowerCase().includes(plateSearch.toLowerCase());

    // Filtro de período
    let matchesPeriod = true;
    if (periodFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      matchesPeriod = item.date === today;
    } else if (periodFilter === 'week') {
      const itemDate = new Date(item.date);
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesPeriod = itemDate >= weekAgo && itemDate <= today;
    } else if (periodFilter === 'month') {
      const itemDate = new Date(item.date);
      const today = new Date();
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesPeriod = itemDate >= monthAgo && itemDate <= today;
    } else if (periodFilter === 'custom' && startDate && endDate) {
      matchesPeriod = item.date >= startDate && item.date <= endDate;
    }

    return matchesSearch && matchesDate && matchesProduct && matchesServiceOrder && 
           matchesCoordination && matchesSupervision && matchesLocation && matchesPlate && matchesPlateSearch && matchesPeriod;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Andamento';
      default: return status;
    }
  };

  const getAuditTypeLabel = (type: string) => {
    switch (type) {
      case 'quality': return 'Qualidade';
      case 'safety': return 'Segurança';
      case 'operational': return 'Operacional';
      case 'compliance': return 'Conformidade';
      default: return type;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLevelLabel = (level: string) => {
    switch (level) {
      case 'low': return 'Baixo';
      case 'medium': return 'Médio';
      case 'high': return 'Alto';
      case 'critical': return 'Crítico';
      default: return level;
    }
  };

  const getClassificationStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'non_compliant': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getClassificationStatusLabel = (status: string) => {
    switch (status) {
      case 'compliant': return 'Conforme';
      case 'non_compliant': return 'Não Conforme';
      case 'warning': return 'Atenção';
      default: return status;
    }
  };

  // Verificar se colunas devem ser exibidas
  const showCoordinationColumn = coordinationFilter !== 'all';
  const showSupervisionColumn = supervisionFilter !== 'all';

  // Calcular número total de colunas dinamicamente
  const totalColumns = 10 + (showCoordinationColumn ? 1 : 0) + (showSupervisionColumn ? 1 : 0);

  const getUniqueValues = (field: keyof AuditData) => {
    return [...new Set(auditData.map(item => item[field]))];
  };

  const generateReport = () => {
    // Filtrar dados atuais
    const reportData = filteredData;
    
    // Calcular estatísticas dos dados filtrados
    const totalAudits = reportData.length;
    const approvedAudits = reportData.filter(item => item.status === 'approved').length;
    const rejectedAudits = reportData.filter(item => item.status === 'rejected').length;
    const pendingAudits = reportData.filter(item => item.status === 'pending').length;
    const inProgressAudits = reportData.filter(item => item.status === 'in_progress').length;
    const averageFindings = reportData.reduce((sum, item) => sum + item.findings, 0) / totalAudits || 0;
    const criticalIssues = reportData.filter(item => item.riskLevel === 'critical').length;
    
    // Calcular conformidade da classificação
    let totalClassificationItems = 0;
    let compliantClassificationItems = 0;
    
    reportData.forEach(audit => {
      audit.classificationItems.forEach(item => {
        totalClassificationItems++;
        if (item.status === 'compliant') {
          compliantClassificationItems++;
        }
      });
    });
    
    const classificationCompliance = totalClassificationItems > 0 
      ? (compliantClassificationItems / totalClassificationItems) * 100 
      : 0;

    // Criar conteúdo HTML do relatório
    const reportContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório de Auditorias</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
            color: #333;
          }
          .header {
            background: linear-gradient(135deg, #dc2626, #ea580c);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: bold;
          }
          .header p {
            margin: 10px 0 0 0;
            font-size: 1.1em;
            opacity: 0.9;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
            border-left: 4px solid #dc2626;
          }
          .stat-value {
            font-size: 2em;
            font-weight: bold;
            color: #dc2626;
            margin-bottom: 5px;
          }
          .stat-label {
            color: #666;
            font-size: 0.9em;
          }
          .table-container {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th {
            background: #f8f9fa;
            padding: 15px;
            text-align: left;
            font-weight: bold;
            color: #333;
            border-bottom: 2px solid #dc2626;
          }
          td {
            padding: 15px;
            border-bottom: 1px solid #eee;
          }
          tr:hover {
            background: #f8f9fa;
          }
          .status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
            text-transform: uppercase;
          }
          .status.approved {
            background: #d4edda;
            color: #155724;
          }
          .status.rejected {
            background: #f8d7da;
            color: #721c24;
          }
          .status.pending {
            background: #fff3cd;
            color: #856404;
          }
          .status.in_progress {
            background: #d1ecf1;
            color: #0c5460;
          }
          .plate {
            font-family: monospace;
            background: #f1f3f4;
            padding: 4px 8px;
            border-radius: 4px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 0.9em;
          }
          @media print {
            body { background: white; }
            .header { background: #dc2626; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório de Auditorias</h1>
          <p><strong>Período:</strong> ${periodFilter === 'custom' && startDate && endDate ? `${startDate} a ${endDate}` : 'Todo o período'}</p>
          <p><strong>Gerado em:</strong> ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        
        <div class="stats">
          <div class="stat-card">
            <div class="stat-value">${totalAudits}</div>
            <div class="stat-label">Total de Auditorias</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${approvedAudits}</div>
            <div class="stat-label">Aprovadas</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${rejectedAudits}</div>
            <div class="stat-label">Rejeitadas</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${pendingAudits}</div>
            <div class="stat-label">Pendentes</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${averageFindings.toFixed(1)}</div>
            <div class="stat-label">Média de Achados</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${classificationCompliance.toFixed(1)}%</div>
            <div class="stat-label">Conformidade Classificação</div>
          </div>
        </div>
        
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Produto</th>
                <th>OS</th>
                <th>Placa</th>
                <th>Coordenação</th>
                <th>Supervisão</th>
                <th>Local</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Auditor</th>
                <th>Achados</th>
                <th>Não Conf.</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.map(item => `
                <tr>
                  <td>${new Date(item.date).toLocaleDateString('pt-BR')}</td>
                  <td>${item.product}</td>
                  <td>${item.serviceOrder}</td>
                  <td><span class="plate">${item.plate}</span></td>
                  <td>${item.coordination}</td>
                  <td>${item.supervision}</td>
                  <td>${item.location}</td>
                  <td>${getAuditTypeLabel(item.auditType)}</td>
                  <td><span class="status ${item.status}">${getStatusLabel(item.status)}</span></td>
                  <td>${item.auditor}</td>
                  <td>${item.findings}</td>
                  <td>${item.nonConformities}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p>Relatório gerado pelo Sistema AgroClass - Auditorias</p>
        </div>
      </body>
      </html>
    `;

    // Abrir relatório em nova janela
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(reportContent);
      reportWindow.document.close();
      reportWindow.print();
    }
  };

  const exportData = () => {
    // Filtrar dados atuais
    const reportData = filteredData;
    
    // Criar cabeçalho CSV
    const headers = [
      'Data',
      'Produto',
      'Categoria',
      'Ordem de Serviço',
      'Placa',
      'Coordenação',
      'Supervisão',
      'Local',
      'Tipo de Auditoria',
      'Status',
      'Auditor',
      'Achados',
      'Não Conformidades',
      'Nível de Risco',
      'Descrição',
      'Recomendações',
      'Próxima Auditoria'
    ];

    // Criar linhas CSV
    const rows = reportData.map(item => [
      new Date(item.date).toLocaleDateString('pt-BR'),
      item.product,
      item.productCategory,
      item.serviceOrder,
      item.plate,
      item.coordination,
      item.supervision,
      item.location,
      getAuditTypeLabel(item.auditType),
      getStatusLabel(item.status),
      item.auditor,
      item.findings,
      item.nonConformities,
      getRiskLevelLabel(item.riskLevel),
      item.description,
      item.recommendations,
      new Date(item.nextAudit).toLocaleDateString('pt-BR')
    ]);

    // Combinar cabeçalho e linhas
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Criar blob e download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Nome do arquivo com data atual
    const fileName = `auditorias_${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Feedback visual
    const button = event?.target as HTMLButtonElement;
    if (button) {
      const originalText = button.innerHTML;
      button.innerHTML = '✅ Exportado!';
      button.style.background = '#10b981';
      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30">
      {/* Header Moderno */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
                  <FileCheck className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Auditorias
                  </h1>
                  <p className="text-slate-500 font-medium">Gestão de auditorias e conformidade</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
                <Calendar className="text-slate-600" size={16} />
                <span className="text-sm font-medium text-slate-700">
                  {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar auditorias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-red-500 transition-all shadow-sm w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total de Auditorias</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalAudits}</p>
                <p className="text-xs text-red-600 mt-2">Este mês</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <FileCheck className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Aprovadas</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.approvedAudits}</p>
                <p className="text-xs text-emerald-600 mt-2">Conformidade OK</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-emerald-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Rejeitadas</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.rejectedAudits}</p>
                <p className="text-xs text-red-600 mt-2">Ações corretivas</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Pendentes</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.pendingAudits}</p>
                <p className="text-xs text-amber-600 mt-2">Em análise</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="text-amber-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Média de Achados</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.averageFindings.toFixed(1)}</p>
                <p className="text-xs text-slate-500 mt-2">Por auditoria</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Issues Críticos</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.criticalIssues}</p>
                <p className="text-xs text-red-600 mt-2">Atenção imediata</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Conformidade Classificação</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.classificationCompliance?.toFixed(1) || '0.0'}%</p>
                <p className="text-xs text-emerald-600 mt-2">Padrão de qualidade</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-emerald-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Filtros Avançados</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={generateReport}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <BarChart3 size={16} />
                  Gerar Relatório
                </button>
                <button 
                  onClick={exportData}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  Exportar
                </button>
                <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="Atualizar">
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
              {/* Período Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Período</label>
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="custom">Personalizado</option>
                  <option value="all">Todo o período</option>
                  <option value="today">Hoje</option>
                  <option value="week">Últimos 7 dias</option>
                  <option value="month">Últimos 30 dias</option>
                </select>
              </div>

              {/* Data Início (aparece quando período é custom) */}
              {periodFilter === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Data Início</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Data Fim (aparece quando período é custom) */}
              {periodFilter === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Data Fim</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Data Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Data</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">Todas as datas</option>
                  {getUniqueValues('date').map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </div>

              {/* Produto Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Produto</label>
                <select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">Todos os produtos</option>
                  {getUniqueValues('product').map(product => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>
              </div>

              {/* Ordem de Serviço Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Ordem de Serviço</label>
                <select
                  value={serviceOrderFilter}
                  onChange={(e) => setServiceOrderFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">Todas as OS</option>
                  {getUniqueValues('serviceOrder').map(os => (
                    <option key={os} value={os}>{os}</option>
                  ))}
                </select>
              </div>

              {/* Coordenação Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Coordenação</label>
                <select
                  value={coordinationFilter}
                  onChange={(e) => setCoordinationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">Todas as coordenações</option>
                  {getUniqueValues('coordination').map(coord => (
                    <option key={coord} value={coord}>{coord}</option>
                  ))}
                </select>
              </div>

              {/* Supervisão Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Supervisão</label>
                <select
                  value={supervisionFilter}
                  onChange={(e) => setSupervisionFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">Todos os supervisores</option>
                  {getUniqueValues('supervision').map(sup => (
                    <option key={sup} value={sup}>{sup}</option>
                  ))}
                </select>
              </div>

              {/* Local Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Local</label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">Todos os locais</option>
                  {getUniqueValues('location').map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Placa Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Placa</label>
                <select
                  value={plateFilter}
                  onChange={(e) => setPlateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">Todas as placas</option>
                  {getUniqueValues('plate').map(plate => (
                    <option key={plate} value={plate}>{plate}</option>
                  ))}
                </select>
              </div>

              {/* Busca por Placa (sempre disponível) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Buscar Placa</label>
                <input
                  type="text"
                  placeholder="Digite a placa..."
                  value={plateSearch}
                  onChange={(e) => setPlateSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Audit Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Dados das Auditorias</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="Imprimir">
                  <Printer size={18} />
                </button>
                <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="Compartilhar">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-sm uppercase tracking-widest font-bold border-b border-slate-100">
                  <th className="px-4 py-4">Data</th>
                  <th className="px-4 py-4">Produto</th>
                  <th className="px-4 py-4">OS</th>
                  <th className="px-4 py-4">Placa</th>
                  {showCoordinationColumn && <th className="px-4 py-4">Coordenação</th>}
                  {showSupervisionColumn && <th className="px-4 py-4">Supervisão</th>}
                  <th className="px-4 py-4">Local</th>
                  <th className="px-4 py-4">Tipo</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Auditor</th>
                  <th className="px-4 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={totalColumns} className="px-6 py-12 text-center text-slate-400 italic">Carregando auditorias...</td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={totalColumns} className="px-6 py-12 text-center text-slate-400 italic">Nenhuma auditoria encontrada.</td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-slate-400 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">{new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-slate-900 text-sm">{item.product}</div>
                          <div className="text-xs text-slate-500">{item.productCategory}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-slate-400 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">{item.serviceOrder.split('-')[2]}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-slate-700 text-sm font-mono">{item.plate}</div>
                      </td>
                      {showCoordinationColumn && (
                        <td className="px-4 py-4">
                          <div className="text-slate-700 text-sm">{item.coordination}</div>
                        </td>
                      )}
                      {showSupervisionColumn && (
                        <td className="px-4 py-4">
                          <div className="text-slate-700 text-sm">{item.supervision}</div>
                        </td>
                      )}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-slate-400 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">{item.location}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium border bg-blue-100 text-blue-800 border-blue-200 whitespace-nowrap">
                          {getAuditTypeLabel(item.auditType)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-slate-700 text-sm">{item.auditor}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Visualizar">
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
