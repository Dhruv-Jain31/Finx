"use client";

import { useState } from "react";
import { Mail, Lock, Loader2, ArrowRight, Wallet, Shield, Zap, CreditCard } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("https://otp-service-beta.vercel.app/api/otp/generate", {
        email,
        type: "numeric",
        organization: "FinX",
        subject: "OTP Verification"
      });

      if (response.data.message === "OTP is generated and sent to your email") {
        setOtpRequested(true);
      } else {
        setError("Failed to send OTP");
      }
    } catch (error) {
      setError("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        otp,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes("User does not exist")) {
          router.push("/auth/signup");
          return;
        }
        setError(result.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Shield, text: "Bank-grade security" },
    { icon: Zap, text: "Instant transfers" },
    { icon: CreditCard, text: "Multiple payment methods" }
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        
        {/* Floating elements */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-32 h-32 border border-white/10 rounded-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 right-16 w-24 h-24 border border-white/10 rounded-2xl"
        />

        <div className="relative z-10 flex flex-col justify-center px-16 py-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mr-4">
                <Wallet className="w-8 h-8 text-black" />
              </div>
              <h1 className="text-4xl font-bold text-white">FinX</h1>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
              Your digital wallet,<br />
              <span className="text-gray-300">reimagined</span>
            </h2>
            
            <p className="text-gray-400 text-lg mb-12 leading-relaxed">
              Experience seamless payments, instant transfers, and complete financial control 
              in one beautifully designed platform.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mr-3">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-black">FinX</h1>
          </div>

          <div className="text-center mb-8">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-black mb-2"
            >
              Welcome back
            </motion.h2>
            <p className="text-gray-600">
              Sign in to access your wallet
            </p>
          </div>

          <form className="space-y-6" onSubmit={otpRequested ? verifyOtp : requestOtp}>
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors duration-200" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black transition-all duration-200 ease-in-out text-sm font-medium"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={otpRequested}
                  />
                </div>
              </motion.div>

              <AnimatePresence>
                {otpRequested && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <label htmlFor="otp" className="block text-sm font-semibold text-black mb-2">
                      Verification Code
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors duration-200" />
                      </div>
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        maxLength={6}
                        className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black transition-all duration-200 ease-in-out text-sm font-medium tracking-widest text-center"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Check your email for the 6-digit verification code
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="text-red-600 text-sm text-center bg-red-50 border border-red-200 p-3 rounded-xl font-medium"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full flex justify-center items-center py-4 px-6 border-2 border-black text-sm font-bold rounded-2xl text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {otpRequested ? "Verify & Sign In" : "Send Verification Code"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </motion.button>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                New to FinX?{" "}
                <Link
                  href="/auth/signup"
                  className="font-bold text-black hover:underline transition-all duration-200"
                >
                  Create your wallet
                </Link>
              </p>
            </div>
          </form>

          {/* Trust indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 pt-6 border-t border-gray-100"
          >
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
              <div className="flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center">
                <Lock className="w-3 h-3 mr-1" />
                <span>Bank-level security</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}