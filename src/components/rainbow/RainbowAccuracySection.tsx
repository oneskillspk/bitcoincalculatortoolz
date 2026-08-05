import React from 'react';
import { SectionHeader } from '@/components/lot-size/SectionHeader';
import { TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';

export const RainbowAccuracySection: React.FC = () => {
  return (
    <div className="space-y-12 mt-16">
      <section>
        <SectionHeader
          title="Rainbow Chart History & Accuracy"
          lead="How the log-regression bands performed in past cycles"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 mt-1">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Support Accuracy (Fire Sale)</h4>
                <p className="text-sm text-muted-foreground italic">"Basically Fire Sale" (Blue/Purple)</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Historically, these bands have been excellent entry signals. Bitcoin spent less than 5% of its history here, notably during the 2015, 2018, and 2022 cycle bottoms. Buying here has never resulted in a loss over a 4-year horizon.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500 mt-1">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Resistance Accuracy (Bubble)</h4>
                <p className="text-sm text-muted-foreground italic">"Maximum Bubble Territory" (Red)</p>
                <p className="text-sm text-muted-foreground mt-2">
                  The chart correctly identified the 2013 and 2017 peaks. However, in 2021, Bitcoin failed to reach the red band, peaking instead in the "Is this a Bubble?" (Orange) zone, showing that diminishing returns may flatten the curve.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-primary/10 flex flex-col justify-center">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Cycle Max Prediction
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm border-b border-border pb-2">
                <span className="text-muted-foreground">2013 Peak</span>
                <span className="font-mono text-red-500">Hit Red Band</span>
              </div>
              <div className="flex justify-between text-sm border-b border-border pb-2">
                <span className="text-muted-foreground">2017 Peak</span>
                <span className="font-mono text-red-500">Hit Red Band</span>
              </div>
              <div className="flex justify-between text-sm border-b border-border pb-2">
                <span className="text-muted-foreground">2021 Peak</span>
                <span className="font-mono text-orange-500">Hit Orange Band</span>
              </div>
              <div className="flex justify-between text-sm pt-2">
                <span className="text-muted-foreground">2025/26 Current</span>
                <span className="font-mono text-primary font-bold">In Progress</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-6 italic text-center">
              The Rainbow Chart is a fun tool, not financial advice. It uses past performance which does not guarantee future results.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
