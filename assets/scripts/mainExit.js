import {
    makeExit
} from "./shared-R4IH377J.js";
import {
    parseConfig
} from "./shared-YWX6IOU3.js";
import "./shared-O2PRP3GE.js";
import "./shared-A4NYGF2N.js";
var config = parseConfig(APP_CONFIG);
if (config) {
    document.addEventListener("click", () => {
        makeExit(config, "mainExit");
    });
}