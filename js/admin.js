
/*
=================================================
KNOX COLLEGE SCHOOL PORTAL
File: admin.js
Purpose: Administrator Dashboard Management

GROUP MEMBERS:
1. [Name] - [ID] - [Lab Day/Time]
2. [Name] - [ID] - [Lab Day/Time]
3. [Name] - [ID] - [Lab Day/Time]
4. [Name] - [ID] - [Lab Day/Time]
5. [Name] - [ID] - [Lab Day/Time]
=================================================
*/


// 1. VERIFY ADMINISTRATOR ACCESS

const adminUser = requireRole(["admin"]);

if (adminUser) {

    displayCurrentUser("welcomeUser");


    // 2. DASHBOARD STATISTICS

    function updateDashboardStatistics() {

        const students = getStudents();
        const users = getUsers();
        const grades = getGrades();
        const fees = getFees();

        const outstandingCount = fees.filter(function(fee) {
            return calculateFeeStatus(fee) !== "Paid";
        }).length;

        document.getElementById("totalStudents").textContent =
            students.length;

        document.getElementById("totalUsers").textContent =
            users.length;

        document.getElementById("totalGrades").textContent =
            grades.length;

        document.getElementById("outstandingFees").textContent =
            outstandingCount;

    }


    // 3. DISPLAY STUDENT RECORDS

    function displayStudents(studentList = getStudents()) {

        const tableBody = document.getElementById("studentTableBody");

        tableBody.replaceChildren();

        if (studentList.length === 0) {

            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 6;
            cell.textContent = "No student records found.";

            row.appendChild(cell);
            tableBody.appendChild(row);

            return;
        }

        studentList.forEach(function(student) {

            const row = document.createElement("tr");

            const values = [
                student.id,
                student.firstName + " " + student.lastName,
                student.className,
                student.semester,
                student.status
            ];

            values.forEach(function(value) {

                const cell = document.createElement("td");
                cell.textContent = value;

                row.appendChild(cell);

            });

            const actionCell = document.createElement("td");

            const editButton = document.createElement("button");

            editButton.textContent = "Edit";
            editButton.className = "edit-button";
            editButton.dataset.action = "edit";
            editButton.dataset.id = student.id;

            const deleteButton = document.createElement("button");

            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-button";
            deleteButton.dataset.action = "delete";
            deleteButton.dataset.id = student.id;

            actionCell.append(editButton, deleteButton);
            row.appendChild(actionCell);

            tableBody.appendChild(row);

        });

    }


    // 4. ENSURE STUDENTS HAVE FINANCIAL RECORDS

    function ensureStudentFeeRecords() {

        const students = getStudents();
        const fees = getFees();

        let recordsChanged = false;

        students.forEach(function(student) {

            const existingFee = fees.find(function(fee) {
                return fee.studentId === student.id;
            });

            if (!existingFee) {

                fees.push({
                    id: Date.now() + Math.random(),
                    studentId: student.id,
                    tuitionAmount: 50000,
                    amountPaid: 0
                });

                recordsChanged = true;

            }

        });

        if (recordsChanged) {
            saveFees(fees);
        }

    }


    // 5. REGISTER NEW STUDENT

    const studentForm = document.getElementById("studentForm");

    studentForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const students = getStudents();

        const studentId = document.getElementById("studentId")
            .value.trim().toUpperCase();

        const firstName = document.getElementById("firstName")
            .value.trim();

        const lastName = document.getElementById("lastName")
            .value.trim();

        const gender = document.getElementById("gender").value;

        const className = document.getElementById("className").value;

        const semester = document.getElementById("semester").value;

        const parentContact = document.getElementById("parentContact")
            .value.trim();

        const message = document.getElementById("studentMessage");

        const existingStudent = students.find(function(student) {
            return student.id.toLowerCase() === studentId.toLowerCase();
        });

        if (existingStudent) {

            message.textContent = "Student ID already exists.";
            message.style.color = "red";

            return;
        }

        const newStudent = {

            id: studentId,
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            className: className,
            semester: semester,
            status: "Active",
            parentContact: parentContact

        };

        students.push(newStudent);

        const saved = saveStudents(students);

        if (!saved) {

            message.textContent = "Unable to save student record.";
            message.style.color = "red";

            return;
        }

        // Create a financial record for the new student.
        // J$50,000 is a demonstration tuition amount.

        const fees = getFees();

        fees.push({

            id: Date.now(),
            studentId: studentId,
            tuitionAmount: 50000,
            amountPaid: 0

        });

        const feeSaved = saveFees(fees);

        if (!feeSaved) {

            saveStudents(students.filter(function(student) {
                return student.id !== studentId;
            }));

            message.textContent =
                "Unable to create the student's financial record.";

            message.style.color = "red";

            return;
        }

        message.textContent = "Student registered successfully!";
        message.style.color = "green";

        studentForm.reset();

        displayStudents();
        displayFinancialRecords();
        populatePaymentStudents();
        updateDashboardStatistics();

    });


    // 6. EDIT STUDENT RECORDS

    function editStudent(studentId) {

        const students = getStudents();

        const student = students.find(function(record) {
            return record.id === studentId;
        });

        if (!student) {

            alert("Student record not found.");
            return;

        }

        const newFirstName = prompt(
            "Enter new first name:",
            student.firstName
        );

        if (newFirstName === null) return;

        const newLastName = prompt(
            "Enter new last name:",
            student.lastName
        );

        if (newLastName === null) return;

        const newClass = prompt(
            "Enter new class:",
            student.className
        );

        if (newClass === null) return;

        if (
            !newFirstName.trim() ||
            !newLastName.trim() ||
            !newClass.trim()
        ) {

            alert("Student information cannot be empty.");
            return;

        }

        student.firstName = newFirstName.trim();
        student.lastName = newLastName.trim();
        student.className = newClass.trim();

        const saved = saveStudents(students);

        if (!saved) {

            alert("Unable to save changes.");
            return;

        }

        alert("Student information updated successfully!");

        displayStudents();
        populatePaymentStudents();
        updateDashboardStatistics();

    }


    // 7. DELETE STUDENT RECORDS

    function deleteStudent(studentId) {

        const confirmed = confirm(
            "Are you sure you want to delete this student? " +
            "Their associated grade and financial records will also be deleted."
        );

        if (!confirmed) return;

        const students = getStudents();

        const updatedStudents = students.filter(function(student) {
            return student.id !== studentId;
        });

        if (updatedStudents.length === students.length) {

            alert("Student record not found.");
            return;

        }

        const saved = saveStudents(updatedStudents);

        if (!saved) {

            alert("Unable to delete student record.");
            return;

        }

        // Remove associated academic records.

        const updatedGrades = getGrades().filter(function(grade) {
            return grade.studentId !== studentId;
        });

        saveGrades(updatedGrades);

        // Remove associated financial records.

        const updatedFees = getFees().filter(function(fee) {
            return fee.studentId !== studentId;
        });

        saveFees(updatedFees);

        alert("Student and associated records deleted successfully!");

        displayStudents();
        displayGrades();
        displayFinancialRecords();
        populatePaymentStudents();
        updateDashboardStatistics();

    }


    // 8. HANDLE STUDENT ACTION BUTTONS

    document.getElementById("studentTableBody")
        .addEventListener("click", function(event) {

            const button = event.target.closest("button[data-action]");

            if (!button) return;

            const studentId = button.dataset.id;

            if (button.dataset.action === "edit") {
                editStudent(studentId);
            }

            if (button.dataset.action === "delete") {
                deleteStudent(studentId);
            }

        });


    // 9. STUDENT SEARCH FUNCTION

    const studentSearch = document.getElementById("studentSearch");

    studentSearch.addEventListener("input", function() {

        const searchTerm = studentSearch.value.toLowerCase().trim();

        const students = getStudents();

        const filteredStudents = students.filter(function(student) {

            const fullName =
                student.firstName + " " + student.lastName;

            return (
                student.id.toLowerCase().includes(searchTerm) ||
                fullName.toLowerCase().includes(searchTerm) ||
                student.className.toLowerCase().includes(searchTerm)
            );

        });

        displayStudents(filteredStudents);

    });


    // 10. DISPLAY ACADEMIC RECORDS

    function displayGrades() {

        const grades = getGrades();

        const tableBody = document.getElementById("gradeTableBody");

        tableBody.replaceChildren();

        if (grades.length === 0) {

            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 5;
            cell.textContent = "No academic records available.";

            row.appendChild(cell);
            tableBody.appendChild(row);

            return;
        }

        grades.forEach(function(grade) {

            const row = document.createElement("tr");

            const values = [
                grade.studentId,
                grade.subject,
                grade.assessment,
                grade.score + "/" + grade.maxScore,
                grade.term
            ];

            values.forEach(function(value) {

                const cell = document.createElement("td");
                cell.textContent = value;

                row.appendChild(cell);

            });

            tableBody.appendChild(row);

        });

    }


    // 11. DISPLAY FINANCIAL RECORDS

    function displayFinancialRecords() {

        const fees = getFees();

        const tableBody = document.getElementById("financeTableBody");

        tableBody.replaceChildren();

        if (fees.length === 0) {

            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 5;
            cell.textContent = "No financial records available.";

            row.appendChild(cell);
            tableBody.appendChild(row);

            return;
        }

        fees.forEach(function(fee) {

            const row = document.createElement("tr");

            const balance = Math.max(
                0,
                fee.tuitionAmount - fee.amountPaid
            );

            const status = calculateFeeStatus(fee);

            const values = [
                fee.studentId,
                "J$" + fee.tuitionAmount.toLocaleString(),
                "J$" + fee.amountPaid.toLocaleString(),
                "J$" + balance.toLocaleString(),
                status
            ];

            values.forEach(function(value) {

                const cell = document.createElement("td");
                cell.textContent = value;

                row.appendChild(cell);

            });

            tableBody.appendChild(row);

        });

    }


    // 12. POPULATE PAYMENT STUDENT DROPDOWN

    function populatePaymentStudents() {

        const select = document.getElementById("paymentStudent");

        const selectedStudent = select.value;

        select.replaceChildren();

        const defaultOption = document.createElement("option");

        defaultOption.value = "";
        defaultOption.textContent = "Select a student";

        select.appendChild(defaultOption);

        const students = getStudents();
        const fees = getFees();

        students.forEach(function(student) {

            const fee = fees.find(function(record) {
                return record.studentId === student.id;
            });

            if (!fee) return;

            const option = document.createElement("option");

            option.value = student.id;
            option.textContent =
                student.id + " - " +
                student.firstName + " " +
                student.lastName;

            select.appendChild(option);

        });

        if (selectedStudent) {
            select.value = selectedStudent;
        }

        updatePaymentBalance();

    }


    // 13. DISPLAY SELECTED STUDENT BALANCE

    function updatePaymentBalance() {

        const studentId =
            document.getElementById("paymentStudent").value;

        const balanceDisplay =
            document.getElementById("paymentBalance");

        const paymentAmount =
            document.getElementById("paymentAmount");

        if (!studentId) {

            balanceDisplay.textContent =
                "Select a student to view their outstanding balance.";

            paymentAmount.max = "";

            return;
        }

        const fees = getFees();

        const fee = fees.find(function(record) {
            return record.studentId === studentId;
        });

        if (!fee) {

            balanceDisplay.textContent =
                "No financial record found for this student.";

            paymentAmount.max = "";

            return;
        }

        const balance = Math.max(
            0,
            fee.tuitionAmount - fee.amountPaid
        );

        balanceDisplay.textContent =
            "Outstanding Balance: J$" + balance.toLocaleString();

        paymentAmount.max = balance;

    }


    document.getElementById("paymentStudent")
        .addEventListener("change", updatePaymentBalance);


    // 14. RECORD STUDENT PAYMENT

    const paymentForm = document.getElementById("paymentForm");

    paymentForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const studentId =
            document.getElementById("paymentStudent").value;

        const paymentAmount = Number(
            document.getElementById("paymentAmount").value
        );

        const message =
            document.getElementById("paymentMessage");

        if (!studentId) {

            message.textContent = "Please select a student.";
            message.style.color = "red";

            return;
        }

        if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {

            message.textContent =
                "Enter a valid payment amount greater than zero.";

            message.style.color = "red";

            return;
        }

        const fees = getFees();

        const fee = fees.find(function(record) {
            return record.studentId === studentId;
        });

        if (!fee) {

            message.textContent =
                "Financial record not found for this student.";

            message.style.color = "red";

            return;
        }

        const balance = fee.tuitionAmount - fee.amountPaid;

        if (balance <= 0) {

            message.textContent =
                "This student's tuition has already been paid.";

            message.style.color = "red";

            return;
        }

        if (paymentAmount > balance) {

            message.textContent =
                "Payment cannot exceed the outstanding balance of J$" +
                balance.toLocaleString() + ".";

            message.style.color = "red";

            return;
        }

        // Add the new payment to the existing amount paid.

        fee.amountPaid += paymentAmount;

        const saved = saveFees(fees);

        if (!saved) {

            fee.amountPaid -= paymentAmount;

            message.textContent =
                "Unable to save the payment. Please try again.";

            message.style.color = "red";

            return;
        }

        const newBalance = fee.tuitionAmount - fee.amountPaid;

        message.textContent =
            "Payment recorded successfully! Remaining balance: J$" +
            newBalance.toLocaleString();

        message.style.color = "green";

        paymentForm.reset();

        displayFinancialRecords();
        populatePaymentStudents();
        updateDashboardStatistics();

    });


    // 15. INITIALIZE ADMIN DASHBOARD

    function initializeAdminDashboard() {

        ensureStudentFeeRecords();

        updateDashboardStatistics();

        displayStudents();

        displayGrades();

        displayFinancialRecords();

        populatePaymentStudents();

    }


    // Start dashboard

    initializeAdminDashboard();

}
