
const Cars = ["BMW", "Mercedes", "Toyota", "Honda"];

for (let i = 0; i < Cars.length; i++) {
  console.log(Cars[i]);
}

while (Cars.length > 0) {
  console.log(Cars.shift());
}   