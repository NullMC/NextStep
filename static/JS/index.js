let currentStep = 1;
let totalSteps = 3;
let heroSlideIndex = 1;
let infoSlideIndex = 0;
let schoolSlideIndex = 0;
let schoolsData = [];

// Mappa degli indirizzi

const indirizzoMap = {
	"LI05": { "descrizione": "ARCHITETTURA E AMBIENTE", "settore": "ARTISTICO", "percorso": "Licei" },
	"LI34": { "descrizione": "ARTI FIGURATIVE - CURVATURA ARTE DEL GRAFICO PITTORICO", "settore": "ARTISTICO", "percorso": "Licei" },
	"LIB6": { "descrizione": "ARTI FIGURATIVE - GRAFICO-PITTORICO", "settore": "ARTISTICO", "percorso": "Licei" },
	"LIC6": { "descrizione": "ARTI FIGURATIVE - PLASTICO PITTORICO", "settore": "ARTISTICO", "percorso": "Licei" },
	"LIA6": { "descrizione": "ARTI FIGURATIVE - PLASTICO SCULTOREO", "settore": "ARTISTICO", "percorso": "Licei" },
	"LI36": { "descrizione": "ARTISTICO - AUDIOVISIVO MULTIMEDIA", "settore": "ARTISTICO", "percorso": "Licei" },
	"LI07": { "descrizione": "AUDIOVISIVO MULTIMEDIA", "settore": "ARTISTICO", "percorso": "Licei" },
	"LIB9": { "descrizione": "DESIGN - ARREDAMENTO E LEGNO", "settore": "ARTISTICO", "percorso": "Licei" },
	"LID9": { "descrizione": "DESIGN - INDUSTRIA", "settore": "ARTISTICO", "percorso": "Licei" },
	"LIF9": { "descrizione": "DESIGN - MODA", "settore": "ARTISTICO", "percorso": "Licei" },
	"LI10": { "descrizione": "GRAFICA", "settore": "ARTISTICO", "percorso": "Licei" },
	"LI08": { "descrizione": "SCENOGRAFIA", "settore": "ARTISTICO", "percorso": "Licei" },
	"LI01": { "descrizione": "CLASSICO", "settore": "CLASSICO", "percorso": "Licei" },
	"LI04": { "descrizione": "LINGUISTICO", "settore": "LINGUISTICO", "percorso": "Licei" },
	"LI18": { "descrizione": "MADE IN ITALY", "settore": "MADE IN ITALY", "percorso": "Licei" },
	"LI14": { "descrizione": "MUSICALE E COREUTICO - SEZ. COREUTICA", "settore": "MUSICALE E COREUTICO", "percorso": "Licei" },
	"LI13": { "descrizione": "MUSICALE E COREUTICO - SEZ. MUSICALE", "settore": "MUSICALE E COREUTICO", "percorso": "Licei" },
	"LI02": { "descrizione": "SCIENTIFICO", "settore": "SCIENTIFICO", "percorso": "Licei" },
	"LI03": { "descrizione": "SCIENTIFICO - OPZIONE SCIENZE APPLICATE", "settore": "SCIENTIFICO", "percorso": "Licei" },
	"LI15": { "descrizione": "SCIENTIFICO - SEZ. AD INDIRIZZO SPORTIVO", "settore": "SCIENTIFICO", "percorso": "Licei" },
	"LI11": { "descrizione": "SCIENZE UMANE", "settore": "SCIENZE UMANE", "percorso": "Licei" },
	"LI12": { "descrizione": "SCIENZE UMANE - OPZ. ECONOMICO SOCIALE", "settore": "SCIENZE UMANE", "percorso": "Licei" },
	"IP11": { "descrizione": "AGRICOLTURA, SVILUPPO RURALE, VALORIZZAZIONE DEI PRODOTTI DEL TERRITORIO E GESTIONE DELLE RISORSE FORESTALI E MONTANE", "settore": "NUOVI PROFESSIONALI", "percorso": "Professionali" },
	"IP20": { "descrizione": "ARTI AUSILIARI DELLE PROFESSIONI SANITARIE: ODONTOTECNICO", "settore": "NUOVI PROFESSIONALI", "percorso": "Professionali" },
	"IP21": { "descrizione": "ARTI AUSILIARI DELLE PROFESSIONI SANITARIE: OTTICO", "settore": "NUOVI PROFESSIONALI", "percorso": "Professionali" },
	"IP17": { "descrizione": "ENOGASTRONOMIA E OSPITALITA' ALBERGHIERA", "settore": "NUOVI PROFESSIONALI", "percorso": "Professionali" },
	"IP15": { "descrizione": "GESTIONE DELLE ACQUE E RISANAMENTO AMBIENTALE", "settore": "NUOVI PROFESSIONALI", "percorso": "Professionali" },
	"IP13": { "descrizione": "INDUSTRIA E ARTIGIANATO PER IL MADE IN ITALY", "settore": "NUOVI PROFESSIONALI", "percorso": "Professionali" },
	"IP14": { "descrizione": "MANUTENZIONE E ASSISTENZA TECNICA", "settore": "NUOVI PROFESSIONALI", "percorso": "Professionali" },
	"IP12": { "descrizione": "PESCA COMMERCIALE E PRODUZIONI ITTICHE", "settore": "NUOVI PROFESSIONALI", "percorso": "Professionali" },
	"IP16": { "descrizione": "SERVIZI COMMERCIALI", "settore": "NUOVI PROFESSIONALI", "percorso": "Professionali" },
	"IP18": { "descrizione": "SERVIZI CULTURALI E DELLO SPETTACOLO", "settore": "NUOVI PROFESSIONALI", "percorso": "Professionali" },
	"IP19": { "descrizione": "SERVIZI PER LA SANITA' E L'ASSISTENZA SOCIALE", "settore": "NUOVI PROFESSIONALI", "percorso": "Professionali" },
	"IT01": { "descrizione": "AMMINISTRAZIONE, FINANZA E MARKETING", "settore": "ECONOMICO", "percorso": "Tecnici" },
	"IT04": { "descrizione": "TURISMO", "settore": "ECONOMICO", "percorso": "Tecnici" },
	"IT21": { "descrizione": "AGRARIA, AGROALIMENTARE E AGROINDUSTRIA", "settore": "TECNOLOGICO", "percorso": "Tecnici" },
	"IT16": { "descrizione": "CHIMICA, MATERIALI E BIOTECNOLOGIE", "settore": "TECNOLOGICO", "percorso": "Tecnici" },
	"IT24": { "descrizione": "COSTRUZIONI, AMBIENTE E TERRITORIO", "settore": "TECNOLOGICO", "percorso": "Tecnici" },
	"IT10": { "descrizione": "ELETTRONICA ED ELETTROTECNICA", "settore": "TECNOLOGICO", "percorso": "Tecnici" },
	"IT15": { "descrizione": "GRAFICA E COMUNICAZIONE", "settore": "TECNOLOGICO", "percorso": "Tecnici" },
	"IT13": { "descrizione": "INFORMATICA E TELECOMUNICAZIONI", "settore": "TECNOLOGICO", "percorso": "Tecnici" },
	"IT05": { "descrizione": "MECCANICA, MECCATRONICA ED ENERGIA", "settore": "TECNOLOGICO", "percorso": "Tecnici" },
	"IT19": { "descrizione": "SISTEMA MODA", "settore": "TECNOLOGICO", "percorso": "Tecnici" },
	"IT09": { "descrizione": "TRASPORTI E LOGISTICA", "settore": "TECNOLOGICO", "percorso": "Tecnici" }
};


const regionMap = {
    'ABRUZZO': 'AB', 'BASILICATA': 'BA', 'CALABRIA': 'CA', 'CAMPANIA': 'CM', 'EMILIA-ROMAGNA': 'ER',
    'FRIULI-VENEZIA GIULIA': 'FV', 'LAZIO': 'LA', 'LIGURIA': 'LI', 'LOMBARDIA': 'LO', 'MARCHE': 'MA',
    'MOLISE': 'MO', 'PIEMONTE': 'PM', 'PUGLIA': 'PU', 'SARDEGNA': 'SA', 'SICILIA': 'SI', 'TOSCANA': 'TO',
    'TRENTINO-ALTO ADIGE': 'TA', 'UMBRIA': 'UM', "VALLE D'AOSTA": 'VA', 'VENETO': 'VE'
};

class OrientamentoAlgorithm {
    
    calculateScores(responses) {
        let scores = {};

        Object.keys(indirizzoMap).forEach(codice => { scores[codice] = 0; });

        const {
            teoricaPratica, obiettivoFuturo, metodoStudio,
            areaUmanistica, areaScientifica, areaBioChimica, areaArtistica,
            areaTecnologica, areaEconomica, areaSociale, areaPratica,
            ambiente, sport, lavoro, 
        } = responses;

        // 1. Punteggi base su Teoria/Pratica e Obiettivo Futuro
        const tp = parseInt(teoricaPratica);
        const amb = parseInt(ambiente || 0);
        const spo = parseInt(sport || 0);
        const lav = parseInt(lavoro || 0);
        
        // Pondera percorsi in base a teoria/pratica (ridotti per evitare bias)
        if (tp <= 2) { // Teorico
            this.adjustScores(scores, "Licei", 4);
            this.adjustScores(scores, "Tecnici", -1);
            this.adjustScores(scores, "Professionali", -3);
        } else if (tp === 3) { // Neutro
            this.adjustScores(scores, "Tecnici", 2);
        } else { // Pratico
            this.adjustScores(scores, "Licei", -3);
            this.adjustScores(scores, "Tecnici", 3);
            this.adjustScores(scores, "Professionali", 2);
        }
        
        // Pondera percorsi in base a obiettivo futuro (meno estremi)
        if (obiettivoFuturo === 'universita_lunga') {
            this.adjustScores(scores, "Licei", 6);
            this.adjustScores(scores, "Tecnici", 2);
            this.adjustScores(scores, "Professionali", -3);
        } else if (obiettivoFuturo === 'universita_breve') {
            this.adjustScores(scores, "Licei", 2);
            this.adjustScores(scores, "Tecnici", 6);
            this.adjustScores(scores, "Professionali", 1);
        } else { // Lavoro subito
            this.adjustScores(scores, "Licei", -5);
            this.adjustScores(scores, "Tecnici", 5);
            this.adjustScores(scores, "Professionali", 2);
        }
        
        switch(metodoStudio) {
            case 'libri': 
                scores['LI01'] += 5; // Classico
                scores['LI11'] += 4; // Scienze Umane
                break;
            case 'logica':
                scores['LI02'] += 4; // Scientifico
                scores['LI03'] += 5; // Scienze Applicate
                scores['IT13'] += 6; // Informatica
                break;
            case 'laboratorio':
                scores['LI03'] += 4; // Scienze Applicate
                scores['IT16'] += 5; // Chimica
                scores['IT10'] += 6; // Elettronica
                scores['IT05'] += 5; // Meccanica
                break;
            case 'creativo':
                this.adjustScoresBySettore(scores, "ARTISTICO", 5);
                scores['IT19'] += 3; // Moda
                scores['IT15'] += 3; // Grafica
                scores['IT13'] += 2; // Informatica
                break;
            case 'gruppo':
                scores['LI11'] += 3; // Scienze Umane
                scores['LI12'] += 4; // Econ-Sociale
                scores['IT04'] += 4; // Turismo
                scores['IP19'] += 5; // Servizi Sanità
                scores['IP17'] += 4; // Alberghiero
                scores['IT13'] += 6; // Informatica
                break;
        }

        scores['LI01'] += parseInt(areaUmanistica) * 2; // Classico
        scores['LI11'] += parseInt(areaUmanistica);    // Scienze Umane

        scores['LI02'] += parseInt(areaScientifica) * 2; // Scientifico
        scores['LI03'] += parseInt(areaScientifica);    // Scienze App.

        scores['LI03'] += parseInt(areaBioChimica) * 2; // Scienze App.
        scores['IT16'] += parseInt(areaBioChimica) * 2; // Chimica
        scores['IT21'] += parseInt(areaBioChimica);    // Agraria

        this.adjustScoresBySettore(scores, "ARTISTICO", parseInt(areaArtistica));
        scores['LI13'] += parseInt(areaArtistica); // Musicale
        scores['LI14'] += parseInt(areaArtistica); // Coreutico
        scores['IT19'] += parseInt(areaArtistica); // Moda
        scores['IT15'] += parseInt(areaArtistica); // Grafica

        scores['IT13'] += parseInt(areaTecnologica) * 2; // Informatica
        scores['IT10'] += parseInt(areaTecnologica);    // Elettronica
        scores['IT05'] += parseInt(areaTecnologica);    // Meccanica
        scores['IP14'] += parseInt(areaTecnologica);    // Manutenzione

        scores['IT01'] += parseInt(areaEconomica) * 2; // AFM
        scores['LI12'] += parseInt(areaEconomica);    // Econ-Sociale
        scores['IT04'] += parseInt(areaEconomica);    // Turismo
        scores['IP16'] += parseInt(areaEconomica);    // Servizi Commerciali

        scores['LI11'] += parseInt(areaSociale) * 2; // Scienze Umane
        scores['LI12'] += parseInt(areaSociale) * 2; // Econ-Sociale
        scores['IP19'] += parseInt(areaSociale) * 2; // Servizi Sanità/Assistenza

        this.adjustScores(scores, "Professionali", parseInt(areaPratica));
        scores['IT21'] += parseInt(areaPratica); // Agraria
        scores['IT24'] += parseInt(areaPratica); // Costruzioni
        scores['IP17'] += parseInt(areaPratica); // Alberghiero
        scores['IP14'] += parseInt(areaPratica); // Manutenzione

        // Integrazione ambiente, sport e lavoro
        switch(amb) { // Ambiente preferito
            case 1: // Laboratori
                scores['IT16'] += 3; // Chimica
                scores['IT10'] += 4; // Elettronica
                scores['IT05'] += 3; // Meccanica
                scores['IT13'] += 4; // Informatica
                this.adjustScoresBySettore(scores, "ARTISTICO", 2);
                break;
            case 2: // Biblioteche
                scores['LI01'] += 4; // Classico
                scores['LI02'] += 3; // Scientifico
                scores['LI11'] += 2; // Scienze Umane
                this.adjustScores(scores, "Licei", 2);
                break;
            case 3: // All'aperto
                scores['IT21'] += 4; // Agraria
                scores['IP11'] += 4; // Agricoltura
                scores['IP12'] += 3; // Pesca
                scores['LI15'] += 5; // Scientifico Sportivo
                break;
            case 4: // Digitali
                scores['IT13'] += 6; // Informatica
                scores['IT15'] += 4; // Grafica
                scores['IT10'] += 3; // Elettronica
                scores['LI03'] += 3; // Scienze Applicate
                break;
        }

        switch(spo) { // Sport/Attività
            case 1: // Sport di squadra
                scores['LI15'] += 5; // Scientifico Sportivo
                this.adjustScores(scores, "Professionali", 1);
                break;
            case 2: // Sport individuali
                scores['LI15'] += 4; // Scientifico Sportivo
                scores['LI02'] += 2; // Scientifico
                scores['LI03'] += 2; // Scienze Applicate
                break;
            case 3: // Attività artistiche
                this.adjustScoresBySettore(scores, "ARTISTICO", 4);
                scores['LI13'] += 5; // Musicale
                scores['LI14'] += 5; // Coreutico
                scores['IP18'] += 4; // Servizi Culturali
                break;
            case 4: // Attività tecniche
                scores['IT13'] += 6; // Informatica
                scores['IT10'] += 5; // Elettronica
                scores['IT05'] += 4; // Meccanica
                scores['IP14'] += 2; // Manutenzione
                break;
        }

        switch(lav) { // Preferenze lavoro
            case 1: // Gruppo
                scores['IP17'] += 3; // Alberghiero
                scores['IP19'] += 3; // Servizi Sanità
                scores['IT04'] += 3; // Turismo
                scores['IT13'] += 4; // Informatica
                this.adjustScores(scores, "Professionali", 1);
                break;
            case 2: // Autonomo
                scores['LI01'] += 2; // Classico
                scores['LI02'] += 2; // Scientifico
                scores['IT01'] += 2; // AFM
                this.adjustScores(scores, "Licei", 1);
                break;
            case 3: // Entrambi
                scores['IT01'] += 2; // AFM
                scores['IT04'] += 2; // Turismo
                scores['LI12'] += 2; // Econ-Sociale
                this.adjustScoresBySettore(scores, "TECNOLOGICO", 1);
                break;
        }

        // Hobby come lavoro
        const hobbyLav = parseInt(responses.hobbyLavoro || 0);
        switch(hobbyLav) {
            case 1: // Sì, assolutamente
                this.adjustScoresBySettore(scores, "ARTISTICO", 2);
                scores['IT15'] += 3; // Grafica
                scores['IP18'] += 2; // Servizi Culturali
                break;
            case 2: // Forse, se possibile
                this.adjustScoresBySettore(scores, "ARTISTICO", 4);
                scores['LI13'] += 3; // Musicale
                scores['LI14'] += 3; // Coreutico
                scores['IP18'] += 3; // Servizi Culturali
                scores['IP17'] += 3; // Alberghiero
                break;
            case 3: // No, preferisco tenerli separati
                this.adjustScores(scores, "Tecnici", 2);
                this.adjustScores(scores, "Licei", 1);
                break;
        }

        // Sogni d'infanzia
        const sogniVal = parseInt(responses.sogni || 0);
        switch(sogniVal) {
            case 1: // Professioni scientifiche
                scores['LI02'] += 3; // Scientifico
                scores['LI03'] += 4; // Scienze Applicate
                scores['IT13'] += 4; // Informatica
                scores['IT16'] += 3; // Chimica
                break;
            case 2: // Professioni umanistiche
                scores['LI01'] += 4; // Classico
                scores['LI11'] += 5; // Scienze Umane
                scores['LI04'] += 3; // Linguistico
                break;
            case 3: // Professioni artistiche
                this.adjustScoresBySettore(scores, "ARTISTICO", 5);
                scores['LI13'] += 4; // Musicale
                scores['LI14'] += 3; // Coreutico
                break;
            case 4: // Professioni tecniche
                scores['IT13'] += 6; // Informatica
                scores['IT10'] += 5; // Elettronica
                scores['IT05'] += 4; // Meccanica
                this.adjustScores(scores, "Tecnici", 2);
                break;
            case 5: // Non ho un sogno specifico
                // Non modifica i punteggi
                break;
        }

        // Ambizione
        const ambVal = parseInt(responses.ambizione || 3);
        if (ambVal >= 4) { // Alta ambizione
            this.adjustScores(scores, "Licei", 3);
            scores['LI02'] += 2; // Scientifico
            scores['IT13'] += 3; // Informatica
            scores['IT01'] += 1; // AFM
        } else if (ambVal <= 2) { // Bassa ambizione
            this.adjustScores(scores, "Professionali", 2);
            this.adjustScores(scores, "Tecnici", 1);
        }

        // Determinazione (ribilanciata)
        const detVal = parseInt(responses.determinazione || 3);
        if (detVal >= 4) { // Alta determinazione -> favorisce percorsi più impegnativi
            this.adjustScores(scores, "Licei", 2);
            this.adjustScores(scores, "Tecnici", 3);
        } else if (detVal <= 2) { // Bassa determinazione -> favorisce percorsi più pratici
            this.adjustScores(scores, "Professionali", 2);
            this.adjustScores(scores, "Tecnici", 1);
        }

        // Obiettivi futuri
        const futVal = parseInt(responses.futuro || 0);
        switch(futVal) {
            case 1: // Carriera accademica
                scores['LI01'] += 5; // Classico
                scores['LI02'] += 5; // Scientifico
                scores['LI03'] += 4; // Scienze Applicate
                this.adjustScores(scores, "Licei", 3);
                break;
            case 2: // Libero professionista
                scores['IT01'] += 5; // AFM
                scores['IT04'] += 4; // Turismo
                scores['IP17'] += 4; // Alberghiero
                scores['IP16'] += 4; // Servizi Commerciali
                break;
            case 3: // Imprenditore
                scores['IT01'] += 2; // AFM
                scores['IT13'] += 4; // Informatica
                scores['IT16'] += 3; // Chimica
                this.adjustScores(scores, "Tecnici", 2);
                break;
            case 4: // Dipendente specializzato
                this.adjustScores(scores, "Tecnici", 3);
                this.adjustScores(scores, "Professionali", 2);
                break;
            case 5: // Non ho ancora deciso
                // Non modifica i punteggi
                break;
        }

        return scores;
    }
    
    adjustScores(scores, percorso, points) {
        for (const codice in indirizzoMap) {
            if (indirizzoMap[codice].percorso === percorso) {
                scores[codice] += points;
            }
        }
    }

    adjustScoresBySettore(scores, settore, points) {
        for (const codice in indirizzoMap) {
            if (indirizzoMap[codice].settore === settore) {
                scores[codice] += points;
            }
        }
    }

    getRecommendedPath(responses) {
        const scores = this.calculateScores(responses);
        
        let maxScore = -Infinity;
        let recommendedCodice = null;
        
        Object.keys(scores).forEach(codice => {
            if (scores[codice] > maxScore) {
                maxScore = scores[codice];
                recommendedCodice = codice;
            }
        });

        const recommendation = indirizzoMap[recommendedCodice];
        
        return {
            indirizzoCodice: recommendedCodice,
            indirizzoDesc: recommendation.descrizione,
            percorso: recommendation.percorso, // "Licei", "Tecnici", "Professionali"
            scores: scores
        };
    }
}

const algorithm = new OrientamentoAlgorithm();



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
            processResults(); // Vai ai risultati
        }
    } else {
        if (currentStep > 1) {
            currentPage.classList.remove('active');
            currentStep--;
            document.getElementById(`page-${currentStep}`).classList.add('active');
            updateProgressAndButtons();
        }
    }

    document.querySelector('.quiz-container').scrollIntoView({ behavior: 'smooth' });
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
        'Il tuo approccio',
        'Aree di Interesse', 
        'Dove vuoi studiare?'
    ];
    
    const titleElement = document.getElementById('quiz-title');
    if (titleElement && titles[currentStep - 1]) {
        titleElement.textContent = titles[currentStep - 1];
    }
}

function collectResponses() {
    const responses = {};
    const fields = [
        'teoricaPratica', 'obiettivoFuturo', 'metodoStudio',
        'areaUmanistica', 'areaScientifica', 'areaBioChimica', 'areaArtistica',
        'areaTecnologica', 'areaEconomica', 'areaSociale', 'areaPratica',
        'regione', 'provincia'
    ];
    
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
    
    const recommendedTypeElement = document.getElementById('recommended-type');
    
    if (recommendedTypeElement && recommendation) {
        recommendedTypeElement.innerHTML = `
            <div style="font-size: 1.75rem; font-weight: 700;">${recommendation.indirizzoDesc}</div>
            <div style="font-size: 1.1rem; margin-top: 1rem; opacity: 0.95;">
                Percorso: <strong>${recommendation.percorso}</strong> | Settore: <strong>${indirizzoMap[recommendation.indirizzoCodice].settore}</strong>
            </div>
        `;
    }
    
    const regioneCodice = regionMap[responses.regione];
    const provinciaCodice = responses.provincia.toUpperCase();
    
    await searchSchools(
        regioneCodice, 
        provinciaCodice, 
        recommendation.indirizzoCodice, 
        recommendation.percorso
    );
    
    if (resultsContainer) {
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

async function searchSchools(regione, provincia, indirizzoDiStudio, percorso) {
    
    const url = `https://unica.istruzione.gov.it/services/sic/api/v1.0/ricerche/ricercaAvanzata?regione=${regione}&indirizzoDiStudio=${indirizzoDiStudio}&percorso=${percorso}&provincia=${provincia}&tipoDiIstruzione=SS&numeroElementiPagina=30&numeroPagina=1`;


    const schoolsCarousel = document.getElementById('schools-carousel');
    schoolsCarousel.innerHTML = `<div style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--primary-color);"></i><p style="margin-top: 1rem;">Ricerca scuole in corso...</p></div>`;


    try {

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.esito && data.esito.codice === "20000") {
            schoolsData = data.scuole || [];
            displaySchools(schoolsData);
        } else {
             console.error('Errore restituito dall\'API:', data.esito.descrizione);
             displayError("Errore API: " + data.esito.descrizione);
        }

    } catch (error) {
        console.error('Errore nella ricerca delle scuole (fetch):', error);
        displayError("Impossibile contattare il servizio di ricerca scuole. Controlla la console per i dettagli.");
    }
}

function displayError(message) {
    const schoolsCarousel = document.getElementById('schools-carousel');
    const indicators = document.getElementById('school-indicators');
    
    schoolsCarousel.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <i class="fas fa-exclamation-triangle" style="font-size: 2.5rem; color: #F59E0B; margin-bottom: 1rem;"></i>
            <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Errore di ricerca</p>
            <p style="opacity: 0.8; font-size: 0.9rem;">${message}</p>
        </div>
    `;
    if (indicators) indicators.innerHTML = '';
}

function displaySchools(schools) {
    const schoolsCarousel = document.getElementById('schools-carousel');
    const indicators = document.getElementById('school-indicators');
    
    if (!schoolsCarousel) return;
    
    if (!schools || schools.length === 0) {
        schoolsCarousel.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-school" style="font-size: 2.5rem; color: var(--text-secondary); opacity: 0.5; margin-bottom: 1rem;"></i>
                <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Nessuna scuola trovata</p>
                <p style="opacity: 0.8;">Non sono state trovate scuole per questo indirizzo nella provincia selezionata.</p>
            </div>
        `;
        if (indicators) indicators.innerHTML = '';
        return;
    }
    
    schoolSlideIndex = 0;
    
    schoolsCarousel.innerHTML = schools.map((school, index) => `
        <div class="school-card" style="display: ${index === 0 ? 'flex' : 'none'};">
            <div>
                <div class="school-name">${school.denominazione || 'Nome non disponibile'}</div>
                <div class="school-address">
                    <i class="fas fa-map-marker-alt"></i> 
                    ${school.indirizzo || 'Indirizzo non disponibile'}, ${school.cap} ${school.comune} (${school.provincia || 'N/D'})
                </div>
                <div style="margin: 1rem 0; padding: 0.75rem; background: white; border-radius: 8px; font-size: 0.9rem;">
                    <strong>Tipo:</strong> ${school.tipoDiIstruzione || 'Non specificata'} (${school.scuolaStatale === '1' ? 'Statale' : 'Paritaria'})
                </div>
            </div>
            <div class="school-info">
                <span>
                    <i class="fas fa-envelope"></i> 
                    ${school.email && school.email !== 'Non Disponibile' ? `<a href="mailto:${school.email}" style="color: inherit; text-decoration: none;">Email</a>` : 'Email N/D'}
                </span>
                <span>
                    <i class="fas fa-phone"></i> 
                    ${school.telefono || 'Telefono N/D'}
                </span>
            </div>
        </div>
    `).join('');
    
    if (indicators) {
        indicators.innerHTML = schools.map((_, index) => 
            `<span class="indicator ${index === 0 ? 'active' : ''}" onclick="currentSchool(${index})"></span>`
        ).join('');
    }

    const prevBtn = document.querySelector('.schools-carousel .prev-btn');
    const nextBtn = document.querySelector('.schools-carousel .next-btn');
    if(schools.length <= 1) {
        if(prevBtn) prevBtn.style.display = 'none';
        if(nextBtn) nextBtn.style.display = 'none';
    } else {
        if(prevBtn) prevBtn.style.display = 'flex';
        if(nextBtn) nextBtn.style.display = 'flex';
    }
}

//Carousel
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

// Reset Quiz
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

    updateProgressAndButtons();
    showHeroSlide(heroSlideIndex);
    
    // Auto-play
    setInterval(autoPlayHero, 5000);
});