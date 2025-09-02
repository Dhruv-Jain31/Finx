'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, User, Phone, Loader2, ArrowRight, Wallet, Shield, Zap, CreditCard, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    number: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post('/api/auth/signup', formData);
      router.push('/auth/login');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.response?.data?.error || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: Shield, text: "Secure transactions", desc: "Military-grade encryption" },
    { icon: Zap, text: "Instant payments", desc: "Send money in seconds" },
    { icon: CreditCard, text: "Multiple cards", desc: "Link all your accounts" }
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Signup form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
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
              Join FinX today
            </motion.h2>
            <p className="text-gray-600">
              Create your digital wallet in minutes
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="name" className="block text-sm font-semibold text-black mb-2">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors duration-200" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black transition-all duration-200 ease-in-out text-sm font-medium"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
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
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="number" className="block text-sm font-semibold text-black mb-2">
                  Phone Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors duration-200" />
                  </div>
                  <input
                    id="number"
                    name="number"
                    type="tel"
                    required
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black transition-all duration-200 ease-in-out text-sm font-medium"
                    placeholder="Enter your phone number"
                    value={formData.number}
                    onChange={handleChange}
                  />
                </div>
              </motion.div>
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="group relative w-full flex justify-center items-center py-4 px-6 border-2 border-black text-sm font-bold rounded-2xl text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Create Your Wallet
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </motion.button>
            
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Already have a wallet?{" "}
                <Link href="/auth/login" className="font-bold text-black hover:underline transition-all duration-200">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>

          {/* Trust indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 pt-6 border-t border-gray-100"
          >
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                <span>Free to join</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                <span>Fully secured</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-bl from-black to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent" />
        
        {/* Floating elements */}
        <motion.div 
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-24 right-20 w-28 h-28 border border-white/10 rounded-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 25, 0],
            rotate: [0, 8, 0]
          }}
          transition={{ 
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-40 left-16 w-20 h-20 border border-white/10 rounded-2xl"
        />

        <div className="relative z-10 flex flex-col justify-center px-16 py-20">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
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
              The future of<br />
              <span className="text-gray-300">digital payments</span>
            </h2>
            
            <p className="text-gray-400 text-lg mb-12 leading-relaxed">
              Join millions who trust FinX for secure, instant, and seamless 
              financial transactions every day.
            </p>

            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{benefit.text}</h3>
                    <p className="text-gray-400 text-sm">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10"
            >
              <p className="text-white text-sm font-medium mb-2">
                Trusted by 10M+ users worldwide
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span>🏆 #1 Digital Wallet</span>
                <span>⭐ 4.9/5 Rating</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}