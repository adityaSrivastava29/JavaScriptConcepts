
const githubUserInfoURL = "https://api.github.com/users/adityasrivastava29"; 

const user = fetch(githubUserInfoURL);


console.log(user); // This will log a Promise object
user.then((response) => {
    return response.json(); // Convert the response to JSON
}).then((data) => {
    console.log(data); // This will log the user data
    document.getElementById('userinfo').innerHTML = `
        <h1> User information from github api using promises</h1>
        <img src="${data.avatar_url}" alt="Avatar" style="width: 100px; height: 100px; border-radius: 50%;">
        <h2>${data.name}</h2>
        <p>Username: ${data.login}</p>
        <p>Bio: ${data.bio}</p>
        <p>Location: ${data.location}</p>
        <p>Followers: ${data.followers}</p>
        <p>Following: ${data.following}</p>  
    `; // Display user data in the HTML
}).catch((error) => {
    console.error("Error fetching user data:", error); // Handle any errors
}); // Catch any errors in the promise chain



// 1. CREATING A BASIC PROMISE
// This is a simple promise that resolves after 1 second
// It simulates an asynchronous operation
// This is a basic example of how promises work in JavaScript
const myPromise = new Promise((resolve, reject) => {
    const success = true; // Simulate success/failure
    
    setTimeout(() => {
        if (success) {
            resolve("Operation successful!"); // Fulfill the promise
        } else {
            reject("Operation failed!"); // Reject the promise
        }
    }, 1000);
});

// Using the promise
myPromise
    .then(result => console.log(result + " ---- This is the result of the promise"))
    .catch(error => console.error(error));

// 2. REAL-WORLD EXAMPLE - API CALL SIMULATION
function fetchUserData(userId) {
    return new Promise((resolve, reject) => {
        // Simulate API call delay
        setTimeout(() => {
            if (userId > 0) {
                resolve({
                    id: userId,
                    name: "Aditya Kumar",
                    email: "aditya@example.com"
                });
            } else {
                reject(new Error("Invalid user ID"));
            }
        }, 1500);
    });
}

// 3. PROMISE CHAINING
fetchUserData(1)
    .then(user => {
        console.log("User fetched:", user);
        // Return another promise
        return fetchUserPosts(user.id);
    })
    .then(posts => {
        console.log("Posts fetched:", posts);
        return posts.length;
    })
    .then(postCount => {
        console.log("Total posts:", postCount);
    })
    .catch(error => {
        console.error("Error in chain:", error.message);
    });

function fetchUserPosts(userId) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                { id: 1, title: "First Post" },
                { id: 2, title: "Second Post" }
            ]);
        }, 1000);
    });
}

// 4. PROMISE.ALL() - PARALLEL EXECUTION
const promise1 = fetchUserData(1);
const promise2 = fetchUserData(2);
const promise3 = fetchUserData(3);

Promise.all([promise1, promise2, promise3])
    .then(users => {
        console.log("All users fetched:", users);
    })
    .catch(error => {
        console.error("One or more promises failed:", error);
    });

// 5. PROMISE.ALLSETTLED() - HANDLE BOTH SUCCESS AND FAILURE
Promise.allSettled([
    fetchUserData(1),
    fetchUserData(-1), // This will fail
    fetchUserData(2)
])
.then(results => {
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            console.log(`Promise ${index} succeeded:`, result.value);
        } else {
            console.log(`Promise ${index} failed:`, result.reason.message);
        }
    });
});

// 6. PROMISE.RACE() - FIRST TO COMPLETE WINS
const slowPromise = new Promise(resolve => 
    setTimeout(() => resolve("Slow"), 3000)
);
const fastPromise = new Promise(resolve => 
    setTimeout(() => resolve("Fast"), 1000)
);

Promise.race([slowPromise, fastPromise])
    .then(result => console.log("Winner:", result)); // "Fast"

// 7. ERROR HANDLING PATTERNS
function handleAsyncOperation() {
    return fetchUserData(1)
        .then(user => {
            if (!user.email) {
                throw new Error("User has no email");
            }
            return user;
        })
        .catch(error => {
            console.error("Handling error:", error.message);
            // Return default user or re-throw
            return { id: 0, name: "Guest", email: "guest@example.com" };
        });
}

// 8. CONVERTING CALLBACKS TO PROMISES
function promisifiedSetTimeout(delay) {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    });
}

// Usage
promisifiedSetTimeout(2000)
    .then(() => console.log("2 seconds have passed"));

// 9. ASYNC/AWAIT WITH PROMISES (Modern approach)
async function modernAsyncFunction() {
    try {
        const user = await fetchUserData(1);
        const posts = await fetchUserPosts(user.id);
        console.log("User and posts:", { user, posts });
    } catch (error) {
        console.error("Async/await error:", error.message);
    }
}

// 10. PROMISE FINALLY
fetchUserData(1)
    .then(user => console.log("Success:", user))
    .catch(error => console.error("Error:", error))
    .finally(() => console.log("Cleanup operations"));

// 11. CREATING IMMEDIATELY RESOLVED/REJECTED PROMISES
const resolvedPromise = Promise.resolve("Immediate success");
const rejectedPromise = Promise.reject("Immediate failure");

resolvedPromise.then(console.log); // "Immediate success"
rejectedPromise.catch(console.error); // "Immediate failure"