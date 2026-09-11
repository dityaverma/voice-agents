import { createRoot } from "react-dom/client";
import { PipecatClient } from "@pipecat-ai/client-js";
import {
  SmallWebRTCTransport,
  WavMediaManager,
} from "@pipecat-ai/small-webrtc-transport";
import {
  PipecatClientAudio,
  PipecatClientProvider,
} from "@pipecat-ai/client-react";
import App from "./App";
import "./index.css";

function iceServersFromEnv(): RTCIceServer[] {
  const servers: RTCIceServer[] = [
    { urls: "stun:stun.l.google.com:19302" },
  ];
  const turnUrls = (import.meta.env.VITE_TURN_URLS as string | undefined)
    ?.split(",")
    .map((u) => u.trim())
    .filter(Boolean);
  const username = (import.meta.env.VITE_TURN_USERNAME as string | undefined)?.trim();
  const credential = (
    import.meta.env.VITE_TURN_CREDENTIAL as string | undefined
  )?.trim();
  if (turnUrls?.length) {
    if (username && credential) {
      servers.push({ urls: turnUrls, username, credential });
    } else {
      for (const url of turnUrls) {
        servers.push({ urls: url });
      }
    }
  }
  return servers;
}

// WavMediaManager uses getUserMedia directly — no Daily CDN (c.daily.co).
// DailyMediaManager was failing here with ERR_CONNECTION_CLOSED / 502.
const client = new PipecatClient({
  transport: new SmallWebRTCTransport({
    iceServers: iceServersFromEnv(),
    mediaManager: new WavMediaManager(),
  }),
  enableMic: true,
  enableCam: false,
});

createRoot(document.getElementById("root")!).render(
  <PipecatClientProvider client={client}>
    <App />
    <PipecatClientAudio />
  </PipecatClientProvider>,
);
