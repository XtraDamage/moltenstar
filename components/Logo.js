'use client';
export default function Logo({ size = 32 }) {
  return (
    <img src="/logo.svg" alt="MoltenStar" width={size} height={size} className="logo-img" draggable={false} />
  );
}
