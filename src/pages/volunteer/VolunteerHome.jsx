import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { subscribeToOpenNeeds } from "../../services/needsService";
import { subscribeToVolunteerTasks, acceptTask, declineTask, createTask } from "../../services/tasksService";
import { incrementTasksAccepted } from "../../services/volunteersService";
import { matchNeedsToVolunteer } from "../../ai/volunteerMatcher";
import VolunteerBottomNav from "../../components/layout/VolunteerBottomNav";
import TaskCard from "../../components/common/TaskCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Sparkles, ClipboardList } from "lucide-react";

export default function VolunteerHome() {
  const [matchedNeeds, setMatchedNeeds] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("matches");
  const { user, volunteerProfile } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const prevMatchIdsRef = useRef(new Set());
  const isFirstLoadRef = useRef(true);

  // Subscribe to open needs and compute matches
  useEffect(() => {
    if (!volunteerProfile) {
      setLoading(false);
      return;
    }

    const unsub = subscribeToOpenNeeds((needs) => {
      const matches = matchNeedsToVolunteer(volunteerProfile, needs);
      setMatchedNeeds(matches);
      setLoading(false);

      // Notify about NEW nearby needs (not on first load)
      if (!isFirstLoadRef.current) {
        const currentIds = new Set(matches.map((m) => m.need.id));
        const newNeedIds = [...currentIds].filter((id) => !prevMatchIdsRef.current.has(id));

        if (newNeedIds.length > 0) {
          const newMatch = matches.find((m) => m.need.id === newNeedIds[0]);
          if (newMatch) {
            toast.notify(
              `📍 New ${newMatch.need.category} need nearby: "${newMatch.need.description.slice(0, 60)}..." (${newMatch.distance} km away)`
            );
          }
          if (newNeedIds.length > 1) {
            toast.notify(`+${newNeedIds.length - 1} more new needs near you!`);
          }
        }
      }

      prevMatchIdsRef.current = new Set(matches.map((m) => m.need.id));
      isFirstLoadRef.current = false;
    });

    return () => unsub();
  }, [volunteerProfile]);

  // Subscribe to assigned tasks + notify on status changes
  useEffect(() => {
    if (!user) return;
    const prevTaskStatuses = new Map();

    const unsub = subscribeToVolunteerTasks(user.uid, (tasks) => {
      // Check for status changes (task approved/assigned to you)
      tasks.forEach((task) => {
        const prevStatus = prevTaskStatuses.get(task.id);
        if (prevStatus && prevStatus !== task.status) {
          if (task.status === "accepted") {
            toast.success(`✅ Task "${task.needDescription?.slice(0, 40)}..." has been confirmed!`);
          } else if (task.status === "done") {
            toast.success(`🎉 Great job! Task "${task.needDescription?.slice(0, 40)}..." marked as completed!`);
          } else if (task.status === "declined") {
            toast.info(`Task "${task.needDescription?.slice(0, 40)}..." was declined.`);
          }
        }
        prevTaskStatuses.set(task.id, task.status);
      });

      setMyTasks(tasks);
    });

    return () => unsub();
  }, [user]);

  const handleAccept = async (match) => {
    try {
      const taskId = await createTask({
        needId: match.need.id,
        assignedVolunteerId: user.uid,
        matchScore: match.score,
        needDescription: match.need.description,
        needCategory: match.need.category,
        needLocationName: match.need.locationName,
        needLat: match.need.lat,
        needLng: match.need.lng,
        needUrgencyScore: match.need.urgencyScore,
      });
      await acceptTask(taskId);
      await incrementTasksAccepted(user.uid);
      toast.success(`✅ You accepted the ${match.need.category} task at ${match.need.locationName}!`);
      // Remove from matches list
      setMatchedNeeds((prev) => prev.filter((m) => m.need.id !== match.need.id));
    } catch (err) {
      toast.error("Failed to accept task. Please try again.");
      console.error("Accept failed:", err);
    }
  };

  const handleDecline = async (match) => {
    setMatchedNeeds((prev) => prev.filter((m) => m.need.id !== match.need.id));
    toast.info(`Declined ${match.need.category} task at ${match.need.locationName}.`);
  };

  const activeTasks = myTasks.filter((t) => t.status === "accepted");
  const pendingTasks = myTasks.filter((t) => t.status === "pending");

  return (
    <VolunteerBottomNav>
      <div id="volunteer-home">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Dashboard</h1>
        <p className="text-gray-500 mb-6">
          {volunteerProfile
            ? `Welcome back, ${volunteerProfile.name}!`
            : "Loading your profile..."}
        </p>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setTab("matches")}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all
              ${tab === "matches" ? "bg-white shadow-sm text-primary" : "text-gray-500"}`}
          >
            <Sparkles className="w-4 h-4 inline mr-1" />
            Matches ({matchedNeeds.length})
          </button>
          <button
            onClick={() => setTab("tasks")}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all
              ${tab === "tasks" ? "bg-white shadow-sm text-primary" : "text-gray-500"}`}
          >
            <ClipboardList className="w-4 h-4 inline mr-1" />
            My Tasks ({activeTasks.length + pendingTasks.length})
          </button>
        </div>

        {loading ? (
          <LoadingSpinner text="Finding matches for you..." />
        ) : tab === "matches" ? (
          matchedNeeds.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">No matches yet</h3>
              <p className="text-gray-500 text-sm">
                New tasks will appear here based on your skills and location.
                You'll be notified when new needs are posted nearby!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {matchedNeeds.map((match, i) => (
                <div key={match.need.id} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <TaskCard
                    need={match.need}
                    distance={match.distance}
                    matchScore={match.score}
                    onAccept={() => handleAccept(match)}
                    onDecline={() => handleDecline(match)}
                    onClick={() =>
                      navigate(`/volunteer/task/${match.need.id}`, {
                        state: { need: match.need, distance: match.distance },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          )
        ) : (
          (activeTasks.length + pendingTasks.length) === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">No active tasks</h3>
              <p className="text-gray-500 text-sm">Accept a match to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...pendingTasks, ...activeTasks].map((task) => (
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
                  onClick={() =>
                    navigate(`/volunteer/task/${task.id}`, { state: { task } })
                  }
                />
              ))}
            </div>
          )
        )}
      </div>
    </VolunteerBottomNav>
  );
}
