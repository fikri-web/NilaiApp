"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Plus, 
  RotateCcw,
  Trophy,
  Sliders,
  Database
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Panel from "@/components/ui/Panel";

export default function Dashboard() {
  const [entries, setEntries] = useState([
    { id: 1024, name: "Core Reactor A", value: 92.5, operator: "Admin", status: "Nominal" },
    { id: 1048, name: "Turbine Feed B", value: 84.1, operator: "Operator 12", status: "Critical" },
    { id: 1096, name: "Coolant Loop 3", value: 96.0, operator: "Sysop", status: "Nominal" },
    { id: 1102, name: "Grid Interface", value: 78.4, operator: "Field Tech", status: "Warning" },
  ]);

  const [formName, setFormName] = useState("");
  const [formValue, setFormValue] = useState("");
  const [formOperator, setFormOperator] = useState("");
  const [formStatus, setFormStatus] = useState("Nominal");

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!formName || !formValue || !formOperator) return;

    const newEntry = {
      id: Math.floor(Math.random() * 8999) + 1000,
      name: formName,
      value: parseFloat(formValue) || 0,
      operator: formOperator,
      status: formStatus,
    };

    setEntries([...entries, newEntry]);
    setFormName("");
    setFormValue("");
    setFormOperator("");
    setFormStatus("Nominal");
  };

  const handleReset = () => {
    setEntries([
      { id: 1024, name: "Core Reactor A", value: 92.5, operator: "Admin", status: "Nominal" },
      { id: 1048, name: "Turbine Feed B", value: 84.1, operator: "Operator 12", status: "Critical" },
      { id: 1096, name: "Coolant Loop 3", value: 96.0, operator: "Sysop", status: "Nominal" },
      { id: 1102, name: "Grid Interface", value: 78.4, operator: "Field Tech", status: "Warning" },
    ]);
  };

  const rankedEntries = [...entries].sort((a, b) => b.value - a.value);

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-7xl mx-auto w-full gap-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#babecc]/50 pb-6 gap-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="secondary" className="px-3 py-2 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-text-muted uppercase">SYSTEM MONITOR</span>
            <h1 className="text-2xl font-black text-text uppercase">CONSOLE DASHBOARD</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d1d9e6]/20 border border-[#babecc]/40 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full led-green" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">LINK ESTABLISHED</span>
          </div>
          <Button variant="secondary" onClick={handleReset} className="px-3 py-2 flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset Data
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Panel (cols 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Panel variant="raised" className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-[#babecc]/50 pb-3">
              <Sliders className="w-5 h-5 text-accent" />
              <h2 className="font-bold text-md uppercase text-text tracking-wide">Telemetry Input</h2>
            </div>

            <form onSubmit={handleAddEntry} className="flex flex-col gap-4">
              <Input
                id="node-name"
                label="Node / Device Name"
                placeholder="e.g. Generator Core"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />

              <Input
                id="efficiency-value"
                label="Efficiency / Capacity (%)"
                placeholder="e.g. 94.5"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                required
              />

              <Input
                id="operator"
                label="Assigned Operator"
                placeholder="e.g. Sarah Connor"
                value={formOperator}
                onChange={(e) => setFormOperator(e.target.value)}
                required
              />

              <div className="flex flex-col gap-1.5 w-full">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Node Security Status</span>
                <div className="relative rounded-md overflow-hidden bg-[#d1d9e6]/20 border border-[#babecc]/40">
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent text-text font-mono text-sm tracking-wide shadow-recessed outline-none border-none select-none appearance-none"
                    style={{
                      boxShadow: "inset 4px 4px 8px #babecc, inset -4px -4px 8px #ffffff",
                    }}
                  >
                    <option value="Nominal">Nominal (Optimal)</option>
                    <option value="Warning">Warning (Caution)</option>
                    <option value="Critical">Critical (Danger)</option>
                  </select>
                  <span className="absolute inset-[1px] rounded-[5px] border border-t-[#babecc]/60 border-l-[#babecc]/40 border-b-transparent border-r-transparent pointer-events-none animate-pulse" />
                </div>
              </div>

              <Button type="submit" variant="accent" className="w-full py-3.5 mt-4 flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Transmit Telemetry
              </Button>
            </form>
          </Panel>

          {/* Ranking Panel */}
          <Panel variant="sunken" className="bg-[#e0e5ec]/50 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#babecc]/40 pb-2">
              <Trophy className="w-4 h-4 text-accent animate-bounce" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-text-muted">Node Efficiency Rankings</h3>
            </div>
            
            <div className="space-y-3">
              {rankedEntries.map((item, index) => {
                let badgeClass = "bg-panel text-text-muted";
                if (index === 0) badgeClass = "bg-accent/15 text-accent border border-accent/30 font-bold";
                
                return (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-2.5 rounded bg-background border border-white/60 shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] bevel-top"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 flex items-center justify-center rounded text-xs font-mono font-bold ${badgeClass}`}>
                        #{index + 1}
                      </span>
                      <span className="text-xs font-semibold text-text uppercase">{item.name}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-text-muted">{item.value.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        {/* Right Column: Industrial Card containing Table (cols 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card hasScrews={true} liftOnHover={false} className="bg-[#f0f2f5] border border-[#babecc]/50 h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#babecc]/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-background flex items-center justify-center shadow-card border border-white/60 bevel-top">
                    <Database className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-black text-md uppercase text-text tracking-wide">ACTIVE SCHEMATICS</h2>
                    <span className="text-[9px] font-mono text-text-muted tracking-wider">CURRENT NODE TELEMETRY REGISTRY</span>
                  </div>
                </div>
                
                <span className="text-xs font-mono font-bold text-text-muted px-2 py-1 bg-background border border-[#babecc]/40 shadow-inner rounded">
                  ENTRIES: {entries.length}
                </span>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-lg border border-[#babecc]/60 bg-background/50 shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#babecc]/50 bg-panel text-[10px] font-mono font-black uppercase text-text-muted tracking-wider select-none">
                      <th className="py-3.5 px-4">Node ID</th>
                      <th className="py-3.5 px-4">Device Unit</th>
                      <th className="py-3.5 px-4 text-right">Yield (%)</th>
                      <th className="py-3.5 px-4">Operator</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((item, index) => {
                      const isEven = index % 2 === 0;
                      
                      let statusLed = "led-green";
                      let statusTextClass = "text-green-600";
                      
                      if (item.status === "Critical") {
                        statusLed = "led-red";
                        statusTextClass = "text-red-500 font-bold";
                      } else if (item.status === "Warning") {
                        statusLed = "led-yellow";
                        statusTextClass = "text-yellow-600";
                      }

                      return (
                        <tr 
                          key={item.id} 
                          className={`
                            border-b border-[#babecc]/30 text-xs font-mono text-text hover:bg-panel/40 transition-colors
                            ${isEven ? "bg-[#d1d9e6]/10" : "bg-transparent"}
                          `}
                        >
                          <td className="py-3 px-4 font-bold text-text-muted">
                            #{item.id.toString()}
                          </td>
                          <td className="py-3 px-4 uppercase font-bold tracking-wide">
                            {item.name}
                          </td>
                          <td className="py-3 px-4 text-right font-black">
                            {item.value.toFixed(1)}%
                          </td>
                          <td className="py-3 px-4 text-text-muted">
                            {item.operator}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${statusLed}`} />
                              <span className={`text-[10px] uppercase font-bold ${statusTextClass}`}>
                                {item.status}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Readout Diagnostics */}
            <div className="mt-8 pt-4 border-t border-[#babecc]/40 grid grid-cols-3 gap-4 text-center font-mono select-none">
              <div className="p-3 rounded bg-background border border-white/60 shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] bevel-top">
                <span className="text-[9px] text-text-muted block">MEAN EFFICIENCY</span>
                <span className="text-sm font-black text-text">
                  {(entries.reduce((acc, curr) => acc + curr.value, 0) / entries.length || 0).toFixed(1)}%
                </span>
              </div>
              <div className="p-3 rounded bg-background border border-white/60 shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] bevel-top">
                <span className="text-[9px] text-text-muted block">GRID ALARMS</span>
                <span className="text-sm font-black text-red-500">
                  {entries.filter(e => e.status === "Critical").length} ACTIVE
                </span>
              </div>
              <div className="p-3 rounded bg-background border border-white/60 shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] bevel-top">
                <span className="text-[9px] text-text-muted block">OPERATING VOLTAGE</span>
                <span className="text-sm font-black text-text">440.6 V</span>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
