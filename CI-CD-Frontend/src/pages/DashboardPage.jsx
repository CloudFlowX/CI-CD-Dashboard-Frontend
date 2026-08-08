import React from 'react';
import StatsCards from '../components/StatsCards';
import PipelineRunsChart from '../components/PipelineRunsChart';
import RecentPipelines from '../components/RecentPipelines';
import PipelineActivity from '../components/PipelineActivity';
import LiveLogs from '../components/LiveLogs';
import PipelineDetails from '../components/PipelineDetails';
import Artifacts from '../components/Artifacts';
import Deployment from '../components/Deployment';
import Repositories from '../components/Repositories';
import './DashboardPage.css';

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <StatsCards />
      <div className="dashboard-middle-row">
        <PipelineRunsChart />
        <RecentPipelines />
        <PipelineActivity />
      </div>
      <div className="dashboard-bottom-row">
        <LiveLogs />
        <PipelineDetails />
      </div>
      <div className="dashboard-details-row">
        <Artifacts />
        <Deployment />
      </div>
      <div className="dashboard-repos-row">
        <Repositories />
      </div>
    </div>
  );
}
