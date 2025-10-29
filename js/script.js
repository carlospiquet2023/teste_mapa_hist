/*
==========================================================================
🗺️ MAPA HISTÓRICO DO RIO DE JANEIRO - LÓGICA DA APLICAÇÃO
==========================================================================

📝 DESCRIÇÃO:
   Sistema completo de mapa interativo para exploração histórica
   do Centro do Rio de Janeiro com recursos educacionais avançados

🎯 FUNCIONALIDADES PRINCIPAIS:
   - Intro de vídeo fullscreen responsiva
   - Mapa interativo com Leaflet.js
   - Filtragem por categorias históricas
   - Sistema de busca avançado
   - Interface responsiva PWA
   - Conteúdo educacional rico

📱 COMPATIBILIDADE:
   - Progressive Web App (PWA)
   - Mobile-first responsive design
   - Touch gestures otimizados
   - Standalone app support

👨‍💻 AUTOR: Carlos Antonio de Oliveira Piquet
🏢 CNPJ: 27.658.099/0001-70
� CONTATO: carlospiquet.projetos@gmail.com
📅 CRIAÇÃO: Setembro 2024
⚖️ COPYRIGHT: © 2024 - Todos os direitos reservados

🛡️ OBRA AUTORAL PROTEGIDA POR DIREITOS AUTORAIS
   Uso não autorizado é expressamente proibido.

==========================================================================
*/

//=============================================================================
// 🎬 INTRO DE VÍDEO
//=============================================================================

/**
 * CONTROLADOR DA INTRO DE VÍDEO - VERSÃO SIMPLIFICADA
 * Gerencia o vídeo de introdução sem travamentos
 */
function initVideoIntro() {
    const overlay = document.getElementById('videoIntroOverlay');
    const video = document.getElementById('introVideo');
    const soundToggle = document.getElementById('soundToggle');
    const soundIcon = document.getElementById('soundIcon');
    const skipButton = document.getElementById('skipVideo');
    
    if (!overlay || !video) {
        console.log('Elementos de vídeo não encontrados');
        return;
    }
    
    // Detecta se é dispositivo móvel
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Configuração básica do vídeo
    video.playsInline = true;
    video.volume = 0.8;
    
    // Em dispositivos móveis, inicia sempre mudo devido às políticas dos navegadores
    if (isMobile) {
        video.muted = true;
        console.log('Dispositivo móvel detectado - iniciando vídeo mudo');
    } else {
        video.muted = false;
    }
    
    // Função para remover overlay
    const removeOverlay = () => {
        overlay.classList.add('fade-out');
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 1000);
    };
    
    // Botão de pular
    if (skipButton) {
        skipButton.addEventListener('click', removeOverlay);
    }
    
    // Controle de som otimizado para mobile
    if (soundToggle && soundIcon) {
        // Configuração inicial do botão baseada no estado do vídeo
        const updateSoundButton = () => {
            if (video.muted) {
                soundIcon.className = 'fas fa-volume-mute';
                soundToggle.title = 'Ativar Som';
                if (isMobile) soundToggle.style.animation = 'pulse 2s infinite';
                return;
            }
            soundIcon.className = 'fas fa-volume-up';
            soundToggle.title = 'Desligar Som';
            soundToggle.style.animation = '';
        };
        
        // Configuração inicial
        updateSoundButton();
        
        soundToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Previne múltiplos cliques rapidamente
            if (soundToggle.disabled) return;
            soundToggle.disabled = true;
            
            setTimeout(() => {
                soundToggle.disabled = false;
            }, 300);
            
            if (video.muted) {
                // Ativar som
                video.muted = false;
                video.volume = 0.8;
                
                // Em mobile, precisa de interação do usuário para funcionar
                if (isMobile) {
                    // Força o play para "quebrar" a política de autoplay
                    video.play().then(() => {
                        console.log('Som ativado com sucesso no mobile');
                    }).catch(err => {
                        console.log('Não foi possível ativar som:', err);
                        video.muted = true; // Volta para mudo se não conseguir
                    });
                }
            } else {
                // Mutar som
                video.muted = true;
            }
            
            updateSoundButton();
        });
    }
    
    // Tentar reproduzir vídeo - estratégia diferente para mobile e desktop
    const startVideo = () => {
        video.play().then(() => {
            console.log('Vídeo iniciado com sucesso');
            if (isMobile) console.log('Mobile: vídeo iniciado mudo, aguardando interação do usuário');
            // Garantir volume adequado quando não estiver mudo
            if (!video.muted) video.volume = 0.8;
        }).catch(error => {
            console.log('Erro ao reproduzir vídeo:', error);
            
            // Fallback: força modo mudo
            video.muted = true;
            if (soundToggle && soundIcon) {
                soundIcon.className = 'fas fa-volume-mute';
                soundToggle.title = 'Ativar Som';
                if (isMobile) {
                    soundToggle.style.animation = 'pulse 2s infinite';
                }
            }
            
            video.play().catch(finalError => {
                console.log('Erro total ao reproduzir vídeo:', finalError);
                removeOverlay();
            });
        });
    };
    
    // Inicia o vídeo
    startVideo();
    
    // Otimização especial para dispositivos móveis
    if (isMobile) {
        // Detecta primeira interação do usuário para "quebrar" políticas de autoplay
        const enableSoundOnFirstInteraction = () => {
            // Só executa se o vídeo estiver mudo
            if (video.muted && video.paused === false) {
                console.log('Primeira interação detectada - tentando ativar som automaticamente');
                video.muted = false;
                video.volume = 0.8;
                
                // Atualiza o botão
                if (soundToggle && soundIcon) {
                    soundIcon.className = 'fas fa-volume-up';
                    soundToggle.title = 'Desligar Som';
                    soundToggle.style.animation = '';
                }
            }
            
            // Remove os listeners após primeira interação
            document.removeEventListener('touchstart', enableSoundOnFirstInteraction);
            document.removeEventListener('click', enableSoundOnFirstInteraction);
        };
        
        // Adiciona listeners para primeira interação
        document.addEventListener('touchstart', enableSoundOnFirstInteraction, { once: true });
        document.addEventListener('click', enableSoundOnFirstInteraction, { once: true });
    }
    
    // Quando terminar, remove overlay
    video.addEventListener('ended', removeOverlay);
    video.addEventListener('error', removeOverlay);

    // Configuração simples de legendas
    let subtitlesEnabled = true;
    const customSubtitles = document.getElementById('customSubtitles');
    
    if (customSubtitles) {
        const subtitleData = [
            { start: 6, end: 9, text: "Sejam todos bem-vindos ao Mapa Histórico do Rio." },
            { start: 9, end: 11.5, text: "Aqui, vamos explorar o passado da cidade" },
            { start: 11.5, end: 13, text: "de forma prática e visual," },
            { start: 13, end: 14.5, text: "trazendo a história à vida." }
        ];
        
        const showSubtitles = () => {
            const currentTime = video.currentTime;
            let currentSubtitle = null;
            
            for (let subtitle of subtitleData) {
                if (currentTime >= subtitle.start && currentTime <= subtitle.end) {
                    currentSubtitle = subtitle;
                    break;
                }
            }
            
            if (currentSubtitle && subtitlesEnabled) {
                customSubtitles.textContent = currentSubtitle.text;
                customSubtitles.classList.add('show');
            } else {
                customSubtitles.classList.remove('show');
            }
        };
        
        video.addEventListener('timeupdate', showSubtitles);
    }
}

//=============================================================================
// 📱 PWA & OTIMIZAÇÕES MOBILE
//=============================================================================

/**
 * INICIALIZAÇÃO DA APLICAÇÃO
 * Configura otimizações específicas para dispositivos móveis e PWA
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializar intro de vídeo
    initVideoIntro();

    // ================= Acessibilidade e Tela Cheia =================
    initAccessibility();
    initFullscreenButtons();
    
    /**
     * DETECÇÃO DE DISPOSITIVO
     * Identifica se está rodando em mobile ou como PWA standalone
     */
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    
    /**
     * CONFIGURAÇÃO DE VIEWPORT DINÂMICO
     * Ajusta altura da viewport para lidar com barras de navegação móveis
     */
    function setVH() {
        // Usa visual viewport quando disponível para refletir altura útil
        const h = (window.visualViewport?.height || window.innerHeight);
        const vh = h * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.documentElement.style.setProperty('--app-height', `${h}px`);
    }
    
    // Aplicar configurações de viewport
    setVH();
    window.addEventListener('resize', () => {
        setVH();
        // Se o mapa já existir, força recálculo do Leaflet
        if (window.map && typeof window.map.invalidateSize === 'function') {
            setTimeout(() => window.map.invalidateSize(), 0);
        }
    });
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            setVH();
            if (window.map && typeof window.map.invalidateSize === 'function') {
                window.map.invalidateSize();
            }
        }, 200); // pequeno atraso para estabilizar o layout
    });
    
    /**
     * OTIMIZAÇÕES PARA PWA
     * Configurações específicas quando rodando como aplicativo standalone
     */
    if (isStandalone) {
        document.body.classList.add('pwa-mode');
        
        // Prevenir zoom em inputs no iOS
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                const viewport = document.querySelector('meta[name="viewport"]');
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            });
            input.addEventListener('blur', () => {
                const viewport = document.querySelector('meta[name="viewport"]');
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover');
            });
        });
    }
    
    /**
     * OTIMIZAÇÕES ESPECÍFICAS PARA MOBILE
     * Melhora performance e experiência em dispositivos touch
     */
    if (isMobile) {
        document.body.classList.add('mobile-device');
        
        // Prevenir scroll bounce no iOS
        document.addEventListener('touchmove', function(e) {
            // Permitir scroll apenas em elementos específicos
            if (e.target.closest('.modal-content, .sidebar, #map')) {
                return;
            }
            e.preventDefault();
        }, { passive: false });
        
        // Otimizar performance de touch
        document.addEventListener('touchstart', function() {}, { passive: true });
    }
});

//=============================================================================
// ♿ CENTRAL DE ACESSIBILIDADE PREMIUM - NOVA IMPLEMENTAÇÃO
//=============================================================================

/**
 * Sistema completo de acessibilidade com design moderno
 * Controla todas as funcionalidades de acessibilidade da aplicação
 */
function initAccessibility() {
    const trigger = document.getElementById('accessibilityTrigger');
    const panel = document.getElementById('accessibilityPanel');
    const backdrop = document.getElementById('accessibilityBackdrop');
    const closeBtn = document.getElementById('panelClose');

    if (!trigger || !panel) return;

    if (!trigger || !panel) return;

    // ===== ELEMENTOS DE CONTROLE =====
    const highContrastToggle = document.getElementById('highContrastToggle');
    const dyslexiaToggle = document.getElementById('dyslexiaToggle');
    const reduceMotionToggle = document.getElementById('reduceMotionToggle');
    const highlightToggle = document.getElementById('highlightToggle');
    const muteMediaToggle = document.getElementById('muteMediaToggle');
    const screenReaderToggle = document.getElementById('screenReaderToggle');
    const autoReadToggle = document.getElementById('autoReadToggle');
    const speechRateSlider = document.getElementById('speechRateSlider');
    const speechRateValue = document.getElementById('speechRateValue');
    const readerOptions = document.getElementById('readerOptions');
    const decreaseFont = document.getElementById('decreaseFont');
    const increaseFont = document.getElementById('increaseFont');
    const resetFont = document.getElementById('resetFont');
    const fontSizeIndicator = document.getElementById('fontSizeIndicator');
    const resetAllBtn = document.getElementById('resetAllBtn');

    // ===== ESTADO INICIAL =====
    let isOpen = false;
    const state = loadAccessibilityState();
    applyAccessibilityState(state);

    // ===== FUNÇÕES DE ABERTURA/FECHAMENTO =====
    function openPanel() {
        isOpen = true;
        backdrop.classList.add('active');
        
        // Pequeno delay para garantir que o backdrop apareça primeiro
        setTimeout(() => {
            panel.classList.add('active');
        }, 10);
        
        trigger.setAttribute('aria-expanded', 'true');
        // Não bloquear o scroll do body
    }

    function closePanel() {
        isOpen = false;
        panel.classList.remove('active');
        
        // Delay para remover o backdrop depois do painel
        setTimeout(() => {
            backdrop.classList.remove('active');
        }, 300);
        
        trigger.setAttribute('aria-expanded', 'false');
        
        // Retornar foco ao botão
        setTimeout(() => trigger.focus(), 100);
    }

    function togglePanel() {
        if (isOpen) {
            closePanel();
        } else {
            openPanel();
        }
    }

    // ===== EVENT LISTENERS =====
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePanel();
    });
    
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closePanel();
    });
    
    backdrop.addEventListener('click', (e) => {
        if (isOpen && e.target === backdrop) {
            closePanel();
        }
    });

    // Impedir que cliques no painel fechem o backdrop
    panel.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Atalho de teclado: Alt + A
    document.addEventListener('keydown', (e) => {
        if (e.altKey && (e.key === 'a' || e.key === 'A')) {
            e.preventDefault();
            togglePanel();
        }
        
        // ESC para fechar
        if (e.key === 'Escape' && isOpen) {
            closePanel();
        }
    });

    // ===== ALTO CONTRASTE =====
    if (highContrastToggle) {
        highContrastToggle.checked = state.highContrast || false;
        highContrastToggle.addEventListener('change', () => {
            const enabled = highContrastToggle.checked;
            document.body.classList.toggle('high-contrast', enabled);
            saveState('highContrast', enabled);
        });
    }

    // ===== FONTE DISLEXIA =====
    if (dyslexiaToggle) {
        dyslexiaToggle.checked = state.dyslexia || false;
        dyslexiaToggle.addEventListener('change', () => {
            const enabled = dyslexiaToggle.checked;
            document.body.classList.toggle('dyslexia-font', enabled);
            saveState('dyslexia', enabled);
        });
    }

    // ===== REDUZIR ANIMAÇÕES =====
    if (reduceMotionToggle) {
        reduceMotionToggle.checked = state.reduceMotion || false;
        reduceMotionToggle.addEventListener('change', () => {
            const enabled = reduceMotionToggle.checked;
            document.body.classList.toggle('reduced-motion', enabled);
            saveState('reduceMotion', enabled);
        });
    }

    // ===== DESTACAR FOCO =====
    if (highlightToggle) {
        highlightToggle.checked = state.highlightFocus || false;
        highlightToggle.addEventListener('change', () => {
            const enabled = highlightToggle.checked;
            document.body.classList.toggle('highlight-focus', enabled);
            saveState('highlightFocus', enabled);
        });
    }

    // ===== SILENCIAR MÍDIAS =====
    if (muteMediaToggle) {
        muteMediaToggle.checked = state.muteMedia || false;
        muteMediaToggle.addEventListener('change', () => {
            const enabled = muteMediaToggle.checked;
            setMediaMuted(enabled);
            saveState('muteMedia', enabled);
        });
    }

    // ===== LEITOR DE TELA =====
    if (screenReaderToggle) {
        screenReaderToggle.checked = state.screenReader || false;
        
        // Mostrar/ocultar opções do leitor
        readerOptions.style.display = state.screenReader ? 'block' : 'none';
        
        screenReaderToggle.addEventListener('change', () => {
            const enabled = screenReaderToggle.checked;
            
            // Parar qualquer leitura antes de mudar o estado
            if (!enabled) {
                stopSpeaking();
            }
            
            toggleScreenReader(enabled);
            readerOptions.style.display = enabled ? 'block' : 'none';
            saveState('screenReader', enabled);
            
            // Se desativou, também desativar auto-read
            if (!enabled && autoReadToggle) {
                autoReadToggle.checked = false;
                saveState('autoRead', false);
            }
        });
    }

    // ===== LEITURA AUTOMÁTICA =====
    if (autoReadToggle) {
        autoReadToggle.checked = state.autoRead || false;
        autoReadToggle.addEventListener('change', () => {
            const enabled = autoReadToggle.checked;
            setAutoRead(enabled);
            saveState('autoRead', enabled);
        });
    }

    // ===== VELOCIDADE DA FALA =====
    if (speechRateSlider && speechRateValue) {
        const rate = state.speechRate || 1.0;
        speechRateSlider.value = rate;
        speechRateValue.textContent = `${rate.toFixed(1)}x`;
        
        speechRateSlider.addEventListener('input', () => {
            const newRate = parseFloat(speechRateSlider.value);
            speechRateValue.textContent = `${newRate.toFixed(1)}x`;
            saveState('speechRate', newRate);
        });
    }

    // ===== TAMANHO DA FONTE =====
    if (decreaseFont && increaseFont && resetFont && fontSizeIndicator) {
        const currentScale = state.fontScale || 1.0;
        updateFontSizeDisplay(currentScale);
        
        decreaseFont.addEventListener('click', () => {
            const newScale = Math.max(0.8, currentScale - 0.1);
            setFontScale(newScale);
        });
        
        increaseFont.addEventListener('click', () => {
            const newScale = Math.min(1.5, currentScale + 0.1);
            setFontScale(newScale);
        });
        
        resetFont.addEventListener('click', () => {
            setFontScale(1.0);
        });
    }

    // ===== RESET TOTAL =====
    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', () => {
            resetAllAccessibilitySettings();
        });
    }

    // ===== FUNÇÕES AUXILIARES =====
    function saveState(key, value) {
        const currentState = loadAccessibilityState();
        currentState[key] = value;
        saveAccessibilityState(currentState);
    }

    function setFontScale(scale) {
        document.documentElement.style.fontSize = `${16 * scale}px`;
        updateFontSizeDisplay(scale);
        saveState('fontScale', scale);
    }

    function updateFontSizeDisplay(scale) {
        if (fontSizeIndicator) {
            const percentage = Math.round(scale * 100);
            fontSizeIndicator.textContent = `${percentage}%`;
        }
    }
}

// ===== FUNÇÕES DE ARMAZENAMENTO =====
function loadAccessibilityState() {
    try {
        const saved = localStorage.getItem('accessibilityState');
        return saved ? JSON.parse(saved) : {};
    } catch {
        return {};
    }
}

function saveAccessibilityState(state) {
    try {
        localStorage.setItem('accessibilityState', JSON.stringify(state));
    } catch (error) {
        console.error('Erro ao salvar estado de acessibilidade:', error);
    }
}

function applyAccessibilityState(state) {
    // Aplicar alto contraste
    if (state.highContrast) {
        document.body.classList.add('high-contrast');
    }
    
    // Aplicar fonte dislexia
    if (state.dyslexia) {
        document.body.classList.add('dyslexia-font');
    }
    
    // Aplicar redução de movimento
    if (state.reduceMotion) {
        document.body.classList.add('reduced-motion');
    }
    
    // Aplicar destaque de foco
    if (state.highlightFocus) {
        document.body.classList.add('highlight-focus');
    }
    
    // Aplicar escala de fonte
    if (state.fontScale) {
        document.documentElement.style.fontSize = `${16 * state.fontScale}px`;
    }
    
    // Aplicar mute de mídia
    if (state.muteMedia) {
        setMediaMuted(true);
    }
    
    // Aplicar leitor de tela
    if (state.screenReader) {
        toggleScreenReader(true);
    }
    
    // Aplicar leitura automática
    if (state.autoRead) {
        setAutoRead(true);
    }
}

// ===== FUNÇÕES DE MÍDIA =====
function setMediaMuted(muted) {
    document.querySelectorAll('video, audio').forEach(media => {
        media.muted = muted;
        if (muted && !media.paused) {
            media.pause();
        }
    });
}

// ===== VARIÁVEIS GLOBAIS DO LEITOR DE TELA =====
let isScreenReaderActive = false;
let isAutoReadActive = false;
let currentSpeech = null;

// ===== FUNÇÕES DO LEITOR DE TELA =====
function toggleScreenReader(active) {
    isScreenReaderActive = active;
    
    if (active) {
        initScreenReader();
        document.body.classList.add('screen-reader-active');
    } else {
        // Parar qualquer leitura ativa
        stopSpeaking();
        // Remover listeners
        removeScreenReaderListeners();
        // Também desativar leitura automática
        isAutoReadActive = false;
        // Remover classe visual
        document.body.classList.remove('screen-reader-active');
        
        // Atualizar o checkbox de auto-read se existir
        const autoReadToggle = document.getElementById('autoReadToggle');
        if (autoReadToggle) {
            autoReadToggle.checked = false;
        }
    }
}

function initScreenReader() {
    if (!window.speechSynthesis) {
        alert('Desculpe, seu navegador não suporta síntese de voz.');
        return;
    }
    
    addScreenReaderListeners();
}

function addScreenReaderListeners() {
    removeScreenReaderListeners();
    
    // Usar capture phase para ter prioridade
    document.addEventListener('click', handleScreenReaderClick, { capture: true });
    
    if (isAutoReadActive) {
        document.addEventListener('mouseover', handleScreenReaderHover, { capture: true });
    }
}

function removeScreenReaderListeners() {
    document.removeEventListener('click', handleScreenReaderClick, { capture: true });
    document.removeEventListener('mouseover', handleScreenReaderHover, { capture: true });
}

function setAutoRead(active) {
    isAutoReadActive = active;
    
    if (active && isScreenReaderActive) {
        document.addEventListener('mouseover', handleScreenReaderHover, { capture: true });
    } else {
        document.removeEventListener('mouseover', handleScreenReaderHover, { capture: true });
    }
}

function handleScreenReaderClick(event) {
    if (!isScreenReaderActive) return;
    
    // Ignorar cliques no painel de acessibilidade e seus controles
    if (event.target.closest('.accessibility-panel') || 
        event.target.closest('.accessibility-hub') ||
        event.target.closest('.accessibility-backdrop')) {
        return;
    }
    
    const element = getRelevantElement(event.target);
    if (element) {
        speakElement(element);
    }
}

function handleScreenReaderHover(event) {
    if (!isScreenReaderActive || !isAutoReadActive) return;
    
    // Ignorar hover no painel e controles
    if (event.target.closest('.accessibility-panel') ||
        event.target.closest('.accessibility-hub') ||
        event.target.closest('.accessibility-backdrop')) {
        return;
    }
    
    const element = getRelevantElement(event.target);
    if (element && isSignificantElement(element)) {
        speakElement(element);
    }
}

function getRelevantElement(target) {
    // Elementos interativos
    if (['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) {
        return target;
    }
    
    // Procurar por elementos significativos
    let current = target;
    while (current && current !== document.body) {
        if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P'].includes(current.tagName)) {
            return current;
        }
        
        if (current.getAttribute('aria-label') || current.getAttribute('role')) {
            return current;
        }
        
        current = current.parentElement;
    }
    
    return target;
}

function isSignificantElement(element) {
    return (
        ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BUTTON', 'A'].includes(element.tagName) ||
        element.getAttribute('aria-label') ||
        element.className.includes('info-title')
    );
}

function speakElement(element) {
    stopSpeaking();
    
    // Destacar elemento
    removeHighlights();
    element.classList.add('screen-reader-highlight');
    
    const textToSpeak = getTextToSpeak(element);
    if (!textToSpeak) return;
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Configurar velocidade
    const state = loadAccessibilityState();
    utterance.rate = state.speechRate || 1.0;
    utterance.lang = 'pt-BR';
    
    utterance.onend = () => {
        element.classList.remove('screen-reader-highlight');
        currentSpeech = null;
    };
    
    currentSpeech = utterance;
    window.speechSynthesis.speak(utterance);
}

function getTextToSpeak(element) {
    // Verificar aria-label
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    
    // Verificar aria-labelledby
    const labelledById = element.getAttribute('aria-labelledby');
    if (labelledById) {
        const labelElement = document.getElementById(labelledById);
        if (labelElement) return labelElement.textContent;
    }
    
    // Verificar title
    if (element.title) return element.title;
    
    // Botões com ícones
    if (element.tagName === 'BUTTON' && !element.textContent.trim()) {
        const icon = element.querySelector('i[class*="fa-"]');
        if (icon) {
            const classList = Array.from(icon.classList);
            const faClass = classList.find(c => c.startsWith('fa-'));
            if (faClass) {
                return faClass.replace('fa-', '').replace(/-/g, ' ');
            }
        }
    }
    
    // Texto do elemento
    return element.textContent.trim();
}

function stopSpeaking() {
    if (window.speechSynthesis) {
        // Cancelar todas as falas pendentes
        window.speechSynthesis.cancel();
        
        // Garantir que realmente pare
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.cancel();
        }
    }
    
    if (currentSpeech) {
        currentSpeech = null;
    }
    
    removeHighlights();
}

function removeHighlights() {
    document.querySelectorAll('.screen-reader-highlight').forEach(el => {
        el.classList.remove('screen-reader-highlight');
    });
}

// ===== RESET COMPLETO =====
function resetAllAccessibilitySettings() {
    // Parar leitor de tela
    stopSpeaking();
    toggleScreenReader(false);
    
    // Remover classe visual
    document.body.classList.remove('screen-reader-active');
    
    // Remover do localStorage
    try {
        localStorage.removeItem('accessibilityState');
    } catch {}
    
    // Remover classes do body
    document.body.classList.remove(
        'high-contrast',
        'dyslexia-font',
        'reduced-motion',
        'highlight-focus'
    );
    
    // Resetar fonte
    document.documentElement.style.fontSize = '16px';
    
    // Desmutar mídias
    setMediaMuted(false);
    
    // Resetar todos os controles
    document.querySelectorAll('.accessibility-panel input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    const fontSizeIndicator = document.getElementById('fontSizeIndicator');
    if (fontSizeIndicator) {
        fontSizeIndicator.textContent = '100%';
    }
    
    const speechRateSlider = document.getElementById('speechRateSlider');
    const speechRateValue = document.getElementById('speechRateValue');
    if (speechRateSlider) speechRateSlider.value = 1;
    if (speechRateValue) speechRateValue.textContent = '1.0x';
    
    const readerOptions = document.getElementById('readerOptions');
    if (readerOptions) readerOptions.style.display = 'none';
    
    // Feedback visual
    const panel = document.getElementById('accessibilityPanel');
    const trigger = document.getElementById('accessibilityTrigger');
    const backdrop = document.getElementById('accessibilityBackdrop');
    
    if (panel) {
        panel.classList.add('reset-success');
        setTimeout(() => {
            panel.classList.remove('reset-success', 'active');
            
            if (backdrop) {
                backdrop.classList.remove('active');
            }
            
            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
                setTimeout(() => trigger.focus(), 100);
            }
        }, 800);
    }
}

// Funções de compatibilidade (mantidas para não quebrar código existente)
function bindToggle(el, key, apply) {
    if (!el) return;
    const state = loadA11yState();
    el.checked = !!state[key];
    apply(!!state[key]);
    el.addEventListener('change', () => {
        const s = loadA11yState();
        s[key] = el.checked;
        saveA11yState(s);
        apply(el.checked);
    });
}

function adjustFontSize(delta) {
    const s = loadA11yState();
    const current = s.fontScale || 1;
    const next = Math.min(1.3, Math.max(0.8, +(current + delta).toFixed(2)));
    setFontScale(next);
}

function setFontScale(scale) {
    const s = loadA11yState();
    s.fontScale = scale;
    saveA11yState(s);
    document.documentElement.style.setProperty('font-size', `${16 * scale}px`);
    
    const fontResetBtn = document.getElementById('fontReset');
    if (fontResetBtn) {
        const percent = Math.round(scale * 100);
        fontResetBtn.textContent = `${percent}%`;
        
        if (scale !== 1) {
            fontResetBtn.classList.add('active-size');
            
            const fontPlus = document.getElementById('fontPlus');
            const fontMinus = document.getElementById('fontMinus');
            
            if (fontPlus) {
                fontPlus.disabled = scale >= 1.3;
                fontPlus.classList.toggle('disabled', scale >= 1.3);
            }
            
            if (fontMinus) {
                fontMinus.disabled = scale <= 0.8;
                fontMinus.classList.toggle('disabled', scale <= 0.8);
            }
        } else {
            fontResetBtn.classList.remove('active-size');
            
            const fontPlus = document.getElementById('fontPlus');
            const fontMinus = document.getElementById('fontMinus');
            
            if (fontPlus) {
                fontPlus.disabled = false;
                fontPlus.classList.remove('disabled');
            }
            
            if (fontMinus) {
                fontMinus.disabled = false;
                fontMinus.classList.remove('disabled');
            }
        }
    }
}

function loadA11yState() {
    try { return JSON.parse(localStorage.getItem('a11yState') || '{}'); } catch { return {}; }
}

function saveA11yState(state) {
    try { localStorage.setItem('a11yState', JSON.stringify(state)); } catch {}
}

function applyA11yState(s) {
    if (!s) return;
    
    if (s.fontScale) {
        document.documentElement.style.setProperty('font-size', `${16 * s.fontScale}px`);
        const fontResetBtn = document.getElementById('fontReset');
        if (fontResetBtn) {
            const percent = Math.round(s.fontScale * 100);
            fontResetBtn.textContent = `${percent}%`;
            if (s.fontScale !== 1) {
                fontResetBtn.classList.add('active-size');
            }
        }
    }
    
    if (s.contrast) document.body.classList.add('high-contrast');
    if (s.dyslexia) document.body.classList.add('dyslexia-font');
    if (s.reduceMotion) document.body.classList.add('reduced-motion');
    if (s.highlight) document.body.classList.add('highlight-focus');
    if (s.muteMedia) setMediaMuted(true);
    if (s.screenReader) toggleScreenReader(true);
    if (s.autoRead) setAutoRead(true);
}

//=============================================================================
// ⛶ Tela Cheia
//=============================================================================
function initFullscreenButtons() {
    const desktopBtn = document.getElementById('fullscreenBtn');
    const mobileBtn = document.getElementById('fullscreenBtnMobile');
    const setIcon = (isFs) => {
        const iconD = document.getElementById('fullscreenIcon');
        const iconM = document.getElementById('fullscreenIconMobile');
        iconD && (iconD.className = isFs ? 'fas fa-compress' : 'fas fa-expand');
        iconM && (iconM.className = isFs ? 'fas fa-compress' : 'fas fa-expand');
        desktopBtn?.setAttribute('aria-label', isFs ? 'Sair de tela cheia' : 'Ativar tela cheia');
        mobileBtn?.setAttribute('aria-label', isFs ? 'Sair de tela cheia' : 'Ativar tela cheia');
        desktopBtn?.setAttribute('aria-pressed', String(isFs));
        mobileBtn?.setAttribute('aria-pressed', String(isFs));
    };

    async function toggleFullscreen() {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
                setIcon(true);
            } else {
                await document.exitFullscreen();
                setIcon(false);
            }
        } catch (e) { console.warn('Tela cheia não suportada', e); }
        if (window.map?.invalidateSize) setTimeout(() => window.map.invalidateSize(), 300);
    }

    desktopBtn?.addEventListener('click', toggleFullscreen);
    mobileBtn?.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', () => setIcon(!!document.fullscreenElement));
}

//=============================================================================
// 🗺️ FUNÇÕES DE MANIPULAÇÃO DE POPUPS
//=============================================================================

/**
 * Centraliza o mapa em um ponto e abre o popup de maneira otimizada
 * @param {Array} coords - Coordenadas [lat, lng]
 * @param {Object} marcador - Objeto marcador do Leaflet
 * @param {number} zoom - Nível de zoom (opcional)
 */
function centrarEAbrirPopup(coords, marcador, zoom = 17) {
    const isSmallScreen = window.innerWidth <= 768;
    const effectiveZoom = isSmallScreen ? 16 : zoom;
    
    // Primeiro, centralizar o mapa nas coordenadas com o zoom apropriado
    map.setView(coords, effectiveZoom, {
        animate: !isSmallScreen,
        duration: 0.3
    });
    
    // Abrir o popup após um pequeno atraso
    setTimeout(() => {
        marcador.openPopup();
        
        // Ajustar posição após popup abrir para ficar no centro da tela
        setTimeout(() => {
            // Pegar altura do popup para calcular offset
            const popupElement = document.querySelector('.leaflet-popup');
            if (popupElement) {
                const popupHeight = popupElement.offsetHeight;
                // Ajustar a posição do mapa para centralizar o popup
                map.panBy([0, -popupHeight/4], {
                    animate: true,
                    duration: 0.3
                });
            }
        }, 100);
    }, 100);
}

//=============================================================================
// 🏛️ BASE DE DADOS HISTÓRICOS
//=============================================================================

/**
 * PONTOS HISTÓRICOS DO CENTRO DO RIO
 * Array com todos os locais históricos, suas coordenadas e informações
 */
const pontosHistoricos = [
    {
        id: 1,
        nome: "Museu Nacional de Belas Artes",
        categoria: "museum",
        coords: [-22.908728, -43.175951],
        periodo: "1937",
        descricao: "Principal museu de artes visuais do país, abriga a maior coleção de arte brasileira do século XIX e início do XX.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "🎨 Possui mais de 20.000 obras, incluindo a famosa 'Primeira Missa no Brasil' de Victor Meirelles",
            "🏛️ Prédio projetado pelo arquiteto francês Grandjean de Montigny",
            "👑 Muitas obras vieram da coleção particular de D. João VI"
        ]
    },
    {
        id: 2,
        nome: "Subsolo da Praça dos Expedicionários",
        categoria: "bunker",
        coords: [-22.90664, -43.17225],
        periodo: "1942 e 1943",
        descricao: "O subsolo da Praça dos Expedicionários, localizada no Centro do Rio de Janeiro, abriga um dos antigos abrigos antiaéreos construídos durante a Segunda Guerra Mundial. Esses espaços subterrâneos foram projetados para proteger a população civil em caso de bombardeios, em uma época em que o Brasil, aliado aos Estados Unidos, entrou no conflito após ataques de submarinos alemães na costa brasileira.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "🚨 Função preventiva – Apesar de terem sido construídos, os abrigos nunca chegaram a ser usados para ataques reais, já que o Rio de Janeiro não sofreu bombardeios durante a guerra.",
            "🏗️ Estrutura resistente – O abrigo da Praça dos Expedicionários foi projetado em concreto armado, com entradas e saídas estratégicas, ventilação e capacidade para abrigar centenas de pessoas em caso de emergência.",
            "👥 Memória pouco conhecida – Muitos cariocas passam pela praça sem imaginar que, sob seus pés, existe um espaço ligado diretamente à história da Segunda Guerra e à preparação do Brasil para um possível ataque aéreo."
        ]
    },
    {
        id: 3,
        nome: "Igreja da Candelária",
        categoria: "church",
        coords: [-22.900849, -43.177794],
        periodo: "1609",
        descricao: "Uma das igrejas mais importantes do Rio, construída em honra de Nossa Senhora da Candelária, padroeira dos navegadores.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "⛪ Construção levou mais de 250 anos para ser concluída",
            "🎨 Interior decorado com mármores de Carrara e pinturas de João Zeferino da Costa",
            "🕊️ Local da famosa 'Chacina da Candelária' em 1993"
        ]
    },
    {
        id: 4,
        nome: "Theatro Municipal",
        categoria: "culture",
        coords: [-22.908992, -43.176677],
        periodo: "1909",
        descricao: "Principal casa de espetáculos do Rio, inspirado na Ópera de Paris, é um símbolo da Belle Époque carioca.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "🎭 Inaugurado em 1909, inspirado na Ópera de Paris",
            "🎨 Decoração interna com pinturas de Eliseu Visconti",
            "🎵 Palco de grandes artistas como Caruso, Nijinsky e Isadora Duncan"
        ]
    },
    {
        id: 5,
        nome: "Arcos da Lapa",
        categoria: "monument",
        coords: [-22.913034, -43.179956],
        periodo: "1750",
        descricao: "Aqueduto colonial que se tornou símbolo do Rio de Janeiro, hoje serve como viaduto para o bondinho de Santa Teresa.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "🚰 Originalmente um aqueduto que trazia água para o centro",
            "🚋 Desde 1896 serve como viaduto para os bondes de Santa Teresa",
            "🎨 Cenário de inúmeros filmes e cartões-postais do Rio"
        ]
    },
    {
        id: 6,
        nome: "Paço Imperial",
        categoria: "palace",
        coords: [-22.903589, -43.174169],
        periodo: "1743",
        descricao: "Antigo palácio dos governadores coloniais e depois residência da família real portuguesa no Brasil.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "👑 Residência de D. João VI quando chegou ao Brasil em 1808",
            "📜 Local onde foi assinada a Lei Áurea em 1888",
            "🎨 Hoje funciona como centro cultural com exposições"
        ]
    },
    {
        id: 7,
        nome: "Mosteiro de São Bento",
        categoria: "church",
        coords: [-22.897070, -43.177943],
        periodo: "1590",
        descricao: "Um dos mais antigos mosteiros do Brasil, fundado pelos monges beneditinos, guardião de tesouros artísticos coloniais.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "🎵 Mantém a tradição dos cantos gregorianos há mais de 400 anos",
            "🏗️ Interior é um dos mais ricos exemplos do barroco brasileiro",
            "📚 Possui uma das mais antigas bibliotecas do Brasil"
        ]
    },
    {
        id: 8,
        nome: "Casa França-Brasil",
        categoria: "culture",
        coords: [-22.900557, -43.175937],
        periodo: "1820",
        descricao: "Antigo mercado colonial transformado em centro cultural, exemplo da arquitetura neoclássica no Brasil.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "🏛️ Projeto do arquiteto francês Grandjean de Montigny",
            "🛒 Era o antigo mercado da cidade no século XIX",
            "🎨 Hoje abriga exposições de arte contemporânea"
        ]
    },
    {
        id: 9,
        nome: "Forte de Copacabana",
        categoria: "monument",
        coords: [-22.986439, -43.187200],
        periodo: "1914",
        descricao: "Fortificação militar construída para defender a entrada da Baía de Guanabara, palco da revolta dos 18 do Forte.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "⚔️ Palco da histórica 'Revolta dos 18 do Forte' em 1922",
            "🔫 Possui canhões Krupp de 1906 ainda preservados",
            "🌊 Oferece uma das vistas mais espetaculares de Copacabana"
        ]
    },
    {
        id: 10,
        nome: "Real Gabinete Português de Leitura",
        categoria: "culture",
        coords: [-22.905354, -43.182213],
        periodo: "1887",
        descricao: "Biblioteca com a maior coleção de literatura portuguesa fora de Portugal, em edifício de arquitetura neomanuelina.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "📚 Maior acervo de literatura portuguesa fora de Portugal",
            "🏰 Arquitetura neomanuelina única no Rio de Janeiro",
            "📖 Possui mais de 350.000 volumes raros"
        ]
    },
    {
        id: 11,
        nome: "Centro Cultural Banco do Brasil",
        categoria: "culture",
        coords: [-22.901052, -43.176287],
        periodo: "1906",
        descricao: "Antigo edifício do Banco do Brasil transformado em um dos principais centros culturais do país.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "🏛️ Arquitetura eclética do início do século XX",
            "🎨 Um dos centros culturais mais visitados do Brasil",
            "💰 Era a sede do Banco do Brasil até os anos 1960"
        ]
    },
    {
        id: 12,
        nome: "Confeitaria Colombo",
        categoria: "culture",
        coords: [-22.90087, -43.17652],
        periodo: "1894",
        descricao: "Histórica confeitaria que preserva a Belle Époque carioca, frequentada pela elite da época.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "☕ Frequentada por escritores como Machado de Assis",
            "🪞 Espelhos belgas e móveis importados da Europa",
            "🍰 Receitas tradicionais preservadas há mais de 100 anos"
        ]
    },
    {
        id: 13,
        nome: "Biblioteca Nacional",
        categoria: "library",
        coords: [-22.909703, -43.175377],
        periodo: "1810",
        descricao: "Maior biblioteca da América Latina, criada por D. João VI. Possui um dos maiores acervos bibliográficos do mundo.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "📚 Mais de 15 milhões de itens no acervo",
            "👑 Origem no acervo real trazido pela família real portuguesa",
            "🏛️ Edifício atual inaugurado em 1910, projeto eclético de Francisco Marcelino de Souza Aguiar"
        ]
    },
    {
        id: 14,
        nome: "Arquivo Nacional",
        categoria: "library",
        coords: [-22.906500, -43.190767],
        periodo: "1838",
        descricao: "Importante instituição que preserva a memória documental do Brasil, com documentos desde o período colonial.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "📜 Maior arquivo público da América Latina",
            "⚖️ Guarda documentos fundamentais da história do Brasil",
            "🏛️ Localizado no antigo prédio da Casa da Moeda"
        ]
    },
    {
        id: 15,
        nome: "Palácio Tiradentes",
        categoria: "palace",
        coords: [-22.903901, -43.173876],
        periodo: "1926",
        descricao: "Antiga sede da Câmara dos Deputados e da Assembleia Legislativa do Estado do Rio de Janeiro, hoje abriga o poder legislativo estadual.",
        curiosidades: [
            "🏛️ Construído no local onde Tiradentes foi enforcado em 1792",
            "⚖️ Sede da Câmara dos Deputados de 1926 a 1960",
            "🎨 Belíssimo hall com vitrais e escadaria em mármore"
        ],
        linhaTempo: [
            {
                ano: "1792",
                titulo: "Execução de Tiradentes",
                descricao: "Local onde Joaquim José da Silva Xavier foi enforcado",
                imagem: "https://via.placeholder.com/300x200/8B0000/FFFFFF?text=Execução+Tiradentes+1792"
            },
            {
                ano: "1926",
                titulo: "Construção do Palácio",
                descricao: "Inauguração como sede da Câmara dos Deputados",
                imagem: "https://via.placeholder.com/300x200/4169E1/FFFFFF?text=Inauguração+Palácio+1926"
            },
            {
                ano: "1960",
                titulo: "Mudança da Capital",
                descricao: "Brasília torna-se capital, palácio muda função",
                imagem: "https://via.placeholder.com/300x200/FFD700/000000?text=Mudança+Capital+1960"
            },
            {
                ano: "2024",
                titulo: "Atualidade",
                descricao: "Sede da Assembleia Legislativa do Estado do Rio",
                imagem: "https://via.placeholder.com/300x200/32CD32/FFFFFF?text=ALERJ+Atual+2024"
            }
        ],
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ]
    },
    {
        id: 16,
        nome: "Palácio Duque de Caxias",
        categoria: "palace",
        coords: [-22.902824, -43.189016],
        periodo: "1941",
        descricao: "Antigo Ministério da Guerra, hoje Comando Militar do Leste. Importante edifício da arquitetura oficial brasileira.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "⚔️ Era a sede do Ministério da Guerra até 1999",
            "🏛️ Arquitetura art déco dos anos 1940",
            "🎖️ Nome homenageia o Duque de Caxias, patrono do Exército"
        ]
    },
    {
        id: 17,
        nome: "Igreja de São Francisco da Penitência",
        categoria: "church",
        coords: [-22.906899, -43.179261],
        periodo: "1773",
        descricao: "Igreja famosa por seu interior completamente revestido em ouro, considerada uma das mais belas do Brasil colonial.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "✨ Interior completamente folheado a ouro",
            "🎨 Pinturas no teto de Caetano da Costa Coelho",
            "⛪ Construída pela Ordem Terceira de São Francisco"
        ]
    },
    {
        id: 18,
        nome: "Igreja do Carmo da Antiga Sé",
        categoria: "church",
        coords: [-22.90329, -43.17543],
        periodo: "1761",
        descricao: "Antiga catedral do Rio de Janeiro onde D. Pedro I foi coroado imperador do Brasil em 1822.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "👑 Local da coroação de D. Pedro I como imperador em 1822",
            "💒 Casamento de D. Pedro I com D. Leopoldina em 1817",
            "⛪ Foi a catedral do Rio até 1976"
        ]
    },
    {
        id: 24,
        nome: "Centro Cultural PGE-RJ (Antigo Convento do Carmo)",
        categoria: "culture",
        coords: [-22.90366, -43.17567],
        periodo: "Século XVII",
        descricao: "O Centro Cultural PGE-RJ está situado no histórico e restaurado antigo Convento do Carmo, um edifício do século XVII que foi residência de D. Maria I e é uma das mais antigas construções do Rio de Janeiro.",
        curiosidades: [
            "🏰 Antigo Convento do Carmo, uma das construções mais antigas do Rio de Janeiro",
            "👑 Serviu como residência da rainha D. Maria I durante a vinda da Família Real",
            "🎨 Abriga a exposição 'Composição Carioca' e outros espaços culturais",
            "📚 Possui quatro bibliotecas, cinco salas de aula e uma sala de debate",
            "🍽️ Conta com bistrô e tours guiados pelo edifício histórico",
            "🎭 Promove arte brasileira e democratiza o acesso à cultura",
            "🏛️ Restaurado pela PGE-RJ para valorizar o patrimônio histórico"
        ],
        linhaTempo: [
            {
                ano: "1761",
                titulo: "Construção Original",
                descricao: "Convento do Carmo é fundado pelos frades carmelitas",
                imagem: "https://via.placeholder.com/300x200/8B4513/FFFFFF?text=Convento+Original+1761"
            },
            {
                ano: "1808",
                titulo: "Residência Real",
                descricao: "Serviu como residência da rainha D. Maria I",
                imagem: "https://via.placeholder.com/300x200/4169E1/FFFFFF?text=Residência+Real+1808"
            },
            {
                ano: "1950",
                titulo: "Século XX",
                descricao: "Período de declínio e necessidade de restauração",
                imagem: "https://via.placeholder.com/300x200/696969/FFFFFF?text=Período+Declínio+1950"
            },
            {
                ano: "2010",
                titulo: "Centro Cultural",
                descricao: "Restaurado e transformado em centro cultural pela PGE-RJ",
                imagem: "https://via.placeholder.com/300x200/32CD32/FFFFFF?text=Centro+Cultural+2010"
            }
        ],
        galeria: [
            "https://i.imgur.com/vguYQN3.jpeg",
            "https://i.imgur.com/oiSL0zO.jpeg",
            "https://i.imgur.com/HcgtYAb.jpeg"
        ]
    },
    {
        id: 19,
        nome: "Museu de Arte do Rio (MAR)",
        categoria: "museum",
        coords: [-22.89658, -43.18196],
        periodo: "2013",
        descricao: "Museu dedicado à arte, cultura e história do Rio de Janeiro, localizado na revitalizada Praça Mauá.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "🎨 Integra dois edifícios: o Palacete Dom João VI e a Escola do Olhar",
            "🌊 Foca na arte e cultura carioca em diálogo com o mundo",
            "🏗️ Parte do projeto de revitalização da zona portuária"
        ]
    },
    {
        id: 20,
        nome: "Museu do Amanhã",
        categoria: "museum",
        coords: [-22.89385, -43.17941],
        periodo: "2015",
        descricao: "Museu de ciências aplicadas que explora as possibilidades de construção do futuro a partir das escolhas de hoje.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "🚀 Projeto arquitetônico futurista de Santiago Calatrava",
            "🌱 Foco em sustentabilidade e futuro da humanidade",
            "💧 Estrutura que coleta água da chuva e usa energia solar"
        ]
    },
    {
        id: 21,
        nome: "Museu Histórico Nacional",
        categoria: "museum",
        coords: [-22.90553, -43.16967],
        periodo: "1922",
        descricao: "Um dos museus mais completos sobre a história do Brasil, instalado no antigo Arsenal de Guerra e Forte de Santiago.",
        galeria: [
            "https://i.imgur.com/vguYQN3.jpeg",
            "https://i.imgur.com/oiSL0zO.jpeg",
            "https://i.imgur.com/HcgtYAb.jpeg"
        ],
        curiosidades: [
            "🏰 Localizado no antigo Arsenal de Guerra da Ponta do Calabouço",
            "⚔️ Maior acervo de história do Brasil",
            "🎭 Criado em 1922 para as comemorações do centenário da Independência"
        ]
    },
    {
        id: 22,
        nome: "Praça XV",
        categoria: "square",
        coords: [-22.90270, -43.17331],
        periodo: "1743",
        descricao: "Marco histórico da cidade, palco de importantes eventos da história brasileira, próxima ao Paço Imperial.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "👑 Local de desembarque da família real portuguesa em 1808",
            "🎪 Palco da Proclamação da República em 1889",
            "⛲ Chafariz do Mestre Valentim, uma das primeiras obras de arte pública do Brasil"
        ]
    },
    {
        id: 23,
        nome: "Ilha Fiscal",
        categoria: "square",
        coords: [-22.89615, -43.16694],
        periodo: "1889",
        descricao: "Pequena ilha na Baía de Guanabara, famosa pelo último grande baile do Império brasileiro em 1889.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "💃 Palco do famoso 'Baile da Ilha Fiscal' em 9 de novembro de 1889",
            "👑 Último grande evento social do Império, dias antes da Proclamação da República",
            "🏰 Construção em estilo neogótico, projeto de Adolfo del Vecchio"
        ]
    }
];

// ===== CONFIGURAÇÃO DO MAPA =====
let map;
let marcadores = [];
let filtroAtivo = 'all';

// Cores por categoria
const coresCategorias = {
    museum: '#3498db',
    bunker: '#e74c3c',
    monument: '#f39c12',
    church: '#9b59b6',
    palace: '#1abc9c',
    culture: '#e67e22',
    fort: '#27ae60',
    library: '#9932CC',
    square: '#20B2AA'
};

// Curiosidades por categoria
const curiosidadesCategorias = {
    all: {
        titulo: "Centro Histórico do Rio de Janeiro",
        curiosidade: "O centro histórico do Rio possui mais de 400 anos de história e é considerado Patrimônio Cultural da Humanidade pela UNESCO! Aqui você encontrará desde construções coloniais do século XVI até arquitetura moderna do século XXI."
    },
    museum: {
        titulo: "Museus do Rio",
        curiosidade: "O Rio possui mais de 80 museus! Desde o Museu Nacional de Belas Artes com sua coleção imperial até museus ultra-modernos como o Museu do Amanhã, a cidade oferece um verdadeiro tesouro cultural."
    },
    bunker: {
        titulo: "Bunkers da Segunda Guerra",
        curiosidade: "Durante a Segunda Guerra Mundial, o Rio construiu diversos abrigos antiaéreos após os ataques alemães aos navios brasileiros. Estes bunkers podiam proteger centenas de pessoas e possuem paredes de concreto de até 2 metros de espessura!"
    },
    monument: {
        titulo: "Monumentos Históricos",
        curiosidade: "Os monumentos do centro do Rio contam a história de mais de 4 séculos! Dos aquedutos coloniais aos marcos republicanos, cada estrutura representa um período único da história brasileira."
    },
    church: {
        titulo: "Igrejas Históricas",
        curiosidade: "O Rio possui algumas das igrejas mais antigas e ricas do Brasil! A Igreja de São Francisco da Penitência tem seu interior completamente folheado a ouro, enquanto a Igreja do Carmo foi palco da coroação de D. Pedro I."
    },
    palace: {
        titulo: "Palácios",
        curiosidade: "Os palácios do centro guardam memórias da época imperial! O Paço Imperial foi residência da família real portuguesa e testemunhou eventos históricos como a assinatura da Lei Áurea em 1888."
    },
    culture: {
        titulo: "Espaços Culturais",
        curiosidade: "O centro do Rio é um dos maiores pólos culturais da América Latina! Do histórico Theatro Municipal inspirado na Ópera de Paris até centros culturais modernos, a região oferece arte e cultura para todos os gostos."
    },
    library: {
        titulo: "Bibliotecas e Arquivos",
        curiosidade: "O Rio abriga a maior biblioteca da América Latina! A Biblioteca Nacional possui mais de 15 milhões de itens, incluindo manuscritos raros trazidos pela família real portuguesa em 1808."
    },
    square: {
        titulo: "Praças e Espaços Públicos",
        curiosidade: "As praças do centro são palcos da história brasileira! A Praça XV testemunhou a chegada da família real em 1808 e a Proclamação da República em 1889. Já a Ilha Fiscal foi cenário do último grande baile do Império!"
    }
};

// ===== INICIALIZAR MAPA =====
function initMap() {
    // Criar mapa centrado no centro do Rio
    map = L.map('map', {
        inertia: false,
        bounceAtZoomLimits: false
    }).setView([-22.9068, -43.1729], 15);

    // Adicionar camada de satélite (Esri)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19
    }).addTo(map);

    // Criar marcadores
    criarMarcadores();

    // Esconder loading e garantir recálculo de tamanho do mapa
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
        // Garante que o Leaflet calcule o tamanho correto após animações/layout
        setTimeout(() => {
            if (map && typeof map.invalidateSize === 'function') {
                map.invalidateSize();
            }
        }, 150);
    }, 800);
}

// ===== CRIAR MARCADORES =====
function criarMarcadores() {
    pontosHistoricos.forEach(ponto => {
        // Criar ícone personalizado com estrutura melhorada
        // Usando dois divs aninhados: o externo para animações e o interno para conteúdo
        const iconHtml = `
            <div class="marcador-container" data-id="${ponto.id}" data-categoria="${ponto.categoria}">
                <div class="marcador-conteudo" style="
                    background-color: ${coresCategorias[ponto.categoria] || '#FFD700'};
                    width: 25px;
                    height: 25px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 12px;
                ">${ponto.id}</div>
            </div>
        `;

        const marcador = L.marker(ponto.coords, {
            icon: L.divIcon({
                className: 'marcador-personalizado',
                html: iconHtml,
                iconSize: [35, 35], // Aumentado para acomodar o contêiner
                iconAnchor: [17, 17]
            })
        }).addTo(map);

        // Popup com informações completas - contraste garantido usando !important no CSS
        let popupContent = `
            <div class="popup-container">
                <h3 class="popup-title">${ponto.nome}</h3>
                <p class="popup-subtitle">📅 ${ponto.periodo}</p>`;
        
        // Adicionar galeria de imagens se existir
        if (ponto.galeria && ponto.galeria.length > 0) {
            popupContent += `
                <div class="popup-galeria">
                    ${gerarGaleriaImagens(ponto.galeria)}
                </div>`;
        }
        
        popupContent += `
                <p class="popup-description">${ponto.descricao}</p>
                <button onclick="mostrarDetalhes(${ponto.id})" class="popup-button">
                    📖 Ver Detalhes Completos
                </button>
                <button onclick="abrirStreetView(${ponto.coords[0]}, ${ponto.coords[1]}, '${ponto.nome.replace(/'/g, "\\'")}')" class="popup-button popup-button-streetview">
                    <i class="fas fa-street-view"></i> Ver em 360° Street View
                </button>
            </div>
        `;
        
        // Configuração avançada do popup para centralização e posicionamento ideal
        const popupOptions = {
            maxWidth: 320,              // Largura máxima para controlar o tamanho
            minWidth: 280,              // Largura mínima para garantir legibilidade
            autoPan: false,             // Desabilitar auto-centralizar no mapa para popup livre
            closeOnClick: false,        // Não fechar popup ao clicar no mapa
            keepInView: false,          // Permitir popup fora da view do mapa
            className: 'popup-centralizado popup-arrastavel' // Classe para estilização específica e arrastar
        };
        
        marcador.bindPopup(popupContent, popupOptions);
        
        // Evento para inicializar a galeria quando o popup for aberto
        marcador.on('popupopen', function() {
            inicializarGaleriaImagens();
            
            // Tornar o popup arrastável
            const popupElement = document.querySelector('.leaflet-popup');
            const contentWrapper = popupElement.querySelector('.leaflet-popup-content-wrapper');
            
            if (popupElement && contentWrapper) {
                // Definir posição absoluta para permitir arrastar
                popupElement.style.position = 'absolute';
                // Garantir z-index alto para que o popup (e seu botão de fechar) fiquem acima do header e outros elementos
                popupElement.style.zIndex = '2200';
                // Permitir que conteúdos como o botão de fechar possam transbordar sem serem cortados
                popupElement.style.overflow = 'visible';
                
                let isDragging = false;
                let startX, startY, initialLeft, initialTop;
                
                // Função para iniciar arrastar
                const startDrag = (e) => {
                    isDragging = true;
                    startX = e.clientX;
                    startY = e.clientY;
                    const rect = popupElement.getBoundingClientRect();
                    initialLeft = rect.left;
                    initialTop = rect.top;
                    e.preventDefault(); // Prevenir seleção de texto
                };
                
                // Função para mover
                const drag = (e) => {
                    if (!isDragging) return;
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    popupElement.style.left = (initialLeft + dx) + 'px';
                    popupElement.style.top = (initialTop + dy) + 'px';
                };
                
                // Função para parar arrastar
                const stopDrag = () => {
                    isDragging = false;
                };
                
                // Adicionar event listeners
                contentWrapper.addEventListener('mousedown', startDrag);
                document.addEventListener('mousemove', drag);
                document.addEventListener('mouseup', stopDrag);
                
                // Cursor para indicar arrastável
                contentWrapper.style.cursor = 'move';
            }
        });

        // Evento de clique usando a função centralizada
        marcador.on('click', () => {
            // Usar nossa função de centralização e abertura de popup
            centrarEAbrirPopup(ponto.coords, marcador, 17);
            
            // Mostra os detalhes na barra lateral
            mostrarDetalhes(ponto.id);
        });

        // Armazenar marcador
        marcador.pontoData = ponto;
        marcadores.push(marcador);
    });
}

// ===== GERAR GALERIA DE IMAGENS =====
function gerarGaleriaImagens(galeria) {
    if (!galeria || galeria.length === 0) return '';
    
    return `
        <div class="imagens-galeria-container">
            <div class="imagens-galeria-scroll" id="galeria-scroll">
                ${galeria.map((imagem, index) => `
                    <div class="imagem-item" style="--index: ${index}; position: relative; left: 0;">
                        <img src="${imagem}" alt="Imagem histórica ${index + 1}" class="imagem-galeria" loading="eager" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200/CCCCCC/333333?text=Imagem+${index+1}';">
                    </div>
                `).join('')}
            </div>
            <div class="galeria-controles">
                ${galeria.map((_, index) => `
                    <span class="galeria-indicador" data-index="${index}" onclick="mudarImagemGaleria(this, ${index})"></span>
                `).join('')}
            </div>
        </div>
    `;
}

// ===== GERAR GALERIA DA LINHA DO TEMPO =====
function gerarGaleriaLinhaTempo(linhaTempo) {
    if (!linhaTempo || linhaTempo.length === 0) return '';
    
    return `
        <div class="timeline-gallery">
            <h4 class="timeline-title">
                <i class="fas fa-history"></i>
                Linha do Tempo
            </h4>
            <div class="timeline-container">
                ${linhaTempo.map((periodo, index) => `
                    <div class="timeline-item" data-index="${index}">
                        <div class="timeline-image">
                            <img src="${periodo.imagem}" 
                                 alt="${periodo.titulo}" 
                                 onclick="abrirImagemGaleria(${index}, ${JSON.stringify(linhaTempo).replace(/"/g, '&quot;')})"
                                 style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; cursor: pointer; transition: transform 0.3s ease;">
                        </div>
                        <div class="timeline-content">
                            <span class="timeline-year">${periodo.ano}</span>
                            <h5 class="timeline-period-title">${periodo.titulo}</h5>
                            <p class="timeline-description">${periodo.descricao}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ===== ABRIR IMAGEM DA GALERIA =====
function abrirImagemGaleria(index, linhaTempo) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="fecharImagemGaleria()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="fecharImagemGaleria()">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-gallery">
                <div class="gallery-navigation">
                    <button class="nav-btn prev" onclick="navegarGaleria(-1)" ${index === 0 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="nav-btn next" onclick="navegarGaleria(1)" ${index === linhaTempo.length - 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div class="gallery-image">
                    <img src="${linhaTempo[index].imagem}" alt="${linhaTempo[index].titulo}">
                </div>
                <div class="gallery-info">
                    <h3>${linhaTempo[index].ano} - ${linhaTempo[index].titulo}</h3>
                    <p>${linhaTempo[index].descricao}</p>
                </div>
                <div class="gallery-thumbnails">
                    ${linhaTempo.map((periodo, i) => `
                        <img src="${periodo.imagem}" 
                             alt="${periodo.titulo}"
                             class="thumbnail ${i === index ? 'active' : ''}"
                             onclick="navegarParaImagem(${i})">
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.galeriaAtual = linhaTempo;
    modal.indiceAtual = index;
    
    // Animate in
    setTimeout(() => modal.classList.add('active'), 10);
}

// ===== NAVEGAÇÃO DA GALERIA =====
function navegarGaleria(direcao) {
    const modal = document.querySelector('.image-modal');
    if (!modal) return;
    
    const novoIndice = modal.indiceAtual + direcao;
    if (novoIndice >= 0 && novoIndice < modal.galeriaAtual.length) {
        navegarParaImagem(novoIndice);
    }
}

function navegarParaImagem(indice) {
    const modal = document.querySelector('.image-modal');
    if (!modal) return;
    
    modal.indiceAtual = indice;
    const periodo = modal.galeriaAtual[indice];
    
    // Atualizar imagem
    const img = modal.querySelector('.gallery-image img');
    img.src = periodo.imagem;
    img.alt = periodo.titulo;
    
    // Atualizar informações
    const info = modal.querySelector('.gallery-info');
    info.innerHTML = `
        <h3>${periodo.ano} - ${periodo.titulo}</h3>
        <p>${periodo.descricao}</p>
    `;
    
    // Atualizar thumbnails
    modal.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === indice);
    });
    
    // Atualizar botões de navegação
    const prevBtn = modal.querySelector('.nav-btn.prev');
    const nextBtn = modal.querySelector('.nav-btn.next');
    prevBtn.disabled = indice === 0;
    nextBtn.disabled = indice === modal.galeriaAtual.length - 1;
}

// ===== FECHAR GALERIA =====
function fecharImagemGaleria() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// ===== MOSTRAR DETALHES =====
function mostrarDetalhes(id) {
    const ponto = pontosHistoricos.find(p => p.id === id);
    if (!ponto) return;

    // Encontrar o marcador correspondente para abrir o popup centralizado
    const marcador = marcadores.find(m => m.pontoData && m.pontoData.id === id);
    if (marcador) {
        // Usar nossa função de centralização
        centrarEAbrirPopup(ponto.coords, marcador, 17);
    } else {
        // Fallback para o comportamento anterior se não encontrar o marcador
        map.setView(ponto.coords, 17);
    }

    // Mostrar informações na sidebar
    const infoSection = document.getElementById('infoSection');
    infoSection.style.display = 'block';
    
    // Verificar se o ponto tem linha do tempo e galeria
    const temLinhaTempo = ponto.linhaTempo && ponto.linhaTempo.length > 0;
    const temGaleria = ponto.galeria && ponto.galeria.length > 0;
    
    infoSection.innerHTML = `
        <div class="info-panel">
            <h3 class="info-title">${ponto.nome}</h3>
            <p class="info-subtitle">📅 ${ponto.periodo}</p>
            
            ${temGaleria ? gerarGaleriaImagens(ponto.galeria) : ''}
            
            <p class="info-description">${ponto.descricao}</p>
            
            ${temLinhaTempo ? gerarGaleriaLinhaTempo(ponto.linhaTempo) : ''}
            
            <div class="curiosities-grid">
                ${ponto.curiosidades.map(curiosidade => `
                    <div class="curiosity-item">
                        <p class="curiosity-text">${curiosidade}</p>
                    </div>
                `).join('')}
            </div>
            
            <button class="back-btn" onclick="voltarInicio()">
                <i class="fas fa-arrow-left"></i>
                Voltar
            </button>
        </div>
    `;
    
    // Inicializar a galeria de imagens se existir
    if (temGaleria) {
        inicializarGaleriaImagens();
    }
    
    // Rolar sidebar para a seção de informações
    setTimeout(() => {
        scrollToInfoSection();
    }, 300);
}

// ===== FUNÇÕES DE NAVEGAÇÃO =====
function voltarInicio() {
    map.setView([-22.9068, -43.1729], 15);
    
    // Hide info panel
    const infoSection = document.getElementById('infoSection');
    infoSection.style.display = 'none';
    infoSection.innerHTML = '';
    
    // Reset filters
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn').classList.add('active');
    filtroAtivo = 'all';
    aplicarFiltros();
}

// ===== FUNÇÃO AUXILIAR PARA NAVEGAÇÃO INTELIGENTE =====
function focarEmPonto(nomePonto) {
    const ponto = pontosHistoricos.find(p => p.nome === nomePonto);
    if (ponto) {
        // Centralizar mapa no ponto com zoom maior para destaque
        map.setView(ponto.coords, 18);
        
        // Piscar o marcador para destacar
        const marcador = marcadores.find(m => m.options.title === nomePonto);
        if (marcador) {
            // Animar o marcador com pulsação
            const icon = marcador.getElement();
            if (icon) {
                icon.style.animation = 'pulse 2s ease-in-out 3';
                setTimeout(() => {
                    icon.style.animation = '';
                }, 6000);
            }
        }
        
        // Abrir popup do marcador automaticamente
        setTimeout(() => {
            if (marcador) {
                marcador.openPopup();
            }
        }, 500);
    }
}

// ===== FUNÇÃO PARA DESTACAR VISUALMENTE PONTOS POR CATEGORIA =====
function destacarVisualmentePorCategoria(categoria) {
    const pontosDestacados = pontosHistoricos.filter(p => p.categoria === categoria);
    
    if (pontosDestacados.length > 0) {
        // Calcular coordenadas centrais dos pontos destacados
        const lats = pontosDestacados.map(p => p.coords[0]);
        const lngs = pontosDestacados.map(p => p.coords[1]);
        const centerLat = lats.reduce((a, b) => a + b) / lats.length;
        const centerLng = lngs.reduce((a, b) => a + b) / lngs.length;
        
        // Sem alterar a visualização do mapa para não desorientar o usuário
        // map.setView([centerLat, centerLng], 16); 
        
        // Destacar todos os marcadores da categoria sem remover outros e sem animação de escala
        marcadores.forEach(marcador => {
            // Verificar se o marcador pertence à categoria
            const ponto = marcador.pontoData;
            if (ponto && ponto.categoria === categoria) {
                const markerElement = marcador.getElement();
                
                if (markerElement) {
                    // Apenas aumentar z-index e aplicar efeito de sombra
                    markerElement.classList.add('highlighted-marker');
                    markerElement.style.zIndex = '1000';
                    
                    // Aplicar destaque visual com filtro CSS que não afeta o conteúdo interno
                    markerElement.style.filter = 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))';
                    
                    // Remover efeitos após um tempo
                    setTimeout(() => {
                        markerElement.classList.remove('highlighted-marker');
                        markerElement.style.filter = '';
                    }, 5000);
                }
            }
        });
    }
}

// ===== FUNÇÃO ORIGINAL PARA DESTACAR MÚLTIPLOS PONTOS POR CATEGORIA =====
function destacarPontosPorCategoria(categoria) {
    const pontosDestacados = pontosHistoricos.filter(p => p.categoria === categoria);
    
    if (pontosDestacados.length > 0) {
        // Calcular coordenadas centrais dos pontos destacados
        const lats = pontosDestacados.map(p => p.coords[0]);
        const lngs = pontosDestacados.map(p => p.coords[1]);
        const centerLat = lats.reduce((a, b) => a + b) / lats.length;
        const centerLng = lngs.reduce((a, b) => a + b) / lngs.length;
        
        // Centralizar no grupo de pontos
        map.setView([centerLat, centerLng], 16);
        
        // Garantir que todos os marcadores sejam visíveis primeiro - tanto CSS quanto adição ao mapa
        marcadores.forEach(marcador => {
            // Adicionar o marcador ao mapa se não estiver presente
            if (!map.hasLayer(marcador)) {
                marcador.addTo(map);
            }
            
            const icon = marcador.getElement();
            if (icon) {
                icon.style.visibility = 'visible';
                icon.style.opacity = '1';
                icon.style.display = 'block';
            }
        });
        
        // Piscar todos os marcadores da categoria
        marcadores.forEach(marcador => {
            const ponto = pontosHistoricos.find(p => p.nome === marcador.options.title);
            if (ponto && ponto.categoria === categoria) {
                const icon = marcador.getElement();
                if (icon) {
                    // Garantir que o marcador seja visível
                    icon.style.visibility = 'visible';
                    icon.style.opacity = '1';
                    icon.style.zIndex = '1000';
                    icon.style.animation = 'pulse 1.5s ease-in-out 4';
                    setTimeout(() => {
                        icon.style.animation = '';
                        // Manter visibilidade após animação
                        icon.style.visibility = 'visible';
                        icon.style.opacity = '1';
                    }, 6000);
                }
            }
        });
    }
}

function resetMap() {
    voltarInicio();
}

function resetView() {
    resetMap();
}

function toggleSidebar() {
    // Mobile functionality if needed
    console.log('Sidebar toggle - new design already responsive');
}

// ===== MOSTRAR CURIOSIDADE DA CATEGORIA =====
function mostrarCuriosidadeCategoria(categoria) {
    const info = curiosidadesCategorias[categoria];
    if (!info) return;

    const infoSection = document.getElementById('infoSection');
    infoSection.style.display = 'block';
    infoSection.innerHTML = `
        <div class="info-panel">
            <h3 class="info-title">${info.titulo}</h3>
            <p class="info-description">${info.curiosidade}</p>
            
            <div class="curiosity-item">
                <p class="curiosity-text">💡 Clique nos marcadores <span style="color: ${coresCategorias[categoria] || '#FFD700'};">●</span> para descobrir mais detalhes!</p>
            </div>
            
            <button class="back-btn" onclick="voltarInicio()">
                <i class="fas fa-arrow-left"></i>
                Voltar
            </button>
        </div>
    `;
}

// ===== FUNÇÃO PARA ROLAR PARA A SEÇÃO DE INFORMAÇÕES =====
function scrollToInfoSection() {
    const infoSection = document.getElementById('infoSection');
    const sidebar = document.querySelector('.sidebar');
    
    if (infoSection && sidebar) {
        // Adicionar um efeito visual de destaque
        infoSection.style.border = '2px solid #FFD700';
        infoSection.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
        infoSection.style.transition = 'all 0.5s ease';
        
        // Calcular a posição da seção de informações relativa ao topo da sidebar
        const sidebarRect = sidebar.getBoundingClientRect();
        const infoRect = infoSection.getBoundingClientRect();
        const scrollPosition = infoSection.offsetTop - 20; // 20px de margem
        
        // Fazer o scroll suave
        sidebar.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
        });
        
        // Remover o destaque após 3 segundos
        setTimeout(() => {
            infoSection.style.border = '';
            infoSection.style.boxShadow = '';
        }, 3000);
        
        // Mostrar uma mensagem visual para o usuário
        showNotification('📍 Conteúdo carregado no menu lateral!', 'success');
    }
}

// ===== FUNÇÃO PARA MOSTRAR NOTIFICAÇÕES =====
function showNotification(message, type = 'info') {
    // Remover notificação existente se houver
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
    `;
    
    // Estilos inline para garantir que apareça corretamente
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #333;
        padding: 6px 12px;
        border-radius: 6px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        font-weight: 500;
        border: 1px solid rgba(255,255,255,0.3);
        animation: slideInRight 0.3s ease-out;
        max-width: 220px;
        font-size: 11px;
        text-align: center;
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// ===== MOSTRAR HISTÓRIA DO RIO DE JANEIRO =====
function mostrarHistoriaRJ() {
    // Primeiro, garantir que todos os pontos estejam visíveis desde o início
    filtroAtivo = 'all';
    aplicarFiltros();
    
    // Remover classe active de todos os filtros
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    
    // Ativar o botão "Todos"
    const todosBtn = document.querySelector('.filter-btn');
    if (todosBtn) {
        todosBtn.classList.add('active');
        todosBtn.setAttribute('aria-pressed', 'true');
    }
    
    // Carregar conteúdo na sidebar primeiro
    const infoSection = document.getElementById('infoSection');
    infoSection.style.display = 'block';
    
    // Preencher o conteúdo HTML
    infoSection.innerHTML = `
        <div class="info-panel">
            <h3 class="info-title">🏛️ História do Rio de Janeiro</h3>
            <p class="info-subtitle">Dos povos indígenas à cidade maravilhosa</p>
            
            <!-- Vídeo Histórico -->
            <div style="margin-bottom: 20px; text-align: center;">
                <video controls style="width: 100%; max-width: 300px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,123,255,0.3);">
                    <source src="https://i.imgur.com/3SMRrOl.mp4" type="video/mp4">
                    Seu navegador não suporta o elemento de vídeo.
                </video>
            </div>
            
            <div style="background: linear-gradient(135deg, rgba(0,123,255,0.1), rgba(25,25,112,0.1)); border: 1px solid rgba(0,123,255,0.3); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                <h4 style="color: var(--primary-400); margin-bottom: 12px; font-size: 1.1rem; text-align: center;">🗓️ Linha do Tempo da História Carioca</h4>
            </div>
            
            <div class="curiosities-grid">
                <!-- Período Pré-Colonial -->
                <div class="curiosity-item">
                    <h4 style="color: var(--primary-400); margin-bottom: 10px; font-size: 1rem; cursor: pointer; text-decoration: underline;" onclick="mostrarPeriodoHistorico('precolonial')">🌿 Período Pré-Colonial (até 1565)</h4>
                    <div style="margin-left: 10px;">
                        <p class="curiosity-text">• <strong>Povos Tupinambás:</strong> Habitantes originais da região</p>
                        <p class="curiosity-text">• <strong>Chegada dos Portugueses (1502):</strong> Expedição de Gaspar de Lemos</p>
                        <p class="curiosity-text">• <strong>Invasões Francesas:</strong> França Antártica (1555-1567)</p>
                        <p class="curiosity-text">• <strong>Estácio de Sá (1565):</strong> Fundação da cidade</p>
                    </div>
                </div>
                
                <!-- Período Colonial -->
                <div class="curiosity-item">
                    <h4 style="color: var(--primary-400); margin-bottom: 10px; font-size: 1rem; cursor: pointer; text-decoration: underline;" onclick="mostrarPeriodoHistorico('colonial')">⛪ Período Colonial (1565-1808)</h4>
                    <div style="margin-left: 10px;">
                        <p class="curiosity-text">• <strong>São Sebastião do Rio de Janeiro:</strong> Nome oficial da cidade</p>
                        <p class="curiosity-text">• <strong>Porto do Açúcar:</strong> Principal porto exportador do Brasil</p>
                        <p class="curiosity-text">• <strong>Ouro de Minas:</strong> Rio como porta de entrada e saída</p>
                        <p class="curiosity-text">• <strong>Arquitetura Colonial:</strong> Igrejas, conventos e casarões</p>
                    </div>
                </div>
                
                <!-- Período Imperial -->
                <div class="curiosity-item">
                    <h4 style="color: var(--primary-400); margin-bottom: 10px; font-size: 1rem; cursor: pointer; text-decoration: underline;" onclick="mostrarPeriodoHistorico('imperial')">👑 Período Imperial (1808-1889)</h4>
                    <div style="margin-left: 10px;">
                        <p class="curiosity-text">• <strong>Chegada da Corte (1808):</strong> Rio vira capital do Império Português</p>
                        <p class="curiosity-text">• <strong>Independência (1822):</strong> Capital do Império do Brasil</p>
                        <p class="curiosity-text">• <strong>Reformas Urbanas:</strong> Modernização da cidade</p>
                        <p class="curiosity-text">• <strong>Abolição da Escravatura (1888):</strong> Assinada no Paço Imperial</p>
                    </div>
                </div>
                
                <!-- Período Republicano -->
                <div class="curiosity-item">
                    <h4 style="color: var(--primary-400); margin-bottom: 10px; font-size: 1rem; cursor: pointer; text-decoration: underline;" onclick="mostrarPeriodoHistorico('republicano')">🏛️ Período Republicano (1889-1960)</h4>
                    <div style="margin-left: 10px;">
                        <p class="curiosity-text">• <strong>Proclamação da República (1889):</strong> Fim do Império</p>
                        <p class="curiosity-text">• <strong>Reforma Pereira Passos (1902-1906):</strong> "Bota-abaixo" - modernização urbana</p>
                        <p class="curiosity-text">• <strong>Revolta da Vacina (1904):</strong> Resistência popular às reformas sanitárias</p>
                        <p class="curiosity-text">• <strong>Capital Federal:</strong> Sede do governo brasileiro</p>
                    </div>
                </div>
                
                <!-- Era Moderna -->
                <div class="curiosity-item">
                    <h4 style="color: var(--primary-400); margin-bottom: 10px; font-size: 1rem; cursor: pointer; text-decoration: underline;" onclick="mostrarPeriodoHistorico('moderno')">🌆 Era Moderna (1960-presente)</h4>
                    <div style="margin-left: 10px;">
                        <p class="curiosity-text">• <strong>Transferência da Capital (1960):</strong> Brasília torna-se capital</p>
                        <p class="curiosity-text">• <strong>Estado da Guanabara (1960-1975):</strong> Cidade-estado independente</p>
                        <p class="curiosity-text">• <strong>Fusão com o Estado do Rio (1975):</strong> Rio de Janeiro atual</p>
                        <p class="curiosity-text">• <strong>Patrimônio Mundial (2012):</strong> Paisagem Cultural Carioca - UNESCO</p>
                        <p class="curiosity-text">• <strong>Olimpíadas (2016):</strong> Primeira cidade sul-americana a sediar</p>
                    </div>
                </div>
                
                <!-- Curiosidades Gerais -->
                <div class="curiosity-item">
                    <h4 style="color: var(--primary-400); margin-bottom: 8px; font-size: 1rem;">🎭 Cultura e Tradições</h4>
                    <p class="curiosity-text">• <strong>Carnaval Carioca:</strong> Maior festa popular do mundo</p>
                    <p class="curiosity-text">• <strong>Samba:</strong> Nasceu nos morros cariocas no início do século XX</p>
                    <p class="curiosity-text">• <strong>Bossa Nova:</strong> Movimento musical nascido em Ipanema</p>
                    <p class="curiosity-text">• <strong>Cristo Redentor:</strong> Uma das 7 Maravilhas do Mundo Moderno</p>
                    <p class="curiosity-text">• <strong>Copacabana e Ipanema:</strong> Praias mundialmente famosas</p>
                </div>
                
                <!-- Locais Históricos no Mapa -->
                <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px; margin: 15px 0;">
                    <h4 style="color: var(--primary-400); margin-bottom: 10px; font-size: 1rem;">🗺️ Principais Locais Históricos no Mapa</h4>
                    <p style="color: var(--neutral-200); font-size: 0.85rem; line-height: 1.4;">
                        🏛️ <strong>Paço Imperial:</strong> Sede do poder colonial e imperial<br>
                        ⛪ <strong>Mosteiro de São Bento:</strong> Joia do barroco brasileiro<br>
                        🏛️ <strong>Palácio Tiradentes:</strong> Assembleia Legislativa<br>
                        📚 <strong>Biblioteca Nacional:</strong> Acervo da família real<br>
                        🎭 <strong>Teatro Municipal:</strong> Símbolo da Belle Époque carioca<br>
                        ⛪ <strong>Catedral Metropolitana:</strong> Arquitetura moderna única
                    </p>
                </div>
            </div>
            
            <button class="back-btn" onclick="voltarInicio()">
                <i class="fas fa-arrow-left"></i>
                Voltar
            </button>
        </div>
    `;
    
    // Só depois fazer as animações do mapa
    setTimeout(() => {
        // Mostrar uma visão ampla do centro do Rio de Janeiro
        // Coordenadas centralizadas e zoom ajustado para mostrar todos os pontos como na imagem
        const centroRio = [-22.905, -43.175];
        map.setView(centroRio, 14, { 
            animate: true, 
            duration: 1.0
        });
        
        // Destacar categorias em sequência, sem afetar a visibilidade geral
        setTimeout(() => {
            // Apenas destacar visualmente (pulsar) sem alterar a visibilidade ou focar em um ponto
            destacarVisualmentePorCategoria('church');
            
            setTimeout(() => {
                destacarVisualmentePorCategoria('monument');
            }, 2000);
            
            setTimeout(() => {
                destacarVisualmentePorCategoria('museum');
            }, 4000);
            
            // Após alguns segundos, destacar todos os marcadores brevemente
            setTimeout(() => {
                marcadores.forEach(marcador => {
                    const markerElement = marcador.getElement();
                    if (markerElement) {
                        // Usar apenas efeito de sombra sem animação de escala
                        markerElement.classList.add('highlighted-marker');
                        markerElement.style.filter = 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))';
                        
                        setTimeout(() => {
                            markerElement.classList.remove('highlighted-marker');
                            markerElement.style.filter = '';
                        }, 2000);
                    }
                });
            }, 6000);
        }, 1500);
        
        // Rolar sidebar para a seção de informações
        scrollToInfoSection();
    }, 300);
}

// ===== FUNÇÃO PARA DESTACAR LOCAIS IMPERIAIS =====
function destacarLocaisImperiais() {
    // Lista de locais relacionados à família imperial
    const locaisImperiais = ["Paço Imperial", "Quinta da Boa Vista", "Palácio Imperial", "Museu Nacional", "Palácio do Catete", "Igreja Nossa Senhora do Carmo"];
    
    // Destacar cada local imperial com efeito de sombra amarela
    marcadores.forEach(marcador => {
        const ponto = marcador.pontoData;
        if (ponto && locaisImperiais.includes(ponto.nome)) {
            const markerElement = marcador.getElement();
            if (markerElement) {
                // Aplicar classe de destaque com sombra amarela
                markerElement.classList.add('pulsing-marker');
                
                // Remover após 5 segundos
                setTimeout(() => {
                    markerElement.classList.remove('pulsing-marker');
                }, 5000);
            }
        }
    });
}

// ===== MOSTRAR FAMÍLIA IMPERIAL =====
function toggleImperialFamily() {
    // Primeiro, garantir que todos os pontos estejam visíveis
    filtroAtivo = 'all';
    aplicarFiltros();
    
    // Focar no Paço Imperial - centro da família real
    focarEmPonto("Paço Imperial");
    
    // Mostrar informações da família imperial
    mostrarFamiliaImperial();
    
    // Destacar os pontos relacionados com a família imperial com efeito de sombra amarela pulsante
    setTimeout(() => {
        destacarLocaisImperiais();
    }, 800);
    
    // Rolar sidebar para a seção de informações após carregar o conteúdo
    setTimeout(() => {
        scrollToInfoSection();
    }, 500);
}

function mostrarFamiliaImperial() {
    // Remover classe active de todos os filtros
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    
    // Mostrar todos os pontos
    filtroAtivo = 'all';
    aplicarFiltros();

    const infoSection = document.getElementById('infoSection');
    infoSection.style.display = 'block';
    infoSection.innerHTML = `
        <div class="info-panel">
            <h3 class="info-title">👑 Família Imperial Brasileira</h3>
            <p class="info-subtitle">Quem você quer conhecer?</p>
            
            <!-- Vídeo Histórico -->
            <div style="margin-bottom: 20px; text-align: center;">
                <video controls style="width: 100%; max-width: 300px; border-radius: 8px; box-shadow: 0 4px 15px rgba(255,215,0,0.3);">
                    <source src="https://i.imgur.com/JfbP540.mp4" type="video/mp4">
                    Seu navegador não suporta o elemento de vídeo.
                </video>
            </div>
            
            <div style="background: linear-gradient(135deg, rgba(255,215,0,0.1), rgba(184,134,11,0.1)); border: 1px solid rgba(255,215,0,0.3); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                <h4 style="color: var(--accent-400); margin-bottom: 12px; font-size: 1.1rem; text-align: center;">📜 Principais da Família Real e Imperial do Brasil</h4>
            </div>
            
            <div class="curiosities-grid">
                <!-- Reino Unido de Portugal, Brasil e Algarves -->
                <div class="curiosity-item">
                    <h4 style="color: var(--accent-400); margin-bottom: 10px; font-size: 1rem;">🔹 Reino Unido de Portugal, Brasil e Algarves (1808–1822)</h4>
                    <div style="margin-left: 10px;">
                        <p class="curiosity-text">
                            <strong style="cursor: pointer; color: var(--accent-400); text-decoration: underline;" onclick="mostrarDetalhesPersonagem('djoao6')">👑 D. João VI (1767–1826)</strong> – Rei de Portugal e depois do Reino Unido.
                        </p>
                        <p class="curiosity-text">
                            <strong style="cursor: pointer; color: var(--accent-400); text-decoration: underline;" onclick="mostrarDetalhesPersonagem('carlota')">👸 D. Carlota Joaquina (1775–1830)</strong> – Rainha consorte.
                        </p>
                        <p class="curiosity-text" style="margin-top: 8px;"><em>Filho mais importante:</em></p>
                        <p class="curiosity-text">
                            <strong style="cursor: pointer; color: var(--accent-400); text-decoration: underline;" onclick="mostrarDetalhesPersonagem('pedro1')">🤴 D. Pedro de Alcântara (1798–1834)</strong> → Futuro D. Pedro I.
                        </p>
                    </div>
                </div>
                
                <!-- Império do Brasil -->
                <div class="curiosity-item">
                    <h4 style="color: var(--accent-400); margin-bottom: 10px; font-size: 1rem;">🔹 Império do Brasil (1822–1889)</h4>
                    <div style="margin-left: 10px;">
                        <p class="curiosity-text">
                            <strong style="cursor: pointer; color: var(--accent-400); text-decoration: underline;" onclick="mostrarDetalhesPersonagem('pedro1')">👑 D. Pedro I (1798–1834)</strong> – Primeiro Imperador do Brasil, proclamou a Independência (1822).
                        </p>
                        <p class="curiosity-text">
                            <strong style="cursor: pointer; color: var(--accent-400); text-decoration: underline;" onclick="mostrarDetalhesPersonagem('leopoldina')">👸 D. Leopoldina da Áustria (1797–1826)</strong> – Imperatriz, apoiou a Independência.
                        </p>
                        <p class="curiosity-text" style="margin-top: 8px;"><em>Filho mais importante:</em></p>
                        <p class="curiosity-text">
                            <strong style="cursor: pointer; color: var(--accent-400); text-decoration: underline;" onclick="mostrarDetalhesPersonagem('pedro2')">🤴 D. Pedro II (1825–1891)</strong> – Segundo e último Imperador do Brasil.
                        </p>
                    </div>
                </div>
                
                <!-- Segundo Reinado -->
                <div class="curiosity-item">
                    <h4 style="color: var(--accent-400); margin-bottom: 10px; font-size: 1rem;">🔹 Segundo Reinado (1840–1889)</h4>
                    <div style="margin-left: 10px;">
                        <p class="curiosity-text">
                            <strong style="cursor: pointer; color: var(--accent-400); text-decoration: underline;" onclick="mostrarDetalhesPersonagem('pedro2')">👑 D. Pedro II (1825–1891)</strong> – Governou por quase 50 anos.
                        </p>
                        <p class="curiosity-text">
                            <strong style="cursor: pointer; color: var(--accent-400); text-decoration: underline;" onclick="mostrarDetalhesPersonagem('teresa')">👸 D. Teresa Cristina (1822–1889)</strong> – Imperatriz, chamada de "Mãe dos Brasileiros".
                        </p>
                        <p class="curiosity-text" style="margin-top: 8px;"><em>Filha mais importante:</em></p>
                        <p class="curiosity-text">
                            <strong style="cursor: pointer; color: var(--accent-400); text-decoration: underline;" onclick="mostrarDetalhesPersonagem('isabel')">👸 Princesa Isabel (1846–1921)</strong> – Herdeira do trono, assinou a Lei Áurea (1888).
                        </p>
                    </div>
                </div>
                
                <!-- Contexto Histórico -->
                <div class="curiosity-item">
                    <h4 style="color: var(--accent-400); margin-bottom: 8px; font-size: 1rem;">🏛️ Contexto Histórico</h4>
                    <p class="curiosity-text">A Família Imperial Brasileira governou o Império do Brasil entre 1822 e 1889, desde a Independência do Brasil pelo então Príncipe Real, Pedro Alcântara de Bragança, que depois foi aclamado imperador como Pedro I do Brasil, até a deposição de Pedro II durante a Proclamação da República, em 1889.</p>
                </div>
                
                <!-- Casa de Orléans e Bragança -->
                <div class="curiosity-item">
                    <h4 style="color: var(--accent-400); margin-bottom: 8px; font-size: 1rem;">🏰 Casa de Orléans e Bragança</h4>
                    <p class="curiosity-text">Após a Proclamação da República, em 1889, e o fim da monarquia, a família imperial deixou de existir enquanto instituição do Estado. A Casa de Orléans e Bragança é tida por parte dos monarquistas como a atual dinastia imperial brasileira, com dois ramos: o <strong>Ramo de Petrópolis</strong> e o <strong>Ramo de Vassouras</strong>.</p>
                </div>
            </div>
            
            <!-- Locais Imperiais no Mapa -->
            <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px; margin: 15px 0;">
                <h4 style="color: var(--accent-400); margin-bottom: 10px; font-size: 1rem;">🗺️ Locais Imperiais no Mapa</h4>
                <p style="color: var(--neutral-200); font-size: 0.85rem; line-height: 1.4;">
                    🏛️ <strong>Paço Imperial:</strong> Residência de D. João VI<br>
                    ⛪ <strong>Igreja do Carmo:</strong> Coroação de D. Pedro I<br>
                    🏛️ <strong>Palácio Tiradentes:</strong> Construído onde Tiradentes foi executado<br>
                    📖 <strong>Biblioteca Nacional:</strong> Acervo trazido pela família real
                </p>
            </div>
            
            <button class="back-btn" onclick="voltarInicio()">
                <i class="fas fa-arrow-left"></i>
                Voltar
            </button>
        </div>
    `;
}

// Função para mostrar detalhes específicos de cada período histórico do Rio de Janeiro
function mostrarPeriodoHistorico(periodo) {
    const infoSection = document.getElementById('infoSection');
    let detalhes = '';
    
    switch(periodo) {
        case 'precolonial':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Debret_-_Sauvages_civilisés%2C_soldats_indiens_de_première_ligne.jpg/300px-Debret_-_Sauvages_civilisés%2C_soldats_indiens_de_première_ligne.jpg" 
                             alt="Povos Tupinambás" 
                             style="width: 250px; height: 180px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,123,255,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">🌿 Período Pré-Colonial (até 1565)</h3>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🏹 Os Tupinambás</h4>
                        <p class="curiosity-text">Os Tupinambás eram os habitantes originais da região que hoje conhecemos como Rio de Janeiro. Viviam em aldeias ao longo da costa e tinham uma sociedade complexa e organizada.</p>
                        <p class="curiosity-text"><strong>Características:</strong> Praticavam agricultura, pesca e caça. Cultivavam mandioca, milho e batata-doce.</p>
                        <p class="curiosity-text"><strong>Organização:</strong> Viviam em ocas comunais, liderados por caciques e pajés.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">⛵ Chegada dos Portugueses (1502)</h4>
                        <p class="curiosity-text">Em 1º de janeiro de 1502, a expedição de Gaspar de Lemos avistou a entrada da Baía de Guanabara, pensando que fosse a foz de um rio. Por isso deram o nome de "Rio de Janeiro" (Rio de Janeiro).</p>
                        <p class="curiosity-text"><strong>Erro geográfico:</strong> Na verdade era uma baía, não um rio!</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🇫🇷 França Antártica (1555-1567)</h4>
                        <p class="curiosity-text">Os franceses, liderados por Nicolas Durand de Villegagnon, estabeleceram uma colônia na Ilha de Serigipe (atual Villegagnon) com o apoio dos Tupinambás.</p>
                        <p class="curiosity-text"><strong>Objetivo:</strong> Criar uma base francesa no Brasil e propagar o protestantismo.</p>
                        <p class="curiosity-text"><strong>Conflito:</strong> Portugueses lutaram para expulsar os franceses da região.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">⚔️ Fundação da Cidade (1565)</h4>
                        <p class="curiosity-text">Estácio de Sá, sobrinho do governador-geral Mem de Sá, fundou a cidade de São Sebastião do Rio de Janeiro em 1º de março de 1565, no Morro do Pão de Açúcar.</p>
                        <p class="curiosity-text"><strong>Nome:</strong> Homenagem ao rei D. Sebastião de Portugal.</p>
                        <p class="curiosity-text"><strong>Estratégia:</strong> Localização defensiva para expulsar os franceses.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarHistoriaRJ()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para História do Rio
                    </button>
                </div>
            `;
            break;
            
        case 'colonial':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Debret_-_Rio_de_Janeiro_vu_du_chemin_de_Sainte-Thérèse.jpg/300px-Debret_-_Rio_de_Janeiro_vu_du_chemin_de_Sainte-Thérèse.jpg" 
                             alt="Rio Colonial" 
                             style="width: 250px; height: 180px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,123,255,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">⛪ Período Colonial (1565-1808)</h3>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🏛️ Consolidação da Cidade</h4>
                        <p class="curiosity-text">Após a expulsão dos franceses, a cidade foi transferida para o atual centro histórico, numa planície mais adequada ao crescimento urbano.</p>
                        <p class="curiosity-text"><strong>Arquitetura:</strong> Construção de igrejas, conventos e casarões no estilo colonial português.</p>
                        <p class="curiosity-text"><strong>Traçado urbano:</strong> Ruas estreitas e irregulares, típicas das cidades coloniais.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🍃 Porto do Açúcar</h4>
                        <p class="curiosity-text">O Rio tornou-se o principal porto de exportação de açúcar do Brasil, trazendo grande prosperidade à cidade.</p>
                        <p class="curiosity-text"><strong>Economia:</strong> Baseada na plantation açucareira e no trabalho escravo.</p>
                        <p class="curiosity-text"><strong>Crescimento:</strong> A riqueza do açúcar financiou a construção de belos edifícios.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">⚱️ Era do Ouro (século XVIII)</h4>
                        <p class="curiosity-text">Com a descoberta de ouro em Minas Gerais, o Rio tornou-se a porta de entrada e saída das riquezas, aumentando ainda mais sua importância.</p>
                        <p class="curiosity-text"><strong>Caminho do Ouro:</strong> Estrada que ligava Minas Gerais ao Rio.</p>
                        <p class="curiosity-text"><strong>Casa da Moeda:</strong> Estabelecida no Rio para cunhar moedas de ouro.</p>
                        <p class="curiosity-text"><strong>Opulência:</strong> Construção de igrejas ricamente decoradas com ouro.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">👥 Sociedade Colonial</h4>
                        <p class="curiosity-text"><strong>Estratificação:</strong> Senhores de engenho, comerciantes, artesãos, escravos e homens livres pobres.</p>
                        <p class="curiosity-text"><strong>Escravidão:</strong> Base da economia e da sociedade colonial.</p>
                        <p class="curiosity-text"><strong>Religiosidade:</strong> Igreja Católica muito influente na vida social.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarHistoriaRJ()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para História do Rio
                    </button>
                </div>
            `;
            break;
            
        case 'imperial':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Debret_-_Desembarque_de_Dona_Leopoldina.jpg/300px-Debret_-_Desembarque_de_Dona_Leopoldina.jpg" 
                             alt="Chegada da Família Real" 
                             style="width: 250px; height: 180px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,123,255,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">👑 Período Imperial (1808-1889)</h3>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🚢 Chegada da Família Real (1808)</h4>
                        <p class="curiosity-text">A vinda da família real portuguesa transformou o Rio na capital do Império Português, a única capital europeia fora da Europa!</p>
                        <p class="curiosity-text"><strong>Transformações:</strong> Abertura dos portos, criação de instituições, modernização urbana.</p>
                        <p class="curiosity-text"><strong>População:</strong> Cresceu de 50.000 para 100.000 habitantes rapidamente.</p>
                        <p class="curiosity-text"><strong>Cultura:</strong> Chegada de artistas, cientistas e intelectuais europeus.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🇧🇷 Capital do Império do Brasil</h4>
                        <p class="curiosity-text">Após a Independência em 1822, o Rio continuou como capital, agora do novo Império do Brasil.</p>
                        <p class="curiosity-text"><strong>Coroação:</strong> D. Pedro I foi coroado imperador na Igreja do Carmo.</p>
                        <p class="curiosity-text"><strong>Desenvolvimento:</strong> Construção de palácios, teatros e avenidas.</p>
                        <p class="curiosity-text"><strong>Imigração:</strong> Chegada de europeus e crescimento populacional.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🏗️ Reformas Urbanas</h4>
                        <p class="curiosity-text">O Rio passou por grandes transformações para se tornar uma capital moderna e digna do Império.</p>
                        <p class="curiosity-text"><strong>Aqueduto da Carioca:</strong> Abastecimento de água para a cidade.</p>
                        <p class="curiosity-text"><strong>Iluminação:</strong> Primeiros lampiões a gás nas ruas.</p>
                        <p class="curiosity-text"><strong>Transporte:</strong> Primeiras linhas de bonde e estradas de ferro.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">📜 Lei Áurea (1888)</h4>
                        <p class="curiosity-text">A abolição da escravatura foi assinada no Paço Imperial, marcando o fim de mais de 300 anos de escravidão no Brasil.</p>
                        <p class="curiosity-text"><strong>Princesa Isabel:</strong> Assinou a lei na ausência de Pedro II.</p>
                        <p class="curiosity-text"><strong>Transformação social:</strong> Liberdade para mais de 700.000 escravos.</p>
                        <p class="curiosity-text"><strong>Consequências:</strong> Mudanças profundas na sociedade e economia.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarHistoriaRJ()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para História do Rio
                    </button>
                </div>
            `;
            break;
            
        case 'republicano':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Avenida_Central_%28Av._Rio_Branco%29_1905_Augusto_Malta.jpg/300px-Avenida_Central_%28Av._Rio_Branco%29_1905_Augusto_Malta.jpg" 
                             alt="Reforma Pereira Passos" 
                             style="width: 250px; height: 180px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,123,255,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">🏛️ Período Republicano (1889-1960)</h3>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">📯 Proclamação da República (1889)</h4>
                        <p class="curiosity-text">O fim do Império foi proclamado na Praça da Aclamação (hoje Praça da República), transformando o Rio na capital da nova República.</p>
                        <p class="curiosity-text"><strong>Mudanças:</strong> Fim da monarquia, separação Igreja-Estado, novo regime político.</p>
                        <p class="curiosity-text"><strong>Capital Federal:</strong> Rio continuou como sede do governo nacional.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🏗️ Reforma Pereira Passos (1902-1906)</h4>
                        <p class="curiosity-text">A maior reforma urbana da história do Rio, conhecida como "Bota-abaixo", transformou completamente o centro da cidade.</p>
                        <p class="curiosity-text"><strong>Avenida Central:</strong> Atual Av. Rio Branco, inspirada nos boulevards parisienses.</p>
                        <p class="curiosity-text"><strong>Saneamento:</strong> Combate às epidemias de febre amarela e varíola.</p>
                        <p class="curiosity-text"><strong>Modernização:</strong> Teatro Municipal, Biblioteca Nacional, novos edifícios públicos.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">💉 Revolta da Vacina (1904)</h4>
                        <p class="curiosity-text">A população se rebelou contra a vacinação obrigatória contra a varíola, gerando violentos confrontos nas ruas do Rio.</p>
                        <p class="curiosity-text"><strong>Oswaldo Cruz:</strong> Médico sanitarista responsável pelas reformas de saúde.</p>
                        <p class="curiosity-text"><strong>Resistência popular:</strong> Medo e desconfiança da população pobre.</p>
                        <p class="curiosity-text"><strong>Desfecho:</strong> Governo venceu, mas aprendeu a importância do diálogo social.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🎭 Belle Époque Carioca</h4>
                        <p class="curiosity-text">O início do século XX foi marcado pela elegância, modernidade e efervescência cultural.</p>
                        <p class="curiosity-text"><strong>Teatro Municipal:</strong> Palco da alta cultura carioca.</p>
                        <p class="curiosity-text"><strong>Moda francesa:</strong> Influência europeia nos costumes.</p>
                        <p class="curiosity-text"><strong>Carnaval:</strong> Primeiros blocos e cordões carnavalescos.</p>
                        <p class="curiosity-text"><strong>Imprensa:</strong> Jornais e revistas ilustradas.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🎵 Nascimento do Samba</h4>
                        <p class="curiosity-text">Nas primeiras décadas do século XX, nasceu nos morros cariocas o samba, que se tornaria símbolo da cultura brasileira.</p>
                        <p class="curiosity-text"><strong>"Pelo Telefone" (1917):</strong> Primeiro samba gravado, de Donga.</p>
                        <p class="curiosity-text"><strong>Tia Ciata:</strong> Importante figura na história do samba.</p>
                        <p class="curiosity-text"><strong>Escolas de Samba:</strong> Primeiras agremiações carnavalescas.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarHistoriaRJ()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para História do Rio
                    </button>
                </div>
            `;
            break;
            
        case 'moderno':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Cristo_Redentor_-_Rio_de_Janeiro%2C_Brasil.jpg/200px-Cristo_Redentor_-_Rio_de_Janeiro%2C_Brasil.jpg" 
                             alt="Rio Moderno" 
                             style="width: 250px; height: 180px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,123,255,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">🌆 Era Moderna (1960-presente)</h3>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🏛️ Perda da Capital (1960)</h4>
                        <p class="curiosity-text">Com a inauguração de Brasília, o Rio perdeu o status de capital federal após quase 200 anos.</p>
                        <p class="curiosity-text"><strong>Impacto:</strong> Redução da importância política, mas manutenção da relevância cultural.</p>
                        <p class="curiosity-text"><strong>Guanabara:</strong> Rio tornou-se estado independente (1960-1975).</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🤝 Fusão (1975)</h4>
                        <p class="curiosity-text">Fusão entre o estado da Guanabara (cidade do Rio) e o antigo estado do Rio de Janeiro.</p>
                        <p class="curiosity-text"><strong>Nova capital:</strong> Rio de Janeiro tornou-se capital do estado unificado.</p>
                        <p class="curiosity-text"><strong>Desafios:</strong> Integração de duas estruturas administrativas diferentes.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🎶 Explosão Cultural</h4>
                        <p class="curiosity-text">O Rio consolidou-se como capital cultural do Brasil, exportando música, cinema e arte para o mundo.</p>
                        <p class="curiosity-text"><strong>Bossa Nova (1950s-60s):</strong> Tom Jobim, João Gilberto, "Garota de Ipanema".</p>
                        <p class="curiosity-text"><strong>Cinema Novo:</strong> Glauber Rocha e o novo cinema brasileiro.</p>
                        <p class="curiosity-text"><strong>Rock in Rio (1985):</strong> Maior festival de música do mundo.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🏆 Grandes Eventos</h4>
                        <p class="curiosity-text">O Rio tornou-se palco de grandes eventos mundiais, projetando a cidade internacionalmente.</p>
                        <p class="curiosity-text"><strong>ECO-92:</strong> Conferência das Nações Unidas sobre meio ambiente.</p>
                        <p class="curiosity-text"><strong>Copa do Mundo (2014):</strong> Final no Maracanã renovado.</p>
                        <p class="curiosity-text"><strong>Olimpíadas (2016):</strong> Primeira cidade sul-americana a sediar.</p>
                        <p class="curiosity-text"><strong>Cristo Redentor:</strong> Eleito uma das 7 Maravilhas do Mundo Moderno (2007).</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🌍 Patrimônio da Humanidade</h4>
                        <p class="curiosity-text">Em 2012, a Paisagem Cultural Carioca foi declarada Patrimônio Mundial da UNESCO.</p>
                        <p class="curiosity-text"><strong>Reconhecimento:</strong> Única cidade do mundo com paisagem urbana protegida pela UNESCO.</p>
                        <p class="curiosity-text"><strong>Elementos:</strong> Montanhas, mar, florestas e arquitetura integrados harmoniosamente.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🎭 Rio Hoje</h4>
                        <p class="curiosity-text">O Rio continua sendo uma das cidades mais importantes do Brasil e um ícone mundial.</p>
                        <p class="curiosity-text"><strong>Turismo:</strong> Mais de 6 milhões de turistas por ano.</p>
                        <p class="curiosity-text"><strong>Cultura:</strong> Carnaval, museus, teatro, música, gastronomia.</p>
                        <p class="curiosity-text"><strong>Desafios:</strong> Desigualdade social, segurança pública, mobilidade urbana.</p>
                        <p class="curiosity-text"><strong>Futuro:</strong> Projetos de revitalização urbana e sustentabilidade.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarHistoriaRJ()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para História do Rio
                    </button>
                </div>
            `;
            break;
            
        default:
            detalhes = `
                <div class="info-panel">
                    <h3 class="info-title">❌ Período não encontrado</h3>
                    <p class="curiosity-text">Desculpe, não foi possível encontrar informações sobre este período.</p>
                    <button class="back-btn" onclick="mostrarHistoriaRJ()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para História do Rio
                    </button>
                </div>
            `;
    }
    
    infoSection.innerHTML = detalhes;
}

// ===== FILTROS =====
function filterCategory(categoria) {
    // Atualizar botão ativo
    document.querySelectorAll('.filter-btn').forEach(btn => { btn.classList.remove('active'); btn.setAttribute('aria-pressed', 'false'); });
    
    // Encontrar e ativar o botão correto
    const mapByCat = {
        all: 'Todos', museum: 'Museus', church: 'Igrejas', palace: 'Palácios',
        monument: 'Monumentos', culture: 'Cultura', library: 'Bibliotecas', square: 'Praças', bunker: 'Bunker'
    };
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const label = btn.textContent.trim();
        if (label.includes(mapByCat[categoria])) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        }
    });
    
    filtroAtivo = categoria;
    aplicarFiltros();
    
    // Mostrar curiosidade da categoria se não for 'all'
    if (categoria !== 'all') {
        mostrarCuriosidadeCategoria(categoria);
    } else {
        // Hide info panel when showing all
        const infoSection = document.getElementById('infoSection');
        infoSection.style.display = 'none';
    }
}

function filterByCategory(categoria, botao) {
    // Atualizar botão ativo
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    botao.classList.add('active');
    
    filtroAtivo = categoria;
    aplicarFiltros();
    
    // Mostrar curiosidade da categoria
    mostrarCuriosidadeCategoria(categoria);
}

function filterLocations() {
    aplicarFiltros();
}

function aplicarFiltros() {
    const searchInput = document.getElementById('searchInput');
    const searchBox = document.getElementById('searchBox');
    let termoBusca = '';
    
    if (searchInput) {
        termoBusca = searchInput.value.toLowerCase();
    } else if (searchBox) {
        termoBusca = searchBox.value.toLowerCase();
    }
    
    marcadores.forEach(marcador => {
        const ponto = marcador.pontoData;
        
        // Verificar categoria
        const matchCategoria = filtroAtivo === 'all' || ponto.categoria === filtroAtivo;
        
        // Verificar busca
        const matchBusca = !termoBusca || 
            ponto.nome.toLowerCase().includes(termoBusca) ||
            ponto.descricao.toLowerCase().includes(termoBusca);
        
        // Mostrar/ocultar marcador
        if (matchCategoria && matchBusca) {
            if (!map.hasLayer(marcador)) {
                marcador.addTo(map);
            }
        } else if (map.hasLayer(marcador)) {
            map.removeLayer(marcador);
        }
    });
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    
    // Setup search functionality para ambos os inputs
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', aplicarFiltros);
    }
    
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        searchBox.addEventListener('input', aplicarFiltros);
    }
});

// Função para mostrar detalhes específicos de cada personagem da Família Imperial
function mostrarDetalhesPersonagem(personagem) {
    const infoSection = document.getElementById('infoSection');
    let detalhes = '';
    
    switch(personagem) {
        case 'djoao6':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <video controls style="width: 250px; height: 200px; border-radius: 12px; box-shadow: 0 8px 25px rgba(255,215,0,0.4); object-fit: cover;">
                            <source src="https://i.imgur.com/ThR5CYX.mp4" type="video/mp4">
                            Seu navegador não suporta o elemento de vídeo.
                        </video>
                    </div>
                    <h3 class="info-title">👑 D. João VI de Portugal</h3>
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📊 Dados Pessoais</h4>
                        <p class="curiosity-text"><strong>Nome Completo:</strong> João Maria José Francisco Xavier de Paula Luís António Domingos Rafael de Bragança</p>
                        <p class="curiosity-text"><strong>Nascimento:</strong> 13 de maio de 1767, Lisboa, Portugal</p>
                        <p class="curiosity-text"><strong>Morte:</strong> 10 de março de 1826, Lisboa, Portugal</p>
                        <p class="curiosity-text"><strong>Reinado:</strong> 1816–1826 (Portugal), 1815–1822 (Reino Unido)</p>
                        <p class="curiosity-text"><strong>Dinastia:</strong> Casa de Bragança</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🏃‍♂️ A Fuga para o Brasil (1807)</h4>
                        <p class="curiosity-text">Em novembro de 1807, com as tropas de Napoleão se aproximando de Lisboa, D. João VI embarcou com toda a família real portuguesa para o Brasil. Esta foi a primeira vez na história que uma corte europeia se transferiu para uma colônia.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🇧🇷 Transformações no Brasil</h4>
                        <p class="curiosity-text">• Abertura dos portos às nações amigas (1808)</p>
                        <p class="curiosity-text">• Criação do Banco do Brasil (1808)</p>
                        <p class="curiosity-text">• Fundação da Biblioteca Nacional</p>
                        <p class="curiosity-text">• Criação da Impressão Régia</p>
                        <p class="curiosity-text">• Elevação do Brasil a Reino Unido (1815)</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">👨‍👩‍👧‍👦 Vida Familiar</h4>
                        <p class="curiosity-text"><strong>Esposa:</strong> Carlota Joaquina de Bourbon</p>
                        <p class="curiosity-text"><strong>Filhos principais:</strong> Pedro (futuro Pedro I do Brasil), Miguel I de Portugal</p>
                        <p class="curiosity-text"><strong>Curiosidade:</strong> Teve 9 filhos com Carlota Joaquina, mas o casamento era conturbado</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarFamiliaImperial()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para Família Imperial
                    </button>
                </div>
            `;
            break;
            
        case 'carlota':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Carlota_Joaquina_by_Giuseppe_Troni_%281819%29_-_Ajuda_National_Palace.png/200px-Carlota_Joaquina_by_Giuseppe_Troni_%281819%29_-_Ajuda_National_Palace.png" 
                             alt="D. Carlota Joaquina" 
                             style="width: 200px; height: 250px; border-radius: 12px; box-shadow: 0 8px 25px rgba(255,215,0,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">👸 D. Carlota Joaquina de Bourbon</h3>
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📊 Dados Pessoais</h4>
                        <p class="curiosity-text"><strong>Nome Completo:</strong> Carlota Joaquina Teresa Cayetana de Bourbon</p>
                        <p class="curiosity-text"><strong>Nascimento:</strong> 25 de abril de 1775, Aranjuez, Espanha</p>
                        <p class="curiosity-text"><strong>Morte:</strong> 7 de janeiro de 1830, Queluz, Portugal</p>
                        <p class="curiosity-text"><strong>Título:</strong> Rainha consorte de Portugal</p>
                        <p class="curiosity-text"><strong>Dinastia:</strong> Casa de Bourbon (nascimento), Casa de Bragança (casamento)</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">💒 Casamento Arranjado</h4>
                        <p class="curiosity-text">Casou-se com D. João VI em 1785, quando tinha apenas 10 anos de idade, em um casamento político entre Espanha e Portugal. O casal nunca teve um relacionamento harmonioso.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🌎 Ambições Americanas</h4>
                        <p class="curiosity-text">Durante a estadia no Brasil, Carlota Joaquina nutriu ambições de se tornar regente das colônias espanholas na América do Sul, aproveitando-se da ocupação napoleônica da Espanha.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">⚡ Personalidade Forte</h4>
                        <p class="curiosity-text">Conhecida por sua personalidade impetuosa e ambiciosa, foi uma figura controversa na corte. Envolveu-se em intrigas políticas e conspirou contra o próprio marido em algumas ocasiões.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">👨‍👩‍👧‍👦 Descendência</h4>
                        <p class="curiosity-text">Mãe de 9 filhos, incluindo Pedro I do Brasil e Miguel I de Portugal. Sua influência na educação dos filhos foi significativa, especialmente na formação política dos príncipes.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarFamiliaImperial()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para Família Imperial
                    </button>
                </div>
            `;
            break;
            
        case 'pedro1':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Pedro_I_do_Brasil_1830.jpg/200px-Pedro_I_do_Brasil_1830.jpg" 
                             alt="D. Pedro I" 
                             style="width: 200px; height: 250px; border-radius: 12px; box-shadow: 0 8px 25px rgba(255,215,0,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">👑 D. Pedro I - O Libertador</h3>
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📊 Dados Pessoais</h4>
                        <p class="curiosity-text"><strong>Nome Completo:</strong> Pedro de Alcântara Francisco António João Carlos Xavier de Paula Miguel Rafael Joaquim José Gonzaga Pascoal Cipriano Serafim de Bragança e Bourbon</p>
                        <p class="curiosity-text"><strong>Nascimento:</strong> 12 de outubro de 1798, Queluz, Portugal</p>
                        <p class="curiosity-text"><strong>Morte:</strong> 24 de setembro de 1834, Queluz, Portugal</p>
                        <p class="curiosity-text"><strong>Reinado Brasil:</strong> 1822–1831</p>
                        <p class="curiosity-text"><strong>Reinado Portugal:</strong> 1826–1828 (como Pedro IV)</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🇧🇷 Independência do Brasil</h4>
                        <p class="curiosity-text"><strong>7 de setembro de 1822:</strong> Proclamou a Independência do Brasil às margens do Rio Ipiranga, gritando "Independência ou Morte!"</p>
                        <p class="curiosity-text"><strong>1º de dezembro de 1822:</strong> Foi coroado Imperador do Brasil na Igreja do Carmo, no Rio de Janeiro</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">💝 Vida Amorosa</h4>
                        <p class="curiosity-text"><strong>1ª Esposa:</strong> Leopoldina da Áustria (1817-1826) - Arquiduquesa da Áustria</p>
                        <p class="curiosity-text"><strong>2ª Esposa:</strong> Amélia de Leuchtenberg (1829-1834)</p>
                        <p class="curiosity-text"><strong>Amante famosa:</strong> Domitila de Castro (Marquesa de Santos)</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🎵 Talento Musical</h4>
                        <p class="curiosity-text">Compositor talentoso, criou o Hino da Independência do Brasil e várias outras peças musicais. Era também um excelente pianista.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📜 Constituição de 1824</h4>
                        <p class="curiosity-text">Outorgou a primeira Constituição do Brasil em 1824, que vigorou até 1891. Criou o Poder Moderador, exclusivo do Imperador.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">⚔️ Abdicação e Exílio</h4>
                        <p class="curiosity-text">Abdicou do trono brasileiro em 1831 e retornou a Portugal para lutar pelos direitos de sua filha Maria da Glória ao trono português.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarFamiliaImperial()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para Família Imperial
                    </button>
                </div>
            `;
            break;
            
        case 'leopoldina':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Domingos_Sequeira_007.jpg/200px-Domingos_Sequeira_007.jpg" 
                             alt="D. Leopoldina" 
                             style="width: 200px; height: 250px; border-radius: 12px; box-shadow: 0 8px 25px rgba(255,215,0,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">👸 D. Leopoldina - A Imperatriz Intelectual</h3>
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📊 Dados Pessoais</h4>
                        <p class="curiosity-text"><strong>Nome Completo:</strong> Maria Leopoldina Josefa Carolina de Habsburgo-Lorena</p>
                        <p class="curiosity-text"><strong>Nascimento:</strong> 22 de janeiro de 1797, Viena, Áustria</p>
                        <p class="curiosity-text"><strong>Morte:</strong> 11 de dezembro de 1826, Rio de Janeiro, Brasil</p>
                        <p class="curiosity-text"><strong>Título:</strong> Imperatriz do Brasil (1822-1826)</p>
                        <p class="curiosity-text"><strong>Dinastia:</strong> Casa de Habsburgo-Lorena</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🎓 Educação Excepcional</h4>
                        <p class="curiosity-text">Recebeu educação privilegiada em Viena, dominando várias línguas e ciências naturais. Era considerada uma das mulheres mais cultas de sua época.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🇧🇷 Papel na Independência</h4>
                        <p class="curiosity-text">Teve papel fundamental na Independência do Brasil, influenciando Pedro I e apoiando ativamente o movimento separatista. Muitos historiadores a consideram co-autora da Independência.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🔬 Interesse Científico</h4>
                        <p class="curiosity-text">Apaixonada por história natural, coletou espécimes da flora e fauna brasileiras que enviou para museus europeus. Contribuiu significativamente para o conhecimento científico sobre o Brasil.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">👶 Maternidade</h4>
                        <p class="curiosity-text">Mãe de 7 filhos, incluindo Pedro II (futuro Imperador do Brasil). Sua morte prematura aos 29 anos foi causada por complicações no parto.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">💔 Casamento Turbulento</h4>
                        <p class="curiosity-text">Sofreu com as traições de Pedro I, especialmente o relacionamento dele com Domitila de Castro. Apesar disso, manteve-se fiel aos deveres imperiais.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarFamiliaImperial()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para Família Imperial
                    </button>
                </div>
            `;
            break;
            
        case 'pedro2':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <video controls style="width: 250px; height: 200px; border-radius: 12px; box-shadow: 0 8px 25px rgba(255,215,0,0.4); object-fit: cover;">
                            <source src="https://i.imgur.com/9O29QG2.mp4" type="video/mp4">
                            Seu navegador não suporta o elemento de vídeo.
                        </video>
                    </div>
                    <h3 class="info-title">👑 D. Pedro II - O Imperador Sábio</h3>
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📊 Dados Pessoais</h4>
                        <p class="curiosity-text"><strong>Nome Completo:</strong> Pedro de Alcântara João Carlos Leopoldo Salvador Bibiano Francisco Xavier de Paula Leocádio Miguel Gabriel Rafael Gonzaga de Bragança e Bourbon</p>
                        <p class="curiosity-text"><strong>Nascimento:</strong> 2 de dezembro de 1825, Rio de Janeiro, Brasil</p>
                        <p class="curiosity-text"><strong>Morte:</strong> 5 de dezembro de 1891, Paris, França</p>
                        <p class="curiosity-text"><strong>Reinado:</strong> 1831–1889 (58 anos!)</p>
                        <p class="curiosity-text"><strong>Golpe da Maioridade:</strong> 1840 (aos 14 anos)</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🎓 O Imperador Intelectual</h4>
                        <p class="curiosity-text">Falava fluentemente português, francês, alemão, inglês, italiano, espanhol, latim, grego, árabe, hebraico, sânscrito e tupi!</p>
                        <p class="curiosity-text">Correspondía-se com cientistas, filósofos e escritores do mundo todo, incluindo Victor Hugo e Louis Pasteur.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🏛️ Modernização do Brasil</h4>
                        <p class="curiosity-text">• Abolição gradual da escravidão (Lei do Ventre Livre, Lei dos Sexagenários)</p>
                        <p class="curiosity-text">• Expansão das ferrovias</p>
                        <p class="curiosity-text">• Desenvolvimento da educação</p>
                        <p class="curiosity-text">• Incentivo às artes e ciências</p>
                        <p class="curiosity-text">• Criação do Instituto Histórico e Geográfico Brasileiro</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">⚔️ Guerra do Paraguai (1864-1870)</h4>
                        <p class="curiosity-text">Conflito mais sangrento da história sul-americana. O Brasil saiu vitorioso, mas com enormes custos humanos e financeiros que afetaram a popularidade do Império.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📸 Pioneiro da Fotografia</h4>
                        <p class="curiosity-text">Apaixonado por tecnologia, foi um dos primeiros a usar a fotografia no Brasil. Suas fotos pessoais são importantes registros históricos.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">👨‍👩‍👧‍👦 Vida Familiar</h4>
                        <p class="curiosity-text"><strong>Esposa:</strong> Teresa Cristina das Duas Sicílias</p>
                        <p class="curiosity-text"><strong>Filhos:</strong> Princesa Isabel (herdeira), Princesa Leopoldina, Príncipes Afonso e Pedro Afonso (morreram jovens)</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🏃‍♂️ Proclamação da República (1889)</h4>
                        <p class="curiosity-text">Deposto em 15 de novembro de 1889, aceitou o exílio pacificamente, dizendo: "Se é assim, será uma República desgraçada!" Morreu no exílio em Paris.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarFamiliaImperial()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para Família Imperial
                    </button>
                </div>
            `;
            break;
            
        case 'teresa':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Imperatriz_Teresa_Cristina.jpg/200px-Imperatriz_Teresa_Cristina.jpg" 
                             alt="D. Teresa Cristina" 
                             style="width: 200px; height: 250px; border-radius: 12px; box-shadow: 0 8px 25px rgba(255,215,0,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">👸 D. Teresa Cristina - A Mãe dos Brasileiros</h3>
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📊 Dados Pessoais</h4>
                        <p class="curiosity-text"><strong>Nome Completo:</strong> Teresa Cristina Maria de Bourbon-Duas Sicílias</p>
                        <p class="curiosity-text"><strong>Nascimento:</strong> 14 de março de 1822, Nápoles, Reino das Duas Sicílias</p>
                        <p class="curiosity-text"><strong>Morte:</strong> 28 de dezembro de 1889, Porto, Portugal</p>
                        <p class="curiosity-text"><strong>Título:</strong> Imperatriz do Brasil (1843-1889)</p>
                        <p class="curiosity-text"><strong>Dinastia:</strong> Casa de Bourbon-Duas Sicílias</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">💒 Casamento por Procuração</h4>
                        <p class="curiosity-text">Casou-se com Pedro II por procuração em 1843, sem nunca tê-lo visto antes. Chegou ao Brasil para descobrir que o imperador havia se decepcionado com sua aparência física.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">❤️ A Mãe dos Brasileiros</h4>
                        <p class="curiosity-text">Ganhou este carinhoso apelido por sua dedicação às obras de caridade e por cuidar dos mais necessitados. Fundou asilos, hospitais e orfanatos.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🏛️ Mecenas das Artes</h4>
                        <p class="curiosity-text">Grande incentivadora das artes no Brasil, promoveu a música, a pintura e a literatura. Apoiou artistas brasileiros e europeus.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🏛️ Descobertas Arqueológicas</h4>
                        <p class="curiosity-text">Apaixonada por arqueologia, patrocinou escavações em Pompéia e Herculano, enviando várias peças para o Brasil. Criou um dos primeiros museus arqueológicos do país.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">👨‍👩‍👧‍👦 Maternidade Dedicada</h4>
                        <p class="curiosity-text">Mãe devotada de quatro filhos: Isabel, Leopoldina, Afonso e Pedro Afonso. Sofreu muito com a morte prematura dos dois príncipes.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">💔 Casamento Infeliz</h4>
                        <p class="curiosity-text">Apesar da frieza inicial de Pedro II, conquistou gradualmente o respeito do marido através de sua bondade e dedicação. O imperador chegou a admirá-la profundamente.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🏃‍♀️ Exílio e Morte</h4>
                        <p class="curiosity-text">Acompanhou Pedro II no exílio após a Proclamação da República. Morreu em Portugal, apenas 43 dias após deixar o Brasil.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarFamiliaImperial()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para Família Imperial
                    </button>
                </div>
            `;
            break;
            
        case 'isabel':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Francisca_d%27Orléans-Bragança_%281844-1925%29.jpg/200px-Francisca_d%27Orléans-Bragança_%281844-1925%29.jpg" 
                             alt="Princesa Isabel" 
                             style="width: 200px; height: 250px; border-radius: 12px; box-shadow: 0 8px 25px rgba(255,215,0,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">👸 Princesa Isabel - A Redentora</h3>
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📊 Dados Pessoais</h4>
                        <p class="curiosity-text"><strong>Nome Completo:</strong> Isabel Cristina Leopoldina Augusta Micaela Gabriela Rafaela Gonzaga de Bragança</p>
                        <p class="curiosity-text"><strong>Nascimento:</strong> 29 de julho de 1846, Rio de Janeiro, Brasil</p>
                        <p class="curiosity-text"><strong>Morte:</strong> 14 de novembro de 1921, Eu, França</p>
                        <p class="curiosity-text"><strong>Título:</strong> Princesa Imperial do Brasil, Herdeira do trono</p>
                        <p class="curiosity-text"><strong>Apelido:</strong> "A Redentora"</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">⚖️ Lei Áurea - 13 de maio de 1888</h4>
                        <p class="curiosity-text">Assinou a Lei Áurea que aboliu definitivamente a escravidão no Brasil, libertando cerca de 700.000 escravos. Por isso recebeu o título de "A Redentora".</p>
                        <p class="curiosity-text">A assinatura aconteceu no Paço Imperial, no Rio de Janeiro, com apenas duas linhas: "Lei nº 3.353 - É declarada extinta desde a data desta lei a escravidão no Brasil".</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📚 Educação Privilegiada</h4>
                        <p class="curiosity-text">Recebeu educação excepcional, falava várias línguas e tinha profundo interesse por questões sociais e políticas. Era considerada mais preparada para governar que muitos homens de sua época.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">👑 Regências</h4>
                        <p class="curiosity-text">Exerceu três regências durante as viagens de Pedro II ao exterior (1871-1872, 1876-1877, 1887-1888), demonstrando competência administrativa e política.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">💒 Vida Familiar</h4>
                        <p class="curiosity-text"><strong>Marido:</strong> Gastão de Orléans, Conde d'Eu (casaram em 1864)</p>
                        <p class="curiosity-text"><strong>Filhos:</strong> Pedro (1875-1940), Luís (1878-1920), Antônio (1881-1918)</p>
                        <p class="curiosity-text">Seu casamento foi feliz e baseado no amor mútuo, diferentemente dos casamentos arranjados comuns à época.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">⛪ Fé Católica</h4>
                        <p class="curiosity-text">Católica devota, sua fé influenciou suas decisões políticas, especialmente na questão abolicionista. Acreditava que a escravidão era um pecado que deveria ser eliminado.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🌍 Visão Progressista</h4>
                        <p class="curiosity-text">Defendia ideias avançadas para a época: direitos das mulheres, educação popular, abolição da escravidão e modernização do país.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">👑 A Imperatriz que Nunca Foi</h4>
                        <p class="curiosity-text">Com a Proclamação da República em 1889, perdeu o direito ao trono brasileiro. Muitos historiadores acreditam que ela teria sido uma excelente imperatriz.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🏃‍♀️ Exílio na França</h4>
                        <p class="curiosity-text">Viveu no exílio na França por 32 anos até sua morte. Nunca perdeu a esperança de retornar ao Brasil, mas isso nunca aconteceu.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarFamiliaImperial()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para Família Imperial
                    </button>
                </div>
            `;
            break;
            
        default:
            detalhes = `
                <div class="info-panel">
                    <h3 class="info-title">❌ Personagem não encontrado</h3>
                    <p class="curiosity-text">Desculpe, não foi possível encontrar informações sobre este personagem.</p>
                    <button class="back-btn" onclick="mostrarFamiliaImperial()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para Família Imperial
                    </button>
                </div>
            `;
    }
    
    infoSection.innerHTML = detalhes;
}

// ===== MOBILE MENU FUNCTIONS =====
function toggleMobileMenu() {
    console.log('toggleMobileMenu called'); // Debug
    const dropdown = document.getElementById('mobileMenuDropdown');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    
    console.log('Dropdown found:', dropdown); // Debug
    console.log('Hamburger button found:', hamburgerBtn); // Debug
    
    if (dropdown) {
        dropdown.classList.toggle('active');
        
        // Animar ícone do hamburger
        const icon = hamburgerBtn.querySelector('i');
        if (dropdown.classList.contains('active')) {
            icon.className = 'fas fa-times';
            hamburgerBtn.setAttribute('aria-expanded', 'true');
            console.log('Menu opened'); // Debug
        } else {
            icon.className = 'fas fa-bars';
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            console.log('Menu closed'); // Debug
        }
    } else {
        console.error('Mobile menu dropdown not found!'); // Debug
    }
}

function closeMobileMenu() {
    const dropdown = document.getElementById('mobileMenuDropdown');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    
    if (dropdown) {
        dropdown.classList.remove('active');
        
        // Resetar ícone do hamburger
        const icon = hamburgerBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars';
        }
        if (hamburgerBtn) {
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
    }
}

// Fechar menu mobile ao clicar fora
document.addEventListener('click', function(event) {
    const mobileMenu = document.querySelector('.mobile-menu');
    const dropdown = document.getElementById('mobileMenuDropdown');
    
    if (mobileMenu && dropdown && !mobileMenu.contains(event.target)) {
        closeMobileMenu();
    }
});

// Fechar menu mobile ao redimensionar a tela
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

// Função para inicializar a galeria de imagens com rolagem automática
function inicializarGaleriaImagens() {
    // Seleciona todos os containers de galeria no documento
    const galerias = document.querySelectorAll('.imagens-galeria-container');
    
    // Para cada galeria encontrada
    galerias.forEach(galeria => {
        // Seleciona os indicadores da galeria
        const indicadores = galeria.querySelectorAll('.galeria-indicador');
        const scroll = galeria.querySelector('.imagens-galeria-scroll');
        const imagens = galeria.querySelectorAll('.imagem-item');
        
        // Verificar se as imagens estão visíveis
        if (imagens.length > 0) {
            // Garante que todas as imagens têm display e posicionamento corretos
            imagens.forEach((img, idx) => {
                img.style.display = 'block';
                img.style.flexBasis = '100%';
            });
        }
        
        // Marcar o primeiro indicador como ativo
        indicadores.forEach((indicador, index) => {
            // Remover classe ativo de todos
            indicador.classList.remove('ativo');
            
            // Marcar apenas o primeiro como ativo
            if (index === 0) {
                indicador.classList.add('ativo');
            }
            
            // Adiciona evento de clique para cada indicador
            indicador.addEventListener('click', function() {
                // Remove ativo de todos os indicadores desta galeria
                indicadores.forEach(ind => ind.classList.remove('ativo'));
                // Adiciona ativo ao indicador clicado
                this.classList.add('ativo');
                
                // Move a galeria para a imagem correspondente via scroll
                const index = parseInt(this.getAttribute('data-index'));
                if (scroll) {
                    const alvo = index * scroll.clientWidth;
                    scroll.scrollTo({ left: alvo, behavior: 'smooth' });
                }
            });
        });
        
        // Implementar controle automático baseado na animação CSS
        let currentIndex = 0;
        const totalImages = indicadores.length;
        
        // Atualizar indicadores conforme a animação CSS
        if (totalImages > 1) {
            // Verificamos inicialmente se a animação está funcionando
            if (window.getComputedStyle(scroll).animationName === 'none') {
                console.log('Animação não está aplicada corretamente. Ativando fallback manual.');
                // Ativamos um fallback manual
                let autoScrollInterval;
                
                galeria.addEventListener('mouseenter', function() {
                    autoScrollInterval = setInterval(() => {
                        currentIndex = (currentIndex + 1) % totalImages;
                        const alvo = currentIndex * scroll.clientWidth;
                        scroll.scrollTo({ left: alvo, behavior: 'smooth' });
                        
                        // Atualiza indicadores
                        indicadores.forEach(ind => ind.classList.remove('ativo'));
                        indicadores[currentIndex].classList.add('ativo');
                    }, 3000);
                });
                
                galeria.addEventListener('mouseleave', function() {
                    clearInterval(autoScrollInterval);
                    // Voltamos para a primeira imagem
                    currentIndex = 0;
                    scroll.scrollTo({ left: 0, behavior: 'smooth' });
                    
                    // Atualiza indicadores
                    indicadores.forEach(ind => ind.classList.remove('ativo'));
                    indicadores[0].classList.add('ativo');
                });
            } else {
                // A animação CSS está funcionando, vamos apenas atualizar os indicadores
                galeria.addEventListener('mouseenter', function() {
                    // Iniciar controle dos indicadores quando o mouse entra
                    let animationInterval = setInterval(() => {
                        if (!galeria.matches(':hover')) {
                            clearInterval(animationInterval);
                            return;
                        }
                        
                        // Atualizar indicador ativo
                        indicadores.forEach(ind => ind.classList.remove('ativo'));
                        currentIndex = (currentIndex + 1) % totalImages;
                        indicadores[currentIndex].classList.add('ativo');
                    }, 3000); // Muda a cada 3 segundos
                });
                
                galeria.addEventListener('mouseleave', function() {
                    // Reset para primeira imagem quando sai o mouse
                    setTimeout(() => {
                        currentIndex = 0;
                        indicadores.forEach(ind => ind.classList.remove('ativo'));
                        indicadores[0].classList.add('ativo');
                    }, 100);
                });
            }
        }
    });
}

// Função de manipulação de clique no indicador
function indicadorClickHandler() {
    const index = this.getAttribute('data-index');
    const galeria = this.closest('.imagens-galeria-container');
    
    // Atualiza classe ativa
    galeria.querySelectorAll('.galeria-indicador').forEach(ind => ind.classList.remove('ativo'));
    this.classList.add('ativo');
    
    // Rola para a imagem correspondente
    const scroll = galeria.querySelector('.imagens-galeria-scroll');
    if (scroll) {
        scroll.scrollTo({
            left: scroll.clientWidth * index,
            behavior: 'smooth'
        });
    }
}

// Função para mudar manualmente a imagem da galeria
function mudarImagemGaleria(elemento, index) {
    // Encontra o container da galeria
    const galeria = elemento.closest('.imagens-galeria-container');
    
    // Atualiza a classe ativo nos indicadores
    const indicadores = galeria.querySelectorAll('.galeria-indicador');
    indicadores.forEach(ind => ind.classList.remove('ativo'));
    elemento.classList.add('ativo');
    
    // Encontra o container de scroll
    const scroll = galeria.querySelector('.imagens-galeria-scroll');
    if (!scroll) return;
    
    // Move via scroll real
    const alvo = index * scroll.clientWidth;
    scroll.scrollTo({ left: alvo, behavior: 'smooth' });
}

// Inicializar componentes quando o DOM for carregado
window.addEventListener('DOMContentLoaded', function() {
    // Inicializar as galerias já existentes na página
    inicializarGaleriaImagens();
    
    // Verificar CSS computed styles
    if (mobileMenu) {
        const mobileStyle = window.getComputedStyle(mobileMenu);
        console.log('Mobile menu display:', mobileStyle.display);
    }
    
    if (desktopMenu) {
        const desktopStyle = window.getComputedStyle(desktopMenu);
        console.log('Desktop menu display:', desktopStyle.display);
    }
    
    // Verificar viewport
    console.log('Window width:', window.innerWidth);
    console.log('Screen width:', screen.width);
    console.log('User agent:', navigator.userAgent);
});

//=============================================================================
// 📸 FUNÇÃO MEMÓRIA - PÁGINA DE VÍDEOS E FOTOS
//=============================================================================

/**
 * ABRE PÁGINA DE MEMÓRIAS
 * Função que abre a galeria de fotos históricas do Rio de Janeiro
 */
function abrirMemoria() {
    // Caminho dinâmico - verifica se está na raiz ou na pasta html
    const isInRoot = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');
    const urlMemoria = isInRoot ? './html/galeria-memoria.html' : './galeria-memoria.html';
    
    try {
        // Abre em nova aba
        window.open(urlMemoria, '_blank', 'noopener,noreferrer');
    } catch (error) {
        console.error('Erro ao abrir página de memórias:', error);
        
        // Fallback: redirecionar na mesma aba
        window.location.href = urlMemoria;
    }
}

// Função removida: abrirMemoriaModal - não utilizada

//=============================================================================
// � FUNÇÃO STREET VIEW - VISUALIZAÇÃO IMERSIVA 360°
//=============================================================================

/**
 * Abre o Google Street View para um ponto específico
 * @param {number} lat - Latitude do local
 * @param {number} lng - Longitude do local
 * @param {string} nome - Nome do local (para notificação)
 */
function abrirStreetView(lat, lng, nome) {
    // URL do Google Maps Street View com API parameters
    const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}&heading=0&pitch=0&fov=80`;
    
    // Abrir em nova aba
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Mostrar notificação de sucesso
    showNotification(`Abrindo Street View de ${nome}...`, 'success');
}

//=============================================================================
// �🎯 TOUR 360° PREMIUM - INTEGRAÇÃO COM GOOGLE MAPS
//=============================================================================

/**
 * Inicia Tour 360° Premium com Google Maps Street View
 * Cria rota otimizada e abre no Google Maps
 */
function iniciarTour360() {
    // Selecionar pontos principais para o tour
    const pontosPrincipais = selecionarPontosTourPremium();
    
    if (pontosPrincipais.length === 0) {
        mostrarNotificacaoPremium('Nenhum ponto disponível para o tour', 'warning', 'fa-exclamation-triangle');
        return;
    }
    
    // Mostrar modal de seleção de tipo de tour
    mostrarModalTourPremium(pontosPrincipais);
}

/**
 * Seleciona os pontos mais importantes para um tour premium
 */
function selecionarPontosTourPremium() {
    // Pontos principais do tour histórico
    const pontosEssenciais = [
        "Paço Imperial",
        "Praça XV de Novembro",
        "Arco do Teles",
        "Igreja da Candelária",
        "Theatro Municipal",
        "Biblioteca Nacional",
        "Museu Nacional de Belas Artes",
        "Real Gabinete Português de Leitura",
        "Confeitaria Colombo",
        "Centro Cultural Banco do Brasil"
    ];
    
    return pontosHistoricos.filter(p => pontosEssenciais.includes(p.nome));
}

/**
 * Mostra modal premium para escolha do tipo de tour
 */
function mostrarModalTourPremium(pontos) {
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'tour-modal-overlay';
    overlay.innerHTML = `
        <div class="tour-modal-premium">
            <div class="tour-modal-header">
                <div class="tour-modal-icon">
                    <i class="fas fa-route"></i>
                </div>
                <h2>Tour 360° Premium</h2>
                <p>Escolha como deseja explorar o Centro Histórico do Rio de Janeiro</p>
                <button class="tour-modal-close" onclick="fecharModalTour()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="tour-modal-content">
                <div class="tour-stats-preview">
                    <div class="tour-stat-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${pontos.length} Locais</span>
                    </div>
                    <div class="tour-stat-item">
                        <i class="fas fa-walking"></i>
                        <span>~2.5 km</span>
                    </div>
                    <div class="tour-stat-item">
                        <i class="fas fa-clock"></i>
                        <span>~45 min</span>
                    </div>
                </div>
                
                <div class="tour-options-grid">
                    <button class="tour-option-card" onclick="abrirTourGoogleMaps('directions')">
                        <div class="tour-option-icon">
                            <i class="fas fa-directions"></i>
                        </div>
                        <h3>Navegação com Rota</h3>
                        <p>Rota completa passo a passo pelo Google Maps com navegação em tempo real</p>
                        <div class="tour-option-badge">Recomendado</div>
                    </button>
                    
                    <button class="tour-option-card" onclick="abrirTourGoogleMaps('streetview')">
                        <div class="tour-option-icon">
                            <i class="fas fa-street-view"></i>
                        </div>
                        <h3>Street View Imersivo</h3>
                        <p>Explore cada local em visão 360° pelo Google Street View</p>
                        <div class="tour-option-badge premium">Premium</div>
                    </button>
                    
                    <button class="tour-option-card" onclick="abrirTourGoogleMaps('maps')">
                        <div class="tour-option-icon">
                            <i class="fas fa-map-marked-alt"></i>
                        </div>
                        <h3>Visualização no Mapa</h3>
                        <p>Veja todos os pontos turísticos marcados no Google Maps</p>
                    </button>
                </div>
                
                <div class="tour-locations-preview">
                    <h4><i class="fas fa-list-ul"></i> Locais Incluídos no Tour:</h4>
                    <div class="tour-locations-list">
                        ${pontos.map((p, i) => `
                            <div class="tour-location-item" onclick="abrirStreetView(${p.coords[0]}, ${p.coords[1]}, '${p.nome.replace(/'/g, "\\'")}')" title="Clique para ver ${p.nome} em 360°">
                                <span class="tour-location-number">${i + 1}</span>
                                <span class="tour-location-name">${p.nome}</span>
                                <span class="tour-location-category">${obterNomeCategoria(p.categoria || p.category)}</span>
                                <i class="fas fa-street-view tour-location-icon"></i>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Animar entrada
    setTimeout(() => overlay.classList.add('active'), 10);
    
    // Fechar ao clicar fora
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) fecharModalTour();
    });
}

/**
 * Fecha o modal de tour
 */
function fecharModalTour() {
    const modal = document.querySelector('.tour-modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

/**
 * Abre tour no Google Maps
 */
function abrirTourGoogleMaps(tipo) {
    const pontos = selecionarPontosTourPremium();
    
    if (tipo === 'directions') {
        // Criar rota com múltiplos waypoints
        const origem = pontos[0];
        const destino = pontos[pontos.length - 1];
        const waypoints = pontos.slice(1, -1).map(p => `${p.coords[0]},${p.coords[1]}`).join('|');
        
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origem.coords[0]},${origem.coords[1]}&destination=${destino.coords[0]},${destino.coords[1]}&waypoints=${waypoints}&travelmode=walking`;
        
        window.open(url, '_blank', 'noopener,noreferrer');
        mostrarNotificacaoPremium('Abrindo rota no Google Maps...', 'success', 'fa-directions');
        
    } else if (tipo === 'streetview') {
        // Abrir primeiro ponto em Street View
        const ponto = pontos[0];
        const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${ponto.coords[0]},${ponto.coords[1]}&heading=0&pitch=0&fov=80`;
        
        window.open(url, '_blank', 'noopener,noreferrer');
        mostrarNotificacaoPremium('Abrindo Street View 360°...', 'success', 'fa-street-view');
        
        // Mostrar instruções para navegar pelos pontos
        setTimeout(() => {
            mostrarNotificacaoPremium('Use as setas no Street View para explorar cada local!', 'info', 'fa-info-circle');
        }, 2000);
        
    } else if (tipo === 'maps') {
        // Abrir mapa com todos os pontos
        const centro = pontos[0];
        const markers = pontos.map(p => `${p.coords[0]},${p.coords[1]}`).join('|');
        const url = `https://www.google.com/maps/search/?api=1&query=${centro.coords[0]},${centro.coords[1]}&query_place_id=ChIJVXealLU5mQARwCK_gKaMdUU`;
        
        window.open(url, '_blank', 'noopener,noreferrer');
        mostrarNotificacaoPremium('Abrindo pontos no Google Maps...', 'success', 'fa-map-marked-alt');
    }
    
    fecharModalTour();
}

/**
 * Inicia tour animado interno (versão anterior melhorada)
 */
let tourInternoAtivo = false;
let tourInternoIntervalo = null;
let tourInternoIndice = 0;
let tourPontosSelecionados = [];

function iniciarTourInternoAnimado() {
    fecharModalTour();
    
    if (tourInternoAtivo) {
        pararTourInterno();
        return;
    }
    
    tourPontosSelecionados = selecionarPontosTourPremium();
    
    if (tourPontosSelecionados.length === 0) {
        mostrarNotificacaoPremium('Nenhum ponto disponível', 'error', 'fa-exclamation-circle');
        return;
    }
    
    tourInternoAtivo = true;
    tourInternoIndice = 0;
    
    mostrarNotificacaoPremium(`Tour iniciado! ${tourPontosSelecionados.length} locais`, 'success', 'fa-play-circle');
    
    // Criar indicador de progresso premium
    criarIndicadorProgressoTour(tourPontosSelecionados.length);
    
    // Exibir primeiro ponto imediatamente
    exibirPontoTourInterno();
    
    // Configurar intervalo para próximos pontos
    tourInternoIntervalo = setInterval(() => {
        tourInternoIndice++;
        if (tourInternoIndice >= tourPontosSelecionados.length) {
            tourInternoIndice = 0;
            mostrarNotificacaoPremium('Tour reiniciado!', 'info', 'fa-redo');
        }
        exibirPontoTourInterno();
        atualizarIndicadorProgressoTour(tourInternoIndice, tourPontosSelecionados.length);
    }, 7000);
}

function pararTourInterno() {
    tourInternoAtivo = false;
    if (tourInternoIntervalo) {
        clearInterval(tourInternoIntervalo);
        tourInternoIntervalo = null;
    }
    removerIndicadorProgressoTour();
    mostrarNotificacaoPremium('Tour finalizado', 'info', 'fa-stop-circle');
}

function exibirPontoTourInterno() {
    if (!tourInternoAtivo || tourPontosSelecionados.length === 0) {
        console.log('Tour não ativo ou sem pontos');
        return;
    }
    
    const ponto = tourPontosSelecionados[tourInternoIndice];
    console.log('Exibindo ponto:', ponto.nome);
    
    // Buscar marcador correspondente
    let marcador = null;
    if (window.markers && window.markers.length > 0) {
        marcador = window.markers.find(m => {
            const lat = m.getLatLng().lat;
            const lng = m.getLatLng().lng;
            return Math.abs(lat - ponto.coords[0]) < 0.0001 && 
                   Math.abs(lng - ponto.coords[1]) < 0.0001;
        });
    }
    
    if (marcador && window.map) {
        // Animar para o ponto
        window.map.flyTo(ponto.coords, 18, {
            duration: 2.5,
            easeLinearity: 0.2
        });
        
        setTimeout(() => {
            marcador.openPopup();
            adicionarBotaoStreetViewNoPopup(marcador, ponto);
            atualizarIndicadorProgressoTour(tourInternoIndice, tourPontosSelecionados.length);
        }, 2500);
    } else {
        console.error('Marcador não encontrado para:', ponto.nome);
    }
}

function adicionarBotaoStreetViewNoPopup(marcador, ponto) {
    const popup = marcador.getPopup();
    if (popup) {
        const content = popup.getContent();
        const streetViewBtn = `
            <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid rgba(255,215,0,0.3);">
                <button onclick="window.open('https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${ponto.coords[0]},${ponto.coords[1]}', '_blank')" 
                        style="width: 100%; padding: 12px; background: linear-gradient(135deg, #4285f4 0%, #34a853 100%); color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.3s; box-shadow: 0 4px 12px rgba(66, 133, 244, 0.4);"
                        onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 20px rgba(66, 133, 244, 0.6)'"
                        onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 12px rgba(66, 133, 244, 0.4)'">
                    <i class="fas fa-street-view" style="font-size: 1.2rem;"></i>
                    <span>Ver em 360° no Google Maps</span>
                </button>
                <div style="text-align: center; margin-top: 10px; font-size: 0.7rem; color: rgba(255,255,255,0.6);">
                    <i class="fas fa-route"></i> Tour ${tourInternoIndice + 1} de ${tourPontosSelecionados.length}
                </div>
            </div>
        `;
        
        // Verificar se já tem o botão para não duplicar
        if (typeof content === 'string' && !content.includes('Ver em 360°')) {
            popup.setContent(content + streetViewBtn);
        }
    }
}

function criarIndicadorProgressoTour(total) {
    const indicador = document.createElement('div');
    indicador.id = 'tourProgressIndicator';
    indicador.className = 'tour-progress-premium';
    indicador.innerHTML = `
        <div class="tour-progress-content">
            <div class="tour-progress-info">
                <i class="fas fa-route"></i>
                <span>Tour em Progresso</span>
                <span class="tour-progress-counter">1/${total}</span>
            </div>
            <div class="tour-progress-bar">
                <div class="tour-progress-fill" style="width: ${(1/total)*100}%"></div>
            </div>
            <button class="tour-progress-stop" onclick="pararTourInterno()">
                <i class="fas fa-stop"></i> Parar Tour
            </button>
        </div>
    `;
    document.body.appendChild(indicador);
    setTimeout(() => indicador.classList.add('active'), 100);
}

function atualizarIndicadorProgressoTour(indice, total) {
    const counter = document.querySelector('.tour-progress-counter');
    const fill = document.querySelector('.tour-progress-fill');
    if (counter) counter.textContent = `${indice + 1}/${total}`;
    if (fill) fill.style.width = `${((indice + 1)/total)*100}%`;
}

function removerIndicadorProgressoTour() {
    const indicador = document.getElementById('tourProgressIndicator');
    if (indicador) {
        indicador.classList.remove('active');
        setTimeout(() => indicador.remove(), 300);
    }
}

/**
 * Sistema de notificações premium melhorado
 */
function mostrarNotificacaoPremium(mensagem, tipo = 'info', icone = 'fa-info-circle') {
    const notificacao = document.createElement('div');
    notificacao.className = `notification-premium notification-${tipo}`;
    
    const cores = {
        success: 'linear-gradient(135deg, #4CAF50, #45a049)',
        info: 'linear-gradient(135deg, #2196F3, #1976D2)',
        warning: 'linear-gradient(135deg, #FF9800, #F57C00)',
        error: 'linear-gradient(135deg, #f44336, #d32f2f)'
    };
    
    notificacao.innerHTML = `
        <div class="notification-premium-icon">
            <i class="fas ${icone}"></i>
        </div>
        <div class="notification-premium-content">
            <span>${mensagem}</span>
        </div>
        <button class="notification-premium-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notificacao.style.background = cores[tipo];
    document.body.appendChild(notificacao);
    
    setTimeout(() => notificacao.classList.add('show'), 10);
    setTimeout(() => {
        notificacao.classList.remove('show');
        setTimeout(() => notificacao.remove(), 300);
    }, 5000);
}

function obterNomeCategoria(category) {
    const nomes = {
        museum: 'Museu',
        church: 'Igreja',
        palace: 'Palácio',
        monument: 'Monumento',
        culture: 'Cultura',
        library: 'Biblioteca',
        square: 'Praça',
        bunker: 'Bunker'
    };
    return nomes[category] || category;
}

//=============================================================================
// 📊 SISTEMA DE ESTATÍSTICAS DINÂMICAS
//=============================================================================

function atualizarEstatisticas() {
    const stats = calcularEstatisticas();
    animarValorEstatistica('totalLocais', stats.totalLocais);
    animarValorEstatistica('locaisVisiveis', stats.locaisVisiveis);
    
    const periodoEl = document.getElementById('periodoMaisAntigo');
    const categoriaEl = document.getElementById('categoriaPopular');
    const distanciaEl = document.getElementById('distanciaTotal');
    
    if (periodoEl) periodoEl.textContent = stats.periodoMaisAntigo || 'N/A';
    if (categoriaEl) categoriaEl.textContent = stats.categoriaPopular || 'N/A';
    if (distanciaEl) distanciaEl.textContent = stats.distanciaTotal || '0 km';
    
    atualizarGraficoCategorias(stats.categorias);
}

function calcularEstatisticas() {
    const totalLocais = pontosHistoricos.length;
    const locaisVisiveis = markers.filter(m => map.getBounds().contains(m.getLatLng())).length;
    
    // Extrair anos do campo 'periodo' em vez de 'description'
    const anos = pontosHistoricos.map(p => {
        if (!p.periodo) return null;
        const match = p.periodo.match(/\b(1[5-9]\d{2}|20\d{2})\b/);
        return match ? parseInt(match[0]) : null;
    }).filter(ano => ano !== null);
    
    const periodoMaisAntigo = anos.length > 0 ? `${Math.min(...anos)}` : 'N/A';
    
    // Usar 'categoria' em vez de 'category'
    const categorias = {};
    pontosHistoricos.forEach(p => { 
        const cat = p.categoria || p.category;
        if (cat) {
            categorias[cat] = (categorias[cat] || 0) + 1; 
        }
    });
    
    const categoriaPopular = Object.entries(categorias).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    const nomesCategorias = { 
        museum: 'Museus', 
        church: 'Igrejas', 
        palace: 'Palácios', 
        monument: 'Monumentos', 
        culture: 'Cultura', 
        library: 'Bibliotecas', 
        square: 'Praças', 
        bunker: 'Bunker' 
    };
    const categoriaNome = nomesCategorias[categoriaPopular] || categoriaPopular;
    const distanciaTotal = calcularDistanciaTotalTour();
    
    return { 
        totalLocais, 
        locaisVisiveis, 
        periodoMaisAntigo, 
        categoriaPopular: categoriaNome === 'N/A' ? 'N/A' : categoriaNome, 
        distanciaTotal: `${distanciaTotal.toFixed(1)} km`, 
        categorias 
    };
}

function animarValorEstatistica(elementId, valorFinal) {
    const elemento = document.getElementById(elementId);
    if (!elemento) return;
    const valorInicial = parseInt(elemento.textContent) || 0;
    const duracao = 1000;
    const passos = 30;
    const incremento = (valorFinal - valorInicial) / passos;
    let valorAtual = valorInicial;
    let passo = 0;
    const intervalo = setInterval(() => {
        passo++;
        valorAtual += incremento;
        if (passo >= passos) {
            elemento.textContent = valorFinal;
            clearInterval(intervalo);
        } else {
            elemento.textContent = Math.round(valorAtual);
        }
    }, duracao / passos);
}

function atualizarGraficoCategorias(categorias) {
    const container = document.getElementById('categoryBars');
    if (!container) return;
    const total = Object.values(categorias).reduce((a, b) => a + b, 0);
    const nomesCategorias = { museum: 'Museus', church: 'Igrejas', palace: 'Palácios', monument: 'Monumentos', culture: 'Cultura', library: 'Bibliotecas', square: 'Praças', bunker: 'Bunker' };
    container.innerHTML = '';
    Object.entries(categorias).sort((a, b) => b[1] - a[1]).forEach(([categoria, qtd]) => {
        const porcentagem = ((qtd / total) * 100).toFixed(0);
        const barDiv = document.createElement('div');
        barDiv.className = 'chart-bar';
        barDiv.setAttribute('data-category', categoria);
        barDiv.innerHTML = `<span class="chart-bar-label">${nomesCategorias[categoria] || categoria}</span><div class="chart-bar-track"><div class="chart-bar-fill" style="width: ${porcentagem}%"><span class="chart-bar-value">${qtd}</span></div></div>`;
        container.appendChild(barDiv);
    });
}

function calcularDistanciaTotalTour() {
    if (pontosHistoricos.length < 2) return 0;
    let distanciaTotal = 0;
    for (let i = 0; i < pontosHistoricos.length - 1; i++) {
        const p1 = pontosHistoricos[i].coords;
        const p2 = pontosHistoricos[i + 1].coords;
        const R = 6371;
        const dLat = (p2[0] - p1[0]) * Math.PI / 180;
        const dLon = (p2[1] - p1[1]) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(p1[0] * Math.PI / 180) * Math.cos(p2[0] * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        distanciaTotal += R * c;
    }
    return distanciaTotal;
}

if (typeof map !== 'undefined') {
    map.on('moveend', () => { setTimeout(atualizarEstatisticas, 300); });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof pontosHistoricos !== 'undefined' && typeof atualizarEstatisticas === 'function') {
            atualizarEstatisticas();
        }
    }, 2000);
});

//=============================================================================
// 🔧 CORREÇÕES E INICIALIZAÇÕES FINAIS
//=============================================================================

// Garantir que markers e map estão disponíveis globalmente
window.markers = window.markers || [];
window.map = window.map || null;

// Função para inicializar estatísticas após o mapa carregar
function inicializarEstatisticasComMapa() {
    if (typeof map !== 'undefined' && map && typeof pontosHistoricos !== 'undefined') {
        console.log('✅ Inicializando estatísticas do mapa...');
        atualizarEstatisticas();
        
        // Adicionar listener para atualizar ao mover
        map.on('moveend', () => {
            setTimeout(atualizarEstatisticas, 300);
        });
        
        // Adicionar listener para atualizar ao fazer zoom
        map.on('zoomend', () => {
            setTimeout(atualizarEstatisticas, 300);
        });
    } else {
        console.log('⏳ Aguardando mapa carregar...');
        setTimeout(inicializarEstatisticasComMapa, 500);
    }
}

// Chamar inicialização quando document estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(inicializarEstatisticasComMapa, 1000);
    });
} else {
    setTimeout(inicializarEstatisticasComMapa, 1000);
}

// Corrigir referências de categoria para filtros
function corrigirFiltros() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        if (!btn.hasAttribute('onclick')) {
            const category = btn.textContent.toLowerCase().trim();
            console.log('Adicionando onclick para:', category);
        }
    });
}

setTimeout(corrigirFiltros, 500);


