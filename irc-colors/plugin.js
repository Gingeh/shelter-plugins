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
//#region node_modules/.pnpm/js-xxhash@4.0.0/node_modules/js-xxhash/dist/esm/xxHash32.js
const PRIME32_1 = 2654435761;
const PRIME32_2 = 2246822519;
const PRIME32_3 = 3266489917;
const PRIME32_4 = 668265263;
const PRIME32_5 = 374761393;
let encoder;
function xxHash32(input, seed = 0) {
	const buffer = typeof input === "string" ? (encoder ??= new TextEncoder()).encode(input) : input;
	const b = buffer;
	let acc = seed + PRIME32_5 & 4294967295;
	let offset = 0;
	if (b.length >= 16) {
		const accN = [
			seed + PRIME32_1 + PRIME32_2 & 4294967295,
			seed + PRIME32_2 & 4294967295,
			seed + 0 & 4294967295,
			seed - PRIME32_1 & 4294967295
		];
		const b$1 = buffer;
		const limit$1 = b$1.length - 16;
		let lane = 0;
		for (offset = 0; (offset & 4294967280) <= limit$1; offset += 4) {
			const i = offset;
			const laneN0 = b$1[i + 0] + (b$1[i + 1] << 8);
			const laneN1 = b$1[i + 2] + (b$1[i + 3] << 8);
			const laneNP = laneN0 * PRIME32_2 + (laneN1 * PRIME32_2 << 16);
			let acc$1 = accN[lane] + laneNP & 4294967295;
			acc$1 = acc$1 << 13 | acc$1 >>> 19;
			const acc0 = acc$1 & 65535;
			const acc1 = acc$1 >>> 16;
			accN[lane] = acc0 * PRIME32_1 + (acc1 * PRIME32_1 << 16) & 4294967295;
			lane = lane + 1 & 3;
		}
		acc = (accN[0] << 1 | accN[0] >>> 31) + (accN[1] << 7 | accN[1] >>> 25) + (accN[2] << 12 | accN[2] >>> 20) + (accN[3] << 18 | accN[3] >>> 14) & 4294967295;
	}
	acc = acc + buffer.length & 4294967295;
	const limit = buffer.length - 4;
	for (; offset <= limit; offset += 4) {
		const i = offset;
		const laneN0 = b[i + 0] + (b[i + 1] << 8);
		const laneN1 = b[i + 2] + (b[i + 3] << 8);
		const laneP = laneN0 * PRIME32_3 + (laneN1 * PRIME32_3 << 16);
		acc = acc + laneP & 4294967295;
		acc = acc << 17 | acc >>> 15;
		acc = (acc & 65535) * PRIME32_4 + ((acc >>> 16) * PRIME32_4 << 16) & 4294967295;
	}
	for (; offset < b.length; ++offset) {
		const lane = b[offset];
		acc = acc + lane * PRIME32_5;
		acc = acc << 11 | acc >>> 21;
		acc = (acc & 65535) * PRIME32_1 + ((acc >>> 16) * PRIME32_1 << 16) & 4294967295;
	}
	acc = acc ^ acc >>> 15;
	acc = ((acc & 65535) * PRIME32_2 & 4294967295) + ((acc >>> 16) * PRIME32_2 << 16);
	acc = acc ^ acc >>> 13;
	acc = ((acc & 65535) * PRIME32_3 & 4294967295) + ((acc >>> 16) * PRIME32_3 << 16);
	acc = acc ^ acc >>> 16;
	return acc < 0 ? acc + 4294967296 : acc;
}

//#endregion
//#region plugins/irc-colors/index.tsx
var import_web = __toESM(require_web(), 1);
const { GuildMemberStore, ChannelStore } = shelter.flux.storesFlat;
const { util: { getFiber, reactFiberWalker }, plugin: { store }, ui: { SwitchItem: _SwitchItem }, observeDom } = shelter;
const hopefully_unique_id = "irc-colors-gingeh";
const calculateNameColorForUser = (() => {
	const _calculateNameColorForUser = (user_id) => {
		return `oklch(0.750153 0.1275291 ${xxHash32(user_id) % 360})`;
	};
	const cache = new Map();
	return (user_id) => {
		if (!user_id) return null;
		if (cache.has(user_id)) return cache.get(user_id);
		const color = _calculateNameColorForUser(user_id);
		cache.set(user_id, color);
		return color;
	};
})();
function handleAnyUsername(user_id, name_elem) {
	if (name_elem.style.color && store.respectRoles) return;
	const color = calculateNameColorForUser(user_id);
	if (color) name_elem.style.color = color;
}
store.respectRoles ??= true;
const SwitchItem = _SwitchItem;
const settings = () => (0, import_web.createComponent)(SwitchItem, {
	get value() {
		return store.respectRoles;
	},
	onChange: (v) => {
		store.respectRoles = v;
	},
	children: "Don't override existing role colors."
});
let unObserveCallbacks = [];
let desaturateClass = null;
function onLoad() {
	if (!desaturateClass) for (const sheet of document.styleSheets) for (const rule of sheet.cssRules) {
		if (!(rule instanceof CSSStyleRule)) continue;
		let match = rule.selectorText.match(/desaturateUserColors__\w+/);
		if (match) {
			desaturateClass = match[0];
			break;
		}
	}
	unObserveCallbacks.push(observeDom(`[id*=message-username-]:not([data-${hopefully_unique_id}])`, (elem) => {
		elem.setAttribute(`data-${hopefully_unique_id}`, "true");
		const message = reactFiberWalker(getFiber(elem), "message", true)?.pendingProps?.message;
		if (!message) return;
		if (store.respectRoles) {
			const { type, guild_id } = ChannelStore.getChannel(message.channel_id);
			if (type === 0) {
				const member = GuildMemberStore.getMember(guild_id, message.author.id);
				if (!member) return;
				if (member.colorString !== null) return;
			}
		}
		const usernameElem = elem.firstElementChild;
		if (!usernameElem || !(usernameElem instanceof HTMLElement)) return;
		handleAnyUsername(message.author.id, usernameElem);
		if (desaturateClass) usernameElem.classList.add(desaturateClass);
	}));
	unObserveCallbacks.push(observeDom(`[class*=nameContainer__]:not([data-${hopefully_unique_id}])`, (elem) => {
		elem.setAttribute(`data-${hopefully_unique_id}`, "true");
		const user = reactFiberWalker(getFiber(elem), "user", true)?.pendingProps?.user;
		if (!user) return;
		handleAnyUsername(user.id, elem);
	}));
	unObserveCallbacks.push(observeDom(`[class*=repliedMessage_] [class*=username_]:not([data-${hopefully_unique_id}])`, (elem) => {
		elem.setAttribute(`data-${hopefully_unique_id}`, "true");
		const user = reactFiberWalker(getFiber(elem), "user", true)?.pendingProps?.user;
		if (!user) return;
		handleAnyUsername(user.id, elem);
		if (desaturateClass) elem.classList.add(desaturateClass);
	}));
}
function onUnload() {
	for (const unObserve of unObserveCallbacks) unObserve();
}

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
exports.settings = settings
return exports;
})({});