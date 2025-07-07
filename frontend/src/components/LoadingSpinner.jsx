const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="relative w-24 h-24">
        {/* Outer faint ring */}
        <div className="absolute inset-0 rounded-full border-4 border-[#d62839] opacity-20" />

        {/* Animated spinner ring */}
        <div className="absolute inset-0 rounded-full border-t-4 border-[#e63946] border-solid animate-spin shadow-lg" />

        {/* Screen reader text */}
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
