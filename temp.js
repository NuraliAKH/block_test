const fs = require('fs');
const path = require('path');

function parseRelationAnnotation(annotation) {
  const relation = {
    name: null,
    fields: [],
    references: [],
  };

  // Попытка извлечь имя связи, если оно указано явно
  const relationNameMatch = annotation.match(/@relation\("([^"]+)"\)/);
  if (relationNameMatch) {
    relation.name = relationNameMatch[1];
  }

  // Обработка параметров аннотации
  const paramsMatch = annotation.match(/@relation\(([^)]+)\)/);
  if (paramsMatch) {
    const paramsString = paramsMatch[1];
    // Разбиваем параметры на части, учитывая возможность наличия массивов и сохраняя их целостность
    const paramsParts = paramsString
      .split(/,\s*(?![^\[]*\])/)
      .map((part) => part.trim());

    paramsParts.forEach((part) => {
      const [key, rawValue] = part.split(':').map((p) => p.trim());
      if (key && rawValue) {
        const value = rawValue.replace(/^["'\[]|["'\]]$/g, '');
        if (rawValue.includes('[')) {
          // Обрабатываем массивы значений
          relation[key] = value
            .split(',')
            .map((item) => item.trim().replace(/^["']|["']$/g, ''));
        } else {
          // Для единичных значений также используем массив для единообразия
          relation[key] = [value];
        }
      }
    });
  }

  return relation;
}

const schemaPath = path.join(__dirname, './prisma/schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, { encoding: 'utf-8' });

schemaContent = schemaContent
  .replace(/\/\/.*$/gm, '')
  .replace(/\/\*[\s\S]*?\*\//gm, '');

const modelRegex = /model (\w+) {([^}]+)}/g;
let match;
const models = {};

while ((match = modelRegex.exec(schemaContent)) !== null) {
  const modelName = match[1];
  const modelBody = match[2].trim();
  const fields = {};

  const fieldRegex = /(\w+)\s+([\w?]+)(\[\])?(\s+@\w+)?(\([^)]+\))?/g;
  let fieldMatch;

  while ((fieldMatch = fieldRegex.exec(modelBody)) !== null) {
    const fieldName = fieldMatch[1];
    let fieldType = fieldMatch[2].replace('?', ''); // Удаляем знак вопроса для типа
    const isList = !!fieldMatch[3]; // Проверка на список
    const isOptional = fieldMatch[2].endsWith('?'); // Проверка на необязательность
    const isId =
      (fieldMatch[4] ? fieldMatch[4] : '').includes('@id') ||
      (fieldMatch[5] ? fieldMatch[5] : '').includes('@id'); // Проверка на ID

    // Определение, является ли поле связью
    const isRelation = fieldMatch[4] && fieldMatch[4].includes('@relation');
    let relation = null;

    if (isRelation) {
      const relationMatch = /@relation\(([^)]+)\)/.exec(fieldMatch[0]);
      if (relationMatch) {
        relation = parseRelationAnnotation(fieldMatch[0]);
      }
    }

    fields[fieldName] = {
      type: fieldType,
      isList,
      isOptional,
      isId,
      ...(isRelation && {
        relation,
      }),
    };
  }

  models[modelName] = { fields };
}

console.log(JSON.stringify(models, null, 2));
