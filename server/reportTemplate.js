import { MSPI_QUESTIONS } from './data/questions.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getLogoBase64(file) {
  try {
    const buf = readFileSync(join(__dirname, '..', 'img', file));
    return `data:image/jpeg;base64,${buf.toString('base64')}`;
  } catch { return ''; }
}

// --- Helpers ---
function getMaturityColor(level) {
  const colors = {
    'Inicial':    { bg: '#FEE2E2', text: '#991B1B', badge: '#EF4444' },
    'Básico':     { bg: '#FEF3C7', text: '#92400E', badge: '#F59E0B' },
    'Gestionado': { bg: '#DBEAFE', text: '#1E40AF', badge: '#3B82F6' },
    'Optimizado': { bg: '#D1FAE5', text: '#065F46', badge: '#10B981' },
  };
  return colors[level] || colors['Inicial'];
}

function getStrategicSummary(level, score, domainScores) {
  const lowDomain = [...(domainScores || [])].sort((a, b) => a.percentage - b.percentage)[0];
  const lowDomainLabel = lowDomain ? getDomainLabel(lowDomain.domain) : 'Gestión de Riesgos';

  const summaries = {
    'Inicial': `
      <p style="margin-bottom: 15px;">La entidad presenta un nivel de madurez <strong>Inicial (${score}/100)</strong>, lo que indica una gestión de seguridad reactiva y carente de controles formales. Actualmente, la protección de los datos ciudadanos y la continuidad de los servicios digitales dependen de esfuerzos aislados, sin un marco de gobernanza que los sustente. Esto sitúa a la entidad en una zona de <strong>Riesgo Crítico</strong> ante incidentes cibernéticos y posibles sanciones por incumplimiento del Decreto 1078 de 2015.</p>
      <p>La carencia de una hoja de ruta estructurada afecta especialmente la dimensión de <strong>${lowDomainLabel}</strong>, comprometiendo la integridad de la información institucional. Es imperativo transitar de un modelo de "atención de incendios" a uno de prevención estratégica para evitar fugas de información o parálisis operativa que impacten la confianza ciudadana y la legalidad del proceso administrativo.</p>
    `,
    'Básico': `
      <p style="margin-bottom: 15px;">Con un puntaje de <strong>${score}/100 (Nivel Básico)</strong>, la entidad ha dado pasos importantes en la documentación de procesos, pero aún carece de una ejecución sistemática. La seguridad se percibe como una tarea técnica y no como un Pilar de Gestión. El riesgo institucional es <strong>Moderado-Alto</strong>, principalmente por la brecha entre lo que dice la norma y lo que realmente se aplica en la operación diaria, dejando puertas abiertas a vulnerabilidades que el MSPI exige cerrar.</p>
      <p>Fortalecer la dimensión de <strong>${lowDomainLabel}</strong> es la prioridad inmediata para blindar la operación. El objetivo estratégico para el próximo trimestre debe ser la formalización de evidencias y la capacitación del personal, transformando los documentos actuales en controles vivos que protejan el activo más valioso de la entidad: la información pública.</p>
    `,
    'Gestionado': `
      <p style="margin-bottom: 15px;">La entidad alcanza un nivel <strong>Gestionado (${score}/100)</strong>, demostrando que la seguridad de la información está integrada en la estrategia institucional. Los procesos están maduros y existe un control efectivo sobre los activos críticos. El riesgo de cumplimiento es bajo, lo que genera un entorno de confianza para la transformación digital y un respaldo sólido ante auditorías de MinTIC o entes de control.</p>
      <p>El reto actual no es la implementación, sino la <strong>Sostenibilidad</strong>. Es momento de enfocar esfuerzos en la mejora continua y en elevar los estándares de la dimensión <strong>${lowDomainLabel}</strong>. Mantener este nivel requiere una inversión constante en cultura organizacional, asegurando que la seguridad no sea un hito alcanzado, sino un proceso de evolución permanente que posicione a la entidad como referente regional.</p>
    `,
    'Optimizado': `
      <p style="margin-bottom: 15px;">Felicitaciones: La entidad ostenta un nivel <strong>Optimizado (${score}/100)</strong>, situándose a la vanguardia nacional en gestión MSPI. La seguridad es proactiva, auditable y está orientada a la excelencia. Este estado no solo garantiza el cumplimiento pleno de la normativa MinTIC, sino que convierte a la identidad en un baluarte de confianza y transparencia para la ciudadanía y el ecosistema digital colombiano.</p>
      <p>Desde una perspectiva estratégica, la prioridad es documentar este caso de éxito y liderar procesos de benchmarking regional. El enfoque preventivo es total y los riesgos son gestionados en tiempo real. La entidad está lista para certificaciones internacionales de alto impacto, manteniendo siempre la vigilancia sobre <strong>${lowDomainLabel}</strong> para no permitir retrocesos ante las nuevas amenazas emergentes.</p>
    `
  };

  return summaries[level] || summaries['Inicial'];
}

function getDomainLabel(domain) {
  const labels = {
    'Governance': 'Gobernanza y Política',
    'Risk Management': 'Gestión de Riesgos',
    'Operational Controls': 'Controles Operativos',
    'Compliance & Evidence': 'Cumplimiento y Evidencia',
  };
  return labels[domain] || domain;
}

function getDetailedGapAnalysis(q) {
  const domain = q.domain || 'General';
  
  const analysisMap = {
    'Governance': {
       problem: 'Ausencia de Marco de Gobernanza MSPI',
       impact: 'Falta de dirección estratégica y responsabilidad legal. Sin políticas aprobadas, cualquier control técnico carece de validez jurídica ante MinTIC.',
       action: 'Aprobar formalmente la Política General de Seguridad de la Información mediante Acto Administrativo y conformar el Comité de Seguridad.',
       responsible: 'Alta Gerencia / Secretaría General'
    },
    'Risk Management': {
       problem: 'Falta de Gestión de Riesgos Institucional',
       impact: 'La entidad está "ciega" ante sus amenazas. No se pueden priorizar inversiones ni proteger activos críticos de forma costo-efectiva.',
       action: 'Realizar una metodología de gestión de riesgos (basada en MAGERIT o ISO 31000) e identificar los activos de información del proceso misional.',
       responsible: 'Oficina de Planeación / CISO'
    },
    'Operational Controls': {
       problem: 'Debilidad en la Operación y Controles Técnicos',
       impact: 'Vulnerabilidad directa ante ataques externos, robo de identidad o pérdida accidental de datos ciudadanos por falta de procedimientos.',
       action: 'Implementar controles de acceso, gestión de copias de seguridad y procedimientos de respuesta ante incidentes cibernéticos.',
       responsible: 'Oficina de TI / Sistemas'
    },
    'Compliance & Evidence': {
       problem: 'Incumplimiento de Evidencia y Monitoreo',
       impact: 'Imposibilidad de demostrar cumplimiento ante la Procuraduría o MinTIC. Lo que no está documentado y registrado no existe para el auditor.',
       action: 'Establecer un programa de cumplimiento periódico y generar registros (actas, logs, auditorías internas) como evidencia de efectividad.',
       responsible: 'Control Interno / Jurídica'
    }
  };

  const analysis = analysisMap[domain] || {
    problem: `Deficiencia en ${getDomainLabel(domain)}`,
    impact: 'Riesgo de incumplimiento normativo y debilitamiento del ecosistema de confianza digital de la entidad.',
    action: 'Documentar el procedimiento, asignar responsables y generar evidencia de su ejecución.',
    responsible: 'Responsable del Proceso'
  };

  const priority = q.weight >= 1.0 ? 'Alta' : q.weight >= 0.8 ? 'Media' : 'Baja';
  const priorityColor = priority === 'Alta' ? '#EF4444' : priority === 'Media' ? '#F59E0B' : '#10B981';

  return { ...analysis, priority, priorityColor };
}

// --- Main Template ---
export function buildReportHTML(user, scoringResult) {
  const { totalScore, maturityLevel, domainScores, gaps } = scoringResult;
  const matColor = getMaturityColor(maturityLevel);
  const today = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const logoFull = getLogoBase64('logoynombreempresa.jpeg');
  const logoIsotipo = getLogoBase64('isotipo.jpeg');

  // Top 5 critical gaps
  const top5Gaps = gaps.slice(0, 5).map(gapId => {
    const q = MSPI_QUESTIONS.find(q => q.id === gapId);
    return q;
  }).filter(Boolean);

  // Domain scores table
  const domainRows = (domainScores || []).map(ds => {
    const pct = Math.round(ds.percentage);
    const barColor = pct >= 75 ? '#10B981' : pct >= 50 ? '#3B82F6' : pct >= 25 ? '#F59E0B' : '#EF4444';
    return `
      <tr>
        <td style="padding:10px 8px;font-size:13px;color:#1E293B;">${getDomainLabel(ds.domain)}</td>
        <td style="padding:10px 8px;text-align:center;font-weight:700;font-size:13px;color:${barColor};">${pct}%</td>
        <td style="padding:10px 8px;">
          <div style="background:#E2E8F0;border-radius:99px;height:10px;width:120px;">
            <div style="background:${barColor};height:10px;border-radius:99px;width:${pct}%;"></div>
          </div>
        </td>
      </tr>`;
  }).join('');

  // Action plan rows
  const actionRows = top5Gaps.map((q, i) => {
    const { priority, priorityColor, problem, action, responsible } = getDetailedGapAnalysis(q);
    return `
      <tr style="background:${i % 2 === 0 ? '#F8FAFC' : '#FFFFFF'}">
        <td style="padding:10px 12px;font-size:12px;color:#475569;vertical-align:top;">${problem}</td>
        <td style="padding:10px 12px;font-size:11px;color:#334155;vertical-align:top;font-weight:600;">${responsible}</td>
        <td style="padding:10px 12px;font-size:12px;color:#1E293B;vertical-align:top;">${action}</td>
        <td style="padding:10px 12px;text-align:center;vertical-align:top;">
          <span style="background:${priorityColor}22;color:${priorityColor};padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;">${priority}</span>
        </td>
        <td style="padding:10px 12px;font-size:11px;color:#64748B;vertical-align:top;white-space:nowrap;">${priority === 'Alta' ? '1–3 Meses' : priority === 'Media' ? '3–6 Meses' : '6–12 Meses'}</td>
      </tr>`;
  }).join('');

  // Gap cards (Auditor Insight)
  const gapCards = top5Gaps.map((q, i) => {
    const { problem, impact, priority } = getDetailedGapAnalysis(q);
    return `
    <div style="border-left:4px solid #EF4444;background:#FFF8F8;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:12px;">
      <div style="display:flex;gap:14px;align-items:flex-start;">
        <span style="background:#EF4444;color:#fff;border-radius:50%;width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;">${i + 1}</span>
        <div style="flex:1;">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
            <div style="font-size:14px;color:#0F172A;font-weight:700;">${problem}</div>
            <div style="font-size:10px;color:#EF4444;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Prioridad ${priority}</div>
          </div>
          <div style="font-size:11px;color:#64748B;font-weight:600;margin-bottom:6px;text-transform:uppercase;">Impacto en la Entidad:</div>
          <div style="font-size:12px;color:#475569;line-height:1.6;font-style:italic;">"${impact}"</div>
          <div style="font-size:11px;color:#94A3B8;margin-top:8px;padding-top:8px;border-top:1px dashed #E2E8F0;">
            Referencia: ${q.text}
          </div>
        </div>
      </div>
    </div>`}).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Informe Ejecutivo MSPI – ${user.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; color: #1E293B; background: #fff; }
    .page { width: 794px; min-height: 1122px; margin: 0 auto; }

    /* COVER */
    .cover {
      background: linear-gradient(145deg, #0F172A 0%, #1E3A5F 60%, #0F4C81 100%);
      min-height: 1122px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 60px 70px;
      position: relative;
      overflow: hidden;
    }
    .cover::before {
      content: '';
      position: absolute;
      top: -100px; right: -100px;
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%);
      border-radius: 50%;
    }
    /* COVER LOGO AREA */
    .cover-logo {
      display: flex;
      align-items: center;
      gap: 0;
    }
    .cover-logo img {
      height: 52px;
      width: auto;
      filter: brightness(0) invert(1);
      object-fit: contain;
    }
    .cover-logo-product {
      margin-left: 20px;
      padding-left: 20px;
      border-left: 1px solid rgba(255,255,255,0.2);
      color: #93C5FD;
      font-weight: 500;
      font-size: 12px;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .cover-main { position: relative; z-index: 1; }
    .cover-badge {
      display: inline-block;
      background: rgba(59,130,246,0.2);
      border: 1px solid rgba(59,130,246,0.4);
      color: #93C5FD;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 16px;
      border-radius: 99px;
      margin-bottom: 24px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .cover-title {
      color: #FFFFFF;
      font-size: 38px;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 12px;
    }
    .cover-subtitle {
      color: #93C5FD;
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 40px;
    }
    .cover-score-box {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 16px;
      padding: 28px 32px;
      display: flex;
      gap: 40px;
      align-items: center;
      max-width: 480px;
    }
    .cover-score-num {
      font-size: 64px;
      font-weight: 800;
      color: #FFFFFF;
      line-height: 1;
    }
    .cover-score-denom { font-size: 28px; color: #93C5FD; }
    .cover-score-info { flex: 1; }
    .cover-score-label { color: #64748B; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
    .cover-level-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 99px;
      font-size: 14px;
      font-weight: 700;
      background: ${matColor.badge};
      color: #fff;
      margin-bottom: 10px;
    }
    .cover-desc { color: #94A3B8; font-size: 13px; line-height: 1.5; }
    .cover-footer {
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .cover-entity { color: #CBD5E1; font-size: 14px; }
    .cover-entity-name { color: #fff; font-weight: 700; font-size: 17px; }
    .cover-date { color: #64748B; font-size: 12px; text-align: right; }
    .confidential {
      color: #475569;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 4px;
    }

    /* CONTENT PAGE BRAND BAR */
    .brand-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 20px;
      margin-bottom: 32px;
      border-bottom: 2px solid #E2E8F0;
    }
    .brand-bar img {
      height: 28px;
      width: auto;
      object-fit: contain;
    }
    .brand-bar-product {
      font-size: 11px;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    /* SECTION HEADER */
    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }
    .section-num {
      width: 32px; height: 32px;
      background: #1E3A5F;
      color: #fff;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .section-title { font-size: 20px; font-weight: 700; color: #0F172A; }
    .divider { border: none; border-top: 2px solid #E2E8F0; margin: 32px 0; }

    /* CONTENT PAGE */
    .content-page {
      padding: 50px 70px;
      page-break-before: always;
    }

    /* EXECUTIVE SUMMARY BOX */
    .exec-box {
      background: linear-gradient(135deg, #F0F7FF 0%, #E8F2FF 100%);
      border: 1px solid #BFDBFE;
      border-radius: 12px;
      padding: 28px 32px;
      margin-bottom: 28px;
    }
    .exec-box p { font-size: 14px; line-height: 1.8; color: #374151; }

    /* KPI CARDS */
    .kpi-row { display: flex; gap: 16px; margin-bottom: 28px; }
    .kpi-card {
      flex: 1;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    .kpi-value { font-size: 32px; font-weight: 800; color: #0F172A; }
    .kpi-label { font-size: 11px; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }

    /* TABLE */
    .styled-table { width: 100%; border-collapse: collapse; }
    .styled-table th {
      background: #1E3A5F;
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 12px 12px;
      text-align: left;
    }
    .styled-table td { border-bottom: 1px solid #F1F5F9; }

    /* STRATEGIC MESSAGE */
    .strategic-box {
      background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%);
      border-radius: 16px;
      padding: 32px 36px;
      color: #fff;
      margin-bottom: 28px;
    }
    .strategic-box h3 { font-size: 16px; font-weight: 700; color: #93C5FD; margin-bottom: 12px; }
    .strategic-box p { font-size: 14px; line-height: 1.8; color: #CBD5E1; }

    /* HOW WE HELP */
    .help-grid { display: flex; gap: 16px; margin-top: 20px; }
    .help-card {
      flex: 1;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 20px;
    }
    .help-card-icon { font-size: 24px; margin-bottom: 10px; }
    .help-card-title { font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 6px; }
    .help-card-desc { font-size: 12px; color: #64748B; line-height: 1.6; }

    .footer-note {
      margin-top: 40px;
      border-top: 1px solid #E2E8F0;
      padding-top: 16px;
      font-size: 10px;
      color: #94A3B8;
      text-align: center;
    }
  </style>
</head>
<body>

<!-- ===== PORTADA ===== -->
<div class="page">
  <div class="cover">
    <div class="cover-logo">
      ${logoFull ? `<img src="${logoFull}" alt="AUTOMATA Risk Management">` : '<span style="color:#fff;font-weight:800;font-size:20px;letter-spacing:1px;">AUTOMATA</span><span style="color:#93C5FD;font-weight:400;font-size:14px;">&nbsp;Risk Management</span>'}
      <div class="cover-logo-product">SmartScore MSPI</div>
    </div>

    <div class="cover-main">
      <div class="cover-badge">Informe Ejecutivo de Diagnóstico</div>
      <div class="cover-title">Diagnóstico de Madurez en<br>Seguridad de la Información</div>
      <div class="cover-subtitle">Modelo de Seguridad y Privacidad de la Información &ndash; MinTIC Colombia</div>
      <div class="cover-score-box">
        <div>
          <span class="cover-score-num">${totalScore}</span>
          <span class="cover-score-denom">/100</span>
        </div>
        <div class="cover-score-info">
          <div class="cover-score-label">Nivel de Madurez</div>
          <div class="cover-level-badge">${maturityLevel}</div>
          <div class="cover-desc">${maturityLevel === 'Inicial' ? 'Acción urgente requerida' : maturityLevel === 'Básico' ? 'En proceso de estructuración' : maturityLevel === 'Gestionado' ? 'Controles establecidos' : 'Referente sectorial'}</div>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div>
        <div class="cover-entity">Preparado para:</div>
        <div class="cover-entity-name">${user.name}</div>
        <div class="cover-entity">${user.email}</div>
      </div>
      <div>
        <div class="cover-date">Fecha de evaluación</div>
        <div class="cover-entity-name" style="text-align:right;font-size:14px;">${today}</div>
        <div class="confidential">Confidencial &ndash; Uso interno</div>
      </div>
    </div>
  </div>
</div>

<!-- ===== PÁGINA 2: RESUMEN EJECUTIVO + DOMINIOS ===== -->
<div class="page content-page">
  <div class="brand-bar">
    ${logoIsotipo ? `<img src="${logoIsotipo}" alt="AUTOMATA">` : '<span style="font-size:13px;font-weight:800;color:#0F172A;">AUTOMATA</span>'}
    <span class="brand-bar-product">SmartScore MSPI &mdash; Informe Ejecutivo</span>
  </div>
  <!-- 1. Resumen Ejecutivo -->
  <div class="section-header">
    <div class="section-num">1</div>
    <div class="section-title">Resumen Ejecutivo</div>
  </div>

  <div class="exec-box">
    <p>
      Esta evaluación mide el grado de implementación del <strong>Modelo de Seguridad y Privacidad de la Información (MSPI)</strong>
      de MinTIC y los controles alineados con la norma <strong>ISO/IEC 27001</strong>. El resultado refleja
      la capacidad institucional actual para proteger los activos de información, gestionar riesgos y cumplir
      con las obligaciones normativas del sector público colombiano.
    </p>
  </div>

  <div class="kpi-row">
    <div class="kpi-card">
      <div class="kpi-value" style="color:#0F4C81;">${totalScore}<span style="font-size:16px;color:#94A3B8;">/100</span></div>
      <div class="kpi-label">Puntaje Global</div>
    </div>
    <div class="kpi-card" style="border-color:${matColor.badge}33;background:${matColor.bg};">
      <div class="kpi-value" style="font-size:22px;color:${matColor.text};">${maturityLevel}</div>
      <div class="kpi-label" style="color:${matColor.text};">Nivel de Madurez</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value" style="color:#EF4444;">${gaps.length}</div>
      <div class="kpi-label">Brechas Identificadas</div>
    </div>
  </div>

  <hr class="divider">

  <!-- 2. Resumen Ejecutivo Estratégico -->
  <div class="section-header" style="margin-top:0;">
    <div class="section-num">2</div>
    <div class="section-title">Análisis de Riesgo y Madurez</div>
  </div>
  <div class="exec-box" style="border-color:${matColor.badge}44;background:${matColor.bg};">
    <div style="color:${matColor.text};font-size:14px;line-height:1.8;">
      ${getStrategicSummary(maturityLevel, totalScore, domainScores)}
    </div>
  </div>

  <hr class="divider">

  <!-- 3. Resultados por Dominio -->
  <div class="section-header" style="margin-top:0;">
    <div class="section-num">3</div>
    <div class="section-title">Desempeño por Dominio MSPI</div>
  </div>
  <table class="styled-table">
    <thead>
      <tr>
        <th>Dominio</th>
        <th style="text-align:center;">Cumplimiento</th>
        <th>Indicador</th>
      </tr>
    </thead>
    <tbody>${domainRows}</tbody>
  </table>
</div>

<!-- ===== PÁGINA 3: BRECHAS + PLAN DE ACCIÓN ===== -->
<div class="page content-page">
  <div class="brand-bar">
    ${logoIsotipo ? `<img src="${logoIsotipo}" alt="AUTOMATA">` : '<span style="font-size:13px;font-weight:800;color:#0F172A;">AUTOMATA</span>'}
    <span class="brand-bar-product">SmartScore MSPI &mdash; Análisis de Brechas</span>
  </div>
  <!-- 4. Top 5 Brechas -->
  <div class="section-header">
    <div class="section-num">4</div>
    <div class="section-title">Top 5 Brechas Prioritarias</div>
  </div>
  <p style="font-size:13px;color:#64748B;margin-bottom:20px;line-height:1.6;">
    Las siguientes son las brechas con mayor impacto en el nivel de madurez de la entidad.
    Atenderlas de forma prioritaria generará el mayor impacto en el corto plazo.
  </p>
  ${gapCards || '<div style="padding:20px;background:#F8FAFC;border-radius:8px;text-align:center;color:#10B981;font-weight:600;">✅ No se detectaron brechas críticas. ¡Excelente nivel de implementación!</div>'}

  <hr class="divider">

  <!-- 5. Plan de Acción Priorizado -->
  <div class="section-header" style="margin-top:0;">
    <div class="section-num">5</div>
    <div class="section-title">Plan de Acción Sugerido</div>
  </div>
  <table class="styled-table">
    <thead>
      <tr>
        <th style="width:20%;">Problema</th>
        <th style="width:20%;">Responsable</th>
        <th style="width:35%;">Acción Recomendada</th>
        <th style="width:12%;text-align:center;">Prioridad</th>
        <th style="width:13%;">Tiempo Est.</th>
      </tr>
    </thead>
    <tbody>${actionRows || '<tr><td colspan="5" style="padding:16px;text-align:center;color:#10B981;">Sin acciones pendientes</td></tr>'}</tbody>
  </table>
</div>

<!-- ===== PÁGINA 4: CONCLUSIÓN + CÓMO AYUDAMOS ===== -->
<div class="page content-page">
  <div class="brand-bar">
    ${logoIsotipo ? `<img src="${logoIsotipo}" alt="AUTOMATA">` : '<span style="font-size:13px;font-weight:800;color:#0F172A;">AUTOMATA</span>'}
    <span class="brand-bar-product">SmartScore MSPI &mdash; Plan Estratégico</span>
  </div>
  <!-- 6. Visión Estratégica -->
  <div class="section-header">
    <div class="section-num">6</div>
    <div class="section-title">Conclusión de Gestión</div>
  </div>
  <div class="strategic-box">
    <p style="font-size:14px;line-height:1.8;color:#CBD5E1;">
      La seguridad de la información institucional no es un hito tecnológico, sino una capacidad de gestión continua. 
      La madurez alcanzada en esta evaluación es el cimiento para construir una entidad resiliente ante las amenazas del entorno digital actual.
    </p>
  </div>

  <p style="font-size:13px;color:#475569;line-height:1.8;margin-bottom:28px;">
    La seguridad de la información no es un proyecto de tecnología: es una <strong>decisión de gestión</strong>.
    Las entidades públicas que lideran en MSPI no solo cumplen la norma, sino que generan confianza ciudadana,
    reducen costos operativos y están mejor preparadas para responder ante incidentes. La diferencia entre el nivel
    actual y el nivel <strong>Optimizado</strong> es un plan estructurado con el apoyo adecuado.
  </p>

  <hr class="divider">

  <!-- 7. Cómo Podemos Ayudar -->
  <div class="section-header" style="margin-top:0;">
    <div class="section-num">7</div>
    <div class="section-title">Cómo Podemos Acompañarle</div>
  </div>
  <p style="font-size:13px;color:#64748B;margin-bottom:20px;">
    Este diagnóstico es el punto de partida. Si su entidad desea avanzar, contamos con un portafolio
    de servicios especializados en MSPI diseñados para el contexto del sector público colombiano.
  </p>

  <div class="help-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px;">
    <div class="help-card" style="margin:0;">
      <div class="help-card-icon" style="font-size:18px;font-weight:700;color:#0F4C81;">01</div>
      <div class="help-card-title">Implementación Estructurada MSPI</div>
      <div class="help-card-desc">Acompañamos a la entidad en el cierre de brechas detectadas en este informe, mediante un programa de trabajo alineado con los tiempos de MinTIC y el ITA (Índice de Transparencia y Acceso).</div>
    </div>
    <div class="help-card" style="margin:0;">
      <div class="help-card-icon" style="font-size:18px;font-weight:700;color:#0F4C81;">02</div>
      <div class="help-card-title">Gestión de Riesgos y Activos</div>
      <div class="help-card-desc">Desarrollamos el inventario de activos de información y el análisis de impacto (BIA), fundamentales para blindar la operación institucional frente a interrupciones y proteger la privacidad ciudadana.</div>
    </div>
    <div class="help-card" style="margin:0;">
      <div class="help-card-icon" style="font-size:18px;font-weight:700;color:#0F4C81;">03</div>
      <div class="help-card-title">Preparación para Auditorías</div>
      <div class="help-card-desc">Realizamos pre-auditorías de cumplimiento bajo estándar ISO 27001 para que la entidad responda con solvencia ante visitas de la Contraloría, Procuraduría o supervisión técnica de MinTIC.</div>
    </div>
    <div class="help-card" style="margin:0;">
      <div class="help-card-icon" style="font-size:18px;font-weight:700;color:#0F4C81;">04</div>
      <div class="help-card-title">Monitoreo de Madurez Continuo</div>
      <div class="help-card-desc">Servicio de diagnóstico periódico para medir el avance real trimestre a trimestre, asegurando que la inversión en seguridad se traduzca en indicadores positivos de gestión pública.</div>
    </div>
  </div>

  <div style="margin-top:35px;background:#F1F5F9;border-radius:12px;padding:24px;text-align:center;">
    <div style="font-size:14px;color:#1E293B;font-weight:700;margin-bottom:8px;">¿Desea profundizar en este diagnóstico?</div>
    <div style="font-size:13px;color:#475569;line-height:1.6;max-width:550px;margin:0 auto 18px auto;">
      La seguridad de la información es un proceso de evolución constante. Estamos listos para apoyarle en la interpretación detallada de estos resultados y en la formulación de su plan institucional 2026.
    </div>
    <div style="display:flex;justify-content:center;gap:15px;">
      <div style="font-size:13px;font-weight:700;color:#0F4C81;">Solicitar Sesión Consultiva</div>
      <div style="font-size:13px;font-weight:700;color:#0F4C81;">•</div>
      <div style="font-size:13px;font-weight:700;color:#0F4C81;">lejabamo@gmail.com</div>
    </div>
  </div>

  <div class="footer-note">
    <strong>AUTOMATA Risk Management</strong> &mdash; SmartScore MSPI &mdash; Informe generado el ${today}<br>
    Confidencial &ndash; Solo para uso interno de la entidad evaluada. Los resultados se basan en las respuestas proporcionadas por el evaluador y no constituyen una auditoría formal.
  </div>
</div>

</body>
</html>`;
}
