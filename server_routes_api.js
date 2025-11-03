// server/routes/api.js
import express from 'express';
import { ttsService } from '../services/ttsService.js';
import { phonemeService } from '../services/phonemeService.js';

const router = express.Router();

// Google Text-to-Speech APIのプロキシエンドポイント
router.post('/tts', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    // 実際にはここでGoogle TTS APIを呼び出し、音声データと音素タイムラインを取得する
    // 現状はダミーのサービスを呼び出す
    const result = await ttsService.generateSpeech(text);
    
    // クライアントに音声データと音素タイムラインを返す
    res.json({
      audioData: result.audioData, // Base64エンコードされた音声データなど
      phonemeTimeline: result.phonemeTimeline,
    });

  } catch (error) {
    console.error('TTS API Error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

// 音素抽出APIエンドポイント（未使用の可能性あり、クライアント側で処理するため）
router.post('/phoneme', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const phonemes = phonemeService.extractPhonemes(text);
    res.json({ phonemes });
  } catch (error) {
    console.error('Phoneme Extraction Error:', error);
    res.status(500).json({ error: 'Failed to extract phonemes' });
  }
});

export default router;
