<?php
/**
 * Nova Learn - Database Migration
 * Creates all required tables with proper indexes and foreign keys
 * 
 * Run: php backend/migrations/create_tables.php
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../core/Auth.php';

use Core\Database;
use Core\Auth;

$config = require __DIR__ . '/../config/database.php';

try {
    // Connect without database to create it
    $dsn = "{$config['driver']}:host={$config['host']};port={$config['port']};charset={$config['charset']}";
    $pdo = new PDO($dsn, $config['username'], $config['password'], $config['options']);
    
    $dbName = $config['database'];
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `{$dbName}`");
    
    echo "✅ Database '{$dbName}' ready\n";

    // =============== USERS TABLE ===============
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name_ar VARCHAR(255) NOT NULL,
            name_en VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            username VARCHAR(100) UNIQUE,
            password VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            avatar VARCHAR(500),
            role ENUM('super_admin','admin','instructor','moderator','student') NOT NULL DEFAULT 'student',
            status ENUM('active','inactive','suspended','pending') NOT NULL DEFAULT 'active',
            email_verified_at TIMESTAMP NULL,
            last_login_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_role (role),
            INDEX idx_status (status),
            INDEX idx_email (email)
        ) ENGINE=InnoDB
    ");
    echo "✅ users table created\n";

    // =============== DEPARTMENTS TABLE ===============
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS departments (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name_ar VARCHAR(255) NOT NULL,
            name_en VARCHAR(255) NOT NULL,
            description_ar TEXT,
            description_en TEXT,
            icon VARCHAR(50),
            color VARCHAR(100),
            head_id INT UNSIGNED NULL,
            students_count INT UNSIGNED DEFAULT 0,
            courses_count INT UNSIGNED DEFAULT 0,
            status ENUM('active','inactive') DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (head_id) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB
    ");
    echo "✅ departments table created\n";

    // =============== COURSES TABLE ===============
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS courses (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            department_id INT UNSIGNED NOT NULL,
            instructor_id INT UNSIGNED NOT NULL,
            title_ar VARCHAR(500) NOT NULL,
            title_en VARCHAR(500) NOT NULL,
            description_ar TEXT,
            description_en TEXT,
            thumbnail VARCHAR(500),
            promo_video VARCHAR(500),
            price DECIMAL(10,2) NOT NULL DEFAULT 0,
            discount_price DECIMAL(10,2) NULL,
            currency VARCHAR(10) DEFAULT 'EGP',
            level ENUM('beginner','intermediate','advanced') DEFAULT 'beginner',
            language VARCHAR(10) DEFAULT 'ar',
            total_hours DECIMAL(5,1) DEFAULT 0,
            total_lessons INT UNSIGNED DEFAULT 0,
            total_students INT UNSIGNED DEFAULT 0,
            rating DECIMAL(2,1) DEFAULT 0,
            rating_count INT UNSIGNED DEFAULT 0,
            status ENUM('draft','published','archived','pending_review') DEFAULT 'draft',
            is_featured BOOLEAN DEFAULT FALSE,
            published_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
            FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_dept (department_id),
            INDEX idx_instructor (instructor_id),
            INDEX idx_status (status),
            INDEX idx_level (level),
            FULLTEXT INDEX idx_search (title_ar, title_en, description_ar, description_en)
        ) ENGINE=InnoDB
    ");
    echo "✅ courses table created\n";

    // =============== COURSE SECTIONS TABLE ===============
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS course_sections (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            course_id INT UNSIGNED NOT NULL,
            title_ar VARCHAR(255) NOT NULL,
            title_en VARCHAR(255) NOT NULL,
            sort_order INT UNSIGNED DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
            INDEX idx_course (course_id)
        ) ENGINE=InnoDB
    ");
    echo "✅ course_sections table created\n";

    // =============== LESSONS TABLE ===============
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS lessons (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            section_id INT UNSIGNED NOT NULL,
            course_id INT UNSIGNED NOT NULL,
            title_ar VARCHAR(255) NOT NULL,
            title_en VARCHAR(255) NOT NULL,
            description_ar TEXT,
            description_en TEXT,
            video_url VARCHAR(500),
            video_duration VARCHAR(20),
            type ENUM('video','quiz','assignment','text','live') DEFAULT 'video',
            is_free BOOLEAN DEFAULT FALSE,
            sort_order INT UNSIGNED DEFAULT 0,
            resources JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (section_id) REFERENCES course_sections(id) ON DELETE CASCADE,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
            INDEX idx_section (section_id),
            INDEX idx_course (course_id)
        ) ENGINE=InnoDB
    ");
    echo "✅ lessons table created\n";

    // =============== ENROLLMENTS (PAYMENTS) TABLE ===============
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS enrollments (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNSIGNED NOT NULL,
            course_id INT UNSIGNED NOT NULL,
            payment_method ENUM('credit_card','e_wallet','fawry','free','coupon') NOT NULL,
            amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
            currency VARCHAR(10) DEFAULT 'EGP',
            coupon_code VARCHAR(50),
            transaction_id VARCHAR(255),
            status ENUM('active','expired','refunded','pending') DEFAULT 'active',
            progress DECIMAL(5,2) DEFAULT 0,
            completed_at TIMESTAMP NULL,
            enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
            UNIQUE KEY unique_enrollment (user_id, course_id),
            INDEX idx_user (user_id),
            INDEX idx_course (course_id),
            INDEX idx_status (status)
        ) ENGINE=InnoDB
    ");
    echo "✅ enrollments table created\n";

    // =============== LESSON PROGRESS TABLE ===============
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS lesson_progress (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNSIGNED NOT NULL,
            lesson_id INT UNSIGNED NOT NULL,
            course_id INT UNSIGNED NOT NULL,
            watched_seconds INT UNSIGNED DEFAULT 0,
            is_completed BOOLEAN DEFAULT FALSE,
            completed_at TIMESTAMP NULL,
            last_watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
            UNIQUE KEY unique_progress (user_id, lesson_id)
        ) ENGINE=InnoDB
    ");
    echo "✅ lesson_progress table created\n";

    // =============== CERTIFICATES TABLE ===============
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS certificates (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNSIGNED NOT NULL,
            course_id INT UNSIGNED NOT NULL,
            certificate_number VARCHAR(100) NOT NULL UNIQUE,
            type ENUM('completion','honors','excellence') DEFAULT 'completion',
            grade DECIMAL(5,2),
            issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            pdf_url VARCHAR(500),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
            INDEX idx_user (user_id),
            INDEX idx_cert_number (certificate_number)
        ) ENGINE=InnoDB
    ");
    echo "✅ certificates table created\n";

    // =============== ROLES & PERMISSIONS TABLES ===============
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS roles (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            name_ar VARCHAR(100) NOT NULL,
            name_en VARCHAR(100) NOT NULL,
            color VARCHAR(100),
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB
    ");
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS permissions (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            name_ar VARCHAR(100) NOT NULL,
            name_en VARCHAR(100) NOT NULL,
            category VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_category (category)
        ) ENGINE=InnoDB
    ");
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS role_permissions (
            role_id INT UNSIGNED NOT NULL,
            permission_id INT UNSIGNED NOT NULL,
            PRIMARY KEY (role_id, permission_id),
            FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
            FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
    ");
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_permissions (
            user_id INT UNSIGNED NOT NULL,
            permission_id INT UNSIGNED NOT NULL,
            PRIMARY KEY (user_id, permission_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
    ");
    echo "✅ roles & permissions tables created\n";

    // =============== ANNOUNCEMENTS TABLE ===============
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS announcements (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            title_ar VARCHAR(500) NOT NULL,
            title_en VARCHAR(500) NOT NULL,
            content_ar TEXT NOT NULL,
            content_en TEXT NOT NULL,
            type ENUM('info','warning','urgent','success') DEFAULT 'info',
            target ENUM('all','students','instructors','admins') DEFAULT 'all',
            author_id INT UNSIGNED,
            is_pinned BOOLEAN DEFAULT FALSE,
            status ENUM('active','inactive','scheduled') DEFAULT 'active',
            published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB
    ");
    echo "✅ announcements table created\n";

    // =============== COUPONS TABLE ===============
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS coupons (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            code VARCHAR(50) NOT NULL UNIQUE,
            discount_type ENUM('percentage','fixed') NOT NULL,
            discount_value DECIMAL(10,2) NOT NULL,
            max_uses INT UNSIGNED DEFAULT 0,
            used_count INT UNSIGNED DEFAULT 0,
            min_amount DECIMAL(10,2) DEFAULT 0,
            course_id INT UNSIGNED NULL,
            valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            valid_until TIMESTAMP NULL,
            status ENUM('active','inactive','expired') DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
            INDEX idx_code (code)
        ) ENGINE=InnoDB
    ");
    echo "✅ coupons table created\n";

    // =============== REVIEWS TABLE ===============
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS reviews (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNSIGNED NOT NULL,
            course_id INT UNSIGNED NOT NULL,
            rating TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
            comment TEXT,
            status ENUM('approved','pending','rejected') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
            UNIQUE KEY unique_review (user_id, course_id)
        ) ENGINE=InnoDB
    ");
    echo "✅ reviews table created\n";

    // =============== SETTINGS TABLE ===============
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS settings (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            setting_key VARCHAR(100) NOT NULL UNIQUE,
            setting_value TEXT,
            category VARCHAR(50) DEFAULT 'general',
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB
    ");
    echo "✅ settings table created\n";

    // =============== ACTIVITY LOG TABLE ===============
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS activity_log (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNSIGNED,
            action VARCHAR(100) NOT NULL,
            entity_type VARCHAR(50),
            entity_id INT UNSIGNED,
            details JSON,
            ip_address VARCHAR(45),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
            INDEX idx_user (user_id),
            INDEX idx_action (action),
            INDEX idx_created (created_at)
        ) ENGINE=InnoDB
    ");
    echo "✅ activity_log table created\n";

    // =========================================
    // SEED DEFAULT DATA
    // =========================================

    echo "\n--- Seeding default data ---\n";

    // Super Admin
    $adminPass = Auth::hashPassword('admin123');
    $pdo->exec("
        INSERT IGNORE INTO users (id, name_ar, name_en, email, username, password, role, status)
        VALUES (1, 'مدير النظام', 'System Admin', 'admin@nova.edu', 'admin', '{$adminPass}', 'super_admin', 'active')
    ");
    echo "✅ Super Admin created (admin@nova.edu / admin123)\n";

    // Default Permissions
    $perms = [
        ['create_course', 'إنشاء كورسات', 'Create Courses', 'courses'],
        ['edit_course', 'تعديل الكورسات', 'Edit Courses', 'courses'],
        ['delete_course', 'حذف الكورسات', 'Delete Courses', 'courses'],
        ['publish_course', 'نشر الكورسات', 'Publish Courses', 'courses'],
        ['upload_content', 'رفع المحتوى', 'Upload Content', 'content'],
        ['manage_assignments', 'إدارة الواجبات', 'Manage Assignments', 'content'],
        ['grade_students', 'تقييم الطلاب', 'Grade Students', 'students'],
        ['view_students', 'عرض بيانات الطلاب', 'View Student Data', 'students'],
        ['manage_students', 'إدارة الطلاب', 'Manage Students', 'students'],
        ['issue_certificates', 'إصدار الشهادات', 'Issue Certificates', 'certificates'],
        ['view_analytics', 'عرض التحليلات', 'View Analytics', 'analytics'],
        ['export_reports', 'تصدير التقارير', 'Export Reports', 'analytics'],
        ['manage_users', 'إدارة المستخدمين', 'Manage Users', 'admin'],
        ['manage_settings', 'إدارة الإعدادات', 'Manage Settings', 'admin'],
        ['manage_roles', 'إدارة الأدوار', 'Manage Roles', 'admin'],
        ['view_logs', 'عرض السجلات', 'View Logs', 'admin'],
    ];
    
    $permStmt = $pdo->prepare("INSERT IGNORE INTO permissions (name, name_ar, name_en, category) VALUES (?, ?, ?, ?)");
    foreach ($perms as $p) {
        $permStmt->execute($p);
    }
    echo "✅ " . count($perms) . " permissions seeded\n";

    // Default Roles
    $pdo->exec("INSERT IGNORE INTO roles (id, name, name_ar, name_en, color) VALUES 
        (1, 'super_admin', 'مدير عام', 'Super Admin', 'from-red-500 to-orange-500'),
        (2, 'admin', 'مدير', 'Admin', 'from-purple-500 to-indigo-500'),
        (3, 'instructor', 'مدرّب', 'Instructor', 'from-blue-500 to-cyan-500'),
        (4, 'moderator', 'مشرف', 'Moderator', 'from-emerald-500 to-teal-500')
    ");
    echo "✅ Roles seeded\n";

    // Departments
    $pdo->exec("INSERT IGNORE INTO departments (id, name_ar, name_en, description_ar, description_en, icon, color, students_count, courses_count) VALUES
        (1, 'هندسة الشبكات', 'Network Engineering', 'تعلم بناء وإدارة الشبكات الحديثة', 'Build and manage modern networks', 'Network', 'from-cyan-400 to-blue-600', 3240, 28),
        (2, 'الأمن السيبراني', 'Cyber Security', 'احمِ الأنظمة والشبكات من التهديدات', 'Protect systems from threats', 'Shield', 'from-blue-500 to-indigo-700', 4180, 34),
        (3, 'هندسة البرمجيات', 'Software Engineering', 'اتقن البرمجة وبناء التطبيقات', 'Master coding and build apps', 'Code2', 'from-sky-400 to-cyan-600', 6520, 52),
        (4, 'الذكاء الاصطناعي', 'Artificial Intelligence', 'تعلّم الآلة والشبكات العصبية', 'ML, neural networks & CV', 'BrainCircuit', 'from-purple-500 to-fuchsia-600', 3890, 31),
        (5, 'علوم البيانات', 'Data Science', 'حلل البيانات الضخمة', 'Analyze big data', 'Database', 'from-emerald-400 to-teal-600', 2980, 26),
        (6, 'تصميم UI/UX', 'UI/UX Design', 'صمم تجارب مستخدم رائعة', 'Design beautiful UX', 'Palette', 'from-pink-400 to-rose-600', 2150, 22),
        (7, 'إدارة الأعمال الرقمية', 'Digital Business', 'ريادة الأعمال والتسويق', 'Entrepreneurship & marketing', 'Briefcase', 'from-amber-400 to-orange-600', 1840, 19),
        (8, 'الإعلام الرقمي', 'Digital Media', 'إنتاج الفيديو والمونتاج', 'Video production & editing', 'Video', 'from-violet-400 to-purple-600', 1420, 17)
    ");
    echo "✅ Departments seeded\n";

    // Sample Instructors
    $instPass = Auth::hashPassword('instructor123');
    $pdo->exec("INSERT IGNORE INTO users (id, name_ar, name_en, email, username, password, role, status) VALUES
        (2, 'د. أحمد محمد حسن', 'Dr. Ahmed M. Hassan', 'ahmed.h@nova.edu', 'dr.ahmed', '{$instPass}', 'instructor', 'active'),
        (3, 'د. سارة عبدالرحمن', 'Dr. Sara Abdelrahman', 'sara.a@nova.edu', 'dr.sara', '{$instPass}', 'instructor', 'active'),
        (4, 'م. خالد إبراهيم', 'Eng. Khaled Ibrahim', 'khaled.i@nova.edu', 'eng.khaled', '{$instPass}', 'instructor', 'active'),
        (5, 'د. منال فوزي', 'Dr. Manal Fawzy', 'manal.f@nova.edu', 'dr.manal', '{$instPass}', 'instructor', 'active'),
        (6, 'أ. يوسف سمير', 'Mr. Yousef Samir', 'yousef.s@nova.edu', 'yousef.s', '{$instPass}', 'instructor', 'active'),
        (7, 'د. هالة مصطفى', 'Dr. Hala Mostafa', 'hala.m@nova.edu', 'dr.hala', '{$instPass}', 'instructor', 'active')
    ");
    echo "✅ Instructors seeded\n";

    // Sample Courses
    $pdo->exec("INSERT IGNORE INTO courses (id, department_id, instructor_id, title_ar, title_en, price, discount_price, level, total_hours, total_lessons, total_students, rating, status, is_featured, thumbnail) VALUES
        (1, 1, 2, 'أساسيات شبكات Cisco CCNA', 'Cisco CCNA Fundamentals', 1240, 826, 'beginner', 18, 42, 1240, 4.8, 'published', 1, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600'),
        (2, 1, 2, 'إدارة شبكات المؤسسات', 'Enterprise Network Admin', 890, 593, 'advanced', 22, 36, 890, 4.7, 'published', 0, 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600'),
        (3, 2, 3, 'الأمن السيبراني للمبتدئين', 'Cybersecurity for Beginners', 2150, 1433, 'beginner', 14, 28, 2150, 4.9, 'published', 1, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600'),
        (4, 2, 4, 'اختبار الاختراق Ethical Hacking', 'Ethical Hacking Mastery', 1780, 1186, 'advanced', 30, 55, 1780, 4.9, 'published', 1, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600'),
        (5, 3, 2, 'تطوير الويب الكامل', 'Full Stack Web Development', 3200, 2133, 'intermediate', 45, 68, 3200, 4.9, 'published', 1, 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600'),
        (6, 3, 5, 'Python للذكاء الاصطناعي', 'Python for AI', 2890, 1926, 'intermediate', 35, 50, 2890, 4.8, 'published', 0, 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600')
    ");
    echo "✅ Sample courses seeded\n";

    // Default settings
    $pdo->exec("INSERT IGNORE INTO settings (setting_key, setting_value, category) VALUES
        ('site_name_ar', 'نوفا ليرن', 'general'),
        ('site_name_en', 'Nova Learn', 'general'),
        ('site_email', 'info@nova-learn.edu', 'general'),
        ('maintenance_mode', '0', 'system'),
        ('registration_enabled', '1', 'auth'),
        ('default_language', 'ar', 'general'),
        ('currency', 'EGP', 'payment'),
        ('tax_rate', '14', 'payment')
    ");
    echo "✅ Settings seeded\n";

    echo "\n🎉 Migration completed successfully!\n";

} catch (PDOException $e) {
    echo "❌ Migration error: " . $e->getMessage() . "\n";
    exit(1);
}
