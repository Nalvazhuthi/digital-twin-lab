# STING
my_message = 'Hello World'
print("Python" ,my_message)
print(my_message[10])
print(my_message[0:11])
# Methods
print(len(my_message))
print(my_message.lower())
print(my_message.upper())
print(my_message.capitalize())
print(my_message.count("o"))
print(my_message.find("d"))
replace_message = my_message.replace('o','--')
print(replace_message)

print("{} python".format(my_message))

print(dir(my_message))
# print(help(str))
# print(help(str.lower))

# Casting
a = "100"
b = "200"
print(int(a) + int(b))