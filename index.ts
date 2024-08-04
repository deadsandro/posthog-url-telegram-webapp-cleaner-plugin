import {PluginInput, PluginMeta, PostHogEvent} from "@posthog/plugin-scaffold";

function cleanTelegramAuthUrl(url: string): string {
    const parsedUrl = new URL(url);

    if (parsedUrl.hash?.match(/^#tgWebAppData/i)) {
        return url.replace(parsedUrl.hash, '')
    }

    return url;
}

export function processEvent(
    event: PostHogEvent,
    meta: PluginMeta<PluginInput>
) {
    const $current_url = event?.properties?.$current_url;
    if ($current_url) {
        event.properties.$current_url = cleanTelegramAuthUrl($current_url)
    }

    return event;
}