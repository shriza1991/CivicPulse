import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../core/hooks/usePageTitle';
import { LandingHero } from '../../features/reporting/components/LandingHero';
import { DiscoverFeed } from '../../features/reporting/components/DiscoverFeed';

export const HomePage: React.FC = () => {
  usePageTitle('CommonGround — Community Demand Intelligence');
  const navigate = useNavigate();

  return (
    <div className="space-y-6 font-sans">
      <LandingHero
        onStartReport={(mode) => navigate(mode ? `/report?mode=${mode}` : '/report')}
        onBrowseMap={() => navigate('/tracker')}
      />
      <DiscoverFeed />
    </div>
  );
};

export default HomePage;
