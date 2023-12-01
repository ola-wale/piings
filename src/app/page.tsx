'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';

import Ping from '@/components/Ping';
import providers from '@/providers.json';
import { PingContext } from "@/util/util";
import { PingTime } from "../../types";

export default function Home() {
  // A list of ping times
  const [pingTimes, setPingTimes] = useState<PingTime[]>([]);
  // Get a list of unique ping ids
  const uniquePingIds = useMemo(() => pingTimes.map((pingTime) => pingTime.id).filter((v, i, a) => a.indexOf(v) === i), [pingTimes]);
  // Calculate the mean ping time for each unique ping id & sort them in descending order
  const meanPings = useMemo(() => uniquePingIds.map((id) => {
    // Get all ping times for this id
    const pingScores = pingTimes.filter((pingTime) => pingTime.id === id);
    // Calculate the mean ping time
    const time = Math.round(pingScores.reduce((a, b) => a + b.time, 0) / pingScores.length);
    return { id, time };
    // Sort the mean ping times in descending order
  }).sort((a, b) => b.time - a.time), [pingTimes, uniquePingIds]);

  // Get the lowest & highest mean ping times
  const lowestMeanPing = meanPings[meanPings.length - 1];
  const highestMeanPing = meanPings[0];

  // Add a ping time to the list of ping times
  const addPingTime = (score: PingTime) => setPingTimes((v:any) => [...v, score]);

  // The value to be passed to the PingContext.Provider
  const value = { addPingTime, lowestMeanPing, highestMeanPing, meanPings };

  return (
    <PingContext.Provider value={value}>
      <main className="min-h-screen container px-4 pt-5 mt-5 mx-auto max-w-screen-md">
        <div className="flex flex-row items-center">
          <Image width={40} height={40} src="/high-voltage_26a1.png" alt="Piings" />
          <h4 className="text-2xl dark:text-slate-50">Piings</h4>
        </div>
        <p className="text-base text-gray-500">Measure latency between your browser & different cloud providers.</p>
        <p className="text-gray-500 text-sm mt-2">For each node, 50 requests will be made and the mean latency will be displayed.</p>
        {
          providers.map((provider) => {
            return <div key={provider.name} className="flex flex-col gap-2 mt-5 pt-2 pb-5">
              <a className="text-lg hover:underline dark:text-slate-50" href={provider.url} target="_blank">{provider.name}</a>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {
                  provider.nodes.map((node) => {
                    return <Ping key={provider.name + node.zone} zone={node.zone} city={node.city} url={node.url} />
                  })
                }
              </div>
            </div>
          })
        }
        <div className="mb-5">
          <h6 className="dark:text-neutral-50">by <a className="text-blue-600" href="https://walemoren.com">walemoren.com</a></h6>
        </div>
      </main>
    </PingContext.Provider>
  )
}
