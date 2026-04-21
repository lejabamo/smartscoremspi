import { MSPI_QUESTIONS } from './data/questions.js';

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

function getMaturityDescription(level) {
  const desc = {
    'Inicial':
      'La entidad no cuenta con procesos documentados ni controles formales de seguridad de la información. La gestión depende de iniciativas individuales y no de una política institucional. Existe un riesgo significativo de incumplimiento normativo ante MinTIC.',
    'Básico':
      'Existen algunos controles y documentos de seguridad, pero no están implementados de manera consistente. La entidad ha dado pasos iniciales, pero aún hay brechas importantes que representan riesgo operativo, legal y reputacional.',
    'Gestionado':
      'La entidad cuenta con procesos definidos, documentados y aplicados de forma consistente. La seguridad de la información está integrada en la gestión institucional, aunque hay oportunidades de mejora hacia la optimización continua.',
    'Optimizado':
      'La entidad lidera en la gestión de seguridad de la información. Los procesos son continuamente revisados y mejorados. Representa un referente de buenas prácticas en el sector público colombiano.',
  };
  return desc[level] || desc['Inicial'];
}

function getStrategicMessage(level, score) {
  if (score < 25) {
    return `Con un puntaje de ${score}/100, la entidad se encuentra en una etapa crítica que requiere acción inmediata. El riesgo de sanciones por parte de MinTIC, vulnerabilidades en datos ciudadanos y exposición ante incidentes cibernéticos es alto. La buena noticia: un plan de implementación estructurado puede mejorar significativamente este indicador en 6 a 12 meses.`;
  } else if (score < 50) {
    return `Con un puntaje de ${score}/100, la entidad tiene fundamentos pero les falta cohesión. Hay controles que funcionan, pero de forma aislada. El siguiente paso es articular estos esfuerzos en una política integral que le permita cumplir con los estándares de MinTIC y reducir la exposición a riesgos.`;
  } else if (score < 75) {
    return `Con un puntaje de ${score}/100, la entidad está en buen camino. Ha construido una base sólida de seguridad de la información. Los esfuerzos ahora deben orientarse a la optimización, la medición continua y la preparación para una posible certificación ISO/IEC 27001.`;
  } else {
    return `Con un puntaje de ${score}/100, la entidad demuestra un nivel de madurez destacado en seguridad de la información. Es un referente en el sector público. El reto ahora es mantener esta posición, documentar lecciones aprendidas y apoyar a otras entidades del territorio.`;
  }
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

function getActionForGap(question) {
  const priority = question.weight >= 1.0 ? 'Alta' : question.weight >= 0.8 ? 'Media' : 'Baja';
  const priorityColor = priority === 'Alta' ? '#EF4444' : priority === 'Media' ? '#F59E0B' : '#10B981';
  const actions = {
    'Governance':           'Formular y aprobar mediante acto administrativo',
    'Risk Management':      'Identificar activos, amenazas y controles compensatorios',
    'Operational Controls': 'Implementar procedimiento y capacitar al personal responsable',
    'Compliance & Evidence':'Generar acta/documento de evidencia y registrar en el sistema de gestión',
  };
  const action = actions[question.domain] || 'Documentar y formalizar el control';
  return { priority, priorityColor, action };
}

// --- Main Template ---
export function buildReportHTML(user, scoringResult) {
  const { totalScore, maturityLevel, domainScores, gaps } = scoringResult;
  const matColor = getMaturityColor(maturityLevel);
  const today = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

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
    const { priority, priorityColor, action } = getActionForGap(q);
    return `
      <tr style="background:${i % 2 === 0 ? '#F8FAFC' : '#FFFFFF'}">
        <td style="padding:10px 12px;font-size:12px;color:#475569;vertical-align:top;">${getDomainLabel(q.domain)}</td>
        <td style="padding:10px 12px;font-size:12px;color:#1E293B;vertical-align:top;">${action}</td>
        <td style="padding:10px 12px;text-align:center;vertical-align:top;">
          <span style="background:${priorityColor}22;color:${priorityColor};padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;">${priority}</span>
        </td>
        <td style="padding:10px 12px;font-size:11px;color:#64748B;vertical-align:top;">${priority === 'Alta' ? '0–3 meses' : priority === 'Media' ? '3–6 meses' : '6–12 meses'}</td>
      </tr>`;
  }).join('');

  // Gap cards
  const gapCards = top5Gaps.map((q, i) => `
    <div style="border-left:4px solid #EF4444;background:#FFF8F8;border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:12px;">
      <div style="display:flex;gap:12px;align-items:flex-start;">
        <span style="background:#EF4444;color:#fff;border-radius:50%;width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">${i + 1}</span>
        <div>
          <div style="font-size:13px;color:#1E293B;font-weight:600;margin-bottom:4px;">${getDomainLabel(q.domain)}</div>
          <div style="font-size:12px;color:#475569;line-height:1.6;">${q.refMSPI || ''}</div>
        </div>
      </div>
    </div>`).join('');

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
    .cover-logo {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .cover-logo-icon {
      width: 48px; height: 48px;
      background: #3B82F6;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px;
    }
    .cover-logo-text { color: #93C5FD; font-weight: 700; font-size: 18px; letter-spacing: 0.5px; }
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

    /* CONTENT PAGE */
    .content-page {
      padding: 60px 70px;
      page-break-before: always;
    }
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
      <div class="cover-logo-icon">🛡</div>
      <span class="cover-logo-text">SmartScore MSPI</span>
    </div>

    <div class="cover-main">
      <div class="cover-badge">Informe Ejecutivo de Diagnóstico</div>
      <div class="cover-title">Diagnóstico de Madurez en<br>Seguridad de la Información</div>
      <div class="cover-subtitle">Modelo de Seguridad y Privacidad de la Información – MinTIC Colombia</div>
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
        <div class="confidential">Confidencial – Uso interno</div>
      </div>
    </div>
  </div>
</div>

<!-- ===== PÁGINA 2: RESUMEN EJECUTIVO + DOMINIOS ===== -->
<div class="page content-page">

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

  <!-- 2. Nivel de Madurez Explicado -->
  <div class="section-header" style="margin-top:0;">
    <div class="section-num">2</div>
    <div class="section-title">¿Qué significa estar en nivel "${maturityLevel}"?</div>
  </div>
  <div class="exec-box" style="border-color:${matColor.badge}44;background:${matColor.bg};">
    <p style="color:${matColor.text};">${getMaturityDescription(maturityLevel)}</p>
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
    <div class="section-title">Plan de Acción Priorizado</div>
  </div>
  <table class="styled-table">
    <thead>
      <tr>
        <th style="width:20%;">Dominio</th>
        <th style="width:40%;">Acción Recomendada</th>
        <th style="width:15%;text-align:center;">Prioridad</th>
        <th style="width:25%;">Horizonte</th>
      </tr>
    </thead>
    <tbody>${actionRows || '<tr><td colspan="4" style="padding:16px;text-align:center;color:#10B981;">Sin acciones pendientes</td></tr>'}</tbody>
  </table>
</div>

<!-- ===== PÁGINA 4: MENSAJE + CÓMO AYUDAMOS ===== -->
<div class="page content-page">

  <!-- 6. Mensaje Estratégico -->
  <div class="section-header">
    <div class="section-num">6</div>
    <div class="section-title">Orientación Estratégica</div>
  </div>
  <div class="strategic-box">
    <h3>📌 Lectura del Resultado</h3>
    <p>${getStrategicMessage(maturityLevel, totalScore)}</p>
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

  <div class="help-grid">
    <div class="help-card">
      <div class="help-card-icon">🗺</div>
      <div class="help-card-title">Programa de Implementación MSPI</div>
      <div class="help-card-desc">Plan de trabajo mes a mes, con entregables definidos, para llevar a la entidad al nivel Gestionado u Optimizado en 6–18 meses.</div>
    </div>
    <div class="help-card">
      <div class="help-card-icon">📊</div>
      <div class="help-card-title">Análisis de Riesgos de Activos</div>
      <div class="help-card-desc">Identificación, valoración y tratamiento de los riesgos sobre los activos de información críticos de la entidad.</div>
    </div>
    <div class="help-card">
      <div class="help-card-icon">🏅</div>
      <div class="help-card-title">Certificado de Efectividad</div>
      <div class="help-card-desc">Evaluación periódica y emisión de certificado de cumplimiento MSPI, como evidencia ante MinTIC y entes de control.</div>
    </div>
  </div>

  <div class="footer-note">
    SmartScore MSPI | Informe generado el ${today} | Confidencial – Solo para uso interno de la entidad evaluada.<br>
    Los resultados se basan en las respuestas proporcionadas por el evaluador y no constituyen una auditoría formal.
  </div>
</div>

</body>
</html>`;
}
