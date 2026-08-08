import React from 'react';
import { GitBranch, ArrowRight } from 'lucide-react';
import ApiClient from '../utils/api';
import './RecentPipelines.css';


const RecentPipelines = () => {
  const [pipelines, setPipelines] = React.useState([]);

  React.useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const res = await ApiClient.get('/pipelines');
        if (res.success && res.pipelines) {
          const mapped = res.pipelines.slice(0, 5).map(p => ({
            id: p._id,
            name: p.name,
            branch: p.branch || 'main',
            buildNumber: `#${p._id.substring(p._id.length - 4)}`,
            status: p.status.charAt(0).toUpperCase() + p.status.slice(1),
            statusType: p.status,
            timeAgo: 'Just now'
          }));
          setPipelines(mapped);
        }
      } catch (error) {
        console.error('Error fetching recent pipelines:', error);
      }
    };
    fetchPipelines();
  }, []);

  return (
    <div className="recent-pipelines-card">
      <div className="recent-pipelines-header">
        <h3 className="recent-pipelines-title">Recent Pipelines</h3>
        <a 
          href="#view-all" 
          className="recent-pipelines-view-all"
          onClick={(e) => e.preventDefault()}
        >
          View All <ArrowRight size={14} className="recent-pipelines-view-icon" />
        </a>
      </div>

      <div className="recent-pipelines-list">
        {pipelines.map((pipeline) => (
          <div key={pipeline.id} className="recent-pipelines-item">
            {/* Left section: status dot + name column */}
            <div className="recent-pipelines-left">
              <span className={`recent-pipelines-dot dot-${pipeline.statusType}`} />
              <div className="recent-pipelines-info">
                <span className="recent-pipelines-name">{pipeline.name}</span>
                {pipeline.branch && (
                  <span className="recent-pipelines-branch">
                    <GitBranch size={12} className="recent-pipelines-branch-icon" />
                    {pipeline.branch}
                  </span>
                )}
              </div>
            </div>

            {/* Center section: build number */}
            <div className="recent-pipelines-center">
              <span className="recent-pipelines-build">{pipeline.buildNumber}</span>
            </div>

            {/* Right section: status badge + time ago */}
            <div className="recent-pipelines-right">
              <span className={`recent-pipelines-badge badge-${pipeline.statusType}`}>
                {pipeline.status}
              </span>
              <span className="recent-pipelines-time">{pipeline.timeAgo}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPipelines;
