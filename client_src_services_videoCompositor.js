// client/src/services/videoCompositor.js
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { generateAudioWithPhonemes } from './tts.js';
import { selectGestures } from './gestureSelector.js';

const ffmpeg = createFFmpeg({ 
  log: true,
  corePath: new URL('/node_modules/@ffmpeg/core/dist/ffmpeg-core.js', import.meta.url).href
});

/**
 * テキストを処理し、リップシンク動画を生成するメイン関数
 * @param {string} text - 入力テキスト
 * @param {function} onProgress - 進捗を報告するコールバック関数
 * @returns {Promise<Blob>} 完成した動画のBlob
 */
export async function processTextAndGenerateVideo(text, onProgress) {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }
  onProgress(5); // FFmpeg loaded

  // 1. 音声と音素タイムラインを生成
  const { audioBlob, phonemeTimeline } = await generateAudioWithPhonemes(text);
  const audioDurationMs = phonemeTimeline[phonemeTimeline.length - 1].end_ms;
  onProgress(15); // Audio and phonemes generated

  // 2. ジェスチャーを選択
  const selectedGestures = selectGestures(text);

  // 3. 動画マニフェストを取得
  const manifest = await fetch('/video-manifest.json').then(res => res.json());
  onProgress(20); // Manifest fetched

  // 4. 必要な動画素材をFFmpegの仮想ファイルシステムに書き込む
  await ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(audioBlob));

  const mouthVideoPaths = new Set();
  phonemeTimeline.forEach(p => mouthVideoPaths.add(p.phoneme));
  
  const gestureVideoPaths = new Set();
  selectedGestures.forEach(g => gestureVideoPaths.add(g.name));

  // 素材のダウンロードと書き込み（並列処理）
  const downloadPromises = [];
  mouthVideoPaths.forEach(phoneme => {
    const videoInfo = manifest.mouth[phoneme];
    if (videoInfo) {
      downloadPromises.push(fetchFile(videoInfo.url).then(data => ffmpeg.FS('writeFile', `${phoneme}.mp4`, data)));
    }
  });
  gestureVideoPaths.forEach(gestureName => {
    const videoInfo = manifest.gesture[gestureName];
    if (videoInfo) {
      downloadPromises.push(fetchFile(videoInfo.url).then(data => ffmpeg.FS('writeFile', `${gestureName}.mp4`, data)));
    }
  });

  await Promise.all(downloadPromises);
  onProgress(40); // All assets loaded into FFmpeg FS

  // 5. FFmpegコマンドを構築して実行
  const complexFilter = [];
  let lastOutput = '[0:v]'; // Start with the base gesture video

  // 口形動画を連結
  const mouthConcatFilter = phonemeTimeline.map((p, i) => `[${i + 1}:v]`).join('') + `concat=n=${phonemeTimeline.length}[mouth_track]`;
  complexFilter.push(mouthConcatFilter);

  // ジェスチャー動画と口形動画をオーバーレイ
  complexFilter.push(`${lastOutput}[mouth_track]overlay=x=(W-w)/2:y=(H-h)/2[final_v]`);

  const ffmpegArgs = [
    // Base gesture video
    '-i', selectedGestures[0].name + '.mp4',
    // Mouth videos
    ...phonemeTimeline.map(p => ['-i', p.phoneme + '.mp4']).flat(),
    // Audio
    '-i', 'audio.mp3',
    // Filters
    '-filter_complex', complexFilter.join(';'),
    // Map final video and audio
    '-map', '[final_v]',
    '-map', `${phonemeTimeline.length + 1}:a`,
    // Codec and other options
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-shortest',
    'output.mp4'
  ];

  ffmpeg.setProgress(({ ratio }) => {
    onProgress(40 + ratio * 55); // Progress from 40% to 95%
  });

  await ffmpeg.run(...ffmpegArgs);
  onProgress(98); // FFmpeg run complete

  // 6. 結果を読み出してBlobとして返す
  const data = ffmpeg.FS('readFile', 'output.mp4');
  onProgress(100); // Done

  return new Blob([data.buffer], { type: 'video/mp4' });
}
