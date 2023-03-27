const newPostForm = document.getElementById('new-blogpost');

const newPostHandler = async (event) => {
    event.preventDefault();

    const postTitle = document.getElementById('new-title').value;
    const postDesc = document.getElementById('new-description').value;
    const postStatusEl = document.getElementById('new-status');

    if (postTitle.length <= 4 || postDesc.length <=4) {
        postStatusEl.textContent = "All fields must be a minimum of 5 characters!"
        postStatusEl.style.color = 'red';
        setTimeout(() => {
            postStatusEl.textContent = "Fill in all required inputs, no less than 5 characters are allowed."
            postStatusEl.style.color = 'black';
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
            setTimeout(() => {
                document.location.replace('/dashboard');
            }, 1000);
        } else {
            alert(response.statusText);
        }
    }
};

newPostForm.addEventListener('submit', newPostHandler);