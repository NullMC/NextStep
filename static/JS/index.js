document.getElementById('questionario').addEventListener('submit', function (event) {
    event.preventDefault();
    try {
        let punteggioTotale = 0;

        punteggioTotale += parseInt(document.getElementById('sport').value) || 0;
        punteggioTotale += parseInt(document.getElementById('hobbyLavoro').value) || 0;
        punteggioTotale += parseInt(document.getElementById('lavoro').value) || 0;
        punteggioTotale += parseInt(document.getElementById('teoricaPratica').value) || 0;
        punteggioTotale += parseInt(document.getElementById('ambizioni').value) || 0;
        punteggioTotale += parseInt(document.getElementById('sogni').value) || 0;
        punteggioTotale += parseInt(document.getElementById('obiettivo').value) || 0;
        punteggioTotale += parseInt(document.getElementById('ispirazione').value) || 0;
        punteggioTotale += parseInt(document.getElementById('ambizione').value) || 0;
        punteggioTotale += parseInt(document.getElementById('determinazione').value) || 0;
        punteggioTotale += parseInt(document.getElementById('fiducia').value) || 0;
        punteggioTotale += parseInt(document.getElementById('futuro').value) || 0;
        punteggioTotale += parseInt(document.getElementById('argomenti').value) || 0;

        let messaggio = '';

        if (punteggioTotale < 20) {
            messaggio = 'Istituto Professionale';
        } else if (punteggioTotale >= 20 && punteggioTotale < 30) {
            messaggio = 'Liceo Scientifico - Liceo Classico';
        } else if (punteggioTotale < 40) {
            messaggio = 'Indirizzo Chimico - Biologico - Agrario';
        } else {
            messaggio = 'Istituto Tecnico - Tecnologico';
        }

        let text = document.getElementById('hidden');
        text.classList.remove('hidden')
        document.getElementById('risultato').innerText = messaggio;
    } catch (error) {
        console.error('Si è verificato un errore:', error);
        document.getElementById('risultato').innerText = 'Si è verificato un errore durante l\'elaborazione delle risposte. Riprova.';
    }
});