let allPosts = []; // Store all fetched posts
let filteredPosts = []; // Store currently displayed posts

function showPosts(event) {
    event.preventDefault(); // Prevent the default anchor behavior
    
    const mainContent = document.getElementById('main-content');
    const accountsContainer = document.querySelector('.accounts-container'); // Select the accounts container
    
    // Hide the accounts container
    accountsContainer.style.display = 'none';

    // Clear main content before displaying posts
    mainContent.innerHTML = ''; 

    // Create posts HTML
    const postsHTML = `
        <h3>All Posts</h3>
        <div>
            <button onclick="filterPosts('all')" class="btn btn-info">All Deals</button>
            <button onclick="filterPosts('active')" class="btn btn-success">Active Deals</button>
            <button onclick="filterPosts('closed')" class="btn btn-danger">Closed Deals</button>
        </div>
        <div id="posts-list"></div>
    `;

    // Set mainContent to display posts
    mainContent.innerHTML = postsHTML; 
    
    // Show the posts section and fetch the posts
    fetchPosts(); // Call the function to fetch posts
}


function fetchPosts() {
    fetch(`/post/getAllPosts`)
        .then(response => {
            console.log("Response status:", response.status); // Debug log
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(posts => {
            console.log("Posts fetched:", posts); // Debug log
            allPosts = posts; // Store all posts
            filteredPosts = posts; // Initialize filtered posts
            displayPosts(filteredPosts); // Display all posts initially
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            const postsList = document.getElementById('posts-list');
            postsList.innerHTML = '<p>Error loading posts.</p>';
        });
}

function displayPosts(posts) {
    const postsList = document.getElementById('posts-list');
    postsList.innerHTML = ''; // Clear existing posts
    if (posts.length > 0) {
        // Sort posts by timestamp (latest first)
        posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post mb-2';
            
            // Create post content with or without button depending on the deal status
            postDiv.innerHTML = `
                <p><strong>Donor:</strong> ${post.donorUsername || 'Unknown'}</p>
                <p><strong>Location:</strong> ${post.location || 'Not specified'}</p>
                <p><strong>Available Food:</strong> ${post.availableFood.join(', ') || 'None'}</p>
                <p><strong>Timestamp:</strong> ${new Date(post.timestamp).toLocaleString()}</p>
                <p><strong>Deal Closed:</strong> ${post.isDealClosed ? 'Yes' : 'No'}</p>
                ${post.isDealClosed 
                    ? '<p><strong>Status:</strong> Deal Closed</p>' 
                    : `<button class="btn btn-primary" onclick="sendRequest('${post._id}')">Send Request</button>`}
            `;
            
            postsList.appendChild(postDiv);
        });
    } else {
        postsList.innerHTML = '<p>No posts found.</p>';
    }
}

function sendRequest(postId) {
    fetch('/user/sendRequest', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('user_jwt')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            post_id: postId 
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
}

function filterPosts(criteria) {
    // Filter posts based on deal status
    if (criteria === 'active') {
        filteredPosts = allPosts.filter(post => !post.isDealClosed);
    } else if (criteria === 'closed') {
        filteredPosts = allPosts.filter(post => post.isDealClosed);
    } else {
        filteredPosts = allPosts; // Show all posts when 'all' is selected
    }
    
    displayPosts(filteredPosts); // Display filtered posts
}
