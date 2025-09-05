import DownloadButton from '@/components/download-button';
import ProblemStatements from '@/components/problem-statements';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-4 flex justify-end gap-2">
        <DownloadButton />
      </div>
      <ProblemStatements />
    </main>
  );
}
