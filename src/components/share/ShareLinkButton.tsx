import React from 'react';
import { Link2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ShareLinkButtonProps {
  shareLink: string;
}

export const ShareLinkButton: React.FC<ShareLinkButtonProps> = ({ shareLink }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-600" />
          <span className="text-green-600">Copied!</span>
        </>
      ) : (
        <>
          <Link2 className="h-4 w-4 text-gray-600" />
          <span className="text-gray-600">Copy share link</span>
        </>
      )}
    </button>
  );
};