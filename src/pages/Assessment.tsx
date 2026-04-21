import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MSPI_QUESTIONS, getQuestionsByDomain } from '../data/questions';
import { Answer, AnswerValue, ANSWER_VALUES, DOMAINS } from '../types/assessment';
import { calculateMSPIScore } from '../utils/scoringEngine';

const ANSWER_OPTIONS = [
  { value: ANSWER_VALUES.IMPLEMENTED, label: 'Implementado', icon: '✓', status: 'success' },
  { value: ANSWER_VALUES.PARTIAL, label: 'Parcial', icon: '◐', status: 'warning' },
  { value: ANSWER_VALUES.NOT_IMPLEMENTED, label: 'No implementado', icon: '—', status: 'danger' },
] as const;

function Assessment() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [errors, setErrors] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  
  const [sessionId] = useState(() => {
    const existing = localStorage.getItem('mspi_session');
    if (existing) return existing;
    const newId = Math.random().toString(36).substring(7);
    localStorage.setItem('mspi_session', newId);
    return newId;
  });

  // Analytics: Track view and progress
  useEffect(() => {
    trackEvent('assessment_start');
  }, []);

  const trackEvent = async (type: string, questionId?: number) => {
    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: type, session_id: sessionId, question_id: questionId }),
      });
    } catch (e) { /* ignore */ }
  };

  const questionsByDomain = DOMAINS.map(domain => ({
    domain,
    questions: getQuestionsByDomain(domain),
  }));

  const handleAnswerChange = (questionId: number, value: AnswerValue) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    trackEvent('question_answered', questionId);
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<number, boolean> = {};
    let isValid = true;
    MSPI_QUESTIONS.forEach(question => {
      if (answers[question.id] === undefined) {
        newErrors[question.id] = true;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleAssessmentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
        const firstErrorId = Object.keys(errors)[0];
        if (firstErrorId) {
            document.getElementById(`question-${firstErrorId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    trackEvent('lead_capture_view');
    setShowLeadForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLeadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!acceptedPolicy) return;
    
    setIsSubmitting(true);
    const answersArray: Answer[] = Object.entries(answers).map(([id, value]) => ({
      questionId: parseInt(id, 10),
      value,
    }));

    const scoringResult = calculateMSPIScore(answersArray);
    
    try {
        await fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: formData, answers: answersArray, scoringResult }),
        });
        trackEvent('conversion_complete');
    } catch (err) {
        console.error('Error saving:', err);
    }

    // Save locally for context
    localStorage.setItem('mspi_user', JSON.stringify(formData));
    localStorage.setItem('mspi_results', JSON.stringify({ scoringResult, timestamp: new Date().toISOString() }));

    navigate('/results', { state: { scoringResult } });
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = MSPI_QUESTIONS.length;
  const progress = (answeredCount / totalQuestions) * 100;

  if (showLeadForm) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-20">
            <div className="max-w-md w-full animate-fade-in">
                <div className="card p-8 sm:p-10">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl mx-auto mb-4">🏆</div>
                        <h2 className="text-2xl font-black text-slate-900 mb-3">¡Evaluación Completada!</h2>
                        <p className="text-slate-500 text-sm">
                            Ingrese sus datos para procesar el diagnóstico y visualizar su **Puntaje Actual**.
                        </p>
                    </div>

                    <form onSubmit={handleLeadSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-500 tracking-widest mb-2">Nombre Completo</label>
                            <input 
                                required
                                type="text"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ej. Juan Pérez"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-500 tracking-widest mb-2">Correo Electrónico</label>
                            <input 
                                required
                                type="email"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                placeholder="juan@empresa.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-500 tracking-widest mb-2">Teléfono de contacto</label>
                            <input 
                                required
                                type="tel"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+57 300 000 0000"
                            />
                        </div>

                        <div className="pt-2">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative flex items-center mt-1">
                                    <input 
                                        type="checkbox" 
                                        required
                                        className="peer sr-only"
                                        checked={acceptedPolicy}
                                        onChange={e => setAcceptedPolicy(e.target.checked)}
                                    />
                                    <div className="w-5 h-5 border-2 border-slate-300 rounded-md peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                                    <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] opacity-0 peer-checked:opacity-100">✓</span>
                                </div>
                                <span className="text-xs text-slate-500 leading-tight">
                                    Acepto la **Política de Privacidad** y el tratamiento de mis datos personales según la normativa legal vigente.
                                </span>
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={!acceptedPolicy || isSubmitting}
                            className="btn-primary w-full py-4 text-lg"
                        >
                            {isSubmitting ? 'Procesando...' : 'Ver mi puntaje'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="app-header px-4 pb-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src="/icon.png" alt="SmartScore" className="w-9 h-9 object-contain bg-white rounded p-1" />
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Evaluación de Seguridad MSPI
                </h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                  Guía de inicio • Diagnóstico
                </p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-1.5 bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
              <span className="font-black uppercase tracking-widest">Progreso del Diagnóstico</span>
              <span className="font-bold text-blue-400">{Math.round(progress)}%</span>
            </div>
            <div className="progress-track bg-slate-900">
              <div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 italic mt-2">
               {answeredCount} de {totalQuestions} controles analizados
            </p>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1 px-4 py-8">
        <form onSubmit={handleAssessmentSubmit} className="max-w-3xl mx-auto space-y-6">
          {questionsByDomain.map(({ domain, questions }, domainIndex) => (
            <section key={domain} className="animate-fade-in">
              {/* Domain Header */}
              <div className="px-4 mb-4 flex items-center gap-3">
                <span className="text-xs font-black bg-blue-600/10 text-blue-600 px-2 py-1 rounded uppercase tracking-tighter">Fase 0{domainIndex + 1}</span>
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">{domain}</h2>
              </div>

              <div className="space-y-1">
                {questions.map((question) => {
                  const hasError = errors[question.id];
                  const selectedValue = answers[question.id];

                  return (
                    <article
                      key={question.id}
                      id={`question-${question.id}`}
                      className={`card p-5 mb-4 border-2 transition-all ${hasError ? 'border-red-500 bg-red-50' : 'border-transparent'}`}
                    >
                      <div className="mb-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Control Administrativo {question.id}</span>
                        <p className="text-sm font-medium text-slate-800 leading-relaxed">{question.text}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {ANSWER_OPTIONS.map((option) => {
                          const isSelected = selectedValue === option.value;
                          return (
                            <label
                              key={option.value}
                              className={`radio-card ${isSelected ? 'selected' : ''}`}
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={option.value}
                                checked={isSelected}
                                onChange={() => handleAnswerChange(question.id, option.value)}
                                className="sr-only"
                              />
                              <div className="flex items-center gap-2">
                                <span className={`text-sm ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>{option.icon}</span>
                                <span className="text-xs font-bold">{option.label}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}

          <div className="pt-10 pb-20">
              <button
                type="submit"
                className="btn-primary w-full py-4 text-lg shadow-2xl"
              >
                Obtener mi puntaje
              </button>
              <p className="text-center text-[10px] text-slate-400 mt-4 uppercase font-black tracking-widest">
                Pulse para proceder al registro y resultados
              </p>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Assessment;
