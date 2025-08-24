// src/app/email-confirmation/page.js

"use client";

import { Suspense } from 'react';
import EmailConfirmationContent from './email-confirmation-content';

export default function EmailConfirmationPage() {
  return (
    <Suspense>
      <EmailConfirmationContent />
    </Suspense>
  );
}