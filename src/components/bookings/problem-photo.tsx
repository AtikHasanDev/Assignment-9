export function ProblemPhoto({ src }: { src?: string }) {
  if (!src) return null;
  return <figure className="problem-photo"><a href={src} target="_blank" rel="noopener noreferrer"><img src={src} alt="Damage photo attached by the customer" width={360} height={240} loading="lazy" /></a><figcaption>Customer’s damage photo · <a href={src} target="_blank" rel="noopener noreferrer">Open full-size</a></figcaption></figure>;
}
