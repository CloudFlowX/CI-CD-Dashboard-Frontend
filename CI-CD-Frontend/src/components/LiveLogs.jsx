import React, { useState, useRef, useEffect } from 'react';
import { Download, Maximize2, Minimize2, Radio, Copy, Check, Search, Terminal } from 'lucide-react';
import ApiClient from '../utils/api';
import './LiveLogs.css';

const STAGE_OPTIONS = [
  { label: 'All Stages', value: 'all' },
  { label: 'Build Stage', value: 'Build' },
  { label: 'Test Stage', value: 'Test' },
  { label: 'Security Scan', value: 'Security Scan' },
  { label: 'Deploy Stage', value: 'Deploy' }
];

const LiveLogs = ({ title = 'Live Logs', breadcrumb = 'Dashboard > System Overview' }) => {
  const [logs, setLogs] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [selectedStage, setSelectedStage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const logContainerRef = useRef(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await ApiClient.get('/pipelines');
        if (res.success && res.pipelines) {
          let newLogs = [];
          res.pipelines.forEach((p, idx) => {
            newLogs.push({
              id: p._id + '-start',
              time: new Date(p.createdAt).toLocaleTimeString(),
              level: 'INFO',
              message: `Starting pipeline for ${p.name}`,
              stage: 'Build'
            });
            if (p.status === 'success') {
              newLogs.push({
                id: p._id + '-end',
                time: new Date(p.updatedAt).toLocaleTimeString(),
                level: 'INFO',
                message: `✅ Pipeline completed for ${p.name}`,
                stage: 'Deploy',
                isSuccess: true
              });
            } else if (p.status === 'failed') {
              newLogs.push({
                id: p._id + '-err',
                time: new Date(p.updatedAt).toLocaleTimeString(),
                level: 'ERROR',
                message: `❌ Pipeline failed for ${p.name}`,
                stage: 'Build'
              });
            }
          });
          setLogs(newLogs);
        }
      } catch (err) {
        console.error('Error fetching dashboard logs:', err);
      }
    };
    
    fetchLogs();
    let interval;
    if (isLive) {
      interval = setInterval(fetchLogs, 15000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Auto scroll to bottom when live or log updates
  useEffect(() => {
    if (isLive && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [isLive, selectedStage, searchTerm, logs]);

  // Filter logs based on stage and search term
  const filteredLogs = logs.filter((log) => {
    const matchesStage = selectedStage === 'all' || log.stage === selectedStage;
    const matchesSearch =
      searchTerm.trim() === '' ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.time.includes(searchTerm) ||
      log.level.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const handleDownload = () => {
    const logText = logs.map(
      (log) => `${log.time} [${log.level}] ${log.message}`
    ).join('\n');

    const blob = new Blob([logText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pipeline-45-live-logs.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const logText = filteredLogs
      .map((log) => `${log.time} [${log.level}] ${log.message}`)
      .join('\n');

    navigator.clipboard.writeText(logText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Helper to determine if line has success indicators (checkmarks or party emoji or specific text)
  const isSuccessLine = (log) => {
    if (log.isSuccess) return true;
    return (
      log.message.includes('✅') ||
      log.message.includes('🎉') ||
      log.message.toLowerCase().includes('successfully') ||
      log.message.toLowerCase().includes('passed') ||
      log.message.toLowerCase().includes('no vulnerabilities')
    );
  };

  return (
    <div className={`livelogs-card ${isFullscreen ? 'livelogs-fullscreen' : ''}`}>
      {/* Header Section */}
      <div className="livelogs-header">
        <div className="livelogs-title-container">
          <div className="livelogs-title-wrapper">
            <Terminal size={18} className="livelogs-terminal-icon" />
            <h3 className="livelogs-title">{title}</h3>
          </div>
          <span className="livelogs-breadcrumb">{breadcrumb}</span>
        </div>

        <div className="livelogs-controls">
          {/* Search Box */}
          <div className="livelogs-search-wrapper">
            <Search size={14} className="livelogs-search-icon" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="livelogs-search-input"
            />
          </div>

          {/* Live Toggle Button */}
          <button
            className={`livelogs-live-toggle ${isLive ? 'active' : ''}`}
            onClick={() => setIsLive(!isLive)}
            type="button"
            title={isLive ? 'Pause Live Logs' : 'Resume Live Logs'}
          >
            <Radio size={14} className={isLive ? 'livelogs-radio-pulse' : ''} />
            <span className="livelogs-live-dot"></span>
            <span className="livelogs-live-text">{isLive ? 'Live' : 'Paused'}</span>
          </button>

          {/* All Stages Dropdown */}
          <div className="livelogs-select-wrapper">
            <select
              className="livelogs-stage-select"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
            >
              {STAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Copy Button */}
          <button
            className="livelogs-icon-btn"
            onClick={handleCopy}
            title="Copy Logs"
            type="button"
          >
            {isCopied ? <Check size={16} className="livelogs-copied-icon" /> : <Copy size={16} />}
          </button>

          {/* Download Button */}
          <button
            className="livelogs-icon-btn"
            onClick={handleDownload}
            title="Download Logs (.txt)"
            type="button"
          >
            <Download size={16} />
          </button>

          {/* Expand/Fullscreen Button */}
          <button
            className="livelogs-icon-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand / Fullscreen'}
            type="button"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Terminal View Container */}
      <div className="livelogs-terminal">
        {/* Terminal Header Bar */}
        <div className="livelogs-terminal-bar">
          <div className="livelogs-window-dots">
            <span className="dot dot-close"></span>
            <span className="dot dot-minimize"></span>
            <span className="dot dot-expand"></span>
          </div>
          <div className="livelogs-terminal-info">
            <span>bash - 80x24</span>
            {isLive && (
              <span className="livelogs-status-indicator">
                <span className="pulse-dot"></span> Streaming
              </span>
            )}
          </div>
        </div>

        {/* Terminal Output */}
        <div className="livelogs-content" ref={logContainerRef}>
          {filteredLogs.length === 0 ? (
            <div className="livelogs-empty">
              No log entries match your filter or search query.
            </div>
          ) : (
            filteredLogs.map((log, index) => {
              const isSuccess = isSuccessLine(log);
              return (
                <div key={`${log.id}-${index}`} className="livelogs-line">
                  <span className="livelogs-line-num">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="livelogs-timestamp">{log.time}</span>
                  <span className="livelogs-level">[{log.level}]</span>
                  <span
                    className={`livelogs-message ${
                      isSuccess ? 'livelogs-message-success' : ''
                    }`}
                  >
                    {log.message}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveLogs;
