"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, RefreshCw } from "lucide-react";

export default function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState("/admin");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load failed attempts from localStorage
  useEffect(() => {
    const url = searchParams?.get("callbackUrl") || "/admin";
    setCallbackUrl(url);

    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }

    const storedAttempts = localStorage.getItem("failedAttempts");
    if (storedAttempts) {
      const attempts = parseInt(storedAttempts);
      setFailedAttempts(attempts);
      if (attempts >= 3) {
        setShowCaptcha(true);
        generateCaptcha();
      }
    }
  }, [searchParams]);

  // Generate CAPTCHA from server
  const generateCaptcha = async () => {
    setCaptchaLoading(true);
    try {
      const res = await fetch("/api/auth/captcha", { method: "POST" });
      const data = await res.json();
      setCaptchaId(data.captchaId);
      setCaptchaCode(data.captchaCode);
    } catch (err) {
      console.error("CAPTCHA generation failed:", err);
    } finally {
      setCaptchaLoading(false);
    }
  };

  // Verify CAPTCHA with server
  const verifyCaptcha = async (): Promise<boolean> => {
    if (!showCaptcha) return true;

    try {
      const res = await fetch("/api/auth/captcha", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captchaId, userInput: captchaInput }),
      });
      const data = await res.json();

      if (!data.valid) {
        setError(data.error || "Invalid CAPTCHA code");
        generateCaptcha(); // Refresh CAPTCHA
        setCaptchaInput("");
        return false;
      }
      return true;
    } catch (err) {
      setError("CAPTCHA verification failed");
      return false;
    }
  };

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
    setTimeout(() => setInfoMessage(""), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Verify CAPTCHA first
    const isCaptchaValid = await verifyCaptcha();
    if (!isCaptchaValid) return;

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        localStorage.setItem("failedAttempts", newAttempts.toString());

        if (newAttempts >= 3 && !showCaptcha) {
          setShowCaptcha(true);
          generateCaptcha();
          setError("Too many failed attempts. Please verify CAPTCHA.");
        } else {
          const remaining = 3 - (newAttempts % 3);
          setError(
            `Invalid email or password. ${remaining} attempts remaining before CAPTCHA.`
          );
        }
      } else {
        // Successful login - reset everything
        setFailedAttempts(0);
        setShowCaptcha(false);
        setCaptchaInput("");
        localStorage.removeItem("failedAttempts");

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <p className="text-xl text-gray-600">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded shadow-sm">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {infoMessage && (
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded shadow-sm">
              <p className="text-sm">{infoMessage}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-gray-900"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-gray-900 pr-10"
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

            {/* CAPTCHA Section */}
            {showCaptcha && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verify you are human
                </label>
                <div className="bg-gray-800 p-3 rounded-lg text-center mb-3 flex items-center justify-between">
                  <span className="text-2xl font-mono tracking-wider text-white">
                    {captchaLoading ? "••••••" : captchaCode}
                  </span>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    disabled={captchaLoading}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <RefreshCw
                      size={18}
                      className={captchaLoading ? "animate-spin" : ""}
                    />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Enter code above"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  CAPTCHA expires after 5 minutes
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
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
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm font-medium text-black hover:text-gray-700"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-colors"
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
        </form>

        <div className="text-center text-xs text-gray-400 border-t pt-4">
          <p>Haile Hotels & Resorts - Admin Portal</p>
        </div>
      </div>
    </div>
  );
}
