# Как развернуть project-gamestore на другом компьютере

## Предусловия

- На новом компьютере установлен Node.js (актуальная LTS-версия) и npm
- Есть доступ к репозиторию проекта или архиву с файлами
- Есть способ передать файлы: флешка, облако или `scp`
- Подготовлена папка `images/` с изображениями игр

## Шаги

1. На новом компьютере откройте терминал.

2. Клонируйте репозиторий или распакуйте архив:
```
git clone https://github.com/example/project-gamestore.git
cd project-gamestore
```

3. Убедитесь, что в проекте есть `server.js`:

   ```
   ls server.js
   ```

4. Если файла нет — проверьте, что вы находитесь в корне проекта.

5. Создайте `package.json`:
```
npm init -y
```

6. Установите Express:
```
npm install express
```

7. Добавьте скрипт запуска в `package.json`:

   ```json
   {
     "scripts": {
       "start": "node server.js"
     },
     "dependencies": {
       "express": "^4.18.2"
     }
   }
   ```

8. Подготовьте папку со статикой frontend/:

   ```
   mkdir -p frontend
   ```

9. Перенесите туда HTML-файлы, CSS-файлы и script.js:
```
home.html
catalog.html
about.html
registration.html
home.css
catalog.css
about.css
registration.css
script.js
```

`server.js` раздаёт статику именно из `frontend/`:

   ```js
   app.use(express.static(path.join(__dirname, 'frontend')));
   ```

   Если файлы уже лежат в корне — либо перенесите их в `frontend/`,
   либо измените путь в `server.js`.

10 . Подготовьте папку с изображениями:

   ```
   mkdir -p images
   ```

11. Скопируйте туда изображения игр: `spiderman.jpg`, `tlou2.jpg`,
   `tombraider.jpg`, `uncharted.jpg`, `ведьмак.jpg`, `резидент.jpg`,
   `godofwar.jpg`, `horizon.jpg`, `cyberpunk.jpg`, `eldenring.jpg`,
   `hogwarts.jpg`.

12. Запустите сервер:

   ```
   npm start
   ```

   Или напрямую:

   ```
   node server.js
   ```

13. Откройте в браузере:

   ```
   http://localhost:3000/home.html
   ```


## Результат

На главной странице появится hero-блок «Добро пожаловать в PluseVibe»,
слайдер популярных игр и блок преимуществ. В каталоге по адресу
`http://localhost:3000/catalog.html` загрузятся карточки игр из API.

Проверить API можно командой:

```
curl http://localhost:3000/api/games
```

В ответе должен быть JSON-массив игр:

```json
[
  {
    "id": 1,
    "title": "Spider-Man Remastered",
    "image": "spiderman.jpg",
    "description": "Станьте Человеком-пауком в захватывающем приключении по Нью-Йорку.",
    "rating": 4.8,
    "price": 2999,
    "genre": "Action"
  }
]
```

Если каталог пуст или изображения не отображаются — проверьте,
что папки `frontend/` и `images/` лежат рядом с `server.js`,
а имена файлов совпадают с полем `image` в `server.js`.

## Что дальше

- [Устранение неполадок](docs/troubleshooting.md) — что делать,
  если сервер не запускается или формы не работают
- [Справочник API](docs/reference.md) — все маршруты, формат данных игры
  и структура проекта
