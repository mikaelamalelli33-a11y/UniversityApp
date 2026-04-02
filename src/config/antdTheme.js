// Ant Design 5 theme token overrides.
// All brand colors are defined here — never hardcode colors in components.

export const antdTheme = {
  token: {
    colorPrimary: '#003087',
    colorSuccess: '#389e0d',
    colorWarning: '#d46b08',
    colorError: '#cf1322',
    borderRadius: 6,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
  },
  components: {
    Layout: {
      siderBg: '#001529',
      headerBg: '#ffffff',
    },
    Menu: {
      darkItemBg: '#001529',
      darkSubMenuItemBg: '#000c17',
    },
  },
};
