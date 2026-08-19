import React, { useState } from 'react';
import { BarChart3, Table as TableIcon } from 'lucide-react';
import { Button } from '../../primitives/buttons/Button';
import { cn } from '../../../lib/utils';

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartWrapperProps {
  title: string;
  unit: string;
  methodology: string;
  data: ChartDataPoint[];
  children?: React.ReactNode;
  className?: string;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  title,
  unit,
  methodology,
  data,
  children,
  className,
}) => {
  const [showTable, setShowTable] = useState(false);

  return (
    <div className={cn('p-4 bg-white border border-neutral-200 rounded-lg shadow-subtle font-sans space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-semibold text-neutral-900">{title}</h4>
          <span className="text-xs font-mono text-neutral-700">Units: {unit}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowTable(!showTable)}
          leadingIcon={showTable ? <BarChart3 className="w-4 h-4" /> : <TableIcon className="w-4 h-4" />}
        >
          {showTable ? 'Visual Chart' : 'Data Table Fallback'}
        </Button>
      </div>

      <div className="min-h-[220px] flex items-center justify-center bg-neutral-50 rounded-md p-4 border border-neutral-200">
        {!showTable ? (
          children || (
            <div className="w-full space-y-2">
              {data.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{item.label}</span>
                    <span className="font-mono">{item.value} {unit}</span>
                  </div>
                  <div className="w-full h-3 bg-neutral-200 rounded-pill overflow-hidden">
                    <div
                      className="h-full bg-primary-700 rounded-pill"
                      style={{ width: `${Math.min(100, item.value)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <table className="w-full text-xs font-sans text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-300">
                <th className="py-2 font-semibold text-neutral-900">Category</th>
                <th className="py-2 font-semibold text-neutral-900 text-right">Value ({unit})</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="border-b border-neutral-200">
                  <td className="py-2 font-medium text-neutral-900">{item.label}</td>
                  <td className="py-2 font-mono text-neutral-700 text-right">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-neutral-700 border-t border-neutral-100 pt-2 font-mono">
        Methodology: {methodology}
      </p>
    </div>
  );
};

export interface HeatmapWrapperProps {
  title: string;
  legendLabel?: string;
  methodology: string;
  children?: React.ReactNode;
  className?: string;
}

export const HeatmapWrapper: React.FC<HeatmapWrapperProps> = ({
  title,
  legendLabel = 'Density Intensity (Low -> High)',
  methodology,
  children,
  className,
}) => {
  return (
    <div className={cn('p-4 bg-white border border-neutral-200 rounded-lg shadow-subtle font-sans space-y-3', className)}>
      <h4 className="text-base font-semibold text-neutral-900">{title}</h4>

      <div className="min-h-[260px] bg-neutral-100 border border-neutral-200 rounded-md flex items-center justify-center p-4">
        {children || (
          <div className="text-center text-xs text-neutral-700">
            Spatial density canvas surface renders here.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-700 pt-2 border-t border-neutral-100">
        <span className="font-mono">{legendLabel}</span>
        <span className="font-mono">Methodology: {methodology}</span>
      </div>
    </div>
  );
};
