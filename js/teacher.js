
/*
Group Members: [Add all group members' names and IDs]
Lab Time: [Add your lab time]
Project: Knox College School Portal
File: teacher.js
*/

// ==========================================
// 1. TEACHER AUTHENTICATION
// ==========================================

const sessionUser = requireRole(["teacher"]);

// Retrieve the complete teacher account.
const allUsers = getUsers();

const teacherUser = sessionUser
    ? allUsers.find(function(user) {
        return String(user.id) === String(sessionUser.id);
    }) || allUsers.find(function(user) {
        return user.username === sessionUser.username;
    })
    : null;

if (teacherUser) {

    // Make sure the subjects property is an array.
    const teacherSubjects = Array.isArray(teacherUser.subjects)
        ? teacherUser.subjects
        : [];

    // ==========================================
    // 2. HTML ELEMENTS
    // ==========================================

    const subjectSelect = document.getElementById("subjectSelect");
    const studentSelect = document.getElementById("studentSelect");
    const gradeForm = document.getElementById("gradeForm");
    const gradeMessage = document.getElementById("gradeMessage");
    const teacherGradeTable = document.getElementById("teacherGradeTable");

    // ==========================================
    // 3. LOAD ASSIGNED SUBJECTS
    // ==========================================

    function loadSubjects() {

        subjectSelect.innerHTML =
            '<option value="">Select a subject</option>';

        teacherSubjects.forEach(function(subject) {

            const option = document.createElement("option");

            option.value = subject;
            option.textContent = subject;

            subjectSelect.appendChild(option);
        });

        console.log("Teacher subjects loaded:", teacherSubjects);
    }

    // ==========================================
    // 4. LOAD STUDENTS
    // ==========================================

    function loadStudents() {

        studentSelect.innerHTML =
            '<option value="">Select a student</option>';

        studentSelect.disabled = true;

        const selectedSubject = subjectSelect.value;

        if (!selectedSubject) {
            return;
        }

        const students = getStudents();

        students.forEach(function(student) {

            const option = document.createElement("option");

            option.value = student.id;

            option.textContent =
                student.firstName + " " +
                student.lastName + " (" +
                student.id + ")";

            studentSelect.appendChild(option);
        });

        studentSelect.disabled = false;

        console.log("Students loaded:", students.length);
    }

    // ==========================================
    // 5. GET TEACHER'S GRADE RECORDS
    // ==========================================

    function getTeacherGrades() {

        return getGrades().filter(function(grade) {

            return String(grade.teacherId) === String(teacherUser.id) &&
                teacherSubjects.includes(grade.subject);

        });
    }

    // ==========================================
    // 6. DISPLAY ACADEMIC RECORDS
    // ==========================================

    function displayGrades() {

        teacherGradeTable.innerHTML = "";

        const grades = getTeacherGrades();

        grades.forEach(function(grade) {

            const row = document.createElement("tr");

            const values = [
                grade.studentId,
                grade.subject,
                grade.assessment,
                grade.score + " / " + grade.maxScore,
                grade.term || "Not specified"
            ];

            values.forEach(function(value) {

                const cell = document.createElement("td");

                cell.textContent = value;

                row.appendChild(cell);
            });

            teacherGradeTable.appendChild(row);
        });
    }

    // ==========================================
    // 7. UPDATE DASHBOARD STATISTICS
    // ==========================================

    function updateTeacherStatistics() {

        const grades = getTeacherGrades();

        document.getElementById("totalSubjects").textContent =
            teacherSubjects.length;

        document.getElementById("totalTeacherStudents").textContent =
            getStudents().length;

        document.getElementById("totalTeacherGrades").textContent =
            grades.length;

        let totalPercentage = 0;

        grades.forEach(function(grade) {

            const percentage =
                (Number(grade.score) / Number(grade.maxScore)) * 100;

            totalPercentage += percentage;
        });

        const average = grades.length > 0
            ? totalPercentage / grades.length
            : 0;

        document.getElementById("classAverage").textContent =
            average.toFixed(1) + "%";
    }

    // ==========================================
    // 8. SAVE STUDENT GRADES
    // ==========================================

    gradeForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const subject = subjectSelect.value;
        const studentId = studentSelect.value;

        const assessment =
            document.getElementById("gradeAssessment").value;

        const score =
            Number(document.getElementById("gradeScore").value);

        const maxScore =
            Number(document.getElementById("maxScore").value);

        const term =
            document.getElementById("gradeTerm").value;

        // Check required fields.
        if (!subject || !studentId || !assessment || !term) {

            gradeMessage.textContent =
                "Please complete all fields and select a subject and student.";

            gradeMessage.className = "message error";

            return;
        }

        // Confirm the teacher is assigned to the subject.
        if (!teacherSubjects.includes(subject)) {

            gradeMessage.textContent =
                "You are not assigned to teach this subject.";

            gradeMessage.className = "message error";

            return;
        }

        // Validate the scores.
        if (
            !Number.isFinite(score) ||
            !Number.isFinite(maxScore) ||
            maxScore <= 0 ||
            score < 0 ||
            score > maxScore
        ) {

            gradeMessage.textContent =
                "Enter a valid score between 0 and the maximum score.";

            gradeMessage.className = "message error";

            return;
        }

        // Confirm the student exists.
        const studentExists = getStudents().some(function(student) {
            return String(student.id) === String(studentId);
        });

        if (!studentExists) {

            gradeMessage.textContent =
                "The selected student could not be found.";

            gradeMessage.className = "message error";

            return;
        }

        // Create the new grade record.
        const grades = getGrades();

        const newGrade = {

            id: Date.now(),

            studentId: studentId,

            subject: subject,

            assessment: assessment,

            score: score,

            maxScore: maxScore,

            term: term,

            teacherId: teacherUser.id
        };

        grades.push(newGrade);

        saveGrades(grades);

        // Display success message.
        gradeMessage.textContent =
            "Grade saved successfully!";

        gradeMessage.className = "message success";

        // Reset the grade form.
        gradeForm.reset();

        // Refresh the dashboard.
        displayGrades();

        updateTeacherStatistics();
    });

    // ==========================================
    // 9. GENERATE STUDENT REPORT CARD
    // ==========================================

    function generateReportCard() {

        const studentId = studentSelect.value;

        const reportCard =
            document.getElementById("reportCard");

        reportCard.innerHTML = "";

        if (!studentId) {

            reportCard.textContent =
                "Please select a subject and student first.";

            return;
        }

        const student = getStudents().find(function(item) {

            return String(item.id) === String(studentId);

        });

        if (!student) {

            reportCard.textContent =
                "Student record not found.";

            return;
        }

        const studentGrades = getGrades().filter(function(grade) {

            return String(grade.studentId) === String(studentId) &&
                teacherSubjects.includes(grade.subject);

        });

        // Report card heading.
        const heading = document.createElement("h3");

        heading.textContent =
            "Knox College - Student Report Card";

        reportCard.appendChild(heading);

        // Student information.
        const name = document.createElement("p");

        name.textContent =
            "Student: " +
            student.firstName + " " +
            student.lastName;

        reportCard.appendChild(name);

        const id = document.createElement("p");

        id.textContent = "Student ID: " + student.id;

        reportCard.appendChild(id);

        const studentClass = document.createElement("p");

        studentClass.textContent =
            "Class: " + student.className;

        reportCard.appendChild(studentClass);

        // Check if grades exist.
        if (studentGrades.length === 0) {

            const message = document.createElement("p");

            message.textContent =
                "No grades have been recorded for this student.";

            reportCard.appendChild(message);

            return;
        }

        // Create report card table.
        const table = document.createElement("table");

        const headerRow = document.createElement("tr");

        const headings = [
            "Subject",
            "Assessment",
            "Score",
            "Percentage",
            "Term"
        ];

        headings.forEach(function(headingText) {

            const th = document.createElement("th");

            th.textContent = headingText;

            headerRow.appendChild(th);
        });

        table.appendChild(headerRow);

        // Add grade information.
        studentGrades.forEach(function(grade) {

            const row = document.createElement("tr");

            const percentage =
                (Number(grade.score) / Number(grade.maxScore)) * 100;

            const values = [
                grade.subject,
                grade.assessment,
                grade.score + " / " + grade.maxScore,
                percentage.toFixed(1) + "%",
                grade.term || "Not specified"
            ];

            values.forEach(function(value) {

                const cell = document.createElement("td");

                cell.textContent = value;

                row.appendChild(cell);
            });

            table.appendChild(row);
        });

        reportCard.appendChild(table);
    }

    // ==========================================
    // 10. EVENT LISTENERS
    // ==========================================

    subjectSelect.addEventListener("change", loadStudents);

    document.getElementById("generateReport")
        .addEventListener("click", generateReportCard);

    // ==========================================
    // 11. INITIALIZE DASHBOARD
    // ==========================================

    loadSubjects();

    loadStudents();

    displayGrades();

    updateTeacherStatistics();

    console.log("Teacher dashboard initialized successfully.");

} else {

    console.error("Teacher account could not be retrieved.");
}
