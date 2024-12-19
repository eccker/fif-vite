import React from 'react';
import { Mail, X } from 'lucide-react';
import { sendEmailVerification } from '../services/authService';

interface EmailVerificationBannerProps {
  onClose: () => void;
}

export function EmailVerificationBanner({ onClose }: EmailVerificationBannerProps) {
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSendVerification = async () => {
    try {
      setSending(true);
      setError(null);
      await sendEmailVerification();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg shadow-lg relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="flex items-start gap-3">
        <Mail className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-none" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Verify your email address
          </h3>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
            Please verify your email address to ensure account security and access to all features.
          </p>
          
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          
          {success ? (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              Verification email sent! Please check your inbox.
            </p>
          ) : (
            <button
              onClick={handleSendVerification}
              disabled={sending}
              className="mt-3 text-sm font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send verification email'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}