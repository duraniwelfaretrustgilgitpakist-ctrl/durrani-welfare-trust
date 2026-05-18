'use client';
import { useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function BackendWarmup() {
  useEffect(() => {
    // Fire a lightweight ping immediately on page load to wake up the backend
    // before the section components start their data fetches
    fetch(`${API_BASE}/api/ping`, { method: 'GET', cache: 'no-store' }).catch(() => {});
  }, []);
  return null;
}
