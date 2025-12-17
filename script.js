// --- Configurazione per Cloudinary ---
const CLOUD_NAME = "dherkuwvn"; // Sostituisci con il tuo Cloud Name da Cloudinary
const UPLOAD_PRESET = "foto_uploader"; // Sostituisci con il nome del tuo preset (es. "foto-serata")

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// --- Gestione del caricamento ---
const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const statusMessage = document.getElementById('uploadStatus');
const spinner = document.querySelector('.spinner');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impedisce al form di ricaricare la pagina

    const allFiles = Array.from(fileInput.files);
    if (allFiles.length === 0) return;

    // --- NUOVA PARTE: Controllo duplicati ---
    const existingImages = JSON.parse(localStorage.getItem('imageUrls')) || [];
    const filesToUpload = allFiles.filter(file => 
        !existingImages.some(img => img.name === file.name && img.size === file.size)
    );

    const duplicateCount = allFiles.length - filesToUpload.length;
    if (duplicateCount > 0) {
        alert(`${duplicateCount} foto sono già presenti nella galleria e non verranno caricate di nuovo.`);
    }

    if (filesToUpload.length === 0) {
        statusMessage.textContent = 'Nessuna nuova foto da caricare.';
        form.reset();
        return;
    }
    // --- FINE CONTROLLO DUPLICATI ---

    spinner.style.display = 'block';
    statusMessage.textContent = `Caricamento di ${filesToUpload.length} foto...`;
    statusMessage.style.color = '#606770';

    // Creiamo una lista di "promesse" di caricamento, una per ogni file
    const uploadPromises = filesToUpload.map(file => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('tags', 'foto_capodanno_2024');

        return fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData,
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Caricamento di ${file.name} fallito.`);
            }
            return response.json();
        }).then(data => ({ url: data.secure_url, name: file.name, size: file.size })); // Salviamo URL, nome e dimensione
    });

    try {
        // Aspettiamo che tutti i caricamenti siano completati
        const uploadedImages = await Promise.all(uploadPromises);

        // --- NUOVA PARTE: Salviamo l'URL della foto nel browser ---
        // 1. Recupera la lista di foto esistente (o crea una lista vuota)
        let imageUrls = JSON.parse(localStorage.getItem('imageUrls')) || [];
        // 2. Aggiungi tutti i nuovi oggetti immagine alla lista
        imageUrls.push(...uploadedImages);
        // 3. Salva la lista aggiornata
        localStorage.setItem('imageUrls', JSON.stringify(imageUrls));
        // --- FINE NUOVA PARTE ---

        spinner.style.display = 'none';
        statusMessage.textContent = `Festa! ${uploadedImages.length} foto aggiunte!`;
        statusMessage.style.color = '#28a745';
        form.reset(); // Pulisce il campo di input

        // Lancia un'esplosione di coriandoli per festeggiare!
        confetti({
            particleCount: 150,
            spread: 120,
            origin: { y: 0.6 }
        });

        // Pulisce il messaggio e ricarica lo slideshow dopo 3 secondi
        setTimeout(() => {
            statusMessage.textContent = '';
            location.reload(); // Ricarica la pagina per aggiornare lo slideshow con le nuove foto
        }, 2500);
    } catch (error) {
        console.error("Errore nel caricamento:", error);
        spinner.style.display = 'none';
        statusMessage.textContent = 'Errore durante il caricamento. Riprova.';
        statusMessage.style.color = 'red';
    }
});

// --- NUOVA PARTE: Funzione per lo slideshow ---
function initSlideshow() {
    const slideshowContainer = document.querySelector(".slideshow-container");
    const bookPage = document.querySelector(".book-page");
    // Legge le foto salvate nel browser
    const images = JSON.parse(localStorage.getItem("imageUrls")) || [];
    const imageUrls = images.map(img => img.url).reverse(); // Estrae solo gli URL e inverte l'ordine

    // Se non ci sono foto o il contenitore non esiste, non fa nulla
    if (images.length === 0 || !bookPage) {
        return;
    }

    // Mostra il contenitore dello slideshow
    slideshowContainer.style.display = "block";

    let currentSlide = 0;

    // Imposta la prima immagine
    bookPage.style.backgroundImage = `url(${imageUrls[currentSlide]})`;

    setInterval(() => {
        // Dissolvenza in uscita
        bookPage.style.opacity = '0';

        setTimeout(() => {
            currentSlide = (currentSlide + 1) % imageUrls.length;
            bookPage.style.backgroundImage = `url(${imageUrls[currentSlide]})`;
            bookPage.style.opacity = '1'; // Dissolvenza in entrata
        }, 800); // Aspetta la fine della dissolvenza in uscita (durata aumentata)
    }, 4000); // Cambia immagine ogni 4 secondi
}

// --- NUOVA PARTE: Funzione per i coriandoli di sfondo ---
function startParty() {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // Lancia i coriandoli da entrambi i lati
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

// Avvia lo slideshow quando la pagina è completamente caricata
document.addEventListener('DOMContentLoaded', () => {
    initSlideshow();
    startParty(); // Avvia i coriandoli!
});