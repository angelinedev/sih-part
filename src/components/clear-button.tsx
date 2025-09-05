'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { clearRegistrations } from '@/services/problem-statement-service';
import { Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function ClearButton() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleClear = () => {
    if (confirm('Are you sure you want to delete all registrations? This action cannot be undone.')) {
      startTransition(async () => {
        const result = await clearRegistrations();
        if (result.success) {
          toast({
            title: 'Registrations Cleared!',
            description: 'All registration data has been successfully cleared.',
          });
          router.refresh();
        } else {
          toast({
            variant: 'destructive',
            title: 'Clearing Failed',
            description: 'Could not clear registrations.',
          });
        }
      });
    }
  };

  return (
    <Button onClick={handleClear} variant="destructive" disabled={isPending}>
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="mr-2 h-4 w-4" />
      )}
      Clear Registrations
    </Button>
  );
}
