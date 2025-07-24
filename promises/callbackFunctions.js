// There are 2 Parts of Callback:

// Good Part of callback - Callback are super important while writing asynchronous code in JS
// Bad Part of Callback - Using callback we can face issue:
// 1 . Callback Hell
// 2 .Inversion of control
// Callback Hell: When we have multiple nested callbacks, it becomes hard to read and maintain the code.
// Inversion of Control: When we pass a callback function to another function, we lose control over the execution flow.
// This can lead to unexpected behavior and bugs in the code.
// To avoid these issues, we can use Promises or Async/Await in modern JavaScript.

// =====================================
// PART 1: BASIC CALLBACK EXAMPLES
// =====================================

console.log("=== BASIC CALLBACK EXAMPLES ===");

// Example 1: Simple callback function
function greetUser(name, callback) {
    console.log(`Hello, ${name}!`);
    callback();
}

function afterGreeting() {
    console.log("Nice to meet you!");
}

// Usage
greetUser("Aditya", afterGreeting);

// Example 2: Callback with parameters
function processData(data, successCallback, errorCallback) {
    if (data && data.length > 0) {
        successCallback(`Processed: ${data}`);
    } else {
        errorCallback("No data provided");
    }
}

// Usage
processData("user data", 
    (result) => console.log("Success:", result),
    (error) => console.log("Error:", error)
); // Output: Success: Processed: user data

// Example 3: Array methods using callbacks (built-in examples)
const numbers = [1, 2, 3, 4, 5];

numbers.forEach((num) => {
    console.log(`Number: ${num}`);
});

const doubled = numbers.map((num) => num * 2);
console.log("Doubled:", doubled);

// =====================================
// PART 2: ASYNCHRONOUS CALLBACK EXAMPLES
// =====================================

console.log("\n=== ASYNCHRONOUS CALLBACK EXAMPLES ===");

// Example 1: setTimeout with callback
function delayedMessage(message, delay, callback) {
    console.log("Starting timer...");
    setTimeout(() => {
        console.log(message);
        callback();
    }, delay);
}

delayedMessage("This message is delayed!", 2000, () => {
    console.log("Timer completed!");
});

// Example 2: Simulating API calls with callbacks
function fetchUserData(userId, callback) {
    console.log(`Fetching user data for ID: ${userId}`);
    
    // Simulate network delay
    setTimeout(() => {
        const userData = {
            id: userId,
            name: "Aditya Kumar Srivastava",
            email: "Aditya@example.com"
        };
        callback(null, userData); // First param is error, second is data
    }, 1000);
}

// Usage
fetchUserData(123, (error, data) => {
    if (error) {
        console.log("Error fetching user:", error);
    } else {
        console.log("User data received:", data);
    }
});

// =====================================
// PART 3: CALLBACK HELL SCENARIOS
// =====================================

console.log("\n=== CALLBACK HELL EXAMPLES ===");

// Scenario 1: Sequential API calls creating callback hell
function getUserProfile(userId, callback) {
    console.log("Step 1: Fetching user profile...");
    setTimeout(() => {
        callback(null, { userId, name: "Aditya Kumar Srivastava", profileComplete: true });
    }, 500);
}

function getUserPosts(userId, callback) {
    console.log("Step 2: Fetching user posts...");
    setTimeout(() => {
        callback(null, [
            { id: 1, title: "First Post", likes: 10 },
            { id: 2, title: "Second Post", likes: 25 }
        ]);
    }, 500);
}

function getPostComments(postId, callback) {
    console.log(`Step 3: Fetching comments for post ${postId}...`);
    setTimeout(() => {
        callback(null, [
            { id: 1, text: "Great post!", author: "Aditya" },
            { id: 2, text: "Thanks for sharing!", author: "Bob" }
        ]);
    }, 500);
}

function getCommentReplies(commentId, callback) {
    console.log(`Step 4: Fetching replies for comment ${commentId}...`);
    setTimeout(() => {
        callback(null, [
            { id: 1, text: "I agree!", author: "Sushmita" }
        ]);
    }, 500);
}

// THE CALLBACK HELL - Pyramid of Doom!
console.log("Starting callback hell example...");

getUserProfile(123, (err, profile) => {
    if (err) {
        console.log("Error:", err);
        return;
    }
    console.log("Got profile:", profile);
    
    getUserPosts(profile.userId, (err, posts) => {
        if (err) {
            console.log("Error:", err);
            return;
        }
        console.log("Got posts:", posts);
        
        getPostComments(posts[0].id, (err, comments) => {
            if (err) {
                console.log("Error:", err);
                return;
            }
            console.log("Got comments:", comments);
            
            getCommentReplies(comments[0].id, (err, replies) => {
                if (err) {
                    console.log("Error:", err);
                    return;
                }
                console.log("Got replies:", replies);
                console.log("🔥 CALLBACK HELL COMPLETED! 🔥");
                
                // Imagine if we needed to go deeper...
                // This is where it becomes unmaintainable!
            });
        });
    });
});

// =====================================
// PART 4: INVERSION OF CONTROL PROBLEM
// =====================================

console.log("\n=== INVERSION OF CONTROL EXAMPLES ===");

// Problem: We lose control over when/how our callback is executed
function unreliableThirdPartyAPI(data, callback) {
    // This simulates unreliable third-party code
    const random = Math.random();
    
    if (random < 0.3) {
        // Sometimes doesn't call the callback at all!
        console.log("😱 Third-party code forgot to call callback!");
        return;
    } else if (random < 0.6) {
        // Sometimes calls it multiple times!
        console.log("😱 Third-party code calling callback multiple times!");
        callback("First call");
        setTimeout(() => callback("Second call"), 100);
    } else {
        // Sometimes calls it with wrong parameters
        console.log("😱 Third-party code calling with wrong params!");
        callback(null, null, "unexpected extra param");
    }
}

// Our callback - we expect it to be called once with proper params
function ourCallback(result) {
    console.log("Our callback received:", result);
    // This might execute 0, 1, or multiple times!
}

console.log("Testing unreliable third-party API:");
unreliableThirdPartyAPI("some data", ourCallback);

// =====================================
// PART 5: REAL-WORLD CALLBACK HELL SCENARIO
// =====================================

console.log("\n=== REAL-WORLD SCENARIO: E-COMMERCE CHECKOUT ===");

// Simulating an e-commerce checkout process with multiple dependent steps
function validateUser(userId, callback) {
    setTimeout(() => {
        console.log("✓ User validated");
        callback(null, { valid: true, userId });
    }, 300);
}

function checkInventory(productId, quantity, callback) {
    setTimeout(() => {
        console.log("✓ Inventory checked");
        callback(null, { available: true, productId, quantity });
    }, 400);
}

function processPayment(amount, paymentMethod, callback) {
    setTimeout(() => {
        console.log("✓ Payment processed");
        callback(null, { success: true, transactionId: "txn_123", amount });
    }, 600);
}

function updateInventory(productId, quantity, callback) {
    setTimeout(() => {
        console.log("✓ Inventory updated");
        callback(null, { updated: true });
    }, 200);
}

function sendConfirmationEmail(userEmail, orderDetails, callback) {
    setTimeout(() => {
        console.log("✓ Confirmation email sent");
        callback(null, { emailSent: true });
    }, 300);
}

function createOrderRecord(orderData, callback) {
    setTimeout(() => {
        console.log("✓ Order record created");
        callback(null, { orderId: "order_456", status: "completed" });
    }, 250);
}

// THE REAL CALLBACK HELL - E-commerce checkout
function processCheckout(userId, productId, quantity, amount, paymentMethod, userEmail) {
    console.log("🛒 Starting checkout process...");
    
    validateUser(userId, (err, userValidation) => {
        if (err) return console.log("Checkout failed at user validation:", err);
        
        checkInventory(productId, quantity, (err, inventoryCheck) => {
            if (err) return console.log("Checkout failed at inventory check:", err);
            
            processPayment(amount, paymentMethod, (err, paymentResult) => {
                if (err) return console.log("Checkout failed at payment:", err);
                
                updateInventory(productId, quantity, (err, inventoryUpdate) => {
                    if (err) {
                        // Now we need to refund the payment! More callbacks!
                        console.log("Checkout failed at inventory update:", err);
                        return;
                    }
                    
                    createOrderRecord({
                        userId: userValidation.userId,
                        productId: inventoryCheck.productId,
                        amount: paymentResult.amount,
                        transactionId: paymentResult.transactionId
                    }, (err, orderRecord) => {
                        if (err) return console.log("Checkout failed at order creation:", err);
                        
                        sendConfirmationEmail(userEmail, {
                            orderId: orderRecord.orderId,
                            amount: paymentResult.amount
                        }, (err, emailResult) => {
                            if (err) {
                                console.log("Order created but email failed:", err);
                            }
                            
                            console.log("🎉 CHECKOUT COMPLETED SUCCESSFULLY!");
                            console.log("Final result:", {
                                orderId: orderRecord.orderId,
                                transactionId: paymentResult.transactionId,
                                emailSent: emailResult.emailSent
                            });
                        });
                    });
                });
            });
        });
    });
}

// Execute the callback hell checkout
setTimeout(() => {
    processCheckout(123, "product_789", 2, 99.99, "credit_card", "user@example.com");
}, 3000);

// =====================================
// OBSERVATIONS ABOUT CALLBACK HELL
// =====================================

/*
PROBLEMS WITH THE ABOVE CODE:

1. READABILITY:
   - Code grows horizontally (pyramid of doom)
   - Hard to follow the execution flow
   - Difficult to understand what happens when

2. MAINTAINABILITY:
   - Adding new steps requires deep nesting
   - Error handling becomes repetitive
   - Hard to modify or refactor

3. ERROR HANDLING:
   - Each callback needs its own error handling
   - No centralized error management
   - Easy to forget error cases

4. INVERSION OF CONTROL:
   - We lose control over when callbacks execute
   - Third-party code can call our callbacks multiple times
   - No guarantee callbacks will be called at all

5. DEBUGGING:
   - Stack traces become confusing
   - Hard to set breakpoints effectively
   - Difficult to test individual steps

SOLUTIONS:
- Use Promises to flatten the callback pyramid
- Use async/await for synchronous-looking asynchronous code
- Use proper error handling with try/catch
- Consider libraries like async.js for complex callback management
*/