import React, { useState } from 'react';
import {
  Settings,
  Sparkles,
  Database,
  CheckCircle2,
  AlertCircle,
  Key,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { isFirebaseConfigured } from '../../services/firebase';
import { GeminiService } from '../../services/geminiService';
import { initialProducts } from '../../data/initialProducts';
import { StorageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';

export const AdminSettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [resetting, setResetting] = useState(false);

  const isGeminiReady = GeminiService.isConfigured();

  const handleResetCatalog = async () => {
    if (window.confirm('Reset all catalog data back to initial factory demo laptops?')) {
      setResetting(true);
      localStorage.removeItem('technova_products');
      for (const p of initialProducts) {
        await StorageService.saveProduct(p);
      }
      setResetting(false);
      showToast('Catalog restored to default specifications.', 'success');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">System Integrations & API Status</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Monitor your Firebase cloud connection, Google Gemini LLM API keys, and database sync status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FIREBASE STATUS CARD */}
        <div className="p-6 rounded-3xl bg-[#11131c] border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Firebase Cloud Services</h3>
                <span className="text-[11px] text-zinc-400">Auth, Firestore & Storage</span>
              </div>
            </div>

            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${
                isFirebaseConfigured
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700'
              }`}
            >
              {isFirebaseConfigured ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cloud Active</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Local Store Active</span>
                </>
              )}
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            {isFirebaseConfigured
              ? 'Your application is connected to Google Cloud Firestore and Firebase Authentication with reactive cloud synchronizations.'
              : 'Running in resilient standalone mode with persistent reactive store. To connect live Google Cloud Firestore, supply your project keys in .env.'}
          </p>

          <div className="pt-2 border-t border-zinc-800/80 space-y-1.5 text-[11px] font-mono text-zinc-400">
            <p>VITE_FIREBASE_API_KEY: {isFirebaseConfigured ? '••••••••••••' : 'Not set (using demo)'}</p>
            <p>VITE_FIREBASE_PROJECT_ID: {isFirebaseConfigured ? 'Connected' : 'Not set (using demo)'}</p>
          </div>
        </div>

        {/* GEMINI API STATUS CARD */}
        <div className="p-6 rounded-3xl bg-[#11131c] border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Google Gemini LLM</h3>
                <span className="text-[11px] text-zinc-400">Shopping Assistant Chatbot</span>
              </div>
            </div>

            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${
                isGeminiReady
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  : 'bg-purple-950/80 text-purple-300 border-purple-500/40'
              }`}
            >
              {isGeminiReady ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Gemini 1.5 Active</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Smart AI Engine Active</span>
                </>
              )}
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            {isGeminiReady
              ? 'Gemini API key is active. The chatbot dynamically ingests your catalog context to generate smart responses.'
              : 'Our built-in smart AI recommendation engine is currently handling shopper queries, analyzing budgets, and matching laptops. You can add VITE_GEMINI_API_KEY to switch to live Gemini.'}
          </p>

          <div className="pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-400">
            <p>VITE_GEMINI_API_KEY: {isGeminiReady ? 'Active (Key Detected)' : 'Optional (Fallback Active)'}</p>
          </div>
        </div>
      </div>

      {/* SETUP GUIDE SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#11131c] border border-purple-500/20 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-purple-400" />
          <span>Environment Configuration Guide (.env)</span>
        </h3>

        <p className="text-xs text-zinc-300 leading-relaxed">
          To connect your own Firebase project and Gemini API key, place these keys in your <code className="text-purple-300">technova-store/.env</code> file:
        </p>

        <pre className="p-4 rounded-xl bg-[#090a0f] border border-zinc-800 text-[11px] font-mono text-purple-300 overflow-x-auto leading-loose">
{`# TechNova Laptop E-Commerce Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id`}
        </pre>
      </div>

      {/* CATALOG RESET BUTTON */}
      <div className="p-6 rounded-3xl bg-[#11131c] border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Reset Factory Catalog</h4>
          <p className="text-xs text-zinc-400">
            Restore sample laptops, prices, and color variations back to default seed data.
          </p>
        </div>

        <button
          onClick={handleResetCatalog}
          disabled={resetting}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-2 transition"
        >
          <RotateCcw className="w-4 h-4 text-purple-400" />
          <span>{resetting ? 'Resetting...' : 'Restore Factory Seed'}</span>
        </button>
      </div>
    </div>
  );
};
