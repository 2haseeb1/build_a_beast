// components/PartPicker.tsx

import { prisma } from '@/lib/prisma';
import type { ComponentType } from '@prisma/client'; 
import PartPickerClient from './PartPickerClient';

type PartPickerProps = {
  type: ComponentType;
  selectedValue: string | undefined;
  buildId: string;
};

export default async function PartPicker({
  type,
  selectedValue,
  buildId,
}: PartPickerProps) {
  
  const parts = await prisma.component.findMany({
    where: { type },
    orderBy: { name: 'asc' },
  });

  return (
    <PartPickerClient
      parts={parts}
      selectedValue={selectedValue}
      buildId={buildId}
      type={type}
    />
  );
}