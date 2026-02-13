
const getDataUsers = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json();
    return data;
}

const getDataPosts = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    return data;
}

const getDataComments = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/comments');
    const data = await response.json();
    return data;
}

const getDataPostById = async (postId = 1) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    const data = await response.json();
    return data;
}
const getDataCommentsByPostId = async (postId = 1) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
    const data = await response.json();
    return data;
}

// 4 5 Filter only users with more than 3 comments and reformat with counts
const filterUsersWithComments = async () => {
    try {
        const [users, posts, comments] = await Promise.all([
            getDataUsers(),
            getDataPosts(),
            getDataComments()
        ]);

        const usersWithData = users.map(user => {
            const userPosts = posts.filter(post => post.userId === user.id);
            const userComments = comments.filter(comment => {
                const postIds = userPosts.map(post => post.id);
                return postIds.includes(comment.postId);
            });

            return {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                postsCount: userPosts.length,
                commentsCount: userComments.length,
            };
        });

        const filteredUsers = usersWithData.filter(user => user.commentsCount > 3);

        console.log('Users with more than 3 comments:');
        // console.log(filteredUsers);
        console.log(usersWithData);

        return filteredUsers;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// 6 Get user with the most comments/posts
const getUserWithMostActivity = async () => {
    try {
        const [users, posts, comments] = await Promise.all([
            getDataUsers(),
            getDataPosts(),
            getDataComments()
        ]);

        const usersWithData = users.map(user => {
            const userPosts = posts.filter(post => post.userId === user.id);
            const userComments = comments.filter(comment => {
                const postIds = userPosts.map(post => post.id);
                return postIds.includes(comment.postId);
            });

            return {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                postsCount: userPosts.length,
                commentsCount: userComments.length,
                totalActivity: userPosts.length + userComments.length
            };
        });

        // Find user with maximum activity
        const userWithMostActivity = usersWithData.reduce((max, user) =>
            user.totalActivity > max.totalActivity ? user : max
        );

        console.log('User with the most comments/posts:');
        console.log(userWithMostActivity);

        return userWithMostActivity;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// 7 Run both functions
const sortUsersByPostsCount = async () => {
    try {
        const [users, posts] = await Promise.all([
            getDataUsers(),
            getDataPosts()
        ]);

        const usersWithData = users.map(user => {
            const userPosts = posts.filter(post => post.userId === user.id);
            return {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                postsCount: userPosts.length
            };
        });

        const sortedUsers = usersWithData.sort((a, b) => b.postsCount - a.postsCount);

        console.log('Users sorted by posts count:');
        console.log(sortedUsers);

        return sortedUsers;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Lấy bài viết có ID là 1 và các bình luận của nó
const getPostWithComments = async (postId = 1) => {
    try {
        const [postResponse, commentsResponse] = await Promise.all([
            getDataPostById(postId),
            getDataCommentsByPostId(postId)
        ]);

        const post = await postResponse;
        const comments = await commentsResponse;

        const postWithComments = {
            id: post.id,
            title: post.title,
            body: post.body,
            userId: post.userId,
            commentsCount: comments.length,
            comments: comments.map(comment => ({
                id: comment.id,
                name: comment.name,
                email: comment.email,
                body: comment.body
            }))
        };

        console.log('Post with comments:');
        console.log(JSON.stringify(postWithComments, null, 2));

        return postWithComments;
    } catch (error) {
        console.error('Error fetching post with comments:', error);
    }
}
