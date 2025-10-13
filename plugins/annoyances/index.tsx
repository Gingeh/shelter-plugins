const {
    plugin: { store },
    ui: { SwitchItem: _SwitchItem },
    observeDom,
} = shelter;

import { ReactNode } from "react";

const hopefully_unique_id = "annoyances-gingeh";

const SwitchItem = _SwitchItem as (props: Parameters<typeof _SwitchItem>[0]) => ReactNode | Promise<ReactNode>; // hack to appease the typescript gods
export const settings = () => (
    <>
        <SwitchItem value={store.member_list_backgrounds} onChange={(v: boolean) => { store.member_list_backgrounds = v; }}>
            Remove member list backgrounds
        </SwitchItem>
        <SwitchItem value={store.avatar_decorations} onChange={(v: boolean) => { store.avatar_decorations = v; }}>
            Remove avatar decorations
        </SwitchItem>
        <SwitchItem value={store.fancy_profile_themes} onChange={(v: boolean) => { store.fancy_profile_themes = v; }}>
            Remove fancy profile themes
        </SwitchItem>
        <SwitchItem value={store.gift_button} onChange={(v: boolean) => { store.gift_button = v; }}>
            Remove gift button
        </SwitchItem>
        <SwitchItem value={store.quests_button} onChange={(v: boolean) => { store.quests_button = v; }}>
            Remove quests button
        </SwitchItem>
        <SwitchItem value={store.boosts_button} onChange={(v: boolean) => { store.boosts_button = v; }}>
            Remove boosts button and progress in channel list
        </SwitchItem>
    </>
)

let cleanup_callbacks: (() => void)[] = [];

export function onLoad() {
    // member list backgrounds
    store.member_list_backgrounds ??= true;
    if (store.member_list_backgrounds) {
        cleanup_callbacks.push(observeDom("[class*=nameplated__] > [class*=container__]", (elem) => {
            elem.remove();
        }));
    }

    // avatar decorations
    store.avatar_decorations ??= true;
    if (store.avatar_decorations) {
        cleanup_callbacks.push(observeDom("[class*=avatarDecoration__]", (elem) => {
            elem.remove();
        }));
    }

    // fancy profile themes
    store.fancy_profile_themes ??= true;
    if (store.fancy_profile_themes) {
        cleanup_callbacks.push(observeDom(`.custom-theme-background:not([data-${hopefully_unique_id}])`, (elem) => {
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
    }

    // gift button
    store.gift_button ??= true;
    if (store.gift_button) {
        cleanup_callbacks.push(observeDom("[aria-label*=gift][class*=button__]", (elem) => {
            elem.remove();
        }));
    }

    // quests button
    store.quests_button ??= true;
    if (store.quests_button) {
        cleanup_callbacks.push(observeDom("[href*=quest-home]", (elem) => {
            elem.remove();
        }));
    }

    // boosts button in channel list
    store.boosts_button ??= true;
    if (store.boosts_button) {
        cleanup_callbacks.push(observeDom(`[class*=basicChannelRowLink__]:not([data-${hopefully_unique_id}])`, (elem) => {
            if (elem.querySelector("[class*=name__] span")?.textContent.includes("Boosts")) {
                elem.remove();
            } else {
                elem.setAttribute(`data-${hopefully_unique_id}`, "true");
            }
        }));

        cleanup_callbacks.push(observeDom("[class*=containerWithMargin__]:has([class*=progressContainer__])", (elem) => {
            elem.remove();
        }));
    }
}

export function onUnload() {
    for (const cb of cleanup_callbacks) cb();
}
