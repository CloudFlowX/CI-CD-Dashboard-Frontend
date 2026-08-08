import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Clock, ChevronRight } from 'lucide-react';
import ApiClient from '../utils/api';
import './PipelineActivity.css';

const DEFAULT_ACTIVITIES = [
  {
    id: 'act-1',
    service: 'E-commerce API',
    text: 'Build #45 completed successfully',
    time: '2m ago',
    status: 'success'
  },
  {
    id: 'act-2',
    service: 'Frontend Web',
    text: 'Deployment to AWS failed',
    time: '15m ago',
    status: 'failed'
  },
  {
    id: 'act-3',
    service: 'User Service',
    text: 'Build #12 in progress',
    time: '30m ago',
    status: 'in-progress'
  },
  {
    id: 'act-4',
    service: 'Payment Gateway',
    text: 'Deployed to Azure',
    time: '45m ago',
    status: 'success'
  },
  {
    id: 'act-5',
    service: 'Notification Service',
    text: 'Tests completed',
    time: '1h ago',
    status: 'success'
  },
  {
    id: 'act-6',
    service: 'Auth Service',
    text: 'Docker image pushed to ECR',
    time: '2h ago',
    status: 'success'
  },
  {
    id: 'act-7',
    service: 'Analytics Pipeline',
    text: 'Staging environment deployed',
    time: '3h ago',
    status: 'success'
  },
  {
    id: 'act-8',
    service: 'Search Service',
    text: 'Integration tests failed',
    time: '4h ago',
    status: 'failed'
  }
];

const PipelineActivity = ({ onViewAll }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await ApiClient.get('/pipelines');
        if (res.success && res.pipelines) {
          const mapped = res.pipelines.map((p, idx) => ({
            id: p._id,
            service: p.name,
            text: p.status === 'success' ? `Pipeline completed successfully` : p.status === 'failed' ? `Pipeline failed` : `Pipeline ${p.status}`,
            time: new Date(p.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: p.status
          }));
          setActivities(mapped);
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
      }
    };
    fetchActivities();
  }, []);

  const displayedActivities = isExpanded ? activities : activities.slice(0, 5);

  const handleViewAllClick = (e) => {
    e.preventDefault();
    if (onViewAll) {
      onViewAll();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="status-icon icon-success" size={16} />;
      case 'failed':
        return <XCircle className="status-icon icon-failed" size={16} />;
      case 'in-progress':
        return <Loader2 className="status-icon icon-running animate-spin" size={16} />;
      default:
        return <CheckCircle className="status-icon icon-success" size={16} />;
    }
  };

  const getDotClass = (status) => {
    switch (status) {
      case 'success':
        return 'dot-success';
      case 'failed':
        return 'dot-failed';
      case 'in-progress':
        return 'dot-in-progress';
      default:
        return 'dot-success';
    }
  };

  return (
    <div className="pipeline-activity-card">
      <div className="pipeline-activity-header">
        <div className="pipeline-activity-title-group">
          <h3 className="pipeline-activity-title">Pipeline Activity</h3>
          <span className="pipeline-activity-badge">Live</span>
        </div>
        <button 
          className="pipeline-activity-view-all" 
          onClick={handleViewAllClick}
          type="button"
          aria-label="View all activity items"
        >
          {isExpanded ? 'Show Less' : 'View All'}
          <ChevronRight size={14} className={`view-all-arrow ${isExpanded ? 'expanded' : ''}`} />
        </button>
      </div>

      <div className="pipeline-activity-list">
        {displayedActivities.map((activity, index) => {
          const isFirst = index === 0;
          const isLast = index === displayedActivities.length - 1;

          return (
            <div 
              key={activity.id || index} 
              className={`pipeline-activity-item ${isFirst ? 'is-first' : ''} ${isLast ? 'is-last' : ''}`}
            >
              <div className="pipeline-activity-timeline-col">
                <div className="pipeline-activity-line" />
                <div className={`pipeline-activity-dot ${getDotClass(activity.status)}`} />
              </div>

              <div className="pipeline-activity-content">
                <div className="pipeline-activity-info">
                  <span className="pipeline-activity-service">{activity.service}</span>
                  <span className="pipeline-activity-text">{activity.text}</span>
                </div>

                <div className="pipeline-activity-meta">
                  <span className="pipeline-activity-time">
                    <Clock size={12} />
                    {activity.time}
                  </span>
                  <div className="pipeline-activity-indicator" title={activity.status}>
                    {renderStatusIcon(activity.status)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineActivity;
