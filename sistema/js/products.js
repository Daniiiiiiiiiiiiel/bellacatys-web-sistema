let allProducts = [];
let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
});

async function loadProducts() {
    try {
        const res = await fetch('/api/productos');
        if (res.status === 401) {
            window.location.href = '/';
            return;
        }
        allProducts = await res.json();
        renderProducts(allProducts);
    } catch (e) {
        console.error('Error loading products:', e);
        document.getElementById('products-tbody').innerHTML = '<tr><td colspan="6">Error al cargar productos</td></tr>';
    }
}

function renderProducts(products) {
    const tbody = document.getElementById('products-tbody');
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">No hay productos</td></tr>';
        return;
    }

    const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3002' : 'https://bellacatys-web-sistema.vercel.app';
    tbody.innerHTML = products.map(p => `
        <tr>
            <td class="prod-img-cell" data-label="Imagen">
                <img src="${p.imagen ? (p.imagen.startsWith('/') ? baseUrl + p.imagen : p.imagen) : 'https://via.placeholder.com/50'}" alt="${p.nombre}">
            </td>
            <td data-label="Nombre"><strong>${p.nombre}</strong></td>
            <td data-label="Marca">${p.marca}</td>
            <td data-label="Categoría"><span class="badge ${p.categoria}">${p.categoria}</span></td>
            <td data-label="Precio">${p.price}</td>
            <td data-label="Acciones">
                <div class="action-btns">
                    <button class="btn-icon btn-edit" onclick="editProduct(${p.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-delete" onclick="confirmDelete(${p.id})"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function setupEventListeners() {
    // Menu mobile
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('open') && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

    // Search and Filter
    document.getElementById('admin-search').addEventListener('input', filterProducts);
    document.getElementById('admin-filter').addEventListener('change', filterProducts);

    // Modals
    document.getElementById('btn-new-product').addEventListener('click', () => {
        editingId = null;
        document.getElementById('product-form').reset();
        document.getElementById('modal-title').textContent = 'Nuevo Producto';
        document.getElementById('caracteristicas-container').innerHTML = '';
        document.getElementById('image-preview').style.display = 'none';
        document.getElementById('upload-placeholder').style.display = 'block';
        document.getElementById('product-modal').style.display = 'flex';
    });

    document.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('product-modal').style.display = 'none';
            document.getElementById('delete-modal').style.display = 'none';
        });
    });

    // Dynamic characteristics
    document.getElementById('btn-add-caract').addEventListener('click', () => {
        addCaracteristicaInput('');
    });

    // Image Upload Proxy
    const imageUpload = document.getElementById('image-upload');
    const imageUrlInput = document.getElementById('product-imagen');
    const imagePreview = document.getElementById('image-preview');
    const uploadPlaceholder = document.getElementById('upload-placeholder');

    imageUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        uploadPlaceholder.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Subiendo imagen...</p>';
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            
            if (data.ok) {
                imageUrlInput.value = data.url;
                imagePreview.src = data.url;
                imagePreview.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
            } else {
                alert('Error al subir: ' + data.error);
                uploadPlaceholder.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><p>Haz clic o arrastra para subir una imagen</p>';
            }
        } catch (e) {
            alert('Error de conexión al subir la imagen.');
            uploadPlaceholder.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><p>Haz clic o arrastra para subir una imagen</p>';
        }
    });

    // Form submit
    document.getElementById('product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const caracteristicas = Array.from(document.querySelectorAll('.caract-input'))
            .map(input => input.value.trim())
            .filter(val => val !== '');

        const productData = {
            nombre: document.getElementById('product-nombre').value,
            marca: document.getElementById('product-marca').value,
            categoria: document.getElementById('product-categoria').value,
            descripcion: document.getElementById('product-descripcion').value,
            price: document.getElementById('product-precio').value,
            imagen: document.getElementById('product-imagen').value,
            caracteristicas
        };

        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `/api/productos/${editingId}` : '/api/productos';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            if (res.ok) {
                document.getElementById('product-modal').style.display = 'none';
                loadProducts();
            } else {
                const error = await res.json();
                alert('Error: ' + error.error);
            }
        } catch (e) {
            alert('Error de red al guardar.');
        }
    });

    // Handle delete
    document.getElementById('btn-confirm-delete').addEventListener('click', async () => {
        if (!editingId) return;
        try {
            const res = await fetch(`/api/productos/${editingId}`, { method: 'DELETE' });
            if (res.ok) {
                document.getElementById('delete-modal').style.display = 'none';
                loadProducts();
            }
        } catch (e) {
            alert('Error al eliminar');
        }
    });

    document.getElementById('btn-cancel-delete').addEventListener('click', () => {
        document.getElementById('delete-modal').style.display = 'none';
    });
}

function filterProducts() {
    const search = document.getElementById('admin-search').value.toLowerCase();
    const category = document.getElementById('admin-filter').value;

    const filtered = allProducts.filter(p => {
        const matchSearch = p.nombre.toLowerCase().includes(search) || 
                            p.marca.toLowerCase().includes(search);
        const matchCategory = category === 'todos' || p.categoria === category;
        return matchSearch && matchCategory;
    });

    renderProducts(filtered);
}

function addCaracteristicaInput(value = '') {
    const container = document.getElementById('caracteristicas-container');
    const div = document.createElement('div');
    div.className = 'caract-item';
    div.innerHTML = `
        <input type="text" class="caract-input" placeholder="Ej: 1000g" value="${value}">
        <button type="button" class="btn-icon btn-delete"><i class="fas fa-times"></i></button>
    `;
    div.querySelector('button').addEventListener('click', () => div.remove());
    container.appendChild(div);
}

// Attach to window so onclick works in HTML string
window.editProduct = (id) => {
    const p = allProducts.find(prod => prod.id === id);
    if (!p) return;

    editingId = id;
    document.getElementById('modal-title').textContent = 'Editar Producto';
    
    document.getElementById('product-nombre').value = p.nombre;
    document.getElementById('product-marca').value = p.marca;
    document.getElementById('product-categoria').value = p.categoria;
    document.getElementById('product-precio').value = p.price;
    document.getElementById('product-descripcion').value = p.descripcion;
    document.getElementById('product-imagen').value = p.imagen;

    const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3002' : 'https://bellacatys-web-sistema-o1cv.vercel.app';
    const imgSrc = p.imagen ? (p.imagen.startsWith('/') ? baseUrl + p.imagen : p.imagen) : '';

    if (imgSrc) {
        document.getElementById('image-preview').src = imgSrc;
        document.getElementById('image-preview').style.display = 'block';
        document.getElementById('upload-placeholder').style.display = 'none';
    } else {
        document.getElementById('image-preview').style.display = 'none';
        document.getElementById('upload-placeholder').style.display = 'block';
    }

    const container = document.getElementById('caracteristicas-container');
    container.innerHTML = '';
    if (p.caracteristicas) {
        p.caracteristicas.forEach(c => addCaracteristicaInput(c));
    }

    document.getElementById('product-modal').style.display = 'flex';
};

window.confirmDelete = (id) => {
    editingId = id;
    document.getElementById('delete-modal').style.display = 'flex';
};
