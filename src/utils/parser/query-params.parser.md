### `QueryParamsParser`

`QueryParamsParser` — это утилита или сервис, предназначенный для преобразования параметров запроса, закодированных в `QueryParamsDto`, в объект параметров, который может быть непосредственно использован в Prisma `findMany` для выполнения операций фильтрации, сортировки, пагинации и поиска в базе данных. Этот парсер обеспечивает гибкость и эффективность при работе с динамическими запросами.

#### Методы:

- **`parse(dto: QueryParamsDto): any`**
  - Этот метод принимает экземпляр `QueryParamsDto` как входной параметр и преобразует его в объект параметров для `findMany`.

#### Параметры метода `parse`:

- **`dto`**: `QueryParamsDto`
  - Объект DTO, содержащий параметры запроса от клиента, включая информацию о пагинации, сортировке, фильтрации и поиске.

#### Возвращаемое значение:

- Возвращает объект, который можно непосредственно использовать в качестве параметра для метода `findMany` Prisma. Структура возвращаемого объекта может включать следующие ключи:
  - **`take`**: Количество элементов для выборки (аналог `limit`).
  - **`skip`**: Количество элементов, которые следует пропустить (используется для пагинации).
  - **`orderBy`**: Условия сортировки, основанные на `sortBy` и `sortOrder`.
  - **`where`**: Условия фильтрации, сформированные на основе массива `filters` и условий поиска.

#### Пример использования:

```typescript
const queryParamsDto = new QueryParamsDto();
queryParamsDto.limit = 10;
queryParamsDto.page = 1;
queryParamsDto.sortBy = 'createdAt';
queryParamsDto.sortOrder = 'desc';
queryParamsDto.filters = [
  { field: 'status', operator: 'eq', value: 'active' },
  { field: 'price', operator: 'gt', value: '100' },
];

const queryParameters = QueryParamsParser.parse(queryParamsDto);
// Используйте queryParameters с Prisma findMany
```

Этот пример демонстрирует, как `QueryParamsParser` может быть использован для преобразования параметров запроса в формат, подходящий для выполнения сложных запросов к базе данных с помощью Prisma. Это обеспечивает гибкость и мощность при работе с API, позволяя клиентам динамически формировать запросы с различными условиями фильтрации, сортировки и пагинации.
