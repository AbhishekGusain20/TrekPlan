/* =====================================================
   TREKPLAN — COMMUNITY
===================================================== */


/* ================= ELEMENTS ================= */

const postForm =
    document.getElementById("postForm");

const postDestination =
    document.getElementById("postDestination");

const postType =
    document.getElementById("postType");

const postText =
    document.getElementById("postText");

const postsContainer =
    document.getElementById("postsContainer");

const postCount =
    document.getElementById("postCount");

const trekCount =
    document.getElementById("trekCount");

const searchInput =
    document.getElementById("searchInput");

const noSearchResult =
    document.getElementById("noSearchResult");

const scrollPostButton =
    document.getElementById("scrollPostButton");

const mobileMenu =
    document.getElementById("mobileMenu");

const sidebar =
    document.querySelector(".sidebar");

const logoutBtn =
    document.getElementById("logoutBtn");

const userName =
    document.getElementById("userName");

const userAvatar =
    document.getElementById("userAvatar");

const topAvatar =
    document.getElementById("topAvatar");


/* ================= STORAGE KEY ================= */

const STORAGE_KEY =
    "trekplan_community_posts";


/* ================= USER ================= */

function getCurrentUser() {

    let name = "AVI";

    const savedUser =
        localStorage.getItem("trekplan_user");

    if (savedUser) {

        try {

            const user =
                JSON.parse(savedUser);

            if (user.name) {
                name = user.name;
            }

        } catch (error) {

            console.log("User data error");

        }

    }

    return name;
}


/* ================= USER DISPLAY ================= */

const currentUser =
    getCurrentUser();

userName.textContent =
    currentUser.toUpperCase();

userAvatar.textContent =
    currentUser.charAt(0).toUpperCase();

topAvatar.textContent =
    currentUser.charAt(0).toUpperCase();


/* ================= GET POSTS ================= */

function getPosts() {

    const savedPosts =
        localStorage.getItem(STORAGE_KEY);

    if (savedPosts) {

        return JSON.parse(savedPosts);

    }

    return [];
}


/* ================= SAVE POSTS ================= */

function savePosts(posts) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(posts)
    );

}


/* ================= DISPLAY POSTS ================= */

function displayPosts(posts) {

    postsContainer.innerHTML = "";

    if (posts.length === 0) {

        noSearchResult.style.display =
            "block";

        noSearchResult.textContent =
            "No community posts yet. Be the first to share your adventure!";

        return;
    }


    noSearchResult.style.display =
        "none";


    posts.forEach(function (post) {

        const card =
            document.createElement("div");

        card.className =
            "post-card";


        card.innerHTML = `

            <div class="post-user">

                <div class="post-avatar">
                    ${post.user.charAt(0).toUpperCase()}
                </div>

                <div class="post-user-info">

                    <strong>
                        ${post.user}
                    </strong>

                    <span>
                        ${post.date}
                    </span>

                </div>

            </div>


            <span class="post-tag">
                ${post.type}
            </span>


            <h3>
                ${post.destination}
            </h3>


            <p>
                ${post.text}
            </p>


            <div class="post-location">
                📍 ${post.destination}
            </div>


            <div class="post-actions">

                <button
                    class="${post.liked ? "liked" : ""}"
                    onclick="likePost(${post.id})">

                    ❤️ ${post.likes}

                </button>


                <button>
                    💬 Comment
                </button>


                <button
                    class="delete-post"
                    onclick="deletePost(${post.id})">

                    🗑 Delete

                </button>

            </div>

        `;


        postsContainer.appendChild(card);

    });

}


/* ================= CREATE POST ================= */

postForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const destination =
            postDestination.value.trim();

        const type =
            postType.value;

        const text =
            postText.value.trim();


        if (
            destination === "" ||
            text === ""
        ) {

            alert(
                "Please fill all required fields."
            );

            return;
        }


        const posts =
            getPosts();


        const newPost = {

            id: Date.now(),

            user: currentUser,

            destination: destination,

            type: type,

            text: text,

            likes: 0,

            liked: false,

            date: new Date().toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            )

        };


        posts.unshift(newPost);


        savePosts(posts);


        postForm.reset();


        displayPosts(posts);

        updateStats(posts);


        alert(
            "Your post has been published! 🎉"
        );

    }
);


/* ================= LIKE ================= */

function likePost(id) {

    const posts =
        getPosts();


    const post =
        posts.find(function (item) {

            return item.id === id;

        });


    if (!post) {
        return;
    }


    if (post.liked) {

        post.likes--;

        post.liked = false;

    } else {

        post.likes++;

        post.liked = true;

    }


    savePosts(posts);

    displayPosts(posts);

}


/* ================= DELETE ================= */

function deletePost(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this post?"
        );


    if (!confirmDelete) {
        return;
    }


    let posts =
        getPosts();


    posts =
        posts.filter(function (post) {

            return post.id !== id;

        });


    savePosts(posts);

    displayPosts(posts);

    updateStats(posts);

}


/* ================= STATS ================= */

function updateStats(posts) {

    postCount.textContent =
        posts.length;


    const destinations = [];


    posts.forEach(function (post) {

        const destination =
            post.destination.toLowerCase();


        if (
            !destinations.includes(destination)
        ) {

            destinations.push(destination);

        }

    });


    trekCount.textContent =
        destinations.length;

}


/* ================= SEARCH ================= */

searchInput.addEventListener(
    "input",
    function () {

        const value =
            searchInput.value
                .toLowerCase()
                .trim();


        const posts =
            getPosts();


        if (value === "") {

            displayPosts(posts);

            return;

        }


        const filteredPosts =
            posts.filter(function (post) {

                return (

                    post.destination
                        .toLowerCase()
                        .includes(value)

                    ||

                    post.text
                        .toLowerCase()
                        .includes(value)

                    ||

                    post.type
                        .toLowerCase()
                        .includes(value)

                    ||

                    post.user
                        .toLowerCase()
                        .includes(value)

                );

            });


        if (filteredPosts.length === 0) {

            postsContainer.innerHTML = "";

            noSearchResult.style.display =
                "block";

            noSearchResult.textContent =
                "No posts found.";

        } else {

            displayPosts(filteredPosts);

        }

    }
);


/* ================= SHARE BUTTON ================= */

scrollPostButton.addEventListener(
    "click",
    function () {

        document
            .getElementById("createPostSection")
            .scrollIntoView({
                behavior: "smooth"
            });


        postDestination.focus();

    }
);


/* ================= MOBILE MENU ================= */

mobileMenu.addEventListener(
    "click",
    function () {

        sidebar.classList.toggle("show");

    }
);


/* ================= LOGOUT ================= */

logoutBtn.addEventListener(
    "click",
    function () {

        const confirmLogout =
            confirm(
                "Do you want to logout?"
            );


        if (!confirmLogout) {
            return;
        }


        localStorage.removeItem(
            "trekplan_session"
        );

        sessionStorage.removeItem(
            "trekplan_session"
        );


        window.location.href =
            "login.html";

    }
);


/* ================= INITIAL LOAD ================= */

const posts =
    getPosts();


displayPosts(posts);

updateStats(posts);