import React, { useRef, useState, useEffect } from 'react';
import { 
  PanelLeft, 
  ChevronLeft, 
  ChevronRight, 
  Monitor, 
  RotateCw, 
  Share, 
  Plus, 
  Copy, 
  Grid, 
  Compass, 
  Layers, 
  ListTodo, 
  Sparkles 
} from 'lucide-react';
import { Logo } from './Logo';

// ScaledDashboard wrapper that scales the 896px design width down via CSS transform
export const ScaledDashboard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const updateScale = () => {
      const containerWidth = container.getBoundingClientRect().width;
      const targetWidth = 896; // Fixed design width
      const newScale = Math.min(containerWidth / targetWidth, 1);
      setScale(newScale);
      setHeight(inner.offsetHeight * newScale);
    };

    // Initial sizing
    updateScale();

    const observer = new ResizeObserver(() => {
      updateScale();
    });

    observer.observe(container);
    observer.observe(inner);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full overflow-hidden" 
      style={{ height: `${height}px` }}
    >
      <div
        ref={innerRef}
        className="w-[896px] shrink-0"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const DashboardMockup: React.FC = () => {
  return (
    <div className="rounded-t-2xl overflow-hidden bg-[#1a1a1c] shadow-[0_-20px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/10 text-left flex flex-col font-sans select-none">
      {/* Title Bar */}
      <div className="bg-[#242427] border-b border-white/5 px-4 py-2.5 flex items-center justify-between">
        {/* Left: Traffic Lights & Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-2">
            <PanelLeft className="w-3.5 h-3.5 text-white/40" />
            <div className="flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5 text-white/40" />
              <ChevronRight className="w-3.5 h-3.5 text-white/25" />
            </div>
          </div>
        </div>

        {/* Center URL Bar */}
        <div className="flex items-center gap-1.5 bg-[#1a1a1c] rounded-md px-6 py-1 text-[10px] text-white/60 w-52 justify-center">
          <Monitor className="w-3.5 h-3.5 text-white/40" />
          <span>setuhub.ai</span>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          <RotateCw className="w-3.5 h-3.5 text-white/40" />
          <Share className="w-3.5 h-3.5 text-white/40" />
          <Plus className="w-3.5 h-3.5 text-white/40" />
          <Copy className="w-3.5 h-3.5 text-white/40" />
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="flex flex-row min-h-[480px]">
        {/* Sidebar (22% width) */}
        <div className="w-[22%] border-r border-white/5 bg-[#1e1e21] px-3 py-3.5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Sidebar Logo */}
            <div className="flex items-center justify-between px-1">
              <Logo className="w-6 h-6 shrink-0" />
              <Grid className="w-3.5 h-3.5 text-white/30" />
            </div>

            {/* Workspace Badge */}
            <div className="flex items-center gap-2 bg-white/[0.04] ring-1 ring-white/5 rounded-lg p-1.5">
              <div className="w-4 h-4 rounded bg-[#e8553f] flex items-center justify-center text-[8px] font-bold text-white uppercase shrink-0">
                S
              </div>
              <span className="text-[10px] text-white/80 font-medium truncate">Shopkeeper</span>
            </div>

            {/* Navigation Items */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.06] text-white text-[10px] font-medium cursor-pointer">
                <Compass className="w-3.5 h-3.5 text-[#e8553f]" />
                <span>Live Routes</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.02] text-[10px] cursor-pointer transition-colors">
                <Layers className="w-3.5 h-3.5 text-white/40" />
                <span>Corridors</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.02] text-[10px] cursor-pointer transition-colors">
                <ListTodo className="w-3.5 h-3.5 text-white/40" />
                <span>Inbox</span>
              </div>
            </div>


          </div>

          {/* Footer Area */}
          <div className="text-[9px] text-white/30 px-2 pt-2 border-t border-white/5 space-y-1">
            <div className="truncate">SetuHub Engine v2.5</div>
            <div className="truncate">Shopkeeper Node</div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-[#161618] p-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#e8553f] flex items-center justify-center text-white text-base font-semibold shrink-0">
                  V
                </div>
                <div>
                  <h2 className="text-sm font-medium text-white">Vijay Kirana Store</h2>
                  <p className="text-[10px] text-white/45">Bhopal-Vidisha Corridor Node</p>
                </div>
              </div>
              
              <button className="flex items-center gap-1.5 bg-[#e8553f] hover:bg-[#d04530] text-white text-[10px] font-medium px-3 py-1.5 rounded-lg transition-colors">
                <Sparkles className="w-3 h-3" />
                <span>Match Route</span>
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 divide-x divide-white/5 rounded-xl bg-white/[0.03] ring-1 ring-white/5">
              {[
                { label: 'DELIVERED', value: '62', sub: 'Parcels completed' },
                { label: 'CORRIDORS', value: '12', sub: 'Highway routes' },
                { label: 'PENDING', value: '412', sub: 'Available orders' },
                { label: 'SAVINGS', value: '₹3,156,200', sub: 'Direct payout pool' }
              ].map((stat, idx) => (
                <div key={idx} className="p-3 text-left">
                  <span className="block text-[8px] tracking-wider text-white/35 uppercase font-medium">
                    {stat.label}
                  </span>
                  <span className="block text-xl font-medium text-white mt-1 leading-none">
                    {stat.value}
                  </span>
                  <span className="block text-[8px] text-white/45 mt-1.5 truncate">
                    {stat.sub}
                  </span>
                </div>
              ))}
            </div>



            {/* Available Orders */}
            <div className="rounded-lg bg-white/[0.02] ring-1 ring-white/5 overflow-hidden">
              <table className="w-full text-[10px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02] text-white/35 text-[8px] tracking-wider">
                    <th className="px-3 py-2 font-medium uppercase">Route</th>
                    <th className="px-3 py-2 font-medium uppercase">Cargo Type</th>
                    <th className="px-3 py-2 font-medium uppercase">Payout</th>
                    <th className="px-3 py-2 font-medium uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/70">
                  {[
                    { r: 'Bhopal ➔ Vidisha', c: 'Medicines', p: '₹450' },
                    { r: 'Ahmedabad ➔ Mehsana', c: 'Electronics', p: '₹620' },
                    { r: 'Sehore ➔ Bhopal', c: 'Organic Seeds', p: '₹380' },
                    { r: 'Indore ➔ Dewas', c: 'Auto Parts', p: '₹520' },
                    { r: 'Bhopal ➔ Sehore', c: 'Surgical Kits', p: '₹410' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01]">
                      <td className="px-3 py-1.5 text-white/80 font-medium truncate max-w-[280px]">{row.r}</td>
                      <td className="px-3 py-1.5">{row.c}</td>
                      <td className="px-3 py-1.5">
                        <span className="text-white/85 font-medium">{row.p}</span>
                      </td>
                      <td className="px-3 py-1.5 text-[#febc2e]/80 font-medium">OTP Pending</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
