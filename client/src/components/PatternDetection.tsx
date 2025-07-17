import { useQuery } from "@tanstack/react-query";
import { CandlestickPattern } from "@shared/schema";
import { Search } from "lucide-react";

export default function PatternDetection() {
  const { data: patterns } = useQuery<CandlestickPattern[]>({
    queryKey: ["/api/patterns"],
    refetchInterval: 30000,
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'border-[var(--success-green)]/20 text-[var(--success-green)]';
      case 'forming':
        return 'border-[var(--warning-amber)]/20 text-[var(--warning-amber)]';
      case 'weak':
        return 'border-gray-600 text-[var(--text-muted)]';
      case 'pending':
        return 'border-[var(--accent-blue)]/20 text-[var(--accent-blue)]';
      default:
        return 'border-gray-600 text-[var(--text-muted)]';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-[var(--success-green)]';
    if (confidence >= 60) return 'text-[var(--warning-amber)]';
    return 'text-[var(--text-muted)]';
  };

  const mockPatterns = [
    {
      id: 1,
      patternName: "Inside Bar",
      status: "Active",
      confidence: 87,
      description: "Strong reversal signal with volume confirmation"
    },
    {
      id: 2,
      patternName: "Doji",
      status: "Forming",
      confidence: 62,
      description: "Indecision pattern, wait for confirmation"
    },
    {
      id: 3,
      patternName: "Hammer",
      status: "Weak",
      confidence: 34,
      description: "Pattern detected but lacks volume support"
    },
    {
      id: 4,
      patternName: "Engulfing Bull",
      status: "Pending",
      confidence: 78,
      description: "Bullish engulfing pattern in development"
    }
  ];

  const displayPatterns = patterns && patterns.length > 0 ? patterns : mockPatterns;

  return (
    <div className="trading-card rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <Search className="text-[var(--accent-blue)]" size={20} />
        <span>Pattern Detection</span>
        <span className="text-sm bg-[var(--accent-blue)]/20 text-[var(--accent-blue)] px-2 py-1 rounded-full">
          {displayPatterns.length} Active
        </span>
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {displayPatterns.map((pattern) => (
          <div
            key={pattern.id || Math.random()}
            className={`bg-[var(--dark-primary)] rounded-lg p-4 border ${getStatusColor(pattern.status)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`font-semibold ${getStatusColor(pattern.status).split(' ')[1]}`}>
                {pattern.patternName}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(pattern.status).replace('text-', 'bg-').replace('[var(--', '').replace(')]', '/20')}`}>
                {pattern.status}
              </span>
            </div>
            <div className="text-sm text-[var(--text-muted)] mb-3">
              {pattern.description}
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-muted)]">Confidence:</span>
              <span className={`font-semibold ${getConfidenceColor(pattern.confidence)}`}>
                {pattern.confidence}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
