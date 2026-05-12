export type DeptId =
  | "medicine"
  | "dentistry"
  | "pharmacy"
  | "veterinary"
  | "science"
  | "engineering"
  | "computers"
  | "nursing";

export interface Department {
  id: DeptId;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  color: string;
  students: number;
  courses: number;
  specializations: { nameAr: string; nameEn: string }[];
}

export const departments: Department[] = [
  {
    id: "medicine",
    nameAr: "كلية الطب البشري",
    nameEn: "Faculty of Medicine",
    descAr: "إعداد أطباء متميزين قادرين على تقديم الرعاية الصحية الشاملة بأعلى المعايير العلمية والأخلاقية",
    descEn: "Preparing outstanding physicians capable of providing comprehensive healthcare at the highest scientific and ethical standards",
    icon: "Stethoscope",
    color: "from-red-400 to-rose-600",
    students: 5200,
    courses: 48,
    specializations: [
      { nameAr: "الطب الباطني", nameEn: "Internal Medicine" },
      { nameAr: "الجراحة العامة", nameEn: "General Surgery" },
      { nameAr: "طب الأطفال", nameEn: "Pediatrics" },
      { nameAr: "التوليد وأمراض النساء", nameEn: "Obstetrics & Gynecology" },
      { nameAr: "الطب النفسي", nameEn: "Psychiatry" },
      { nameAr: "الأشعة التشخيصية", nameEn: "Diagnostic Radiology" },
      { nameAr: "أمراض القلب", nameEn: "Cardiology" },
      { nameAr: "طب الطوارئ", nameEn: "Emergency Medicine" },
    ],
  },
  {
    id: "dentistry",
    nameAr: "كلية طب الأسنان",
    nameEn: "Faculty of Dentistry",
    descAr: "تأهيل أطباء أسنان متخصصين بأحدث التقنيات في تشخيص وعلاج أمراض الفم والأسنان والفكين",
    descEn: "Qualifying specialized dentists with the latest techniques in diagnosing and treating oral, dental and jaw diseases",
    icon: "SmilePlus",
    color: "from-sky-400 to-blue-600",
    students: 2800,
    courses: 36,
    specializations: [
      { nameAr: "جراحة الفم والوجه والفكين", nameEn: "Oral & Maxillofacial Surgery" },
      { nameAr: "تقويم الأسنان", nameEn: "Orthodontics" },
      { nameAr: "علاج جذور الأسنان", nameEn: "Endodontics" },
      { nameAr: "أمراض اللثة", nameEn: "Periodontics" },
      { nameAr: "تركيبات الأسنان", nameEn: "Prosthodontics" },
      { nameAr: "طب أسنان الأطفال", nameEn: "Pediatric Dentistry" },
    ],
  },
  {
    id: "pharmacy",
    nameAr: "كلية الصيدلة",
    nameEn: "Faculty of Pharmacy",
    descAr: "تخريج صيادلة مؤهلين في علوم الدواء والتصنيع الصيدلاني والرعاية الصيدلية المتكاملة",
    descEn: "Graduating qualified pharmacists in pharmaceutical sciences, drug manufacturing and integrated pharmaceutical care",
    icon: "FlaskConical",
    color: "from-emerald-400 to-teal-600",
    students: 3400,
    courses: 40,
    specializations: [
      { nameAr: "الكيمياء الصيدلانية", nameEn: "Pharmaceutical Chemistry" },
      { nameAr: "الصيدلة الإكلينيكية", nameEn: "Clinical Pharmacy" },
      { nameAr: "علم الأدوية", nameEn: "Pharmacology" },
      { nameAr: "التقنية الصيدلانية", nameEn: "Pharmaceutical Technology" },
      { nameAr: "النباتات الطبية", nameEn: "Medicinal Plants" },
      { nameAr: "الميكروبيولوجيا الصيدلانية", nameEn: "Pharmaceutical Microbiology" },
    ],
  },
  {
    id: "veterinary",
    nameAr: "كلية الطب البيطري",
    nameEn: "Faculty of Veterinary Medicine",
    descAr: "إعداد أطباء بيطريين متخصصين في رعاية الحيوان ومكافحة الأمراض الحيوانية المنشأ وصحة الغذاء",
    descEn: "Preparing veterinary doctors specialized in animal care, zoonotic disease control and food safety",
    icon: "PawPrint",
    color: "from-amber-400 to-orange-600",
    students: 1900,
    courses: 32,
    specializations: [
      { nameAr: "الجراحة البيطرية", nameEn: "Veterinary Surgery" },
      { nameAr: "الأمراض الداخلية البيطرية", nameEn: "Veterinary Internal Medicine" },
      { nameAr: "صحة الغذاء", nameEn: "Food Hygiene" },
      { nameAr: "علم وبائيات الأمراض", nameEn: "Epidemiology" },
      { nameAr: "التوليد البيطري", nameEn: "Veterinary Obstetrics" },
    ],
  },
  {
    id: "science",
    nameAr: "كلية العلوم",
    nameEn: "Faculty of Science",
    descAr: "رحلة علمية عميقة في الفيزياء والكيمياء والرياضيات وعلم الأحياء لاستكشاف أسرار الكون",
    descEn: "A deep scientific journey in physics, chemistry, mathematics and biology to explore the secrets of the universe",
    icon: "Atom",
    color: "from-violet-400 to-purple-600",
    students: 3100,
    courses: 44,
    specializations: [
      { nameAr: "الفيزياء", nameEn: "Physics" },
      { nameAr: "الكيمياء", nameEn: "Chemistry" },
      { nameAr: "الرياضيات", nameEn: "Mathematics" },
      { nameAr: "علم الأحياء", nameEn: "Biology" },
      { nameAr: "علم الجيولوجيا", nameEn: "Geology" },
      { nameAr: "الإحصاء", nameEn: "Statistics" },
      { nameAr: "الكيمياء الحيوية", nameEn: "Biochemistry" },
    ],
  },
  {
    id: "engineering",
    nameAr: "كلية الهندسة",
    nameEn: "Faculty of Engineering",
    descAr: "تأهيل مهندسين مبدعين في مختلف التخصصات الهندسية لبناء مستقبل مستدام ومتطور",
    descEn: "Qualifying creative engineers in various engineering disciplines to build a sustainable and advanced future",
    icon: "HardHat",
    color: "from-yellow-400 to-amber-600",
    students: 4600,
    courses: 56,
    specializations: [
      { nameAr: "الهندسة المدنية", nameEn: "Civil Engineering" },
      { nameAr: "الهندسة الكهربائية", nameEn: "Electrical Engineering" },
      { nameAr: "الهندسة الميكانيكية", nameEn: "Mechanical Engineering" },
      { nameAr: "هندسة المعمار", nameEn: "Architecture" },
      { nameAr: "الهندسة الكيميائية", nameEn: "Chemical Engineering" },
      { nameAr: "هندسة الإلكترونيات والاتصالات", nameEn: "Electronics & Communications" },
      { nameAr: "هندسة القوى الكهربائية", nameEn: "Electrical Power Engineering" },
    ],
  },
  {
    id: "computers",
    nameAr: "كلية الحاسبات والذكاء الاصطناعي",
    nameEn: "Faculty of Computers & AI",
    descAr: "ريادة مجال الحوسبة والذكاء الاصطناعي بأحدث التقنيات في تطوير البرمجيات وعلوم البيانات",
    descEn: "Leading the field of computing and AI with the latest technologies in software development and data science",
    icon: "BrainCircuit",
    color: "from-cyan-400 to-blue-600",
    students: 5800,
    courses: 62,
    specializations: [
      { nameAr: "علوم الحاسب", nameEn: "Computer Science" },
      { nameAr: "الذكاء الاصطناعي", nameEn: "Artificial Intelligence" },
      { nameAr: "علوم البيانات", nameEn: "Data Science" },
      { nameAr: "الأمن السيبراني", nameEn: "Cyber Security" },
      { nameAr: "هندسة البرمجيات", nameEn: "Software Engineering" },
      { nameAr: "شبكات الحاسب", nameEn: "Computer Networks" },
      { nameAr: "نظم المعلومات", nameEn: "Information Systems" },
    ],
  },
  {
    id: "nursing",
    nameAr: "كلية التمريض",
    nameEn: "Faculty of Nursing",
    descAr: "إعداد كوادر تمريضية متميزة قادرة على تقديم الرعاية التمريضية الشاملة والمتكاملة للمرضى بأعلى المعايير المهنية",
    descEn: "Preparing outstanding nursing staff capable of providing comprehensive integrated nursing care to patients at the highest professional standards",
    icon: "HeartPulse",
    color: "from-pink-400 to-rose-600",
    students: 2400,
    courses: 30,
    specializations: [
      { nameAr: "تمريض الباطنة والجراحة", nameEn: "Medical & Surgical Nursing" },
      { nameAr: "تمريض الأطفال", nameEn: "Pediatric Nursing" },
      { nameAr: "تمريض الأمومة وصحة المرأة", nameEn: "Maternity & Women's Health Nursing" },
      { nameAr: "تمريض الطوارئ والحوادث", nameEn: "Emergency & Critical Care Nursing" },
      { nameAr: "التمريض النفسي", nameEn: "Psychiatric Nursing" },
      { nameAr: "تمريض المجتمع والصحة العامة", nameEn: "Community & Public Health Nursing" },
    ],
  },
];

export const courses = [
  // Medicine (طب بشري)
  { id: 1, dept: "medicine" as DeptId, titleAr: "علم التشريح الوصفي والتطبيقي", titleEn: "Descriptive & Applied Anatomy", instructor: "د. محمد غنيم", lessons: 65, students: 5400, hours: 45, level: "Beginner", rating: 4.9, thumb: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600", academicYear: 1, prerequisites: [] },
  { id: 2, dept: "medicine" as DeptId, titleAr: "الفيزيولوجيا الطبية المتقدمة", titleEn: "Advanced Medical Physiology", instructor: "د. هبة يس", lessons: 55, students: 4200, hours: 38, level: "Intermediate", rating: 4.8, thumb: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600", academicYear: 2, prerequisites: [1] },
  { id: 3, dept: "medicine" as DeptId, titleAr: "علم الأمراض العام والخاص", titleEn: "General & Special Pathology", instructor: "د. إبراهيم فوزي", lessons: 70, students: 3800, hours: 50, level: "Advanced", rating: 4.9, thumb: "https://images.unsplash.com/photo-1576089172869-4f5f6f315620?w=600", academicYear: 3, prerequisites: [2] },
  { id: 4, dept: "medicine" as DeptId, titleAr: "طب الباطنة: أمراض القلب والأوعية", titleEn: "Internal Medicine: Cardiology", instructor: "د. مجدي يعقوب", lessons: 85, students: 8500, hours: 60, level: "Advanced", rating: 5.0, thumb: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=600", academicYear: 4, prerequisites: [3] },
  { id: 5, dept: "medicine" as DeptId, titleAr: "أساسيات الجراحة العامة", titleEn: "Fundamentals of General Surgery", instructor: "د. شريف مراد", lessons: 45, students: 2900, hours: 30, level: "Intermediate", rating: 4.7, thumb: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600", academicYear: 3, prerequisites: [1] },

  // Dentistry (طب أسنان)
  { id: 6, dept: "dentistry" as DeptId, titleAr: "بيولوجيا الفم والأسنان", titleEn: "Oral & Dental Biology", instructor: "د. سارة محمود", lessons: 40, students: 2100, hours: 25, level: "Beginner", rating: 4.8, thumb: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600", academicYear: 1, prerequisites: [] },
  { id: 7, dept: "dentistry" as DeptId, titleAr: "المواد السنية وتطبيقاتها", titleEn: "Dental Materials & Applications", instructor: "د. حازم علي", lessons: 35, students: 1800, hours: 22, level: "Intermediate", rating: 4.6, thumb: "https://images.unsplash.com/photo-1588776814546-1ffbb172ef98?w=600", academicYear: 2, prerequisites: [6] },
  { id: 8, dept: "dentistry" as DeptId, titleAr: "علاج الأسنان التحفظي", titleEn: "Conservative Dentistry", instructor: "د. رشا سعيد", lessons: 50, students: 1500, hours: 35, level: "Intermediate", rating: 4.7, thumb: "https://images.unsplash.com/photo-1598256989798-3e4fe2ccfb0d?w=600", academicYear: 3, prerequisites: [7] },
  { id: 9, dept: "dentistry" as DeptId, titleAr: "تقويم الأسنان والفكين", titleEn: "Orthodontics & Dentofacial Orthopedics", instructor: "د. يحيى خليل", lessons: 60, students: 1200, hours: 45, level: "Advanced", rating: 4.9, thumb: "https://images.unsplash.com/photo-1588776814546-1ffbb172ef98?w=600", academicYear: 4, prerequisites: [8] },

  // Pharmacy (صيدلة)
  { id: 10, dept: "pharmacy" as DeptId, titleAr: "علم الأدوية الأساسي", titleEn: "Basic Pharmacology", instructor: "د. ليلى عبدالمنعم", lessons: 55, students: 3400, hours: 40, level: "Intermediate", rating: 4.8, thumb: "https://images.unsplash.com/photo-1584362128104-e55502e3089d?w=600", academicYear: 1, prerequisites: [] },
  { id: 11, dept: "pharmacy" as DeptId, titleAr: "الصيدلانيات الحيوية", titleEn: "Biopharmaceutics", instructor: "د. عمر خالد", lessons: 48, students: 2200, hours: 35, level: "Advanced", rating: 4.7, thumb: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600", academicYear: 2, prerequisites: [10] },
  { id: 12, dept: "pharmacy" as DeptId, titleAr: "كيمياء العقاقير الطبية", titleEn: "Pharmacognosy & Medicinal Plants", instructor: "د. مريم إبراهيم", lessons: 42, students: 1900, hours: 30, level: "Beginner", rating: 4.6, thumb: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=600", academicYear: 1, prerequisites: [] },
  { id: 13, dept: "pharmacy" as DeptId, titleAr: "الصيدلة الإكلينيكية والرقابة", titleEn: "Clinical Pharmacy & Monitoring", instructor: "د. طارق جلال", lessons: 65, students: 2800, hours: 48, level: "Advanced", rating: 4.9, thumb: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600", academicYear: 4, prerequisites: [11] },

  // Veterinary (طب بيطري)
  { id: 14, dept: "veterinary" as DeptId, titleAr: "تشريح الحيوان الوصفي", titleEn: "Descriptive Animal Anatomy", instructor: "د. سامي الجارحي", lessons: 45, students: 1200, hours: 32, level: "Beginner", rating: 4.7, thumb: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600", academicYear: 1, prerequisites: [] },
  { id: 15, dept: "veterinary" as DeptId, titleAr: "أمراض الباطنة في الحيوان", titleEn: "Veterinary Internal Medicine", instructor: "د. فوزي الشيمي", lessons: 50, students: 950, hours: 40, level: "Intermediate", rating: 4.8, thumb: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600", academicYear: 2, prerequisites: [14] },
  { id: 16, dept: "veterinary" as DeptId, titleAr: "الجراحة والتخدير البيطري", titleEn: "Veterinary Surgery & Anesthesia", instructor: "د. كمال النجار", lessons: 55, students: 800, hours: 45, level: "Advanced", rating: 4.9, thumb: "https://images.unsplash.com/photo-1581888227599-779811939961?w=600", academicYear: 4, prerequisites: [15] },

  // Nursing (تمريض)
  { id: 17, dept: "nursing" as DeptId, titleAr: "أساسيات التمريض المهني", titleEn: "Fundamentals of Professional Nursing", instructor: "أ.د. نادية محمود", lessons: 50, students: 4500, hours: 35, level: "Beginner", rating: 4.8, thumb: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600", academicYear: 1, prerequisites: [] },
  { id: 18, dept: "nursing" as DeptId, titleAr: "تمريض الرعاية الحرجة والطوارئ", titleEn: "Critical Care & Emergency Nursing", instructor: "أ.د. حنان يسري", lessons: 60, students: 3200, hours: 45, level: "Advanced", rating: 4.9, thumb: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=600", academicYear: 4, prerequisites: [17] },
  { id: 19, dept: "nursing" as DeptId, titleAr: "تمريض صحة الأم والمولود", titleEn: "Maternal & Newborn Health Nursing", instructor: "د. فاطمة الزهراء", lessons: 45, students: 2800, hours: 32, level: "Intermediate", rating: 4.7, thumb: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600", academicYear: 2, prerequisites: [17] },

  // Science (علوم)
  { id: 20, dept: "science" as DeptId, titleAr: "الكيمياء العضوية الأروماتية", titleEn: "Aromatic Organic Chemistry", instructor: "أ.د. عصام إبراهيم", lessons: 55, students: 3100, hours: 40, level: "Intermediate", rating: 4.8, thumb: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600", academicYear: 1, prerequisites: [] },
  { id: 21, dept: "science" as DeptId, titleAr: "ميكانيكا الكم والفيزياء الذرية", titleEn: "Quantum Mechanics & Atomic Physics", instructor: "د. هاني عادل", lessons: 65, students: 2500, hours: 50, level: "Advanced", rating: 4.9, thumb: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600", academicYear: 4, prerequisites: [20] },
  { id: 22, dept: "science" as DeptId, titleAr: "التفاضل والتكامل المتقدم", titleEn: "Advanced Calculus", instructor: "أ.د. جابر عصفور", lessons: 70, students: 4800, hours: 55, level: "Intermediate", rating: 4.7, thumb: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600", academicYear: 2, prerequisites: [] },

  // Engineering (هندسة)
  { id: 23, dept: "engineering" as DeptId, titleAr: "تحليل المنشآت الخرسانية", titleEn: "Analysis of Concrete Structures", instructor: "د. محمود الصاوي", lessons: 60, students: 3500, hours: 48, level: "Advanced", rating: 4.9, thumb: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600", academicYear: 3, prerequisites: [25] },
  { id: 24, dept: "engineering" as DeptId, titleAr: "الديناميكا الحرارية الهندسية", titleEn: "Engineering Thermodynamics", instructor: "د. شريف كمال", lessons: 48, students: 2900, hours: 35, level: "Intermediate", rating: 4.7, thumb: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600", academicYear: 2, prerequisites: [] },
  { id: 25, dept: "engineering" as DeptId, titleAr: "نظرية الآلات والتصميم الميكانيكي", titleEn: "Theory of Machines & Design", instructor: "أ.د. رفعت البدوي", lessons: 55, students: 2400, hours: 42, level: "Intermediate", rating: 4.8, thumb: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=600", academicYear: 1, prerequisites: [] },

  // Computers & AI (حاسبات وذكاء اصطناعي)
  { id: 26, dept: "computers" as DeptId, titleAr: "هياكل البيانات والخوارزميات", titleEn: "Data Structures & Algorithms", instructor: "د. محمد أبوالعلا", lessons: 75, students: 9200, hours: 55, level: "Intermediate", rating: 4.9, thumb: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=600", academicYear: 2, prerequisites: [28] },
  { id: 27, dept: "computers" as DeptId, titleAr: "بناء النظم الخبيرة والذكاء الاصطناعي", titleEn: "Expert Systems & AI Construction", instructor: "أ.د. يحيى زكريا", lessons: 60, students: 4800, hours: 45, level: "Advanced", rating: 5.0, thumb: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600", academicYear: 4, prerequisites: [26] },
  { id: 28, dept: "computers" as DeptId, titleAr: "تطوير الويب: MERN Stack الشامل", titleEn: "Comprehensive MERN Stack Development", instructor: "د. وليد فوزي", lessons: 95, students: 12500, hours: 80, level: "Beginner", rating: 4.9, thumb: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600", academicYear: 1, prerequisites: [] },
  { id: 29, dept: "computers" as DeptId, titleAr: "هندسة الأمن السيبراني المتقدم", titleEn: "Advanced Cyber Security Engineering", instructor: "د. خالد السعدني", lessons: 50, students: 3100, hours: 40, level: "Advanced", rating: 4.9, thumb: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600", academicYear: 3, prerequisites: [26] },
];

export const books = [
  // Medicine (طب بشري)
  { id: 1, dept: "medicine" as DeptId, titleAr: "أطلس تشريح الإنسان - غراي", titleEn: "Gray's Anatomy", author: "Henry Gray", pages: 1180, cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400", pdfUrl: "https://ia800205.us.archive.org/31/items/graysanatomy00gray/graysanatomy00gray.pdf" },
  { id: 2, dept: "medicine" as DeptId, titleAr: "مبادئ الطب الباطني لهاريسون", titleEn: "Harrison's Principles of Internal Medicine", author: "Kasper et al.", pages: 2200, cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400", pdfUrl: "https://openstax.org/lexis/book/anatomy-and-physiology/pdf" },
  { id: 3, dept: "medicine" as DeptId, titleAr: "مبادئ الجراحة لشوريتز", titleEn: "Schwartz's Principles of Surgery", author: "F. Brunicardi", pages: 1820, cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400", pdfUrl: "https://openstax.org/lexis/book/microbiology/pdf" },
  { id: 4, dept: "medicine" as DeptId, titleAr: "مرجع نيلسون لطب الأطفال", titleEn: "Nelson Textbook of Pediatrics", author: "Robert Kliegman", pages: 3500, cover: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400", pdfUrl: "https://openstax.org/lexis/book/anatomy-and-physiology/pdf" },

  // Dentistry (طب أسنان)
  { id: 5, dept: "dentistry" as DeptId, titleAr: "تقويم الأسنان المعاصر", titleEn: "Contemporary Orthodontics", author: "William Proffit", pages: 720, cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400", pdfUrl: "https://openstax.org/lexis/book/biology-2e/pdf" },
  { id: 6, dept: "dentistry" as DeptId, titleAr: "جراحة الفم والفكين المتقدمة", titleEn: "Oral & Maxillofacial Surgery", author: "Pedlar & Frame", pages: 680, cover: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400", pdfUrl: "https://openstax.org/lexis/book/anatomy-and-physiology/pdf" },
  { id: 7, dept: "dentistry" as DeptId, titleAr: "علاج أمراض اللثة الإكلينيكي", titleEn: "Carranza's Clinical Periodontology", author: "Michael Newman", pages: 1100, cover: "https://images.unsplash.com/photo-1588776814546-1ffbb172ef98?w=400", pdfUrl: "https://openstax.org/lexis/book/biology-2e/pdf" },

  // Pharmacy (صيدلة)
  { id: 8, dept: "pharmacy" as DeptId, titleAr: "علم الأدوية الأساسي والسريري - كاتزنغ", titleEn: "Basic & Clinical Pharmacology", author: "Bertram Katzung", pages: 1200, cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400", pdfUrl: "https://openstax.org/lexis/book/chemistry-2e/pdf" },
  { id: 9, dept: "pharmacy" as DeptId, titleAr: "الكيمياء الدوائية العضوية لفووي", titleEn: "Foye's Principles of Medicinal Chemistry", author: "Thomas Lemke", pages: 1450, cover: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400", pdfUrl: "https://openstax.org/lexis/book/chemistry-2e/pdf" },
  { id: 10, dept: "pharmacy" as DeptId, titleAr: "الصيدلة الإكلينيكية والعلاجات", titleEn: "Clinical Pharmacy & Therapeutics", author: "Roger Walker", pages: 980, cover: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400", pdfUrl: "https://openstax.org/lexis/book/microbiology/pdf" },

  // Veterinary (طب بيطري)
  { id: 11, dept: "veterinary" as DeptId, titleAr: "الطب البيطري الشامل لبلود", titleEn: "Veterinary Medicine: A Textbook", author: "Blood & Radostits", pages: 1800, cover: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400", pdfUrl: "https://openstax.org/lexis/book/biology-2e/pdf" },
  { id: 12, dept: "veterinary" as DeptId, titleAr: "تشريح الكلب لميلر", titleEn: "Miller's Anatomy of the Dog", author: "Howard Evans", pages: 1040, cover: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400", pdfUrl: "https://openstax.org/lexis/book/anatomy-and-physiology/pdf" },
  { id: 13, dept: "veterinary" as DeptId, titleAr: "مرجع ميرك البيطري", titleEn: "The Merck Veterinary Manual", author: "Merck Editorial Staff", pages: 3000, cover: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400", pdfUrl: "https://openstax.org/lexis/book/biology-2e/pdf" },

  // Nursing (تمريض)
  { id: 14, dept: "nursing" as DeptId, titleAr: "أساسيات التمريض لبوتر وبيري", titleEn: "Potter & Perry's Fundamentals of Nursing", author: "Patricia Potter", pages: 1400, cover: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400", pdfUrl: "https://openstax.org/lexis/book/anatomy-and-physiology/pdf" },
  { id: 15, dept: "nursing" as DeptId, titleAr: "تمريض الباطنة والجراحة لبرونر", titleEn: "Brunner & Suddarth's Medical-Surgical Nursing", author: "Janice Hinkle", pages: 2300, cover: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400", pdfUrl: "https://openstax.org/lexis/book/microbiology/pdf" },
  { id: 16, dept: "nursing" as DeptId, titleAr: "تمريض الرعاية الحرجة لوردن", titleEn: "Critical Care Nursing", author: "Linda Urden", pages: 1120, cover: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=400", pdfUrl: "https://openstax.org/lexis/book/anatomy-and-physiology/pdf" },

  // Science (علوم)
  { id: 17, dept: "science" as DeptId, titleAr: "فيزياء الجامعة ليونغ", titleEn: "University Physics", author: "Hugh Young", pages: 1600, cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400", pdfUrl: "https://openstax.org/lexis/book/university-physics-volume-1/pdf" },
  { id: 18, dept: "science" as DeptId, titleAr: "الكيمياء العضوية لكلايدن", titleEn: "Organic Chemistry", author: "Jonathan Clayden", pages: 1264, cover: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400", pdfUrl: "https://openstax.org/lexis/book/organic-chemistry/pdf" },
  { id: 19, dept: "science" as DeptId, titleAr: "الرياضيات الهندسية المتقدمة", titleEn: "Advanced Engineering Mathematics", author: "Erwin Kreyszig", pages: 1270, cover: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400", pdfUrl: "https://openstax.org/lexis/book/calculus-volume-1/pdf" },

  // Engineering (هندسة)
  { id: 20, dept: "engineering" as DeptId, titleAr: "ميكانيكا المواد لبير", titleEn: "Mechanics of Materials", author: "Ferdinand Beer", pages: 860, cover: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=400", pdfUrl: "https://openstax.org/lexis/book/university-physics-volume-1/pdf" },
  { id: 21, dept: "engineering" as DeptId, titleAr: "أساسيات الدوائر الكهربائية", titleEn: "Fundamentals of Electric Circuits", author: "Charles Alexander", pages: 950, cover: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400", pdfUrl: "https://openstax.org/lexis/book/university-physics-volume-2/pdf" },
  { id: 22, dept: "engineering" as DeptId, titleAr: "التحليل الإنشائي لهيبلر", titleEn: "Structural Analysis", author: "Russell Hibbeler", pages: 1020, cover: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400", pdfUrl: "https://openstax.org/lexis/book/university-physics-volume-1/pdf" },

  // Computers & AI (حاسبات وذكاء اصطناعي)
  { id: 23, dept: "computers" as DeptId, titleAr: "الذكاء الاصطناعي: مقاربة حديثة", titleEn: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", pages: 1100, cover: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400", pdfUrl: "https://openstax.org/lexis/book/introduction-to-python-programming/pdf" },
  { id: 24, dept: "computers" as DeptId, titleAr: "مقدمة في الخوارزميات (CLRS)", titleEn: "Introduction to Algorithms", author: "Thomas Cormen", pages: 1300, cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400", pdfUrl: "https://openstax.org/lexis/book/introduction-to-python-programming/pdf" },
  { id: 25, dept: "computers" as DeptId, titleAr: "هندسة البرمجيات لسامرفيل", titleEn: "Software Engineering", author: "Ian Sommerville", pages: 850, cover: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400", pdfUrl: "https://openstax.org/lexis/book/introduction-to-python-programming/pdf" },
  { id: 26, dept: "computers" as DeptId, titleAr: "تعلم الآلة بالبايثون", titleEn: "Hands-On Machine Learning with Scikit-Learn", author: "Aurélien Géron", pages: 800, cover: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400", pdfUrl: "https://openstax.org/lexis/book/introduction-to-python-programming/pdf" },
];

export const quizzes = [
  { id: 1, dept: "medicine" as DeptId, titleAr: "اختبار التشريح الوصفي", titleEn: "Descriptive Anatomy Quiz", difficulty: "easy" as const, questions: [
    { qAr: "كم عظمة في جسم الإنسان البالغ؟", qEn: "How many bones in adult body?", options: ["150", "206", "250", "300"], correct: 1 },
    { qAr: "أي عضو ينتج الإنسولين؟", qEn: "Which organ produces insulin?", options: ["Liver", "Kidney", "Pancreas", "Spleen"], correct: 2 },
    { qAr: "أكبر عضو في جسم الإنسان؟", qEn: "Largest organ in human body?", options: ["Liver", "Lung", "Skin", "Brain"], correct: 2 },
  ]},
  { id: 2, dept: "pharmacy" as DeptId, titleAr: "اختبار علم الأدوية", titleEn: "Pharmacology Quiz", difficulty: "medium" as const, questions: [
    { qAr: "البنسلين نوع من؟", qEn: "Penicillin is?", options: ["Bacteriostatic", "Bactericidal", "Antifungal", "Antiviral"], correct: 1 },
    { qAr: "LD50 تعني؟", qEn: "LD50 means?", options: ["50% effective dose", "50% lethal dose", "50mg dose", "50% absorbed"], correct: 1 },
  ]},
  { id: 3, dept: "computers" as DeptId, titleAr: "اختبار هياكل البيانات", titleEn: "Data Structures Quiz", difficulty: "hard" as const, questions: [
    { qAr: "ما هو تعقيد الوقت للبحث الثنائي؟", qEn: "Time complexity of Binary Search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correct: 1 },
    { qAr: "أي هيكل بيانات يستخدم LIFO؟", qEn: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Linked List", "Tree"], correct: 1 },
  ]},
];

export const exams = [
  { id: 1, dept: "medicine" as DeptId, titleAr: "امتحان التشريح النهائي", titleEn: "Final Anatomy Exam", duration: 120, questions: 80 },
  { id: 2, dept: "pharmacy" as DeptId, titleAr: "امتحان علم الأدوية النهائي", titleEn: "Pharmacology Final", duration: 90, questions: 60 },
  { id: 3, dept: "computers" as DeptId, titleAr: "امتحان هياكل البيانات والخوارزميات", titleEn: "Data Structures Final Exam", duration: 120, questions: 50 },
];

export const liveClasses = [
  { id: 1, dept: "medicine" as DeptId, titleAr: "ورشة الجراحة المنظارية", titleEn: "Laparoscopic Surgery Workshop", instructor: "Prof. Ahmed Shalaby", time: "2026-05-05T18:00:00", isLive: true },
  { id: 2, dept: "dentistry" as DeptId, titleAr: "جلسة تقويم الأسنان التطبيقية", titleEn: "Orthodontics Live Session", instructor: "Dr. Hanan Fares", time: "2026-05-06T20:00:00", isLive: false },
  { id: 3, dept: "pharmacy" as DeptId, titleAr: "ورشة التصنيع الدوائي", titleEn: "Drug Manufacturing Workshop", instructor: "Prof. Bassem Adel", time: "2026-05-07T19:00:00", isLive: false },
  { id: 4, dept: "computers" as DeptId, titleAr: "بناء نموذج ذكاء اصطناعي مباشر", titleEn: "Build AI Model Live", instructor: "Prof. Sami Galal", time: "2026-05-08T17:00:00", isLive: true },
  { id: 5, dept: "science" as DeptId, titleAr: "تجارب الكيمياء المتقدمة", titleEn: "Advanced Chemistry Lab Live", instructor: "Prof. Karim Wael", time: "2026-05-09T19:00:00", isLive: false },
  { id: 6, dept: "engineering" as DeptId, titleAr: "تصميم الإنشاءات الحديثة", titleEn: "Modern Structural Design Live", instructor: "Dr. Nourhan Ezz", time: "2026-05-10T16:00:00", isLive: true },
];

export const lectures = [
  { id: 1, dept: "medicine" as DeptId, titleAr: "مقدمة في التشريح البشري", titleEn: "Intro to Human Anatomy", duration: "18:30", thumb: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600" },
  { id: 2, dept: "medicine" as DeptId, titleAr: "الجهاز القلبي الوعائي", titleEn: "Cardiovascular System", duration: "24:15", thumb: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600" },
  { id: 3, dept: "dentistry" as DeptId, titleAr: "تشريح الفم والفكين", titleEn: "Oral & Jaw Anatomy", duration: "20:45", thumb: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600" },
  { id: 4, dept: "pharmacy" as DeptId, titleAr: "آليات عمل الأدوية", titleEn: "Drug Mechanisms of Action", duration: "22:10", thumb: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600" },
  { id: 5, dept: "science" as DeptId, titleAr: "الجاذبية والميكانيكا", titleEn: "Gravity & Mechanics", duration: "28:00", thumb: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600" },
  { id: 6, dept: "engineering" as DeptId, titleAr: "مبادئ الهندسة الإنشائية", titleEn: "Structural Engineering Basics", duration: "31:40", thumb: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600" },
  { id: 7, dept: "computers" as DeptId, titleAr: "الشبكات العصبية العميقة", titleEn: "Deep Neural Networks", duration: "35:20", thumb: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600" },
  { id: 8, dept: "veterinary" as DeptId, titleAr: "أمراض الحيوانات الشائعة", titleEn: "Common Animal Diseases", duration: "19:55", thumb: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600" },
];

export const testimonials = [
  { id: 1, nameAr: "محمد علي", nameEn: "Mohamed Ali", role: "Full Stack Developer @ Google", textAr: "أفضل منصة تعليمية تقنية! غيرت مساري المهني تماماً وحصلت على وظيفة أحلامي.", textEn: "Best tech learning platform! Changed my career and landed my dream job.", rating: 5 },
  { id: 2, nameAr: "نورا حسن", nameEn: "Nora Hassan", role: "Security Analyst @ Microsoft", textAr: "محتوى عالي الجودة ومدربون محترفون. أنصح بها بشدة لكل من يريد التميز.", textEn: "High quality content and expert instructors. Highly recommended for excellence.", rating: 5 },
  { id: 3, nameAr: "كريم سامي", nameEn: "Karim Samy", role: "Network Engineer @ Cisco", textAr: "تعلمت أكثر هنا في 3 شهور من سنوات في الجامعة!", textEn: "Learned more here in 3 months than years in college!", rating: 5 },
  { id: 4, nameAr: "سلمى أحمد", nameEn: "Salma Ahmed", role: "AI Researcher @ Meta", textAr: "البرنامج التعليمي والمشاريع العملية ساعدتني أحصل على منحة دراسية.", textEn: "The curriculum and hands-on projects helped me get a scholarship.", rating: 5 },
];

export const stats = [
  { value: "25K+", labelKey: "stats.students" },
  { value: "350+", labelKey: "stats.courses" },
  { value: "120+", labelKey: "stats.instructors" },
  { value: "5K+", labelKey: "stats.hours" },
] as const;

// University-specific data
export const faculties = [
  // الصف الأول (Row 1)
  { id: "medicine", nameAr: "كلية الطب البشري", nameEn: "Faculty of Medicine", icon: "Stethoscope", depts: ["medicine"] as DeptId[] },
  { id: "dentistry", nameAr: "كلية طب الأسنان", nameEn: "Faculty of Dentistry", icon: "SmilePlus", depts: ["dentistry"] as DeptId[] },
  { id: "nursing", nameAr: "كلية التمريض", nameEn: "Faculty of Nursing", icon: "HeartPulse", depts: ["nursing"] as DeptId[] },
  { id: "science", nameAr: "كلية العلوم", nameEn: "Faculty of Science", icon: "Atom", depts: ["science"] as DeptId[] },
  // الصف الثاني (Row 2)
  { id: "pharmacy", nameAr: "كلية الصيدلة", nameEn: "Faculty of Pharmacy", icon: "FlaskConical", depts: ["pharmacy"] as DeptId[] },
  { id: "veterinary", nameAr: "كلية الطب البيطري", nameEn: "Faculty of Veterinary Medicine", icon: "PawPrint", depts: ["veterinary"] as DeptId[] },
  { id: "engineering", nameAr: "كلية الهندسة", nameEn: "Faculty of Engineering", icon: "HardHat", depts: ["engineering"] as DeptId[] },
  { id: "computers", nameAr: "كلية الحاسبات والذكاء الاصطناعي", nameEn: "Faculty of Computers & AI", icon: "BrainCircuit", depts: ["computers"] as DeptId[] },
];

export const newsItems = [
  { id: 1, titleAr: "افتتاح مختبر الذكاء الاصطناعي الجديد", titleEn: "New AI Lab Inaugurated", dateAr: "أبريل 2026", dateEn: "April 2026", category: "events" },
  { id: 2, titleAr: "شراكة استراتيجية مع شركات عالمية", titleEn: "Strategic Partnership with Global Firms", dateAr: "مارس 2026", dateEn: "March 2026", category: "news" },
  { id: 3, titleAr: "منح دراسية كاملة للمتفوقين", titleEn: "Full Scholarships for Top Students", dateAr: "فبراير 2026", dateEn: "February 2026", category: "scholarships" },
];

// Academic Subjects
export { subjects } from "./subjects-data";


// Dashboard mock data
export const studentSchedule = [
  { day: "sun", dayAr: "الأحد", dayEn: "Sunday", classes: [
    { time: "09:00", titleAr: "تطوير الويب", titleEn: "Web Development", room: "Lab 201", instructor: "Dr. Mona Adel", courseId: 5 },
    { time: "11:00", titleAr: "خوارزميات", titleEn: "Algorithms", room: "Hall A", instructor: "Prof. Tarek", courseId: 5 },
  ]},
  { day: "mon", dayAr: "الإثنين", dayEn: "Monday", classes: [
    { time: "10:00", titleAr: "قواعد البيانات", titleEn: "Databases", room: "Lab 105", instructor: "Prof. Nader", courseId: 12 },
    { time: "13:00", titleAr: "React متقدم", titleEn: "Advanced React", room: "Lab 201", instructor: "Dr. Layla", courseId: 7 },
  ]},
  { day: "tue", dayAr: "الثلاثاء", dayEn: "Tuesday", classes: [
    { time: "09:00", titleAr: "أمن الشبكات", titleEn: "Network Security", room: "Hall B", instructor: "Dr. Sara", courseId: 3 },
  ]},
  { day: "wed", dayAr: "الأربعاء", dayEn: "Wednesday", classes: [
    { time: "11:00", titleAr: "تعلم الآلة", titleEn: "Machine Learning", room: "AI Lab", instructor: "Dr. Hanan", courseId: 9 },
    { time: "14:00", titleAr: "مشروع التخرج", titleEn: "Graduation Project", room: "Studio", instructor: "Multiple", courseId: 5 },
  ]},
  { day: "thu", dayAr: "الخميس", dayEn: "Thursday", classes: [
    { time: "10:00", titleAr: "تصميم UI/UX", titleEn: "UI/UX Design", room: "Design Lab", instructor: "Dr. Dina", courseId: 13 },
  ]},
];

export const studentAssignments = [
  { id: 1, titleAr: "مشروع React: متجر إلكتروني", titleEn: "React Project: E-commerce Store", course: "Full Stack Web", due: "2026-04-25", status: "pending" as const, score: null },
  { id: 2, titleAr: "تقرير أمن الشبكات", titleEn: "Network Security Report", course: "Cybersecurity", due: "2026-04-23", status: "pending" as const, score: null },
  { id: 3, titleAr: "تطبيق Machine Learning", titleEn: "ML Classification Model", course: "AI Fundamentals", due: "2026-04-30", status: "pending" as const, score: null },
  { id: 4, titleAr: "تحليل بيانات Pandas", titleEn: "Pandas Data Analysis", course: "Data Science", due: "2026-04-15", status: "submitted" as const, score: 92 },
  { id: 5, titleAr: "مخطط ER لقاعدة بيانات", titleEn: "Database ER Diagram", course: "Databases", due: "2026-04-10", status: "submitted" as const, score: 88 },
  { id: 6, titleAr: "اختبار TCP/IP", titleEn: "TCP/IP Quiz", course: "Networking", due: "2026-04-05", status: "submitted" as const, score: 95 },
];

export const studentGrades = [
  { course: "Full Stack Web Development", code: "CS-301", credits: 3, grade: "A", points: 4.0 },
  { course: "Machine Learning", code: "AI-401", credits: 4, grade: "A-", points: 3.7 },
  { course: "Database Systems", code: "DB-201", credits: 3, grade: "B+", points: 3.3 },
  { course: "Network Security", code: "SEC-302", credits: 3, grade: "A", points: 4.0 },
  { course: "UI/UX Design", code: "DES-101", credits: 2, grade: "A", points: 4.0 },
];

export const studentNotifications = [
  { id: 1, titleAr: "نتيجة الكويز جاهزة", titleEn: "Quiz result available", time: "5m", type: "info" as const },
  { id: 2, titleAr: "لايف يبدأ خلال ساعة", titleEn: "Live class in 1 hour", time: "1h", type: "warning" as const },
  { id: 3, titleAr: "تم رفع محتوى جديد", titleEn: "New content uploaded", time: "3h", type: "success" as const },
  { id: 4, titleAr: "موعد تسليم اقترب", titleEn: "Assignment deadline soon", time: "1d", type: "warning" as const },
];

export const studentAchievements = [
  { id: 1, titleAr: "أول كورس مكتمل", titleEn: "First Course Done", icon: "Trophy", earned: true },
  { id: 2, titleAr: "5 كويزات بنجاح", titleEn: "5 Quizzes Aced", icon: "Star", earned: true },
  { id: 3, titleAr: "حضور 10 لايف", titleEn: "10 Live Sessions", icon: "Video", earned: true },
  { id: 4, titleAr: "متفوق الشهر", titleEn: "Top Student Month", icon: "Award", earned: false },
  { id: 5, titleAr: "100 ساعة تعلم", titleEn: "100 Hours Learning", icon: "Clock", earned: false },
  { id: 6, titleAr: "إنجاز مشروع كبير", titleEn: "Big Project Done", icon: "Rocket", earned: false },
];
