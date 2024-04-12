import fs from 'fs';
import path from 'path';
import { AccessControlAction } from '../src/lib/enums/access-control-action.enum';
import { Role } from '../src/lib/enums/roles.enum';
import { pascalToCamelCase } from '@/src/utils/parser/pascal-to-camel.parser';

function parseRelationAnnotation(annotation) {
  const relation = {
    name: null,
    fields: [],
    references: [],
  };

  const relationNameMatch = annotation.match(/@relation\("([^"]+)"\)/);
  if (relationNameMatch) {
    relation.name = relationNameMatch[1];
  }

  const paramsMatch = annotation.match(/@relation\(([^)]+)\)/);
  if (paramsMatch) {
    const paramsString = paramsMatch[1];
    const paramsParts = paramsString
      .split(/,\s*(?![^\[]*\])/)
      .map((part) => part.trim());

    paramsParts.forEach((part) => {
      const [key, rawValue] = part.split(':').map((p) => p.trim());
      if (key && rawValue) {
        const value = rawValue.replace(/^["'\[]|["'\]]$/g, '');
        if (rawValue.includes('[')) {
          relation[key] = value
            .split(',')
            .map((item) => item.trim().replace(/^["']|["']$/g, ''));
        } else {
          relation[key] = [value];
        }
      }
    });
  }

  return relation;
}

export function parsePrisma() {
  const schemaPath = path.join(__dirname, './schema.prisma');
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
      const fieldType = fieldMatch[2].replace('?', '');
      const isList = !!fieldMatch[3];
      const isOptional = fieldMatch[2].endsWith('?');
      const isId =
        (fieldMatch[4] ? fieldMatch[4] : '').includes('@id') ||
        (fieldMatch[5] ? fieldMatch[5] : '').includes('@id');

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
  return models;
}

const ignoreTables = ['Policy', 'TableInfo'];

export function parseToTableInfo(models): {
  tableName: string;
  columnName: string;
  columnType: string;
  isList: boolean;
  isOptional: boolean;
  isId: boolean;
}[] {
  const arr: {
    tableName: string;
    columnName: string;
    columnType: string;
    isList: boolean;
    isOptional: boolean;
    isId: boolean;
  }[] = [];
  for (const tableName in models) {
    for (const fieldName in models[tableName].fields) {
      const { type, isList, isOptional, isId } =
        models[tableName].fields[fieldName];
      if (ignoreTables.includes(tableName)) continue;
      arr.push({
        tableName: pascalToCamelCase(tableName),
        columnName: fieldName,
        columnType: type,
        isList,
        isOptional,
        isId,
      });
    }
  }
  return arr;
}

export function parseToPolicyInfo(
  tableInfos: {
    tableName: string;
    columnName: string;
    columnType: string;
    isList: boolean;
    isOptional: boolean;
    isId: boolean;
  }[],
): {
  role: string;
  tableName: string;
  columnName: string;
  action: string;
}[] {
  const result: {
    role: string;
    tableName: string;
    columnName: string;
    action: string;
  }[] = [];
  for (const tableInfo of tableInfos) {
    for (const actionKey of Object.keys(AccessControlAction)) {
      const actionValue =
        AccessControlAction[actionKey as keyof typeof AccessControlAction];
      for (const roleKey of Object.keys(Role)) {
        const roleValue = Role[roleKey as keyof typeof Role];
        result.push({
          role: roleValue,
          tableName: tableInfo.tableName,
          columnName: tableInfo.columnName,
          action: actionValue,
        });
      }
    }
  }

  return result;
}
