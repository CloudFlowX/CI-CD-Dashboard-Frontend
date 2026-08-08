import React, { useState, useEffect } from 'react';
import { ExternalLink, Server } from 'lucide-react';
import ApiClient from '../utils/api';
import './Deployment.css';

const Deployment = () => {
  const [deployments, setDeployments] = useState([]);

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const res = await ApiClient.get('/pipelines');
        if (res.success && res.pipelines) {
          const mapped = res.pipelines.slice(0, 3).map(p => ({
            id: p._id,
            environment: p.environment || 'Production',
            namespace: p.name.toLowerCase().replace(/\s+/g, '-'),
            replica: '1/1',
            status: p.status === 'success' ? 'Running' : (p.status.charAt(0).toUpperCase() + p.status.slice(1)),
            url: `https://${p.name.toLowerCase().replace(/\s+/g, '-')}.internal`
          }));
          setDeployments(mapped);
        }
      } catch (error) {
        console.error('Error fetching deployments:', error);
      }
    };
    fetchDeployments();
  }, []);

  return (
    <div className="deployment-card">
      <div className="deployment-header">
        <div className="deployment-title-wrapper">
          <Server className="deployment-title-icon" size={18} />
          <h3 className="deployment-title">Deployment</h3>
        </div>
      </div>

      <div className="deployment-table-wrapper">
        <table className="deployment-table">
          <thead>
            <tr>
              <th>Environment</th>
              <th>Namespace</th>
              <th>Replica</th>
              <th>Status</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {deployments.map((item) => (
              <tr key={item.id}>
                <td className="env-cell">{item.environment}</td>
                <td className="namespace-cell">{item.namespace}</td>
                <td className="replica-cell">{item.replica}</td>
                <td className="status-cell">
                  <div className="status-indicator">
                    <span className="green-dot"></span>
                    <span className="status-text">{item.status}</span>
                  </div>
                </td>
                <td className="url-cell">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="deployment-link"
                  >
                    <span>{item.url}</span>
                    <ExternalLink size={14} className="external-icon" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Deployment;
