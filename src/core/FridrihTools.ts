import { Alg, Solution } from '@/core/types/app';

export function replaceInArray(arr: string[], to = "'"): string[] {
  const copy = arr.slice(0);
  for (let i = copy.length - 1; i >= 0; i--) {
    if (copy[i] === '') {
      copy.splice(i, 1);
      continue;
    }
    copy[i] = replaceInString(copy[i]);
  }
  return copy;
}

export function replaceInString(s: string, to = "'"): string {
  return s.replace(new RegExp('prime', 'g'), "'");
}

export function getFullAlgorithm(obj: Solution): Alg {
  let s =
    obj.cross.join(' ') +
    ' ' +
    obj.f2l.join(' ') +
    ' ' +
    obj.oll +
    ' ' +
    obj.pll;

  s = s.replace(new RegExp('prime', 'g'), "'");

  return new Alg(s);
}
