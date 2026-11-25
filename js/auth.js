
/*
=================================================
KNOX COLLEGE SCHOOL PORTAL
File: auth.js
Purpose: Authentication and Role-Based Navigation

GROUP MEMBERS:
1. [Name] - [ID] - [Lab Day/Time]
2. [Name] - [ID] - [Lab Day/Time]
3. [Name] - [ID] - [Lab Day/Time]
4. [Name] - [ID] - [Lab Day/Time]
5. [Name] - [ID] - [Lab Day/Time]
=================================================
*/


// 1. AUTHENTICATION FUNCTION

function loginUser(username, password) {

    // Retrieve registered users
    const users = getUsers();

    // Find matching username and password
    const user = users.find(function(account) {

        return account.username === username &&
               account.password === password;

    });

    // Check whether account exists
    if (!user) {

        return {
            success: false,
            message: "Invalid username or password."
        };

    }

    // Save logged-in user session
    setCurrentUser(user);

    return {
        success: true,
        message: "Login successful!",
        user: getCurrentUser()
    };

}


// 2. ROLE-BASED NAVIGATION

function redirectUser(role) {

    switch (role) {

        case "admin":
            window.location.href = "admin/dashboard.html";
            break;

        case "teacher":
            window.location.href = "teacher/dashboard.html";
            break;

        case "viewer":
            window.location.href = "viewer/dashboard.html";
            break;

        default:
            console.error("Unrecognized user role.");

    }

}


// 3. LOGOUT FUNCTION

function logoutUser() {

    // Remove current login session
    clearCurrentUser();

    // Return user to login page
    window.location.href = "../login.html";

}


// 4. CHECK AUTHENTICATION STATUS

function requireAuthentication() {

    const currentUser = getCurrentUser();

    if (!currentUser) {

        window.location.href = "../login.html";

        return null;

    }

    return currentUser;

}


// 5. CHECK USER ROLE PERMISSIONS

function requireRole(allowedRoles) {

    const currentUser = requireAuthentication();

    if (!currentUser) {
        return null;
    }

    if (!allowedRoles.includes(currentUser.role)) {

        alert("Access denied. You do not have permission.");

        redirectUser(currentUser.role);

        return null;

    }

    return currentUser;

}


// 6. DISPLAY CURRENT USER INFORMATION

function displayCurrentUser(elementId) {

    const currentUser = getCurrentUser();

    const element = document.getElementById(elementId);

    if (currentUser && element) {

        element.textContent = currentUser.fullName;

    }

}
