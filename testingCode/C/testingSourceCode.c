#include <stdio.h>
#include <stdlib.h>

//Structure declaration
struct myStruct
{
    int myNum;
    struct myStruct* myChildStruct;
};

struct myComplexStruct 
{
    float myFloat;
    char myString[128];
    char* myStringPointer;
    struct myStruct myStruct1;
    struct myComplexStruct* myStruct2;
};

//Global variables
int intGlob = 57;
char charArrGlob[3] = {'t', 'e', '\n'};

//Different scope / stackframe
void testFunction1(int intParameter, char* charPointerParameter)
{
    if (charPointerParameter != NULL)
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
    char* charArrDynamic = (char*) malloc(sizeof(char)*100);
    for (int i = 0; i < 15; i++)
    {
        charArrDynamic[i] = 'a' + i;
        tempCharDynamicCounter++;
    }
    charArrDynamic[tempCharDynamicCounter] = '\0';

    testFunction1(5, charArrDynamic);

    //Pointer (duplicate)
    char* charArrDynamic2 = NULL;
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
    struct myStruct staticStruct1;
    staticStruct1.myNum = 17;

    struct myStruct* myDynamicStruct1 = (struct myStruct*) malloc(sizeof(struct myStruct));
    myDynamicStruct1->myNum = 67;

    struct myStruct staticStruct2;
    staticStruct2.myNum = 70;
    staticStruct2.myChildStruct = myDynamicStruct1;

    struct myComplexStruct staticComplexStruct;
    staticComplexStruct.myFloat = 70.6;
    staticComplexStruct.myStringPointer = charArrDynamic;
    staticComplexStruct.myStruct1.myNum = 5;
    staticComplexStruct.myStruct1.myChildStruct = myDynamicStruct1;
    staticComplexStruct.myStruct2 = (struct myComplexStruct*) malloc(sizeof(struct myComplexStruct));
    staticComplexStruct.myStruct2->myFloat = 17.4;
    staticComplexStruct.myStruct2->myStruct1.myNum = 78;
    staticComplexStruct.myStruct2->myStruct1.myChildStruct = myDynamicStruct1;
    staticComplexStruct.myStruct2->myStruct2 = (struct myComplexStruct*) malloc(sizeof(struct myComplexStruct));

    return 0;
}
