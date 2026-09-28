import React, {useEffect, useRef, useState} from 'react';

const ZOOMABLE_IMAGE_SELECTOR = '.theme-doc-markdown img:not([data-no-zoom])';

const LABELS = {
  en: {
    close: 'Close enlarged image',
    dialog: 'Enlarged image',
    open: 'Enlarge image',
  },
  es: {
    close: 'Cerrar imagen ampliada',
    dialog: 'Imagen ampliada',
    open: 'Ampliar imagen',
  },
  fr: {
    close: 'Fermer l’image agrandie',
    dialog: 'Image agrandie',
    open: 'Agrandir l’image',
  },
  'pt-BR': {
    close: 'Fechar imagem ampliada',
    dialog: 'Imagem ampliada',
    open: 'Ampliar imagem',
  },
};

function getLabels() {
  const locale = document.documentElement.lang || 'en';
  return LABELS[locale] || LABELS[locale.split('-')[0]] || LABELS.en;
}

function getZoomableImage(target) {
  if (!(target instanceof Element)) {
    return null;
  }

  const image = target.closest(ZOOMABLE_IMAGE_SELECTOR);
  return image instanceof HTMLImageElement ? image : null;
}

export default function Root({children}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const closeButtonRef = useRef(null);
  const triggerRef = useRef(null);

  const handleLightboxImageClick = (event) => {
    const image = event.currentTarget;
    const bounds = image.getBoundingClientRect();

    if (!image.naturalWidth || !image.naturalHeight) {
      return;
    }

    const scale = Math.min(
      bounds.width / image.naturalWidth,
      bounds.height / image.naturalHeight,
    );
    const renderedWidth = image.naturalWidth * scale;
    const renderedHeight = image.naturalHeight * scale;
    const renderedLeft = bounds.left + (bounds.width - renderedWidth) / 2;
    const renderedTop = bounds.top + (bounds.height - renderedHeight) / 2;
    const isOutsideRenderedImage =
      event.clientX < renderedLeft ||
      event.clientX > renderedLeft + renderedWidth ||
      event.clientY < renderedTop ||
      event.clientY > renderedTop + renderedHeight;

    if (isOutsideRenderedImage) {
      setSelectedImage(null);
    }
  };

  useEffect(() => {
    const prepareImage = (image) => {
      if (image.dataset.zoomReady === 'true') {
        return;
      }

      const labels = getLabels();
      image.dataset.zoomReady = 'true';
      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute(
        'aria-label',
        image.alt ? `${labels.open} : ${image.alt}` : labels.open,
      );
    };

    const prepareImages = (root) => {
      if (root instanceof HTMLImageElement && root.matches(ZOOMABLE_IMAGE_SELECTOR)) {
        prepareImage(root);
      }

      root
        .querySelectorAll?.(ZOOMABLE_IMAGE_SELECTOR)
        .forEach((image) => prepareImage(image));
    };

    const openImage = (image) => {
      const labels = getLabels();
      triggerRef.current = image;
      setSelectedImage({
        alt: image.alt,
        labels,
        src: image.currentSrc || image.src,
      });
    };

    const handleClick = (event) => {
      const image = getZoomableImage(event.target);
      if (!image) {
        return;
      }

      event.preventDefault();
      openImage(image);
    };

    const handleKeyDown = (event) => {
      const image = getZoomableImage(event.target);
      if (!image || !['Enter', ' '].includes(event.key)) {
        return;
      }

      event.preventDefault();
      openImage(image);
    };

    prepareImages(document);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            prepareImages(node);
          }
        });
      });
    });

    observer.observe(document.body, {childList: true, subtree: true});
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!selectedImage) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleDialogKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
      }

      if (event.key === 'Tab') {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleDialogKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleDialogKeyDown);
      triggerRef.current?.focus();
    };
  }, [selectedImage]);

  return (
    <>
      {children}
      {selectedImage && (
        <div
          aria-label={selectedImage.labels.dialog}
          aria-modal="true"
          className="mv-image-lightbox"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedImage(null);
            }
          }}
          role="dialog">
          <button
            aria-label={selectedImage.labels.close}
            className="mv-image-lightbox__close"
            onClick={() => setSelectedImage(null)}
            ref={closeButtonRef}
            type="button">
            <span aria-hidden="true">×</span>
          </button>
          <figure
            className="mv-image-lightbox__figure"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedImage(null);
              }
            }}>
            <img
              alt={selectedImage.alt}
              className="mv-image-lightbox__image"
              onClick={handleLightboxImageClick}
              src={selectedImage.src}
            />
            {selectedImage.alt && (
              <figcaption className="mv-image-lightbox__caption">
                {selectedImage.alt}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
