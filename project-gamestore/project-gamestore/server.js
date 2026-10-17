const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/images', express.static(path.join(__dirname, 'images')));

const games = [
    {
        id: 1,
        title: 'Spider-Man Remastered',
        image: 'spiderman.jpg',
        description: 'Станьте Человеком-пауком в захватывающем приключении по Нью-Йорку.',
        rating: 4.8,
        price: 2999,
        genre: 'Action'
    },
    {
        id: 2,
        title: 'The Last of Us Part II',
        image: 'tlou2.jpg',
        description: 'Эмоциональное путешествие в постапокалиптическом мире, полном опасностей.',
        rating: 4.9,
        price: 3499,
        genre: 'Adventure'
    },
    {
        id: 3,
        title: 'Tomb Raider Definitive',
        image: 'tombraider.jpg',
        description: 'Присоединитесь к Ларе Крофт в её первом захватывающем приключении.',
        rating: 4.5,
        price: 1999,
        genre: 'Adventure'
    },
    {
        id: 4,
        title: 'Uncharted 4: A Thief\'s End',
        image: 'uncharted.jpg',
        description: 'Финальное приключение Нейтана Дрейка в поисках сокровищ.',
        rating: 4.7,
        price: 2799,
        genre: 'Action'
    },
    {
        id: 5,
        title: 'Ведьмак 3: Дикая Охота',
        image: 'ведьмак.jpg',
        description: 'Станьте Геральтом из Ривии в эпической RPG с открытым миром.',
        rating: 4.9,
        price: 2499,
        genre: 'RPG'
    },
    {
        id: 6,
        title: 'Resident Evil Village',
        image: 'резидент.jpg',
        description: 'Выживайте в деревне, полной ужасов и тайн в новой части RE.',
        rating: 4.6,
        price: 3299,
        genre: 'Horror'
    },
    {
        id: 7,
        title: 'God of War Ragnarök',
        image: 'godofwar.jpg',
        description: 'Продолжение эпической саги о Кратосе и Атрее в скандинавских мифах.',
        rating: 4.9,
        price: 3999,
        genre: 'Action'
    },
    {
        id: 8,
        title: 'Horizon Zero Dawn',
        image: 'horizon.jpg',
        description: 'Исследуйте мир, населённый механическими существами, в роли Элой.',
        rating: 4.7,
        price: 2199,
        genre: 'RPG'
    },
    {
        id: 9,
        title: 'Cyberpunk 2077',
        image: 'cyberpunk.jpg',
        description: 'Погрузитесь в мир будущего, где технологии и человечество переплелись.',
        rating: 4.3,
        price: 2899,
        genre: 'RPG'
    },
    {
        id: 10,
        title: 'Elden Ring',
        image: 'eldenring.jpg',
        description: 'Эпическое фэнтези от создателей Dark Souls с открытым миром.',
        rating: 4.8,
        price: 3799,
        genre: 'RPG'
    },
    {
        id: 11,
        title: 'Hogwarts Legacy',
        image: 'hogwarts.jpg',
        description: 'Станьте студентом Хогвартса в магическом приключении по вселенной Гарри Поттера.',
        rating: 4.6,
        price: 3499,
        genre: 'RPG'
    }
];

// маршруты
app.get('/api/games', (req, res) => {
    res.json(games);
});

app.get('/api/games/:id', (req, res) => {
    const game = games.find(g => g.id === parseInt(req.params.id));
    if (game) {
        res.json(game);
    } else {
        res.status(404).json({ error: 'Игра не найдена' });
    }
});

// Маршрут для поиска
app.get('/api/search', (req, res) => {
    const query = req.query.q?.toLowerCase() || '';
    const results = games.filter(game => 
        game.title.toLowerCase().includes(query) ||
        game.genre.toLowerCase().includes(query)
    );
    res.json(results);
});

// Маршрут для фильтрации по жанру
app.get('/api/genre/:genre', (req, res) => {
    const genre = req.params.genre.toLowerCase();
    const filtered = games.filter(game => 
        game.genre.toLowerCase() === genre
    );
    res.json(filtered);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Что-то пошло не так!' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Откройте http://localhost:${PORT}/home.html`);
});