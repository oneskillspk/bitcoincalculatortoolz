import { Link } from "@/components/LocalizedLink";
import { Calculator, ArrowRight } from 'lucide-react';

interface ArticleCTAProps {
  calculatorName: string;
  text: string;
  path: string;
}

export const ArticleCTA = ({ calculatorName, text, path }: ArticleCTAProps) => {
  return (
    <Link
      to={path}
      className="group block rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-sm p-5 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {calculatorName}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">{text}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-primary opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-1" />
      </div>
    </Link>
  );
};
