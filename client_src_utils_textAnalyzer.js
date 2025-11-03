// client/src/utils/textAnalyzer.js
/**
 * テキストを解析し、感情や強調箇所を検出するロジック
 */

/**
 * テキストを解析し、感情や強調箇所を含むオブジェクトを返す
 * @param {string} text - 入力テキスト
 * @returns {Object} 解析結果
 */
export function analyzeText(text) {
  const analysis = {
    hasQuestion: text.includes('？') || text.includes('?'),
    hasEmphasis: text.includes('！') || text.includes('!'),
    isPositive: text.includes('嬉しい') || text.includes('楽しい') || text.includes('最高'),
    isNegative: text.includes('悲しい') || text.includes('辛い') || text.includes('最悪'),
    isGreeting: text.startsWith('こんにち') || text.startsWith('おはよ') || text.startsWith('さよなら'),
  };

  // 感情の優先度
  if (analysis.isPositive) {
    analysis.emotion = 'happy';
  } else if (analysis.isNegative) {
    analysis.emotion = 'sad';
  } else {
    analysis.emotion = 'neutral';
  }

  return analysis;
}
