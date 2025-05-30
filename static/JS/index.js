// Dataset delle scuole - inizializzato vuoto, verrà popolato dal CSV
let schoolsDataset = [];

let currentStep = 1;
let totalSteps = 3;

// Algoritmo di scoring corretto per il percorso di orientamento
class OrientamentoAlgorithm {
    constructor() {
        // Definizione dei percorsi con caratteristiche
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

        // Logica di scoring basata sulle risposte effettive
        const sport = parseInt(responses.sport) || 0;
        const hobbyLavoro = parseInt(responses.hobbyLavoro) || 0;
        const lavoro = parseInt(responses.lavoro) || 0;
        const teoricaPratica = parseInt(responses.teoricaPratica) || 0;
        const ambiente = parseInt(responses.ambiente) || 0;
        const ambizioni = parseInt(responses.ambizioni) || 0;
        const sogni = parseInt(responses.sogni) || 0;
        const ambizione = parseInt(responses.ambizione) || 0;
        const determinazione = parseInt(responses.determinazione) || 0;
        const futuro = parseInt(responses.futuro) || 0;
        const argomenti = parseInt(responses.argomenti) || 0;
        const materia = parseInt(responses.materia) || 0;
        const apprendimento = parseInt(responses.apprendimento) || 0;

        // Scoring basato su sport/attività
        switch(sport) {
            case 1: // Sport di squadra
                scores.istitutoTecnico += 2;
                scores.istitutoProfessionale += 2;
                break;
            case 2: // Sport individuali
                scores.liceoScientifico += 2;
                break;
            case 3: // Attività artistiche  
                scores.liceoArtistico += 4;
                break;
            case 4: // Attività tecniche
                scores.istitutoTecnico += 4;
                scores.liceoScientifico += 2;
                break;
        }

        // Scoring basato su hobby->lavoro
        if (hobbyLavoro === 1) { // Sì, mi piacerebbe molto
            scores.liceoArtistico += 3;
            scores.istitutoTecnico += 2;
            scores.istitutoProfessionale += 3;
        }

        // Scoring basato su preferenza lavoro
        switch(lavoro) {
            case 1: // Gruppo
                scores.istitutoTecnico += 2;
                scores.istitutoProfessionale += 2;
                break;
            case 2: // Autonomo
                scores.liceoClassico += 2;
                scores.liceoScientifico += 2;
                break;
        }

        // Scoring cruciale: teoria vs pratica
        switch(teoricaPratica) {
            case 1: // Decisamente teorica
                scores.liceoClassico += 4;
                scores.liceoScientifico += 3;
                break;
            case 2: // Più teorica
                scores.liceoClassico += 3;
                scores.liceoScientifico += 4;
                break;
            case 3: // Equilibrio
                scores.liceoScientifico += 2;
                scores.istitutoTecnico += 2;
                scores.liceoArtistico += 2;
                break;
            case 4: // Più pratica
                scores.istitutoTecnico += 4;
                scores.liceoArtistico += 3;
                scores.istitutoProfessionale += 2;
                break;
            case 5: // Decisamente pratica
                scores.istitutoProfessionale += 4;
                scores.istitutoTecnico += 3;
                break;
        }

        // Scoring basato su ambiente preferito
        switch(ambiente) {
            case 1: // Laboratori
                scores.istitutoTecnico += 3;
                scores.liceoScientifico += 2;
                break;
            case 2: // Biblioteche
                scores.liceoClassico += 4;
                break;
            case 3: // All'aperto
                scores.istitutoProfessionale += 2;
                break;
            case 4: // Digitali
                scores.istitutoTecnico += 3;
                break;
        }

        // Scoring basato su ambizioni
        switch(ambizioni) {
            case 1: // Carriera successo
                scores.liceoScientifico += 3;
                scores.istitutoTecnico += 2;
                break;
            case 2: // Viaggiare
                scores.liceoClassico += 2;
                scores.liceoArtistico += 2;
                break;
            case 4: // Bene società
                scores.liceoClassico += 2;
                scores.istitutoProfessionale += 3;
                break;
        }

        // Scoring basato su argomenti di interesse
        switch(argomenti) {
            case 1: // Tecnologia
                scores.istitutoTecnico += 4;
                scores.liceoScientifico += 3;
                break;
            case 2: // Arte
                scores.liceoArtistico += 4;
                break;
            case 3: // Scienze
                scores.liceoScientifico += 4;
                break;
            case 4: // Comunicazione
                scores.liceoClassico += 3;
                break;
            case 5: // Economia
                scores.istitutoTecnico += 2;
                break;
        }

        // Scoring basato su materia preferita
        switch(materia) {
            case 1: // Matematica e Fisica
                scores.liceoScientifico += 4;
                scores.istitutoTecnico += 2;
                break;
            case 2: // Italiano e Storia
                scores.liceoClassico += 4;
                break;
            case 3: // Scienze Naturali
                scores.liceoScientifico += 3;
                break;
            case 4: // Lingue
                scores.liceoClassico += 2;
                break;
            case 5: // Arte
                scores.liceoArtistico += 4;
                break;
            case 6: // Ed. Fisica
                scores.istitutoProfessionale += 2;
                break;
        }

        // Scoring basato su come preferisce imparare
        switch(apprendimento) {
            case 1: // Leggendo libri
                scores.liceoClassico += 3;
                break;
            case 2: // Esperimenti pratici
                scores.liceoScientifico += 3;
                scores.istitutoTecnico += 3;
                break;
            case 3: // Discussioni
                scores.liceoClassico += 2;
                break;
            case 4: // Strumenti digitali
                scores.istitutoTecnico += 3;
                break;
        }

        // Bonus per alti livelli di ambizione e determinazione
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
        
        // Trova il percorso con il punteggio più alto
        let maxScore = -1;
        let recommendedPath = null;
        
        Object.keys(scores).forEach(path => {
            if (scores[path] > maxScore) {
                maxScore = scores[path];
                recommendedPath = path;
            }
        });

        // Se tutti i punteggi sono uguali, usa logica di fallback
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
        // Logica di fallback basata su criteri principali
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
        
        if (max === 0) return 50; // Confidenza base se non ci sono punteggi
        
        // Calcola la confidenza basata sulla differenza tra primo e secondo
        const confidence = Math.min(100, Math.max(50, ((max - secondMax) / max) * 100));
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
        if (!field.value || field.value === '') {
            field.focus();
            field.style.borderColor = '#EF4444';
            
            // Mostra messaggio di errore
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
                if (errorMsg) {
                    errorMsg.remove();
                }
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
    
    if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
    
    if (nextBtn) {
        if (currentStep === totalSteps) {
            nextBtn.innerHTML = '<i class="fas fa-chart-line"></i> Ottieni risultati';
        } else {
            nextBtn.innerHTML = 'Successivo <i class="fas fa-arrow-right"></i>';
        }
    }

    // Aggiorna titoli
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
    
    // Lista di tutti i campi del form
    const fields = ['sport', 'hobbyLavoro', 'lavoro', 'teoricaPratica', 'ambiente', 
                    'ambizioni', 'sogni', 'ambizione', 'determinazione', 'futuro', 
                    'argomenti', 'materia', 'apprendimento', 'regione', 'provincia'];
    
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            responses[field] = element.value;
        }
    });
    
    console.log('Risposte raccolte:', responses);
    return responses;
}

function processResults() {
    const responses = collectResponses();
    
    // Validazione finale
    if (!responses.regione || !responses.provincia) {
        alert('Per favore completa tutti i campi obbligatori');
        return;
    }
    
    const recommendation = algorithm.getRecommendedPath(responses);
    
    console.log('Punteggi calcolati:', recommendation.scores);
    console.log('Percorso consigliato:', recommendation.path);
    
    // Nascondi quiz e mostra risultati
    const quizContainer = document.querySelector('.quiz-container');
    const resultsContainer = document.getElementById('results');
    
    if (quizContainer) quizContainer.style.display = 'none';
    if (resultsContainer) resultsContainer.classList.add('show');
    
    // Mostra percorso consigliato
    const pathInfo = algorithm.pathMappings[recommendation.path];
    const recommendedTypeElement = document.getElementById('recommended-type');
    
    if (recommendedTypeElement && pathInfo) {
        recommendedTypeElement.innerHTML = `
            <div style="font-size: 1.5rem; font-weight: 600;">${pathInfo.name}</div>
            <div style="font-size: 1rem; margin-top: 0.5rem; opacity: 0.9;">
                ${pathInfo.description}
            </div>
            <div style="font-size: 0.875rem; margin-top: 0.5rem; opacity: 0.8;">
                Confidenza: ${recommendation.confidence}%
            </div>
        `;
    }
    
    // Trova e mostra scuole
    const schools = findNearbySchools(responses.regione, responses.provincia, pathInfo.keywords);
    displaySchools(schools);
    
    // Scroll ai risultati
    if (resultsContainer) {
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

function findNearbySchools(regione, provincia, keywords) {
    console.log(`Ricerca scuole per: ${regione}, ${provincia}`, keywords);
    console.log(`Dataset contiene ${schoolsDataset.length} scuole`);
    
    if (schoolsDataset.length === 0) {
        console.warn('Dataset delle scuole vuoto');
        return [];
    }
    
    // Filtra le scuole per regione
    let filteredSchools = schoolsDataset.filter(school => {
        if (!school.regione) return false;
        return normalizeString(school.regione) === normalizeString(regione);
    });
    
    console.log(`Scuole trovate nella regione ${regione}: ${filteredSchools.length}`);
    
    // Filtra per provincia se specificata
    if (provincia && provincia.trim()) {
        const provinciaFiltered = filteredSchools.filter(school => {
            if (!school.provincia) return false;
            const schoolProvincia = normalizeString(school.provincia);
            const searchProvincia = normalizeString(provincia);
            return schoolProvincia.includes(searchProvincia) || 
                   searchProvincia.includes(schoolProvincia);
        });
        
        if (provinciaFiltered.length > 0) {
            filteredSchools = provinciaFiltered;
            console.log(`Scuole trovate nella provincia ${provincia}: ${filteredSchools.length}`);
        }
    }

    // Filtra per tipologia
    const matchingSchools = filteredSchools.filter(school => {
        if (!school.tipologia) return false;
        return keywords.some(keyword => 
            normalizeString(school.tipologia).includes(normalizeString(keyword))
        );
    });

    console.log(`Scuole trovate per tipologia: ${matchingSchools.length}`);

    // Se non trova scuole del tipo specifico, restituisce scuole generiche della zona
    const finalSchools = matchingSchools.length > 0 ? matchingSchools : filteredSchools;
    
    return finalSchools.slice(0, 5); // Mostra massimo 5 scuole
}

function normalizeString(str) {
    if (!str) return '';
    return str.toString().toLowerCase()
        .replace(/[àáäâ]/g, 'a')
        .replace(/[èéëê]/g, 'e')
        .replace(/[ìíïî]/g, 'i')
        .replace(/[òóöô]/g, 'o')
        .replace(/[ùúüû]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[ñ]/g, 'n')
        .replace(/\s+/g, ' ')
        .trim();
}

function displaySchools(schools) {
    const schoolsGrid = document.getElementById('schools-grid');
    
    if (!schoolsGrid) {
        console.error('Elemento schools-grid non trovato');
        return;
    }
    
    if (schools.length === 0) {
        schoolsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-secondary);">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; color: #F59E0B;"></i>
                <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Nessuna scuola trovata</p>
                <p>Non sono state trovate scuole corrispondenti nella tua zona.</p>
                <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">
                    Prova a verificare l'ortografia della provincia o contatta il tuo comune per informazioni sugli istituti disponibili.
                </p>
            </div>
        `;
        return;
    }

    schoolsGrid.innerHTML = schools.map((school, index) => `
        <div class="school-card" style="animation: fadeIn 0.5s ease ${index * 0.1}s both;">
            <div class="school-name">${school.denominazione || 'Nome non disponibile'}</div>
            <div class="school-address">
                <i class="fas fa-map-marker-alt"></i> 
                ${school.indirizzo || 'Indirizzo non disponibile'}, ${school.provincia || 'Provincia N/D'}
            </div>
            <div style="margin: 1rem 0; padding: 0.75rem; background: var(--background-light); border-radius: 8px; font-size: 0.875rem;">
                <strong>Tipologia:</strong> ${school.tipologia || 'Non specificata'}
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
}

function resetQuiz() {
    // Reset dello stato
    currentStep = 1;
    
    // Reset del form
    const form = document.getElementById('orientamento-quiz');
    if (form) form.reset();
    
    // Reset della UI
    const quizContainer = document.querySelector('.quiz-container');
    const resultsContainer = document.getElementById('results');
    
    if (quizContainer) quizContainer.style.display = 'block';
    if (resultsContainer) resultsContainer.classList.remove('show');
    
    // Torna alla prima pagina
    document.querySelectorAll('.question-page').forEach(page => page.classList.remove('active'));
    const firstPage = document.getElementById('page-1');
    if (firstPage) firstPage.classList.add('active');
    
    updateProgressAndButtons();
    
    // Scroll all'inizio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Funzione per caricare il CSV dalle risorse statiche
async function loadDatasetFromURL(url) {
    try {
        console.log(`Tentativo di caricamento CSV da: ${url}`);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvContent = await response.text();
        console.log(`CSV caricato, lunghezza: ${csvContent.length} caratteri`);
        
        return parseCSV(csvContent);
    } catch (error) {
        console.error('Errore nel caricamento del CSV:', error);
        return false;
    }
}

// Funzione per parsare il contenuto CSV
function parseCSV(csvContent) {
    try {
        const lines = csvContent.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
            console.error('CSV non contiene dati sufficienti');
            return false;
        }
        
        // Parsing degli header
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        console.log('Headers trovati:', headers);
        
        const newDataset = [];
        
        // Parsing delle righe di dati
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Parsing CSV più robusto che gestisce le virgole nei campi quotati
            const values = parseCSVLine(line);
            
            if (values.length < headers.length) {
                console.warn(`Riga ${i} ha meno valori degli headers:`, line);
                continue;
            }
            
            const school = {};
            
            headers.forEach((header, index) => {
                const value = values[index] ? values[index].replace(/"/g, '').trim() : '';
                const normalizedHeader = normalizeString(header);
                
                // Mappatura flessibile degli header
                if (normalizedHeader.includes('regione')) {
                    school.regione = value;
                } else if (normalizedHeader.includes('provincia')) {
                    school.provincia = value;
                } else if (normalizedHeader.includes('codice') && normalizedHeader.includes('istituto')) {
                    school.codice = value;
                } else if (normalizedHeader.includes('denominazione') || normalizedHeader.includes('nome')) {
                    school.denominazione = value;
                } else if (normalizedHeader.includes('indirizzo')) {
                    school.indirizzo = value;
                } else if (normalizedHeader.includes('tipologia') || normalizedHeader.includes('grado')) {
                    school.tipologia = value;
                } else if (normalizedHeader.includes('email') && !normalizedHeader.includes('pec')) {
                    school.email = value;
                } else if (normalizedHeader.includes('pec')) {
                    school.pec = value;
                } else if (normalizedHeader.includes('sito') || normalizedHeader.includes('web')) {
                    school.sito = value;
                }
            });
            
            // Aggiungi solo se ha almeno denominazione e regione
            if (school.denominazione && school.regione) {
                newDataset.push(school);
            }
        }
        
        if (newDataset.length === 0) {
            console.error('Nessuna scuola valida trovata nel CSV');
            return false;
        }
        
        // Sostituisce il dataset esistente
        schoolsDataset.length = 0;
        schoolsDataset.push(...newDataset);
        
        console.log(`✅ Dataset aggiornato con ${newDataset.length} scuole`);
        console.log('Prime 3 scuole:', newDataset.slice(0, 3));
        
        return true;
    } catch (error) {
        console.error('Errore nel parsing del CSV:', error);
        return false;
    }
}

// Parser CSV che gestisce le virgole nei campi quotati
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current);
    return result;
}

// Inizializzazione dell'applicazione
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Inizializzazione NextStep...');
    
    updateProgressAndButtons();
    
    // Percorsi possibili per il file CSV
    const csvPaths = [
        'data/scuole.csv',
        './data/scuole.csv',
        '/data/scuole.csv',
        'static/data/scuole.csv'
    ];
    
    // Tenta di caricare il CSV da diversi percorsi
    let loaded = false;
    for (const path of csvPaths) {
        console.log(`Tentativo caricamento da: ${path}`);
        loaded = await loadDatasetFromURL(path);
        if (loaded) {
            console.log(`✅ CSV caricato con successo da: ${path}`);
            break;
        }
    }
    
    if (!loaded) {
        console.warn('⚠️ Impossibile caricare il dataset CSV. Le scuole non saranno disponibili.');
        console.log('Per utilizzare la funzionalità completa, assicurati che il file CSV sia presente in una delle seguenti posizioni:');
        csvPaths.forEach(path => console.log(`- ${path}`));
    }
    
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