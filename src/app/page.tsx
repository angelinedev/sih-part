import DownloadButton from '@/components/download-button';
import ProblemStatements from '@/components/problem-statements';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Eventide</h1>
        <p className="text-muted-foreground text-lg mt-2">Problem Statements</p>
      </div>
      <div className="mb-4 flex justify-end">
        <DownloadButton />
      </div>
      <ProblemStatements />
    </main>
  );
}
