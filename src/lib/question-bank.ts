export interface Question {
  qAr: string;
  qEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correct: number;
}

export const questionBank: Record<string, Question[]> = {
  medicine: [
    { qAr: "كم عدد العظام في جسم الإنسان البالغ؟", qEn: "How many bones are in the adult human body?", optionsAr: ["206", "208", "210", "212"], optionsEn: ["206", "208", "210", "212"], correct: 0 },
    { qAr: "أي عضو ينتج الإنسولين؟", qEn: "Which organ produces insulin?", optionsAr: ["الكبد", "البنكرياس", "الكلى", "المعدة"], optionsEn: ["Liver", "Pancreas", "Kidney", "Stomach"], correct: 1 },
    { qAr: "ما هو أكبر عضو في جسم الإنسان؟", qEn: "What is the largest organ in the human body?", optionsAr: ["القلب", "الكبد", "الجلد", "الرئتين"], optionsEn: ["Heart", "Liver", "Skin", "Lungs"], correct: 2 },
    { qAr: "أي جزء من الخلية هو مركز الطاقة؟", qEn: "Which part of the cell is the powerhouse?", optionsAr: ["النواة", "الميتوكوندريا", "الريبوسوم", "الغشاء البلازمي"], optionsEn: ["Nucleus", "Mitochondria", "Ribosome", "Cell Membrane"], correct: 1 },
    { qAr: "ما هي فصيلة الدم التي تعتبر المعطي العام؟", qEn: "Which blood type is the universal donor?", optionsAr: ["A", "B", "AB", "O"], optionsEn: ["A", "B", "AB", "O"], correct: 3 },
    { qAr: "ما هو الفيتامين الذي يتم إنتاجه عند التعرض للشمس؟", qEn: "Which vitamin is produced upon sun exposure?", optionsAr: ["فيتامين أ", "فيتامين ب", "فيتامين ج", "فيتامين د"], optionsEn: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], correct: 3 },
    { qAr: "أين تقع الغدة النخامية؟", qEn: "Where is the pituitary gland located?", optionsAr: ["الرقبة", "الدماغ", "الصدر", "البطن"], optionsEn: ["Neck", "Brain", "Chest", "Abdomen"], correct: 1 },
    { qAr: "ما هو الشريان الرئيسي الذي يحمل الدم من القلب؟", qEn: "What is the main artery that carries blood from the heart?", optionsAr: ["الشريان الأورطي", "الشريان الرئوي", "الوريد الأجوف", "الشريان السباتي"], optionsEn: ["Aorta", "Pulmonary Artery", "Vena Cava", "Carotid Artery"], correct: 0 },
    { qAr: "كم عدد غرف قلب الإنسان؟", qEn: "How many chambers does the human heart have?", optionsAr: ["2", "3", "4", "5"], optionsEn: ["2", "3", "4", "5"], correct: 2 },
    { qAr: "ما هو البروتين المسؤول عن نقل الأكسجين في الدم؟", qEn: "What protein is responsible for carrying oxygen in the blood?", optionsAr: ["الكولاجين", "الهيموجلوبين", "الكيراتين", "الإنزيم"], optionsEn: ["Collagen", "Hemoglobin", "Keratin", "Enzyme"], correct: 1 },
    { qAr: "أي من التالي هو أصغر عظمة في جسم الإنسان؟", qEn: "Which of the following is the smallest bone in the human body?", optionsAr: ["عظمة الفخذ", "الركاب (في الأذن)", "عظمة الترقوة", "لوح الكتف"], optionsEn: ["Femur", "Stapes (in ear)", "Clavicle", "Scapula"], correct: 1 },
    { qAr: "أي جزء من الدماغ مسؤول عن التوازن؟", qEn: "Which part of the brain is responsible for balance?", optionsAr: ["المخيخ", "المخ", "جذع الدماغ", "المهاد"], optionsEn: ["Cerebellum", "Cerebrum", "Brainstem", "Thalamus"], correct: 0 }
  ],
  pharmacy: [
    { qAr: "ما هو تصنيف دواء البنسلين؟", qEn: "What is the classification of Penicillin?", optionsAr: ["مسكن", "مضاد حيوي", "مضاد فيروسات", "مضاد فطريات"], optionsEn: ["Analgesic", "Antibiotic", "Antiviral", "Antifungal"], correct: 1 },
    { qAr: "ما هو الاستخدام الرئيسي للباراسيتامول؟", qEn: "What is the primary use of Paracetamol?", optionsAr: ["خفض الحرارة وتسكين الألم", "علاج العدوى", "خفض ضغط الدم", "علاج الحساسية"], optionsEn: ["Antipyretic and Analgesic", "Treat Infection", "Lower Blood Pressure", "Treat Allergy"], correct: 0 },
    { qAr: "ماذا تعني اختصار NSAID؟", qEn: "What does NSAID stand for?", optionsAr: ["أدوية غير ستيرويدية مضادة للالتهابات", "أدوية ستيرويدية للالتهابات", "أدوية منومة جديدة", "أدوية مضادة للغثيان"], optionsEn: ["Non-Steroidal Anti-Inflammatory Drugs", "Steroidal Anti-Inflammatory Drugs", "New Sleep-inducing Drugs", "Anti-nausea Drugs"], correct: 0 },
    { qAr: "أي من التالي هو دواء مدر للبول؟", qEn: "Which of the following is a diuretic?", optionsAr: ["فيوروسيميد (اللازيكس)", "أموكسيسيلين", "إيبوبروفين", "أوميبرازول"], optionsEn: ["Furosemide (Lasix)", "Amoxicillin", "Ibuprofen", "Omeprazole"], correct: 0 },
    { qAr: "ما هو الترياق للجرعة الزائدة من الباراسيتامول؟", qEn: "What is the antidote for paracetamol overdose?", optionsAr: ["نالوكسون", "فلومازينيل", "إن-أسيتيل سيستين", "أتروبين"], optionsEn: ["Naloxone", "Flumazenil", "N-acetylcysteine", "Atropine"], correct: 2 },
    { qAr: "أي دواء يستخدم لخفض مستويات الكوليسترول؟", qEn: "Which drug is used to lower cholesterol levels?", optionsAr: ["أتورفاستاتين", "ميتفورمين", "أملوديبين", "لوسارتان"], optionsEn: ["Atorvastatin", "Metformin", "Amlodipine", "Losartan"], correct: 0 },
    { qAr: "كيف يعمل دواء الأوميبرازول؟", qEn: "How does Omeprazole work?", optionsAr: ["مضاد لمستقبلات الهيستامين", "مثبط لمضخة البروتون", "مضاد للحموضة الموضعي", "يحفز إفراز المعدة"], optionsEn: ["H2 Receptor Antagonist", "Proton Pump Inhibitor", "Local Antacid", "Stimulates gastric secretion"], correct: 1 },
    { qAr: "ما هو الدواء المفضل لمرض السكري من النوع الثاني؟", qEn: "What is the drug of choice for Type 2 Diabetes?", optionsAr: ["الإنسولين", "ميتفورمين", "جليبنكلاميد", "أكاربوز"], optionsEn: ["Insulin", "Metformin", "Glibenclamide", "Acarbose"], correct: 1 },
    { qAr: "ما هو التأثير الجانبي الشائع لمضادات الهيستامين من الجيل الأول؟", qEn: "What is a common side effect of first-generation antihistamines?", optionsAr: ["الأرق", "النعاس", "فقدان الشهية", "السعال"], optionsEn: ["Insomnia", "Drowsiness", "Anorexia", "Cough"], correct: 1 },
    { qAr: "أي مسار لإعطاء الدواء يوفر التوافر البيولوجي بنسبة 100%؟", qEn: "Which route of administration provides 100% bioavailability?", optionsAr: ["عن طريق الفم", "الوريدي", "العضلي", "تحت الجلد"], optionsEn: ["Oral", "Intravenous", "Intramuscular", "Subcutaneous"], correct: 1 },
    { qAr: "أي فيتامين يعطى عادة مع مكملات الحديد لتحسين الامتصاص؟", qEn: "Which vitamin is usually given with iron supplements to improve absorption?", optionsAr: ["فيتامين أ", "فيتامين ب12", "فيتامين ج", "فيتامين د"], optionsEn: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"], correct: 2 },
    { qAr: "ما هي الوظيفة الأساسية للوارفارين؟", qEn: "What is the primary function of Warfarin?", optionsAr: ["مضاد للتخثر", "مضاد للاكتئاب", "خافض للحرارة", "موسع للقصبات"], optionsEn: ["Anticoagulant", "Antidepressant", "Antipyretic", "Bronchodilator"], correct: 0 }
  ],
  computers: [
    { qAr: "ما هو تعقيد الوقت للبحث الثنائي (Binary Search)؟", qEn: "What is the time complexity of Binary Search?", optionsAr: ["O(1)", "O(n)", "O(log n)", "O(n²)"], optionsEn: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correct: 2 },
    { qAr: "أي من التالي يمثل هيكل بيانات يعمل بنظام LIFO؟", qEn: "Which of the following data structures works on a LIFO principle?", optionsAr: ["الطابور (Queue)", "المكدس (Stack)", "القائمة المترابطة (Linked List)", "الشجرة (Tree)"], optionsEn: ["Queue", "Stack", "Linked List", "Tree"], correct: 1 },
    { qAr: "ما هو الغرض من خوارزمية Dijkstra؟", qEn: "What is the purpose of Dijkstra's algorithm?", optionsAr: ["فرز المصفوفة", "إيجاد أقصر مسار", "تشفير البيانات", "ضغط الملفات"], optionsEn: ["Sorting Array", "Finding Shortest Path", "Encrypting Data", "Compressing Files"], correct: 1 },
    { qAr: "أي من لغات البرمجة التالية تعتبر Object-Oriented؟", qEn: "Which of the following programming languages is Object-Oriented?", optionsAr: ["C", "Java", "Assembly", "HTML"], optionsEn: ["C", "Java", "Assembly", "HTML"], correct: 1 },
    { qAr: "في قواعد البيانات، ماذا يعني مصطلح ACID؟", qEn: "In databases, what does ACID stand for?", optionsAr: ["Atomicity, Consistency, Isolation, Durability", "Array, Class, Integer, Double", "Access, Control, Identify, Delete", "None of the above"], optionsEn: ["Atomicity, Consistency, Isolation, Durability", "Array, Class, Integer, Double", "Access, Control, Identify, Delete", "None of the above"], correct: 0 },
    { qAr: "ما هي بنية البيانات المستخدمة عادة لتمثيل العلاقات بين المدن أو الشبكات؟", qEn: "Which data structure is typically used to represent relationships between cities or networks?", optionsAr: ["المصفوفات (Arrays)", "الجداول (Tables)", "الرسوم البيانية (Graphs)", "المكدسات (Stacks)"], optionsEn: ["Arrays", "Tables", "Graphs", "Stacks"], correct: 2 },
    { qAr: "أي من التالي هو بروتوكول نقل النص التشعبي؟", qEn: "Which of the following is the Hypertext Transfer Protocol?", optionsAr: ["FTP", "SMTP", "HTTP", "TCP"], optionsEn: ["FTP", "SMTP", "HTTP", "TCP"], correct: 2 },
    { qAr: "ما هو نظام التشغيل مفتوح المصدر الأكثر شهرة؟", qEn: "What is the most famous open-source operating system?", optionsAr: ["Windows", "macOS", "Linux", "iOS"], optionsEn: ["Windows", "macOS", "Linux", "iOS"], correct: 2 },
    { qAr: "ماذا يعني مصطلح API؟", qEn: "What does API stand for?", optionsAr: ["Application Programming Interface", "Advanced Program Integration", "Automated Process Interface", "Application Process Integration"], optionsEn: ["Application Programming Interface", "Advanced Program Integration", "Automated Process Interface", "Application Process Integration"], correct: 0 },
    { qAr: "أي جزء من المعالج مسؤول عن أداء العمليات الحسابية والمنطقية؟", qEn: "Which part of the CPU is responsible for arithmetic and logic operations?", optionsAr: ["وحدة التحكم (CU)", "السجلات (Registers)", "وحدة الحساب والمنطق (ALU)", "الذاكرة المخبئية (Cache)"], optionsEn: ["Control Unit (CU)", "Registers", "Arithmetic Logic Unit (ALU)", "Cache Memory"], correct: 2 },
    { qAr: "ما هي لغة الاستعلام المستخدمة عادة للتفاعل مع قواعد البيانات العلائقية؟", qEn: "What query language is typically used to interact with relational databases?", optionsAr: ["HTML", "Python", "SQL", "C++"], optionsEn: ["HTML", "Python", "SQL", "C++"], correct: 2 },
    { qAr: "أي من التالي هو مثال على NoSQL Database؟", qEn: "Which of the following is an example of a NoSQL Database?", optionsAr: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"], optionsEn: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"], correct: 2 }
  ],
  dentistry: [
    { qAr: "كم عدد الأسنان اللبنية عند الأطفال؟", qEn: "How many primary (baby) teeth do children have?", optionsAr: ["20", "24", "28", "32"], optionsEn: ["20", "24", "28", "32"], correct: 0 },
    { qAr: "أي جزء من السن يحتوي على الأعصاب والأوعية الدموية؟", qEn: "Which part of the tooth contains the nerves and blood vessels?", optionsAr: ["المينا", "العاج", "اللب", "الملاط"], optionsEn: ["Enamel", "Dentin", "Pulp", "Cementum"], correct: 2 },
    { qAr: "ما هو أصعب نسيج في جسم الإنسان؟", qEn: "What is the hardest tissue in the human body?", optionsAr: ["العظام", "المينا", "العاج", "الغضروف"], optionsEn: ["Bone", "Enamel", "Dentin", "Cartilage"], correct: 1 },
    { qAr: "ما هو تخصص طب الأسنان الذي يتعامل مع تقويم الأسنان المائلة؟", qEn: "Which dental specialty deals with straightening crooked teeth?", optionsAr: ["طب لب الأسنان", "تقويم الأسنان", "جراحة الفم", "طب أسنان الأطفال"], optionsEn: ["Endodontics", "Orthodontics", "Oral Surgery", "Pediatric Dentistry"], correct: 1 },
    { qAr: "ما هو المعدن السائل المستخدم أحيانا في حشوات الملغم (الأملغم)؟", qEn: "What liquid metal is sometimes used in amalgam fillings?", optionsAr: ["الرصاص", "الفضة", "الزئبق", "الذهب"], optionsEn: ["Lead", "Silver", "Mercury", "Gold"], correct: 2 }
  ],
  science: [
    { qAr: "ما هو الرمز الكيميائي للذهب؟", qEn: "What is the chemical symbol for gold?", optionsAr: ["Ag", "Au", "Pb", "Fe"], optionsEn: ["Ag", "Au", "Pb", "Fe"], correct: 1 },
    { qAr: "من هو واضع نظرية النسبية؟", qEn: "Who developed the theory of relativity?", optionsAr: ["إسحاق نيوتن", "جاليليو جاليلي", "ألبرت أينشتاين", "نيكولا تسلا"], optionsEn: ["Isaac Newton", "Galileo Galilei", "Albert Einstein", "Nikola Tesla"], correct: 2 },
    { qAr: "ما هي العملية التي تقوم بها النباتات لصنع الغذاء؟", qEn: "What is the process by which plants make food?", optionsAr: ["التنفس", "البناء الضوئي", "النتح", "الهضم"], optionsEn: ["Respiration", "Photosynthesis", "Transpiration", "Digestion"], correct: 1 },
    { qAr: "أي كوكب يعرف بالكوكب الأحمر؟", qEn: "Which planet is known as the Red Planet?", optionsAr: ["الزهرة", "المشترى", "زحل", "المريخ"], optionsEn: ["Venus", "Jupiter", "Saturn", "Mars"], correct: 3 },
    { qAr: "ما هي الجسيمات سالبة الشحنة في الذرة؟", qEn: "What are the negatively charged particles in an atom?", optionsAr: ["البروتونات", "النيوترونات", "الإلكترونات", "الكواركات"], optionsEn: ["Protons", "Neutrons", "Electrons", "Quarks"], correct: 2 }
  ],
  engineering: [
    { qAr: "أي مادة لها أعلى موصلية حرارية؟", qEn: "Which material has the highest thermal conductivity?", optionsAr: ["النحاس", "الألومنيوم", "الفضة", "الحديد"], optionsEn: ["Copper", "Aluminum", "Silver", "Iron"], correct: 2 },
    { qAr: "ما هو القانون الأساسي للديناميكا الحرارية الذي ينص على حفظ الطاقة؟", qEn: "Which fundamental law of thermodynamics states that energy is conserved?", optionsAr: ["القانون الأول", "القانون الثاني", "القانون الثالث", "القانون الصفري"], optionsEn: ["First Law", "Second Law", "Third Law", "Zeroth Law"], correct: 0 },
    { qAr: "في الهندسة المدنية، ما هي المادة الرابطة الرئيسية في الخرسانة؟", qEn: "In civil engineering, what is the main binding material in concrete?", optionsAr: ["الرمل", "الحصى", "الأسمنت", "الصلب"], optionsEn: ["Sand", "Gravel", "Cement", "Steel"], correct: 2 },
    { qAr: "من مكتشف التيار المتردد (AC)؟", qEn: "Who discovered Alternating Current (AC)?", optionsAr: ["توماس إديسون", "نيكولا تسلا", "أليساندرو فولتا", "مايكل فاراداي"], optionsEn: ["Thomas Edison", "Nikola Tesla", "Alessandro Volta", "Michael Faraday"], correct: 1 },
    { qAr: "ما هي الوحدة المستخدمة لقياس المقاومة الكهربائية؟", qEn: "What unit is used to measure electrical resistance?", optionsAr: ["أمبير", "فولت", "واط", "أوم"], optionsEn: ["Ampere", "Volt", "Watt", "Ohm"], correct: 3 }
  ],
  veterinary: [
    { qAr: "ما هو الحيوان الثديي الوحيد القادر على الطيران؟", qEn: "What is the only mammal capable of sustained flight?", optionsAr: ["السنجاب الطائر", "الخفاش", "الليمور", "الطاووس"], optionsEn: ["Flying Squirrel", "Bat", "Lemur", "Peacock"], correct: 1 },
    { qAr: "كم عدد حجرات معدة البقرة؟", qEn: "How many compartments does a cow's stomach have?", optionsAr: ["1", "2", "3", "4"], optionsEn: ["1", "2", "3", "4"], correct: 3 },
    { qAr: "أي من الأمراض التالية هو مرض حيواني المنشأ (Zoonotic)؟", qEn: "Which of the following diseases is Zoonotic?", optionsAr: ["داء الكلب (Rabies)", "حمى الخنازير", "طاعون الطيور", "جميع ما سبق"], optionsEn: ["Rabies", "Swine Fever", "Fowl Plague", "All of the above"], correct: 0 },
    { qAr: "ما هو أكبر حيوان على وجه الأرض؟", qEn: "What is the largest animal on Earth?", optionsAr: ["الفيل الأفريقي", "الحوت الأزرق", "قرش الحوت", "الزرافة"], optionsEn: ["African Elephant", "Blue Whale", "Whale Shark", "Giraffe"], correct: 1 },
    { qAr: "ما هي فترة الحمل التقريبية للكلاب؟", qEn: "What is the approximate gestation period for dogs?", optionsAr: ["30 يوما", "60 يوما", "90 يوما", "120 يوما"], optionsEn: ["30 days", "60 days", "90 days", "120 days"], correct: 1 }
  ],
  nursing: [
    { qAr: "ما هو معدل ضربات القلب الطبيعي للبالغين أثناء الراحة؟", qEn: "What is a normal resting heart rate for adults?", optionsAr: ["40-60 نبضة", "60-100 نبضة", "100-120 نبضة", "120-140 نبضة"], optionsEn: ["40-60 bpm", "60-100 bpm", "100-120 bpm", "120-140 bpm"], correct: 1 },
    { qAr: "أين يجب قياس درجة حرارة الجسم الأساسية الأكثر دقة؟", qEn: "Where is the most accurate core body temperature measured?", optionsAr: ["الإبط", "الفم", "الأذن", "المستقيم"], optionsEn: ["Axillary", "Oral", "Tympanic", "Rectal"], correct: 3 },
    { qAr: "ماذا يعني اختصار CPR؟", qEn: "What does CPR stand for?", optionsAr: ["الإنعاش القلبي الرئوي", "الإنعاش التنفسي المركزي", "التحكم النبضي المستمر", "معدل النبض القلبي"], optionsEn: ["Cardiopulmonary Resuscitation", "Central Pulmonary Revival", "Continuous Pulse Regulation", "Cardiac Pulse Rate"], correct: 0 },
    { qAr: "ما هي الخطوة الأولى عند العثور على مريض فاقد للوعي؟", qEn: "What is the first step when finding an unconscious patient?", optionsAr: ["بدء الضغط على الصدر", "فتح مجرى الهواء", "التحقق من الاستجابة والأمان", "إعطاء الأكسجين"], optionsEn: ["Start chest compressions", "Open airway", "Check for response and safety", "Administer oxygen"], correct: 2 },
    { qAr: "أي زاوية تستخدم عادة للحقن العضلي (IM)؟", qEn: "What angle is typically used for an intramuscular (IM) injection?", optionsAr: ["15 درجة", "45 درجة", "90 درجة", "180 درجة"], optionsEn: ["15 degrees", "45 degrees", "90 degrees", "180 degrees"], correct: 2 }
  ]
};

export function getRandomQuestions(dept: string, count: number): Question[] {
  // Try to get questions for the department, fallback to computers if not found
  const availableQuestions = questionBank[dept] || questionBank['computers']; 
  
  // Clone and shuffle
  const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
  
  // Return the requested count (or max available)
  return shuffled.slice(0, Math.min(count, availableQuestions.length));
}
