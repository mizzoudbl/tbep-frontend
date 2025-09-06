export default {
  '*': {
    display: 'hidden',
    theme: {
      navbar: false,
      footer: false,
    },
  },
  docs: {
    display: 'children',
    theme: {
      navbar: true,
      footer: true,
    },
  },
};
