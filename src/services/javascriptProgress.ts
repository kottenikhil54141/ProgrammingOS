/* ─── JavaScript Progress & Gamification Storage Manager ──────────────── */

export interface JavaScriptProgress {
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

const STORAGE_KEY = "programmingos_javascript_progress";

const DEFAULT_PROGRESS: JavaScriptProgress = {
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

export const JavaScriptProgressService = {
  getProgress(): JavaScriptProgress {
    if (typeof window === "undefined") return DEFAULT_PROGRESS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROGRESS));
        return DEFAULT_PROGRESS;
      }
      return JSON.parse(data) as JavaScriptProgress;
    } catch {
      return DEFAULT_PROGRESS;
    }
  },

  saveProgress(progress: JavaScriptProgress): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("Failed to write JS progress to local storage:", error);
    }
  },

  completeTopic(topicId: string, xpReward: number, coinReward: number): JavaScriptProgress {
    const progress = this.getProgress();
    if (!progress.completedTopics.includes(topicId)) {
      progress.completedTopics.push(topicId);
      progress.xp += xpReward;
      progress.coins += coinReward;

      // Update streak
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

      // Check level-up
      const calculatedLevel = Math.floor(progress.xp / 500) + 1;
      if (calculatedLevel > progress.level) {
        progress.level = calculatedLevel;
        progress.unlockedBadges.push(`JS Level ${calculatedLevel} Expert`);
      }

      // Trigger achievement unlocks
      if (progress.completedTopics.length === 1 && !progress.achievements.includes("ach_js_first")) {
        progress.achievements.push("ach_js_first");
        progress.unlockedBadges.push("First Closure Broken");
        progress.coins += 20;
      }

      if (progress.completedTopics.length === 3 && !progress.achievements.includes("ach_js_async")) {
        progress.achievements.push("ach_js_async");
        progress.unlockedBadges.push("Event Loop Master");
        progress.coins += 50;
      }

      this.saveProgress(progress);
    }
    return progress;
  },

  saveTopicCode(topicId: string, code: string): JavaScriptProgress {
    const progress = this.getProgress();
    progress.savedCodes[topicId] = code;
    this.saveProgress(progress);
    return progress;
  },

  getTopicCode(topicId: string, defaultCode: string): string {
    const progress = this.getProgress();
    return progress.savedCodes[topicId] || defaultCode;
  },

  addNote(topicId: string, note: string): JavaScriptProgress {
    const progress = this.getProgress();
    progress.notes[topicId] = note;
    this.saveProgress(progress);
    return progress;
  },

  toggleBookmark(topicId: string): JavaScriptProgress {
    const progress = this.getProgress();
    const index = progress.bookmarks.indexOf(topicId);
    if (index === -1) {
      progress.bookmarks.push(topicId);
    } else {
      progress.bookmarks.splice(index, 1);
    }
    this.saveProgress(progress);
    return progress;
  }
};
