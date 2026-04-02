import { productosDB } from './data.js';

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

// Base de datos de artículos del blog
const articulosDB = [
    {
        id: 1,
        titulo: "Rutina Nocturna Perfecta: Despierta Radiante",
        categoria: "rutinas",
        fecha: "28 Nov 2025",
        resumen: "Descubre los pasos esenciales para una rutina de noche que transformará tu piel mientras duermes. Incluye tips de productos y técnicas de aplicación.",
        lectura: "5 min",
        imagen: "../blog/rutina-noche.jpg",
        productosRelacionados: [1, 2, 5],
        contenido: `
            <div class="articulo-texto">
                <p class="intro-text">La noche es el momento mágico donde tu piel se regenera. Aprovechar estas horas con los productos adecuados puede marcar la diferencia entre una piel apagada y un despertar radiante.</p>

                <h3>1. La Doble Limpieza: El Secreto Mejor Guardado</h3>
                <p>No basta con lavar tu cara una vez. La doble limpieza asegura que elimines tanto el maquillaje y protector solar (base oleosa) como el sudor y la polución (base acuosa).</p>
                <ul>
                    <li><strong>Paso 1:</strong> Usa un aceite o bálsamo limpiador para disolver el maquillaje. Masajea suavemente por 60 segundos.</li>
                    <li><strong>Paso 2:</strong> Sigue con un limpiador a base de agua para eliminar residuos e impurezas profundas.</li>
                </ul>

                <div class="product-tip">
                    <i class="fas fa-lightbulb"></i>
                    <div>
                        <strong>Tip de Experto:</strong>
                        <p>Si tienes piel seca, busca limpiadores con ceramidas. Si es grasa, el ácido salicílico será tu mejor aliado.</p>
                    </div>
                </div>

                <h3>2. Tonificación e Hidratación</h3>
                <p>Equilibra el pH de tu piel con un tónico suave. Evita los que contienen alcohol, ya que pueden resecar. Luego, aplica tu serum favorito.</p>
                <p>Para la noche, ingredientes como el <strong>Retinol</strong> o el <strong>Ácido Hialurónico</strong> son ideales. El retinol estimula la producción de colágeno, mientras que el ácido hialurónico retiene la humedad.</p>

                <h3>3. Sellado con Crema Nocturna</h3>
                <p>Finaliza con una crema hidratante más densa que la de día. Esto crea una barrera oclusiva que impide que la hidratación se escape mientras duermes.</p>

                <div class="highlight-box">
                    <h4>¿Por qué es importante la constancia?</h4>
                    <p>La renovación celular ocurre principalmente entre las 11 PM y las 4 AM. Mantener una rutina constante potencia este proceso natural, resultando en una piel más luminosa y joven a largo plazo.</p>
                </div>

                <h3>4. El Toque Final: Labios y Ojos</h3>
                <p>No olvides el contorno de ojos y un buen bálsamo labial. Estas áreas son las primeras en mostrar signos de edad y fatiga.</p>
            </div>
        `
    },
    {
        id: 2,
        titulo: "Vitamina C: La Guía Completa para Principiantes",
        categoria: "ingredientes",
        fecha: "25 Nov 2025",
        resumen: "Todo lo que necesitas saber sobre el antioxidante más poderoso: cómo usarlo, cuándo aplicarlo y con qué combinarlo para obtener el máximo brillo.",
        lectura: "7 min",
        imagen: "../blog/vitamina-c.jpg",
        productosRelacionados: [3, 4, 6],
        contenido: `
            <div class="articulo-texto">
                <p class="intro-text">La Vitamina C es el estándar de oro para iluminar la piel y combatir el envejecimiento. Pero, ¿sabes realmente cómo sacarle el máximo partido sin irritar tu piel?</p>

                <h3>¿Qué hace la Vitamina C?</h3>
                <p>Es un potente antioxidante que neutraliza los radicales libres causados por el sol y la contaminación. Además:</p>
                <ul>
                    <li>Estimula la producción de colágeno.</li>
                    <li>Reduce manchas oscuras e hiperpigmentación.</li>
                    <li>Aporta una luminosidad instantánea ("Glow").</li>
                </ul>

                <h3>Cómo incorporarla en tu rutina</h3>
                <p>Lo ideal es usarla por la <strong>mañana</strong>, sobre la piel limpia y seca, antes de tu crema hidratante y protector solar. De hecho, la Vitamina C potencia la efectividad de tu protector solar.</p>

                <div class="highlight-box">
                    <h4>Mitos Comunes</h4>
                    <p><strong>"No se puede usar en verano":</strong> Falso. Es cuando más la necesitas para protegerte del daño solar. Solo asegúrate de usar SPF encima.</p>
                </div>

                <h3>Tipos de Vitamina C</h3>
                <p>Si eres principiante, busca derivados estables como el <em>Ascorbyl Glucoside</em>. Si buscas potencia pura, el <em>Ácido L-Ascórbico</em> es el rey, pero puede ser irritante para pieles sensibles.</p>

                <h3>Errores a Evitar</h3>
                <ol>
                    <li>No usar protector solar después.</li>
                    <li>Usarla con Retinol al mismo tiempo (mejor alternar: Vit C de día, Retinol de noche).</li>
                    <li>Usar un producto oxidado (si se vuelve marrón oscuro, ¡tíralo!).</li>
                </ol>
            </div>
        `
    },
    {
        id: 3,
        titulo: "Cronograma Capilar: Recupera tu Cabello en 1 Mes",
        categoria: "cuidado-cabello",
        fecha: "20 Nov 2025",
        resumen: "Aprende a estructurar tu calendario de mascarillas: Hidratación, Nutrición y Reconstrucción. La clave para salvar cualquier cabello dañado.",
        lectura: "6 min",
        imagen: "../blog/cronograma-capilar.png",
        productosRelacionados: [1, 2, 3],
        contenido: `
            <div class="articulo-texto">
                <p class="intro-text">El cronograma capilar es una agenda de cuidados organizada para reponer todo lo que tu cabello pierde diariamente. Si sientes tu pelo opaco, quebradizo o sin vida, este es el sistema que necesitas.</p>

                <h3>Las 3 Etapas Fundamentales</h3>
                <p>El secreto está en alternar tres tipos de tratamientos según lo que tu cabello pida a gritos:</p>
                
                <h4>1. Hidratación (Reposición de Agua)</h4>
                <p>Es el paso más básico. Devuelve la humedad natural, aportando suavidad y movimiento. Ingredientes clave: Aloe Vera, Pantenol, Glicerina.</p>

                <h4>2. Nutrición (Reposición de Lípidos)</h4>
                <p>Combate el frizz y la porosidad. Ideal para cabellos secos. Aquí entran los aceites: Argán, Coco, Karité, Oliva.</p>

                <h4>3. Reconstrucción (Reposición de Proteínas)</h4>
                <p>Para cabellos quebradizos o tratados químicamente. Devuelve la fuerza y masa capilar. Ingredientes: Keratina, Colágeno, Aminoácidos.</p>

                <div class="highlight-box">
                    <h4>¿Cómo empezar?</h4>
                    <p>Un ciclo estándar de 4 semanas podría ser:<br>
                    Semana 1: H - H - N<br>
                    Semana 2: H - H - N<br>
                    Semana 3: H - H - R<br>
                    Semana 4: H - H - N</p>
                </div>

                <h3>Test de Porosidad</h3>
                <p>Para saber qué necesita tu pelo, haz la prueba del vaso de agua. Coloca un cabello limpio en agua: si flota, necesita hidratación; si se hunde medio, nutrición; si se hunde rápido, reconstrucción.</p>
            </div>
        `
    },
    {
        id: 4,
        titulo: "Skincare Coreano: Los 10 Pasos Explicados",
        categoria: "rutinas",
        fecha: "18 Nov 2025",
        resumen: "Desmitificamos la famosa rutina coreana. ¿Realmente necesitas 10 pasos? Te contamos cuáles son imprescindibles y cuáles opcionales.",
        lectura: "8 min",
        imagen: "../blog/korean-skincare.png",
        productosRelacionados: [4, 5, 6],
        contenido: `
            <div class="articulo-texto">
                <p class="intro-text">La belleza coreana (K-Beauty) ha revolucionado el mundo con su enfoque en la prevención y la hidratación. La famosa rutina de 10 pasos puede sonar intimidante, pero se trata de capas ligeras y respeto por la piel.</p>

                <h3>Los Pasos Esenciales</h3>
                <p>No necesitas hacer los 10 pasos todos los días. Aquí están los pilares fundamentales:</p>

                <h4>Limpieza Doble</h4>
                <p>Como mencionamos antes, aceite primero, espuma después. Es la base de la piel de porcelana.</p>

                <h4>Esencia (Essence)</h4>
                <p>El corazón del K-Beauty. Es un híbrido entre tónico y serum que hidrata a nivel celular y prepara la piel para absorber mejor los siguientes productos.</p>

                <h4>Mascarillas (Sheet Masks)</h4>
                <p>El alma de la rutina. Úsalas 1-2 veces por semana para un boost concentrado de hidratación y tratamiento específico.</p>

                <div class="product-tip">
                    <i class="fas fa-star"></i>
                    <div>
                        <strong>Filosofía Coreana:</strong>
                        <p>Trata tu piel con suavidad. No frotes, da toquecitos ("patting") para que los productos se absorban mejor.</p>
                    </div>
                </div>

                <h3>Protección Solar: El Paso No Negociable</h3>
                <p>En Corea, el sol se evita a toda costa. El protector solar se aplica religiosamente cada mañana, llueva o truene. Es el mejor antiarrugas que existe.</p>
            </div>
        `
    },
    {
        id: 5,
        titulo: "Ácido Hialurónico vs Retinol: ¿Cuál Necesitas?",
        categoria: "ingredientes",
        fecha: "15 Nov 2025",
        resumen: "Comparativa definitiva entre los dos gigantes del cuidado facial. Aprende sus diferencias, beneficios y si puedes usarlos juntos.",
        lectura: "5 min",
        imagen: "../blog/ingredientes-activos.png",
        productosRelacionados: [2, 5, 1],
        contenido: `
            <div class="articulo-texto">
                <p class="intro-text">A menudo se confunden, pero tienen misiones muy diferentes. El Ácido Hialurónico es el vaso de agua que tu piel bebe; el Retinol es el entrenador personal que la pone a trabajar.</p>

                <h3>Ácido Hialurónico: Hidratación Pura</h3>
                <p>Es una molécula que puede retener hasta 1000 veces su peso en agua. Es apto para <strong>todo tipo de piel</strong> y se puede usar mañana y noche.</p>
                <ul>
                    <li>Rellena líneas finas por deshidratación.</li>
                    <li>Deja la piel jugosa y suave.</li>
                    <li>No irrita.</li>
                </ul>

                <h3>Retinol: El Transformador</h3>
                <p>Derivado de la Vitamina A, es el estándar de oro antiedad. Acelera la renovación celular.</p>
                <ul>
                    <li>Suaviza arrugas profundas.</li>
                    <li>Mejora la textura y reduce poros.</li>
                    <li>Combate el acné.</li>
                </ul>

                <div class="highlight-box">
                    <h4>¿Puedo usarlos juntos?</h4>
                    <p>¡Sí! De hecho, son la pareja perfecta. Aplica primero el Retinol (de noche) y espera 20 minutos. Luego aplica el Ácido Hialurónico para calmar e hidratar, contrarrestando la posible sequedad del Retinol.</p>
                </div>
            </div>
        `
    },
    {
        id: 6,
        titulo: "Mascarillas Caseras vs Profesionales",
        categoria: "tips",
        fecha: "12 Nov 2025",
        resumen: "¿Vale la pena gastar en mascarillas de salón o el aguacate de tu cocina es suficiente? Analizamos pros y contras de cada opción.",
        lectura: "4 min",
        imagen: "../blog/mascarillas.png",
        productosRelacionados: [3, 1, 4],
        contenido: `
            <div class="articulo-texto">
                <p class="intro-text">Todos hemos probado alguna vez una mezcla de huevo y aceite en el pelo. Pero, ¿realmente funcionan los remedios de la abuela frente a la tecnología cosmética actual?</p>

                <h3>Mascarillas Caseras (DIY)</h3>
                <p><strong>Pros:</strong> Son naturales, baratas y divertidas de hacer. Sabes exactamente qué ingredientes estás usando.</p>
                <p><strong>Contras:</strong> Las moléculas de los alimentos suelen ser demasiado grandes para penetrar la fibra capilar. Actúan más a nivel superficial y el efecto es temporal.</p>

                <h3>Mascarillas Profesionales</h3>
                <p><strong>Pros:</strong> Formuladas con tecnología para penetrar la cutícula y reparar desde dentro. Contienen ingredientes hidrolizados (partidos en trozos pequeños) para máxima absorción.</p>
                <p><strong>Contras:</strong> Pueden ser costosas y contener siliconas o parabenos si no eliges bien.</p>

                <div class="product-tip">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <strong>Veredicto:</strong>
                        <p>Para mantenimiento y brillo superficial, lo casero está bien. Pero para daño real (decoloración, calor), necesitas la química de un producto profesional.</p>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 7,
        titulo: "Protector Solar: Errores que Estás Cometiendo",
        categoria: "cuidado-piel",
        fecha: "10 Nov 2025",
        resumen: "No basta con aplicarlo, hay que hacerlo bien. Descubre los 5 errores más comunes que reducen la efectividad de tu SPF.",
        lectura: "5 min",
        imagen: "../blog/sunscreen.png",
        productosRelacionados: [5, 6, 2],
        contenido: `
            <div class="articulo-texto">
                <p class="intro-text">El protector solar es el paso más importante de cualquier rutina. Sin él, el resto de tus productos no sirven de mucho. Pero la mayoría de nosotros no lo usa correctamente.</p>

                <h3>Error 1: Aplicar muy poca cantidad</h3>
                <p>Para el rostro, necesitas la cantidad equivalente a dos dedos extendidos (índice y corazón). Si aplicas menos, el SPF 50 se convierte en un SPF 15 real.</p>

                <h3>Error 2: Olvidar zonas clave</h3>
                <p>Orejas, cuello, párpados y labios suelen quedar desprotegidos. Son zonas donde la piel es fina y el cáncer de piel es común.</p>

                <h3>Error 3: No reaplicar</h3>
                <p>El filtro solar se degrada con la luz y el sebo. Si estás al aire libre, reaplica cada 2 horas. Si estás en oficina, al menos una vez antes de salir a comer o volver a casa.</p>

                <div class="highlight-box">
                    <h4>Tip para reaplicar con maquillaje</h4>
                    <p>Usa protectores en bruma o en polvo para retocar tu protección sin arruinar tu base de maquillaje durante el día.</p>
                </div>
            </div>
        `
    },
    {
        id: 8,
        titulo: "Aceites Capilares: ¿Cuál es para ti?",
        categoria: "cuidado-cabello",
        fecha: "08 Nov 2025",
        resumen: "Argán, Coco, Jojoba... Hay un aceite para cada tipo de pelo. Encuentra tu match perfecto y aprende a usarlo sin engrasar.",
        lectura: "6 min",
        imagen: "../blog/hair-oils.png",
        productosRelacionados: [2, 4, 1],
        contenido: `
            <div class="articulo-texto">
                <p class="intro-text">Los aceites son oro líquido para el cabello, pero usar el incorrecto puede dejarte con aspecto sucio o pesado. La clave es el peso molecular y la afinidad con tu tipo de pelo.</p>

                <h3>Pelo Fino y Graso</h3>
                <p>Necesitas aceites ligeros que se absorban rápido. El <strong>Aceite de Jojoba</strong> es ideal porque imita el sebo natural sin tapar el poro. El <strong>Aceite de Semilla de Uva</strong> es otra gran opción.</p>

                <h3>Pelo Seco y Grueso</h3>
                <p>Busca aceites ricos y densos. El <strong>Aceite de Coco</strong> penetra profundamente en la fibra. El <strong>Aceite de Argán</strong> nutre y da brillo instantáneo.</p>

                <h3>Pelo Rizado</h3>
                <p>El rey es el <strong>Aceite de Ricino</strong> (Castor Oil). Es espeso y perfecto para sellar la hidratación en las puntas y definir el rizo.</p>

                <div class="product-tip">
                    <i class="fas fa-tint"></i>
                    <div>
                        <strong>Cómo aplicar:</strong>
                        <p>Siempre de medios a puntas. Calienta una o dos gotas en las palmas de tus manos antes de aplicar para activar el producto y distribuirlo mejor.</p>
                    </div>
                </div>
            </div>
        `
    }
];

// Main loading function
async function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');

    if (!loadingScreen) return;

    // Get resources to preload
    const resources = [];

    // Add logo
    resources.push({ type: 'image', src: '../img/inicio/bellacatys.png' });

    // Add hero image
    resources.push({ type: 'image', src: '../blog/hero-belleza-desktop.png' });

    // Add first 4 blog article images
    const firstArticles = articulosDB.slice(0, 4);
    firstArticles.forEach(articulo => {
        if (articulo.imagen) {
            resources.push({ type: 'image', src: articulo.imagen });
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

// Referencias al DOM
const gridArticulos = document.getElementById('articulos-grid');
const inputBusqueda = document.getElementById('buscar-articulo');
const filterTabs = document.querySelectorAll('.filter-tab');
const modal = document.getElementById('modal-fullscreen');
const modalBody = document.querySelector('.modal-body'); // Note: This selector might need adjustment if HTML structure changed, but keeping for safety based on old code. Actually, in new HTML it's likely dynamic.
const modalClose = document.querySelector('.modal-close');
const btnLoadMore = document.querySelector('.btn-load-more');

// Estado
let articulosVisibles = 6;
let categoriaActual = 'todos';
let busquedaActual = '';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderizarArticulos();
    setupEventListeners();
});

// Renderizar artículos en el grid
function renderizarArticulos() {
    if (!gridArticulos) return;
    gridArticulos.innerHTML = '';

    let articulosFiltrados = articulosDB.filter(articulo => {
        const coincideCategoria = categoriaActual === 'todos' || articulo.categoria === categoriaActual;
        const coincideBusqueda = articulo.titulo.toLowerCase().includes(busquedaActual.toLowerCase()) ||
            articulo.resumen.toLowerCase().includes(busquedaActual.toLowerCase());
        return coincideCategoria && coincideBusqueda;
    });

    if (articulosFiltrados.length === 0) {
        gridArticulos.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: #999;">
                <i class="far fa-sad-tear" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3 style="color: #666;">No encontramos artículos</h3>
                <p>Intenta con otra búsqueda o categoría.</p>
            </div>
        `;
        if (btnLoadMore) btnLoadMore.style.display = 'none';
        return;
    }

    const articulosAmostrar = articulosFiltrados.slice(0, articulosVisibles);

    articulosAmostrar.forEach(articulo => {
        const card = document.createElement('article');
        card.className = 'article-card-minimal fade-in';
        card.onclick = () => abrirModalFullscreen(articulo.id);

        const imagenSrc = articulo.imagen || 'img/blog/default.jpg';

        card.innerHTML = `
            <div class="article-image-minimal">
                <img src="${imagenSrc}" alt="${articulo.titulo}" onerror="this.src='https://via.placeholder.com/400x300?text=Beauty+Blog'">
                <div class="article-category-badge">${formatearCategoria(articulo.categoria)}</div>
            </div>
            <div class="article-body-minimal">
                <div class="article-meta-minimal">
                    <span><i class="far fa-calendar"></i> ${articulo.fecha}</span>
                    <span><i class="far fa-clock"></i> ${articulo.lectura}</span>
                </div>
                <h3 class="article-title-minimal">${articulo.titulo}</h3>
                <p class="article-excerpt-minimal">${articulo.resumen}</p>
                <div class="article-footer-minimal">
                    <a href="#" class="read-more-minimal">
                        Leer más <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
        gridArticulos.appendChild(card);
    });

    // Controlar botón "Ver más"
    if (btnLoadMore) {
        if (articulosFiltrados.length > articulosVisibles) {
            btnLoadMore.style.display = 'inline-block';
        } else {
            btnLoadMore.style.display = 'none';
        }
    }
}

// Abrir Modal Fullscreen con diseño editorial
window.abrirModalFullscreen = function (id) {
    const articulo = articulosDB.find(a => a.id === id);
    if (!articulo) return;

    // Buscar productos relacionados
    const productosRecomendados = productosDB.filter(p => articulo.productosRelacionados.includes(p.id));

    let htmlProductos = '';
    if (productosRecomendados.length > 0) {
        htmlProductos = `
            <div class="productos-relacionados">
                <h3>Productos Recomendados</h3>
                <div class="productos-relacionados-grid">
                    ${productosRecomendados.map(prod => `
                        <div class="producto-mini" onclick="window.location.href='productos.html?id=${prod.id}'">
                            <img src="${prod.imagen}" alt="${prod.nombre}" onerror="this.src='https://via.placeholder.com/150'">
                            <h4>${prod.nombre}</h4>
                            <p>${prod.marca}</p>
                            <button class="btn-ver-producto">Ver Producto</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Extraer todos los h3 del contenido para el TOC
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = articulo.contenido;
    const headings = tempDiv.querySelectorAll('h3');

    // Crear table of contents
    let tocHTML = '';
    if (headings.length > 0) {
        tocHTML = `
            <div class="modal-sidebar">
                <div class="sidebar-card">
                    <h5 class="sidebar-title">En este artículo</h5>
                    <ul class="toc-list">
                        ${Array.from(headings).map((heading, index) => {
            const headingText = heading.textContent;
            const headingId = `heading-${index}`;
            heading.id = headingId;
            return `<li class="toc-item">
                                <a href="#${headingId}" class="toc-link">${headingText}</a>
                            </li>`;
        }).join('')}
                    </ul>
                </div>
                
                <div class="sidebar-card">
                    <h5 class="sidebar-title">Info del artículo</h5>
                    <div class="article-info">
                        <div class="article-info-item">
                            <i class="far fa-calendar"></i>
                            <span>${articulo.fecha}</span>
                        </div>
                        <div class="article-info-item">
                            <i class="far fa-clock"></i>
                            <span>${articulo.lectura} de lectura</span>
                        </div>
                        <div class="article-info-item">
                            <i class="fas fa-tag"></i>
                            <span>${formatearCategoria(articulo.categoria)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    const imagenSrc = articulo.imagen || 'img/blog/default.jpg';

    // Inject IDs into content headings
    Array.from(headings).forEach((heading, index) => {
        heading.id = `heading-${index}`;
    });
    const contenidoConIds = tempDiv.innerHTML;

    // Use modal reference directly or find it if variable scope issue
    const modalEl = document.getElementById('modal-fullscreen');
    const modalBodyEl = modalEl.querySelector('.modal-body');

    modalBodyEl.innerHTML = `
        <div class="modal-header-fullscreen">
            <img src="${imagenSrc}" alt="${articulo.titulo}" onerror="this.src='https://via.placeholder.com/1200x600?text=Beauty+Blog'">
            <div class="modal-header-overlay">
                <div class="container">
                    <h1 class="modal-title-main">${articulo.titulo}</h1>
                    <div class="modal-meta">
                        <span><i class="far fa-calendar"></i> ${articulo.fecha}</span>
                        <span><i class="far fa-clock"></i> ${articulo.lectura} de lectura</span>
                        <span><i class="fas fa-tag"></i> ${formatearCategoria(articulo.categoria)}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="modal-content-container">
            <div class="modal-content-body">
                ${contenidoConIds}
                ${htmlProductos}
            </div>
            ${tocHTML}
        </div>
    `;

    modalEl.classList.add('active');
    document.documentElement.classList.add('modal-open'); // Hide scroll on html
    document.body.classList.add('modal-open'); // Hide scroll on body

    // Setup reading progress bar
    setupReadingProgress();

    // Setup TOC active states
    if (headings.length > 0) {
        setupTOC();
    }
}

// Reading Progress Bar
function setupReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    const modalEl = document.getElementById('modal-fullscreen');

    // Need to find the scrollable element. In CSS: .modal-fullscreen { overflow-y: auto; }
    // So the modal element itself is the scroll container.

    if (!progressBar || !modalEl) return;

    function updateProgress() {
        // Calculate scroll percentage
        // scrollTop: pixels scrolled from top
        // scrollHeight: total height of content
        // clientHeight: height of visible window
        const scrollTop = modalEl.scrollTop;
        const scrollHeight = modalEl.scrollHeight - modalEl.clientHeight;

        let scrolled = 0;
        if (scrollHeight > 0) {
            scrolled = (scrollTop / scrollHeight) * 100;
        }

        progressBar.style.width = `${Math.min(scrolled, 100)}%`;
    }

    modalEl.removeEventListener('scroll', updateProgress); // Remove old listener if any (though anonymous func makes this tricky, simple overwrite is fine)
    modalEl.onscroll = updateProgress; // Simple binding
    updateProgress();
}

// Table of Contents Active State
function setupTOC() {
    const modalEl = document.getElementById('modal-fullscreen');
    const tocLinks = document.querySelectorAll('.toc-link');
    const headings = document.querySelectorAll('.articulo-texto h3');

    if (tocLinks.length === 0 || headings.length === 0) return;

    // Smooth scroll for TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = 100;
                // Calculate position relative to the scroll container (modal)
                // We can use scrollIntoView or manual calculation

                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Update active state on scroll
    function updateActiveTOC() {
        let current = '';

        headings.forEach(heading => {
            // Get position relative to viewport
            const rect = heading.getBoundingClientRect();

            // If heading is in the top half of the screen (approx)
            if (rect.top < 300) {
                current = heading.getAttribute('id');
            }
        });

        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    modalEl.addEventListener('scroll', updateActiveTOC);
    updateActiveTOC();
}

// Event Listeners
function setupEventListeners() {
    // Búsqueda
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', (e) => {
            busquedaActual = e.target.value;
            articulosVisibles = 6;
            renderizarArticulos();
        });
    }

    // Filter Tabs
    if (filterTabs) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                categoriaActual = tab.dataset.categoria;
                articulosVisibles = 6;
                renderizarArticulos();
            });
        });
    }

    // Ver más
    if (btnLoadMore) {
        btnLoadMore.addEventListener('click', () => {
            articulosVisibles += 6;
            renderizarArticulos();
        });
    }

    // Cerrar Modal con animación
    if (modalClose) {
        modalClose.addEventListener('click', cerrarModal);
    }

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            cerrarModal();
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');

            // Close all other items (optional - for accordion effect)
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

function cerrarModal() {
    const modalEl = document.getElementById('modal-fullscreen');
    modalEl.classList.add('closing');
    setTimeout(() => {
        modalEl.classList.remove('active', 'closing');
        document.documentElement.classList.remove('modal-open'); // Restore scroll on html
        document.body.classList.remove('modal-open'); // Restore scroll on body
    }, 400);
}

// Helper: Formatear nombre de categoría
function formatearCategoria(cat) {
    const nombres = {
        'todos': 'Todos',
        'cuidado-piel': 'Piel',
        'cuidado-cabello': 'Cabello',
        'rutinas': 'Rutinas',
        'ingredientes': 'Ingredientes',
        'tips': 'Tips'
    };
    return nombres[cat] || cat;
}
function createPhoneTooltip() {
    const emailLink = document.querySelector('.dev');

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

document.addEventListener('DOMContentLoaded', createPhoneTooltip);