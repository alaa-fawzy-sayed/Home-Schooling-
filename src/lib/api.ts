/**
 * Nova Learn - API Service Layer
 * Connects the React frontend to the PHP backend
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('nova_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('nova_token', token);
      else localStorage.removeItem('nova_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: Record<string, unknown>,
    params?: Record<string, string>
  ): Promise<{ success: boolean; data: T; message: string; pagination?: Pagination }> {
    const url = new URL(`${API_BASE}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = { method, headers };
    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    try {
      const res = await fetch(url.toString(), config);
      const json = await res.json();

      if (!res.ok) {
        throw new ApiError(json.message || 'Request failed', res.status, json.errors);
      }

      return json;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error. Please check your connection.', 0);
    }
  }

  // === AUTH ===
  async register(data: { name_ar: string; name_en: string; email: string; password: string; phone?: string }) {
    const res = await this.request<{ user: User; token: string }>('POST', '/auth/register', data as Record<string, unknown>);
    this.setToken(res.data.token);
    return res.data;
  }

  async login(email: string, password: string) {
    const res = await this.request<{ user: User; token: string }>('POST', '/auth/login', { email, password });
    this.setToken(res.data.token);
    return res.data;
  }

  async adminLogin(email: string, password: string) {
    const res = await this.request<{ user: User; token: string }>('POST', '/auth/admin-login', { email, password });
    this.setToken(res.data.token);
    return res.data;
  }

  async getMe() {
    return (await this.request<User>('GET', '/auth/me')).data;
  }

  logout() {
    this.setToken(null);
    localStorage.removeItem('nova_student');
    localStorage.removeItem('nova_admin_auth');
  }

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    return this.request<null>('POST', '/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
  }

  // === COURSES ===
  async getCourses(params?: { department?: string; level?: string; search?: string; sort?: string; page?: number }) {
    const p: Record<string, string> = {};
    if (params?.department) p.department = params.department;
    if (params?.level) p.level = params.level;
    if (params?.search) p.search = params.search;
    if (params?.sort) p.sort = params.sort;
    if (params?.page) p.page = String(params.page);
    return this.request<Course[]>('GET', '/courses', undefined, p);
  }

  async getCourse(id: number) {
    return (await this.request<CourseDetail>('GET', `/courses/${id}`)).data;
  }

  async getCourseCurriculum(id: number) {
    return (await this.request<CourseCurriculum>('GET', `/courses/${id}/curriculum`)).data;
  }

  // === DEPARTMENTS ===
  async getDepartments() {
    return (await this.request<Department[]>('GET', '/departments')).data;
  }

  async getDepartment(id: number) {
    return (await this.request<DepartmentDetail>('GET', `/departments/${id}`)).data;
  }

  // === ENROLLMENTS / PAYMENT ===
  async enroll(courseId: number, paymentMethod: string, couponCode?: string) {
    return (await this.request<{ enrollment: Enrollment }>('POST', '/enrollments', {
      course_id: courseId,
      payment_method: paymentMethod,
      coupon_code: couponCode,
    })).data;
  }

  async getMyEnrollments() {
    return (await this.request<Enrollment[]>('GET', '/enrollments/my')).data;
  }

  async verifyCoupon(code: string, courseId?: number) {
    return (await this.request<CouponInfo>('POST', '/enrollments/verify-coupon', { code, course_id: courseId })).data;
  }

  // === PROGRESS ===
  async updateProgress(lessonId: number, courseId: number, watchedSeconds: number, isCompleted: boolean) {
    return (await this.request<ProgressResponse>('POST', '/progress', {
      lesson_id: lessonId,
      course_id: courseId,
      watched_seconds: watchedSeconds,
      is_completed: isCompleted,
    })).data;
  }

  async getCourseProgress(courseId: number) {
    return (await this.request<CourseProgress>('GET', `/progress/${courseId}`)).data;
  }

  // === REVIEWS ===
  async getReviews(courseId: number, page = 1) {
    return this.request<Review[]>('GET', `/courses/${courseId}/reviews`, undefined, { page: String(page) });
  }

  async createReview(courseId: number, rating: number, comment: string) {
    return (await this.request<{ review_id: number }>('POST', `/courses/${courseId}/reviews`, { rating, comment })).data;
  }

  // === STUDENT DASHBOARD ===
  async getDashboard() {
    return (await this.request<DashboardData>('GET', '/dashboard')).data;
  }

  async getDashboardGrades() {
    return (await this.request<GradesData>('GET', '/dashboard/grades')).data;
  }

  async getDashboardSchedule() {
    return (await this.request<ScheduleItem[]>('GET', '/dashboard/schedule')).data;
  }

  async getDashboardAchievements() {
    return (await this.request<AchievementsData>('GET', '/dashboard/achievements')).data;
  }

  // === ADMIN ===
  async getAdminStats() {
    return (await this.request<AdminStats>('GET', '/admin/stats')).data;
  }

  async adminCreateCourse(data: Record<string, unknown>) {
    return (await this.request<Course>('POST', '/admin/courses', data)).data;
  }

  async adminUpdateCourse(id: number, data: Record<string, unknown>) {
    return (await this.request<Course>('PUT', `/admin/courses/${id}`, data)).data;
  }

  async adminDeleteCourse(id: number) {
    return this.request<null>('DELETE', `/admin/courses/${id}`);
  }

  async adminGetUsers(params?: { role?: string; status?: string; search?: string; page?: number }) {
    const p: Record<string, string> = {};
    if (params?.role) p.role = params.role;
    if (params?.status) p.status = params.status;
    if (params?.search) p.search = params.search;
    if (params?.page) p.page = String(params.page);
    return this.request<User[]>('GET', '/admin/users', undefined, p);
  }

  async adminCreateUser(data: Record<string, unknown>) {
    return (await this.request<User>('POST', '/admin/users', data)).data;
  }

  async adminUpdateUser(id: number, data: Record<string, unknown>) {
    return (await this.request<User>('PUT', `/admin/users/${id}`, data)).data;
  }

  async adminDeleteUser(id: number) {
    return this.request<null>('DELETE', `/admin/users/${id}`);
  }

  async adminGetPermissions() {
    return (await this.request<PermissionsData>('GET', '/admin/permissions')).data;
  }

  async adminAssignPermissions(data: Record<string, unknown>) {
    return this.request<null>('POST', '/admin/permissions/assign', data);
  }

  async adminGetCertificates(page = 1) {
    return this.request<Certificate[]>('GET', '/admin/certificates', undefined, { page: String(page) });
  }

  async adminIssueCertificate(userId: number, courseId: number, type: string, grade?: number) {
    return (await this.request<Certificate>('POST', '/admin/certificates', { user_id: userId, course_id: courseId, type, grade })).data;
  }

  async adminGetAnnouncements() {
    return (await this.request<Announcement[]>('GET', '/admin/announcements')).data;
  }

  async adminCreateAnnouncement(data: Record<string, unknown>) {
    return (await this.request<Announcement>('POST', '/admin/announcements', data)).data;
  }

  async adminUpdateAnnouncement(id: number, data: Record<string, unknown>) {
    return (await this.request<Announcement>('PUT', `/admin/announcements/${id}`, data)).data;
  }

  async adminDeleteAnnouncement(id: number) {
    return this.request<null>('DELETE', `/admin/announcements/${id}`);
  }

  async adminGetSettings() {
    return (await this.request<Record<string, Record<string, string>>>('GET', '/admin/settings')).data;
  }

  async adminUpdateSettings(data: Record<string, string>) {
    return this.request<null>('PUT', '/admin/settings', data as Record<string, unknown>);
  }

  async adminGetActivityLog(page = 1) {
    return this.request<ActivityLog[]>('GET', '/admin/activity-log', undefined, { page: String(page) });
  }

  // === HEALTH ===
  async healthCheck() {
    return (await this.request<{ status: string; version: string; time: string }>('GET', '/health')).data;
  }
}

// === Error Class ===
export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]> | null;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors || null;
  }
}

// === TypeScript Interfaces ===
export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  has_more: boolean;
}

export interface User {
  id: number;
  name_ar: string;
  name_en: string;
  email: string;
  username?: string;
  phone?: string;
  avatar?: string;
  role: string;
  status: string;
  created_at: string;
  last_login_at?: string;
  permissions?: string[];
}

export interface Course {
  id: number;
  title_ar: string;
  title_en: string;
  thumbnail?: string;
  price: number;
  discount_price?: number;
  level: string;
  total_hours: number;
  total_lessons: number;
  total_students: number;
  rating: number;
  status: string;
  dept_name_ar?: string;
  dept_name_en?: string;
  instructor_name_ar?: string;
  instructor_name_en?: string;
}

export interface CourseDetail extends Course {
  description_ar?: string;
  description_en?: string;
  sections: CourseSection[];
  reviews_summary: ReviewsSummary;
  is_enrolled?: boolean;
  related_courses: Course[];
}

export interface CourseSection {
  id: number;
  title_ar: string;
  title_en: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title_ar: string;
  title_en: string;
  video_url?: string;
  video_duration: string;
  type: string;
  is_free: boolean;
  accessible?: boolean;
}

export interface CourseCurriculum {
  course: { id: number; title_ar: string; title_en: string };
  is_enrolled: boolean;
  sections: CourseSection[];
}

export interface Department {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  icon: string;
  color: string;
  students_count: number;
  courses_count: number;
}

export interface DepartmentDetail extends Department {
  courses: Course[];
  top_instructors: User[];
}

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  payment_method: string;
  amount_paid: number;
  status: string;
  progress: number;
  enrolled_at: string;
  title_ar?: string;
  title_en?: string;
  thumbnail?: string;
  completed_lessons?: number;
  progress_percentage?: number;
}

export interface CouponInfo {
  code: string;
  discount_type: string;
  discount_value: number;
  min_amount: number;
}

export interface ProgressResponse {
  progress: number;
  completed_lessons: number;
  total_lessons: number;
}

export interface CourseProgress {
  enrollment: Enrollment;
  lesson_progress: LessonProgress[];
  total_lessons: number;
  completed_lessons: number;
  percentage: number;
}

export interface LessonProgress {
  id: number;
  lesson_id: number;
  watched_seconds: number;
  is_completed: boolean;
  title_ar: string;
  title_en: string;
}

export interface Review {
  id: number;
  user_id: number;
  rating: number;
  comment: string;
  name_ar: string;
  name_en: string;
  avatar?: string;
  created_at: string;
}

export interface ReviewsSummary {
  total: number;
  avg_rating: number;
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
}

export interface DashboardData {
  user: User;
  stats: DashboardStats;
  enrollments: Enrollment[];
  certificates: Certificate[];
  recent_activity: LessonProgress[];
  announcements: Announcement[];
}

export interface DashboardStats {
  enrolled_courses: number;
  completed_courses: number;
  certificates: number;
  total_watch_hours: number;
  current_streak: number;
  completed_lessons: number;
}

export interface GradesData {
  grades: GradeItem[];
  gpa: number;
  total_credits: number;
  total_courses: number;
}

export interface GradeItem {
  id: number;
  title_ar: string;
  title_en: string;
  credits: number;
  grade?: number;
  grade_letter?: string;
  points?: number;
  progress: number;
}

export interface ScheduleItem {
  id: number;
  title_ar: string;
  title_en: string;
  total_hours: number;
  instructor_name_ar: string;
  instructor_name_en: string;
  progress: number;
}

export interface AchievementsData {
  achievements: Achievement[];
  stats: { completed_courses: number; completed_lessons: number; certificates: number; watch_hours: number };
}

export interface Achievement {
  id: string;
  title_ar: string;
  title_en: string;
  icon: string;
  unlocked: boolean;
}

export interface Certificate {
  id: number;
  user_id: number;
  course_id: number;
  certificate_number: string;
  type: string;
  grade?: number;
  issued_at: string;
  course_title_ar?: string;
  course_title_en?: string;
}

export interface Announcement {
  id: number;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  type: string;
  is_pinned: boolean;
  published_at: string;
}

export interface AdminStats {
  total_students: number;
  total_instructors: number;
  total_courses: number;
  total_revenue: number;
  total_enrollments: number;
  total_certificates: number;
  revenue_by_month: { month: string; revenue: number; enrollments: number }[];
  top_courses: Course[];
  recent_enrollments: Enrollment[];
}

export interface PermissionsData {
  permissions: { id: number; name: string; name_ar: string; name_en: string; category: string }[];
  roles: { id: number; name: string; name_ar: string; name_en: string; color: string; permissions: string[]; users_count: number }[];
  assigned_users: (User & { permissions: string[] })[];
}

export interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  entity_type: string;
  entity_id: number;
  details: string;
  ip_address: string;
  created_at: string;
  name_ar?: string;
  name_en?: string;
}

// Singleton export
export const api = new ApiService();
export default api;
