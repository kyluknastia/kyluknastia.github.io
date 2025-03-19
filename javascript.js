// Функція для перемикання на вкладку "Про автомобілі"
function switchToAboutCarsTab(carId) {
    document.getElementById("tab5").checked = true; // Перемикає вкладку на "Про автомобілі"
    setTimeout(function() {
        document.getElementById(carId).scrollIntoView({ behavior: 'smooth' }); // Прокручує до конкретного авто
    }, 200);
}


// Масив для зберігання заброньованих автомобілів
let bookings = [];

// Перевірка, чи користувач увійшов в акаунт
function checkUserLogin() {
    const user = localStorage.getItem('user');
    
    if (user) {
        document.getElementById("login-status").innerHTML = `Вітаємо, ${user} <button onclick="logout()">Вийти</button>`;
        document.getElementById("book-car-btn").disabled = false;  // Дозволити бронювання
    } else {
        document.getElementById("login-status").innerText = "Будь ласка, увійдіть або зареєструйтесь.";
        document.getElementById("book-car-btn").disabled = true;   // Заборонити бронювання
    }
}

// Вихід з профілю
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    alert("Ви вийшли з акаунту.");
    checkUserLogin();
}

// Реєстрація нового користувача
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    // Зберігаємо користувача в localStorage
    localStorage.setItem('user', username);
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);  // У реальному додатку пароль потрібно хешувати!

    alert("Реєстрація успішна!");
    checkUserLogin();  // Оновлюємо статус після реєстрації
});

// Вхід в систему
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const storedUsername = localStorage.getItem('user') ? localStorage.getItem('user').trim() : '';
    const storedPassword = localStorage.getItem('password') ? localStorage.getItem('password').trim() : '';

    console.log("Вхід:");
    console.log("Введене ім'я:", username);
    console.log("Збережене ім'я:", storedUsername);
    console.log("Введений пароль:", password);
    console.log("Збережений пароль:", storedPassword);

    if (username === storedUsername && password === storedPassword) {
        alert("Вхід успішний!");
        checkUserLogin();  // Оновлюємо статус після входу
    } else {
        alert("Невірний логін або пароль.");
    }
});

// Очищення полів після реєстрації та збереження пароля
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', function(event) {
    event.preventDefault();  // Запобігає перезавантаженню сторінки
    
    const usernameInput = document.getElementById('register-username');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    
    // Зберігаємо значення в localStorage
    localStorage.setItem('user', usernameInput.value);
    localStorage.setItem('password', passwordInput.value); // Збереження пароля
    
    console.log("Збережено користувача:", usernameInput.value);
    console.log("Збережено пароль:", passwordInput.value);
    
    alert("Реєстрація успішна!");
    
    // Додаємо затримку, щоб переконатися, що очищення відбудеться після реєстрації
    setTimeout(() => {
        // Очистка полів після реєстрації
        usernameInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";
    }, 100);  // Затримка на 100 мс
    
    // Оновлення статусу користувача
    checkUserLogin();
});

// Оновлення статусу користувача при завантаженні сторінки
checkUserLogin();


// Функція для бронювання автомобіля
function bookCar(carName) {
    const user = localStorage.getItem('user');
    
    if (!user) {
        alert("Для бронювання автомобіля вам необхідно увійти або зареєструватись.");
        return;
    }
    
    // Перевіряємо, чи цей автомобіль вже заброньований
    if (bookings.some(booking => booking.carName === carName)) {
        alert("Цей автомобіль вже заброньовано!");
        return;
    }

    // Додаємо автомобіль в список бронювань
    bookings.push({ carName, confirmed: false });
    
    // Оновлюємо список "Мої бронювання"
    updateBookings();
    
    // Переводимо користувача в розділ "Мої бронювання"
    document.getElementById("tab2").checked = true;
    
    // Отримуємо кнопку, яка була натиснута
    var button = document.getElementById(carName + "-book-btn");

    // Змінюємо текст кнопки на "Підтверджено"
    button.textContent = "Підтверджено";
    button.disabled = true;  // Деактивуємо кнопку, щоб не можна було повторно забронювати
    button.classList.add("confirmed");
}

// Функція для оновлення списку "Мої бронювання"
function updateBookings() {
    let myBookingsDiv = document.getElementById("myBookings");
    myBookingsDiv.innerHTML = "";
    
    bookings.forEach((booking, index) => {
        let bookingItem = document.createElement("div");
        bookingItem.classList.add("booking-item");
        
        if (booking.confirmed) {
            bookingItem.innerHTML = `
                <p>${booking.carName}</p>
                <p>${booking.details}</p>
                <button onclick="deleteBooking(${index})" class="delete-btn">Видалити</button>
            `;
        } else {
            bookingItem.innerHTML = `
                <p>${booking.carName}</p>
                <button onclick="confirmBooking(${index})" class="confirm-btn">Підтвердити</button>
            `;
        }
        
        myBookingsDiv.appendChild(bookingItem);
    });
}

// Функція для підтвердження бронювання з вибором дат
function confirmBooking(index) {
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    
    if (startDate && endDate) {
        let bookingDetails = `Бронювання з ${startDate} по ${endDate}`;
        bookings[index].confirmed = true;
        bookings[index].details = bookingDetails;
        updateBookings();
        document.getElementById("start-date").value = '';
        document.getElementById("end-date").value = '';
    }
}

// Функція для видалення бронювання
function deleteBooking(index) {
    bookings.splice(index, 1);
    updateBookings();
}

// Перевірка статусу при завантаженні сторінки
checkUserLogin();
