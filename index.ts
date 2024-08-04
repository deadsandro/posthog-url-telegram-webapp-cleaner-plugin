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
    console.info('event', event);

    const current_url = event?.properties?.$current_url;
    console.info('$current_url', current_url);
    if (current_url) {
        console.info(`$current_url 1: ${current_url}`);
        const normalized_url = cleanTelegramAuthUrl(current_url);
        console.info(`$current_url 2 : ${current_url}`);
        console.info(`cleaned_url 3 : ${normalized_url}`);
        event.properties.$current_url = normalized_url;
        console.info(`cleaned_url: ${normalized_url}`);
    }

    const $initial_current_url = event?.properties?.$initial_current_url;
    console.info('$initial_current_url', $initial_current_url);
    if ($initial_current_url) {
        const normalized_url = cleanTelegramAuthUrl($initial_current_url);
        event.properties.$initial_current_url = normalized_url;
        console.info(`cleaned_url: ${normalized_url}`);
    }

    return event;
}