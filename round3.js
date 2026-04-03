// ==========================================
// Round 3: Hidden Bug Hunt - Unified Implementation
// ==========================================

// --- Game State ---
const GAME_STATE = {
    teamName: 'Participant',
    currentRound: 3,
    score: 0,
    timeRemaining: 0,
    timerInterval: null,
    totalTimeTaken: 0,
    isGameOver: false,
    isGameActive: false,
    // Round 3 specific state
    currentQuestionIdx: 0,
    activeQuestions: [],
    attempts: 0,
    accScore: 0,
    currentUserCode: null, // New: track user progress between attempts
    editorFontSize: 14 
};

// --- Configuration ---
const CONFIG = {
    ROUND_DURATION: 10 * 60, // 10 minutes in seconds
    TOTAL_ROUNDS: 3,
    POINTS_PER_ROUND: 100, // Normalized for scaling
    TIME_MULTIPLIER: 5     // Points per second remaining
};

// --- Questions Data ---
const r3JavaQuestions = [
    {
        level: "Easy",
        lang: "Java",
        langColor: "#f89820",
        desc: "OOP - Library Checkout System",
        title: "Library.java",
        problem: "This program manages a simple library inventory. It allows adding books to an array and searching for a book by its title to check it out. However, the code is failing to compile and throwing runtime errors. Find the 5 bugs.",
        buggyCode:
`class Book {
    private String title;
    public boolean isCheckedOut;

    public Book(String title) {
        title = title;
        this.isCheckedOut = false;
    }

    public String getTitle() {
        return this.title;
    }
}

public class Library {
    public static void main(String[] args) {
        Book[] inventory = new Book[3];
        inventory[0] = new Book("The Hobbit");
        inventory[1] = new Book("1984");
        inventory[2] = new Book("Dune");

        String searchTitle = new String("1984");
        boolean found = false;

        for (int i = 1; i <= inventory.length; i++) {
            if (inventory[i].getTitle() == searchTitle) {
                inventory[i].isCheckedOut = true;
                found = true;
                System.out.println("Checked out: " + searchTitle);
                break;
            }
        }

        if (found) {
            int remainingBooks = inventory.length - 1;
        }
        System.out.println("Search complete. Remaining books estimate: " + remainingBooks);
    }
}`,
        checks: [
            { desc: "Constructor parameter shadowing (this.title = title)", pass: (c) => /this\.title\s*=\s*title/.test(c) },
            { desc: "Loop initialization and condition (0 to < length)", pass: (c) => /int\s+i\s*=\s*0/.test(c) && /i\s*<\s*inventory\.length/.test(c) },
            { desc: "String comparison (.equals() instead of ==)", pass: (c) => /\.getTitle\(\)\.equals\(searchTitle\)/.test(c) },
            { desc: "Variable scope (remainingBooks declared outside if)", pass: (c) => /int\s+remainingBooks\s*=\s*0\s*;/.test(c) && /if\s*\(found\)/.test(c) },
            { desc: "Encapsulation (private isCheckedOut + setter)", pass: (c) => /private\s+boolean\s+isCheckedOut/.test(c) && /public\s+void\s+setCheckedOut/.test(c) }
        ]
    },
    {
        level: "Moderate",
        lang: "Java",
        langColor: "#f89820",
        desc: "Control Flow - E-Commerce Discount",
        title: "ShoppingCart.java",
        problem: "A shopping cart calculates total prices and applies discounts based on membership tiers. It uses a custom exception for invalid quantities. Find the 5 bugs.",
        buggyCode:
`class InvalidQuantityException {
    public InvalidQuantityException(String message) {
        super(message);
    }
}

public class ShoppingCart {
    public static double calculateTotal(double price, int quantity, String tier) throws InvalidQuantityException {
        if (quantity <= 0) {
            throw InvalidQuantityException("Quantity must be positive");
        }

        double total = price * quantity;
        int discount = 0.0;

        switch (tier) {
            case "GOLD":
                discount = 20;
            case "SILVER":
                discount = 10;
                break;
            default:
                discount = 0;
        }

        total = total - (total * (discount / 100));
        return total;
    }

    public static void main(String[] args) {
        int items = 5;
        double itemPrice = 19.99;
        
        do {
            try {
                System.out.println("Total: $" + calculateTotal(itemPrice, items, "GOLD"));
                items--;
            } catch (InvalidQuantityException e) {
                System.out.println(e.getMessage());
            }
        } while (items > 0)
    }
}`,
        checks: [
            { desc: "Exception inheritance (extends Exception)", pass: (c) => /class\s+InvalidQuantityException\s+extends\s+Exception/.test(c) },
            { desc: "New keyword when throwing exception", pass: (c) => /throw\s+new\s+InvalidQuantityException/.test(c) },
            { desc: "Type mismatch (double discount)", pass: (c) => /double\s+discount\s*=\s*0\.0/.test(c) },
            { desc: "Switch break for GOLD tier", pass: (c) => /case\s+"GOLD":[\s\S]*discount\s*=\s*20\s*;\s*break\s*;/.test(c) },
            { desc: "Do-while syntax (semicolon at end)", pass: (c) => /while\s*\(\s*items\s*>\s*0\s*\)\s*;/.test(c) }
        ]
    },
    {
        level: "Hard",
        lang: "Java",
        langColor: "#f89820",
        desc: "Multithreading - Concurrent Bank Account",
        title: "BankTest.java",
        problem: "A shared bank account is accessed by two threads simultaneously. The code is meant to be thread-safe but is failing. Find the 5 bugs.",
        buggyCode:
`class BankAccount implements Runnable {
    private int balance = 1000;

    public void deposit(int amount) {
        balance += amount;
        System.out.println("Deposited. New Balance: " + balance);
    }

    public void withdraw(int amount) {
        if (balance >= amount) {
            balance -= amount;
            System.out.println("Withdrawn. New Balance: " + balance);
        }
    }

    public void execute() {
        for (int i = 0; i < 3; i++) {
            deposit(100);
            withdraw(50);
        }
    }
}

public class BankTest {
    public static void main(String[] args) {
        BankAccount account = new BankAccount();
        
        Thread t1 = new Thread(account);
        Thread t2 = new Thread(account);

        t1.run();
        t2.run();

        try {
            t1.join();
            t2.join();
            System.out.println("Final Balance: " + account.balance);
        } catch (InterruptedException e) {
            continue;
        }
    }
}`,
        checks: [
            { desc: "Runnable method (run() instead of execute())", pass: (c) => /public\s+void\s+run\s*\(\s*\)/.test(c) },
            { desc: "Thread synchronization (synchronized keyword)", pass: (c) => /synchronized\s+void\s+deposit/.test(c) && /synchronized\s+void\s+withdraw/.test(c) },
            { desc: "Starting threads (start() instead of run())", pass: (c) => /t1\.start\(\)/.test(c) && /t2\.start\(\)/.test(c) },
            { desc: "Encapsulation (use getBalance() getter)", pass: (c) => /account\.getBalance\(\)/.test(c) && /public\s+int\s+getBalance/.test(c) },
            { desc: "Exception handling (remove illegal continue)", pass: (c) => !/continue\s*;/.test(c) && /catch\s*\(\s*InterruptedException\s+e\s*\)\s*\{[\s\S]*\}/.test(c) }
        ]
    },
    {
        level: "Moderate",
        lang: "Java",
        langColor: "#f89820",
        desc: "OOP - Smart Home Automation",
        title: "SmartHome.java",
        problem: "A system manages different smart home devices using abstraction. The main method tries to iterate through an array of devices to turn them on, but it's broken. Find the 5 bugs.",
        buggyCode:
`abstract class Device {
    protected String name;
    
    public Device(String name) {
        this.name = name;
    }

    public abstract void turnOn() {
        System.out.println("Device is turning on...");
    }
}

class SmartLight extends Device {
    public SmartLight(String name) {
        super();
    }

    void turnOn() {
        System.out.println(name + " light is now ON.");
    }
    
    public void dim() {
        System.out.println(name + " is dimmed.");
    }
}

public class SmartHome {
    public static void main(String[] args) {
        Device[] myDevices = new Device[2];
        myDevices[0] = new Device("Generic Device");
        myDevices[1] = new SmartLight("Living Room");

        for (Device d : myDevices) {
            d.turnOn();
            d.dim();
        }
    }
}`,
        checks: [
            { desc: "Abstract method syntax (no body)", pass: (c) => /public\s+abstract\s+void\s+turnOn\s*\(\s*\)\s*;/.test(c) },
            { desc: "Constructor super() call with name", pass: (c) => /super\s*\(\s*name\s*\)\s*;/.test(c) },
            { desc: "Abstract class instantiation (remove new Device)", pass: (c) => !/new\s+Device\s*\(/.test(c) },
            { desc: "Overriding access level (public void turnOn)", pass: (c) => /public\s+void\s+turnOn/.test(c) },
            { desc: "Polymorphic method calling (cast to SmartLight)", pass: (c) => /if\s*\(\s*d\s+instanceof\s+SmartLight\s*\)/.test(c) && /\(\(SmartLight\)\s*d\)\.dim\(\)/.test(c) }
        ]
    },
    {
        level: "Professional",
        lang: "Java",
        langColor: "#f89820",
        desc: "Logic - Document Text Analyzer",
        title: "TextAnalyzer.java",
        problem: "A utility script processes text, counts words, and extracts a sentence. Logic and exception errors are preventing it from working safely. Find the 5 bugs.",
        buggyCode:
`public class TextAnalyzer {
    public static int countWords(String text) {
        if (text == null) {
            return 0;
        }
        String[] words = text.split(" ");
        int count = 0;
        
        for (String w : words) {
            if (w.equals("")) {
                break; 
            }
            count++;
        }
        return count;
    }

    public static void processText(String text) {
        try {
            System.out.println("Word count: " + countWords(text));
            String snippet = text.substring(10, 5);
            System.out.println("Snippet: " + snippet);
        } catch (Exception e) {
            System.out.println("Error processing text.");
            throw e;
            System.out.println("Continuing execution...");
        } finally {
            System.out.println("Analysis complete.");
        }
    }

    public static void main(String[] args) {
        String doc = "Java programming is fun and challenging.";
        processText(doc);
        processText(null);
    }
}`,
        checks: [
            { desc: "Infinite loop / early break fix (use continue)", pass: (c) => /continue\s*;/.test(c) && !/break\s*;/.test(c) },
            { desc: "Correct substring indices (5, 10)", pass: (c) => /text\.substring\s*\(\s*5\s*,\s*10\s*\)/.test(c) },
            { desc: "Unreachable code fix (move throw e)", pass: (c) => /System\.out\.println\("Continuing[\s\S]*throw\s+e\s*;/.test(c) },
            { desc: "Null protection for substring", pass: (c) => /if\s*\(\s*text\s*!=\s*null\s*\)\s*\{[\s\S]*substring/.test(c) },
            { desc: "Exception rethrowing (throws Exception signature)", pass: (c) => /void\s+processText\s*\(.*?\)\s+throws\s+Exception/.test(c) || /throw\s+new\s+RuntimeException/.test(c) }
        ]
    }
];

const r3HtmlQuestions = [
    {
        level: "Moderate",
        lang: "HTML/JS",
        langColor: "#E34F26",
        desc: "DOM - Interactive To-Do List",
        title: "todo.html",
        problem: "A simple app allows users to type a task and add it to an unordered list. Clicking 'Add Task' should append it to the list and clear the input field. Find the 5 bugs.",
        buggyCode:
`<!DOCTYPE html>
<html>
<body>
    <h2>My Tasks</h2>
    <input type="text" id="taskInput" placeholder="New task...">
    <button id="addBtn">Add Task</button>
    <ul id="todo-list"></ul>

    <script>
        const tasks = [];
        const button = document.getElementById('add-btn');
        const list = document.querySelector('.todo-list');

        button.addEventListener('click', function() {
            let input = document.getElementById('taskInput');
            let taskText = input.innerHTML;

            if (taskText !== "") {
                const newTasks = tasks.concat(taskText);
                tasks = newTasks; 

                let li = document.createElement('li');
                li.textContent = taskText;
                li.addEventListener('click', function() {
                    this.classList.add = 'completed';
                });

                list.appendChild(li);
                input.value = "";
            }
        });
    </script>
</body>
</html>`,
        checks: [
            { desc: "Button ID selector (addBtn)", pass: (c) => /document\.getElementById\(['"]addBtn['"]\)/.test(c) },
            { desc: "List ID selector (todo-list)", pass: (c) => /document\.getElementById\(['"]todo-list['"]\)/.test(c) || /querySelector\(['"]#todo-list['"]\)/.test(c) },
            { desc: "Input value access (.value)", pass: (c) => /input\.value/.test(c) && !/input\.innerHTML/.test(c) },
            { desc: "Array assignment (let tasks or tasks.push)", pass: (c) => /let\s+tasks\s*=\s*\[\s*\]/.test(c) || /tasks\.push/.test(c) },
            { desc: "classList method (classList.add())", pass: (c) => /classList\.add\(['"]completed['"]\)/.test(c) && !/classList\.add\s*=\s*/.test(c) }
        ]
    },
    {
        level: "Hard",
        lang: "HTML/JS",
        langColor: "#E34F26",
        desc: "Async - Weather Dashboard",
        title: "weather.html",
        problem: "This script fetches weather data for a city using a mock API. It displays the temperature or logs an error. Find the 5 bugs.",
        buggyCode:
`<!DOCTYPE html>
<html>
<body>
    <input type="text" id="city" value="London">
    <button onclick="getWeather()">Get Weather</button>
    <div id="weatherDisplay">Waiting for data...</div>

    <script>
        function getWeather() {
            try {
                let city = document.getElementById('city').value;
                let url = 'https://api.mockweather.com/v1/\${city}';
                
                let response = await fetch(url);
                if (!response.ok) {
                    throw new Error("City not found");
                }
                
                let data = response.json();
                document.getElementById('weatherDisplay').value = "Temp: " + data.temp + "°C";
                
            } catch (error) {
                document.getElementById('weatherDisplay').textContent = "Error loading weather.";
                throw new error;
            }
        }
    </script>
</body>
</html>`,
        checks: [
            { desc: "Async function declaration", pass: (c) => /async\s+function\s+getWeather/.test(c) },
            { desc: "Template literal url (backticks)", pass: (c) => /`https:\/\/api\.mockweather\.com\/v1\/\$\{city\}`/.test(c) },
            { desc: "Await JSON parsing", pass: (c) => /await\s+response\.json\(\)/.test(c) },
            { desc: "Div content access (.textContent)", pass: (c) => /\.textContent\s*=/.test(c) && !/\.value\s*=/.test(c) },
            { desc: "Catch block rethrow syntax (throw error)", pass: (c) => /throw\s+error\s*;/.test(c) || /console\.error\(error\)/.test(c) }
        ]
    },
    {
        level: "Moderate",
        lang: "HTML/JS",
        langColor: "#E34F26",
        desc: "Timers - Digital Stopwatch",
        title: "stopwatch.html",
        problem: "A standard stopwatch with Start and Stop buttons. The timer increments every second. Find the 5 bugs.",
        buggyCode:
`<!DOCTYPE html>
<html>
<body>
    <h1 id="display">00:00</h1>
    <button onclick="startTimer">Start</button>
    <button onclick="stopTimer()">Stop</button>

    <script>
        let seconds = 0;
        let minutes = 0;

        function startTimer() {
            let timerInterval = setInterval(function() {
                seconds++;
                if (seconds = 60) {
                    minutes++;
                    seconds = 0;
                }
                
                let formattedSecs = seconds < 10 ? "0" + seconds : seconds;
                let formattedMins = minutes < 10 ? "0" + minutes : minutes;
                
                document.getElementById('display').innerText = formattedMins + ":" + formattedSecs;
            }, 1000);
        }

        function stopTimer() {
            clearInterval(timerInterval);
        }
    </script>
</body>
</html>`,
        checks: [
            { desc: "Start button call syntax (startTimer())", pass: (c) => /onclick\s*=\s*['"]startTimer\(\)['"]/.test(c) },
            { desc: "Global timerInterval scope", pass: (c) => /let\s+timerInterval\s*;[\s\S]*function\s+startTimer/.test(c) },
            { desc: "Comparison operator (=== 60)", pass: (c) => /if\s*\(\s*seconds\s*(===|==)\s*60\s*\)/.test(c) },
            { desc: "Prevent multiple intervals (if !timerInterval)", pass: (c) => /if\s*\(\s*!timerInterval\s*\)/.test(c) },
            { desc: "Reset interval state (timerInterval = null)", pass: (c) => /timerInterval\s*=\s*null\s*;/.test(c) }
        ]
    },
    {
        level: "Hard",
        lang: "HTML/JS",
        langColor: "#E34F26",
        desc: "Forms - Registration Validation",
        title: "validation.html",
        problem: "Validating a user form before it gets sent to the server. Find the 5 bugs.",
        buggyCode:
`<!DOCTYPE html>
<html>
<body>
    <form id="regForm">
        <input type="email" name="userEmail" id="email" required>
        <input type="password" id="pass" required>
        <p id="errorMsg" hidden>Invalid Input!</p>
        <button type="submit">Register</button>
    </form>

    <script>
        const form = document.getElementById('regForm');
        
        form.addEventListener('submit', function(e) {
            let emailNode = document.forms[0].emailInput;
            let passNode = document.getElementById('pass');
            let errorMsg = document.getElementById('errorMsg');
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (passNode.length < 8) {
                errorMsg.style.display = 'block';
                return;
            }

            if (!email.test(emailRegex)) {
                errorMsg.style.display = 'block';
                return;
            }

            console.log("Form Submitted Successfully");
        });
    </script>
</body>
</html>`,
        checks: [
            { desc: "Prevent default submission (e.preventDefault)", pass: (c) => /e\.preventDefault\(\)/.test(c) },
            { desc: "Correct form element name (userEmail)", pass: (c) => /forms\[0\]\.userEmail/.test(c) || /getElementById\(['"]email['"]\)/.test(c) },
            { desc: "Input value length (passNode.value.length)", pass: (c) => /passNode\.value\.length/.test(c) },
            { desc: "Regex test logic (regex.test(value))", pass: (c) => /emailRegex\.test\(\s*emailNode\.value\s*\)/.test(c) },
            { desc: "Removing hidden attribute", pass: (c) => /errorMsg\.removeAttribute\(['"]hidden['"]\)/.test(c) || /errorMsg\.hidden\s*=\s*false/.test(c) }
        ]
    },
    {
        level: "Moderate",
        lang: "HTML/JS",
        langColor: "#E34F26",
        desc: "Forms - Password Matcher",
        title: "password.html",
        problem: "A registration form requires matching passwords. Find the 5 bugs.",
        buggyCode:
`<!DOCTYPE html>
<html>
<body>
    <form id="signup-form">
        <input type="password" id="pass1" required>
        <input type="password" id="pass2" required>
        <p id="error-text" style="display: none;">Passwords do not match!</p>
        <button id="submit-btn">Register</button>
    </form>

    <script>
        const btn = document.getElementById('submit-btn');
        const pass1 = document.getElementById('pass1');
        const pass2 = document.getElementById('pass2');
        const errorText = document.getElementById('error-text');

        btn.addEventListener('submit', function(e) {
            e.preventDefault;

            if (pass1 === pass2) {
                errorText.style.display = 'block';
                errorText.style.color = red;
            } else {
                console.log("Form is valid!");
                // Form submission logic would go here
            }
        });
    </script>
</body>
</html>`,
        checks: [
            { desc: "Submit listener on form element", pass: (c) => /document\.getElementById\(['"]signup-form['"]\)\.addEventListener\(['"]submit['"]/.test(c) },
            { desc: "Prevent default parentheses (e.preventDefault())", pass: (c) => /e\.preventDefault\(\)/.test(c) },
            { desc: "Compare input values (.value)", pass: (c) => /pass1\.value/.test(c) && /pass2\.value/.test(c) },
            { desc: "Non-match logic (!= or !==)", pass: (c) => /pass1\.value\s*(!==|!=)\s*pass2\.value/.test(c) },
            { desc: "Quoted color value ('red')", pass: (c) => /color\s*=\s*['"]red['"]/.test(c) }
        ]
    }
];

const r3CQuestions = [
    {
        level: "Moderate",
        lang: "C",
        langColor: "#00599C",
        desc: "Memory - String Reverser",
        title: "reverse.c",
        problem: "A function is supposed to take a string, dynamically allocate memory for a reversed copy, and return it. However, it's corrupted or leaking memory. Find the 5 bugs.",
        buggyCode:
`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char* reverseString(char* str) {
    if (str == NULL) return NULL;
    
    int len = sizeof(str); 
    char* reversed = (char*)malloc(len); 

    for (int i = 0; i < len; i++) {
        reversed[i] = str[len - i]; 
    }
    
    return reversed;
}

int main() {
    char* original = "Hello World";
    char* rev = reverseString(original);
    
    if (rev != NULL) {
        printf("Original: %s\\n", original);
        printf("Reversed: %s\\n", rev);
    }
    
    return 0;
}`,
        checks: [
            { desc: "Use strlen() for length", pass: (c) => /int\s+len\s*=\s*strlen\s*\(\s*str\s*\)\s*;/.test(c) },
            { desc: "Allocate space for null terminator (+1)", pass: (c) => /malloc\s*\(\s*len\s*\+\s*1\s*\)/.test(c) },
            { desc: "Fix loop off-by-one (len - 1 - i)", pass: (c) => /reversed\s*\[\s*i\s*\]\s*=\s*str\s*\[\s*len\s*-\s*1\s*-\s*i\s*\]/.test(c) },
            { desc: "Add manual null terminator (\\0)", pass: (c) => /reversed\s*\[\s*len\s*\]\s*=\s*['"]\\\\0['"]\s*;/.test(c) },
            { desc: "Free memory in main", pass: (c) => /free\s*\(\s*rev\s*\)\s*;/.test(c) }
        ]
    },
    {
        level: "Moderate",
        lang: "C",
        langColor: "#00599C",
        desc: "Structs - Student Roster",
        title: "students.c",
        problem: "A program manages student records using a struct. It attempts to initialize a student and calculate an average, but has errors. Find the 5 bugs.",
        buggyCode:
`#include <stdio.h>
#include <string.h>

typedef struct {
    char name[50];
    int grades[3];
    float average;
} Student;

void calculateAverage(Student* s) {
    int sum = 0;
    for (int i = 0; i <= 3; i++) {
        sum += s.grades[i]; 
    }
    s->average = sum / 3; 
}

int main() {
    Student s1;
    s1.name = "Alice"; 
    s1.grades[0] = 85;
    s1.grades[1] = 90;
    s1.grades[2] = 92;

    calculateAverage(&s1);
    
    int age;
    printf("Enter student age: ");
    scanf("%d", age); 

    printf("Student: %s, Average: %.2f\\n", s1.name, s1.average);
    return 0;
}`,
        checks: [
            { desc: "Pointer access operator (s->grades)", pass: (c) => /s\s*->\s*grades\s*\[\s*i\s*\]/.test(c) },
            { desc: "Correct loop bounds (i < 3)", pass: (c) => /i\s*<\s*3/.test(c) },
            { desc: "Float division (3.0)", pass: (c) => /sum\s*\/\s*3\.0/.test(c) || /\(float\)\s*sum\s*\/\s*3/.test(c) },
            { desc: "String copy (strcpy)", pass: (c) => /strcpy\s*\(\s*s1\.name\s*,\s*['"]Alice['"]\s*\)\s*;/.test(c) },
            { desc: "Scanf address-of (&age)", pass: (c) => /scanf\s*\(\s*['"]%d['"]\s*,\s*&age\s*\)\s*;/.test(c) }
        ]
    },
    {
        level: "Hard",
        lang: "C",
        langColor: "#00599C",
        desc: "Files - System Logger",
        title: "logger.c",
        problem: "A utility function is meant to append log messages to a file. It clears the file and crashes on errors. Find the 5 bugs.",
        buggyCode:
`#include <stdio.h>
#include <stdlib.h>

#define MAX_BUFFER 50

void appendLog(char* msg) {
    FILE *fp = fopen("app.log", "w"); 
    
    char buffer[MAX_BUFFER];
    sprintf(buffer, "LOG: %s\\n", msg); 

    fputs(buffer, fp);
}

int main() {
    char* messages[] = {
        "System Started", 
        "Loading Modules...", 
        "Initialization complete without any errors"
    };
    
    for(int i = 0; i < 4; i++) { 
        appendLog(messages[i]);
    }
    
    return 0;
}`,
        checks: [
            { desc: "Append mode (fopen 'a')", pass: (c) => /fopen\s*\(\s*['"]app\.log['"]\s*,\s*['"]a['"]\s*\)/.test(c) },
            { desc: "NULL check for file pointer", pass: (c) => /if\s*\(\s*fp\s*==\s*NULL\s*\)\s*return\s*;/.test(c) },
            { desc: "Buffer protection (snprintf)", pass: (c) => /snprintf\s*\(\s*buffer\s*,\s*MAX_BUFFER\s*,/.test(c) },
            { desc: "Close file (fclose)", pass: (c) => /fclose\s*\(\s*fp\s*\)\s*;/.test(c) },
            { desc: "Loop bounds in main (i < 3)", pass: (c) => /i\s*<\s*3/.test(c) && /for\s*\(int\s+i\s*=\s*0/.test(c) }
        ]
    },
    {
        level: "Hard",
        lang: "C",
        langColor: "#00599C",
        desc: "Pointers - Linked List Initializer",
        title: "linked_list.c",
        problem: "A program attempts to build a singly linked list by inserting nodes at the head, but the logic is broken. Find the 5 bugs.",
        buggyCode:
`#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    Node* next; 
} Node;

void push(Node* head, int newData) { 
    Node* newNode = (Node*)malloc(sizeof(Node*)); 
    
    newNode->data = newData;
    newNode->next = head;
    head = newNode; 
}

void printList(Node* head) {
    Node* temp = head;
    while (temp != NULL) {
        printf("%d -> ", temp->data);
        temp++; 
    }
    printf("NULL\\n");
}

int main() {
    Node* head = NULL;
    push(head, 10);
    push(head, 20);
    
    printList(head);
    
    free(head); 
    return 0;
}`,
        checks: [
            { desc: "Struct self-reference (struct Node*)", pass: (c) => /struct\s+Node\s*\*\s*next\s*;/.test(c) },
            { desc: "Correct malloc size (sizeof(Node))", pass: (c) => /malloc\s*\(\s*sizeof\s*\(\s*Node\s*\)\s*\)/.test(c) },
            { desc: "Pass by reference (Node** head_ref)", pass: (c) => /void\s+push\s*\(\s*Node\s*\*\*\s*head_ref/.test(c) && /push\s*\(\s*&head\s*,/.test(c) },
            { desc: "List traversal logic (temp->next)", pass: (c) => /temp\s*=\s*temp\s*->\s*next\s*;/.test(c) },
            { desc: "Comprehensive free() loop", pass: (c) => /while\s*\(.*!=\s*NULL\s*\)[\s\S]*free/.test(c) }
        ]
    },
    {
        level: "Moderate",
        lang: "C",
        langColor: "#00599C",
        desc: "Logic - Bubble Sorter",
        title: "bubble_sort.c",
        problem: "A bubble sort implementation compiles but doesn't sort and has out-of-bounds risks. Find the 5 bugs.",
        buggyCode:
`#include <stdio.h>

void swap(int a, int b) { 
    int temp = a;
    a = b;
    b = temp;
}

void sortArray(int* arr, int size) {
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) { 
            if (arr[j] > arr[j+1]) { 
                swap(arr[j], arr[j+1]); 
            }
        }
    }
}

int main() {
    int data[] = {5, 2, 9, 1, 5, 6};
    int size = sizeof(data); 
    
    sortArray(&data, size); 
    
    for(int i = 0; i < 6; i++) {
        printf("%d ", data[i]);
    }
    printf("\\n");
    return 0;
}`,
        checks: [
            { desc: "Array element count (sizeof/sizeof)", pass: (c) => /sizeof\s*\(\s*data\s*\)\s*\/\s*sizeof\s*\(\s*data\s*\[\s*0\s*\]\s*\)/.test(c) },
            { desc: "Pass array pointer correctly", pass: (c) => /sortArray\s*\(\s*data\s*,\s*size\s*\)\s*;/.test(c) },
            { desc: "Swap by reference (int* a, int* b)", pass: (c) => /void\s+swap\s*\(\s*int\s*\*\s*a\s*,\s*int\s*\*\s*b\s*\)/.test(c) && /swap\s*\(\s*&arr\s*\[\s*j\s*\]\s*,\s*&arr\s*\[\s*j\s*\+\s*1\s*\]\s*\)/.test(c) },
            { desc: "Fix inner loop bounds (size - i - 1)", pass: (c) => /j\s*<\s*size\s*-\s*i\s*-\s*1/.test(c) },
            { desc: "Remove array address operator (&data)", pass: (c) => !/sortArray\s*\(\s*&data/.test(c) && /sortArray\s*\(\s*data\s*,/.test(c) }
        ]
    }
];

const r3CppQuestions = [
    {
        level: "Moderate",
        lang: "C++",
        langColor: "#00427E",
        desc: "Memory - Grocery Cart Checkout",
        title: "grocery.cpp",
        problem: "A self-checkout machine calculates the total price of your groceries and flags out-of-stock items, but it's wrong and crashes. Find the 5 bugs.",
        buggyCode:
`#include <iostream>
#include <vector>
#include <string>

using namespace std;

class GroceryItem {
public:
    string name;
    double price;
    bool inStock;

    GroceryItem(string n, double p, bool s) : name(n), price(p), inStock(s) {}
};

void removeOutofStock(vector<GroceryItem> cart) {
    for (auto it = cart.begin(); it != cart.end(); ++it) {
        if (!it->inStock) {
            cart.erase(it); 
        }
    }
}

double calculateTotal(const vector<GroceryItem>& cart) {
    double total; 
    for (int i = 0; i <= cart.size(); i++) { 
        total += cart[i].price;
    }
    return total;
}

int main() {
    vector<GroceryItem> myCart = {
        GroceryItem("Apples", 4.50, true),
        GroceryItem("Milk", 3.20, false),
        GroceryItem("Bread", 2.10, true)
    };

    removeOutofStock(myCart);
    cout << "Total amount due: $" << calculateTotal(myCart) << endl;

    return 0;
}`,
        checks: [
            { desc: "Pass by reference (removeOutofStock)", pass: (c) => /void\s+removeOutofStock\s*\(\s*vector\s*<\s*GroceryItem\s*>\s*&\s*cart\s*\)/.test(c) },
            { desc: "Fix iterator invalidation (it = erase())", pass: (c) => /it\s*=\s*cart\.erase\s*\(\s*it\s*\)/.test(c) },
            { desc: "Initialize total (double total = 0.0)", pass: (c) => /double\s+total\s*=\s*0\.0\s*;/.test(c) },
            { desc: "Correct loop bounds (i < cart.size())", pass: (c) => /i\s*<\s*cart\.size\(\)/.test(c) },
            { desc: "Const string reference in constructor", pass: (c) => /GroceryItem\s*\(\s*const\s*string\s*&\s*n/.test(c) }
        ]
    },
    {
        level: "Moderate",
        lang: "C++",
        langColor: "#00427E",
        desc: "Iterators - Smart Pet Feeder",
        title: "feeder.cpp",
        problem: "An automatic pet feeder dispenses meals based on an array of scheduled hours, but the machine crashes when removing times. Find the 5 bugs.",
        buggyCode:
`#include <iostream>
#include <vector>

using namespace std;

void dispenseMeals(vector<int> schedule, int currentHour) {
    for (auto it = schedule.begin(); it != schedule.end(); ++it) {
        if (*it <= currentHour) {
            cout << "Dispensing food for hour: " << *it << endl;
            schedule.erase(it); 
        }
    }
}

int main() {
    vector<int> feedTimes = {8, 12, 18};
    dispenseMeals(feedTimes, 13);
    
    if (feedTimes.size() - 1 < 0) { 
         cout << "Schedule is completely empty!" << endl;
    }

    int totalKibble = 500; 
    int portions = 3;
    double gramsPerPortion = totalKibble / portions; 

    for (int time : feedTimes) {
        time += 1; 
    }

    return 0;
}`,
        checks: [
            { desc: "Pass by reference (dispenseMeals)", pass: (c) => /void\s+dispenseMeals\s*\(\s*vector\s*<\s*int\s*>\s*&\s*schedule/.test(c) },
            { desc: "Fix iterator invalidation (it = erase())", pass: (c) => /it\s*=\s*schedule\.erase\s*\(\s*it\s*\)/.test(c) },
            { desc: "Use empty() check (size_t underflow)", pass: (c) => /feedTimes\.empty\(\)/.test(c) },
            { desc: "Double portion calculation ((double)total/portions)", pass: (c) => /\(double\)\s*totalKibble\s*\/\s*portions/.test(c) || /totalKibble\s*\/\s*\(double\)\s*portions/.test(c) },
            { desc: "Reference in range loop (int& time)", pass: (c) => /for\s*\(\s*int\s*&\s*time\s*:\s*feedTimes\s*\)/.test(c) }
        ]
    },
    {
        level: "Hard",
        lang: "C++",
        langColor: "#00427E",
        desc: "OOP - E-Book Library Manager",
        title: "library.cpp",
        problem: "A digital library holds both standard E-Books and Audiobooks. Loop through the library to print the descriptions of all books. Find the 5 bugs.",
        buggyCode:
`#include <iostream>
#include <string>
#include <vector>

using namespace std;

class Book {
protected:
    string title;
public:
    Book(string t) : title(t) {}
    ~Book() { cout << "Removing book.\\n"; }

    string getDescription() {
        return "Standard E-Book: " + title;
    }
};

class AudioBook : Book {
public:
    AudioBook(string t) : Book(t) {}

    string getDescription() override {
        return "Audiobook: " + title + " (Requires Headphones)";
    }
};

void printLibrary(const vector<Book*>& lib) {
    for (int i = 0; i < lib.size(); i++) {
        cout << lib[i].getDescription() << endl; 
    }
}

int main() {
    vector<Book*> myLibrary;
    myLibrary.push_back(new Book("C++ Primer"));
    myLibrary.push_back(new AudioBook("The Martian"));

    printLibrary(myLibrary);

    return 0;
}`,
        checks: [
            { desc: "Public inheritance (: public Book)", pass: (c) => /class\s+AudioBook\s*:\s*public\s+Book/.test(c) },
            { desc: "Virtual getDescription method", pass: (c) => /virtual\s+string\s+getDescription\s*\(/.test(c) },
            { desc: "Virtual destructor (~Book)", pass: (c) => /virtual\s+~Book\s*\(/.test(c) },
            { desc: "Use arrow operator (->getDescription)", pass: (c) => /lib\s*\[\s*i\s*\]\s*->\s*getDescription\s*\(\s*\)/.test(c) },
            { desc: "Memory cleanup (delete) loop in main", pass: (c) => /delete\s+myLibrary\s*\[\s*i\s*\]/.test(c) || /delete\s+\*it/.test(c) || /myLibrary\s*\[\s*i\s*\]/.test(c) && /delete/.test(c) }
        ]
    },
    {
        level: "Hard",
        lang: "C++",
        langColor: "#00427E",
        desc: "Memory - Fitness Tracker Daily Log",
        title: "fitness.cpp",
        problem: "A fitness app tracks your daily step count for a specific number of days, but the step counts are astronomical and it crashes on exit. Find the 5 bugs.",
        buggyCode:
`#include <iostream>

using namespace std;

class FitnessLog {
    int* steps;
    int days;
public:
    FitnessLog(int d) {
        days = d;
        steps = new int(days); 
    }

    ~FitnessLog() {
        delete steps;
    }

    void logSteps(int day, int count) {
        if (day > 0 && day <= days) {
            steps[day] = count;
        }
    }

    int getTotalSteps() {
        int total;
        for (int i = 0; i <= days; i++) {
            total += steps[i];
        }
        return total;
    }
};

int main() {
    FitnessLog myMonth(30);
    myMonth.logSteps(1, 8000);
    myMonth.logSteps(30, 10000);

    cout << "Total steps: " << myMonth.getTotalSteps() << endl;
    return 0;
}`,
        checks: [
            { desc: "Dynamic array allocation (new int[days])", pass: (c) => /steps\s*=\s*new\s+int\s*\[\s*days\s*\]\s*;/.test(c) },
            { desc: "Array deallocation (delete[] steps)", pass: (c) => /delete\s*\[\s*\]\s*steps\s*;/.test(c) },
            { desc: "Initialize total (int total = 0)", pass: (c) => /int\s+total\s*=\s*0\s*;/.test(c) },
            { desc: "Fix array index shift (day - 1)", pass: (c) => /steps\s*\[\s*day\s*-\s*1\s*\]\s*=\s*count\s*;/.test(c) },
            { desc: "Correct loop bounds (i < days)", pass: (c) => /i\s*<\s*days/.test(c) }
        ]
    },
    {
        level: "Moderate",
        lang: "C++",
        langColor: "#00427E",
        desc: "Lists - Parking Garage Validator",
        title: "parking.cpp",
        problem: "An automated gate checks a car's license plate against a list of VIP members, but fails to find plates after the first one. Find the 5 bugs.",
        buggyCode:
`#include <iostream>
#include <vector>
#include <string>

using namespace std;

bool isVip(vector<string> vips, string plate) {
    for (auto it = vips.begin(); it != vips.end(); it++) {
        if (*it == plate) {
            return true;
        } else {
            return false; 
        }
    }
    return false;
}

int main() {
    vector<string> vipList = {"ABC-123", "XYZ-999", "LMN-456"};
    
    if (isVip(vipList, "XYZ-999")) {
        cout << "Gate Opening. Welcome VIP!" << endl;
    } else {
        cout << "Access Denied." << endl;
    }

    string* lastCar = &vipList.end(); 
    cout << "Last VIP in database: " << *lastCar << endl;
    
    return 0;
}`,
        checks: [
            { desc: "Fix premature loop termination (remove else)", pass: (c) => !/else\s*\{\s*return\s+false\s*;\s*\}/.test(c) && /return\s+true\s*;/.test(c) },
            { desc: "Use .back() for the last element", pass: (c) => /vipList\.back\(\)/.test(c) },
            { desc: "Correct pointer assignment (&vipList.back())", pass: (c) => /string\s*\*\s*lastCar\s*=\s*&vipList\.back\(\)\s*;/.test(c) },
            { desc: "Pass by constant reference (vector)", pass: (c) => /const\s*vector\s*<\s*string\s*>\s*&\s*vips/.test(c) },
            { desc: "Pass by constant reference (string)", pass: (c) => /const\s*string\s*&\s*plate/.test(c) }
        ]
    }
];

// --- DOM Elements ---
const appContainer = document.getElementById('app-container');
const topBar = document.getElementById('top-bar');
const timerDisplay = document.getElementById('timer-display');
const roundIndicator = document.getElementById('round-indicator');

// --- Initialization ---
function init() {
    GAME_STATE.teamName = "Participant";
    startGame();
    setupFullscreenListeners();
}

function startGame() {
    topBar.classList.remove('hidden');
    GAME_STATE.currentRound = 3;
    GAME_STATE.score = 0;
    GAME_STATE.totalTimeTaken = 0;
    GAME_STATE.isGameActive = true;

    requestFullscreen();
    startRound();
}

function startRound() {
    GAME_STATE.timeRemaining = CONFIG.ROUND_DURATION;
    updateTimerDisplay();
    roundIndicator.textContent = `ROUND ${GAME_STATE.currentRound} HIDDEN BUG HUNT`;

    clearInterval(GAME_STATE.timerInterval);
    GAME_STATE.timerInterval = setInterval(tick, 1000);

    renderRound3();
}

function tick() {
    GAME_STATE.timeRemaining--;
    GAME_STATE.totalTimeTaken++;
    updateTimerDisplay();

    if (GAME_STATE.timeRemaining <= 0) {
        clearInterval(GAME_STATE.timerInterval);
        endGame();
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(GAME_STATE.timeRemaining / 60);
    const seconds = GAME_STATE.timeRemaining % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (GAME_STATE.timeRemaining <= 60 && GAME_STATE.timeRemaining > 0) {
        timerDisplay.style.color = 'var(--error)';
        timerDisplay.style.textShadow = '0 0 10px var(--error)';
    } else {
        timerDisplay.style.color = 'var(--accent)';
        timerDisplay.style.textShadow = 'var(--accent-glow)';
    }
}

// --- Round 3 Logic ---
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function renderRound3() {
    // Pick 1 random from each pool
    const javaQ = shuffleArray([...r3JavaQuestions])[0];
    const htmlQ = shuffleArray([...r3HtmlQuestions])[0];
    const cQ = shuffleArray([...r3CQuestions])[0];
    const cppQ = shuffleArray([...r3CppQuestions])[0];
    
    GAME_STATE.activeQuestions = shuffleArray([javaQ, htmlQ, cQ, cppQ]);
    GAME_STATE.currentQuestionIdx = 0;
    GAME_STATE.attempts = 0;
    GAME_STATE.accScore = 0;
    GAME_STATE.currentUserCode = null; // Clear on load
    renderRound3Question();
}

function renderRound3Question() {
    const q = GAME_STATE.activeQuestions[GAME_STATE.currentQuestionIdx];
    const attemptsLeft = 3 - GAME_STATE.attempts;
    const currentCode = GAME_STATE.currentUserCode !== null ? GAME_STATE.currentUserCode : q.buggyCode;

    appContainer.innerHTML = `
    <div class="panel" style="max-width: 800px; width: 100%; padding: 1.8rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <div style="display:flex; align-items:center; gap:0.6rem;">
                <p style="margin:0; color:var(--accent); font-size:0.95rem; font-weight:600;">Question ${GAME_STATE.currentQuestionIdx + 1} of 4 <span style="visibility:hidden;">&nbsp;[${q.level}] — ${q.desc}</span></p>
                <span style="background: ${q.langColor}; color: #fff; font-size: 0.7rem; font-weight: bold; padding: 2px 9px; border-radius: 10px; visibility: hidden;">${q.lang}</span>
            </div>
            <span id="r3-attempts-badge" style="background: rgba(255,51,102,0.15); color: var(--error); border: 1px solid var(--error); padding: 4px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: bold; white-space: nowrap;">Attempts Left: ${attemptsLeft}</span>
        </div>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.2rem; line-height:1.5;"><strong style="color:#fff;">TASK:</strong> ${q.problem}</p>
        <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <h4 style="color:var(--accent); font-size:0.85rem; margin:0;">Source Code (${q.title})</h4>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn" style="padding: 2px 10px; font-size: 0.8rem; font-weight: bold;" onclick="zoomEditor(1)">+</button>
                    <button class="btn" style="padding: 2px 10px; font-size: 0.8rem; font-weight: bold;" onclick="zoomEditor(-1)">-</button>
                </div>
            </div>
            <textarea id="r3-code" class="round3-editor" style="font-size: ${GAME_STATE.editorFontSize}px;" oncopy="return false" onpaste="return false" oncut="return false" ondrop="return false" oncontextmenu="return false" spellcheck="false">${currentCode}</textarea>
        </div>
        <div class="text-center"><button class="btn btn-primary" onclick="evaluateRound3Question()">SUBMIT_FIX</button></div>
    </div>`;

}

function evaluateRound3Question() {
    const code = document.getElementById('r3-code').value;
    GAME_STATE.currentUserCode = code; // Save current state
    const q = GAME_STATE.activeQuestions[GAME_STATE.currentQuestionIdx];
    const results = q.checks.map(c => { try { return c.pass(code); } catch (e) { return false; } });
    const allPassed = results.every(r => r === true);

    if (allPassed) {
        let pts = 0;
        if (GAME_STATE.attempts === 0) pts = 25;
        else if (GAME_STATE.attempts === 1) pts = 20;
        else if (GAME_STATE.attempts === 2) pts = 15;
        GAME_STATE.accScore += pts;
        showAlert(`✅ Correct!\nMoving to next question...`, () => { progressRound3(); });
    } else {
        GAME_STATE.attempts++;
        const left = 3 - GAME_STATE.attempts;
        if (left <= 0) {
            showAlert('❌ Incorrect. Out of attempts!\nMoving to next question.', () => { progressRound3(); });
        } else {
            showAlert(`❌ Not all checks passed. ${left} attempt(s) left.`, () => { 
                const badge = document.getElementById('r3-attempts-badge');
                if (badge) badge.textContent = `Attempts Left: ${left}`;
            });
        }
    }
}

function progressRound3() {
    GAME_STATE.currentQuestionIdx++;
    GAME_STATE.attempts = 0;
    GAME_STATE.currentUserCode = null; // Reset for next challenge
    if (GAME_STATE.currentQuestionIdx < 4) {
        renderRound3Question();
    } else {
        submitRound(GAME_STATE.accScore > 0, GAME_STATE.accScore);
    }
}

function submitRound(isCorrect, customScore = null) {
    clearInterval(GAME_STATE.timerInterval);
    if (!isCorrect) {
        showAlert(`Challenge ended.`, () => { endGame(); });
    } else {
        let timeBonus = GAME_STATE.timeRemaining * CONFIG.TIME_MULTIPLIER;
        GAME_STATE.score = customScore + timeBonus;
        showAlert(`Success! Challenge passed.`, () => { endGame(); });
    }
}

function zoomEditor(delta) {
    const minSize = 10;
    const maxSize = 24;
    GAME_STATE.editorFontSize = Math.max(minSize, Math.min(maxSize, GAME_STATE.editorFontSize + (delta * 2)));
    const editor = document.getElementById('r3-code');
    if (editor) {
        editor.style.fontSize = GAME_STATE.editorFontSize + 'px';
    }
}

// --- Security & Utilities ---
function requestFullscreen() {
    const docElm = document.documentElement;
    if (docElm.requestFullscreen) docElm.requestFullscreen().catch(() => { });
}

function reEnterFullscreen() {
    document.getElementById('fullscreen-lockout').classList.add('d-none');
    requestFullscreen();
}

function setupFullscreenListeners() {
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && GAME_STATE.isGameActive && !GAME_STATE.isGameOver) {
            document.getElementById('fullscreen-lockout').classList.remove('d-none');
        }
    });
}

function escapeHtml(unsafe) {
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function endGame() {
    GAME_STATE.isGameOver = true;
    topBar.classList.add('hidden');
    appContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
            <p style="font-size: 1.5rem; color: var(--text-muted);">[ SESSION_TERMINATED ]</p>
        </div>
    `;
}

function showAlert(message, onCloseCallback = null) {
    const alertEl = document.getElementById('custom-alert');
    const msgEl = document.getElementById('custom-alert-message');
    msgEl.textContent = message;
    alertEl.classList.remove('d-none');
    window.currentAlertCallback = onCloseCallback;
}

function closeCustomAlert() {
    document.getElementById('custom-alert').classList.add('d-none');
    if (typeof window.currentAlertCallback === 'function') {
        const cb = window.currentAlertCallback;
        window.currentAlertCallback = null;
        cb();
    }
}

window.onload = init;
