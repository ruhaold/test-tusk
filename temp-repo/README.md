### Быстрый старт

`yarn`
`yarn dev`
`yarn build`

# Frontend starter pack (Vite + Pug + SCSS)

## Установка

Установите [Yarn](https://yarnpkg.com/en/docs/install).

> Yarn - это современная альтернатива npm. Yarn работает с тем же файлом `package.json` и так же скачивает необходимые модули в папку `node_modules`, но делает это намного быстрее.

- скачайте сборку: `git clone https://git.rs-app.ru/rs/html/frontend-vite-pug.git`;
- перейдите в скачанную папку со сборкой: `cd frontend-vite-pug`;
- введите команду, которая скачает необходимые компоненты для корректной работы нашей сборки, указанные в файле `package.json`: `yarn`;
- введите команду: `yarn dev` (режим разработки);
- чтобы «собрать» проект, введите команду `yarn build`.

Если вы всё сделали правильно, у вас должен открыться браузер с локальным сервером и работающим `devServer`.

### Сборка проекта в режиме разработки

`yarn dev`

## Окончательная сборка

`yarn build`

### Структура каталогов

```
frontend-vite-pug
├── build-figma-tokens скрипты для сборки figma tokens
├── config Конфиги и окружение webpack
├── figma-tokens файлы figma tokens в формате json
├── dist Собранный проект
    └── assets - Исходники из public/assets и обработанные файлы из папки src
        ├── ajax То, что будем загружать через аякс
        └── img Изображения
    ├── js Скомпилированные js
    ├── css Скомпилированные css
├── lib сторонние библиотеки
└── src Исходные файлы
    ├── js js-файлы
    │   ├── comonents компоненты
    │   ├── functions вспомогательные функции
    │   └── vue если в проекте присутствуе vue
    ├── scss scss-файлы
    ├── svgsprite Исходники svg-спрайта
    ├── ui ui-kit
    └── views pug-шаблоны
```
