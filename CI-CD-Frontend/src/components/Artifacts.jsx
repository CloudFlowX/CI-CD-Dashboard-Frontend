import React, { useState } from 'react';
import { Package, FileText, Download, Check, HardDrive } from 'lucide-react';
import './Artifacts.css';

const defaultArtifacts = [
  {
    id: '1',
    name: 'image.tar.gz',
    size: '126.5 MB',
    icon: Package,
  },
  {
    id: '2',
    name: 'app-manifest.yaml',
    size: '2.4 KB',
    icon: FileText,
  }
];

const Artifacts = () => {
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadedId, setDownloadedId] = useState(null);

  const handleDownload = (artifact) => {
    setDownloadingId(artifact.id);
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadedId(artifact.id);
      setTimeout(() => setDownloadedId(null), 2500);
    }, 600);
  };

  return (
    <div className="artifacts-card">
      <div className="artifacts-header">
        <div className="artifacts-title-wrapper">
          <HardDrive className="artifacts-title-icon" size={18} />
          <h3 className="artifacts-title">Artifacts</h3>
        </div>
        <span className="artifacts-count-badge">2 Files</span>
      </div>

      <div className="artifacts-list">
        {defaultArtifacts.map((artifact) => {
          const Icon = artifact.icon;
          const isDownloading = downloadingId === artifact.id;
          const isDownloaded = downloadedId === artifact.id;

          return (
            <div key={artifact.id} className="artifact-item">
              <div className="artifact-icon-container">
                <Icon className="artifact-icon" size={18} />
              </div>

              <div className="artifact-info">
                <div className="artifact-name">{artifact.name}</div>
                <div className="artifact-size">{artifact.size}</div>
              </div>

              <button
                className={`artifact-download-btn ${isDownloaded ? 'downloaded' : ''}`}
                onClick={() => handleDownload(artifact)}
                disabled={isDownloading}
                title={`Download ${artifact.name}`}
                aria-label={`Download ${artifact.name}`}
              >
                {isDownloaded ? (
                  <Check size={16} className="download-icon-check" />
                ) : isDownloading ? (
                  <span className="download-spinner" />
                ) : (
                  <Download size={16} className="download-icon" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Artifacts;
