"use client";
import { useMemo } from "react";
import { formatZAR } from "@/lib/format";

type Order = {
  id: string;
  total: number;
  createdAt: Date | string;
};

type Props = {
  orders: Order[];
  days?: number;
};

export default function RevenueChart({ orders, days = 14 }: Props) {
  const bars = useMemo(() => {
    const now = new Date();
    const result: { label: string; date: string; revenue: number; count: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });

      const dayOrders = orders.filter((o) => {
        const od = new Date(o.createdAt).toISOString().slice(0, 10);
        return od === dateStr;
      });

      result.push({
        label,
        date: dateStr,
        revenue: dayOrders.reduce((s, o) => s + o.total, 0),
        count: dayOrders.length,
      });
    }
    return result;
  }, [orders, days]);

  const maxRevenue = Math.max(...bars.map((b) => b.revenue), 1);
  const totalRevenue = bars.reduce((s, b) => s + b.revenue, 0);
  const totalOrders = bars.reduce((s, b) => s + b.count, 0);
  const peakDay = bars.reduce((a, b) => (b.revenue > a.revenue ? b : a), bars[0]);

  const W = 600;
  const H = 160;
  const padL = 8;
  const padR = 8;
  const padT = 12;
  const padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const barW = chartW / bars.length;
  const barGap = barW * 0.25;

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "2px", padding: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--dim)", marginBottom: "6px" }}>
            Revenue — last {days} days
          </p>
          <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "28px", color: "var(--gold)", lineHeight: 1 }}>
            {formatZAR(totalRevenue)}
          </p>
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "var(--dim)", marginBottom: "4px" }}>Orders</p>
            <p style={{ fontSize: "20px", fontWeight: 600, color: "var(--white)" }}>{totalOrders}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "var(--dim)", marginBottom: "4px" }}>Peak day</p>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--white)" }}>
              {peakDay.revenue > 0 ? `${peakDay.label} · ${formatZAR(peakDay.revenue)}` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* SVG bar chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ overflow: "visible", display: "block" }}
      >
        {/* Baseline */}
        <line
          x1={padL} y1={padT + chartH}
          x2={W - padR} y2={padT + chartH}
          stroke="var(--border)" strokeWidth="1"
        />

        {/* Horizontal grid line at 50% */}
        <line
          x1={padL} y1={padT + chartH * 0.5}
          x2={W - padR} y2={padT + chartH * 0.5}
          stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5"
        />

        {bars.map((bar, i) => {
          const bh = bar.revenue > 0 ? Math.max((bar.revenue / maxRevenue) * chartH, 3) : 0;
          const x = padL + i * barW + barGap / 2;
          const y = padT + chartH - bh;
          const w = barW - barGap;
          const isToday = i === bars.length - 1;

          return (
            <g key={bar.date}>
              {/* Bar */}
              <rect
                x={x} y={y} width={w} height={bh}
                fill={bar.revenue > 0 ? (isToday ? "var(--gold)" : "rgba(200,168,75,0.45)") : "var(--border)"}
                rx="1"
              />

              {/* Tooltip on hover — use title element */}
              {bar.revenue > 0 && (
                <title>{bar.label}: {formatZAR(bar.revenue)} ({bar.count} order{bar.count !== 1 ? "s" : ""})</title>
              )}

              {/* X-axis label — show every other on small sets, every 3rd on 14-day */}
              {(days <= 7 || i % 2 === 0) && (
                <text
                  x={x + w / 2}
                  y={padT + chartH + 16}
                  textAnchor="middle"
                  fontSize="9"
                  fill="var(--dim)"
                  fontFamily="inherit"
                >
                  {bar.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <p style={{ fontSize: "11px", color: "var(--dim)", marginTop: "8px", fontStyle: "italic" }}>
        Hover a bar to see the day's detail. Today is highlighted in gold.
      </p>
    </div>
  );
}
