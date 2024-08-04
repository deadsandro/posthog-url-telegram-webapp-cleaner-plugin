import {PluginInput, PluginMeta, PostHogEvent} from "@posthog/plugin-scaffold";

function cleanTelegramAuthUrl(url: string): string {
    try {
        const parsedUrl = new URL(url);
        
        if (parsedUrl.hash?.match(/^#tgWebAppData/i)) {
            parsedUrl.hash = '';
        }

        return parsedUrl.toString();
    } catch (err) {
        throw `Unable to normalize invalid URL: "${url}"`;
    }
}

export function processEvent(
    event: PostHogEvent,
    meta: PluginMeta<PluginInput>
) {
    const $current_url = event?.properties?.$current_url;

    if (event?.properties && $current_url) {
        const normalized_url = cleanTelegramAuthUrl($current_url);
        event.properties.$current_url = normalized_url;
        console.debug(`cleaned_url: ${normalized_url}`);
    }

    const $initial_current_url = event?.properties?.$initial_current_url;
    if (event?.properties && $initial_current_url) {
        const normalized_url = cleanTelegramAuthUrl($initial_current_url);
        event.properties.$initial_current_url = normalized_url;
        console.debug(`cleaned_url: ${normalized_url}`);
    }

    return event;
}