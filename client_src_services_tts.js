// client/src/services/tts.js
/**
 * 音声合成サービス
 * 
 * サーバーサイドAPI (Google TTS) または Web Speech API (ブラウザ) を使用する。
 */

const API_URL = '/api/tts';

/**
 * テキストから音声を生成し、Blobとして返す
 * @param {string} text - 音声合成するテキスト
 * @returns {Promise<Blob>} 音声データ (MP3など)
 */
export async function generateAudio(text) {
  // 簡易的にブラウザのWeb Speech APIを使用する（音素情報がないため、後でサーバーサイドTTSに置き換える）
  console.warn("Web Speech APIを使用しています。音素情報が必要なため、Google TTS APIへの切り替えを推奨します。");
  
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // 日本語の声を適当に選択
    const voices = speechSynthesis.getVoices();
    const japaneseVoice = voices.find(voice => voice.lang === 'ja-JP');
    if (japaneseVoice) {
      utterance.voice = japaneseVoice;
    }

    utterance.onend = () => {
      // Web Speech APIは直接Blobを返さないため、ここではダミーのBlobを返す
      // 実際のプロジェクトでは、サーバーサイドTTS APIを呼び出し、そのレスポンスをBlobとして扱う
      console.log("音声合成完了 (ダミー)");
      const dummyBlob = new Blob(["dummy audio data"], { type: "audio/mp3" });
      resolve(dummyBlob);
    };

    utterance.onerror = (event) => {
      reject(new Error(`Speech synthesis error: ${event.error}`));
    };

    speechSynthesis.speak(utterance);
  });
}

/**
 * サーバーサイドのGoogle TTS APIを呼び出す場合の関数（未実装）
 * @param {string} text - 音声合成するテキスト
 * @returns {Promise<{audioBlob: Blob, phonemeTimeline: Array<Object>}>} 音声データと音素タイムライン
 */
export async function generateAudioWithPhonemes(text) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`TTS API request failed: ${response.statusText}`);
  }

  // サーバーから音声データと音素タイムラインが返されることを想定
  // 実際には、音声データはBlob、音素タイムラインはJSONとして処理する
  const data = await response.json();
  
  // ダミーデータ
  const dummyAudioBlob = new Blob(["actual audio data"], { type: "audio/mp3" });
  const dummyPhonemeTimeline = [
    { phoneme: "ko", start_ms: 0, end_ms: 200, duration_ms: 200 },
    { phoneme: "n", start_ms: 200, end_ms: 400, duration_ms: 200 },
    { phoneme: "ni", start_ms: 400, end_ms: 600, duration_ms: 200 },
    { phoneme: "chi", start_ms: 600, end_ms: 800, duration_ms: 200 },
    { phoneme: "wa", start_ms: 800, end_ms: 1000, duration_ms: 200 },
    { phoneme: "silence", start_ms: 1000, end_ms: 1500, duration_ms: 500 },
  ];

  return {
    audioBlob: dummyAudioBlob,
    phonemeTimeline: dummyPhonemeTimeline,
  };
}
