document.addEventListener('DOMContentLoaded', function() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const modelItems = entry.target.querySelectorAll('.model-item');
        modelItems.forEach(function(item, index) {
          setTimeout(function() {
            item.classList.add('scroll-animate');
          }, index * 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const multicolumnInfos = document.querySelectorAll('.multicolumn-card__info');
  multicolumnInfos.forEach(function(info) {
    observer.observe(info);
  });
});
