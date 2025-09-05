'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function DownloadButton() {
  const handleDownload = () => {
    window.location.href = '/api/registrations/csv';
  };

  return (
    <Button onClick={handleDownload}>
      <Download className="mr-2 h-4 w-4" />
      Download Registrations (CSV)
    </Button>
  );
}
