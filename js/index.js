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
    // Renderizar productos en la página principal
    renderizarProductosPrincipales();
    
    // Para la página de productos.html
    if (window.location.pathname.includes('productos.html')) {
        productosFiltrados = [...productosDB];
        renderizarProductos(productosDB, true);
        configurarFiltros();
        configurarBusqueda();
        configurarBotonesComprar();
        checkURLParams();
    }
    
    configurarMenuMobile();
    configurarNewsletter();
    configurarModal();
    crearPhoneTooltip();
    
    // Typing effect
    let texto = "Descubre tu belleza natural";
    let i = 0;
    let elemento = document.getElementById("typer");
    
    function escribir() {
        if (i < texto.length) {
            elemento.innerHTML += texto.charAt(i);
            i++;
            setTimeout(escribir, 60);
        }
    }
    
    escribir();
}

// ========================================
// FUNCIONES PARA PÁGINA PRINCIPAL (index.html)
// ========================================

// Función para obtener productos aleatorios
function obtenerProductosAleatorios(array, cantidad) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, cantidad);
}

// Función para renderizar productos en la página principal
function renderizarProductosPrincipales() {
    const productosGrid = document.querySelector('.productos-grid');
    if (!productosGrid) return;

    // Obtener 6 productos aleatorios
    const productosAleatorios = obtenerProductosAleatorios(productosDB, 6);
    
    productosGrid.innerHTML = '';

    productosAleatorios.forEach((producto, index) => {
        const badges = ['Nuevo', 'Más vendido', 'Oferta', ''];
        const badgeAleatorio = badges[Math.floor(Math.random() * badges.length)];

        const productoHTML = `
            <div class="producto" data-id="${producto.id}">
               
                <div class="producto-img">
                    <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                </div>
                <div class="producto-info">
                    <h3>${producto.marca}</h3>
                    <p class="producto-desc">${producto.descripcion.substring(0, 100)}...</p>
                    <div class="producto-detalles">
                        ${producto.price ? `<span class="precio">   ${producto.price.toLocaleString('es-CR')}</span>` : ''}
                    </div>
                    <button class="btn-producto">Ver detalles</button>
                </div>
            </div>
        `;

        productosGrid.innerHTML += productoHTML;
    });

    // Actualizar contador de productos
    const productos_totales = document.getElementsByClassName('stat-number')[0];
    if (productos_totales) {
        productos_totales.textContent = `+${productosDB.length}`;
    }

    // Re-aplicar event listeners después de renderizar
    aplicarEventListenersProductos();
}

// Función para aplicar event listeners a productos de la página principal
function aplicarEventListenersProductos() {
    const modal = document.getElementById('modal-producto');
    const closeModal = document.querySelector('.close-modal');
    const modalBody = document.querySelector('.modal-body');
    const productButtons = document.querySelectorAll('.btn-producto');

    if (!modal || !closeModal || !modalBody) return;

    // Abrir modal con información del producto
    productButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = parseInt(this.closest('.producto').dataset.id);
            const producto = productosDB.find(p => p.id === productId);

            if (producto) {
                modalBody.innerHTML = `
                    <div class="modal-producto">
                        <div class="modal-producto-header">
                            <h2>${producto.nombre}</h2>
                            ${producto.price ? `<p class="precio-modal">${producto.price.toLocaleString('es-CR')}</p>` : ''}
                        </div>
                        <div class="modal-producto-content">
                            <div class="modal-producto-img">
                                <img src="${producto.imagen}" alt="${producto.nombre}">
                            </div>
                            <div class="modal-producto-info">
                                <div class="producto-tipo-badge">${producto.categoria}</div>
                                <p class="modal-desc">${producto.descripcion}</p>
                                
                                <div class="modal-details">
                                    ${producto.marca ? `
                                    <div class="modal-section">
                                        <h3><i class="fas fa-tag"></i>Marca</h3>
                                        <p>${producto.marca}</p>
                                    </div>
                                    ` : ''}
                                    
                                    ${producto.volumen ? `
                                    <div class="modal-section">
                                        <h3><i class="fas fa-weight-hanging"></i> Presentación</h3>
                                        <p>${producto.volumen}</p>
                                    </div>
                                    ` : ''}
                                    
                                    ${producto.uso ? `
                                    <div class="modal-section">
                                        <h3><i class="fas fa-info-circle"></i> Modo de uso</h3>
                                        <p>${producto.uso}</p>
                                    </div>
                                    ` : ''}
                                    
                                    ${producto.ingredientes ? `
                                    <div class="modal-section">
                                        <h3><i class="fas fa-flask"></i> Ingredientes principales</h3>
                                        <p>${producto.ingredientes}</p>
                                    </div>
                                    ` : ''}
                                    
                                    ${producto.beneficios ? `
                                    <div class="modal-section">
                                        <h3><i class="fas fa-star"></i> Beneficios</h3>
                                        <p>${producto.beneficios}</p>
                                    </div>
                                    ` : ''}
                                    
                                    ${producto.price ? `
                                    <div class="modal-section precio-section">
                                        <h3><i class="fas fa-dollar-sign"></i> Precio</h3>
                                        <p class="precio-grande">${producto.price.toLocaleString('es-CR')}</p>
                                    </div>
                                    ` : ''}
                                </div>
                                
                                <div class="modal-actions">
                                    <button class="btn-comprar" data-producto='${JSON.stringify(producto)}'>
                                        <i class="fas fa-shopping-cart"></i> Pedir
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                `;

                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';

                // Event listener para botón de comprar
                const btnComprar = modalBody.querySelector('.btn-comprar');
                if (btnComprar) {
                    btnComprar.addEventListener('click', function () {
                        const productoData = JSON.parse(this.dataset.producto);
                        const numero = '50689523778';
                        const mensaje = encodeURIComponent(
                            `¡Hola! Estoy interesado en el siguiente producto:\n\n` +
                            `📦 *${productoData.nombre}*\n` +
                            `🏷️ Marca: ${productoData.marca || 'N/A'}\n` +
                            `📂 Categoría: ${productoData.categoria}\n` +
                            `💰 Precio: ${productoData.price || 'Consultar'}\n\n` +
                            `¿Me podrías dar más información? 😊`
                        );
                        const url = `https://wa.me/${numero}?text=${mensaje}`;
                        window.open(url, '_blank');
                    });
                }

                // Event listener para botón de WhatsApp
                const btnWhatsapp = modalBody.querySelector('.btn-whatsapp');
                if (btnWhatsapp) {
                    btnWhatsapp.addEventListener('click', function () {
                        const productoData = JSON.parse(this.dataset.producto);
                        const numero = '50689523778';
                        const mensaje = encodeURIComponent(
                            `¡Hola Bella Catys! 👋\n\n` +
                            `*Consulta sobre producto:*\n` +
                            `📦 *Producto:* ${productoData.nombre}\n` +
                            `🏷️ *Marca:* ${productoData.marca || 'N/A'}\n` +
                            `📂 *Categoría:* ${productoData.categoria}\n` +
                            `💰 *Precio:* ₡${productoData.price || 'Consultar'}\n` +
                            `📝 *Descripción:* ${productoData.descripcion.substring(0, 100)}...\n\n` +
                            `_Quiero más información sobre este producto_ ✨`
                        );
                        const url = `https://wa.me/${numero}?text=${mensaje}`;
                        window.open(url, '_blank');
                    });
                }
            }
        });
    });

    // Cerrar modal
    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// ========================================
// FUNCIONES PARA PÁGINA DE PRODUCTOS (productos.html)
// ========================================

// Renderizar productos en la página de productos
function renderizarProductos(productos, reiniciar = false) {
    const contenedor = document.getElementById('productos-lista');
    const countElement = document.getElementById('count');

    // Si es reinicio, resetear la página actual
    if (reiniciar) {
        paginaActual = 0;
    }

    countElement.textContent = productos.length + 1;

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

        // Formatear precio: soporta string "₡8000", número o null
        let precioFormateado = '';
        if (producto.price !== null && producto.price !== undefined && producto.price !== '') {
            const precioStr = String(producto.price).replace(/[₡,\s]/g, '');
            const precioNum = parseFloat(precioStr);
            precioFormateado = !isNaN(precioNum)
                ? `₡${precioNum.toLocaleString('es-CR')}`
                : String(producto.price);
        }

        // Descripción truncada a 120 caracteres
        const descripcionCorta = producto.descripcion
            ? (producto.descripcion.length > 120 ? producto.descripcion.substring(0, 120) + '...' : producto.descripcion)
            : '';

        return `
        <div class="producto-card" data-id="${producto.id}" data-categoria="${producto.categoria || ''}">
            <div class="producto-info-detalle">
                <div>
                    <span class="producto-categoria">${nombreCategoria}</span>
                  
                    <div class="producto-flex" style="display:flex;justify-content: space-between; margin-top: 1rem;">
                        <div style="margin-top: -1rem;">
                            <span class="producto-marca">${producto.marca || ''}</span>
                            <h2 class="producto-titulo">${producto.nombre || ''}</h2>
                        </div>
                        <div>
                            <h1 class="producto-precio">${precioFormateado}</h1>
                        </div>
                    </div>

                    <div class="producto-descripcion">
                        <h3>Descripción</h3>
                        <p>${descripcionCorta}</p>
                    </div>
                </div>
                
                <div class="producto-acciones">
                    <button class="btn-ver-mas" data-id="${producto.id}">
                        <i class="fas fa-info-circle"></i>
                        detalles
                    </button>
                    <button class="btn-ver-mas pedir btn-comprar-2" data-id="${producto.id}">
                        <i class="fas fa-shopping-cart"></i>
                        Pedir
                    </button>
                </div>
            </div>
            
            <div class="producto-imagen-container">
                <div class="producto-imagen-wrapper">
                    <img src="${producto.imagen || ''}" loading="lazy" alt="${producto.nombre || 'Producto'}">
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
        `💰 Precio: ₡${producto.price}\n\n` +
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
    if (btnCerrar) {
        btnCerrar.addEventListener('click', function () {
            modal.style.display = 'none';
        });
    }

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
        document.getElementById('modal-precio').textContent = `₡${producto.price.toLocaleString('es-CR')}`;
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

// Función para crear tooltip de teléfono
function crearPhoneTooltip() {
    const emailLink = document.querySelector('.dev');

    if (emailLink) {
        emailLink.addEventListener('mouseenter', function () {
            const rect = this.getBoundingClientRect();

            const tooltip = document.createElement('div');
            tooltip.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="white" style="vertical-align: middle; margin-right: 6px;"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg> +506 8475 1967';
            tooltip.style.cssText = `
                position: fixed;
                background: #333;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                z-index: 10000;
                top: ${rect.top - 45}px;
                left: ${rect.left}px;
                white-space: nowrap;
                display: flex;
                align-items: center;
            `;
            tooltip.id = 'phoneTooltip';
            document.body.appendChild(tooltip);
        });

        emailLink.addEventListener('mouseleave', function () {
            const tooltip = document.getElementById('phoneTooltip');
            if (tooltip) tooltip.remove();
        });
    }
}

// Sistema de rotación de imágenes para Bella Catys
// Función para seleccionar imagen aleatoria
function getRandomImage(imageArray) {
    const randomIndex = Math.floor(Math.random() * imageArray.length);
    return imageArray[randomIndex];
}

// Configuración de imágenes disponibles
const imageConfig = {
    nosotros: [
        '../img/inicio/nosotros2.png',
        '../img/inicio/nosotros3.jpeg',
        '../img/inicio/nosotros4.png',
        '../img/inicio/nosotros5.png',
        '../img/inicio/nosotros6.png',
        '../img/inicio/nosotros7.png',
        '../img/inicio/nosotros8.png',
        '../img/inicio/nosotros9.png',
        '../img/inicio/nosotros10.png',
        '../img/inicio/nosotros11.png',
    ],
};

// Función para rotar imagen de la sección Nosotros
function rotateNosotrosImage() {
    const nosotrosImg = document.querySelector('.nosotros-img img');

    if (nosotrosImg) {
        const randomImage = getRandomImage(imageConfig.nosotros);

        // Aplicar efecto de fade
        nosotrosImg.style.opacity = '0';

        setTimeout(() => {
            nosotrosImg.src = randomImage;
            nosotrosImg.style.opacity = '1';
        }, 300);
    }
}

// Función para rotar fondo del Hero
function rotateHeroVideo() {
    const heroSection = document.querySelector('.hero');

    if (heroSection) {
        let videoElement = heroSection.querySelector('.hero-video');
        let fadeOverlay = heroSection.querySelector('.hero-video-fade');

        if (!videoElement) {
            const videoContainer = document.createElement('div');
            videoContainer.className = 'hero-video-container';

            videoElement = document.createElement('video');
            videoElement.className = 'hero-video';
            videoElement.autoplay = true;
            videoElement.muted = true;
            videoElement.loop = true;
            videoElement.playsInline = true;
            videoElement.playbackRate = 0.75;

            const overlay = document.createElement('div');
            overlay.className = 'hero-video-overlay';

            // Overlay adicional para el fade
            fadeOverlay = document.createElement('div');
            fadeOverlay.className = 'hero-video-fade';

            videoContainer.appendChild(videoElement);
            videoContainer.appendChild(overlay);
            videoContainer.appendChild(fadeOverlay);
            heroSection.insertBefore(videoContainer, heroSection.firstChild);
        }

        const videoConfig = {
            fondoHero: [
                'img/inicio/fondo.mp4',
                'img/inicio/fondo1.mp4'
            ]
        };

        const randomVideo = videoConfig.fondoHero[Math.floor(Math.random() * videoConfig.fondoHero.length)];
        heroSection.classList.add('loading');

        videoElement.src = randomVideo;

        videoElement.addEventListener('canplaythrough', function () {
            heroSection.classList.remove('loading');
            videoElement.play().catch(error => {
                console.log('Error al reproducir video:', error);
            });
        }, { once: true });

        videoElement.addEventListener('error', function () {
            console.error('Error al cargar el video:', randomVideo);
            heroSection.classList.remove('loading');
        }, { once: true });

        // Detectar cuando el video está cerca del final para hacer fade
        videoElement.addEventListener('timeupdate', function () {
            const duration = videoElement.duration;
            const currentTime = videoElement.currentTime;

            // Fade out en los últimos 0.5 segundos
            if (duration - currentTime < 0.5 && duration - currentTime > 0) {
                fadeOverlay.style.opacity = '1';
            }
            // Fade in en los primeros 0.5 segundos
            else if (currentTime < 0.5) {
                fadeOverlay.style.opacity = '0';
            }
        });
    }
}

// Función principal de inicialización de rotación de imágenes
function initImageRotation() {
    rotateNosotrosImage();
    rotateHeroVideo();
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', initImageRotation);

// También ejecutar cuando la página sea visible (por si viene de cache)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        initImageRotation();
    }
});
