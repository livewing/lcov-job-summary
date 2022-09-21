import { promisify } from 'util';
import parse, { type LcovFile, type LcovLine } from 'lcov-parse';
import { blobBase } from './constants';
import type { LcovPart } from 'lcov-parse';

const parseAsync = promisify(parse);

const partTotal = (parts: LcovPart<unknown>[]) =>
  parts.reduce(
    (acc, cur) => ({ hit: acc.hit + cur.hit, found: acc.found + cur.found }),
    { hit: 0, found: 0 }
  );
const stat = ({ hit, found }: { hit: number; found: number }) =>
  found === 0
    ? `:white_check_mark: ${hit} / ${found}`
    : `${
        hit === found
          ? ':white_check_mark:'
          : hit / found >= 0.5
          ? ':large_orange_diamond:'
          : ':red_circle:'
      } ${hit} / ${found} (${((hit / found) * 100).toFixed(2)} %)`;
const uncovered = (lines: LcovLine[], file: string) =>
  lines
    .flatMap(({ line, hit }) => (hit === 0 ? [line] : []))
    .reduce(
      (acc, cur) =>
        acc.length === 0 || acc[acc.length - 1]!.max !== cur - 1
          ? [...acc, { min: cur, max: cur }]
          : [...acc.slice(0, -1), { ...acc[acc.length - 1]!, max: cur }],
      [] as { min: number; max: number }[]
    )
    .map(({ min, max }) =>
      min === max
        ? `[${min}](${blobBase}${file}#L${min})`
        : `[${min}-${max}](${blobBase}${file}#L${min}-L${max})`
    )
    .join(', ');

const tableHeader = `|File|Branches|Functions|Lines|Uncovered Line Numbers|
|--|--|--|--|--|
`;
const lcovAllRow = (files: LcovFile[]) =>
  [
    '',
    'All files',
    stat(partTotal(files.map(({ branches }) => branches))),
    stat(partTotal(files.map(({ functions }) => functions))),
    stat(partTotal(files.map(({ lines }) => lines))),
    '',
    ''
  ].join('|');
const lcovFileToRow = ({ file, branches, functions, lines }: LcovFile) =>
  [
    '',
    `[${file}](${blobBase}${file})`,
    stat(branches),
    stat(functions),
    stat(lines),
    uncovered(lines.details, file),
    ''
  ].join('|');

export const lcovToMarkdown = async (lcov: string) => {
  const files = (await parseAsync(lcov)) ?? [];
  return `# Coverage

${`${tableHeader}${lcovAllRow(files)}\n${files
  .map(lcovFileToRow)
  .join('\n')}`}\n`;
};
