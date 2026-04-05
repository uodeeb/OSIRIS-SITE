import { useSingleAsset, useMultipleAssets } from '@/hooks/useAssets';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';

interface AssetImageProps {
  assetId: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  showLoading?: boolean;
  showError?: boolean;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

/**
 * Safe image component that loads assets from CDN
 */
export function AssetImage({
  assetId,
  alt = 'Asset Image',
  className = 'w-full h-auto',
  containerClassName = 'relative',
  showLoading = true,
  showError = true,
  onLoad,
  onError,
}: AssetImageProps) {
  const { url, isLoading, error } = useSingleAsset(assetId);

  if (error) {
    if (onError) onError(error);
    if (!showError) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={containerClassName}
      >
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-destructive">
              Failed to load image
            </p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    if (!showLoading) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={containerClassName}
      >
        <div className="bg-card/50 border border-primary/20 rounded-lg p-8 flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </motion.div>
    );
  }

  if (!url) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={containerClassName}
    >
      <img
        src={url}
        alt={alt}
        className={className}
        onLoad={onLoad}
        loading="lazy"
      />
    </motion.div>
  );
}

interface AssetVideoProps {
  assetId: string;
  className?: string;
  containerClassName?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  showLoading?: boolean;
  showError?: boolean;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

/**
 * Safe video component that loads assets from CDN
 */
export function AssetVideo({
  assetId,
  className = 'w-full h-auto rounded-lg',
  containerClassName = 'relative',
  autoplay = true,
  loop = false,
  muted = true,
  controls = true,
  showLoading = true,
  showError = true,
  onLoad,
  onError,
}: AssetVideoProps) {
  const { url, isLoading, error } = useSingleAsset(assetId);

  if (error) {
    if (onError) onError(error);
    if (!showError) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={containerClassName}
      >
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-destructive">
              Failed to load video
            </p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    if (!showLoading) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={containerClassName}
      >
        <div className="bg-card/50 border border-primary/20 rounded-lg p-8 flex items-center justify-center aspect-video">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </motion.div>
    );
  }

  if (!url) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={containerClassName}
    >
      <video
        src={url}
        className={className}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        controls={controls}
        onLoadedData={onLoad}
        onError={() => {
          if (onError) onError('Video failed to load');
        }}
      />
    </motion.div>
  );
}

interface AssetBackgroundProps {
  assetId: string;
  children?: React.ReactNode;
  className?: string;
  opacity?: number;
  blur?: boolean;
}

/**
 * Background image component
 */
export function AssetBackground({
  assetId,
  children,
  className = '',
  opacity = 1,
  blur = false,
}: AssetBackgroundProps) {
  const { url, isLoading } = useSingleAsset(assetId);

  if (isLoading || !url) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`relative ${className}`}
      style={{
        backgroundImage: `url(${url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for opacity and blur */}
      <div
        className={`absolute inset-0 bg-black/40 ${blur ? 'backdrop-blur-sm' : ''}`}
        style={{ opacity: 1 - opacity }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

interface AssetGalleryProps {
  assetIds: string[];
  className?: string;
  itemClassName?: string;
  showLoading?: boolean;
}

/**
 * Gallery component for multiple assets
 */
export function AssetGallery({
  assetIds,
  className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  itemClassName = 'rounded-lg overflow-hidden',
  showLoading = true,
}: AssetGalleryProps) {
  const { urls, isLoading, error } = useMultipleAssets(assetIds);

  if (error && !showLoading) {
    return (
      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
        <p className="text-sm text-destructive">Failed to load gallery</p>
      </div>
    );
  }

  if (isLoading && showLoading) {
    return (
      <div className={className}>
        {assetIds.map((id) => (
          <div
            key={id}
            className={`${itemClassName} bg-card/50 border border-primary/20 animate-pulse`}
            style={{ aspectRatio: '16/9' }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
      className={className}
    >
      {assetIds.map((id) => (
        <motion.div
          key={id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={itemClassName}
        >
          {urls[id] ? (
            <img
              src={urls[id]}
              alt={`Gallery item ${id}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-card/50 border border-primary/20" />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
