#include <stdio.h>

//Structure declaration
struct myStruct
{
    int myNum = -1;
    myStruct* myChildStruct = nullptr;
};

//Global variables
int intGlob = 57;
char charArrGlob[3] = {'t', 'e', '\n'};

//Different scope / stackframe
void testFunction1(int intParameter, char* charPointerParameter)
{
    if (charPointerParameter != nullptr)
    {
        printf("%c", charPointerParameter[intParameter]);
    }

    return;
}

int main()
{
    //Local variable
    int intLocal = 10;
    for (int i = 0; i < 15; i++)
        intLocal += i;

    //Dynamic array (string)
    int tempCharDynamicCounter = 0;
    char* charArrDynamic = new char[128];
    for (int i = 0; i < 15; i++)
    {
        charArrDynamic[i] = 'a' + i;
        tempCharDynamicCounter++;
    }
    charArrDynamic[tempCharDynamicCounter] = '\0';

    testFunction1(5, charArrDynamic);

    //Pointer (duplicate)
    char* charArrDynamic2 = nullptr;
    charArrDynamic2 = charArrDynamic;

    //Static string
    char charArrStatic[] = "stat";

    //Static array (int) - without initializing
    int intStaticArr[5];
    for (int i = 0; i < sizeof(intStaticArr)/sizeof(int); i++)
        intStaticArr[i] = i*4;
    
    //Static array (int) - initialized to zeros
    int intStaticArr2[5] = {0};

    //Structures
    myStruct staticStruct1;
    staticStruct1.myNum = 17; 

    myStruct* myDynamicStruct1 = new myStruct();
    myDynamicStruct1->myNum = 67;

    myStruct staticStruct2;
    staticStruct2.myNum = 70; 
    staticStruct2.myChildStruct = myDynamicStruct1;




    return 0;
}
