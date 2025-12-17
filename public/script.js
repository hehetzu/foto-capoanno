document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData();
  const fileInput = document.getElementById('photoInput');
  const messageDiv = document.getElementById('message');

  if (!fileInput.files[0]) {
    messageDiv.innerHTML = '<p style="color: red;">Seleziona una foto prima di caricare.</p>';
    return;
  }

  formData.append('photo', fileInput.files[0]);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      messageDiv.innerHTML = `<p style="color: green;">${result.message}</p>`;
      fileInput.value = ''; // Reset the input
      loadPhotos(); // Reload the gallery
    } else {
      messageDiv.innerHTML = `<p style="color: red;">Errore: ${result.error}</p>`;
    }
  } catch (error) {
    messageDiv.innerHTML = '<p style="color: red;">Errore nel caricamento della foto.</p>';
    console.error('Upload error:', error);
  }
});

document.getElementById('loadPhotos').addEventListener('click', loadPhotos);

async function loadPhotos() {
  try {
    const response = await fetch('/photos');
    const photos = await response.json();
    const gallery = document.getElementById('gallery');

    gallery.innerHTML = '';

    if (photos.length === 0) {
      gallery.innerHTML = '<p>Nessuna foto caricata ancora.</p>';
      return;
    }

    photos.forEach(photo => {
      const img = document.createElement('img');
      img.src = photo;
      img.alt = 'Foto caricata';
      gallery.appendChild(img);
    });
  } catch (error) {
    console.error('Error loading photos:', error);
    document.getElementById('gallery').innerHTML = '<p>Errore nel caricamento delle foto.</p>';
  }
}

// Load photos on page load
loadPhotos();