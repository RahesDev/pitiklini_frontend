import React from "react";

/** Grey track + gold progress (#B87A13). Segment after step `idx` fills when user has advanced past step idx+1. */
const LINE_GREY = "#2a3038";
const LINE_GOLD = "#B87A13";

const clampStep = (currentStep, totalSteps) =>
  Math.min(Math.max(Number(currentStep) || 1, 1), Math.max(totalSteps, 1));

const VerticalStepper = ({ steps = [], currentStep = 1, className = "" }) => {
  const n = steps.length;
  const safeStep = clampStep(currentStep, n);

  return (
    <div className={`flex flex-col gap-0 ${className}`}>
      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < safeStep;
        const isActive = stepNum === safeStep;
        const isInactive = stepNum > safeStep;
        const isLast = idx === n - 1;

        /** Connector below this row: yellow only after step (idx+1) is fully completed → safeStep > idx + 1 */
        const segmentComplete = safeStep > idx + 1;

        const iconBtnClass = [
          "grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition-all duration-300 ease-out",
          isCompleted && "border-[#B87A13] bg-[#B87A13] text-white",
          isActive &&
            "border-[#B87A13] bg-[#B87A13] text-[#0f1117] shadow-[0_0_0_3px_rgba(184,122,19,0.35),0_0_16px_rgba(184,122,19,0.35)]",
          isInactive && "border-[#2a3038] bg-[#1a1f2a] text-[#6b7280]",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div
            key={step.key || step.title || idx}
            className="grid min-w-0 grid-cols-[40px_minmax(0,1fr)] gap-x-3 sm:grid-cols-[44px_minmax(0,1fr)] sm:gap-x-4"
          >
            <div className="flex min-h-0 flex-col items-center">
              <div className={iconBtnClass}>{step.icon}</div>

              {!isLast && (
                <div
                  className="relative mt-3 min-h-[56px] w-[2px] flex-1 overflow-hidden rounded-full sm:min-h-[64px]"
                  style={{ backgroundColor: LINE_GREY }}
                >
                  <div
                    className="absolute left-0 top-0 w-[2px] rounded-full transition-[height] duration-500 ease-in-out"
                    style={{
                      backgroundColor: LINE_GOLD,
                      height: segmentComplete ? "100%" : "0%",
                    }}
                  />
                </div>
              )}
            </div>

            <div className="min-w-0 pb-6 sm:pb-10">
              <h3
                className={`mb-3 text-base font-medium leading-snug transition-colors duration-300 sm:mb-4 sm:text-lg ${
                  isActive || isCompleted ? "text-[#B87A13]" : "text-[#7d8798]"
                }`}
              >
                {step.title}
              </h3>
              {step.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VerticalStepper;
