// Fuente de datos: API en vez de data.js estático
let productosDB = [];

async function cargarProductos() {
    try {
        const res = await fetch('/api/productos');
        if (!res.ok) throw new Error('Error al cargar productos');
        productosDB = await res.json();
        productosFiltrados = [...productosDB];
    } catch (e) {
        console.error('No se pudieron cargar productos desde la API:', e);
        productosDB = [];
        productosFiltrados = [];
    }
}

// ========================================
// LOADING SCREEN LOGIC
// ========================================

// Function to preload a single resource
function preloadResource(resource) {
    return new Promise((resolve, reject) => {
        if (resource.type === 'image') {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Resolve anyway to not block loading
            img.src = resource.src;
        }
    });
}

// Main loading function
async function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');

    if (!loadingScreen) return;

    // Get resources to preload
    const resources = [];

    // Add logo
    resources.push({ type: 'image', src: '../img/inicio/bellacatys.png' });

    // Add first 6 product images
    const firstProducts = productosDB.slice(0, 6);
    firstProducts.forEach(producto => {
        if (producto.imagen) {
            resources.push({ type: 'image', src: producto.imagen });
        }
    });

    // Preload all resources
    const preloadPromises = resources.map(resource => preloadResource(resource));

    // Wait for all resources or timeout after 3 seconds
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 3000));

    await Promise.race([
        Promise.all(preloadPromises),
        timeoutPromise
    ]);

    // Wait a bit before hiding
    await new Promise(resolve => setTimeout(resolve, 500));

    // Hide loading screen
    loadingScreen.classList.add('hidden');

    // Remove from DOM after transition
    setTimeout(() => {
        if (loadingScreen.parentNode) {
            loadingScreen.remove();
        }
    }, 1000);
}

// Start loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoadingScreen);
} else {
    initLoadingScreen();
}

// Variables globales
let productosFiltrados = [];
let paginaActual = 0;
const PRODUCTOS_POR_PAGINA = 10;

// Inicialización — espera a que la API responda antes de renderizar
document.addEventListener('DOMContentLoaded', async function () {
    await cargarProductos();
    inicializarApp();
});

function inicializarApp() {
    renderizarProductos(productosDB, true);
    configurarFiltros();
    configurarBusqueda();
    configurarMenuMobile();
    configurarNewsletter();
    configurarModal();
    configurarBotonesComprar();
    checkURLParams();
}

// Renderizar productos
function renderizarProductos(productos, reiniciar = false) {
    const contenedor = document.getElementById('productos-lista');
    const countElement = document.getElementById('count');

    // Si es reinicio, resetear la página actual
    if (reiniciar) {
        paginaActual = 0;
    }

    countElement.textContent = productos.length;

    // Limpiar contenedor siempre (solo mostramos productos de la página actual)
    contenedor.innerHTML = '';

    if (productos.length === 0) {
        contenedor.innerHTML = `
            <div class="no-resultados">
                <i class="fas fa-search"></i>
                <h3>No se encontraron productos</h3>
                <p>Intenta ajustar los filtros de búsqueda</p>
            </div>
        `;
        // Eliminar controles de navegación si existen
        const controlesExistentes = document.getElementById('controles-paginacion');
        if (controlesExistentes) {
            controlesExistentes.remove();
        }
        return;
    }

    // Calcular qué productos mostrar de la página actual
    const inicio = paginaActual * PRODUCTOS_POR_PAGINA;
    const fin = Math.min(inicio + PRODUCTOS_POR_PAGINA, productos.length);
    const productosAMostrar = productos.slice(inicio, fin);

    // Renderizar productos de la página actual
    const productosHTML = productosAMostrar.map(producto => {
        // Determinar nombre de categoría
        let nombreCategoria = 'Producto';
        if (producto.categoria === 'maquillaje') nombreCategoria = 'Maquillaje';
        else if (producto.categoria === 'skincare') nombreCategoria = 'Skincare';
        else if (producto.categoria === 'cabello') nombreCategoria = 'Cabello';

        return `
        <div class="producto-card" data-id="${producto.id}" data-categoria="${producto.categoria}">
            <div class="producto-info-detalle">
                <div>
                    <span class="producto-categoria">${nombreCategoria}</span>
                    <div class="producto-flex" style="display:flex;justify-content: space-between; margin-top: 1rem;">
                        <div style="margin-top: -1rem;">
                            <span class="producto-marca">${producto.marca || ''}</span>
                            <h2 class="producto-titulo">${producto.nombre}</h2>
                        </div>
                        <div>
                            <h1 class="producto-precio">₡${Number(producto.price).toLocaleString('es-CR')}</h1>
                        </div>
                    </div>

                    <div class="producto-descripcion">
                        <h3>Descripción</h3>
                        <p>${producto.descripcion ? (String(producto.descripcion).length > 120 ? String(producto.descripcion).substring(0, 120) + '...' : producto.descripcion) : 'Sin descripción'}</p>
                    </div>
                </div>
                
                <div class="producto-acciones">
                    <button class="btn-ver-mas" data-id="${producto.id}">
                        <i class="fas fa-info-circle"></i> detalles
                    </button>
                    <button class="btn-ver-mas pedir btn-comprar-2" data-id="${producto.id}">
                        <i class="fas fa-shopping-cart"></i> Pedir
                    </button>
                </div>
            </div>
            
            <div class="producto-imagen-container">
                <div class="producto-imagen-wrapper">
                    <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                </div>
            </div>
        </div>
        `;
    }).join('');

    contenedor.innerHTML = productosHTML;

    // Gestionar controles de navegación
    gestionarControlesPaginacion(productos);

    // Agregar eventos a botones "Ver más"
    document.querySelectorAll('.btn-ver-mas:not(.btn-comprar-2)').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            mostrarDetalleProducto(id);
        });
    });

    // Agregar eventos a botones "Pedir" (btn-comprar-2)
    document.querySelectorAll('.btn-comprar-2').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            const producto = productosDB.find(p => p.id === id);
            if (producto) {
                enviarMensajeWhatsApp(producto);
            }
        });
    });

    // Animación de entrada
    animarProductos();

    // Scroll al inicio del catálogo
    const catalogoMain = document.querySelector('.catalogo-main');
    if (catalogoMain && !reiniciar) {
        catalogoMain.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Función para enviar mensaje de WhatsApp
function enviarMensajeWhatsApp(producto) {
    // Determinar nombre de categoría
    let nombreCategoria = 'Producto';
    if (producto.categoria === 'maquillaje') nombreCategoria = 'Maquillaje';
    else if (producto.categoria === 'skincare') nombreCategoria = 'Skincare';
    else if (producto.categoria === 'cabello') nombreCategoria = 'Cabello';

    const numero = '50689523778';
    const mensaje = encodeURIComponent(
        `¡Hola! Estoy interesado en el siguiente producto:\n\n` +
        `📦 *${producto.nombre}*\n` +
        `🏷️ Marca: ${producto.marca}\n` +
        `📂 Categoría: ${nombreCategoria}\n` +
        `💰 Precio: ${producto.price}\n\n` +
        `¿Me podrías dar más información? 😊`
    );
    const url = `https://wa.me/${numero}?text=${mensaje}`;
    window.open(url, '_blank');
}

// Configurar botones de comprar
function configurarBotonesComprar() {
    // Configurar el botón de comprar del modal
    const btnComprarModal = document.getElementById('btn-comprar');
    if (btnComprarModal) {
        // Esta función se actualizará cuando se abra el modal
        btnComprarModal.onclick = function () {
            // La funcionalidad se configura en mostrarDetalleProducto()
        };
    }
}

// Gestionar controles de paginación
function gestionarControlesPaginacion(productos) {
    const totalPaginas = Math.ceil(productos.length / PRODUCTOS_POR_PAGINA);

    // Si solo hay una página, no mostrar controles
    if (totalPaginas <= 1) {
        const controlesExistentes = document.getElementById('controles-paginacion');
        if (controlesExistentes) {
            controlesExistentes.remove();
        }
        return;
    }

    // Buscar si ya existen los controles
    let controles = document.getElementById('controles-paginacion');

    // Si no existen, crearlos
    if (!controles) {
        const contenedorCatalogo = document.querySelector('.catalogo-main');
        controles = document.createElement('div');
        controles.id = 'controles-paginacion';
        controles.className = 'controles-paginacion';
        contenedorCatalogo.appendChild(controles);
    }

    // Actualizar contenido de los controles
    const inicio = paginaActual * PRODUCTOS_POR_PAGINA + 1;
    const fin = Math.min((paginaActual + 1) * PRODUCTOS_POR_PAGINA, productos.length);

    controles.innerHTML = `
        <button class="btn-paginacion btn-anterior" ${paginaActual === 0 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
            Anterior
        </button>
        
        <div class="info-paginacion">
            <span class="pagina-actual">Mostrando ${inicio} - ${fin} de ${productos.length} productos</span>
            <span class="numero-pagina">Página ${paginaActual + 1} de ${totalPaginas}</span>
        </div>
        
        <button class="btn-paginacion btn-siguiente" ${paginaActual >= totalPaginas - 1 ? 'disabled' : ''}>
            Siguiente
            <i class="fas fa-chevron-right"></i>
        </button>
    `;

    // Agregar eventos a los botones
    const btnAnterior = controles.querySelector('.btn-anterior');
    const btnSiguiente = controles.querySelector('.btn-siguiente');

    btnAnterior.addEventListener('click', function () {
        if (paginaActual > 0) {
            paginaActual--;
            renderizarProductos(productosFiltrados, false);
        }
    });

    btnSiguiente.addEventListener('click', function () {
        if (paginaActual < totalPaginas - 1) {
            paginaActual++;
            renderizarProductos(productosFiltrados, false);
        }
    });
}

// Configurar filtros
function configurarFiltros() {
    const radios = document.querySelectorAll('input[name="categoria"]');

    radios.forEach(radio => {
        radio.addEventListener('change', function () {
            filtrarProductos();
        });
    });

    // Botón limpiar filtros
    document.querySelector('.btn-limpiar-filtros').addEventListener('click', function () {
        document.querySelector('input[value="todos"]').checked = true;
        document.getElementById('buscar-producto').value = '';
        filtrarProductos();
    });
}

// Configurar búsqueda
function configurarBusqueda() {
    const inputBuscar = document.getElementById('buscar-producto');

    inputBuscar.addEventListener('input', function () {
        filtrarProductos();
    });
}

// Filtrar productos
function filtrarProductos() {
    const categoriaSeleccionada = document.querySelector('input[name="categoria"]:checked').value;
    const textoBusqueda = document.getElementById('buscar-producto').value.toLowerCase();

    let productos = [...productosDB];

    // Filtrar por categoría
    if (categoriaSeleccionada !== 'todos') {
        productos = productos.filter(p => p.categoria === categoriaSeleccionada);
    }

    // Filtrar por búsqueda (incluye nombre, marca y descripción)
    if (textoBusqueda) {
        productos = productos.filter(p =>
            p.nombre.toLowerCase().includes(textoBusqueda) ||
            p.marca.toLowerCase().includes(textoBusqueda) ||
            p.descripcion.toLowerCase().includes(textoBusqueda)
        );
    }

    productosFiltrados = productos;
    renderizarProductos(productos, true);
}

// Mostrar mensaje "Próximamente" para perfumes
function mostrarMensajeProximamente() {
    const contenedor = document.getElementById('productos-lista');
    const countElement = document.getElementById('count');

    // Actualizar contador
    countElement.textContent = '0';

    // Mostrar mensaje de próximamente
    contenedor.innerHTML = `
        <div class="no-resultados proximamente">
            <i class="fas fa-clock"></i>
            <h3>Próximamente</h3>
            <p>Estamos trabajando en nuestra línea de perfumes. ¡Muy pronto disponible!</p>
        </div>
    `;

    // Eliminar controles de navegación si existen
    const controlesExistentes = document.getElementById('controles-paginacion');
    if (controlesExistentes) {
        controlesExistentes.remove();
    }
}

// Configurar modal
function configurarModal() {
    const modal = document.getElementById('modal-producto');
    const btnCerrar = document.querySelector('.modal-cerrar');

    // Cerrar modal al hacer clic en la X
    btnCerrar.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            modal.style.display = 'none';
        }
    });
}

// Mostrar detalle del producto en modal
function mostrarDetalleProducto(id) {
    const producto = productosDB.find(p => p.id === id);
    if (producto) {
        // Determinar nombre de categoría
        let nombreCategoria = 'Producto';
        if (producto.categoria === 'maquillaje') nombreCategoria = 'Maquillaje';
        else if (producto.categoria === 'skincare') nombreCategoria = 'Skincare';
        else if (producto.categoria === 'cabello') nombreCategoria = 'Cabello';

        // Actualizar contenido del modal
        document.getElementById('modal-imagen').src = producto.imagen;
        document.getElementById('modal-imagen').alt = producto.nombre;
        document.getElementById('modal-categoria').textContent = nombreCategoria;
        document.getElementById('modal-titulo').textContent = producto.nombre;
        document.getElementById('modal-precio').textContent = producto.price;
        document.getElementById('modal-marca').textContent = producto.marca;
        document.getElementById('modal-descripcion').textContent = producto.descripcion;

        // Actualizar características
        const caracteristicasContainer = document.getElementById('modal-caracteristicas');
        caracteristicasContainer.innerHTML = producto.caracteristicas.map(caract => `
            <div class="caracteristica-item">
                <i class="fas fa-check-circle"></i>
                <span>${caract}</span>
            </div>
        `).join('');

        // Configurar botón de comprar del modal con el producto actual
        const btnComprarModal = document.getElementById('btn-comprar');
        if (btnComprarModal) {
            btnComprarModal.onclick = function () {
                enviarMensajeWhatsApp(producto);
            };
        }

        // Configurar botón de cerrar usando la CLASE
        const btnCerrar = document.querySelector('.modal-cerrar');
        if (btnCerrar) {
            btnCerrar.onclick = function () {
                document.getElementById('modal-producto').style.display = 'none';
            };
        }

        // Mostrar modal
        document.getElementById('modal-producto').style.display = 'block';
    }
}

// Función para cerrar el modal
function cerrarModal() {
    document.getElementById('modal-producto').style.display = 'none';
}

// Agregar evento al botón de cerrar
document.getElementById('modal-cerrar').addEventListener('click', cerrarModal);

// Opcional: Cerrar modal al hacer clic fuera de él
document.getElementById('modal-producto').addEventListener('click', function (e) {
    if (e.target === this) {
        cerrarModal();
    }
});

// Animación de productos
function animarProductos() {
    const productos = document.querySelectorAll('.producto-card');

    productos.forEach((producto, index) => {
        producto.style.opacity = '0';
        producto.style.transform = 'translateY(30px)';

        setTimeout(() => {
            producto.style.transition = 'opacity 0.6s, transform 0.6s';
            producto.style.opacity = '1';
            producto.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Menú móvil
function configurarMenuMobile() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                navMenu.classList.remove('active');
                mobileMenu.classList.remove('active');

                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Newsletter
function configurarNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert(`¡Gracias por suscribirte con el email: ${email}!`);
            this.reset();
        });
    }
}

// Cambiar estilo del header al hacer scroll
window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.padding = '10px 0';
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.padding = '15px 0';
        header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.08)';
    }
});

// Check for product ID in URL and auto-open modal (Deep linking from blog)
function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        const id = parseInt(productId);
        const producto = productosDB.find(p => p.id === id);

        if (producto) {
            // Wait for DOM to be fully ready, then open modal
            setTimeout(() => {
                mostrarDetalleProducto(id);

                // Try to scroll to product card if visible in grid
                const productCard = document.querySelector(`[data-id="${id}"]`);
                if (productCard) {
                    productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
        }
    }
}
