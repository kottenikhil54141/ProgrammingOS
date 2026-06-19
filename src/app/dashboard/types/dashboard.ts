export interface DailyMission {
  id: string;
  label: string;
  completed: boolean;
  xpReward: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  history: { date: string; completed: boolean }[];
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  icon: string;
  xpReward: number;
}

export interface LearningGoal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  type: "daily" | "weekly" | "monthly" | "yearly";
}

export interface RecentProject {
  id: string;
  name: string;
  status: "idle" | "in-progress" | "completed";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tech: string[];
  progress: number; // 0 to 100
}

export interface SavedNote {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  updatedAt: string;
}

export interface BookmarkedConcept {
  id: string;
  title: string;
  track: "python" | "javascript" | "both";
  url: string;
}

export interface InterviewTopic {
  id: string;
  category: "dsa" | "system-design" | "behavioral";
  title: string;
  status: "todo" | "reviewing" | "completed";
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface DashboardNotification {
  id: string;
  title: string;
  body: string;
  type: "info" | "success" | "warning" | "alert";
  read: boolean;
  createdAt: string;
}
