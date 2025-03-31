class Person:
    """
    A simple Person class to demonstrate OOP concepts in Python
    """
    
    def __init__(self, name, age, email=None):
        """Initialize a new Person instance with name, age and optional email"""
        self.name = name
        self.age = age
        self.email = email
    
    def greet(self):
        """Return a greeting from this person"""
        return f"Hello, my name is {self.name} and I'm {self.age} years old!"
    
    def have_birthday(self):
        """Increment the person's age by 1"""
        self.age += 1
        return f"{self.name} is now {self.age} years old."
    
    def __str__(self):
        """String representation of Person instance"""
        email_info = f", email: {self.email}" if self.email else ""
        return f"Person(name: {self.name}, age: {self.age}{email_info})"
    
    @classmethod
    def from_dict(cls, data):
        """Create a Person instance from a dictionary"""
        return cls(data['name'], data['age'], data.get('email'))


# Usage example
if __name__ == "__main__":
    # Create a new Person
    alice = Person("Alice", 28, "alice@example.com")
    print(alice.greet())
    
    # Create another Person without email
    bob = Person("Bob", 35)
    print(bob)
    
    # Have a birthday
    print(bob.have_birthday())
    print(bob)
    
    # Create from dictionary
    person_data = {"name": "Charlie", "age": 42, "email": "charlie@example.com"}
    charlie = Person.from_dict(person_data)
    print(charlie)
