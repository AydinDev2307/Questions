const accordion = document.getElementById('accordions');
const addBtn = document.getElementById('addBtn');
const editModal = document.getElementById('editModal');
const cancelBtn = document.getElementById('cancelBtn');
const questionInput = document.getElementById('questionInput');
const answerInput = document.getElementById('answerInput');
const modalTitle = document.getElementById('modalTitle');
const saveBtn = document.getElementById('saveBtn');

let posts = [];
let editingId = null;

window.addEventListener('DOMContentLoaded', () => {
  getPosts();
});

addBtn.addEventListener('click', () => {
  editModal.style.display = 'flex';
  modalTitle.textContent = "Savol qo'shish";
  saveBtn.textContent = 'Saqlash';
  questionInput.value = '';
  answerInput.value = '';
  editingId = null;
});

cancelBtn.addEventListener('click', () => {
  editModal.style.display = 'none';
  questionInput.value = '';
  answerInput.value = '';
  editingId = null;
});

function toggleAnswer(el) {
  const body = el.nextElementSibling;
  el.classList.toggle('active');
  body.classList.toggle('show');
}

async function addPost() {
  let newPost = {
    question: questionInput.value,
    answer: answerInput.value,
  };
  try {
    if (!editingId) {
      let res = await fetch('https://faq-crud.onrender.com/api/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });
      if (res.ok) {
        questionInput.value = '';
        answerInput.value = '';
        editModal.style.display = 'none';
        alert('Muvaffaqiyatli');
        getPosts();
      }
    } else {
      let res = await fetch(
        `https://faq-crud.onrender.com/api/faqs/${editingId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPost),
        }
      );
      if (res.ok) {
        questionInput.value = '';
        answerInput.value = '';
        editModal.style.display = 'none';
        alert('Muvaffaqiyatli');
        saveBtn.textContent = 'Saqlash';
        getPosts();
        editingId = null;
      }
    }
  } catch (error) {
    alert('Olishda muammo yuzaga keldi');
  }
}

saveBtn.addEventListener('click', (e) => {
  e.preventDefault();
  addPost();
});

async function deletePost(id) {
  try {
    if (confirm('Tasdiqlaysizmi?')) {
      let del = await fetch(`https://faq-crud.onrender.com/api/faqs/${id}`, {
        method: 'DELETE',
      });
      if (del.ok) {
        alert('Muvaffaqiyatli');
        getPosts();
      }
    }
  } catch (error) {
    alert('Uchirishda muammo yuzaga keldi...');
  }
}

function editPost(id) {
  editingId = id;
  let m = posts.find((d) => d.id === id);
  questionInput.value = m.question;
  answerInput.value = m.answer;
  editModal.style.display = 'flex';
  modalTitle.textContent = 'Savolni tahrirlash';
  saveBtn.textContent = 'Yangilash';
}

async function getPosts() {
  let res = await fetch('https://faq-crud.onrender.com/api/faqs');
  let { data } = await res.json();
  posts = data;
  render();
}

function render() {
  if (!posts.length) {
    accordion.innerHTML = `
      <div class="empty-message">Ma'lumot yo'q 😕</div>
    `;
    return;
  }

  accordion.innerHTML = posts
    .map((post) => {
      return `
      <div class="faq-item">
        <div class="question" onclick="toggleAnswer(this)">
          <h1>${post.question}</h1>
          <div class="btn-group">
            <button class="edit-btn" onclick="editPost(${post.id})">Tahrirlash</button>
            <button class="delete-btn" onclick="deletePost(${post.id})">O'chirish</button>
          </div>
        </div>
        <div class="answer">
          <h1>${post.answer}</h1>
        </div>
      </div>
    `;
    })
    .join('');
}

window.toggleAnswer = toggleAnswer;
window.editPost = editPost;
window.deletePost = deletePost;
