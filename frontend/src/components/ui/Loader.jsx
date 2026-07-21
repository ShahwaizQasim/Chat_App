const Loader = () => {
  return (
    <div className="fixed inset-0 bg-gray-950/95 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="flex flex-col items-center">
        {/* Modern Spinner */}
        <div className="w-20 h-20 border-4 border-gray-700 border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>

        <p className="mt-6 text-gray-300 text-lg font-medium tracking-wide">
          Loading...
        </p>
      </div>
    </div>
  );
};

export{
    Loader
}