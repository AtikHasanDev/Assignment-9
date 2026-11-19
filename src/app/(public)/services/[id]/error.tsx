'use client';
import Link from 'next/link';
export default function ServiceError({ reset }: { reset: () => void }) {
  return <div className="container page-section"><h1>We couldn’t load this repair.</h1><p>Please try again in a moment.</p><button className="button" onClick={reset}>Try again</button> <Link href="/services">Browse services</Link></div>;
}
