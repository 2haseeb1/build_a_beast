// components/PartPickerClient.tsx

"use client";

import { selectComponentAction } from '@/app/actions/buildActions';
import type { Component, ComponentType } from '@prisma/client';
import { useTransition } from 'react';

// ✅ 'buildId' এবং 'type' prop এখানে যোগ করা হয়েছে
type PartPickerClientProps = {
  parts: Component[];
  selectedValue: string | undefined;
  buildId: string;
  type: ComponentType;
};

export default function PartPickerClient({
  parts,
  selectedValue,
  buildId,
  type,
}: PartPickerClientProps) {
  const [isPending, startTransition] = useTransition();

  return (
    // ✅ সার্ভার অ্যাকশনটি এখন সরাসরি ফর্মের সাথে যুক্ত
    <form action={(formData) => startTransition(() => selectComponentAction(formData))}>
      {/* ✅ এই হিডেন ইনপুটগুলো সার্ভার অ্যাকশনের জন্য জরুরি */}
      <input type="hidden" name="buildId" value={buildId} />
      <input type="hidden" name="type" value={type} />
      
      <select
        name="partId"
        defaultValue={selectedValue || ''}
        // ✅ onChange হলে ফর্মটি নিজে থেকেই সাবমিট হবে
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        disabled={isPending}
        className="bg-card/50 p-2 rounded w-full border border-border focus:border-primary focus:ring-0 h-10"
      >
        <option value="">-- Choose a {type.toLowerCase()} --</option>
        {parts.map((part) => (
          <option key={part.id} value={part.id}>
            {part.name} - ${part.price.toFixed(2)}
          </option>
        ))}
      </select>
    </form>
  );
}