
/*
Group Members: [Add all group members' names and IDs]
Lab Time: [Add your lab time]
Project: Knox College School Portal
File: viewer.js
*/

// ==========================================
// 1. VIEWER AUTHENTICATION
// ==========================================

const viewerUser = requireRole(["viewer"]);

if (viewerUser) {

    // ==========================================
    // 2. HTML ELEMENTS
    // ==========================================

    const studentSearch =
        document.getElementById("studentSearch");

    const viewerStudentTable =
        document.getElementById("viewerStudentTable");

    const academicStudentSelect =
        document.getElementById("academicStudentSelect");

    const financialStudentSelect =
        document.getElementById("financialStudentSelect");

    const viewerGradeTable =
        document.getElementById("viewerGradeTable");

    const viewerFinanceTable =
        document.getElementById("viewerFinanceTable");


    // ==========================================
    // 3. LOAD STUDENT DROPDOWNS
    // ==========================================

    function loadStudentDropdowns() {

        const students = getStudents();

        academicStudentSelect.innerHTML =
            '<option value="">Select a student</option>';

        financialStudentSelect.innerHTML =
            '<option value="">Select a student</option>';

        students.forEach(function(student) {

            const studentName =
                student.firstName + " " + student.lastName;

            const academicOption =
                document.createElement("option");

            academicOption.value = student.id;

            academicOption.textContent =
                studentName + " (" + student.id + ")";

            academicStudentSelect.appendChild(academicOption);


            const financialOption =
                document.createElement("option");

            financialOption.value = student.id;

            financialOption.textContent =
                studentName + " (" + student.id + ")";

            financialStudentSelect.appendChild(financialOption);

        });
    }


    // ==========================================
    // 4. DISPLAY STUDENT PROFILES
    // ==========================================

    function displayStudents(searchTerm = "") {

        viewerStudentTable.innerHTML = "";

        const students = getStudents();

        const search = searchTerm.toLowerCase().trim();

        const filteredStudents = students.filter(function(student) {

            const fullName =
                student.firstName + " " + student.lastName;

            return (
                fullName.toLowerCase().includes(search) ||
                String(student.id).toLowerCase().includes(search)
            );
        });

        filteredStudents.forEach(function(student) {

            const row = document.createElement("tr");

            const values = [
                student.id,
                student.firstName,
                student.lastName,
                student.gender,
                student.className
            ];

            values.forEach(function(value) {

                const cell = document.createElement("td");

                cell.textContent = value || "Not available";

                row.appendChild(cell);
            });

            viewerStudentTable.appendChild(row);
        });

        const message =
            document.getElementById("studentSearchMessage");

        message.textContent = filteredStudents.length === 0
            ? "No matching student records found."
            : filteredStudents.length + " student record(s) found.";
    }


    // ==========================================
    // 5. DISPLAY ACADEMIC RECORDS
    // ==========================================

    function displayAcademicRecords() {

        viewerGradeTable.innerHTML = "";

        const studentId = academicStudentSelect.value;

        const message =
            document.getElementById("academicMessage");

        if (!studentId) {

            message.textContent =
                "Select a student to view academic records.";

            return;
        }

        const grades = getGrades().filter(function(grade) {

            return String(grade.studentId) === String(studentId);

        });

        if (grades.length === 0) {

            message.textContent =
                "No academic records found for this student.";

            return;
        }

        message.textContent =
            grades.length + " academic record(s) found.";

        grades.forEach(function(grade) {

            const row = document.createElement("tr");

            const percentage =
                Number(grade.maxScore) > 0
                    ? (Number(grade.score) /
                       Number(grade.maxScore)) * 100
                    : 0;

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

            viewerGradeTable.appendChild(row);
        });
    }


    // ==========================================
    // 6. DISPLAY FINANCIAL STATEMENTS
    // ==========================================

    function displayFinancialRecords() {

        viewerFinanceTable.innerHTML = "";

        const studentId = financialStudentSelect.value;

        const message =
            document.getElementById("financialMessage");

        if (!studentId) {

            message.textContent =
                "Select a student to view financial information.";

            return;
        }

        const fees = getFees().filter(function(fee) {

            return String(fee.studentId) === String(studentId);

        });

        if (fees.length === 0) {

            message.textContent =
                "No financial records found for this student.";

            return;
        }

        message.textContent =
            fees.length + " financial record(s) found.";

        fees.forEach(function(fee) {

            const row = document.createElement("tr");

            // Read the actual financial database fields.
            const amountDue = Number(fee.tuitionAmount) || 0;

            const amountPaid = Number(fee.amountPaid) || 0;

            // Calculate the outstanding balance.
            const balance = Math.max(0, amountDue - amountPaid);

            // Determine the payment status.
            let status;

            if (balance === 0) {
                status = "Paid";
            } else if (amountPaid > 0) {
                status = "Pending";
            } else {
                status = "Outstanding";
            }

            const values = [
                fee.studentId,
                "$" + amountDue.toLocaleString(),
                "$" + amountPaid.toLocaleString(),
                "$" + balance.toLocaleString(),
                status
            ];

            values.forEach(function(value) {

                const cell = document.createElement("td");

                cell.textContent = value;

                row.appendChild(cell);
            });

            viewerFinanceTable.appendChild(row);
        });
    }


    // ==========================================
    // 7. UPDATE DASHBOARD STATISTICS
    // ==========================================

    function updateViewerStatistics() {

        document.getElementById("viewerTotalStudents").textContent =
            getStudents().length;

        document.getElementById("viewerTotalGrades").textContent =
            getGrades().length;

        document.getElementById("viewerTotalFees").textContent =
            getFees().length;
    }


    // ==========================================
    // 8. EVENT LISTENERS
    // ==========================================

    // Search for students as the user types.
    studentSearch.addEventListener("input", function() {

        displayStudents(studentSearch.value);

    });

    // Display academic records when a student is selected.
    academicStudentSelect.addEventListener("change", function() {

        displayAcademicRecords();

    });

    // Display financial records when a student is selected.
    financialStudentSelect.addEventListener("change", function() {

        displayFinancialRecords();

    });


    // ==========================================
    // 9. INITIALIZE VIEWER DASHBOARD
    // ==========================================

    loadStudentDropdowns();

    displayStudents();

    updateViewerStatistics();

    console.log("Viewer dashboard initialized successfully.");

}
