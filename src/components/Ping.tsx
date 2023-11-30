import { PingContext } from "@/util/util";
import { numberToColor } from "@/util/util";

import { useEffect, useState, useContext, useMemo } from 'react';
import styled from 'styled-components';

type Props = {
  url: string
  zone: string
  city: string
}

const Root = styled.div`
position: relative;
top: 0;
z-index: 2;
`

const Zone = styled.h6.attrs({
  className: "font-medium text-sm dark:text-slate-50"
})`
`

const City = styled.small.attrs({
  className: "text-gray-500 text-xs"
})`
`

const Latency = styled.small.attrs({
  className: "text-base"
})`
`

export default function Ping({ url, zone, city }: Props) {
  const { pingTimes, addPingTime } = useContext(PingContext);
  const [pingInProgress, setPingInProgress] = useState<boolean>(false);
  const [pingCount, setPingCount] = useState<number>(0);

  const pingId = url;
  const pingLimit = 50;

  useEffect(() => {
    if (pingCount < pingLimit) {
      setTimeout(() => {
        doPing();
      }, pingCount === 0 ? 0 : 1000);
    }
  }, [pingCount]);

  const doPing = async () => {
    setPingInProgress(true);
    try {
      const startTime = currTimeMs();
      await fetchUrl(url);
      const endTime = currTimeMs();
      const elapsed = endTime - startTime;

      addPingTime({ id: pingId, time: elapsed });
      setPingCount((v) => v + 1);
    } catch (e) {

    }
    setPingInProgress(false);
  }

  const currTimeMs = () => (new Date()).getTime();

  const fetchUrl = async (url: string) => {
    const OPTS: RequestInit = {
      "cache": "no-store",
      "credentials": "omit",
      "redirect": "error"
    };

    try {
      await fetch(url, OPTS);
    } catch (e) {
      if (e instanceof TypeError) {
        // ignore cors error
      } else {
        throw e;
      }
    }
  }

  const currentPingTimes = useMemo(() => pingTimes.filter((pingTime) => pingTime.id === pingId), [pingTimes, pingId]);
  const meanPingTime = useMemo(() => currentPingTimes.length > 0 ? Math.round(currentPingTimes.reduce((a, b) => a + b.time, 0) / currentPingTimes.length) : null, [currentPingTimes]);

  return (
    <Root className={"rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-800 flex w-full flex-row items-center justify-between p-4 shadow-sm"}>
      <div className="flex flex-col">
        <Zone>{zone}</Zone>
        <City>{city}</City>
      </div>
      <div>
        {!!meanPingTime && <Latency style={{ color: numberToColor(meanPingTime, 1000, meanPingTime) }}>{meanPingTime} ms</Latency>}
      </div>
    </Root>
  )
}