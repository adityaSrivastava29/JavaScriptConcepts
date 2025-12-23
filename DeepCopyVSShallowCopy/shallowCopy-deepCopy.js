let a = {
  name: "Aditya",
  age: 25,
};

let b = a;
b.name = "Ashok";
// console.log(a);
// console.log(b);
let c = {
  name: "Sweta",
  age: 25,
};
let d = Object.assign(c);

d.name = "mamta";

// console.log(c);
// console.log(d);

let profile = {
  name: "Aditya",
  age: 25,
  gender: "male",
  social: {
    facebook : 'cooldude',
    twitter : 'aditya',
    followersCount : {
      fb_count : 100,
      twitter_count : 200
    }

  }
};

let newProfile = {...profile}; // using spread operator , it Creates a Shallow copy - only the top level structure
//  when we use spread operator it only copies the first level properties, and nested objects are still referenced.

newProfile.age = 30
console.log(profile);
console.log(newProfile)

newProfile.social.facebook = 'changedDude';
newProfile.social.followersCount.fb_count = 2000000;

console.log(profile.social.facebook)

console.log(newProfile.social.facebook);


console.log(profile.social.followersCount.fb_count); //2000000 because both are referring to same object in memory


console.log(newProfile.social.followersCount.fb_count); //2000000 because both are referring to same object in memory

/* 
* A shallow copy duplicates only the top-level structure of a data object.
* All nested objects, arrays, functions, and reference types are not duplicated.
* Instead, their memory references are copied.


* A shallow copy duplicates the outer container while preserving references to all nested objects, causing shared mutable state across copies.
*/

// Deep Copy
let deepCopiedProfile = JSON.parse(JSON.stringify(profile)); // Creates a Deep copy but it has limitations - only works with JSON serializable data types   
 /* 
 * JSON.stringify() converts the object into a JSON string, effectively breaking all references to nested objects.
 * JSON.parse() then takes that string and constructs a new object from it, resulting in a completely independent copy of the original object.  
*/

deepCopiedProfile.age = 35;
deepCopiedProfile.social.twitter = 'newTwitterHandle';
deepCopiedProfile.social.followersCount.twitter_count = 500000;

console.log(deepCopiedProfile.social.followersCount.twitter_count); //500000 - deep copy has its own copy
console.log(profile.social.twitter); // 'aditya' - original remains unchanged
console.log(deepCopiedProfile.social.twitter); // 'newTwitterHandle' - deep copy has its own copy


function deepCopy(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }

  const result = Array.isArray(value) ? [] : {};

  for (const key in value) {
    if (Object.hasOwn(value, key)) {
      result[key] = deepCopy(value[key]);
    }
  }

  return result;
}


console.log('deep copy:', deepCopy(profile));

/* 
* Deep copy recreates the entire object graph with no shared references, requiring recursive traversal and new allocations for every nested structure.


* A deep copy duplicates not only the top-level structure of a data object but also all nested objects, arrays, functions, and reference types.
* Each level of the data structure is recursively copied, resulting in a completely independent clone of the original object.


* typeof returns strings

* Valid outputs:
 * "object", "function", "string", "number", "boolean", "undefined", "symbol", "bigint"

*/

/* 
* A deep copy creates entirely independent objects at all levels of the data structure, ensuring no shared references between the original and the copy.
*/
