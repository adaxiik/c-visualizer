class myStruct:
    def __init__(self):
        self.myNum = 0
        self.myChildStruct = None
        
class myComplexStruct:
    def __init__(self):
        self.myFloat = 0.0
        self.myString = ""
        self.myStringPointer = None
        self.myStruct1 = myStruct()
        self.myStruct2 = None


def testFunction1(intParameter, charPointerParameter):
    if charPointerParameter is not None:
        print(charPointerParameter[intParameter])

# Dynamic array (string)
tempCharDynamicCounter = 0
charArrDynamic = ""
for i in range(15):
    charArrDynamic += chr(ord('a') + i)
    tempCharDynamicCounter += 1
charArrDynamic += '\0'

testFunction1(5, charArrDynamic)

# Pointer (duplicate)
charArrDynamic2 = None
charArrDynamic2 = charArrDynamic

# Static string
charArrStatic = "stat"

# Static array (int) - without initializing
intStaticArr = [0] * 5
for i in range(len(intStaticArr)):
    intStaticArr[i] = i*4

# Static array (int) - initialized to zeros
intStaticArr2 = [0] * 5

# Structures
staticStruct1 = myStruct()
staticStruct1.myNum = 17

myDynamicStruct1 = myStruct()
myDynamicStruct1.myNum = 67

staticStruct2 = myStruct()
staticStruct2.myNum = 70
staticStruct2.myChildStruct = myDynamicStruct1

staticComplexStruct = myComplexStruct()
staticComplexStruct.myFloat = 70.6
staticComplexStruct.myStringPointer = charArrDynamic
staticComplexStruct.myStruct1.myNum = 5
staticComplexStruct.myStruct1.myChildStruct = myDynamicStruct1
staticComplexStruct.myStruct2 = myComplexStruct()
staticComplexStruct.myStruct2.myFloat = 17.4
staticComplexStruct.myStruct2.myStruct1.myNum = 78
staticComplexStruct.myStruct2.myStruct1.myChildStruct = myDynamicStruct1
staticComplexStruct.myStruct2.myStruct2 = myComplexStruct()
