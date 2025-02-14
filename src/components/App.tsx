import { BsThermometerHalf } from "solid-icons/bs";
import { TbWind } from "solid-icons/tb";
import { AiFillThunderbolt } from "solid-icons/ai";
import { BsFire } from 'solid-icons/bs'
import { For, createSignal } from "solid-js";
import Notes from "./Notes";
import { performanceData } from "../data/performanceData";

export default function App() {
  // Fahrenheit Temperatures
  const outdoorTemps = [0, 10, 20, 30, 40, 50, 60];
  const edbTemps = [65, 70, 75];
  const cfmValues = [1200, 1400, 1550];

  const [edb, setEdb] = createSignal<number>(edbTemps[0]);
  const [outdoor, setOutdoor] = createSignal<number>(outdoorTemps[0]);

  // Convert to Celsius
  const [useCelsius, setUseCelsius] = createSignal(false);
  const toCelsius = (f: number) => {
    if (useCelsius()) {
      const c = ((f - 32) * (5 / 9)).toFixed(1);
      return `${c}°C`
    }
    return `${f}°F`;
  };

  const getCapacityData: any = (outdoor: number, edb: number, cfm: number) => {
    return performanceData[outdoor]?.[edb]?.[cfm] || undefined;
  };

  const getCapacityColor = (value: number): string => {
    let result: string = "";
    if (value <= 13.7) result = "text-cyan-300";
    if (value > 13.7 && value < 40.2) result = "text-warning";
    if (value >= 40.2) result = "text-red-700";
    return result;
  };

  return (
    <main class="bg-base-100 w-full flex flex-col-reverse md:flex-col items-center gap-6 md:gap-10 my-12">
      {/* Toggle Temperature Unit */}
      <section class="flex justify-between w-full max-w-5xl flex-col gap-6 items-center md:flex-row md:items-end ">
        <div class="flex justify-center items-center gap-4 font-semibold text-xl text-accent">
          <h1>Fahrenheit</h1>
          <input
            type="checkbox"
            onClick={() => setUseCelsius(prev => !prev)}
            checked={useCelsius()}
            class="toggle toggle-lg toggle-accent border-accent text-accent bg-base-200 checked:bg-base-200"
          />
          <h1>Celsius</h1>
        </div>

        <Notes />
      </section>

      {/* Grid */}
      <div class="grid grid-cols-5 grid-flow-row gap-1 md:gap-2 bg-base-300 p-1 md:p-2 text-white text-center rounded-lg shadow-lg w-full max-w-5xl">
        {/* Section Headers */}
        <div class="rounded-lg bg-secondary p-3 col-span-2 text-lg font-semibold uppercase flex justify-center items-center">Indoor Air</div>
        <div class="rounded-lg bg-secondary p-3 col-span-3 text-lg font-semibold uppercase flex justify-center items-center">Outdoor Coil Entering Air</div>

        {/* EDB and CFM Columns */}
        <div class="rounded-lg bg-primary p-2 row-span-3 flex flex-col justify-center items-center gap-1 tooltip" data-tip="Entering Dry Bulb temperature">
          <span class="text-lg font-semibold">EDB</span>
          <BsThermometerHalf size={24} />
        </div>
        <div class="rounded-lg bg-primary p-2 row-span-3 flex flex-col justify-center items-center gap-1 tooltip" data-tip="Cubic Feet per Minute">
          <span class="text-lg font-semibold">CFM</span>
          <TbWind size={24} />
        </div>

        {/* Outdoor Coil Temperature Dropdown */}
        <div class="rounded-lg bg-accent p-2 col-span-3">
          <select
            class="select select-ghost select-accent w-full text-center font-semibold"
            onChange={(e) => setOutdoor(parseInt(e.currentTarget.value))}
          >
            <For each={outdoorTemps}>
              {(temp) => (
                <option value={temp}>{toCelsius(temp)}</option>
              )}
            </For>
          </select>
        </div>

        {/* Capacity and Power Consumption */}
        <div class="rounded-lg bg-primary p-2 col-span-2 flex justify-center items-center gap-2">
          <span class="text-lg font-semibold">Capacity (MBtuh)</span>
          <BsFire size={24} />
        </div>
        <div class="rounded-lg bg-primary p-2 row-span-2 flex flex-col justify-center items-center gap-1">
          <span class="text-lg font-semibold">Total System kW</span>
          <AiFillThunderbolt size={24} />
        </div>

        {/* Total and Integ Fields */}
        <div class="rounded-lg bg-secondary p-2 font-semibold">Total</div>
        <div class="rounded-lg bg-secondary p-2 font-semibold">Integ</div>

        {/* Indoor Temperature Dropdown */}
        <div class="rounded-lg bg-accent p-2 row-span-3 flex flex-col justify-center items-center">
          <select
            class="select select-ghost select-accent h-full w-fit md:w-full text-center font-semibold whitespace-nowrap overflow-hidden"
            onChange={(e) => setEdb(parseInt(e.currentTarget.value))}
          >
            <For each={edbTemps}>
              {(temp) => (
                <option value={temp}>{toCelsius(temp)}</option>
              )}
            </For>
          </select>
        </div>

        {/* Airflow Rows */}
        <For each={cfmValues}>
          {(cfm) => (
            <>
              <div class="rounded-lg bg-secondary p-2 font-semibold">{cfm}</div>
              <div
                class={`rounded-lg bg-secondary/70 p-2 ${getCapacityColor(parseInt(getCapacityData(outdoor(), edb(), cfm).total))}`}
              >
                {getCapacityData(outdoor(), edb(), cfm).total}
              </div>
              <div
                class={`rounded-lg bg-secondary/70 p-2 ${getCapacityColor(parseInt(getCapacityData(outdoor(), edb(), cfm).integ))}`}
              >
                {getCapacityData(outdoor(), edb(), cfm).integ}
              </div>
              <div class="rounded-lg bg-secondary/70 p-2">
                {getCapacityData(outdoor(), edb(), cfm).totalSystemkW}
              </div>
            </>
          )}
        </For>
      </div>
    </main>
  );
}
