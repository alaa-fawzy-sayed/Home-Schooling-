// Admin mock data for the admin panel
export const ADMIN_CREDENTIALS = {
  email: "admin@nova.edu",
  password: "admin123",
};

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "moderator";
  avatar: string;
}

export const adminUser: AdminUser = {
  id: "admin-001",
  name: "Dr. Admin Nova",
  email: "admin@nova.edu",
  role: "super_admin",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin-nova",
};

export interface PlatformStats {
  totalStudents: number;
  totalCourses: number;
  totalProfessors: number;
  totalRevenue: number;
  activeUsers: number;
  completionRate: number;
  newSignups: number;
  liveNow: number;
}

export const platformStats: PlatformStats = {
  totalStudents: 25340,
  totalCourses: 356,
  totalProfessors: 128,
  totalRevenue: 1847500,
  activeUsers: 4280,
  completionRate: 78.5,
  newSignups: 342,
  liveNow: 12,
};

export const monthlyData = [
  { month: "يناير", monthEn: "Jan", students: 1200, revenue: 85000, courses: 12 },
  { month: "فبراير", monthEn: "Feb", students: 1450, revenue: 92000, courses: 15 },
  { month: "مارس", monthEn: "Mar", students: 1800, revenue: 110000, courses: 18 },
  { month: "أبريل", monthEn: "Apr", students: 2100, revenue: 135000, courses: 22 },
  { month: "مايو", monthEn: "May", students: 2400, revenue: 148000, courses: 25 },
  { month: "يونيو", monthEn: "Jun", students: 2850, revenue: 172000, courses: 28 },
  { month: "يوليو", monthEn: "Jul", students: 3200, revenue: 195000, courses: 32 },
  { month: "أغسطس", monthEn: "Aug", students: 2900, revenue: 180000, courses: 30 },
  { month: "سبتمبر", monthEn: "Sep", students: 3400, revenue: 210000, courses: 35 },
  { month: "أكتوبر", monthEn: "Oct", students: 3800, revenue: 235000, courses: 38 },
  { month: "نوفمبر", monthEn: "Nov", students: 4100, revenue: 258000, courses: 42 },
  { month: "ديسمبر", monthEn: "Dec", students: 4500, revenue: 280000, courses: 45 },
];

export const recentActivities = [
  { id: 1, typeAr: "تسجيل جديد", typeEn: "New Signup", descAr: "محمد أحمد انضم لقسم البرمجة", descEn: "Mohamed Ahmed joined Programming", time: "2m", color: "bg-green-500" },
  { id: 2, typeAr: "إتمام كورس", typeEn: "Course Complete", descAr: "سارة حسن أكملت React + TypeScript", descEn: "Sara Hassan completed React + TypeScript", time: "15m", color: "bg-blue-500" },
  { id: 3, typeAr: "دفع جديد", typeEn: "New Payment", descAr: "اشتراك Premium — 500 ج.م", descEn: "Premium subscription — 500 EGP", time: "32m", color: "bg-amber-500" },
  { id: 4, typeAr: "تقييم", typeEn: "New Review", descAr: "تقييم 5 نجوم لكورس الأمن السيبراني", descEn: "5-star review on Cybersecurity course", time: "1h", color: "bg-purple-500" },
  { id: 5, typeAr: "كورس جديد", typeEn: "New Course", descAr: "تم نشر كورس DevOps بنجاح", descEn: "DevOps course published successfully", time: "2h", color: "bg-cyan-500" },
  { id: 6, typeAr: "بلاغ", typeEn: "Report", descAr: "بلاغ محتوى من طالب — قيد المراجعة", descEn: "Content report from student — under review", time: "3h", color: "bg-red-500" },
  { id: 7, typeAr: "ترقية", typeEn: "Upgrade", descAr: "كريم سامي ترقى إلى مشرف قسم", descEn: "Karim Samy promoted to section supervisor", time: "5h", color: "bg-emerald-500" },
  { id: 8, typeAr: "شهادة", typeEn: "Certificate", descAr: "تم إصدار 15 شهادة إتمام جديدة", descEn: "15 new completion certificates issued", time: "6h", color: "bg-indigo-500" },
];

export const topCourses = [
  { name: "Full Stack Web Development", nameAr: "تطوير الويب الكامل", students: 3200, rating: 4.9, revenue: 128000, trend: "+12%" },
  { name: "Python for AI", nameAr: "Python للذكاء الاصطناعي", students: 2890, rating: 4.8, revenue: 115600, trend: "+8%" },
  { name: "Machine Learning from Zero", nameAr: "تعلم الآلة من الصفر", students: 2740, rating: 4.9, revenue: 109600, trend: "+15%" },
  { name: "Cybersecurity for Beginners", nameAr: "الأمن السيبراني للمبتدئين", students: 2150, rating: 4.9, revenue: 86000, trend: "+22%" },
  { name: "React + TypeScript", nameAr: "React + TypeScript", students: 1950, rating: 4.7, revenue: 78000, trend: "+5%" },
];

export const managedStudents = [
  { id: "S001", name: "محمد علي أحمد", nameEn: "Mohamed Ali Ahmed", email: "m.ali@nova.edu", dept: "programming", level: 3, gpa: 3.85, status: "active" as const, joinDate: "2024-09-01" },
  { id: "S002", name: "نورا حسن إبراهيم", nameEn: "Nora Hassan Ibrahim", email: "n.hassan@nova.edu", dept: "security", level: 2, gpa: 3.92, status: "active" as const, joinDate: "2025-01-15" },
  { id: "S003", name: "كريم سامي عبدالله", nameEn: "Karim Samy Abdullah", email: "k.samy@nova.edu", dept: "networks", level: 4, gpa: 3.67, status: "active" as const, joinDate: "2023-09-01" },
  { id: "S004", name: "سلمى أحمد محمود", nameEn: "Salma Ahmed Mahmoud", email: "s.ahmed@nova.edu", dept: "ai", level: 1, gpa: 3.45, status: "active" as const, joinDate: "2025-09-01" },
  { id: "S005", name: "عمر خالد حسين", nameEn: "Omar Khaled Hussein", email: "o.khaled@nova.edu", dept: "data", level: 2, gpa: 3.12, status: "suspended" as const, joinDate: "2025-01-15" },
  { id: "S006", name: "ياسمين فوزي", nameEn: "Yasmin Fawzy", email: "y.fawzy@nova.edu", dept: "design", level: 3, gpa: 3.78, status: "active" as const, joinDate: "2024-01-15" },
  { id: "S007", name: "أحمد طارق", nameEn: "Ahmed Tarek", email: "a.tarek@nova.edu", dept: "business", level: 1, gpa: 2.95, status: "active" as const, joinDate: "2025-09-01" },
  { id: "S008", name: "مريم سعيد", nameEn: "Mariam Said", email: "m.said@nova.edu", dept: "media", level: 2, gpa: 3.55, status: "inactive" as const, joinDate: "2025-01-15" },
  { id: "S009", name: "حسام الدين", nameEn: "Hossam Eldin", email: "h.eldin@nova.edu", dept: "programming", level: 4, gpa: 3.98, status: "active" as const, joinDate: "2023-09-01" },
  { id: "S010", name: "دينا مصطفى", nameEn: "Dina Mostafa", email: "d.mostafa@nova.edu", dept: "ai", level: 3, gpa: 3.72, status: "active" as const, joinDate: "2024-01-15" },
];

export const systemLogs = [
  { id: 1, action: "LOGIN", user: "admin@nova.edu", ip: "192.168.1.100", time: "2026-04-20 16:00:00", status: "success" },
  { id: 2, action: "COURSE_CREATE", user: "admin@nova.edu", ip: "192.168.1.100", time: "2026-04-20 15:45:00", status: "success" },
  { id: 3, action: "USER_BAN", user: "admin@nova.edu", ip: "192.168.1.100", time: "2026-04-20 14:30:00", status: "success" },
  { id: 4, action: "BACKUP", user: "system", ip: "127.0.0.1", time: "2026-04-20 03:00:00", status: "success" },
  { id: 5, action: "LOGIN_FAILED", user: "unknown@test.com", ip: "45.33.12.88", time: "2026-04-20 02:15:00", status: "failed" },
  { id: 6, action: "SETTINGS_UPDATE", user: "admin@nova.edu", ip: "192.168.1.100", time: "2026-04-19 22:00:00", status: "success" },
];

export const deptDistribution = [
  { dept: "البرمجة", deptEn: "Programming", count: 6520, percentage: 25.7 },
  { dept: "الأمن السيبراني", deptEn: "Cyber Security", count: 4180, percentage: 16.5 },
  { dept: "الذكاء الاصطناعي", deptEn: "AI", count: 3890, percentage: 15.3 },
  { dept: "الشبكات", deptEn: "Networks", count: 3240, percentage: 12.8 },
  { dept: "علوم البيانات", deptEn: "Data Science", count: 2980, percentage: 11.8 },
  { dept: "تصميم UI/UX", deptEn: "UI/UX Design", count: 2150, percentage: 8.5 },
  { dept: "إدارة الأعمال", deptEn: "Digital Business", count: 1840, percentage: 7.3 },
  { dept: "الإعلام الرقمي", deptEn: "Digital Media", count: 1420, percentage: 5.6 },
];

// Faculty Members (Professors) data
export interface Professor {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  avatar: string;
  dept: string;
  specialization: string;
  specializationEn: string;
  courses: number;
  students: number;
  rating: number;
  revenue: number;
  status: "active" | "inactive" | "pending";
  joinDate: string;
  permissions: string[];
}

export const professors: Professor[] = [
  { id: "I001", name: "د. أحمد محمد حسن", nameEn: "Dr. Ahmed M. Hassan", email: "ahmed.h@nova.edu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed-h", dept: "programming", specialization: "تطوير الويب", specializationEn: "Web Development", courses: 12, students: 3200, rating: 4.9, revenue: 256000, status: "active", joinDate: "2023-01-15", permissions: ["create_course","edit_course","grade_students","view_analytics","upload_content","manage_assignments"] },
  { id: "I002", name: "د. سارة عبدالرحمن", nameEn: "Dr. Sara Abdelrahman", email: "sara.a@nova.edu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara-a", dept: "ai", specialization: "الذكاء الاصطناعي", specializationEn: "Artificial Intelligence", courses: 8, students: 2890, rating: 4.8, revenue: 231200, status: "active", joinDate: "2023-03-20", permissions: ["create_course","edit_course","grade_students","view_analytics","upload_content","manage_assignments","issue_certificates"] },
  { id: "I003", name: "د. خالد إبراهيم", nameEn: "Dr. Khaled Ibrahim", email: "khaled.i@nova.edu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=khaled-i", dept: "security", specialization: "الأمن السيبراني", specializationEn: "Cybersecurity", courses: 6, students: 2150, rating: 4.9, revenue: 172000, status: "active", joinDate: "2023-06-10", permissions: ["create_course","edit_course","grade_students","upload_content","manage_assignments"] },
  { id: "I004", name: "د. منال فوزي", nameEn: "Dr. Manal Fawzy", email: "manal.f@nova.edu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=manal-f", dept: "data", specialization: "علوم البيانات", specializationEn: "Data Science", courses: 5, students: 1820, rating: 4.7, revenue: 145600, status: "active", joinDate: "2024-01-05", permissions: ["create_course","edit_course","grade_students","view_analytics","upload_content"] },
  { id: "I005", name: "د. يوسف سمير", nameEn: "Dr. Yousef Samir", email: "yousef.s@nova.edu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yousef-s", dept: "design", specialization: "تصميم UI/UX", specializationEn: "UI/UX Design", courses: 4, students: 1350, rating: 4.6, revenue: 108000, status: "active", joinDate: "2024-03-15", permissions: ["create_course","edit_course","grade_students","upload_content"] },
  { id: "I006", name: "د. هالة مصطفى", nameEn: "Dr. Hala Mostafa", email: "hala.m@nova.edu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hala-m", dept: "networks", specialization: "هندسة الشبكات", specializationEn: "Network Engineering", courses: 7, students: 1980, rating: 4.8, revenue: 158400, status: "active", joinDate: "2023-09-01", permissions: ["create_course","edit_course","grade_students","view_analytics","upload_content","manage_assignments"] },
  { id: "I007", name: "د. عمرو علي", nameEn: "Dr. Amr Ali", email: "amr.a@nova.edu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amr-a", dept: "programming", specialization: "تطبيقات الموبايل", specializationEn: "Mobile Development", courses: 3, students: 920, rating: 4.5, revenue: 73600, status: "pending", joinDate: "2025-02-10", permissions: ["create_course","edit_course","upload_content"] },
  { id: "I008", name: "د. ليلى حسين", nameEn: "Dr. Laila Hussein", email: "laila.h@nova.edu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=laila-h", dept: "business", specialization: "إدارة المشاريع", specializationEn: "Project Management", courses: 4, students: 1100, rating: 4.4, revenue: 88000, status: "inactive", joinDate: "2024-06-20", permissions: ["create_course","edit_course","grade_students"] },
];

// Keep old name for backward compatibility
export const instructors = professors;

// Permissions system
export const allPermissions = [
  { id: "create_course", nameAr: "إنشاء كورسات", nameEn: "Create Courses", category: "courses" },
  { id: "edit_course", nameAr: "تعديل الكورسات", nameEn: "Edit Courses", category: "courses" },
  { id: "delete_course", nameAr: "حذف الكورسات", nameEn: "Delete Courses", category: "courses" },
  { id: "publish_course", nameAr: "نشر الكورسات", nameEn: "Publish Courses", category: "courses" },
  { id: "upload_content", nameAr: "رفع المحتوى", nameEn: "Upload Content", category: "content" },
  { id: "manage_assignments", nameAr: "إدارة الواجبات", nameEn: "Manage Assignments", category: "content" },
  { id: "grade_students", nameAr: "تقييم الطلاب", nameEn: "Grade Students", category: "students" },
  { id: "view_students", nameAr: "عرض بيانات الطلاب", nameEn: "View Student Data", category: "students" },
  { id: "manage_students", nameAr: "إدارة الطلاب", nameEn: "Manage Students", category: "students" },
  { id: "issue_certificates", nameAr: "إصدار الشهادات", nameEn: "Issue Certificates", category: "certificates" },
  { id: "view_analytics", nameAr: "عرض التحليلات", nameEn: "View Analytics", category: "analytics" },
  { id: "export_reports", nameAr: "تصدير التقارير", nameEn: "Export Reports", category: "analytics" },
  { id: "manage_users", nameAr: "إدارة المستخدمين", nameEn: "Manage Users", category: "admin" },
  { id: "manage_settings", nameAr: "إدارة الإعدادات", nameEn: "Manage Settings", category: "admin" },
  { id: "manage_roles", nameAr: "إدارة الأدوار", nameEn: "Manage Roles", category: "admin" },
  { id: "view_logs", nameAr: "عرض السجلات", nameEn: "View Logs", category: "admin" },
];

export const roles = [
  { id: "super_admin", nameAr: "مدير عام", nameEn: "Super Admin", color: "from-red-500 to-orange-500", permissions: allPermissions.map(p => p.id), usersCount: 1 },
  { id: "admin", nameAr: "مدير", nameEn: "Admin", color: "from-purple-500 to-indigo-500", permissions: allPermissions.filter(p => p.category !== "admin" || p.id === "view_logs").map(p => p.id), usersCount: 3 },
  { id: "professor", nameAr: "أستاذ جامعي", nameEn: "Professor", color: "from-blue-500 to-cyan-500", permissions: ["create_course","edit_course","upload_content","manage_assignments","grade_students","view_students","issue_certificates","view_analytics"], usersCount: 128 },
  { id: "moderator", nameAr: "مشرف", nameEn: "Moderator", color: "from-emerald-500 to-teal-500", permissions: ["view_students","view_analytics","grade_students"], usersCount: 15 },
];
