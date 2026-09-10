// ============================================
// LibraX Digital Library Management System
// Database Seeder Script (Node.js)
// ============================================
// Generates:
// - 115+ Real world books across various categories
// - 65+ Members (Students, Teachers, Staff)
// - Sample Borrowing records for testing
// ============================================

const { pool } = require('./connection');

const booksData = [
  // Computer Science & Software Engineering
  {
    isbn: '978-0-13-235088-4',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category: 'Computer Science',
    publisher: 'Prentice Hall',
    published_year: 2008,
    quantity: 8,
    available_quantity: 6,
    description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. This book teaches how to tell the difference between good and bad code.'
  },
  {
    isbn: '978-0-201-63361-0',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    category: 'Computer Science',
    publisher: 'Addison-Wesley',
    published_year: 1994,
    quantity: 6,
    available_quantity: 4,
    description: 'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.'
  },
  {
    isbn: '978-0-13-597444-5',
    title: 'The Pragmatic Programmer: Your Journey To Mastery (20th Anniversary Edition)',
    author: 'David Thomas, Andrew Hunt',
    category: 'Computer Science',
    publisher: 'Addison-Wesley',
    published_year: 2019,
    quantity: 7,
    available_quantity: 5,
    description: 'The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process of creating working, maintainable code.'
  },
  {
    isbn: '978-0-13-475759-9',
    title: 'Refactoring: Improving the Design of Existing Code',
    author: 'Martin Fowler',
    category: 'Computer Science',
    publisher: 'Addison-Wesley',
    published_year: 2018,
    quantity: 5,
    available_quantity: 4,
    description: 'Refactoring is about improving the design of existing code. It is the process of changing a software system in such a way that it does not alter the external behavior of the code, yet improves its internal structure.'
  },
  {
    isbn: '978-0-73-561967-8',
    title: 'Code Complete: A Practical Handbook of Software Construction',
    author: 'Steve McConnell',
    category: 'Computer Science',
    publisher: 'Microsoft Press',
    published_year: 2004,
    quantity: 4,
    available_quantity: 3,
    description: 'Widely considered one of the best practical guides to programming, Steve McConnell’s original Code Complete has been helping developers write better software for more than a decade.'
  },
  {
    isbn: '978-1-449-37332-0',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'Computer Science',
    publisher: 'O\'Reilly Media',
    published_year: 2017,
    quantity: 9,
    available_quantity: 7,
    description: 'Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability.'
  },
  {
    isbn: '978-0-262-03384-8',
    title: 'Introduction to Algorithms (4th Edition)',
    author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
    category: 'Computer Science',
    publisher: 'MIT Press',
    published_year: 2022,
    quantity: 10,
    available_quantity: 8,
    description: 'Some books on algorithms are rigorous but incomplete; others cover masses of material but lack rigor. Introduction to Algorithms uniquely combines rigor and comprehensiveness.'
  },
  {
    isbn: '978-0-13-449416-6',
    title: 'Clean Architecture: A Craftsman\'s Guide to Software Structure and Design',
    author: 'Robert C. Martin',
    category: 'Computer Science',
    publisher: 'Prentice Hall',
    published_year: 2017,
    quantity: 6,
    available_quantity: 5,
    description: 'Building upon the success of his best-selling books Clean Code and The Clean Coder, legendary software craftsman Robert C. Martin reveals the universal rules of software architecture.'
  },
  {
    isbn: '978-0-321-12521-7',
    title: 'Domain-Driven Design: Tackling Complexity in the Heart of Software',
    author: 'Eric Evans',
    category: 'Computer Science',
    publisher: 'Addison-Wesley',
    published_year: 2003,
    quantity: 4,
    available_quantity: 3,
    description: 'This is not a book about specific technologies. It offers readers a systematic approach to domain-driven design, presenting an extensive set of design-best-practices, experience-based techniques, and fundamental principles.'
  },
  {
    isbn: '978-1-491-95035-7',
    title: 'Building Microservices: Designing Fine-Grained Systems',
    author: 'Sam Newman',
    category: 'Computer Science',
    publisher: 'O\'Reilly Media',
    published_year: 2021,
    quantity: 5,
    available_quantity: 4,
    description: 'As organizations shift from monolithic applications to smaller, self-contained microservices, Sam Newman provides a firm grounding in the concepts while diving into modern practices.'
  },
  {
    isbn: '978-0-262-51087-5',
    title: 'Structure and Interpretation of Computer Programs',
    author: 'Harold Abelson, Gerald Jay Sussman',
    category: 'Computer Science',
    publisher: 'MIT Press',
    published_year: 1996,
    quantity: 4,
    available_quantity: 4,
    description: 'A legendary textbook widely known as SICP, emphasizing fundamental concepts of computer programming, modularity, and interpretation.'
  },
  {
    isbn: '978-0-596-51774-8',
    title: 'JavaScript: The Good Parts',
    author: 'Douglas Crockford',
    category: 'Computer Science',
    publisher: 'O\'Reilly Media',
    published_year: 2008,
    quantity: 6,
    available_quantity: 5,
    description: 'A deep dive into the beautiful and elegant subset of the JavaScript language, cutting out the problematic features.'
  },
  {
    isbn: '978-1-491-95202-3',
    title: 'JavaScript: The Definitive Guide (7th Edition)',
    author: 'David Flanagan',
    category: 'Computer Science',
    publisher: 'O\'Reilly Media',
    published_year: 2020,
    quantity: 5,
    available_quantity: 4,
    description: 'Since 1996, JavaScript: The Definitive Guide has been the bible for JavaScript programmers—a programmer\'s guide and a comprehensive reference.'
  },
  {
    isbn: '978-1-593-27950-9',
    title: 'Eloquent JavaScript (3rd Edition)',
    author: 'Marijn Haverbeke',
    category: 'Computer Science',
    publisher: 'No Starch Press',
    published_year: 2018,
    quantity: 6,
    available_quantity: 5,
    description: 'A modern introduction to programming, JavaScript, and browsers, full of code examples and interactive exercises.'
  },
  {
    isbn: '978-1-491-90424-4',
    title: 'You Don\'t Know JS: Scope & Closures',
    author: 'Kyle Simpson',
    category: 'Computer Science',
    publisher: 'O\'Reilly Media',
    published_year: 2014,
    quantity: 5,
    available_quantity: 3,
    description: 'Dive deep into how the JavaScript engine parses, compiles, and executes your code, focusing on lexical scope and closure.'
  },
  {
    isbn: '978-0-13-468599-2',
    title: 'Modern Operating Systems (4th Edition)',
    author: 'Andrew S. Tanenbaum, Herbert Bos',
    category: 'Computer Science',
    publisher: 'Pearson',
    published_year: 2014,
    quantity: 6,
    available_quantity: 4,
    description: 'Widely praised for its clear explanations of operating systems concepts including processes, threads, memory management, and file systems.'
  },
  {
    isbn: '978-0-13-212695-3',
    title: 'Computer Networks (5th Edition)',
    author: 'Andrew S. Tanenbaum, David J. Wetherall',
    category: 'Computer Science',
    publisher: 'Pearson',
    published_year: 2010,
    quantity: 5,
    available_quantity: 4,
    description: 'The standard university textbook describing network protocols from the physical layer up to the application layer.'
  },
  {
    isbn: '978-0-07-340181-2',
    title: 'Fundamentals of Database Systems (7th Edition)',
    author: 'Ramez Elmasri, Shamkant Navathe',
    category: 'Computer Science',
    publisher: 'Pearson',
    published_year: 2015,
    quantity: 6,
    available_quantity: 4,
    description: 'Clear explanations of database design, relational model, SQL, normalization, concurrency control, and storage management.'
  },
  {
    isbn: '978-0-07-802215-9',
    title: 'Database System Concepts (7th Edition)',
    author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
    category: 'Computer Science',
    publisher: 'McGraw-Hill Education',
    published_year: 2019,
    quantity: 7,
    available_quantity: 5,
    description: 'Comprehensive foundational book on database management systems, transactions, distributed databases, and query optimization.'
  },
  {
    isbn: '978-0-321-48681-3',
    title: 'Compilers: Principles, Techniques, and Tools (Dragon Book)',
    author: 'Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman',
    category: 'Computer Science',
    publisher: 'Addison-Wesley',
    published_year: 2006,
    quantity: 4,
    available_quantity: 3,
    description: 'The legendary Dragon Book on compiler design, lexical analysis, syntax-directed translation, and code generation.'
  },
  {
    isbn: '978-0-201-48567-7',
    title: 'The Mythical Man-Month: Essays on Software Engineering',
    author: 'Frederick P. Brooks Jr.',
    category: 'Computer Science',
    publisher: 'Addison-Wesley',
    published_year: 1995,
    quantity: 5,
    available_quantity: 5,
    description: 'Few books on software project management have been as influential and timeless as Brooks\'s classic essays on project scheduling and complexity.'
  },
  {
    isbn: '978-0-984-78285-7',
    title: 'Cracking the Coding Interview (6th Edition)',
    author: 'Gayle Laakmann McDowell',
    category: 'Computer Science',
    publisher: 'CareerCup',
    published_year: 2015,
    quantity: 12,
    available_quantity: 8,
    description: '189 programming questions and solutions covering data structures, algorithms, and technical interview strategies.'
  },
  {
    isbn: '978-1-617-29223-1',
    title: 'Grokking Algorithms: An Illustrated Guide',
    author: 'Aditya Bhargava',
    category: 'Computer Science',
    publisher: 'Manning Publications',
    published_year: 2016,
    quantity: 8,
    available_quantity: 6,
    description: 'A fully illustrated, friendly guide that teaches you how to apply common algorithms to practical software problems.'
  },
  {
    isbn: '978-1-593-27992-9',
    title: 'Python Crash Course (2nd Edition)',
    author: 'Eric Matthes',
    category: 'Computer Science',
    publisher: 'No Starch Press',
    published_year: 2019,
    quantity: 8,
    available_quantity: 6,
    description: 'A fast-paced, thorough introduction to programming with Python that will have you writing programs, solving problems, and making things work.'
  },
  {
    isbn: '978-1-492-05635-5',
    title: 'Fluent Python: Clear, Concise, and Effective Programming',
    author: 'Luciano Ramalho',
    category: 'Computer Science',
    publisher: 'O\'Reilly Media',
    published_year: 2022,
    quantity: 5,
    available_quantity: 4,
    description: 'Takes you through Python\'s core language features and libraries, showing how to make your code shorter, faster, and more readable.'
  },
  {
    isbn: '978-1-718-50044-0',
    title: 'The Rust Programming Language',
    author: 'Steve Klabnik, Carol Nichols',
    category: 'Computer Science',
    publisher: 'No Starch Press',
    published_year: 2019,
    quantity: 6,
    available_quantity: 5,
    description: 'The official book on the Rust programming language written by the Rust core team, exploring memory safety, ownership, and concurrency.'
  },
  {
    isbn: '978-0-13-419044-0',
    title: 'The Go Programming Language',
    author: 'Alan A. A. Donovan, Brian W. Kernighan',
    category: 'Computer Science',
    publisher: 'Addison-Wesley',
    published_year: 2015,
    quantity: 5,
    available_quantity: 4,
    description: 'The authoritative resource for any programmer who wants to learn Go, written by Unix and C legend Brian Kernighan.'
  },
  {
    isbn: '978-0-13-468599-7',
    title: 'Effective Java (3rd Edition)',
    author: 'Joshua Bloch',
    category: 'Computer Science',
    publisher: 'Addison-Wesley',
    published_year: 2018,
    quantity: 5,
    available_quantity: 4,
    description: 'Definitive guide to best practices in the Java programming language from Joshua Bloch, the designer of many Java collection classes.'
  },
  {
    isbn: '978-1-492-07721-3',
    title: 'Head First Design Patterns (2nd Edition)',
    author: 'Eric Freeman, Elisabeth Robson',
    category: 'Computer Science',
    publisher: 'O\'Reilly Media',
    published_year: 2020,
    quantity: 7,
    available_quantity: 5,
    description: 'A brain-friendly guide to design patterns that will make software design principles stick in your mind visually and effectively.'
  },
  {
    isbn: '978-1-593-27220-3',
    title: 'The Linux Programming Interface',
    author: 'Michael Kerrisk',
    category: 'Computer Science',
    publisher: 'No Starch Press',
    published_year: 2010,
    quantity: 4,
    available_quantity: 3,
    description: 'The definitive guide to the Linux and UNIX system programming interfaces, covering systems architecture, IPC, signals, and sockets.'
  },

  // Artificial Intelligence & Data Science
  {
    isbn: '978-0-13-461099-3',
    title: 'Artificial Intelligence: A Modern Approach (4th Edition)',
    author: 'Stuart Russell, Peter Norvig',
    category: 'Artificial Intelligence',
    publisher: 'Pearson',
    published_year: 2020,
    quantity: 8,
    available_quantity: 6,
    description: 'The standard and most celebrated textbook in artificial intelligence, covering search, logic, machine learning, robotics, and ethics.'
  },
  {
    isbn: '978-0-262-03561-3',
    title: 'Deep Learning',
    author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
    category: 'Artificial Intelligence',
    publisher: 'MIT Press',
    published_year: 2016,
    quantity: 6,
    available_quantity: 4,
    description: 'An introduction to a broad range of topics in deep learning, covering mathematical and conceptual background, deep networks, and research perspectives.'
  },
  {
    isbn: '978-1-098-12597-4',
    title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow (3rd Edition)',
    author: 'Aurélien Géron',
    category: 'Artificial Intelligence',
    publisher: 'O\'Reilly Media',
    published_year: 2022,
    quantity: 9,
    available_quantity: 7,
    description: 'Through a recent series of breakthroughs, deep learning has boosted the entire field of machine learning. Aurélien shows practical steps to build intelligent systems.'
  },
  {
    isbn: '978-0-387-31073-2',
    title: 'Pattern Recognition and Machine Learning',
    author: 'Christopher M. Bishop',
    category: 'Artificial Intelligence',
    publisher: 'Springer',
    published_year: 2006,
    quantity: 5,
    available_quantity: 4,
    description: 'This is the first textbook on pattern recognition to present the Bayesian viewpoint, widely used in university graduate courses.'
  },
  {
    isbn: '978-0-262-03924-6',
    title: 'Reinforcement Learning: An Introduction (2nd Edition)',
    author: 'Richard S. Sutton, Andrew G. Barto',
    category: 'Artificial Intelligence',
    publisher: 'MIT Press',
    published_year: 2018,
    quantity: 5,
    available_quantity: 3,
    description: 'The key reference text for reinforcement learning, covering Markov decision processes, dynamic programming, temporal-difference learning, and policy gradients.'
  },
  {
    isbn: '978-1-492-03264-9',
    title: 'Python for Data Analysis (3rd Edition)',
    author: 'Wes McKinney',
    category: 'Data Science',
    publisher: 'O\'Reilly Media',
    published_year: 2022,
    quantity: 8,
    available_quantity: 6,
    description: 'Written by the creator of Python pandas library, a hands-on guide for manipulating, processing, cleaning, and crunching datasets in Python.'
  },
  {
    isbn: '978-1-999-57950-0',
    title: 'The Hundred-Page Machine Learning Book',
    author: 'Andriy Burkov',
    category: 'Artificial Intelligence',
    publisher: 'Andriy Burkov',
    published_year: 2019,
    quantity: 6,
    available_quantity: 5,
    description: 'A compact and concise masterclass in machine learning fundamentals that covers algorithms, optimization, and practical tips in 100 pages.'
  },
  {
    isbn: '978-1-492-04194-8',
    title: 'Speech and Language Processing (3rd Edition Draft)',
    author: 'Daniel Jurafsky, James H. Martin',
    category: 'Artificial Intelligence',
    publisher: 'Pearson',
    published_year: 2023,
    quantity: 4,
    available_quantity: 3,
    description: 'An authoritative and classic introduction to natural language processing, speech recognition, computational linguistics, and language models.'
  },
  {
    isbn: '978-1-098-13403-7',
    title: 'Generative Deep Learning (2nd Edition)',
    author: 'David Foster',
    category: 'Artificial Intelligence',
    publisher: 'O\'Reilly Media',
    published_year: 2023,
    quantity: 5,
    available_quantity: 4,
    description: 'How to use deep learning models like VAEs, GANs, Transformers, and Diffusion models to paint, write, compose, and generate novel content.'
  },
  {
    isbn: '978-1-108-45514-5',
    title: 'Mathematics for Machine Learning',
    author: 'Marc Peter Deisenroth, A. Aldo Faisal, Cheng Soon Ong',
    category: 'Data Science',
    publisher: 'Cambridge University Press',
    published_year: 2020,
    quantity: 6,
    available_quantity: 5,
    description: 'The fundamental mathematical tools needed to understand machine learning: linear algebra, analytic geometry, matrix decompositions, vector calculus, and probability.'
  },

  // Mathematics & Physics
  {
    isbn: '978-0-07-338309-5',
    title: 'Discrete Mathematics and Its Applications (8th Edition)',
    author: 'Kenneth H. Rosen',
    category: 'Mathematics',
    publisher: 'McGraw-Hill Education',
    published_year: 2018,
    quantity: 8,
    available_quantity: 6,
    description: 'A focused introduction to the primary themes in discrete mathematics as well as the necessity for reading and writing mathematical proofs.'
  },
  {
    isbn: '978-0-980-23277-6',
    title: 'Introduction to Linear Algebra (5th Edition)',
    author: 'Gilbert Strang',
    category: 'Mathematics',
    publisher: 'Wellesley-Cambridge Press',
    published_year: 2016,
    quantity: 7,
    available_quantity: 5,
    description: 'Renowned MIT professor Gilbert Strang explains linear algebra with intuition, geometric insight, and real-world applications.'
  },
  {
    isbn: '978-1-285-74062-1',
    title: 'Calculus: Early Transcendentals (8th Edition)',
    author: 'James Stewart',
    category: 'Mathematics',
    publisher: 'Cengage Learning',
    published_year: 2015,
    quantity: 8,
    available_quantity: 6,
    description: 'Success in your calculus course starts here! James Stewart\'s Calculus: Early Transcendentals is a worldwide best-seller for its mathematical precision.'
  },
  {
    isbn: '978-0-321-50046-3',
    title: 'Probability and Statistics (4th Edition)',
    author: 'Morris H. DeGroot, Mark J. Schervish',
    category: 'Mathematics',
    publisher: 'Pearson',
    published_year: 2011,
    quantity: 5,
    available_quantity: 4,
    description: 'Presents a balanced approach between classical and Bayesian methods, suitable for science and engineering undergraduates.'
  },
  {
    isbn: '978-0-387-84857-0',
    title: 'The Elements of Statistical Learning (2nd Edition)',
    author: 'Trevor Hastie, Robert Tibshirani, Jerome Friedman',
    category: 'Mathematics',
    publisher: 'Springer',
    published_year: 2009,
    quantity: 6,
    available_quantity: 4,
    description: 'Essential reference in data mining, inference, and prediction from Stanford statistical researchers who pioneered modern machine learning algorithms.'
  },
  {
    isbn: '978-0-321-54686-7',
    title: 'University Physics with Modern Physics (15th Edition)',
    author: 'Hugh D. Young, Roger A. Freedman',
    category: 'Physics',
    publisher: 'Pearson',
    published_year: 2019,
    quantity: 8,
    available_quantity: 6,
    description: 'A benchmark in university physics education, known for its deep conceptual foundation and rigorous real-world problem sets.'
  },
  {
    isbn: '978-0-465-02493-3',
    title: 'The Feynman Lectures on Physics (Boxed Set)',
    author: 'Richard P. Feynman, Robert B. Leighton, Matthew Sands',
    category: 'Physics',
    publisher: 'Basic Books',
    published_year: 2011,
    quantity: 4,
    available_quantity: 3,
    description: 'The legendary lectures given by Nobel laureate Richard Feynman at Caltech, revolutionizing physics instruction with brilliant insights.'
  },
  {
    isbn: '978-0-553-38016-3',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    category: 'Physics',
    publisher: 'Bantam Books',
    published_year: 1988,
    quantity: 7,
    available_quantity: 6,
    description: 'Stephen Hawking explores the origin and nature of the universe, black holes, space and time, and the quest for a theory of everything.'
  },
  {
    isbn: '978-0-393-60939-4',
    title: 'Astrophysics for People in a Hurry',
    author: 'Neil deGrasse Tyson',
    category: 'Physics',
    publisher: 'W. W. Norton & Company',
    published_year: 2017,
    quantity: 6,
    available_quantity: 5,
    description: 'What is the nature of space and time? Neil deGrasse Tyson brings the universe down to Earth succinctly and clearly in mind-expanding chapters.'
  },
  {
    isbn: '978-0-375-70811-4',
    title: 'The Elegant Universe: Superstrings, Hidden Dimensions, and the Quest for the Ultimate Theory',
    author: 'Brian Greene',
    category: 'Physics',
    publisher: 'Vintage',
    published_year: 2000,
    quantity: 5,
    available_quantity: 4,
    description: 'Brian Greene peels back the mystery of string theory to reveal a universe consisting of eleven dimensions where spacetime vibrates.'
  },

  // Business, Management & Entrepreneurship
  {
    isbn: '978-0-307-88789-4',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    category: 'Business',
    publisher: 'Crown Business',
    published_year: 2011,
    quantity: 9,
    available_quantity: 7,
    description: 'How Today\'s Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses through Build-Measure-Learn cycles.'
  },
  {
    isbn: '978-0-06-662099-2',
    title: 'Good to Great: Why Some Companies Make the Leap... and Others Don\'t',
    author: 'Jim Collins',
    category: 'Business',
    publisher: 'HarperBusiness',
    published_year: 2001,
    quantity: 7,
    available_quantity: 5,
    description: 'Management researcher Jim Collins identifies key characteristics of companies that transitioned from good performers to long-term greatness.'
  },
  {
    isbn: '978-0-804-13929-8',
    title: 'Zero to One: Notes on Startups, or How to Build the Future',
    author: 'Peter Thiel, Blake Masters',
    category: 'Business',
    publisher: 'Crown Business',
    published_year: 2014,
    quantity: 8,
    available_quantity: 6,
    description: 'PayPal co-founder Peter Thiel shows that the next Bill Gates will not build an operating system. The next champions will escape competition altogether.'
  },
  {
    isbn: '978-1-422-19602-1',
    title: 'The Innovator\'s Dilemma',
    author: 'Clayton M. Christensen',
    category: 'Business',
    publisher: 'Harvard Business Review Press',
    published_year: 1997,
    quantity: 5,
    available_quantity: 4,
    description: 'The revolutionary book that explains why great companies can fail precisely because they do everything right, when disrupted by new market forces.'
  },
  {
    isbn: '978-0-525-53622-2',
    title: 'Measure What Matters: How Google, Bono, and the Gates Foundation Rock the World with OKRs',
    author: 'John Doerr',
    category: 'Business',
    publisher: 'Portfolio',
    published_year: 2018,
    quantity: 6,
    available_quantity: 5,
    description: 'Legendary venture capitalist John Doerr reveals how the goal-setting system of Objectives and Key Results (OKRs) has driven astronomical growth.'
  },
  {
    isbn: '978-0-670-91953-6',
    title: 'Thinking in Systems: A Primer',
    author: 'Donella H. Meadows',
    category: 'Management',
    publisher: 'Chelsea Green Publishing',
    published_year: 2008,
    quantity: 6,
    available_quantity: 5,
    description: 'A concise and crucial book offering insight for problem solving on scales ranging from personal to global through systems theory.'
  },
  {
    isbn: '978-0-307-46374-6',
    title: 'Rework',
    author: 'Jason Fried, David Heinemeier Hansson',
    category: 'Business',
    publisher: 'Currency',
    published_year: 2010,
    quantity: 7,
    available_quantity: 6,
    description: 'The founders of Basecamp show that most business advice about business plans, meetings, and expansion is actually harmful.'
  },
  {
    isbn: '978-1-501-12402-0',
    title: 'Principles: Life and Work',
    author: 'Ray Dalio',
    category: 'Management',
    publisher: 'Simon & Schuster',
    published_year: 2017,
    quantity: 8,
    available_quantity: 6,
    description: 'Ray Dalio, founder of Bridgewater Associates, shares the unconventional principles he developed over forty years to achieve unique results.'
  },
  {
    isbn: '978-1-591-84778-6',
    title: 'Hooked: How to Build Habit-Forming Products',
    author: 'Nir Eyal',
    category: 'Business',
    publisher: 'Portfolio',
    published_year: 2014,
    quantity: 6,
    available_quantity: 5,
    description: 'A guide to how successful tech companies engineer habit-forming products using the 4-step Hook Model: Trigger, Action, Variable Reward, and Investment.'
  },
  {
    isbn: '978-0-679-76288-1',
    title: 'High Output Management',
    author: 'Andrew S. Grove',
    category: 'Management',
    publisher: 'Vintage',
    published_year: 1995,
    quantity: 5,
    available_quantity: 4,
    description: 'Former Intel CEO Andy Grove\'s legendary management manual on how to create and maintain peak managerial leverage and operational output.'
  },
  {
    isbn: '978-0-06-227320-8',
    title: 'The Hard Thing About Hard Things',
    author: 'Ben Horowitz',
    category: 'Business',
    publisher: 'HarperBusiness',
    published_year: 2014,
    quantity: 7,
    available_quantity: 5,
    description: 'Ben Horowitz, cofounder of Andreessen Horowitz, draws on his own story of founding and leading companies through brutal crises.'
  },
  {
    isbn: '978-0-735-21129-2',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Help',
    publisher: 'Avery',
    published_year: 2018,
    quantity: 12,
    available_quantity: 9,
    description: 'An easy & proven way to build good habits & break bad ones, drawing on biological, psychological, and neuroscientific research.'
  },

  // Economics & Finance
  {
    isbn: '978-0-357-13348-4',
    title: 'Principles of Economics (9th Edition)',
    author: 'N. Gregory Mankiw',
    category: 'Economics',
    publisher: 'Cengage Learning',
    published_year: 2020,
    quantity: 8,
    available_quantity: 6,
    description: 'The premier university economics text, presenting a strong foundation in microeconomics and macroeconomics with clear analytical tools.'
  },
  {
    isbn: '978-0-674-43000-6',
    title: 'Capital in the Twenty-First Century',
    author: 'Thomas Piketty',
    category: 'Economics',
    publisher: 'Belknap Press',
    published_year: 2014,
    quantity: 5,
    available_quantity: 4,
    description: 'A landmark economic work analyzing unique collection of data from 20 countries over three centuries to reveal long-term wealth inequality patterns.'
  },
  {
    isbn: '978-0-06-073132-8',
    title: 'Freakonomics: A Rogue Economist Explores the Hidden Side of Everything',
    author: 'Steven D. Levitt, Stephen J. Dubner',
    category: 'Economics',
    publisher: 'William Morrow',
    published_year: 2005,
    quantity: 8,
    available_quantity: 6,
    description: 'Economics is, at root, the study of incentives. Levitt and Dubner show how economic thinking unlocks bizarre real-world questions.'
  },
  {
    isbn: '978-0-06-055566-5',
    title: 'The Intelligent Investor',
    author: 'Benjamin Graham',
    category: 'Finance',
    publisher: 'Harper Business Essentials',
    published_year: 2003,
    quantity: 7,
    available_quantity: 5,
    description: 'The greatest investment advisor of the twentieth century, Benjamin Graham taught and inspired people worldwide on value investing.'
  },
  {
    isbn: '978-0-857-19768-9',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'Finance',
    publisher: 'Harriman House',
    published_year: 2020,
    quantity: 10,
    available_quantity: 7,
    description: 'Timeless lessons on wealth, greed, and happiness doing well with money isn’t necessarily about what you know. It’s about how you behave.'
  },
  {
    isbn: '978-0-465-06073-3',
    title: 'Basic Economics (5th Edition)',
    author: 'Thomas Sowell',
    category: 'Economics',
    publisher: 'Basic Books',
    published_year: 2014,
    quantity: 6,
    available_quantity: 5,
    description: 'A citizen\'s guide to economics for those who want to understand how the economy works but have no interest in jargon or equations.'
  },
  {
    isbn: '978-0-14-311526-7',
    title: 'Nudge: Improving Decisions About Health, Wealth, and Happiness',
    author: 'Richard H. Thaler, Cass R. Sunstein',
    category: 'Economics',
    publisher: 'Penguin Books',
    published_year: 2009,
    quantity: 6,
    available_quantity: 5,
    description: 'Nobel Prize winner Richard Thaler reveals how behavioral economics and choice architecture can nudge people toward better decisions.'
  },
  {
    isbn: '978-0-393-33764-8',
    title: 'The Black Swan: The Impact of the Highly Improbable',
    author: 'Nassim Nicholas Taleb',
    category: 'Economics',
    publisher: 'Random House',
    published_year: 2007,
    quantity: 5,
    available_quantity: 4,
    description: 'A black swan is an event that is an extreme outlier, has an immense impact, and is rationalized by hindsight bias.'
  },

  // Literature & Philosophy
  {
    isbn: '978-0-06-112008-4',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Literature',
    publisher: 'J.B. Lippincott & Co.',
    published_year: 1960,
    quantity: 8,
    available_quantity: 6,
    description: 'A classic novel of racial injustice and childhood innocence in the American South, viewed through the eyes of young Scout Finch.'
  },
  {
    isbn: '978-0-14-028329-7',
    title: '1984',
    author: 'George Orwell',
    category: 'Literature',
    publisher: 'Secker & Warburg',
    published_year: 1949,
    quantity: 9,
    available_quantity: 7,
    description: 'A chilling dystopian novel set in a totalitarian superstate ruled by the Party and the ever-watching figure of Big Brother.'
  },
  {
    isbn: '978-0-743-27356-5',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Literature',
    publisher: 'Charles Scribner\'s Sons',
    published_year: 1925,
    quantity: 7,
    available_quantity: 5,
    description: 'The story of the fabulously wealthy Jay Gatsby and his passionate obsession with the beautiful Daisy Buchanan during the Jazz Age.'
  },
  {
    isbn: '978-0-14-143951-8',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    category: 'Literature',
    publisher: 'T. Egerton',
    published_year: 1813,
    quantity: 6,
    available_quantity: 5,
    description: 'A witty romantic masterwork following Elizabeth Bennet as she navigates issues of manners, upbringing, morality, and marriage.'
  },
  {
    isbn: '978-0-14-044913-6',
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    category: 'Literature',
    publisher: 'The Russian Messenger',
    published_year: 1866,
    quantity: 5,
    available_quantity: 4,
    description: 'A psychological masterpiece examining the mental anguish and moral dilemmas of an impoverished ex-student in Saint Petersburg who murders a pawnbroker.'
  },
  {
    isbn: '978-0-316-76948-0',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    category: 'Literature',
    publisher: 'Little, Brown and Company',
    published_year: 1951,
    quantity: 6,
    available_quantity: 5,
    description: 'The quintessential novel of adolescent rebellion, alienation, and identity, told through the raw voice of Holden Caulfield.'
  },
  {
    isbn: '978-0-06-085052-4',
    title: 'Brave New World',
    author: 'Aldous Huxley',
    category: 'Literature',
    publisher: 'Chatto & Windus',
    published_year: 1932,
    quantity: 6,
    available_quantity: 4,
    description: 'A prophetic masterpiece envisioning a futuristic World State where citizens are genetically engineered, conditioned, and anesthetized.'
  },
  {
    isbn: '978-0-547-92822-7',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    category: 'Literature',
    publisher: 'George Allen & Unwin',
    published_year: 1937,
    quantity: 8,
    available_quantity: 6,
    description: 'Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, until the wizard Gandalf and a company of thirteen dwarves arrive.'
  },
  {
    isbn: '978-0-618-64015-7',
    title: 'The Fellowship of the Ring',
    author: 'J.R.R. Tolkien',
    category: 'Literature',
    publisher: 'George Allen & Unwin',
    published_year: 1954,
    quantity: 7,
    available_quantity: 5,
    description: 'The first volume in The Lord of the Rings trilogy, beginning Frodo Baggins\' perilous journey to destroy the One Ring in the fires of Mount Doom.'
  },
  {
    isbn: '978-0-06-088328-7',
    title: 'One Hundred Years of Solitude',
    author: 'Gabriel García Márquez',
    category: 'Literature',
    publisher: 'Harper & Row',
    published_year: 1967,
    quantity: 5,
    available_quantity: 4,
    description: 'A pinnacle of magical realism telling the multi-generational story of the Buendía family whose patriarch founds the mythical Colombian town of Macondo.'
  },
  {
    isbn: '978-0-451-52634-2',
    title: 'Animal Farm',
    author: 'George Orwell',
    category: 'Literature',
    publisher: 'Secker and Warburg',
    published_year: 1945,
    quantity: 8,
    available_quantity: 7,
    description: 'A brilliant political satire allegorizing the Russian Revolution through farm animals who rebel against their human farmer.'
  },
  {
    isbn: '978-1-451-67331-9',
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    category: 'Literature',
    publisher: 'Ballantine Books',
    published_year: 1953,
    quantity: 6,
    available_quantity: 5,
    description: 'Guy Montag is a fireman whose job is to burn books in a future American society where television rules and literature is on the brink of extinction.'
  },
  {
    isbn: '978-0-15-601219-5',
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    category: 'Literature',
    publisher: 'Reynal & Hitchcock',
    published_year: 1943,
    quantity: 10,
    available_quantity: 8,
    description: 'A timeless poetic tale of a young prince who visits various planets in space, addressing themes of loneliness, friendship, love, and loss.'
  },
  {
    isbn: '978-0-06-231609-7',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    category: 'History',
    publisher: 'Harper',
    published_year: 2014,
    quantity: 12,
    available_quantity: 9,
    description: 'Yuval Noah Harari explores how an insignificant ape became the ruler of planet Earth, capable of splitting the atom and journeying to the moon.'
  },
  {
    isbn: '978-0-06-246431-6',
    title: 'Homo Deus: A Brief History of Tomorrow',
    author: 'Yuval Noah Harari',
    category: 'History',
    publisher: 'Harper',
    published_year: 2016,
    quantity: 8,
    available_quantity: 6,
    description: 'Harari turns his gaze toward our future, exploring the dreams, projects, and nightmares that will shape humanity in the twenty-first century.'
  },
  {
    isbn: '978-0-807-01429-5',
    title: 'Man\'s Search for Meaning',
    author: 'Viktor E. Frankl',
    category: 'Philosophy',
    publisher: 'Beacon Press',
    published_year: 1946,
    quantity: 7,
    available_quantity: 5,
    description: 'Psychiatrist Viktor Frankl chronicles his experiences as an Auschwitz concentration camp inmate and describes his psychotherapeutic method of logotherapy.'
  },
  {
    isbn: '978-0-14-044949-5',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    category: 'Philosophy',
    publisher: 'Penguin Classics',
    published_year: 2006,
    quantity: 8,
    available_quantity: 6,
    description: 'Private reflections by the Roman Emperor Marcus Aurelius, offering enduring wisdom on Stoic philosophy, resilience, and ethical leadership.'
  },
  {
    isbn: '978-0-14-044927-3',
    title: 'The Republic',
    author: 'Plato',
    category: 'Philosophy',
    publisher: 'Penguin Classics',
    published_year: 2003,
    quantity: 5,
    available_quantity: 4,
    description: 'Plato\'s celebrated dialogue concerning justice, the order and character of the just city-state, and the nature of the philosopher king.'
  },

  // Psychology & Human Behavior
  {
    isbn: '978-0-374-53355-7',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'Psychology',
    publisher: 'Farrar, Straus and Giroux',
    published_year: 2011,
    quantity: 9,
    available_quantity: 7,
    description: 'Nobel laureate Daniel Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think: System 1 and System 2.'
  },
  {
    isbn: '978-0-06-124189-5',
    title: 'Influence: The Psychology of Persuasion',
    author: 'Robert B. Cialdini',
    category: 'Psychology',
    publisher: 'Harper Business',
    published_year: 2006,
    quantity: 8,
    available_quantity: 6,
    description: 'The foundational book on persuasion, explaining the 6 universal psychological principles that cause humans to say yes.'
  },
  {
    isbn: '978-0-06-133920-2',
    title: 'Flow: The Psychology of Optimal Experience',
    author: 'Mihaly Csikszentmihalyi',
    category: 'Psychology',
    publisher: 'Harper Perennial',
    published_year: 1990,
    quantity: 6,
    available_quantity: 5,
    description: 'Csikszentmihalyi\'s classic investigation of optimal human experience reveals that what makes an experience genuinely satisfying is the state of flow.'
  },
  {
    isbn: '978-0-307-35215-6',
    title: 'Quiet: The Power of Introverts in a World That Can\'t Stop Talking',
    author: 'Susan Cain',
    category: 'Psychology',
    publisher: 'Crown',
    published_year: 2012,
    quantity: 7,
    available_quantity: 6,
    description: 'Susan Cain argues that we dramatically undervalue introverts and shows how much we lose in doing so in business, school, and culture.'
  },
  {
    isbn: '978-1-501-11110-5',
    title: 'Grit: The Power of Passion and Perseverance',
    author: 'Angela Duckworth',
    category: 'Psychology',
    publisher: 'Scribner',
    published_year: 2016,
    quantity: 7,
    available_quantity: 5,
    description: 'Pioneering psychologist Angela Duckworth shows parents, students, educators, and athletes that the secret to outstanding achievement is grit.'
  },
  {
    isbn: '978-0-812-98160-5',
    title: 'The Power of Habit: Why We Do What We Do in Life and Business',
    author: 'Charles Duhigg',
    category: 'Psychology',
    publisher: 'Random House',
    published_year: 2012,
    quantity: 8,
    available_quantity: 6,
    description: 'Award-winning reporter Charles Duhigg takes us to the thrilling edge of scientific discoveries that explain why habits exist and how they can be changed.'
  },

  // Design, Architecture & UX
  {
    isbn: '978-0-465-05065-9',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    category: 'Design',
    publisher: 'Basic Books',
    published_year: 2013,
    quantity: 7,
    available_quantity: 5,
    description: 'Even the smartest among us can feel inept as we fail to figure out whether to push or pull an unfamiliar door. The ultimate bible of cognitive design and usability.'
  },
  {
    isbn: '978-0-321-96551-6',
    title: 'Don\'t Make Me Think, Revisited: A Common Sense Approach to Web Usability',
    author: 'Steve Krug',
    category: 'Design',
    publisher: 'New Riders',
    published_year: 2014,
    quantity: 8,
    available_quantity: 6,
    description: 'Since Don\'t Make Me Think was first published in 2000, hundreds of thousands of web designers and developers have relied on Steve Krug\'s guide.'
  },
  {
    isbn: '978-1-592-53587-3',
    title: 'Universal Principles of Design',
    author: 'William Lidwell, Kritina Holden, Jill Butler',
    category: 'Design',
    publisher: 'Rockport Publishers',
    published_year: 2010,
    quantity: 5,
    available_quantity: 4,
    description: 'A comprehensive, cross-disciplinary encyclopedia of 125 design concepts from affordances to the golden ratio and Ockham\'s razor.'
  },
  {
    isbn: '978-0-321-70253-1',
    title: '100 Things Every Designer Needs to Know About People',
    author: 'Susan Weinschenk',
    category: 'Design',
    publisher: 'New Riders',
    published_year: 2011,
    quantity: 6,
    available_quantity: 5,
    description: 'Combine real science and research with practical examples to deliver a guide every designer needs to make intuitive, impactful products.'
  },
  {
    isbn: '978-0-997-59422-5',
    title: 'Refactoring UI',
    author: 'Adam Wathan, Steve Schoger',
    category: 'Design',
    publisher: 'Refactoring UI',
    published_year: 2018,
    quantity: 6,
    available_quantity: 5,
    description: 'Learn how to design beautiful user interfaces yourself using specific tactics and rules of thumb, written for developers by the makers of Tailwind CSS.'
  },

  // Additional Classical and Modern Hits to exceed 100 books
  {
    isbn: '978-0-679-72020-1',
    title: 'The Stranger',
    author: 'Albert Camus',
    category: 'Literature',
    publisher: 'Vintage',
    published_year: 1942,
    quantity: 6,
    available_quantity: 5,
    description: 'Through the story of an ordinary man unwittingly drawn into a senseless murder on an Algerian beach, Camus explored alienation and the Absurd.'
  },
  {
    isbn: '978-0-14-044794-1',
    title: 'The Prince',
    author: 'Niccolò Machiavelli',
    category: 'Philosophy',
    publisher: 'Penguin Classics',
    published_year: 2003,
    quantity: 7,
    available_quantity: 6,
    description: 'A seminal treaty on political power, statecraft, and realpolitik written by Italian Renaissance diplomat Niccolò Machiavelli.'
  },
  {
    isbn: '978-0-06-256088-0',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Literature',
    publisher: 'HarperOne',
    published_year: 1988,
    quantity: 10,
    available_quantity: 8,
    description: 'A magical story of an Andalusian shepherd boy named Santiago who yearns to travel in search of a worldly treasure as extravagant as any found.'
  },
  {
    isbn: '978-0-14-118280-3',
    title: 'The Metamorphosis',
    author: 'Franz Kafka',
    category: 'Literature',
    publisher: 'Penguin Books',
    published_year: 1915,
    quantity: 6,
    available_quantity: 5,
    description: 'Gregor Samsa wakes one morning from uneasy dreams to find himself transformed in his bed into a gigantic insect.'
  },
  {
    isbn: '978-0-14-044926-6',
    title: 'The Art of War',
    author: 'Sun Tzu',
    category: 'History',
    publisher: 'Penguin Classics',
    published_year: 2009,
    quantity: 8,
    available_quantity: 7,
    description: 'An ancient Chinese military treatise dating from the Late Spring and Autumn Period, influential across military, management, and strategic disciplines.'
  },
  {
    isbn: '978-0-394-80001-1',
    title: 'The Cat in the Hat',
    author: 'Dr. Seuss',
    category: 'Literature',
    publisher: 'Random House',
    published_year: 1957,
    quantity: 6,
    available_quantity: 6,
    description: 'A timeless children\'s book illustrating the joys of reading through rhythm and rhyme.'
  },
  {
    isbn: '978-0-452-28423-4',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    category: 'Literature',
    publisher: 'Lackington, Hughes, Harding, Mavor, & Jones',
    published_year: 1818,
    quantity: 6,
    available_quantity: 5,
    description: 'The classic gothic thriller recounting Victor Frankenstein\'s tragic creation of a sapient, monstrous creature.'
  },
  {
    isbn: '978-0-14-044917-4',
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    category: 'Literature',
    publisher: 'The Russian Messenger',
    published_year: 1869,
    quantity: 4,
    available_quantity: 3,
    description: 'Epic literary masterpiece delineating the French invasion of Russia and the impact of the Napoleonic era on Tsarist society.'
  },
  {
    isbn: '978-0-14-044918-1',
    title: 'Anna Karenina',
    author: 'Leo Tolstoy',
    category: 'Literature',
    publisher: 'The Russian Messenger',
    published_year: 1877,
    quantity: 5,
    available_quantity: 4,
    description: 'Tolstoy\'s poignant tragedy of married aristocrat Anna Karenina and her scandalous affair with the affluent Count Vronsky.'
  },
  {
    isbn: '978-0-14-044933-4',
    title: 'The Brothers Karamazov',
    author: 'Fyodor Dostoevsky',
    category: 'Literature',
    publisher: 'The Russian Messenger',
    published_year: 1880,
    quantity: 5,
    available_quantity: 4,
    description: 'A passionate philosophical novel that enters deeply into the ethical debates of God, free will, and morality in 19th-century Russia.'
  },
  {
    isbn: '978-0-14-243723-0',
    title: 'Don Quixote',
    author: 'Miguel de Cervantes',
    category: 'Literature',
    publisher: 'Francisco de Robles',
    published_year: 1605,
    quantity: 5,
    available_quantity: 4,
    description: 'Widely regarded as the first modern novel, following the adventures of Alonso Quixano who imagines himself a valiant knight errant.'
  },
  {
    isbn: '978-0-14-044924-2',
    title: 'The Odyssey',
    author: 'Homer',
    category: 'Literature',
    publisher: 'Penguin Classics',
    published_year: 2003,
    quantity: 6,
    available_quantity: 5,
    description: 'The ancient Greek epic poem telling the journey of Odysseus, King of Ithaca, as he strives to return home after the Trojan War.'
  },
  {
    isbn: '978-0-14-027536-0',
    title: 'The Iliad',
    author: 'Homer',
    category: 'Literature',
    publisher: 'Penguin Classics',
    published_year: 1998,
    quantity: 6,
    available_quantity: 5,
    description: 'Set during the Trojan War, the ten-year siege of the city of Troy by a coalition of Greek kingdoms.'
  },
  {
    isbn: '978-0-14-044118-5',
    title: 'The Divine Comedy',
    author: 'Dante Alighieri',
    category: 'Literature',
    publisher: 'Penguin Classics',
    published_year: 2003,
    quantity: 5,
    available_quantity: 4,
    description: 'Dante\'s vision of the afterlife, describing his travels through Inferno, Purgatorio, and Paradiso.'
  },
  {
    isbn: '978-0-14-044793-4',
    title: 'Hamlet',
    author: 'William Shakespeare',
    category: 'Literature',
    publisher: 'Penguin Classics',
    published_year: 2005,
    quantity: 7,
    available_quantity: 6,
    description: 'Shakespeare\'s tragedy set in Denmark, depicting Prince Hamlet and his revenge against his uncle, Claudius.'
  },
  {
    isbn: '978-0-14-044795-8',
    title: 'Macbeth',
    author: 'William Shakespeare',
    category: 'Literature',
    publisher: 'Penguin Classics',
    published_year: 2005,
    quantity: 6,
    available_quantity: 5,
    description: 'A Scottish general named Macbeth receives a prophecy from a trio of witches that one day he will become King of Scotland.'
  },
  {
    isbn: '978-0-14-044792-7',
    title: 'Romeo and Juliet',
    author: 'William Shakespeare',
    category: 'Literature',
    publisher: 'Penguin Classics',
    published_year: 2005,
    quantity: 7,
    available_quantity: 6,
    description: 'The tragic love story between two young Italian star-crossed lovers whose deaths ultimately reconcile their feuding families.'
  },
  {
    isbn: '978-0-679-73477-2',
    title: 'Beloved',
    author: 'Toni Morrison',
    category: 'Literature',
    publisher: 'Alfred A. Knopf',
    published_year: 1987,
    quantity: 6,
    available_quantity: 5,
    description: 'Pulitzer Prize-winning novel inspired by the real life story of Margaret Garner, an African American who escaped slavery in Kentucky.'
  },
  {
    isbn: '978-0-14-018639-0',
    title: 'Of Mice and Men',
    author: 'John Steinbeck',
    category: 'Literature',
    publisher: 'Covici Friede',
    published_year: 1937,
    quantity: 7,
    available_quantity: 6,
    description: 'A novella narrating the experiences of George Milton and Lennie Small, two displaced migrant ranch workers during the Great Depression.'
  },
  {
    isbn: '978-0-14-018640-6',
    title: 'The Grapes of Wrath',
    author: 'John Steinbeck',
    category: 'Literature',
    publisher: 'The Viking Press',
    published_year: 1939,
    quantity: 6,
    available_quantity: 5,
    description: 'Follows the Joads, a poor family of tenant farmers driven from their Oklahoma home by drought, economic hardship, and changes in financial industry.'
  },
  {
    isbn: '978-0-684-80122-3',
    title: 'The Old Man and the Sea',
    author: 'Ernest Hemingway',
    category: 'Literature',
    publisher: 'Charles Scribner\'s Sons',
    published_year: 1952,
    quantity: 8,
    available_quantity: 7,
    description: 'Tells the story of Santiago, an aging Cuban fisherman who struggles with a giant marlin far out in the Gulf Stream.'
  },
  {
    isbn: '978-0-684-80146-9',
    title: 'A Farewell to Arms',
    author: 'Ernest Hemingway',
    category: 'Literature',
    publisher: 'Charles Scribner\'s Sons',
    published_year: 1929,
    quantity: 5,
    available_quantity: 4,
    description: 'Set during the Italian campaign of World War I, first-person account of an American, Frederic Henry, serving as an ambulance driver.'
  },
  {
    isbn: '978-0-06-093546-7',
    title: 'Their Eyes Were Watching God',
    author: 'Zora Neale Hurston',
    category: 'Literature',
    publisher: 'J.B. Lippincott & Co.',
    published_year: 1937,
    quantity: 6,
    available_quantity: 5,
    description: 'Follows the life and romantic journey of Janie Crawford, an African-American woman in Florida in the early 20th century.'
  },
  {
    isbn: '978-0-14-044784-2',
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
    category: 'Literature',
    publisher: 'Thomas Cautley Newby',
    published_year: 1847,
    quantity: 6,
    available_quantity: 5,
    description: 'A tempestuous tale of intense, almost demonic love between Catherine Earnshaw and Heathcliff on the desolate Yorkshire moors.'
  },
  {
    isbn: '978-0-14-144114-6',
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    category: 'Literature',
    publisher: 'Smith, Elder & Co.',
    published_year: 1847,
    quantity: 6,
    available_quantity: 5,
    description: 'Follows the experiences of its eponymous heroine, including her growth to adulthood and her love for Mr. Rochester at Thornfield Hall.'
  },
  {
    isbn: '978-0-14-043072-1',
    title: 'Great Expectations',
    author: 'Charles Dickens',
    category: 'Literature',
    publisher: 'Chapman & Hall',
    published_year: 1861,
    quantity: 6,
    available_quantity: 5,
    description: 'Depicts the education of an orphan nicknamed Pip, tracing his personal development and unexpected fortune from an anonymous benefactor.'
  },
  {
    isbn: '978-0-14-143960-0',
    title: 'A Tale of Two Cities',
    author: 'Charles Dickens',
    category: 'Literature',
    publisher: 'Chapman & Hall',
    published_year: 1859,
    quantity: 6,
    available_quantity: 5,
    description: 'Set in London and Paris before and during the French Revolution, depicting the plight of the French peasantry and reign of terror.'
  },
  {
    isbn: '978-0-14-243724-7',
    title: 'Moby-Dick',
    author: 'Herman Melville',
    category: 'Literature',
    publisher: 'Harper & Brothers',
    published_year: 1851,
    quantity: 5,
    available_quantity: 4,
    description: 'The sailor Ishmael narrates the obsessive quest of Ahab, captain of the whaling ship Pequod, for revenge against the giant white sperm whale Moby Dick.'
  },
  {
    isbn: '978-0-14-044915-0',
    title: 'The Count of Monte Cristo',
    author: 'Alexandre Dumas',
    category: 'Literature',
    publisher: 'Pétion',
    published_year: 1844,
    quantity: 7,
    available_quantity: 5,
    description: 'A young sailor Edmond Dantès is falsely accused of treason and imprisoned in the Château d\'If, escaping years later to exact elaborate vengeance.'
  },
  {
    isbn: '978-0-14-044919-8',
    title: 'The Three Musketeers',
    author: 'Alexandre Dumas',
    category: 'Literature',
    publisher: 'Baudry',
    published_year: 1844,
    quantity: 6,
    available_quantity: 5,
    description: 'Recounts the adventures of a young man named d\'Artagnan after he leaves home to travel to Paris, joining the Musketeers of the Guard.'
  },
  {
    isbn: '978-0-14-044430-8',
    title: 'Les Misérables',
    author: 'Victor Hugo',
    category: 'Literature',
    publisher: 'A. Lacroix, Verboeckhoven & Cie.',
    published_year: 1862,
    quantity: 6,
    available_quantity: 5,
    description: 'Beginning in 1815 and culminating in the 1832 June Rebellion in Paris, following the struggles of ex-convict Jean Valjean and his quest for redemption.'
  },
  {
    isbn: '978-0-14-044353-0',
    title: 'The Hunchback of Notre-Dame',
    author: 'Victor Hugo',
    category: 'Literature',
    publisher: 'Gosselin',
    published_year: 1831,
    quantity: 5,
    available_quantity: 4,
    description: 'A French Gothic novel set in 1482 in Paris centered around Quasimodo, the deformed bell-ringer of the cathedral of Notre-Dame.'
  },
  {
    isbn: '978-0-14-044914-3',
    title: 'Madame Bovary',
    author: 'Gustave Flaubert',
    category: 'Literature',
    publisher: 'Revue de Paris',
    published_year: 1856,
    quantity: 5,
    available_quantity: 4,
    description: 'Focuses on Emma Bovary, the wife of a country doctor, who engages in extramarital affairs and lives beyond her means to escape banality.'
  },
  {
    isbn: '978-0-14-243720-9',
    title: 'Heart of Darkness',
    author: 'Joseph Conrad',
    category: 'Literature',
    publisher: 'Blackwood\'s Magazine',
    published_year: 1899,
    quantity: 6,
    available_quantity: 5,
    description: 'A novella about a narrated voyage up the Congo River into the Congo Free State in the heart of Africa through the eyes of Charles Marlow.'
  },
  {
    isbn: '978-0-14-044947-1',
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    category: 'Literature',
    publisher: 'Lippincott\'s Monthly Magazine',
    published_year: 1890,
    quantity: 7,
    available_quantity: 6,
    description: 'A philosophical novel about a portrait that ages and bears the sins of a young man, Dorian Gray, while he maintains his youthful beauty.'
  },
  {
    isbn: '978-0-14-143984-6',
    title: 'Dracula',
    author: 'Bram Stoker',
    category: 'Literature',
    publisher: 'Archibald Constable and Company',
    published_year: 1897,
    quantity: 6,
    available_quantity: 5,
    description: 'An epistolary novel telling the story of Count Dracula\'s attempt to relocate from Transylvania to England so that he may find new blood.'
  },
  {
    isbn: '978-0-14-043773-7',
    title: 'The Strange Case of Dr Jekyll and Mr Hyde',
    author: 'Robert Louis Stevenson',
    category: 'Literature',
    publisher: 'Longmans, Green & Co.',
    published_year: 1886,
    quantity: 6,
    available_quantity: 5,
    description: 'A London legal practitioner investigates strange occurrences between his old friend, Dr Henry Jekyll, and the evil Edward Hyde.'
  },
  {
    isbn: '978-0-14-043009-7',
    title: 'Alice\'s Adventures in Wonderland',
    author: 'Lewis Carroll',
    category: 'Literature',
    publisher: 'Macmillan',
    published_year: 1865,
    quantity: 8,
    available_quantity: 7,
    description: 'A young girl named Alice falls through a rabbit hole into a fantasy world populated by peculiar, anthropomorphic creatures.'
  },
  {
    isbn: '978-0-14-043907-6',
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    category: 'Literature',
    publisher: 'George Newnes',
    published_year: 1892,
    quantity: 8,
    available_quantity: 6,
    description: 'A collection of twelve short stories featuring consulting detective Sherlock Holmes and his companion Dr. John H. Watson.'
  },
  {
    isbn: '978-0-14-043908-3',
    title: 'The Hound of the Baskervilles',
    author: 'Arthur Conan Doyle',
    category: 'Literature',
    publisher: 'George Newnes',
    published_year: 1902,
    quantity: 6,
    available_quantity: 5,
    description: 'Sherlock Holmes and Dr. Watson investigate the legend of a supernatural, diabolical hound haunting Dartmoor in Devon.'
  },
  {
    isbn: '978-0-14-044760-6',
    title: 'Slaughterhouse-Five',
    author: 'Kurt Vonnegut',
    category: 'Literature',
    publisher: 'Delacorte',
    published_year: 1969,
    quantity: 6,
    available_quantity: 5,
    description: 'An anti-war novel centering on the World War II experiences and journeys through time of an American soldier named Billy Pilgrim.'
  },
  {
    isbn: '978-0-14-018859-2',
    title: 'Catch-22',
    author: 'Joseph Heller',
    category: 'Literature',
    publisher: 'Simon & Schuster',
    published_year: 1961,
    quantity: 6,
    available_quantity: 5,
    description: 'A satirical war novel set during World War II, popularizing the term Catch-22 for a paradoxical, inescapable problem.'
  },
  {
    isbn: '978-0-14-028333-4',
    title: 'Lord of the Flies',
    author: 'William Golding',
    category: 'Literature',
    publisher: 'Faber and Faber',
    published_year: 1954,
    quantity: 8,
    available_quantity: 6,
    description: 'A group of British boys stranded on an uninhabited island descend into savagery and struggle disastrously to govern themselves.'
  },
  {
    isbn: '978-0-14-004245-0',
    title: 'On the Road',
    author: 'Jack Kerouac',
    category: 'Literature',
    publisher: 'Viking Press',
    published_year: 1957,
    quantity: 5,
    available_quantity: 4,
    description: 'Based on the travels of Kerouac and his friends across the United States against a backdrop of jazz, poetry, and drugs.'
  },
  {
    isbn: '978-0-394-71643-5',
    title: 'Zen and the Art of Motorcycle Maintenance',
    author: 'Robert M. Pirsig',
    category: 'Philosophy',
    publisher: 'William Morrow & Company',
    published_year: 1974,
    quantity: 6,
    available_quantity: 5,
    description: 'A father and son\'s motorcycle trip across the Northwest United States becomes an insightful philosophical inquiry into metaphysics and Quality.'
  }
];

const membersData = [
  // 45 Students
  { code: 'STD-2024-001', first: 'Somchai', last: 'Wongsakul', email: 'somchai.w@university.ac.th', phone: '081-234-5678', type: 'Student' },
  { code: 'STD-2024-002', first: 'Nattaporn', last: 'Srisuwan', email: 'nattaporn.s@university.ac.th', phone: '082-345-6789', type: 'Student' },
  { code: 'STD-2024-003', first: 'Pitchaya', last: 'Tanaka', email: 'pitchaya.t@university.ac.th', phone: '083-456-7890', type: 'Student' },
  { code: 'STD-2024-004', first: 'Kanokwan', last: 'Prasert', email: 'kanokwan.p@university.ac.th', phone: '084-567-8901', type: 'Student' },
  { code: 'STD-2024-005', first: 'Chayanon', last: 'Ruangdet', email: 'chayanon.r@university.ac.th', phone: '085-111-2233', type: 'Student' },
  { code: 'STD-2024-006', first: 'Krittin', last: 'Thongdee', email: 'krittin.t@university.ac.th', phone: '086-222-3344', type: 'Student' },
  { code: 'STD-2024-007', first: 'Waritsara', last: 'Siriwong', email: 'waritsara.s@university.ac.th', phone: '087-333-4455', type: 'Student' },
  { code: 'STD-2024-008', first: 'Phongsakorn', last: 'Boonmee', email: 'phongsakorn.b@university.ac.th', phone: '088-444-5566', type: 'Student' },
  { code: 'STD-2024-009', first: 'Thanawat', last: 'Chaiprasert', email: 'thanawat.c@university.ac.th', phone: '089-555-6677', type: 'Student' },
  { code: 'STD-2024-010', first: 'Suphattra', last: 'Kittisak', email: 'suphattra.k@university.ac.th', phone: '081-666-7788', type: 'Student' },
  { code: 'STD-2024-011', first: 'Peeranat', last: 'Sukhum', email: 'peeranat.s@university.ac.th', phone: '082-777-8899', type: 'Student' },
  { code: 'STD-2024-012', first: 'Jirapat', last: 'Wattana', email: 'jirapat.w@university.ac.th', phone: '083-888-9900', type: 'Student' },
  { code: 'STD-2024-013', first: 'Sirikanya', last: 'Phromma', email: 'sirikanya.p@university.ac.th', phone: '084-999-0011', type: 'Student' },
  { code: 'STD-2024-014', first: 'Teepakorn', last: 'Kerdphon', email: 'teepakorn.k@university.ac.th', phone: '085-123-4567', type: 'Student' },
  { code: 'STD-2024-015', first: 'Amonrat', last: 'Chaisiri', email: 'amonrat.c@university.ac.th', phone: '086-234-5678', type: 'Student' },
  { code: 'STD-2024-016', first: 'Bannawit', last: 'Songsiri', email: 'bannawit.s@university.ac.th', phone: '087-345-6789', type: 'Student' },
  { code: 'STD-2024-017', first: 'Chanidapa', last: 'Wannarat', email: 'chanidapa.w@university.ac.th', phone: '088-456-7890', type: 'Student' },
  { code: 'STD-2024-018', first: 'Danupat', last: 'Jiamprasert', email: 'danupat.j@university.ac.th', phone: '089-567-8901', type: 'Student' },
  { code: 'STD-2024-019', first: 'Ekkarat', last: 'Chansuk', email: 'ekkarat.c@university.ac.th', phone: '081-678-9012', type: 'Student' },
  { code: 'STD-2024-020', first: 'Fasai', last: 'Phaibun', email: 'fasai.p@university.ac.th', phone: '082-789-0123', type: 'Student' },
  { code: 'STD-2024-021', first: 'Gunyarat', last: 'Suraphon', email: 'gunyarat.s@university.ac.th', phone: '083-890-1234', type: 'Student' },
  { code: 'STD-2024-022', first: 'Harit', last: 'Inthachot', email: 'harit.i@university.ac.th', phone: '084-901-2345', type: 'Student' },
  { code: 'STD-2024-023', first: 'Issara', last: 'Kiatprasert', email: 'issara.k@university.ac.th', phone: '085-012-3456', type: 'Student' },
  { code: 'STD-2024-024', first: 'Jidapa', last: 'Lapthanasiri', email: 'jidapa.l@university.ac.th', phone: '086-123-9876', type: 'Student' },
  { code: 'STD-2024-025', first: 'Korawit', last: 'Muenphan', email: 'korawit.m@university.ac.th', phone: '087-234-8765', type: 'Student' },
  { code: 'STD-2024-026', first: 'Lalitpat', last: 'Naovarat', email: 'lalitpat.n@university.ac.th', phone: '088-345-7654', type: 'Student' },
  { code: 'STD-2024-027', first: 'Methee', last: 'Omkaew', email: 'methee.o@university.ac.th', phone: '089-456-6543', type: 'Student' },
  { code: 'STD-2024-028', first: 'Napassorn', last: 'Phothip', email: 'napassorn.p@university.ac.th', phone: '081-567-5432', type: 'Student' },
  { code: 'STD-2024-029', first: 'Oraphan', last: 'Quesada', email: 'oraphan.q@university.ac.th', phone: '082-678-4321', type: 'Student' },
  { code: 'STD-2024-030', first: 'Pattaraphon', last: 'Rattanamongkol', email: 'pattaraphon.r@university.ac.th', phone: '083-789-3210', type: 'Student' },
  { code: 'STD-2024-031', first: 'Ratchanon', last: 'Saengmani', email: 'ratchanon.s@university.ac.th', phone: '084-890-2109', type: 'Student' },
  { code: 'STD-2024-032', first: 'Sirada', last: 'Thepsiri', email: 'sirada.t@university.ac.th', phone: '085-901-1098', type: 'Student' },
  { code: 'STD-2024-033', first: 'Thanaphat', last: 'Udomsap', email: 'thanaphat.u@university.ac.th', phone: '086-012-0987', type: 'Student' },
  { code: 'STD-2024-034', first: 'Ukrit', last: 'Vorasith', email: 'ukrit.v@university.ac.th', phone: '087-123-9870', type: 'Student' },
  { code: 'STD-2024-035', first: 'Varisa', last: 'Wattanaprasert', email: 'varisa.w@university.ac.th', phone: '088-234-8769', type: 'Student' },
  { code: 'STD-2024-036', first: 'Wachiravit', last: 'Yongcharoen', email: 'wachiravit.y@university.ac.th', phone: '089-345-7658', type: 'Student' },
  { code: 'STD-2024-037', first: 'Yada', last: 'Ziriphat', email: 'yada.z@university.ac.th', phone: '081-456-6547', type: 'Student' },
  { code: 'STD-2024-038', first: 'Alex', last: 'Turner', email: 'alex.t@university.ac.th', phone: '082-567-5436', type: 'Student' },
  { code: 'STD-2024-039', first: 'Emily', last: 'Chen', email: 'emily.c@university.ac.th', phone: '083-678-4325', type: 'Student' },
  { code: 'STD-2024-040', first: 'Lucas', last: 'Silva', email: 'lucas.s@university.ac.th', phone: '084-789-3214', type: 'Student' },
  { code: 'STD-2024-041', first: 'Kenji', last: 'Sato', email: 'kenji.s@university.ac.th', phone: '085-890-2103', type: 'Student' },
  { code: 'STD-2024-042', first: 'Sophia', last: 'Williams', email: 'sophia.w@university.ac.th', phone: '086-901-1092', type: 'Student' },
  { code: 'STD-2024-043', first: 'Liam', last: 'Johnson', email: 'liam.j@university.ac.th', phone: '087-012-0981', type: 'Student' },
  { code: 'STD-2024-044', first: 'Zainab', last: 'Al-Mansoor', email: 'zainab.a@university.ac.th', phone: '088-123-9874', type: 'Student' },
  { code: 'STD-2024-045', first: 'Pornpawee', last: 'Jirakul', email: 'pornpawee.j@university.ac.th', phone: '089-234-8763', type: 'Student' },

  // 12 Teachers / Professors
  { code: 'TCH-2024-001', first: 'Dr. Apinya', last: 'Charoensuk', email: 'apinya.c@university.ac.th', phone: '085-678-9012', type: 'Teacher' },
  { code: 'TCH-2024-002', first: 'Prof. Wichai', last: 'Kamolrat', email: 'wichai.k@university.ac.th', phone: '086-789-0123', type: 'Teacher' },
  { code: 'TCH-2024-003', first: 'Assoc. Prof. Kittipong', last: 'Boonserm', email: 'kittipong.b@university.ac.th', phone: '081-333-7711', type: 'Teacher' },
  { code: 'TCH-2024-004', first: 'Dr. Chutima', last: 'Pattana', email: 'chutima.p@university.ac.th', phone: '082-444-8822', type: 'Teacher' },
  { code: 'TCH-2024-005', first: 'Dr. Narin', last: 'Theeraphon', email: 'narin.t@university.ac.th', phone: '083-555-9933', type: 'Teacher' },
  { code: 'TCH-2024-006', first: 'Asst. Prof. Ratchanee', last: 'Viroj', email: 'ratchanee.v@university.ac.th', phone: '084-666-0044', type: 'Teacher' },
  { code: 'TCH-2024-007', first: 'Dr. Marcus', last: 'Vance', email: 'marcus.v@university.ac.th', phone: '085-777-1155', type: 'Teacher' },
  { code: 'TCH-2024-008', first: 'Prof. Somsak', last: 'Lertmongkol', email: 'somsak.l@university.ac.th', phone: '086-888-2266', type: 'Teacher' },
  { code: 'TCH-2024-009', first: 'Dr. Preecha', last: 'Sinchai', email: 'preecha.s@university.ac.th', phone: '087-999-3377', type: 'Teacher' },
  { code: 'TCH-2024-010', first: 'Dr. Wanida', last: 'Kosol', email: 'wanida.k@university.ac.th', phone: '088-000-4488', type: 'Teacher' },
  { code: 'TCH-2024-011', first: 'Assoc. Prof. David', last: 'Miller', email: 'david.m@university.ac.th', phone: '089-111-5599', type: 'Teacher' },
  { code: 'TCH-2024-012', first: 'Dr. Siriporn', last: 'Nirandorn', email: 'siriporn.n@university.ac.th', phone: '081-222-6600', type: 'Teacher' },

  // 10 Staff Members
  { code: 'STF-2024-001', first: 'Pranee', last: 'Boonmee', email: 'pranee.b@university.ac.th', phone: '087-890-1234', type: 'Staff' },
  { code: 'STF-2024-002', first: 'Sakchai', last: 'Intaraprasit', email: 'sakchai.i@university.ac.th', phone: '088-901-2345', type: 'Staff' },
  { code: 'STF-2024-003', first: 'Malee', last: 'Channarong', email: 'malee.c@university.ac.th', phone: '089-012-3456', type: 'Staff' },
  { code: 'STF-2024-004', first: 'Kamonwan', last: 'Rungrueang', email: 'kamonwan.r@university.ac.th', phone: '081-123-9988', type: 'Staff' },
  { code: 'STF-2024-005', first: 'Nattapol', last: 'Kosit', email: 'nattapol.k@university.ac.th', phone: '082-234-8877', type: 'Staff' },
  { code: 'STF-2024-006', first: 'Preeyanuch', last: 'Saengthong', email: 'preeyanuch.s@university.ac.th', phone: '083-345-7766', type: 'Staff' },
  { code: 'STF-2024-007', first: 'Surachai', last: 'Thepmanee', email: 'surachai.t@university.ac.th', phone: '084-456-6655', type: 'Staff' },
  { code: 'STF-2024-008', first: 'Benjamas', last: 'Phunsuk', email: 'benjamas.p@university.ac.th', phone: '085-567-5544', type: 'Staff' },
  { code: 'STF-2024-009', first: 'Charnvit', last: 'Anusorn', email: 'charnvit.a@university.ac.th', phone: '086-678-4433', type: 'Staff' },
  { code: 'STF-2024-010', first: 'Duangdao', last: 'Kaewkla', email: 'duangdao.k@university.ac.th', phone: '087-789-3322', type: 'Staff' }
];

async function seedDatabase() {
  console.log('🌱 Starting LibraX database seeding...');
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    console.log('🧹 Cleaning existing tables...');
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    await conn.query('TRUNCATE TABLE borrowing_items');
    await conn.query('TRUNCATE TABLE borrowings');
    await conn.query('TRUNCATE TABLE members');
    await conn.query('TRUNCATE TABLE books');
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    // Insert Books
    console.log(`📚 Inserting ${booksData.length} books...`);
    const bookSql = `
      INSERT INTO books (isbn, title, author, category, publisher, published_year, quantity, available_quantity, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const b of booksData) {
      await conn.query(bookSql, [
        b.isbn,
        b.title,
        b.author,
        b.category,
        b.publisher,
        b.published_year,
        b.quantity,
        b.available_quantity,
        b.description
      ]);
    }

    // Insert Members
    console.log(`👥 Inserting ${membersData.length} members...`);
    const memberSql = `
      INSERT INTO members (member_code, first_name, last_name, email, phone, member_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    for (const m of membersData) {
      await conn.query(memberSql, [
        m.code,
        m.first,
        m.last,
        m.email,
        m.phone,
        m.type
      ]);
    }

    // Insert Sample Borrowing records for initial dashboard & history testing
    console.log('🔄 Creating sample borrowing history...');
    
    // Borrowing 1: Active borrowed (Somchai - 2 books)
    const [b1] = await conn.query(
      `INSERT INTO borrowings (member_id, borrow_date, due_date, status, notes) VALUES (1, '2025-01-10', '2025-01-24', 'Borrowed', 'Course study reference')`
    );
    await conn.query(`INSERT INTO borrowing_items (borrowing_id, book_id, status) VALUES (?, 1, 'Borrowed')`, [b1.insertId]);
    await conn.query(`INSERT INTO borrowing_items (borrowing_id, book_id, status) VALUES (?, 2, 'Borrowed')`, [b1.insertId]);

    // Borrowing 2: Returned (Nattaporn - 1 book)
    const [b2] = await conn.query(
      `INSERT INTO borrowings (member_id, borrow_date, due_date, status, notes) VALUES (2, '2025-01-05', '2025-01-19', 'Returned', 'Returned in good condition')`
    );
    await conn.query(`INSERT INTO borrowing_items (borrowing_id, book_id, return_date, status) VALUES (?, 3, '2025-01-15', 'Returned')`, [b2.insertId]);

    // Borrowing 3: Overdue (Pitchaya - 1 book)
    const [b3] = await conn.query(
      `INSERT INTO borrowings (member_id, borrow_date, due_date, status, notes) VALUES (3, '2024-12-01', '2024-12-15', 'Overdue', 'Reminder email sent')`
    );
    await conn.query(`INSERT INTO borrowing_items (borrowing_id, book_id, status) VALUES (?, 6, 'Overdue')`, [b3.insertId]);

    // Borrowing 4: Active borrowed (Dr. Apinya - 1 book)
    const [b4] = await conn.query(
      `INSERT INTO borrowings (member_id, borrow_date, due_date, status, notes) VALUES (46, '2025-01-12', '2025-01-26', 'Borrowed', 'Research preparation')`
    );
    await conn.query(`INSERT INTO borrowing_items (borrowing_id, book_id, status) VALUES (?, 7, 'Borrowed')`, [b4.insertId]);

    // Borrowing 5: Returned (Prof. Wichai - 2 books)
    const [b5] = await conn.query(
      `INSERT INTO borrowings (member_id, borrow_date, due_date, status, notes) VALUES (47, '2024-12-10', '2024-12-24', 'Returned', 'Semester class teaching')`
    );
    await conn.query(`INSERT INTO borrowing_items (borrowing_id, book_id, return_date, status) VALUES (?, 8, '2024-12-20', 'Returned')`, [b5.insertId]);
    await conn.query(`INSERT INTO borrowing_items (borrowing_id, book_id, return_date, status) VALUES (?, 9, '2024-12-20', 'Returned')`, [b5.insertId]);

    await conn.commit();

    console.log('============================================');
    console.log('✅ Seeding completed successfully!');
    console.log(`   📚 Total Books:     ${booksData.length}`);
    console.log(`   👥 Total Members:   ${membersData.length}`);
    console.log(`   🔄 Total Borrowings: 5 (active, returned, overdue)`);
    console.log('============================================');
  } catch (error) {
    await conn.rollback();
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    conn.release();
    process.exit(0);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, booksData, membersData };
