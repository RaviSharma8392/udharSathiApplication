export function t(lang, textObj, key, vars = {}) {
  let text = textObj[lang]?.[key] || textObj.en[key];

  Object.keys(vars).forEach((v) => {
    text = text.replace(`{{${v}}}`, vars[v]);
  });

  return text;
}
