// Variabili globali
let currentStep = 1;
let totalSteps = 3;
let heroSlideIndex = 1;
let infoSlideIndex = 0;
let schoolSlideIndex = 0;
let schoolsData = [];

// Algoritmo di scoring
class OrientamentoAlgorithm {
    constructor() {
        this.pathMappings = {
            liceoClassico: { 
                name: "Liceo Classico", 
                keywords: ["LICEO CLASSICO", "CLASSICO"],
                description: "Perfetto per chi ama letteratura, filosofia, storia antica e lingue classiche"
            },
            liceoScientifico: { 
                name: "Liceo Scientifico", 
                keywords: ["LICEO SCIENTIFICO", "SCIENTIFICO"],
                description: "Ideale per chi ha passione per matematica, fisica, scienze e ricerca"
            },
            istitutoTecnico: { 
                name: "Istituto Tecnico", 
                keywords: ["ISTITUTO TECNICO", "TECNICO", "TECNOLOGICO", "INDUSTRIALE"],
                description: "Ottimo per chi vuole unire teoria e pratica in ambito tecnologico"
            },
            istitutoProfessionale: { 
                name: "Istituto Professionale", 
                keywords: ["ISTITUTO PROFESSIONALE", "PROFESSIONALE"],
                description: "Perfetto per entrare subito nel mondo del lavoro con competenze specifiche"
            },
            liceoArtistico: { 
                name: "Liceo Artistico", 
                keywords: ["LICEO ARTISTICO", "ARTISTICO"],
                description: "Ideale per chi ha creatività e passione per l'arte e il design"
            }
        };
    }

    calculateScores(responses) {
        let scores = {
            liceoClassico: 0,
            liceoScientifico: 0,
            istitutoTecnico: 0,
            istitutoProfessionale: 0,
            liceoArtistico: 0
        };

        const sport = parseInt(responses.sport) || 0;
        const hobbyLavoro = parseInt(responses.hobbyLavoro) || 0;
        const lavoro = parseInt(responses.lavoro) || 0;
        const teoricaPratica = parseInt(responses.teoricaPratica) || 0;
        const ambiente = parseInt(responses.ambiente) || 0;
        const ambizioni = parseInt(responses.ambizioni) || 0;
        const ambizione = parseInt(responses.ambizione) || 0;
        const determinazione = parseInt(responses.determinazione) || 0;
        const argomenti = parseInt(responses.argomenti) || 0;
        const materia = parseInt(responses.materia) || 0;
        const apprendimento = parseInt(responses.apprendimento) || 0;

        // Scoring sport/attività
        switch(sport) {
            case 1: scores.istitutoTecnico += 2; scores.istitutoProfessionale += 2; break;
            case 2: scores.liceoScientifico += 2; break;
            case 3: scores.liceoArtistico += 4; break;
            case 4: scores.istitutoTecnico += 4; scores.liceoScientifico += 2; break;
        }

        if (hobbyLavoro === 1) {
            scores.liceoArtistico += 3;
            scores.istitutoTecnico += 2;
            scores.istitutoProfessionale += 3;
        }

        switch(lavoro) {
            case 1: scores.istitutoTecnico += 2; scores.istitutoProfessionale += 2; break;
            case 2: scores.liceoClassico += 2; scores.liceoScientifico += 2; break;
        }

        switch(teoricaPratica) {
            case 1: scores.liceoClassico += 4; scores.liceoScientifico += 3; break;
            case 2: scores.liceoClassico += 3; scores.liceoScientifico += 4; break;
            case 3: scores.liceoScientifico += 2; scores.istitutoTecnico += 2; scores.liceoArtistico += 2; break;
            case 4: scores.istitutoTecnico += 4; scores.liceoArtistico += 3; scores.istitutoProfessionale += 2; break;
            case 5: scores.istitutoProfessionale += 4; scores.istitutoTecnico += 3; break;
        }

        switch(ambiente) {
            case 1: scores.istitutoTecnico += 3; scores.liceoScientifico += 2; break;
            case 2: scores.liceoClassico += 4; break;
            case 3: scores.istitutoProfessionale += 2; break;
            case 4: scores.istitutoTecnico += 3; break;
        }

        switch(ambizioni) {
            case 1: scores.liceoScientifico += 3; scores.istitutoTecnico += 2; break;
            case 2: scores.liceoClassico += 2; scores.liceoArtistico += 2; break;
            case 4: scores.liceoClassico += 2; scores.istitutoProfessionale += 3; break;
        }

        switch(argomenti) {
            case 1: scores.istitutoTecnico += 4; scores.liceoScientifico += 3; break;
            case 2: scores.liceoArtistico += 4; break;
            case 3: scores.liceoScientifico += 4; break;
            case 4: scores.liceoClassico += 3; break;
            case 5: scores.istitutoTecnico += 2; break;
        }

        switch(materia) {
            case 1: scores.liceoScientifico += 4; scores.istitutoTecnico += 2; break;
            case 2: scores.liceoClassico += 4; break;
            case 3: scores.liceoScientifico += 3; break;
            case 4: scores.liceoClassico += 2; break;
            case 5: scores.liceoArtistico += 4; break;
            case 6: scores.istitutoProfessionale += 2; break;
        }

        switch(apprendimento) {
            case 1: scores.liceoClassico += 3; break;
            case 2: scores.liceoScientifico += 3; scores.istitutoTecnico += 3; break;
            case 3: scores.liceoClassico += 2; break;
            case 4: scores.istitutoTecnico += 3; break;
        }

        if (ambizione >= 4) {
            scores.liceoScientifico += 2;
            scores.istitutoTecnico += 1;
        }
        
        if (determinazione >= 4) {
            scores.liceoScientifico += 1;
            scores.liceoClassico += 1;
        }

        return scores;
    }

    getRecommendedPath(responses) {
        const scores = this.calculateScores(responses);
        
        let maxScore = -1;
        let recommendedPath = null;
        
        Object.keys(scores).forEach(path => {
            if (scores[path] > maxScore) {
                maxScore = scores[path];
                recommendedPath = path;
            }
        });

        if (maxScore === 0 || !recommendedPath) {
            recommendedPath = this.getFallbackRecommendation(responses);
        }

        return {
            path: recommendedPath,
            scores: scores,
            confidence: this.calculateConfidence(scores)
        };
    }

    getFallbackRecommendation(responses) {
        const teoricaPratica = parseInt(responses.teoricaPratica) || 3;
        const argomenti = parseInt(responses.argomenti) || 1;
        
        if (teoricaPratica <= 2) {
            return argomenti === 2 ? 'liceoArtistico' : 'liceoClassico';
        } else if (teoricaPratica >= 4) {
            return argomenti === 1 ? 'istitutoTecnico' : 'istitutoProfessionale';
        } else {
            return 'liceoScientifico';
        }
    }

    calculateConfidence(scores) {
        const values = Object.values(scores);
        const max = Math.max(...values);
        const sortedValues = values.sort((a, b) => b - a);
        const secondMax = sortedValues[1] || 0;
        
        if (max === 0) return 50;
        
        const confidence = Math.min(100, Math.max(50, ((max - secondMax) / max) * 100));
        return Math.round(confidence);
    }
}

const algorithm = new OrientamentoAlgorithm();

// Hero Carousel Functions
function showHeroSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    
    if (n > slides.length) { heroSlideIndex = 1; }
    if (n < 1) { heroSlideIndex = slides.length; }
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[heroSlideIndex - 1].classList.add('active');
    dots[heroSlideIndex - 1].classList.add('active');
}

function currentSlide(n) {
    heroSlideIndex = n;
    showHeroSlide(heroSlideIndex);
}

function autoPlayHero() {
    heroSlideIndex++;
    showHeroSlide(heroSlideIndex);
}

// Quiz Functions
function changeStep(direction) {
    const currentPage = document.getElementById(`page-${currentStep}`);
    
    if (direction === 1) {
        if (!validateCurrentStep()) return;
        
        if (currentStep < totalSteps) {
            currentPage.classList.remove('active');
            currentStep++;
            document.getElementById(`page-${currentStep}`).classList.add('active');
            updateProgressAndButtons();
        } else {
            processResults();
        }
    } else {
        if (currentStep > 1) {
            currentPage.classList.remove('active');
            currentStep--;
            document.getElementById(`page-${currentStep}`).classList.add('active');
            updateProgressAndButtons();
        }
    }
}

function validateCurrentStep() {
    const currentPage = document.getElementById(`page-${currentStep}`);
    const requiredFields = currentPage.querySelectorAll('[required]');
    
    for (let field of requiredFields) {
        if (!field.value || field.value === '') {
            field.focus();
            field.style.borderColor = '#EF4444';
            
            let errorMsg = field.parentNode.querySelector('.error-message');
            if (!errorMsg) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.style.color = '#EF4444';
                errorMsg.style.fontSize = '0.875rem';
                errorMsg.style.marginTop = '0.25rem';
                errorMsg.textContent = 'Questo campo è obbligatorio';
                field.parentNode.appendChild(errorMsg);
            }
            
            setTimeout(() => {
                field.style.borderColor = '';
                if (errorMsg) errorMsg.remove();
            }, 3000);
            return false;
        }
    }
    return true;
}

function updateProgressAndButtons() {
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        if (index < currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
    
    if (nextBtn) {
        if (currentStep === totalSteps) {
            nextBtn.innerHTML = '<i class="fas fa-chart-line"></i> Ottieni risultati';
        } else {
            nextBtn.innerHTML = 'Successivo <i class="fas fa-arrow-right"></i>';
        }
    }

    const titles = [
        'Interessi e Personalità',
        'Ambizioni e Obiettivi', 
        'Interessi Accademici e Dati'
    ];
    
    const titleElement = document.getElementById('quiz-title');
    if (titleElement && titles[currentStep - 1]) {
        titleElement.textContent = titles[currentStep - 1];
    }
}

function collectResponses() {
    const responses = {};
    const fields = ['sport', 'hobbyLavoro', 'lavoro', 'teoricaPratica', 'ambiente', 
                    'ambizioni', 'sogni', 'ambizione', 'determinazione', 'futuro', 
                    'argomenti', 'materia', 'apprendimento', 'regione', 'provincia'];
    
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            responses[field] = element.value;
        }
    });
    
    return responses;
}

async function processResults() {
    const responses = collectResponses();
    
    if (!responses.regione || !responses.provincia) {
        alert('Per favore completa tutti i campi obbligatori');
        return;
    }
    
    const recommendation = algorithm.getRecommendedPath(responses);
    
    const quizContainer = document.querySelector('.quiz-container');
    const resultsContainer = document.getElementById('results');
    
    if (quizContainer) quizContainer.style.display = 'none';
    if (resultsContainer) resultsContainer.classList.add('show');
    
    const pathInfo = algorithm.pathMappings[recommendation.path];
    const recommendedTypeElement = document.getElementById('recommended-type');
    
    if (recommendedTypeElement && pathInfo) {
        recommendedTypeElement.innerHTML = `
            <div style="font-size: 1.75rem; font-weight: 700;">${pathInfo.name}</div>
            <div style="font-size: 1.1rem; margin-top: 1rem; opacity: 0.95;">
                ${pathInfo.description}
            </div>
            <div style="font-size: 0.95rem; margin-top: 1rem; opacity: 0.9;">
                Confidenza: ${recommendation.confidence}%
            </div>
        `;
    }
    
    // Ricerca scuole tramite PHP
    await searchSchools(responses.regione, responses.provincia, pathInfo.keywords);
    
    if (resultsContainer) {
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

async function searchSchools(regione, provincia, keywords) {
    try {
        const response = await fetch('logic/index.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `regione=${encodeURIComponent(regione)}&provincia=${encodeURIComponent(provincia)}&keywords=${encodeURIComponent(keywords.join(','))}`
        });
        
        const data = await response.json();
        schoolsData = data.schools || [];
        displaySchools(schoolsData);
    } catch (error) {
        console.error('Errore nella ricerca delle scuole:', error);
        displaySchools([]);
    }
}

function displaySchools(schools) {
    const schoolsCarousel = document.getElementById('schools-carousel');
    const indicators = document.getElementById('school-indicators');
    
    if (!schoolsCarousel) return;
    
    schoolSlideIndex = 0;
    
    schoolsCarousel.innerHTML = schools.map((school, index) => `
        <div class="school-card" style="display: ${index === 0 ? 'flex' : 'none'};">
            <div>
                <div class="school-name">${school.denominazione || 'Nome non disponibile'}</div>
                <div class="school-address">
                    <i class="fas fa-map-marker-alt"></i> 
                    ${school.indirizzo || 'Indirizzo non disponibile'}, ${school.provincia || 'N/D'}
                </div>
                <div style="margin: 1rem 0; padding: 0.75rem; background: white; border-radius: 8px; font-size: 0.9rem;">
                    <strong>Tipologia:</strong> ${school.tipologia || 'Non specificata'}
                </div>
            </div>
            <div class="school-info">
                <span>
                    <i class="fas fa-envelope"></i> 
                    ${school.email && school.email !== 'Non Disponibile' ? 'Email disponibile' : 'Email N/D'}
                </span>
                <span>
                    <i class="fas fa-globe"></i> 
                    ${school.sito && school.sito !== 'Non Disponibile' ? 'Sito web' : 'Sito N/D'}
                </span>
            </div>
        </div>
    `).join('');
    
    if (indicators) {
        indicators.innerHTML = schools.map((_, index) => 
            `<span class="indicator ${index === 0 ? 'active' : ''}" onclick="currentSchool(${index})"></span>`
        ).join('');
    }
}

function prevSchool() {
    const cards = document.querySelectorAll('.schools-carousel-container .school-card');
    if (cards.length === 0) return;
    
    cards[schoolSlideIndex].style.display = 'none';
    schoolSlideIndex = (schoolSlideIndex - 1 + cards.length) % cards.length;
    cards[schoolSlideIndex].style.display = 'flex';
    updateSchoolIndicators();
}

function nextSchool() {
    const cards = document.querySelectorAll('.schools-carousel-container .school-card');
    if (cards.length === 0) return;
    
    cards[schoolSlideIndex].style.display = 'none';
    schoolSlideIndex = (schoolSlideIndex + 1) % cards.length;
    cards[schoolSlideIndex].style.display = 'flex';
    updateSchoolIndicators();
}

function currentSchool(index) {
    const cards = document.querySelectorAll('.schools-carousel-container .school-card');
    if (cards.length === 0) return;
    
    cards[schoolSlideIndex].style.display = 'none';
    schoolSlideIndex = index;
    cards[schoolSlideIndex].style.display = 'flex';
    updateSchoolIndicators();
}

function updateSchoolIndicators() {
    const indicators = document.querySelectorAll('#school-indicators .indicator');
    indicators.forEach((indicator, index) => {
        if (index === schoolSlideIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Info Carousel Functions
function prevInfo() {
    const slides = document.querySelectorAll('.info-slide');
    slides[infoSlideIndex].classList.remove('active');
    infoSlideIndex = (infoSlideIndex - 1 + slides.length) % slides.length;
    slides[infoSlideIndex].classList.add('active');
    updateInfoIndicators();
}

function nextInfo() {
    const slides = document.querySelectorAll('.info-slide');
    slides[infoSlideIndex].classList.remove('active');
    infoSlideIndex = (infoSlideIndex + 1) % slides.length;
    slides[infoSlideIndex].classList.add('active');
    updateInfoIndicators();
}

function currentInfo(index) {
    const slides = document.querySelectorAll('.info-slide');
    slides[infoSlideIndex].classList.remove('active');
    infoSlideIndex = index;
    slides[infoSlideIndex].classList.add('active');
    updateInfoIndicators();
}

function updateInfoIndicators() {
    const indicators = document.querySelectorAll('#info-indicators .indicator');
    indicators.forEach((indicator, index) => {
        if (index === infoSlideIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function resetQuiz() {
    currentStep = 1;
    
    const form = document.getElementById('orientamento-quiz');
    if (form) form.reset();
    
    const quizContainer = document.querySelector('.quiz-container');
    const resultsContainer = document.getElementById('results');
    
    if (quizContainer) quizContainer.style.display = 'block';
    if (resultsContainer) resultsContainer.classList.remove('show');
    
    document.querySelectorAll('.question-page').forEach(page => page.classList.remove('active'));
    const firstPage = document.getElementById('page-1');
    if (firstPage) firstPage.classList.add('active');
    
    updateProgressAndButtons();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Inizializzazione
document.addEventListener('DOMContentLoaded', function() {
    console.log('NextStep inizializzato');
    
    updateProgressAndButtons();
    showHeroSlide(heroSlideIndex);
    
    // Auto-play hero carousel ogni 5 secondi
    setInterval(autoPlayHero, 5000);
    
    // Event listener per range input
    const ambitionRange = document.getElementById('ambizione');
    if (ambitionRange) {
        ambitionRange.addEventListener('input', function() {
            const labels = ['Per niente', 'Poco', 'Moderatamente', 'Molto', 'Estremamente'];
            const value = parseInt(this.value) - 1;
            if (labels[value]) {
                console.log(`Ambizione: ${labels[value]}`);
            }
        });
    }
});