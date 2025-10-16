const accordion = document.getElementById('accordions');
const addBtn = document.getElementById('addBtn');
const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const questionInput = document.getElementById('questionInput');
const answerInput = document.getElementById('answerInput');
const modalTitle = document.getElementById('modalTitle');

let posts = [];
let editingId = null;
let deletingId = null;
window.addEventListener('DOMContentLoaded', () => {
  getPosts();
});
function toggleAnswer(element) {
  const answerDiv = element.nextElementSibling;
  answerDiv.classList.toggle('show');
}
async function getPosts() {
  const res = await fetch('https://faq-crud.onrender.com/api/faqs');
  const { data } = await res.json();
  posts = data;
  render();
}
function render() {
  accordion.innerHTML = posts
    .map((post) => {
      return `
      <div>
        <div class="question" onclick="toggleAnswer(this)">
          <h1>${post.question}</h1>
          <div class="btn-group">
          </div>
        </div>
        <div class="answer">
          <h1>${post.answer}</h1>
          <div class = 'btns'>
  <button>O'chirish</button>
  <button>Tahrirlash</button>
</div>
        </div>
      </div>
    `;
    })
    .join('');
}
function escapeHtml(text) {
  return text.replace(/'/g, '&apos;').replace(/"/g, '&quot;');
}
addBtn.addEventListener('click', () => {
  editingId = null;
  modalTitle.textContent = "Savol qo'shish";
  questionInput.value = '';
  answerInput.value = '';
  editModal.style.display = 'flex';
});

saveBtn.addEventListener('click', async () => {
  const title = questionInput.value.trim();
  const content = answerInput.value.trim();
  if (!title && !content) {
    alert("Iltimos, barcha maydonlarni to'ldiring!");
    return;
  }
  try {
    let response;
  } catch {
    console.log(error.message);
  }
  if (editingId) {
    response = await fetch(
      'https://faq-crud.onrender.com/api/faqs${editingId}',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      }
    );
  } else {
    response = await fetch('https://faq-crud.onrender.com/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
  }
});
cancelBtn.addEventListener('click', () => {
  editModal.style.display = 'none';
});
// ustoz quldan kelgani shu buldi juda kup xato chiqdi aniqlolmadim