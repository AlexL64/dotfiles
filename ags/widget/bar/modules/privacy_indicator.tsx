import { bind } from "astal";
import Wp from "gi://AstalWp";

const { audio, video } = Wp.get_default()!;

export default function Privacy() {
    return (
        <box
            className={"privacy"}
            spacing={10}
            visible={false}
            setup={(self) => {
                self.hook(bind(audio, "recorders"), (_) => { self.visible = IsVisible() })
                self.hook(bind(audio, "streams"), (_) => { self.visible = IsVisible() })
                self.hook(bind(video, "recorders"), (_) => { self.visible = IsVisible() })
                self.hook(bind(video, "streams"), (_) => { self.visible = IsVisible() })
            }}>
            <label
                className={"audio-recorders"}
                label={""}
                visible={bind(audio, "recorders").as((r) => r.length > 0)}
                hasTooltip
                onQueryTooltip={(self, x, y, kbtt, tooltip) => {
                    tooltip.set_custom(TooltipText(audio.recorders));
                    return true;
                }}
            />
            <label
                className={"audio-streams"}
                label={""}
                visible={bind(audio, "streams").as((s) => s.length > 0)}
                hasTooltip
                onQueryTooltip={(self, x, y, kbtt, tooltip) => {
                    tooltip.set_custom(TooltipText(audio.streams));
                    return true;
                }}
            />
            <label
                className={"video-recorders"}
                label={""}
                visible={bind(video, "recorders").as((r) => r.length > 0)}
                hasTooltip
                onQueryTooltip={(self, x, y, kbtt, tooltip) => {
                    tooltip.set_custom(TooltipText(video.recorders));
                    return true;
                }}
            />
            <label
                className={"audio-streams"}
                label={""}
                visible={bind(video, "streams").as((s) => s.length > 0)}
                hasTooltip
                onQueryTooltip={(self, x, y, kbtt, tooltip) => {
                    tooltip.set_custom(TooltipText(video.streams));
                    return true;
                }}
            />
        </box>
    );
}

function TooltipText(endpoints: Wp.Endpoint[]) {
    return <box vertical>
        {
            endpoints.map(e => {
                return <box spacing={10}>
                    <icon icon={e.icon} />
                    <label label={e.name} />
                </box>
            })
        }
    </box>
}

function IsVisible() {

    const audioRecorders = audio.recorders.length > 0;
    const audioStreams = audio.streams.length > 0;
    const videoRecorders = video.recorders.length > 0;
    const videoStreams = video.streams.length > 0;

    if (audioRecorders || audioStreams || videoRecorders || videoStreams) {
        return true
    }

    return false;
}