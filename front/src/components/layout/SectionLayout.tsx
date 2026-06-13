import type { ReactNode } from 'react';

export interface SectionLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SectionLayout({ title, description, children }: SectionLayoutProps) {
  return (
    <section className="grid gap-4">
      <div>
        <h2 className="text-el-main text-xl font-bold">{title}</h2>
        {description ? <p className="text-el-subtle mt-2 text-sm">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
