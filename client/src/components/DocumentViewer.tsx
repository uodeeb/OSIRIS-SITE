import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { AssetImage } from './AssetComponents';

interface DocumentViewerProps {
  assetId: string;
  title?: string;
  description?: string;
  className?: string;
  onClose?: () => void;
}

/**
 * Interactive document viewer component
 */
export function DocumentViewer({
  assetId,
  title = 'Document',
  description,
  className = '',
  onClose,
}: DocumentViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  return (
    <>
      {/* Thumbnail */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(true)}
        className={`cursor-pointer rounded-lg overflow-hidden border border-primary/30 hover:border-primary/60 transition-colors ${className}`}
      >
        <AssetImage
          assetId={assetId}
          alt={title}
          className="w-full h-auto"
          containerClassName="bg-card/50"
        />
      </motion.div>

      {/* Expanded View Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-card/50 border-b border-primary/20 p-4 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  {description && (
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                  )}
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Document Content */}
              <div className="flex-1 overflow-auto flex items-center justify-center bg-background/50 p-4">
                <div
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                  className="transition-transform"
                >
                  <AssetImage
                    assetId={assetId}
                    alt={title}
                    className="max-w-full h-auto"
                    containerClassName=""
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="bg-card/50 border-t border-primary/20 p-4 flex items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ZoomOut className="w-5 h-5 text-muted-foreground" />
                </motion.button>

                <span className="text-sm text-muted-foreground font-mono w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleZoomIn}
                  disabled={zoom >= 2}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ZoomIn className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface DocumentGalleryProps {
  documents: Array<{
    assetId: string;
    title: string;
    description?: string;
  }>;
  className?: string;
  columns?: number;
}

/**
 * Gallery of documents
 */
export function DocumentGallery({
  documents,
  className = '',
  columns = 3,
}: DocumentGalleryProps) {
  return (
    <div
      className={`grid gap-4 ${className}`}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
      }}
    >
      {documents.map((doc) => (
        <motion.div
          key={doc.assetId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DocumentViewer
            assetId={doc.assetId}
            title={doc.title}
            description={doc.description}
          />
        </motion.div>
      ))}
    </div>
  );
}
