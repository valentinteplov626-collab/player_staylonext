import {
    translateElements
} from "./shared-XKSMI6GM.js";
import "./shared-O2PRP3GE.js";
import "./shared-A4NYGF2N.js";
(async () => {
    var _a;
    if (APP_CONFIG.design) {
        const oldHTML = document.body.innerHTML;
        document.body.innerHTML = "";
        const designPath = `./designs/${APP_CONFIG.design}`;
        try {
            const designHTMLResponse = await fetch(`${designPath}/index.html`);
            let designHTMLText = await designHTMLResponse.text();
            if (!designHTMLText || designHTMLResponse.ok === false || designHTMLResponse.status === 404) {
                throw new Error("Design was defined in APP_CONFIG, but there is no such design");
            }
            designHTMLText = designHTMLText.replaceAll(
                "./assets",
                `./designs/${APP_CONFIG.design}/assets`
            );
            const oldDesignCSSLink = document.querySelector("#main-css");
            oldDesignCSSLink.remove();
            const script = document.createElement("script");
            script.src = `${designPath}/assets/script.js`;
            document.body.append(script);
            document.body.innerHTML = designHTMLText;
            translateElements(
                async () => {
                        return await import(`${designPath}/locale/en.json`).then((m) => m.default);
                    }, {},
                    `${designPath}/locale`
            );
        } catch (err) {
            console.error(err);
            document.body.innerHTML = oldHTML;
            if (err instanceof Error) {
                (_a = window.syncMetric) == null ? void 0 : _a.call(window, {
                    event: "error",
                    errorMessage: err.message,
                    errorType: ERROR_TYPE.CUSTOM,
                    errorSubType: "DesignChange"
                });
            }
        }
    }
})();