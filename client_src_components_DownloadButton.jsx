// client/src/components/DownloadButton.jsx
import React from 'react';

const DownloadButton = ({ videoUrl, fileName }) => {
  return (
    <div className="mb-6 p-4 bg-white shadow-md rounded-lg text-center">
      <a
        href={videoUrl}
        download={fileName}
        className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150 ease-in-out"
      >
        完成動画をダウンロード
      </a>
    </div>
  );
};

export default DownloadButton;
