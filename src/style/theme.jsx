import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        primary: {
          100: "#ffffff",
          200: "#ffffff",
          300: "#ffffff",
          400: "#ffffff",
          500: "#ffffff",
          600: "#cccccc",
          700: "#999999",
          800: "#666666",
          900: "#333333",
        },
        secondary: {
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
        accent1: {
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
        accent2: {
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
        accent3: {
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
        accent4: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1F2A40",
          500: "#141b2d",
          600: "#1F2A40",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
      }
    : {
        primary: {
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
        secondary: {
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
        accent1: {
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
        accent2: {
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
        accent3: {
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
        accent4: {
          100: "#ffffff",
          200: "#ffffff",
          300: "#ffffff",
          400: "#ffffff",
          500: "#ffffff",
          600: "#F4F4F4",
          700: "#999999",
          800: "#666666",
          900: "#333333",
        },
      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.accent1[500],
            },
            neutral: {
              dark: colors.primary[700],
              main: colors.primary[500],
              light: colors.primary[100],
            },
            background: {
              default: "#141b2d",
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.secondary[500],
            },
            neutral: {
              dark: colors.accent1[500],
              main: colors.accent2[500],
              light: colors.accent3[500],
            },
            background: {
              default: "#ffffff",
            },
          }),
    },
    typography: {
      // fontFamily: ["Abel", "sans-serif"].join(","),
      // fontSize: 16,
      h1: {
        fontFamily: ["Abel", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Abel", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Abel", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Abel", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Abel", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Abel", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
