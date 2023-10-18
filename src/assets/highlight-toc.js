// For highlight toc menu
const anchors = document.querySelectorAll('h2');
const links = document.querySelectorAll('aside > div > toc > ul > li > a');

window.addEventListener('scroll', (event) => {
  if (typeof (anchors) !== 'undefined' && anchors != null && typeof (links) !== 'undefined' && links != null) {
    const scrollTop = window.scrollY;

    // highlight the last scrolled-to: set everything inactive first
    links.forEach((link, index) => {
      link.classList.remove('is-active');
    });

    // then iterate backwards, on the first match highlight it and break
    for (let i = anchors.length - 1; i >= 0; i--) {
      if (scrollTop > anchors[i].offsetTop - 75) {
        links[i].classList.add('is-active');
        break;
      }
    }
  }
});
