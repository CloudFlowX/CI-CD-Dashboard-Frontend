import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import './PipelineRunsChart.css';

const weekData = [
  { day: 'Mon', successful: 35, failed: 5, running: 8 },
  { day: 'Tue', successful: 28, failed: 8, running: 12 },
  { day: 'Wed', successful: 42, failed: 3, running: 6 },
  { day: 'Thu', successful: 38, failed: 6, running: 10 },
  { day: 'Fri', successful: 45, failed: 4, running: 7 },
  { day: 'Sat', successful: 20, failed: 2, running: 4 },
  { day: 'Sun', successful: 15, failed: 1, running: 3 }
];

const lastWeekData = [
  { day: 'Mon', successful: 30, failed: 7, running: 5 },
  { day: 'Tue', successful: 32, failed: 4, running: 9 },
  { day: 'Wed', successful: 25, failed: 9, running: 11 },
  { day: 'Thu', successful: 40, failed: 2, running: 8 },
  { day: 'Fri', successful: 48, failed: 5, running: 6 },
  { day: 'Sat', successful: 18, failed: 3, running: 2 },
  { day: 'Sun', successful: 12, failed: 2, running: 4 }
];

const monthData = [
  { day: 'Mon', successful: 38, failed: 4, running: 7 },
  { day: 'Tue', successful: 35, failed: 6, running: 10 },
  { day: 'Wed', successful: 44, failed: 2, running: 8 },
  { day: 'Thu', successful: 41, failed: 5, running: 9 },
  { day: 'Fri', successful: 50, failed: 3, running: 5 },
  { day: 'Sat', successful: 22, failed: 1, running: 3 },
  { day: 'Sun', successful: 18, failed: 2, running: 2 }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((acc, entry) => acc + (entry.value || 0), 0);
    return (
      <div className="pipeline-runs-tooltip">
        <div className="pipeline-runs-tooltip-header">
          <span className="pipeline-runs-tooltip-day">{label}</span>
          <span className="pipeline-runs-tooltip-total">{total} runs</span>
        </div>
        <div className="pipeline-runs-tooltip-divider" />
        <div className="pipeline-runs-tooltip-list">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="pipeline-runs-tooltip-item">
              <span
                className="pipeline-runs-tooltip-dot"
                style={{ backgroundColor: entry.color }}
              />
              <span className="pipeline-runs-tooltip-name">{entry.name}:</span>
              <span className="pipeline-runs-tooltip-value">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const PipelineRunsChart = () => {
  const [timeframe, setTimeframe] = useState('This Week');
  const [isOpen, setIsOpen] = useState(false);
  const [visibleLines, setVisibleLines] = useState({
    successful: true,
    failed: true,
    running: true
  });

  const getChartData = () => {
    switch (timeframe) {
      case 'Last Week':
        return lastWeekData;
      case 'Last 30 Days':
        return monthData;
      default:
        return weekData;
    }
  };

  const timeframeOptions = ['This Week', 'Last Week', 'Last 30 Days'];

  const toggleLine = (key) => {
    setVisibleLines((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="pipeline-runs-card">
      <div className="pipeline-runs-header">
        <div className="pipeline-runs-title-group">
          <h3 className="pipeline-runs-title">Pipeline Runs</h3>
          <div className="pipeline-runs-legend">
            <button
              type="button"
              className={`pipeline-runs-legend-item ${!visibleLines.successful ? 'dimmed' : ''}`}
              onClick={() => toggleLine('successful')}
              title="Toggle Successful visibility"
            >
              <span className="pipeline-runs-legend-dot green">●</span>
              <span>Successful</span>
            </button>
            <button
              type="button"
              className={`pipeline-runs-legend-item ${!visibleLines.failed ? 'dimmed' : ''}`}
              onClick={() => toggleLine('failed')}
              title="Toggle Failed visibility"
            >
              <span className="pipeline-runs-legend-dot red">●</span>
              <span>Failed</span>
            </button>
            <button
              type="button"
              className={`pipeline-runs-legend-item ${!visibleLines.running ? 'dimmed' : ''}`}
              onClick={() => toggleLine('running')}
              title="Toggle Running visibility"
            >
              <span className="pipeline-runs-legend-dot blue">●</span>
              <span>Running</span>
            </button>
          </div>
        </div>

        <div className="pipeline-runs-dropdown-container">
          <button
            type="button"
            className="pipeline-runs-dropdown-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{timeframe}</span>
            <ChevronDown size={14} className={`dropdown-arrow ${isOpen ? 'open' : ''}`} />
          </button>

          {isOpen && (
            <div className="pipeline-runs-dropdown-menu">
              {timeframeOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`pipeline-runs-dropdown-option ${timeframe === option ? 'selected' : ''}`}
                  onClick={() => {
                    setTimeframe(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pipeline-runs-chart-container">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={getChartData()}
            margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border, #1e293b)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--text-secondary, #94a3b8)', fontSize: 12, fontFamily: 'Inter, sans-serif' }}
              dy={10}
            />
            <YAxis
              domain={[0, 50]}
              ticks={[0, 10, 20, 30, 40, 50]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--text-secondary, #94a3b8)', fontSize: 12, fontFamily: 'Inter, sans-serif' }}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            {visibleLines.successful && (
              <Line
                type="monotone"
                dataKey="successful"
                name="Successful"
                stroke="var(--accent-green, #22c55e)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#22c55e', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#22c55e', stroke: 'var(--bg-card, #1a1f2e)', strokeWidth: 2 }}
              />
            )}
            {visibleLines.failed && (
              <Line
                type="monotone"
                dataKey="failed"
                name="Failed"
                stroke="var(--accent-red, #ef4444)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#ef4444', stroke: 'var(--bg-card, #1a1f2e)', strokeWidth: 2 }}
              />
            )}
            {visibleLines.running && (
              <Line
                type="monotone"
                dataKey="running"
                name="Running"
                stroke="var(--accent-blue, #3b82f6)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#3b82f6', stroke: 'var(--bg-card, #1a1f2e)', strokeWidth: 2 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PipelineRunsChart;
