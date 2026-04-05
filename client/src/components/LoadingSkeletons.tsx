import { motion } from "framer-motion";

export function PlayerSkeleton() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* Background skeleton */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />
      
      {/* Loading indicator */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            className="w-16 h-16 rounded-full border-4 border-amber-600/30 border-t-amber-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="text-amber-500/70 font-mono text-sm tracking-wider"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading Experience...
          </motion.p>
        </div>
      </motion.div>

      {/* Skeleton UI elements */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
        {/* Top bar skeleton */}
        <div className="flex justify-between items-start">
          <div className="w-32 h-8 bg-white/5 rounded-lg" />
          <div className="w-24 h-8 bg-white/5 rounded-lg" />
        </div>

        {/* Dialogue box skeleton */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="h-32 bg-white/5 rounded-2xl backdrop-blur-sm" />
        </div>
      </div>
    </div>
  );
}

export function ModelSkeleton() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div 
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="w-12 h-12 rounded-full border-4 border-amber-600/30 border-t-amber-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-amber-500/70 font-mono text-sm">Loading Model...</p>
      </motion.div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="h-16 bg-white/5 rounded-lg mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
