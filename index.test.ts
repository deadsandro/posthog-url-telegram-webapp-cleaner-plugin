import { PluginInput, PluginMeta, PostHogEvent} from "@posthog/plugin-scaffold";
import { processEvent } from "./index";

/**
 * Given a url, construct a page view event.
 *
 * @param $current_url The current url of the page view
 * @returns A new PostHog page view event
 */
function buildPageViewEvent($current_url: string): PostHogEvent {
    const event: PostHogEvent = {
        properties: {
            $current_url,
        },
        distinct_id: "distinct_id",
        team_id: 0,
        timestamp: new Date("2022-06-17T20:21:31.778000+00:00"),
        event: "$pageview",
        uuid: "01817354-06bb-0000-d31c-2c4eed374100",
    };

    return event;
}

function buildEventWithoutCurrentUrl(): PostHogEvent {
    const event: PostHogEvent = {
        properties: {},
        distinct_id: "distinct_id",
        team_id: 0,
        timestamp: new Date("2022-06-17T20:21:31.778000+00:00"),
        event: "$identify",
        uuid: "01817354-06bb-0000-d31c-2c4eed374100",
    };

    return event;
}

function getMeta(): PluginMeta<PluginInput> {
    return {} as unknown as PluginMeta<PluginInput>;
}

describe("processEvent", () => {
    it("shouldn't change a url don't have hash", () => {
        const sourceEvent = buildPageViewEvent("http://google.com/test");

        const processedEvent = processEvent(sourceEvent, getMeta());

        expect(processedEvent?.properties?.$current_url).toEqual(
            "http://google.com/test"
        );
    });

    it("should convert the current_url to non-hash version if has tgWebAppData", () => {
        const sourceEvent = buildPageViewEvent(
            "http://google.com/test#tgWebAppData=query_id"
        );

        const processedEvent = processEvent(sourceEvent, getMeta());

        expect(processedEvent?.properties?.$current_url).toEqual(
            "http://google.com/test"
        );
    });

    it("should not convert the current_url to non-hash version if has not tgWebAppData", () => {
        const sourceEvent = buildPageViewEvent(
            "http://google.com/test#test=query_id"
        );

        const processedEvent = processEvent(sourceEvent, getMeta());

        expect(processedEvent?.properties?.$current_url).toEqual(
            "http://google.com/test#test=query_id"
        );
    });
});