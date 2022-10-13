#include <stdio.h>

//Global variables
int intGlob = 57;
char charArrGlob[3] = {'t', 'e', '\n'};

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

    //Pointer (duplicate)
    char* charArrDynamic2 = nullptr;
    charArrDynamic2 = charArrDynamic;

    //Static array (int) - without initializing
    int intStaticArr[5];
    for (int i = 0; i < sizeof(intStaticArr)/sizeof(int); i++)
        intStaticArr[i] = i*4;
    
    //Static array (int) - initialized to zeros
    int intStaticArr2[5] = {0};


    return 0;
}