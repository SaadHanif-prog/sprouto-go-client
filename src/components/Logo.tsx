export default function Logo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M50 92C67.6731 92 82 77.6731 82 60C82 42.3269 67.6731 28 50 28C32.3269 28 18 42.3269 18 60C18 77.6731 32.3269 92 50 92ZM50 74C57.732 74 64 67.732 64 60C64 52.268 57.732 46 50 46C42.268 46 36 52.268 36 60C36 67.732 42.268 74 50 74Z" />
      <path d="M49 27 Q 32 27 30 10 Q 46 10 49 27 Z" />
      <path d="M51 27 Q 68 27 70 10 Q 54 10 51 27 Z" />
    </svg>
  );
}
