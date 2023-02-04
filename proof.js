// color design tokens export
export const tokensDark = {
  grey: {
    0: "#ffffff", // manually adjusted
    10: "#f6f6f6", // manually adjusted
    50: "#f0f0f0", // manually adjusted
    100: "#e0e0e0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
    1000: "#000000", // manually adjusted
  },
  primary: {
    // blue
    100: "#d3d4de",
    200: "#a6a9be",
    300: "#7a7f9d",
    400: "#4d547d",
    500: "#21295c",
    600: "#191F45", // manually adjusted
    700: "#141937",
    800: "#0d1025",
    900: "#070812",
  },
  secondary: {
    // yellow
    50: "#f0f0f0", // manually adjusted
    100: "#fff6e0",
    200: "#ffedc2",
    300: "#ffe3a3",
    400: "#ffda85",
    500: "#ffd166",
    600: "#cca752",
    700: "#997d3d",
    800: "#665429",
    900: "#332a14",
  },
};

export const tokensLight = {
  black: {
    100: "#cdcddf",
    200: "#9a9bbf",
    300: "#68689e",
    400: "#35367e",
    500: "#03045e",
    600: "#02034b",
    700: "#020238",
    800: "#010226",
    900: "#010113",
  },
  blue: {
    100: "#cce4f0",
    200: "#99c9e2",
    300: "#66add3",
    400: "#3392c5",
    500: "#0077b6",
    600: "#005f92",
    700: "#00476d",
    800: "#003049",
    900: "#001824",
  },
  teal: {
    100: "#ccf0f7",
    200: "#99e1ef",
    300: "#66d2e8",
    400: "#33c3e0",
    500: "#00b4d8",
    600: "#0090ad",
    700: "#006c82",
    800: "#004856",
    900: "#00242b",
  },
  gray: {
    100: "#e9f9fc",
    200: "#d3f3f9",
    300: "#bcecf5",
    400: "#a6e6f2",
    500: "#90e0ef",
    600: "#73b3bf",
    700: "#56868f",
    800: "#3a5a60",
    900: "#1d2d30",
  },
  white: {
    100: "#f4fcfe",
    200: "#eaf9fc",
    300: "#dff6fb",
    400: "#d5f3f9",
    500: "#caf0f8",
    600: "#a2c0c6",
    700: "#799095",
    800: "#516063",
    900: "#283032",
  },
};

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[400],
              light: tokensDark.primary[400],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[300],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.primary[600],
              alt: tokensDark.primary[500],
            },
          }
        : {
            // palette values for light mode
            primary: {
              ...tokensLight.primary,
              main: tokensDark.grey[50],
              light: tokensDark.grey[100],
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensDark.secondary[600],
              light: tokensDark.secondary[700],
            },
            neutral: {
              ...tokensLight.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[0],
              alt: tokensDark.grey[50],
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
