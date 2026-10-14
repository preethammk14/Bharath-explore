import React from 'react';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';
import { Database, CheckCircle2, AlertTriangle, Key, Shield, Layers, FileCode } from 'lucide-react';

export const FirebaseSetupModal: React.FC = () => {
  const { isFirebaseModalOpen, setFirebaseModalOpen, firebaseReady } = useApp();

  return (
    <Modal
      isOpen={isFirebaseModalOpen}
      onClose={() => setFirebaseModalOpen(false)}
      title="Firebase Backend & Cloud Integration"
      subtitle="Full-stack database architecture, Authentication, and Firestore Security Rules"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5 text-xs text-gray-700">
        {/* Connection Status Banner */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          firebaseReady 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          {firebaseReady ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="font-bold text-sm">
              {firebaseReady ? 'Live Cloud Firestore Connected' : 'Running in Dual-Mode (Local Persistence Active)'}
            </h4>
            <p className="mt-1 leading-relaxed text-xs">
              {firebaseReady
                ? 'Your BharatExplore applet is connected to Cloud Firestore and Firebase Authentication with production security rules.'
                : 'All features (wishlist, bookings, reviews, local business submissions, and search) are fully active using instant browser state persistence. To link a production Google Cloud / Firebase project, follow the instructions below.'}
            </p>
          </div>
        </div>

        {/* Step-by-Step Setup Guide */}
        <div>
          <h4 className="font-bold text-sm text-[#143D24] mb-2 flex items-center gap-1.5">
            <Key className="w-4 h-4 text-[#D9531E]" />
            <span>How to Connect Your Own Firebase Project</span>
          </h4>
          
          <div className="space-y-2.5">
            <div className="p-3 bg-white border border-[#E8E1D5] rounded-xl flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#143D24] text-white font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
              <div>
                <p className="font-semibold text-[#1E232A]">Create or select a Firebase Project</p>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  Visit the <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-[#D9531E] underline font-medium">Firebase Console</a>, create a project, and enable <strong>Cloud Firestore</strong> and <strong>Authentication (Google Sign-In)</strong>.
                </p>
              </div>
            </div>

            <div className="p-3 bg-white border border-[#E8E1D5] rounded-xl flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#143D24] text-white font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
              <div>
                <p className="font-semibold text-[#1E232A]">Register a Web App</p>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  In Project Settings, add a Web App to get your configuration credentials (apiKey, authDomain, projectId, storageBucket, appId).
                </p>
              </div>
            </div>

            <div className="p-3 bg-white border border-[#E8E1D5] rounded-xl flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#143D24] text-white font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
              <div>
                <p className="font-semibold text-[#1E232A]">Save configuration as firebase-applet-config.json</p>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  Save your credentials into <code>firebase-applet-config.json</code> in the project root. The app automatically detects this on reload!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Rules & Blueprint Details */}
        <div className="bg-[#FAF8F5] border border-[#E8E1D5] rounded-xl p-3.5">
          <div className="flex items-center gap-2 font-bold text-[#143D24] text-xs mb-1.5">
            <Shield className="w-4 h-4 text-[#143D24]" />
            <span>Automated Zero-Trust Security Rules Included</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            BharatExplore includes fully compliant <code>firestore.rules</code> and intermediate schema <code>firebase-blueprint.json</code> guarding collections:
            <code className="mx-1 text-[#D9531E]">/users</code>,
            <code className="mx-1 text-[#D9531E]">/bookings</code>,
            <code className="mx-1 text-[#D9531E]">/businesses</code>, and
            <code className="mx-1 text-[#D9531E]">/reviews</code> with owner-isolated ABAC validation.
          </p>
        </div>

        <div className="text-right">
          <button
            onClick={() => setFirebaseModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-[#143D24] hover:bg-[#0D2B1A] text-white text-xs font-semibold cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </Modal>
  );
};
