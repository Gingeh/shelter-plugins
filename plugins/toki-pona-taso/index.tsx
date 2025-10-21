/// <reference path="../../node_modules/@uwu/shelter-defs/dist/shelter-defs/rootdefs.d.ts" />

const {
  util: { getFiber, getFiberOwner },
  ui: { showToast, Text, LinkButton, TextArea, injectCss, ReactiveRoot },
  plugin: { store: _store },
  observeDom,
} = shelter;
const { ChannelStore, SelectedChannelStore, GuildStore } =
  shelter.flux.storesFlat;

const hopefully_unique_id = "toki-pona-taso-gingeh";

// "ale" li wile ala
// "penpo" li wile e tenpo pi toki pona taso
// "tawa_jan" li wile e ni: sina toki tawa jan wan
// "nanpa_kulupu(12345)" li wile e ni: sina toki tawa kulupu nanpa "12345"
// "nanpa_tomo(12345)" li wile e ni: sina toki lon tomo nanpa "12345"
// "nimi_kulupu(regex)" li wile e ni: sina toki tawa kulupu la, nimi ona li pona tawa "regex"
// "nimi_tomo(regex)" li wile e ni: sina toki lon tomo la, nimi ona li pona tawa "regex"

const nullaryPredicates = ["ale", "penpo", "tawa_jan"] as const;
function isNullaryPredicate(
  name: string
): name is (typeof nullaryPredicates)[number] {
  return (nullaryPredicates as readonly string[]).includes(name);
}

const numericPredicates = ["nanpa_kulupu", "nanpa_tomo"] as const;
function isNumericPredicate(
  name: string
): name is (typeof numericPredicates)[number] {
  return (numericPredicates as readonly string[]).includes(name);
}

const regexPredicates = ["nimi_kulupu", "nimi_tomo"] as const;
function isRegexPredicate(
  name: string
): name is (typeof regexPredicates)[number] {
  return (regexPredicates as readonly string[]).includes(name);
}

type FilterPredicate =
  | {
      name: (typeof nullaryPredicates)[number];
    }
  | {
      name: (typeof numericPredicates)[number];
      argument: string;
    }
  | {
      name: (typeof regexPredicates)[number];
      argument: RegExp;
    };

function parse_predicate(line: string): FilterPredicate {
  // format: name(argument) or name
  // name can contain anything except parentheses, whitespace and newlines
  // argument can contain anything except parentheses and newlines
  const match = line.trim().match(/^([^\s()]+)(\(([^()\n]*)\))?$/);
  if (!match) {
    throw new Error(`Invalid predicate format: ${line}`);
  }

  const name = match[1];
  const argument = match[3] ?? null;

  if (isNullaryPredicate(name)) {
    if (argument !== null) {
      throw new Error(`Predicate ${name} does not take an argument`);
    }
    return { name };
  } else if (isNumericPredicate(name)) {
    if (argument === null || argument.match(/^\d+$/) === null) {
      throw new Error(`Predicate ${name} requires a numeric argument`);
    }
    return { name, argument };
  } else if (isRegexPredicate(name)) {
    if (argument === null) {
      throw new Error(`Predicate ${name} requires an argument`);
    }
    try {
      return { name, argument: new RegExp(argument) };
    } catch {
      throw new Error(`Predicate ${name} requires a valid regex argument`);
    }
  } else {
    throw new Error(`Unknown predicate name: ${name}`);
  }
}

async function predicate_matches(
  predicate: FilterPredicate,
  channel_id: string
): Promise<boolean> {
  if (predicate.name === "ale") {
    return true;
  } else if (predicate.name === "penpo") {
    return (await python_wrapper)!.is_tenpo_penpo();
  } else if (predicate.name === "tawa_jan") {
    const { type } = ChannelStore.getChannel(channel_id);
    return (
      type === 1 || // DM
      type === 3
    ); // Group DM
  } else if (predicate.name === "nanpa_kulupu") {
    const { guild_id } = ChannelStore.getChannel(channel_id);
    return guild_id === predicate.argument;
  } else if (predicate.name === "nanpa_tomo") {
    return channel_id === predicate.argument;
  } else if (predicate.name === "nimi_kulupu") {
    const { guild_id } = ChannelStore.getChannel(channel_id);
    const { name } = GuildStore.getGuild(guild_id);
    return predicate.argument.test(name);
  } else if (predicate.name === "nimi_tomo") {
    const { name } = ChannelStore.getChannel(channel_id);
    return predicate.argument.test(name);
  }
  return true;
}

type KenAlaKen = "ken" | "ala"; // allow or block

type FilterRule = {
  verdict: KenAlaKen;
  predicates: FilterPredicate[];
};

async function rule_matches(rule: FilterRule, channel_id: string): Promise<boolean> {
  for (const predicate of rule.predicates) {
    if (!await predicate_matches(predicate, channel_id)) return false;
  }
  return true;
}

type FilterConfig = {
  rules: FilterRule[];
};

function parse_config(lines: string): FilterConfig {
  const rules: FilterRule[] = [];
  let current_predicates: FilterPredicate[] = [];
  for (let line of lines.split("\n")) {
    line = line.split("#")[0].trim(); // remove comments and extra whitespace
    if (line.length === 0) continue; // skip empty lines

    if (line.startsWith(">")) {
      if (current_predicates.length === 0) {
        throw new Error("Rule has no predicates");
      }

      const verdict_str = line.slice(1).trim();
      if (verdict_str !== "ken" && verdict_str !== "ala") {
        throw new Error(`Invalid verdict: ${verdict_str}`);
      }
      rules.push({ verdict: verdict_str, predicates: current_predicates });
      current_predicates = [];
    } else {
      current_predicates.push(parse_predicate(line));
    }
  }

  if (current_predicates.length > 0) {
    throw new Error("Last rule has no verdict");
  }

  if (rules.length === 0) {
    throw new Error("No rules defined");
  }

  return { rules };
}

async function kenTokiAnte(config: FilterConfig, channel_id: string): Promise<KenAlaKen> {
  for (const rule of config.rules) {
    if (await rule_matches(rule, channel_id)) {
      return rule.verdict;
    }
  }
  return "ken";
}

interface CustomStore extends Record<string, any> {
  filterConfigString: String;
  filterConfig: FilterConfig;
  filterConfigHeight: string;
  filterConfigError: { present: true; value: string } | { present: false };
}
const store = _store as CustomStore;

store.filterConfigString ??= new String("ale\n>ken");
store.filterConfig ??= parse_config(store.filterConfigString.toString());
store.filterConfigHeight ??= "58px";
store.filterConfigError ??= { present: false };
export const settings = () => (
  <ReactiveRoot>
    <Text class={`ucsur-${hopefully_unique_id}`}>
      󱥄󱥬󱤉󱥁‍→󱦝󱥙󱤡󱥞󱤘󱥬󱤆
      {/* o toki e ni: seme la sina ken toki ante */}
    </Text>
    <br />
    <Text class={`ucsur-${hopefully_unique_id}`}>
      󱥞󱥷󱥡󱤉󱤎󱥁󱤡
      {/* sina wile sone e ilo ni la */}
    </Text>
    <LinkButton
      href="https://github.com/Gingeh/shelter-plugins/blob/main/plugins/toki-pona-taso/lipusona.txt"
      class={`ucsur-${hopefully_unique_id}`}
    >
      󱥄󱤭󱤉󱤴
      {/* o luka e mi */}
    </LinkButton>
    <br />
    <Text
      style={{
        visibility: store.filterConfigError.present ? "visible" : "hidden",
        color: "var(--status-danger)",
      }}
    >
      {store.filterConfigError.present
        ? store.filterConfigError.value
        : "placeholder to reserve vertical space"}
    </Text>
    <TextArea
      mono={true}
      resize-y={true}
      value={store.filterConfigString}
      style={{
        "border-color": store.filterConfigError.present
          ? "var(--status-danger)"
          : undefined,
        height: store.filterConfigHeight,
      }}
      oninput={(e: Event) => {
        const textarea = e.target as HTMLTextAreaElement;
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
            value: (error as Error).message,
          };
        }
      }}
    />
    <br />
  </ReactiveRoot>
);

async function should_prevent_sending(editor: any): Promise<boolean> {
  const channel_id = SelectedChannelStore.getChannelId();
  if (await kenTokiAnte(store.filterConfig, channel_id) === "ken") return false;

  editor.previewMarkdown = false;
  editor.onChange();
  const text = editor.children
    .map((child: any) => child.children[0].text)
    .join("\n");
  editor.previewMarkdown = true;

  return !(await python_wrapper)?.is_toki_pona(text);
}

function try_shake_screen() {
  const app = document.querySelector("[class*=app__]");
  if (!app) return;
  const app_fiber_owner = getFiberOwner(app) as any;
  if (typeof app_fiber_owner.shake !== "function") return;
  app_fiber_owner.shake(200, 2);
}

async function onKeydown(this: HTMLElement, event: Event) {
  (async (elem: HTMLElement, event: KeyboardEvent) => {
    if (
      event.key !== "Enter" ||
      event.getModifierState("Shift") ||
      document.querySelector("[class*=autocomplete__]")
    )
      return;

    const fiber = getFiber(elem);
    if (!fiber || !fiber.child) return;
    const editor = fiber.child.pendingProps.editor;

    if (await should_prevent_sending(editor)) {
      try_shake_screen();
      showToast({
        title: "󱥄󱥬󱥔󱥨", // o toki pona taso
        content: "󱥁‍←󱤧󱥬󱥔󱤂", // ni li toki pona ala
        class: `ucsur-${hopefully_unique_id}`,
        duration: 5000,
      });
      event.preventDefault();
      event.stopPropagation();
    }
  })(this, event as KeyboardEvent);
}

interface PythonWrapper {
  is_toki_pona: (text: string) => boolean;
  is_tenpo_penpo: () => boolean;
}

let python_wrapper: Promise<PythonWrapper> | null = null;

async function load_python_wrapper(): Promise<PythonWrapper> {
  // hack to make pyodide correctly detect the environment
  window["sessionStorage"] = {
    length: 0,
    clear() {},
    getItem(_key: string) {
      return null;
    },
    key(_index: number) {
      return null;
    },
    removeItem(_key: string) {},
    setItem(_key: string, _value: string) {},
  };

  const { loadPyodide, version: pyodideVersion } = await import("pyodide");
  const pyodide = await loadPyodide({
    indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`,
  });

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

                return (phase_now < 0.5) != (phase_two_days_ago < 0.5)

        PythonWrapper()
    `);
}

let unobserve = () => {};
let removeCSS = () => {};

export async function onLoad() {
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

  unobserve = observeDom(
    `[class*=slateContainer_]:not([data-${hopefully_unique_id}])`,
    (elem) => {
      elem.setAttribute(`data-${hopefully_unique_id}`, "true");
      elem.addEventListener("keydown", onKeydown);
    }
  );
}

export function onUnload() {
  python_wrapper = null;
  unobserve();
  removeCSS();
  for (const elem of document.querySelectorAll(
    `[class*=slateContainer_][data-${hopefully_unique_id}]`
  )) {
    elem.removeAttribute(`data-${hopefully_unique_id}`);
    elem.removeEventListener("keydown", onKeydown);
  }
}
