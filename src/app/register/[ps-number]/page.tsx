import EventDetails from '@/components/event-details';
import RegistrationForm from '@/components/registration-form';
import { problemStatements } from '@/lib/problem-statements';

export function generateStaticParams() {
  return problemStatements.map((ps) => ({
    'ps-number': ps.psNumber,
  }))
}

export default function RegisterPage({ params }: { params: { 'ps-number': string } }) {
  const psNumber = params['ps-number'];

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Eventide</h1>
        <p className="text-muted-foreground text-lg mt-2">Team Registration Portal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-2">
          <EventDetails psNumber={psNumber} />
        </div>
        <div className="lg:col-span-3">
          <RegistrationForm psNumber={psNumber} />
        </div>
      </div>
    </main>
  );
}
