"use client";

import React from "react";
import { Check } from "lucide-react"; // Opsiyonel: Daha estetik bir check ikonu için

// --- Tipler ---
interface StepIndicatorProps {
  step: number;
  currentStep: number;
  label: string;
}

interface PaymentStepperProps {
  currentStep: number;
}

// StepIndicator Component
const StepIndicator: React.FC<StepIndicatorProps> = ({
  step,
  currentStep,
  label,
}) => {
  const isActive = step === currentStep;
  const isCompleted = step < currentStep;

  return (
    <div className="flex flex-1 items-center group">
      {/* İçerik Konteynırı */}
      <div className="flex flex-col items-center flex-1">
        <div
          className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out border-2 ${
            isCompleted
              ? "bg-slate-900 border-slate-900 text-white"
              : isActive
              ? "bg-white border-slate-900 text-slate-900 shadow-sm"
              : "bg-white border-slate-200 text-slate-400"
          }`}
        >
          {isCompleted ? (
            <span className="text-sm font-bold animate-in zoom-in duration-300">
              ✓
            </span>
          ) : (
            <span className="text-xs font-bold tracking-tighter">{step}</span>
          )}

          {/* Aktif adımda küçük bir parlama efekti */}
          {isActive && (
            <span className="absolute inset-0 rounded-full bg-slate-900/5 animate-ping duration-[2000ms]" />
          )}
        </div>

        <span
          className={`mt-3 text-[11px] uppercase tracking-[0.1em] transition-colors duration-500 ${
            isActive ? "text-slate-900 font-bold" : "text-slate-400 font-medium"
          }`}
        >
          {label}
        </span>
      </div>

      {/* Adımlar arası çizgi (sadece ilk adımın yanına) */}
      {step === 1 && (
        <div className="w-12 h-[1px] bg-slate-100 mt-[-20px] hidden md:block" />
      )}
    </div>
  );
};

// PaymentStepper Component
const PaymentStepper: React.FC<PaymentStepperProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-md mx-auto flex items-center justify-center mb-10 select-none">
      <StepIndicator step={1} currentStep={currentStep} label="Adres" />
      <StepIndicator step={2} currentStep={currentStep} label="Ödeme" />
    </div>
  );
};

export default PaymentStepper;
