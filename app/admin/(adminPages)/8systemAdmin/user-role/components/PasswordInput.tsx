// components/PasswordInput.tsx
"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { checkPasswordStrength } from "@/lib/password-utils";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  showStrength?: boolean;
  placeholder?: string;
}

export default function PasswordInput({
  label,
  value,
  onChange,
  required = true,
  showStrength = true,
  placeholder = "",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const strength = checkPasswordStrength(value);

  const getStrengthColor = () => {
    if (strength.score < 60) return "bg-red-500";
    if (strength.score < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div>
      <label className="block text-sm font-medium text-black mb-1">
        {label} {required && "*"}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showStrength && value && (
        <div className="mt-2 space-y-1">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getStrengthColor()}`}
              style={{ width: `${strength.score}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Strength: {strength.level}</span>
            <span className="text-gray-500">{Math.round(strength.score)}%</span>
          </div>
          <ul className="text-xs space-y-0.5 mt-1">
            <li
              className={
                strength.checks.length ? "text-green-600" : "text-gray-400"
              }
            >
              ✓ At least 8 characters
            </li>
            <li
              className={
                strength.checks.uppercase ? "text-green-600" : "text-gray-400"
              }
            >
              ✓ Uppercase letter (A-Z)
            </li>
            <li
              className={
                strength.checks.lowercase ? "text-green-600" : "text-gray-400"
              }
            >
              ✓ Lowercase letter (a-z)
            </li>
            <li
              className={
                strength.checks.number ? "text-green-600" : "text-gray-400"
              }
            >
              ✓ Number (0-9)
            </li>
            <li
              className={
                strength.checks.special ? "text-green-600" : "text-gray-400"
              }
            >
              ✓ Special character (!@#$%^&*)
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
