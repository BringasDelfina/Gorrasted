const mainImage = document.getElementById('main-product-img');
const thumbnailsDiv = document.getElementById('thumbnails');
const productInfo = document.getElementById('product-info');

// Obtener ID de la URL
const params = new URLSearchParams(window.location.search);
const gorraId = params.get("id");

async function cargarDetalle() {
    try {
        const response = await fetch(`/gorras/${gorraId}`);
        const gorra = await response.json();

        if (gorra.error) {
            productInfo.innerHTML = `<p>${gorra.error}</p>`;
            return;
        }

        // Tomar el array de imágenes
        const imagenes = gorra.imagenes || [gorra.imagen]; // fallback a imagen si no hay array

        // Imagen principal
        mainImage.src = imagenes[0];

        // Miniaturas
        thumbnailsDiv.innerHTML = imagenes.map((src, idx) => 
            `<img src="${src}" class="thumbnail" data-index="${idx}" 
                  onerror="this.onerror=null;this.src='/static/imagenes/gorras.png';" />`
        ).join("");

        // Seleccionar todas las miniaturas recién agregadas
        const thumbs = document.querySelectorAll("#thumbnails .thumbnail");

        // Marcar la primera como activa
        if (thumbs.length > 0) {
            thumbs[0].classList.add("active");
        }

        // Intercambiar imagen principal al hacer click en miniatura
        thumbs.forEach((thumb, idx) => {
            thumb.addEventListener("click", () => {
                mainImage.src = imagenes[idx]; // solo cambia la imagen principal
                thumbs.forEach(t => t.classList.remove("active"));
                thumb.classList.add("active");
            });
        });

        // Si la imagen principal falla, mostrar una por defecto
        mainImage.onerror = function() {
            this.onerror = null;
            this.src = '/static/imagenes/gorras.png';
        };

        // Información del producto
        productInfo.innerHTML = `
            <h1>${gorra.nombre}</h1>
            <p class="product-price">$${gorra.precio}</p>
            <p class="product-description">
                Una gorra de diseño exclusivo, ideal para tu estilo. 
            </p>
            <a href="https://wa.me/5493584194532?text=Hola,%20me%20interesa%20la%20${gorra.nombre}" 
               target="_blank" 
               class="btn-whatsapp">
                <i class="fab fa-whatsapp"></i> Comprar por WhatsApp
            </a>
        `;

    } catch (error) {
        console.error("Error cargando detalle:", error);
        productInfo.innerHTML = "<p>Error al cargar el producto.</p>";
    }
}

cargarDetalle();
