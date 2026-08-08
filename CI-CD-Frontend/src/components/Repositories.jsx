import React, { useState } from 'react';
import { Search, Plus, GitBranch, ChevronDown } from 'lucide-react';
import ApiClient from '../utils/api';
import './Repositories.css';

const Repositories = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('All Providers');
  const [repositories, setRepositories] = useState([]);

  React.useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await ApiClient.get('/repositories');
        if (res.success && res.repositories) {
          const mapped = res.repositories.map(repo => ({
            id: repo._id,
            name: repo.name,
            path: repo.githubUrl.replace('https://github.com/', ''),
            branch: repo.branch || 'main',
            provider: repo.githubUrl.includes('gitlab') ? 'GitLab' : 'GitHub',
            statusDotColor: repo.status === 'active' ? '#22c55e' : '#ef4444',
            statusDotType: repo.status === 'active' ? 'green' : 'red',
            connected: repo.status === 'active',
            updatedAt: 'Updated just now',
          }));
          setRepositories(mapped);
        }
      } catch (error) {
        console.error('Error fetching dashboard repos:', error);
      }
    };
    fetchRepos();
  }, []);

  // Filter repos based on search query and selected provider
  const filteredRepositories = repositories.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.path.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProvider =
      selectedProvider === 'All Providers' ||
      repo.provider.toLowerCase() === selectedProvider.toLowerCase();

    return matchesSearch && matchesProvider;
  });

  const renderProviderIcon = (provider) => {
    if (provider === 'GitHub') {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="repo-provider-icon github">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      );
    }
    if (provider === 'GitLab') {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="repo-provider-icon gitlab">
          <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 01-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 014.82 2a.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0118.6 2a.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.51L23 13.45a.84.84 0 01-.35.94z"/>
        </svg>
      );
    }
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="repo-provider-icon">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    );
  };

  return (
    <div className="repositories-card">
      {/* Header Row */}
      <div className="repositories-header">
        <h2 className="repositories-title">Repositories</h2>
        
        <div className="repositories-header-actions">
          <a
            href="#view-all-repos"
            className="repositories-view-all"
            onClick={(e) => e.preventDefault()}
          >
            View All
          </a>
          <button
            className="repositories-connect-btn"
            onClick={() => alert('Connect Repository modal opened')}
          >
            <Plus size={14} />
            Connect Repository
          </button>
        </div>
      </div>

      {/* Search + Filter Row */}
      <div className="repositories-filter-row">
        <div className="repositories-search-wrapper">
          <Search size={16} className="repositories-search-icon" />
          <input
            type="text"
            className="repositories-search-input"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="repositories-provider-wrapper">
          <select
            className="repositories-provider-select"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
          >
            <option value="All Providers">All Providers</option>
            <option value="GitHub">GitHub</option>
            <option value="GitLab">GitLab</option>
          </select>
          <ChevronDown size={14} className="repositories-select-arrow" />
        </div>
      </div>

      {/* Repository List */}
      <div className="repositories-list">
        {filteredRepositories.length > 0 ? (
          filteredRepositories.map((repo, index) => (
            <div key={repo.id} className="repositories-item">
              {/* Left Column: Status dot + Name stacked with path */}
              <div className="repositories-item-left">
                <span
                  className="repositories-status-dot"
                  style={{ backgroundColor: repo.statusDotColor }}
                  title={`Status dot: ${repo.statusDotType}`}
                />
                <div className="repositories-name-stack">
                  <span className="repositories-name">{repo.name}</span>
                  <span className="repositories-path">{repo.path}</span>
                </div>
              </div>

              {/* Branch Badge */}
              <div className="repositories-item-branch">
                <span className="repositories-branch-badge">
                  <GitBranch size={12} className="repositories-branch-icon" />
                  {repo.branch}
                </span>
              </div>

              {/* Provider Icon */}
              <div className="repositories-item-provider">
                {renderProviderIcon(repo.provider)}
              </div>

              {/* Connection Status */}
              <div className="repositories-item-status">
                <span className="repositories-connected-dot" />
                <span className="repositories-connected-text">Connected</span>
              </div>

              {/* Timestamp */}
              <div className="repositories-item-timestamp">
                <span className="repositories-timestamp">{repo.updatedAt}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="repositories-empty-state">
            <p>No repositories match your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Repositories;
