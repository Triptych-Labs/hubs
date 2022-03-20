import { useEffect, useState } from "react";
import PropTypes from "prop-types";

let config = process.env.APP_CONFIG;

// Storybook includes environment variables as a string
// https://storybook.js.org/docs/react/configure/environment-variables
if (!config && process.env.STORYBOOK_APP_CONFIG) {
  config = JSON.parse(process.env.STORYBOOK_APP_CONFIG);
}

if (!config) {
  config = window.APP_CONFIG;
}

if (config?.theme?.error) {
  console.error(
    `Custom themes failed to load.\n${
      config.theme.error
    }\nIf you are an admin, reconfigure your themes in the admin panel.`
  );
}

export const defaultTheme = "default";

export const themes = [
  {
    name: "Hubs Dark Mode",
    id: "default",
    darkModeDefault: true,
    variables: {
      "loading-screen-background": "radial-gradient(50% 50% at 50% 50%, #15171B 0%, #282C31 100%)",
      "accept-color-pressed": "#21242C",
      "primary-color-hover": "#12A4ED",
      "primary-color": "#12A4ED",
      "outline-color": "#ffffff",
      "basic-color": "#3A4048",
      "basic-color-hover": "#4B5562",
      "basic-color-pressed": "#636F80",
      "basic-border-color": "#13a4ed",
      "secondary-color-pressed": "#282C31",
      "accent1-color": "#2B313B",
      "accent1-color-hover": "#5D646C",
      "accent1-border-color": "#13a4ed",
      "accent1-color-pressed": "#21242C",
      "accent2-color": "#2B313B",
      "accent2-color-hover": "#5D646C",
      "accent2-color-pressed": "#21242C",
      "accent2-border-color": "#13a4ed",
      "accent3-color-pressed": "#21242C",
      "accent3-color": "#2B313B",
      "accent3-color-hover": "#5D646C",
      "accent3-border-color": "#13a4ed",
      "accent4-color": "#2B313B",
      "accent4-border-color": "#13a4ed",
      "accent4-color-hover": "#5D646C",
      "accent4-color-pressed": "#00699E",
      "accent5-color": "#2B313B",
      "accent5-border-color": "#13a4ed",
      "accent5-color-hover": "#5D646C",
      "accent5-color-pressed": "#21242C",
      "admin-color": "#13a4ed",
      "text1-color": "#ffffff",
      "text1-color-hover": "#E7E7E7",
      "text1-color-pressed": "#DBDBDB",
      "text2-color-pressed": "#DBDBDB",
      "text3-color-hover": "#C7C7C7",
      "text3-color-pressed": "#ADADAD",
      "text2-color-hover": "#F5F5F5",
      "text2-color": "#E7E7E7",
      "text3-color": "#BBBBBB",
      "text4-color": "#BBBBBB",
      "secondary-color": "#3A4048",
      "secondary-color-hover": "#5D646C",
      "border1-color": "#3A4048",
      "border2-color": "#5D646C",
      "border3-color": "#5D646C",
      "active-color-hover": "#12A4ED",
      "active-text-color": "#2B313B",
      "background1-color": "#2B313B",
      "background2-color": "#21242C",
      "background3-color": "#3A4048",
      "background4-color": "#5D646C",
      "accept-color": "#2B313B",
      "accept-color-hover": "#5D646C",
      "accept-border-color": "#7ED320",
      "background-hover-color": "#aaaaaa",
      "input-bg-color": "#21242C",
      "tip-text-color": "#ffffff",
      "tip-bg-color": "#017ab8",
      "tip-button-color-hover": "#008bd1",
      "action-color": "#000000",
      "action-color-highlight": "#149ce2",
      "action-label-color": "#5634ff",
      "notice-background-color": "#000000",
      "toolbar-icon-selected-bg": "#ffffff",
      "toolbar-basic-icon-color": "#ffffff",
      "toolbar-basic-selected-icon-color": "#2B313B",
      "toolbar-basic-color-hover": "#ffffff",
      "toolbar-label-accent1": "#ffffff",
      "toolbar-label-accent2": "#ffffff",
      "toolbar-label-accent3": "#ffffff",
      "toolbar-label-accent4": "#ffffff",
      "toolbar-label-accent5": "#ffffff"
    }
  }
];

export function useTheme(themeId) {
  const darkMode = true;

  useEffect(
    () => {
      // Themes can come from an external source. Ensure it is an array.
      if (!Array.isArray(themes)) return;

      let theme;

      if (themeId) {
        theme = themes.find(t => t.id === themeId);
      }

      if (!theme && darkMode) {
        theme = themes.find(t => t.darkModeDefault);
      }

      if (!theme) {
        theme = themes.find(t => t.default);
      }

      if (!theme) {
        return;
      }

      const variables = [];

      for (const key in theme.variables) {
        if (!theme.variables.hasOwnProperty(key)) continue;
        variables.push(`--${key}: ${theme.variables[key]};`);
      }

      const styleTag = document.createElement("style");

      styleTag.innerHTML = `:root {
        ${variables.join("\n")}
      }`;

      document.head.appendChild(styleTag);

      return () => {
        document.head.removeChild(styleTag);
      };
    },
    [themeId, darkMode]
  );
}

export function useThemeFromStore(store) {
  const [themeId, setThemeId] = useState(store?.state?.preferences?.theme);

  useEffect(() => {
    function onStoreChanged() {
      const nextThemeId = store.state?.preferences?.theme;

      if (themeId !== nextThemeId) {
        setThemeId(nextThemeId);
      }
    }

    if (store) {
      store.addEventListener("statechanged", onStoreChanged);
    }

    return () => {
      if (store) {
        store.removeEventListener("statechanged", onStoreChanged);
      }
    };
  });

  useTheme(themeId);
}

export function ThemeProvider({ store, children }) {
  useThemeFromStore(store);
  return children;
}

ThemeProvider.propTypes = {
  store: PropTypes.object,
  children: PropTypes.node
};
