// Shared staff-password auth for assign.html / jobs.html.
// Not real auth — a single shared password gates these two staff-only pages
// and their Edge Functions, matching this project's no-login architecture.

const STAFF_CONFIG = {
    supabaseUrl: 'https://sblxjjybvrhzboyakjit.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNibHhqanlidnJoemJveWFraml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2ODAzNzAsImV4cCI6MjEwMDI1NjM3MH0.CbIOidEuIs0kNDRtdnvRzGkg52OiZYICWxnBveWEI-g',
};
const STAFF_EDGE_BASE = `${STAFF_CONFIG.supabaseUrl}/functions/v1`;
const STAFF_PASSWORD_KEY = 'roofreport_staff_password';

function getStoredStaffPassword() {
    return localStorage.getItem(STAFF_PASSWORD_KEY) || '';
}

function setStoredStaffPassword(password) {
    localStorage.setItem(STAFF_PASSWORD_KEY, password);
}

function promptForStaffPassword(message) {
    const password = window.prompt(message || 'Staff password:');
    if (password) setStoredStaffPassword(password);
    return password || '';
}

// Calls a staff Edge Function, prompting for the password if one isn't
// stored yet and retrying once if the server rejects it (wrong/changed).
async function staffFetch(path, options = {}) {
    let password = getStoredStaffPassword() || promptForStaffPassword();

    const doFetch = (pwd) => fetch(`${STAFF_EDGE_BASE}/${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${STAFF_CONFIG.anonKey}`,
            'apikey': STAFF_CONFIG.anonKey,
            'x-staff-password': pwd,
            ...(options.headers || {}),
        },
    });

    let res = await doFetch(password);
    if (res.status === 401) {
        password = promptForStaffPassword('Incorrect password — try again:');
        res = await doFetch(password);
    }
    return res;
}
