
(function () {
  function getCleanFileName(url) {
    if (!url) return '';
    try {
      const urlObj = new URL(url, window.location.origin);
      return urlObj.pathname;
    } catch (e) {
      return url.split('?')[0].split('#')[0];
    }
  }

  function updateNutritionImages(targetSrc) {
    const cleanTargetSrc = getCleanFileName(targetSrc);
    if (!cleanTargetSrc) return;

    // Get all ingredient images (hidden or visible) to match against
    const ingredientImages = document.querySelectorAll('.product-cta-images .ingredient-images .image-wrapper img');
    // Get all nutrition images to toggle
    const nutritionWrappers = document.querySelectorAll('.product-cta-images .nutrition-images .image-wrapper');

    let matchIndex = -1;

    // Find if the targetSrc matches one of the ingredient images
    ingredientImages.forEach((img, index) => {
      const cleanImgSrc = getCleanFileName(img.src);
      // Detailed matching: check if filenames match (ignoring size variants)
      if (cleanImgSrc === cleanTargetSrc ||
        (cleanImgSrc && cleanTargetSrc && cleanImgSrc.endsWith(cleanTargetSrc)) ||
        (cleanTargetSrc && cleanImgSrc && cleanTargetSrc.endsWith(cleanImgSrc))) {
        matchIndex = index;
      }
    });

    // If a match was found in the ingredient images, show the corresponding nutrition image
    if (matchIndex !== -1) {
      nutritionWrappers.forEach((wrapper, index) => {
        if (index === matchIndex) {
          wrapper.style.display = 'block';
        } else {
          wrapper.style.display = 'none';
        }
      });
    }
  }

  function initCtaImages() {
    // Select all thumbnail items in the slider
    const thumbnails = document.querySelectorAll('.thumbnail-list__item');

    // Add click event listeners
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', function () {
        // Find the image inside the thumbnail button
        const img = this.querySelector('img');
        if (img) {
          updateNutritionImages(img.src);
        }
      });
    });

    // Initial check: attempt to set state based on the active thumbnail
    const activeThumb = document.querySelector('.thumbnail-list__item[aria-current="true"]') || document.querySelector('.thumbnail-list__item');
    if (activeThumb) {
      const img = activeThumb.querySelector('img');
      if (img) updateNutritionImages(activeThumb.dataset.target ? '' : img.src);
      // Note: dataset.target usually points to the media ID, but we rely on src matching here.
      // If the thumbnail is for a 3D model or video, the img.src is the preview.
      // The user specifically mentioned .jpg matching, so we assume image-to-image matching.

      if (img && img.src) updateNutritionImages(img.src);
    }

    // Also, as a fallback or default, if we are just loading, ensuring the first one is visible if no match (already handled by CSS or default HTML flow? Usually they stack).
    // If we want to enforce showing the first one if nothing is hidden yet:
    // The user said "first nutrition image will display" on reload, so we assume the CSS or Liquid handles the initial state (likely all visible or just first?).
    // Just in case, let's enforce index 0 if no specific match triggers?
    // User: "reload the page the first nutrition image will display" -> This implies it works by default. I won't interfere unless clicked.
    // Actually, I should probably call updateNutritionImages with the *active* one to sync state immediately if the user reloads focused on a variant?
    // But `aria-current="true"` usually is the first one.

    // Let's ensure the initial state is correct for the first thumbnail if it's the active one.
    if (activeThumb) {
      const img = activeThumb.querySelector('img');
      if (img) updateNutritionImages(img.src);
    }
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCtaImages);
  } else {
    initCtaImages();
  }
})();
