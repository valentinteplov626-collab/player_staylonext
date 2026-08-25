import {
    URL_PARAM,
    createURLSearchParams,
    getUrl
} from "./shared-YWX6IOU3.js";
import {
    getCurrentLanguage
} from "./shared-O2PRP3GE.js";
var getUTCFormattedTime = () => {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    const hours = String(now.getUTCHours()).padStart(2, "0");
    const minutes = String(now.getUTCMinutes()).padStart(2, "0");
    const seconds = String(now.getUTCSeconds()).padStart(2, "0");
    const microseconds = String(now.getUTCMilliseconds() * 1e3).padStart(6, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds} +00:00`;
};
var EVENTS_HISTORY_KEY = "events_history";
var getEventsHistory = () => {
    try {
        const history = sessionStorage.getItem(EVENTS_HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    } catch (error) {
        if (error instanceof Error && window.syncMetric) {
            window.syncMetric({
                event: "error",
                errorMessage: error.message,
                errorType: "CUSTOM",
                errorSubType: "EventsHistoryGet"
            });
        }
        return [];
    }
};
var saveEventsHistory = (history) => {
    try {
        sessionStorage.setItem(EVENTS_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        if (error instanceof Error && window.syncMetric) {
            window.syncMetric({
                event: "error",
                errorMessage: error.message,
                errorType: "CUSTOM",
                errorSubType: "EventsHistorySave"
            });
        }
    }
};
var getHashesString = () => {
    if (!window.templateHashes) return null;
    return JSON.stringify(window.templateHashes);
};
var EVENT_MAPPING = {
    ["start"]: "start",
    ["ageExit"]: "age_exit",
    ["mainExit"]: "main_exit",
    ["push"]: "push",
    ["autoexit"]: "autoexit",
    ["back"]: "back",
    ["reverse"]: "reverse",
    ["tabUnderClick"]: "tab_under_click",
    ["error"]: "error",
    ["unhandledRejection"]: "unhandled_rejection",
    ["template_hash_ready"]: "template_hash_ready",
    ["template_hashes_ready"]: "template_hashes_ready"
};
var landingLoadDateTime = getUTCFormattedTime();
var getAb2rValue = () => {
    if (URL_PARAM.abtest) return URL_PARAM.abtest;
    return APP_CONFIG.abtest ? String(APP_CONFIG.abtest) : void 0;
};
var collectMetricsData = ({
    event,
    exitZoneId,
    errorMessage,
    errorSubType,
    errorType,
    skipHistory
}) => {
    var _a, _b, _c, _d;
    const docAttrs = (_a = document.querySelector("html")) == null ? void 0 : _a.dataset;
    const landingName = (docAttrs == null ? void 0 : docAttrs.landingName) || "";
    const dataVer = (docAttrs == null ? void 0 : docAttrs.version) || "";
    const dataEnv = (docAttrs == null ? void 0 : docAttrs.env) || "";
    const landingDomain = window.location.host;
    const serverEvent = EVENT_MAPPING[event] || event;
    const landingLanguage = getCurrentLanguage();
    const eventsHistorySize = 30;
    const currentTs = Date.now();
    const eventsHistory = getEventsHistory();
    const lastEvent = eventsHistory[eventsHistory.length - 1];
    const delta = lastEvent ? currentTs - lastEvent.currentTs : 0;
    if (!skipHistory) {
        eventsHistory.push({
            currentTs,
            eventName: serverEvent,
            delta
        });
        if (eventsHistory.length >= eventsHistorySize) {
            eventsHistory.shift();
        }
        saveEventsHistory(eventsHistory);
    }
    const eventData = [{
        app: "landings-constructor",
        event: serverEvent,
        language: landingLanguage,
        landing_name: landingName,
        build_version: dataVer,
        landing_domain: landingDomain,
        landing_url: window.location.href,
        exit_zone_id: exitZoneId ? Number(exitZoneId) : void 0,
        template_hash: (_b = window.templateHash) != null ? _b : "",
        request_var: URL_PARAM.var_3,
        source_zone_id: Number.isNaN(Number(URL_PARAM.var_2)) ? null : Number(URL_PARAM.var_2),
        sub_id: URL_PARAM.var_1,
        landing_load_date_time: landingLoadDateTime,
        error_message: errorMessage != null ? errorMessage : "",
        ab2r: getAb2rValue(),
        events_history: getEventsHistory(),
        context: JSON.stringify({
            template_hashes: JSON.parse((_c = getHashesString()) != null ? _c : "{}")
        }),
        error_sub_type: errorSubType,
        error_type: errorType,
        env: dataEnv
    }];
    const isAnalyticEnabled = (_d = APP_CONFIG.isAnalyticEnabled) != null ? _d : true;
    return {
        eventData,
        isAnalyticEnabled
    };
};
var pushStateToHistory = (url, times) => {
    try {
        for (let i = 0; i < times; i += 1) {
            window.history.pushState(null, "Please wait...", url);
        }
        const currentUrl = window.location.href;
        window.history.pushState(null, document.title, currentUrl);
        console.log(`Back initializated ${times} times with ${url}`);
    } catch (error) {
        if (error instanceof Error && window.syncMetric) {
            window.syncMetric({
                event: "error",
                errorMessage: error.message,
                errorType: "CUSTOM",
                errorSubType: "PushStateToHistory"
            });
        }
    }
};
var initBackIfNeeded = async (config) => {
    var _a;
    const back = config == null ? void 0 : config.back;
    if (back) {
        const {
            currentTab,
            pageUrl: backPageURL
        } = back;
        if (currentTab) {
            const historyTimeAmount = (_a = back.count) != null ? _a : 10;
            const {
                origin,
                pathname
            } = window.location;
            let backBase = `${origin}${pathname}`;
            if (backPageURL) {
                backBase = backPageURL;
            } else {
                if (backBase.includes("index.html")) {
                    backBase = backBase.split("/index.html")[0];
                }
                if (backBase.includes("back.html")) {
                    backBase = backBase.split("/back.html")[0];
                }
                if (backBase.endsWith("/")) {
                    backBase = backBase.substring(0, backBase.length - 1);
                }
                backBase = `${backBase}/back.html`;
            }
            const backUrlBase = new URL(backBase);
            const searchParams = await createURLSearchParams({
                zone: currentTab.zoneId
            });
            if (currentTab.url) searchParams.set("url", currentTab.url);
            else if (currentTab.domain && currentTab.zoneId) {
                searchParams.set("z", currentTab.zoneId);
                searchParams.set("domain", currentTab.domain);
            }
            const {
                eventData,
                isAnalyticEnabled
            } = collectMetricsData({
                event: "back",
                exitZoneId: currentTab.zoneId,
                skipHistory: true
            });
            if (isAnalyticEnabled) {
                const encodedMetricsData = btoa(JSON.stringify(eventData));
                searchParams.set("mData", encodedMetricsData);
            }
            const backUrl = decodeURIComponent(`${backUrlBase.toString()}?${searchParams.toString()}`);
            pushStateToHistory(backUrl, historyTimeAmount);
        }
    }
};
var Redirect = ({
    url
}) => {
    window.location.replace(url);
};
var Popunder = ({
    currentTabUrl,
    newTabUrl
}) => {
    if (newTabUrl) {
        const newTab = window.open(newTabUrl, "_blank");
        if (newTab) {
            newTab.opener = null;
            if (currentTabUrl) {
                document.addEventListener("visibilitychange", () => {
                    if (document.visibilityState === "visible") {
                        Redirect({
                            url: currentTabUrl
                        });
                    }
                });
                return;
            }
        }
    } else if (currentTabUrl) {
        Redirect({
            url: currentTabUrl
        });
    }
};
var exitError = (exitData, exitName) => {
    console.error(
        `${exitName || "Some exit"} was supposed to work, but some data about this type of exit was missed`,
        exitData
    );
};
var makeRedirect = async (config, exitName, shouldInitBack = true) => {
    var _a, _b;
    const {
        currentTab: exitData
    } = config[exitName];
    console.log(`${exitName} worked`, config);
    if (exitData) {
        let url;
        if (exitData.zoneId && exitData.domain) {
            (_a = window.syncMetric) == null ? void 0 : _a.call(window, {
                event: exitName,
                exitZoneId: exitData.zoneId
            });
            url = await getUrl(exitData.zoneId, exitData.domain);
            if (shouldInitBack) await initBackIfNeeded(config);
            return Redirect({
                url
            });
        }
        if (exitData.url) {
            (_b = window.syncMetric) == null ? void 0 : _b.call(window, {
                event: exitName,
                exitZoneId: exitData.url
            });
            url = exitData.url;
            if (shouldInitBack) await initBackIfNeeded(config);
            return Redirect({
                url
            });
        }
    }
    exitError(exitData, exitName);
};
var makeExit = async (config, exitName) => {
    var _a, _b;
    const exitData = config[exitName];
    console.log(`${exitName} worked`, config);
    if (exitData) {
        const {
            currentTab,
            newTab
        } = exitData;
        let currentTabUrl;
        if (currentTab) {
            if (currentTab.zoneId && currentTab.domain) {
                currentTabUrl = await getUrl(currentTab.zoneId, currentTab.domain);
                (_a = window.syncMetric) == null ? void 0 : _a.call(window, {
                    event: exitName,
                    exitZoneId: currentTab.zoneId
                });
            } else if (currentTab.url) {
                currentTabUrl = currentTab.url;
            } else {
                exitError(exitData, exitName);
            }
        }
        let newTabUrl;
        if (newTab) {
            if (newTab.zoneId && newTab.domain) {
                newTabUrl = await getUrl(newTab.zoneId, newTab.domain);
                (_b = window.syncMetric) == null ? void 0 : _b.call(window, {
                    event: exitName,
                    exitZoneId: newTab.zoneId
                });
            } else if (newTab.url) {
                newTabUrl = newTab.url;
            } else {
                exitError(exitData, exitName);
            }
        }
        await initBackIfNeeded(config);
        Popunder({
            currentTabUrl,
            newTabUrl
        });
        return;
    }
    exitError(exitData, exitName);
};

export {
    initBackIfNeeded,
    makeRedirect,
    makeExit
};