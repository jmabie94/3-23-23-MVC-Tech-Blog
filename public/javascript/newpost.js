const newPostForm = document.getElementById('new-blogpost');
const cancelBtn = document.getElementById('cancel');

const newPostHandler = async (event) => {
    event.preventDefault();

    const postTitle = document.getElementById('new-title').value;
    const postDesc = document.getElementById('new-description').value;
    const postStatusEl = document.getElementById('new-status');

    if (postTitle.length <= 4 || postDesc.length <=4) {
        postStatusEl.textContent = "All fields must be a minimum of 5 characters!"
        postStatusEl.style.color = 'red';
        postStatusEl.classList.add('is-danger');
        setTimeout(() => {
            postStatusEl.textContent = "Fill in all required inputs, no less than 5 characters are allowed."
            postStatusEl.style.color = 'black';
            postStatusEl.classList.remove('is-danger');
        }, 4000);
    } else {
        const response = await fetch('/api/blogposts', {
            method: 'POST',
            body: JSON.stringify({
                postTitle,
                postDesc,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            postStatusEl.textContent = "Blogpost Created Successfully!";
            postStatusEl.style.color = 'green';
            postStatusEl.classList.add('is-success');
            setTimeout(() => {
                document.location.replace('/dashboard');
            }, 1000);
        } else {
            alert(response.statusText);
        }
    }
};

const cancelHandler = async (event) => {
    event.preventDefault();

    // if they want to cancel, it refreshes the page to remove all inputted info
    document.location.replace('/newpost');
};

newPostForm.addEventListener('submit', newPostHandler);
cancelBtn.addEventListener('click', cancelHandler);