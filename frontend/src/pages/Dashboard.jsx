import { useEffect, useState } from "react";

import {
    BookOpen,
    Layers,
    ListTree,
    ClipboardList,
    CheckCircle2,
    Circle,
    Clock,
    Timer
} from "lucide-react";

import {
    getDashboardSummary,
    getDailyAnalytics,
    getSubjectProgress,
    getStudyStreak,
    getWeeklyAnalytics
} from "../api/dashboard";

import DailyStudyChart from "../components/charts/DailyStudyChart";
import SubjectDistributionChart from "../components/charts/SubjectDistributionChart";
import CalendarHeatmap from "../components/CalendarHeatmap";
import TaskCompletionChart from "../components/TaskCompletionChart";
import StreakCard from "../components/StreakCard";
import StatCard from "../components/StatCard";
import DashboardMessage from "../components/DashboardMessage";
import WeeklyStudyCard from "../components/WeeklyStudyCard";

import {
    SkeletonStatGrid,
    SkeletonChartCard,
    SkeletonListCard
} from "../components/Skeleton";

function formatStudyTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
}

function Dashboard() {

    const [summary, setSummary] = useState({
        subjects: 0,
        topics: 0,
        sub_topics: 0,
        total_tasks: 0,
        completed_tasks: 0,
        pending_tasks: 0,
        total_sessions: 0,
        total_minutes: 0
    });

    const [dailyData, setDailyData] = useState([]);
    const [subjectData, setSubjectData] = useState([]);

    const [streak, setStreak] = useState({
        current_streak: 0,
        longest_streak: 0,
        last_studied: null
    });

    const [weeklyData, setWeeklyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            await Promise.all([
                loadDashboard(),
                loadDailyAnalytics(),
                loadSubjectProgress(),
                loadStreak(),
                loadWeeklyAnalytics()
            ]);

        } catch (error) {
            console.log(error);
            setError("Unable to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    const loadDashboard = async () => {
        const response = await getDashboardSummary();
        setSummary(response.data);
    };

    const loadDailyAnalytics = async () => {
        const response = await getDailyAnalytics();
        setDailyData(response.data);
    };

    const loadSubjectProgress = async () => {
        const response = await getSubjectProgress();
        setSubjectData(response.data);
    };

    const loadStreak = async () => {
        const response = await getStudyStreak();
        setStreak(response.data);
    };

    const loadWeeklyAnalytics = async () => {
        const response = await getWeeklyAnalytics();
        setWeeklyData(response.data);
    };

    if (loading) {
        return (
            <div>
                <h1 className="page-title">Dashboard</h1>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <SkeletonStatGrid count={8} />
                    <div className="grid-2col">
                        <SkeletonChartCard height={260} />
                        <SkeletonChartCard height={260} />
                    </div>
                    <SkeletonListCard rows={3} />
                </div>
            </div>
        );
    }

    if (error) {
        return <DashboardMessage message={error} />;
    }

    return (
        <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Your study activity at a glance.</p>

            {/* Compact stat strip */}
            <div className="grid grid-stats">
                <StatCard title="Subjects" value={summary.subjects} icon={BookOpen} />
                <StatCard title="Topics" value={summary.topics} icon={Layers} />
                <StatCard title="Sub Topics" value={summary.sub_topics} icon={ListTree} />
                <StatCard title="Total Tasks" value={summary.total_tasks} icon={ClipboardList} />
                <StatCard title="Completed" value={summary.completed_tasks} icon={CheckCircle2} accent />
                <StatCard title="Pending" value={summary.pending_tasks} icon={Circle} />
                <StatCard title="Sessions" value={summary.total_sessions} icon={Clock} />
                <StatCard title="Study Time" value={formatStudyTime(summary.total_minutes)} icon={Timer} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>

                {/* Charts side by side on desktop, stacked on mobile */}
                <div className="grid-2col">
                    {dailyData.length > 0 ? (
                        <DailyStudyChart data={dailyData} />
                    ) : (
                        <DashboardMessage message="No study sessions available yet" />
                    )}

                    {subjectData.length > 0 ? (
                        <SubjectDistributionChart data={subjectData} />
                    ) : (
                        <DashboardMessage message="No subject study data available yet" />
                    )}
                </div>

                {/* Heatmap needs the full width to breathe */}
                {dailyData.length > 0 && (
                    <CalendarHeatmap data={dailyData} />
                )}

                {/* Secondary glanceable cards */}
                <div className="grid-auto-260">
                    <TaskCompletionChart
                        completed={summary.completed_tasks}
                        pending={summary.pending_tasks}
                    />

                    <StreakCard data={streak} />

                    {weeklyData && <WeeklyStudyCard data={weeklyData} />}
                </div>

            </div>
        </div>
    );
}

export default Dashboard;
