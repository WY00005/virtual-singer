// client/src/utils/kanaToRomaji.js
import { KANA_TO_ROMAJI } from "../../shared/phonemeMapping.js";

export function kanaToRomaji(text) {
  let romaji = [];
  let i = 0;

  while (i < text.length) {
    let twoChar = text.slice(i, i + 2);
    if (KANA_TO_ROMAJI[twoChar]) {
      romaji.push(KANA_TO_ROMAJI[twoChar]);
      i += 2;
      continue;
    }

    let oneChar = text[i];
    if (KANA_TO_ROMAJI[oneChar]) {
      romaji.push(KANA_TO_ROMAJI[oneChar]);
    } else {
      romaji.push("silence");
    }
    i++;
  }

  return romaji;
}
