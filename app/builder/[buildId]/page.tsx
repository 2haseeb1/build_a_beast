// app/builder/[buildId]/page.tsx

import { prisma } from '@/lib/prisma';
import { ComponentType } from '@prisma/client';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ComponentSelector } from '@/components/ComponentSelector';
import PartPicker from '@/components/PartPicker';

export default async function BuilderPage({
  params,
}: {
  params: { buildId: string };
}) {
  const session = await auth();
  const build = await prisma.build.findFirst({
    where: {
      id: params.buildId,
      userId: session?.user?.id,
    },
    include: {
      components: {
        include: {
          component: true,
        },
      },
    },
  });

  if (!build) {
    return redirect('/');
  }

  const totalCost = build.components.reduce(
    (sum, item) => sum + item.component.price,
    0
  );

  const componentTypes: ComponentType[] = [
    'CPU', 'MOTHERBOARD', 'RAM', 'GPU', 'STORAGE', 'PSU', 'CASE',
  ];

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          {build.name}
        </h1>
        <div className="rounded-lg border border-border bg-card p-3 text-2xl font-bold text-green-500 md:text-3xl">
          Total: ${totalCost.toFixed(2)}
        </div>
      </div>

      <div className="space-y-4">
        {componentTypes.map((type) => {
          const selectedComponent = build.components.find(
            (c) => c.component.type === type
          )?.component;

          return (
            <div key={type}>
              <ComponentSelector
                type={type}
                buildId={build.id}
                selectedComponent={selectedComponent}
              >
                <PartPicker
                  type={type}
                  selectedValue={selectedComponent?.id}
                  buildId={build.id}
                />
              </ComponentSelector>
            </div>
          );
        })}
      </div>
    </div>
  );
}