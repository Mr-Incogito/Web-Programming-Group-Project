
/*
=================================================
KNOX COLLEGE SCHOOL PORTAL
File: storage.js
Purpose: Browser Storage and Database Management

GROUP MEMBERS:
1. [Name] - [ID] - [Lab Day/Time]
2. [Name] - [ID] - [Lab Day/Time]
3. [Name] - [ID] - [Lab Day/Time]
4. [Name] - [ID] - [Lab Day/Time]
5. [Name] - [ID] - [Lab Day/Time]
=================================================
*/


// 1. STORAGE KEY DEFINITIONS

const STORAGE_KEYS = {
    USERS: "knox_users",
    STUDENTS: "knox_students",
    GRADES: "knox_grades",
    FEES: "knox_fees",
    CURRENT_USER: "knox_current_user"
};


// 2. INITIAL SAMPLE DATA

const initialUsers = [
    {
        id: 1,
        username: "admin",
        password: "admin123",
        fullName: "System Administrator",
        role: "admin"
    },
    {
        id: 2,
        username: "teacher",
        password: "teacher123",
        fullName: "John Brown",
        role: "teacher",
        subjects: ["Mathematics", "English"]
    },
    {
        id: 3,
        username: "viewer",
        password: "viewer123",
        fullName: "General Viewer",
        role: "viewer"
    }
];


const initialStudents = [
    {
        id: "KC001",
        firstName: "Daniel",
        lastName: "Williams",
        gender: "Male",
        className: "Grade 10",
        semester: "Semester 1",
        status: "Active",
        parentContact: "876-555-0101"
    },
    {
        id: "KC002",
        firstName: "Sarah",
        lastName: "Brown",
        gender: "Female",
        className: "Grade 11",
        semester: "Semester 1",
        status: "Active",
        parentContact: "876-555-0102"
    },
    {
        id: "KC003",
        firstName: "Michael",
        lastName: "Johnson",
        gender: "Male",
        className: "Grade 10",
        semester: "Semester 1",
        status: "Active",
        parentContact: "876-555-0103"
    }
];


const initialGrades = [
    {
        id: 1,
        studentId: "KC001",
        subject: "Mathematics",
        assessment: "Midterm",
        score: 85,
        maxScore: 100,
        term: "Semester 1",
        teacherId: 2
    },
    {
        id: 2,
        studentId: "KC001",
        subject: "English",
        assessment: "Midterm",
        score: 78,
        maxScore: 100,
        term: "Semester 1",
        teacherId: 2
    },
    {
        id: 3,
        studentId: "KC002",
        subject: "Mathematics",
        assessment: "Midterm",
        score: 92,
        maxScore: 100,
        term: "Semester 1",
        teacherId: 2
    }
];


const initialFees = [
    {
        id: 1,
        studentId: "KC001",
        tuitionAmount: 50000,
        amountPaid: 50000
    },
    {
        id: 2,
        studentId: "KC002",
        tuitionAmount: 50000,
        amountPaid: 30000
    },
    {
        id: 3,
        studentId: "KC003",
        tuitionAmount: 50000,
        amountPaid: 0
    }
];


// 3. GENERIC STORAGE FUNCTIONS

function getData(key) {

    const storedData = localStorage.getItem(key);

    if (storedData === null) {
        return [];
    }

    try {
        return JSON.parse(storedData);
    } catch (error) {
        console.error("Unable to read stored data:", error);
        return [];
    }
}


function saveData(key, data) {

    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;

    } catch (error) {

        console.error("Unable to save data:", error);
        return false;
    }
}


// 4. INITIALIZE DATABASE

function initializeStorage() {

    if (localStorage.getItem(STORAGE_KEYS.USERS) === null) {
        saveData(STORAGE_KEYS.USERS, initialUsers);
    }

    if (localStorage.getItem(STORAGE_KEYS.STUDENTS) === null) {
        saveData(STORAGE_KEYS.STUDENTS, initialStudents);
    }

    if (localStorage.getItem(STORAGE_KEYS.GRADES) === null) {
        saveData(STORAGE_KEYS.GRADES, initialGrades);
    }

    if (localStorage.getItem(STORAGE_KEYS.FEES) === null) {
        saveData(STORAGE_KEYS.FEES, initialFees);
    }

}


// 5. STUDENT FUNCTIONS

function getStudents() {
    return getData(STORAGE_KEYS.STUDENTS);
}


function saveStudents(students) {
    return saveData(STORAGE_KEYS.STUDENTS, students);
}


// 6. USER FUNCTIONS

function getUsers() {
    return getData(STORAGE_KEYS.USERS);
}


function saveUsers(users) {
    return saveData(STORAGE_KEYS.USERS, users);
}


// 7. GRADE FUNCTIONS

function getGrades() {
    return getData(STORAGE_KEYS.GRADES);
}


function saveGrades(grades) {
    return saveData(STORAGE_KEYS.GRADES, grades);
}


// 8. FINANCIAL FUNCTIONS

function getFees() {
    return getData(STORAGE_KEYS.FEES);
}


function saveFees(fees) {
    return saveData(STORAGE_KEYS.FEES, fees);
}


// 9. SESSION MANAGEMENT

function setCurrentUser(user) {

    const sessionUser = {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role
    };

    sessionStorage.setItem(
        STORAGE_KEYS.CURRENT_USER,
        JSON.stringify(sessionUser)
    );
}


function getCurrentUser() {

    const userData = sessionStorage.getItem(
        STORAGE_KEYS.CURRENT_USER
    );

    if (!userData) {
        return null;
    }

    try {
        return JSON.parse(userData);
    } catch (error) {
        console.error("Unable to read current session:", error);
        return null;
    }
}


function clearCurrentUser() {
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}


// 10. STUDENT SEARCH FUNCTION

function findStudent(studentId) {

    const students = getStudents();

    return students.find(student => student.id === studentId);
}


// 11. FINANCIAL STATUS FUNCTION

function calculateFeeStatus(fee) {

    const balance = fee.tuitionAmount - fee.amountPaid;

    if (balance <= 0) {
        return "Paid";
    }

    if (fee.amountPaid > 0) {
        return "Pending";
    }

    return "Outstanding";
}


// 12. START THE STORAGE SYSTEM

initializeStorage();

console.log("Knox College storage system initialized.");
