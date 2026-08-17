// Draft submission, admin review, and narrative-text editing.
// Loaded after script.js (plain <script> tag, no build step) and relies on
// its globals (generateReport, collectSelectedConcerns, addAdditionalItemCard,
// roofData, etc.) plus a couple of small hooks added into script.js itself:
//   - generateReport() calls applyNarrativeOverrides(concerns) if it exists
//   - setupFormSubmission()'s submit handler calls handleDraftSubmit(form) if it exists

const REPORT_SYNC_CONFIG = {
    supabaseUrl: 'https://sblxjjybvrhzboyakjit.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNibHhqanlidnJoemJveWFraml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2ODAzNzAsImV4cCI6MjEwMDI1NjM3MH0.CbIOidEuIs0kNDRtdnvRzGkg52OiZYICWxnBveWEI-g',
};
const EDGE_FUNCTIONS_BASE = `${REPORT_SYNC_CONFIG.supabaseUrl}/functions/v1`;

window.__narrativeOverrides = window.__narrativeOverrides || {};
window.__reviewToken = null;
window.__storedPhotoUrls = {};

// ---- Narrative text overrides -------------------------------------------

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
}

// Called from generateReport() (script.js) after collectSelectedConcerns(),
// before the concern list is rendered into HTML.
function applyNarrativeOverrides(concerns) {
    concerns.forEach(c => {
        const descOverride = window.__narrativeOverrides[`${c.overrideKey}::description`];
        const commentsOverride = window.__narrativeOverrides[`${c.overrideKey}::comments`];
        if (descOverride !== undefined) c.description = escapeHtml(descOverride);
        if (commentsOverride !== undefined) c.comments = escapeHtml(commentsOverride);
    });
}

function setupNarrativeEditCapture() {
    const reportContent = document.getElementById('reportContent');
    if (!reportContent) return;
    // 'blur' doesn't bubble, so this listener must run in the capture phase
    // to observe it via delegation on the (persistent) reportContent container.
    reportContent.addEventListener('blur', function(e) {
        const target = e.target;
        if (!target.classList || !target.classList.contains('narrative-editable')) return;
        const key = target.getAttribute('data-override-key');
        if (!key) return;
        window.__narrativeOverrides[key] = target.textContent;
    }, true);
}

// ---- Form state serialization --------------------------------------------

function serializeFormState(form) {
    const formData = new FormData(form);
    const data = {};
    const files = [];

    for (const [name, value] of formData.entries()) {
        if (value instanceof File) {
            if (value.size > 0) files.push({ name, file: value });
            continue;
        }
        if (Object.prototype.hasOwnProperty.call(data, name)) {
            if (!Array.isArray(data[name])) data[name] = [data[name]];
            data[name].push(value);
        } else {
            data[name] = value;
        }
    }

    return { data, files };
}

// Loaded lazily via dynamic import (not a <script type="module">, so the rest
// of this file — and script.js — can keep relying on plain global functions).
let _supabaseClientPromise = null;
function getSupabaseClient() {
    if (!_supabaseClientPromise) {
        _supabaseClientPromise = import('https://esm.sh/@supabase/supabase-js@2').then(
            ({ createClient }) => createClient(REPORT_SYNC_CONFIG.supabaseUrl, REPORT_SYNC_CONFIG.anonKey)
        );
    }
    return _supabaseClientPromise;
}

// ---- Edge Function calls ---------------------------------------------------

function edgeHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${REPORT_SYNC_CONFIG.anonKey}`,
        'apikey': REPORT_SYNC_CONFIG.anonKey,
    };
}

async function requestUploadUrls(token, photos) {
    const res = await fetch(`${EDGE_FUNCTIONS_BASE}/create-upload-urls`, {
        method: 'POST',
        headers: edgeHeaders(),
        body: JSON.stringify({ token, photos }),
    });
    if (!res.ok) throw new Error(`Could not prepare photo upload (${res.status})`);
    return res.json();
}

// Uploads each file straight to Storage via a signed URL (no base64/JSON
// round trip through the Edge Function, which is what let large photos blow
// past request size limits). Returns the draft token (freshly issued if none
// was passed in) and the uploaded paths grouped by form field name.
async function uploadPhotosDirect(token, files) {
    if (files.length === 0) return { token, photoPaths: {} };

    const photos = files.map(({ name, file }) => ({ fieldName: name, filename: file.name }));
    const { token: draftToken, uploads } = await requestUploadUrls(token, photos);

    const supabase = await getSupabaseClient();
    const photoPaths = {};
    for (let i = 0; i < uploads.length; i++) {
        const { fieldName, path, uploadToken } = uploads[i];
        const { file } = files[i];
        const { error } = await supabase.storage
            .from('report-photos')
            .uploadToSignedUrl(path, uploadToken, file);
        if (error) throw new Error(`Photo upload failed (${fieldName}): ${error.message}`);
        photoPaths[fieldName] = [...(photoPaths[fieldName] || []), path];
    }
    return { token: draftToken, photoPaths };
}

async function submitDraftToServer(form) {
    const { data, files } = serializeFormState(form);
    const { token, photoPaths } = await uploadPhotosDirect(null, files);
    const res = await fetch(`${EDGE_FUNCTIONS_BASE}/submit-draft`, {
        method: 'POST',
        headers: edgeHeaders(),
        body: JSON.stringify({ token, form_data: data, narrative_overrides: window.__narrativeOverrides, photo_paths: photoPaths }),
    });
    if (!res.ok) throw new Error(`Submit failed (${res.status})`);
    return res.json();
}

async function updateDraftOnServer(form, token) {
    const { data, files } = serializeFormState(form);
    const { photoPaths } = await uploadPhotosDirect(token, files);
    const res = await fetch(`${EDGE_FUNCTIONS_BASE}/update-draft?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: edgeHeaders(),
        body: JSON.stringify({ form_data: data, narrative_overrides: window.__narrativeOverrides, photo_paths: photoPaths }),
    });
    if (!res.ok) throw new Error(`Save failed (${res.status})`);
    return res.json();
}

async function fetchDraft(token) {
    const res = await fetch(`${EDGE_FUNCTIONS_BASE}/get-draft?token=${encodeURIComponent(token)}`, {
        headers: edgeHeaders(),
    });
    if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
    return res.json();
}

// ---- Submit/update orchestration + status banner --------------------------

function showDraftSyncStatus(message, type) {
    let statusEl = document.getElementById('draftSyncStatus');
    if (!statusEl) {
        statusEl = document.createElement('div');
        statusEl.id = 'draftSyncStatus';
        const reportOutput = document.getElementById('reportOutput');
        reportOutput.parentNode.insertBefore(statusEl, reportOutput);
    }
    statusEl.className = `draft-sync-status ${type}`;
    statusEl.textContent = message;
}

// Called from setupFormSubmission()'s submit handler (script.js) right after
// the local report preview is generated.
async function handleDraftSubmit(form) {
    const isReview = Boolean(window.__reviewToken);
    showDraftSyncStatus(isReview ? 'Saving changes…' : 'Submitting for review…', 'pending');
    try {
        if (isReview) {
            await updateDraftOnServer(form, window.__reviewToken);
            showDraftSyncStatus('Changes saved.', 'success');
        } else {
            await submitDraftToServer(form);
            showDraftSyncStatus('Submitted for review — the admin has been notified by email.', 'success');
        }
    } catch (err) {
        console.error(err);
        showDraftSyncStatus(
            'Could not save this report online (the report below is still fine to print, but nothing was sent). Please try again.',
            'error'
        );
    }
}

// ---- Review-mode restore ----------------------------------------------------

// Replays the cascading DOM-generation flow (roof type -> sub type -> specific
// concerns -> additional items -> flashing sub-entries) so stored field values
// have somewhere to land, then sets every value by name.
function restoreFormState(form, data) {
    const roofTypeSelect = document.getElementById('roofType');
    const subTypeSelect = document.getElementById('subType');

    if (data.roofType && roofTypeSelect) {
        roofTypeSelect.value = data.roofType;
        roofTypeSelect.dispatchEvent(new Event('change'));
    }
    if (data.subType && subTypeSelect) {
        subTypeSelect.value = data.subType;
        subTypeSelect.dispatchEvent(new Event('change'));
    }

    // Additional items: create enough cards before values can be set on them.
    const additionalIndices = new Set();
    Object.keys(data).forEach(key => {
        const m = key.match(/^additionalItem_(\d+)_/);
        if (m) additionalIndices.add(Number(m[1]));
    });
    const additionalContainer = document.getElementById('additionalItemsContainer');
    if (additionalContainer && additionalIndices.size > 0) {
        const maxIndex = Math.max(...additionalIndices);
        for (let i = 0; i <= maxIndex; i++) {
            addAdditionalItemCard(additionalContainer, i);
        }
    }

    // Check every concern checkbox that was selected, revealing its detail fields.
    Array.from(form.elements).forEach(el => {
        if (el.type === 'checkbox' && el.name && el.name.startsWith('sc_') && data[el.name]) {
            el.checked = true;
            el.dispatchEvent(new Event('change'));
        }
    });

    // Flashing entries: for each "sc_<section>_<concern>_flash<N>_..." key beyond
    // the default first entry (index 0), click "+ Add another flashing issue"
    // enough times so entry N's DOM exists before we try to set its values.
    const flashGroups = {};
    Object.keys(data).forEach(key => {
        const m = key.match(/^(sc_[^_]+_[^_]+)_flash(\d+)_/);
        if (!m) return;
        const detailsId = `${m[1]}_details`;
        flashGroups[detailsId] = Math.max(flashGroups[detailsId] || 0, Number(m[2]));
    });
    Object.keys(flashGroups).forEach(detailsId => {
        const container = document.getElementById(detailsId);
        const addBtn = container && container.querySelector('.add-flashing-btn');
        if (!addBtn) return;
        for (let i = 0; i < flashGroups[detailsId]; i++) addBtn.click();
    });

    // Two rounds of (set values, dispatch change) — round 1 creates flashing
    // sub-fields (via each flashing-type select's own change handler) and
    // reveals top-level dependsOn groups; round 2 sets values on those newly
    // created sub-fields and reveals any dependsOn groups nested inside them.
    for (let round = 0; round < 2; round++) {
        Array.from(form.elements).forEach(el => {
            if (!el.name || el.type === 'file' || !(el.name in data)) return;
            const value = data[el.name];
            if (el.type === 'checkbox' || el.type === 'radio') {
                const values = Array.isArray(value) ? value : [value];
                el.checked = values.includes(el.value);
            } else if (el.tagName === 'SELECT' && el.multiple) {
                const values = Array.isArray(value) ? value : [value];
                Array.from(el.options).forEach(opt => { opt.selected = values.includes(opt.value); });
            } else {
                el.value = Array.isArray(value) ? value[0] : value;
            }
        });

        Array.from(form.elements).forEach(el => {
            // roofType/subType are excluded here: their change handlers destructively
            // rebuild downstream DOM (subType's option list, the whole specific-concerns
            // section) — already handled once, correctly, by the cascade step above.
            if (el === roofTypeSelect || el === subTypeSelect) return;
            if (el.tagName === 'SELECT' || el.type === 'radio' || el.type === 'checkbox') {
                el.dispatchEvent(new Event('change'));
            }
        });
    }
}

function renderStoredPhotoPreviews(photoUrls) {
    Object.keys(photoUrls || {}).forEach(fieldName => {
        const input = document.querySelector(`[name="${CSS.escape(fieldName)}"]`);
        if (!input || !photoUrls[fieldName].length) return;
        const preview = document.createElement('div');
        preview.className = 'stored-photo-preview';
        photoUrls[fieldName].forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Previously uploaded photo';
            preview.appendChild(img);
        });
        input.insertAdjacentElement('afterend', preview);
    });
}

async function enterReviewMode(token) {
    window.__reviewToken = token;

    const banner = document.getElementById('reviewBanner');
    if (banner) banner.style.display = 'block';

    const submitBtn = document.querySelector('#roofReportForm button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Save Changes';

    const clearBtn = document.getElementById('clearForm');
    if (clearBtn) clearBtn.style.display = 'none';

    try {
        const draft = await fetchDraft(token);
        window.__narrativeOverrides = draft.narrative_overrides || {};
        window.__storedPhotoUrls = draft.photo_urls || {};

        const form = document.getElementById('roofReportForm');
        restoreFormState(form, draft.form_data || {});
        renderStoredPhotoPreviews(window.__storedPhotoUrls);

        generateReport();
        document.getElementById('reportOutput').style.display = 'block';
    } catch (err) {
        console.error(err);
        showDraftSyncStatus('Could not load this draft — the link may be invalid or expired.', 'error');
    }
}

// ---- Init -------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    setupNarrativeEditCapture();

    const token = new URLSearchParams(window.location.search).get('token');
    if (token) enterReviewMode(token);
});
