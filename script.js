document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartItemsContainer = document.querySelector('.cart-items');
    const orderForm = document.getElementById('order-form');
    const orderMessage = document.getElementById('order-message'); // Элемент для сообщения

    // Загрузка товаров из localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Функция для отображения товаров в корзине
    const renderCartItems = () => {
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            const itemCounts = {}; // Объект для подсчета количества товаров по ID

            // Подсчет количества товаров
            cartItems.forEach(item => {
                if (itemCounts[item.id]) {
                    itemCounts[item.id].quantity += item.quantity; // Учитываем количество
                } else {
                    itemCounts[item.id] = { name: item.name, price: item.price, quantity: item.quantity };
                }
            });

            let totalPrice = 0; // Переменная для итоговой цены

            // Отображение товаров в корзине
            for (const id in itemCounts) {
                const cartItem = document.createElement('div');
                const itemTotal = itemCounts[id].price * itemCounts[id].quantity; // Общая стоимость для товара
                totalPrice += itemTotal; // Суммируем итоговую стоимость

                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <p>${itemCounts[id].name} (Количество: ${itemCounts[id].quantity}) - ${itemCounts[id].price} руб за единицу. Общая сумма: ${itemTotal} руб</p>
                    <button class="remove-btn" data-id="${id}">Удалить</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            }

            // Отображаем итоговую стоимость
            const totalDisplay = document.createElement('div');
            totalDisplay.textContent = `Итоговая стоимость: ${totalPrice} руб`;
            cartItemsContainer.appendChild(totalDisplay);

            // Добавление обработчиков событий к кнопкам удаления
            const removeButtons = document.querySelectorAll('.remove-btn');
            removeButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const id = event.target.getAttribute('data-id');
                    removeFromCart(id);
                });
            });
        }
    };

    // Функция для добавления товара в корзину
    const addToCart = (product) => {
        const quantityInput = document.querySelector(`.quantity-input[data-product-id="${product.id}"]`); // Получаем элемент ввода количества
        const quantity = parseInt(quantityInput.value) || 1; // Получаем количество или 1 по умолчанию

    

        // Проверяем, есть ли уже товар в корзине
        const existingItemIndex = cartItems.findIndex(item => item.id == product.id); // Используем == для корректного сравнения

        if (existingItemIndex > -1) {
            // Если товар уже есть в корзине, обновляем его количество
            cartItems[existingItemIndex].quantity += quantity;
        } else {
            // Если товара нет в корзине, добавляем его с учетом количества
            const productWithQuantity = { ...product, quantity: quantity };
            cartItems.push(productWithQuantity);
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        renderCartItems();
    };

// Добавление обработчиков событий к кнопкам "Добавить в корзину"
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.getAttribute('data-product-id');
        const productName = button.getAttribute('data-product-name');
        const productPrice = parseFloat(button.getAttribute('data-product-price')); // Получаем цену
        const product = { id: productId, name: productName, price: productPrice }; // Добавляем цену в объект товара
        addToCart(product);
    });
});

// Функция для обновления количества товара в корзине
function updateItemQuantity(id, quantity) {
updateCart((prev) => {
    let cart = { ...prev };

    if (cart.products[id]) {
        cart.products[id].quantity = quantity;

        // Удаляем товар, если количество равно 0
        if (cart.products[id].quantity <= 0) {
            delete cart.products[id];
        }
    }

    return cart;
});
}

// Обработчик события для формы обновления количества
function handleQuantityUpdate(event) {
event.preventDefault();
const form = event.currentTarget;
const id = form.dataset.productId; // Получаем ID товара из атрибута data
const quantity = parseInt(form.elements.quantity.value, 10); // Получаем количество из поля ввода

updateItemQuantity(id, quantity); // Обновляем количество товара
}


    // Функция для удаления товара из корзины
    const removeFromCart = (id) => {
        const index = cartItems.findIndex(item => item.id == id); // Используем == для корректного сравнения
        if (index > -1) {
            cartItems.splice(index, 1);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            renderCartItems();
        }
    };

    


    // Обработчик отправки формы заказа
    if (orderForm) {
        orderForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Очистка корзины
            localStorage.removeItem('cartItems');
            cartItems = [];
            renderCartItems();

            // Всплывающее сообщение о том, что заказ оформлен
            orderMessage.textContent = 'Заказ оформлен!';
            orderMessage.style.display = 'block'; // Показываем сообщение
            setTimeout(() => {
                orderMessage.style.display = 'none'; // Скрываем сообщение через 3 секунды
            }, 3000);
        });
    }

    // Отображение товаров в корзине при загрузке страницы
    renderCartItems();
});