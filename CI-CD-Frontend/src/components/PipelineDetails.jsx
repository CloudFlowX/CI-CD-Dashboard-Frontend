import React, { useState } from 'react';
import { 
  CheckCircle, 
  GitBranch, 
  GitCommit, 
  User, 
  Clock, 
  ArrowRight,
  Package,
  Rocket,
  Download,
  ExternalLink
} from 'lucide-react';
import './PipelineDetails.css';

const STAGES = [
  {
    id: 'checkout',
    name: 'Checkout',
    duration: '12s',
    status: 'completed',
    steps: [
      { name: 'Git repository checkout', duration: '4s', status: 'success' },
      { name: 'Fetch submodules', duration: '5s', status: 'success' },
      { name: 'Validate commit signature', duration: '3s', status: 'success' }
    ],
    logs: [
      '[10:15:00] Cloning repository https://github.com/org/ecommerce-api.git...',
      '[10:15:04] Checked out commit a1b2c3d (main branch)',
      '[10:15:09] Submodules updated successfully.',
      '[10:15:12] Checkout stage completed in 12s.'
    ]
  },
  {
    id: 'build',
    name: 'Build',
    duration: '45s',
    status: 'completed',
    steps: [
      { name: 'Setup Node.js environment v20.x', duration: '8s', status: 'success' },
      { name: 'Install npm dependencies', duration: '22s', status: 'success' },
      { name: 'Compile TypeScript source files', duration: '15s', status: 'success' }
    ],
    logs: [
      '[10:15:12] Starting Node.js build process...',
      '[10:15:20] Restored 452 packages from cache.',
      '[10:15:42] tsc build succeeded with 0 errors.',
      '[10:15:57] Build artifact bundle generated (14.2 MB).'
    ]
  },
  {
    id: 'test',
    name: 'Test',
    duration: '1m 12s',
    status: 'completed',
    steps: [
      { name: 'Run unit test suite (Jest)', duration: '38s', status: 'success' },
      { name: 'Run API integration tests', duration: '24s', status: 'success' },
      { name: 'Coverage report generation', duration: '10s', status: 'success' }
    ],
    logs: [
      '[10:15:57] Running test runner...',
      '[10:16:35] PASS src/auth/jwt.spec.ts (12 tests)',
      '[10:16:59] PASS src/api/cart.controller.spec.ts (28 tests)',
      '[10:17:09] Test coverage 94.8% lines, 91.2% branches.'
    ]
  },
  {
    id: 'security-scan',
    name: 'Security Scan',
    duration: '30s',
    status: 'completed',
    steps: [
      { name: 'Snyk dependency vulnerability audit', duration: '14s', status: 'success' },
      { name: 'SonarQube static code analysis', duration: '12s', status: 'success' },
      { name: 'Secret scanner audit', duration: '4s', status: 'success' }
    ],
    logs: [
      '[10:17:09] Initializing vulnerability scanner...',
      '[10:17:23] 0 High, 0 Critical vulnerabilities detected.',
      '[10:17:35] SonarQube Quality Gate passed (Rating A).',
      '[10:17:39] Security scan finished with 0 findings.'
    ]
  },
  {
    id: 'push-image',
    name: 'Push Image',
    duration: '18s',
    status: 'completed',
    steps: [
      { name: 'Build Docker OCI image layer', duration: '10s', status: 'success' },
      { name: 'Tag image e-commerce-api:a1b2c3d', duration: '2s', status: 'success' },
      { name: 'Push to container registry', duration: '6s', status: 'success' }
    ],
    logs: [
      '[10:17:39] Building docker image registry.internal/ecommerce-api:a1b2c3d',
      '[10:17:49] Layer caching hit 8/10 layers.',
      '[10:17:51] Tagged latest & #45',
      '[10:17:57] Image pushed successfully digest sha256:7f8a9...'
    ]
  },
  {
    id: 'deploy',
    name: 'Deploy',
    duration: '57s',
    status: 'completed',
    steps: [
      { name: 'Kubernetes manifest apply (k8s-prod)', duration: '15s', status: 'success' },
      { name: 'Rolling update deployment rollout', duration: '32s', status: 'success' },
      { name: 'Production endpoint health check', duration: '10s', status: 'success' }
    ],
    logs: [
      '[10:17:57] Applying deployment manifests to cluster prod-us-east-1...',
      '[10:18:12] Deployment rollout in progress (3/3 pods ready)...',
      '[10:18:44] Rolling update completed without downtime.',
      '[10:18:54] GET https://api.ecommerce.internal/health -> 200 OK (18ms)'
    ]
  }
];

const ARTIFACTS = [
  { name: 'ecommerce-api-dist.tar.gz', size: '14.2 MB', type: 'Archive', date: '20 May 2024, 10:18 AM' },
  { name: 'coverage-report.json', size: '1.8 MB', type: 'JSON Report', date: '20 May 2024, 10:17 AM' },
  { name: 'container-manifest.yaml', size: '42 KB', type: 'YAML Manifest', date: '20 May 2024, 10:18 AM' },
  { name: 'security-audit-snyk.pdf', size: '340 KB', type: 'PDF Report', date: '20 May 2024, 10:17 AM' }
];

const PipelineDetails = () => {
  const [activeTab, setActiveTab] = useState('Stages');
  const [selectedStageId, setSelectedStageId] = useState('checkout');

  const selectedStage = STAGES.find(s => s.id === selectedStageId) || STAGES[0];

  return (
    <div className="pipeline-details-card">
      {/* Header Section */}
      <div className="pipeline-details-header">
        <div className="pipeline-details-header-main">
          <h2 className="pipeline-details-title">Pipeline Details</h2>
          <nav className="pipeline-details-breadcrumb">
            <span className="breadcrumb-item">Pipelines</span>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-item">E-commerce</span>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">#43</span>
          </nav>
        </div>
      </div>

      {/* Success Badge Row */}
      <div className="pipeline-details-badge-row">
        <span className="pipeline-details-badge badge-success">
          <CheckCircle size={14} />
          Success
        </span>
        <h3 className="pipeline-details-name">E-commerce API - #45</h3>
      </div>

      {/* Metadata Row */}
      <div className="pipeline-details-metadata">
        <div className="metadata-item">
          <span className="metadata-label">Branch</span>
          <div className="metadata-value">
            <GitBranch size={14} className="metadata-icon" />
            <span className="value-tag">main</span>
          </div>
        </div>

        <div className="metadata-item">
          <span className="metadata-label">Commit</span>
          <div className="metadata-value">
            <GitCommit size={14} className="metadata-icon" />
            <span className="value-code">a1b2c3d</span>
          </div>
        </div>

        <div className="metadata-item">
          <span className="metadata-label">Triggered by</span>
          <div className="metadata-value">
            <User size={14} className="metadata-icon" />
            <span className="value-user">kunal24</span>
          </div>
        </div>

        <div className="metadata-item">
          <span className="metadata-label">Started at</span>
          <div className="metadata-value">
            <Clock size={14} className="metadata-icon" />
            <span>20 May 2024, 10:15 AM</span>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="pipeline-details-tab-bar">
        {['Stages', 'Logs', 'Deployment', 'Artifacts'].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pipeline-details-tab-content">
        {activeTab === 'Stages' && (
          <div className="stages-tab-wrapper">
            {/* Horizontal Stage Pipeline (visual flowchart) */}
            <div className="horizontal-flowchart-container">
              <div className="horizontal-flowchart-title">Horizontal Stage Pipeline</div>
              <div className="horizontal-flowchart-scroll">
                <div className="horizontal-flowchart">
                  {STAGES.map((stage, index) => {
                    const isSelected = selectedStageId === stage.id;
                    return (
                      <React.Fragment key={stage.id}>
                        <div
                          className={`stage-box ${isSelected ? 'selected' : ''}`}
                          onClick={() => setSelectedStageId(stage.id)}
                        >
                          <div className="stage-box-icon">
                            <CheckCircle size={20} className="icon-success" />
                          </div>
                          <div className="stage-box-name">{stage.name}</div>
                          <div className="stage-box-duration">{stage.duration}</div>
                        </div>

                        {index < STAGES.length - 1 && (
                          <div className="stage-connector">
                            <div className="connector-line"></div>
                            <ArrowRight size={14} className="connector-arrow" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Stages Section: Left Column (Vertical Stages List) & Right Column (Stage Details Inspector) */}
            <div className="stages-split-layout">
              {/* Left Column - Stages List */}
              <div className="left-stages-column">
                <h4 className="stages-column-title">Stages List</h4>
                <div className="vertical-stages-list">
                  {STAGES.map((stage, index) => {
                    const isSelected = selectedStageId === stage.id;
                    const isLast = index === STAGES.length - 1;
                    return (
                      <div
                        key={stage.id}
                        className={`vertical-stage-item ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedStageId(stage.id)}
                      >
                        <div className="stage-item-icon-wrapper">
                          <CheckCircle size={18} className="vertical-stage-icon success" />
                          {!isLast && <div className="vertical-connector-line"></div>}
                        </div>
                        <div className="stage-item-info">
                          <span className="stage-item-name">{stage.name}</span>
                        </div>
                        <div className="stage-item-right">
                          <span className="stage-item-duration">{stage.duration}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column - Selected Stage Inspector */}
              <div className="right-stage-details">
                <div className="stage-inspector-header">
                  <div>
                    <h4 className="stage-inspector-title">
                      {selectedStage.name} Stage Overview
                    </h4>
                    <span className="stage-inspector-subtitle">
                      Execution Time: {selectedStage.duration}
                    </span>
                  </div>
                  <span className="pipeline-details-badge badge-success">
                    <CheckCircle size={12} />
                    Completed
                  </span>
                </div>

                <div className="stage-inspector-steps">
                  <h5 className="section-label">Executed Steps</h5>
                  <div className="steps-list">
                    {selectedStage.steps.map((step, i) => (
                      <div key={i} className="step-row">
                        <CheckCircle size={14} className="step-icon success" />
                        <span className="step-name">{step.name}</span>
                        <span className="step-duration">{step.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="stage-inspector-logs">
                  <h5 className="section-label">Stage Output Logs</h5>
                  <div className="stage-logs-box">
                    {selectedStage.logs.map((logLine, idx) => (
                      <div key={idx} className="stage-log-line">
                        {logLine}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Logs' && (
          <div className="logs-tab-view">
            <div className="logs-toolbar">
              <div className="logs-status-indicator">
                <span className="status-dot success"></span>
                <span>Console Output Log (Full Build #45)</span>
              </div>
            </div>
            <div className="logs-console-window">
              {STAGES.flatMap(s => s.logs).map((line, idx) => (
                <div key={idx} className="console-line">
                  <span className="line-num">{idx + 1}</span>
                  <span className="line-text">{line}</span>
                </div>
              ))}
              <div className="console-line highlighted">
                <span className="line-num">{STAGES.flatMap(s => s.logs).length + 1}</span>
                <span className="line-text">[10:18:54] Pipeline #45 finished with status SUCCESS in 3m 54s.</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Deployment' && (
          <div className="deployment-tab-view">
            <div className="deployment-card-grid">
              <div className="deployment-info-card">
                <h4 className="info-card-title">
                  <Rocket size={16} className="info-icon" />
                  Target Environment
                </h4>
                <div className="info-card-body">
                  <div className="info-row">
                    <span className="label">Cluster:</span>
                    <span className="value">prod-us-east-1-k8s</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Namespace:</span>
                    <span className="value">ecommerce-prod</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Replicas:</span>
                    <span className="value">3 / 3 Healthy</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Strategy:</span>
                    <span className="value">Rolling Update (0 downtime)</span>
                  </div>
                </div>
              </div>

              <div className="deployment-info-card">
                <h4 className="info-card-title">
                  <ExternalLink size={16} className="info-icon" />
                  Live Endpoints
                </h4>
                <div className="info-card-body">
                  <div className="endpoint-link-row">
                    <span className="label">API Gateway:</span>
                    <a href="https://api.ecommerce.internal" target="_blank" rel="noreferrer" className="endpoint-url">
                      https://api.ecommerce.internal
                    </a>
                  </div>
                  <div className="endpoint-link-row">
                    <span className="label">Health Check:</span>
                    <span className="pipeline-details-badge badge-success">200 OK (18ms)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Artifacts' && (
          <div className="artifacts-tab-view">
            <table className="artifacts-table">
              <thead>
                <tr>
                  <th>Artifact Name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Generated Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {ARTIFACTS.map((art, idx) => (
                  <tr key={idx}>
                    <td className="art-name">
                      <Package size={14} className="art-icon" />
                      {art.name}
                    </td>
                    <td>{art.type}</td>
                    <td>{art.size}</td>
                    <td className="art-date">{art.date}</td>
                    <td>
                      <button className="download-btn">
                        <Download size={13} />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineDetails;
