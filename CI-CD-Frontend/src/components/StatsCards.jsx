import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  GitPullRequest, 
  Rocket, 
  TrendingUp, 
  Check, 
  Activity 
} from 'lucide-react';
import ApiClient from '../utils/api';
import './StatsCards.css';

/**
 * StatsCards Component
 * 
 * Displays 4 KPI metric cards in a CSS Grid for a CI/CD Pipeline Dashboard:
 * 1. Repositories (Value: 12, trend: +2 this week, GitBranch icon, mini sparkline chart)
 * 2. Pipelines (Value: 45, trend: +8 this week, GitPullRequest icon)
 * 3. Deployments (Value: 28, trend: +6 this week, Rocket icon with checkmark badge)
 * 4. Success Rate (Value: 95.6%, trend: +3.2% this week, SVG progress ring)
 */
const StatsCards = ({ statsData }) => {
  // Default metrics data adhering strictly to user specifications
  const defaultMetrics = [
    {
      id: 'repositories',
      title: 'Repositories',
      value: '12',
      trend: '+2 this week',
      icon: GitBranch,
      colorClass: 'blue',
      sparkline: true,
    },
    {
      id: 'pipelines',
      title: 'Pipelines',
      value: '45',
      trend: '+8 this week',
      icon: GitPullRequest,
      colorClass: 'purple',
    },
    {
      id: 'deployments',
      title: 'Deployments',
      value: '28',
      trend: '+6 this week',
      icon: Rocket,
      colorClass: 'green',
      badge: true,
    },
    {
      id: 'success-rate',
      title: 'Success Rate',
      value: '95.6%',
      trend: '+3.2% this week',
      colorClass: 'green',
      isProgressRing: true,
      percentage: 95.6,
    },
  ];

  const [metrics, setMetrics] = useState(defaultMetrics);

  useEffect(() => {
    if (statsData) {
      setMetrics(statsData);
      return;
    }

    const fetchMetrics = async () => {
      try {
        const [reposRes, pipelinesRes] = await Promise.all([
          ApiClient.get('/repositories'),
          ApiClient.get('/pipelines')
        ]);
        
        let reposCount = 12;
        let pipelinesCount = 45;
        let deploymentsCount = 28;
        let successRate = 95.6;

        if (reposRes.success && reposRes.repositories) {
          reposCount = reposRes.repositories.length;
        }

        if (pipelinesRes.success && pipelinesRes.pipelines) {
          pipelinesCount = pipelinesRes.pipelines.length;
          deploymentsCount = pipelinesRes.pipelines.filter(p => p.status === 'success').length;
          
          if (pipelinesCount > 0) {
            successRate = ((deploymentsCount / pipelinesCount) * 100).toFixed(1);
          }
        }

        setMetrics([
          {
            id: 'repositories',
            title: 'Repositories',
            value: reposCount.toString(),
            trend: 'Active',
            icon: GitBranch,
            colorClass: 'blue',
            sparkline: true,
          },
          {
            id: 'pipelines',
            title: 'Pipelines',
            value: pipelinesCount.toString(),
            trend: 'Triggered',
            icon: GitPullRequest,
            colorClass: 'purple',
          },
          {
            id: 'deployments',
            title: 'Deployments',
            value: deploymentsCount.toString(),
            trend: 'Successful',
            icon: Rocket,
            colorClass: 'green',
            badge: true,
          },
          {
            id: 'success-rate',
            title: 'Success Rate',
            value: `${successRate}%`,
            trend: 'Pipeline completion',
            colorClass: 'green',
            isProgressRing: true,
            percentage: parseFloat(successRate),
          }
        ]);

      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };

    fetchMetrics();
  }, [statsData]);

  return (
    <div className="stats-cards-container">
      <div className="stats-cards-grid">
        {metrics.map((card) => {
          const IconComponent = card.icon;

          return (
            <div key={card.id} className={`stat-card stat-card-${card.colorClass}`}>
              {/* Subtle hover radial glow overlay */}
              <div className="stat-card-glow" />

              {/* Header: Title Label + Top Right Icon / Progress Ring */}
              <div className="stat-card-header">
                <span className="stat-card-title">{card.title}</span>

                {card.isProgressRing ? (
                  /* Card 4: SVG Circular Progress Ring (44px x 44px) */
                  <div className="stat-card-progress-container">
                    <svg className="progress-ring-svg" width="44" height="44" viewBox="0 0 44 44">
                      <defs>
                        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#22c55e" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                      {/* Background track circle */}
                      <circle
                        className="progress-ring-bg"
                        cx="22"
                        cy="22"
                        r="18"
                      />
                      {/* Progress filled arc (r=18 -> C ≈ 113.097) */}
                      <circle
                        className="progress-ring-fill"
                        cx="22"
                        cy="22"
                        r="18"
                        stroke="url(#greenGradient)"
                        strokeDasharray="113.097"
                        strokeDashoffset={113.097 * (1 - (card.percentage || 95.6) / 100)}
                        transform="rotate(-90 22 22)"
                      />
                    </svg>
                    <div className="progress-ring-inner-icon">
                      <Activity size={15} className="progress-inner-icon" />
                    </div>
                  </div>
                ) : (
                  /* Cards 1, 2, 3: 44px Circle Icon Area */
                  <div className={`stat-card-icon-wrapper icon-wrapper-${card.colorClass}`}>
                    {IconComponent && <IconComponent className="stat-icon" size={20} />}
                    
                    {/* Small Green Checkmark Badge for Deployments Card */}
                    {card.badge && (
                      <div className="stat-card-badge-checkmark" title="Deployment Healthy">
                        <Check size={10} strokeWidth={3.5} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Body: Large Value Display + Optional Mini Sparkline */}
              <div className="stat-card-body">
                <div className="stat-card-value-row">
                  <span className="stat-card-value">{card.value}</span>
                  
                  {/* Card 1: Mini Sparkline / Mini Chart */}
                  {card.sparkline && (
                    <div className="stat-card-sparkline-wrapper" title="Repository Activity Trend">
                      <svg className="sparkline-svg" width="56" height="24" viewBox="0 0 56 24">
                        <defs>
                          <linearGradient id="sparklineBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Gradient Area Fill */}
                        <polygon
                          fill="url(#sparklineBlue)"
                          points="2,22 2,16 10,12 18,15 28,7 38,11 48,3 54,6 54,22"
                        />
                        {/* Trend Line */}
                        <polyline
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points="2,16 10,12 18,15 28,7 38,11 48,3 54,6"
                        />
                        {/* Endpoint Pulse Dot */}
                        <circle cx="54" cy="6" r="2.5" fill="#3b82f6" className="sparkline-dot" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer: Trend Indicator with Up Arrow */}
              <div className="stat-card-footer">
                <div className="stat-card-trend">
                  <TrendingUp size={14} className="trend-arrow-icon" />
                  <span className="trend-text">{card.trend}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsCards;
