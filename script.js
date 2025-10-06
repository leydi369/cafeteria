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
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío.</p>';
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

    // Lógica para modificar o eliminar el carrito en la página 'cart.html'
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

        //PROCESO DE PAGO (cart.html) ---
    const btnProcederPago = document.getElementById('btn-proceder-pago');
    const pagoModal = document.getElementById('pago-modal');
    const closePagoModal = document.getElementById('close-pago-modal');
    const pagoForm = document.getElementById('pago-form');
    const pagoExitoso = document.getElementById('pago-exitoso');
    const pagoTitulo = document.getElementById('pago-titulo');
    
    if (btnProcederPago) {
        // 1. Abrir Modal de Pago
        btnProcederPago.addEventListener('click', () => {
            if (cart.length > 0) {
                pagoModal.style.display = 'block';
            } else {
                alert('Añade productos al carrito antes de proceder al pago.');
            }
        });

        // 2. Cerrar Modal de Pago y resetear
        closePagoModal.addEventListener('click', () => {
            pagoModal.style.display = 'none';
            pagoForm.style.display = 'block';
            pagoExitoso.style.display = 'none';
            pagoTitulo.innerText = "Información de Pago";
            pagoForm.reset();
        });

        // 3. Simulación de Pago Exitoso
        pagoForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulación de procesamiento (puedes añadir un spinner aquí)
            setTimeout(() => {
                pagoForm.style.display = 'none';
                pagoTitulo.innerText = "¡Gracias por tu compra!";
                pagoExitoso.style.display = 'block';
                
                // Limpia el carrito después del pago "exitoso"
                cart = [];
                saveCart(); 
                renderCart();
            }, 1000); // 1 segundo para simular la transacción
        });
    }

    // --- Funcionalidad del Blog Interactivo ---
    const blogSubmitForm = document.getElementById('blog-submit-form');
    const blogGrid = document.getElementById('blog-grid');

    if (blogSubmitForm && blogGrid) {
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
            // Agrega el nuevo post al inicio de la lista
            blogGrid.prepend(newPost);
            blogSubmitForm.reset();
            alert('¡Tu blog ha sido enviado para revisión!');
        });
    }


    // --- Funcionalidad de Búsqueda Global ---
    const busquedaGlobalInput = document.getElementById('busqueda-global-input');
    const busquedaGlobalBtn = document.getElementById('busqueda-global-btn');

     // Búsqueda Global (desde index.html)
    if (busquedaGlobalBtn) {
        busquedaGlobalBtn.addEventListener('click', () => {
            const query = busquedaGlobalInput.value.trim();
            if (query) {
                // Redirige al menú y pasa el término de búsqueda en la URL
                window.location.href = `menu.html?search=${encodeURIComponent(query)}`;
            }
        });
    }

      // Lógica para filtros y búsqueda local (solo en menu.html)
    const productos = document.querySelectorAll('.productos-grid .producto-card');
    const busquedaInput = document.getElementById('busqueda-input');
    const filtros = document.querySelectorAll('.filtro-item');

    const filtrarProductos = (query, tipo) => {
        const queryLower = query.toLowerCase();
        
        productos.forEach(producto => {
            const nombre = producto.dataset.nombre.toLowerCase();
            const tipoProducto = producto.dataset.tipo;
            
            const coincideBusqueda = nombre.includes(queryLower);
            const coincideFiltro = (tipo === 'todos' || tipoProducto === tipo);

            if (coincideBusqueda && coincideFiltro) {
                producto.style.display = 'block';
            } else {
                producto.style.display = 'none';
            }
        });
    }

    if (window.location.pathname.endsWith('menu.html')) {
        // 1. Búsqueda Local por Input (al escribir)
        if (busquedaInput) {
             busquedaInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                const filtroActivo = document.querySelector('.filtro-item.activo').dataset.filtro;
                filtrarProductos(query, filtroActivo);
            });
        }

        // 2. Filtros por Botón
        filtros.forEach(boton => {
            boton.addEventListener('click', (e) => {
                // Desactivar todos los botones y activar el seleccionado
                filtros.forEach(f => f.classList.remove('activo'));
                e.target.classList.add('activo');
                
                const tipo = e.target.dataset.filtro;
                const query = busquedaInput ? busquedaInput.value.trim() : ''; // Usa el valor actual de la búsqueda
                filtrarProductos(query, tipo);
            });
        });

        // 3. Ejecutar Búsqueda Global al Cargar (si viene de index.html)
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        
        if (searchQuery && busquedaInput) {
            busquedaInput.value = searchQuery;
            busquedaInput.focus();
            
            // Asegura que los filtros de botón se reinicien al usar la búsqueda global
            filtros.forEach(f => f.classList.remove('activo'));
            document.querySelector('[data-filtro="todos"]').classList.add('activo');

            // Aplica el filtro inicial con el término de búsqueda
            filtrarProductos(searchQuery, 'todos'); 
        }

    }


    // Funcionalidad de la ventana modal
    const modal = document.getElementById('product-modal');
    const closeButton = document.querySelector('.close-button');
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductIngredients = document.getElementById('modal-product-ingredients');

    if (productos.length > 0 && modal) {
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
    }

    // Cierra el modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
        if (pagoModal && e.target == pagoModal) {
            pagoModal.style.display = 'none';
            pagoForm.style.display = 'block';
            pagoExitoso.style.display = 'none';
            pagoTitulo.innerText = "Información de Pago";
            pagoForm.reset();
        }
    });

    // Carga inicial del carrito
    updateCartCount();
    renderCart();

});
