/*
=====================================================================================
🌟 JAVASCRIPT PREMIUM - HISTÓRIA DO RIO DE JANEIRO 🌟
=====================================================================================
Desenvolvido por: Carlos Antonio de Oliveira Piquet
CNPJ: 27.658.099/0001-70
Professor de História - Faculdade Simonsen
E-mail: carlospiquet.projetos@gmail.com

Recursos avançados para uma experiência educativa premium
=====================================================================================
*/

// ===== CLASSE PRINCIPAL PREMIUM =====
class RioHistoryPremium {
    constructor() {
        this.bookmarks = JSON.parse(localStorage.getItem('rioHistoryBookmarks')) || [];
        this.currentTheme = localStorage.getItem('rioHistoryTheme') || 'light';
        this.userProgress = JSON.parse(localStorage.getItem('rioHistoryProgress')) || {};
        this.achievements = JSON.parse(localStorage.getItem('rioHistoryAchievements')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.trackUserProgress();
        this.checkAchievements();
    }

    // ===== SISTEMA DE CONQUISTAS =====
    checkAchievements() {
        const achievementsList = [
            {
                id: 'first_visit',
                name: 'Primeiro Visitante',
                description: 'Visitou a página pela primeira vez',
                icon: '👋',
                check: () => !this.achievements.includes('first_visit')
            },
            {
                id: 'bookmark_master',
                name: 'Colecionador',
                description: 'Adicionou 3 períodos aos favoritos',
                icon: '📚',
                check: () => this.bookmarks.length >= 3 && !this.achievements.includes('bookmark_master')
            },
            {
                id: 'scroll_explorer',
                name: 'Explorador',
                description: 'Rolou até o final da página',
                icon: '🧭',
                check: () => this.userProgress.scrolledToEnd && !this.achievements.includes('scroll_explorer')
            },
            {
                id: 'audio_listener',
                name: 'Ouvinte Atento',
                description: 'Reproduziu áudio de um período',
                icon: '🎵',
                check: () => this.userProgress.playedAudio && !this.achievements.includes('audio_listener')
            },
            {
                id: 'time_traveler',
                name: 'Viajante do Tempo',
                description: 'Visitou todos os períodos históricos',
                icon: '⏰',
                check: () => this.userProgress.periodsVisited >= 6 && !this.achievements.includes('time_traveler')
            }
        ];

        achievementsList.forEach(achievement => {
            if (achievement.check()) {
                this.unlockAchievement(achievement);
            }
        });
    }

    unlockAchievement(achievement) {
        this.achievements.push(achievement.id);
        localStorage.setItem('rioHistoryAchievements', JSON.stringify(this.achievements));
        
        this.showNotification(
            `${achievement.icon} Conquista Desbloqueada!`,
            `${achievement.name}: ${achievement.description}`,
            'achievement'
        );
    }

    // ===== SISTEMA DE NOTIFICAÇÕES =====
    showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `premium-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;

        document.body.appendChild(notification);

        // Auto remover após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);

        // Animar entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
    }

    // ===== RASTREAMENTO DE PROGRESSO =====
    trackUserProgress() {
        // Rastrear scroll até o final
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            maxScroll = Math.max(maxScroll, scrollPercent);
            
            if (scrollPercent >= 95 && !this.userProgress.scrolledToEnd) {
                this.userProgress.scrolledToEnd = true;
                localStorage.setItem('rioHistoryProgress', JSON.stringify(this.userProgress));
                this.checkAchievements();
            }
        });

        // Rastrear períodos visitados
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.classList.contains('period')) {
                    this.userProgress.periodsVisited = (this.userProgress.periodsVisited || 0) + 1;
                    localStorage.setItem('rioHistoryProgress', JSON.stringify(this.userProgress));
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.period').forEach(period => {
            observer.observe(period);
        });
    }

    // ===== SISTEMA AVANÇADO DE BUSCA =====
    initializeSearch() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'premium-search';
        searchContainer.innerHTML = `
            <div class="search-toggle" onclick="this.parentElement.classList.toggle('active')">
                <i class="fas fa-search"></i>
            </div>
            <div class="search-panel">
                <input type="text" placeholder="Buscar na história..." class="search-input">
                <div class="search-results"></div>
            </div>
        `;

        document.body.appendChild(searchContainer);

        const searchInput = searchContainer.querySelector('.search-input');
        const searchResults = searchContainer.querySelector('.search-results');

        searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value, searchResults);
        });
    }

    performSearch(query, resultsContainer) {
        if (query.length < 3) {
            resultsContainer.innerHTML = '';
            return;
        }

        const searchableElements = document.querySelectorAll('.period-description, .event-description, .character-bio');
        const results = [];

        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                const period = element.closest('.period');
                const periodTitle = period.querySelector('.period-title').textContent;
                
                results.push({
                    title: periodTitle,
                    snippet: this.extractSnippet(text, query),
                    element: period
                });
            }
        });

        this.displaySearchResults(results, resultsContainer);
    }

    extractSnippet(text, query, length = 100) {
        const index = text.toLowerCase().indexOf(query.toLowerCase());
        const start = Math.max(0, index - length / 2);
        const end = Math.min(text.length, start + length);
        return '...' + text.substring(start, end) + '...';
    }

    displaySearchResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = '<div class="no-results">Nenhum resultado encontrado</div>';
            return;
        }

        container.innerHTML = results.map(result => `
            <div class="search-result" onclick="this.scrollToResult('${result.element.id}')">
                <div class="result-title">${result.title}</div>
                <div class="result-snippet">${result.snippet}</div>
            </div>
        `).join('');
    }

    // ===== MODO DE ESTUDO AVANÇADO =====
    enableStudyMode() {
        document.body.classList.add('study-mode');
        
        // Adicionar controles de estudo
        const studyControls = document.createElement('div');
        studyControls.className = 'study-controls';
        studyControls.innerHTML = `
            <button onclick="rioHistoryPremium.toggleHighlights()">
                <i class="fas fa-highlighter"></i> Destaques
            </button>
            <button onclick="rioHistoryPremium.toggleNotes()">
                <i class="fas fa-sticky-note"></i> Notas
            </button>
            <button onclick="rioHistoryPremium.generateSummary()">
                <i class="fas fa-file-alt"></i> Resumo
            </button>
            <button onclick="rioHistoryPremium.exportContent()">
                <i class="fas fa-download"></i> Exportar
            </button>
        `;

        document.body.appendChild(studyControls);
    }

    // ===== SISTEMA DE EXPORTAÇÃO =====
    exportContent() {
        const content = this.generateStudyGuide();
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'historia-rio-janeiro-resumo.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification(
            '📄 Conteúdo Exportado!',
            'Seu resumo foi baixado com sucesso.',
            'success'
        );
    }

    generateStudyGuide() {
        let content = '='.repeat(60) + '\n';
        content += 'HISTÓRIA COMPLETA DO RIO DE JANEIRO\n';
        content += 'Guia de Estudos Premium\n';
        content += '='.repeat(60) + '\n\n';

        document.querySelectorAll('.period').forEach(period => {
            const title = period.querySelector('.period-title').textContent;
            const years = period.querySelector('.period-years').textContent;
            const description = period.querySelector('.period-description').textContent;
            
            content += `${title}\n`;
            content += `${years}\n`;
            content += '-'.repeat(40) + '\n';
            content += `${description}\n\n`;

            const events = period.querySelectorAll('.events-list li');
            if (events.length > 0) {
                content += 'PRINCIPAIS EVENTOS:\n';
                events.forEach(event => {
                    const year = event.querySelector('.event-year').textContent;
                    const desc = event.querySelector('.event-description').textContent;
                    content += `• ${year}: ${desc}\n`;
                });
                content += '\n';
            }

            const characters = period.querySelectorAll('.character');
            if (characters.length > 0) {
                content += 'PERSONAGENS IMPORTANTES:\n';
                characters.forEach(char => {
                    const name = char.querySelector('.character-name').textContent;
                    const role = char.querySelector('.character-role').textContent;
                    const bio = char.querySelector('.character-bio').textContent;
                    content += `• ${name} (${role}): ${bio}\n`;
                });
                content += '\n';
            }

            content += '='.repeat(60) + '\n\n';
        });

        content += 'Gerado em: ' + new Date().toLocaleString('pt-BR') + '\n';
        content += 'Desenvolvido por: Prof. Carlos Antonio de Oliveira Piquet\n';
        content += 'CNPJ: 27.658.099/0001-70\n';

        return content;
    }

    // ===== INICIALIZAÇÃO DE COMPONENTES =====
    initializeComponents() {
        this.initializeSearch();
        this.createFloatingMenu();
        this.setupKeyboardShortcuts();
        this.initializeAnalytics();
    }

    createFloatingMenu() {
        const menu = document.createElement('div');
        menu.className = 'floating-menu';
        menu.innerHTML = `
            <div class="menu-toggle">
                <i class="fas fa-cog"></i>
            </div>
            <div class="menu-items">
                <button onclick="rioHistoryPremium.enableStudyMode()" title="Modo Estudo">
                    <i class="fas fa-graduation-cap"></i>
                </button>
                <button onclick="rioHistoryPremium.toggleBookmarksPanel()" title="Favoritos">
                    <i class="fas fa-bookmark"></i>
                </button>
                <button onclick="rioHistoryPremium.openSettings()" title="Configurações">
                    <i class="fas fa-sliders-h"></i>
                </button>
                <button onclick="rioHistoryPremium.showHelp()" title="Ajuda Premium">
                    <i class="fas fa-question-circle"></i>
                </button>
            </div>
        `;

        document.body.appendChild(menu);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'f':
                        e.preventDefault();
                        document.querySelector('.premium-search').classList.add('active');
                        document.querySelector('.search-input').focus();
                        break;
                    case 's':
                        e.preventDefault();
                        this.enableStudyMode();
                        break;
                    case 'b':
                        e.preventDefault();
                        this.toggleBookmarksPanel();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportContent();
                        break;
                }
            }
        });
    }

    // ===== ANALYTICS SIMPLES =====
    initializeAnalytics() {
        const sessionData = {
            startTime: Date.now(),
            pageViews: 1,
            interactions: 0,
            timeSpent: 0
        };

        // Rastrear interações
        document.addEventListener('click', () => {
            sessionData.interactions++;
        });

        // Salvar dados da sessão ao sair
        window.addEventListener('beforeunload', () => {
            sessionData.timeSpent = Date.now() - sessionData.startTime;
            localStorage.setItem('rioHistorySession', JSON.stringify(sessionData));
        });
    }

    setupEventListeners() {
        // Listeners específicos da classe premium
        window.addEventListener('load', () => {
            this.checkAchievements();
        });
    }
}

// ===== INSTÂNCIA GLOBAL =====
let rioHistoryPremium;

document.addEventListener('DOMContentLoaded', () => {
    rioHistoryPremium = new RioHistoryPremium();
    
    // Adicionar estilos CSS para os novos componentes
    const premiumStyles = document.createElement('style');
    premiumStyles.textContent = `
        .premium-notification {
            position: fixed;
            top: 20px;
            right: -400px;
            width: 350px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            padding: 1.5rem;
            z-index: 10001;
            transition: right 0.3s ease;
            border-left: 4px solid #3498db;
        }

        .premium-notification.achievement {
            border-left-color: #f39c12;
            background: linear-gradient(135deg, #fff, #fef9e7);
        }

        .premium-notification.success {
            border-left-color: #27ae60;
            background: linear-gradient(135deg, #fff, #e8f8f5);
        }

        .premium-notification.show {
            right: 20px;
        }

        .notification-title {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 0.5rem;
        }

        .notification-message {
            color: #7f8c8d;
            font-size: 0.9rem;
        }

        .notification-close {
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #bdc3c7;
            cursor: pointer;
        }

        .premium-search {
            position: fixed;
            top: 100px;
            right: -400px;
            width: 350px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 1001;
            transition: right 0.3s ease;
        }

        .premium-search.active {
            right: 20px;
        }

        .search-toggle {
            position: absolute;
            left: -50px;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            background: #3498db;
            color: white;
            border-radius: 50% 0 0 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }

        .search-panel {
            padding: 1.5rem;
        }

        .search-input {
            width: 100%;
            padding: 12px;
            border: 2px solid #ecf0f1;
            border-radius: 10px;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.3s ease;
        }

        .search-input:focus {
            border-color: #3498db;
        }

        .search-results {
            max-height: 300px;
            overflow-y: auto;
            margin-top: 1rem;
        }

        .search-result {
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            cursor: pointer;
            transition: background 0.3s ease;
        }

        .search-result:hover {
            background: #f8f9fa;
        }

        .result-title {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 0.5rem;
        }

        .result-snippet {
            color: #7f8c8d;
            font-size: 0.9rem;
        }

        .floating-menu {
            position: fixed;
            bottom: 100px;
            left: 30px;
            z-index: 1000;
        }

        .menu-toggle {
            width: 60px;
            height: 60px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .menu-toggle:hover {
            transform: scale(1.1);
        }

        .menu-items {
            position: absolute;
            bottom: 70px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            gap: 10px;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
        }

        .floating-menu:hover .menu-items {
            opacity: 1;
            pointer-events: all;
        }

        .menu-items button {
            width: 50px;
            height: 50px;
            background: rgba(255,255,255,0.9);
            border: none;
            border-radius: 50%;
            color: #333;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        }

        .menu-items button:hover {
            background: white;
            transform: scale(1.1);
        }

        .study-controls {
            position: fixed;
            top: 50%;
            left: -200px;
            transform: translateY(-50%);
            background: white;
            padding: 1rem;
            border-radius: 0 15px 15px 0;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            transition: left 0.3s ease;
            z-index: 1001;
        }

        .study-mode .study-controls {
            left: 0;
        }

        .study-controls button {
            display: block;
            width: 100%;
            padding: 10px 15px;
            margin-bottom: 10px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: left;
        }

        .study-controls button:hover {
            background: #e9ecef;
            transform: translateX(5px);
        }
    `;
    
    document.head.appendChild(premiumStyles);
});

// ===== FUNÇÕES GLOBAIS PARA COMPATIBILIDADE =====
function toggleBookmark(id, title) {
    if (rioHistoryPremium) {
        rioHistoryPremium.toggleBookmark(id, title);
    }
}

function toggleBookmarksPanel() {
    document.getElementById('bookmarksPanel').classList.toggle('open');
}