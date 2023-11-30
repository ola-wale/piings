import React from "react";
import { PingTime } from "../../types";

export const PingContext = React.createContext({
  pingTimes: [] as PingTime[],
  addPingTime: (time: PingTime) => {},
});

export const numberToColor = (min: number, max: number, value: number) => {
  // Ensure value is within range
  value = Math.min(Math.max(value, min), max);

  // Calculate the ratio of the value
  const ratio = (value - min) / (max - min);

  // Calculate green and red values
  const green = Math.floor((1 - ratio) * 255);
  const red = Math.floor(ratio * 255);

  // Return the RGB color string
  return `rgb(${red},${green},0)`;
}