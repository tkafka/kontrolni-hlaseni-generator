# Šablona

V `dphshv_2023_xxm.xml` doplň svoje údaje. `c_ufo="<dopln>" c_pracufo="<dople>"` - na tohle je asi nejjednodušší si vybrat úřad kterému hlásím v průvodci, a pak si formulář uložit a vykopírovat IDčka.

# Formulář

Přihlaš se do DIS+, tam dej načíst formulář ze souboru, a odešli. Schovej si potvrzení.

https://adisspr.mfcr.cz/pmd/dis/


# Repo

https://github.com/tkafka/kontrolni-hlaseni-generator

# GPT4 prompt:

```
I have a XML template with $DD (day), $MM (month), $YYYY (year) and $CZK_AMOUNT (amount) variables, named dphshv_2023_xxm.xml.
 
I need a node.js script, that would:
1. Ask user about these variables (providing current month as a default for $MM, year for $YYYY)
2. Make a copy of the input xml, replacing the xx in the file name with $MM, and replacing the $DD, $MM, $YYYY and $CZK_AMOUNT variables with user's input in the file content.
```

```gpt
Thank you. If you read the code, is there anything you would fix or improve or simplify?
```

```gpt
Awesome! Now I need to save the output file to ../${year}-${month}/dphshv_${year}_${month}.xml, creating the folder if it didn't exist (with mkdirp).
```

```gpt
You can use mkdirp directly instead of mkdirIfNotExists
```

```gpt
Cool, that's what I needed. Now please add warning if the written file already exists, and ask the user if she wants to overwrite it or not (y/n) - if not, then just exit.
```

```gpt
Thanks. Please make sure that you format the day and month as 01, 02, 03 ... even when user types in 1, 2, 3 ...
```

```gpt
Thanks! I read the mkdirp manual, and you should use 

const { mkdirp } = require('mkdirp');

and then just 

await mkdirp(output).

Also, you can drop the ; at the end of lines.
```

```gpt
Awesome! Could you give me a single detailed prompt that would make me the above program right away?
```

Response:
```gpt
Create a Node.js script that reads an XML template named 'dphshv_2023_xxm.xml' containing variables $DD, $MM, $YYYY, and $CZK_AMOUNT. Prompt the user to input values for these variables, providing the current month as a default for $MM, and the current year for $YYYY. After receiving the input, make a copy of the XML file, replacing the variables with the user's input, and save the modified file to a directory named '../{year}-{month}' as 'dphshv_{year}_{month}.xml'. Create the directory if it doesn't exist using the 'mkdirp' package. If the output file already exists, display a warning and ask the user whether they want to overwrite the file or not. Format the day and month inputs as two-digit strings, even if the user inputs single-digit values. Remove semicolons from the end of lines.
```

