-- Seed Demo Users
-- Passwords are BCrypt hash of "password" (10 rounds)
INSERT INTO users (username, password, full_name, email, role, active) VALUES
('admin',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LjZAzvV5veO', 'System Admin',     'admin@school.edu',     'ADMIN',     true),
('principal', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LjZAzvV5veO', 'Dr. R. Sharma',    'principal@school.edu', 'PRINCIPAL', true),
('teacher1',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LjZAzvV5veO', 'Mrs. Priya Mehta', 'teacher1@school.edu',  'TEACHER',   true),
('teacher2',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LjZAzvV5veO', 'Mr. Arjun Patel',  'teacher2@school.edu',  'TEACHER',   true),
('clerk1',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LjZAzvV5veO', 'Ms. Sunita Roy',   'clerk1@school.edu',    'CLERK',     true)
ON CONFLICT (username) DO NOTHING;

-- School Classes
INSERT INTO school_classes (class_name) VALUES
('Class 1'), ('Class 2'), ('Class 3'), ('Class 4'), ('Class 5'),
('Class 6'), ('Class 7'), ('Class 8'), ('Class 9'), ('Class 10')
ON CONFLICT (class_name) DO NOTHING;

-- Sections (A and B per class)
INSERT INTO sections (name, class_id)
SELECT s.name, c.id
FROM (VALUES
  ('A', 'Class 1'), ('B', 'Class 1'),
  ('A', 'Class 2'), ('B', 'Class 2'),
  ('A', 'Class 3'), ('B', 'Class 3'),
  ('A', 'Class 4'), ('B', 'Class 4'),
  ('A', 'Class 5'), ('B', 'Class 5'),
  ('A', 'Class 6'), ('B', 'Class 6'),
  ('A', 'Class 7'), ('B', 'Class 7'),
  ('A', 'Class 8'), ('B', 'Class 8'),
  ('A', 'Class 9'), ('B', 'Class 9'),
  ('A', 'Class 10'), ('B', 'Class 10')
) AS s(name, class_name)
JOIN school_classes c ON c.class_name = s.class_name
WHERE NOT EXISTS (
  SELECT 1 FROM sections sec WHERE sec.name = s.name AND sec.class_id = c.id
);

-- Subjects
INSERT INTO subjects (name, code, class_id)
SELECT s.name, s.code, c.id
FROM (VALUES
  ('Mathematics',   'MATH01', 'Class 1'),
  ('English',       'ENG01',  'Class 1'),
  ('Science',       'SCI01',  'Class 1'),
  ('EVS',           'EVS01',  'Class 1'),
  ('Mathematics',   'MATH02', 'Class 2'),
  ('English',       'ENG02',  'Class 2'),
  ('Science',       'SCI02',  'Class 2'),
  ('EVS',           'EVS02',  'Class 2'),
  ('Mathematics',   'MATH05', 'Class 5'),
  ('English',       'ENG05',  'Class 5'),
  ('Science',       'SCI05',  'Class 5'),
  ('Social Studies','SST05',  'Class 5'),
  ('Mathematics',   'MATH09', 'Class 9'),
  ('English',       'ENG09',  'Class 9'),
  ('Physics',       'PHY09',  'Class 9'),
  ('Chemistry',     'CHE09',  'Class 9'),
  ('Biology',       'BIO09',  'Class 9'),
  ('History',       'HIS09',  'Class 9'),
  ('Mathematics',   'MATH10', 'Class 10'),
  ('English',       'ENG10',  'Class 10'),
  ('Physics',       'PHY10',  'Class 10'),
  ('Chemistry',     'CHE10',  'Class 10'),
  ('Biology',       'BIO10',  'Class 10'),
  ('History',       'HIS10',  'Class 10')
) AS s(name, code, class_name)
JOIN school_classes c ON c.class_name = s.class_name
ON CONFLICT (code) DO NOTHING;

-- Academic Year
INSERT INTO academic_years (year, start_date, end_date, active)
VALUES ('2024-2025', '2024-04-01', '2025-03-31', true)
ON CONFLICT (year) DO NOTHING;

-- Teacher profiles (linked to users inserted above)
INSERT INTO teachers (user_id, employee_id, qualification, designation)
SELECT u.id, t.employee_id, t.qualification, t.designation
FROM (VALUES
  ('teacher1', 'EMP001', 'M.Sc. Mathematics', 'Senior Teacher'),
  ('teacher2', 'EMP002', 'B.Ed. Science',     'Teacher')
) AS t(username, employee_id, qualification, designation)
JOIN users u ON u.username = t.username
WHERE NOT EXISTS (
  SELECT 1 FROM teachers tc WHERE tc.user_id = u.id
);

-- Sample Students for Class 5
INSERT INTO students (admission_number, name, date_of_birth, gender, address, city, state, pincode, father_name, mother_name, parent_contact, parent_email, parent_occupation, class_id)
SELECT a.admission_number, a.name, a.dob, a.gender, a.address, a.city, a.state, a.pincode, a.father_name, a.mother_name, a.contact, a.email, a.occupation, c.id
FROM (VALUES
  ('ADM001', 'Aarav Kumar',      '2015-03-15', 'M', '123 Oak Street', 'Delhi', 'Delhi', '110001', 'Rajesh Kumar', 'Priya Kumar', '9876543210', 'rajesh@example.com', 'Engineer'),
  ('ADM002', 'Aisha Patel',      '2015-05-22', 'F', '456 Pine Avenue', 'Delhi', 'Delhi', '110002', 'Vikram Patel', 'Anjali Patel', '9876543211', 'vikram@example.com', 'Doctor'),
  ('ADM003', 'Arjun Singh',      '2015-07-10', 'M', '789 Elm Road', 'Delhi', 'Delhi', '110003', 'Suresh Singh', 'Neha Singh', '9876543212', 'suresh@example.com', 'Businessman'),
  ('ADM004', 'Bhavna Sharma',    '2015-09-05', 'F', '321 Maple Lane', 'Delhi', 'Delhi', '110004', 'Ramesh Sharma', 'Divya Sharma', '9876543213', 'ramesh@example.com', 'Teacher'),
  ('ADM005', 'Chirag Gupta',     '2015-11-12', 'M', '654 Cedar Street', 'Delhi', 'Delhi', '110005', 'Ashok Gupta', 'Sunita Gupta', '9876543214', 'ashok@example.com', 'Accountant'),
  ('ADM006', 'Disha Verma',      '2015-01-18', 'F', '987 Birch Road', 'Delhi', 'Delhi', '110006', 'Manoj Verma', 'Kavya Verma', '9876543215', 'manoj@example.com', 'Lawyer'),
  ('ADM007', 'Eshan Malik',      '2015-02-28', 'M', '147 Spruce Lane', 'Delhi', 'Delhi', '110007', 'Ravi Malik', 'Pooja Malik', '9876543216', 'ravi@example.com', 'Consultant'),
  ('ADM008', 'Freya Desai',      '2015-04-08', 'F', '258 Walnut Street', 'Delhi', 'Delhi', '110008', 'Nitin Desai', 'Sneha Desai', '9876543217', 'nitin@example.com', 'IT Professional'),
  ('ADM009', 'Gaurav Joshi',     '2015-06-14', 'M', '369 Oak Avenue', 'Delhi', 'Delhi', '110009', 'Prakash Joshi', 'Meera Joshi', '9876543218', 'prakash@example.com', 'Entrepreneur'),
  ('ADM010', 'Harini Nair',      '2015-08-20', 'F', '741 Pine Lane', 'Delhi', 'Delhi', '110010', 'Karthik Nair', 'Lakshmi Nair', '9876543219', 'karthik@example.com', 'Manager')
) AS a(admission_number, name, dob, gender, address, city, state, pincode, father_name, mother_name, contact, email, occupation)
JOIN school_classes c ON c.class_name = 'Class 5'
WHERE NOT EXISTS (SELECT 1 FROM students WHERE admission_number = a.admission_number);

-- Sample Attendance Records for Class 5
INSERT INTO attendance (student_id, date, status, class_id, section_id)
SELECT s.id, d.date, d.status, s.class_id, sec.id
FROM students s
CROSS JOIN (VALUES
  ('2026-05-20', 'PRESENT'), ('2026-05-21', 'PRESENT'), ('2026-05-22', 'ABSENT'),
  ('2026-05-23', 'LATE'), ('2026-05-24', 'PRESENT'), ('2026-05-25', 'LEAVE'),
  ('2026-05-26', 'PRESENT'), ('2026-05-27', 'PRESENT')
) AS d(date, status)
JOIN sections sec ON sec.class_id = s.class_id AND sec.name = 'A'
WHERE s.class_id = (SELECT id FROM school_classes WHERE class_name = 'Class 5')
AND NOT EXISTS (
  SELECT 1 FROM attendance a 
  WHERE a.student_id = s.id AND a.date::text = d.date
);

-- Sample Performance Records
INSERT INTO performance (student_id, subject_id, exam_type, marks, max_marks, term, academic_year, remarks)
SELECT s.id, subj.id, t.exam_type, t.marks, 100, 'Term 1', '2024-2025', t.remarks
FROM students s
JOIN school_classes sc ON s.class_id = sc.id
JOIN subjects subj ON subj.class_id = s.class_id AND subj.name IN ('Mathematics', 'English', 'Science', 'Social Studies')
CROSS JOIN (VALUES
  ('CLASS_TEST', 85, 'Good performance'),
  ('UNIT_TEST', 78, 'Average performance'),
  ('ASSIGNMENT', 92, 'Excellent submission')
) AS t(exam_type, marks, remarks)
WHERE sc.class_name = 'Class 5'
AND NOT EXISTS (
  SELECT 1 FROM performance p
  WHERE p.student_id = s.id AND p.subject_id = subj.id
  AND p.exam_type::text = t.exam_type
);

-- Sample Syllabus Topics
INSERT INTO syllabus (class_id, subject_id, teacher_id, term, topic, description, completed, completed_date, academic_year)
SELECT c.id, subj.id, u.id, 'Term 1', t.topic, t.description, t.completed, CASE WHEN t.completed THEN '2026-05-25' ELSE NULL END, '2024-2025'
FROM school_classes c
JOIN subjects subj ON subj.class_id = c.id
CROSS JOIN (SELECT id FROM users WHERE username = 'teacher1') u
CROSS JOIN (VALUES
  ('Algebraic Expressions', 'Introduction to variables and simple equations', true),
  ('Geometry Basics', 'Properties of triangles and quadrilaterals', true),
  ('Number Systems', 'Prime numbers, factors, and multiples', false),
  ('Mensuration', 'Area and perimeter of shapes', false)
) AS t(topic, description, completed)
WHERE c.class_name = 'Class 5'
AND subj.name = 'Mathematics'
AND NOT EXISTS (
  SELECT 1 FROM syllabus sy
  WHERE sy.class_id = c.id AND sy.subject_id = subj.id AND sy.topic = t.topic
);

-- Sample Class Schedules
INSERT INTO class_schedules (class_id, section_id, subject_id, teacher_id, day, period, start_time, end_time, academic_year)
SELECT c.id, sec.id, subj.id, u.id, d.day, d.period, d.start_time, d.end_time, '2024-2025'
FROM school_classes c
JOIN sections sec ON sec.class_id = c.id AND sec.name = 'A'
JOIN subjects subj ON subj.class_id = c.id
CROSS JOIN (SELECT id FROM users WHERE username IN ('teacher1', 'teacher2')) u
CROSS JOIN (VALUES
  ('Monday', 1, '09:00', '09:45'),
  ('Monday', 2, '09:45', '10:30'),
  ('Tuesday', 1, '09:00', '09:45'),
  ('Tuesday', 3, '11:00', '11:45'),
  ('Wednesday', 2, '09:45', '10:30'),
  ('Thursday', 1, '09:00', '09:45'),
  ('Friday', 2, '09:45', '10:30'),
  ('Friday', 4, '11:45', '12:30')
) AS d(day, period, start_time, end_time)
WHERE c.class_name = 'Class 5'
AND subj.name IN ('Mathematics', 'English', 'Science')
AND u.username = CASE WHEN subj.name = 'Mathematics' THEN 'teacher1' ELSE 'teacher2' END
AND NOT EXISTS (
  SELECT 1 FROM class_schedules cs
  WHERE cs.class_id = c.id AND cs.section_id = sec.id
  AND cs.subject_id = subj.id AND cs.day = d.day AND cs.period = d.period
);

-- Additional Students for Class 9
INSERT INTO students (admission_number, name, date_of_birth, gender, address, city, state, pincode, father_name, mother_name, parent_contact, parent_email, parent_occupation, class_id)
SELECT a.admission_number, a.name, a.dob, a.gender, a.address, a.city, a.state, a.pincode, a.father_name, a.mother_name, a.contact, a.email, a.occupation, c.id
FROM (VALUES
  ('ADM101', 'Ishaan Verma',      '2013-02-10', 'M', '111 Test Avenue', 'Delhi', 'Delhi', '110020', 'Sanjay Verma', 'Ritika Verma', '9876543220', 'sanjay@example.com', 'Business'),
  ('ADM102', 'Jiya Singh',        '2013-04-15', 'F', '222 Main Street', 'Delhi', 'Delhi', '110021', 'Vijay Singh', 'Rekha Singh', '9876543221', 'vijay@example.com', 'Doctor'),
  ('ADM103', 'Karan Mehta',       '2013-06-20', 'M', '333 Park Lane', 'Delhi', 'Delhi', '110022', 'Rohit Mehta', 'Swati Mehta', '9876543222', 'rohit@example.com', 'Engineer'),
  ('ADM104', 'Leila Khan',        '2013-08-25', 'F', '444 Garden Road', 'Delhi', 'Delhi', '110023', 'Ahmed Khan', 'Fatima Khan', '9876543223', 'ahmed@example.com', 'Consultant'),
  ('ADM105', 'Mohit Rao',         '2013-10-30', 'M', '555 Square Plaza', 'Delhi', 'Delhi', '110024', 'Aravind Rao', 'Deepa Rao', '9876543224', 'aravind@example.com', 'Manager'),
  ('ADM106', 'Neha Bhat',         '2013-12-05', 'F', '666 Heritage Lane', 'Delhi', 'Delhi', '110025', 'Sunil Bhat', 'Anjali Bhat', '9876543225', 'sunil@example.com', 'Architect')
) AS a(admission_number, name, dob, gender, address, city, state, pincode, father_name, mother_name, contact, email, occupation)
JOIN school_classes c ON c.class_name = 'Class 9'
WHERE NOT EXISTS (SELECT 1 FROM students WHERE admission_number = a.admission_number);

-- Additional Students for Class 10
INSERT INTO students (admission_number, name, date_of_birth, gender, address, city, state, pincode, father_name, mother_name, parent_contact, parent_email, parent_occupation, class_id)
SELECT a.admission_number, a.name, a.dob, a.gender, a.address, a.city, a.state, a.pincode, a.father_name, a.mother_name, a.contact, a.email, a.occupation, c.id
FROM (VALUES
  ('ADM201', 'Om Prakash',        '2012-01-10', 'M', '777 Ridge Lane', 'Delhi', 'Delhi', '110026', 'Vikram Prakash', 'Shweta Prakash', '9876543226', 'vikram@example.com', 'Lawyer'),
  ('ADM202', 'Priya Chopra',      '2012-03-15', 'F', '888 Valley Road', 'Delhi', 'Delhi', '110027', 'Anand Chopra', 'Geeta Chopra', '9876543227', 'anand@example.com', 'Doctor'),
  ('ADM203', 'Rahul Nair',        '2012-05-20', 'M', '999 Mountain View', 'Delhi', 'Delhi', '110028', 'Sreedharan Nair', 'Latha Nair', '9876543228', 'sreedharan@example.com', 'Banker'),
  ('ADM204', 'Sonia Gupta',       '2012-07-25', 'F', '1010 Riverside', 'Delhi', 'Delhi', '110029', 'Ajay Gupta', 'Bharati Gupta', '9876543229', 'ajay@example.com', 'Engineer')
) AS a(admission_number, name, dob, gender, address, city, state, pincode, father_name, mother_name, contact, email, occupation)
JOIN school_classes c ON c.class_name = 'Class 10'
WHERE NOT EXISTS (SELECT 1 FROM students WHERE admission_number = a.admission_number);

-- Fee Payments
INSERT INTO fee_payments (student_id, amount, payment_date, payment_status, payment_method, receipt_number, academic_year)
SELECT s.id, 15000, '2026-04-15', 'PAID', 'BANK_TRANSFER', 'RCP' || s.id || '001', '2024-2025'
FROM students s
LIMIT 10;

INSERT INTO fee_payments (student_id, amount, payment_date, payment_status, payment_method, receipt_number, academic_year)
SELECT s.id, 15000, '2026-05-20', 'PAID', 'CASH', 'RCP' || s.id || '002', '2024-2025'
FROM students s
WHERE s.id > 10
LIMIT 6;

-- More Attendance for Class 9
INSERT INTO attendance (student_id, date, status, class_id, section_id)
SELECT s.id, d.date::date, d.status, s.class_id, sec.id
FROM students s
CROSS JOIN (SELECT dates::text as date, status FROM (VALUES
  ('2026-05-20', 'PRESENT'), ('2026-05-21', 'PRESENT'), ('2026-05-22', 'LATE'),
  ('2026-05-23', 'PRESENT'), ('2026-05-24', 'ABSENT'), ('2026-05-25', 'PRESENT'),
  ('2026-05-26', 'PRESENT'), ('2026-05-27', 'PRESENT')
) AS dates(dates, status)) d
JOIN sections sec ON sec.class_id = s.class_id AND sec.name = 'A'
WHERE s.class_id = (SELECT id FROM school_classes WHERE class_name = 'Class 9')
AND NOT EXISTS (
  SELECT 1 FROM attendance a 
  WHERE a.student_id = s.id AND a.date::text = d.date
);

-- More Performance Records for Class 9
INSERT INTO performance (student_id, subject_id, exam_type, marks, max_marks, term, academic_year, remarks)
SELECT s.id, subj.id, t.exam_type, (80 + random()::int % 20)::double precision, 100, 'Term 1', '2024-2025', t.remarks
FROM students s
JOIN school_classes sc ON s.class_id = sc.id
JOIN subjects subj ON subj.class_id = s.class_id AND subj.name IN ('Physics', 'Chemistry', 'Biology', 'History')
CROSS JOIN (VALUES
  ('MIDTERM', 'Mid-term exam'),
  ('FINAL', 'Final exam')
) AS t(exam_type, remarks)
WHERE sc.class_name = 'Class 9'
AND NOT EXISTS (
  SELECT 1 FROM performance p
  WHERE p.student_id = s.id AND p.subject_id = subj.id
  AND p.exam_type::text = t.exam_type
);

-- More Syllabus for Class 9 Physics
INSERT INTO syllabus (class_id, subject_id, teacher_id, term, topic, description, completed, completed_date, academic_year)
SELECT c.id, subj.id, u.id, 'Term 1', t.topic, t.description, t.completed, CASE WHEN t.completed THEN '2026-05-25' ELSE NULL END, '2024-2025'
FROM school_classes c
JOIN subjects subj ON subj.class_id = c.id AND subj.name = 'Physics'
CROSS JOIN (SELECT id FROM users WHERE username = 'teacher1') u
CROSS JOIN (VALUES
  ('Motion and Force', 'Laws of motion and force application', true),
  ('Work and Energy', 'Work, energy and power concepts', true),
  ('Waves and Sound', 'Wave properties and sound phenomena', false),
  ('Electricity', 'Electric current and circuits', false)
) AS t(topic, description, completed)
WHERE c.class_name = 'Class 9'
AND NOT EXISTS (
  SELECT 1 FROM syllabus sy
  WHERE sy.class_id = c.id AND sy.subject_id = subj.id AND sy.topic = t.topic
);

-- More Syllabus for Class 9 Chemistry
INSERT INTO syllabus (class_id, subject_id, teacher_id, term, topic, description, completed, completed_date, academic_year)
SELECT c.id, subj.id, u.id, 'Term 1', t.topic, t.description, t.completed, CASE WHEN t.completed THEN '2026-05-24' ELSE NULL END, '2024-2025'
FROM school_classes c
JOIN subjects subj ON subj.class_id = c.id AND subj.name = 'Chemistry'
CROSS JOIN (SELECT id FROM users WHERE username = 'teacher2') u
CROSS JOIN (VALUES
  ('Atomic Structure', 'Atoms, electrons and periodic table', true),
  ('Chemical Reactions', 'Types of chemical reactions', true),
  ('Acids and Bases', 'pH, acids, bases and salts', false)
) AS t(topic, description, completed)
WHERE c.class_name = 'Class 9'
AND NOT EXISTS (
  SELECT 1 FROM syllabus sy
  WHERE sy.class_id = c.id AND sy.subject_id = subj.id AND sy.topic = t.topic
);

-- Class Schedules for Class 9
INSERT INTO class_schedules (class_id, section_id, subject_id, teacher_id, day, period, start_time, end_time, academic_year)
SELECT c.id, sec.id, subj.id, u.id, d.day, d.period, d.start_time, d.end_time, '2024-2025'
FROM school_classes c
JOIN sections sec ON sec.class_id = c.id AND sec.name = 'A'
JOIN subjects subj ON subj.class_id = c.id AND subj.name IN ('Physics', 'Chemistry', 'Biology', 'History')
CROSS JOIN (SELECT id FROM users WHERE username IN ('teacher1', 'teacher2')) u
CROSS JOIN (VALUES
  ('Monday', 1, '09:00', '09:45'),
  ('Monday', 3, '10:30', '11:15'),
  ('Tuesday', 2, '09:45', '10:30'),
  ('Tuesday', 4, '11:15', '12:00'),
  ('Wednesday', 1, '09:00', '09:45'),
  ('Wednesday', 5, '12:00', '12:45'),
  ('Thursday', 2, '09:45', '10:30'),
  ('Thursday', 3, '10:30', '11:15'),
  ('Friday', 1, '09:00', '09:45'),
  ('Friday', 6, '01:15', '02:00')
) AS d(day, period, start_time, end_time)
WHERE c.class_name = 'Class 9'
AND u.username = CASE WHEN subj.name IN ('Physics', 'Chemistry') THEN 'teacher1' ELSE 'teacher2' END
AND NOT EXISTS (
  SELECT 1 FROM class_schedules cs
  WHERE cs.class_id = c.id AND cs.section_id = sec.id
  AND cs.subject_id = subj.id AND cs.day = d.day AND cs.period = d.period
);

-- Class Schedules for Class 10
INSERT INTO class_schedules (class_id, section_id, subject_id, teacher_id, day, period, start_time, end_time, academic_year)
SELECT c.id, sec.id, subj.id, u.id, d.day, d.period, d.start_time, d.end_time, '2024-2025'
FROM school_classes c
JOIN sections sec ON sec.class_id = c.id AND sec.name = 'A'
JOIN subjects subj ON subj.class_id = c.id AND subj.name IN ('Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History')
CROSS JOIN (SELECT id FROM users WHERE username IN ('teacher1', 'teacher2')) u
CROSS JOIN (VALUES
  ('Monday', 1, '09:00', '09:45'),
  ('Monday', 2, '09:45', '10:30'),
  ('Tuesday', 3, '10:30', '11:15'),
  ('Wednesday', 1, '09:00', '09:45'),
  ('Thursday', 2, '09:45', '10:30'),
  ('Friday', 3, '10:30', '11:15')
) AS d(day, period, start_time, end_time)
WHERE c.class_name = 'Class 10'
AND u.username = CASE WHEN subj.name IN ('Mathematics', 'Physics', 'Chemistry') THEN 'teacher1' ELSE 'teacher2' END
AND NOT EXISTS (
  SELECT 1 FROM class_schedules cs
  WHERE cs.class_id = c.id AND cs.section_id = sec.id
  AND cs.subject_id = subj.id AND cs.day = d.day AND cs.period = d.period
);

-- Attendance for Class 10
INSERT INTO attendance (student_id, date, status, class_id, section_id)
SELECT s.id, d.date::date, d.status, s.class_id, sec.id
FROM students s
CROSS JOIN (SELECT dates::text as date, status FROM (VALUES
  ('2026-05-20', 'PRESENT'), ('2026-05-21', 'ABSENT'), ('2026-05-22', 'PRESENT'),
  ('2026-05-23', 'LATE'), ('2026-05-24', 'PRESENT'), ('2026-05-25', 'PRESENT'),
  ('2026-05-26', 'PRESENT'), ('2026-05-27', 'ABSENT')
) AS dates(dates, status)) d
JOIN sections sec ON sec.class_id = s.class_id AND sec.name = 'A'
WHERE s.class_id = (SELECT id FROM school_classes WHERE class_name = 'Class 10')
AND NOT EXISTS (
  SELECT 1 FROM attendance a 
  WHERE a.student_id = s.id AND a.date::text = d.date
);

-- Performance records for Class 10 students
INSERT INTO performance (student_id, subject_id, exam_type, marks, max_marks, term, academic_year, remarks)
SELECT s.id, subj.id, t.exam_type, (85 + random()::int % 15)::double precision, 100, 'Term 1', '2024-2025', t.remarks
FROM students s
JOIN school_classes sc ON s.class_id = sc.id
JOIN subjects subj ON subj.class_id = s.class_id AND subj.name IN ('Mathematics', 'English', 'Physics')
CROSS JOIN (VALUES
  ('MIDTERM', 'Mid-term exam'),
  ('FINAL', 'Final exam'),
  ('ASSIGNMENT', 'Assignment score')
) AS t(exam_type, remarks)
WHERE sc.class_name = 'Class 10'
AND NOT EXISTS (
  SELECT 1 FROM performance p
  WHERE p.student_id = s.id AND p.subject_id = subj.id
  AND p.exam_type::text = t.exam_type
);