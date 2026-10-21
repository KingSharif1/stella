"use client";

import { useCallback, useMemo, useState } from "react";
import { useV3Robot } from "@/lib/v3/store";
import { FCall } from "@/components/f/f-call";
import { FRemote } from "@/components/f/f-remote";
import { FLines } from "@/components/f/f-lines";
import "../../app/design-f.css";
import "../../app/f-windows.css";
import { StellaOSImpl } from "./stella-os-impl";

/** Connects the Stella OS UI to the live robot store (drive, clean, dock, wake, tools, TV, voice).
 *  Talk → the call-style voice window; TV → the phone-style remote (both from the classic dashboard). */
export function StellaOS() {
  const api = useV3Robot();
  const { state, robotOnline, cleanMode, wakeRobot, setCleaningMotors, runCommand, speak } = api;
  const [callOpen, setCallOpen] = useState(false);
  const [remoteOpen, setRemoteOpen] = useState(false);
  const [linesOpen, setLinesOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const onTalk = useCallback(() => setCallOpen(true), []);
  const onRemote = useCallback(() => setRemoteOpen(true), []);
  const onLines = useCallback(() => setLinesOpen(true), []);
  const onTheme = useCallback((t: string) => setTheme(t === "light" ? "light" : "dark"), []);
  const live = useMemo(
    () => ({
      connection: state.connection,
      robotUrl: state.robotUrl,
      mode: state.mode,
      battery: state.battery,
      robotOnline,
      cleanMode,
      wakeRobot,
      setCleaningMotors,
      runCommand,
      speak,
    }),
    [state.connection, state.robotUrl, state.mode, state.battery, robotOnline, cleanMode, wakeRobot, setCleaningMotors, runCommand, speak]
  );
  return (
    <>
      <StellaOSImpl live={live} onTalk={onTalk} onRemote={onRemote} onLines={onLines} onTheme={onTheme} />
      {/* zero-height host so the classic windows pick up their theme variables without painting a page */}
      <div className="f" data-theme={theme} style={{ minHeight: 0, height: 0, background: "transparent" }}>
        <FCall open={callOpen} onClose={() => setCallOpen(false)} />
        <FRemote open={remoteOpen} onClose={() => setRemoteOpen(false)} />
        <FLines open={linesOpen} onClose={() => setLinesOpen(false)} />
      </div>
    </>
  );
}
