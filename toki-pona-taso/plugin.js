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
//#region plugins/toki-pona-taso/index.tsx
var import_web = __toESM(require_web(), 1);
var import_web$1 = __toESM(require_web(), 1);
var import_web$2 = __toESM(require_web(), 1);
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
async function predicate_matches(predicate, channel_id) {
	if (predicate.name === "ale") return true;
else if (predicate.name === "penpo") return (await python_wrapper).is_tenpo_penpo();
else if (predicate.name === "tawa_jan") {
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
async function rule_matches(rule, channel_id) {
	for (const predicate of rule.predicates) if (!await predicate_matches(predicate, channel_id)) return false;
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
async function kenTokiAnte(config, channel_id) {
	for (const rule of config.rules) if (await rule_matches(rule, channel_id)) return rule.verdict;
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
	if (await kenTokiAnte(store.filterConfig, channel_id) === "ken") return false;
	editor.previewMarkdown = false;
	editor.onChange();
	const text = editor.children.map((child) => child.children[0].text).join("\n");
	editor.previewMarkdown = true;
	return !(await python_wrapper)?.is_toki_pona(text);
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
let python_wrapper = null;
async function load_python_wrapper() {
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
	await micropip.add_mock_package("sgp4", "2.25");
	await micropip.install("skyfield");
	await micropip.remove_mock_package("sgp4");
	await micropip.install("https://gingeh.github.io/shelter-plugins/assets/sgp4_pure_python-2.25-py3-none-any.whl");
	const bsp = await fetch("https://gingeh.github.io/shelter-plugins/assets/de440s.bsp");
	pyodide.FS.writeFile("de440s.bsp", await bsp.bytes());
	return pyodide.runPythonAsync(`
        import datetime

        from sonatoki.ilo import Ilo
        from sonatoki.Configs import PrefConfig

        from skyfield.api import load_file as skyfield_load
        from skyfield import almanac

        class PythonWrapper:
            def __init__(self):
                self.ilo = Ilo(**PrefConfig)
                self.eph = skyfield_load('de440s.bsp')

            def is_toki_pona(self, text: str) -> bool:
                return self.ilo.is_toki_pona(text)

            def is_tenpo_penpo(self) -> bool:
                from skyfield import api
                ts = api.load.timescale()
                now = ts.now()
                two_days_ago = ts.from_datetime(now.utc_datetime() + datetime.timedelta(days=-2))

                phase_now = almanac.moon_phase(self.eph, now).degrees / 360.0
                phase_two_days_ago = almanac.moon_phase(self.eph, two_days_ago).degrees / 360.0
                print(phase_now, phase_two_days_ago)

                return (phase_now < 0.5) != (phase_two_days_ago < 0.5)

        PythonWrapper()
    `);
}
let unobserve = () => {};
let removeCSS = () => {};
async function onLoad() {
	python_wrapper = load_python_wrapper();
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
	python_wrapper = null;
	unobserve();
	removeCSS();
	for (const elem of document.querySelectorAll(`[class*=slateContainer_][data-${hopefully_unique_id}]`)) {
		elem.removeAttribute(`data-${hopefully_unique_id}`);
		elem.removeEventListener("keydown", onKeydown);
	}
}

//#endregion
//#region node_modules/.pnpm/pyodide@0.29.0/node_modules/pyodide/pyodide.mjs
var pyodide_exports = {};
__export(pyodide_exports, {
	loadPyodide: () => ct,
	version: () => U
});
function ee(e) {
	return !isNaN(parseFloat(e)) && isFinite(e);
}
function P(e) {
	return e.charAt(0).toUpperCase() + e.substring(1);
}
function x(e) {
	return function() {
		return this[e];
	};
}
function p(e) {
	if (e) for (var t = 0; t < F.length; t++) e[F[t]] !== void 0 && this["set" + P(F[t])](e[F[t]]);
}
function re() {
	var e = /^\s*at .*(\S+:\d+|\(native\))/m, t = /^(eval@)?(\[native code])?$/;
	return {
		parse: o(function(i) {
			if (i.stack && i.stack.match(e)) return this.parseV8OrIE(i);
			if (i.stack) return this.parseFFOrSafari(i);
			throw new Error("Cannot parse given Error object");
		}, "ErrorStackParser$$parse"),
		extractLocation: o(function(i) {
			if (i.indexOf(":") === -1) return [i];
			var s = /(.+?)(?::(\d+))?(?::(\d+))?$/, r = s.exec(i.replace(/[()]/g, ""));
			return [
				r[1],
				r[2] || void 0,
				r[3] || void 0
			];
		}, "ErrorStackParser$$extractLocation"),
		parseV8OrIE: o(function(i) {
			var s = i.stack.split(`
`).filter(function(r) {
				return !!r.match(e);
			}, this);
			return s.map(function(r) {
				r.indexOf("(eval ") > -1 && (r = r.replace(/eval code/g, "eval").replace(/(\(eval at [^()]*)|(,.*$)/g, ""));
				var a = r.replace(/^\s+/, "").replace(/\(eval code/g, "(").replace(/^.*?\s+/, ""), l = a.match(/ (\(.+\)$)/);
				a = l ? a.replace(l[0], "") : a;
				var c = this.extractLocation(l ? l[1] : a), d = l && a || void 0, u = ["eval", "<anonymous>"].indexOf(c[0]) > -1 ? void 0 : c[0];
				return new O({
					functionName: d,
					fileName: u,
					lineNumber: c[1],
					columnNumber: c[2],
					source: r
				});
			}, this);
		}, "ErrorStackParser$$parseV8OrIE"),
		parseFFOrSafari: o(function(i) {
			var s = i.stack.split(`
`).filter(function(r) {
				return !r.match(t);
			}, this);
			return s.map(function(r) {
				if (r.indexOf(" > eval") > -1 && (r = r.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ":$1")), r.indexOf("@") === -1 && r.indexOf(":") === -1) return new O({ functionName: r });
				var a = /((.*".+"[^@]*)?[^@]*)(?:@)/, l = r.match(a), c = l && l[1] ? l[1] : void 0, d = this.extractLocation(r.replace(a, ""));
				return new O({
					functionName: c,
					fileName: d[0],
					lineNumber: d[1],
					columnNumber: d[2],
					source: r
				});
			}, this);
		}, "ErrorStackParser$$parseFFOrSafari")
	};
}
function oe() {
	if (typeof API < "u" && API !== globalThis.API) return API.runtimeEnv;
	let e = typeof Bun < "u", t = typeof Deno < "u", n = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string" && !process.browser, i = typeof navigator == "object" && typeof navigator.userAgent == "string" && navigator.userAgent.indexOf("Chrome") === -1 && navigator.userAgent.indexOf("Safari") > -1;
	return ae({
		IN_BUN: e,
		IN_DENO: t,
		IN_NODE: n,
		IN_SAFARI: i,
		IN_SHELL: typeof read == "function" && typeof load == "function"
	});
}
function ae(e) {
	let t = e.IN_NODE && typeof module < "u" && module.exports && typeof A == "function" && typeof __dirname == "string", n = e.IN_NODE && !t, i = !e.IN_NODE && !e.IN_DENO && !e.IN_BUN, s = i && typeof window < "u" && typeof window.document < "u" && typeof document.createElement == "function" && "sessionStorage" in window && typeof globalThis.importScripts != "function", r = i && typeof globalThis.WorkerGlobalScope < "u" && typeof globalThis.self < "u" && globalThis.self instanceof globalThis.WorkerGlobalScope;
	return {
		...e,
		IN_BROWSER: i,
		IN_BROWSER_MAIN_THREAD: s,
		IN_BROWSER_WEB_WORKER: r,
		IN_NODE_COMMONJS: t,
		IN_NODE_ESM: n
	};
}
async function T() {
	if (!f.IN_NODE || ($ = (await import("node:url")).default, B = await import("node:fs"), L = await import("node:fs/promises"), H = (await import("node:vm")).default, D = await import("node:path"), C = D.sep, typeof A < "u")) return;
	let e = B, t = await import("node:crypto"), n = await Promise.resolve().then(function() {
		return __toESM(require_pyodide(), 1);
	}), i = await import("node:child_process"), s = {
		fs: e,
		crypto: t,
		ws: n,
		child_process: i
	};
	globalThis.require = function(r) {
		return s[r];
	};
}
function se(e, t) {
	return D.resolve(t || ".", e);
}
function le(e, t) {
	return t === void 0 && (t = location), new URL(e, t).toString();
}
function ce(e, t) {
	return e.startsWith("file://") && (e = e.slice(7)), e.includes("://") ? { response: fetch(e) } : { binary: L.readFile(e).then((n) => new Uint8Array(n.buffer, n.byteOffset, n.byteLength)) };
}
function de(e, t) {
	if (e.startsWith("file://") && (e = e.slice(7)), e.includes("://")) throw new Error("Shell cannot fetch urls");
	return { binary: Promise.resolve(new Uint8Array(readbuffer(e))) };
}
function ue(e, t) {
	let n = new URL(e, location);
	return { response: fetch(n, t ? { integrity: t } : {}) };
}
async function j(e, t) {
	let { response: n, binary: i } = R(e, t);
	if (i) return i;
	let s = await n;
	if (!s.ok) throw new Error(`Failed to load '${e}': request failed.`);
	return new Uint8Array(await s.arrayBuffer());
}
async function fe(e) {
	e.startsWith("file://") && (e = e.slice(7)), e.includes("://") ? H.runInThisContext(await (await fetch(e)).text()) : await import($.pathToFileURL(e).href);
}
async function V(e) {
	if (f.IN_NODE) {
		await T();
		let t = await L.readFile(e, { encoding: "utf8" });
		return JSON.parse(t);
	} else if (f.IN_SHELL) {
		let t = read(e);
		return JSON.parse(t);
	} else return await (await fetch(e)).json();
}
async function z() {
	if (f.IN_NODE_COMMONJS) return __dirname;
	let e;
	try {
		throw new Error();
	} catch (i) {
		e = i;
	}
	let t = M.parse(e)[0].fileName;
	if (f.IN_NODE && !t.startsWith("file://") && (t = `file://${t}`), f.IN_NODE_ESM) {
		let i = await import("node:path");
		return (await import("node:url")).fileURLToPath(i.dirname(t));
	}
	let n = t.lastIndexOf(C);
	if (n === -1) throw new Error("Could not extract indexURL path from pyodide module location. Please pass the indexURL explicitly to loadPyodide.");
	return t.slice(0, n);
}
function J(e) {
	return e.substring(0, e.lastIndexOf("/") + 1) || globalThis.location?.toString() || ".";
}
function q(e) {
	let t = e.FS, n = e.FS.filesystems.MEMFS, i = e.PATH, s = {
		DIR_MODE: 16895,
		FILE_MODE: 33279,
		mount: o(function(r) {
			if (!r.opts.fileSystemHandle) throw new Error("opts.fileSystemHandle is required");
			return n.mount.apply(null, arguments);
		}, "mount"),
		syncfs: o(async (r, a, l) => {
			try {
				let c = s.getLocalSet(r), d = await s.getRemoteSet(r), u = a ? d : c, y = a ? c : d;
				await s.reconcile(r, u, y), l(null);
			} catch (c) {
				l(c);
			}
		}, "syncfs"),
		getLocalSet: o((r) => {
			let a = Object.create(null);
			function l(u) {
				return u !== "." && u !== "..";
			}
			o(l, "isRealDir");
			function c(u) {
				return (y) => i.join2(u, y);
			}
			o(c, "toAbsolute");
			let d = t.readdir(r.mountpoint).filter(l).map(c(r.mountpoint));
			for (; d.length;) {
				let u = d.pop(), y = t.stat(u);
				t.isDir(y.mode) && d.push.apply(d, t.readdir(u).filter(l).map(c(u))), a[u] = {
					timestamp: y.mtime,
					mode: y.mode
				};
			}
			return {
				type: "local",
				entries: a
			};
		}, "getLocalSet"),
		getRemoteSet: o(async (r) => {
			let a = Object.create(null), l = await me(r.opts.fileSystemHandle);
			for (let [c, d] of l) c !== "." && (a[i.join2(r.mountpoint, c)] = {
				timestamp: d.kind === "file" ? new Date((await d.getFile()).lastModified) : new Date(),
				mode: d.kind === "file" ? s.FILE_MODE : s.DIR_MODE
			});
			return {
				type: "remote",
				entries: a,
				handles: l
			};
		}, "getRemoteSet"),
		loadLocalEntry: o((r) => {
			let l = t.lookupPath(r, {}).node, c = t.stat(r);
			if (t.isDir(c.mode)) return {
				timestamp: c.mtime,
				mode: c.mode
			};
			if (t.isFile(c.mode)) return l.contents = n.getFileDataAsTypedArray(l), {
				timestamp: c.mtime,
				mode: c.mode,
				contents: l.contents
			};
			throw new Error("node type not supported");
		}, "loadLocalEntry"),
		storeLocalEntry: o((r, a) => {
			if (t.isDir(a.mode)) t.mkdirTree(r, a.mode);
else if (t.isFile(a.mode)) t.writeFile(r, a.contents, { canOwn: !0 });
else throw new Error("node type not supported");
			t.chmod(r, a.mode), t.utime(r, a.timestamp, a.timestamp);
		}, "storeLocalEntry"),
		removeLocalEntry: o((r) => {
			var a = t.stat(r);
			t.isDir(a.mode) ? t.rmdir(r) : t.isFile(a.mode) && t.unlink(r);
		}, "removeLocalEntry"),
		loadRemoteEntry: o(async (r) => {
			if (r.kind === "file") {
				let a = await r.getFile();
				return {
					contents: new Uint8Array(await a.arrayBuffer()),
					mode: s.FILE_MODE,
					timestamp: new Date(a.lastModified)
				};
			} else {
				if (r.kind === "directory") return {
					mode: s.DIR_MODE,
					timestamp: new Date()
				};
				throw new Error("unknown kind: " + r.kind);
			}
		}, "loadRemoteEntry"),
		storeRemoteEntry: o(async (r, a, l) => {
			let c = r.get(i.dirname(a)), d = t.isFile(l.mode) ? await c.getFileHandle(i.basename(a), { create: !0 }) : await c.getDirectoryHandle(i.basename(a), { create: !0 });
			if (d.kind === "file") {
				let u = await d.createWritable();
				await u.write(l.contents), await u.close();
			}
			r.set(a, d);
		}, "storeRemoteEntry"),
		removeRemoteEntry: o(async (r, a) => {
			await r.get(i.dirname(a)).removeEntry(i.basename(a)), r.delete(a);
		}, "removeRemoteEntry"),
		reconcile: o(async (r, a, l) => {
			let c = 0, d = [];
			Object.keys(a.entries).forEach(function(m) {
				let g = a.entries[m], h = l.entries[m];
				(!h || t.isFile(g.mode) && g.timestamp.getTime() > h.timestamp.getTime()) && (d.push(m), c++);
			}), d.sort();
			let u = [];
			if (Object.keys(l.entries).forEach(function(m) {
				a.entries[m] || (u.push(m), c++);
			}), u.sort().reverse(), !c) return;
			let y = a.type === "remote" ? a.handles : l.handles;
			for (let m of d) {
				let g = i.normalize(m.replace(r.mountpoint, "/")).substring(1);
				if (l.type === "local") {
					let h = y.get(g), Q = await s.loadRemoteEntry(h);
					s.storeLocalEntry(m, Q);
				} else {
					let h = s.loadLocalEntry(m);
					await s.storeRemoteEntry(y, g, h);
				}
			}
			for (let m of u) if (l.type === "local") s.removeLocalEntry(m);
else {
				let g = i.normalize(m.replace(r.mountpoint, "/")).substring(1);
				await s.removeRemoteEntry(y, g);
			}
		}, "reconcile")
	};
	e.FS.filesystems.NATIVEFS_ASYNC = s;
}
async function K() {
	let e = await ye;
	if (e) return e.exports;
	let t = Symbol("error marker");
	return {
		create_sentinel: o(() => t, "create_sentinel"),
		is_sentinel: o((n) => n === t, "is_sentinel")
	};
}
function Y(e) {
	let t = {
		config: e,
		runtimeEnv: f
	}, n = {
		noImageDecoding: !0,
		noAudioDecoding: !0,
		noWasmDecoding: !1,
		preRun: he(e),
		print: e.stdout,
		printErr: e.stderr,
		onExit(i) {
			n.exitCode = i;
		},
		thisProgram: e._sysExecutable,
		arguments: e.args,
		API: t,
		locateFile: o((i) => e.indexURL + i, "locateFile"),
		instantiateWasm: Ne(e.indexURL)
	};
	return n;
}
function ge(e) {
	return function(t) {
		let n = "/";
		try {
			t.FS.mkdirTree(e);
		} catch (i) {
			console.error(`Error occurred while making a home directory '${e}':`), console.error(i), console.error(`Using '${n}' for a home directory instead`), e = n;
		}
		t.FS.chdir(e);
	};
}
function be(e) {
	return function(t) {
		Object.assign(t.ENV, e);
	};
}
function ve(e) {
	return e ? [async (t) => {
		t.addRunDependency("fsInitHook");
		try {
			await e(t.FS, { sitePackages: t.API.sitePackages });
		} finally {
			t.removeRunDependency("fsInitHook");
		}
	}] : [];
}
function Ee(e) {
	let t = e.HEAPU32[e._Py_Version >>> 2], n = t >>> 24 & 255, i = t >>> 16 & 255, s = t >>> 8 & 255;
	return [
		n,
		i,
		s
	];
}
function Pe(e) {
	let t = j(e);
	return async (n) => {
		n.API.pyVersionTuple = Ee(n);
		let [i, s] = n.API.pyVersionTuple;
		n.FS.mkdirTree("/lib"), n.API.sitePackages = `/lib/python${i}.${s}/site-packages`, n.FS.mkdirTree(n.API.sitePackages), n.addRunDependency("install-stdlib");
		try {
			let r = await t;
			n.FS.writeFile(`/lib/python${i}${s}.zip`, r);
		} catch (r) {
			console.error("Error occurred while installing the standard library:"), console.error(r);
		} finally {
			n.removeRunDependency("install-stdlib");
		}
	};
}
function he(e) {
	let t;
	return e.stdLibURL != null ? t = e.stdLibURL : t = e.indexURL + "python_stdlib.zip", [
		Pe(t),
		ge(e.env.HOME),
		be(e.env),
		q,
		...ve(e.fsInit)
	];
}
function Ne(e) {
	if (typeof WasmOffsetConverter < "u") return;
	let { binary: t, response: n } = R(e + "pyodide.asm.wasm"), i = K();
	return function(s, r) {
		return async function() {
			s.sentinel = await i;
			try {
				let a;
				n ? a = await WebAssembly.instantiateStreaming(n, s) : a = await WebAssembly.instantiate(await t, s);
				let { instance: l, module: c } = a;
				r(l, c);
			} catch (a) {
				console.warn("wasm instantiation failed!"), console.warn(a);
			}
		}(), {};
	};
}
function k(e) {
	return e === void 0 || e.endsWith("/") ? e : e + "/";
}
async function Se(e = {}) {
	if (await T(), e.lockFileContents && e.lockFileURL) throw new Error("Can't pass both lockFileContents and lockFileURL");
	let t = e.indexURL || await z();
	if (t = k(_(t)), e.packageBaseUrl = k(e.packageBaseUrl), e.cdnUrl = k(e.packageBaseUrl ?? `https://cdn.jsdelivr.net/pyodide/v${U}/full/`), !e.lockFileContents) {
		let s = e.lockFileURL ?? t + "pyodide-lock.json";
		e.lockFileContents = V(s), e.packageBaseUrl ??= J(s);
	}
	e.indexURL = t, e.packageCacheDir && (e.packageCacheDir = k(_(e.packageCacheDir)));
	let n = {
		fullStdLib: !1,
		jsglobals: globalThis,
		stdin: globalThis.prompt ? () => globalThis.prompt() : void 0,
		args: [],
		env: {},
		packages: [],
		packageCacheDir: e.packageBaseUrl,
		enableRunUntilComplete: !0,
		checkAPIVersion: !0,
		BUILD_ID: "761936574707325565bed16f46bb59050f9a5477dab28ba3db09f3fb41ea89e7"
	}, i = Object.assign(n, e);
	return i.env.HOME ??= "/home/pyodide", i.env.PYTHONINSPECT ??= "1", i;
}
function Ie(e) {
	let t = Y(e), n = t.API;
	return n.lockFilePromise = Promise.resolve(e.lockFileContents), t;
}
async function we(e) {
	if (typeof _createPyodideModule != "function") {
		let t = `${e.indexURL}pyodide.asm.js`;
		await w(t);
	}
}
async function _e(e, t) {
	if (!e._loadSnapshot) return;
	let n = await e._loadSnapshot, i = ArrayBuffer.isView(n) ? n : new Uint8Array(n);
	return t.noInitialRun = !0, t.INITIAL_MEMORY = i.length, i;
}
async function Re(e) {
	let t = await _createPyodideModule(e);
	if (e.exitCode !== void 0) throw new t.ExitStatus(e.exitCode);
	return t;
}
function ke(e, t) {
	let n = e.API;
	if (t.pyproxyToStringRepr && n.setPyProxyToStringMethod(!0), t.convertNullToNone && n.setCompatNullToNone(!0), t.toJsLiteralMap && n.setCompatToJsLiteralMap(!0), n.version !== U && t.checkAPIVersion) throw new Error(`Pyodide version does not match: '${U}' <==> '${n.version}'. If you updated the Pyodide version, make sure you also updated the 'indexURL' parameter passed to loadPyodide.`);
	e.locateFile = (i) => {
		throw i.endsWith(".so") ? new Error(`Failed to find dynamic library "${i}"`) : new Error(`Unexpected call to locateFile("${i}")`);
	};
}
function Ae(e, t, n) {
	let i = e.API, s;
	return t && (s = i.restoreSnapshot(t)), i.finalizeBootstrap(s, n._snapshotDeserializer);
}
async function Fe(e, t) {
	let n = e._api;
	return n.sys.path.insert(0, ""), n._pyodide.set_excepthook(), await n.packageIndexReady, n.initializeStreams(t.stdin, t.stdout, t.stderr), e;
}
async function ct(e = {}) {
	let t = await Se(e), n = Ie(t);
	await we(t);
	let i = await _e(t, n), s = await Re(n);
	ke(s, t);
	let r = Ae(s, i, t);
	return await Fe(r, t);
}
var Z, o, A, W, N, S, I, te, ne, F, b, v, E, O, ie, M, f, $, D, H, B, L, _, C, R, w, me, G, ye, X, U;
var init_pyodide = __esm({ "node_modules/.pnpm/pyodide@0.29.0/node_modules/pyodide/pyodide.mjs"() {
	Z = Object.defineProperty;
	o = (e, t) => Z(e, "name", {
		value: t,
		configurable: !0
	}), A = ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (t, n) => (typeof require < "u" ? require : t)[n] }) : e)(function(e) {
		if (typeof require < "u") return require.apply(this, arguments);
		throw Error("Dynamic require of \"" + e + "\" is not supported");
	});
	W = (() => {
		for (var e = new Uint8Array(128), t = 0; t < 64; t++) e[t < 26 ? t + 65 : t < 52 ? t + 71 : t < 62 ? t - 4 : t * 4 - 205] = t;
		return (n) => {
			for (var i = n.length, s = new Uint8Array((i - (n[i - 1] == "=") - (n[i - 2] == "=")) * 3 / 4 | 0), r = 0, a = 0; r < i;) {
				var l = e[n.charCodeAt(r++)], c = e[n.charCodeAt(r++)], d = e[n.charCodeAt(r++)], u = e[n.charCodeAt(r++)];
				s[a++] = l << 2 | c >> 4, s[a++] = c << 4 | d >> 2, s[a++] = d << 6 | u;
			}
			return s;
		};
	})();
	o(ee, "_isNumber");
	o(P, "_capitalize");
	o(x, "_getter");
	N = [
		"isConstructor",
		"isEval",
		"isNative",
		"isToplevel"
	], S = ["columnNumber", "lineNumber"], I = [
		"fileName",
		"functionName",
		"source"
	], te = ["args"], ne = ["evalOrigin"], F = N.concat(S, I, te, ne);
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
			var e = this.getFileName() || "", t = this.getLineNumber() || "", n = this.getColumnNumber() || "", i = this.getFunctionName() || "";
			return this.getIsEval() ? e ? "[eval] (" + e + ":" + t + ":" + n + ")" : "[eval]:" + t + ":" + n : i ? i + " (" + e + ":" + t + ":" + n + ")" : e + ":" + t + ":" + n;
		}, "toString")
	};
	p.fromString = o(function(t) {
		var n = t.indexOf("("), i = t.lastIndexOf(")"), s = t.substring(0, n), r = t.substring(n + 1, i).split(","), a = t.substring(i + 1);
		if (a.indexOf("@") === 0) var l = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(a, ""), c = l[1], d = l[2], u = l[3];
		return new p({
			functionName: s,
			args: r || void 0,
			fileName: c,
			lineNumber: d || void 0,
			columnNumber: u || void 0
		});
	}, "StackFrame$$fromString");
	for (b = 0; b < N.length; b++) p.prototype["get" + P(N[b])] = x(N[b]), p.prototype["set" + P(N[b])] = function(e) {
		return function(t) {
			this[e] = !!t;
		};
	}(N[b]);
	for (v = 0; v < S.length; v++) p.prototype["get" + P(S[v])] = x(S[v]), p.prototype["set" + P(S[v])] = function(e) {
		return function(t) {
			if (!ee(t)) throw new TypeError(e + " must be a Number");
			this[e] = Number(t);
		};
	}(S[v]);
	for (E = 0; E < I.length; E++) p.prototype["get" + P(I[E])] = x(I[E]), p.prototype["set" + P(I[E])] = function(e) {
		return function(t) {
			this[e] = String(t);
		};
	}(I[E]);
	O = p;
	o(re, "ErrorStackParser");
	ie = new re();
	M = ie;
	o(oe, "getGlobalRuntimeEnv");
	f = oe();
	o(ae, "calculateDerivedFlags");
	o(T, "initNodeModules");
	o(se, "node_resolvePath");
	o(le, "browser_resolvePath");
	f.IN_NODE ? _ = se : f.IN_SHELL ? _ = o((e) => e, "resolvePath") : _ = le;
	f.IN_NODE || (C = "/");
	o(ce, "node_getBinaryResponse");
	o(de, "shell_getBinaryResponse");
	o(ue, "browser_getBinaryResponse");
	f.IN_NODE ? R = ce : f.IN_SHELL ? R = de : R = ue;
	o(j, "loadBinaryFile");
	if (f.IN_BROWSER_MAIN_THREAD) w = o(async (e) => await import(e), "loadScript");
else if (f.IN_BROWSER_WEB_WORKER) w = o(async (e) => {
		try {
			globalThis.importScripts(e);
		} catch (t) {
			if (t instanceof TypeError) await import(e);
else throw t;
		}
	}, "loadScript");
else if (f.IN_NODE) w = fe;
else if (f.IN_SHELL) w = load;
else throw new Error("Cannot determine runtime environment");
	o(fe, "nodeLoadScript");
	o(V, "loadLockFile");
	o(z, "calculateDirname");
	o(J, "calculateInstallBaseUrl");
	o(q, "initializeNativeFS");
	me = o(async (e) => {
		let t = [];
		async function n(s) {
			for await (let r of s.values()) t.push(r), r.kind === "directory" && await n(r);
		}
		o(n, "collect"), await n(e);
		let i = new Map();
		i.set(".", e);
		for (let s of t) {
			let r = (await e.resolve(s)).join("/");
			i.set(r, s);
		}
		return i;
	}, "getFsHandles");
	G = W("AGFzbQEAAAABDANfAGAAAW9gAW8BfwMDAgECByECD2NyZWF0ZV9zZW50aW5lbAAAC2lzX3NlbnRpbmVsAAEKEwIHAPsBAPsbCwkAIAD7GvsUAAs=");
	ye = async function() {
		if (!(globalThis.navigator && (/iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === "MacIntel" && typeof navigator.maxTouchPoints < "u" && navigator.maxTouchPoints > 1))) try {
			let t = await WebAssembly.compile(G);
			return await WebAssembly.instantiate(t);
		} catch (t) {
			if (t instanceof WebAssembly.CompileError) return;
			throw t;
		}
	}();
	o(K, "getSentinelImport");
	o(Y, "createSettings");
	o(ge, "createHomeDirectory");
	o(be, "setEnvironment");
	o(ve, "callFsInitHook");
	o(Ee, "computeVersionTuple");
	o(Pe, "installStdlib");
	o(he, "getFileSystemInitializationFuncs");
	o(Ne, "getInstantiateWasmFunc");
	X = "0.29.0";
	o(k, "withTrailingSlash");
	U = X;
	o(Se, "initializeConfiguration");
	o(Ie, "createEmscriptenSettings");
	o(we, "loadWasmScript");
	o(_e, "prepareSnapshot");
	o(Re, "createPyodideModule");
	o(ke, "configureAPI");
	o(Ae, "bootstrapPyodide");
	o(Fe, "finalizeSetup");
	o(ct, "loadPyodide");
} });

//#endregion
//#region (ignored) node_modules/.pnpm/pyodide@0.29.0/node_modules/pyodide
var require_pyodide = __commonJS({ "node_modules/.pnpm/pyodide@0.29.0/node_modules/pyodide"() {} });

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
exports.settings = settings
return exports;
})({});