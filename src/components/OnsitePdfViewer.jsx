import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const OnsitePdfViewer = ({ src, title }) => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;

    const renderPdf = async () => {
      if (!src || !container) return;

      setLoading(true);
      setError(null);
      setPageCount(0);
      container.innerHTML = '';

      try {
        const pdf = await pdfjsLib.getDocument({
          url: src,
          withCredentials: false,
        }).promise;

        if (cancelled) return;
        setPageCount(pdf.numPages);

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          if (cancelled) return;

          const baseViewport = page.getViewport({ scale: 1 });
          const width = container.clientWidth || 800;
          const scale = width / baseViewport.width;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className = 'w-full h-auto bg-white mb-4 last:mb-0';
          canvas.setAttribute('aria-label', `${title} page ${pageNumber}`);
          container.appendChild(canvas);

          await page.render({
            canvasContext: canvas.getContext('2d'),
            viewport,
          }).promise;
        }
      } catch (err) {
        console.error('PDF render failed:', err);
        if (!cancelled) {
          setError('Unable to display this PDF in the viewer.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    renderPdf();

    return () => {
      cancelled = true;
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [src, title]);

  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      {loading && (
        <p className="p-6 text-center text-gray-600 dark:text-gray-300">Loading PDF...</p>
      )}
      {error && (
        <p className="p-6 text-center text-red-500">{error}</p>
      )}
      <div ref={containerRef} className="p-3 sm:p-4" />
      {!loading && !error && pageCount > 0 && (
        <p className="px-4 pb-4 text-sm text-gray-500 dark:text-gray-400">
          {pageCount} page{pageCount === 1 ? '' : 's'}
        </p>
      )}
    </div>
  );
};

export default OnsitePdfViewer;
