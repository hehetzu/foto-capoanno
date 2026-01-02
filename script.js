// --- Configurazione Cloudinary ---
const CLOUD_NAME = "dherkuwvn"; 
const UPLOAD_PRESET = "foto_uploader"; 
const TAG = "foto_capodanno_2024";
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const LIST_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${TAG}.json`;

const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const statusMessage = document.getElementById('uploadStatus');
const spinner = document.querySelector('.spinner');

// Caricamento Foto
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const files = Array.from(fileInput.files);
    if (files.length === 0) return;

    spinner.style.display = 'block';
    statusMessage.textContent = `Caricamento di ${files.length} foto...`;

    const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('tags', TAG); // Assegna il tag per la condivisione

        return fetch(UPLOAD_URL, { method: 'POST', body: formData })
            .then(res => res.json());
    });

    try {
        await Promise.all(uploadPromises);
        spinner.style.display = 'none';
        statusMessage.textContent = "Festa! Foto aggiunte alla galleria comune!";
        statusMessage.style.color = '#28a745';
        
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        
        setTimeout(() => location.reload(), 2500);
    } catch (err) {
        statusMessage.textContent = "Errore nel caricamento.";
        spinner.style.display = 'none';
    }
});

// Slideshow Condiviso
async function initSlideshow() {
    const bookPage = document.querySelector(".book-page");
    const container = document.querySelector(".slideshow-container");
    if (!bookPage) return;

    try {
        const res = await fetch(LIST_URL);
        const data = await res.json();
        const images = data.resources.map(img => 
            `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v${img.version}/${img.public_id}.${img.format}`
        ).reverse();

        if (images.length > 0) {
            container.style.display = "block";
            let current = 0;
            bookPage.style.backgroundImage = `url(${images[current]})`;
            
            setInterval(() => {
                bookPage.style.opacity = '0';
                setTimeout(() => {
                    current = (current + 1) % images.length;
                    bookPage.style.backgroundImage = `url(${images[current]})`;
                    bookPage.style.opacity = '1';
                }, 800);
            }, 4000);
        }
    } catch (e) { console.log("Slideshow vuoto o errore"); }
}

document.addEventListener('DOMContentLoaded', () => {
    initSlideshow();
});
