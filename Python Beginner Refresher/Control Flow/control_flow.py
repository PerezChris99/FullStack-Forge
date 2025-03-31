# Python Control Flow
# =================

# Conditional Statements
# ---------------------

# If-Else statements
def if_else_example():
    print("If-Else Example:")
    x = 10
    if x > 5:
        print(f"{x} is greater than 5")
    else:
        print(f"{x} is not greater than 5")

# If-Elif-Else statements
def if_elif_else_example():
    print("\nIf-Elif-Else Example:")
    score = 85
    
    if score >= 90:
        grade = "A"
    elif score >= 80:
        grade = "B"
    elif score >= 70:
        grade = "C"
    elif score >= 60:
        grade = "D"
    else:
        grade = "F"
    
    print(f"Score: {score}, Grade: {grade}")

# Ternary operator (conditional expression)
def ternary_example():
    print("\nTernary Operator Example:")
    age = 20
    status = "adult" if age >= 18 else "minor"
    print(f"Age: {age}, Status: {status}")

# Loops
# -----

# For loop with range
def for_loop_range():
    print("\nFor Loop with Range Example:")
    print("Counting from 1 to 5:")
    for i in range(1, 6):
        print(i, end=" ")
    print()

# For loop with list
def for_loop_list():
    print("\nFor Loop with List Example:")
    fruits = ["apple", "banana", "cherry", "date"]
    print("List of fruits:")
    for fruit in fruits:
        print(f"- {fruit}")

# While loop
def while_loop():
    print("\nWhile Loop Example:")
    count = 5
    print("Countdown:")
    while count > 0:
        print(count, end=" ")
        count -= 1
    print("\nBlastoff!")

# Loop control statements
# ----------------------

# Break statement
def break_example():
    print("\nBreak Statement Example:")
    print("Breaking out of loop when i == 3:")
    for i in range(1, 6):
        if i == 3:
            print("Breaking the loop")
            break
        print(i, end=" ")
    print()

# Continue statement
def continue_example():
    print("\nContinue Statement Example:")
    print("Skipping iteration when i == 3:")
    for i in range(1, 6):
        if i == 3:
            print("(skipping 3)", end=" ")
            continue
        print(i, end=" ")
    print()

# Nested loops
def nested_loops():
    print("\nNested Loops Example:")
    print("Multiplication table (1-3):")
    for i in range(1, 4):
        for j in range(1, 4):
            print(f"{i} x {j} = {i*j}")
        print("-" * 10)

# Execute all examples
if __name__ == "__main__":
    if_else_example()
    if_elif_else_example()
    ternary_example()
    for_loop_range()
    for_loop_list()
    while_loop()
    break_example()
    continue_example()
    nested_loops()