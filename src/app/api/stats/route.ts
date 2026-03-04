import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getRecommendations } from '@/lib/recommendation';

export async function GET() {
    try {
        const { data: predictions, error } = await supabase
            .from('predictions')
            .select('*');

        if (error) {
            console.error('Error fetching stats:', error);
            return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
        }

        if (!predictions || predictions.length === 0) {
            // Return empty stats
            return NextResponse.json({
                totalAnalyzed: 0,
                healthyCount: 0,
                diseasedCount: 0,
                diseaseDistribution: [],
                cropInfection: [],
                averageYieldLossOverTime: []
            });
        }

        let healthyCount = 0;
        let diseasedCount = 0;

        const diseaseCountMap: Record<string, number> = {};
        const cropInfectionMap: Record<string, { total: number; infected: number }> = {};

        // Let's create some timeline data based on created_at
        // But since we might have little data, let's group by crop/disease for yield loss or by date
        const yieldLossByDate: Record<string, { totalLoss: number; count: number }> = {};

        predictions.forEach((p) => {
            const isHealthy = p.severity === 'None' || p.disease.toLowerCase().includes('healthy');

            if (isHealthy) healthyCount++;
            else diseasedCount++;

            // Disease distribution
            const diseaseName = isHealthy ? 'Healthy' : p.disease;
            diseaseCountMap[diseaseName] = (diseaseCountMap[diseaseName] || 0) + 1;

            // Crop-wise infection
            if (!cropInfectionMap[p.crop]) {
                cropInfectionMap[p.crop] = { total: 0, infected: 0 };
            }
            cropInfectionMap[p.crop].total += 1;
            if (!isHealthy) {
                cropInfectionMap[p.crop].infected += 1;
            }

            // Yield loss - extract average number from string like "20-40%"
            const recs = getRecommendations(p.crop, p.disease, p.severity);
            let avgLoss = 0;
            if (recs.estimatedYieldLoss.includes('-')) {
                const parts = recs.estimatedYieldLoss.replace('%', '').split('-');
                avgLoss = (parseInt(parts[0]) + parseInt(parts[1])) / 2;
            } else {
                avgLoss = parseInt(recs.estimatedYieldLoss.replace('%', '')) || 0;
            }

            // Group by date string YYYY-MM-DD
            const dateStr = new Date(p.created_at).toISOString().split('T')[0];
            if (!yieldLossByDate[dateStr]) {
                yieldLossByDate[dateStr] = { totalLoss: 0, count: 0 };
            }
            yieldLossByDate[dateStr].totalLoss += avgLoss;
            yieldLossByDate[dateStr].count += 1;
        });

        // Format for Recharts
        const diseaseDistribution = Object.entries(diseaseCountMap)
            .map(([name, value], index) => {
                const colors = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#ec4899', '#f97316'];
                return { name, value, color: name === 'Healthy' ? '#10b981' : colors[index % colors.length] };
            })
            .sort((a, b) => b.value - a.value);

        const cropInfection = Object.entries(cropInfectionMap)
            .map(([crop, stats]) => ({
                name: crop,
                infected: stats.infected,
                healthy: stats.total - stats.infected,
                total: stats.total
            }));

        const averageYieldLossOverTime = Object.entries(yieldLossByDate)
            .map(([date, stats]) => ({
                date,
                avgLoss: parseFloat((stats.totalLoss / stats.count).toFixed(1))
            }))
            .sort((a, b) => a.date.localeCompare(b.date)); // Sort chronologically

        return NextResponse.json({
            totalAnalyzed: predictions.length,
            healthyCount,
            diseasedCount,
            diseaseDistribution,
            cropInfection,
            averageYieldLossOverTime
        });

    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
