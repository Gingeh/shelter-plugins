(function(exports) {

//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion

//#region solid-js/web
var require_web = __commonJS({ "solid-js/web"(exports, module) {
	module.exports = shelter.solidWeb;
} });

//#endregion
//#region plugins/annoyances/index.tsx
var import_web = __toESM(require_web(), 1);
const { plugin: { store }, ui: { SwitchItem: _SwitchItem }, observeDom } = shelter;
const hopefully_unique_id = "annoyances-gingeh";
const SwitchItem = _SwitchItem;
const settings = () => [
	(0, import_web.createComponent)(SwitchItem, {
		get value() {
			return store.member_list_backgrounds;
		},
		onChange: (v) => {
			store.member_list_backgrounds = v;
		},
		children: "Remove member list backgrounds"
	}),
	(0, import_web.createComponent)(SwitchItem, {
		get value() {
			return store.avatar_decorations;
		},
		onChange: (v) => {
			store.avatar_decorations = v;
		},
		children: "Remove avatar decorations"
	}),
	(0, import_web.createComponent)(SwitchItem, {
		get value() {
			return store.fancy_profile_themes;
		},
		onChange: (v) => {
			store.fancy_profile_themes = v;
		},
		children: "Remove fancy profile themes"
	}),
	(0, import_web.createComponent)(SwitchItem, {
		get value() {
			return store.gift_button;
		},
		onChange: (v) => {
			store.gift_button = v;
		},
		children: "Remove gift button"
	}),
	(0, import_web.createComponent)(SwitchItem, {
		get value() {
			return store.quests_button;
		},
		onChange: (v) => {
			store.quests_button = v;
		},
		children: "Remove quests button"
	}),
	(0, import_web.createComponent)(SwitchItem, {
		get value() {
			return store.boosts_button;
		},
		onChange: (v) => {
			store.boosts_button = v;
		},
		children: "Remove boosts button and progress in channel list"
	})
];
let cleanup_callbacks = [];
function onLoad() {
	store.member_list_backgrounds ??= true;
	if (store.member_list_backgrounds) cleanup_callbacks.push(observeDom("[class*=nameplated__] > [class*=container__]", (elem) => {
		elem.style.display = "none";
	}));
	store.avatar_decorations ??= true;
	if (store.avatar_decorations) cleanup_callbacks.push(observeDom("[class*=avatarDecoration__]", (elem) => {
		elem.style.display = "none";
	}));
	store.fancy_profile_themes ??= true;
	if (store.fancy_profile_themes) cleanup_callbacks.push(observeDom(`.custom-theme-background:not([data-${hopefully_unique_id}])`, (elem) => {
		elem.classList.remove("custom-theme-background");
		elem.classList.remove("custom-user-profile-theme");
		elem.style = "--profile-gradient-primary-color: var(--background-surface-high); --profile-gradient-secondary-color: var(--background-surface-high); --profile-gradient-overlay-color: rgba(0, 0, 0, 0); --profile-gradient-button-color: var(--background-mod-subtle); --profile-gradient-modal-background-color: var(--background-base-lower);";
		const mask_circle = elem.querySelector("circle");
		if (mask_circle) {
			mask_circle.setAttribute("cx", "56");
			mask_circle.setAttribute("cy", "101");
		}
		elem.setAttribute(`data-${hopefully_unique_id}`, "true");
	}));
	store.gift_button ??= true;
	if (store.gift_button) cleanup_callbacks.push(observeDom("[aria-label*=gift][class*=button__]", (elem) => {
		elem.style.display = "none";
	}));
	store.quests_button ??= true;
	if (store.quests_button) cleanup_callbacks.push(observeDom("[href*=quest-home]", (elem) => {
		elem.style.display = "none";
	}));
	store.boosts_button ??= true;
	if (store.boosts_button) {
		cleanup_callbacks.push(observeDom(`[class*=basicChannelRowLink__]:not([data-${hopefully_unique_id}])`, (elem) => {
			if (elem.querySelector("[class*=name__] span")?.textContent.includes("Boosts")) elem.style.display = "none";
else elem.setAttribute(`data-${hopefully_unique_id}`, "true");
		}));
		cleanup_callbacks.push(observeDom("[class*=containerWithMargin__]:has([class*=progressContainer__])", (elem) => {
			elem.style.display = "none";
		}));
	}
}
function onUnload() {
	for (const cb of cleanup_callbacks) cb();
}

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
exports.settings = settings
return exports;
})({});