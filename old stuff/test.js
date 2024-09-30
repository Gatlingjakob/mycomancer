// Define a class
class Person {
    // Constructor to initialize name and age
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    // Method to return a greeting
    greet() {
        return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
    }
}

// Create an instance of the class
const person = new Person('John Doe', 30);

// Output the greeting in the HTML
document.getElementById('output').innerText = person.greet();