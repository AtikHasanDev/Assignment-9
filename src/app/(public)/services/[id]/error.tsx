'use client';
import Link from 'next/link';
export default function ServiceError({ retry }: { error: unknown; retry: () => void }) {
  return <div className="container page-section"><h1>We couldn’t load this repair.</h1><p>Please try again in a moment.</p><button className="button" onClick={retry}>Try again</button> <Link href="/services">Browse services</Link></div>;
}
