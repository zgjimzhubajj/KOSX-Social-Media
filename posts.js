const customPostsPerPage = 6;
let customCurrentPage = 1; 

class CustomUser {
    constructor(id, username, firstName, lastName, email, image) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.image = image;
    }

}

class CustomPost {
    constructor(id, title, body, userId, tags, reactions) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.userId = userId;
        this.tags = tags;
        this.reactions = reactions;
    }

}

function fetchCustomUserData(userId) {
    return fetch(`https://dummyjson.com/users/${userId}`)
        .then(response => response.json())
        .then(data => {
            return new CustomUser(data.id, data.username, data.firstName, data.lastName, data.email, data.image);
        })
        .catch(error => console.error('Error fetching user data:', error));
}

function fetchCustomComments(postId) {
    fetch(`https://dummyjson.com/comments/post/${postId}`)
        .then(response => response.json())
        .then(data => {
            data.comments.forEach(comment => {
                displayCustomComment(postId, comment);
            });
        })
        .catch(error => console.error('Error fetching comments:', error));
}

function displayCustomComment(postId, comment) {
    const customCommentsContainer = document.getElementById(`custom-comments-${postId}`);
    const customCommentElement = document.createElement('div');
    customCommentElement.className = 'custom-comment';
    customCommentElement.innerHTML = `<span class="custom-comment-username">${comment.user.username}:</span> ${comment.body}`;
    customCommentsContainer.appendChild(customCommentElement);
}

function displayCustomPagination(totalCount) {
    const totalPages = Math.ceil(totalCount / customPostsPerPage);
    const customPaginationContainer = document.getElementById('custom-pagination-container');
    customPaginationContainer.innerHTML = ''; 
  
    const customPrevButton = document.createElement('button');
    customPrevButton.textContent = 'Previous';
    customPrevButton.onclick = () => {
      if (customCurrentPage > 1) {
        customCurrentPage -= 1;
        fetchCustomPosts();
      }
    };
    customPaginationContainer.appendChild(customPrevButton);

    const customNextButton = document.createElement('button');
    customNextButton.textContent = 'Next';
    customNextButton.onclick = () => {
      if (customCurrentPage <  totalPages) {
        customCurrentPage += 1;
        fetchCustomPosts();
      }
    };
    customPaginationContainer.appendChild(customNextButton);

    customPrevButton.disabled = customCurrentPage === 1;
    customNextButton.disabled = customCurrentPage === totalPages;
}

function showCustomModal(user) {
    const customModal = document.getElementById('custom-userModal');
    const customModalBody = document.getElementById('custom-modal-body');

    customModalBody.innerHTML = `
        <img src="${user.image}" alt="The profile picture" style="border-radius: 50%; width: 120px;">
        <h2>User Profile</h2>
        <p>Username: ${user.username}</p>
        <p>Name: ${user.firstName} ${user.lastName}</p>
        <p>Email: ${user.email}</p>
    `;

    customModal.style.display = "block";
}

function displayCustomPost(post, user) {
    const customPostsContainer = document.getElementById('custom-posts-container'); 
    const customPostElement = document.createElement('div');
    customPostElement.className = 'custom-post';


    customPostElement.innerHTML = `
    <h2 class="custom-titles">🌟 Title: ${post.title}</h2>
    <div class="custom-authors">
        👤 Author: <span class="custom-author-link" data-userid="${user.id}">${user.username}</span>
    </div>
    <div class="custom-author-reactions">                
        <div class="custom-reactions">
            <i class="fas fa-thumbs-up like-btn" data-postid="${post.id}" style="color: blue;"></i>
            <span data-reaction="${post.reactions}">💖 Reactions: ${post.reactions}</span>
        </div>
    </div>
    <article>✍️ Post: ${post.body}</article>
    <div class="custom-postinfo">
        <div class="custom-tags">
            🏷️ Tags: <span class="custom-tag-link" data-tag="${post.tags}" style="color: green;">${post.tags.join(', ')}</span>
        </div>
    </div>
    <div class="custom-comtitle">💬 Comments:</div>
    <div class="custom-comhead" id="custom-comments-${post.id}"></div>
`;

    const customAuthorLink = customPostElement.querySelector('.custom-author-link');
    customAuthorLink.addEventListener('click', function() {
        showCustomModal(user); 
    });

    customPostsContainer.appendChild(customPostElement);
    fetchCustomComments(post.id);
}

function fetchCustomPosts() {
    const customPostsContainer = document.getElementById('custom-posts-container');
    customPostsContainer.innerHTML = ''; 

    const skip = (customCurrentPage - 1) * customPostsPerPage;
    const limit = customPostsPerPage;

    fetch(`https://dummyjson.com/posts?skip=${skip}&limit=${limit}`)
        .then(response => response.json())
        .then(data => {
            const totalCount = data.total; 
            
            let customUserPromises = data.posts.map(post => fetchCustomUserData(post.userId));
            Promise.all(customUserPromises)
                .then(users => {
                    data.posts.forEach((post, index) => {
                        displayCustomPost(post, users[index]);
                    });
                });
            
            displayCustomPagination(totalCount);
        })
        .catch(error => console.error('Error fetching posts:', error));
}

document.addEventListener('DOMContentLoaded', fetchCustomPosts);
