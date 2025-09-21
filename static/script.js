document.addEventListener("DOMContentLoaded", async function() {
    const gorrasGrid = document.getElementById("gorras-grid");
    const carritoLateral = document.getElementById("carrito-lateral");
    const cerrarCarritoBtn = document.getElementById("cerrar-carrito");
    let productos = [];
    let carrito = [];

    // Cerrar carrito
    cerrarCarritoBtn.addEventListener("click", () => {
        carritoLateral.classList.remove("abierto");
    });

    // Cargar productos desde JSON
    try {
        const response = await fetch("/static/gorras.json");
        if (!response.ok) throw new Error("No se pudo cargar el JSON");

        productos = await response.json();

        // Renderizar grilla de gorras
        gorrasGrid.innerHTML = productos.map(gorra => `
            <div class="gorras-item">
                <a href="/detalle?id=${gorra.id}" class="detalle-link">
                    <img src="${gorra.imagen}" alt="${gorra.nombre}">
                    <h3>${gorra.nombre}</h3>
                </a>
                <p class="price">$${gorra.precio}</p>
                <div class="botones-cantidad">
                    <button onclick="modificarCarrito(${gorra.id}, -1)">➖</button>
                    <span id="cantidad-${gorra.id}">0</span>
                    <button onclick="modificarCarrito(${gorra.id}, 1)">➕</button>
                </div>
            </div>
        `).join("");

    } catch (error) {
        console.error("Error cargando gorras:", error);
        gorrasGrid.innerHTML = "<p>Error al cargar los productos.</p>";
    }

    // Función para agregar/quitar cantidad del carrito
    window.modificarCarrito = function(id, cambio) {
        const producto = productos.find(p => p.id === id);
        let item = carrito.find(p => p.id === id);

        if (item) {
            item.cantidad += cambio;
            if (item.cantidad <= 0) {
                carrito = carrito.filter(p => p.id !== id);
            }
        } else if (cambio > 0) {
            carrito.push({ ...producto, cantidad: 1 });
        }

        // Actualizar cantidad en la grilla
        const cantidadSpan = document.getElementById(`cantidad-${id}`);
        const actualItem = carrito.find(p => p.id === id);
        cantidadSpan.textContent = actualItem ? actualItem.cantidad : 0;

        // Actualizar carrito lateral
        actualizarCarrito();
        abrirCarrito();
    }

    // Abrir carrito lateral
    function abrirCarrito() {
        carritoLateral.classList.add("abierto");
    }

    // Actualizar carrito lateral
    function actualizarCarrito() {
        const lista = document.getElementById("carrito-lista");
        const totalSpan = document.getElementById("carrito-total");

        lista.innerHTML = "";
        let total = 0;

        carrito.forEach(item => {
            total += item.precio * item.cantidad;

            const li = document.createElement("li");
            li.innerHTML = `
                ${item.nombre} - $${item.precio} x ${item.cantidad} = $${item.precio * item.cantidad}
            `;
            lista.appendChild(li);
        });

        totalSpan.textContent = total;
    }

        const whatsappBtn = document.querySelector('.btn-whatsapp');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function (e) {
            e.preventDefault();

            let mensaje = "Quería consultar por las gorras:\n";
            if (carrito.length === 0) {
                mensaje += "Sin productos seleccionados.";
            } else {
                carrito.forEach(item => {
                    mensaje += `- ${item.nombre} x${item.cantidad} ($${item.precio * item.cantidad})\n`;
                });
                mensaje += `Total: $${carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)}`;
            }

            const mensajeCodificado = encodeURIComponent(mensaje);
            const url = `https://web.whatsapp.com/send?phone=5493584194532&text=${mensajeCodificado}`;
            window.open(url, '_blank');
        });
    }
});
