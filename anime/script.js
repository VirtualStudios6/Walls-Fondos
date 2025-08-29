const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const downloadBtn = document.getElementById('download-btn');
const likeBtn = document.getElementById('like-btn');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const totalImages = 50; // Cambia según cuántas tengas
const images = [];
let currentIndex = 0;

// Generar imágenes con srcset y sizes (puedes agregar versiones small/medium si las tienes)
for (let i = 1; i <= totalImages; i++) {
  images.push({
    src: `fondos/anime${i}.jpg`,
    srcset: `fondos/anime${i}.jpg 480w, fondos/anime${i}.jpg 800w, fondos/anime${i}.jpg 1200w`, // mismo src como ejemplo
    sizes: '(max-width: 600px) 100vw, 120px',
    alt: `Wallpaper anime ${i}`
  });
}

// Crear galería dinámicamente con carga diferida usando IntersectionObserver
images.forEach(({src, srcset, sizes, alt}) => {
  const img = document.createElement('img');
  img.dataset.src = src;       // carga diferida en data-src
  img.dataset.srcset = srcset;
  img.dataset.sizes = sizes;
  img.alt = alt;
  img.classList.add('gallery-img');
  img.crossOrigin = "anonymous";
  img.loading = "lazy"; // fallback para navegadores que no soportan IntersectionObserver
  gallery.appendChild(img);
});

// IntersectionObserver para lazy load con animación
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.srcset = img.dataset.srcset;
      img.sizes = img.dataset.sizes;
      img.classList.add('visible');
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('.gallery-img').forEach(img => observer.observe(img));

// Abrir lightbox
gallery.addEventListener('click', e => {
  if (e.target && e.target.tagName === 'IMG') {
    currentIndex = Array.from(gallery.children).indexOf(e.target);
    openLightbox(currentIndex);
  }
});

function openLightbox(index) {
  const image = images[index];
  lightboxImg.src = image.src;
  downloadBtn.href = image.src;
  lightbox.classList.add('active');
  likeBtn.setAttribute('aria-pressed', 'false');
  currentIndex = index;
}

// Cerrar lightbox
function closeLightbox() {
  lightbox.classList.remove('active');
}

closeBtn.addEventListener('click', closeLightbox);
closeBtn.addEventListener('touchstart', e => {
  e.preventDefault();
  closeLightbox();
});

// Navegar
prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex -1 + images.length) % images.length;
  openLightbox(currentIndex);
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex +1) % images.length;
  openLightbox(currentIndex);
});

// Like toggle con color rojo
likeBtn.addEventListener('click', () => {
  const pressed = likeBtn.getAttribute('aria-pressed') === 'true';
  likeBtn.setAttribute('aria-pressed', String(!pressed));
});

// Cerrar lightbox al hacer click fuera
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Cerrar con tecla ESC
document.addEventListener('keydown', e => {
  if (e.key === "Escape" && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});

// Swipe para móviles
let touchStartX = 0;
let touchEndX = 0;
const minSwipeDistance = 50; // mínimo para considerar swipe

lightboxImg.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

lightboxImg.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipeGesture();
});

function handleSwipeGesture() {
  const diff = touchEndX - touchStartX;
  if (Math.abs(diff) > minSwipeDistance) {
    if (diff > 0) {
      // swipe derecha (anterior)
      prevBtn.click();
    } else {
      // swipe izquierda (siguiente)
      nextBtn.click();
    }
  }
}