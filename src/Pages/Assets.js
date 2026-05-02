import React, { useMemo, useState } from "react";
import Header from "./Header";
import Side_bar from "./Side_bar";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Search } from "lucide-react";

const ACCENT = "#B87A13";
const CARD_BG = "#151922";

const portfolioData = [
  { name: "ADA", percentage: 32, balance: "5759.24 ADA", usdt: "1950.08", color: "#49C989" },
  { name: "BTC", percentage: 25, balance: "0.024 BTC", usdt: "1523.50", color: "#FF5476" },
  { name: "ETH", percentage: 18, balance: "0.47 ETH", usdt: "1096.92", color: "#7A5AF8" },
  { name: "DOGE", percentage: 13, balance: "10318.17 DOGE", usdt: "792.22", color: "#F2C94C" },
  { name: "Other", percentage: 12, balance: "---", usdt: "731.28", color: "#FF7A45" },
];

const trendData = [
  { date: "09/08", value: 6015 },
  { date: "09/09", value: 5992 },
  { date: "09/10", value: 5968 },
  { date: "09/11", value: 6100.23 },
  { date: "09/12", value: 5987 },
  { date: "09/13", value: 5996 },
  { date: "09/14", value: 6036 },
];

const assetRows = [
  { symbol: "ADA", name: "Cardano", total: "5,759.24", totalUsdt: "=1950.08 USDT", available: "5,759.24", availableUsdt: "=1950.08 USDT", frozen: "0.00", frozenUsdt: "=0.00 USDT", valuation: "1950.08" },
  { symbol: "ETH", name: "Ethereum", total: "0.47", totalUsdt: "", available: "0.20", availableUsdt: "=466.39 USDT", frozen: "0.27", frozenUsdt: "=629.61 USDT", valuation: "1096.92" },
  { symbol: "BTC", name: "Bitcoin", total: "0.024", totalUsdt: "", available: "0.024", availableUsdt: "=1523.50 USDT", frozen: "0.00", frozenUsdt: "=0.00 USDT", valuation: "1523.50" },
  { symbol: "DOGE", name: "Dogecoin", total: "10318.17", totalUsdt: "", available: "10318.17", availableUsdt: "=792.22 USDT", frozen: "0.00", frozenUsdt: "=0.00 USDT", valuation: "792.22" },
  { symbol: "TRX", name: "Tron", total: "10.15", totalUsdt: "", available: "10.15", availableUsdt: "=3.81 USDT", frozen: "0.00", frozenUsdt: "=0.00 USDT", valuation: "3.81" },
  { symbol: "NLG", name: "Gulden", total: "103.15", totalUsdt: "", available: "103.15", availableUsdt: "=3 USDT", frozen: "0.00", frozenUsdt: "=0.00 USDT", valuation: "3.00055" },
];

const CoinIcon = ({ symbol }) => {
  const wrapper = "grid h-8 w-8 place-items-center rounded-full md:h-9 md:w-9";
  if (symbol === "BTC") {
    return (
      <span className={`${wrapper} bg-[#2f2417]`}>
        <svg viewBox="0 0 32 32" className="h-6 w-6"><circle cx="16" cy="16" r="16" fill="#F7931A" /><path d="M18.8 13.7c.3-2-1.2-3.1-3.3-3.8l.7-2.8-1.7-.4-.7 2.7c-.4-.1-.8-.2-1.2-.3l.7-2.7-1.7-.4-.7 2.8c-.3-.1-.6-.1-.9-.2v-.1l-2.3-.6-.5 1.9s1.2.3 1.2.3c.7.2.8.6.8 1l-.8 3.3-.8 3.2c-.1.3-.3.8-.9.6 0 0-1.2-.3-1.2-.3l-.9 2 2.1.5c.4.1.8.2 1.1.3l-.7 2.8 1.7.4.7-2.8c.4.1.8.2 1.2.3l-.7 2.8 1.7.4.7-2.8c2.9.6 5-.3 5.9-2.9.7-2 .1-3.2-1.5-4 .9-.2 1.6-.9 1.8-2.1Zm-3.2 4.5c-.5 2-3.8.9-4.8.7l1-3.8c1 .2 4.3.9 3.8 3.1Zm.5-4.5c-.5 1.8-3.2.9-4.1.7l.9-3.5c.9.2 3.8.9 3.2 2.8Z" fill="#fff" /></svg>
      </span>
    );
  }
  if (symbol === "ETH") {
    return (
      <span className={`${wrapper} bg-[#2a2d35]`}>
        <svg viewBox="0 0 32 32" className="h-6 w-6"><circle cx="16" cy="16" r="16" fill="#ECECEC" /><path d="M16 4 9.6 16 16 12.7 22.4 16 16 4Z" fill="#8C8C8C" /><path d="M16 12.7 9.6 16 16 19.8 22.4 16 16 12.7Z" fill="#62688F" /><path d="M16 27.5 9.6 17.2 16 21 22.4 17.2 16 27.5Z" fill="#454A75" /></svg>
      </span>
    );
  }
  if (symbol === "ADA") {
    return (
      <span className={`${wrapper} bg-[#142845]`}>
        <svg viewBox="0 0 32 32" className="h-6 w-6"><circle cx="16" cy="16" r="16" fill="#0A2B66" />{[[16, 8], [11, 10], [21, 10], [8, 16], [24, 16], [11, 22], [21, 22], [16, 24], [16, 16], [13, 16], [19, 16], [16, 13], [16, 19]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={i === 8 ? "1.7" : "1.1"} fill="#fff" />)}</svg>
      </span>
    );
  }
  if (symbol === "DOGE") {
    return (
      <span className={`${wrapper} bg-[#312b1a]`}>
        <svg viewBox="0 0 32 32" className="h-6 w-6"><circle cx="16" cy="16" r="16" fill="#C2A633" /><path d="M10 9.5h7.2c4 0 6.8 2.5 6.8 6.5s-2.8 6.5-6.8 6.5H10v-3.1h2V12.6h-2V9.5Zm5.2 10h1.7c2.1 0 3.5-1.3 3.5-3.5s-1.4-3.5-3.5-3.5h-1.7v7Z" fill="#fff" /></svg>
      </span>
    );
  }
  if (symbol === "TRX") {
    return (
      <span className={`${wrapper} bg-[#311823]`}>
        <svg viewBox="0 0 32 32" className="h-6 w-6"><circle cx="16" cy="16" r="16" fill="#EF0027" /><path d="m8 10 16 3.3-7.7 10.8L8 10Zm3 2.2 5.3 8.6 5.4-6.8-10.7-1.8Zm2.4 1.3 7.1 1.2-3.4 4.3-3.7-5.5Z" fill="#fff" /></svg>
      </span>
    );
  }
  return (
    <span className={`${wrapper} bg-[#1b3950]`}>
      <svg viewBox="0 0 32 32" className="h-6 w-6"><circle cx="16" cy="16" r="16" fill="#2EA7F2" /><path d="M22.8 16c0 4.3-3.1 7.3-7.4 7.3-4.2 0-7.2-3-7.2-7.2 0-4.2 3-7.2 7.2-7.2 2 0 3.8.7 5.1 2l-1.8 1.8a4.8 4.8 0 0 0-3.4-1.3 4.8 4.8 0 0 0-4.8 4.8 4.8 4.8 0 0 0 4.9 4.9 4.3 4.3 0 0 0 4.3-2.7h-4.3V16h7.4Z" fill="#fff" /></svg>
    </span>
  );
};

const AssetOverviewCard = () => (
  <article className="min-h-[320px] rounded-xl border border-[#252a36] bg-[#151922] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.35)] md:p-6 xl:col-span-2">
    <div className="relative z-10 mb-4 flex min-h-8 flex-nowrap items-center justify-between gap-3 border-b border-[#2a3038] pb-3">
      <h3 className="mb-0 whitespace-nowrap leading-none text-xl font-semibold text-[#e0a82d]">Asset Overview</h3>
      <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">
        <i className="ri-eye-line text-[#8c94a6]" />
        <select
          defaultValue="USDT"
          className="h-8 rounded-md border border-[#2a3038] bg-[#1a1f2a] px-2 text-xs text-[#d8deeb] outline-none transition focus:border-[#B87A13]"
        >
          <option>USDT</option>
          <option>BTC</option>
        </select>
      </div>
    </div>
    <div className="grid gap-2 pt-1 md:grid-cols-[190px_1fr] lg:grid-cols-[210px_1fr]">
      <div className="relative h-[176px] lg:h-[194px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={portfolioData} dataKey="percentage" innerRadius={66} outerRadius={84} startAngle={30} endAngle={390} paddingAngle={6} cornerRadius={10} stroke={CARD_BG} strokeWidth={6}>
              {portfolioData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-[20px] font-semibold leading-none text-[#e7ebf4] lg:text-[24px]">$6,094.96</div>
            <div className="mt-1.5 text-xs leading-none text-[#77829a] lg:text-sm">= 0.10 BTC</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-2 overflow-hidden">
        {portfolioData.map((item) => (
          <div
            key={item.name}
            className="grid grid-cols-[minmax(68px,1fr)_40px_minmax(82px,1fr)_minmax(92px,1fr)] items-center gap-1.5 text-[11px] leading-tight lg:grid-cols-[minmax(72px,1fr)_44px_minmax(90px,1fr)_minmax(110px,1fr)] lg:text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full shadow-[0_0_10px] shadow-current" style={{ color: item.color, background: item.color }} />
              <span className="truncate font-medium text-[#d4dae6]">{item.name}</span>
            </div>
            <span className="text-right font-semibold tabular-nums text-[#e8ecf5]">{item.percentage}%</span>
            <span className="truncate text-right tabular-nums text-[#c2c8d6]">{item.balance}</span>
            <span className="truncate text-right font-medium tabular-nums text-[#e0a82d]">= {item.usdt} USDT</span>
          </div>
        ))}
      </div>
    </div>
  </article>
);

const TotalAssetCard = () => {
  const peak = useMemo(() => trendData.reduce((max, item) => (item.value > max.value ? item : max), trendData[0]), []);
  return (
    <article className="min-h-[320px] rounded-xl border border-[#252a36] bg-[#151922] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.35)] md:p-6">
      <div className="relative z-10 mb-4 flex min-h-8 flex-nowrap items-center justify-between gap-3 border-b border-[#2a3038] pb-3">
        <h3 className="mb-0 whitespace-nowrap leading-none text-xl font-semibold text-[#e0a82d]">Total Asset</h3>
        <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">
          <i className="ri-eye-line text-[#8c94a6]" />
          <select
            defaultValue="USDT"
            className="h-8 rounded-md border border-[#2a3038] bg-[#1a1f2a] px-2 text-xs text-[#d8deeb] outline-none transition focus:border-[#B87A13]"
          >
            <option>USDT</option>
            <option>BTC</option>
          </select>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-3 pt-1">
        <p className="text-3xl text-[#e7ebf4]">$6,094.96</p>
        <span className="rounded-full bg-[#1a4e2f] px-2 py-1 text-xs font-semibold text-[#9df0be]">+6.3%</span>
      </div>
      <div className="h-[165px] md:h-[182px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ left: -5, right: 4, top: 10, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2b3140" vertical={false} />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#8a93a7", fontSize: 11 }} />
            <YAxis hide />
            <ReferenceArea x1={peak.date} x2={peak.date} fill={ACCENT} fillOpacity={0.25} />
            <Tooltip cursor={{ stroke: ACCENT, strokeWidth: 1 }} contentStyle={{ background: "#10141d", border: "1px solid #303646", borderRadius: 8 }} formatter={(value) => [`$${value}`, "Asset"]} labelStyle={{ color: "#dce2ef" }} itemStyle={{ color: "#dce2ef" }} />
            <Line type="monotone" dataKey="value" stroke={ACCENT} strokeWidth={2} dot={{ r: 3, fill: "#cfd6e6", stroke: ACCENT, strokeWidth: 1 }} activeDot={{ r: 5, fill: "#fff", stroke: ACCENT, strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
};

const AssetsTableSection = () => {
  const [query, setQuery] = useState("");
  const [hideZero, setHideZero] = useState(false);
  const [simplified, setSimplified] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = useMemo(() => {
    const searched = assetRows.filter((row) => `${row.symbol} ${row.name}`.toLowerCase().includes(query.toLowerCase()));
    const zeroFiltered = hideZero ? searched.filter((row) => row.total !== "0.00") : searched;
    if (!simplified) return zeroFiltered;
    return zeroFiltered.map((row) => ({ ...row, availableUsdt: "", frozenUsdt: "", totalUsdt: "" }));
  }, [query, hideZero, simplified]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pagedRows = filtered.slice((page - 1) * perPage, page * perPage);
  const tableHeaders = ["Crypto", "Total Balance", "Available", "Frozen", "USDT Valuation", "Action"];

  return (
    <section className="mt-5 rounded-xl border border-[#252a36] bg-[#151922] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.35)] md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-2xl font-semibold text-[#e0a82d]">Assets List</h3>
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#BD7F10]" />
            <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search" className="h-10 w-52 rounded-xl border border-[#2a3038] bg-[#1a1f2a] pl-9 pr-3 text-sm text-[#BD7F10] placeholder:text-[#BD7F10] shadow-inner outline-none transition focus:border-[#BD7F10] focus:ring-2 focus:ring-[#BD7F10]/30 md:w-56" />
          </div>
          <label className="flex items-center gap-2 text-xs text-[#BD7F10] md:text-sm">
            <input type="checkbox" checked={hideZero} onChange={(e) => setHideZero(e.target.checked)} className="h-4 w-4 rounded border border-[#2a3038] bg-[#1a1f2a] align-middle accent-[#BD7F10]" />
            <span className="leading-none">Hide Zero Balance Assets</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-[#BD7F10] md:text-sm">
            <input type="checkbox" checked={simplified} onChange={(e) => setSimplified(e.target.checked)} className="h-4 w-4 rounded border border-[#2a3038] bg-[#1a1f2a] align-middle accent-[#BD7F10]" />
            <span className="leading-none">Simplified List</span>
          </label>
        </div>
      </div>
      <div className="mb-3 flex items-center border-b border-[#2a3038]">
        <button className="border-b-2 border-[#B87A13] px-1 pb-2 text-sm font-medium text-[#e5bc6a]">
          All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[920px] w-full border-separate border-spacing-y-2">
          <thead className="bg-[#151922] text-xs !text-[#BD7F10]">
            <tr>
              {tableHeaders.map((header) => (
                <th key={header} className="border-b border-[#2a3038] px-4 py-3 text-left font-medium !text-[#BD7F10]">
                  <span className="inline-flex items-center gap-1.5 !text-[#BD7F10]">
                    {header}
                    {header !== "Action" && (
                      <span className="flex flex-col items-center justify-center text-[10px] leading-[8px] text-[#BD7F10]">
                        <i className="ri-arrow-up-s-fill h-2.5 leading-[8px]" />
                        <i className="-mt-0.5 ri-arrow-down-s-fill h-2.5 leading-[8px]" />
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((row) => (
              <tr key={row.symbol} className="rounded-xl bg-[#1a1f2a] text-sm text-[#e7ebf4] ring-1 ring-[#252a36]/70 transition hover:bg-[#202633]">
                <td className="rounded-l-xl px-4 py-3.5 align-middle">
                  <div className="flex items-center gap-3">
                    <CoinIcon symbol={row.symbol} />
                    <div className="leading-tight">
                      <p className="text-sm font-semibold">{row.symbol}</p>
                      <p className="mt-1 text-xs text-[#8892a8]">{row.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 align-middle">
                  <p className="text-sm">{row.total}</p>
                  {row.totalUsdt ? <p className="mt-1 text-xs text-[#8892a8]">{row.totalUsdt}</p> : <p className="mt-1 text-xs text-transparent">.</p>}
                </td>
                <td className="px-4 py-3.5 align-middle">
                  <p className="text-sm">{row.available}</p>
                  {row.availableUsdt ? <p className="mt-1 text-xs text-[#8892a8]">{row.availableUsdt}</p> : <p className="mt-1 text-xs text-transparent">.</p>}
                </td>
                <td className="px-4 py-3.5 align-middle">
                  <p className="text-sm">{row.frozen}</p>
                  {row.frozenUsdt ? <p className="mt-1 text-xs text-[#8892a8]">{row.frozenUsdt}</p> : <p className="mt-1 text-xs text-transparent">.</p>}
                </td>
                <td className="px-4 py-3.5 align-middle text-sm">{row.valuation}</td>
                <td className="rounded-r-xl px-4 py-3.5 align-middle">
                  <div className="flex items-center gap-2.5">
                    <button className="h-8 w-[92px] rounded-lg border border-[#B87A13] px-0 text-xs font-semibold text-[#e4af47] transition duration-200 hover:bg-[#2b2214] hover:text-[#f0c76d]">
                      Withdraw
                    </button>
                    <button className="h-8 w-[92px] rounded-lg bg-[#B87A13] px-0 text-xs font-semibold text-[#131821] transition duration-200 hover:bg-[#d29a31]">
                      Deposit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="h-6 min-w-6 rounded bg-[#1f2634] px-2 text-xs text-[#d2a13f] transition hover:bg-[#2b3447]">{"<"}</button>
        {Array.from({ length: totalPages }).map((_, i) => { const n = i + 1; const active = n === page; return <button key={n} onClick={() => setPage(n)} className={`h-6 min-w-6 rounded px-2 text-xs transition ${active ? "bg-[#B87A13] text-[#131821]" : "bg-[#1f2634] text-[#d2a13f] hover:bg-[#2b3447]"}`}>{n}</button>; })}
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="h-6 min-w-6 rounded bg-[#1f2634] px-2 text-xs text-[#d2a13f] transition hover:bg-[#2b3447]">{">"}</button>
      </div>
    </section>
  );
};

const Assets = () => (
  <>
    <section><Header /></section>
    <main className="dashboard_main">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2 padlef_0_col"><Side_bar /></div>
          <div className="col-lg-10 padin_lefrig_dash">
            <section className="asset_section relative z-[1] bg-[#0f1117] pb-6 pt-20 md:pt-24">
              <div className="grid gap-5 xl:grid-cols-3">
                <AssetOverviewCard />
                <TotalAssetCard />
              </div>
              <div className="mt-5 border-t border-[#2a3038]" />
              <AssetsTableSection />
            </section>
          </div>
        </div>
      </div>
    </main>
  </>
);

export default Assets;
