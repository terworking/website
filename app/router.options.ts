import type { RouterConfig } from '@nuxt/schema';

export default {
  scrollBehavior: (to) => {
    if (to.hash) {
      const heading = document.querySelector(to.hash);

      if (heading instanceof HTMLHeadingElement) {
        const headerHeight = useRemToPx(4.5);

        window.scrollTo({
          behavior: 'smooth',
          top:
            heading.offsetTop - // only subtract on scroll up
            (heading.offsetTop < window.scrollY ? headerHeight : 0),
        });

        return;
      }
    }

    return { top: 0 };
  },
} as RouterConfig;
