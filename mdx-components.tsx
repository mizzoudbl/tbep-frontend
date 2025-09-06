import { ImageZoom } from 'nextra/components';
import type { MDXComponents } from 'nextra/mdx-components';
import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs';

// Get the default MDX components
const themeComponents = getThemeComponents();

// Merge components
export function useMDXComponents(components: MDXComponents) {
  return {
    ...themeComponents,
    ...components,
    img: ({ ...props }) => (
      <>
        <ImageZoom src={props.src} alt={props.alt} className='mx-auto rounded-md border' {...props} />
        <i style={{ textAlign: 'center', display: 'block' }}>{props.alt}</i>
      </>
    ),
  };
}
