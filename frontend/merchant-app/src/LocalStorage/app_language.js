const LANGUAGE_KEY = "app_language";

// Set app language
export function setLanguage(lang) {
  try {
    localStorage.setItem(LANGUAGE_KEY, lang);
  } catch (e) {
    console.error("Failed to save language", e);
  }
}

// Get app language

export function getLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_KEY) || "en";
  } catch (e) {
    return "en";
  }
}
