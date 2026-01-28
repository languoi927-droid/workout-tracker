import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProgressChart({ data, exerciseName }) {
  // 1. Filter and Calculate
  const filtered = data.filter(ex => ex.name === exerciseName);

  // 2. Group by Date (To ensure one dot per day)
  const groupedData = filtered.reduce((acc, ex) => {
    const date = ex.date; // "2026-01-28"
    
    // Find the best set for this specific entry
    const entryBest = ex.sets.reduce((max, set) => {
      const est1RM = set.weight * (1 + set.reps / 30);
      return est1RM > max.val ? { val: est1RM, weight: set.weight, reps: set.reps } : max;
    }, { val: 0, weight: 0, reps: 0 });

    // If we already have an entry for this date, only keep the best one
    if (!acc[date] || entryBest.val > acc[date].strengthScore) {
      acc[date] = {
        dateStr: date,
        displayDate: new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        strengthScore: Math.round(entryBest.val),
        actualWeight: entryBest.weight,
        actualReps: entryBest.reps
      };
    }
    return acc;
  }, {});

  // 3. Sort Chronologically (Left to Right)
  const chartData = Object.values(groupedData).sort((a, b) => 
    a.dateStr.localeCompare(b.dateStr)
  );

  if (chartData.length < 2) {
    return <div className="chart-info">Add data for multiple days to see your trend! 📈</div>;
  }

  return (
    <div className="chart-wrapper" style={{ width: '100%', height: 250, marginTop: '20px' }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="displayDate" // Updated to match your map key!
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 10, fill: '#64748b'}} 
          />
          <YAxis 
            hide={true} 
            domain={['dataMin - 10', 'dataMax + 10']} 
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              fontSize: '12px'
            }}
            // Custom Tooltip to show the user EXACTLY what they lifted
            formatter={(value, name, props) => [
                `${value}kg (Est. Max)`, 
                `Lifts: ${props.payload.actualWeight}kg x ${props.payload.actualReps}`
            ]}
          />
          <Line 
            type="monotone" 
            dataKey="strengthScore" 
            stroke="#6366f1" 
            strokeWidth={4} // Thicker line looks better on mobile
            dot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 8, strokeWidth: 0 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}