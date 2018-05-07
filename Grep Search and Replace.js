//This script Finds strings in text box, based on a RegEx pattern, and replaced them with the provided string.

var occurences = 0;

//Import necessary support scripts, if not included already
if(typeof(isLayoutOpen) == "undefined")
{
	//import basic checks
	let basicChecksScript = app.getAppScriptsFolder() + "/Dependencies/basic_checks.js";
	app.evalScript("", basicChecksScript, 0);
	console.log("Loaded library for basic checks from Application.");
}

if(isLayoutOpen())
{
	//Get all Selected Boxes from the Layout
	let activeBoxes = getSelectedTextBoxes();
	if(activeBoxes != null)
	{
		let searchRegExp = getValidRegExp();		
		if(searchRegExp != null)
		{			
			let replacementString = getValidReplacementString();
			if(replacementString != null)
			{
				//Iterate through all active boxes
				for (let i = 0; i < activeBoxes.length; i++)
				{	
					//Get all the text runs from the box
					let boxTextSpans = activeBoxes[i].getElementsByTagName("qx-span");
					if (null != boxTextSpans)
					{
						//Iterate through all the Spans
						for (let j = 0; j < boxTextSpans.length; j++)
						{
							let spanChildren = boxTextSpans[j].childNodes;
							//Iterate through all the Child Nodes of the Span
							for (let k = 0; k < spanChildren.length; k++)
							{
								//Check if it is a text node
								if (spanChildren[k].nodeType === 3)
								{
									let originalText = spanChildren[k].nodeValue;								
									let replacedText = originalText.replace(searchRegExp, replacementString);
									if(replacedText != originalText)
									{
										spanChildren[k].nodeValue = replacedText;
										occurences += originalText.match(searchRegExp).length; //Get the number of matches to keep a count
										//console.log("Original Text: " + originalText + ", Replaced Text: " + replacedText);
									}					
								}
							}			
						}
					}
				}
				//Let the user know
				let strMsg="";
				if(occurences ==0)
				{
					strMsg = "No match found for provided RegExp!";				
				}
				else
				{
					strMsg = occurences + " match(es) replaced.";
				}
				console.log(strMsg);
				alert(strMsg);
			}
		}
	}
}

/*======================Functions used in the JavaScript=============================*/

//function to return all selected picture boxes
function getSelectedTextBoxes(){
	let activeBoxes= app.activeBoxesDOM();//gets the array of selected boxes
	let textBoxes=[];
	if(activeBoxes != null)// check if atleast one box is selected
	{
		for(let i=0; i<activeBoxes.length; i++)
		{
			if(activeBoxes[i].getAttribute('box-content-type') == "text")
			{
				textBoxes.push(activeBoxes[i]);
			}
		}
	}
	console.log("Selected Text Boxes: " + textBoxes.length);
	if(textBoxes.length == 0)
	{
		alert("Please select at least one text box to run the script");
		return null;//if no box is selected
	}
	else
	{
		return textBoxes;
	}
}

//function to take a valid input from user
function getValidRegExp(){
	let isInputValid = false;
	let inputErr = "Invalid Input. Please enter a valid JavaScript Regular Expression syntax.";
	while(!isInputValid)
	{
		let userRegExp = prompt("Please enter the Regular Expression for grep search, in the following format:\n/pattern/modifiers (e.g. to search all numbers, type: /\\b\\d+\\b/g\nRead more here: http://bit.ly/js_regex", "");
		if(userRegExp === null)
		{
			console.log("User Cancelled Input.");
			//isInputValid = 1;
			return null;
		}
		else
		{
			if(userRegExp != "")
			{
				userRegExp = userRegExp.trim();
				let inputs = userRegExp.split("\/"); //Split the Pattern and the Flags

				if(inputs.length == 3)
				{//User provided both Pattern and Flags
					regExpPattern = inputs[1];
					regExpFlags = inputs[2];
					isInputValid = true;
				}
				else if(inputs.length == 2)
				{//User provided ONLY Pattern and NO Flags
					regExpPattern = inputs[1];
					regExpFlags = ""; //Set Empty
					isInputValid = true;
				}
				else
				{//Incorrect RegEx Syntax
					console.log(inputErr);
					alert(inputErr);
					isInputValid = false;
				}

				//Only create RegEx if the Input is valid
				if(isInputValid)
				{
					console.log("RegExp Pattern: " + regExpPattern + ", RegExp Flags: " + regExpFlags);	
					return strToRegExp(regExpPattern, regExpFlags);
				}
			}
			else
			{
				console.log("Empty Input.");
				alert(inputErr);
				isInputValid = false;
			}
		}
	}
}

//Function to Convert a String to a JS RegExp object. Returns null if the RegEx is invalid
function strToRegExp(strRegExp, strFlags)
{
	let newRegExp;
	try {
        newRegExp = new RegExp(strRegExp, strFlags);
    } catch(e) {
        alert(e.toString());
        return null;
	}
	return newRegExp;
}

//function to take a valid input from user: Replacement String
function getValidReplacementString(){
	let isInputValid = false;
	let inputErr = "Invalid Input. Please enter a valid value.";
	while(!isInputValid)
	{
		let userRegExp = prompt("Please enter the Replacement String", "");
		if(userRegExp === null || userRegExp === undefined)
		{
			console.log("User Cancelled Input.");
			//isInputValid = 1;
			return null;
		}
		else
		{			
			return userRegExp;
		}
	}
}