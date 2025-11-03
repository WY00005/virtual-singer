// client/src/services/phoneme.js
import { KANA_TO_ROMAJI } from '../../shared/phonemeMapping.js';

/**
 * ひらがな・カタカナをローマ字（音素）の配列に変換する
 * @param {string} text - ひらがな・カタカナを含むテキスト
 * @returns {Array<string>} ローマ字（音素）の配列
 */
export function kanaToRomaji(text) {
  let romaji = [];
  let i = 0;
  
  while (i < text.length) {
    // 2文字の組み合わせを優先チェック（きゃ、しゃ等）
    let twoChar = text.slice(i, i + 2);
    if (KANA_TO_ROMAJI[twoChar]) {
      romaji.push(KANA_TO_ROMAJI[twoChar]);
      i += 2;
      continue;
    }
    
    // 1文字チェック
    let oneChar = text[i];
    if (KANA_TO_ROMAJI[oneChar]) {
      romaji.push(KANA_TO_ROMAJI[oneChar]);
    } else {
      romaji.push('silence'); // 未知の文字は無音扱い
    }
    i++;
  }
  
  return romaji;
}

/**
 * テキストと音声の長さから音素タイムラインを生成する（簡易版）
 * 
 * 実際には、Google TTS APIなどから正確な音素タイムラインを取得する必要がある。
 * この関数は、音声合成APIが音素タイムラインを返さない場合のフォールバックとして使用する。
 * 
 * @param {string} text - 入力テキスト
 * @param {number} totalDurationMs - 音声の全体の長さ (ms)
 * @returns {Array<Object>} 音素タイムライン
 */
export function createPhonemeTimeline(text, totalDurationMs) {
  const romaji = kanaToRomaji(text);
  const phonemeDuration = 200; // 各音素200msと仮定
  
  const timeline = [];
  let totalAssumedDuration = 0;
  
  for (const phoneme of romaji) {
    const duration = (phoneme === 'silence') ? 100 : phonemeDuration;
    totalAssumedDuration += duration;
  }

  // 実際の音声の長さに合わせて音素の長さをスケーリング
  const scaleFactor = totalDurationMs / totalAssumedDuration;
  
  let currentTime = 0;
  for (const phoneme of romaji) {
    const assumedDuration = (phoneme === 'silence') ? 100 : phonemeDuration;
    const actualDuration = assumedDuration * scaleFactor;

    timeline.push({
      phoneme: phoneme,
      start_ms: currentTime,
      end_ms: currentTime + actualDuration,
      duration_ms: actualDuration
    });
    currentTime += actualDuration;
  }
  
  return timeline;
}
