/* ─── Python Progress & Gamification Storage Manager ────────────────── */

export interface PythonProgress {
  completedTopics: string[];
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastActiveDate: string | null;
  achievements: string[];
  bookmarks: string[];
  notes: Record<string, string>; // topicId -> noteText
  savedCodes: Record<string, string>; // topicId -> codeText
  unlockedBadges: string[];
}

const STORAGE_KEY = "programmingos_python_progress";

const DEFAULT_PROGRESS: PythonProgress = {
  completedTopics: [],
  xp: 0,
  level: 1,
  coins: 0,
  streak: 0,
  lastActiveDate: null,
  achievements: [],
  bookmarks: [],
  notes: {},
  savedCodes: {},
  unlockedBadges: [],
};

export const PythonProgressService = {
  getProgress(): PythonProgress {
    if (typeof window === "undefined") return DEFAULT_PROGRESS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROGRESS));
        return DEFAULT_PROGRESS;
      }
      return JSON.parse(data) as PythonProgress;
    } catch {
      return DEFAULT_PROGRESS;
    }
  },

  saveProgress(progress: PythonProgress): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("Failed to write progress to local storage:", error);
    }
  },

  completeTopic(topicId: string, xpReward: number, coinReward: number): PythonProgress {
    const progress = this.getProgress();
    if (!progress.completedTopics.includes(topicId)) {
      progress.completedTopics.push(topicId);
      progress.xp += xpReward;
      progress.coins += coinReward;

      // Update active streak
      const today = new Date().toDateString();
      if (progress.lastActiveDate !== today) {
        if (progress.lastActiveDate) {
          const lastDate = new Date(progress.lastActiveDate);
          const diffTime = Math.abs(new Date(today).getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            progress.streak += 1;
          } else if (diffDays > 1) {
            progress.streak = 1;
          }
        } else {
          progress.streak = 1;
        }
        progress.lastActiveDate = today;
      }

      // Check level up (e.g. 500 XP per level)
      const calculatedLevel = Math.floor(progress.xp / 500) + 1;
      if (calculatedLevel > progress.level) {
        progress.level = calculatedLevel;
        progress.unlockedBadges.push(`Level ${calculatedLevel} Expert`);
      }

      // Trigger achievement unlocks
      if (progress.completedTopics.length === 1 && !progress.achievements.includes("ach_first")) {
        progress.achievements.push("ach_first");
        progress.unlockedBadges.push("First Script Unlocked");
        progress.coins += 20;
      }

      if (progress.completedTopics.length === 3 && !progress.achievements.includes("ach_poly")) {
        progress.achievements.push("ach_poly");
        progress.unlockedBadges.push("Polymath coder");
        progress.coins += 50;
      }

      this.saveProgress(progress);
    }
    return progress;
  },

  saveTopicCode(topicId: string, code: string): PythonProgress {
    const progress = this.getProgress();
    progress.savedCodes[topicId] = code;
    this.saveProgress(progress);
    return progress;
  },

  getTopicCode(topicId: string, defaultCode: string): string {
    const progress = this.getProgress();
    return progress.savedCodes[topicId] || defaultCode;
  },

  addNote(topicId: string, note: string): PythonProgress {
    const progress = this.getProgress();
    progress.notes[topicId] = note;
    this.saveProgress(progress);
    return progress;
  },

  toggleBookmark(topicId: string): PythonProgress {
    const progress = this.getProgress();
    const index = progress.bookmarks.indexOf(topicId);
    if (index === -1) {
      progress.bookmarks.push(topicId);
    } else {
      progress.bookmarks.splice(index, 1);
    }
    this.saveProgress(progress);
    return progress;
  },

  claimDailyMissions(): { progress: PythonProgress; rewardCoins: number } {
    const progress = this.getProgress();
    const rewardCoins = 15;
    progress.coins += rewardCoins;
    this.saveProgress(progress);
    return { progress, rewardCoins };
  }
};
