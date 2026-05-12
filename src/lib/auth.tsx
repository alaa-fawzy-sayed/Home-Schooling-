import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";
import type { DeptId } from "./mock-data";
import { courses, subjects } from "./mock-data";

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  dept: DeptId;
  level: 1 | 2 | 3 | 4;
  studentId: string;
  avatar: string;
  joinedAt: string;
  gpa: number;
  credits: number;
  enrolledCourses: number[];
  enrolledSubjects: number[];
  passedSubjects: number[];
  passedCourses: number[];
  password?: string; // ⚠️ WARNING: Storing password in localStorage is NOT secure! For development only!
}

interface AuthContextType {
  user: StudentUser | null;
  signup: (data: Omit<StudentUser, "id" | "studentId" | "avatar" | "joinedAt" | "gpa" | "credits" | "enrolledCourses" | "passedCourses" | "enrolledSubjects" | "passedSubjects"> & { password: string }) => void;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  enrollCourse: (id: number) => boolean;
  unenrollCourse: (id: number) => void;
  registerSubject: (id: number) => boolean;
  unregisterSubject: (id: number) => void;
  updateUser: (patch: Partial<StudentUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = "nova_student";
const ALL_USERS_KEY = "nova_all_users"; // Store all registered users

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StudentUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  const persist = (u: StudentUser | null) => {
    setUser(u);
    if (typeof window === "undefined") return;
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const signup: AuthContextType["signup"] = (data) => {
    // Get all registered users
    const allUsersRaw = typeof window !== "undefined" ? localStorage.getItem(ALL_USERS_KEY) : null;
    let allUsers: StudentUser[] = [];
    
    if (allUsersRaw) {
      try {
        allUsers = JSON.parse(allUsersRaw);
        if (!Array.isArray(allUsers)) allUsers = [];
      } catch {
        allUsers = [];
      }
    }

    console.log('🔍 Checking email:', data.email);
    console.log('📋 All registered users:', allUsers.map(u => u.email));

    // Check if email already exists
    const emailExists = allUsers.some(
      user => user?.email?.toLowerCase() === data.email.toLowerCase()
    );

    console.log('❓ Email exists?', emailExists);

    if (emailExists) {
      console.error('❌ Email already registered!');
      throw new Error("البريد الإلكتروني مسجل مسبقاً");
    }

    console.log('✅ Email is unique, creating account...');

    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const year = new Date().getFullYear();
    const sid = `NOVA-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.email)}`;
    const newUser: StudentUser = {
      ...data,
      id,
      studentId: sid,
      avatar,
      joinedAt: new Date().toISOString(),
      gpa: 0,
      credits: 0,
      enrolledCourses: [],
      passedCourses: [],
      enrolledSubjects: [],
      passedSubjects: [],
      password: data.password, // ⚠️ SECURITY WARNING: Storing plain password!
    };

    // Add to all users list
    allUsers.push(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsers));
    }

    // Set as current user
    persist(newUser);
  };

  const login = (email: string, password?: string) => {
    // Get all registered users
    const allUsersRaw = typeof window !== "undefined" ? localStorage.getItem(ALL_USERS_KEY) : null;
    let allUsers: StudentUser[] = [];
    
    if (allUsersRaw) {
      try {
        allUsers = JSON.parse(allUsersRaw);
        if (!Array.isArray(allUsers)) allUsers = [];
      } catch {
        allUsers = [];
      }
    }

    // Find user by email
    const foundUser = allUsers.find(
      user => user?.email?.toLowerCase() === email.toLowerCase()
    );

    if (!foundUser) {
      // User not found - do NOT create demo account
      return false;
    }

    // Check password if provided
    if (password && foundUser.password && foundUser.password !== password) {
      return false; // Wrong password
    }

    // Login successful
    setUser(foundUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foundUser));
    return true;
  };

  const logout = () => {
    persist(null);
    // Keep all users list, only remove current user
  };

  const enrollCourse = (id: number) => {
    if (!user) return false;
    if (user.enrolledCourses.includes(id)) return true;
    
    const course = courses.find(c => c.id === id);
    if (!course) return false;

    // Check Academic Year limits
    // @ts-ignore - course has academicYear
    const courseYear = course.academicYear || 1;
    if (courseYear > user.level) {
      toast.error(`عذراً، لا يمكنك التسجيل في هذه المادة. مخصصة لطلاب السنة ${courseYear} وأنت في السنة ${user.level}.`, {
        description: "متطلبات المستوى الدراسي غير مكتملة",
        duration: 5000,
      });
      return false;
    }

    // Check Prerequisites
    // @ts-ignore - course has prerequisites
    const prereqs = course.prerequisites || [];
    const missingPrereqs = prereqs.filter((prereqId: number) => !user.passedCourses?.includes(prereqId));
    if (missingPrereqs.length > 0) {
      const missingNames = missingPrereqs.map((pid: number) => courses.find(c => c.id === pid)?.titleAr).join(" و ");
      toast.error("عذراً، يجب عليك اجتياز المواد التالية أولاً:", {
        description: missingNames,
        duration: 5000,
      });
      return false;
    }

    // course.hours in mock-data is total video duration (e.g. 45h). 
    // For university registration, we use 3 credit hours per course.
    const creditHours = 3;
    
    if (user.credits + creditHours > 18) {
      toast.warning("عذراً، لا يمكنك التسجيل. الحد الأقصى للساعات المسموح بها هو 18 ساعة دراسية.", {
        description: "لقد وصلت للحد الأقصى للتسجيل هذا الفصل",
      });
      return false;
    }

    const updated = { ...user, enrolledCourses: [...user.enrolledCourses, id], credits: user.credits + creditHours };
    updateUser(updated);
    return true;
  };

  const unenrollCourse = (id: number) => {
    if (!user) return;
    const creditHours = 3;
    const updated = { ...user, enrolledCourses: user.enrolledCourses.filter((c) => c !== id), credits: Math.max(0, user.credits - creditHours) };
    updateUser(updated);
  };

  const registerSubject = (id: number) => {
    if (!user) return false;
    if (user.enrolledSubjects?.includes(id)) return true;
    
    const subject = subjects.find(s => s.id === id);
    if (!subject) return false;

    // Check Academic Year limits
    if (subject.academicYear > user.level) {
      toast.error(`عذراً، لا يمكنك التسجيل في هذا المقرر. مخصص لطلاب السنة ${subject.academicYear} وأنت في السنة ${user.level}.`, {
        description: "متطلبات المستوى الدراسي غير مكتملة",
      });
      return false;
    }

    // Check Prerequisites
    const prereqs = subject.prerequisites || [];
    const missingPrereqs = prereqs.filter((prereqId: number) => !user.passedSubjects?.includes(prereqId));
    if (missingPrereqs.length > 0) {
      const missingNames = missingPrereqs.map((pid: number) => subjects.find(s => s.id === pid)?.titleAr).join(" و ");
      toast.error("عذراً، يجب عليك اجتياز المقررات التالية أولاً:", {
        description: missingNames,
      });
      return false;
    }

    const creditHours = subject.credits || 3;
    
    if (user.credits + creditHours > 18) {
      toast.warning("عذراً، لا يمكنك التسجيل. الحد الأقصى للساعات المسموح بها هو 18 ساعة معتمدة.");
      return false;
    }

    const updated = { ...user, enrolledSubjects: [...(user.enrolledSubjects || []), id], credits: user.credits + creditHours };
    updateUser(updated);
    return true;
  };

  const unregisterSubject = (id: number) => {
    if (!user) return;
    const subject = subjects.find(s => s.id === id);
    const creditHours = subject?.credits || 3;
    const updated = { ...user, enrolledSubjects: (user.enrolledSubjects || []).filter((s) => s !== id), credits: Math.max(0, user.credits - creditHours) };
    updateUser(updated);
  };

  const updateUser = (patch: Partial<StudentUser>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...patch };
    
    // Update current user
    persist(updatedUser);
    
    // ✅ CRITICAL: Also update in nova_all_users list
    if (typeof window !== "undefined") {
      const allUsersRaw = localStorage.getItem(ALL_USERS_KEY);
      if (allUsersRaw) {
        try {
          let allUsers: StudentUser[] = JSON.parse(allUsersRaw);
          if (!Array.isArray(allUsers)) allUsers = [];
          
          // Find and update the user in the list
          const userIndex = allUsers.findIndex(u => u.id === user.id);
          if (userIndex !== -1) {
            allUsers[userIndex] = updatedUser;
            localStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsers));
            console.log('✅ Updated user in nova_all_users:', updatedUser.email);
          }
        } catch (error) {
          console.error('❌ Failed to update nova_all_users:', error);
        }
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, enrollCourse, unenrollCourse, registerSubject, unregisterSubject, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
