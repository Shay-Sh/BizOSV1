'use client';

import { useState } from 'react';
import { FilterBar } from '@/components/ui/filter-bar';
import { Button } from '@/components/ui/button';
import { DashboardGrid } from '@/components/dashboard/dashboard-grid';
import { AgentCard } from '@/components/agents/AgentCard';

export default function MarketplacePage() {
  const [category, setCategory] = useState('all');
  
  // Filter categories for marketplace
  const filterCategories = [
    {
      name: 'category',
      label: 'Category',
      options: [
        { label: 'All Categories', value: 'all' },
        { label: 'Content Creation', value: 'content' },
        { label: 'Data Analysis', value: 'data' },
        { label: 'Customer Support', value: 'support' },
        { label: 'Finance', value: 'finance' },
        { label: 'Marketing', value: 'marketing' },
      ],
    },
    {
      name: 'pricing',
      label: 'Pricing',
      options: [
        { label: 'All Pricing', value: 'all' },
        { label: 'Free', value: 'free' },
        { label: 'Premium', value: 'premium' },
        { label: 'Enterprise', value: 'enterprise' },
      ],
    },
    {
      name: 'sort',
      label: 'Sort By',
      options: [
        { label: 'Most Popular', value: 'popular' },
        { label: 'Newest', value: 'newest' },
        { label: 'Highest Rated', value: 'rating' },
      ],
    },
  ];

  // Mock data for featured agents
  const featuredAgents = [
    {
      id: '1',
      name: 'Content Writer Pro',
      description: 'AI agent that generates high-quality blog posts, social media content, and marketing copy.',
      category: 'content',
      pricing: 'premium',
      rating: 4.8,
      reviews: 128,
      downloads: 1250,
      image: '🖋️',
    },
    {
      id: '2',
      name: 'Data Insights Analyzer',
      description: 'Analyze complex datasets and generate visualizations and insights automatically.',
      category: 'data',
      pricing: 'enterprise',
      rating: 4.9,
      reviews: 87,
      downloads: 930,
      image: '📊',
    },
    {
      id: '3',
      name: 'Customer Support Assistant',
      description: 'Handle customer inquiries, provide solutions, and escalate when needed.',
      category: 'support',
      pricing: 'premium',
      rating: 4.7,
      reviews: 215,
      downloads: 1840,
      image: '🎧',
    },
  ];

  // Mock data for marketplace agents
  const marketplaceAgents = [
    {
      id: '4',
      name: 'Email Campaign Manager',
      description: 'Create, schedule, and analyze email marketing campaigns with smart A/B testing.',
      category: 'marketing',
      pricing: 'premium',
      rating: 4.6,
      reviews: 93,
      downloads: 780,
      image: '📧',
    },
    {
      id: '5',
      name: 'Financial Advisor',
      description: 'Provide financial insights, budget recommendations, and investment advice.',
      category: 'finance',
      pricing: 'enterprise',
      rating: 4.8,
      reviews: 76,
      downloads: 650,
      image: '💰',
    },
    {
      id: '6',
      name: 'Social Media Manager',
      description: 'Schedule posts, engage with followers, and analyze performance across platforms.',
      category: 'marketing',
      pricing: 'premium',
      rating: 4.7,
      reviews: 124,
      downloads: 980,
      image: '📱',
    },
    {
      id: '7',
      name: 'Text Summarizer',
      description: 'Automatically generate concise summaries of long documents and articles.',
      category: 'content',
      pricing: 'free',
      rating: 4.5,
      reviews: 210,
      downloads: 2100,
      image: '📝',
    },
    {
      id: '8',
      name: 'Meeting Note Taker',
      description: 'Transcribe meetings and generate structured notes with action items.',
      category: 'content',
      pricing: 'premium',
      rating: 4.6,
      reviews: 87,
      downloads: 720,
      image: '📓',
    },
    {
      id: '9',
      name: 'Sales Assistant',
      description: 'Qualify leads, schedule follow-ups, and prepare sales materials.',
      category: 'marketing',
      pricing: 'enterprise',
      rating: 4.7,
      reviews: 65,
      downloads: 540,
      image: '🤝',
    },
  ];

  const handleSearch = (value: string) => {
    console.log('Search:', value);
  };

  const handleFilterChange = (category: string, value: string) => {
    if (category === 'category') {
      setCategory(value);
    }
    console.log(`Filter changed: ${category} = ${value}`);
  };

  const handleClearFilters = () => {
    setCategory('all');
    console.log('Filters cleared');
  };

  const handleDeploy = (id: string) => {
    console.log(`Deploying agent ${id}`);
    // In a real app, this would initiate the deployment process
  };

  // Filter agents based on selected category
  const filteredAgents = marketplaceAgents.filter(agent => {
    if (category === 'all') return true;
    return agent.category === category;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Agent Marketplace</h1>
          <p className="text-muted-foreground">Discover and deploy AI agents for your specific needs</p>
        </div>
      </div>

      <FilterBar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filterCategories={filterCategories}
        placeholder="Search agents..."
      />

      {/* Featured Agents */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Featured Agents</h2>
        <DashboardGrid>
          {featuredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              id={agent.id}
              name={agent.name}
              description={agent.description}
              image={agent.image}
              category={agent.category}
              pricing={agent.pricing as any}
              rating={agent.rating}
              reviews={agent.reviews}
              downloads={agent.downloads}
              isInMarketplace={true}
              onDeploy={handleDeploy}
              className="col-span-4"
            />
          ))}
        </DashboardGrid>
      </div>

      {/* All Agents */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">All Agents</h2>
        <DashboardGrid>
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              id={agent.id}
              name={agent.name}
              description={agent.description}
              image={agent.image}
              category={agent.category}
              pricing={agent.pricing as any}
              rating={agent.rating}
              reviews={agent.reviews}
              downloads={agent.downloads}
              isInMarketplace={true}
              onDeploy={handleDeploy}
              className="col-span-4"
            />
          ))}
        </DashboardGrid>
      </div>
    </div>
  );
} 