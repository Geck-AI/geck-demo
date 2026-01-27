'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle, TrendingDown, TrendingUp, Bot, Users } from 'lucide-react';

interface AgentStats {
  total: number;
  filtered: number;
  byAgent: Record<string, number>;
  byType: Record<string, number>;
  recent: Array<{
    timestamp: string;
    agentName: string;
    agentType: string;
    url: string;
  }>;
}

interface ConversionStats {
  total: number;
  byAgent: Record<string, number>;
  byType: Record<string, number>;
  byConversionType: Record<string, number>;
  totalValue: number;
}

export default function AgentTrafficDashboard() {
  const [agentStats, setAgentStats] = useState<AgentStats | null>(null);
  const [conversionStats, setConversionStats] = useState<ConversionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [agentRes, conversionRes] = await Promise.all([
        fetch('/api/analytics/agent-visit'),
        fetch('/api/analytics/conversion'),
      ]);

      if (!agentRes.ok || !conversionRes.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const agentData = await agentRes.json();
      const conversionData = await conversionRes.json();

      setAgentStats(agentData);
      setConversionStats(conversionData);

      // Check for traffic drops
      checkTrafficAlerts(agentData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const checkTrafficAlerts = (stats: AgentStats) => {
    const alertsList: string[] = [];
    const highValueAgents = ['GPTBot', 'PerplexityBot', 'Google-Extended', 'Anthropic-WebFetcher'];

    // This is a simplified check - in production, you'd compare against historical data
    highValueAgents.forEach(agent => {
      const count = stats.byAgent[agent] || 0;
      if (count === 0) {
        alertsList.push(`⚠️ ${agent} has no visits in the current period`);
      }
    });

    setAlerts(alertsList);
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-white" role="main" aria-label="Agent traffic dashboard">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800 mx-auto" aria-hidden="true"></div>
            <p className="text-stone-600 mt-4">Loading statistics...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-8 bg-white" role="main" aria-label="Agent traffic dashboard">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-white" role="main" aria-label="Agent traffic dashboard">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Agent Traffic Dashboard</h1>
        <p className="text-stone-600 mb-8">
          Monitor AI bot visits and their impact on your site
        </p>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Traffic Alerts</h3>
                <ul className="list-disc list-inside space-y-1 text-yellow-700">
                  {alerts.map((alert, idx) => (
                    <li key={idx}>{alert}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Bot className="w-6 h-6 text-blue-600" aria-hidden="true" />
              <h3 className="text-sm font-medium text-stone-600">Total Agent Visits</h3>
            </div>
            <p className="text-3xl font-bold text-stone-900">{agentStats?.total || 0}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-green-600" aria-hidden="true" />
              <h3 className="text-sm font-medium text-stone-600">AI Bot Visits</h3>
            </div>
            <p className="text-3xl font-bold text-stone-900">
              {agentStats?.byType['ai_bot'] || 0}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-purple-600" aria-hidden="true" />
              <h3 className="text-sm font-medium text-stone-600">Total Conversions</h3>
            </div>
            <p className="text-3xl font-bold text-stone-900">{conversionStats?.total || 0}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-6 h-6 text-orange-600" aria-hidden="true" />
              <h3 className="text-sm font-medium text-stone-600">Conversion Value</h3>
            </div>
            <p className="text-3xl font-bold text-stone-900">
              ${(conversionStats?.totalValue || 0).toFixed(2)}
            </p>
          </Card>
        </div>

        {/* Agent Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Visits by Agent</h2>
            <div className="space-y-3">
              {Object.entries(agentStats?.byAgent || {})
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([agent, count]) => (
                  <div key={agent} className="flex items-center justify-between">
                    <span className="text-stone-700">{agent}</span>
                    <span className="font-semibold text-stone-900">{count}</span>
                  </div>
                ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Visits by Type</h2>
            <div className="space-y-3">
              {Object.entries(agentStats?.byType || {}).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-stone-700 capitalize">{type.replace('_', ' ')}</span>
                  <span className="font-semibold text-stone-900">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Conversion Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Conversions by Agent</h2>
            <div className="space-y-3">
              {Object.entries(conversionStats?.byAgent || {})
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([agent, count]) => (
                  <div key={agent} className="flex items-center justify-between">
                    <span className="text-stone-700">{agent}</span>
                    <span className="font-semibold text-stone-900">{count}</span>
                  </div>
                ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Conversions by Type</h2>
            <div className="space-y-3">
              {Object.entries(conversionStats?.byConversionType || {}).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-stone-700 capitalize">{type.replace('_', ' ')}</span>
                  <span className="font-semibold text-stone-900">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Visits */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Agent Visits</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-2 px-4 font-semibold">Time</th>
                  <th className="text-left py-2 px-4 font-semibold">Agent</th>
                  <th className="text-left py-2 px-4 font-semibold">Type</th>
                  <th className="text-left py-2 px-4 font-semibold">URL</th>
                </tr>
              </thead>
              <tbody>
                {agentStats?.recent.slice(-20).reverse().map((visit, idx) => (
                  <tr key={idx} className="border-b border-stone-100">
                    <td className="py-2 px-4 text-stone-600">
                      {new Date(visit.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 font-medium">{visit.agentName}</td>
                    <td className="py-2 px-4 text-stone-600 capitalize">
                      {visit.agentType.replace('_', ' ')}
                    </td>
                    <td className="py-2 px-4 text-stone-600 truncate max-w-xs">
                      {visit.url}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}

