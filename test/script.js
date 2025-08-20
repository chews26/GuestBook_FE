document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('post-form');
    const postsContainer = document.getElementById('posts-container');

    const getPosts = () => {
        const posts = localStorage.getItem('posts');
        return posts ? JSON.parse(posts) : [];
    };

    const savePosts = (posts) => {
        localStorage.setItem('posts', JSON.stringify(posts));
    };

    const renderPosts = () => {
        postsContainer.innerHTML = '';
        const posts = getPosts();
        posts.sort((a, b) => b.id - a.id); // 최신 글이 위로 오도록 정렬
        posts.forEach(post => {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
        });
    };

    const createPostElement = (post) => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.dataset.id = post.id;

        const postHeader = document.createElement('div');
        postHeader.classList.add('post-header');

        const postTitle = document.createElement('h2');
        postTitle.classList.add('post-title');
        postTitle.textContent = post.title;

        const postMeta = document.createElement('span');
        postMeta.classList.add('post-meta');
        postMeta.textContent = new Date(post.timestamp).toLocaleString('ko-KR');
        
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.innerHTML = '&times;';
        deleteButton.title = '삭제';

        deleteButton.addEventListener('click', () => {
            const password = prompt('삭제하려면 비밀번호를 입력하세요.');
            if (password === null) return;

            if (password === post.password) {
                deletePost(post.id);
            } else {
                alert('비밀번호가 일치하지 않습니다.');
            }
        });

        const postContent = document.createElement('p');
        postContent.classList.add('post-content');
        postContent.textContent = post.content;
        
        postHeader.appendChild(postTitle);
        postHeader.appendChild(postMeta);

        postDiv.appendChild(deleteButton);
        postDiv.appendChild(postHeader);
        postDiv.appendChild(postContent);

        return postDiv;
    };

    const addPost = (title, content, password) => {
        const posts = getPosts();
        const newPost = {
            id: Date.now(),
            title,
            content,
            password,
            timestamp: new Date().toISOString()
        };
        posts.push(newPost);
        savePosts(posts);
        renderPosts();
    };

    const deletePost = (id) => {
        let posts = getPosts();
        posts = posts.filter(post => post.id !== id);
        savePosts(posts);
        renderPosts();
    };

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title').value.trim();
        const content = document.getElementById('post-content').value.trim();
        const password = document.getElementById('post-password').value.trim();

        if (title && content && password) {
            addPost(title, content, password);
            postForm.reset();
        } else {
            alert('제목, 내용, 비밀번호를 모두 입력해주세요.');
        }
    });

    renderPosts();
});

