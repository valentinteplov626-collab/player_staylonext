import {
    translateElements
} from "./shared-XKSMI6GM.js";
import "./shared-O2PRP3GE.js";
import "./shared-A4NYGF2N.js";
var loadFallbackTranslation = async () => {
    return await import("./shared-ALAZT3NV.js").then(
        (m) => m.default
    );
};
var initTranslation = async () => {
    translateElements(loadFallbackTranslation);
};
initTranslation();