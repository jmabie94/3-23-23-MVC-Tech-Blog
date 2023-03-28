const newCommentForm = document.getElementById('comment-form');

async function addComment(newComment, postId) {
    const response = await fetch(`/api/comments/${postId}`, {
        method: 'POST',
        body: JSON.stringify({
            comment_text: newComment,
            post_id: postId,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        document.location.replace(`/post/${postId}`);
    } else {
        alert(response.statusText)
    }
};

const newCommentHandler = async (event) => {
    event.preventDefault();

    const comment_text = document.getElementById('comment-box').value;
    const commentStatusEl = document.getElementById('comment-status').value;

    if (comment_text.lenth <= 4) {
        commentStatusEl.textContent = "Comment must be a minimum of 5 characters!"
        commentStatusEl.style.color = 'red';
        setTimeout(() => {
            commentStatusEl.textContent = "Comment must be at least 5 characters long."
            commentStatusEl.style.color = 'black';
        }, 4000);
    } else {
        commentStatusEl.textContent = "Comment Posted Successfully!";
        commentStatusEl.style.color = 'green';
        setTimeout(() => {
            addComment(comment_text, postId)
        }, 1000);
    }
};

newCommentForm.addEventListener('submit', newCommentHandler);