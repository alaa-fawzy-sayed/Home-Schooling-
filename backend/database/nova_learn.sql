-- =====================================================
-- Nova Learn - Complete MySQL Database
-- Import this file directly in phpMyAdmin (XAMPP)
-- =====================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+02:00";
SET NAMES utf8mb4;

-- =====================================================
-- CREATE DATABASE
-- =====================================================
CREATE DATABASE IF NOT EXISTS `nova_learn` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `nova_learn`;

-- =====================================================
-- TABLE: users
-- =====================================================
DROP TABLE IF EXISTS `activity_log`;
DROP TABLE IF EXISTS `user_permissions`;
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `lesson_progress`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `certificates`;
DROP TABLE IF EXISTS `enrollments`;
DROP TABLE IF EXISTS `lessons`;
DROP TABLE IF EXISTS `course_sections`;
DROP TABLE IF EXISTS `coupons`;
DROP TABLE IF EXISTS `courses`;
DROP TABLE IF EXISTS `announcements`;
DROP TABLE IF EXISTS `departments`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `settings`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name_ar` VARCHAR(255) NOT NULL,
  `name_en` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `username` VARCHAR(100) DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `avatar` VARCHAR(500) DEFAULT NULL,
  `role` ENUM('super_admin','admin','instructor','moderator','student') NOT NULL DEFAULT 'student',
  `status` ENUM('active','inactive','suspended','pending') NOT NULL DEFAULT 'active',
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `last_login_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_username` (`username`),
  INDEX `idx_role` (`role`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: departments
-- =====================================================
CREATE TABLE `departments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name_ar` VARCHAR(255) NOT NULL,
  `name_en` VARCHAR(255) NOT NULL,
  `description_ar` TEXT DEFAULT NULL,
  `description_en` TEXT DEFAULT NULL,
  `icon` VARCHAR(50) DEFAULT 'BookOpen',
  `color` VARCHAR(100) DEFAULT 'from-blue-400 to-cyan-600',
  `head_id` INT UNSIGNED DEFAULT NULL,
  `students_count` INT UNSIGNED DEFAULT 0,
  `courses_count` INT UNSIGNED DEFAULT 0,
  `status` ENUM('active','inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_dept_head` FOREIGN KEY (`head_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: courses
-- =====================================================
CREATE TABLE `courses` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `department_id` INT UNSIGNED NOT NULL,
  `instructor_id` INT UNSIGNED NOT NULL,
  `title_ar` VARCHAR(500) NOT NULL,
  `title_en` VARCHAR(500) NOT NULL,
  `description_ar` TEXT DEFAULT NULL,
  `description_en` TEXT DEFAULT NULL,
  `thumbnail` VARCHAR(500) DEFAULT NULL,
  `promo_video` VARCHAR(500) DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `discount_price` DECIMAL(10,2) DEFAULT NULL,
  `currency` VARCHAR(10) DEFAULT 'EGP',
  `level` ENUM('beginner','intermediate','advanced') DEFAULT 'beginner',
  `language` VARCHAR(10) DEFAULT 'ar',
  `total_hours` DECIMAL(5,1) DEFAULT 0.0,
  `total_lessons` INT UNSIGNED DEFAULT 0,
  `total_students` INT UNSIGNED DEFAULT 0,
  `rating` DECIMAL(2,1) DEFAULT 0.0,
  `rating_count` INT UNSIGNED DEFAULT 0,
  `status` ENUM('draft','published','archived','pending_review') DEFAULT 'draft',
  `is_featured` TINYINT(1) DEFAULT 0,
  `published_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_course_dept` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_course_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_dept` (`department_id`),
  INDEX `idx_instructor` (`instructor_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_level` (`level`),
  INDEX `idx_featured` (`is_featured`),
  FULLTEXT INDEX `idx_search` (`title_ar`, `title_en`, `description_ar`, `description_en`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: course_sections
-- =====================================================
CREATE TABLE `course_sections` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `course_id` INT UNSIGNED NOT NULL,
  `title_ar` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NOT NULL,
  `sort_order` INT UNSIGNED DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_section_course` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
  INDEX `idx_course` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: lessons
-- =====================================================
CREATE TABLE `lessons` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `section_id` INT UNSIGNED NOT NULL,
  `course_id` INT UNSIGNED NOT NULL,
  `title_ar` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NOT NULL,
  `description_ar` TEXT DEFAULT NULL,
  `description_en` TEXT DEFAULT NULL,
  `video_url` VARCHAR(500) DEFAULT NULL,
  `video_duration` VARCHAR(20) DEFAULT NULL,
  `type` ENUM('video','quiz','assignment','text','live') DEFAULT 'video',
  `is_free` TINYINT(1) DEFAULT 0,
  `sort_order` INT UNSIGNED DEFAULT 0,
  `resources` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_lesson_section` FOREIGN KEY (`section_id`) REFERENCES `course_sections`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_lesson_course` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
  INDEX `idx_section` (`section_id`),
  INDEX `idx_course` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: enrollments
-- =====================================================
CREATE TABLE `enrollments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `course_id` INT UNSIGNED NOT NULL,
  `payment_method` ENUM('credit_card','e_wallet','fawry','free','coupon') NOT NULL,
  `amount_paid` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(10) DEFAULT 'EGP',
  `coupon_code` VARCHAR(50) DEFAULT NULL,
  `transaction_id` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('active','expired','refunded','pending') DEFAULT 'active',
  `progress` DECIMAL(5,2) DEFAULT 0.00,
  `completed_at` TIMESTAMP NULL DEFAULT NULL,
  `enrolled_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_enroll_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_enroll_course` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_enrollment` (`user_id`, `course_id`),
  INDEX `idx_user` (`user_id`),
  INDEX `idx_course` (`course_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: lesson_progress
-- =====================================================
CREATE TABLE `lesson_progress` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `lesson_id` INT UNSIGNED NOT NULL,
  `course_id` INT UNSIGNED NOT NULL,
  `watched_seconds` INT UNSIGNED DEFAULT 0,
  `is_completed` TINYINT(1) DEFAULT 0,
  `completed_at` TIMESTAMP NULL DEFAULT NULL,
  `last_watched_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_progress_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_progress_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_progress_course` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_progress` (`user_id`, `lesson_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: certificates
-- =====================================================
CREATE TABLE `certificates` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `course_id` INT UNSIGNED NOT NULL,
  `certificate_number` VARCHAR(100) NOT NULL,
  `type` ENUM('completion','honors','excellence') DEFAULT 'completion',
  `grade` DECIMAL(5,2) DEFAULT NULL,
  `issued_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `pdf_url` VARCHAR(500) DEFAULT NULL,
  CONSTRAINT `fk_cert_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cert_course` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_cert_number` (`certificate_number`),
  INDEX `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: roles
-- =====================================================
CREATE TABLE `roles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `name_ar` VARCHAR(100) NOT NULL,
  `name_en` VARCHAR(100) NOT NULL,
  `color` VARCHAR(100) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: permissions
-- =====================================================
CREATE TABLE `permissions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `name_ar` VARCHAR(100) NOT NULL,
  `name_en` VARCHAR(100) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_name` (`name`),
  INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: role_permissions
-- =====================================================
CREATE TABLE `role_permissions` (
  `role_id` INT UNSIGNED NOT NULL,
  `permission_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rp_perm` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: user_permissions
-- =====================================================
CREATE TABLE `user_permissions` (
  `user_id` INT UNSIGNED NOT NULL,
  `permission_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`, `permission_id`),
  CONSTRAINT `fk_up_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_up_perm` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: announcements
-- =====================================================
CREATE TABLE `announcements` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title_ar` VARCHAR(500) NOT NULL,
  `title_en` VARCHAR(500) NOT NULL,
  `content_ar` TEXT NOT NULL,
  `content_en` TEXT NOT NULL,
  `type` ENUM('info','warning','urgent','success') DEFAULT 'info',
  `target` ENUM('all','students','instructors','admins') DEFAULT 'all',
  `author_id` INT UNSIGNED DEFAULT NULL,
  `is_pinned` TINYINT(1) DEFAULT 0,
  `status` ENUM('active','inactive','scheduled') DEFAULT 'active',
  `published_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `expires_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_announce_author` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: coupons
-- =====================================================
CREATE TABLE `coupons` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL,
  `discount_type` ENUM('percentage','fixed') NOT NULL,
  `discount_value` DECIMAL(10,2) NOT NULL,
  `max_uses` INT UNSIGNED DEFAULT 0,
  `used_count` INT UNSIGNED DEFAULT 0,
  `min_amount` DECIMAL(10,2) DEFAULT 0.00,
  `course_id` INT UNSIGNED DEFAULT NULL,
  `valid_from` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `valid_until` TIMESTAMP NULL DEFAULT NULL,
  `status` ENUM('active','inactive','expired') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_coupon_course` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE SET NULL,
  UNIQUE KEY `uk_code` (`code`),
  INDEX `idx_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: reviews
-- =====================================================
CREATE TABLE `reviews` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `course_id` INT UNSIGNED NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL,
  `comment` TEXT DEFAULT NULL,
  `status` ENUM('approved','pending','rejected') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_course` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_review` (`user_id`, `course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: settings
-- =====================================================
CREATE TABLE `settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL,
  `setting_value` TEXT DEFAULT NULL,
  `category` VARCHAR(50) DEFAULT 'general',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: activity_log
-- =====================================================
CREATE TABLE `activity_log` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(50) DEFAULT NULL,
  `entity_id` INT UNSIGNED DEFAULT NULL,
  `details` JSON DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_log_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_user` (`user_id`),
  INDEX `idx_action` (`action`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- =====================================================
--                    SEED DATA
-- =====================================================
-- =====================================================

-- =====================================================
-- USERS (Super Admin + 6 Instructors + 5 Students)
-- Password: admin123 => $2y$12$LJ3m4yPnI8rOKijpmO8dBe5HSjYjb7YzQLqR6TnxJxfCsZtGMmDHK
-- Password: instructor123 => $2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- Password: student123 => $2y$12$wAPobq9xKm7x5eFDamBu0OrvGjAzKTFHp3Xq2G.N/tHF0CxdWuH7q
-- =====================================================

INSERT INTO `users` (`id`, `name_ar`, `name_en`, `email`, `username`, `password`, `phone`, `avatar`, `role`, `status`) VALUES
(1, 'مدير النظام', 'System Admin', 'admin@nova.edu', 'admin', '$2y$12$LJ3m4yPnI8rOKijpmO8dBe5HSjYjb7YzQLqR6TnxJxfCsZtGMmDHK', '+201000000001', NULL, 'super_admin', 'active'),
(2, 'د. أحمد محمد حسن', 'Dr. Ahmed M. Hassan', 'ahmed.h@nova.edu', 'dr.ahmed', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+201000000002', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed', 'instructor', 'active'),
(3, 'د. سارة عبدالرحمن', 'Dr. Sara Abdelrahman', 'sara.a@nova.edu', 'dr.sara', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+201000000003', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara', 'instructor', 'active'),
(4, 'م. خالد إبراهيم', 'Eng. Khaled Ibrahim', 'khaled.i@nova.edu', 'eng.khaled', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+201000000004', 'https://api.dicebear.com/7.x/avataaars/svg?seed=khaled', 'instructor', 'active'),
(5, 'د. منال فوزي', 'Dr. Manal Fawzy', 'manal.f@nova.edu', 'dr.manal', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+201000000005', 'https://api.dicebear.com/7.x/avataaars/svg?seed=manal', 'instructor', 'active'),
(6, 'أ. يوسف سمير', 'Mr. Yousef Samir', 'yousef.s@nova.edu', 'yousef.s', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+201000000006', 'https://api.dicebear.com/7.x/avataaars/svg?seed=yousef', 'instructor', 'active'),
(7, 'د. هالة مصطفى', 'Dr. Hala Mostafa', 'hala.m@nova.edu', 'dr.hala', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+201000000007', 'https://api.dicebear.com/7.x/avataaars/svg?seed=hala', 'instructor', 'active'),
(8, 'محمد أحمد علي', 'Mohamed Ahmed Ali', 'mohamed.a@nova.edu', 'mohamed.a', '$2y$12$wAPobq9xKm7x5eFDamBu0OrvGjAzKTFHp3Xq2G.N/tHF0CxdWuH7q', '+201100000001', 'https://api.dicebear.com/7.x/avataaars/svg?seed=mohamed', 'student', 'active'),
(9, 'فاطمة محمود حسين', 'Fatma Mahmoud Hussein', 'fatma.m@nova.edu', 'fatma.m', '$2y$12$wAPobq9xKm7x5eFDamBu0OrvGjAzKTFHp3Xq2G.N/tHF0CxdWuH7q', '+201100000002', 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatma', 'student', 'active'),
(10, 'عمر حسن إبراهيم', 'Omar Hassan Ibrahim', 'omar.h@nova.edu', 'omar.h', '$2y$12$wAPobq9xKm7x5eFDamBu0OrvGjAzKTFHp3Xq2G.N/tHF0CxdWuH7q', '+201100000003', 'https://api.dicebear.com/7.x/avataaars/svg?seed=omar', 'student', 'active'),
(11, 'نور الدين محمد', 'Nour Eldin Mohamed', 'nour.m@nova.edu', 'nour.m', '$2y$12$wAPobq9xKm7x5eFDamBu0OrvGjAzKTFHp3Xq2G.N/tHF0CxdWuH7q', '+201100000004', 'https://api.dicebear.com/7.x/avataaars/svg?seed=nour', 'student', 'active'),
(12, 'ياسمين خالد سعيد', 'Yasmine Khaled Said', 'yasmine.k@nova.edu', 'yasmine.k', '$2y$12$wAPobq9xKm7x5eFDamBu0OrvGjAzKTFHp3Xq2G.N/tHF0CxdWuH7q', '+201100000005', 'https://api.dicebear.com/7.x/avataaars/svg?seed=yasmine', 'student', 'active');

-- =====================================================
-- DEPARTMENTS (8 departments)
-- =====================================================
INSERT INTO `departments` (`id`, `name_ar`, `name_en`, `description_ar`, `description_en`, `icon`, `color`, `head_id`, `students_count`, `courses_count`) VALUES
(1, 'هندسة الشبكات', 'Network Engineering', 'تعلم بناء وإدارة الشبكات الحديثة من الصفر حتى الاحتراف', 'Build and manage modern networks from scratch to professional level', 'Network', 'from-cyan-400 to-blue-600', 2, 3240, 28),
(2, 'الأمن السيبراني', 'Cyber Security', 'احمِ الأنظمة والشبكات من التهديدات الإلكترونية المتقدمة', 'Protect systems and networks from advanced cyber threats', 'Shield', 'from-blue-500 to-indigo-700', 3, 4180, 34),
(3, 'هندسة البرمجيات', 'Software Engineering', 'اتقن البرمجة وبناء التطبيقات والأنظمة الكبيرة', 'Master coding and building large-scale applications', 'Code2', 'from-sky-400 to-cyan-600', 4, 6520, 52),
(4, 'الذكاء الاصطناعي', 'Artificial Intelligence', 'تعلّم الآلة والشبكات العصبية والرؤية الحاسوبية', 'Machine learning, neural networks, and computer vision', 'BrainCircuit', 'from-purple-500 to-fuchsia-600', 5, 3890, 31),
(5, 'علوم البيانات', 'Data Science', 'حلل البيانات الضخمة واستخرج الرؤى القيمة', 'Analyze big data and extract valuable insights', 'Database', 'from-emerald-400 to-teal-600', 6, 2980, 26),
(6, 'تصميم UI/UX', 'UI/UX Design', 'صمم تجارب مستخدم رائعة وواجهات احترافية', 'Design amazing user experiences and professional interfaces', 'Palette', 'from-pink-400 to-rose-600', 7, 2150, 22),
(7, 'إدارة الأعمال الرقمية', 'Digital Business', 'ريادة الأعمال والتسويق الرقمي والتجارة الإلكترونية', 'Entrepreneurship, digital marketing, and e-commerce', 'Briefcase', 'from-amber-400 to-orange-600', NULL, 1840, 19),
(8, 'الإعلام الرقمي', 'Digital Media', 'إنتاج الفيديو والمونتاج والتصوير الاحترافي', 'Video production, editing, and professional photography', 'Video', 'from-violet-400 to-purple-600', NULL, 1420, 17);

-- =====================================================
-- COURSES (12 courses with full details)
-- =====================================================
INSERT INTO `courses` (`id`, `department_id`, `instructor_id`, `title_ar`, `title_en`, `description_ar`, `description_en`, `thumbnail`, `price`, `discount_price`, `level`, `total_hours`, `total_lessons`, `total_students`, `rating`, `rating_count`, `status`, `is_featured`, `published_at`) VALUES
(1, 1, 2, 'أساسيات شبكات Cisco CCNA', 'Cisco CCNA Fundamentals', 'تعلم أساسيات الشبكات وبروتوكولات TCP/IP وإعدادات Cisco من الصفر. يغطي الكورس OSI Model و Routing و Switching وأمن الشبكات.', 'Learn networking fundamentals, TCP/IP protocols, and Cisco configurations from scratch. Covers OSI Model, Routing, Switching, and Network Security.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600', 1240.00, 826.00, 'beginner', 18.0, 42, 1240, 4.8, 312, 'published', 1, '2025-01-15 10:00:00'),
(2, 1, 2, 'إدارة شبكات المؤسسات', 'Enterprise Network Admin', 'إدارة الشبكات على مستوى المؤسسات الكبيرة. يشمل VLANs, ACLs, BGP, OSPF وحلول الأمان المتقدمة.', 'Manage enterprise-level networks. Covers VLANs, ACLs, BGP, OSPF, and advanced security solutions.', 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600', 890.00, 593.00, 'advanced', 22.0, 36, 890, 4.7, 198, 'published', 0, '2025-02-20 10:00:00'),
(3, 2, 3, 'الأمن السيبراني للمبتدئين', 'Cybersecurity for Beginners', 'ادخل عالم الأمن السيبراني من البداية. تعلم أساسيات أمن المعلومات، التهديدات، التشفير، وطرق الحماية.', 'Enter the cybersecurity world from scratch. Learn information security basics, threats, encryption, and protection methods.', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600', 2150.00, 1433.00, 'beginner', 14.0, 28, 2150, 4.9, 520, 'published', 1, '2025-01-10 10:00:00'),
(4, 2, 4, 'اختبار الاختراق Ethical Hacking', 'Ethical Hacking Mastery', 'أتقن اختبار الاختراق الأخلاقي. يشمل Kali Linux, Metasploit, Burp Suite, وطرق الاختراق المتقدمة مع التقارير الاحترافية.', 'Master ethical penetration testing. Covers Kali Linux, Metasploit, Burp Suite, advanced exploitation techniques, and professional reporting.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 1780.00, 1186.00, 'advanced', 30.0, 55, 1780, 4.9, 445, 'published', 1, '2025-03-01 10:00:00'),
(5, 3, 2, 'تطوير الويب الكامل', 'Full Stack Web Development', 'تعلم تطوير الويب من الصفر إلى الاحتراف. HTML, CSS, JavaScript, React, Node.js, MongoDB مع مشاريع عملية.', 'Learn full stack web development from scratch. HTML, CSS, JavaScript, React, Node.js, MongoDB with real-world projects.', 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600', 3200.00, 2133.00, 'intermediate', 45.0, 68, 3200, 4.9, 812, 'published', 1, '2024-11-15 10:00:00'),
(6, 3, 5, 'Python للذكاء الاصطناعي', 'Python for AI', 'تعلم Python من الأساسيات إلى التطبيقات المتقدمة في الذكاء الاصطناعي. NumPy, Pandas, TensorFlow, PyTorch.', 'Learn Python from basics to advanced AI applications. NumPy, Pandas, TensorFlow, PyTorch.', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600', 2890.00, 1926.00, 'intermediate', 35.0, 50, 2890, 4.8, 623, 'published', 0, '2025-01-20 10:00:00'),
(7, 4, 5, 'التعلم العميق Deep Learning', 'Deep Learning Mastery', 'أتقن الشبكات العصبية العميقة. CNNs, RNNs, GANs, Transformers مع مشاريع حقيقية في الرؤية الحاسوبية ومعالجة اللغات.', 'Master deep neural networks. CNNs, RNNs, GANs, Transformers with real projects in computer vision and NLP.', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600', 3500.00, 2333.00, 'advanced', 40.0, 62, 1560, 4.8, 380, 'published', 1, '2025-04-01 10:00:00'),
(8, 5, 6, 'تحليل البيانات مع Power BI', 'Data Analytics with Power BI', 'أتقن تحليل البيانات والتقارير التفاعلية باستخدام Microsoft Power BI. من البيانات الخام إلى لوحات التحكم الاحترافية.', 'Master data analytics and interactive reporting with Microsoft Power BI. From raw data to professional dashboards.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600', 1650.00, 1100.00, 'beginner', 20.0, 35, 1890, 4.7, 412, 'published', 0, '2025-02-10 10:00:00'),
(9, 6, 7, 'تصميم واجهات UI/UX بالفيجما', 'UI/UX Design with Figma', 'تعلم تصميم واجهات المستخدم وتجربة المستخدم باحترافية عالية. من Wireframes إلى Prototypes التفاعلية.', 'Learn professional UI/UX design. From Wireframes to interactive Prototypes using Figma.', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600', 1200.00, 800.00, 'beginner', 16.0, 30, 1320, 4.6, 290, 'published', 0, '2025-03-15 10:00:00'),
(10, 7, 6, 'التسويق الرقمي الشامل', 'Complete Digital Marketing', 'أتقن التسويق الرقمي: SEO, Google Ads, Facebook Ads, Email Marketing, Content Marketing مع استراتيجيات عملية.', 'Master digital marketing: SEO, Google Ads, Facebook Ads, Email Marketing, Content Marketing with practical strategies.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600', 1800.00, 1200.00, 'intermediate', 25.0, 40, 2100, 4.7, 480, 'published', 0, '2025-01-25 10:00:00'),
(11, 8, 7, 'إنتاج الفيديو والمونتاج', 'Video Production & Editing', 'تعلم إنتاج الفيديو الاحترافي والمونتاج. Adobe Premiere, After Effects, DaVinci Resolve مع تقنيات التصوير.', 'Learn professional video production and editing. Adobe Premiere, After Effects, DaVinci Resolve with filming techniques.', 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600', 2200.00, 1466.00, 'intermediate', 28.0, 45, 980, 4.5, 210, 'published', 0, '2025-02-28 10:00:00'),
(12, 3, 4, 'تطوير تطبيقات الموبايل Flutter', 'Mobile App Development with Flutter', 'ابنِ تطبيقات موبايل احترافية لـ Android و iOS بلغة واحدة. Dart, Flutter Widgets, State Management, Firebase.', 'Build professional mobile apps for Android & iOS with one codebase. Dart, Flutter Widgets, State Management, Firebase.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600', 2500.00, 1666.00, 'intermediate', 32.0, 48, 1750, 4.8, 390, 'published', 1, '2025-03-10 10:00:00');

-- =====================================================
-- COURSE SECTIONS & LESSONS (for Course 1: CCNA)
-- =====================================================
INSERT INTO `course_sections` (`id`, `course_id`, `title_ar`, `title_en`, `sort_order`) VALUES
(1, 1, 'مقدمة في الشبكات', 'Introduction to Networking', 1),
(2, 1, 'نموذج OSI', 'OSI Model', 2),
(3, 1, 'بروتوكول TCP/IP', 'TCP/IP Protocol', 3),
(4, 1, 'إعدادات Cisco الأساسية', 'Basic Cisco Configuration', 4);

INSERT INTO `lessons` (`id`, `section_id`, `course_id`, `title_ar`, `title_en`, `video_url`, `video_duration`, `type`, `is_free`, `sort_order`) VALUES
(1, 1, 1, 'ما هي الشبكات؟', 'What are Networks?', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '15:30', 'video', 1, 1),
(2, 1, 1, 'أنواع الشبكات LAN, WAN, MAN', 'Network Types: LAN, WAN, MAN', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '22:15', 'video', 1, 2),
(3, 1, 1, 'أجهزة الشبكات الأساسية', 'Basic Network Devices', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '18:45', 'video', 0, 3),
(4, 1, 1, 'اختبار: أساسيات الشبكات', 'Quiz: Networking Basics', NULL, NULL, 'quiz', 0, 4),
(5, 2, 1, 'الطبقة الأولى - Physical', 'Layer 1 - Physical', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '20:00', 'video', 0, 1),
(6, 2, 1, 'الطبقة الثانية - Data Link', 'Layer 2 - Data Link', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '25:30', 'video', 0, 2),
(7, 2, 1, 'الطبقة الثالثة - Network', 'Layer 3 - Network', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '28:00', 'video', 0, 3),
(8, 2, 1, 'الطبقات العليا 4-7', 'Upper Layers 4-7', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '22:00', 'video', 0, 4),
(9, 3, 1, 'عنوان IP وأنواعه', 'IP Addressing', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '30:00', 'video', 0, 1),
(10, 3, 1, 'Subnetting تقسيم الشبكات', 'Subnetting', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '35:00', 'video', 0, 2),
(11, 3, 1, 'تطبيق عملي: Subnetting', 'Lab: Subnetting Practice', NULL, NULL, 'assignment', 0, 3),
(12, 4, 1, 'إعداد الراوتر الأول', 'First Router Setup', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '25:00', 'video', 0, 1),
(13, 4, 1, 'إعداد السويتش', 'Switch Configuration', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '22:00', 'video', 0, 2),
(14, 4, 1, 'مشروع نهائي: بناء شبكة كاملة', 'Final Project: Build a Network', NULL, NULL, 'assignment', 0, 3);

-- =====================================================
-- COURSE SECTIONS & LESSONS (for Course 3: Cybersecurity)
-- =====================================================
INSERT INTO `course_sections` (`id`, `course_id`, `title_ar`, `title_en`, `sort_order`) VALUES
(5, 3, 'أساسيات أمن المعلومات', 'Information Security Basics', 1),
(6, 3, 'التهديدات والهجمات', 'Threats & Attacks', 2),
(7, 3, 'التشفير وأساسياته', 'Cryptography Basics', 3);

INSERT INTO `lessons` (`section_id`, `course_id`, `title_ar`, `title_en`, `video_url`, `video_duration`, `type`, `is_free`, `sort_order`) VALUES
(5, 3, 'مقدمة في الأمن السيبراني', 'Introduction to Cybersecurity', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '18:00', 'video', 1, 1),
(5, 3, 'مبدأ CIA Triad', 'CIA Triad Principle', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '15:00', 'video', 1, 2),
(5, 3, 'أنواع المهاجمين', 'Types of Attackers', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '20:00', 'video', 0, 3),
(6, 3, 'هجمات Phishing', 'Phishing Attacks', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '22:00', 'video', 0, 1),
(6, 3, 'هجمات Malware', 'Malware Attacks', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '25:00', 'video', 0, 2),
(6, 3, 'هجمات DDoS', 'DDoS Attacks', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '20:00', 'video', 0, 3),
(7, 3, 'التشفير المتماثل وغير المتماثل', 'Symmetric & Asymmetric Encryption', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '28:00', 'video', 0, 1),
(7, 3, 'شهادات SSL/TLS', 'SSL/TLS Certificates', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '18:00', 'video', 0, 2);

-- =====================================================
-- COURSE SECTIONS & LESSONS (for Course 5: Full Stack)
-- =====================================================
INSERT INTO `course_sections` (`id`, `course_id`, `title_ar`, `title_en`, `sort_order`) VALUES
(8, 5, 'أساسيات HTML & CSS', 'HTML & CSS Fundamentals', 1),
(9, 5, 'JavaScript المتقدم', 'Advanced JavaScript', 2),
(10, 5, 'React.js', 'React.js', 3),
(11, 5, 'Node.js & Backend', 'Node.js & Backend', 4);

INSERT INTO `lessons` (`section_id`, `course_id`, `title_ar`, `title_en`, `video_url`, `video_duration`, `type`, `is_free`, `sort_order`) VALUES
(8, 5, 'بنية HTML5', 'HTML5 Structure', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '20:00', 'video', 1, 1),
(8, 5, 'CSS Grid & Flexbox', 'CSS Grid & Flexbox', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '35:00', 'video', 1, 2),
(8, 5, 'Responsive Design', 'Responsive Design', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '25:00', 'video', 0, 3),
(9, 5, 'ES6+ Features', 'ES6+ Features', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '30:00', 'video', 0, 1),
(9, 5, 'Async/Await & Promises', 'Async/Await & Promises', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '28:00', 'video', 0, 2),
(10, 5, 'React Components & JSX', 'React Components & JSX', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '25:00', 'video', 0, 1),
(10, 5, 'React Hooks', 'React Hooks', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '35:00', 'video', 0, 2),
(10, 5, 'State Management', 'State Management', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '30:00', 'video', 0, 3),
(11, 5, 'Express.js API', 'Express.js API', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '40:00', 'video', 0, 1),
(11, 5, 'MongoDB & Mongoose', 'MongoDB & Mongoose', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '35:00', 'video', 0, 2),
(11, 5, 'مشروع نهائي كامل', 'Complete Final Project', NULL, NULL, 'assignment', 0, 3);

-- =====================================================
-- ROLES
-- =====================================================
INSERT INTO `roles` (`id`, `name`, `name_ar`, `name_en`, `color`) VALUES
(1, 'super_admin', 'مدير عام', 'Super Admin', 'from-red-500 to-orange-500'),
(2, 'admin', 'مدير', 'Admin', 'from-purple-500 to-indigo-500'),
(3, 'instructor', 'مدرّب', 'Instructor', 'from-blue-500 to-cyan-500'),
(4, 'moderator', 'مشرف', 'Moderator', 'from-emerald-500 to-teal-500');

-- =====================================================
-- PERMISSIONS (16 granular permissions)
-- =====================================================
INSERT INTO `permissions` (`id`, `name`, `name_ar`, `name_en`, `category`) VALUES
(1, 'create_course', 'إنشاء كورسات', 'Create Courses', 'courses'),
(2, 'edit_course', 'تعديل الكورسات', 'Edit Courses', 'courses'),
(3, 'delete_course', 'حذف الكورسات', 'Delete Courses', 'courses'),
(4, 'publish_course', 'نشر الكورسات', 'Publish Courses', 'courses'),
(5, 'upload_content', 'رفع المحتوى', 'Upload Content', 'content'),
(6, 'manage_assignments', 'إدارة الواجبات', 'Manage Assignments', 'content'),
(7, 'grade_students', 'تقييم الطلاب', 'Grade Students', 'students'),
(8, 'view_students', 'عرض بيانات الطلاب', 'View Student Data', 'students'),
(9, 'manage_students', 'إدارة الطلاب', 'Manage Students', 'students'),
(10, 'issue_certificates', 'إصدار الشهادات', 'Issue Certificates', 'certificates'),
(11, 'view_analytics', 'عرض التحليلات', 'View Analytics', 'analytics'),
(12, 'export_reports', 'تصدير التقارير', 'Export Reports', 'analytics'),
(13, 'manage_users', 'إدارة المستخدمين', 'Manage Users', 'admin'),
(14, 'manage_settings', 'إدارة الإعدادات', 'Manage Settings', 'admin'),
(15, 'manage_roles', 'إدارة الأدوار', 'Manage Roles', 'admin'),
(16, 'view_logs', 'عرض السجلات', 'View Logs', 'admin');

-- =====================================================
-- INSTRUCTOR PERMISSIONS (Assign to instructors)
-- =====================================================
INSERT INTO `user_permissions` (`user_id`, `permission_id`) VALUES
-- Dr. Ahmed: create, edit, upload, grade, view students, certificates
(2, 1), (2, 2), (2, 5), (2, 7), (2, 8), (2, 10),
-- Dr. Sara: create, edit, publish, upload, grade, view students, analytics
(3, 1), (3, 2), (3, 4), (3, 5), (3, 7), (3, 8), (3, 11),
-- Eng. Khaled: create, edit, upload, assignments, grade
(4, 1), (4, 2), (4, 5), (4, 6), (4, 7),
-- Dr. Manal: create, edit, upload, grade, certificates, analytics
(5, 1), (5, 2), (5, 5), (5, 7), (5, 10), (5, 11);

-- =====================================================
-- SAMPLE ENROLLMENTS
-- =====================================================
INSERT INTO `enrollments` (`user_id`, `course_id`, `payment_method`, `amount_paid`, `transaction_id`, `status`, `progress`, `enrolled_at`) VALUES
(8, 1, 'credit_card', 826.00, 'TXN-A1B2C3D4E5F6', 'active', 65.00, '2025-12-01 14:30:00'),
(8, 3, 'e_wallet', 1433.00, 'TXN-B2C3D4E5F6G7', 'active', 40.00, '2025-12-15 10:00:00'),
(8, 5, 'fawry', 2133.00, 'TXN-C3D4E5F6G7H8', 'active', 85.00, '2025-11-20 16:45:00'),
(9, 1, 'credit_card', 826.00, 'TXN-D4E5F6G7H8I9', 'active', 30.00, '2026-01-10 09:00:00'),
(9, 5, 'e_wallet', 2133.00, 'TXN-E5F6G7H8I9J0', 'active', 55.00, '2026-01-15 13:20:00'),
(10, 3, 'credit_card', 1433.00, 'TXN-F6G7H8I9J0K1', 'active', 20.00, '2026-02-01 11:00:00'),
(10, 4, 'fawry', 1186.00, 'TXN-G7H8I9J0K1L2', 'active', 10.00, '2026-02-10 15:30:00'),
(10, 7, 'e_wallet', 2333.00, 'TXN-H8I9J0K1L2M3', 'active', 45.00, '2026-01-20 12:00:00'),
(11, 5, 'credit_card', 2133.00, 'TXN-I9J0K1L2M3N4', 'active', 100.00, '2025-10-05 08:30:00'),
(11, 6, 'credit_card', 1926.00, 'TXN-J0K1L2M3N4O5', 'active', 72.00, '2025-11-15 14:00:00'),
(12, 9, 'e_wallet', 800.00, 'TXN-K1L2M3N4O5P6', 'active', 90.00, '2025-12-20 10:30:00'),
(12, 10, 'fawry', 1200.00, 'TXN-L2M3N4O5P6Q7', 'active', 35.00, '2026-01-05 16:15:00');

-- =====================================================
-- SAMPLE LESSON PROGRESS
-- =====================================================
INSERT INTO `lesson_progress` (`user_id`, `lesson_id`, `course_id`, `watched_seconds`, `is_completed`, `completed_at`) VALUES
(8, 1, 1, 930, 1, '2025-12-02 15:00:00'),
(8, 2, 1, 1335, 1, '2025-12-03 14:30:00'),
(8, 3, 1, 1125, 1, '2025-12-04 16:00:00'),
(8, 5, 1, 1200, 1, '2025-12-06 10:00:00'),
(8, 6, 1, 1530, 1, '2025-12-08 11:30:00'),
(8, 7, 1, 800, 0, NULL),
(9, 1, 1, 930, 1, '2026-01-11 10:00:00'),
(9, 2, 1, 1335, 1, '2026-01-12 14:00:00'),
(11, 1, 5, 1200, 1, '2025-10-06 09:00:00'),
(11, 2, 5, 2100, 1, '2025-10-07 10:30:00');

-- =====================================================
-- SAMPLE CERTIFICATES
-- =====================================================
INSERT INTO `certificates` (`user_id`, `course_id`, `certificate_number`, `type`, `grade`, `issued_at`) VALUES
(11, 5, 'NOVA-2026-A1B2C3D4', 'honors', 92.50, '2026-01-15 12:00:00');

-- =====================================================
-- SAMPLE REVIEWS
-- =====================================================
INSERT INTO `reviews` (`user_id`, `course_id`, `rating`, `comment`, `status`, `created_at`) VALUES
(8, 1, 5, 'كورس ممتاز جداً! شرح واضح ومفصل، استفدت كثيراً من التطبيقات العملية.', 'approved', '2026-01-10 08:00:00'),
(8, 3, 5, 'أفضل كورس أمن سيبراني بالعربي. المحتوى شامل والمدرب ممتاز.', 'approved', '2026-01-20 09:00:00'),
(9, 1, 4, 'كورس جيد جداً ولكن يحتاج مزيد من التطبيقات العملية على أجهزة حقيقية.', 'approved', '2026-02-01 10:00:00'),
(9, 5, 5, 'من أقوى كورسات البرمجة! كل مشروع مفيد وعملي.', 'approved', '2026-02-15 11:00:00'),
(10, 3, 5, 'شرح رائع للأمن السيبراني. بنصح كل المبتدئين يبدأوا من هنا.', 'approved', '2026-03-01 12:00:00'),
(11, 5, 5, 'كورس شامل وممتاز! خلّاني أقدر أبني أي تطبيق ويب من الصفر.', 'approved', '2026-01-16 13:00:00'),
(12, 9, 4, 'تعلمت فيجما بشكل احترافي. الأمثلة العملية كانت مفيدة جداً.', 'approved', '2026-02-20 14:00:00');

-- =====================================================
-- COUPONS
-- =====================================================
INSERT INTO `coupons` (`code`, `discount_type`, `discount_value`, `max_uses`, `used_count`, `min_amount`, `course_id`, `valid_until`, `status`) VALUES
('NOVA10', 'percentage', 10.00, 100, 15, 100.00, NULL, '2026-12-31 23:59:59', 'active'),
('WELCOME20', 'percentage', 20.00, 500, 42, 200.00, NULL, '2026-06-30 23:59:59', 'active'),
('CYBER50', 'fixed', 50.00, 50, 8, 500.00, 3, '2026-12-31 23:59:59', 'active'),
('FREE100', 'percentage', 100.00, 10, 2, 0.00, NULL, '2026-03-31 23:59:59', 'active'),
('SUMMER30', 'percentage', 30.00, 200, 0, 300.00, NULL, '2026-08-31 23:59:59', 'active');

-- =====================================================
-- ANNOUNCEMENTS
-- =====================================================
INSERT INTO `announcements` (`title_ar`, `title_en`, `content_ar`, `content_en`, `type`, `target`, `author_id`, `is_pinned`, `status`) VALUES
('عرض خاص: خصم 30% على جميع الكورسات!', 'Special Offer: 30% Off All Courses!', 'بمناسبة الصيف، احصل على خصم 30% على جميع الكورسات باستخدام كوبون SUMMER30. العرض محدود!', 'For summer, get 30% off all courses using coupon SUMMER30. Limited offer!', 'success', 'all', 1, 1, 'active'),
('تحديث المنصة: ميزات جديدة', 'Platform Update: New Features', 'تم إضافة نظام الإنجازات وتتبع التقدم المتقدم. جرّب الميزات الجديدة الآن!', 'Achievement system and advanced progress tracking added. Try the new features now!', 'info', 'students', 1, 0, 'active'),
('كورس جديد: التعلم العميق', 'New Course: Deep Learning', 'تم إطلاق كورس التعلم العميق مع د. منال فوزي. سجّل الآن واحصل على سعر الإطلاق الخاص.', 'Deep Learning course launched with Dr. Manal Fawzy. Register now for the special launch price.', 'info', 'all', 1, 0, 'active');

-- =====================================================
-- SETTINGS
-- =====================================================
INSERT INTO `settings` (`setting_key`, `setting_value`, `category`) VALUES
('site_name_ar', 'نوفا ليرن', 'general'),
('site_name_en', 'Nova Learn', 'general'),
('site_email', 'info@nova-learn.edu', 'general'),
('site_phone', '+20 100 000 0000', 'general'),
('site_description_ar', 'منصة تعليمية متكاملة لتطوير مهاراتك التقنية', 'general'),
('site_description_en', 'Complete learning platform to develop your technical skills', 'general'),
('default_language', 'ar', 'general'),
('maintenance_mode', '0', 'system'),
('registration_enabled', '1', 'auth'),
('email_verification', '0', 'auth'),
('currency', 'EGP', 'payment'),
('tax_rate', '14', 'payment'),
('payment_gateway', 'manual', 'payment'),
('smtp_host', '', 'email'),
('smtp_port', '587', 'email'),
('smtp_user', '', 'email'),
('smtp_pass', '', 'email');

-- =====================================================
-- ACTIVITY LOG (sample entries)
-- =====================================================
INSERT INTO `activity_log` (`user_id`, `action`, `entity_type`, `entity_id`, `details`, `ip_address`, `created_at`) VALUES
(1, 'login', 'user', 1, '{"method":"admin-login"}', '127.0.0.1', '2026-04-20 10:00:00'),
(1, 'create_course', 'course', 7, '{"title":"Deep Learning"}', '127.0.0.1', '2026-04-01 09:00:00'),
(1, 'assign_permissions', 'user', 2, '{"permissions":["create_course","edit_course"]}', '127.0.0.1', '2026-03-15 11:00:00'),
(8, 'register', 'user', 8, NULL, '192.168.1.100', '2025-12-01 14:00:00'),
(8, 'enrollment', 'course', 1, '{"amount":826,"method":"credit_card"}', '192.168.1.100', '2025-12-01 14:30:00'),
(9, 'enrollment', 'course', 5, '{"amount":2133,"method":"e_wallet"}', '192.168.1.101', '2026-01-15 13:20:00');

COMMIT;

-- =====================================================
-- ✅ DATABASE READY!
-- 
-- Login Credentials:
-- ┌──────────────┬──────────────────┬───────────────┐
-- │ Role         │ Email            │ Password      │
-- ├──────────────┼──────────────────┼───────────────┤
-- │ Super Admin  │ admin@nova.edu   │ admin123      │
-- │ Instructor   │ ahmed.h@nova.edu │ instructor123 │
-- │ Student      │ mohamed.a@nova.edu│ student123   │
-- └──────────────┴──────────────────┴───────────────┘
-- =====================================================
