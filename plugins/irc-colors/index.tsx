/// <reference path="../../node_modules/@uwu/shelter-defs/dist/shelter-defs/rootdefs.d.ts" />

const { GuildMemberStore, ChannelStore, LayerStore } =
    shelter.flux.storesFlat;
const {
    util: { getFiber, reactFiberWalker },
    plugin: { store },
    ui: { SwitchItem },
    observeDom,
} = shelter;

import { xxHash32 } from "js-xxhash";

const hopefully_unique_id = "irc-colors-gingeh";

// Calculate a CSS color string based on the user ID
const calculateNameColorForUser = (() => {
    const _calculateNameColorForUser = (user_id: string) => {
        return `oklch(0.750153 0.1275291 ${xxHash32(user_id) % 360})`;
        //            ^ most vibrant possible hue ring where all hues are in gamut
    };

    const cache = new Map<string, string>();
    return (user_id: string | null) => {
        if (!user_id) return null;
        if (cache.has(user_id)) return cache.get(user_id);
        const color = _calculateNameColorForUser(user_id);
        cache.set(user_id, color);
        return color;
    };
})();

function handleAnyUsername(user_id: string, name_elem: HTMLElement) {
    if (name_elem.style.color && store.respectRoles) {
        // name_elem already has a color set directly
        return;
    }

    const color = calculateNameColorForUser(user_id);
    if (color) {
        name_elem.style.color = color;
    }
}

store.respectRoles ??= true;
export const settings = () => (
    <SwitchItem value={store.respectRoles} onChange={(v: boolean) => { store.respectRoles = v }}>
        Don't override existing role colors.
    </SwitchItem>
)

let unObserveCallbacks: (() => void)[] = [];
let desaturateClass: string | null = null;

export function onLoad() {
    if (!desaturateClass) {
        // desaturateUserColors__XXXXX
        for (const sheet of document.styleSheets) {
            for (const rule of sheet.cssRules) {
                if (!(rule instanceof CSSStyleRule)) continue;
                let match = rule.selectorText.match(/desaturateUserColors__\w+/);
                if (match) {
                    desaturateClass = match[0];
                    break;
                }
            }
        }
    }

    // messages
    unObserveCallbacks.push(observeDom(`[id*=message-username-]:not([data-${hopefully_unique_id}])`, (elem) => {
        elem.setAttribute(`data-${hopefully_unique_id}`, "true");

        const message = reactFiberWalker(getFiber(elem), "message", true)
            ?.pendingProps?.message;
        if (!message) return;

        if (store.respectRoles && !LayerStore.getLayers().includes('USER_SETTINGS')) {
            const { type, guild_id } = ChannelStore.getChannel(message.channel_id);
            if (type === 0) {
                // message in a guild, check if user has a role color
                const member = GuildMemberStore.getMember(guild_id, message.author.id);
                if (!member) return;
                if (member.colorString !== null) return; // user has a manual color set
            }
        }

        const usernameElem = elem.firstElementChild;
        if (!usernameElem || !(usernameElem instanceof HTMLElement)) return;

        handleAnyUsername(message.author.id, usernameElem);
        if (desaturateClass) usernameElem.classList.add(desaturateClass);
    }));

    // member list
    unObserveCallbacks.push(observeDom(`[class*=nameContainer__]:not([data-${hopefully_unique_id}])`, (elem) => {
        elem.setAttribute(`data-${hopefully_unique_id}`, "true");

        const user = reactFiberWalker(getFiber(elem), "user", true)?.pendingProps?.user;
        if (!user) return;

        handleAnyUsername(user.id, elem as HTMLElement);
    }));

    // replied message authors
    unObserveCallbacks.push(observeDom(`[class*=repliedMessage_] [class*=username_]:not([data-${hopefully_unique_id}])`, (elem) => {
        elem.setAttribute(`data-${hopefully_unique_id}`, "true");

        const user = reactFiberWalker(getFiber(elem), "user", true)?.pendingProps?.user;
        if (!user) return;

        handleAnyUsername(user.id, elem as HTMLElement);
        if (desaturateClass) elem.classList.add(desaturateClass);
    }));
}

export function onUnload() {
    for (const unObserve of unObserveCallbacks) unObserve();
}
