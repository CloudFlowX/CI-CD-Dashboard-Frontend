import React, { useState, useMemo, useEffect } from 'react';
import ApiClient from '../utils/api';
import './AuditLogsPage.css';
import {
  ClipboardList,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Globe,
  RefreshCw,
  Eye,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  Activity,
  Key,
  Database,
  Server,
  Code,
  Lock,
  X,
  FileSpreadsheet
} from 'lucide-react';



export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState([]);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('All');
  const [selectedAction, setSelectedAction] = useState('All');
  const [selectedResource, setSelectedResource] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // UI States
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);

  // Helper for Action Badge Colors & Icons
  const getActionTheme = (action) => {
    switch (action) {
      case 'Create':
        return { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.3)' };
      case 'Update':
        return { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)' };
      case 'Delete':
        return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.3)' };
      case 'Login':
        return { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.3)' };
      case 'Deploy':
        return { color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.3)' };
      default:
        return { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', border: 'rgba(148, 163, 184, 0.3)' };
    }
  };

  // Helper for Resource Icons
  const getResourceIcon = (resource) => {
    switch (resource) {
      case 'Pipeline':
        return <Activity size={14} className="resource-icon" />;
      case 'Repository':
        return <Code size={14} className="resource-icon" />;
      case 'Secret':
        return <Key size={14} className="resource-icon" />;
      case 'User':
        return <User size={14} className="resource-icon" />;
      case 'Environment':
        return <Server size={14} className="resource-icon" />;
      default:
        return <Database size={14} className="resource-icon" />;
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await ApiClient.get('/audit-logs');
      if (res.success && res.logs) {
        setAuditLogs(res.logs.map(log => ({
          id: log._id,
          timestamp: new Date(log.createdAt).toISOString().replace('T', ' ').slice(0, 16),
          user: log.user?.fullName || 'System',
          userEmail: log.user?.email || 'system@internal',
          avatar: (log.user?.fullName || 'S').substring(0, 2).toUpperCase(),
          action: log.action,
          description: `${log.action} on ${log.resource}`,
          resource: log.resource,
          target: log.resourceId || 'N/A',
          ip: log.ipAddress || '127.0.0.1',
          status: log.status === 'success' ? 'Success' : (log.status === 'failed' ? 'Failed' : 'Warning'),
          userAgent: 'Mozilla/5.0',
          details: { info: log.details }
        })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter Logic
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      // Search term matching
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        log.description.toLowerCase().includes(query) ||
        log.user.toLowerCase().includes(query) ||
        log.ip.toLowerCase().includes(query) ||
        log.target.toLowerCase().includes(query) ||
        log.id.toLowerCase().includes(query);

      // User matching
      const matchesUser = selectedUser === 'All' || log.user === selectedUser;

      // Action type matching
      const matchesAction = selectedAction === 'All' || log.action === selectedAction;

      // Resource matching
      const matchesResource = selectedResource === 'All' || log.resource === selectedResource;

      // Date range matching
      let matchesDate = true;
      if (startDate) {
        const logDate = log.timestamp.split(' ')[0];
        if (logDate < startDate) matchesDate = false;
      }
      if (endDate) {
        const logDate = log.timestamp.split(' ')[0];
        if (logDate > endDate) matchesDate = false;
      }

      return matchesSearch && matchesUser && matchesAction && matchesResource && matchesDate;
    });
  }, [searchTerm, selectedUser, selectedAction, selectedResource, startDate, endDate]);

  // Check if any filter is active
  const hasActiveFilters =
    searchTerm ||
    selectedUser !== 'All' ||
    selectedAction !== 'All' ||
    selectedResource !== 'All' ||
    startDate ||
    endDate;

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedUser('All');
    setSelectedAction('All');
    setSelectedResource('All');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
    showToast('Filters cleared');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchLogs().then(() => {
      setTimeout(() => {
        setIsRefreshing(false);
        showToast('Audit logs refreshed with latest events');
      }, 600);
    });
  };

  const toggleExpand = (id) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  const handleCopyLog = (log, e) => {
    e.stopPropagation();
    const formattedText = `[${log.timestamp}] ${log.user} (${log.ip}) - ${log.action} - ${log.description}`;
    navigator.clipboard.writeText(formattedText);
    setCopiedId(log.id);
    showToast(`Copied ${log.id} details to clipboard`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    setShowExportModal(false);
    const headers = ['ID', 'Timestamp', 'User', 'User Email', 'Action', 'Resource', 'Description', 'Target', 'IP Address', 'Status'];
    const csvRows = [headers.join(',')];

    filteredLogs.forEach((log) => {
      const row = [
        log.id,
        `"${log.timestamp}"`,
        `"${log.user}"`,
        `"${log.userEmail}"`,
        log.action,
        log.resource,
        `"${log.description.replace(/"/g, '""')}"`,
        `"${log.target.replace(/"/g, '""')}"`,
        log.ip,
        log.status
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredLogs.length} audit log entries as CSV`);
  };

  // Summary Metrics
  const totalEntriesCount = 234;
  const filteredCount = filteredLogs.length;
  const failedCount = auditLogs.filter((l) => l.status === 'Failed').length;
  const deployCount = auditLogs.filter((l) => l.action === 'Deploy').length;

  return (
    <div className="audit-logs-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="audit-toast">
          <CheckCircle size={16} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Export Confirmation Modal */}
      {showExportModal && (
        <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="export-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <FileSpreadsheet size={20} className="modal-icon" />
                <h3>Export Audit Logs</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowExportModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>You are about to export <strong>{filteredLogs.length}</strong> audit log entries matching your current filters.</p>
              <div className="export-preview-box">
                <div className="preview-row"><span>Format:</span> <strong>CSV (Comma Separated)</strong></div>
                <div className="preview-row"><span>Date Range:</span> <strong>{startDate || 'Earliest'} to {endDate || 'Latest'}</strong></div>
                <div className="preview-row"><span>Action Filter:</span> <strong>{selectedAction}</strong></div>
                <div className="preview-row"><span>Resource Filter:</span> <strong>{selectedResource}</strong></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowExportModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleExportCSV}>
                <Download size={16} /> Confirm Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Page Header */}
      <header className="audit-header">
        <div className="audit-header-left">
          <div className="header-icon-box">
            <ClipboardList className="header-icon" />
          </div>
          <div>
            <h1 className="audit-title">Audit Logs</h1>
            <p className="audit-subtitle">Track all system activities and changes</p>
          </div>
        </div>

        <div className="audit-header-actions">
          <button
            className={`btn-icon-refresh ${isRefreshing ? 'spinning' : ''}`}
            onClick={handleRefresh}
            title="Refresh logs"
          >
            <RefreshCw size={16} />
          </button>

          <button className="btn-export-logs" onClick={() => setShowExportModal(true)}>
            <Download size={16} />
            <span>Export Logs</span>
          </button>
        </div>
      </header>

      {/* Stats Summary Bar */}
      <div className="audit-stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Events Tracked</span>
            <div className="stat-icon-wrapper blue">
              <ClipboardList size={18} />
            </div>
          </div>
          <div className="stat-value">{totalEntriesCount}</div>
          <div className="stat-subtext">15 entries loaded on page</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Active Users & System</span>
            <div className="stat-icon-wrapper purple">
              <User size={18} />
            </div>
          </div>
          <div className="stat-value">4 Actives</div>
          <div className="stat-subtext">Kunal, Priya, System, Unknown</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Deployments Recorded</span>
            <div className="stat-icon-wrapper cyan">
              <Layers size={18} />
            </div>
          </div>
          <div className="stat-value">{deployCount} Recent</div>
          <div className="stat-subtext">Production & Staging clusters</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Security Alerts / Failed</span>
            <div className="stat-icon-wrapper red">
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="stat-value">{failedCount} Failed</div>
          <div className="stat-subtext">1 unauthorized login flag</div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="audit-filter-bar">
        <div className="filter-group date-group">
          <label className="filter-label">
            <Calendar size={14} /> Date Range
          </label>
          <div className="date-inputs-wrapper">
            <input
              type="date"
              className="date-input"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              title="From Date"
            />
            <span className="date-separator">to</span>
            <input
              type="date"
              className="date-input"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              title="To Date"
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <User size={14} /> User
          </label>
          <select
            className="filter-select"
            value={selectedUser}
            onChange={(e) => {
              setSelectedUser(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Users</option>
            <option value="Kunal Kumar">Kunal Kumar</option>
            <option value="Priya Sharma">Priya Sharma</option>
            <option value="System">System</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <Filter size={14} /> Action Type
          </label>
          <select
            className="filter-select"
            value={selectedAction}
            onChange={(e) => {
              setSelectedAction(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Actions</option>
            <option value="Create">Create</option>
            <option value="Update">Update</option>
            <option value="Delete">Delete</option>
            <option value="Login">Login</option>
            <option value="Deploy">Deploy</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <Layers size={14} /> Resource
          </label>
          <select
            className="filter-select"
            value={selectedResource}
            onChange={(e) => {
              setSelectedResource(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Resources</option>
            <option value="Pipeline">Pipeline</option>
            <option value="Repository">Repository</option>
            <option value="Secret">Secret</option>
            <option value="User">User</option>
            <option value="Environment">Environment</option>
          </select>
        </div>

        <div className="filter-group search-group">
          <label className="filter-label">
            <Search size={14} /> Search
          </label>
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search description, IP, target..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <button className="btn-reset-filters" onClick={handleResetFilters} title="Reset all filters">
            Clear Filters
          </button>
        )}
      </div>

      {/* Filter Status summary */}
      <div className="audit-results-bar">
        <span className="results-count">
          Showing <strong>{filteredLogs.length}</strong> of <strong>{auditLogs.length}</strong> log entries
        </span>
        {hasActiveFilters && <span className="active-filter-badge">Filters Active</span>}
      </div>

      {/* 3. Audit Log Timeline (Full Width) */}
      <div className="audit-timeline-wrapper">
        {filteredLogs.length === 0 ? (
          <div className="audit-empty-state">
            <ShieldAlert size={48} className="empty-icon" />
            <h3>No audit logs found</h3>
            <p>Try adjusting your search criteria or date filters to view system activities.</p>
            <button className="btn-reset-filters mt-12" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="audit-timeline-list">
            {filteredLogs.map((log) => {
              const theme = getActionTheme(log.action);
              const isExpanded = expandedLogId === log.id;
              const isFailed = log.status === 'Failed';

              return (
                <div
                  key={log.id}
                  className={`audit-row-card ${isExpanded ? 'expanded' : ''} ${isFailed ? 'failed-row' : ''}`}
                  style={{ '--border-action-color': theme.color }}
                  onClick={() => toggleExpand(log.id)}
                >
                  <div className="audit-row-main">
                    {/* Action Color Indicator Line (Left border effect) */}
                    <div className="action-indicator" style={{ backgroundColor: theme.color }} />

                    {/* Timestamp */}
                    <div className="audit-col timestamp-col">
                      <Calendar size={14} className="col-icon" />
                      <span className="timestamp-text">{log.timestamp}</span>
                    </div>

                    {/* User Avatar + Name */}
                    <div className="audit-col user-col">
                      <div className={`user-avatar ${log.user === 'System' ? 'system-avatar' : log.user === 'Unknown' ? 'unknown-avatar' : ''}`}>
                        {log.avatar}
                      </div>
                      <div className="user-info">
                        <span className="user-name">{log.user}</span>
                        <span className="user-email">{log.userEmail}</span>
                      </div>
                    </div>

                    {/* Action Badge */}
                    <div className="audit-col action-col">
                      <span
                        className="action-badge"
                        style={{
                          backgroundColor: theme.bg,
                          color: theme.color,
                          borderColor: theme.border
                        }}
                      >
                        {log.action}
                      </span>
                    </div>

                    {/* Description & Target */}
                    <div className="audit-col desc-col">
                      <p className="desc-text">{log.description}</p>
                      <span className="target-pill">
                        {getResourceIcon(log.resource)}
                        {log.target}
                      </span>
                    </div>

                    {/* Resource Tag */}
                    <div className="audit-col resource-col">
                      <span className="resource-tag">
                        {log.resource}
                      </span>
                    </div>

                    {/* IP Address */}
                    <div className="audit-col ip-col">
                      <Globe size={13} className="ip-icon" />
                      <span className="ip-text">{log.ip}</span>
                    </div>

                    {/* Success / Failed Status Indicator */}
                    <div className="audit-col status-col">
                      {log.status === 'Success' ? (
                        <span className="status-badge success">
                          <CheckCircle size={14} />
                          <span>Success</span>
                        </span>
                      ) : (
                        <span className="status-badge failed">
                          <XCircle size={14} />
                          <span>Failed</span>
                        </span>
                      )}
                    </div>

                    {/* Expand Trigger Button */}
                    <div className="audit-col expand-col">
                      <button
                        className="expand-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(log.id);
                        }}
                        title={isExpanded ? 'Collapse details' : 'Expand details'}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail Drawer */}
                  {isExpanded && (
                    <div className="audit-row-details" onClick={(e) => e.stopPropagation()}>
                      <div className="details-header">
                        <div className="details-title">
                          <Eye size={15} />
                          <span>Event Payload & Metadata ({log.id})</span>
                        </div>
                        <button className="btn-copy-log" onClick={(e) => handleCopyLog(log, e)}>
                          {copiedId === log.id ? <Check size={14} className="green" /> : <Copy size={14} />}
                          <span>{copiedId === log.id ? 'Copied' : 'Copy Log Entry'}</span>
                        </button>
                      </div>

                      <div className="details-grid">
                        <div className="details-box">
                          <h4 className="box-title">Client Environment</h4>
                          <div className="detail-item">
                            <span className="label">User Agent:</span>
                            <span className="value code-font">{log.userAgent}</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Origin IP:</span>
                            <span className="value">{log.ip}</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Logged By:</span>
                            <span className="value">{log.user} ({log.userEmail})</span>
                          </div>
                        </div>

                        <div className="details-box">
                          <h4 className="box-title">Resource Attributes</h4>
                          <div className="detail-item">
                            <span className="label">Type:</span>
                            <span className="value">{log.resource}</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Target Spec:</span>
                            <span className="value">{log.target}</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Result:</span>
                            <span className={`value ${log.status === 'Success' ? 'text-green' : 'text-red'}`}>
                              {log.status}
                            </span>
                          </div>
                        </div>

                        <div className="details-box full-width">
                          <h4 className="box-title">Extended Data JSON</h4>
                          <pre className="json-container">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Pagination */}
      <div className="audit-pagination-bar">
        <div className="pagination-info">
          Showing <strong>1-15</strong> of <strong>{totalEntriesCount}</strong> entries
        </div>

        <div className="pagination-controls">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <div className="page-numbers">
            <button
              className={`page-num ${currentPage === 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
            <button
              className={`page-num ${currentPage === 2 ? 'active' : ''}`}
              onClick={() => setCurrentPage(2)}
            >
              2
            </button>
            <button
              className={`page-num ${currentPage === 3 ? 'active' : ''}`}
              onClick={() => setCurrentPage(3)}
            >
              3
            </button>
            <span className="page-dots">...</span>
            <button
              className={`page-num ${currentPage === 16 ? 'active' : ''}`}
              onClick={() => setCurrentPage(16)}
            >
              16
            </button>
          </div>

          <button
            className="pagination-btn"
            disabled={currentPage === 16}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, 16))}
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
