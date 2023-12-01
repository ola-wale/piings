import { PingContext } from "@/util/util";
import { numberToColor } from "@/util/util";

import { useEffect, useState, useContext, useMemo } from 'react';
import styled from 'styled-components';

type Props = {
  url: string
  zone: string
  city: string
}

const Root = styled.div<{ $isMinimumPing: boolean }>`
position: ${props => props.$isMinimumPing ? 'sticky' : 'relative'};
top: 0;
z-index: ${props => props.$isMinimumPing ? '3' : '2'};
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
  // Get the mean ping times from the PingContext
  const { meanPings, addPingTime, lowestMeanPing, highestMeanPing } = useContext(PingContext);
  // The number of times the url has been pinged
  const [pingCount, setPingCount] = useState<number>(0);
  // The id of the ping
  const id = url;
  // The maximum number of times to ping the url
  const pingLimit = 50;

  useEffect(() => {
    // Ping the url if the ping count is less than the ping limit
    if (pingCount < pingLimit) {
      // Ping immediately, per second subsequently
      setTimeout(() => {
        doPing();
      }, pingCount === 0 ? 0 : 1000);
    }
  }, [pingCount]);

  /**
   * Ping the url
   */
  const doPing = async () => {
    try {
      const startTime = currTimeMs();
      await fetchUrl(url);
      const endTime = currTimeMs();
      const elapsed = endTime - startTime;

      addPingTime({ id, time: elapsed });
      setPingCount((v) => v + 1);
    } catch (e) {

    }
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

  const meanPing = useMemo(() => meanPings.find(m => m.id === id), [meanPings]);
  const isMinimumPing = lowestMeanPing?.id === id;

  return (
    <Root $isMinimumPing={isMinimumPing} className={"rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-800 flex w-full flex-row items-center justify-between p-4 shadow-sm"}>
      <div className="flex flex-col">
        {isMinimumPing && <div className="flex">
          <div className="text-xs font-medium text-green-600 bg-green-400/10 rounded-full py-1 px-3 xl:flex justify-center">Benchmark</div>
        </div>}
        <Zone>{zone}</Zone>
        <City>{city}</City>
      </div>
      <div>
        {!!meanPing && <Latency style={{ color: numberToColor(lowestMeanPing?.time || 0, highestMeanPing?.time || 1000, meanPing.time) }}>{meanPing.time} ms</Latency>}
      </div>
    </Root>
  )
}