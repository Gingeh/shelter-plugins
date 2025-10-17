(function(exports) {

//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function() {
	return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k$1) => from[k$1]).bind(null, key),
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
//#region node_modules/.pnpm/suncalc@1.9.0/node_modules/suncalc/suncalc.js
var require_suncalc = __commonJS({ "node_modules/.pnpm/suncalc@1.9.0/node_modules/suncalc/suncalc.js"(exports, module) {
	(function() {
		"use strict";
		var PI = Math.PI, sin = Math.sin, cos = Math.cos, tan = Math.tan, asin = Math.asin, atan = Math.atan2, acos = Math.acos, rad = PI / 180;
		var dayMs = 864e5, J1970 = 2440588, J2000 = 2451545;
		function toJulian(date) {
			return date.valueOf() / dayMs - .5 + J1970;
		}
		function fromJulian(j$1) {
			return new Date((j$1 + .5 - J1970) * dayMs);
		}
		function toDays(date) {
			return toJulian(date) - J2000;
		}
		var e = rad * 23.4397;
		function rightAscension(l, b$1) {
			return atan(sin(l) * cos(e) - tan(b$1) * sin(e), cos(l));
		}
		function declination(l, b$1) {
			return asin(sin(b$1) * cos(e) + cos(b$1) * sin(e) * sin(l));
		}
		function azimuth(H$1, phi, dec) {
			return atan(sin(H$1), cos(H$1) * sin(phi) - tan(dec) * cos(phi));
		}
		function altitude(H$1, phi, dec) {
			return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H$1));
		}
		function siderealTime(d, lw) {
			return rad * (280.16 + 360.9856235 * d) - lw;
		}
		function astroRefraction(h$1) {
			if (h$1 < 0) h$1 = 0;
			return 2967e-7 / Math.tan(h$1 + .00312536 / (h$1 + .08901179));
		}
		function solarMeanAnomaly(d) {
			return rad * (357.5291 + .98560028 * d);
		}
		function eclipticLongitude(M$1) {
			var C$1 = rad * (1.9148 * sin(M$1) + .02 * sin(2 * M$1) + 3e-4 * sin(3 * M$1)), P$1 = rad * 102.9372;
			return M$1 + C$1 + P$1 + PI;
		}
		function sunCoords(d) {
			var M$1 = solarMeanAnomaly(d), L$1 = eclipticLongitude(M$1);
			return {
				dec: declination(L$1, 0),
				ra: rightAscension(L$1, 0)
			};
		}
		var SunCalc = {};
		SunCalc.getPosition = function(date, lat, lng) {
			var lw = rad * -lng, phi = rad * lat, d = toDays(date), c = sunCoords(d), H$1 = siderealTime(d, lw) - c.ra;
			return {
				azimuth: azimuth(H$1, phi, c.dec),
				altitude: altitude(H$1, phi, c.dec)
			};
		};
		var times = SunCalc.times = [
			[
				-.833,
				"sunrise",
				"sunset"
			],
			[
				-.3,
				"sunriseEnd",
				"sunsetStart"
			],
			[
				-6,
				"dawn",
				"dusk"
			],
			[
				-12,
				"nauticalDawn",
				"nauticalDusk"
			],
			[
				-18,
				"nightEnd",
				"night"
			],
			[
				6,
				"goldenHourEnd",
				"goldenHour"
			]
		];
		SunCalc.addTime = function(angle, riseName, setName) {
			times.push([
				angle,
				riseName,
				setName
			]);
		};
		var J0 = 9e-4;
		function julianCycle(d, lw) {
			return Math.round(d - J0 - lw / (2 * PI));
		}
		function approxTransit(Ht, lw, n) {
			return J0 + (Ht + lw) / (2 * PI) + n;
		}
		function solarTransitJ(ds, M$1, L$1) {
			return J2000 + ds + .0053 * sin(M$1) - .0069 * sin(2 * L$1);
		}
		function hourAngle(h$1, phi, d) {
			return acos((sin(h$1) - sin(phi) * sin(d)) / (cos(phi) * cos(d)));
		}
		function observerAngle(height) {
			return -2.076 * Math.sqrt(height) / 60;
		}
		function getSetJ(h$1, lw, phi, dec, n, M$1, L$1) {
			var w = hourAngle(h$1, phi, dec), a = approxTransit(w, lw, n);
			return solarTransitJ(a, M$1, L$1);
		}
		SunCalc.getTimes = function(date, lat, lng, height) {
			height = height || 0;
			var lw = rad * -lng, phi = rad * lat, dh = observerAngle(height), d = toDays(date), n = julianCycle(d, lw), ds = approxTransit(0, lw, n), M$1 = solarMeanAnomaly(ds), L$1 = eclipticLongitude(M$1), dec = declination(L$1, 0), Jnoon = solarTransitJ(ds, M$1, L$1), i, len, time, h0, Jset, Jrise;
			var result = {
				solarNoon: fromJulian(Jnoon),
				nadir: fromJulian(Jnoon - .5)
			};
			for (i = 0, len = times.length; i < len; i += 1) {
				time = times[i];
				h0 = (time[0] + dh) * rad;
				Jset = getSetJ(h0, lw, phi, dec, n, M$1, L$1);
				Jrise = Jnoon - (Jset - Jnoon);
				result[time[1]] = fromJulian(Jrise);
				result[time[2]] = fromJulian(Jset);
			}
			return result;
		};
		function moonCoords(d) {
			var L$1 = rad * (218.316 + 13.176396 * d), M$1 = rad * (134.963 + 13.064993 * d), F$1 = rad * (93.272 + 13.22935 * d), l = L$1 + rad * 6.289 * sin(M$1), b$1 = rad * 5.128 * sin(F$1), dt = 385001 - 20905 * cos(M$1);
			return {
				ra: rightAscension(l, b$1),
				dec: declination(l, b$1),
				dist: dt
			};
		}
		SunCalc.getMoonPosition = function(date, lat, lng) {
			var lw = rad * -lng, phi = rad * lat, d = toDays(date), c = moonCoords(d), H$1 = siderealTime(d, lw) - c.ra, h$1 = altitude(H$1, phi, c.dec), pa = atan(sin(H$1), tan(phi) * cos(c.dec) - sin(c.dec) * cos(H$1));
			h$1 = h$1 + astroRefraction(h$1);
			return {
				azimuth: azimuth(H$1, phi, c.dec),
				altitude: h$1,
				distance: c.dist,
				parallacticAngle: pa
			};
		};
		SunCalc.getMoonIllumination = function(date) {
			var d = toDays(date || new Date()), s = sunCoords(d), m = moonCoords(d), sdist = 149598e3, phi = acos(sin(s.dec) * sin(m.dec) + cos(s.dec) * cos(m.dec) * cos(s.ra - m.ra)), inc = atan(sdist * sin(phi), m.dist - sdist * cos(phi)), angle = atan(cos(s.dec) * sin(s.ra - m.ra), sin(s.dec) * cos(m.dec) - cos(s.dec) * sin(m.dec) * cos(s.ra - m.ra));
			return {
				fraction: (1 + cos(inc)) / 2,
				phase: .5 + .5 * inc * (angle < 0 ? -1 : 1) / Math.PI,
				angle
			};
		};
		function hoursLater(date, h$1) {
			return new Date(date.valueOf() + h$1 * dayMs / 24);
		}
		SunCalc.getMoonTimes = function(date, lat, lng, inUTC) {
			var t = new Date(date);
			if (inUTC) t.setUTCHours(0, 0, 0, 0);
else t.setHours(0, 0, 0, 0);
			var hc = .133 * rad, h0 = SunCalc.getMoonPosition(t, lat, lng).altitude - hc, h1, h2, rise, set, a, b$1, xe, ye$1, d, roots, x1, x2, dx;
			for (var i = 1; i <= 24; i += 2) {
				h1 = SunCalc.getMoonPosition(hoursLater(t, i), lat, lng).altitude - hc;
				h2 = SunCalc.getMoonPosition(hoursLater(t, i + 1), lat, lng).altitude - hc;
				a = (h0 + h2) / 2 - h1;
				b$1 = (h2 - h0) / 2;
				xe = -b$1 / (2 * a);
				ye$1 = (a * xe + b$1) * xe + h1;
				d = b$1 * b$1 - 4 * a * h1;
				roots = 0;
				if (d >= 0) {
					dx = Math.sqrt(d) / (Math.abs(a) * 2);
					x1 = xe - dx;
					x2 = xe + dx;
					if (Math.abs(x1) <= 1) roots++;
					if (Math.abs(x2) <= 1) roots++;
					if (x1 < -1) x1 = x2;
				}
				if (roots === 1) if (h0 < 0) rise = i + x1;
else set = i + x1;
else if (roots === 2) {
					rise = i + (ye$1 < 0 ? x2 : x1);
					set = i + (ye$1 < 0 ? x1 : x2);
				}
				if (rise && set) break;
				h0 = h2;
			}
			var result = {};
			if (rise) result.rise = hoursLater(t, rise);
			if (set) result.set = hoursLater(t, set);
			if (!rise && !set) result[ye$1 > 0 ? "alwaysUp" : "alwaysDown"] = true;
			return result;
		};
		if (typeof exports === "object" && typeof module !== "undefined") module.exports = SunCalc;
else if (typeof define === "function" && define.amd) define(SunCalc);
else window.SunCalc = SunCalc;
	})();
} });

//#endregion
//#region plugins/toki-pona-taso/index.tsx
var import_web = __toESM(require_web(), 1);
var import_web$1 = __toESM(require_web(), 1);
var import_web$2 = __toESM(require_web(), 1);
var import_suncalc = __toESM(require_suncalc(), 1);
const _tmpl$ = /*#__PURE__*/ (0, import_web.template)(`<br>`, 1);
const { util: { getFiber, getFiberOwner }, ui: { showToast, Text, LinkButton, TextArea, injectCss, ReactiveRoot }, plugin: { store: _store }, observeDom } = shelter;
const { ChannelStore, SelectedChannelStore, GuildStore } = shelter.flux.storesFlat;
const hopefully_unique_id = "toki-pona-taso-gingeh";
const nullaryPredicates = [
	"ale",
	"penpo",
	"tawa_jan"
];
function isNullaryPredicate(name) {
	return nullaryPredicates.includes(name);
}
const numericPredicates = ["nanpa_kulupu", "nanpa_tomo"];
function isNumericPredicate(name) {
	return numericPredicates.includes(name);
}
const regexPredicates = ["nimi_kulupu", "nimi_tomo"];
function isRegexPredicate(name) {
	return regexPredicates.includes(name);
}
function parse_predicate(line) {
	const match = line.trim().match(/^([^\s()]+)(\(([^()\n]*)\))?$/);
	if (!match) throw new Error(`Invalid predicate format: ${line}`);
	const name = match[1];
	const argument = match[3] ?? null;
	if (isNullaryPredicate(name)) {
		if (argument !== null) throw new Error(`Predicate ${name} does not take an argument`);
		return { name };
	} else if (isNumericPredicate(name)) {
		if (argument === null || argument.match(/^\d+$/) === null) throw new Error(`Predicate ${name} requires a numeric argument`);
		return {
			name,
			argument
		};
	} else if (isRegexPredicate(name)) {
		if (argument === null) throw new Error(`Predicate ${name} requires an argument`);
		try {
			return {
				name,
				argument: new RegExp(argument)
			};
		} catch {
			throw new Error(`Predicate ${name} requires a valid regex argument`);
		}
	} else throw new Error(`Unknown predicate name: ${name}`);
}
function predicate_matches(predicate, channel_id) {
	if (predicate.name === "ale") return true;
else if (predicate.name === "penpo") {
		const { phase: phase_now } = import_suncalc.getMoonIllumination(new Date(Date.now()));
		const { phase: phase_two_days_ago } = import_suncalc.getMoonIllumination(new Date(Date.now() - 1728e5));
		return phase_now < .5 !== phase_two_days_ago < .5;
	} else if (predicate.name === "tawa_jan") {
		const { type } = ChannelStore.getChannel(channel_id);
		return type === 1 || type === 3;
	} else if (predicate.name === "nanpa_kulupu") {
		const { guild_id } = ChannelStore.getChannel(channel_id);
		return guild_id === predicate.argument;
	} else if (predicate.name === "nanpa_tomo") return channel_id === predicate.argument;
else if (predicate.name === "nimi_kulupu") {
		const { guild_id } = ChannelStore.getChannel(channel_id);
		const { name } = GuildStore.getGuild(guild_id);
		return predicate.argument.test(name);
	} else if (predicate.name === "nimi_tomo") {
		const { name } = ChannelStore.getChannel(channel_id);
		return predicate.argument.test(name);
	}
	return true;
}
function rule_matches(rule, channel_id) {
	for (const predicate of rule.predicates) if (!predicate_matches(predicate, channel_id)) return false;
	return true;
}
function parse_config(lines) {
	const rules = [];
	let current_predicates = [];
	for (let line of lines.split("\n")) {
		line = line.split("#")[0].trim();
		if (line.length === 0) continue;
		if (line.startsWith(">")) {
			if (current_predicates.length === 0) throw new Error("Rule has no predicates");
			const verdict_str = line.slice(1).trim();
			if (verdict_str !== "ken" && verdict_str !== "ala") throw new Error(`Invalid verdict: ${verdict_str}`);
			rules.push({
				verdict: verdict_str,
				predicates: current_predicates
			});
			current_predicates = [];
		} else current_predicates.push(parse_predicate(line));
	}
	if (current_predicates.length > 0) throw new Error("Last rule has no verdict");
	if (rules.length === 0) throw new Error("No rules defined");
	return { rules };
}
function kenTokiAnte(config, channel_id) {
	for (const rule of config.rules) if (rule_matches(rule, channel_id)) return rule.verdict;
	return "ken";
}
const store = _store;
store.filterConfigString ??= new String("ale\n>ken");
store.filterConfig ??= parse_config(store.filterConfigString.toString());
store.filterConfigHeight ??= "58px";
store.filterConfigError ??= { present: false };
const settings = () => (0, import_web$2.createComponent)(ReactiveRoot, { get children() {
	return [
		(0, import_web$2.createComponent)(Text, {
			"class": `ucsur-${hopefully_unique_id}`,
			children: "󱥄󱥬󱤉󱥁‍→󱦝󱥙󱤡󱥞󱤘󱥬󱤆"
		}),
		(0, import_web$1.getNextElement)(_tmpl$),
		(0, import_web$2.createComponent)(Text, {
			"class": `ucsur-${hopefully_unique_id}`,
			children: "󱥞󱥷󱥡󱤉󱤎󱥁󱤡"
		}),
		(0, import_web$2.createComponent)(LinkButton, {
			href: "https://github.com/Gingeh/shelter-plugins/blob/main/plugins/toki-pona-taso/lipusona.txt",
			"class": `ucsur-${hopefully_unique_id}`,
			children: "󱥄󱤭󱤉󱤴"
		}),
		(0, import_web$1.getNextElement)(_tmpl$),
		(0, import_web$2.createComponent)(Text, {
			get style() {
				return {
					visibility: store.filterConfigError.present ? "visible" : "hidden",
					color: "var(--status-danger)"
				};
			},
			get children() {
				return store.filterConfigError.present ? store.filterConfigError.value : "placeholder to reserve vertical space";
			}
		}),
		(0, import_web$2.createComponent)(TextArea, {
			mono: true,
			"resize-y": true,
			get value() {
				return store.filterConfigString;
			},
			get style() {
				return {
					"border-color": store.filterConfigError.present ? "var(--status-danger)" : undefined,
					height: store.filterConfigHeight
				};
			},
			oninput: (e) => {
				const textarea = e.target;
				store.filterConfigHeight = "auto";
				store.filterConfigHeight = textarea.scrollHeight + "px";
				store.filterConfigString = textarea.value;
				try {
					const newConfig = parse_config(textarea.value);
					store.filterConfig = newConfig;
					store.filterConfigError = { present: false };
				} catch (error) {
					store.filterConfigError = {
						present: true,
						value: error.message
					};
				}
			}
		}),
		(0, import_web$1.getNextElement)(_tmpl$)
	];
} });
async function should_prevent_sending(editor) {
	const channel_id = SelectedChannelStore.getChannelId();
	if (kenTokiAnte(store.filterConfig, channel_id) === "ken") return false;
	editor.previewMarkdown = false;
	editor.onChange();
	const text = editor.children.map((child) => child.children[0].text).join("\n");
	editor.previewMarkdown = true;
	return !(await ilo)?.is_toki_pona(text);
}
function try_shake_screen() {
	const app = document.querySelector("[class*=app__]");
	if (!app) return;
	const app_fiber_owner = getFiberOwner(app);
	if (typeof app_fiber_owner.shake !== "function") return;
	app_fiber_owner.shake(200, 2);
}
async function onKeydown(event) {
	(async (elem, event$1) => {
		if (event$1.key !== "Enter" || event$1.getModifierState("Shift") || document.querySelector("[class*=autocomplete__]")) return;
		const fiber = getFiber(elem);
		if (!fiber || !fiber.child) return;
		const editor = fiber.child.pendingProps.editor;
		if (await should_prevent_sending(editor)) {
			try_shake_screen();
			showToast({
				title: "󱥄󱥬󱥔󱥨",
				content: "󱥁‍←󱤧󱥬󱥔󱤂",
				class: `ucsur-${hopefully_unique_id}`,
				duration: 5e3
			});
			event$1.preventDefault();
			event$1.stopPropagation();
		}
	})(this, event);
}
async function load_ilo() {
	window["sessionStorage"] = {
		length: 0,
		clear() {},
		getItem(_key) {
			return null;
		},
		key(_index) {
			return null;
		},
		removeItem(_key) {},
		setItem(_key, _value) {}
	};
	const { loadPyodide, version: pyodideVersion } = await Promise.resolve().then(function() {
		return init_pyodide(), pyodide_exports;
	});
	const pyodide = await loadPyodide({ indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/` });
	await pyodide.loadPackage("micropip");
	const micropip = pyodide.pyimport("micropip");
	await micropip.install("sonatoki");
	return pyodide.runPythonAsync(`
        from sonatoki.ilo import Ilo
        from sonatoki.Configs import PrefConfig
        Ilo(**PrefConfig)
    `);
}
let unobserve = () => {};
let removeCSS = () => {};
let ilo = null;
async function onLoad() {
	ilo = load_ilo();
	removeCSS = injectCss(`
        @font-face {
            font-family: "sitelenselikiwenmonojuniko";
            src: url(https://rawcdn.githack.com/lipu-linku/ijo/10258403b38268fb680b556ecff54d51cc99ceb3/nasinsitelen/sitelenselikiwenmonojuniko.ttf) format("truetype");
        }

        .ucsur-${hopefully_unique_id} {
            font-family: "sitelenselikiwenmonojuniko", monospace;
        }
    `);
	unobserve = observeDom(`[class*=slateContainer_]:not([data-${hopefully_unique_id}])`, (elem) => {
		elem.setAttribute(`data-${hopefully_unique_id}`, "true");
		elem.addEventListener("keydown", onKeydown);
	});
}
function onUnload() {
	ilo = null;
	unobserve();
	removeCSS();
	for (const elem of document.querySelectorAll(`[class*=slateContainer_][data-${hopefully_unique_id}]`)) {
		elem.removeAttribute(`data-${hopefully_unique_id}`);
		elem.removeEventListener("keydown", onKeydown);
	}
}

//#endregion
//#region node_modules/.pnpm/pyodide@0.28.3/node_modules/pyodide/pyodide.mjs
var pyodide_exports = {};
__export(pyodide_exports, {
	loadPyodide: () => at,
	version: () => B
});
function se(e) {
	return !isNaN(parseFloat(e)) && isFinite(e);
}
function S(e) {
	return e.charAt(0).toUpperCase() + e.substring(1);
}
function L(e) {
	return function() {
		return this[e];
	};
}
function p(e) {
	if (e) for (var t = 0; t < R.length; t++) e[R[t]] !== void 0 && this["set" + S(R[t])](e[R[t]]);
}
function le() {
	var e = /^\s*at .*(\S+:\d+|\(native\))/m, t = /^(eval@)?(\[native code])?$/;
	return {
		parse: o(function(s) {
			if (s.stack && s.stack.match(e)) return this.parseV8OrIE(s);
			if (s.stack) return this.parseFFOrSafari(s);
			throw new Error("Cannot parse given Error object");
		}, "ErrorStackParser$$parse"),
		extractLocation: o(function(s) {
			if (s.indexOf(":") === -1) return [s];
			var a = /(.+?)(?::(\d+))?(?::(\d+))?$/, n = a.exec(s.replace(/[()]/g, ""));
			return [
				n[1],
				n[2] || void 0,
				n[3] || void 0
			];
		}, "ErrorStackParser$$extractLocation"),
		parseV8OrIE: o(function(s) {
			var a = s.stack.split(`
`).filter(function(n) {
				return !!n.match(e);
			}, this);
			return a.map(function(n) {
				n.indexOf("(eval ") > -1 && (n = n.replace(/eval code/g, "eval").replace(/(\(eval at [^()]*)|(,.*$)/g, ""));
				var i = n.replace(/^\s+/, "").replace(/\(eval code/g, "(").replace(/^.*?\s+/, ""), c = i.match(/ (\(.+\)$)/);
				i = c ? i.replace(c[0], "") : i;
				var l = this.extractLocation(c ? c[1] : i), d = c && i || void 0, u = ["eval", "<anonymous>"].indexOf(l[0]) > -1 ? void 0 : l[0];
				return new O({
					functionName: d,
					fileName: u,
					lineNumber: l[1],
					columnNumber: l[2],
					source: n
				});
			}, this);
		}, "ErrorStackParser$$parseV8OrIE"),
		parseFFOrSafari: o(function(s) {
			var a = s.stack.split(`
`).filter(function(n) {
				return !n.match(t);
			}, this);
			return a.map(function(n) {
				if (n.indexOf(" > eval") > -1 && (n = n.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ":$1")), n.indexOf("@") === -1 && n.indexOf(":") === -1) return new O({ functionName: n });
				var i = /((.*".+"[^@]*)?[^@]*)(?:@)/, c = n.match(i), l = c && c[1] ? c[1] : void 0, d = this.extractLocation(n.replace(i, ""));
				return new O({
					functionName: l,
					fileName: d[0],
					lineNumber: d[1],
					columnNumber: d[2],
					source: n
				});
			}, this);
		}, "ErrorStackParser$$parseFFOrSafari")
	};
}
async function C() {
	if (!g || (J = (await import("node:url")).default, q = await import("node:fs"), U = await import("node:fs/promises"), Y = (await import("node:vm")).default, D = await import("node:path"), M = D.sep, typeof A < "u")) return;
	let e = q, t = await import("node:crypto"), r = await Promise.resolve().then(function() {
		return __toESM(require_pyodide(), 1);
	}), s = await import("node:child_process"), a = {
		fs: e,
		crypto: t,
		ws: r,
		child_process: s
	};
	globalThis.require = function(n) {
		return a[n];
	};
}
function fe(e, t) {
	return D.resolve(t || ".", e);
}
function me(e, t) {
	return t === void 0 && (t = location), new URL(e, t).toString();
}
function pe(e, t) {
	return e.startsWith("file://") && (e = e.slice(7)), e.includes("://") ? { response: fetch(e) } : { binary: U.readFile(e).then((r) => new Uint8Array(r.buffer, r.byteOffset, r.byteLength)) };
}
function ge(e, t) {
	if (e.startsWith("file://") && (e = e.slice(7)), e.includes("://")) throw new Error("Shell cannot fetch urls");
	return { binary: Promise.resolve(new Uint8Array(readbuffer(e))) };
}
function ye(e, t) {
	let r = new URL(e, location);
	return { response: fetch(r, t ? { integrity: t } : {}) };
}
async function K(e, t) {
	let { response: r, binary: s } = F(e, t);
	if (s) return s;
	let a = await r;
	if (!a.ok) throw new Error(`Failed to load '${e}': request failed.`);
	return new Uint8Array(await a.arrayBuffer());
}
async function be(e) {
	e.startsWith("file://") && (e = e.slice(7)), e.includes("://") ? Y.runInThisContext(await (await fetch(e)).text()) : await import(J.pathToFileURL(e).href);
}
async function G(e) {
	if (g) {
		await C();
		let t = await U.readFile(e, { encoding: "utf8" });
		return JSON.parse(t);
	} else if (x) {
		let t = read(e);
		return JSON.parse(t);
	} else return await (await fetch(e)).json();
}
async function X() {
	if (T) return __dirname;
	let e;
	try {
		throw new Error();
	} catch (s) {
		e = s;
	}
	let t = $.parse(e)[0].fileName;
	if (g && !t.startsWith("file://") && (t = `file://${t}`), j) {
		let s = await import("node:path");
		return (await import("node:url")).fileURLToPath(s.dirname(t));
	}
	let r = t.lastIndexOf(M);
	if (r === -1) throw new Error("Could not extract indexURL path from pyodide module location");
	return t.slice(0, r);
}
function Q(e) {
	return e.substring(0, e.lastIndexOf("/") + 1) || globalThis.location?.toString() || ".";
}
function Z(e) {
	let t = e.FS, r = e.FS.filesystems.MEMFS, s = e.PATH, a = {
		DIR_MODE: 16895,
		FILE_MODE: 33279,
		mount: o(function(n) {
			if (!n.opts.fileSystemHandle) throw new Error("opts.fileSystemHandle is required");
			return r.mount.apply(null, arguments);
		}, "mount"),
		syncfs: o(async (n, i, c) => {
			try {
				let l = a.getLocalSet(n), d = await a.getRemoteSet(n), u = i ? d : l, f = i ? l : d;
				await a.reconcile(n, u, f), c(null);
			} catch (l) {
				c(l);
			}
		}, "syncfs"),
		getLocalSet: o((n) => {
			let i = Object.create(null);
			function c(u) {
				return u !== "." && u !== "..";
			}
			o(c, "isRealDir");
			function l(u) {
				return (f) => s.join2(u, f);
			}
			o(l, "toAbsolute");
			let d = t.readdir(n.mountpoint).filter(c).map(l(n.mountpoint));
			for (; d.length;) {
				let u = d.pop(), f = t.stat(u);
				t.isDir(f.mode) && d.push.apply(d, t.readdir(u).filter(c).map(l(u))), i[u] = {
					timestamp: f.mtime,
					mode: f.mode
				};
			}
			return {
				type: "local",
				entries: i
			};
		}, "getLocalSet"),
		getRemoteSet: o(async (n) => {
			let i = Object.create(null), c = await ve(n.opts.fileSystemHandle);
			for (let [l, d] of c) l !== "." && (i[s.join2(n.mountpoint, l)] = {
				timestamp: d.kind === "file" ? new Date((await d.getFile()).lastModified) : new Date(),
				mode: d.kind === "file" ? a.FILE_MODE : a.DIR_MODE
			});
			return {
				type: "remote",
				entries: i,
				handles: c
			};
		}, "getRemoteSet"),
		loadLocalEntry: o((n) => {
			let c = t.lookupPath(n).node, l = t.stat(n);
			if (t.isDir(l.mode)) return {
				timestamp: l.mtime,
				mode: l.mode
			};
			if (t.isFile(l.mode)) return c.contents = r.getFileDataAsTypedArray(c), {
				timestamp: l.mtime,
				mode: l.mode,
				contents: c.contents
			};
			throw new Error("node type not supported");
		}, "loadLocalEntry"),
		storeLocalEntry: o((n, i) => {
			if (t.isDir(i.mode)) t.mkdirTree(n, i.mode);
else if (t.isFile(i.mode)) t.writeFile(n, i.contents, { canOwn: !0 });
else throw new Error("node type not supported");
			t.chmod(n, i.mode), t.utime(n, i.timestamp, i.timestamp);
		}, "storeLocalEntry"),
		removeLocalEntry: o((n) => {
			var i = t.stat(n);
			t.isDir(i.mode) ? t.rmdir(n) : t.isFile(i.mode) && t.unlink(n);
		}, "removeLocalEntry"),
		loadRemoteEntry: o(async (n) => {
			if (n.kind === "file") {
				let i = await n.getFile();
				return {
					contents: new Uint8Array(await i.arrayBuffer()),
					mode: a.FILE_MODE,
					timestamp: new Date(i.lastModified)
				};
			} else {
				if (n.kind === "directory") return {
					mode: a.DIR_MODE,
					timestamp: new Date()
				};
				throw new Error("unknown kind: " + n.kind);
			}
		}, "loadRemoteEntry"),
		storeRemoteEntry: o(async (n, i, c) => {
			let l = n.get(s.dirname(i)), d = t.isFile(c.mode) ? await l.getFileHandle(s.basename(i), { create: !0 }) : await l.getDirectoryHandle(s.basename(i), { create: !0 });
			if (d.kind === "file") {
				let u = await d.createWritable();
				await u.write(c.contents), await u.close();
			}
			n.set(i, d);
		}, "storeRemoteEntry"),
		removeRemoteEntry: o(async (n, i) => {
			await n.get(s.dirname(i)).removeEntry(s.basename(i)), n.delete(i);
		}, "removeRemoteEntry"),
		reconcile: o(async (n, i, c) => {
			let l = 0, d = [];
			Object.keys(i.entries).forEach(function(m) {
				let y = i.entries[m], w = c.entries[m];
				(!w || t.isFile(y.mode) && y.timestamp.getTime() > w.timestamp.getTime()) && (d.push(m), l++);
			}), d.sort();
			let u = [];
			if (Object.keys(c.entries).forEach(function(m) {
				i.entries[m] || (u.push(m), l++);
			}), u.sort().reverse(), !l) return;
			let f = i.type === "remote" ? i.handles : c.handles;
			for (let m of d) {
				let y = s.normalize(m.replace(n.mountpoint, "/")).substring(1);
				if (c.type === "local") {
					let w = f.get(y), ie = await a.loadRemoteEntry(w);
					a.storeLocalEntry(m, ie);
				} else {
					let w = a.loadLocalEntry(m);
					await a.storeRemoteEntry(f, y, w);
				}
			}
			for (let m of u) if (c.type === "local") a.removeLocalEntry(m);
else {
				let y = s.normalize(m.replace(n.mountpoint, "/")).substring(1);
				await a.removeRemoteEntry(f, y);
			}
		}, "reconcile")
	};
	e.FS.filesystems.NATIVEFS_ASYNC = a;
}
async function te() {
	let e = await Se;
	if (e) return e.exports;
	let t = Symbol("error marker");
	return {
		create_sentinel: o(() => t, "create_sentinel"),
		is_sentinel: o((r) => r === t, "is_sentinel")
	};
}
function ne(e) {
	let t = {
		noImageDecoding: !0,
		noAudioDecoding: !0,
		noWasmDecoding: !1,
		preRun: Ne(e),
		print: e.stdout,
		printErr: e.stderr,
		onExit(r) {
			t.exitCode = r;
		},
		thisProgram: e._sysExecutable,
		arguments: e.args,
		API: { config: e },
		locateFile: o((r) => e.indexURL + r, "locateFile"),
		instantiateWasm: Fe(e.indexURL)
	};
	return t;
}
function we(e) {
	return function(t) {
		let r = "/";
		try {
			t.FS.mkdirTree(e);
		} catch (s) {
			console.error(`Error occurred while making a home directory '${e}':`), console.error(s), console.error(`Using '${r}' for a home directory instead`), e = r;
		}
		t.FS.chdir(e);
	};
}
function Ee(e) {
	return function(t) {
		Object.assign(t.ENV, e);
	};
}
function Pe(e) {
	return e ? [async (t) => {
		t.addRunDependency("fsInitHook");
		try {
			await e(t.FS, { sitePackages: t.API.sitePackages });
		} finally {
			t.removeRunDependency("fsInitHook");
		}
	}] : [];
}
function ke(e) {
	let t = e.HEAPU32[e._Py_Version >>> 2], r = t >>> 24 & 255, s = t >>> 16 & 255, a = t >>> 8 & 255;
	return [
		r,
		s,
		a
	];
}
function Ie(e) {
	let t = K(e);
	return async (r) => {
		r.API.pyVersionTuple = ke(r);
		let [s, a] = r.API.pyVersionTuple;
		r.FS.mkdirTree("/lib"), r.API.sitePackages = `/lib/python${s}.${a}/site-packages`, r.FS.mkdirTree(r.API.sitePackages), r.addRunDependency("install-stdlib");
		try {
			let n = await t;
			r.FS.writeFile(`/lib/python${s}${a}.zip`, n);
		} catch (n) {
			console.error("Error occurred while installing the standard library:"), console.error(n);
		} finally {
			r.removeRunDependency("install-stdlib");
		}
	};
}
function Ne(e) {
	let t;
	return e.stdLibURL != null ? t = e.stdLibURL : t = e.indexURL + "python_stdlib.zip", [
		Ie(t),
		we(e.env.HOME),
		Ee(e.env),
		Z,
		...Pe(e.fsInit)
	];
}
function Fe(e) {
	if (typeof WasmOffsetConverter < "u") return;
	let { binary: t, response: r } = F(e + "pyodide.asm.wasm"), s = te();
	return function(a, n) {
		return async function() {
			a.sentinel = await s;
			try {
				let i;
				r ? i = await WebAssembly.instantiateStreaming(r, a) : i = await WebAssembly.instantiate(await t, a);
				let { instance: c, module: l } = i;
				n(c, l);
			} catch (i) {
				console.warn("wasm instantiation failed!"), console.warn(i);
			}
		}(), {};
	};
}
function _(e) {
	return e === void 0 || e.endsWith("/") ? e : e + "/";
}
async function at(e = {}) {
	if (e.lockFileContents && e.lockFileURL) throw new Error("Can't pass both lockFileContents and lockFileURL");
	await C();
	let t = e.indexURL || await X();
	t = _(N(t));
	let r = e;
	if (r.packageBaseUrl = _(r.packageBaseUrl), r.cdnUrl = _(r.packageBaseUrl ?? `https://cdn.jsdelivr.net/pyodide/v${B}/full/`), !e.lockFileContents) {
		let f = e.lockFileURL ?? t + "pyodide-lock.json";
		r.lockFileContents = G(f), r.packageBaseUrl ??= Q(f);
	}
	r.indexURL = t, r.packageCacheDir && (r.packageCacheDir = _(N(r.packageCacheDir)));
	let s = {
		fullStdLib: !1,
		jsglobals: globalThis,
		stdin: globalThis.prompt ? globalThis.prompt : void 0,
		args: [],
		env: {},
		packages: [],
		packageCacheDir: r.packageBaseUrl,
		enableRunUntilComplete: !0,
		checkAPIVersion: !0,
		BUILD_ID: "cc7a4bb4c6f36f12592fef0934292b5fddb0e313ca5dc4a5a9519bb7610c67e3"
	}, a = Object.assign(s, r);
	a.env.HOME ??= "/home/pyodide", a.env.PYTHONINSPECT ??= "1";
	let n = ne(a), i = n.API;
	if (i.lockFilePromise = Promise.resolve(r.lockFileContents), typeof _createPyodideModule != "function") {
		let f = `${a.indexURL}pyodide.asm.js`;
		await I(f);
	}
	let c;
	if (e._loadSnapshot) {
		let f = await e._loadSnapshot;
		ArrayBuffer.isView(f) ? c = f : c = new Uint8Array(f), n.noInitialRun = !0, n.INITIAL_MEMORY = c.length;
	}
	let l = await _createPyodideModule(n);
	if (n.exitCode !== void 0) throw new l.ExitStatus(n.exitCode);
	if (e.pyproxyToStringRepr && i.setPyProxyToStringMethod(!0), e.convertNullToNone && i.setCompatNullToNone(!0), i.version !== B && a.checkAPIVersion) throw new Error(`Pyodide version does not match: '${B}' <==> '${i.version}'. If you updated the Pyodide version, make sure you also updated the 'indexURL' parameter passed to loadPyodide.`);
	l.locateFile = (f) => {
		throw f.endsWith(".so") ? new Error(`Failed to find dynamic library "${f}"`) : new Error(`Unexpected call to locateFile("${f}")`);
	};
	let d;
	c && (d = i.restoreSnapshot(c));
	let u = i.finalizeBootstrap(d, e._snapshotDeserializer);
	return i.sys.path.insert(0, ""), i._pyodide.set_excepthook(), await i.packageIndexReady, i.initializeStreams(a.stdin, a.stdout, a.stderr), u;
}
var oe, o, A, W, E, P, k, ae, ce, R, b, v, h, O, de, $, g, T, j, Te, ue, H, V, z, De, x, J, D, Y, q, U, N, M, F, I, ve, ee, Se, re, B;
var init_pyodide = __esm({ "node_modules/.pnpm/pyodide@0.28.3/node_modules/pyodide/pyodide.mjs"() {
	oe = Object.defineProperty;
	o = (e, t) => oe(e, "name", {
		value: t,
		configurable: !0
	}), A = ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (t, r) => (typeof require < "u" ? require : t)[r] }) : e)(function(e) {
		if (typeof require < "u") return require.apply(this, arguments);
		throw Error("Dynamic require of \"" + e + "\" is not supported");
	});
	W = (() => {
		for (var e = new Uint8Array(128), t = 0; t < 64; t++) e[t < 26 ? t + 65 : t < 52 ? t + 71 : t < 62 ? t - 4 : t * 4 - 205] = t;
		return (r) => {
			for (var s = r.length, a = new Uint8Array((s - (r[s - 1] == "=") - (r[s - 2] == "=")) * 3 / 4 | 0), n = 0, i = 0; n < s;) {
				var c = e[r.charCodeAt(n++)], l = e[r.charCodeAt(n++)], d = e[r.charCodeAt(n++)], u = e[r.charCodeAt(n++)];
				a[i++] = c << 2 | l >> 4, a[i++] = l << 4 | d >> 2, a[i++] = d << 6 | u;
			}
			return a;
		};
	})();
	o(se, "_isNumber");
	o(S, "_capitalize");
	o(L, "_getter");
	E = [
		"isConstructor",
		"isEval",
		"isNative",
		"isToplevel"
	], P = ["columnNumber", "lineNumber"], k = [
		"fileName",
		"functionName",
		"source"
	], ae = ["args"], ce = ["evalOrigin"], R = E.concat(P, k, ae, ce);
	o(p, "StackFrame");
	p.prototype = {
		getArgs: o(function() {
			return this.args;
		}, "getArgs"),
		setArgs: o(function(e) {
			if (Object.prototype.toString.call(e) !== "[object Array]") throw new TypeError("Args must be an Array");
			this.args = e;
		}, "setArgs"),
		getEvalOrigin: o(function() {
			return this.evalOrigin;
		}, "getEvalOrigin"),
		setEvalOrigin: o(function(e) {
			if (e instanceof p) this.evalOrigin = e;
else if (e instanceof Object) this.evalOrigin = new p(e);
else throw new TypeError("Eval Origin must be an Object or StackFrame");
		}, "setEvalOrigin"),
		toString: o(function() {
			var e = this.getFileName() || "", t = this.getLineNumber() || "", r = this.getColumnNumber() || "", s = this.getFunctionName() || "";
			return this.getIsEval() ? e ? "[eval] (" + e + ":" + t + ":" + r + ")" : "[eval]:" + t + ":" + r : s ? s + " (" + e + ":" + t + ":" + r + ")" : e + ":" + t + ":" + r;
		}, "toString")
	};
	p.fromString = o(function(t) {
		var r = t.indexOf("("), s = t.lastIndexOf(")"), a = t.substring(0, r), n = t.substring(r + 1, s).split(","), i = t.substring(s + 1);
		if (i.indexOf("@") === 0) var c = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(i, ""), l = c[1], d = c[2], u = c[3];
		return new p({
			functionName: a,
			args: n || void 0,
			fileName: l,
			lineNumber: d || void 0,
			columnNumber: u || void 0
		});
	}, "StackFrame$$fromString");
	for (b = 0; b < E.length; b++) p.prototype["get" + S(E[b])] = L(E[b]), p.prototype["set" + S(E[b])] = function(e) {
		return function(t) {
			this[e] = !!t;
		};
	}(E[b]);
	for (v = 0; v < P.length; v++) p.prototype["get" + S(P[v])] = L(P[v]), p.prototype["set" + S(P[v])] = function(e) {
		return function(t) {
			if (!se(t)) throw new TypeError(e + " must be a Number");
			this[e] = Number(t);
		};
	}(P[v]);
	for (h = 0; h < k.length; h++) p.prototype["get" + S(k[h])] = L(k[h]), p.prototype["set" + S(k[h])] = function(e) {
		return function(t) {
			this[e] = String(t);
		};
	}(k[h]);
	O = p;
	o(le, "ErrorStackParser");
	de = new le();
	$ = de;
	g = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string" && !process.browser, T = g && typeof module < "u" && typeof module.exports < "u" && typeof A < "u" && typeof __dirname < "u", j = g && !T, Te = typeof globalThis.Bun < "u", ue = typeof Deno < "u", H = !g && !ue, V = H && typeof window == "object" && typeof document == "object" && typeof document.createElement == "function" && "sessionStorage" in window && typeof importScripts != "function", z = H && typeof importScripts == "function" && typeof self == "object", De = typeof navigator == "object" && typeof navigator.userAgent == "string" && navigator.userAgent.indexOf("Chrome") == -1 && navigator.userAgent.indexOf("Safari") > -1, x = typeof read == "function" && typeof load == "function";
	o(C, "initNodeModules");
	o(fe, "node_resolvePath");
	o(me, "browser_resolvePath");
	g ? N = fe : x ? N = o((e) => e, "resolvePath") : N = me;
	g || (M = "/");
	o(pe, "node_getBinaryResponse");
	o(ge, "shell_getBinaryResponse");
	o(ye, "browser_getBinaryResponse");
	g ? F = pe : x ? F = ge : F = ye;
	o(K, "loadBinaryFile");
	if (V) I = o(async (e) => await import(e), "loadScript");
else if (z) I = o(async (e) => {
		try {
			globalThis.importScripts(e);
		} catch (t) {
			if (t instanceof TypeError) await import(e);
else throw t;
		}
	}, "loadScript");
else if (g) I = be;
else if (x) I = load;
else throw new Error("Cannot determine runtime environment");
	o(be, "nodeLoadScript");
	o(G, "loadLockFile");
	o(X, "calculateDirname");
	o(Q, "calculateInstallBaseUrl");
	o(Z, "initializeNativeFS");
	ve = o(async (e) => {
		let t = [];
		async function r(a) {
			for await (let n of a.values()) t.push(n), n.kind === "directory" && await r(n);
		}
		o(r, "collect"), await r(e);
		let s = new Map();
		s.set(".", e);
		for (let a of t) {
			let n = (await e.resolve(a)).join("/");
			s.set(n, a);
		}
		return s;
	}, "getFsHandles");
	ee = W("AGFzbQEAAAABDANfAGAAAW9gAW8BfwMDAgECByECD2NyZWF0ZV9zZW50aW5lbAAAC2lzX3NlbnRpbmVsAAEKEwIHAPsBAPsbCwkAIAD7GvsUAAs=");
	Se = async function() {
		if (!(globalThis.navigator && (/iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === "MacIntel" && typeof navigator.maxTouchPoints < "u" && navigator.maxTouchPoints > 1))) try {
			let t = await WebAssembly.compile(ee);
			return await WebAssembly.instantiate(t);
		} catch (t) {
			if (t instanceof WebAssembly.CompileError) return;
			throw t;
		}
	}();
	o(te, "getSentinelImport");
	o(ne, "createSettings");
	o(we, "createHomeDirectory");
	o(Ee, "setEnvironment");
	o(Pe, "callFsInitHook");
	o(ke, "computeVersionTuple");
	o(Ie, "installStdlib");
	o(Ne, "getFileSystemInitializationFuncs");
	o(Fe, "getInstantiateWasmFunc");
	re = "0.28.3";
	o(_, "withTrailingSlash");
	B = re;
	o(at, "loadPyodide");
} });

//#endregion
//#region (ignored) node_modules/.pnpm/pyodide@0.28.3/node_modules/pyodide
var require_pyodide = __commonJS({ "node_modules/.pnpm/pyodide@0.28.3/node_modules/pyodide"() {} });

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
exports.settings = settings
return exports;
})({});