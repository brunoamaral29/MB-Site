import React, { useState, useEffect, useRef } from 'react';

// Testimonials data
const testimonials = [
  {
    name: "Mariana Costa",
    role: "Empresária • São Paulo",
    text: "A MB encontrou um seguro de vida com cobertura excelente por um preço muito justo. O atendimento foi rápido e o corretor explicou tudo com clareza. Recomendo de olhos fechados!",
    rating: 5
  },
  {
    name: "Carlos Mendes",
    role: "Motorista de aplicativo • Rio de Janeiro",
    text: "Meu carro foi roubado e o processo de sinistro foi extremamente rápido. Recebi o pagamento em menos de 20 dias. A equipe da MB acompanhou tudo do início ao fim.",
    rating: 5
  },
  {
    name: "Fernanda Lima",
    role: "Médica • Belo Horizonte",
    text: "Contratei o seguro residencial e o empresarial da minha clínica. A cotação foi personalizada e consegui economizar 28% em relação à minha antiga seguradora. Atendimento impecável.",
    rating: 5
  },
  {
    name: "Ricardo Almeida",
    role: "Engenheiro • Curitiba",
    text: "Viajo muito a trabalho e o seguro viagem da MB me salvou duas vezes. Cancelamento de voo e problema médico no exterior foram resolvidos com agilidade. Melhor custo-benefício que já tive.",
    rating: 5
  }
];

// Partner Insurers data
const partnerData = {
  'Porto Seguro': {
    advantages: 'Melhor app do mercado, assistência 24h diferenciada, rede de oficinas própria e descontos exclusivos para clientes MB.',
    highlight: 'Condições negociadas 12% melhores que o mercado aberto.'
  },
  'Allianz': {
    advantages: 'Excelente para Seguro de Vida e Empresarial. Forte em responsabilidade civil e cobertura internacional.',
    highlight: 'Ótima para perfis de alto padrão e empresas.'
  },
  'SulAmérica': {
    advantages: 'Líder em saúde e vida, com rede credenciada ampla e processo de sinistro muito ágil.',
    highlight: 'Recomendada para quem valoriza atendimento humanizado.'
  },
  'Mapfre': {
    advantages: 'Boa relação custo x benefício, forte em auto e residencial com muitas assistências inclusas.',
    highlight: 'Ideal para quem busca economia sem abrir mão de cobertura.'
  },
  'Azul Seguros': {
    advantages: 'Ótima para Seguro Viagem e auto com preços competitivos e processo 100% digital.',
    highlight: 'Muito usada para viagens e motoristas de app.'
  },
  'Bradesco Seguros': {
    advantages: 'Rede própria forte, boa para quem já é cliente Bradesco (integração bancária) e tem produtos completos.',
    highlight: 'Vantagem para quem busca integração com serviços financeiros.'
  }
};

const socialProofMessages = [
  "Maria de São Paulo acabou de economizar R$ 1.280 no Seguro Auto.",
  "Carlos, de Curitiba, agendou consultoria para Seguro Empresarial agora.",
  "Fernanda de BH contratou o combo Vida + Residencial e garantiu cobertura completa.",
  "Ricardo de Recife recebeu 4 cotações e escolheu a Porto Seguro com 18% de desconto.",
  "Juliana de Porto Alegre acabou de solicitar cotação para sua frota empresarial."
];

export default function App() {
  // Mobile Menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Testimonials Carousel
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const carouselInterval = useRef(null);

  // Stats Counters
  const [stats, setStats] = useState({ clients: 0, years: 0, claims: 0 });
  const statsSectionRef = useRef(null);
  const statsAnimated = useRef(false);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState({ dependentes: '', patrimonio: '', risco: '' });
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizRecommendation, setQuizRecommendation] = useState({ title: '', desc: '' });

  // Lead Form State (Footer Capture)
  const [footerLead, setFooterLead] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipo: 'auto',
    mensagem: ''
  });
  const [isFooterSubmitting, setIsFooterSubmitting] = useState(false);

  // Modals visibility
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalContent, setSuccessModalContent] = useState({ title: '', text: '', nextSteps: [] });
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState({ name: '', advantages: '', highlight: '' });
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [schedData, setSchedData] = useState({
    date: '2026-06-12',
    time: '09:00 - 09:15',
    expert: 'Ana Paula Mendes (Vida & Empresarial)'
  });

  // Simulator State
  const [showSimulator, setShowSimulator] = useState(false);
  const [currentSimStep, setCurrentSimStep] = useState(1);
  const [simData, setSimData] = useState({
    insuranceType: null,
    contact: { name: '', email: '', whatsapp: '', motivation: '' },
    qualification: {},
    preferences: []
  });

  // Exit Intent
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [exitWhatsapp, setExitWhatsapp] = useState('');
  const [exitIntentTriggered, setExitIntentTriggered] = useState(false);

  // Social Proof Toast
  const [toastMessage, setToastMessage] = useState(null);

  // ----------------------------------------------------
  // USE EFFECTS / MOUNT
  // ----------------------------------------------------
  useEffect(() => {
    // Carousel Auto-slide
    startCarouselTimer();

    // Social Proof Toasts (Starts after 15 seconds, rotates every 35s)
    const firstToastTimer = setTimeout(() => {
      triggerNewToast();
    }, 15000);

    const toastIntervalTimer = setInterval(() => {
      triggerNewToast();
    }, 35000);

    // Exit Intent Handler (Desktop: mouseleave)
    const handleMouseLeave = (e) => {
      if (e.clientY < 50 && !exitIntentTriggered && !showSimulator) {
        setShowExitIntent(true);
        setExitIntentTriggered(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);

    // Mobile Exit Intent (after 60 seconds of inactivity)
    let inactivityTimer;
    const resetInactivity = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        if (!exitIntentTriggered && !showSimulator && window.innerWidth < 768) {
          setShowExitIntent(true);
          setExitIntentTriggered(true);
        }
      }, 60000);
    };

    ['mousemove', 'touchstart', 'scroll'].forEach(evt => {
      document.addEventListener(evt, resetInactivity, { passive: true });
    });
    resetInactivity();

    // Intersection Observer for Stats
    const currentStatsRef = statsSectionRef.current;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated.current) {
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    if (currentStatsRef) {
      observer.observe(currentStatsRef);
    }

    // Keyboard accessibility for Carousel
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        nextTestimonial();
      } else if (e.key === 'ArrowLeft') {
        prevTestimonial();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      clearInterval(carouselInterval.current);
      clearTimeout(firstToastTimer);
      clearInterval(toastIntervalTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('keydown', handleKeyDown);
      ['mousemove', 'touchstart', 'scroll'].forEach(evt => {
        document.removeEventListener(evt, resetInactivity);
      });
      if (currentStatsRef) {
        observer.unobserve(currentStatsRef);
      }
    };
  }, [exitIntentTriggered, showSimulator]);

  // ----------------------------------------------------
  // CAROUSEL FUNCTIONS
  // ----------------------------------------------------
  const startCarouselTimer = () => {
    clearInterval(carouselInterval.current);
    carouselInterval.current = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5500);
  };

  const nextTestimonial = () => {
    setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    startCarouselTimer();
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
    startCarouselTimer();
  };

  // ----------------------------------------------------
  // STATS ANIMATION
  // ----------------------------------------------------
  const animateStats = () => {
    statsAnimated.current = true;
    const duration = 1800;
    const startTime = performance.now();

    const targets = { clients: 52000, years: 15, claims: 320 };

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      setStats({
        clients: Math.floor(targets.clients * eased),
        years: Math.floor(targets.years * eased),
        claims: Math.floor(targets.claims * eased)
      });

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  // ----------------------------------------------------
  // TOAST HANDLER
  // ----------------------------------------------------
  const triggerNewToast = () => {
    const randomMsg = socialProofMessages[Math.floor(Math.random() * socialProofMessages.length)];
    setToastMessage(randomMsg);
    // Auto-dismiss toast after 6.5s
    setTimeout(() => {
      setToastMessage(null);
    }, 6500);
  };

  // ----------------------------------------------------
  // TELEPHONE FORMATTER
  // ----------------------------------------------------
  const formatPhone = (val) => {
    let value = val.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    
    if (value.length > 6) {
      return `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
    } else if (value.length > 2) {
      return `(${value.substring(0, 2)}) ${value.substring(2)}`;
    } else if (value.length > 0) {
      return `(${value}`;
    }
    return value;
  };

  // ----------------------------------------------------
  // QUIZ HANDLERS
  // ----------------------------------------------------
  const handleQuizAnswer = (questionId, value) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateQuizResult = () => {
    const { dependentes, patrimonio, risco } = quizAnswers;
    if (!dependentes || !patrimonio || !risco) {
      alert('Por favor, responda todas as 3 perguntas.');
      return;
    }

    let title = '';
    let desc = '';

    if (patrimonio === 'carro' || risco === 'acidente') {
      title = 'Seguro Auto (com possíveis adicionais)';
      desc = 'Proteção para o seu veículo é prioridade. Recomendamos também considerar um plano básico de Vida se você tem dependentes.';
    } else if (patrimonio === 'familia' || dependentes === 'sim' || risco === 'saude') {
      title = 'Seguro de Vida + Residencial (combo recomendado)';
      desc = 'Com dependentes e preocupação com saúde/família, o combo Vida + proteção da casa oferece a melhor tranquilidade.';
    } else if (patrimonio === 'empresa' || risco === 'empresa') {
      title = 'Seguro Empresarial (com Vida para sócios)';
      desc = 'Proteja seu negócio e garanta continuidade. Recomendamos também um plano de Vida para os sócios.';
    } else if (patrimonio === 'viagem' || risco === 'viagem') {
      title = 'Seguro Viagem';
      desc = 'Ideal para quem viaja com frequência. Cobertura médica internacional e cancelamento são essenciais.';
    } else {
      title = 'Combo Personalizado: Vida + Residencial';
      desc = 'Com base nas suas respostas, essa combinação cobre os principais riscos da sua vida atual.';
    }

    setQuizRecommendation({ title, desc });
    setShowQuizResult(true);
  };

  const resetQuiz = () => {
    setQuizAnswers({ dependentes: '', patrimonio: '', risco: '' });
    setShowQuizResult(false);
  };

  const startSimulatorFromQuiz = () => {
    setShowQuizResult(false);
    resetQuiz();

    // Map quiz selections to default simulator categories
    let preselected = 'vida';
    if (quizAnswers.patrimonio === 'carro') preselected = 'auto';
    if (quizAnswers.patrimonio === 'empresa') preselected = 'empresarial';
    if (quizAnswers.patrimonio === 'viagem') preselected = 'viagem';

    openSimulatorModal(preselected);
  };

  // ----------------------------------------------------
  // PARTNER HUB
  // ----------------------------------------------------
  const handleShowPartner = (partnerName) => {
    const data = partnerData[partnerName] || {
      advantages: 'Seguradora parceira de confiança da MB.',
      highlight: 'Condições exclusivas negociadas pela MB.'
    };
    setSelectedPartner({
      name: partnerName,
      advantages: data.advantages,
      highlight: data.highlight
    });
    setShowPartnerModal(true);
  };

  const quoteWithSelectedPartner = () => {
    setShowPartnerModal(false);
    // Delay slightly to transition smooth
    setTimeout(() => {
      openSimulatorModal();
    }, 300);
  };

  // ----------------------------------------------------
  // INTENT EXIT CAPTURE
  // ----------------------------------------------------
  const handleExitIntentSubmit = (e) => {
    e.preventDefault();
    if (!exitWhatsapp.trim()) {
      alert('Por favor, informe seu WhatsApp.');
      return;
    }

    console.log('%c[MB CRM] Exit-Intent Lead capturado:', 'color:#f59e0b', {
      whatsapp: exitWhatsapp,
      source: 'exit_intent',
      timestamp: new Date().toISOString()
    });

    setShowExitIntent(false);
    setSuccessModalContent({
      title: 'Checklist Grátis Enviado!',
      text: 'Obrigado pelo seu interesse! Enviamos o link do Checklist de Proteção 2026 para o seu WhatsApp agora mesmo.',
      nextSteps: [
        'Baixe o material em PDF',
        'Fale com um consultor caso precise esclarecer dúvidas',
        'Compare propostas personalizadas sem custo'
      ]
    });
    setShowSuccessModal(true);
  };

  // ----------------------------------------------------
  // MULTI-STEP SIMULATOR MODAL
  // ----------------------------------------------------
  const openSimulatorModal = (preselectType = null) => {
    setShowSimulator(true);
    setCurrentSimStep(1);
    setSimData({
      insuranceType: preselectType,
      contact: { name: '', email: '', whatsapp: '', motivation: '' },
      qualification: {},
      preferences: []
    });

    if (preselectType) {
      setTimeout(() => {
        setSimData(prev => ({ ...prev, insuranceType: preselectType }));
        setCurrentSimStep(2);
      }, 500);
    }
  };

  const closeSimulatorModal = () => {
    setShowSimulator(false);
    // Optional: save partial progress
    if (simData.contact && simData.contact.name) {
      localStorage.setItem('mb_simulador_partial', JSON.stringify(simData));
    }
  };

  const selectInsuranceTypeStep = (type) => {
    setSimData(prev => ({ ...prev, insuranceType: type }));
    setCurrentSimStep(2);
  };

  const handleSimContactChange = (field, value) => {
    setSimData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  const handleSimQualChange = (field, value) => {
    setSimData(prev => ({
      ...prev,
      qualification: {
        ...prev.qualification,
        [field]: value
      }
    }));
  };

  const handleSimPreferenceToggle = (value) => {
    setSimData(prev => {
      const updated = prev.preferences.includes(value)
        ? prev.preferences.filter(item => item !== value)
        : [...prev.preferences, value];
      return { ...prev, preferences: updated };
    });
  };

  const validateSimStep = () => {
    if (currentSimStep === 2) {
      const { name, email, whatsapp } = simData.contact;
      if (!name.trim() || !email.trim() || !whatsapp.trim()) {
        alert('Por favor, preencha nome, e-mail e WhatsApp para continuar.');
        return false;
      }
      if (!email.includes('@') || !email.includes('.')) {
        alert('Por favor, insira um e-mail válido.');
        return false;
      }
    }
    return true;
  };

  const handleNextSimStep = () => {
    if (!validateSimStep()) return;

    // Early lead capture after step 2
    if (currentSimStep === 2 && simData.contact.name) {
      console.log('%c[MB CRM] Lead parcial capturado (Step 2):', 'color:#3b82f6', {
        ...simData,
        source: 'simulador_multi_step',
        step_completed: 2,
        timestamp: new Date().toISOString()
      });
    }

    if (currentSimStep < 5) {
      let next = currentSimStep + 1;
      // Skip step 3 (qualification) if "nao-sei" is selected
      if (currentSimStep === 2 && simData.insuranceType === 'nao-sei') {
        next = 4;
      }
      setCurrentSimStep(next);
    }
  };

  const handlePrevSimStep = () => {
    if (currentSimStep > 1) {
      let prev = currentSimStep - 1;
      if (currentSimStep === 4 && simData.insuranceType === 'nao-sei') {
        prev = 2;
      }
      setCurrentSimStep(prev);
    }
  };

  const finalizeSimulator = (action) => {
    const finalPayload = {
      ...simData,
      source: 'simulador_multi_step',
      step_completed: 5,
      completion: 100,
      action: action,
      timestamp: new Date().toISOString()
    };

    console.log('%c[MB CRM] Lead COMPLETO enviado:', 'color:#10b981', finalPayload);
    setShowSimulator(false);

    if (action === 'cotacao') {
      setSuccessModalContent({
        title: 'Cotação solicitada com sucesso!',
        text: `Obrigado, ${simData.contact.name}! Um de nossos corretores especializados analisará as melhores condições do mercado para o seu perfil e enviará as propostas completas no WhatsApp em até 15 minutos.`,
        nextSteps: [
          'Análise do seu perfil e veículo/bem',
          'Comparação de 6 a 8 seguradoras líderes',
          'Envio da melhor proposta com desconto exclusivo'
        ]
      });
      setShowSuccessModal(true);
    } else if (action === 'agendamento') {
      setShowSchedulingModal(true);
    }
  };

  // ----------------------------------------------------
  // FOOTER LEAD FORM SUBMISSION
  // ----------------------------------------------------
  const handleFooterSubmit = (e) => {
    e.preventDefault();
    if (!footerLead.nome || !footerLead.email || !footerLead.telefone) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsFooterSubmitting(true);

    setTimeout(() => {
      console.log('%c[LEAD] Nova cotação enviada via rodapé:', 'color:#10b981', {
        ...footerLead,
        timestamp: new Date().toISOString()
      });

      setIsFooterSubmitting(false);
      setSuccessModalContent({
        title: 'Solicitação Enviada!',
        text: `Excelente escolha! Já começamos a buscar as melhores cotações para Seguro ${getInsuranceTypeLabel(footerLead.tipo)}. Em no máximo 15 minutos um corretor especializado fará contato.`,
        nextSteps: [
          'Qualificação rápida dos dados',
          'Comparativos em até 8 seguradoras parceiras',
          'Proposta fechada no seu WhatsApp'
        ]
      });
      setShowSuccessModal(true);

      // Reset form
      setFooterLead({
        nome: '',
        email: '',
        telefone: '',
        tipo: 'auto',
        mensagem: ''
      });
    }, 1200);
  };

  // ----------------------------------------------------
  // SCHEDULING FORM SUBMISSION
  // ----------------------------------------------------
  const handleConfirmScheduling = () => {
    console.log('%c[MB CRM] Consultoria agendada:', 'color:#10b981', {
      ...schedData,
      lead: simData
    });

    setShowSchedulingModal(false);
    setSuccessModalContent({
      title: 'Consultoria Reservada!',
      text: `Seu horário com ${schedData.expert.split('(')[0].trim()} está confirmado para o dia ${schedData.date} às ${schedData.time}. Enviamos um convite por e-mail e uma mensagem no WhatsApp.`,
      nextSteps: [
        'Guarde a data no seu calendário',
        'Separe a apólice anterior ou dados do bem caso possua',
        'O link da chamada de vídeo/ligação será enviado 5 minutos antes'
      ]
    });
    setShowSuccessModal(true);
  };

  // ----------------------------------------------------
  // AUXILIARY LABEL HELPERS
  // ----------------------------------------------------
  const getInsuranceTypeLabel = (type) => {
    const map = {
      'auto': 'Seguro Auto',
      'vida': 'Seguro de Vida',
      'residencial': 'Seguro Residencial',
      'empresarial': 'Seguro Empresarial',
      'viagem': 'Seguro Viagem',
      'nao-sei': 'Recomendação'
    };
    return map[type] || 'Seguro Personalizado';
  };

  return (
    <div className="bg-slate-50 text-slate-700 min-h-screen">
      
      {/* HEADER / NAVIGATION */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-x-3">
              <div className="flex items-center justify-center w-11 h-11 bg-blue-950 rounded-xl">
                <i className="fas fa-shield-alt text-white text-3xl"></i>
              </div>
              <div className="leading-none">
                <span className="font-bold text-3xl tracking-tighter text-slate-900">MB</span>
                <span className="block text-[13px] font-semibold tracking-[0.5px] text-blue-600 -mt-1">CORRETORA DE SEGUROS</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-x-8">
              <a href="#" className="nav-link text-sm font-medium text-slate-600 hover:text-slate-900">Home</a>
              
              {/* Seguros Dropdown */}
              <div className="relative group">
                <a href="#servicos" className="nav-link flex items-center gap-x-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
                  Seguros
                  <i className="fas fa-chevron-down text-xs transition-transform group-hover:rotate-180"></i>
                </a>
                
                {/* Dropdown Content */}
                <div className="absolute left-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 nav-dropdown hidden group-hover:block z-50">
                  <div className="px-2">
                    <a href="#servicos" className="flex items-center gap-x-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl">
                      <i className="fas fa-car w-4 text-blue-600"></i>
                      <span>Seguro Auto</span>
                    </a>
                    <a href="#servicos" className="flex items-center gap-x-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl">
                      <i className="fas fa-heart w-4 text-blue-600"></i>
                      <span>Seguro de Vida</span>
                    </a>
                    <a href="#servicos" className="flex items-center gap-x-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl">
                      <i className="fas fa-home w-4 text-blue-600"></i>
                      <span>Seguro Residencial</span>
                    </a>
                    <a href="#servicos" className="flex items-center gap-x-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl">
                      <i className="fas fa-building w-4 text-blue-600"></i>
                      <span>Seguro Empresarial</span>
                    </a>
                    <a href="#servicos" className="flex items-center gap-x-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl">
                      <i className="fas fa-plane w-4 text-blue-600"></i>
                      <span>Seguro Viagem</span>
                    </a>
                    <div className="border-t my-1 mx-4"></div>
                    <a href="#servicos" className="flex items-center justify-between px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-xl">
                      <span>Ver todas as modalidades</span>
                      <i class="fas fa-arrow-right text-xs"></i>
                    </a>
                  </div>
                </div>
              </div>

              <a href="#porque-escolher" className="nav-link text-sm font-medium text-slate-600 hover:text-slate-900">Por que a MB?</a>
              <a href="#confianca" className="nav-link text-sm font-medium text-slate-600 hover:text-slate-900">Clientes</a>
              <a href="#cotacao" className="nav-link text-sm font-medium text-slate-600 hover:text-slate-900">Cotação</a>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-x-3">
              <a href="https://wa.me/5511987654321?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20um%20corretor%20da%20MB%20Corretora%20de%20Seguros." 
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center gap-x-2 px-5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-2xl transition-colors">
                <i className="fab fa-whatsapp text-emerald-500 text-lg"></i>
                <span>Falar com Corretor</span>
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden flex items-center justify-center w-10 h-10 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Abrir menu">
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 py-4 space-y-1">
            <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="block px-8 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-xl">Home</a>
            <a href="#servicos" onClick={() => setIsMobileMenuOpen(false)} className="block px-8 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-xl">Seguros</a>
            <a href="#porque-escolher" onClick={() => setIsMobileMenuOpen(false)} className="block px-8 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-xl">Por que a MB?</a>
            <a href="#confianca" onClick={() => setIsMobileMenuOpen(false)} className="block px-8 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-xl">Clientes</a>
            <a href="#cotacao" onClick={() => setIsMobileMenuOpen(false)} className="block px-8 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-xl">Cotação</a>
            
            <div className="pt-3 px-4 border-t border-slate-100">
              <a href="https://wa.me/5511987654321?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20um%20corretor%20da%20MB%20Corretora%20de%20Seguros." 
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center justify-center gap-x-2 w-full px-5 py-3 text-sm font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-2xl transition-colors">
                <i className="fab fa-whatsapp text-lg"></i>
                <span>Falar com Corretor</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-16 md:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-x-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-3xl mb-6">
              <i className="fas fa-check-circle"></i>
              <span>Mais de 52 mil clientes protegidos</span>
            </div>
            
            <h1 className="heading-font text-5xl lg:text-6xl leading-[1.05] tracking-tighter text-slate-900 mb-6">
              Proteja o que mais importa<br />com quem você confia.
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Encontre o seguro ideal para sua vida, sua família ou sua empresa 
              com as melhores condições do mercado e atendimento humano de verdade.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => openSimulatorModal()} 
                className="cta-button flex-1 sm:flex-none items-center justify-center gap-x-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-3xl font-semibold text-lg shadow-lg flex">
                <span>Simular Seguro Online</span>
                <i className="fas fa-arrow-right"></i>
              </button>
              
              <a href="https://wa.me/5511987654321?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20um%20corretor%20da%20MB%20Corretora%20de%20Seguros." 
                 target="_blank"
                 rel="noopener noreferrer"
                 className="cta-button flex-1 sm:flex-none items-center justify-center gap-x-3 border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 px-8 py-4 rounded-3xl font-semibold text-lg flex transition-all">
                <i className="fab fa-whatsapp text-emerald-500 text-xl"></i>
                <span>Chamar no WhatsApp</span>
              </a>
            </div>
            
            <div className="flex items-center gap-x-6 mt-8">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-slate-200 bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">MC</div>
                <div className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-slate-200 bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">CA</div>
                <div className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-slate-200 bg-violet-600 flex items-center justify-center text-white text-[10px] font-bold">FL</div>
              </div>
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">4.9/5</span> — Avaliação média de 12.847 clientes
              </p>
            </div>
          </div>
          
          {/* Hero Visual */}
          <div className="relative hidden lg:block">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center relative">
              
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Background glow */}
                <div className="absolute w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
                
                {/* Main Shield */}
                <svg width="180" height="200" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
                  <path d="M90 15 L160 40 L160 105 Q160 155 90 175 Q20 155 20 105 L20 40 Z" fill="#1E40AF"/>
                  <path d="M90 28 L145 50 L145 100 Q145 140 90 158 Q35 140 35 100 L35 50 Z" fill="#3B82F6"/>
                  <text x="90" y="105" fontFamily="Inter, system-ui, sans-serif" fontSize="42" fontWeight="800" fill="white" textAnchor="middle" dominantBaseline="middle">MB</text>
                  <path d="M55 70 L125 70" stroke="white" strokeOpacity="0.3" strokeWidth="2"/>
                  <path d="M55 90 L125 90" stroke="white" strokeOpacity="0.3" strokeWidth="2"/>
                </svg>
              </div>
              
              {/* Subtle text overlay */}
              <div className="absolute bottom-8 left-8 right-8 text-center">
                <div className="inline-flex items-center gap-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-white/20">
                  <span className="text-white text-sm font-medium">Proteção que você pode confiar</span>
                </div>
              </div>
            </div>
            
            {/* Floating trust badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl border border-slate-100 px-5 py-4 flex items-center gap-x-3 modern-shadow">
              <div className="flex items-center">
                <i className="fas fa-award text-blue-600 text-2xl mr-3"></i>
                <div>
                  <div className="font-semibold text-sm text-slate-900">Premiada em 2025</div>
                  <div className="text-xs text-slate-600">Melhor Corretora Digital</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR / PARCEIRAS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div class="text-center mb-4">
          <p className="text-xs tracking-[1.5px] font-semibold text-slate-500 uppercase">Trabalhamos com as maiores seguradoras do Brasil</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {Object.keys(partnerData).map((partnerName) => (
            <button 
              key={partnerName}
              onClick={() => handleShowPartner(partnerName)} 
              className="flex items-center text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors">
              <i className="fas fa-building mr-2"></i> {partnerName}
            </button>
          ))}
        </div>
      </div>

      {/* SERVIÇOS / PRODUTOS */}
      <section id="servicos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-700 bg-blue-100 rounded-full mb-4">ESCOLHA O SEU</span>
          <h2 className="section-title mb-4">Seguros que realmente protegem</h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600">Soluções completas e personalizadas para cada momento da sua vida e do seu negócio.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {/* Seguro Auto */}
          <div 
            className="card bg-white p-6 rounded-3xl insurance-card group cursor-pointer border border-slate-200 hover:border-blue-500 transition-all"
            onClick={() => openSimulatorModal('auto')}>
            <div className="w-14 h-14 flex items-center justify-center bg-blue-100 text-blue-700 rounded-2xl mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <i className="fas fa-car text-3xl"></i>
            </div>
            <h3 className="font-bold text-xl mb-3 text-slate-900">Seguro Auto</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">Proteja seu carro contra roubo, colisão, incêndio e muito mais. Cobertura completa com assistência 24h.</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">A partir de R$ 89/mês</span>
              <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                <i className="fas fa-arrow-right"></i>
              </span>
            </div>
          </div>
          
          {/* Seguro de Vida */}
          <div 
            className="card bg-white p-6 rounded-3xl insurance-card group cursor-pointer border border-slate-200 hover:border-blue-500 transition-all"
            onClick={() => openSimulatorModal('vida')}>
            <div className="w-14 h-14 flex items-center justify-center bg-rose-100 text-rose-700 rounded-2xl mb-5 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <i className="fas fa-heart text-3xl"></i>
            </div>
            <h3 className="font-bold text-xl mb-3 text-slate-900">Seguro de Vida</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">Garanta o futuro da sua família com indenização por morte, invalidez e doenças graves. Planos flexíveis.</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">A partir de R$ 29/mês</span>
              <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                <i className="fas fa-arrow-right"></i>
              </span>
            </div>
          </div>
          
          {/* Seguro Residencial */}
          <div 
            className="card bg-white p-6 rounded-3xl insurance-card group cursor-pointer border border-slate-200 hover:border-blue-500 transition-all"
            onClick={() => openSimulatorModal('residencial')}>
            <div className="w-14 h-14 flex items-center justify-center bg-amber-100 text-amber-700 rounded-2xl mb-5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <i className="fas fa-home text-3xl"></i>
            </div>
            <h3 className="font-bold text-xl mb-3 text-slate-900">Seguro Residencial</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">Proteja sua casa, apartamento e bens contra incêndio, roubo, vendaval e danos elétricos. Tranquilidade para o lar.</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">A partir de R$ 45/mês</span>
              <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                <i className="fas fa-arrow-right"></i>
              </span>
            </div>
          </div>
          
          {/* Seguro Empresarial */}
          <div 
            className="card bg-white p-6 rounded-3xl insurance-card group cursor-pointer border border-slate-200 hover:border-blue-500 transition-all"
            onClick={() => openSimulatorModal('empresarial')}>
            <div className="w-14 h-14 flex items-center justify-center bg-violet-100 text-violet-700 rounded-2xl mb-5 group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <i className="fas fa-building text-3xl"></i>
            </div>
            <h3 className="font-bold text-xl mb-3 text-slate-900">Seguro Empresarial</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">Proteja seu negócio com responsabilidade civil, incêndio, perda de lucro e proteção para equipamentos e funcionários.</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">A partir de R$ 149/mês</span>
              <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                <i className="fas fa-arrow-right"></i>
              </span>
            </div>
          </div>
          
          {/* Seguro Viagem */}
          <div 
            className="card bg-white p-6 rounded-3xl insurance-card group cursor-pointer border border-slate-200 hover:border-blue-500 transition-all"
            onClick={() => openSimulatorModal('viagem')}>
            <div className="w-14 h-14 flex items-center justify-center bg-sky-100 text-sky-700 rounded-2xl mb-5 group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <i className="fas fa-plane text-3xl"></i>
            </div>
            <h3 className="font-bold text-xl mb-3 text-slate-900">Seguro Viagem</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">Viaje com tranquilidade. Cobertura médica internacional, cancelamento, bagagem extraviada e assistência 24h.</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">A partir de R$ 19/dia</span>
              <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                <i className="fas fa-arrow-right"></i>
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <button 
            onClick={() => openSimulatorModal()} 
            className="inline-flex items-center gap-x-2 text-blue-700 hover:text-blue-800 font-semibold text-sm group">
            VER TODAS AS MODALIDADES E COBERTURAS 
            <i className="fas fa-arrow-right transition-all group-hover:translate-x-1"></i>
          </button>
        </div>
      </section>

      {/* MICRO-QUIZ DE RECOMENDAÇÃO ("Qual Seguro eu Preciso?") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <span className="inline-block px-4 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full mb-3">DESCUBRA EM 20 SEGUNDOS</span>
          <h2 class="text-3xl font-bold tracking-tight text-slate-900 mb-2">Qual seguro você realmente precisa?</h2>
          <p className="text-slate-600">Responda 3 perguntas rápidas e receba uma recomendação personalizada na hora.</p>
        </div>
        
        <div className="max-w-2xl mx-auto bg-slate-50 rounded-3xl p-8 shadow-sm">
          {!showQuizResult ? (
            <div className="space-y-6">
              {/* Question 1 */}
              <div>
                <div className="font-semibold text-slate-900 mb-3">1. Você tem dependentes financeiros (filhos, cônjuge, pais)?</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'sim', label: 'Sim, tenho dependentes' },
                    { value: 'nao', label: 'Não tenho dependentes' },
                    { value: 'parcial', label: 'Parcialmente' }
                  ].map(opt => (
                    <label 
                      key={opt.value} 
                      className={`flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer border transition-all ${
                        quizAnswers.dependentes === opt.value 
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-medium' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}>
                      <input 
                        type="radio" 
                        name="dependentes" 
                        value={opt.value} 
                        checked={quizAnswers.dependentes === opt.value}
                        onChange={() => handleQuizAnswer('dependentes', opt.value)}
                        className="accent-blue-600 w-4 h-4" 
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div>
                <div className="font-semibold text-slate-900 mb-3">2. Qual é o seu principal patrimônio a proteger hoje?</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: 'carro', label: 'Meu carro / moto' },
                    { value: 'casa', label: 'Minha casa ou apartamento' },
                    { value: 'empresa', label: 'Minha empresa / negócio' },
                    { value: 'familia', label: 'Minha família (vida e futuro)' },
                    { value: 'viagem', label: 'Minha viagem / lazer' }
                  ].map(opt => (
                    <label 
                      key={opt.value} 
                      className={`flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer border transition-all ${
                        quizAnswers.patrimonio === opt.value 
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-medium' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}>
                      <input 
                        type="radio" 
                        name="patrimonio" 
                        value={opt.value} 
                        checked={quizAnswers.patrimonio === opt.value}
                        onChange={() => handleQuizAnswer('patrimonio', opt.value)}
                        className="accent-blue-600 w-4 h-4" 
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div>
                <div className="font-semibold text-slate-900 mb-3">3. Qual o maior risco que te preocupa no momento?</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: 'acidente', label: 'Acidentes, roubos ou danos' },
                    { value: 'saude', label: 'Doenças, invalidez ou morte' },
                    { value: 'empresa', label: 'Processos ou incêndio no negócio' },
                    { value: 'viagem', label: 'Problemas de saúde ou atraso em viagem' }
                  ].map(opt => (
                    <label 
                      key={opt.value} 
                      className={`flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer border transition-all ${
                        quizAnswers.risco === opt.value 
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-medium' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}>
                      <input 
                        type="radio" 
                        name="risco" 
                        value={opt.value} 
                        checked={quizAnswers.risco === opt.value}
                        onChange={() => handleQuizAnswer('risco', opt.value)}
                        className="accent-blue-600 w-4 h-4" 
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={calculateQuizResult} 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-3xl shadow-lg transition-transform hover:-translate-y-0.5">
                Ver minha recomendação
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-lightbulb text-blue-600 text-2xl"></i>
              </div>
              <h3 className="font-bold text-2xl text-slate-900 mb-2">{quizRecommendation.title}</h3>
              <p className="text-slate-600 mb-6 max-w-lg mx-auto">{quizRecommendation.desc}</p>
              
              <button 
                onClick={startSimulatorFromQuiz} 
                className="cta-button bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-3xl font-semibold shadow-lg">
                Começar simulador com essa recomendação
              </button>
              
              <button 
                onClick={resetQuiz} 
                className="block mx-auto mt-5 text-sm font-medium text-slate-500 hover:text-slate-700 underline underline-offset-4">
                Refazer o quiz
              </button>
            </div>
          )}
        </div>
      </section>

      {/* DIFERENCIAIS / POR QUE ESCOLHER */}
      <section id="porque-escolher" className="bg-white py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-700 bg-blue-100 rounded-full mb-4">NOSSA DIFERENÇA</span>
            <h2 className="section-title mb-4">Por que mais de 52 mil pessoas escolhem a MB?</h2>
            <p className="max-w-xl mx-auto text-lg text-slate-600">Não somos apenas uma corretora. Somos seu parceiro de proteção.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pilar 1 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-slate-200 transition-all">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-headset text-2xl"></i>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900">Atendimento 24h e suporte real</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Nossa equipe especializada está disponível todos os dias, inclusive em feriados. Suporte completo em sinistros com acompanhamento até o pagamento.</p>
            </div>
            
            {/* Pilar 2 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-slate-200 transition-all">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-handshake text-2xl"></i>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900">As melhores seguradoras do país</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Trabalhamos com mais de 15 seguradoras líderes. Isso significa mais opções, melhores preços e condições exclusivas para você.</p>
            </div>
            
            {/* Pilar 3 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-slate-200 transition-all">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-calculator text-2xl"></i>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900">Cotação personalizada e sem custo</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Receba cotações comparativas em minutos. Analisamos seu perfil e necessidades para indicar a melhor proteção pelo melhor preço. 100% gratuito.</p>
            </div>
            
            {/* Pilar 4 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-slate-200 transition-all">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-tachometer-alt text-2xl"></i>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900">Processo 100% digital + humano</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Cotação, contratação e sinistros 100% online, mas com um corretor dedicado que te acompanha em todo o processo. Nunca fique sozinho.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL & TESTIMONIALS */}
      <section id="confianca" ref={statsSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 rounded-3xl overflow-hidden mb-16">
          <div className="bg-white p-8 text-center">
            <div className="text-4xl font-bold text-slate-900 mb-1 stat-number">
              {stats.clients.toLocaleString('pt-BR')}
            </div>
            <div className="text-sm font-medium text-slate-600">Clientes atendidos</div>
            <div className="text-[10px] text-blue-600 mt-1 font-semibold">+ 8.400 este ano</div>
          </div>
          <div className="bg-white p-8 text-center">
            <div className="text-4xl font-bold text-slate-900 mb-1 stat-number">
              {stats.years}
            </div>
            <div className="text-sm font-medium text-slate-600">Anos de mercado</div>
            <div className="text-[10px] text-blue-600 mt-1 font-semibold">Desde 2011</div>
          </div>
          <div className="bg-white p-8 text-center">
            <div className="text-4xl font-bold text-slate-900 mb-1">
              <span className="stat-number">{stats.claims}</span>
              <span className="text-3xl font-extrabold text-slate-900">mi</span>
            </div>
            <div className="text-sm font-medium text-slate-600">Em sinistros pagos</div>
            <div className="text-[10px] text-blue-600 mt-1 font-semibold">100% de pagamento em 2025</div>
          </div>
          <div className="bg-white p-8 text-center">
            <div className="text-4xl font-bold text-slate-900 mb-1">98%</div>
            <div className="text-sm font-medium text-slate-600">de satisfação</div>
            <div className="flex justify-center mt-2">
              <div className="flex text-amber-500 gap-x-0.5">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="text-center mb-10">
          <h2 className="section-title mb-2">O que nossos clientes dizem</h2>
          <p className="text-lg text-slate-600">Histórias reais de quem já protege o que mais importa.</p>
        </div>
        
        {/* Carousel Slider */}
        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="min-w-full px-4 flex-shrink-0">
                  <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-3xl h-full flex flex-col shadow-sm max-w-3xl mx-auto">
                    <div className="flex items-center gap-x-1 mb-4 text-amber-400">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                    </div>
                    
                    <p className="text-slate-700 text-lg md:text-xl italic leading-relaxed flex-grow">
                      "{testimonial.text}"
                    </p>
                    
                    <div className="flex items-center gap-x-4 mt-8 pt-6 border-t border-slate-100">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base bg-blue-700">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-base">{testimonial.name}</div>
                        <div className="text-sm text-slate-500">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-center gap-x-4 mt-8">
            <button 
              onClick={prevTestimonial} 
              className="w-11 h-11 flex items-center justify-center border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-2xl transition-colors"
              aria-label="Avaliação anterior">
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <div className="flex items-center gap-x-1.5">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentTestimonial(index);
                    startCarouselTimer();
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-blue-600 scale-125' : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Ir para avaliação ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextTestimonial} 
              className="w-11 h-11 flex items-center justify-center border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-2xl transition-colors"
              aria-label="Próxima avaliação">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER FORMULÁRIO DE CAPTURA DE LEADS */}
      <section id="cotacao" className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-start max-w-5xl mx-auto">
            
            {/* Form Info */}
            <div className="lg:col-span-2 text-white">
              <div className="sticky top-8">
                <span className="inline-flex items-center text-blue-400 text-sm font-semibold tracking-wider mb-3">
                  <i className="fas fa-bolt mr-2"></i> 
                  COTAÇÃO EM 2 MINUTOS
                </span>
                
                <h2 className="heading-font text-4xl lg:text-5xl tracking-tighter leading-tight text-white mb-6">
                  Receba sua cotação gratuita agora.
                </h2>
                
                <div className="space-y-4 text-slate-300">
                  <div className="flex items-start gap-x-3">
                    <i className="fas fa-check text-blue-400 mt-1"></i>
                    <span className="text-sm">Compare até 8 seguradoras em uma única cotação</span>
                  </div>
                  <div className="flex items-start gap-x-3">
                    <i className="fas fa-check text-blue-400 mt-1"></i>
                    <span class="text-sm">Corretor dedicado entra em contato em até 15 minutos</span>
                  </div>
                  <div className="flex items-start gap-x-3">
                    <i className="fas fa-check text-blue-400 mt-1"></i>
                    <span className="text-sm">Sem compromisso e sem custo</span>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-700">
                  <div className="flex items-center gap-x-3">
                    <div className="flex -space-x-1">
                      <div className="w-7 h-7 rounded-full border border-slate-700 bg-blue-600"></div>
                      <div className="w-7 h-7 rounded-full border border-slate-700 bg-emerald-600"></div>
                    </div>
                    <p className="text-xs text-slate-400">+ 2.847 pessoas receberam cotações hoje</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Promoção do Novo Simulador Interativo */}
            <div className="lg:col-span-3 bg-white rounded-3xl p-8 shadow-xl flex flex-col border border-slate-100">
              <div className="flex-1">
                <div className="inline-flex items-center gap-x-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  <i className="fas fa-rocket"></i>
                  <span>NOVO: Simulador Inteligente</span>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Obtenha cotações personalizadas em menos de 90 segundos</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">Nosso assistente interativo faz perguntas inteligentes, qualifica seu perfil e te entrega as melhores opções de várias seguradoras na hora.</p>
                
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-start gap-x-3">
                    <i className="fas fa-check text-blue-600 mt-1"></i>
                    <span>Captura de contato nas primeiras etapas (mesmo se abandonar)</span>
                  </div>
                  <div className="flex items-start gap-x-3">
                    <i className="fas fa-check text-blue-600 mt-1"></i>
                    <span>Perguntas condicionais por tipo de seguro</span>
                  </div>
                  <div className="flex items-start gap-x-3">
                    <i className="fas fa-check text-blue-600 mt-1"></i>
                    <span>Recomendações personalizadas + opção de agendar com especialista</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => openSimulatorModal()} 
                className="cta-button mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-3xl text-lg flex items-center justify-center gap-x-2 shadow-lg">
                <span>Abrir Simulador Inteligente</span>
                <i className="fas fa-play"></i>
              </button>
              
              <p className="text-center text-[11px] text-slate-500 mt-3 font-medium">Leva menos de 2 minutos • 100% gratuito</p>
            </div>
          </div>

          {/* Fallback Direct Contact Section */}
          <div className="mt-16 border-t border-slate-800 pt-16 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-white text-center mb-8">Quer mandar uma mensagem direta?</h3>
            <form onSubmit={handleFooterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase">Nome Completo *</label>
                  <input 
                    type="text" 
                    value={footerLead.nome}
                    onChange={(e) => setFooterLead(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-2xl border border-slate-700 focus:outline-none focus:border-blue-500 text-sm" 
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase">WhatsApp *</label>
                  <input 
                    type="tel" 
                    value={footerLead.telefone}
                    onChange={(e) => setFooterLead(prev => ({ ...prev, telefone: formatPhone(e.target.value) }))}
                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-2xl border border-slate-700 focus:outline-none focus:border-blue-500 text-sm" 
                    placeholder="(11) 98765-4321"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase">E-mail *</label>
                  <input 
                    type="email" 
                    value={footerLead.email}
                    onChange={(e) => setFooterLead(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-2xl border border-slate-700 focus:outline-none focus:border-blue-500 text-sm" 
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase">Tipo de Seguro *</label>
                  <select 
                    value={footerLead.tipo}
                    onChange={(e) => setFooterLead(prev => ({ ...prev, tipo: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-2xl border border-slate-700 focus:outline-none focus:border-blue-500 text-sm">
                    <option value="auto">Seguro Auto</option>
                    <option value="vida">Seguro de Vida</option>
                    <option value="residencial">Seguro Residencial</option>
                    <option value="empresarial">Seguro Empresarial</option>
                    <option value="viagem">Seguro Viagem</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase">Mensagem Adicional (Opcional)</label>
                <textarea 
                  rows="3"
                  value={footerLead.mensagem}
                  onChange={(e) => setFooterLead(prev => ({ ...prev, mensagem: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-800 text-white rounded-2xl border border-slate-700 focus:outline-none focus:border-blue-500 text-sm resize-none" 
                  placeholder="Se tiver alguma observação, escreva aqui..."></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isFooterSubmitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold rounded-2xl text-base transition-colors shadow-lg flex items-center justify-center">
                {isFooterSubmitting ? (
                  <span className="flex items-center gap-x-2">
                    <i className="fas fa-spinner fa-spin"></i> Enviando...
                  </span>
                ) : (
                  <span>Solicitar Cotação Rápida</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-8">
            
            {/* Logo + Info */}
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-x-3 mb-4">
                <div className="flex items-center justify-center w-9 h-9 bg-blue-600 rounded-xl">
                  <i className="fas fa-shield-alt text-white"></i>
                </div>
                <div className="leading-none">
                  <span className="font-bold text-2xl text-white tracking-tighter">MB</span>
                  <span className="block text-[10px] font-semibold tracking-[0.5px] text-blue-400 -mt-0.5">CORRETORA DE SEGUROS</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Proteção inteligente para quem valoriza tranquilidade. 
                Corretora autorizada pela SUSEP.
              </p>
              
              <div className="mt-6 flex gap-x-4">
                <a href="#" className="text-xl hover:text-white transition-colors" aria-label="Acesse nosso Instagram"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-xl hover:text-white transition-colors" aria-label="Acesse nosso LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                <a href="#" className="text-xl hover:text-white transition-colors" aria-label="Acesse nosso Facebook"><i className="fab fa-facebook-f"></i></a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm tracking-wider">Seguros</h4>
              <ul className="space-y-[9px] text-sm">
                <li><button onClick={() => openSimulatorModal('auto')} className="hover:text-white transition-colors text-left">Seguro Auto</button></li>
                <li><button onClick={() => openSimulatorModal('vida')} className="hover:text-white transition-colors text-left">Seguro de Vida</button></li>
                <li><button onClick={() => openSimulatorModal('residencial')} className="hover:text-white transition-colors text-left">Seguro Residencial</button></li>
                <li><button onClick={() => openSimulatorModal('empresarial')} className="hover:text-white transition-colors text-left">Seguro Empresarial</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm tracking-wider">Empresa</h4>
              <ul className="space-y-[9px] text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Sobre a MB</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nossa equipe</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trabalhe conosco</a></li>
                <li><a href="#confianca" className="hover:text-white transition-colors">Depoimentos</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm tracking-wider">Suporte</h4>
              <ul className="space-y-[9px] text-sm">
                <li><a href="https://wa.me/5511987654321" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Falar no WhatsApp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Central de Atendimento</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sinistros</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Blog</a></li>
              </ul>
              
              <div className="mt-6 pt-4 border-t border-slate-800 text-xs">
                <a href="https://wa.me/5511987654321" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium">
                  <i className="fab fa-whatsapp text-emerald-500 mr-2 text-base"></i> 
                  (11) 98765-4321
                </a>
              </div>
            </div>
          </div>
          
          {/* Legal / SUSEP */}
          <div className="mt-16 pt-8 border-t border-slate-800 text-xs text-slate-500">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-3">
              <div>
                <p>© 2026 MB Corretora de Seguros Ltda. Todos os direitos reservados.</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="font-mono">CNPJ: 12.345.678/0001-90</span>
                <span className="font-mono">SUSEP: 123456789</span>
                <a href="#" className="hover:text-slate-400 transition-colors">Política de Privacidade</a>
                <a href="#" className="hover:text-slate-400 transition-colors">Termos de Uso</a>
                <a href="#" className="hover:text-slate-400 transition-colors">LGPD</a>
              </div>
            </div>
            
            <div className="mt-4 text-[10px] text-slate-600 leading-relaxed">
              Esta é uma página convertida para React. Os dados da corretora (CNPJ e SUSEP) são fictícios para fins de exemplo de portfólio.
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a href="https://wa.me/5511987654321?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20um%20corretor%20da%20MB%20Corretora%20de%20Seguros." 
         target="_blank"
         rel="noopener noreferrer"
         className="floating-whatsapp fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform"
         aria-label="Abrir conversa no WhatsApp">
        <i className="fab fa-whatsapp text-white text-3xl"></i>
      </a>

      {/* SUCCESS MODAL (Reusable) */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[140] px-4">
          <div className="modal bg-white max-w-md w-full rounded-3xl p-8 text-center shadow-2xl relative">
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-5 text-slate-400 hover:text-slate-600 text-2xl font-bold">
              ×
            </button>
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <i className="fas fa-check text-blue-600 text-3xl"></i>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{successModalContent.title}</h3>
            <p className="text-slate-600 mb-6 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: successModalContent.text }}></p>
            
            {successModalContent.nextSteps && successModalContent.nextSteps.length > 0 && (
              <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left text-xs md:text-sm">
                <p className="font-semibold text-slate-700">O que acontece agora:</p>
                <ul className="mt-2 space-y-2 text-slate-600">
                  {successModalContent.nextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-x-2">
                      <i className="fas fa-check text-blue-500 w-4 mt-0.5 flex-shrink-0"></i>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <button 
              onClick={() => setShowSuccessModal(false)} 
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-3xl shadow-lg transition-transform hover:-translate-y-0.5">
              Voltar para o site
            </button>
            
            <p className="text-xs text-slate-500 mt-4">Você também pode nos contactar pelo fone (11) 98765-4321.</p>
          </div>
        </div>
      )}

      {/* MULTI-STEP SIMULATOR MODAL */}
      {showSimulator && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[110] p-4">
          <div className="modal bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
            
            {/* Modal Header with Progress */}
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <div>
                <span className="font-bold text-lg">Simulador Inteligente MB</span>
                <span className="text-blue-400 text-sm ml-3 font-semibold">Etapa {currentSimStep} de 5</span>
              </div>
              <button onClick={closeSimulatorModal} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
            </div>
            
            {/* Progress Bar */}
            <div className="h-1.5 bg-slate-100">
              <div 
                className="h-1.5 bg-blue-600 transition-all duration-500" 
                style={{ width: `${(currentSimStep / 5) * 100}%` }}></div>
            </div>
            
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              
              {/* STEP 1: Tipo de Seguro */}
              {currentSimStep === 1 && (
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Qual proteção você precisa hoje?</h3>
                  <p className="text-slate-600 mb-6 text-sm">Escolha a opção que mais se aproxima da sua necessidade. É rápido e sem compromisso.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { type: 'auto', label: 'Seguro Auto', icon: 'fa-car', color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Carro, moto ou frota' },
                      { type: 'vida', label: 'Seguro de Vida', icon: 'fa-heart', color: 'text-rose-600', bg: 'bg-rose-50', sub: 'Família e futuro' },
                      { type: 'residencial', label: 'Seguro Residencial', icon: 'fa-home', color: 'text-amber-600', bg: 'bg-amber-50', sub: 'Casa, apto e bens' },
                      { type: 'empresarial', label: 'Seguro Empresarial', icon: 'fa-building', color: 'text-violet-600', bg: 'bg-violet-50', sub: 'Negócio e riscos' },
                      { type: 'viagem', label: 'Seguro Viagem', icon: 'fa-plane', color: 'text-sky-600', bg: 'bg-sky-50', sub: 'Proteção em viagens' },
                      { type: 'nao-sei', label: 'Não sei ainda', icon: 'fa-question-circle', color: 'text-slate-600', bg: 'bg-slate-100', sub: 'Quero indicação' }
                    ].map(opt => (
                      <div 
                        key={opt.type}
                        onClick={() => selectInsuranceTypeStep(opt.type)} 
                        className={`card border-2 p-5 rounded-2xl cursor-pointer transition-all flex flex-col items-center text-center ${
                          simData.insuranceType === opt.type ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-600 bg-white'
                        }`}>
                        <i className={`fas ${opt.icon} text-4xl ${opt.color} mb-3`}></i>
                        <div className="font-bold text-slate-900 text-sm md:text-base">{opt.label}</div>
                        <div className="text-[11px] text-slate-500 mt-1 leading-tight">{opt.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* STEP 2: Contato */}
              {currentSimStep === 2 && (
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Quase lá! Vamos personalizar sua cotação</h3>
                  <p className="text-slate-600 mb-6 text-sm">Seus dados estão protegidos pela LGPD. Usamos apenas para formular as melhores condições.</p>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome completo *</label>
                      <input 
                        type="text" 
                        value={simData.contact.name}
                        onChange={(e) => handleSimContactChange('name', e.target.value)}
                        className="form-input w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm" 
                        placeholder="Ex: José da Silva"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail *</label>
                        <input 
                          type="email" 
                          value={simData.contact.email}
                          onChange={(e) => handleSimContactChange('email', e.target.value)}
                          className="form-input w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm" 
                          placeholder="exemplo@email.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">WhatsApp *</label>
                        <input 
                          type="tel" 
                          value={simData.contact.whatsapp}
                          onChange={(e) => handleSimContactChange('whatsapp', formatPhone(e.target.value))}
                          className="form-input w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm" 
                          placeholder="(11) 98765-4321"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">O que te trouxe aqui hoje?</label>
                      <select 
                        value={simData.contact.motivation}
                        onChange={(e) => handleSimContactChange('motivation', e.target.value)}
                        className="form-input w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm">
                        <option value="">Selecione uma opção</option>
                        <option value="renovacao">Renovação do seguro atual (quero pagar menos)</option>
                        <option value="novo">Acabei de comprar o bem (carro, casa, etc.)</option>
                        <option value="familia">Quero proteger minha família</option>
                        <option value="empresa">Proteção para meu negócio</option>
                        <option value="viagem">Estou planejando uma viagem</option>
                        <option value="outro">Outro motivo</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-5 text-xs text-slate-500 flex items-center gap-2">
                    <i className="fas fa-lock text-slate-400"></i> 
                    <span>Seus dados são criptografados e nunca compartilhados com terceiros sem consentimento.</span>
                  </div>
                </div>
              )}
              
              {/* STEP 3: Qualificação Condicional */}
              {currentSimStep === 3 && (
                <div>
                  {simData.insuranceType === 'auto' && (
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Dados do seu veículo</h3>
                      <p className="text-slate-600 mb-6 text-sm">Essas informações nos ajudam a buscar as melhores tarifas e propostas.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold mb-1.5">Marca e Modelo</label>
                          <input 
                            type="text" 
                            value={simData.qualification.veiculoMarca || ''}
                            onChange={(e) => handleSimQualChange('veiculoMarca', e.target.value)}
                            className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl text-sm" 
                            placeholder="Ex: Toyota Corolla Cross"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1.5">Ano do veículo</label>
                          <input 
                            type="number" 
                            value={simData.qualification.veiculoAno || ''}
                            onChange={(e) => handleSimQualChange('veiculoAno', e.target.value)}
                            className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl text-sm" 
                            placeholder="2024" 
                            min="1990" 
                            max="2027"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1.5">Valor aproximado (R$)</label>
                          <input 
                            type="text" 
                            value={simData.qualification.veiculoValor || ''}
                            onChange={(e) => handleSimQualChange('veiculoValor', e.target.value)}
                            className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl text-sm" 
                            placeholder="Ex: 140.000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1.5">Uso principal</label>
                          <select 
                            value={simData.qualification.veiculoUso || ''}
                            onChange={(e) => handleSimQualChange('veiculoUso', e.target.value)}
                            className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl text-sm">
                            <option value="">Selecione o uso</option>
                            <option value="particular">Particular / Lazer</option>
                            <option value="trabalho">Trabalho / Comercial</option>
                            <option value="aplicativo">Motorista de Aplicativo (Uber/99)</option>
                            <option value="frota">Frota empresarial</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-5">
                        <label className="block text-sm font-semibold mb-1.5">CEP de pernoite (Onde o carro fica à noite)</label>
                        <input 
                          type="text" 
                          value={simData.qualification.cep || ''}
                          onChange={(e) => handleSimQualChange('cep', e.target.value)}
                          className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl text-sm" 
                          placeholder="01310-100"
                        />
                      </div>
                    </div>
                  )}

                  {simData.insuranceType === 'vida' && (
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Informações para o Seguro de Vida</h3>
                      <p className="text-slate-600 mb-6 text-sm">Dados essenciais para que possamos dimensionar o capital segurado ideal.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold mb-1.5">Sua idade</label>
                          <input 
                            type="number" 
                            value={simData.qualification.idade || ''}
                            onChange={(e) => handleSimQualChange('idade', e.target.value)}
                            className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl text-sm" 
                            placeholder="32"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1.5">Profissão principal</label>
                          <input 
                            type="text" 
                            value={simData.qualification.profissao || ''}
                            onChange={(e) => handleSimQualChange('profissao', e.target.value)}
                            className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl text-sm" 
                            placeholder="Médico, Administrador, Autônomo..."
                          />
                        </div>
                      </div>
                      <div className="mt-5">
                        <label className="block text-sm font-semibold mb-1.5">Você possui dependentes financeiros?</label>
                        <div className="flex gap-6 mt-2">
                          {[
                            { value: 'sim', label: 'Sim' },
                            { value: 'nao', label: 'Não' },
                            { value: 'parcial', label: 'Parcialmente' }
                          ].map(dep => (
                            <label key={dep.value} className="flex items-center gap-2 cursor-pointer text-sm">
                              <input 
                                type="radio" 
                                name="sim-dependentes" 
                                value={dep.value} 
                                checked={simData.qualification.dependentes === dep.value}
                                onChange={() => handleSimQualChange('dependentes', dep.value)}
                                className="accent-blue-600 w-4 h-4" 
                              />
                              <span>{dep.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="mt-5">
                        <label className="block text-sm font-semibold mb-1.5">Renda familiar média</label>
                        <select 
                          value={simData.qualification.renda || ''}
                          onChange={(e) => handleSimQualChange('renda', e.target.value)}
                          className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl text-sm">
                          <option value="">Selecione a renda</option>
                          <option value="ate5">Até R$ 5.000</option>
                          <option value="5a10">R$ 5.000 a R$ 10.000</option>
                          <option value="10a20">R$ 10.000 a R$ 20.000</option>
                          <option value="acima20">Acima de R$ 20.000</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {simData.insuranceType === 'empresarial' && (
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Dados da sua empresa</h3>
                      <p className="text-slate-600 mb-6 text-sm">O seguro de empresa varia conforme o porte e o ramo do negócio.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold mb-1.5">Ramo de Atividade</label>
                          <input 
                            type="text" 
                            value={simData.qualification.ramo || ''}
                            onChange={(e) => handleSimQualChange('ramo', e.target.value)}
                            className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl text-sm" 
                            placeholder="Ex: Loja de Roupas, Clínica Médica, Escritório"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1.5">Faturamento anual estimado</label>
                          <select 
                            value={simData.qualification.faturamento || ''}
                            onChange={(e) => handleSimQualChange('faturamento', e.target.value)}
                            className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl text-sm">
                            <option value="">Selecione o faturamento</option>
                            <option value="ate500k">Até R$ 500 mil</option>
                            <option value="500k-2m">R$ 500 mil a R$ 2 milhões</option>
                            <option value="2m-10m">R$ 2 milhões a R$ 10 milhões</option>
                            <option value="acima10m">Acima de R$ 10 milhões</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-5 grid grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold mb-1.5">Número de funcionários</label>
                          <input 
                            type="number" 
                            value={simData.qualification.funcionarios || ''}
                            onChange={(e) => handleSimQualChange('funcionarios', e.target.value)}
                            className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl text-sm" 
                            placeholder="Ex: 8"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1.5">Principais riscos preocupantes</label>
                          <select 
                            value={simData.qualification.riscos || ''}
                            onChange={(e) => handleSimQualChange('riscos', e.target.value)}
                            className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl text-sm">
                            <option value="">Selecione a prioridade</option>
                            <option value="incendio">Incêndio / Explosão</option>
                            <option value="rc">Responsabilidade Civil</option>
                            <option value="roubo">Roubo e Furto de Bens/Valores</option>
                            <option value="todos">Vários riscos simultâneos</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Outros / Residencial / Viagem */}
                  {simData.insuranceType !== 'auto' && simData.insuranceType !== 'vida' && simData.insuranceType !== 'empresarial' && (
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Mais alguns detalhes rápidos</h3>
                      <p className="text-slate-600 mb-6 text-sm">Responda para que nossa recomendação de cobertura fique impecável.</p>
                      
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold mb-1.5">Qual o valor aproximado a ser protegido?</label>
                          <input 
                            type="text" 
                            value={simData.qualification.valorGeral || ''}
                            onChange={(e) => handleSimQualChange('valorGeral', e.target.value)}
                            className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl text-sm" 
                            placeholder="Ex: R$ 450.000 (imóvel, bagagem ou capital)"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1.5">CEP de localização principal (para cálculo regional)</label>
                          <input 
                            type="text" 
                            value={simData.qualification.cepGeral || ''}
                            onChange={(e) => handleSimQualChange('cepGeral', e.target.value)}
                            className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl text-sm" 
                            placeholder="01310-100"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* STEP 4: Coberturas priorizadas */}
              {currentSimStep === 4 && (
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Quais coberturas são prioridade para você?</h3>
                  <p className="text-slate-600 mb-6 text-sm">Selecione as que mais importam para você no momento (pode escolher várias).</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {simData.insuranceType === 'auto' ? (
                      [
                        { value: 'assistencia_24h', label: 'Assistência 24h (guincho, chaveiro)' },
                        { value: 'roubo_furto', label: 'Roubo e Furto (100% Tabela FIPE)' },
                        { value: 'colisao', label: 'Colisão e Danos Próprios' },
                        { value: 'vidros', label: 'Cobertura de Vidros, Faróis e Retrovisores' },
                        { value: 'danos_terceiros', label: 'Danos Corporais e Materiais a Terceiros' }
                      ].map(opt => (
                        <label 
                          key={opt.value} 
                          className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer border transition-all ${
                            simData.preferences.includes(opt.value) 
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-semibold' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}>
                          <input 
                            type="checkbox" 
                            value={opt.value} 
                            checked={simData.preferences.includes(opt.value)}
                            onChange={() => handleSimPreferenceToggle(opt.value)}
                            className="accent-blue-600 w-5 h-5 rounded" 
                          />
                          <span className="text-sm">{opt.label}</span>
                        </label>
                      ))
                    ) : simData.insuranceType === 'vida' ? (
                      [
                        { value: 'morte', label: 'Indenização total por morte (qualquer causa)' },
                        { value: 'invalidez', label: 'Invalidez permanente por acidente' },
                        { value: 'doencas_graves', label: 'Doenças Graves (câncer, infarto, AVC)' },
                        { value: 'diaria_incapacidade', label: 'DIT (Diária por Incapacidade Temporária)' },
                        { value: 'assist_funeral', label: 'Assistência Funeral Individual/Familiar' }
                      ].map(opt => (
                        <label 
                          key={opt.value} 
                          className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer border transition-all ${
                            simData.preferences.includes(opt.value) 
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-semibold' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}>
                          <input 
                            type="checkbox" 
                            value={opt.value} 
                            checked={simData.preferences.includes(opt.value)}
                            onChange={() => handleSimPreferenceToggle(opt.value)}
                            className="accent-blue-600 w-5 h-5 rounded" 
                          />
                          <span className="text-sm">{opt.label}</span>
                        </label>
                      ))
                    ) : (
                      [
                        { value: 'basica_incendio', label: 'Cobertura Básica (Incêndio, Queda de Raio, Explosão)' },
                        { value: 'danos_eletricos', label: 'Danos Elétricos (curto-circuito, sobretensão)' },
                        { value: 'vendaval', label: 'Vendaval, Furacão, Ciclone e Granizo' },
                        { value: 'roubo_bens', label: 'Roubo e Furto Qualificado de Bens' },
                        { value: 'rc_familiar', label: 'Responsabilidade Civil Familiar/Profissional' }
                      ].map(opt => (
                        <label 
                          key={opt.value} 
                          className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer border transition-all ${
                            simData.preferences.includes(opt.value) 
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-semibold' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}>
                          <input 
                            type="checkbox" 
                            value={opt.value} 
                            checked={simData.preferences.includes(opt.value)}
                            onChange={() => handleSimPreferenceToggle(opt.value)}
                            className="accent-blue-600 w-5 h-5 rounded" 
                          />
                          <span className="text-sm">{opt.label}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}
              
              {/* STEP 5: Resumo + Ação */}
              {currentSimStep === 5 && (
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Pronto! Aqui está o resumo da sua proteção ideal</h3>
                  <p className="text-slate-600 mb-6 text-sm">Seus dados já foram qualificados. Escolha abaixo como prefere prosseguir com as cotações.</p>
                  
                  <div className="bg-slate-50 rounded-2xl p-6 mb-6 text-sm border border-slate-100">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs text-slate-500 uppercase font-semibold">Tipo de Seguro solicitado</div>
                          <div className="font-bold text-lg text-slate-900">{getInsuranceTypeLabel(simData.insuranceType)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500 uppercase font-semibold">Lead Qualificado</div>
                          <div className="text-emerald-600 font-bold flex items-center gap-1 justify-end">
                            <i className="fas fa-shield-halved"></i> Perfil Excelente
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-slate-200 pt-4">
                        <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Contato do Titular</div>
                        <div className="text-slate-800">
                          <strong>{simData.contact.name}</strong> — {simData.contact.whatsapp}
                        </div>
                        <div className="text-sm text-slate-600 mt-0.5">{simData.contact.email}</div>
                      </div>

                      {Object.keys(simData.qualification).length > 0 && (
                        <div className="border-t border-slate-200 pt-4">
                          <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Detalhes Adicionais</div>
                          <div className="text-xs text-slate-600 grid grid-cols-2 gap-2 mt-1">
                            {Object.entries(simData.qualification).map(([k, v]) => (
                              <div key={k} className="bg-white p-2 rounded-lg border border-slate-100">
                                <span className="font-semibold text-slate-500 uppercase text-[9px] block mb-0.5">
                                  {k.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span className="text-slate-800 font-medium text-xs">{v}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => finalizeSimulator('cotacao')} 
                      className="cta-button w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-3xl flex items-center justify-center gap-x-2 text-base shadow-lg">
                      <span>Receber cotações no WhatsApp</span>
                      <i className="fab fa-whatsapp text-lg"></i>
                    </button>
                    
                    <button 
                      onClick={() => finalizeSimulator('agendamento')} 
                      className="cta-button w-full border-2 border-blue-600 text-blue-700 hover:bg-blue-50 font-bold py-4 rounded-3xl flex items-center justify-center gap-x-2 text-base">
                      <i className="fas fa-calendar-alt text-lg"></i>
                      <span>Agendar 15 min com especialista</span>
                    </button>
                  </div>
                  
                  <p className="text-center text-xs text-slate-500 mt-5">Sem spam, sem cobrança e com total confidencialidade.</p>
                </div>
              )}
            </div>
            
            {/* Modal Footer Navigation */}
            <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
              <button 
                onClick={handlePrevSimStep} 
                className={`px-6 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-x-2 ${
                  currentSimStep === 1 ? 'invisible' : 'visible'
                }`}>
                <i className="fas fa-arrow-left"></i> Voltar
              </button>
              
              {currentSimStep < 5 && (
                <button 
                  onClick={handleNextSimStep} 
                  className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl text-sm flex items-center gap-x-2 shadow-sm">
                  Continuar <i class="fas fa-arrow-right"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULING MODAL */}
      {showSchedulingModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[130] p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl relative">
            <button 
              onClick={() => setShowSchedulingModal(false)}
              className="absolute top-4 right-5 text-slate-400 hover:text-slate-600 text-2xl font-bold">
              &times;
            </button>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Reserve sua consultoria</h3>
            <p className="text-slate-600 text-sm mb-6">Evite ligações de telemarketing. Agende um horário para falar diretamente por vídeo ou chamada com nosso especialista no seu tipo de seguro.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase block mb-1">Data preferida</label>
                <input 
                  type="date" 
                  value={schedData.date}
                  onChange={(e) => setSchedData(prev => ({ ...prev, date: e.target.value }))}
                  className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl text-sm" 
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase block mb-1">Horário disponível</label>
                <select 
                  value={schedData.time}
                  onChange={(e) => setSchedData(prev => ({ ...prev, time: e.target.value }))}
                  className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl text-sm">
                  <option value="09:00 - 09:15">09:00 - 09:15 (Manhã)</option>
                  <option value="10:30 - 10:45">10:30 - 10:45 (Manhã)</option>
                  <option value="14:00 - 14:15">14:00 - 14:15 (Tarde)</option>
                  <option value="16:30 - 16:45">16:30 - 16:45 (Tarde)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase block mb-1">Especialista Alocado</label>
                <select 
                  value={schedData.expert}
                  onChange={(e) => setSchedData(prev => ({ ...prev, expert: e.target.value }))}
                  className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl text-sm">
                  <option value="Ana Paula Mendes (Vida & Empresarial)">Ana Paula Mendes (Especialista Vida & Empresarial)</option>
                  <option value="Ricardo Almeida (Auto & Frota)">Ricardo Almeida (Especialista Auto & Frota)</option>
                  <option value="Juliana Costa (Residencial & Viagem)">Juliana Costa (Especialista Residencial & Viagem)</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={handleConfirmScheduling} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-3xl mb-3 shadow-lg transition-transform hover:-translate-y-0.5">
              Confirmar agendamento
            </button>
            
            <button 
              onClick={() => setShowSchedulingModal(false)} 
              className="w-full text-sm font-medium text-slate-500 hover:text-slate-700 block text-center py-1">
              Cancelar
            </button>
            
            <p className="text-[10px] text-center text-slate-400 mt-3">Sua chamada terá duração média de 15 minutos e não gerará qualquer compromisso de compra.</p>
          </div>
        </div>
      )}

      {/* PARTNER INFO MODAL */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[130] p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-8 shadow-2xl relative">
            <button 
              onClick={() => setShowPartnerModal(false)}
              className="absolute top-4 right-5 text-slate-400 hover:text-slate-600 text-2xl font-bold">
              &times;
            </button>
            
            <div className="flex items-center gap-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <i className="fas fa-building text-lg"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-950" id="partner-name">
                {selectedPartner.name}
              </h3>
            </div>
            
            <div className="text-sm text-slate-600 space-y-4 mb-6 leading-relaxed">
              <div>
                <span className="font-bold text-slate-800 text-xs uppercase block mb-1">Principais diferenciais desta seguradora:</span>
                <p>{selectedPartner.advantages}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-800 text-sm border border-blue-100 font-medium">
                <strong>Vantagem exclusiva MB:</strong> {selectedPartner.highlight}
              </div>
            </div>
            
            <button 
              onClick={quoteWithSelectedPartner} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-3xl shadow-md transition-transform hover:-translate-y-0.5">
              Cotar com esta seguradora agora
            </button>
          </div>
        </div>
      )}

      {/* EXIT INTENT MODAL */}
      {showExitIntent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[150] p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-8 text-center shadow-2xl relative">
            <button 
              onClick={() => setShowExitIntent(false)}
              className="absolute top-4 right-5 text-slate-400 hover:text-slate-600 text-2xl font-bold">
              &times;
            </button>
            
            <i className="fas fa-gift text-5xl text-blue-600 mb-4 animate-bounce"></i>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Espere! Antes de sair...</h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">Receba gratuitamente o nosso <strong>Checklist Completo de Proteção de Patrimônio 2026</strong> + uma análise das propostas de seguros mais baratas do momento direto no seu WhatsApp.</p>
            
            <form onSubmit={handleExitIntentSubmit} className="space-y-3">
              <input 
                type="tel" 
                value={exitWhatsapp}
                onChange={(e) => setExitWhatsapp(formatPhone(e.target.value))}
                placeholder="Seu WhatsApp (com DDD)" 
                className="form-input w-full px-4 py-3.5 border border-slate-300 rounded-2xl text-sm bg-slate-50 text-slate-900 text-center font-semibold"
                required
              />
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-3xl shadow-lg transition-transform hover:-translate-y-0.5">
                Quero meu checklist grátis agora
              </button>
            </form>
            
            <button 
              onClick={() => setShowExitIntent(false)} 
              className="mt-4 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider block mx-auto py-1">
              Não, obrigado
            </button>
          </div>
        </div>
      )}

      {/* SOCIAL PROOF TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-[90] max-w-xs bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 text-sm flex gap-3 items-start animate-fade-in-up">
          <div className="flex-1">
            <div className="flex items-center gap-x-2 text-emerald-600 text-xs font-bold mb-1">
              <i className="fas fa-check-circle text-base"></i> 
              <span className="uppercase tracking-wider">Conversão Recente</span>
            </div>
            <div className="text-slate-700 text-xs md:text-sm font-medium">{toastMessage}</div>
          </div>
          <button 
            onClick={() => setToastMessage(null)} 
            className="text-slate-400 hover:text-slate-600 text-xl font-bold leading-none">&times;</button>
        </div>
      )}

    </div>
  );
}
