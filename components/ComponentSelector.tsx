// components/ComponentSelector.tsx

'use client';

import { useOptimistic, useTransition, Suspense, type ReactNode } from 'react';
import type { Component, ComponentType } from '@prisma/client';
import { selectComponentAction } from '@/app/actions/buildActions';
import { X } from 'lucide-react'; // `npm install lucide-react` প্রয়োজন হতে পারে

// একটি লোডিং স্কেলিটন যা Suspense ব্যবহার করবে
function PartPickerSkeleton() {
  return <div className="h-10 bg-border/50 rounded-md animate-pulse w-full"></div>;
}

export function ComponentSelector({
  type,
  buildId,
  selectedComponent: initialSelectedComponent,
  children, // ✅ সার্ভার কম্পোনেন্টকে children হিসেবে গ্রহণ করা হচ্ছে
}: {
  type: ComponentType;
  buildId: string;
  selectedComponent: Component | undefined;
  children: ReactNode; // ✅ children-এর টাইপ দিন
}) {
  const [isPending, startTransition] = useTransition();
  
  // অপটিমিস্টিক আপডেটের জন্য স্টেট
  const [optimisticComponent, setOptimisticComponent] = useOptimistic(
    initialSelectedComponent,
    (currentState, newComponent: Component | undefined) => newComponent
  );

  // সার্ভার অ্যাকশন কল করার জন্য একটি র‍্যাপার ফাংশন
  // এই ফাংশনটি এখন PartPickerClient থেকে সরাসরি কল হবে না, বরং ফর্মের মাধ্যমে হবে।
  // তবে রিমুভ বাটনের জন্য আমাদের আলাদা হ্যান্ডলার লাগবে।
  const handleRemove = () => {
    // startTransition ব্যবহার করে UI ফ্রিজ হওয়া আটকানো হচ্ছে
    startTransition(async () => {
      // ১. UI-কে তাৎক্ষণিকভাবে আপডেট করুন
      setOptimisticComponent(undefined);
      
      // ২. সার্ভার অ্যাকশন কল করার জন্য FormData তৈরি করুন
      const formData = new FormData();
      formData.set('buildId', buildId);
      formData.set('partId', ''); // খালি স্ট্রিং মানে হলো "রিমুভ"
      formData.set('type', type);
      
      // ৩. সার্ভার অ্যাকশন কল করুন
      await selectComponentAction(formData);
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-card border border-border rounded-lg transition-all hover:border-primary/50">
      <div className="flex-1 mb-4 md:mb-0">
        <h3 className="text-xl font-semibold text-card-foreground">{type}</h3>
        <p
          className={`text-foreground/70 min-h-[24px] transition-opacity ${
            isPending ? 'opacity-50 animate-pulse' : 'opacity-100'
          }`}
        >
          {optimisticComponent ? optimisticComponent.name : 'Not selected'}
        </p>
      </div>

      <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
        {optimisticComponent && (
          <>
            <span className="text-lg font-bold text-green-500 w-24 text-right">
              ${optimisticComponent.price.toFixed(2)}
            </span>
            <button
              onClick={handleRemove}
              disabled={isPending}
              className="p-1.5 rounded-md text-foreground/50 hover:bg-border hover:text-foreground disabled:opacity-50"
              aria-label="Remove component"
            >
              <X size={18} />
            </button>
          </>
        )}

        <div className="flex-grow">
          {/* 
            Suspense বাউন্ডারি:
            Next.js যখন সার্ভার কম্পোনেন্ট <PartPicker />-কে রেন্ডার করবে,
            ততক্ষণ পর্যন্ত <PartPickerSkeleton /> দেখানো হবে।
          */}
          <Suspense fallback={<PartPickerSkeleton />}>
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  );
}