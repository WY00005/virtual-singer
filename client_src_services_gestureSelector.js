// client/src/services/gestureSelector.js
/**
 * テキストの内容に基づいてジェスチャー動画を選択するロジック
 */

/**
 * テキストを解析し、適切なジェスチャー動画のリストを返す
 * @param {string} text - 入力テキスト
 * @returns {Array<Object>} 選択されたジェスチャー動画のリスト
 */
export function selectGestures(text) {
  const gestures = [];
  let currentTime = 0;

  // 簡易的なテキスト解析
  const hasQuestion = text.includes('？') || text.includes('?');
  const hasEmphasis = text.includes('！') || text.includes('!');
  const isGreeting = text.startsWith('こんにち') || text.startsWith('おはよ');

  // 挨拶
  if (isGreeting) {
    gestures.push({
      name: 'greeting_01',
      category: 'greeting',
      duration_ms: 2000, // 仮の長さ
      start_ms: currentTime,
    });
    currentTime += 2000;
  }

  // 疑問
  if (hasQuestion) {
    gestures.push({
      name: 'question_01',
      category: 'question',
      duration_ms: 2000, // 仮の長さ
      start_ms: currentTime,
    });
    currentTime += 2000;
  }
  
  // 強調
  if (hasEmphasis) {
    gestures.push({
      name: 'emphasis_01',
      category: 'emphasis',
      duration_ms: 2000, // 仮の長さ
      start_ms: currentTime,
    });
    currentTime += 2000;
  }

  // デフォルトの待機ジェスチャー
  if (gestures.length === 0) {
    gestures.push({
      name: 'idle_01',
      category: 'idle',
      duration_ms: 3000, // 仮の長さ
      start_ms: currentTime,
    });
    currentTime += 3000;
  }

  // 実際の動画の長さに合わせて調整が必要
  // ここでは、動画の合成に必要な情報（名前、カテゴリ、開始時間）のみを返す
  return gestures;
}
