import type { RouterConfig } from '@nuxt/schema';

const getOffsetTop = (element: HTMLElement | undefined): number => {
  return element
    ? element.offsetTop + getOffsetTop(element.offsetParent as HTMLElement)
    : 0;
};

export default {
  scrollBehavior: (to) => {
    if (to.hash !== '') {
      const heading = document.querySelector(to.hash);

      if (heading instanceof HTMLHeadingElement) {
        const headerSize = useHeaderSize();

        if (window.scrollY === 0) {
          heading.scrollIntoView({ behavior: 'smooth' });
        } else {
          const offsetTop = getOffsetTop(heading);
          window.scrollTo({
            behavior: 'smooth',
            top:
              offsetTop - // only subtract on scroll up
              (offsetTop < window.scrollY ? headerSize.height.px : 0),
          });
        }

        return;
      }
    }

    return { top: 0 };
  },
} as RouterConfig;
