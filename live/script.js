const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxVideo = document.getElementById('lightbox-video');
const downloadBtn = document.getElementById('download-btn');
const likeBtn = document.getElementById('like-btn');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const totalVideos = 65;
const videos = [];
let currentIndex = 0;

// Lista de videos + miniaturas
for (let i = 1; i <= totalVideos; i++) {
  videos.push({
    src: `fondos/live${i}.mp4`,
    poster: `fondos/miniatura/live${i}.png`
  });
}

// Crear galería con IMÁGENES en lugar de videos (mucho más rápido)
videos.forEach(({src, poster}, index) => {
  const img = document.createElement('img');
  img.dataset.src = poster; // carga diferida
  img.alt = `Live wallpaper ${index+1}`;
  img.classList.add('gallery-thumb');
  img.loading = 'lazy';
  img.addEventListener('click', () => openLightbox(index));
  gallery.appendChild(img);
});

// Lazy load con IntersectionObserver
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.add('visible');
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('.gallery-thumb').forEach(img => observer.observe(img));

// Abrir lightbox
function openLightbox(index) {
  const videoData = videos[index];
  lightboxVideo.src = videoData.src;
  lightboxVideo.play();
  downloadBtn.href = videoData.src;
  lightbox.classList.add('active');
  likeBtn.setAttribute('aria-pressed', 'false');
  currentIndex = index;
}

// Cerrar lightbox
function closeLightbox() {
  lightbox.classList.remove('active');
  lightboxVideo.pause();
  lightboxVideo.removeAttribute('src'); // libera memoria
}

closeBtn.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});

// Navegar
prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + videos.length) % videos.length;
  openLightbox(currentIndex);
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % videos.length;
  openLightbox(currentIndex);
});

// Like toggle
likeBtn.addEventListener('click', () => {
  const pressed = likeBtn.getAttribute('aria-pressed') === 'true';
  likeBtn.setAttribute('aria-pressed', String(!pressed));
});

// Swipe en móviles
let touchStartX = 0;
let touchEndX = 0;
const minSwipeDistance = 50;

lightboxVideo.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

lightboxVideo.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipeGesture();
});

function handleSwipeGesture() {
  const diff = touchEndX - touchStartX;
  if (Math.abs(diff) > minSwipeDistance) {
    if (diff > 0) {
      prevBtn.click();
    } else {
      nextBtn.click();
    }
  }
}
