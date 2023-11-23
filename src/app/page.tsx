'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import Ping from '@/components/Ping';
import providers from '@/providers.json';
import { PingContext } from "@/util/util";

export default function Home() {
  const [minimum, setMinimum] = useState(0);
  const value = { minimum, setMinimum };

  return (
    <PingContext.Provider value={value}>
      <main className="min-h-screen container px-4 pt-5 mt-5 mx-auto max-w-screen-md">
        <div className="flex flex-row items-center">
          <Image width={40} height={40} src="/high-voltage_26a1.png" alt="Piings" />
          <h4 className="text-2xl dark:text-slate-50">Piings</h4>
        </div>
        <p className="text-base text-gray-500">Measure latency between your browser & different cloud providers.</p>
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
