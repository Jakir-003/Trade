import { useQuery } from "@tanstack/react-query";
import { MarketNews } from "@shared/schema";
import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewsIntegration() {
  const { data: news } = useQuery<MarketNews[]>({
    queryKey: ["/api/news"],
    refetchInterval: 60000,
  });

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'bg-[var(--danger-red)] text-white';
      case 'medium':
        return 'bg-[var(--warning-amber)] text-white';
      case 'low':
        return 'bg-[var(--success-green)] text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getIndicatorColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'bg-[var(--danger-red)]';
      case 'medium':
        return 'bg-[var(--warning-amber)]';
      case 'low':
        return 'bg-[var(--success-green)]';
      default:
        return 'bg-gray-600';
    }
  };

  const mockNews = [
    {
      id: 1,
      title: "EUR GDP Growth Rate",
      description: "Expected: 0.3% | Previous: 0.2%",
      impact: "LOW",
      eventTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    },
    {
      id: 2,
      title: "USD Non-Farm Payrolls",
      description: "Expected: 200K | Previous: 185K",
      impact: "MEDIUM",
      eventTime: new Date(Date.now() + 3.5 * 60 * 60 * 1000), // 3.5 hours from now
    },
    {
      id: 3,
      title: "Federal Reserve Speech",
      description: "Chairman Powell on monetary policy",
      impact: "HIGH",
      eventTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    },
  ];

  const displayNews = news && news.length > 0 ? news : mockNews;

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  return (
    <div className="trading-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Newspaper className="text-[var(--accent-blue)]" size={20} />
          <span>Market News & Events</span>
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-[var(--accent-blue)] hover:text-blue-400"
        >
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {displayNews.map((event) => (
          <div
            key={event.id}
            className="flex items-start space-x-4 p-3 bg-[var(--dark-primary)] rounded-lg"
          >
            <div className="flex-shrink-0">
              <div className={`w-3 h-3 ${getIndicatorColor(event.impact)} rounded-full mt-2`}></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{event.title}</span>
                <span className="text-xs text-[var(--text-muted)]">
                  {formatTime(event.eventTime)}
                </span>
              </div>
              <p className="text-sm text-[var(--text-muted)]">{event.description}</p>
              <span className={`inline-block mt-1 text-xs px-2 py-1 rounded ${getImpactColor(event.impact)}`}>
                {event.impact} Impact
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
