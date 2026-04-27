import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { subscribeToVolunteerTasks, completeTask } from "../../services/tasksService";
import { incrementTasksCompleted } from "../../services/volunteersService";
import { updateNeed } from "../../services/needsService";
import { useNavigate } from "react-router-dom";
import VolunteerBottomNav from "../../components/layout/VolunteerBottomNav";
import TaskCard from "../../components/common/TaskCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { ClipboardList } from "lucide-react";

export default function VolunteerTasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToVolunteerTasks(user.uid, (data) => {
      setTasks(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const handleComplete = async (task) => {
    try {
      await completeTask(task.id);
      await incrementTasksCompleted(user.uid);
      if (task.needId) await updateNeed(task.needId, { status: "resolved" });
    } catch (err) {
      console.error(err);
    }
  };

  const activeTasks = tasks.filter((t) => t.status === "accepted");
  const doneTasks = tasks.filter((t) => t.status === "done");

  return (
    <VolunteerBottomNav>
      <div id="volunteer-tasks-page" style={{ animation: "fadeUp 0.35s ease-out" }}>
        <h1 style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 28,
          color: "#1A1A2E", marginBottom: 24,
        }}>
          My Tasks 📋
        </h1>

        {loading ? (
          <LoadingSpinner text="Loading tasks..." />
        ) : tasks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <ClipboardList size={48} color="#D1D5DB" style={{ margin: "0 auto 12px" }} />
            <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 18, color: "#1A1A2E", marginBottom: 4 }}>
              No tasks yet
            </h3>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: "#6B7280" }}>
              Accept matches from the Home tab
            </p>
          </div>
        ) : (
          <>
            {activeTasks.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h2 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
                  fontSize: 12, color: "#6B7280", textTransform: "uppercase",
                  letterSpacing: "0.08em", marginBottom: 12,
                }}>
                  ACTIVE ({activeTasks.length})
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {activeTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      need={{
                        id: task.needId,
                        description: task.needDescription,
                        category: task.needCategory,
                        locationName: task.needLocationName,
                        urgencyScore: task.needUrgencyScore,
                      }}
                      taskStatus={task.status}
                      onComplete={() => handleComplete(task)}
                      onClick={() =>
                        navigate(`/volunteer/task/${task.id}`, { state: { task } })
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {doneTasks.length > 0 && (
              <div>
                <h2 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
                  fontSize: 12, color: "#6B7280", textTransform: "uppercase",
                  letterSpacing: "0.08em", marginBottom: 12,
                }}>
                  COMPLETED ({doneTasks.length})
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, opacity: 0.7 }}>
                  {doneTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      need={{
                        id: task.needId,
                        description: task.needDescription,
                        category: task.needCategory,
                        locationName: task.needLocationName,
                        urgencyScore: task.needUrgencyScore,
                      }}
                      taskStatus="done"
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </VolunteerBottomNav>
  );
}
