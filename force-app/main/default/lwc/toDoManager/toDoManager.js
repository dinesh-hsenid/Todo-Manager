import { LightningElement } from 'lwc';
import addTodo from '@salesforce/apex/ToDoController.addTodo';
import getCurrentTodos from '@salesforce/apex/ToDoController.getCurrentTodos';


export default class ToDoManager extends LightningElement {
    time = "5:15 PM";
    greeting = "Good Evening";

    todos = [];

    connectedCallback() {
        this.getTime();
        // this.populateTodos();
        this.fetchTodos();

        setInterval(() => {
            this.getTime();
        }, 1000 * 60);
    }
    
    getTime() {
        const date = new Date();
        const hour = date.getHours();
        const min = date.getMinutes();

        this.time = `${this.getHour(hour)}:${this.getDoubleDigit(min)} ${this.getMidDay(hour)}`;

        this.setGreeting(hour);
    }

    setGreeting(hour) {
        if(hour < 12) {
            this.greeting = "Good Morning";
        }
        else if(hour >= 12 && hour < 17) {
            this.greeting = "Good Afternoon";
        }
        else {
            this.greeting = "Good Evening";
        }
    }

    getHour(hour) {
        return hour === 0 ? 12 : hour >= 12 ? (hour-12) : hour;
    }

    getDoubleDigit(digit) {
        return digit < 10 ? "0" + digit : digit;
    }

    getMidDay(hour) {
        return (hour >= 12) ? "PM" : "AM";
    }

    addTodoHandler() {
        const inputBox = this.template.querySelector('lightning-input');

        const todo = {
            todoName : inputBox.value,
            done : false
        }

        addTodo({ payload : JSON.stringify(todo) })
        .then(response => {
            console.log("Item inserted successfully");
            this.fetchTodos();
        })
        .catch(error => {
            console.log('Error in inserting todo item', error);
        });

        // this.todos.push(todo);
        inputBox.value = '';
    }

    fetchTodos() {
        getCurrentTodos().then( response => {
            console.log("Retrieved todos from the server", response.length);
            this.todos = response;
        }).catch(error => {
            console.log("Error in retrieving todos", error);
        });
    }

    updateHandler() {
        this.fetchTodos();
    }

    deleteHandler() {
        this.fetchTodos();
    }   

    get upcomingTasks() {
        return this.todos && this.todos.length ? this.todos.filter(todo => !todo.done) : [];
    }

    get completedTasks() {
        return this.todos && this.todos.length ? this.todos.filter(todo => todo.done) : [];
    }

    // populateTodos() {
    //     const sampleTodos = [
    //         {
    //             todoId : 0,
    //             todoName : "Feed the cat",
    //             done : false,
    //             todoDate : new Date()
    //         },

    //         {
    //             todoId : 1,
    //             todoName : "Wash the bike",
    //             done : false,
    //             todoDate : new Date()
    //         },

    //         {
    //             todoId : 0,
    //             todoName : "Check email",
    //             done : true,
    //             todoDate : new Date()
    //         },
    //     ]

    //     this.todos = sampleTodos;
    // }
}