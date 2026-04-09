import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('common');

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          {t('welcome')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-md">
          {t('description')}
        </p>
        <div className="pt-8">
          <p className="text-sm text-muted-foreground">
            {t('powered_by')} TechNova Store
          </p>
        </div>
      </div>
    </main>
  );
}
