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
      <div id="volunteer-tasks-page">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Tasks</h1>

        {loading ? (
          <LoadingSpinner text="Loading tasks..." />
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">No tasks yet</h3>
            <p className="text-gray-500 text-sm">Accept matches from the Home tab</p>
          </div>
        ) : (
          <>
            {activeTasks.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Active ({activeTasks.length})
                </h2>
                <div className="space-y-3">
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
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Completed ({doneTasks.length})
                </h2>
                <div className="space-y-3 opacity-60">
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
