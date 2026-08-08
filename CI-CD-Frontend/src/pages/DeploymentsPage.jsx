import React, { useState, useMemo } from 'react';
import { useRole } from '../context/RoleContext';
import { 
  Rocket, 
  ExternalLink, 
  RotateCcw, 
  Maximize2, 
  RefreshCw, 
  Plus, 
  Filter, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  Server, 
  Layers, 
  X, 
  ShieldCheck, 
  Cpu,
  Activity,
  Check
} from 'lucide-react';
import ApiClient from '../utils/api';
import './DeploymentsPage.css';

export default function DeploymentsPage() {
  const { currentRole } = useRole();
  const [deployments, setDeployments] = useState([]);

  React.useEffect(() => {
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    try {
      const res = await ApiClient.get('/pipelines');
      if (res.success && res.pipelines) {
        // Map pipelines to deployments for visual representation
        const mapped = res.pipelines.map(p => ({
          id: p._id,
          appName: p.name,
          version: p.branch || 'main',
          environment: p.environment || 'Production',
          status: p.status === 'success' ? 'Running' : (p.status.charAt(0).toUpperCase() + p.status.slice(1)),
          replicasCurrent: p.status === 'success' ? 1 : 0,
          replicasTotal: 1,
          lastDeployed: new Date(p.updatedAt).toLocaleDateString(),
          deployedBy: p.createdBy?.fullName || 'system',
          avatar: null,
          url: `https://${p.name.toLowerCase().replace(/\s+/g, '-')}.internal`,
          displayUrl: `${p.name.toLowerCase().replace(/\s+/g, '-')}.internal`,
          health: p.status === 'success' ? '100%' : '0%',
          cpuUsage: '10%',
          memoryUsage: '256MB',
          pipelineId: p._id
        }));
        setDeployments(mapped);
      }
    } catch (error) {
      console.error('Error fetching deployments:', error);
      triggerToast('Failed to load deployments');
    }
  };
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState('');
  const [restartingId, setRestartingId] = useState(null);

  // Modal States
  const [showNewDeploymentModal, setShowNewDeploymentModal] = useState(false);
  const [newDeployData, setNewDeployData] = useState({
    appName: '',
    version: 'v1.0.0',
    environment: 'Production',
    replicasTotal: 2
  });

  const [scaleModalItem, setScaleModalItem] = useState(null);
  const [scaleCount, setScaleCount] = useState(1);

  const [rollbackModalItem, setRollbackModalItem] = useState(null);
  const [rollbackVersion, setRollbackVersion] = useState('');

  const [viewDetailsItem, setViewDetailsItem] = useState(null);

  // Show Toast Notification
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  // Filter deployments based on active tab and search query
  const filteredDeployments = deployments.filter((item) => {
    const matchesTab = activeTab === 'All' || item.environment.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = 
      item.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.displayUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deployedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesTab && matchesSearch && matchesStatus;
  });

  // Calculate Stat Counts
  const totalCount = deployments.length;
  const activeCount = deployments.filter(d => d.status === 'Running').length;
  const rollingCount = deployments.filter(d => d.status === 'Rolling Out').length;
  const failedCount = deployments.filter(d => d.status === 'Failed').length;

  // Actions
  const handleRestart = async (id, appName) => {
    setRestartingId(id);
    triggerToast(`Restarting pods for ${appName}...`);
    try {
      // Find the deployment to get pipelineId
      const dep = deployments.find(d => d.id === id);
      if (dep && dep.pipelineId) {
        // Assume triggering pipeline again acts as restart for now, or calling restart API
        await ApiClient.post(`/pipelines/${dep.pipelineId}/trigger`);
        triggerToast(`${appName} restart initiated!`);
        fetchDeployments();
      }
    } catch (err) {
      triggerToast(`Failed to restart ${appName}`);
    } finally {
      setRestartingId(null);
    }
  };

  const handleOpenScale = (item) => {
    setScaleModalItem(item);
    setScaleCount(item.replicasTotal);
  };

  const handleConfirmScale = async () => {
    if (!scaleModalItem) return;
    try {
      const res = await ApiClient.post(`/pipelines/${scaleModalItem.id}/scale`, { replicas: scaleCount });
      if (res.success) {
        setDeployments(prev => prev.map(d => {
          if (d.id === scaleModalItem.id) {
            return {
              ...d,
              replicasTotal: scaleCount,
              replicasCurrent: d.status === 'Failed' ? 0 : scaleCount
            };
          }
          return d;
        }));
        triggerToast(`Scaled ${scaleModalItem.appName} to ${scaleCount} replicas`);
      } else {
        triggerToast(`Failed to scale: ${res.message || 'Error'}`);
      }
    } catch (err) {
      triggerToast('Failed to scale deployment');
    }
    setScaleModalItem(null);
  };

  const handleOpenRollback = (item) => {
    setRollbackModalItem(item);
    // suggest previous minor version
    const parts = item.version.replace('v', '').split('.');
    const patch = Math.max(0, parseInt(parts[2] || 0) - 1);
    setRollbackVersion(`v${parts[0]}.${parts[1]}.${patch}`);
  };

  const handleConfirmRollback = async () => {
    if (!rollbackModalItem) return;
    try {
      const res = await ApiClient.post(`/pipelines/${rollbackModalItem.id}/rollback`, { version: rollbackVersion });
      if (res.success) {
        setDeployments(prev => prev.map(d => {
          if (d.id === rollbackModalItem.id) {
            return {
              ...d,
              version: rollbackVersion,
              status: 'Running',
              replicasCurrent: d.replicasTotal,
              lastDeployed: 'Just now',
              deployedBy: 'admin'
            };
          }
          return d;
        }));
        triggerToast(`Rolled back ${rollbackModalItem.appName} to ${rollbackVersion}`);
      } else {
        triggerToast(`Failed to rollback: ${res.message || 'Error'}`);
      }
    } catch (err) {
      triggerToast('Failed to rollback deployment');
    }
    setRollbackModalItem(null);
  };

  const handleCreateDeployment = (e) => {
    e.preventDefault();
    if (!newDeployData.appName) return;

    const newDep = {
      id: Date.now(),
      appName: newDeployData.appName,
      version: newDeployData.version || 'v1.0.0',
      environment: newDeployData.environment,
      status: 'Rolling Out',
      replicasCurrent: 1,
      replicasTotal: parseInt(newDeployData.replicasTotal) || 2,
      lastDeployed: 'Just now',
      deployedBy: 'kunal24',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      url: `https://${newDeployData.appName.toLowerCase().replace(/\s+/g, '-')}.${newDeployData.environment.toLowerCase() === 'production' ? 'ecommerce.com' : 'internal'}`,
      displayUrl: `${newDeployData.appName.toLowerCase().replace(/\s+/g, '-')}.${newDeployData.environment.toLowerCase() === 'production' ? 'ecommerce.com' : 'internal'}`,
      health: '50%',
      cpuUsage: '30%',
      memoryUsage: '350MB'
    };

    setDeployments([newDep, ...deployments]);
    setShowNewDeploymentModal(false);
    triggerToast(`Triggered deployment for ${newDep.appName} ${newDep.version}`);

    // Auto update status after 4s
    setTimeout(() => {
      setDeployments(prev => prev.map(d => {
        if (d.id === newDep.id) {
          return {
            ...d,
            status: 'Running',
            replicasCurrent: d.replicasTotal,
            health: '100%'
          };
        }
        return d;
      }));
    }, 4000);
  };

  const getEnvBadgeClass = (env) => {
    switch (env) {
      case 'Production':
        return 'badge-env-prod';
      case 'Staging':
        return 'badge-env-staging';
      case 'Development':
        return 'badge-env-dev';
      default:
        return 'badge-env-dev';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Running':
        return (
          <span className="status-indicator status-running">
            <span className="status-dot success"></span>
            Running
          </span>
        );
      case 'Rolling Out':
        return (
          <span className="status-indicator status-rolling">
            <span className="status-dot running"></span>
            Rolling Out
          </span>
        );
      case 'Failed':
        return (
          <span className="status-indicator status-failed">
            <span className="status-dot failed"></span>
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="deployments-container animate-fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-notification">
          <CheckCircle2 size={18} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="deployments-header">
        <div className="header-titles">
          <h1 className="header-title">Deployments</h1>
          <p className="header-subtitle">Track and manage your application deployments</p>
        </div>
        <div className="deployments-header-actions">
          {currentRole !== 'Viewer' && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowNewDeploymentModal(true)}
            >
              <Plus size={18} />
              <span>New Deployment</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Deployments</span>
            <div className="stat-icon-wrapper icon-blue">
              <Rocket size={20} />
            </div>
          </div>
          <div className="stat-value">{totalCount}</div>
          <div className="stat-subtext">Across all environments</div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-card-header">
            <span className="stat-label">Active</span>
            <div className="stat-icon-wrapper icon-green">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="stat-value text-green">{activeCount}</div>
          <div className="stat-subtext">Healthy and serving traffic</div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-card-header">
            <span className="stat-label">Rolling Out</span>
            <div className="stat-icon-wrapper icon-cyan">
              <RefreshCw size={20} className="spin-slow" />
            </div>
          </div>
          <div className="stat-value text-blue">{rollingCount}</div>
          <div className="stat-subtext">In progress updates</div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-card-header">
            <span className="stat-label">Failed</span>
            <div className="stat-icon-wrapper icon-red">
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="stat-value text-red">{failedCount}</div>
          <div className="stat-subtext">Requires immediate attention</div>
        </div>
      </div>

      {/* Filter and Environment Tabs Row */}
      <div className="controls-row">
        <div className="environment-tabs">
          {['Production', 'Staging', 'Development', 'All'].map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab === 'All' && <span className="tab-count">{deployments.length}</span>}
              {tab === 'Production' && <span className="tab-count">{deployments.filter(d => d.environment === 'Production').length}</span>}
              {tab === 'Staging' && <span className="tab-count">{deployments.filter(d => d.environment === 'Staging').length}</span>}
              {tab === 'Development' && <span className="tab-count">{deployments.filter(d => d.environment === 'Development').length}</span>}
            </button>
          ))}
        </div>

        <div className="filter-controls">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search deployments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="status-dropdown-wrapper">
            <Filter size={16} className="dropdown-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-dropdown"
            >
              <option value="All">All Statuses</option>
              <option value="Running">Running</option>
              <option value="Rolling Out">Rolling Out</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Deployment List */}
      <div className="deployments-list">
        {filteredDeployments.length === 0 ? (
          <div className="empty-state glass-card">
            <Server size={48} className="empty-icon" />
            <h3>No Deployments Found</h3>
            <p>Try adjusting your search query or environment tab filter.</p>
            <button 
              className="btn btn-secondary"
              onClick={() => { setActiveTab('All'); setSearchQuery(''); setStatusFilter('All'); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredDeployments.map((item) => {
            const isRestarting = restartingId === item.id;
            return (
              <div key={item.id} className="deployment-card glass-card">
                {/* App Main Info */}
                <div className="card-primary-info">
                  <div className="app-title-group">
                    <h3 className="app-name">{item.appName}</h3>
                    <span className="version-tag">{item.version}</span>
                    <span className={`env-badge ${getEnvBadgeClass(item.environment)}`}>
                      {item.environment}
                    </span>
                  </div>
                  
                  <div className="url-link-group">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="deployment-url"
                    >
                      <span>{item.displayUrl}</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                {/* Card Status & Metadata */}
                <div className="card-metrics-group">
                  <div className="metric-item">
                    <span className="metric-label">Status</span>
                    <div className="metric-value">
                      {getStatusBadge(item.status)}
                    </div>
                  </div>

                  <div className="metric-item">
                    <span className="metric-label">Replicas</span>
                    <div className="metric-value replicas-indicator">
                      <span className="replica-text">{item.replicasCurrent}/{item.replicasTotal}</span>
                      <div className="replica-bar">
                        <div 
                          className={`replica-bar-fill ${item.status === 'Failed' ? 'fill-red' : item.status === 'Rolling Out' ? 'fill-blue' : 'fill-green'}`} 
                          style={{ width: `${item.replicasTotal > 0 ? (item.replicasCurrent / item.replicasTotal) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="metric-item">
                    <span className="metric-label">Last Deployed</span>
                    <div className="metric-value text-muted flex-align">
                      <Clock size={14} className="icon-subtle" />
                      <span>{item.lastDeployed}</span>
                    </div>
                  </div>

                  <div className="metric-item">
                    <span className="metric-label">Deployed By</span>
                    <div className="metric-value flex-align">
                      {item.avatar ? (
                        <img src={item.avatar} alt={item.deployedBy} className="user-avatar" />
                      ) : (
                        <div className="avatar-placeholder">
                          {item.deployedBy === 'system' ? <Server size={12} /> : item.deployedBy === 'bot' ? <Cpu size={12} /> : <User size={12} />}
                        </div>
                      )}
                      <span className="user-name">{item.deployedBy}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Button Group */}
                <div className="card-actions">
                  <button 
                    className="action-btn btn-view" 
                    title="View Details"
                    onClick={() => setViewDetailsItem(item)}
                  >
                    <Maximize2 size={15} />
                    <span>View</span>
                  </button>

                  {currentRole !== 'Viewer' && (
                    <>
                      <button 
                        className="action-btn btn-rollback" 
                        title="Rollback deployment"
                        onClick={() => handleOpenRollback(item)}
                      >
                        <RotateCcw size={15} />
                        <span>Rollback</span>
                      </button>

                      <button 
                        className="action-btn btn-scale" 
                        title="Scale replicas"
                        onClick={() => handleOpenScale(item)}
                      >
                        <Layers size={15} />
                        <span>Scale</span>
                      </button>

                      <button 
                        className={`action-btn btn-restart ${isRestarting ? 'restarting' : ''}`} 
                        title="Restart Service"
                        onClick={() => handleRestart(item.id, item.appName)}
                        disabled={isRestarting}
                      >
                        <RefreshCw size={15} className={isRestarting ? 'spin' : ''} />
                        <span>{isRestarting ? 'Restarting...' : 'Restart'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Deployment Modal */}
      {showNewDeploymentModal && (
        <div className="modal-backdrop" onClick={() => setShowNewDeploymentModal(false)}>
          <div className="modal-content glass-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <Rocket size={22} className="modal-icon-blue" />
                <h2>New Deployment</h2>
              </div>
              <button className="modal-close" onClick={() => setShowNewDeploymentModal(false)}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateDeployment} className="modal-form">
              <div className="form-group">
                <label>Application Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Auth Service"
                  value={newDeployData.appName}
                  onChange={(e) => setNewDeployData({...newDeployData, appName: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Version Tag</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. v2.5.0"
                    value={newDeployData.version}
                    onChange={(e) => setNewDeployData({...newDeployData, version: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Target Environment</label>
                  <select 
                    value={newDeployData.environment}
                    onChange={(e) => setNewDeployData({...newDeployData, environment: e.target.value})}
                    className="form-input"
                  >
                    <option value="Production">Production</option>
                    <option value="Staging">Staging</option>
                    <option value="Development">Development</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Initial Replicas</label>
                <input 
                  type="number" 
                  min="1" 
                  max="10"
                  value={newDeployData.replicasTotal}
                  onChange={(e) => setNewDeployData({...newDeployData, replicasTotal: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowNewDeploymentModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Deploy Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scale Modal */}
      {scaleModalItem && (
        <div className="modal-backdrop" onClick={() => setScaleModalItem(null)}>
          <div className="modal-content glass-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <Layers size={22} className="modal-icon-blue" />
                <h2>Scale Replicas: {scaleModalItem.appName}</h2>
              </div>
              <button className="modal-close" onClick={() => setScaleModalItem(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p className="scale-description">
                Adjust desired pod replicas for <strong>{scaleModalItem.appName}</strong> ({scaleModalItem.environment}).
              </p>

              <div className="scale-control-box">
                <button 
                  className="scale-step-btn" 
                  onClick={() => setScaleCount(Math.max(1, scaleCount - 1))}
                >
                  -
                </button>
                <div className="scale-value-display">
                  <span className="scale-number">{scaleCount}</span>
                  <span className="scale-unit">Replicas</span>
                </div>
                <button 
                  className="scale-step-btn"
                  onClick={() => setScaleCount(Math.min(20, scaleCount + 1))}
                >
                  +
                </button>
              </div>

              <div className="scale-info-bar">
                <span>Current Running: {scaleModalItem.replicasCurrent}</span>
                <span>Target: {scaleCount}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setScaleModalItem(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveScale}>
                Apply Scale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rollback Modal */}
      {rollbackModalItem && (
        <div className="modal-backdrop" onClick={() => setRollbackModalItem(null)}>
          <div className="modal-content glass-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <RotateCcw size={22} className="modal-icon-orange" />
                <h2>Rollback {rollbackModalItem.appName}</h2>
              </div>
              <button className="modal-close" onClick={() => setRollbackModalItem(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p className="rollback-description">
                Are you sure you want to revert <strong>{rollbackModalItem.appName}</strong> from current version <code>{rollbackModalItem.version}</code>?
              </p>

              <div className="form-group margin-top-15">
                <label>Rollback Target Version</label>
                <input 
                  type="text" 
                  value={rollbackVersion}
                  onChange={(e) => setRollbackVersion(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="warning-box">
                <AlertCircle size={16} />
                <span>This action will trigger an automated rolling restart to the target version.</span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setRollbackModalItem(null)}>
                Cancel
              </button>
              <button className="btn btn-warning" onClick={handleConfirmRollback}>
                Confirm Rollback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Drawer/Modal */}
      {viewDetailsItem && (
        <div className="modal-backdrop" onClick={() => setViewDetailsItem(null)}>
          <div className="modal-content glass-card modal-large animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <Server size={22} className="modal-icon-blue" />
                <h2>Deployment Details: {viewDetailsItem.appName}</h2>
              </div>
              <button className="modal-close" onClick={() => setViewDetailsItem(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="details-top-banner">
                <div>
                  <h3 className="details-app-name">{viewDetailsItem.appName} <span className="version-tag">{viewDetailsItem.version}</span></h3>
                  <p className="details-url">{viewDetailsItem.url}</p>
                </div>
                <div className="details-status-box">
                  {getStatusBadge(viewDetailsItem.status)}
                </div>
              </div>

              <div className="details-grid">
                <div className="details-stat-box">
                  <span className="details-stat-title">Environment</span>
                  <span className={`env-badge ${getEnvBadgeClass(viewDetailsItem.environment)}`}>
                    {viewDetailsItem.environment}
                  </span>
                </div>
                <div className="details-stat-box">
                  <span className="details-stat-title">Replicas</span>
                  <span className="details-stat-val">{viewDetailsItem.replicasCurrent} / {viewDetailsItem.replicasTotal} Active</span>
                </div>
                <div className="details-stat-box">
                  <span className="details-stat-title">Health Score</span>
                  <span className="details-stat-val text-green">{viewDetailsItem.health}</span>
                </div>
                <div className="details-stat-box">
                  <span className="details-stat-title">CPU Utilization</span>
                  <span className="details-stat-val">{viewDetailsItem.cpuUsage}</span>
                </div>
              </div>

              <div className="logs-preview-section">
                <h4 className="logs-preview-title">Deployment Events & Logs</h4>
                <div className="logs-box">
                  <div className="log-line"><span className="log-time">[00:01]</span> Deployment triggered by <span className="log-user">{viewDetailsItem.deployedBy}</span></div>
                  <div className="log-line"><span className="log-time">[00:02]</span> Pulling image repository container tag {viewDetailsItem.version}...</div>
                  <div className="log-line"><span className="log-time">[00:05]</span> Initializing pod replica sets ({viewDetailsItem.replicasCurrent}/{viewDetailsItem.replicasTotal})...</div>
                  <div className="log-line log-success"><span className="log-time">[00:12]</span> Health probes passed for all instances. Routing traffic to {viewDetailsItem.displayUrl}.</div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setViewDetailsItem(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
