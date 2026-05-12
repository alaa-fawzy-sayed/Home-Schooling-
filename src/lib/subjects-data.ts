import type { DeptId } from "./mock-data";

export const subjects = [
  // --------------------------------------------------------------------------------
  // Faculty of Computers & AI (كلية الحاسبات والذكاء الاصطناعي)
  // --------------------------------------------------------------------------------
  
  // Year 1 - Semester 1
  { id: 101, code: "CS101", dept: "computers" as DeptId, titleAr: "مقدمة في علوم الحاسب", titleEn: "Intro to Computer Science", credits: 3, academicYear: 1, semester: 1, type: "faculty", prerequisites: [] },
  { id: 102, code: "PRG101", dept: "computers" as DeptId, titleAr: "برمجة 1 (C++)", titleEn: "Programming I (C++)", credits: 4, academicYear: 1, semester: 1, type: "major", prerequisites: [] },
  { id: 103, code: "MAT101", dept: "computers" as DeptId, titleAr: "رياضيات 1 (تفاضل وتكامل)", titleEn: "Calculus I", credits: 3, academicYear: 1, semester: 1, type: "faculty", prerequisites: [] },
  { id: 104, code: "PHY101", dept: "computers" as DeptId, titleAr: "فيزياء 1 (ميكانيكا)", titleEn: "Physics I (Mechanics)", credits: 3, academicYear: 1, semester: 1, type: "faculty", prerequisites: [] },
  { id: 105, code: "ENG101", dept: "computers" as DeptId, titleAr: "لغة إنجليزية 1", titleEn: "English I", credits: 2, academicYear: 1, semester: 1, type: "university", prerequisites: [] },
  { id: 106, code: "HUM101", dept: "computers" as DeptId, titleAr: "حقوق إنسان", titleEn: "Human Rights", credits: 2, academicYear: 1, semester: 1, type: "university", prerequisites: [] },

  // Year 1 - Semester 2
  { id: 111, code: "PRG102", dept: "computers" as DeptId, titleAr: "برمجة 2 (OOP)", titleEn: "Programming II (OOP)", credits: 4, academicYear: 1, semester: 2, type: "major", prerequisites: [102] },
  { id: 112, code: "MAT102", dept: "computers" as DeptId, titleAr: "رياضيات 2 (جبر خطي)", titleEn: "Linear Algebra", credits: 3, academicYear: 1, semester: 2, type: "faculty", prerequisites: [103] },
  { id: 113, code: "PHY102", dept: "computers" as DeptId, titleAr: "فيزياء 2 (كهربية ومغناطيسية)", titleEn: "Physics II", credits: 3, academicYear: 1, semester: 2, type: "faculty", prerequisites: [104] },
  { id: 114, code: "LOG101", dept: "computers" as DeptId, titleAr: "تصميم منطقي", titleEn: "Logic Design", credits: 3, academicYear: 1, semester: 2, type: "major", prerequisites: [101] },
  { id: 115, code: "ENG102", dept: "computers" as DeptId, titleAr: "لغة إنجليزية 2", titleEn: "English II", credits: 2, academicYear: 1, semester: 2, type: "university", prerequisites: [105] },

  // Year 2 - Semester 1
  { id: 201, code: "DS201", dept: "computers" as DeptId, titleAr: "هياكل البيانات", titleEn: "Data Structures", credits: 4, academicYear: 2, semester: 1, type: "major", prerequisites: [111] },
  { id: 202, code: "MAT201", dept: "computers" as DeptId, titleAr: "رياضيات متقطعة", titleEn: "Discrete Mathematics", credits: 3, academicYear: 2, semester: 1, type: "faculty", prerequisites: [112] },
  { id: 203, code: "IS201", dept: "computers" as DeptId, titleAr: "مقدمة في نظم المعلومات", titleEn: "Intro to IS", credits: 3, academicYear: 2, semester: 1, type: "major", prerequisites: [101] },
  { id: 204, code: "ARC201", dept: "computers" as DeptId, titleAr: "معمارية الحاسب", titleEn: "Computer Architecture", credits: 3, academicYear: 2, semester: 1, type: "major", prerequisites: [114] },
  { id: 205, code: "STAT201", dept: "computers" as DeptId, titleAr: "إحصاء واحتمالات", titleEn: "Probabilities & Statistics", credits: 3, academicYear: 2, semester: 1, type: "faculty", prerequisites: [112] },

  // Year 2 - Semester 2
  { id: 211, code: "ALG202", dept: "computers" as DeptId, titleAr: "تصميم وتحليل الخوارزميات", titleEn: "Algorithms", credits: 4, academicYear: 2, semester: 2, type: "major", prerequisites: [201, 202] },
  { id: 212, code: "DB202", dept: "computers" as DeptId, titleAr: "نظم إدارة قواعد البيانات 1", titleEn: "Database Systems I", credits: 4, academicYear: 2, semester: 2, type: "major", prerequisites: [201, 203] },
  { id: 213, code: "SWE201", dept: "computers" as DeptId, titleAr: "هندسة البرمجيات 1", titleEn: "Software Engineering I", credits: 3, academicYear: 2, semester: 2, type: "major", prerequisites: [111] },
  { id: 214, code: "OS202", dept: "computers" as DeptId, titleAr: "نظم التشغيل", titleEn: "Operating Systems", credits: 4, academicYear: 2, semester: 2, type: "major", prerequisites: [201, 204] },
  { id: 215, code: "PRO201", dept: "computers" as DeptId, titleAr: "مهارات التواصل", titleEn: "Communication Skills", credits: 2, academicYear: 2, semester: 2, type: "university", prerequisites: [] },

  // Year 3 - Semester 1
  { id: 301, code: "NW301", dept: "computers" as DeptId, titleAr: "شبكات الحاسب 1", titleEn: "Computer Networks I", credits: 4, academicYear: 3, semester: 1, type: "major", prerequisites: [214] },
  { id: 302, code: "AI301", dept: "computers" as DeptId, titleAr: "الذكاء الاصطناعي", titleEn: "Artificial Intelligence", credits: 4, academicYear: 3, semester: 1, type: "major", prerequisites: [211] },
  { id: 303, code: "WEB301", dept: "computers" as DeptId, titleAr: "برمجة الويب", titleEn: "Web Programming", credits: 3, academicYear: 3, semester: 1, type: "major", prerequisites: [212] },
  { id: 304, code: "DB302", dept: "computers" as DeptId, titleAr: "نظم إدارة قواعد البيانات 2", titleEn: "Database Systems II", credits: 3, academicYear: 3, semester: 1, type: "major", prerequisites: [212] },
  { id: 305, code: "OR301", dept: "computers" as DeptId, titleAr: "بحوث العمليات", titleEn: "Operations Research", credits: 3, academicYear: 3, semester: 1, type: "faculty", prerequisites: [205] },

  // Year 3 - Semester 2
  { id: 311, code: "CG302", dept: "computers" as DeptId, titleAr: "الرسم بالحاسب", titleEn: "Computer Graphics", credits: 3, academicYear: 3, semester: 2, type: "major", prerequisites: [112, 211] },
  { id: 312, code: "SEC302", dept: "computers" as DeptId, titleAr: "أمن المعلومات", titleEn: "Information Security", credits: 3, academicYear: 3, semester: 2, type: "major", prerequisites: [301] },
  { id: 313, code: "ML302", dept: "computers" as DeptId, titleAr: "تعلم الآلة", titleEn: "Machine Learning", credits: 4, academicYear: 3, semester: 2, type: "major", prerequisites: [302, 205] },
  { id: 314, code: "PL302", dept: "computers" as DeptId, titleAr: "مفاهيم لغات البرمجة", titleEn: "Programming Languages Concepts", credits: 3, academicYear: 3, semester: 2, type: "major", prerequisites: [201] },
  { id: 315, code: "HCI302", dept: "computers" as DeptId, titleAr: "التفاعل بين الإنسان والحاسب", titleEn: "Human Computer Interaction", credits: 3, academicYear: 3, semester: 2, type: "major", prerequisites: [213] },

  // Year 4 - Semester 1
  { id: 401, code: "PRJ401", dept: "computers" as DeptId, titleAr: "مشروع التخرج 1", titleEn: "Graduation Project I", credits: 3, academicYear: 4, semester: 1, type: "major", prerequisites: [213, 313] },
  { id: 402, code: "NLP401", dept: "computers" as DeptId, titleAr: "معالجة اللغات الطبيعية", titleEn: "NLP", credits: 3, academicYear: 4, semester: 1, type: "major", prerequisites: [313] },
  { id: 403, code: "CV401", dept: "computers" as DeptId, titleAr: "الرؤية بالحاسب", titleEn: "Computer Vision", credits: 3, academicYear: 4, semester: 1, type: "major", prerequisites: [311, 313] },
  { id: 404, code: "COMP401", dept: "computers" as DeptId, titleAr: "المترجمات", titleEn: "Compilers", credits: 3, academicYear: 4, semester: 1, type: "major", prerequisites: [314] },
  { id: 405, code: "ETH401", dept: "computers" as DeptId, titleAr: "أخلاقيات الحوسبة", titleEn: "Computing Ethics", credits: 2, academicYear: 4, semester: 1, type: "university", prerequisites: [] },

  // Year 4 - Semester 2
  { id: 411, code: "PRJ402", dept: "computers" as DeptId, titleAr: "مشروع التخرج 2", titleEn: "Graduation Project II", credits: 4, academicYear: 4, semester: 2, type: "major", prerequisites: [401] },
  { id: 412, code: "DS402", dept: "computers" as DeptId, titleAr: "علم البيانات الكبيرة", titleEn: "Big Data", credits: 3, academicYear: 4, semester: 2, type: "major", prerequisites: [304, 313] },
  { id: 413, code: "CC402", dept: "computers" as DeptId, titleAr: "الحوسبة السحابية", titleEn: "Cloud Computing", credits: 3, academicYear: 4, semester: 2, type: "major", prerequisites: [301, 214] },
  { id: 414, code: "PM402", dept: "computers" as DeptId, titleAr: "إدارة المشاريع", titleEn: "Project Management", credits: 3, academicYear: 4, semester: 2, type: "faculty", prerequisites: [213] },
  { id: 415, code: "ENT402", dept: "computers" as DeptId, titleAr: "ريادة الأعمال", titleEn: "Entrepreneurship", credits: 2, academicYear: 4, semester: 2, type: "university", prerequisites: [] },

  // --------------------------------------------------------------------------------
  // Add some fallback generic subjects for other departments so it looks populated
  // --------------------------------------------------------------------------------
  ...["medicine", "dentistry", "nursing", "science", "pharmacy", "veterinary", "engineering"].flatMap(d => {
    const deptId = d as DeptId;
    let index = 1;
    let result = [];
    for (let y = 1; y <= 4; y++) {
      for (let s = 1; s <= 2; s++) {
        for (let c = 1; c <= 5; c++) {
          result.push({
            id: parseInt(`9${y}${s}${c}${d.charCodeAt(0)}`),
            code: `${d.substring(0,3).toUpperCase()}${y}0${c}`,
            dept: deptId,
            titleAr: `مقرر ${d} ${y}-${s}-${c}`,
            titleEn: `${d} Subject ${y}-${s}-${c}`,
            credits: 3,
            academicYear: y,
            semester: s,
            type: c === 1 ? "university" : c === 2 ? "faculty" : "major",
            prerequisites: y > 1 ? [parseInt(`9${y-1}${s}${c}${d.charCodeAt(0)}`)] : []
          });
        }
      }
    }
    return result;
  })
];
