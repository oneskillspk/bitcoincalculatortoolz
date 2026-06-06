import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  MapPin,
  Zap,
  CheckCircle2,
  ArrowRight,
  Route as RouteIcon,
  Timer,
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  Info
} from "lucide-react";
import { formatSats, formatPercent, LIGHTNING_CONSTANTS } from "@/services/lightningFeeCalculator";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface RouteNode {
  id: string;
  alias: string;
  type: 'sender' | 'router' | 'receiver';
  baseFee: number;
  feeRate: number;
  capacity: number;
  feeSats: number;
}

interface PaymentRoute {
  id: string;
  name: string;
  description: string;
  nodes: RouteNode[];
  totalFee: number;
  reliability: number;
  estimatedTime: string;
  isOptimal: boolean;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeColor: string;
}

interface RouteFinderVisualizationProps {
  amountSats: number;
  estimatedHops: number;
  baseFeePerHop: number;
  feeRatePpm: number;
  btcPriceUsd: number;
  isLoading: boolean;
}

const NODE_ALIASES = [
  "ACINQ", "Kraken", "Bitfinex", "River", "OpenNode",
  "LNBig", "Wallet of Satoshi", "Lightning Labs", "Blockstream",
  "CoinGate", "Strike", "Fold", "Breez", "Muun", "Phoenix"
];

const getRandomAlias = (index: number): string => NODE_ALIASES[index % NODE_ALIASES.length];

const calculateHopFee = (amountSats: number, baseFee: number, feeRate: number): number => {
  const baseFeeInSats = baseFee / LIGHTNING_CONSTANTS.MSAT_PER_SAT;
  const proportionalFee = (amountSats * feeRate) / 1_000_000;
  return baseFeeInSats + proportionalFee;
};

const generateRoutes = (
  amountSats: number,
  estimatedHops: number,
  baseFeePerHop: number,
  feeRatePpm: number,
  isTr: boolean
): PaymentRoute[] => {
  const createNodes = (hopCount: number, baseMultiplier: number, rateMultiplier: number, capacityBase: number): RouteNode[] => {
    const nodes: RouteNode[] = [{
      id: 'sender',
      alias: isTr ? 'Sen' : 'You',
      type: 'sender',
      baseFee: 0,
      feeRate: 0,
      capacity: amountSats * 2,
      feeSats: 0,
    }];

    for (let i = 0; i < hopCount; i++) {
      const nodeFee = baseFeePerHop * baseMultiplier * (0.8 + Math.random() * 0.4);
      const nodeRate = feeRatePpm * rateMultiplier * (0.7 + Math.random() * 0.6);
      const feeSats = calculateHopFee(amountSats, nodeFee, nodeRate);
      nodes.push({
        id: `router-${i}`,
        alias: getRandomAlias(i + Math.floor(baseMultiplier * 10)),
        type: 'router',
        baseFee: Math.round(nodeFee),
        feeRate: Math.round(nodeRate),
        capacity: capacityBase * (1 + i * 0.3) * 1_000_000,
        feeSats,
      });
    }

    nodes.push({
      id: 'receiver',
      alias: isTr ? 'Alıcı' : 'Recipient',
      type: 'receiver',
      baseFee: 0,
      feeRate: 0,
      capacity: amountSats * 2,
      feeSats: 0,
    });

    return nodes;
  };

  const directNodes = createNodes(Math.min(2, estimatedHops), 1.8, 1.5, 10);
  const standardNodes = createNodes(estimatedHops, 1.0, 1.0, 5);
  const reliableHops = Math.min(estimatedHops + 2, LIGHTNING_CONSTANTS.MAX_HOPS);
  const reliableNodes = createNodes(reliableHops, 0.6, 0.7, 8);
  const economyNodes = createNodes(estimatedHops + 1, 0.4, 0.5, 3);

  return [
    {
      id: 'direct',
      name: isTr ? 'Doğrudan Yol' : 'Direct Path',
      description: isTr ? 'En az atlama, daha yüksek bireysel ücretler' : 'Fewest hops, higher individual fees',
      nodes: directNodes,
      totalFee: directNodes.reduce((sum, n) => sum + n.feeSats, 0),
      reliability: 70 + Math.random() * 15,
      estimatedTime: '~1 sn',
      isOptimal: false,
      icon: Timer,
      color: 'text-blue-500',
      badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    },
    {
      id: 'standard',
      name: isTr ? 'Optimal Rota' : 'Optimal Route',
      description: isTr ? 'Ücret ve güvenilirlik açısından en iyi denge' : 'Best balance of fees and reliability',
      nodes: standardNodes,
      totalFee: standardNodes.reduce((sum, n) => sum + n.feeSats, 0),
      reliability: 85 + Math.random() * 10,
      estimatedTime: '~2 sn',
      isOptimal: true,
      icon: Zap,
      color: 'text-yellow-500',
      badgeColor: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    },
    {
      id: 'reliable',
      name: isTr ? 'Yüksek Güvenilirlik' : 'High Reliability',
      description: isTr ? 'İyi bağlı düğümler üzerinden daha fazla atlama' : 'More hops through well-connected nodes',
      nodes: reliableNodes,
      totalFee: reliableNodes.reduce((sum, n) => sum + n.feeSats, 0),
      reliability: 92 + Math.random() * 7,
      estimatedTime: '~3 sn',
      isOptimal: false,
      icon: ShieldCheck,
      color: 'text-success',
      badgeColor: 'bg-success/10 text-success border-success/20',
    },
    {
      id: 'economy',
      name: isTr ? 'En Düşük Ücret' : 'Lowest Fees',
      description: isTr ? 'Yönlendirme maliyetleri minimize edildi' : 'Minimized routing costs',
      nodes: economyNodes,
      totalFee: economyNodes.reduce((sum, n) => sum + n.feeSats, 0),
      reliability: 75 + Math.random() * 15,
      estimatedTime: '~2 sn',
      isOptimal: false,
      icon: TrendingDown,
      color: 'text-purple-500',
      badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    },
  ];
};

export const RouteFinderVisualization = ({
  amountSats,
  estimatedHops,
  baseFeePerHop,
  feeRatePpm,
  btcPriceUsd,
  isLoading,
}: RouteFinderVisualizationProps) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('standard');
  const { language } = useLanguage();
  const isTr = language === 'tr';

  const routes = useMemo(() => {
    if (amountSats <= 0) return [];
    return generateRoutes(amountSats, estimatedHops, baseFeePerHop, feeRatePpm, isTr);
  }, [amountSats, estimatedHops, baseFeePerHop, feeRatePpm, isTr]);

  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[1];

  if (amountSats <= 0 || routes.length === 0) {
    return (
      <Card className="bg-card border-border/50">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-3">
            <RouteIcon className="w-12 h-12 text-muted-foreground/30 mx-auto" />
            <p className="text-sm text-muted-foreground">
              {isTr ? 'Rota seçeneklerini görmek için bir ödeme tutarı girin' : 'Enter a payment amount to see route options'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <RouteIcon className="w-4 h-4 text-primary" />
          </div>
          {isTr ? 'Ödeme Rota Bulucu' : 'Payment Route Finder'}
          <Badge variant="outline" className="ml-auto text-[10px] font-normal">
            {isTr ? 'Eğitim Amaçlı' : 'Educational'}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {routes.map((route) => {
            const Icon = route.icon;
            const isSelected = route.id === selectedRouteId;
            const hopCount = route.nodes.length - 2;

            return (
              <button
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={cn(
                  "relative p-3 rounded-lg border text-left transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border/50 bg-card/30 hover:border-border"
                )}
              >
                {route.isOptimal && (
                  <Badge className="absolute -top-2 -right-2 text-[9px] px-1.5 py-0.5 bg-yellow-500 text-black">
                    {isTr ? 'En İyi' : 'Best'}
                  </Badge>
                )}
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon className={cn("w-4 h-4", route.color)} />
                  <span className="text-xs font-medium truncate">{route.name}</span>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-foreground">{formatSats(route.totalFee)}</div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{hopCount} {isTr ? (hopCount !== 1 ? 'atlama' : 'atlama') : (hopCount !== 1 ? 'hops' : 'hop')}</span>
                    <span>{route.reliability.toFixed(0)}%</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {selectedRoute && (
          <div className="bg-muted/30 rounded-xl p-4 border border-border/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <selectedRoute.icon className={cn("w-5 h-5", selectedRoute.color)} />
                <div>
                  <h4 className="text-sm font-medium">{selectedRoute.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{selectedRoute.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{formatSats(selectedRoute.totalFee)}</div>
                <div className="text-[10px] text-muted-foreground">
                  {formatPercent((selectedRoute.totalFee / amountSats) * 100)} {isTr ? 'ödemenin' : 'of payment'}
                </div>
              </div>
            </div>

            <ScrollArea className="w-full">
              <div className="flex items-center gap-1 py-3 min-w-max">
                {selectedRoute.nodes.map((node, index) => (
                  <div key={node.id} className="flex items-center">
                    <div className="flex flex-col items-center transition-transform hover:scale-105">
                      <div
                        className={cn(
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all",
                          node.type === 'sender' && "bg-primary/10 border-primary text-primary",
                          node.type === 'router' && "bg-blue-500/10 border-blue-500/50 text-blue-500",
                          node.type === 'receiver' && "bg-success/10 border-success text-success"
                        )}
                      >
                        {node.type === 'sender' && <Zap className="w-4 h-4 sm:w-5 sm:h-5" />}
                        {node.type === 'router' && <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />}
                        {node.type === 'receiver' && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </div>
                      <div className="mt-1.5 text-center max-w-[60px] sm:max-w-[80px]">
                        <div className="text-[10px] sm:text-xs font-medium truncate">{node.alias}</div>
                        {node.type === 'router' && (
                          <div className="text-[9px] sm:text-[10px] text-yellow-600 font-medium">
                            +{node.feeSats.toFixed(2)} sats
                          </div>
                        )}
                        {node.type === 'receiver' && (
                          <div className="text-[9px] sm:text-[10px] text-success font-medium">
                            {formatSats(amountSats)}
                          </div>
                        )}
                      </div>
                    </div>

                    {index < selectedRoute.nodes.length - 1 && (
                      <div className="flex flex-col items-center mx-1 sm:mx-2">
                        <div className="relative">
                          <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-border to-muted-foreground/30 rounded-full">
                            <div
                              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-500 animate-pulse"
                              style={{ animation: `slideRight 2s ease-in-out infinite`, animationDelay: `${index * 0.3}s` }}
                            />
                          </div>
                          <ArrowRight className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/50" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-border/30">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">{isTr ? 'Toplam Atlama' : 'Total Hops'}</div>
                <div className="text-sm font-medium">{selectedRoute.nodes.length - 2}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">{isTr ? 'Tahmini Süre' : 'Est. Time'}</div>
                <div className="text-sm font-medium">{selectedRoute.estimatedTime}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">{isTr ? 'Güvenilirlik' : 'Reliability'}</div>
                <div className="text-sm font-medium text-success">{selectedRoute.reliability.toFixed(0)}%</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
          <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="text-[10px] sm:text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {isTr ? 'Yalnızca eğitim amaçlı gösterim.' : 'Educational illustration only.'}
            </span>{' '}
            {isTr
              ? 'Gösterilen rotalar, ağ ortalamalarına dayalı simüle edilmiş örneklerdir. Gerçek rotalar, ödeme anında cüzdanınızın yol bulma algoritması tarafından belirlenir.'
              : 'Routes shown are simulated examples based on network averages. Actual routes are determined by your wallet\'s pathfinding algorithm at payment time.'}
          </div>
        </div>
      </CardContent>

      <style>{`
        @keyframes slideRight {
          0%, 100% { left: 0; opacity: 0.5; }
          50% { left: calc(100% - 8px); opacity: 1; }
        }
      `}</style>
    </Card>
  );
};

export default RouteFinderVisualization;
