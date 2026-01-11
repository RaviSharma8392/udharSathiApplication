

const LANGUAGE_KEY = "app_language";
// Save language to localStorage
export function setLanguage(langCode) {
  try {
    localStorage.setItem(LANGUAGE_KEY, langCode);
  } catch (e) {
    console.error("Failed to save language", e);
  }
}

// Get language from localStorage
export function getLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_KEY) || "en";
  } catch (e) {
    console.error("Failed to get language", e);
    return "en";
  }
}