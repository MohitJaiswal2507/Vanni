import { CircleCheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  badge?: string | null;
  price: number;
  features: string[];
  title: string;
  description?: string | null;
  priceSuffix: string;
  className?: string;
  buttonText: string;
  onClick: () => void;
  isCurrentPlan?: boolean;
  variant?: "default" | "highlighted";
};

export const PricingCard = ({
  badge,
  price,
  features,
  title,
  description,
  priceSuffix,
  className,
  buttonText,
  onClick,
  isCurrentPlan = false,
  variant,
}: Props) => {
  // Highlighted styling is strictly determined by metadata.variant === "highlighted"
  const isHigh = variant === "highlighted";

  return (
    <div 
      className={cn(
        "h-full flex flex-col select-none p-6 md:p-7 rounded-[24px] border-[3.5px] border-[#412D15] transition-all duration-300 w-full",
        isHigh
          ? "bg-linear-to-br from-[#1F150C] to-[#412D15] text-[#F5F1E8] shadow-[8px_8px_0px_0px_#412D15,0_0_15px_rgba(31,21,12,0.15)] hover:-translate-y-1 hover:translate-x-[1.5px] hover:shadow-[6px_6px_0px_0px_#412D15]"
          : "bg-[#F5F1E8] text-[#1F150C] shadow-[6px_6px_0px_0px_#412D15] hover:-translate-y-1 hover:translate-x-[1.5px] hover:shadow-[4.5px_4.5px_0px_0px_#412D15]",
        className
      )}
    >
      {/* 1. Header Stack: Title, Badge, Subtitle, Price */}
      <div className="flex flex-col gap-y-3.5">
        {/* Title & Badge */}
        <div className="flex items-center gap-x-2 flex-wrap gap-y-1.5">
          <h6 className="font-extrabold text-2xl tracking-tight leading-none capitalize">
            {title}
          </h6>
          
          {isCurrentPlan && (
            <Badge className="bg-[#E1DCC9] border-2 border-[#412D15] text-[#1F150C] shadow-[1.5px_1.5px_0px_0px_#412D15] animate-pulse font-black text-[9px] uppercase rounded-full px-2 py-0.5 shrink-0">
              Current Plan
            </Badge>
          )}

          {badge && (
            <Badge className={cn(
              "border-2 border-[#412D15] font-black text-[9px] uppercase rounded-full px-2 py-0.5 shrink-0 shadow-[1.5px_1.5px_0px_0px_#412D15]",
              isHigh ? "bg-[#E1DCC9] text-[#1F150C]" : "bg-[#F5F1E8] text-[#1F150C]"
            )}>
              {badge}
            </Badge>
          )}
        </div>
        
        {/* Subtitle / Description */}
        <p className={cn("text-xs font-semibold leading-relaxed min-h-[36px]", isHigh ? "text-[#D8D1BE]" : "text-[#6B5C4C]")}>
          {description}
        </p>
        
        {/* Price & Billing Period */}
        <div className="flex items-baseline gap-x-1 mt-1.5">
          <h4 className="text-4xl font-extrabold tracking-tight">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            }).format(price)}
          </h4>
          <span className={cn("text-xs font-bold uppercase tracking-wide shrink-0", isHigh ? "text-[#D8D1BE]" : "text-[#6B5C4C]")}>
            {priceSuffix}
          </span>
        </div>
      </div>

      {/* 2. Divider & Action CTA Button */}
      <div className="flex flex-col mt-5">
        <div className={cn("h-[2px] w-full mb-5", isHigh ? "bg-[#F5F1E8]/15" : "bg-[#412D15]/15")} />

        <Button
          onClick={onClick}
          className={cn(
            isHigh
              ? "bg-[#F5F1E8] hover:bg-[#D8D1BE] text-[#1F150C] border-2 border-[#412D15] shadow-[2.5px_2.5px_0px_0px_#412D15] hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:translate-x-[1px] active:translate-y-[1px] rounded-xl font-bold transition-all duration-150 cursor-pointer h-11 w-full flex items-center justify-center text-sm"
              : "bg-[#412D15] hover:bg-[#523d24] text-[#F5F1E8] border-2 border-[#412D15] shadow-[2.5px_2.5px_0px_0px_#412D15] hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:translate-x-[1px] active:translate-y-[1px] rounded-xl font-bold transition-all duration-150 cursor-pointer h-11 w-full flex items-center justify-center text-sm"
          )}
        >
          {buttonText}
        </Button>
      </div>

      {/* 3. Features list */}
      <div className="flex flex-col gap-y-3 mt-6">
        <p className={cn("font-extrabold text-[11px] uppercase tracking-wider", isHigh ? "text-[#F5F1E8]" : "text-[#1F150C]")}>
          Features Included
        </p>
        <ul className="flex flex-col gap-y-2">
          {features.map((feature, index) => (
            <li 
              key={index} 
              className={cn(
                "flex items-center gap-x-3 p-1.5 rounded-lg transition-colors duration-150 text-sm font-semibold leading-none",
                isHigh
                  ? "hover:bg-[#F5F1E8]/10 text-[#F5F1E8]"
                  : "hover:bg-[#412D15]/5 text-[#1F150C]/90"
              )}
            >
              <CircleCheckIcon
                className={cn(
                  "size-5 shrink-0 rounded-full border border-transparent shadow-[1px_1px_0px_0px_rgba(0,0,0,0.05)]",
                  isHigh ? "fill-[#F5F1E8] text-[#1F150C]" : "fill-[#412D15] text-[#F5F1E8]"
                )}
              />
              <span className="truncate max-w-[280px]">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
