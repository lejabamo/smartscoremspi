import { Question, DOMAINS } from '../types/assessment';

/**
 * MSPI Assessment Questions
 * Aligned with:
 * - Modelo de Seguridad y Privacidad de la Información (MSPI) de Colombia
 * - ISO/IEC 27001:2022
 * 
 * DO NOT modify the question text - these are normative requirements
 */
export const MSPI_QUESTIONS: Question[] = [
  // Gobierno de la Información (Questions 1-3)
  {
    id: 1,
    domain: DOMAINS[0], // Gobierno de la Información
    text: '¿La Política de Seguridad y Privacidad de la Información ha sido aprobada formalmente mediante acta por el Comité Institucional de Gestión y Desempeño?',
    weight: 1.0,
    refMSPI: 'Fase 1 Planificación: 7.2.2 Política de seguridad',
    refISO: 'Cláusula 5.2 Política',
  },
  {
    id: 2,
    domain: DOMAINS[0], // Gobierno de la Información
    text: '¿Existe un acto administrativo vigente que designe el rol de Oficial de Seguridad y lo integre oficialmente al Comité Institucional de Gestión y Desempeño?',
    weight: 1.0,
    refMSPI: 'Fase 1 Planificación: 7.2.3 Roles y responsabilidades',
    refISO: 'Cláusula 5.3 Roles y responsabilidades',
  },
  {
    id: 3,
    domain: DOMAINS[0], // Gobierno de la Información
    text: '¿Se encuentra documentado el alcance del MSPI identificando los procesos, sedes y activos cubiertos?',
    weight: 1.0,
    refMSPI: 'Fase 1 Planificación: 7.1.3 Definición del alcance',
    refISO: 'Cláusula 4.3 Determinación del alcance',
  },
  // Gestión de Riesgos (Questions 4-6)
  {
    id: 4,
    domain: DOMAINS[1], // Gestión de Riesgos
    text: '¿La entidad cuenta con un inventario de activos de información actualizado que clasifica la información por confidencialidad, integridad y disponibilidad?',
    weight: 1.0,
    refMSPI: 'Fase 1 Planificación: 7.3.1 Identificación de activos',
    refISO: 'Control A.5.9 Inventario de información',
  },
  {
    id: 5,
    domain: DOMAINS[1], // Gestión de Riesgos
    text: '¿Se ha ejecutado una metodología de valoración de riesgos que identifique amenazas y vulnerabilidades para los activos críticos?',
    weight: 1.0,
    refMSPI: 'Fase 1 Planificación: 7.3.2 Valoración de riesgos',
    refISO: 'Cláusula 6.1.2 Evaluación de riesgos',
  },
  {
    id: 6,
    domain: DOMAINS[1], // Gestión de Riesgos
    text: '¿Existe un Plan de Tratamiento de Riesgos aprobado por los dueños del riesgo que defina controles, responsables y fechas de implementación?',
    weight: 1.0,
    refMSPI: 'Fase 1 Planificación: 7.3.3 Plan de tratamiento',
    refISO: 'Cláusula 6.1.3 Tratamiento de riesgos',
  },
  // Controles Operativos (Questions 7-9)
  {
    id: 7,
    domain: DOMAINS[2], // Controles Operativos
    text: '¿Se ejecutan y prueban copias de respaldo (backups) de la información crítica de acuerdo con una frecuencia definida documentalmente?',
    weight: 1.0,
    refMSPI: 'Fase 2 Operación: Política de seguridad de operaciones',
    refISO: 'Control A.8.13 Copia de seguridad',
  },
  {
    id: 8,
    domain: DOMAINS[2], // Controles Operativos
    text: '¿Existe un procedimiento formalizado para la gestión del ciclo de vida de las identidades y accesos (altas, bajas y modificaciones)?',
    weight: 1.0,
    refMSPI: 'Fase 2 Operación: Control de Acceso',
    refISO: 'Control A.5.16 Gestión de identidades',
  },
  {
    id: 9,
    domain: DOMAINS[2], // Controles Operativos
    text: '¿Se cuenta con un registro formal de incidentes de seguridad de la información reportados y gestionados en el último periodo?',
    weight: 1.0,
    refMSPI: 'Fase 2 Operación: 13. Gestión de incidentes',
    refISO: 'Control A.5.24 Gestión de incidentes',
  },
  // Cumplimiento y Evidencia (Questions 10-12)
  {
    id: 10,
    domain: DOMAINS[3], // Cumplimiento y Evidencia
    text: '¿Se ha realizado al menos una auditoría interna al MSPI en los últimos 12 meses con su respectivo informe de hallazgos?',
    weight: 1.0,
    refMSPI: 'Fase 3 Evaluación: 9.2 Auditoría Interna',
    refISO: 'Cláusula 9.2 Auditoría interna',
  },
  {
    id: 11,
    domain: DOMAINS[3], // Cumplimiento y Evidencia
    text: '¿La entidad cuenta con el registro actualizado en el RNBD y evidencia de la implementación de la Política de Tratamiento de Datos Personales?',
    weight: 1.0,
    refMSPI: 'Fase 1 Planificación: 7.1.2 Requisitos legales',
    refISO: 'Control A.5.34 Privacidad y protección de PII',
  },
  {
    id: 12,
    domain: DOMAINS[3], // Cumplimiento y Evidencia
    text: '¿Existe un acta de Revisión por la Dirección que evidencie la evaluación del desempeño del MSPI por parte del Comité Institucional?',
    weight: 1.0,
    refMSPI: 'Fase 3 Evaluación: 9.3 Revisión por la dirección',
    refISO: 'Cláusula 9.3 Revisión por la dirección',
  },
];

// Helper function to get questions by domain
export function getQuestionsByDomain(domain: string): Question[] {
  return MSPI_QUESTIONS.filter(q => q.domain === domain);
}

// Helper function to get total weight by domain
export function getTotalWeightByDomain(domain: string): number {
  return MSPI_QUESTIONS
    .filter(q => q.domain === domain)
    .reduce((sum, q) => sum + q.weight, 0);
}
