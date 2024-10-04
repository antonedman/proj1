//
//      TILL SIMON:
//
//  Översättningsdelen har jag copy-paste:at mycket från en guide jag hittade.
//  Fått en del hjälp med just den biten (samt knappen en/sv) från en vän
//
//  Dark/Light mode har jag helt tagit Chat-GPT till hjälp
//
//  Jag förstår vad koden nedan gör (typ) men jag förstår inte riktigt hur.
//

// The locale our app first shows
const defaultLocale = "en";

const supportedLocales = ["en", "sv"];

// Gets filled with active locale translations
let translations = {};

// When the page content is ready...
document.addEventListener("DOMContentLoaded", () => {
  const browserLocale = supportedOrDefault(browserLocales(true));
  const currentLocale = getCurrentLocale();
  addLanguageButtonListener();

  const localeToUse = currentLocale ? currentLocale : browserLocale;
  toggleLocaleClass(localeToUse);

  setLocaleAndTranslate(localeToUse);
  setLanguageSwitcherValue(localeToUse);
});

function addLanguageButtonListener() {
  const languageButtons = document.querySelectorAll(
    "[data-language-switch-button]"
  );

  [...languageButtons].map((button) => {
    button.addEventListener("click", (clickEvent) => {
      const selectedLocale = clickEvent.target.getAttribute("data-locale");
      setLocaleAndTranslate(selectedLocale);

      toggleLocaleClass(selectedLocale);
    });
  });
}

/**
 * Toggle the active class on language button
 */
function toggleLocaleClass(locale) {
  const elements = document.querySelectorAll("[data-locale]");

  elements.forEach((element) => {
    const elementLocale = element.getAttribute("data-locale");

    element.classList.remove("text-decoration-underline");

    if (elementLocale === locale) {
      element.classList.add("text-decoration-underline");
    }
  });
}

/**
 * Get the current locale
 */
function getCurrentLocale() {
  return localStorage.getItem("locale");
}

// ...
function isSupported(locale) {
  return supportedLocales.indexOf(locale) > -1;
}
// Retrieve the first locale we support from the given
// array, or return our default locale
function supportedOrDefault(locales) {
  return locales.find(isSupported) || defaultLocale;
}
// ...
function browserLocales(languageCodeOnly = false) {
  return navigator.languages.map((locale) =>
    languageCodeOnly ? locale.split("-")[0] : locale
  );
}

function setLanguageSwitcherValue(initialValue) {
  const switcher = document.querySelector("[data-i18n-switcher]");

  /**
   * If switcher does not exist. Do nothing else!
   */
  if (!switcher) return;

  switcher.value = initialValue;
  switcher.onchange = (e) => {
    setLocaleAndTranslate(e.target.value);
  };
}
/**
 * Retrieve user-preferred locales from the browser
 *
 * @param {boolean} languageCodeOnly - when true, returns
 * ["en", "fr"] instead of ["en-US", "fr-FR"]
 * @returns array | undefined

 */

function browserLocales(languageCodeOnly = false) {
  return navigator.languages.map((locale) =>
    languageCodeOnly ? locale.split("-")[0] : locale
  );
}
// Load translations for the given locale and translate
// the page to this locale

/**
 * Set the locale in localstorage, fetch the translation object & translate the page
 * @param newLocale - The value we want to set the page to
 */
async function setLocaleAndTranslate(newLocale) {
  const currentLocale = getCurrentLocale();
  // if (newLocale === currentLocale) return;

  const newTranslations = await fetchTranslationsFor(newLocale);

  localStorage.setItem("locale", newLocale);

  translations = newTranslations;

  translatePage();
}

// Retrieve translations JSON object for the given
// locale over the network

async function fetchTranslationsFor(newLocale) {
  const response = await fetch(`/lang/${newLocale}.json`);

  return await response.json();
}

// Replace the inner text of each element that has a
// data-i18n-key attribute with the translation corresponding
// to its data-i18n-key

function translatePage() {
  document

    .querySelectorAll("[data-i18n-key]")

    .forEach(translateElement);
}

// Replace the inner text of the given HTML element
// with the translation in the active locale,
// corresponding to the element's data-i18n-key

function getNestedKey(obj, key) {
  return key.split(".").reduce((o, i) => (o ? o[i] : null), obj);
}

function translateElement(element) {
  const key = element.getAttribute("data-i18n-key");

  // Use the helper function to get the nested translation value
  const translation = getNestedKey(translations, key);

  // Only update if translation exists
  if (translation) {
    element.innerText = translation;
  }
}

// ---------- CHATGPT DARK/LIGHTMODE -----------

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  // Function to apply theme and update the icon
  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      themeIcon.src = "assets/sun.svg";
      themeIcon.alt = "Light-mode";
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      themeIcon.src = "assets/moon.svg";
      themeIcon.alt = "Dark-mode";
    }
  }

  // Check user's preference for dark mode or stored preference
  function getPreferredTheme() {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      return storedTheme;
    }
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDarkMode ? "dark" : "light";
  }

  // Initialize theme on page load
  let currentTheme = getPreferredTheme();
  applyTheme(currentTheme); // Apply the theme based on preference

  // Toggle theme on button click
  toggleButton.addEventListener("click", () => {
    // Toggle theme: switch between "dark" and "light"
    currentTheme = currentTheme === "dark" ? "light" : "dark";

    // Apply the new theme and update icon
    applyTheme(currentTheme);

    // Save user's preference
    localStorage.setItem("theme", currentTheme);
  });
});
