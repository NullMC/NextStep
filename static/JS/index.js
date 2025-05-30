// Dataset delle scuole - inizializzato vuoto, verrà popolato dal CSV
let schoolsDataset = [];


let currentStep = 1;
let totalSteps = 3;

// Avanzato algoritmo di scoring per il percorso di orientamento
class OrientamentoAlgorithm {
    constructor() {
        // Matrice di pesi per diversi fattori
        this.weights = {
            sport: { liceoClassico: 0.2, liceoScientifico: 0.3, istitutoTecnico: 0.4, istitutoProfessionale: 0.5, liceoArtistico: 0.3 },
            hobbyLavoro: { liceoClassico: 0.1, liceoScientifico: 0.2, istitutoTecnico: 0.8, istitutoProfessionale: 0.9, liceoArtistico: 0.7 },
            lavoro: { liceoClassico: 0.3, liceoScientifico: 0.4, istitutoTecnico: 0.6, istitutoProfessionale: 0.5, liceoArtistico: 0.4 },
            teoricaPratica: { liceoClassico: 1.0, liceoScientifico: 0.8, istitutoTecnico: 0.3, istitutoProfessionale: 0.1, liceoArtistico: 0.5 },
            ambiente: { liceoClassico: 0.8, liceoScientifico: 0.6, istitutoTecnico: 0.4, istitutoProfessionale: 0.2, liceoArtistico: 0.3 },
            ambizioni: { liceoClassico: 0.7, liceoScientifico: 0.8, istitutoTecnico: 0.6, istitutoProfessionale: 0.4, liceoArtistico: 0.5 },
            sogni: { liceoClassico: 0.6, liceoScientifico: 0.7, istitutoTecnico: 0.8, istitutoProfessionale: 0.9, liceoArtistico: 0.8 },
            ambizione: { liceoClassico: 0.6, liceoScientifico: 0.8, istitutoTecnico: 0.7, istitutoProfessionale: 0.5, liceoArtistico: 0.6 },
            determinazione: { liceoClassico: 0.7, liceoScientifico: 0.8, istitutoTecnico: 0.7, istitutoProfessionale: 0.6, liceoArtistico: 0.6 },
            futuro: { liceoClassico: 0.5, liceoScientifico: 0.6, istitutoTecnico: 0.7, istitutoProfessionale: 0.6, liceoArtistico: 0.7 },
            argomenti: { liceoClassico: 0.2, liceoScientifico: 0.9, istitutoTecnico: 0.8, istitutoProfessionale: 0.4, liceoArtistico: 0.3 },
            materia: { liceoClassico: 0.8, liceoScientifico: 0.9, istitutoTecnico: 0.6, istitutoProfessionale: 0.4, liceoArtistico: 0.7 },
            apprendimento: { liceoClassico: 0.9, liceoScientifico: 0.7, istitutoTecnico: 0.5, istitutoProfessionale: 0.3, liceoArtistico: 0.6 }
        };

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

        // Calcolo avanzato basato su risposte specifiche
        Object.keys(responses).forEach(key => {
            if (this.weights[key]) {
                const responseValue = parseInt(responses[key]) || 0;
                
                Object.keys(scores).forEach(path => {
                    let multiplier = 1;
                    
                    // Logica specifica per ogni domanda
                    switch(key) {
                        case 'sport':
                            if (responseValue === 3) multiplier = path === 'liceoArtistico' ? 2 : 1;
                            if (responseValue === 4) multiplier = path === 'istitutoTecnico' ? 2 : 1;
                            break;
                            
                        case 'teoricaPratica':
                            if (responseValue <= 2) multiplier = (path === 'liceoClassico' || path === 'liceoScientifico') ? 2 : 0.5;
                            if (responseValue >= 4) multiplier = (path === 'istitutoTecnico' || path === 'istitutoProfessionale') ? 2 : 0.5;
                            break;
                            
                        case 'argomenti':
                            if (responseValue === 1) multiplier = (path === 'istitutoTecnico' || path === 'liceoScientifico') ? 2 : 0.5;
                            if (responseValue === 2) multiplier = path === 'liceoArtistico' ? 2 : 0.5;
                            if (responseValue === 3) multiplier = path === 'liceoScientifico' ? 2 : 0.5;
                            if (responseValue === 4) multiplier = path === 'liceoClassico' ? 2 : 0.5;
                            break;
                            
                        case 'materia':
                            if (responseValue === 1) multiplier = path === 'liceoScientifico' ? 2 : 0.5;
                            if (responseValue === 2) multiplier = path === 'liceoClassico' ? 2 : 0.5;
                            if (responseValue === 5) multiplier = path === 'liceoArtistico' ? 2 : 0.5;
                            break;
                    }
                    
                    scores[path] += (this.weights[key][path] * responseValue * multiplier);
                });
            }
        });

        return scores;
    }

    getRecommendedPath(responses) {
        const scores = this.calculateScores(responses);
        
        // Trova il percorso con il punteggio più alto
        let maxScore = -1;
        let recommendedPath = null;
        
        Object.keys(scores).forEach(path => {
            if (scores[path] > maxScore) {
                maxScore = scores[path];
                recommendedPath = path;
            }
        });

        return {
            path: recommendedPath,
            scores: scores,
            confidence: this.calculateConfidence(scores)
        };
    }

    calculateConfidence(scores) {
        const values = Object.values(scores);
        const max = Math.max(...values);
        const secondMax = values.sort((a, b) => b - a)[1];
        
        // Calcola la confidenza basata sulla differenza tra primo e secondo
        const confidence = Math.min(100, ((max - secondMax) / max) * 100);
        return Math.round(confidence);
    }
}

const algorithm = new OrientamentoAlgorithm();

function changeStep(direction) {
    const currentPage = document.getElementById(`page-${currentStep}`);
    
    if (direction === 1) {
        // Validazione prima di andare avanti
        if (!validateCurrentStep()) {
            return;
        }
        
        if (currentStep < totalSteps) {
            currentPage.classList.remove('active');
            currentStep++;
            document.getElementById(`page-${currentStep}`).classList.add('active');
            updateProgressAndButtons();
        } else {
            // Ultima pagina - calcola risultati
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
        if (!field.value) {
            field.focus();
            field.style.borderColor = '#EF4444';
            setTimeout(() => {
                field.style.borderColor = '';
            }, 3000);
            return false;
        }
    }
    return true;
}

function updateProgressAndButtons() {
    // Aggiorna indicatori di progresso
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        if (index < currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Aggiorna pulsanti
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
    
    if (currentStep === totalSteps) {
        nextBtn.innerHTML = '<i class="fas fa-chart-line"></i> Ottieni risultati';
    } else {
        nextBtn.innerHTML = 'Successivo <i class="fas fa-arrow-right"></i>';
    }

    // Aggiorna titoli
    const titles = [
        'Interessi e Personalità',
        'Ambizioni e Obiettivi', 
        'Interessi Accademici e Dati'
    ];
    
    document.getElementById('quiz-title').textContent = titles[currentStep - 1];
}

function collectResponses() {
    const form = document.getElementById('orientamento-quiz');
    const formData = new FormData(form);
    const responses = {};
    
    // Raccogli tutte le risposte
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

function processResults() {
    const responses = collectResponses();
    const recommendation = algorithm.getRecommendedPath(responses);
    
    // Nascondi quiz e mostra risultati
    document.querySelector('.quiz-container').style.display = 'none';
    document.getElementById('results').classList.add('show');
    
    // Mostra percorso consigliato
    const pathInfo = algorithm.pathMappings[recommendation.path];
    document.getElementById('recommended-type').innerHTML = `
        <div>${pathInfo.name}</div>
        <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.9;">
            ${pathInfo.description}
        </div>
        <div style="font-size: 0.8rem; margin-top: 0.5rem; opacity: 0.8;">
            Confidenza: ${recommendation.confidence}%
        </div>
    `;
    
    // Trova e mostra scuole
    const schools = findNearbySchools(responses.regione, responses.provincia, pathInfo.keywords);
    displaySchools(schools);
}

function findNearbySchools(regione, provincia, keywords) {
    // Filtra le scuole per regione e provincia
    let filteredSchools = schoolsDataset.filter(school => {
        const regionMatch = school.regione.toUpperCase() === regione.toUpperCase();
        const provinciaMatch = school.provincia.toUpperCase().includes(provincia.toUpperCase()) ||
                                provincia.toUpperCase().includes(school.provincia.toUpperCase());
        
        return regionMatch && provinciaMatch;
    });

    // Se non trova scuole nella provincia specifica, cerca in tutta la regione
    if (filteredSchools.length === 0) {
        filteredSchools = schoolsDataset.filter(school => 
            school.regione.toUpperCase() === regione.toUpperCase()
        );
    }

    // Filtra per tipologia
    const matchingSchools = filteredSchools.filter(school => {
        return keywords.some(keyword => 
            school.tipologia.toUpperCase().includes(keyword.toUpperCase())
        );
    });

    // Se non trova scuole del tipo specifico, restituisce scuole generiche della zona
    if (matchingSchools.length === 0) {
        return filteredSchools.slice(0, 3);
    }

    return matchingSchools.slice(0, 3);
}

function displaySchools(schools) {
    const schoolsGrid = document.getElementById('schools-grid');
    
    if (schools.length === 0) {
        schoolsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-secondary);">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>Non sono state trovate scuole corrispondenti nella tua zona nel nostro database di esempio.</p>
                <p>Sostituendo il dataset con il file CSV completo, potrai ottenere risultati più precisi.</p>
            </div>
        `;
        return;
    }

    schoolsGrid.innerHTML = schools.map((school, index) => `
        <div class="school-card">
            <div class="school-name">${school.denominazione}</div>
            <div class="school-address">
                <i class="fas fa-map-marker-alt"></i> ${school.indirizzo}, ${school.provincia}
            </div>
            <div style="margin: 1rem 0; padding: 0.5rem; background: var(--background-light); border-radius: 8px; font-size: 0.875rem;">
                <strong>Tipologia:</strong> ${school.tipologia}
            </div>
            <div class="school-info">
                <span><i class="fas fa-envelope"></i> Email disponibile</span>
                <span><i class="fas fa-globe"></i> ${school.sito !== 'Non Disponibile' ? 'Sito web' : 'Sito N/D'}</span>
            </div>
        </div>
    `).join('');
}

function resetQuiz() {
    // Reset dello stato
    currentStep = 1;
    
    // Reset del form
    document.getElementById('orientamento-quiz').reset();
    
    // Reset della UI
    document.querySelector('.quiz-container').style.display = 'block';
    document.getElementById('results').classList.remove('show');
    
    // Torna alla prima pagina
    document.querySelectorAll('.question-page').forEach(page => page.classList.remove('active'));
    document.getElementById('page-1').classList.add('active');
    
    updateProgressAndButtons();
}

// Funzione per caricare un CSV personalizzato (da implementare quando necessario)
function loadCustomCSV(csvContent) {
    try {
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        
        const newDataset = [];
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
                const school = {};
                
                headers.forEach((header, index) => {
                    switch(header.toUpperCase()) {
                        case 'REGIONE':
                            school.regione = values[index];
                            break;
                        case 'PROVINCIA':
                            school.provincia = values[index];
                            break;
                        case 'CODICE ISTITUTO RIFERIMENTO':
                            school.codice = values[index];
                            break;
                        case 'DENOMINAZIONE ISTITUTO RIFERIMENTO':
                            school.denominazione = values[index];
                            break;
                        case 'INDIRIZZO SCUOLA':
                            school.indirizzo = values[index];
                            break;
                        case 'DESCRIZIONE TIPOLOGIA GRADO ISTRUZIONE SCUOLA':
                            school.tipologia = values[index];
                            break;
                        case 'INDIRIZZO EMAIL SCUOLA':
                            school.email = values[index];
                            break;
                        case 'INDIRIZZO PEC SCUOLA':
                            school.pec = values[index];
                            break;
                        case 'SITO WEB SCUOLA':
                            school.sito = values[index];
                            break;
                    }
                });
                
                newDataset.push(school);
            }
        }
        
        // Sostituisce il dataset esistente
        schoolsDataset.length = 0;
        schoolsDataset.push(...newDataset);
        
        console.log(`Dataset aggiornato con ${newDataset.length} scuole`);
        return true;
    } catch (error) {
        console.error('Errore nel caricamento del CSV:', error);
        return false;
    }
}
document.addEventListener('DOMContentLoaded', function() {
console.log('🚀 Inizializzazione applicazione...');

// Inizializza solo se il DOM è pronto
if (document.readyState === 'loading') {
console.log('DOM ancora in caricamento, attendo...');
return;
}

updateProgressAndButtons();

// Percorso del file CSV - modificare secondo necessità
const csvFilePath = 'data/scuole.csv';

// Carica il dataset all'avvio
loadDatasetFromFile(csvFilePath);

// Event listener per il range input dell'ambizione
const ambitionRange = document.getElementById('ambizione');
if (ambitionRange) {
ambitionRange.addEventListener('input', function() {
    const labels = ['Per niente', 'Poco', 'Moderatamente', 'Molto', 'Estremamente'];
    const value = parseInt(this.value) - 1;
    if (labels[value]) {
        console.log(`🎯 Ambizione: ${labels[value]}`);
    }
});
}

console.log('✅ Inizializzazione completata');
});