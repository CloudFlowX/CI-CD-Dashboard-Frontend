import React, { useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import ApiClient from '../utils/api';
import './GitHubActionsPage.css';
import { 
  GitBranch, 
  Play, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Clock, 
  X,
  Terminal
} from 'lucide-react';

export default function GitHubActionsPage() {
  const { currentRole } = useRole();
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);
  const [newRun, setNewRun] = useState({ repo: '', workflow_id: '', ref: 'main' });

  useEffect(() => {
    fetchRuns();
  }, []);

  const fetchRuns = async () => {
    try {
      const res = await ApiClient.get('/github/runs');
      if (res.success && res.runs) {
        setRuns(res.runs);
      }
    } catch (err) {
      console.error('Failed to fetch GitHub runs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerRun = async (e) => {
    e.preventDefault();
    try {
      const res = await ApiClient.post('/github/trigger', newRun);
      if (res.success) {
        setIsTriggerModalOpen(false);
        setNewRun({ repo: '', workflow_id: '', ref: 'main' });
        fetchRuns();
      }
    } catch (err) {
      console.error('Failed to trigger run:', err);
    }
  };

  const renderStatusIcon = (status, conclusion) => {
    if (status === 'in_progress') return <RefreshCw className="gh-status-icon in-progress spin-icon" />;
    if (conclusion === 'success') return <CheckCircle2 className="gh-status-icon success" />;
    if (conclusion === 'failure') return <XCircle className="gh-status-icon failure" />;
    return <Clock className="gh-status-icon" />;
  };

  return (
    <div className="github-actions-page animate-fade-in">
      <div className="github-actions-header">
        <div className="gh-header-info">
          <h1 className="gh-title">
            <GitBranch size={28} /> GitHub Actions
          </h1>
          <p className="gh-subtitle">View and trigger external GitHub workflow runs</p>
        </div>
        <div className="gh-header-actions">
          {currentRole !== 'Viewer' && (
            <button className="btn btn-primary" onClick={() => setIsTriggerModalOpen(true)}>
              <Play size={16} /> Trigger Workflow
            </button>
          )}
        </div>
      </div>

      <div className="gh-runs-grid">
        {loading ? (
          <div className="gh-empty-state">
            <RefreshCw size={36} className="spin-icon" />
            <h3>Loading runs...</h3>
          </div>
        ) : runs.length === 0 ? (
          <div className="gh-empty-state">
            <Terminal size={36} />
            <h3>No GitHub Actions runs found</h3>
          </div>
        ) : (
          runs.map(run => (
            <div key={run.id} className="gh-run-card">
              <div className="gh-run-left">
                {renderStatusIcon(run.status, run.conclusion)}
                <div className="gh-run-info">
                  <span className="gh-run-title">{run.name}</span>
                  <div className="gh-run-meta">
                    <span className="gh-meta-item">
                      <GitBranch size={14} /> <code>{run.head_branch}</code>
                    </span>
                    <span className="gh-meta-item">
                      Repo: <strong>{run.repository.full_name}</strong>
                    </span>
                    <span className="gh-meta-item">
                      Event: {run.event}
                    </span>
                  </div>
                </div>
              </div>
              <div className="gh-run-right">
                <div className="gh-run-times">
                  <span>Triggered by <strong>{run.actor.login}</strong></span>
                  <span>{new Date(run.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isTriggerModalOpen && (
        <div className="gh-modal-backdrop" onClick={() => setIsTriggerModalOpen(false)}>
          <div className="gh-modal-container" onClick={e => e.stopPropagation()}>
            <div className="gh-modal-header">
              <h3><Play size={20} /> Trigger Workflow</h3>
              <button className="gh-modal-close-btn" onClick={() => setIsTriggerModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleTriggerRun}>
              <div className="gh-modal-body">
                <div className="gh-form-group">
                  <label>Repository (owner/repo)</label>
                  <input 
                    type="text" 
                    className="gh-form-input" 
                    placeholder="e.g. kunal24/cloud-orchestrator" 
                    required 
                    value={newRun.repo}
                    onChange={e => setNewRun({...newRun, repo: e.target.value})}
                  />
                </div>
                <div className="gh-form-group">
                  <label>Workflow ID or Filename</label>
                  <input 
                    type="text" 
                    className="gh-form-input" 
                    placeholder="e.g. build.yml or 123456" 
                    required 
                    value={newRun.workflow_id}
                    onChange={e => setNewRun({...newRun, workflow_id: e.target.value})}
                  />
                </div>
                <div className="gh-form-group">
                  <label>Branch / Ref</label>
                  <input 
                    type="text" 
                    className="gh-form-input" 
                    placeholder="e.g. main" 
                    required 
                    value={newRun.ref}
                    onChange={e => setNewRun({...newRun, ref: e.target.value})}
                  />
                </div>
              </div>
              <div className="gh-modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsTriggerModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Trigger Run</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
