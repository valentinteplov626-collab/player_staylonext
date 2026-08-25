import {
    getCurrentLanguage
} from "./shared-O2PRP3GE.js";
var translationsCache = {};
var isFallbackCache = {};
var localePathCache;
var getTranslations = async (loadFallbackTranslation, localePath) => {
    const lang = getCurrentLanguage();
    if (!translationsCache[lang] || localePathCache !== localePath) {
        localePathCache = localePath;
        translationsCache[lang] = (async () => {
            try {
                const localeUrl = localePath ? `${localePath}/${lang}.json` : `./locales/${lang}.json`;
                const response = await fetch(localeUrl);
                if (response.ok && response.status === 200) {
                    isFallbackCache[lang] = false;
                    return await response.json();
                }
                throw new Error(`Locale file not found: ${localeUrl}`);
            } catch (error) {
                if (error instanceof Error && window.syncMetric) {
                    window.syncMetric({
                        event: "error",
                        errorMessage: error.message,
                        errorType: "CUSTOM",
                        errorSubType: "GetTranslations"
                    });
                    console.error(
                        `Error while loading translations: ${error.message}. Check the content of ${localePath ? `${localePath}/${lang}.json` : `./locales/${lang}.json`} file`
                    );
                }
                isFallbackCache[lang] = true;
                return await loadFallbackTranslation();
            }
        })();
    }
    return translationsCache[lang];
};
var isFallbackTranslation = (localePath) => {
    var _a;
    const lang = getCurrentLanguage();
    if (localePathCache !== localePath) {
        return false;
    }
    return (_a = isFallbackCache[lang]) != null ? _a : false;
};
var translateElements = async (loadFallbackTranslation, macroses, localePath) => {
    const lang = getCurrentLanguage();
    document.documentElement.setAttribute("lang", lang);
    const translations = await getTranslations(loadFallbackTranslation, localePath);
    if (["ar", "he", "fa", "ur", "az", "ku", "ff", "dv"].includes(lang)) {
        const isFallback = isFallbackTranslation(localePath);
        if (!isFallback) {
            document.documentElement.setAttribute("dir", "rtl");
        }
    }
    const nonTranslatedKeys = [];
    Object.entries(translations).forEach((translation) => {
        const key = translation[0];
        let value = translation[1];
        const macros = macroses == null ? void 0 : macroses[key];
        value = macros ? value.replaceAll(macros.macros, macros.macrosValue) : value;
        const elementToTranslate = document.querySelectorAll(
            `[data-translate="${key}"]`
        );
        if (elementToTranslate == null ? void 0 : elementToTranslate.length) {
            elementToTranslate.forEach((element) => {
                if (element) {
                    const useHTML = element.hasAttribute("data-translate-html");
                    if (useHTML) {
                        element.innerHTML = value;
                    } else {
                        if (!element.childNodes.length) element.textContent = value;
                        element.childNodes.forEach((node) => {
                            if (node.nodeType === Node.TEXT_NODE) {
                                node.nodeValue = value;
                            }
                        });
                    }
                }
            });
            return;
        }
        nonTranslatedKeys.push(key);
    });
    if (nonTranslatedKeys.length) {
        console.warn(
            `Some keys from locales folder weren't used for translation when loading the landing page for the first time:`,
            nonTranslatedKeys.join(", ")
        );
    }
};

export {
    translateElements
};