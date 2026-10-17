const API_URL = 'http://localhost:3000/api';
//навигация
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active') && 
            !e.target.closest('.nav-container')) {
            navLinks.classList.remove('active');
        }
    });
});

// слайдер
class Slider {
    constructor(containerId) {
        console.log('🔵 Создание слайдера:', containerId);
        
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('❌ Контейнер не найден:', containerId);
            return;
        }
        
        this.track = this.container.querySelector('.slider-track');
        this.dotsContainer = document.querySelector(`#${containerId} .slider-dots`);
        this.prevBtn = document.querySelector(`#${containerId} .prev-btn`);
        this.nextBtn = document.querySelector(`#${containerId} .next-btn`);
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.slides = [];
        this.isTransitioning = false;
        
        console.log('🔍 Элементы найдены:', {
            track: !!this.track,
            dots: !!this.dotsContainer,
            prevBtn: !!this.prevBtn,
            nextBtn: !!this.nextBtn
        });
        
        this.init();
    }

    init() {
        if (!this.track) {
            console.error('❌ Трек слайдера не найден');
            return;
        }
        
        this.slides = this.track.querySelectorAll('.slide');
        console.log(`📊 Найдено слайдов: ${this.slides.length}`);
        
        if (this.slides.length === 0) {
            console.error('❌ Нет слайдов для отображения');
            return;
        }
        
        this.slides.forEach(slide => {
            slide.style.flex = '0 0 100%';
            slide.style.minWidth = '100%';
            slide.style.width = '100%';
        });
        
        this.createDots();
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                console.log('👈 Нажата кнопка "Назад"');
                this.prev();
            });
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                console.log('👉 Нажата кнопка "Вперед"');
                this.next();
            });
        }
        
        this.goTo(0);
        
        this.startAutoPlay();
        
        const container = this.track.closest('.slider-container');
        if (container) {
            container.addEventListener('mouseenter', () => {
                console.log('🖱️ Мышь на слайдере - пауза');
                this.stopAutoPlay();
            });
            container.addEventListener('mouseleave', () => {
                console.log('🖱️ Мышь ушла - продолжение');
                this.startAutoPlay();
            });
        }
        
        console.log('✅ Слайдер успешно инициализирован');
    }

    createDots() {
        if (!this.dotsContainer) {
            console.warn('⚠️ Контейнер для точек не найден');
            return;
        }
        
        this.dotsContainer.innerHTML = '';
        this.slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                console.log('🎯 Клик по точке:', index);
                this.goTo(index);
            });
            this.dotsContainer.appendChild(dot);
        });
        console.log(`⚪ Создано точек: ${this.slides.length}`);
    }

    goTo(index) {
        if (this.isTransitioning) {
            console.log('⏳ Анимация в процессе, пропускаем');
            return;
        }
        
        if (index < 0) index = this.slides.length - 1;
        if (index >= this.slides.length) index = 0;
        
        this.currentIndex = index;
        this.isTransitioning = true;
        
        console.log(`🔄 Переход к слайду ${index + 1} из ${this.slides.length}`);
        
        this.track.style.transform = `translateX(-${index * 100}%)`;
        this.track.style.transition = 'transform 0.5s ease-in-out';
        
        if (this.dotsContainer) {
            const dots = this.dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    next() {
        console.log('⏭️ Следующий слайд');
        this.goTo(this.currentIndex + 1);
    }

    prev() {
        console.log('⏮️ Предыдущий слайд');
        this.goTo(this.currentIndex - 1);
    }

    startAutoPlay() {
        if (this.autoPlayInterval) {
            console.log('⏹️ Автопрокрутка уже запущена');
            return;
        }
        console.log('▶️ Запуск автопрокрутки');
        this.autoPlayInterval = setInterval(() => {
            console.log('🔄 Автопрокрутка');
            this.next();
        }, 4000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            console.log('⏸️ Остановка автопрокрутки');
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM загружен');
    
    // Инициализация слайдера на главной странице
    const sliderElement = document.getElementById('mainSlider');
    if (sliderElement) {
        console.log('✅ Слайдер найден, инициализация...');
        new Slider('mainSlider');
    } else {
        console.log('ℹ️ Слайдер не найден на этой странице');
    }
});

// загрузка игр в каталог
async function loadGames() {
    try {
        const response = await fetch(`${API_URL}/games`);
        const games = await response.json();
        return games;
    } catch (error) {
        console.error('Ошибка загрузки игр:', error);
        return [];
    }
}

async function renderCatalog(games) {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;

    if (!games || games.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:#aaa;grid-column:1/-1;padding:2rem;">Игры не найдены</p>';
        return;
    }

    grid.innerHTML = games.map(game => `
        <div class="game-card" data-id="${game.id}">
            <img src="/images/${game.image}" alt="${game.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Game'">
            <div class="game-card-info">
                <h3>${game.title}</h3>
                <p class="description">${game.description}</p>
                <div class="rating">
                    <span class="stars">${'★'.repeat(Math.floor(game.rating))}${game.rating % 1 >= 0.5 ? '★' : ''}</span>
                    <span class="rating-value">${game.rating.toFixed(1)}</span>
                </div>
                <div class="price">${game.price} ₽</div>
                <span class="genre">${game.genre}</span>
            </div>
        </div>
    `).join('');

    //обработчики для модальных окон
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = parseInt(card.dataset.id);
            const game = games.find(g => g.id === id);
            if (game) openModal(game);
        });
    });
}

// модальное окно
let currentModalGame = null;

function openModal(game) {
    currentModalGame = game;
    const modal = document.getElementById('gameModal');
    const image = document.getElementById('modalImage');
    const title = document.getElementById('modalTitle');
    const description = document.getElementById('modalDescription');
    const rating = document.getElementById('modalRating');
    const price = document.getElementById('modalPrice');
    const stars = document.querySelector('.modal-rating .stars');

    if (modal) {
        image.src = `/images/${game.image}`;
        image.alt = game.title;
        title.textContent = game.title;
        description.textContent = game.description;
        rating.textContent = `${game.rating.toFixed(1)} / 5.0`;
        price.textContent = `${game.price} ₽`;
        stars.textContent = '★'.repeat(Math.floor(game.rating));
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('gameModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Закрытие модального окна
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('gameModal');
    if (modal) {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }
});

// каталог (поиск и фильтрация)
async function setupCatalogControls() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const genreFilter = document.getElementById('genreFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (!searchInput) return;
    
    let allGames = await loadGames();
    renderCatalog(allGames);
    
    function filterAndRender() {
        const query = searchInput.value.toLowerCase().trim();
        const genre = genreFilter ? genreFilter.value : 'all';
        const sort = sortFilter ? sortFilter.value : 'rating';
        
        let filtered = allGames.filter(game => {
            const matchesSearch = game.title.toLowerCase().includes(query) ||
                                 game.description.toLowerCase().includes(query);
            const matchesGenre = genre === 'all' || game.genre.toLowerCase() === genre;
            return matchesSearch && matchesGenre;
        });
        
        switch(sort) {
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
        
        renderCatalog(filtered);
    }
    
    searchBtn.addEventListener('click', filterAndRender);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') filterAndRender();
    });
    
    if (genreFilter) {
        genreFilter.addEventListener('change', filterAndRender);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', filterAndRender);
    }
}

// форма регистрации
function setupRegistrationForm() {
    const form = document.getElementById('registrationForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('regName');
        const email = document.getElementById('regEmail');
        const password = document.getElementById('regPassword');
        const confirmPassword = document.getElementById('regConfirmPassword');
        const agree = document.getElementById('regAgree');
        
        const nameError = document.getElementById('regNameError');
        const emailError = document.getElementById('regEmailError');
        const passwordError = document.getElementById('regPasswordError');
        const confirmError = document.getElementById('regConfirmError');
        const agreeError = document.getElementById('regAgreeError');
        const success = document.getElementById('regSuccess');
        
        [nameError, emailError, passwordError, confirmError, agreeError].forEach(el => {
            if (el) el.textContent = '';
        });
        if (success) success.style.display = 'none';
        
        let isValid = true;
        
        if (!name.value.trim() || name.value.trim().length < 2) {
            nameError.textContent = 'Имя должно содержать минимум 2 символа';
            isValid = false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            emailError.textContent = 'Введите корректный email';
            isValid = false;
        }
        
        if (password.value.length < 6) {
            passwordError.textContent = 'Пароль должен содержать минимум 6 символов';
            isValid = false;
        }
        
        if (password.value !== confirmPassword.value) {
            confirmError.textContent = 'Пароли не совпадают';
            isValid = false;
        }
        
        if (!agree.checked) {
            agreeError.textContent = 'Необходимо согласиться с условиями';
            isValid = false;
        }
        
        if (isValid) {
            success.style.display = 'block';
            form.reset();
            
            fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.value.trim(),
                    email: email.value.trim(),
                    password: password.value
                })
            }).catch(err => console.error('Ошибка регистрации:', err));
        }
    });
}

// форма обратной связи
function setupFeedbackForm() {
    const form = document.getElementById('feedbackForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('feedbackName');
        const email = document.getElementById('feedbackEmail');
        const subject = document.getElementById('feedbackSubject');
        const message = document.getElementById('feedbackMessage');
        
        const nameError = document.getElementById('feedbackNameError');
        const emailError = document.getElementById('feedbackEmailError');
        const subjectError = document.getElementById('feedbackSubjectError');
        const messageError = document.getElementById('feedbackMessageError');
        const success = document.getElementById('feedbackSuccess');
        
        [nameError, emailError, subjectError, messageError].forEach(el => {
            if (el) el.textContent = '';
        });
        if (success) success.style.display = 'none';
        
        let isValid = true;
        
        if (!name.value.trim() || name.value.trim().length < 2) {
            nameError.textContent = 'Введите ваше имя (мин. 2 символа)';
            isValid = false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            emailError.textContent = 'Введите корректный email';
            isValid = false;
        }
        
        if (!subject.value) {
            subjectError.textContent = 'Выберите тему сообщения';
            isValid = false;
        }
        
        if (!message.value.trim() || message.value.trim().length < 10) {
            messageError.textContent = 'Сообщение должно содержать минимум 10 символов';
            isValid = false;
        }
        
        if (isValid) {
            success.style.display = 'block';
            form.reset();
            
            fetch(`${API_URL}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.value.trim(),
                    email: email.value.trim(),
                    subject: subject.value,
                    message: message.value.trim()
                })
            }).catch(err => console.error('Ошибка отправки:', err));
        }
    });
}

// инициализация
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('mainSlider')) {
        new Slider('mainSlider');
    }
    
    if (document.getElementById('catalogGrid')) {
        setupCatalogControls();
    }
    
    setupRegistrationForm();
    setupFeedbackForm();
});