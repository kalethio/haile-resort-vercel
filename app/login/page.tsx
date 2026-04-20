"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("/admin");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Generate random CAPTCHA
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
  };

  useEffect(() => {
    const url = searchParams?.get("callbackUrl") || "/admin";
    setCallbackUrl(url);

    // Load remembered email from localStorage
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }

    // Check lockout from localStorage
    const storedLockout = localStorage.getItem("loginLockout");
    if (storedLockout) {
      const lockoutEnd = parseInt(storedLockout);
      if (lockoutEnd > Date.now()) {
        setLockoutTime(lockoutEnd);
      } else {
        localStorage.removeItem("loginLockout");
        localStorage.removeItem("loginAttempts");
        setAttempts(0);
      }
    } else {
      const storedAttempts = localStorage.getItem("loginAttempts");
      if (storedAttempts) setAttempts(parseInt(storedAttempts));
    }

    generateCaptcha();
  }, [searchParams]);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        const allowedRoles = ["SUPER_ADMIN", "ADMIN", "MANAGER"];
        if (session.user?.role && allowedRoles.includes(session.user.role)) {
          router.push(callbackUrl);
        }
      }
    };
    checkSession();
  }, [router, callbackUrl]);

  const handleForgotPassword = () => {
    setInfoMessage(
      "Please contact system administrator to reset your password."
    );
    setTimeout(() => {
      setInfoMessage("");
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check lockout
    if (lockoutTime && lockoutTime > Date.now()) {
      const minutesLeft = Math.ceil((lockoutTime - Date.now()) / 1000 / 60);
      setError(
        `Too many failed attempts. Please try again in ${minutesLeft} minutes.`
      );
      return;
    }

    // Verify CAPTCHA if shown
    if (showCaptcha) {
      if (captchaInput.toUpperCase() !== captchaCode) {
        setError("Incorrect CAPTCHA code. Please try again.");
        generateCaptcha();
        setCaptchaInput("");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Increment failed attempts
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem("loginAttempts", newAttempts.toString());

        // Show CAPTCHA after 3 failed attempts
        if (newAttempts >= 3 && !showCaptcha) {
          setShowCaptcha(true);
          generateCaptcha();
          setError("Too many failed attempts. Please verify CAPTCHA.");
        }

        // Lock after 5 failed attempts
        if (newAttempts >= 5) {
          const lockoutEnd = Date.now() + 15 * 60 * 1000; // 15 minutes
          setLockoutTime(lockoutEnd);
          localStorage.setItem("loginLockout", lockoutEnd.toString());
          setError("Too many failed attempts. Account locked for 15 minutes.");
        } else {
          setError(
            `Invalid email or password. ${5 - newAttempts} attempts remaining.`
          );
        }
      } else {
        // Reset attempts on successful login
        setAttempts(0);
        setShowCaptcha(false);
        localStorage.removeItem("loginAttempts");
        localStorage.removeItem("loginLockout");

        // Save email if remember me checked
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        router.push(callbackUrl);
      }
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  // Calculate remaining lockout time
  const getLockoutMessage = () => {
    if (lockoutTime && lockoutTime > Date.now()) {
      const minutesLeft = Math.ceil((lockoutTime - Date.now()) / 1000 / 60);
      const secondsLeft = Math.ceil((lockoutTime - Date.now()) / 1000);
      if (minutesLeft < 1) return `${secondsLeft} seconds`;
      return `${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}`;
    }
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <p className="mt-3 text-center text-xl text-gray-600">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div
              className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded shadow-sm"
              role="alert"
            >
              <p className="text-sm">{error}</p>
            </div>
          )}

          {infoMessage && (
            <div
              className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded shadow-sm"
              role="alert"
            >
              <p className="text-sm">{infoMessage}</p>
            </div>
          )}

          {lockoutTime && lockoutTime > Date.now() && (
            <div className="bg-orange-50 border-l-4 border-orange-500 text-orange-700 px-4 py-3 rounded shadow-sm">
              <p className="text-sm">
                Account temporarily locked. Try again in {getLockoutMessage()}.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={!!(lockoutTime && lockoutTime > Date.now())}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={!!(lockoutTime && lockoutTime > Date.now())}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* CAPTCHA Section - appears after 3 failed attempts */}
            {showCaptcha && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verify you are human
                </label>
                <div className="bg-gray-800 p-3 rounded-lg text-center mb-3">
                  <span className="text-2xl font-mono tracking-wider text-white bg-gray-800 px-4 py-2 rounded">
                    {captchaCode}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Enter code above"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  Refresh CAPTCHA
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="font-medium text-black hover:text-gray-700"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !!(lockoutTime && lockoutTime > Date.now())}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>

          {/* Attempts counter - only show if >0 and not locked and not showing CAPTCHA */}
          {attempts > 0 && attempts < 5 && !lockoutTime && !showCaptcha && (
            <div className="text-center text-xs text-gray-500">
              {5 - attempts} login attempt{5 - attempts !== 1 ? "s" : ""}{" "}
              remaining
            </div>
          )}

          {/* CAPTCHA warning */}
          {showCaptcha && !lockoutTime && (
            <div className="text-center text-xs text-orange-600">
              CAPTCHA verification required due to multiple failed attempts
            </div>
          )}
        </form>

        <div className="mt-6 text-center text-xs text-gray-400 border-t pt-4">
          <p>Haile Hotels & Resorts - Admin Portal</p>
        </div>
      </div>
    </div>
  );
}
