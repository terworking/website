import type { RouterConfig } from '@nuxt/schema';

export default {
  scrollBehavior: (to) => {
    if (to.hash) {
      const heading = document.querySelector(to.hash);

      if (heading instanceof HTMLHeadingElement) {
        const headerSize = useHeaderSize();

        window.scrollTo({
          behavior: 'smooth',
          top:
            heading.offsetTop - // only subtract on scroll up
            (heading.offsetTop < window.scrollY ? headerSize.height.px : 0),
        });

        return;
      }
    }

    return { top: 0 };
  },
} as RouterConfig;
