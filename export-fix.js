/**
 * TRIBE LEAGUE EXPORT FIX
 * Bu script tüm sayfalarda export sorununu çözer
 * Her sayfanın </body> etiketinden ÖNCE ekleyin
 */

// Override exportHTML function if it exists
if (typeof window.originalExportHTML === 'undefined' && typeof exportHTML === 'function') {
    window.originalExportHTML = exportHTML;
}

// Fixed export function that doesn't cause recursive script issues
window.exportHTMLFixed = function () {
    // Get current page's HTML structure
    const clone = document.documentElement.cloneNode(true);

    // Remove edit mode states
    clone.querySelector('#mainContainer')?.classList.remove('edit-mode');
    clone.querySelector('#loginOverlay')?.classList.remove('active');
    clone.querySelector('#editToolbar')?.classList.remove('active');
    clone.querySelector('#exportModal')?.classList.remove('active');

    // Show edit button
    const editBtn = clone.querySelector('#editBtn');
    if (editBtn) editBtn.style.display = 'flex';

    // Remove contenteditable attributes
    clone.querySelectorAll('[contenteditable]').forEach(el => {
        el.removeAttribute('contenteditable');
    });

    // Remove edit-only elements
    clone.querySelectorAll('.form-controls').forEach(el => el.remove());
    clone.querySelectorAll('.form-remove').forEach(el => el.remove());
    clone.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    clone.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

    // Clear export modal content
    const exportTextarea = clone.querySelector('#exportCode');
    if (exportTextarea) exportTextarea.value = '';

    // Generate clean HTML
    const finalHTML = '<!DOCTYPE html>\n' + clone.outerHTML;

    // Show in modal
    document.getElementById('exportCode').value = finalHTML;
    document.getElementById('exportModal').classList.add('active');
};

// Instructions
console.log('📦 Export Fix yüklendi! exportHTMLFixed() fonksiyonunu kullanabilirsiniz.');
