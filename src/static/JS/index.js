const API_URL = 'api';

// Funzione per controllare il login
function checkLogin() {
    const token = localStorage.getItem('nextstep_token');
    if (token) {
        window.location.href = 'dashboard.html';
    } else {
        window.location.href = 'login.html';
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const toggle = document.querySelector('.mobile-menu-toggle i');
    menu.classList.toggle('active');
    
    if (menu.classList.contains('active')) {
        toggle.classList.remove('fa-bars');
        toggle.classList.add('fa-times');
    } else {
        toggle.classList.remove('fa-times');
        toggle.classList.add('fa-bars');
    }
}

// Aggiorna bottone auth in base allo stato
function updateAuthButton() {
    const token = localStorage.getItem('nextstep_token');
    const btn = document.getElementById('auth-btn');
    if (token) {
        const user = JSON.parse(localStorage.getItem('nextstep_user') || '{}');
        btn.innerHTML = `<i class="fas fa-user-circle"></i> ${user.nome || 'Dashboard'}`;
    }
}

// Funzione per popolare il select degli indirizzi
function populateIndirizziSelect() {
    const select = document.getElementById('search-indirizzo');
    if (!select) return;
    
    const grouped = {};
    Object.entries(indirizzoMap).forEach(([codice, info]) => {
        if (!grouped[info.percorso]) grouped[info.percorso] = [];
        grouped[info.percorso].push({ codice, ...info });
    });
    
    Object.entries(grouped).forEach(([percorso, indirizzi]) => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = percorso;
        indirizzi.forEach(ind => {
            const option = document.createElement('option');
            option.value = ind.codice;
            option.textContent = ind.descrizione;
            optgroup.appendChild(option);
        });
        select.appendChild(optgroup);
    });
}
// Funzione per cercare scuole per indirizzo
async function searchSchoolsByIndirizzo() {
    const indirizzo = document.getElementById('search-indirizzo').value;
    const regione = document.getElementById('search-regione').value;
    const provincia = document.getElementById('search-provincia').value;
    const comune = document.getElementById('search-comune').value;
    
    if (!indirizzo || !regione || !provincia) {
        alert('Compila almeno Indirizzo, Regione e Provincia');
        return;
    }
    
    const info = indirizzoMap[indirizzo];
    if (!info) {
        alert('Indirizzo non valido');
        return;
    }
    
    const regioneCodice = regionMap[regione];
    if (!regioneCodice) {
        alert('Regione non valida');
        return;
    }
    
    document.getElementById('search-results').style.display = 'block';
    document.getElementById('search-results').scrollIntoView({ behavior: 'smooth' });
    
    await searchSchools(
        regioneCodice,
        provincia.toUpperCase(),
        indirizzo,
        info.percorso,
        comune,
        'search-schools-grid'
    );
}

// Variabili globali
let currentStep = 1;
let totalSteps = 3;
let heroSlideIndex = 1;
let infoSlideIndex = 0;
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

// regionMap
const regionMap = {
    'ABRUZZO': 'AB', 'BASILICATA': 'BA', 'CALABRIA': 'CA', 'CAMPANIA': 'CM', 'EMILIA-ROMAGNA': 'ER',
    'FRIULI-VENEZIA GIULIA': 'FV', 'LAZIO': 'LA', 'LIGURIA': 'LI', 'LOMBARDIA': 'LO', 'MARCHE': 'MA',
    'MOLISE': 'MO', 'PIEMONTE': 'PM', 'PUGLIA': 'PU', 'SARDEGNA': 'SA', 'SICILIA': 'SI', 'TOSCANA': 'TO',
    'TRENTINO-ALTO ADIGE': 'TA', 'UMBRIA': 'UM', "VALLE D'AOSTA": 'VA', 'VENETO': 'VE'
};

// Classe OrientamentoAlgorithm
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

        // 1. Teoria/Pratica: pesi più graduali
        const tp = parseInt(teoricaPratica);
        if (tp <= 2) { // Teorico
            this.adjustScores(scores, "Licei", 2);
            this.adjustScores(scores, "Tecnici", 0);
            this.adjustScores(scores, "Professionali", -1);
        } else if (tp === 3) { // Neutro
            this.adjustScores(scores, "Licei", 1);
            this.adjustScores(scores, "Tecnici", 1);
            this.adjustScores(scores, "Professionali", 1);
        } else { // Pratico
            this.adjustScores(scores, "Licei", -1);
            this.adjustScores(scores, "Tecnici", 2);
            this.adjustScores(scores, "Professionali", 1);
        }

        // 2. Obiettivo futuro: pesi più bilanciati
        if (obiettivoFuturo === 'universita_lunga') {
            this.adjustScores(scores, "Licei", 2);
            this.adjustScores(scores, "Tecnici", 1);
            this.adjustScores(scores, "Professionali", -2);
        } else if (obiettivoFuturo === 'universita_breve') {
            this.adjustScores(scores, "Licei", 1);
            this.adjustScores(scores, "Tecnici", 2);
            this.adjustScores(scores, "Professionali", 1);
        } else { // Lavoro subito
            this.adjustScores(scores, "Licei", -2);
            this.adjustScores(scores, "Tecnici", 2);
            this.adjustScores(scores, "Professionali", 2);
        }

        // 3. Metodo di studio: pesi ridotti
        switch(metodoStudio) {
            case 'libri': 
                scores['LI01'] += 2; // Classico
                scores['LI11'] += 1; // Scienze Umane
                break;
            case 'logica':
                scores['LI02'] += 1; // Scientifico
                scores['LI03'] += 2; // Scienze Applicate
                scores['IT13'] += 2; // Informatica
                break;
            case 'laboratorio':
                scores['LI03'] += 1; // Scienze Applicate
                scores['IT16'] += 2; // Chimica
                scores['IT10'] += 2; // Elettronica
                scores['IT05'] += 2; // Meccanica
                break;
            case 'creativo':
                this.adjustScoresBySettore(scores, "ARTISTICO", 2);
                scores['IT19'] += 1; // Moda
                scores['IT15'] += 1; // Grafica
                scores['IT13'] += 1; // Informatica
                break;
            case 'gruppo':
                scores['LI11'] += 1; // Scienze Umane
                scores['LI12'] += 1; // Econ-Sociale
                scores['IT04'] += 1; // Turismo
                scores['IP19'] += 1; // Servizi Sanità
                scores['IP17'] += 1; // Alberghiero
                scores['IT13'] += 1; // Informatica
                break;
        }

        // 4. Aree di interesse: pesi più bassi
        scores['LI01'] += parseInt(areaUmanistica) || 0;
        scores['LI11'] += Math.round((parseInt(areaUmanistica) || 0) / 2);

        scores['LI02'] += parseInt(areaScientifica) || 0;
        scores['LI03'] += Math.round((parseInt(areaScientifica) || 0) / 2);

        scores['LI03'] += Math.round((parseInt(areaBioChimica) || 0) / 2);
        scores['IT16'] += parseInt(areaBioChimica) || 0;
        scores['IT21'] += Math.round((parseInt(areaBioChimica) || 0) / 2);

        this.adjustScoresBySettore(scores, "ARTISTICO", Math.round((parseInt(areaArtistica) || 0) / 2));
        scores['LI13'] += Math.round((parseInt(areaArtistica) || 0) / 2);
        scores['LI14'] += Math.round((parseInt(areaArtistica) || 0) / 2);
        scores['IT19'] += Math.round((parseInt(areaArtistica) || 0) / 2);
        scores['IT15'] += Math.round((parseInt(areaArtistica) || 0) / 2);

        scores['IT13'] += parseInt(areaTecnologica) || 0;
        scores['IT10'] += Math.round((parseInt(areaTecnologica) || 0) / 2);
        scores['IT05'] += Math.round((parseInt(areaTecnologica) || 0) / 2);
        scores['IP14'] += Math.round((parseInt(areaTecnologica) || 0) / 2);

        scores['IT01'] += parseInt(areaEconomica) || 0;
        scores['LI12'] += Math.round((parseInt(areaEconomica) || 0) / 2);
        scores['IT04'] += Math.round((parseInt(areaEconomica) || 0) / 2);
        scores['IP16'] += Math.round((parseInt(areaEconomica) || 0) / 2);

        scores['LI11'] += parseInt(areaSociale) || 0;
        scores['LI12'] += Math.round((parseInt(areaSociale) || 0) / 2);
        scores['IP19'] += Math.round((parseInt(areaSociale) || 0) / 2);

        this.adjustScores(scores, "Professionali", Math.round((parseInt(areaPratica) || 0) / 2));
        scores['IT21'] += Math.round((parseInt(areaPratica) || 0) / 2);
        scores['IT24'] += Math.round((parseInt(areaPratica) || 0) / 2);
        scores['IP17'] += Math.round((parseInt(areaPratica) || 0) / 2);
        scores['IP14'] += Math.round((parseInt(areaPratica) || 0) / 2);

        // 5. Ambiente preferito
        const amb = parseInt(ambiente || 0);
        switch(amb) {
            case 1: // Laboratori
                scores['IT16'] += 1;
                scores['IT10'] += 1;
                scores['IT05'] += 1;
                scores['IT13'] += 1;
                this.adjustScoresBySettore(scores, "ARTISTICO", 1);
                break;
            case 2: // Biblioteche
                scores['LI01'] += 1;
                scores['LI02'] += 1;
                scores['LI11'] += 1;
                this.adjustScores(scores, "Licei", 1);
                break;
            case 3: // All'aperto
                scores['IT21'] += 2;
                scores['IP11'] += 2;
                scores['IP12'] += 1;
                scores['LI15'] += 1;
                break;
            case 4: // Digitali
                scores['IT13'] += 2;
                scores['IT15'] += 1;
                scores['IT10'] += 1;
                scores['LI03'] += 1;
                break;
        }

        // 6. Sport/Attività
        const spo = parseInt(sport || 0);
        switch(spo) {
            case 1: // Sport di squadra
                scores['LI15'] += 2;
                this.adjustScores(scores, "Professionali", 1);
                break;
            case 2: // Sport individuali
                scores['LI15'] += 1;
                scores['LI02'] += 1;
                scores['LI03'] += 1;
                break;
            case 3: // Attività artistiche
                this.adjustScoresBySettore(scores, "ARTISTICO", 2);
                scores['LI13'] += 1;
                scores['LI14'] += 1;
                scores['IP18'] += 1;
                break;
            case 4: // Attività tecniche
                scores['IT13'] += 2;
                scores['IT10'] += 2;
                scores['IT05'] += 1;
                scores['IP14'] += 1;
                break;
        }

        // 7. Preferenze lavoro
        const lav = parseInt(lavoro || 0);
        switch(lav) {
            case 1: // Gruppo
                scores['IP17'] += 1;
                scores['IP19'] += 1;
                scores['IT04'] += 1;
                scores['IT13'] += 1;
                this.adjustScores(scores, "Professionali", 1);
                break;
            case 2: // Autonomo
                scores['LI01'] += 1;
                scores['LI02'] += 1;
                scores['IT01'] += 1;
                this.adjustScores(scores, "Licei", 1);
                break;
            case 3: // Entrambi
                scores['IT01'] += 1;
                scores['IT04'] += 1;
                scores['LI12'] += 1;
                this.adjustScoresBySettore(scores, "TECNOLOGICO", 1);
                break;
        }

        // 8. Hobby come lavoro
        const hobbyLav = parseInt(responses.hobbyLavoro || 0);
        switch(hobbyLav) {
            case 1: // Sì, assolutamente
                this.adjustScoresBySettore(scores, "ARTISTICO", 1);
                scores['IT15'] += 1;
                scores['IP18'] += 1;
                break;
            case 2: // Forse, se possibile
                this.adjustScoresBySettore(scores, "ARTISTICO", 1);
                scores['LI13'] += 1;
                scores['LI14'] += 1;
                scores['IP18'] += 1;
                scores['IP17'] += 1;
                break;
            case 3: // No, preferisco tenerli separati
                this.adjustScores(scores, "Tecnici", 1);
                this.adjustScores(scores, "Licei", 1);
                break;
        }

        // 9. Sogni d'infanzia
        const sogniVal = parseInt(responses.sogni || 0);
        switch(sogniVal) {
            case 1: // Professioni scientifiche
                scores['LI02'] += 1;
                scores['LI03'] += 1;
                scores['IT13'] += 1;
                scores['IT16'] += 1;
                break;
            case 2: // Professioni umanistiche
                scores['LI01'] += 1;
                scores['LI11'] += 1;
                scores['LI04'] += 1;
                break;
            case 3: // Professioni artistiche
                this.adjustScoresBySettore(scores, "ARTISTICO", 1);
                scores['LI13'] += 1;
                scores['LI14'] += 1;
                break;
            case 4: // Professioni tecniche
                scores['IT13'] += 1;
                scores['IT10'] += 1;
                scores['IT05'] += 1;
                this.adjustScores(scores, "Tecnici", 1);
                break;
            case 5: // Non ho un sogno specifico
                // Non modifica i punteggi
                break;
        }

        // 10. Ambizione
        const ambVal = parseInt(responses.ambizione || 3);
        if (ambVal >= 4) { // Alta ambizione
            this.adjustScores(scores, "Licei", 1);
            scores['LI02'] += 1;
            scores['IT13'] += 1;
            scores['IT01'] += 1;
        } else if (ambVal <= 2) { // Bassa ambizione
            this.adjustScores(scores, "Professionali", 1);
            this.adjustScores(scores, "Tecnici", 1);
        }

        // 11. Determinazione
        const detVal = parseInt(responses.determinazione || 3);
        if (detVal >= 4) { // Alta determinazione
            this.adjustScores(scores, "Licei", 1);
            this.adjustScores(scores, "Tecnici", 1);
        } else if (detVal <= 2) { // Bassa determinazione
            this.adjustScores(scores, "Professionali", 1);
        }

        // 12. Obiettivi futuri
        const futVal = parseInt(responses.futuro || 0);
        switch(futVal) {
            case 1: // Carriera accademica
                scores['LI01'] += 1;
                scores['LI02'] += 1;
                scores['LI03'] += 1;
                this.adjustScores(scores, "Licei", 1);
                break;
            case 2: // Libero professionista
                scores['IT01'] += 1;
                scores['IT04'] += 1;
                scores['IP17'] += 1;
                scores['IP16'] += 1;
                break;
            case 3: // Imprenditore
                scores['IT01'] += 1;
                scores['IT13'] += 1;
                scores['IT16'] += 1;
                this.adjustScores(scores, "Tecnici", 1);
                break;
            case 4: // Dipendente specializzato
                this.adjustScores(scores, "Tecnici", 1);
                this.adjustScores(scores, "Professionali", 1);
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


// Funzioni Hero Carousel
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

// Funzioni Quiz 
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
        'regione', 'provincia', 'comune', 'ambiente', 'sport', 'lavoro',
        'hobbyLavoro', 'sogni', 'ambizione', 'determinazione', 'futuro'
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
    
    if (!responses.regione || !responses.provincia || !responses.comune) {
        alert('Per favore completa tutti i campi obbligatori');
        return;
    }
    
    const recommendation = algorithm.getRecommendedPath(responses);
    
    // Salva il risultato se l'utente è loggato
    const token = localStorage.getItem('nextstep_token');
    if (token) {
        try {
            await fetch(`${API_URL}/results.php?action=save`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    indirizzoCodice: recommendation.indirizzoCodice,
                    indirizzoDesc: recommendation.indirizzoDesc,
                    percorso: recommendation.percorso,
                    settore: indirizzoMap[recommendation.indirizzoCodice].settore,
                    regione: responses.regione,
                    provincia: responses.provincia,
                    comune: responses.comune,
                    risposte: responses,
                    punteggi: recommendation.scores
                })
            });
        } catch (error) {
            console.error('Errore salvataggio risultato:', error);
        }
    }
    
    // Continua con la visualizzazione normale
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
    const userCity = responses.comune;
    
    await searchSchools(
        regioneCodice, 
        provinciaCodice, 
        recommendation.indirizzoCodice, 
        recommendation.percorso,
        userCity
    );
    
    if (resultsContainer) {
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
}
async function searchSchools(regione, provincia, indirizzoDiStudio, percorso, userCity, gridId = 'schools-grid') {
    const proxyUrl = 'https://corsproxy.io/?';
    const url = `https://unica.istruzione.gov.it/services/sic/api/v1.0/ricerche/ricercaAvanzata?regione=${regione}&indirizzoDiStudio=${indirizzoDiStudio}&percorso=${percorso}&provincia=${provincia}&tipoDiIstruzione=SS&numeroElementiPagina=30&numeroPagina=1`;

    const schoolsGrid = document.getElementById(gridId);
    if (!schoolsGrid) {
        console.error('Grid non trovata:', gridId);
        return;
    }
    
    schoolsGrid.innerHTML = `<div style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--primary-color);"></i><p style="margin-top: 1rem;">Ricerca scuole in corso...</p></div>`;

    try {
        const response = await fetch(proxyUrl + encodeURIComponent(url));
        
        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        schoolsData = data.scuole || [];
        displaySchools(schoolsData, userCity, gridId);

    } catch (error) {
        console.error('Errore nella ricerca delle scuole:', error);
        displayError("Impossibile contattare il servizio di ricerca scuole.", gridId);
    }
}

function displayError(message, gridId = 'schools-grid') {
    const schoolsGrid = document.getElementById(gridId);
    
    schoolsGrid.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <i class="fas fa-exclamation-triangle" style="font-size: 2.5rem; color: #F59E0B; margin-bottom: 1rem;"></i>
            <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Errore di ricerca</p>
            <p style="opacity: 0.8; font-size: 0.9rem;">${message}</p>
        </div>
    `;
}

function displaySchools(schools, userCity, gridId = 'schools-grid') {
    const schoolsGrid = document.getElementById(gridId);
    
    if (!schoolsGrid) return;
    
    if (!schools || schools.length === 0) {
        schoolsGrid.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-school" style="font-size: 2.5rem; color: var(--text-secondary); opacity: 0.5; margin-bottom: 1rem;"></i>
                <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Nessuna scuola trovata</p>
                <p style="opacity: 0.8;">Non sono state trovate scuole per questo indirizzo nella provincia selezionata.</p>
            </div>
        `;
        return;
    }

    const cityUpper = userCity ? userCity.toUpperCase() : '';
    let sortedSchools = schools;

    if (cityUpper) {
        const citySchools = [];
        const otherSchools = [];
        
        schools.forEach(school => {
            if (school.comune.toUpperCase() === cityUpper) {
                citySchools.push(school);
            } else {
                otherSchools.push(school);
            }
        });
        
        sortedSchools = [...citySchools, ...otherSchools];
    }
    
    schoolsGrid.innerHTML = sortedSchools.map((school) => `
        <div class="school-card">
            <div>
                <div class="school-name">${school.denominazione || 'Nome non disponibile'}</div>
                <div class="school-address">
                    <i class="fas fa-map-marker-alt"></i> 
                    ${school.indirizzo || 'Indirizzo non disponibile'}, ${school.cap} ${school.comune} (${school.provincia || 'N/D'})
                </div>
                <div style="margin: 1rem 0; padding: 0.75rem; background: white; border-radius: 8px; font-size: 0.9rem;">
                    <strong>Tipo:</strong> ${school.scuolaStatale === '1' ? 'Statale' : 'Paritaria'}
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
}


// Funzioni Info Carousel
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

document.addEventListener('DOMContentLoaded', function() {
    updateProgressAndButtons();
    showHeroSlide(heroSlideIndex);
    updateAuthButton();
    populateIndirizziSelect();
    
    // Mostra sezione ricerca scuole
    const searchSection = document.getElementById('school-search-section');
    if (searchSection) searchSection.style.display = 'block';
    
    setInterval(autoPlayHero, 5000);
});
