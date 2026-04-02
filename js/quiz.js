import { productosDB } from './data.js';

// Estado del Quiz
let quizState = {
    tipoAnalisis: null, // 'cabello' o 'piel'
    preguntaActual: 0,
    respuestas: {},
    progreso: 0
};

// Preguntas para cabello
const preguntasCabello = [
    {
        id: 'tipoCabello',
        titulo: '¿Qué tipo de cabello tienes?',
        subtitulo: 'Selecciona la opción que mejor describa tu cabello natural',
        opciones: [
            { valor: 'liso', icono: 'fas fa-minus', titulo: 'Liso', descripcion: 'Cabello sin ondas ni rizos' },
            { valor: 'ondulado', icono: 'fas fa-water', titulo: 'Ondulado', descripcion: 'Cabello con ondas suaves' },
            { valor: 'rizado', icono: 'fas fa-wind', titulo: 'Rizado', descripcion: 'Cabello con rizos definidos' },
            { valor: 'crespo', icono: 'fas fa-cloud', titulo: 'Crespo/Coily', descripcion: 'Cabello muy rizado o afro' }
        ]
    },
    {
        id: 'estadoCabello',
        titulo: '¿Cuál es la condición actual de tu cabello?',
        subtitulo: 'Identifica el problema principal que quieres resolver',
        opciones: [
            { valor: 'sano', icono: 'fas fa-heart', titulo: 'Sano', descripcion: 'Sin problemas aparentes' },
            { valor: 'seco', icono: 'fas fa-sun', titulo: 'Seco', descripcion: 'Reseco y sin brillo' },
            { valor: 'danado', icono: 'fas fa-exclamation-triangle', titulo: 'Dañado', descripcion: 'Quebradizo o procesado' },
            { valor: 'graso', icono: 'fas fa-tint', titulo: 'Graso', descripcion: 'Se engrasa rápidamente' }
        ]
    },
    {
        id: 'necesidadPrincipal',
        titulo: '¿Qué necesita tu cabello principalmente?',
        subtitulo: 'Elige tu objetivo de cuidado capilar',
        opciones: [
            { valor: 'hidratacion', icono: 'fas fa-droplet', titulo: 'Hidratación', descripcion: 'Cabello sediento que necesita humedad' },
            { valor: 'nutricion', icono: 'fas fa-leaf', titulo: 'Nutrición', descripcion: 'Reparar y nutrir profundamente' },
            { valor: 'definicion', icono: 'fas fa-star', titulo: 'Definición', descripcion: 'Definir rizos y controlar frizz' },
            { valor: 'fortalecimiento', icono: 'fas fa-dumbbell', titulo: 'Fortalecimiento', descripcion: 'Fortalecer y prevenir caída' }
        ]
    },
    {
        id: 'tratamientos',
        titulo: '¿Has sometido tu cabello a tratamientos químicos?',
        subtitulo: 'Esto nos ayuda a recomendar productos más específicos',
        opciones: [
            { valor: 'natural', icono: 'fas fa-seedling', titulo: 'Natural', descripcion: 'Sin tratamientos químicos' },
            { valor: 'tenido', icono: 'fas fa-palette', titulo: 'Teñido', descripcion: 'Cabello con color' },
            { valor: 'alisado', icono: 'fas fa-grip-lines', titulo: 'Alisado', descripcion: 'Keratina o alisado' },
            { valor: 'decolorado', icono: 'fas fa-bolt', titulo: 'Decolorado', descripcion: 'Mechas o decoloración' }
        ]
    }
];

// Funciones de navegación
window.iniciarQuiz = function () {
    mostrarPantalla('typeScreen');
    actualizarProgreso(10);
};

window.seleccionarTipo = function (tipo) {
    if (tipo === 'piel') {
        alert('¡Próximamente! Por ahora, puedes descubrir tu rutina capilar perfecta.');
        return;
    }

    quizState.tipoAnalisis = tipo;
    mostrarPantalla('questionsScreen');
    cargarPregunta(0);
    actualizarProgreso(20);
};

window.siguientePregunta = function () {
    if (!quizState.respuestas[preguntasCabello[quizState.preguntaActual].id]) {
        return;
    }

    // Scroll suave hacia arriba (hacia el progressText)
    const progressElement = document.getElementById('progressText');
    if (progressElement) {
        progressElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (quizState.preguntaActual < preguntasCabello.length - 1) {
        quizState.preguntaActual++;
        cargarPregunta(quizState.preguntaActual);
        actualizarProgreso(20 + (quizState.preguntaActual / preguntasCabello.length) * 60);
    } else {
        // Quiz completado
        procesarResultados();
    }
};

window.anteriorPregunta = function () {
    if (quizState.preguntaActual > 0) {
        quizState.preguntaActual--;
        cargarPregunta(quizState.preguntaActual);
        actualizarProgreso(20 + (quizState.preguntaActual / preguntasCabello.length) * 60);
    } else {
        mostrarPantalla('typeScreen');
        actualizarProgreso(10);
    }
};

window.seleccionarOpcion = function (questionId, valor) {
    quizState.respuestas[questionId] = valor;

    // Actualizar UI
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');

    // Habilitar botón siguiente
    document.getElementById('nextBtn').disabled = false;
};

window.reiniciarQuiz = function () {
    quizState = {
        tipoAnalisis: null,
        preguntaActual: 0,
        respuestas: {},
        progreso: 0
    };
    mostrarPantalla('startScreen');
    actualizarProgreso(0);
};

// Funciones auxiliares
function mostrarPantalla(pantalla) {
    document.querySelectorAll('.quiz-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(pantalla).classList.add('active');
}

function actualizarProgreso(porcentaje) {
    quizState.progreso = porcentaje;
    document.getElementById('progressBar').style.width = porcentaje + '%';

    if (quizState.tipoAnalisis === 'cabello') {
        const paso = Math.min(quizState.preguntaActual + 2, preguntasCabello.length + 1);
        document.getElementById('progressText').textContent = `Paso ${paso} de ${preguntasCabello.length + 1}`;
    }
}

function cargarPregunta(index) {
    const pregunta = preguntasCabello[index];

    document.getElementById('questionTitle').textContent = pregunta.titulo;
    document.getElementById('questionSubtitle').textContent = pregunta.subtitulo;

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    pregunta.opciones.forEach(opcion => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        if (quizState.respuestas[pregunta.id] === opcion.valor) {
            optionDiv.classList.add('selected');
        }
        optionDiv.onclick = () => seleccionarOpcion(pregunta.id, opcion.valor);

        optionDiv.innerHTML = `
            <i class="${opcion.icono}"></i>
            <h4>${opcion.titulo}</h4>
            <p>${opcion.descripcion}</p>
        `;

        optionsContainer.appendChild(optionDiv);
    });

    // Controlar botón siguiente
    document.getElementById('nextBtn').disabled = !quizState.respuestas[pregunta.id];

    // Actualizar texto del botón final
    if (index === preguntasCabello.length - 1) {
        document.getElementById('nextBtn').innerHTML = `
            <span>Ver Resultados</span>
            <i class="fas fa-check"></i>
        `;
    } else {
        document.getElementById('nextBtn').innerHTML = `
            <span>Siguiente</span>
            <i class="fas fa-arrow-right"></i>
        `;
    }
}

function procesarResultados() {
    mostrarPantalla('loadingScreen');
    actualizarProgreso(85);

    // Simular procesamiento
    const mensajes = [
        'Analizando tu tipo de cabello...',
        'Buscando los mejores productos...',
        'Creando tu rutina personalizada...',
        'Preparando tus resultados...'
    ];

    let msgIndex = 0;
    const interval = setInterval(() => {
        document.getElementById('loadingText').textContent = mensajes[msgIndex];
        msgIndex++;
        if (msgIndex >= mensajes.length) {
            clearInterval(interval);
        }
    }, 600);

    // Mostrar resultados después de 3 segundos
    setTimeout(() => {
        generarResultados();
        mostrarPantalla('resultsScreen');
        actualizarProgreso(100);
    }, 2500);
}

function generarResultados() {
    const respuestas = quizState.respuestas;

    // Determinar tipo de cabello y perfil
    let perfilCabello = {
        tipo: '',
        descripcion: '',
        productos: [],
        rutina: []
    };

    // Analizar respuestas
    const tipoCabello = respuestas.tipoCabello;
    const estadoCabello = respuestas.estadoCabello;
    const necesidadPrincipal = respuestas.necesidadPrincipal;
    const tratamientos = respuestas.tratamientos;

    // Determinar perfil
    if (tipoCabello === 'liso') {
        if (estadoCabello === 'graso') {
            perfilCabello.tipo = 'Cabello Liso Graso';
            perfilCabello.descripcion = 'Tu cabello tiende a acumular grasa rápidamente. Necesitas productos ligeros que limpien sin pesar y controlen la producción de sebo.';
        } else if (estadoCabello === 'seco') {
            perfilCabello.tipo = 'Cabello Liso Seco';
            perfilCabello.descripcion = 'Tu cabello necesita hidratación profunda y nutrición para recuperar su brillo natural y suavidad.';
        } else {
            perfilCabello.tipo = 'Cabello Liso';
            perfilCabello.descripcion = 'Tu cabello está en buenas condiciones, pero necesita mantenimiento regular con productos adecuados para conservar su salud y brillo.';
        }
    } else if (tipoCabello === 'ondulado' || tipoCabello === 'rizado' || tipoCabello === 'crespo') {
        if (necesidadPrincipal === 'definicion') {
            perfilCabello.tipo = `Cabello ${tipoCabello.charAt(0).toUpperCase() + tipoCabello.slice(1)} - Necesita Definición`;
            perfilCabello.descripcion = 'Tus rizos necesitan productos que definan, controlen el frizz y mantengan la forma natural sin dejar el cabello duro o crujiente.';
        } else if (necesidadPrincipal === 'hidratacion') {
            perfilCabello.tipo = `Cabello ${tipoCabello.charAt(0).toUpperCase() + tipoCabello.slice(1)} - Necesita Hidratación`;
            perfilCabello.descripcion = 'Tus rizos están deshidratados y necesitan productos que retengan la humedad y proporcionen hidratación duradera.';
        } else if (necesidadPrincipal === 'nutricion') {
            perfilCabello.tipo = `Cabello ${tipoCabello.charAt(0).toUpperCase() + tipoCabello.slice(1)} - Necesita Nutrición`;
            perfilCabello.descripcion = 'Tu cabello necesita aceites y mantecas nutritivas que penetren la fibra capilar y reparen desde el interior.';
        } else {
            perfilCabello.tipo = `Cabello ${tipoCabello.charAt(0).toUpperCase() + tipoCabello.slice(1)} - Necesita Fortalecimiento`;
            perfilCabello.descripcion = 'Tu cabello necesita proteínas y ingredientes fortalecedores para combatir la caída y mejorar su estructura.';
        }
    }

    // Si tiene tratamientos químicos
    if (tratamientos === 'tenido') {
        perfilCabello.descripcion += ' Además, al tener color, necesitas productos que protejan y mantengan la intensidad del tinte.';
    } else if (tratamientos === 'decolorado') {
        perfilCabello.descripcion += ' Tu cabello decolorado requiere cuidado intensivo con productos reparadores y protectores.';
    }

    // Recomendar productos
    perfilCabello.productos = recomendarProductos(respuestas);

    // Crear rutina
    perfilCabello.rutina = crearRutina(respuestas, perfilCabello.productos);

    // Renderizar resultados
    renderizarResultados(perfilCabello);
}

function recomendarProductos(respuestas) {
    const productos = [];
    const tipoCabello = respuestas.tipoCabello;
    const necesidad = respuestas.necesidadPrincipal;
    const estado = respuestas.estadoCabello;
    const tratamiento = respuestas.tratamientos;

    // Productos para rizos
    if (tipoCabello === 'rizado' || tipoCabello === 'crespo') {
        // Gelatina para definición
        if (necesidad === 'definicion') {
            productos.push(productosDB.find(p => p.id === 1)); // Cachos Hair Jelly
            productos.push(productosDB.find(p => p.id === 37)); // Gelatina + Creme para Pentear
            productos.push(productosDB.find(p => p.id === 43)); // #TodeCacho Ativador
        }

        // Hidratación para rizos
        if (necesidad === 'hidratacion' || estado === 'seco') {
            productos.push(productosDB.find(p => p.id === 45)); // S.O.S Cachos - Ácido Hialurónico
            productos.push(productosDB.find(p => p.id === 38)); // S.O.S Hidratação - Aceite de Oliva
            productos.push(productosDB.find(p => p.id === 41)); // Hidra Babosa
        }

        // Reparación para rizos dañados
        if (estado === 'danado') {
            productos.push(productosDB.find(p => p.id === 44)); // S.O.S Cachos - Recarga de Queratina
            productos.push(productosDB.find(p => p.id === 42)); // S.O.S Hidratação - Queratina e Colágeno
            productos.push(productosDB.find(p => p.id === 40)); // S.O.S Cachos - Óleo de Rícino e Queratina
        }
    }

    // Productos para cabello liso/ondulado
    if (tipoCabello === 'liso' || tipoCabello === 'ondulado') {
        if (necesidad === 'hidratacion') {
            productos.push(productosDB.find(p => p.id === 4)); // Óleo de Coco
            productos.push(productosDB.find(p => p.id === 50)); // Kit Hidra Ceramidas
        }

        if (necesidad === 'nutricion') {
            productos.push(productosDB.find(p => p.id === 2)); // Óleo de Argan
            productos.push(productosDB.find(p => p.id === 28)); // Kit Óleo de Argan
        }

        if (necesidad === 'fortalecimiento') {
            productos.push(productosDB.find(p => p.id === 8)); // Bomba de Biotina
            productos.push(productosDB.find(p => p.id === 54)); // Tónico Fortalecedor Crescimiento
            productos.push(productosDB.find(p => p.id === 75)); // Set Serum Nevada
        }
    }

    // Productos para cabello dañado
    if (estado === 'danado') {
        productos.push(productosDB.find(p => p.id === 3)); // Keratina Vegetal
        productos.push(productosDB.find(p => p.id === 11)); // Creme 3em1 Glicólico
    }

    // Productos para cabello teñido
    if (tratamiento === 'tenido') {
        productos.push(productosDB.find(p => p.id === 14)); // Divina Cor
        productos.push(productosDB.find(p => p.id === 32)); // Vitamina C + Colágeno Vegetal
    }

    // Productos rubios  
    // (Nota: solo si el usuario menciona que es rubio en futuras versiones)

    // Productos multiuso versátiles
    productos.push(productosDB.find(p => p.id === 5)); // 12 em 1
    productos.push(productosDB.find(p => p.id === 6)); // Genetiqs

    // Filtrar nulos y limitar a 6 productos
    return productos.filter(p => p != null).slice(0, 6);
}

function crearRutina(respuestas, productos) {
    const rutina = [];
    const tipoCabello = respuestas.tipoCabello;
    const necesidad = respuestas.necesidadPrincipal;

    // Paso 1: Limpieza
    rutina.push({
        numero: 1,
        titulo: 'Limpieza',
        descripcion: 'Lava tu cabello con shampoo adecuado para tu tipo de cabello. Masajea suavemente el cuero cabelludo con movimientos circulares y enjuaga completamente con agua tibia.'
    });

    // Paso 2: Acondicionamiento/Tratamiento
    if (tipoCabello === 'rizado' || tipoCabello === 'crespo') {
        rutina.push({
            numero: 2,
            titulo: 'Co-Wash o Acondicionador',
            descripcion: 'Aplica un acondicionador leave-in o co-wash de medios a puntas. Para rizos, puedes usar la técnica "squish to condish" para máxima hidratación y definición.'
        });
    } else {
        rutina.push({
            numero: 2,
            titulo: 'Acondicionamiento',
            descripcion: 'Aplica acondicionador de medios a puntas, evitando las raíces. Deja actuar 2-3 minutos y enjuaga con agua fría para sellar las cutículas y dar brillo.'
        });
    }

    // Paso 3: Tratamiento/Mascarilla (semanal)
    if (necesidad === 'hidratacion' || necesidad === 'nutricion') {
        rutina.push({
            numero: 3,
            titulo: 'Mascarilla Intensiva (1-2 veces por semana)',
            descripcion: `Aplica una mascarilla de ${necesidad} profunda. Deja actuar 20-30 minutos (puedes usar gorro térmico para potenciar el efecto). Enjuaga bien.`
        });
    } else {
        rutina.push({
            numero: 3,
            titulo: 'Tratamiento Fortalecedor (1-2 veces por semana)',
            descripcion: 'Aplica un tratamiento con proteínas o queratina para fortalecer la estructura capilar. No excedas el tiempo recomendado para evitar que el cabello quede rígido.'
        });
    }

    // Paso 4: Finalización
    if (tipoCabello === 'rizado' || tipoCabello === 'crespo') {
        rutina.push({
            numero: 4,
            titulo: 'Definición y Finalización',
            descripcion: 'Con el cabello húmedo, aplica crema para peinar o activador de rizos. Usa la técnica de "praying hands" o "raking" para distribuir. Finaliza con gel si deseas más fijación. Deja secar al aire o con difusor a temperatura baja.'
        });
    } else {
        rutina.push({
            numero: 4,
            titulo: 'Productos Leave-in y Protección',
            descripcion: 'Aplica un leave-in o crema para peinar en cabello húmedo. Si usas secador o plancha, aplica siempre un protector térmico antes del calor.'
        });
    }

    // Paso 5: Cuidados especiales
    if (respuestas.tratamientos !== 'natural') {
        rutina.push({
            numero: 5,
            titulo: 'Cuidados Extra para Cabello Procesado',
            descripcion: 'Realiza tratamientos de nutrición y reparación más frecuentemente. Usa productos sin sulfatos ni parabenos. Evita el calor excesivo y siempre usa protector térmico.'
        });
    } else {
        rutina.push({
            numero: 5,
            titulo: 'Mantenimiento y Prevención',
            descripcion: 'Recorta las puntas cada 2-3 meses para prevenir puntas abiertas. Protege tu cabello del sol, cloro y agua salada. Duerme con una funda de satén o seda para reducir la fricción.'
        });
    }

    return rutina;
}

function renderizarResultados(perfil) {
    // Badge de tipo
    document.getElementById('resultTypeBadge').textContent = perfil.tipo;

    // Análisis
    document.getElementById('resultsAnalysis').innerHTML = `
        <h3><i class="fas fa-microscope"></i> Tu Análisis Capilar</h3>
        <p>${perfil.descripcion}</p>
        <p><strong>Tip profesional:</strong> La constancia es clave. Sigue tu rutina durante al menos 30 días para ver resultados significativos. Recuerda que cada cabello es único y puede responder de manera diferente.</p>
    `;

    // Productos
    const productsGrid = document.getElementById('resultsProducts');
    productsGrid.innerHTML = '';

    perfil.productos.forEach(producto => {
        const productCard = document.createElement('div');
        productCard.className = 'result-product-card';
        productCard.onclick = () => window.location.href = `productos.html?id=${producto.id}`;

        productCard.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='https://via.placeholder.com/250x200?text=Producto'">
            <div class="result-product-info">
                <h4>${producto.nombre}</h4>
                <p class="marca">${producto.marca}</p>
                <p>${producto.descripcion.substring(0, 100)}...</p>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });

    // Rutina
    const routineContainer = document.getElementById('resultsRoutine');
    routineContainer.innerHTML = '';

    perfil.rutina.forEach(paso => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'routine-step';

        stepDiv.innerHTML = `
            <div class="routine-step-number">${paso.numero}</div>
            <div class="routine-step-content">
                <h4>${paso.titulo}</h4>
                <p>${paso.descripcion}</p>
            </div>
        `;

        routineContainer.appendChild(stepDiv);
    });
}

// Mobile menu (si es necesario)
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
});
