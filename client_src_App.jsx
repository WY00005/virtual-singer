// client/src/App.jsx
import React, { useState } from 'react';
import TextInput from './components/TextInput.jsx';
import VideoPreview from './components/VideoPreview.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import DownloadButton from './components/DownloadButton.jsx';
import { processTextAndGenerateVideo } from './services/videoCompositor.js';

function App() {
  const [text, setText] = useState('');
  const [videoUrl, setVideoUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = async () => {
    if (!text) return;

    setIsProcessing(true);
    setProgress(0);
    setVideoUrl(null);

    try {
      const finalVideoBlob = await processTextAndGenerateVideo(text, (p) => {
        setProgress(p);
      });
      const url = URL.createObjectURL(finalVideoBlob);
      setVideoUrl(url);
    } catch (error) {
      console.error('Video generation failed:', error);
      alert('動画生成中にエラーが発生しました。コンソールを確認してください。');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">バーチャルシンガー リップシンク動画生成</h1>
      
      <TextInput 
        text={text} 
        setText={setText} 
        onGenerate={handleGenerate}
        disabled={isProcessing}
      />

      {isProcessing && <ProgressBar progress={progress} />}

      <VideoPreview videoUrl={videoUrl} />

      {videoUrl && (
        <DownloadButton videoUrl={videoUrl} fileName="virtual_singer_output.mp4" />
      )}
    </div>
  );
}

export default App;
