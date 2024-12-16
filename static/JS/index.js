document.getElementById('questionario').addEventListener('submit', function (event) {
    event.preventDefault();
    try {
        let punteggioTotale = 0;

        punteggioTotale += parseInt(document.getElementById('sport').value);
        punteggioTotale += parseInt(document.getElementById('hobbyLavoro').value);
        punteggioTotale += parseInt(document.getElementById('lavoro').value);
        punteggioTotale += parseInt(document.getElementById('teoricaPratica').value);
        punteggioTotale += parseInt(document.getElementById('ambizioni').value);
        punteggioTotale += parseInt(document.getElementById('sogni').value);
        punteggioTotale += parseInt(document.getElementById('obiettivo').value);
        punteggioTotale += parseInt(document.getElementById('ispirazione').value);
        punteggioTotale += parseInt(document.getElementById('ambizione').value);
        punteggioTotale += parseInt(document.getElementById('determinazione').value);
        punteggioTotale += parseInt(document.getElementById('fiducia').value);
        punteggioTotale += parseInt(document.getElementById('futuro').value);
        punteggioTotale += parseInt(document.getElementById('argomenti').value);

        let messaggio = '';

        if (punteggioTotale < 20) {
            messaggio = 'Istituto Professionale';
        }
        else if (punteggio > 20 && punteggio < 30) {
            messaggio = 'Liceo Scentifico - Liceo Classico'
        }
        else if (punteggioTotale < 40) {
            messaggio = 'Indirizzo Chimico - Biologico - Agrario';
        } else {
            messaggio = 'Istituto Tecnico - Tecnologico';
        }

        document.getElementById('risultato').innerText = messaggio;
    } catch (error) {
        console.error('Si è verificato un errore:', error);
        document.getElementById('risultato').innerText = 'Si è verificato un errore durante l\'elaborazione delle risposte. Riprova.';
    }
});