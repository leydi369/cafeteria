document.addEventListener('DOMContentLoaded', () => {
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountSpan = document.querySelector('.cart-count');

   // Función para actualizar el contador del carrito
    const updateCartCount = () => {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCountSpan) {
            cartCountSpan.innerText = totalItems;
        }
    };

    // Función para guardar el carrito en el localStorage
    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    };

    // Función para renderizar el carrito en la página 'cart.html'
    const renderCart = () => {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartSubtotalSpan = document.getElementById('cart-subtotal');
        const cartTotalSpan = document.getElementById('cart-total');

        if (!cartItemsContainer || !cartSubtotalSpan || !cartTotalSpan) return;

        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        }
        
        else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <p>${item.price.toFixed(2)} $</p>
                    </div>
                    <div class="item-quantity">
                        <button class="quantity-minus" data-name="${item.name}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-plus" data-name="${item.name}">+</button>
                    </div>
                    <p class="item-total">${(item.price * item.quantity).toFixed(2)} $</p>
                    <button class="item-remove" data-name="${item.name}"><i class="fas fa-trash-alt"></i></button>
                `;
                cartItemsContainer.appendChild(itemElement);
                subtotal += item.price * item.quantity;
            });
        }
   
        cartSubtotalSpan.innerText = `${subtotal.toFixed(2)} $`;
        cartTotalSpan.innerText = `${subtotal.toFixed(2)} $`;
    };
    

    // Lógica para añadir producto al carrito
    const botonesAnadir = document.querySelectorAll('.btn-anadir');
    botonesAnadir.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const productCard = e.target.closest('.producto-card');
            const productName = productCard.dataset.nombre;
            const productPrice = parseFloat(productCard.dataset.precio);
            const productImage = productCard.querySelector('img').src;

            const existingItem = cart.find(item => item.name === productName);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            saveCart();
            // Animación visual para el carrito
            const iconoCarrito = document.querySelector('.carrito-icono i');
            iconoCarrito.style.transform = 'scale(1.2) rotate(10deg)';
            setTimeout(() => {
                iconoCarrito.style.transform = 'scale(1) rotate(0deg)';
            }, 500);
        });
    });

    // Lógica para modificar el carrito en la página 'cart.html'
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('quantity-plus')) {
            const name = e.target.dataset.name;
            const item = cart.find(i => i.name === name);
            if (item) {
                item.quantity++;
                saveCart();
                renderCart();
            }
        }
        if (e.target.classList.contains('quantity-minus')) {
            const name = e.target.dataset.name;
            const item = cart.find(i => i.name === name);
            if (item && item.quantity > 1) {
                item.quantity--;
                saveCart();
                renderCart();
            }
        }
        if (e.target.closest('.item-remove')) {
            const name = e.target.closest('.item-remove').dataset.name;
            cart = cart.filter(i => i.name !== name);
            saveCart();
            renderCart();
        }
    });

    // --- Funcionalidad del Blog Interactivo ---
    const blogSubmitForm = document.getElementById('blog-submit-form');
    const blogGrid = document.getElementById('blog-grid');

    if (blogSubmitForm) {
        blogSubmitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('blog-title').value;
            const author = document.getElementById('blog-author').value;
            const content = document.getElementById('blog-content').value;

            // Simulación de un nuevo blog subido
            const newPost = document.createElement('div');
            newPost.classList.add('blog-post-card');
            newPost.innerHTML = `
                <img src="https://images.unsplash.com/photo-1517701880590-71328003a3d2?q=80&w=1770&auto=format&fit=crop" alt="Nuevo blog">
                <div class="post-info">
                    <h3>${title}</h3>
                    <p>por ${author} | Hoy</p>
                    <a href="#" class="btn-post">Leer más</a>
                </div>
            `;
            blogGrid.prepend(newPost);
            blogSubmitForm.reset();
            alert('¡Tu blog ha sido enviado para revisión!');
        });
    }


    // --- Funcionalidad de Búsqueda Global ---
    const busquedaGlobalInput = document.getElementById('busqueda-global-input');
    const busquedaGlobalBtn = document.getElementById('busqueda-global-btn');

    if (busquedaGlobalBtn) {
        busquedaGlobalBtn.addEventListener('click', () => {
            const query = busquedaGlobalInput.value.trim();
            if (query) {
                // Redirige al menú y pasa el término de búsqueda en la URL
                window.location.href = `menu.html?search=${encodeURIComponent(query)}`;
            }
        });
    }

    // Lógica para ejecutar la búsqueda en la página de menú
    if (window.location.pathname.endsWith('menu.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        if (searchQuery) {
            const busquedaInput = document.getElementById('busqueda-input');
            const productos = document.querySelectorAll('.productos-grid .producto-card');
            
            busquedaInput.value = searchQuery;
            busquedaInput.focus();
            
            productos.forEach(producto => {
                const nombre = producto.dataset.nombre.toLowerCase();
                if (nombre.includes(searchQuery.toLowerCase())) {
                    producto.style.display = 'block';
                } else {
                    producto.style.display = 'none';
                }
            });
        }
    }/*Verificar*/


    // Lógica para el filtro de búsqueda en 'menu.html'
    const busquedaInput = document.getElementById('busqueda-input');
    const productos = document.querySelectorAll('.productos-grid .producto-card');

    if (busquedaInput) {
        busquedaInput.addEventListener('input', (e) => {
            const searchText = e.target.value.toLowerCase();
            productos.forEach(producto => {
                const nombre = producto.dataset.nombre.toLowerCase();
                if (nombre.includes(searchText)) {
                    producto.style.display = 'block';
                } else {
                    producto.style.display = 'none';
                }
            });
        });
    }

    // Funcionalidad de filtros por botón
    const filtros = document.querySelectorAll('.filtro-item');
    if (filtros) {
        filtros.forEach(filtro => {
            filtro.addEventListener('click', (e) => {
                const filtroSeleccionado = e.target.dataset.filtro;
                filtros.forEach(f => f.classList.remove('activo'));
                e.target.classList.add('activo');
                
                productos.forEach(producto => {
                    const tipoProducto = producto.dataset.tipo;
                    if (filtroSeleccionado === 'todos' || tipoProducto === filtroSeleccionado) {
                        producto.style.display = 'block';
                    } else {
                        producto.style.display = 'none';
                    }
                });
            });
        });
    }


    // Funcionalidad de la ventana modal
    const modal = document.getElementById('product-modal');
    const closeButton = document.querySelector('.close-button');
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductIngredients = document.getElementById('modal-product-ingredients');

    // Abre el modal al hacer clic en un producto
    productos.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-anadir')) return; // Evita que se active al hacer clic en el botón de añadir
            
            const productName = card.dataset.nombre;
            const productIngredients = card.dataset.ingredientes;

            modalProductName.innerText = productName;
            modalProductIngredients.innerText = productIngredients;
            modal.style.display = 'block';
        });
    });

    // Cierra el modal al hacer clic en la X
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Cierra el modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Carga inicial del carrito
    updateCartCount();
    renderCart();

});