/*!
*  filename: ej.calculate.js
*  version : 14.2.0.26
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./../common/ej.core"], fn) : fn();
})
(function () {
	
/**
* @fileOverview Calculate engine to perform the calculatin
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.3 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {
    

    this.__calcQuickextends = function (d, b) {
        for (var p = 0; p < b.length; p++) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        __.prototype = b.prototype;
        d.prototype = new __();
    };
    
	/**
    * @namespace ej
	* @classdesc Custom engine to perfom calculation like excel sheet
	* @class ejCalculate
	* @requires jQuery
	* @requires ej.core.js
	* @requires ej.calculate.js
	* @example 
    * &lt;script&gt;
	* // Create calcEngine with grid data
    * var calcObj = new CalcEngine($("#Grid").data("ejGrid"));
	* &lt;/script&gt;
	*/
    CalcEngine = function (parentObject) {
        this.parentObject = parentObject;
        this._useFormulaValues = false;
        this._multiTick = false;
        this._isErrorString = false;
        this._ignoreBracet = false;
        this._libraryFunctions = new HashTable();
        this._customlibraryFunctions = new HashTable();
        this._refreshedCells = new HashTable();
        this._treatStringsAsZero = true;
        this._supportLogicalOperators = false;
        this._isRangeOperand = false;
        this._uniqueStringMarker = String.fromCharCode(127);
        this._isParseArgumentSeparator = false;
        this._isParseDecimalSeparatorChanged = false;
        this._validPrecedingChars = " (+-*/^&<>=";
        this._validFunctionNameChars = "_";
        this.bMARKER = String.fromCharCode(146);
        this.bMARKER2 = this.bMARKER + this.bMARKER;
        this.tic = "\"";
        this._parseDecimalSeparator = '.';
        this.parseDateTimeSeparator = '/';
        this._parseArgumentSeparator = ',';
        this._rightBracket = String.fromCharCode(131);
        this._leftBracket = String.fromCharCode(130);
        this.iFMarker = "qIF" + String.fromCharCode(130);
        this.braceLeft = "{";
        this.braceRight = "}";
        this._braceRightNLeft = ")(";
        this.computedValueLevel = 0;
        this._circCheckList = [];
        this._maximumRecursiveCalls = 100;
        this._sortedSheetNames = null;
        this.trueValueStr = "TRUE";
        this.falseValueStr = "FALSE";
        this.useDatesInCalcs = false;
        this.sheetToken = '!';
        this.namedRanges = null;
        this.undefinednamedRange = null;
        this.undefinedsheetNamedRnages = null;
        this.namerangecellcollection = null;
        this.sheetNamedRangesOriginalNames = null;
        this.sheetNamedRangeCellCollection = null;
        this.sheetDependentNamedRangeCells = null;
        this.namedRangesOriginalNames = null;
        this.namedRangeValues = null;
        this.rangeValues = null;
        this.dependentNamedRangeCells = null;
        this.namedRangesSized = null;
        this._namedRangesNonScoped = null;
        this.char_add = '+';
        this.char_and = 'i';
        this.char_ANDop = String.fromCharCode(140);
        this.char_divide = '/';
        this.char_ELSEop = String.fromCharCode(144);
        this.char_EM = 'r';
        this.char_EP = 'x';
        this.char_equal = '=';
        this.char_greater = '>';
        this.char_greatereq = 'h';
        this.char_IFop = String.fromCharCode(142);
        this.char_less = '<';
        this.char_lesseq = 'f';
        this.char_multiply = '*';
        this.char_noequal = 'p';
        this.char_NOTop = String.fromCharCode(145);
        this.char_or = 'w';
        this.char_ORop = String.fromCharCode(139);
        this.char_subtract = '-';
        this.char_THENop = String.fromCharCode(143);
        this.char_XORop = String.fromCharCode(141);
        this.chartic = "'"[0];
        this._string_and = "&";
        this._string_E = "E";
        this._string_EM = "E-";
        this._string_empty = "";
        this._string_EP = "E+";
        this._string_fixedreference = "$";
        this._string_greatereq = ">=";
        this._string_lesseq = "<=";
        this._string_noequal = "<>";
        this._string_or = "^";
        this.token_add = 'a';
        this.token_and = 'c';
        this.token_ANDop = String.fromCharCode(133);
        this.token_divide = 'd';
        this.token_ELSEop = String.fromCharCode(137);
        this.token_EM = 'v';
        this.token_EP = 't';
        this.token_equal = 'e';
        this.token_greater = 'g';
        this.token_greatereq = 'j';
        this.token_IFop = String.fromCharCode(135);
        this.token_less = 'l';
        this.token_lesseq = 'k';
        this.token_multiply = 'm';
        this.token_noequal = 'o';
        this.token_NOTop = String.fromCharCode(138);
        this.token_or = String.fromCharCode(126);
        this.token_ORop = String.fromCharCode(132);
        this.token_subtract = 's';
        this.token_THENop = String.fromCharCode(136);
        this.token_XORop = String.fromCharCode(134);
        this.tokens = [
            this.token_add, this.token_subtract, this.token_multiply, this.token_divide, this.token_less,
            this.token_greater, this.token_equal, this.token_lesseq, this.token_greatereq, this.token_noequal, this.token_and, this.token_or];
        this._dateTime1900 = new Date(1900, 0, 1, 0, 0, 0);
        this._preserveLeadingZeros = false;
        this._ignoreCellValue = false;
        this._errorStrings = null;
        this._cell = "";
        this._iterationMaxCount = 0;
        this._supportRangeOperands = false;
        this._allowShortCircuitIFs = false;
        this._processUpperCaseFormula = "";
        this._processUpperCaseIvalue = 0;
        this._processUpperCaseSheet = "";
        this._markerChar = '`';
        this._rowMaxCount = -1;
        this._columnMaxCount = -1;
        this._isInteriorFunction = false;
        this._tempSheetPlaceHolder = String.fromCharCode(133);
        this.sheetFamilyID = 0;
        this._supportsSheetRanges = true;
        this._markers = "()+-*/=><.,!";
        this._formulaInfoTable = null;
        this._dependentFormulaCells = null;
        this._dependentCells = new HashTable();
        this._calculatingSuspended = false;
        this._inAPull = false;
        this._useDatesInCalcs = false;
        this._excelLikeComputations = false;
        this._rethrowLibraryComputationExceptions = false;
        this.formulaErrorStrings = [
            "binary operators cannot start an expression",
            "cannot parse",
            "bad library",
            "invalid char in front of",
            "number contains 2 decimal points",
            "expression cannot end with an operator",
            "invalid characters following an operator",
            "invalid character in number",
            "mismatched parentheses",
            "unknown formula name",
            "requires a single argument",
            "requires 3 arguments",
            "invalid Math argument",
            "requires 2 arguments",
            "#NAME?",
            "too complex",
            "circular reference: ",
            "missing formula",
            "improper formula",
            "invalid expression",
            "cell empty",
            "bad formula",
            "empty expression",
            "",
            "mismatched string quotes",
            "wrong number of arguments",
            "invalid arguments",
            "iterations do not converge",
            "Control named '{0}' is already registered",
            "Calculation overflow",
            "Missing sheet"
        ];
        this._parseDateTimeSeparator = '/';
        this._millisecondsOfaDay = 24 * 60 * 60 * 1000;
        this.treat1900AsLeapYear = false;
        this._oaDate = new Date(1899, 11, 30);
        this._saveStringsText = "";
        this._processedCells = [];
        this.ignoreValueChanged = false;
        this._breakedFormulaCells = [];
        this._tempBreakedFormulaCells = [];
        this._lockDependencies = false;
        this._useDependencies = false;
        this._inHandleIterations = false;
        this._inRecalculateRange = false;
        this._useNoAmpersandQuotes = false;
        this._calcID = 0;
        this._operators_cannot_start_an_expression = 0;
        this._reservedWord_AND = 1;
        this._reservedWord_XOR = 2;
        this._reservedWord_IF = 3;
        this._number_contains_2_decimal_points = 4;
        this._reservedWord_ELSE = 5;
        this._reservedWord_NOT = 6;
        this._invalid_char_in_number = 7;
        this._invalid_characters_following_an_operator = 6;
        this._mismatched_parentheses = 8;
        this._unknown_formula_name = 9;
        this._requires_a_single_argument = 10;
        this._requires_3_args = 11;
        this._invalid_Math_argument = 12;
        this._requires_2_args = 13;
        this._bad_index = 14;
        this._too_complex = 15;
        this._circular_reference_ = 16;
        this._missing_formula = 17;
        this._improper_formula = 18;
        this._invalid_expression = 19;
        this._cell_empty = 20;
        this._bad_formula = 21;
        this._empty_expression = 22;
        this._virtual_mode_required = 23;
        this._mismatched_tics = 24;
        this._wrong_number_arguments = 25;
        this._invalid_arguments = 26;
        this._iterations_dont_converge = 27;
        this._calculation_overflow = 29;
        this._already_registered = 28;
        this._missing_sheet = 30;
        this._alwaysComputeDuringRefresh = true;
        this._libraryComputationException = null;
        this._dependencyLevel = 0;
        this._isDisposed = undefined;
        this._forceRefreshCall = false;
        this.grid = this.parentObject;
        this._enableLookupTableCaching = 0 /* None */;
        this._lookupTables = new HashTable();
        this._isIE8 = (ej.browserInfo().name == 'msie' && ej.browserInfo().version == '8.0') ? true : false;

		/**
         * 
		 * @private
         */	 
        this._addFunction = function (name, func) {
            name = name.toUpperCase();
            if (this._libraryFunctions.getItem(name) == undefined) {
                this._libraryFunctions.add(name, func);
                return true;
            }
            return false;
        };
        /**
         * 
		 * @private
         */
		 this._addToFormulaDependentCells = function (s) {
            var cell1 = this.cell;
            var family = CalcEngine.getSheetFamilyItem(this.grid);
            if (family.sheetNameToParentObject != null && cell1.indexOf(this.sheetToken) == -1) {
                var token = family.parentObjectToToken.getItem(this.grid);
                cell1 = token + cell1;
            }

            if (!this.getDependentFormulaCells().containsKey(cell1)) {
                this.getDependentFormulaCells().add(cell1, new HashTable());
                this.getDependentFormulaCells().getItem(cell1).add(s, s);
            } else if (!(this.getDependentFormulaCells().getItem(cell1)).containsKey(s)) {
                this.getDependentFormulaCells().getItem(cell1).add(s, s);
            }
        };
        /**
         * 
		 * @private
         */
		 this._arrayRemove = function (array, value) {
            var index = null;

            while ((index = array.indexOf(value)) !== -1)
                array.splice(index, 1);

            return array;
        };
        /**
         * 
		 * @private
         */
		 this._canGetRowIndex = function (s) {
            var i = 0;
            if (i < s.length && s[i] == this.sheetToken) {
                i++;
                while (i < s.length && s[i] != this.sheetToken) {
                    i++;
                }
                i++;
            }

            while (i < s.length && this._isLetter(s[i])) {
                i++;
            }

            if (i < s.length) {
                if (this._isDigit(s[i]))
                    return true;
                else
                    return false;
            }
            return false;
        };
        /**
         * 
		 * @private
         */
		 this._checkAddNonScopedNamedRange = function (key) {
            var loc = -1;
            if ((loc = key.indexOf('!')) > -1) {
                var key1 = key.substring(loc + 1);
                if (!this._namedRangesNonScoped.containsKey(key1)) {
                    this._namedRangesNonScoped.add(key1, this.namedRanges.getItem(key));
                }
            }
        };
        /**
         * 
		 * @private
         */
		 this._checkHasCharBeforeNumber = function (tempFormula) {
            var check = false;
            for (var x = tempFormula.length - 1; x > 0; x--) {
                if (this._isLetter(tempFormula[x])) {
                    check = true;
                    break;
                }
            }
            return check;
        };
        /**
         * 
		 * @private
         */
		this._checkIfScopedRange = function (text, scopedRange) {
            scopedRange = "";
            var b = "NaN";
            var id = this.getSheetID(this.grid);
            var sheet = CalcEngine.getSheetFamilyItem(this.grid);

            if (text[0] == this.sheetToken.toString()) {
                var i = text.indexOf(this.sheetToken, 1);
                if (i > 1 && !isNaN(parseInt(text.substring(1, i - 1)))) {
                    //id reset to proper value
                    text = text.substring(i + 1);
                }
            }

            var token = '!' + id.toString() + '!';

            if (sheet.sheetNameToToken == null)
                return b;
            var sheetNameKeys = sheet.sheetNameToToken.keys();
            for (var name = 0; name < sheetNameKeys.length; name++) {
                if (sheet.sheetNameToToken.getItem(sheetNameKeys[name]).toString() == token) {
                    var s = (sheetNameKeys[name] + '!' + text).toUpperCase();
                    if (this.getNamedRanges().containsKey(s)) {
                        scopedRange = (this.getNamedRanges().getItem(s)).toUpperCase();
                        b = scopedRange;
                    }
                }
            }
            return b;
        };
        /**
         * 
		 * @private
         */
		this._checkUnderTolerance = function (d, oldValue) {
            if (Math.abs(oldValue) > this._absoluteZero) {
                return Math.abs((d - oldValue) / oldValue) < this._iterationMaxTolerance;
            } else {
                return Math.abs(d - oldValue) < this._iterationMaxTolerance;
            }
        };
        /**
         * 
		 * @private
        */
		this._combineStack = function (formula, i, _tempStack) {
            var combineString = "";
            if (_tempStack.length == 2) {
                var j = 3;
                var checkString = formula.substring(i);
                while (j > 1) {
                    var popStringValue = _tempStack.pop().toString();
                    combineString = (popStringValue == (this.tic + this.tic)) ? combineString + this.tic : popStringValue + combineString;
                    checkString = (j == 3) ? popStringValue : checkString;
                    j--;
                }
                if (_tempStack[0] == (this.tic + this.tic))
                    _tempStack.pop();
                combineString = (formula.length == i && this._isTextEmpty(checkString.split(this.tic).join(""))) ? combineString + checkString : combineString;

                _tempStack.push(combineString);
            }
            return _tempStack;
        };
        /**
         * 
		 * @private
        */
		this._computeMath = function (args, func) {
            var ans = 0;
            var s1;
            var isDegree = false;

            ////Only work with first arg.
            if (args.length > 0) {
                args = this.splitArgsPreservingQuotedCommas(args)[0];
            }
            var indexArray = [this.getParseArgumentSeparator(), ':'];

            ////parsed formula
            if (args.length > 0 && ((!this._isLetter(args[0]) && args[0] != this.sheetToken && args[0] != this.bMARKER) || (args[0] == 'u' && this._isDigit(args[1]))) && this._indexOfAny(args, indexArray) == -1) {
                ////Swap out unary minus.
                args = (args.split('u').join('-')).split("n").join("");

                var d1 = this._parseDouble(args);

                if (!isNaN(d1)) {
                    ans = func(d1);
                } else {
                    return this.getErrorStrings()[1].toString();
                }
            } else if (args.length > 0 && (args[0] == this.bMARKER || args[0] == 'u' || args[0] == 'n' || this._indexOfAny(args, this.tokens) > -1)) {
                ////parsed formula
                args = args.split('{').join('(');
                args = args.split('}').join(')');
                var rightparam = "";
                var decimalPI = (Math.PI).toString();
                try  {
                    if (args.indexOf(decimalPI) > -1) {
                        s1 = this._substring(args, 1, args.indexOf(decimalPI) - 2);
                        s1 = (this._isTextEmpty(s1)) ? "1" : s1;
                        rightparam = (this._indexOfAny(args, this.tokens) > -1) ? args.split(decimalPI.toString())[1] : "1";
                        isDegree = true;
                    } else
                        s1 = this.computedValue(args);
                } catch (ex) {
                    if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                        throw this.getLibraryComputationException();
                    }

                    return ex;
                }
                if (isDegree) {
                    var leftparam = this.computedValue(s1.toString());
                    if (rightparam.indexOf("180") > -1) {
                        d1 = this._parseDouble(leftparam);
                        if (d1)
                            ans = func(d1 * (Math.PI / 180));
                        else {
                            return this.getErrorStrings()[1].toString();
                        }
                    } else {
                        var temp, d2;
                        temp = this.computedValue(leftparam + rightparam);
                        d2 = this._parseDouble(temp);
                        if (!isNaN(d2))
                            ans = func(d2 * (Math.PI));
                        else {
                            return this.getErrorStrings()[1].toString();
                        }
                    }
                } else {
                    d1 = this._parseDouble(s1);
                    if (!isNaN(d1))
                        ans = func(d1);
                    else {
                        return this.getErrorStrings()[1].toString();
                    }
                }
            } else {
                ////Swap out unary minus.
                args = args.split('u').join('-');
                var cells = this.getCellsFromArgs(args);
                for (var s = 0; s < cells.length; s++) {
                    try  {
                        s1 = this.getValueFromArg(cells[s]);
                    } catch (ex) {
                        if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                            throw this.getLibraryComputationException();
                        }

                        return ex;
                    }

                    if (s1.length > 0) {
                        d1 = this._parseDouble(s1);
                        if (!isNaN(d1)) {
                            ans = func(d1);
                        } else
                            return this.getErrorStrings()[1].toString();
                    }

                    break;
                }
            }
            if (this.computeIsErr(ans.toString()) == this.trueValueStr) {
                return this.getErrorStrings()[4].toString();
            }
            return ans.toString();
        };
        /**
         * 
		 * @private
        */
		this._computeInteriorFunctions = function (formula) {
            try  {
                if (this._isTextEmpty(formula)) {
                    return formula;
                }

                this.computeFunctionLevel++;

                ////int q = formula.LastIndexOf('q');
                var q = this._findLastqNotInBrackets(formula);
                while (q > 0) {
                    var last = formula.substring(q).indexOf(this._rightBracket);
                    if (last == -1) {
                        throw this.formulaErrorStrings[this._bad_formula];
                    }
                    this._isInteriorFunction = true;
                    var s = this._substring(formula, q, last + 1);
                    s = this.computedValue(s);
                    if (!(s == "") && s[0] == this.tic[0] && s[s.length - 1] == this.tic[0]) {
                        var newS = this._substring(s, 1, s.length - 2);
                        if (newS.indexOf(this.tic) != -1) {
                            this._multiTick = true;
                            newS = newS.split(this.tic).join("|");
                        }
                        s = this.tic + newS + this.tic;
                    }
                    s = this._markupResultToIncludeInFormula(s);
                    if (!this._isInteriorFunction)
                        formula = formula.substring(0, q) + s.split(this.tic).join("") + formula.substring(q + last + 1);
                    else
                        formula = formula.substring(0, q) + s + formula.substring(q + last + 1);
                    this._isInteriorFunction = false;
                    q = this._findLastqNotInBrackets(formula);
                }
            } catch (ex) {
                return ex;
            } finally {
                this.computeFunctionLevel--;
            }

            return formula;
        };
        /**
         * 
		 * @private
        */
		this._findAndCheckPrecedingChar = function (copy, op, loc) {
            var loc1 = copy.indexOf(op, loc);
            if (loc1 > 0) {
                while (loc1 > -1 && this.getValidPrecedingChars().indexOf(copy[loc1 - 1]) == -1) {
                    loc1 = copy.indexOf(op, loc1 + 1);
                }
            }
            this._findAndCheckPrecedingCharCopy = copy;
            return loc1;
        };
        /**
         * 
		 * @private
        */
		this._findLastNonQB = function (text) {
            var ret = -1;
            if (text.indexOf(this.bMARKER) > -1) {
                var bracketLevel = 0;
                for (var i = text.length - 1; i >= 0; --i) {
                    if (text[i] == this._rightBracket) {
                        bracketLevel--;
                    } else if (text[i] == this._leftBracket) {
                        bracketLevel++;
                    } else if (text[i] == this.bMARKER && bracketLevel == 0) {
                        ret = i;
                        break;
                    }
                }
            }

            return ret;
        };
        /**
         * 
		 * @private
        */
		this._findLastqNotInBrackets = function (s) {
            var found = -1;
            var lastBracket = false;
            var i = s.length - 1;
            while (i > -1) {
                if (s[i] == 'q' && lastBracket) {
                    found = i;
                    break;
                }

                if (s[i] == this._leftBracket) {
                    lastBracket = true;
                } else if (s[i] == this._rightBracket) {
                    lastBracket = false;
                }

                i--;
            }

            return found;
        };
        /**
         * 
		 * @private
        */
		this._findNextSeparator = function (formula, location) {
            var qCount = 0;
            var found = false;
            while (!found && location < formula.length) {
                if (formula[location] == 'q') {
                    qCount++;
                } else if (formula[location] == this._rightBracket) {
                    qCount--;
                } else if (qCount == 0 && formula[location] == this.getParseArgumentSeparator()) {
                    found = true;
                    location--;
                }

                location++;
            }
		    return location.toString();
		};
        /**
         * 
		 * @private
        */
		this._findNextEndIndex = function (formula, location) {
		    var count = 0;
		    var loc = location;
		    var found = false;
		    while (!found && location < formula.Length) {
		        if (formula[location] == '[') {
		            count++;
		        }
		        else if (formula[location] == ']') {
		            count--;
		            if (count == 0) {
		                found = true;
		            }
		        }
		        location++;
		    }
		    location = location - loc;
		    return location;
		};

        /**
         * 
		 * @private
        */
		this._findNonQB = function (text) {
            var ret = -1;
            if (text.indexOf(this.bMARKER) > -1) {
                var bracketLevel = 0;
                for (var i = 0; i < text.length; ++i) {
                    if (text[i] == this._rightBracket) {
                        bracketLevel--;
                    } else if (text[i] == this._leftBracket) {
                        bracketLevel++;
                    } else if (text[i] == this.bMARKER && bracketLevel == 0) {
                        ret = i;
                        break;
                    }
                }
            }

            return ret;
        };
        /**
         * 
		 * @private
        */
		this._findRightBracket = function (formula, location) {
            var qCount = 0;
            var found = false;
            while (!found && location < formula.length) {
                if (formula[location] == 'q') {
                    qCount++;
                } else if (qCount == 0 && formula[location] == this._rightBracket) {
                    found = true;
                    location--;
                } else if (formula[location] == this._rightBracket) {
                    qCount--;
                }

                location++;
            }

            if (found)
                return location.toString();
            else
                return "NaN";
        };
        /**
         * 
		 * @private
        */
		this._fromOADate = function (doubleNumber) {
            var result = new Date();
            result.setTime((doubleNumber * this._millisecondsOfaDay) + Date.parse(this._oaDate));
            return result;
        };
        /**
         * 
		 * @private
        */
		this._getDateFromSerialDate = function (days) {
            if (this.treat1900AsLeapYear && days > 59) {
                days -= 1;
            }

            return new Date(this._oaDate.setDate(this._oaDate.getDate() + days));
		};


        /**
        * 
        * @private
       */
		var _weekEndType = ["", "6,0", "0,1", "1,2", "2,3", "3,4", "4,5", "5,6", "", "", "", "0", "1", "2", "3", "4", "5", "6"];

        /**
         * 
		 * @private
        */
		this._getDoubleArray = function (range) {
            var d;
            var s1 = "";
            var x = [];

            range = this.adjustRangeArg(range);
            var ranges = this.splitArgsPreservingQuotedCommas(range);
            for (var r = 0; r < ranges.length; r++) {
                ////cell range
                if (ranges[r].indexOf(':') > -1) {
                    var cells = this.getCellsFromArgs(ranges[r]);
                    for (var s = 0; s < cells.length; s++) {
                        s1 = this.getValueFromArg(cells[s]);

                        if (s1.length > 0) {
                            d = this._parseDouble(s1);
                            if (!isNaN(d)) {
                                x.push(Number(d));
                            } else {
                                x.push(0.0);
                            }
                        }
                    }
                } else {
                    s1 = this.getValueFromArg(ranges[r]);
                    d = this._parseDouble(s1);
                    if (!isNaN(Number(d))) {
                        x.push(d);
                    } else {
                        x.push(0.0);
                    }
                }
            }
            return x;
        };
        /**
         * 
		 * @private
        */
		this._getDoubleArrayA = function (range) {
            var d;
            var s1 = "";
            var x = [];

            range = this.adjustRangeArg(range);
            var ranges = this.splitArgsPreservingQuotedCommas(range);
            for (var r = 0; r < ranges.length; r++) {
                ////cell range
                if (ranges[r].indexOf(':') > -1) {
                    var cells = this.getCellsFromArgs(ranges[r]);
                    for (var s = 0; s < cells.length; s++) {
                        s1 = this.getValueFromArg(cells[s]);

                        if (s1.length > 0) {
                            if (s1 == this.trueValueStr || s1== this.falseValueStr) {
                                d = 0.0;
                            } else {
                                d = this._parseDouble(s1);
                                if (isNaN(Number(d))) {
                                    d == 0.0;
                                }
                            }
                            x.push(d);
                        }
                    }
                } else {
                    s1 = this.getValueFromArg(ranges[r]);
                    if (s1 == this.trueValueStr || s1 == this.falseValueStr) {
                        d = 0.0;
                    } else {
                        d = this._parseDouble(s1.toString());
                        if (isNaN(d)) {
                            d == 0.0;
                        }
                    }
                    x.push(d);
                }
            }
            return x;
        };
        /**
         * 
		 * @private
        */
		this._getFormulaArrayBounds = function (currentCell, arrayHeight, arrayWidth) {
            var currentColIndex = this.colIndex(this.cell);
            var currentRowIndex = this.rowIndex(this.cell);

            var formulaText = "";
            var formula = this.getFormulaInfoTable().containsKey(this.cell) ? this.getFormulaInfoTable().getItem(this.cell) : null;
            if (formula != null)
                formulaText = formula.getFormulaText();
            else if (this.parentObject.getValueRowCol == undefined)
                formulaText = this.getValueRowCol(this.getSheetID(this.grid) + 1, currentRowIndex, currentColIndex).toString();
            else
                formulaText = this.parentObject.getValueRowCol(this.getSheetID(this.grid)+1, currentRowIndex, currentColIndex).toString();
            var startRowIndex = 1, startColIndex = 1;
            for (var x = 1; x <= arrayHeight; x++) {
                if ((currentColIndex - x) > 0) {
                    var tempCell = this._getSheetTokenFromReference(this.cell) + RangeInfo.getAlphaLabel(currentColIndex - x) + currentRowIndex.toString();
                    var tempFormulaText = "";
                    var formula1 = this.getFormulaInfoTable().containsKey(tempCell) ? this.getFormulaInfoTable().getItem(tempCell) : null;
                    if (formula1 != null)
                        tempFormulaText = formula1.getFormulaText();
                    else if (this.parentObject.getValueRowCol == undefined)
                        tempFormulaText = this.getValueRowCol(this.getSheetID(this.grid) + 1, currentRowIndex, currentColIndex - x).toString();
                    else
                        tempFormulaText = this.parentObject.getValueRowCol(this.getSheetID(this.grid) + 1, currentRowIndex, currentColIndex - x).toString();
                    startColIndex = currentColIndex - x;
                    if (formulaText != null && tempFormulaText != formulaText) {
                        startColIndex++;
                        break;
                    }
                }
            }
            for (var y = 1; y <= arrayWidth; y++) {
                if ((currentRowIndex - y) > 0) {
                    var tempCell = this._getSheetTokenFromReference(this.cell) + RangeInfo.getAlphaLabel(startColIndex) + (currentRowIndex - y).toString();
                    var tempFormulaText = "";
                    var formula1 = this.getFormulaInfoTable().containsKey(tempCell) ? this.getFormulaInfoTable().getItem(tempCell) : null;
                    if (formula1 != null)
                        tempFormulaText = formula1.getFormulaText();
                    else if (this.parentObject.getValueRowCol == undefined)
                        tempFormulaText = this.getValueRowCol(this.getSheetID(this.grid) + 1, currentRowIndex - y, startColIndex).toString();
                    else
                        tempFormulaText = this.parentObject.getValueRowCol(this.getSheetID(this.grid) + 1, currentRowIndex - y, startColIndex).toString();
                    startRowIndex = currentRowIndex - y;
                    if (formulaText != null && tempFormulaText != formulaText) {
                        startRowIndex++;
                        break;
                    }
                }
            }

            this._getFormulaArrayBoundsfirstRowIndex = startRowIndex;
            this._getFormulaArrayBoundsfirstColIndex = startColIndex;
            this._getFormulaArrayBoundslastRowIndex = startRowIndex + arrayHeight;
            this._getFormulaArrayBoundslastColIndex = startColIndex + arrayWidth;
            return true;
        };
        /**
         * 
		 * @private
        */
		this._getSerialDateFromDate = function (y, m, d) {
            var days = 0;
            if (y < 1900) {
                y += 1900;
            }

           
            var isValidMonth = false;
            while (!isValidMonth) {
                while (m > 12) {
                    y++;
                    m -= 12;
                }
                isValidMonth = true;
                var x = new Date(y, m, 1, -1).getDate();
                while (d > x) {
                    x = new Date(y, m, 1, -1).getDate();
                    m++;
                    d -= x;
                    isValidMonth = false;
                }
                if (d < 1) {
                    m--;
                    x = new Date(y, m, 1, -1).getDate();
                    d = x - d;
                }
            }
            var dateTime = Date.parse(y.toString() + this.getParseDateTimeSeparator() + m.toString() + this.getParseDateTimeSeparator() + d.toString());
            if (!isNaN(dateTime)) {
                days = this._toOADate(new Date(dateTime));
            }
            if (this.treat1900AsLeapYear && days > 59) {
                days += 1;
            }
            return days;
        };
        /**
         * 
		 * @private
        */
		this._getSerialDateTimeFromDate = function (dt) {
            var d = this._toOADate(dt);

            if (this.treat1900AsLeapYear && d > 59) {
                d += 1;
            }

            return d;
        };
        /**
         * 
		 * @private
        */
		this._getSheetTokenFromReference = function (r) {
            var sheet = "";
            if (r.length > 2 && r[0] == this.sheetToken) {
                var i = 1;
                sheet = this.sheetToken;
                while (i < r.length && r[i] != this.sheetToken) {
                    sheet += r[i];
                    i++;
                }

                sheet += this.sheetToken;
            }

            return sheet;
        };
        /**
         * 
		 * @private
        */
		this._getValueComputeFormulaIfNecessary = function (row, col, grd) {
            var alreadyComputed = false;

            var formula = this.getFormulaInfoTable().getItem(this.cell);
            var o;
            if (this.parentObject.getValueRowCol == undefined)
                o = this.getValueRowCol(this.getSheetID(grd) + 1, row, col);
            else
                o = this.parentObject.getValueRowCol(this.getSheetID(grd) + 1, row, col);

            var val = (o != null && !(o.Length === 0)) ? o.toString() : "";

            if (val[val.length - 1] == ("}") && val[0] == ("{")) {
                val = this._substring(val, 1, val.length - 2);
            }

            if ((val == "" && (formula == null || formula == undefined)) || (val != "" && val[0] != this.getFormulaCharacter() && val[val.length - 1] != "%")) {
                if (formula != null && val == formula.getFormulaValue())
                    return formula.getFormulaValue();
                else
                    return val;
            }

            if (val.length > 0 && val[0] == this.getFormulaCharacter()) {
                if (formula != null) {
                    ////will be set later..
                    //// val = formula.FormulaValue;
                    ////val = ComputeFormula(formula.ParsedFormula);
                } else {
                    formula = new FormulaInfo();
                    formula.setFormulaText(o.toString());

                    if (!this.getDependentFormulaCells().containsKey(this.cell)) {
                        this.getDependentFormulaCells().add(this.cell, new HashTable());
                    }

                    var compute = true;
                    try  {
                        formula.setParsedFormula(this.parseFormula(val));
                    } catch (ex) {
                        if (this._inAPull) {
                            val = ex;
                            formula = null;
                        } else {
                            formula.setFormulaValue(ex);
                        }
                        compute = false;
                    }

                    if (compute) {
                        formula.setFormulaValue(this.computeFormula(formula.getParsedFormula()));
                        alreadyComputed = true;
                    }
                    if (formula != null) {
                        formula.calcID = this._calcID;
                        if (!this.getFormulaInfoTable().containsKey(this.cell))
                            this.getFormulaInfoTable().add(this.cell, formula);
                        val = formula.getFormulaValue() != null ? formula.getFormulaValue() : "";
                    }
                }
            }

            if (formula != null) {
                if (this.getUseFormulaValues() || this.getCalculatingSuspended() && (!this._inAPull || alreadyComputed)) {
                    val = formula.getFormulaValue() != null ? formula.getFormulaValue() : "";
                } else if (!alreadyComputed) {
                    if (this._calcID == formula.calcID) {
                        val = formula.getFormulaValue();
                    } else {
                        val = this.computeFormula(formula.getParsedFormula());
                        formula.setFormulaValue(val);
                        formula.calcID = this._calcID;
                    }
                }
                if (this.getTreatStringsAsZero() && val == "") {
                    return "0";
                }
            }

            if (val == "" || val == undefined) {
                val = "";
            }

            var d = this._parseDouble(val.substring(0, val.length - 1));

            if (val[val.length - 1] == ("%") && !isNaN(d)) {
                val = (Number(d) / 100).toString();
            }
            return val;
        };
        /**
         * 
		 * @private
        */
		this._handleEmbeddedEs = function (text) {
            var j = 0;
            while (j > -1 && ((j = text.indexOf(this._string_EP, j)) > -1)) {
                if (this._notInBlock(text, j)) {
                    var left = j;
                    while (left > 0 && (this._isDigit(text[left - 1]) || text[left - 1] == this.getParseDecimalSeparator())) {
                        left--;
                    }

                    if (left != j && (left == 0 || !this._isUpperChar(text[left - 1]))) {
                        var right = j + this._string_EP.length;
                        while (right < text.length && this._isDigit(text[right])) {
                            right++;
                        }

                        if (right != j + this._string_EP.length) {
                            text = text.substring(0, j) + this.char_EP + this._substring(text, j + this._string_EP.length);
                        }
                    }
                }

                j += 1;
            }

            j = 0;
            while (j > -1 && ((j = text.indexOf(this._string_EM, j)) > -1)) {
                if (this._notInBlock(text, j)) {
                    var left = j;
                    while (left > 0 && (this._isDigit(text[left - 1]) || text[left - 1] == this.getParseDecimalSeparator())) {
                        left--;
                    }

                    if (left != j && (left == 0 || !this._isUpperChar(text[left - 1]))) {
                        var right = j + this._string_EM.length;
                        while (right < text.length && this._isDigit(text[right])) {
                            right++;
                        }

                        if (right != j + this._string_EM.length) {
                            text = text.substring(0, j) + this.char_EM + this._substring(text, j + this._string_EM.length);
                        }
                    }
                }

                j += 1;
            }

            j = 0;

            while (j > -1 && ((j = text.indexOf(this._string_E, j)) > -1) && text[0] != this.bMARKER) {
                if (this._notInBlock(text, j)) {
                    var left = j;
                    while (left > 0 && (this._isDigit(text[left - 1]) || text[left - 1] == this.getParseDecimalSeparator())) {
                        left--;
                    }

                    if (left != j && (left == 0 || !this._isUpperChar(text[left - 1]))) {
                        var right = j + this._string_E.length;
                        while (right < text.length && this._isDigit(text[right])) {
                            right++;
                        }

                        if (right != j + this._string_E.length && (left == -1 || !this._isUpperChar(text[left]))) {
                            text = text.substring(0, j) + this.char_EP + this._substring(text, j + this._string_E.length);
                        }
                    }
                }

                j += 1;
            }

            return text;
        };
        /**
         * 
		 * @private
        */
		this._handleIterations = function (formula) {
            this._inHandleIterations = true;
            var oldValue = 0;
            var d = 0;
            var count = 1;
            var first = true;
            while (count < this._iterationMaxCount - 1 && (first || !this._checkUnderTolerance(d, oldValue))) {
                first = false;
                if (!this.getIterationValues().containsKey(this.cell)) {
                    this.getIterationValues().add(this.cell, "0");
                }

                this.getIterationValues().add(this.cell, (formula.getFormulaValue() == "" ? "0" : formula.getFormulaValue()));

                formula.setFormulaValue(this.computeFormula(formula.getParsedFormula()));
                oldValue = d;
                d = this._parseDouble(formula.getFormulaValue());
                if (isNaN(d))
                    d = 0;
                count++;
            }

            ////save the last iteration
            this.getIterationValues.getItem(this.cell, (formula.getFormulaValue() == "" ? "0" : formula.getFormulaValue()));

            this._inHandleIterations = false;
        };
        /**
         * 
		 * @private
        */
		this._indexOfAny = function (text, operators) {
            for (var i = 0; i < text.length; i++) {
                if (operators.indexOf(text[i]) > -1) {
                    return i;
                }
            }
            return -1;
        };
        /**
         * 
		 * @private
        */
		this._initLibraryFunctions = function () {
            this._libraryFunctions = new HashTable();

            ////Hand-coded formulas.
            this._addFunction("SUM", "computeSum");
            this._addFunction("EncodeURL", "computeEncodeURL");

            
            //TEXT FORMULA
            this._addFunction("CHAR", "computeChar");
            this._addFunction("CODE", "computeCode");
            this._addFunction("UNICODE", "computeUniCode");
            this._addFunction("UNICHAR", "computeUniChar");
            this._addFunction("UPPER", "computeUpper");
            this._addFunction("LOWER", "computeLower");
            this._addFunction("LEN", "computeLen");
            this._addFunction("MID", "computeMid");
            this._addFunction("LEFT", "computeLeft");
            this._addFunction("CLEAN", "computeClean");
            this._addFunction("REPT", "computeRept");
            this._addFunction("RIGHT", "computeRight");
            this._addFunction("REPLACE", "computeReplace");
            this._addFunction("EXACT", "computeExact");
            this._addFunction("FIND", "computeFind");
            this._addFunction("TRIM", "computeTrim");
            this._addFunction("SEARCH", "computeSearch");
            this._addFunction("SUBSTITUTE", "computeSubstitute");
            this._addFunction("PROPER", "computeProper");
            this._addFunction("T", "computeT");
            this._addFunction("NUMBERVALUE", "computeNumberValue");
            this._addFunction("CONCATENATE", "computeConcatenate");
            this._addFunction("VALUE", "computeValue");
            this._addFunction("DOLLAR", "computeDollar");
            this._addFunction("FIXED", "computeFixed");

            //Engineering formulas
            this._addFunction("BIN2DEC", "computeBin2Dec");
            this._addFunction("BIN2OCT", "computeBin2Oct");
            this._addFunction("BIN2HEX", "computeBin2Hex");
            this._addFunction("DEC2BIN", "computeDec2Bin");
            this._addFunction("DEC2OCT", "computeDec2Oct");
            this._addFunction("HEX2BIN", "computeHex2Bin");
            this._addFunction("HEX2OCT", "computeHex2Oct");

            // DATE and TIME
            this._addFunction("DATE", "computeDate");
            this._addFunction("DATEVALUE", "computeDatevalue");
            this._addFunction("DAY", "computeDay");
            this._addFunction("DAYS", "computeDays");
            this._addFunction("DAYS360", "computeDays360");
            this._addFunction("EDATE", "computeEDate");
            this._addFunction("EOMONTH", "computeEOMonth");
            this._addFunction("HOUR", "computeHour");
            this._addFunction("ISOWEEKNUM", "computeISOWeeknum");
            this._addFunction("MINUTE", "computeMinute");
            this._addFunction("MONTH", "computeMonth");
            this._addFunction("NETWORKDAYS", "computeNetworkDays");
            this._addFunction("NETWORKDAYS.INTL", "computeNetworkDaysOintl");
            this._addFunction("NOW", "computeNow");
            this._addFunction("SECOND", "computeSecond");
            this._addFunction("TIME", "computeTime");
            this._addFunction("TIMEVALUE", "computeTimevalue");
            this._addFunction("TODAY", "computeToday");
            this._addFunction("WEEKDAY", "computeWeekday");
            this._addFunction("WEEKNUM", "computeWeeknum");
            this._addFunction("WORKDAY", "computeWorkDay");
            this._addFunction("WORKDAY.INTL", "computeWorkDayOintl");
            this._addFunction("YEAR", "computeYear");

            //look and ref
            this._addFunction("ADDRESS", "computeAddress");
            this._addFunction("AREAS", "computeAreas");
            this._addFunction("CHOOSE", "computeChoose");
            this._addFunction("COLUMN", "computeColumn");
            this._addFunction("COLUMNS", "computeColumns");
            this._addFunction("FORMULATEXT", "computeFormulaText");
            this._addFunction("HYPERLINK", "computeHyperlink");
            this._addFunction("HLOOKUP", "computeHLookUp");
            this._addFunction("INDEX", "computeIndex");
            this._addFunction("INDIRECT", "computeIndirect");
            this._addFunction("LOOKUP", "computeLookUp");
            this._addFunction("OFFSET", "computeOffSet");
            this._addFunction("TRANSPOSE", "computeTranspose");



            // Statics
            this._addFunction("LOGNORM.INV", "computeLognormOinv");
            this._addFunction("NORM.INV", "computeNormOinv");
            this._addFunction("NORM.DIST", "computeNormOdist");
            this._addFunction("NORM.S.DIST", "computeNormOsODist");
            this._addFunction("NORM.S.INV", "computeNormOsOInv");
            this._addFunction("PERMUT", "computePermut");
            this._addFunction("PERMUTATIONA", "computePermutationA");
            this._addFunction("STANDARDIZE", "computeStandardize");
            this._addFunction("BINOM.DIST", "computeBinomOdist");
            this._addFunction("CHISQ.INV.RT", "computeChisqOinvOrt");
            this._addFunction("CHISQ.INV", "computeChisqOinv");
            this._addFunction("CHISQ.DIST.RT", "computeChisqOdistOrt");
            this._addFunction("F.DIST", "computeFOdist");
            this._addFunction("GAMMALN", "computeGammaln");
            this._addFunction("CONFIDENCE.NORM", "computeConfidenceOnorm");
            this._addFunction("EXPON.DIST", "computeExponOdist");
            this._addFunction("FISHER", "computeFisher");
            this._addFunction("FISHERINV", "computeFisherInv");
            this._addFunction("GAMMALN.PRECISE", "computeGammalnOPrecise");
            this._addFunction("AVERAGE", "computeAverage");
            this._addFunction("AVERAGEA", "computeAverageA");
            this._addFunction("POISSON.DIST", "computePoissonODist");
            this._addFunction("WEIBULL.DIST", "computeWeiBullODist");
            this._addFunction("F.INV.RT", "computeFOinvOrt");
            this._addFunction("T.DIST", "computeTOdist");
            this._addFunction("MAX", "computeMax");
            this._addFunction("MAXA", "computeMaxa");
            this._addFunction("MEDIAN", "computeMedian");
            this._addFunction("MIN", "computeMin");
            this._addFunction("MINA", "computeMina");
            this._addFunction("PERCENTRANK.INC", "computePercentrankInc");
            this._addFunction("PERCENTILE", "computePercentile");
            this._addFunction("RANK.EQ", "computeRankOEq");
            this._addFunction("COUNT", "computeCount");
            this._addFunction("COUNTA", "computeCounta");
            this._addFunction("DEVSQ", "computeDevsq");
            this._addFunction("F.DIST.RT", "computeFOdistORt");
            this._addFunction("FORECAST", "computeForecast");
            this._addFunction("GEOMEAN", "computeGeomean");
            this._addFunction("HARMEAN", "computeHarmean");
            this._addFunction("INTERCEPT", "computeIntercept");
            this._addFunction("LARGE", "computeLarge");
            this._addFunction("SMALL", "computeSmall");
            this._addFunction("LOGNORM.DIST", "computeLognormOdist");          
            this._addFunction("AVEDEV", "computeAvedev");
            this._addFunction("COUNTBLANK", "computeCountblank"); 
            this._addFunction("STDEV.P", "computeStdevOp");
            this._addFunction("STDEV.S", "computeStdevOS");
            this._addFunction("STDEVA", "computeStdeva");
            this._addFunction("STDEVPA", "computeStdevpa");
            this._addFunction("T.INV", "computeTOinv");
            this._addFunction("VAR.P", "computeVarp");
            this._addFunction("VARA", "computeVara");
            this._addFunction("VARPA", "computeVarpa");
            this._addFunction("CORREL","computeCorrel");
            //this._addFunction("NEGBINOM.DIST", "computeNegbinomODist");
            this._addFunction("PERCENTILE.EXC", "computePercentileExc");
            this._addFunction("PERCENTILE.INC", "computePercentileOInc");
            this._addFunction("TRIMMEAN", "computeTrimmean");
            this._addFunction("RSQ", "computeRsq");
            this._addFunction("PEARSON", "computePearson");
            //60 statics function
            

            // math and Trig
            this._addFunction("ABS", "computeAbs");
            this._addFunction("ACOS", "computeAcos");
            this._addFunction("ACOSH", "computeAcosh");
            this._addFunction("ACOT", "computeAcot");
            this._addFunction("ACOTH", "computeAcoth");
            this._addFunction("ARABIC", "computeArabic");
            this._addFunction("ASIN", "computeAsin");
            this._addFunction("ATAN", "computeAtan");
            this._addFunction("ATAN2", "computeAtan2");
            this._addFunction("CEILING.MATH", "computeCeilingMath");
            this._addFunction("CEILING", "computeCeiling");
            this._addFunction("COMBIN", "computeCombin");
            this._addFunction("COMBINA", "computeCombinA");
            this._addFunction("COS", "computeCos");
            this._addFunction("COSH", "computeCosh");
            this._addFunction("COT", "computeCot");
            this._addFunction("CSC", "computeCsc");
            this._addFunction("CSCH", "computeCsch");
            this._addFunction("DECIMAL", "computeDecimal");
            this._addFunction("DEGREES", "computeDegrees");
            this._addFunction("ISTEXT", "computeIsText");
            this._addFunction("EXP", "computeExp");
            this._addFunction("EVEN", "computeEven");
            this._addFunction("FACT", "computeFact");
            this._addFunction("FACTDOUBLE", "computeFactdouble");
            this._addFunction("FLOOR", "computeFloor");
            this._addFunction("INT", "computeInt");
            this._addFunction("LN", "computeLn");
            this._addFunction("LOG", "computeLog");
            this._addFunction("PI", "computePI");
            this._addFunction("PRODUCT", "computeProduct");
            this._addFunction("SEC", "computeSecant");
            this._addFunction("SERIESSUM", "computeSeriessum");
            this._addFunction("SIN", "computeSin");
            this._addFunction("SINH", "computeSinh");
            this._addFunction("SQRT", "computeSqrt");
            this._addFunction("SUBTOTAL", "computeSubTotal");
            this._addFunction("SUMIF", "computeSumif");
            this._addFunction("TRUNC", "computeTrunc");
            this._addFunction("TAN", "computeTan");
            this._addFunction("LOG10", "computeLogTen");

            //Logic Function

            this._addFunction("AND", "computeAnd");
            this._addFunction("FALSE", "computeFalse");
            this._addFunction("IF", "computeIf");
            this._addFunction("IFERROR", "computeIfError");
           // this._addFunction("IFNA", "computeIfNA");
            this._addFunction("NOT", "computeNot");
            this._addFunction("OR", "computeOr");
            this._addFunction("TRUE", "computeTrue");
            this._addFunction("XOR", "computeXor");

            // Information Function

            this._addFunction("CELL", "computeCell");
            this._addFunction("ERROR.TYPE", "computeErrorType");
            this._addFunction("INFO", "computeInfo");
            this._addFunction("ISBLANK", "computeIsBlank");
            this._addFunction("ISERR", "computeIsErr");
            this._addFunction("ISERROR", "computeIsError");
            this._addFunction("ISEVEN", "computeIsEven");
            this._addFunction("ISFORMULA", "computeIsFormula");
            this._addFunction("ISLOGICAL", "computeIsLogical");
            this._addFunction("ISNA", "computeIsNA");
            this._addFunction("ISNONTEXT", "computeIsNonText");
            this._addFunction("ISNUMBER", "computeIsNumber");
            this._addFunction("ISODD", "computeIsOdd");
            this._addFunction("ISREF", "computeIsRef");
            this._addFunction("ISTEXT", "computeIsText");
            this._addFunction("N", "computeN");
            this._addFunction("NA", "computeNA");
            this._addFunction("SHEET", "computeSheet");
            this._addFunction("SHEETS", "computeSheets");
            this._addFunction("TYPE", "computeType");
            this._addFunction("ROW", "computeRow");
            this._addFunction("ROWS", "computeRows");

        };
        /**
         * 
		 * @private
        */
		this._comb = function (k, n) {
            var top = 1;
            for (var i = k + 1; i <= n; ++i) {
                top = top * i;
            }

            var bottom = 1;
            for (var i = 2; i <= (n - k) ; ++i) {
                bottom = bottom * i;
            }

            return top / bottom;
        };
        /**
         * 
		 * @private
        */
		this._finv = function (p, df1, df2) {
            var mult = Math.exp(this._gammaln((df1 + df2) / 2) - this._gammaln(df1 / 2) - this._gammaln(df2 / 2) + (df1 / 2) * Math.log(df1 / df2));

            var guess = mult;

            var lastIncrement = guess / 2;
            var gi = 0;
            var eps = 1e-7;
            var k = 100;
            var tries = 3;
            var its = 0;
            while (k == 100 && tries > 0) {
                tries--;
                guess = guess / 2;
                lastIncrement = guess / 2;

                for (k = 0; k < 100; ++k) {
                    its++;
                    gi = 1 - mult * this._fdist(guess, df1, df2);

                    ////Console.WriteLine("{0}: guess {1}  computed {2}  target {3}", its, guess, gi, p);
                    if (Math.abs((gi - p) / p) < eps) {
                        break;
                    }

                    ////greater since looking for 1 - xxxx
                    if (gi > p) {
                        guess = guess + lastIncrement;
                    } else {
                        lastIncrement = lastIncrement / 2;
                        if (guess - lastIncrement < 0) {
                            lastIncrement = guess / 2;
                        }

                        guess = guess - lastIncrement;
                    }
                }
            }

            if (k == 100) {
                guess = -1;
            }

            return guess;
        };
        /**
         * 
		 * @private
        */
		this._tProbabilityDensity = function (x, k) {
            var a = this._gammaFunction(0.5 * k + 0.5);
            var b = Math.pow(1.0 + (x * x) / k, -0.5 * k - 0.5);
            var c = Math.sqrt(k * Math.PI) * this._gammaFunction(0.5 * k);
            return a * b / c;
        };
        /**
         * 
		 * @private
        */
		this._tCumulativeDensity = function (x, k) {
            if (isNaN(x))
                return NaN;
            if (x == 0)
                return 0.5;
            if (x > 0) {
                var x2 = k / (x * x + k);
                return 1.0 - 0.5 * this._rIBetaFunction(x2, 0.5 * k, 0.5);
            }
            return 1.0 - this._tCumulativeDensity(-x, k);
        };
        /**
         * 
		 * @private
        */
		this._sign = function (p) {
            if (p === 0 || isNaN(p))
                return p;
            return p > 0 ? 1 : -1;
        };
        /**
         * 
		 * @private
        */
		this._var = function (x) {
            var sumx = 0;
            var n = x.length;
            for (var i = 0; i < n; ++i) {
                sumx += x[i];
            }

            sumx = sumx / n;

            var sumx2 = 0;
            var d;
            for (var i = 0; i < n; ++i) {
                d = x[i] - sumx;
                sumx2 += d * d;
            }

            return sumx2 / (n - 1);
        };
        /**
         * 
		 * @private
        */
		this._tCumulativeDistributionInverse = function (p, k) {
            var maxIterations= 50;
            var minAccuracy = 0.0001;

            if (p < 0 || p > 1.0)
                throw "Probability must be between 0 and 1";
            if (p == 0)
                return Number.NEGATIVE_INFINITY;
            if (p == 1)
                return Number.POSITIVE_INFINITY;
            if (p == 0.5)
                return 0.0;

            switch (k) {
                case 1:
                    return Math.tan(Math.PI * (p - 0.5));
                case 2:
                    var alpha = 4 * p * (1 - p);
                    return 2 * (p - 0.5) * Math.sqrt(2.0 / alpha);
                case 4:
                    var alpha = 4 * p * (1 - p);
                    var sqrtAlpha = Math.sqrt(alpha);
                    var q = Math.cos((1.0 / 3.0) * Math.acos(sqrtAlpha)) / sqrtAlpha;
                    return this._sign(p - 0.5) * 2 * Math.sqrt(q - 1);
                default:
                    var x;
                    if (k > 6)
                        x = this._standardNormalCumulativeDistributionFunctionInverse(p);
                    else
                        x = this._tCumulativeDistributionInverse(p, 4);

                    for (var i = 0; i < maxIterations; i++) {
                        var p0 = this._tCumulativeDensity(x, k);
                        var absAccuracy = Math.abs(p - p0);
                        if (absAccuracy < minAccuracy)
                            return x;
                        var slope = this._tProbabilityDensity(x, k);
                        x = x + (p - p0) / slope;
                    }
                    throw "Solution did not converge";
            }
        };
        /**
         * 
		 * @private
        */
		this._fdist = function (x, df1, df2) {
            var nPanels = 32;
            var leftside = 0;
            var rightside = x;

            var h = (rightside - leftside) / nPanels;
            var mult = h / 3;

            var sum1 = this._fdensity(leftside, df1, df2) + this._fdensity(rightside, df1, df2);
            var sum4 = 0;
            for (var i = 1; i < nPanels; i += 2) {
                sum4 = sum4 + 4 * this._fdensity(leftside + i * h, df1, df2);
            }

            var sum2 = 0;
            for (var i = 2; i < nPanels; i += 2) {
                sum2 = sum2 + 2 * this._fdensity(leftside + i * h, df1, df2);
            }

            var gd = mult * (sum1 + sum2 + sum4);
            var oldgd = gd;
            var eps = 1e-7;

            var k = 0;

            for (k = 0; k < 10; ++k) {
                nPanels = nPanels * 2;

                sum2 += sum4 / 2;
                sum4 = 0;
                h = (rightside - leftside) / nPanels;
                for (var i = 0; i < nPanels; ++i) {
                    if (i % 2 == 1) {
                        var d = this._fdensity(leftside + h * i, df1, df2);
                        sum4 = sum4 + d;
                    }
                }

                sum4 = 4 * sum4;
                mult = h / 3;
                gd = mult * (sum1 + sum2 + sum4);

                if (Math.abs((gd - oldgd) / oldgd) < eps) {
                    break;
                }

                oldgd = gd;
            }

            return gd;
        };
        /**
         * 
		 * @private
        */
		this._fdensity = function (x, df1, df2) {
            return Math.pow(x, (df1 - 2) / 2) / Math.pow(1 + df1 * x / df2, (df1 + df2) / 2);
        };
        /**
         * 
		 * @private
        */
		this._normaldist = function (x, u, s) {
            var nPanels = 32;
            var leftside;
            var rightside;
            if (x > u) {
                leftside = u - (x - u);
                rightside = x;
            } else {
                leftside = x;
                rightside = u + (u - x);
            }

            var h = (rightside - leftside) / nPanels;
            var mult = h / 3;

            var sum1 = this._normaldensity(leftside, u, s) + this._normaldensity(rightside, u, s);
            var sum4 = 0;
            for (var i = 1; i < nPanels; i += 2) {
                sum4 = sum4 + 4 * this._normaldensity(leftside + i * h, u, s);
            }

            var sum2 = 0;
            for (var i = 2; i < nPanels; i += 2) {
                sum2 = sum2 + 2 * this._normaldensity(leftside + i * h, u, s);
            }

            var gd = mult * (sum1 + sum2 + sum4);
            var oldgd = gd;
            var eps = 1e-7;

            var k = 0;

            for (k = 0; k < 10; ++k) {
                nPanels *= 2;

                sum2 = sum2 + sum4 / 2;
                sum4 = 0;
                h = h = (rightside - leftside) / nPanels;
                for (var i = 0; i < nPanels; ++i) {
                    if (i % 2 == 1) {
                        var d = this._normaldensity(leftside + h * i, u, s);
                        sum4 += d;
                    }
                }

                sum4 = 4 * sum4;
                mult = h / 3;
                gd = mult * (sum1 + sum2 + sum4);

                if (Math.abs((gd - oldgd) / oldgd) < eps) {
                    break;
                }

                oldgd = gd;
            }

            if (x > u) {
                ////Add the left tails.
                gd = gd + (1 - gd) / 2;
            } else {
                ////Return only the left tail.
                gd = (1 - gd) / 2;
            }

            ////Console.WriteLine(k.toString() + "  " + gd.toString());
            return gd;
        };
        /**
         * 
		 * @private
        */
		this._normaldensity = function (x, u, s) {
            return 1 / (Math.sqrt(2 * Math.PI) * s) * Math.exp(-(x - u) * (x - u) / (2 * s * s));
        };
        /**
         * 
		 * @private
        */
		this._standardNormalCumulativeDistribution = function (x) {
            //Approimation based on Abramowitz & Stegun (1964)
            if (x < 0)
                return 1.0 - this._standardNormalCumulativeDistribution(-x);
            var b0 = 0.2316419;
            var b1 = 0.319381530;
            var b2 = -0.356563782;
            var b3 = 1.781477937;
            var b4 = -1.821255978;
            var b5 = 1.330274429;
            var pdf = this._standardNormalProbabilityDensityFunction(x);
            var a = 1.0 / (1.0 + b0 * x);
            return 1.0 - pdf * (b1 * a + b2 * Math.pow(a, 2) + b3 * Math.pow(a, 3) + b4 * Math.pow(a, 4) + b5 * Math.pow(a, 5));
        };
        /**
         * 
		 * @private
        */
		this._normalinv = function (p, u, s) {
            var guess = u;
            if (p < .05) {
                guess = u - 2 * s;
            } else if (p < .5) {
                guess = u;
            } else if (p < .95) {
                guess = u + 2 * s;
            } else {
                guess = u + 5 * s;
            }

            var lastIncrement = guess / 2;
            var gi = 0;
            var eps = 1e-7;
            var k = 100;
            var tries = 3;
            var its = 0;
            while (k == 100 && tries > 0) {
                tries--;
                guess = guess / 2;
                lastIncrement = guess / 2;

                for (k = 0; k < 100; ++k) {
                    its++;
                    gi = this._normaldist(guess, u, s);
                    if (Math.abs((gi - p) / p) < eps) {
                        break;
                    }

                    if (gi < p) {
                        guess = guess + lastIncrement;
                    } else {
                        lastIncrement = lastIncrement / 2;
                        if (guess - lastIncrement < 0) {
                            lastIncrement = guess / 2;
                        }

                        guess = guess - lastIncrement;
                    }
                }
            }

            if (k == 100) {
                guess = -1;
            }

            return guess;
        };
		/**
         * 
		 * @private
        */
		this._normalCumulativeDistributionFunctionInverse = function (p, mean, standardDeviation) {
            var x = this._standardNormalCumulativeDistributionInverse(p);
            return standardDeviation * x + mean;
        };
        /**
         * 
		 * @private
        */
		this._standardNormalCumulativeDistributionInverse = function (p) {
            if (p < 0 || p > 1.0)
                throw "Probability must be between 0 and 1";
            if (p == 0)
                return Number.NEGATIVE_INFINITY;
            if (p == 1)
                return Number.POSITIVE_INFINITY;
            if (p == 0.5)
                return 0.0;

            var a1 = -3.969683028665376e+01;
            var a2 = 2.209460984245205e+02;
            var a3 = -2.759285104469687e+02;
            var a4 = 1.383577518672690e+02;
            var a5 = -3.066479806614716e+01;
            var a6 = 2.506628277459239e+00;

            var b1 = -5.447609879822406e+01;
            var b2 = 1.615858368580409e+02;
            var b3 = -1.556989798598866e+02;
            var b4 = 6.680131188771972e+01;
            var b5 = -1.328068155288572e+01;

            var c1 = -7.784894002430293e-03;
            var c2 = -3.223964580411365e-01;
            var c3 = -2.400758277161838e+00;
            var c4 = -2.549732539343734e+00;
            var c5 = 4.374664141464968e+00;
            var c6 = 2.938163982698783e+00;

            var d1 = 7.784695709041462e-03;
            var d2 = 3.224671290700398e-01;
            var d3 = 2.445134137142996e+00;
            var d4 = 3.754408661907416e+00;

            var pLow = 0.02425;
            var pHigh = 1 - pLow;

            var q, x;
            if (0 < p && p < pLow) {
                q = Math.sqrt(-2 * Math.log(p));
                x = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
                return x;
            }

            if (pLow <= p && p <= pHigh) {
                q = p - 0.5;
                var r = q * q;
                x = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
                return x;
            }

            //if(p_high < p && p < 1)
            q = Math.sqrt(-2 * Math.log(1 - p));
            x = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
            return x;
        };
        /**
         * 
		 * @private
        */
		this._normalProbabilityDensity = function (x, mean, standardDeviation) {
            var sqrtTwoPiInv = 0.398942280401433;
            var z = (x - mean) / standardDeviation;
            return sqrtTwoPiInv * Math.exp(-0.5 * z * z) / standardDeviation;
        };
        /**
         * 
		 * @private
        */
		this._standardNormalProbabilityDensityFunction = function (x) {
            var SqrtTwoPiInv = 0.398942280401433;
            return SqrtTwoPiInv * Math.exp(-0.5 * x * x);
        };
        /**
         * 
		 * @private
        */
		this._standardNormalCumulativeDistributionFunction = function (x) {
            if (x < 0)
                return 1.0 - this._standardNormalCumulativeDistributionFunction(-x);
            var b0 = 0.2316419;
            var b1 = 0.319381530;
            var b2 = -0.356563782;
            var b3 = 1.781477937;
            var b4 = -1.821255978;
            var b5 = 1.330274429;
            var pdf = this._standardNormalProbabilityDensityFunction(x);
            var a = 1.0 / (1.0 + b0 * x);
            return 1.0 - pdf * (b1 * a + b2 * Math.pow(a, 2) + b3 * Math.pow(a, 3) + b4 * Math.pow(a, 4) + b5 * Math.pow(a, 5));
        };
        /**
         * 
		 * @private
        */
		this._standardNormalCumulativeDistributionFunctionInverse = function (p) {
            if (p < 0 || p > 1.0)
                throw "Probability must be between 0 and 1";
            if (p == 0)
                return Number.NEGATIVE_INFINITY;
            if (p == 1)
                return Number.POSITIVE_INFINITY;
            if (p == 0.5)
                return 0.0;

            var a1 = -3.969683028665376e+01;
            var a2 = 2.209460984245205e+02;
            var a3 = -2.759285104469687e+02;
            var a4 = 1.383577518672690e+02;
            var a5 = -3.066479806614716e+01;
            var a6 = 2.506628277459239e+00;

            var b1 = -5.447609879822406e+01;
            var b2 = 1.615858368580409e+02;
            var b3 = -1.556989798598866e+02;
            var b4 = 6.680131188771972e+01;
            var b5 = -1.328068155288572e+01;

            var c1 = -7.784894002430293e-03;
            var c2 = -3.223964580411365e-01;
            var c3 = -2.400758277161838e+00;
            var c4 = -2.549732539343734e+00;
            var c5 = 4.374664141464968e+00;
            var c6 = 2.938163982698783e+00;

            var d1 = 7.784695709041462e-03;
            var d2 = 3.224671290700398e-01;
            var d3 = 2.445134137142996e+00;
            var d4 = 3.754408661907416e+00;

            var pLow = 0.02425;
            var pHigh = 1 - pLow;

            var q, x;
            if (0 < p && p < pLow) {
                q = Math.sqrt(-2 * Math.log(p));
                x = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
                return x;
            }

            if (pLow <= p && p <= pHigh) {
                q = p - 0.5;
                var r = q * q;
                x = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
                return x;
            }

            //if(p_high < p && p < 1)
            q = Math.sqrt(-2 * Math.log(1 - p));
            x = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
            return x;
        };
        /**
         * 
		 * @private
        */
		this._chiSquaredProbabilityDensityFunction = function (x, k) {
            var g = this._gammaFunction(0.5 * k);
            var a = 1.0 / (Math.pow(2, 0.5 * k) * g);
            return a * Math.pow(x, 0.5 * k - 1.0) * Math.exp(-0.5 * x);
        };
        /**
         * 
		 * @private
        */
		this._binomdist = function (trials, successes, p) {
            var pPow = 1;
            var pm1 = 1 - p;

            var p1Pow = Math.pow(pm1, trials);

            var dist = 0;
            var cbn = pPow * Math.pow(pm1, trials);
            if (cbn == 0) {
                return NaN;
            }

            for (var i = 0; i <= successes; ++i) {
                dist += cbn;
                cbn = cbn * p / pm1 * (trials - i) / (i + 1);
                if (!isFinite(cbn) || isNaN(cbn)) {
                    dist = NaN;
                    break;
                }
            }

            return dist;
        };
        /**
         * 
		 * @private
        */
		this._gammadensity = function (a, b, x) {
            //// excel version     dist = 1 / (Math.Pow(b, a) * gammaln(a)) * Math.Pow(x, a - 1) * Math.Exp(-x / b);
            //// http://www.itl.nist.gov/div898/handbook/eda/section3/eda366b.htm
            return Math.pow(x / b, a - 1) * Math.exp(-x / b) / (b * Math.exp(this._gammaln(a)));
        };
        this.minValue = -1.79769e+308;
        this.maxValue = 2147483647;
        this._charTable = [this._string_empty, "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        /**
         * 
		 * @private
        */
		this._stdevdotP = function (range) {
            var n = range.length;
            var mean = 0;
            var sigma = 0;
            var count = 0;
            for (var i = 0; i < n; ++i)
                mean = mean + range[i];
            mean = mean / n;
            for (var i = 0; i < n; i++) {
                sigma = sigma + Math.pow(range[i] - mean, 2);
                count++;
            }

            return Math.sqrt(sigma / count);
        };
        /**
         * 
		 * @private
        */
		this._determinant = function (a, k) {
            var s = 1, det = 0;
            var matlength = parseInt(k.toString());
            var b = [matlength, matlength];
            var i, j, m, n, c;
            if (k == 1) {
                return (a[0, 0]);
            } else {
                det = 0;
                for (c = 0; c < k; c++) {
                    m = 0;
                    n = 0;
                    for (i = 0; i < k; i++) {
                        for (j = 0; j < k; j++) {
                            b[i, j] = 0;
                            if (i != 0 && j != c) {
                                b[m, n] = a[i, j];
                                if (n < (k - 2))
                                    n++;
                                else {
                                    n = 0;
                                    m++;
                                }
                            }
                        }
                    }
                    det = det + s * (a[0, c] * this._determinant(b, k - 1));
                    s = -1 * s;
                }
            }

            return (det);
        };
        this._factorialTable = [
            1, 1, 2, 6, 24, 120, 720,
            5040, 40320, 362880, 3628800,
            39916800, 479001600
        ];
        /**
         * 
		 * @private
        */
		this._mean = function (array) {
            return this._mean(array, 1.0);
        };
        /**
         * 
		 * @private
        */
		this._negbinomdensity = function (failures, successes, p) {
            return this._comb(successes - 1, failures + successes - 1) * Math.pow(p, successes) * Math.pow(1 - p, failures);
        };
        /**
         * 
		 * @private
        */
		this._sd = function (x, xbar) {
            var n = x.length;
            xbar = 0;
            for (var i = 0; i < n; ++i) {
                xbar += x[i];
            }

            xbar = xbar / n;
            var sumx2 = 0;
            var d = 0;

            for (var i = 0; i < n; ++i) {
                d = x[i] - xbar;
                sumx2 += d * d;
            }
            if (n == 1)
                return 0;
            return Math.sqrt(sumx2 / (n - 1));
        };
        /**
         * 
		 * @private
        */
		this._betaCumulativeDist = function (x, a, b) {
            if (x < 0 || x > 1)
                throw "x must be between 0 and 1";
            return this._rIBetaFunction(x, a, b);
        };
        /**
         * 
		 * @private
        */
		this._betaProbabilityDens = function (x, a, b) {
            if (x < 0 || x > 1)
                throw "x must be between 0 and 1";

            var B = this._betaFunction(a, b);
            var d = Math.pow(x, a - 1) * Math.pow(1 - x, b - 1) / B;
            return d;
        };
        /**
         * 
		 * @private
        */
		this._critbinom = function (nTrials, p, alpha) {
            var checkval = nTrials;
            var half = nTrials;
            var dist = 1;
            var dist1 = 1;
            do {
                half = half / 2 + 1;
                if (dist >= alpha) {
                    dist1 = this._binomdist(nTrials, checkval - 1, p);
                    if (!isNaN(dist1)) {
                        return this.maxValue;
                    }

                    if (dist1 < alpha && dist1 > 0) {
                        break;
                    }

                    checkval = checkval - half;
                } else {
                    dist1 = this._binomdist(nTrials, checkval + 1, p);
                    if (dist1 >= alpha) {
                        checkval = checkval + 1;
                        break;
                    }

                    checkval = checkval + half;
                }

                dist = this._binomdist(nTrials, checkval, p);
            } while (checkval < nTrials && checkval > 0);

            return checkval;
        };
        /**
         * 
		 * @private
        */
		this._newnormalinv = function (p) {
            var region1 = [
                -3.969683028665376e+01, 2.209460984245205e+02,
                -2.759285104469687e+02, 1.383577518672690e+02,
                -3.066479806614716e+01, 2.506628277459239e+00];

            var region2 = [
                -5.447609879822406e+01, 1.615858368580409e+02,
                -1.556989798598866e+02, 6.680131188771972e+01,
                -1.328068155288572e+01];

            var region3 = [
                -7.784894002430293e-03, -3.223964580411365e-01,
                -2.400758277161838e+00, -2.549732539343734e+00,
                4.374664141464968e+00, 2.938163982698783e+00];

            var region4 = [
                7.784695709041462e-03, 3.224671290700398e-01,
                2.445134137142996e+00, 3.754408661907416e+00];

            var pLow = 0.02425;
            var pHigh = 1 - pLow;
            var q = 0.0;
            var r = 0.0;

            // For lower region:
            if (p < pLow) {
                q = Math.sqrt(-2 * Math.log(p));
                return (((((region3[0] * q + region3[1]) * q + region3[2]) * q + region3[3]) * q + region3[4]) * q + region3[5]) / ((((region4[0] * q + region4[1]) * q + region4[2]) * q + region4[3]) * q + 1);
            }

            // For upper region:
            if (pHigh < p) {
                q = Math.sqrt(-2 * Math.log(1 - p));
                return -(((((region3[0] * q + region3[1]) * q + region3[2]) * q + region3[3]) * q + region3[4]) * q + region3[5]) / ((((region4[0] * q + region4[1]) * q + region4[2]) * q + region4[3]) * q + 1);
            }

            // For central region:
            q = p - 0.5;
            r = q * q;
            return (((((region1[0] * r + region1[1]) * r + region1[2]) * r + region1[3]) * r + region1[4]) * r + region1[5]) * q / (((((region2[0] * r + region2[1]) * r + region2[2]) * r + region2[3]) * r + region2[4]) * r + 1);
        };
        /**
         * 
		 * @private
        */
		this._chiinv = function (p, v) {
            var guess = p;

            var lastIncrement = Number(guess / 2);
            var gi = 0;
            var eps = 1e-7;
            var k = 100;
            var tries = 3;
            while (k == 100 && tries > 0) {
                tries--;
                guess = (guess / 2);
                lastIncrement = guess / 2;

                for (k = 0; k < 100; ++k) {
                    gi = 1 - this._chidist(guess, v);
                    if (Math.abs((gi - p) / p) < eps) {
                        break;
                    }

                    if (gi > p) {
                        guess = guess + lastIncrement;
                    } else {
                        lastIncrement = lastIncrement / 2;
                        if (guess - lastIncrement < 0) {
                            lastIncrement = guess / 2;
                        }

                        guess = guess - lastIncrement;
                    }
                }
            }

            if (k == 100) {
                guess = -1;
            }

            return guess;
        };
        /**
         * 
		 * @private
        */
		this._chidist = function (x, v) {
            var gauss_w = [
                0.09654008851,
                0.09563872008,
                0.09384439908,
                0.09117387870,
                0.08765209300,
                0.08331192423,
                0.07819389579,
                0.07234579411,
                0.06582222278,
                0.05868409348,
                0.05099805926,
                0.04283589802,
                0.03427386291,
                0.02539206531,
                0.01627439473,
                0.00701861001
            ];

            var gauss_x = [
                0.04830766569,
                0.14447196158,
                0.23928736225,
                0.33186860228,
                0.42135127613,
                0.50689990893,
                0.58771575724,
                0.66304426693,
                0.73218211874,
                0.79448379597,
                0.84936761373,
                0.89632115577,
                0.93490607594,
                0.96476225559,
                0.98561151155,
                0.99726386185
            ];

            var gauss_n = 16;
            var ex = v / 2;
            var mult = 1 / (Math.pow(2, ex) * Math.exp(this._gammaln(ex)));
            ex = ex - 1;

            var a = 0;
            var b = x;

            var midPt = (a + b) / 2;
            var radius = (b - a) / 2;

            var sum = 0;

            var offset;
            for (var i = 0; i < gauss_n; ++i) {
                offset = gauss_x[i] * radius;
                sum = Number(sum) + Number(gauss_w[i] * (Math.pow(midPt + offset, ex) * Math.exp(-(midPt + offset) / 2) + Math.pow(midPt - offset, ex) * Math.exp(-(midPt - offset) / 2)));
            }

            sum = Number(mult) * Number(sum) * Number(radius);
            return sum;
        };
        /**
         * 
		 * @private
        */
		this._gammaln = function (x) {
            var gammaAs = [0.918938533204673, 0.000595238095238, 0.000793650793651, 0.002777777777778, 0.083333333333333];
            var y = x;
            var f = 0;
            if (y < 7) {
                f = y;
                y++;
                while (y < 7) {
                    f = f * y;
                    if (y < 7) {
                        y++;
                    }
                }

                f = -Math.log(f);
            }

            var z = this._parseDouble((1 / (y * y)).toString());
            return f + (y - this._parseDouble("0.5")) * Math.log(y) - y + gammaAs[0] + (((-gammaAs[1] * z + gammaAs[2]) * z - gammaAs[3]) * z + gammaAs[4]) / y;
		};
        /**
         * 
		 * @private
        */
		this._pearson = function (x, y, n) {
            var sumx = 0;
            var sumy = 0;
            for (var i = 0; i < n; ++i) {
                sumx += x[i];
                sumy += y[i];
            }

            sumx = sumx / n;
            sumy = sumy / n;

            var sumxy = 0;
            var sumx2 = 0;
            var sumy2 = 0;
            var d1, d;
            for (var i = 0; i < n; ++i) {
                d = x[i] - sumx;
                d1 = y[i] - sumy;
                sumxy += d * d1;
                sumx2 += d * d;
                sumy2 += d1 * d1;
            }

            return sumxy / Math.sqrt(sumx2 * sumy2);
        };
        /**
         * 
		 * @private
        */
		this._fProbabilityDensity = function (x, k1, k2) {
            if (k1 <= 0 || k2 <= 0)
                throw "k1 and k2 must be greater than 0.";
            if (x == 0)
                return 0.0;
            var a1 = Math.pow(k1 * x, 0.5 * k1);
            var a2 = Math.pow(k2, 0.5 * k2);
            var a3 = Math.pow(k1 * x + k2, 0.5 * (k1 + k2));
            var a = a1 * a2 / a3;
            var b = this._betaFunction(0.5 * k1, 0.5 * k2);
            var c = x * b;
            return a / c;
        };
        /**
         * 
		 * @private
        */
		this._fCumulativeDensity = function (x, k1, k2) {
            if (k1 <= 0 || k2 <= 0)
                throw "k1 and k2 must be greater than 0.";
            if (x < 0)
                throw "x must be greater than 0.";

            if (x == 0)
                return 0.0;
            var x2 = (k1 * x) / (k1 * x + k2);
            var p = this._rIBetaFunction(x2, 0.5 * k1, 0.5 * k2);
            return Math.min(1, p);
        };
        /**
         * 
		 * @private
        */
		this._rIBetaFunction = function (x, a, b) {
            if (x <= 0.0)
                return 0.0;
            if (x >= 1.0)
                return 1.0;

            if (a % 1.0 == 0 && b % 1.0 == 0 && a + b > 0)
                return this._rIBetaFunction1(x, a, b);
            if (b % 1.0 == 0 && a + b < 172)
                return this._rIBetaFunction2(x, a, b);
            if (a % 1.0 == 0 && a + b < 172)
                return 1.0 - this._rIBetaFunction2(1.0 - x, b, a);
            if (a == 0.5 && b == 0.5)
                return (2.0 / Math.PI) * Math.atan(Math.sqrt(x / (1.0 - x)));
            if (a == 0.5 && b % 0.5 == 0) {
                return 1.0 - this._rIBetaFunction(1.0 - x, b, 0.5);
            }
            if (a % 0.5 == 0 && b == 0.5) {
                if (a < 45) {
                    //CASE B (partial)
                    var s = 0;
                    var n = Math.round(a - 0.5);
                    var logGammaHalf = this._parseDouble(this.computeGammaln("0.5".toString()));
                    for (var i = 0; i < n; i++) {
                        s = s + Math.exp(this._gammaln(i + 1) - this._gammaln(i + 1.5) - logGammaHalf) * Math.pow(x, i);
                    }
                    return this._rIBetaFunction(x, 0.5, 0.5) - Math.sqrt(x * (1 - x)) * s;
                } else {
                    //CASE C (partial)
                    var M = this._betaFunction(a, 0.5);
                    var lambda = Math.sqrt(1.0 - Math.pow(M * Math.sqrt((a - 1.0) / Math.PI) * this._epsilon, 1.0 / (a - 1.0)));

                    //Gaussian weights
                    var weights = [
                        0.066671344308688, 0.14945134915058, 0.21908636251598, 0.26926671931000, 0.29552422471475,
                        0.29552422471475, 0.26926671931000, 0.21908636251598, 0.14945134915058, 0.066671344308688];

                    var mgas = [
                        0.013046735791414, 0.067468316655507, 0.16029521585049, 0.28330230293538, 0.42556283050918,
                        0.57443716949081, 0.71669769706462, 0.83970478414951, 0.93253168334449, 0.98695326420859];

                    var sqrtOneMinusX = Math.sqrt(1 - x);
                    var s = 0;
                    for (var i = 0; i < 10; i++) {
                        s = s + weights[i] * Math.pow(1.0 - Math.pow((lambda - sqrtOneMinusX) * mgas[i] + sqrtOneMinusX, 2), a - 1.0);
                    }
                    var l = Math.exp(this._gammaln(a + 0.5) - this._gammaln(a) - this._gammaln(0.5));
                    return (lambda - sqrtOneMinusX) * l * s;
                }
            }
            if (a % 0.5 == 0 && b % 0.5 == 0) {
                //CASE B and C
                var s = 0;
                var n = Math.round(b - 0.5);
                var logGammaA = this._gammaln(a);
                var xToTheA = Math.pow(x, a);
                for (var i = 0; i < n; i++) {
                    s = s + Math.exp(this._gammaln(a + i + 0.5) - logGammaA - this._gammaln(i + 1.5)) * Math.pow(1 - x, i) * xToTheA;
                }
                var d = this._rIBetaFunction(x, a, 0.5) + Math.sqrt(1 - x) * s;
                return Math.max(0.0, Math.min(1.0, d));
            }
            if (x > 0.5)
                return 1.0 - this._rIBetaFunction(1.0 - x, b, a);

            var ribf = this._iBetaFunction(x, a, b) / this._betaFunction(a, b);
            return Math.max(0.0, Math.min(1.0, ribf));
        };
        /**
         * 
		 * @private
        */
		this._rIBetaFunction1 = function (x, a, b) {
            var s = 0;
            var c = a + b - 1;
            if (c < 21) {
                for (var i = a; i < a + b; i++) {
                    s = s + Math.pow(x, i) * Math.pow(1.0 - x, c - i) / (this._factorial(i) * this._factorial(c - i));
                }
                s = s * this._factorial(c);
            } else {
                for (var i = a; i < a + b; i++) {
                    s = s + Math.pow(x, i) * Math.pow(1.0 - x, c - i) * this._combinations(c, i);
                }
            }

            return Math.max(0.0, Math.min(1.0, s));
        };
        /**
         * 
		 * @private
        */
		this._rIBetaFunction2 = function (x, a, b) {
            if (a + b > 172)
                throw "Cannot currently compute RegularizedIncompleteBetaFunction for a + b > 172";

            var s = 0;
            for (var i = 1; i < b + 1; i++) {
                s = s + Math.pow(1 - x, i - 1) * Math.exp(this._gammaln(a + i - 1) - this._gammaln(i));
            }
            s = s * (Math.pow(x, a) * Math.exp(-this._gammaln(a)));
            return s;
        };
        /**
         * 
		 * @private
        */
		this._iBetaFunction = function (x, a, b) {
            if (x == 0)
                return 0;
            if (x == 1)
                return this._betaFunction(a, b);

            if (x <= 0.9) {
                return this._pIBetaFunction(0, x, a, b);
            }
            if (x <= 0.99) {
                var s1 = this._pIBetaFunction(0, 0.9, a, b);
                var s2 = this._pIBetaFunction(0.90, x, a, b);
                return s1 + s2;
            } else {
                var s1 = this._pIBetaFunction(0, 0.9, a, b);
                var s2 = this._pIBetaFunction(0.9, 0.99, a, b);
                var s3 = this._pIBetaFunction(0.99, x, a, b);
                return s1 + s2 + s3;
            }
        };
        /**
         * 
		 * @private
        */
		this._pIBetaFunction = function (xL, xU, a, b) {
            if (xU == xL)
                return 0.0;
            if (xU < xL)
                return NaN;

            var nSteps = 1000;
            if (a < 1)
                nSteps = 80000;

            var dt = (xU - xL) / nSteps;
            var t = xL + 0.5 * dt;
            var sum = 0;
            for (var i = 0; i < nSteps; i++) {
                sum = sum + Math.pow(t, a - 1) * Math.pow(1.0 - t, b - 1) * dt;
                t = t + dt;
            }
            return sum;
        };
        /**
         * 
		 * @private
        */
		this._betaFunction = function (a, b) {
            if (a + b > 143) {
                if (b > 20)
                    return 2.5066282746310002 * Math.pow(a, a - 0.5) * Math.pow(b, b - 0.5) / Math.pow(a + b, a + b - 0.5);
                return this._gammaFunction(b) * Math.pow(a, -b);
            }
            return this._gammaFunction(a) * this._gammaFunction(b) / this._gammaFunction(a + b);
        };
        /**
         * 
		 * @private
        */
		this._gammaFunction = function (z) {
            //approximation based on Stirling's formula
            //based on approximation from NIST Handbook of Mathematical Function. 2010. Cambridge University Press.
            if (z > 143)
                throw "Cannot currently compute gamma function for z > 143";

            //need z<21 or z<11 becaus Factorial(x) will not work for x>20
            if (z > 0 && z < 21 && z % 1.0 == 0)
                return this._factorial(Math.round(z - 1));
            if (z > 0 && z < 11 && z % 0.5 == 0) {
                var n = z;
                var sqrtPi = 1.77245385090552;
                return sqrtPi * this._factorial(2 * n) / (Math.pow(4, n) * this._factorial(n));
            }

            var sqrtTwoPi = 2.5066282746310002;
            var d = 1.0 + 1.0 / (12 * z) + 1.0 / (288 * z * z) - 139.0 / (51840 * Math.pow(z, 3)) - 571.0 / (2488320 * Math.pow(z, 4)) + 163879.0 / (209018880 * Math.pow(z, 5)) + 5246819.0 / (75246796800 * Math.pow(z, 6));
            var g = Math.pow(z, z - 0.5) * Math.exp(-z) * sqrtTwoPi * d;
            return g;
        };
        /**
         * 
		 * @private
        */
		this._epsilon = 4.94066e-324;
        /**
         * 
		 * @private
        */
		this._factorial = function (n) {
            if (n < 0)
                throw "Factorial not defined for negative n";
            if (n > 20)
                throw "Answer will exceed max long";
            var fact = 1;
            for (var i = n; i > 0; i--)
                fact = fact * i;
            return fact;
        };
        /**
         * 
		 * @private
        */
		this._combinations = function (n, k) {
            var logCombin = this._logCombin(n, k);
            var combin = Math.exp(logCombin);
            return Math.round(combin);
        };
        /**
         * 
		 * @private
        */
		this._logCombin = function (n, k) {
            return this._logFactorial(n) - this._logFactorial(k) - this._logFactorial(n - k);
        };
        /**
         * 
		 * @private
        */
		this._logFactorial = function (x) {
            var lf = 0;
            for (var i = 2; i <= x; i++)
                lf = lf + Math.log(i);
            return lf;
        };
        /**
         * 
		 * @private
        */
		this._isCellReference = function (args) {
            if (args == "") {
                return false;
            }
            args = this.setTokensForSheets(args);
            var sheetToken1 = this._sheetToken(args);
            var containsBoth = false;
            if (sheetToken1 != "") {
                args = args.split(this.sheetToken).join("");
            }

            var isAlpha = false, isNum = false;
            if (args.indexOf(':') != args.lastIndexOf(':')) {
                return false;
            }
            var charArray = (args.split('').join(this.getParseArgumentSeparator())).split(this.getParseArgumentSeparator());
            for (var c = 0; c < charArray.length; c++) {
                if (this._isLetter(charArray[c])) {
                    isAlpha = true;
                } else if (this._isDigit(charArray[c])) {
                    if (charArray[c] === 0)
                        return false;
                    isNum = true;
                } else if (charArray[c] == ':') {
                    if (isAlpha && isNum) {
                        containsBoth = true;
                    }
                    isAlpha = false;
                    isNum = false;
                } else
                    return false;
            }
            if (args.indexOf(":") > -1 && args.indexOf(this.tic) == -1) {
                if (containsBoth && isAlpha && isNum)
                    return true;
                else if (((isAlpha && !isNum) || (!isAlpha && isNum)) && !containsBoth) {
                    return true;
                } else
                    return false;
            }
            if (isAlpha && isNum && args.indexOf(this.tic) == -1) {
                return true;
            }

            return false;
        };
        /**
         * 
		 * @private
        */
		this._isDate = function (dateString) {
            var date = new Date(Date.parse(dateString));
            if (date >= this._dateTime1900) {
                return date;
            } else
                return "NaN";
        };
        /**
         * 
		 * @private
        */
		this._isDigit = function (text) {
            var charCode = text.charCodeAt(0);

            if ((charCode > 47) && (charCode < 58)) {
                return true;
            }
            return false;
        };
        /**
         * 
		 * @private
        */
		this._isHLookupCachingEnabled = function () {
            return ((this._enableLookupTableCaching & 3 /* Both */) != 0) || ((this._enableLookupTableCaching & 2 /* HLOOKUP */) != 0);
        };
        /**
         * 
		 * @private
        */
		this._isLetter = function (c) {
            var cc = c.charCodeAt(0);
            if ((cc >= 0x41 && cc <= 0x5A) || (cc >= 0x61 && cc <= 0x7A)) {
                return true;
            }
            return false;
        };
        /**
         * 
		 * @private
        */
		this._isLetterOrDigit = function (c) {
            var cc = c.charCodeAt(0);
            if ((cc >= 0x30 && cc <= 0x39) || (cc >= 0x41 && cc <= 0x5A) || (cc >= 0x61 && cc <= 0x7A)) {
                return true;
            }
            return false;
        };
        /**
         * 
		 * @private
        */
		this._isLookupCachingEnabled = function () {
            return ((this._enableLookupTableCaching & 3 /* Both */) != 0) || ((this._enableLookupTableCaching & 1 /* VLOOKUP */) != 0) || ((this._enableLookupTableCaching & 2 /* HLOOKUP */) != 0);
        };
        /**
         * 
		 * @private
        */
		this._isOptimizedMatchesEnabled = function () {
            return (this._enableLookupTableCaching & 4 /* OptimizeForMatches */) != 0;
        };
        /**
         * 
		 * @private
        */
		this._isRange = function (range) {
            ////checks if range holds a stand-alone range. Used to id when user inputs
            ////a formula that is just a range. Part of the support for using ranges as
            ////operands of binary operators. This method allows a range to be used with
            ////the formula assignment operator, =
            var isRange = false;
            var i = range.indexOf(':');
            if (i > 1 && i < range.length - 2) {
                ////check left side
                var j = i - 1;

                if (this._isDigit(range[j])) {
                    //// left side must end in digit
                    var needToCheckRightSide = false;
                    j--;
                    while (j > 0 && this._isDigit(range[j])) {
                        j--;
                    }

                    if (this._isLetter(range[j])) {
                        ////letters must come now
                        j--;
                        while (j >= 0 && this._isLetter(range[j])) {
                            j--;
                        }

                        if (j > -1 && range[j] == this._string_fixedreference[0]) {
                            j--;
                        }

                        if (j < 0) {
                            needToCheckRightSide = true; ////might have a range
                        } else {
                            if (range[j] == this.sheetToken) {
                                if (j-- > 1 && range[j] == this.tic[0]) {
                                    needToCheckRightSide = range.substring(0, j - 1).lastIndexOf(this.tic[0]) == 0;
                                } else if (j > 0 && this._isDigit(range[j])) {
                                    needToCheckRightSide = range.substring(0, j).lastIndexOf(this.sheetToken) == 0;
                                }
                            }
                        }
                    }

                    if (needToCheckRightSide) {
                        ////check right side
                        j = i + 1;

                        ////handle possible sheetnames
                        if (j < range.length - 6 && range[j] == this.tic[0]) {
                            j = range.indexOf(this.sheetToken, j + 1);
                            if (j < range.length - 2) {
                                j++;
                            }
                        }

                        if (j < range.length - 2 && range[j] == this._string_fixedreference[0]) {
                            j++;
                        }

                        if (this._isLetter(range[j])) {
                            j++;
                            while (j < range.length - 1 && this._isLetter(range[j])) {
                                j++;
                            }

                            if (this._isDigit(range[j])) {
                                j++;
                                while (j < range.length && this._isDigit(range[j])) {
                                    j++;
                                }

                                isRange = j == range.length;
                            }
                        }
                    }
                }
            }

            return isRange;
        };
        /**
         * 
		 * @private
        */
		this._isUpperChar = function (text) {
            var charCode = text.charCodeAt(0);
            return ((charCode > 64) && (charCode < 91));
        };
        /**
         * 
		 * @private
        */
		this._iisVLookupCachingEnabled = function () {
            return ((this._enableLookupTableCaching & 3 /* Both */) != 0) || ((this._enableLookupTableCaching & 1 /* VLOOKUP */) != 0);
        };
        /**
         * 
		 * @private
        */
		this._mark = function (copy, text, op, token, checkPrecedingChar) {
            var loc = 0;
            if (checkPrecedingChar) {
                loc = this._findAndCheckPrecedingChar(copy, op, loc);
                copy = this._findAndCheckPrecedingCharCopy;
            } else
                loc = copy.indexOf(op);
            var len = op.length;
            while (loc > -1) {
                copy = copy.substring(0, loc) + token + copy.substring(loc + len);
                text = text.substring(0, loc) + token + text.substring(loc + len);
                if (checkPrecedingChar) {
                    loc = this._findAndCheckPrecedingChar(copy, op, loc);
                    copy = this._findAndCheckPrecedingCharCopy;
                } else
                    loc = copy.indexOf(op, loc);
            }
            this._markCopy = "";
            return text;
        };
        /**
         * 
		 * @private
        */
		this._markColonsInQuotes = function (args) {
            var inQuotes = false;
            for (var i = 0; i < args.length; ++i) {
                if (args[i] == this.tic[0]) {
                    inQuotes = !inQuotes;
                } else if (args[i] == ':' && inQuotes) {
                    args = args.split(':').join(this._markerChar);
                }
            }
            return args;
        };
        /**
         * 
		 * @private
        */
		this._markIF = function (copy, text) {
            var locIF = copy.indexOf(this.getReservedWordOperators()[this._reservedWord_IF]);
            var locTHEN = copy.indexOf(this.getReservedWordOperators()[this._reservedWord_THEN]);
            var locELSE = copy.indexOf(this.getReservedWordOperators()[this._reservedWord_ELSE]);

            if (locELSE > -1 && locTHEN > -1) {
                var ifStart = this.getReservedWordOperators()[this._reservedWord_IF].length;
                var iflength = locTHEN - ifStart;
                var thenStart = locTHEN + this.getReservedWordOperators()[this._reservedWord_THEN].length;
                var thenlength = locELSE - thenStart;
                var elseStart = locELSE + this.getReservedWordOperators()[this._reservedWord_ELSE].length;
                var elselength = text.length - elseStart;
                text = "IF((" + this._substring(text, ifStart, iflength) + ")" + this.getParseArgumentSeparator() + "(" + this._substring(text, thenStart, thenlength) + ")" + this.getParseArgumentSeparator() + "(" + this._substring(text, elseStart, elselength) + "))";

                copy = text;
            } else if (locTHEN > -1) {
                var ifStart = 0;
                var iflength = locTHEN;
                var thenStart = locTHEN + this.getReservedWordOperators()[this._reservedWord_THEN].length;
                var thenlength = text.length - thenStart + 1;
                text = "IF((" + this._substring(text, ifStart, iflength) + ")" + this.getParseArgumentSeparator() + "(" + this._substring(text, thenStart, thenlength) + "))";

                copy = text;
            }

            this._markIFCopy = text;
            return text;
        };
        /**
         * 
		 * @private
        */
		this._markLibraryFormulas = function (formula) {
            var rightParens = formula.indexOf(')');
            if (rightParens == -1) {
                formula = this._markNamedRanges(formula);
            } else {
                while (rightParens > -1) {
                    var parenCount = 0;
                    var leftParens = rightParens - 1;
                    while (leftParens > -1 && (formula[leftParens] != '(' || parenCount != 0)) {
                        if (formula[leftParens] == ')') {
                            parenCount++;
                        } else if (formula[leftParens] == ')') {
                            parenCount--;
                        }

                        leftParens--;
                    }

                    if (leftParens == -1) {
                        throw this.formulaErrorStrings[this._mismatched_parentheses];
                    }

                    var i = leftParens - 1;
                    while (i > -1 && (this._isLetterOrDigit(formula[i]) || this._validFunctionNameChars.indexOf(formula[i]) > -1 || formula[i] == this.getParseDecimalSeparator())) {
                        i--;
                    }

                    var len = leftParens - i - 1;
                    if (len > 0 && this.getLibraryFunctions().getItem(this._substring(formula, i + 1, len)) != undefined) {
                        if (this._substring(formula, i + 1, len) == "AREAS")
                            this._ignoreBracet = true;
                        else
                            this._ignoreBracet = false;
                        var s = this._substring(formula, leftParens, rightParens - leftParens + 1);
                        s = this._markNamedRanges(s);
                        formula = formula.substring(0, i + 1) + 'q' + this._substring(formula, i + 1, len) + (s.split('(').join(this._leftBracket)).split(')').join(this._rightBracket) + formula.substring(rightParens + 1);
                    } else if (len > 0) {
                        if (this.unknownFunction != null) {
                            var family = CalcEngine.getSheetFamilyItem(this.grid);
                            var grd = this.grid;
                            var sheet = this._sheetToken(this.cell);
                            var s = this.cell;
                            if (sheet.length > 0) {
                                grd = family.tokenToParentObject.getItem(sheet);
                                s = s.substring(s.lastIndexOf(this.sheetToken) + 1);
                            }

                            var sheetNamekeys = family.sheetNameToParentObject.keys();
                            for (var key = 0; key < sheetNamekeys.length; key++) {
                                if (family.sheetNameToParentObject.getItem(sheetNamekeys[key]) == grd) {
                                    s = sheetNamekeys[key] + this.sheetToken + s;
                                    break;
                                }
                            }

                            var args = new UnknownFunctionEventArgs();
                            args.setMissingFunctionName(this._substring(formula, i + 1, len));
                            args.setCellLocation(s);

                            this.unknownFunction(this, args);
                            if (formula.substring(i + 1, len) == "AREAS")
                                this._ignoreBracet = true;
                            else
                                this._ignoreBracet = false;
                        }
                        if (this.getRethrowLibraryComputationExceptions())
                            throw this.formulaErrorStrings[this._unknown_formula_name] + " " + this._substring(formula, i + 1, len);
                        return this.getErrorStrings()[5].toString();

                    } else {
                        var s = "";
                        if (leftParens > 0) {
                            s = formula.substring(0, leftParens);
                        }

                        s = s + '{' + this._substring(formula, leftParens + 1, rightParens - leftParens - 1) + '}';
                        if (rightParens < formula.length) {
                            s = s + formula.substring(rightParens + 1);
                        }

                        s = this._markNamedRanges(s);
                        formula = s;
                    }

                    rightParens = formula.indexOf(')');
                }
            }

            formula = (formula.split('{').join('(')).split('}').join(')');
            return formula;
        };
        /**
         * 
		 * @private
        */
		this._markNamedRanges = function (argList) {
            ////Console.WriteLine("MarkNamedRanges in#{0}#", argList);
            var rightParens = argList.indexOf(')');
            var markers = [')', this.getParseArgumentSeparator(), '}', '+', '-', '*', '/', '<', '>', '=', '&'];

            //  int i = (argList.length > 0 && argList[0] == '(')
            var i = (argList.length > 0 && (argList[0] == '(' || argList[0] == '{')) ? 1 : 0;
            if (argList.indexOf("#N/A") > -1) {
                argList = argList.split("#N/A").join("#N~A");
            }
            if (argList.indexOf("#DIV/0!") > -1) {
                argList = argList.split("#DIV/0!").join("#DIV~0!");
            }
            var end = i;
            if (argList.indexOf("[") == -1 || argList.indexOf("[") > this._indexOfAny(argList.substring(i),markers))
                end = this._indexOfAny(argList.substring(i), markers);
            else
                end = this._findNextEndIndex(argList, end);

            while (end > -1 && end + i < argList.length) {
                var scopedRange = "";
                var s = null;
                if ((this._substring(argList, i, end)).indexOf("[") > -1) {
                    s = this._getTableRange(this._substring(argList, i, end));
                }
                else {
                    s = this.getNamedRanges().getItem(this._substring(argList, i, end));
                }
                if (s != undefined && !(typeof s === 'string'))
                    s = s.getItem(this._substring(argList, i, end));
                if (s == null) {
                    scopedRange = this._checkIfScopedRange(this._substring(argList, i, end));
                    if (!isNaN(scopedRange)) {
                        s = scopedRange;
                    } else if (this._substring(argList, i, end).startsWith(this.sheetToken.toString())) {
                        var iii = this._substring(argList, i, end).indexOf(this.sheetToken, 1);
                        if (iii > 1) {
                            s = this.getNamedRanges().getItem(this._substring(argList.substring(i), iii + 1, end - iii - 1));
                        }
                    }
                }
                if (s != null) {
                    s = s.toUpperCase();
                    s = this.setTokensForSheets(s);
                    s = this._markLibraryFormulas(s); ////recursive call
                }

                if (s != null) {
                    argList = argList.substring(0, i) + s + argList.substring(i + end);
                    i += s.length + 1;
                } else {
                    i += end + 1;
                    while (i < argList.length && !this._isUpperChar(argList[i]) && argList[i] != this.sheetToken) {
                        i++;
                    }
                }
                end = i;// argList.Substring(i).IndexOfAny(markers);
                if (argList.indexOf("[") == -1 || argList.indexOf("[") > this._indexOfAny(argList.substring(i), markers))
                    end = this._indexOfAny(argList.substring(i), markers);
                else
                    end = this._findNextEndIndex(argList, end);
                end = this._indexOfAny(argList.substring(i), markers);
                while (end == 0 && i < argList.length - 1) {
                    i++;
                    end = this._indexOfAny(argList.substring(i), markers);
                }

                if ((end == -1 || argList.substring(i).indexOf("[") >-1) && i < argList.length) {
                    if (argList.substring(i).indexOf("[") > -1) {
                        s = this._getTableRange(argList.substring(i));
                    }
                    else {
                        ////check last part of arglist
                        s = this.getNamedRanges().length > 0 ? this.getNamedRanges().getItem(argList.substring(i)) : s;
                    }
                    if (s == null) {
                        scopedRange = this._checkIfScopedRange(argList.substring(i));
                        if (!isNaN(scopedRange))
                            s = scopedRange;
                    }
                    if (s != null) {
                        s = s.toUpperCase();
                        s = this.setTokensForSheets(s);
                        s = this._markLibraryFormulas(s);
                        if (s != null) {
                            argList = argList.substring(0, i) + s; //// +argList.Substring(i + end);
                            i += s.toString().length + 1;
                        }
                    }

                    end = (i < argList.length) ? this._indexOfAny(argList.substring(i), markers) : -1;
                }
            }
            if (argList.indexOf("#N~A") > -1) {
                argList = argList.split("#N~A").join("#N/A");
            }

            if (argList.indexOf("#DIV~0!") > -1) {
                argList = argList.split("#DIV~0!").join("#DIV/0!");
            }
            return argList;
        };
        /**
         * 
		 * @private
        */
		this._markReserveWords = function (text) {
            var copy = text.toLowerCase();
            var trimStr = (this._isIE8) ? copy.replace(/^\s+|\s+$/g, '') : copy.trim();
            if (trimStr[0] == (this.getReservedWordOperators()[this._reservedWord_IF])) {
                text = this._markIF(copy, text);
                copy = this._markIFCopy;
            }

            text = this._mark(copy, text, this.getReservedWordOperators()[this._reservedWord_NOT], this.char_NOTop, true);
            copy = this._markCopy;
            text = this._mark(copy, text, this.getReservedWordOperators()[this._reservedWord_OR], this.char_ORop, false);
            copy = this._markCopy;
            text = this._mark(copy, text, this.getReservedWordOperators()[this._reservedWord_AND], this.char_ANDop, false);
            copy = this._markCopy;
            text = this._mark(copy, text, this.getReservedWordOperators()[this._reservedWord_XOR], this.char_XORop, false);
            copy = this._markCopy;
            return text;
        };
        /**
         * 
		 * @private
        */
		this._markupResultToIncludeInFormula = function (s) {
            var d3;
            if (s.length > 0 && s[0] == '-' && !isNaN(this._parseDouble(s))) {
                s = "nu" + s.substring(1);
            } else if (s.length > 0 && (s[0] == this.tic[0] || s[0] == this.bMARKER || s[0] == '#')) {
                ////Pass on the string...
            } else if (s[0] == this.trueValueStr || s[0] == this.falseValueStr) {
                ////Pass on the bool...
            } else {
                ////if(double.TryParse(s, NumberStyles.Any, null, out d))
                if (!isNaN(this._parseDouble(s))) {
                    // s = d.toString(); ////defect 8721
                    s = s.split(this.getParseArgumentSeparator()).join(String.fromCharCode(32));

                    s = 'n' + s;
                } else {
                    if (!this._isRange(s)) {
                        s = this.tic + s + this.tic;
                    }
                }
            }
            return s;
        };
        /**
         * 
		 * @private
        */
		this._matchCompare = function (o1, o2) {
            var s1 = o1.toString();
            var s2 = o2.toString();
            var d1 = this._parseDouble(s1), d2 = this._parseDouble(s2);
            if (!isNaN(d1) && !isNaN(d2)) {
                if (d1 == d2)
                    return 0;
                if (d1 > d2)
                    return 1;
                else
                    return -1;
            } else {
                if (s1 == s2)
                    return 0;
                if (s1 > s2)
                    return 1;
                else
                    return -1;
            }
        };
        /**
         * 
		 * @private
        */
		this._matchingRightBracket = function (formula) {
            var ret = -1;
            var loc = 1;
            var bracketLevel = 0;
            var token = this._sheetToken(formula);
            while (ret == -1 && loc < formula.length) {
                if (formula[loc] == this._rightBracket) {
                    if (bracketLevel == 0) {
                        ret = loc;
                    } else {
                        bracketLevel--;
                        if (bracketLevel == 0 && loc == formula.length - 1) {
                            ret = loc;
                        }
                    }
                } else if (formula[loc] == 'q') {
                    var val = loc + 1;
                    if (val < formula.length) {
                        var libFunc = this._processUpperCase(formula, val, token);
                        formula = this._processUpperCaseFormula;
                        val = this._processUpperCaseIvalue;
                        token = this._processUpperCaseSheet;
                        if (libFunc != "" && this.getLibraryFunctions().containsKey(libFunc))
                            bracketLevel++;
                    }
                }

                loc++;
            }

            return ret;
        };
        /**
         * 
		 * @private
        */
		this._notInBlock = function (text, position) {
            var i = text.indexOf(this.bMARKER);
            var inBlock = false;
            while (i > -1 && i < position) {
                inBlock = !inBlock;
                i = text.indexOf(this.bMARKER, i + 1);
            }

            return !inBlock;
        };
        /**
         * 
		 * @private
        */
		this._getTopRowIndexFromRange = function (range) {
		    range = this._markColonsInQuotes(range);
		    var row1, col1;
		    var i = range.indexOf(':');
		    if (i == -1)
		        return this.rowIndex(range);
		    var sheet = "";
		    var j = range.indexOf(this.sheetToken);
		    if (j > -1) {
		        var j1 = range.indexOf(this.sheetToken, j + 1);
		        if (j1 > -1) {
		            sheet = this._substring(range, j, j1 - j + 1);
		            range = range.replace(sheet, "");
		            i = range.indexOf(':');
		        }
		    }
		    row1 = this.rowIndex(range.substring(0, i));
		    return row1;
		};

        /**
         * 
		 * @private
        */
		this._getTableRange = function (text) {
		    text = text.replace(" ", "").toUpperCase();
		    var name = text.replace("]", "").replace("#DATA", "");
		    var tableName = name;
		    if (name.indexOf(this.getParseArgumentSeparator()) > -1) {
		        tableName = name.substring(0, name.indexOf(this.getParseArgumentSeparator())).replace("[", "");
		        name = name.replace("[", "").replace(this.getParseArgumentSeparator(), '_');
		    }
		    var range = "";
		    if (text.indexOf("#THISROW") > -1) {
		        var cellRange = this.getNamedRanges().getItem(name.replace("#THISROW", ""));

		        if (cellRange != undefined && !(typeof cellRange === 'string'))
		            cellRange = cellRange.getItem(name.replace("#THISROW", ""));
		        if (cellRange == null)
		            return cellRange;
		        cellRange = cellRange.toUpperCase();
		        var row = this.rowIndex(this.cell);
		        cellRange = cellRange.replace(this._string_fixedreference, "");

		        cellRange = this.setTokensForSheets(cellRange);
		        var startindex = 0;
		        var rangeTable = this.getNamedRanges().getItem(tableName.Replace("#THISROW", ""));
		        if (rangeTable != undefined && !(typeof rangeTable === 'string'))
		            rangeTable = rangeTable.getItem(tableName.Replace("#THISROW", ""));
		        rangeTable = rangeTable.replace(this._string_fixedreference, "").toUpperCase();
		        rangeTable = this.setTokensForSheets(rangeTable);
		        var topRow = this._getTopRowIndexFromRange(cellRange);
		        range = this.getCellsFromArgs(cellRange)[row - topRow];
		    }
		    else {
		        name = (name[name.length - 1] == "[") ? name.replace("[", "") : name.replace("[", "_");
		        if (name.indexOf("#TOTALS") > -1 || name.indexOf("#ALL") > -1 || name.indexOf("#HEADERS") > -1 || name.indexOf("#DATA") > -1)
		            name = name.replace("#", "");
		        range = this.getNamedRanges().getItem(name);
		        if (range != undefined && !(typeof range === 'string'))
		            range = range.getItem(name);
		        if (range == null)
		            return null;
		    }
		    return range.toUpperCase();;
		};
        /**
         * 
		 * @private
        */
		this._parse = function (formulaText) {
            var text = formulaText;
            if (this._isTextEmpty(text)) {
                return text;
            }
            text = this.getFormulaText(text);

            if (this.getSupportLogicalOperators()) {
                text = this._markReserveWords(text);
            }

            if (this.getFormulaCharacter() != String.fromCharCode(0) && this.getFormulaCharacter() == text[0]) {
                text = text.substring(1);
            }

            ////Special check for single namedrange.
            if (this.getNamedRanges().length > 0) {
                if (text.indexOf("[") > -1) {
                    var namerangeVal = this._getTableRange(text);
                    if (namerangeVal != null)
                        text = namerangeVal;
                }
                if (this.getNamedRanges().getItem(text.toUpperCase()) != undefined) {
                    text = this.getNamedRanges().getItem(text.toUpperCase()).toUpperCase();
                } else {
                    var scopedRange = "";
                    scopedRange = this._checkIfScopedRange(text.toUpperCase());
                    if (!isNaN(scopedRange)) {
                        text = scopedRange.toUpperCase();
                    }
                }
            }

            var formulaStrings = this._saveStrings(text);
            text = this._saveStringsText;
            text = text.split(this.braceLeft).join(this.tic);
            text = text.split(this.braceRight).join(this.tic);

            text = text.split("-+").join("-");
            var i = 0;
            if (text[text.length - 1] != this.bMARKER || this._indexOfAny(text, this.tokens) != (text.length - 2))
                text = text.toUpperCase();

            if (text.indexOf(this.sheetToken) > -1) {
                //replace sheet references with tokens.
                var family = CalcEngine.getSheetFamilyItem(this.grid);
                if (family.sheetNameToParentObject != null && family.sheetNameToParentObject.length > 0) {
                    try  {
                        text = this.setTokensForSheets(text);
                    } catch (ex) {
                        if (this._rethrowExceptions) {
                            throw ex;
                        } else {
                            return ex;
                        }
                    }
                }
            }

            if (this._isRangeOperand) {
                this._isRangeOperand = false;
                return this._getCellFrom(this._parseSimple(text));
            }

            ////next 3 lines moved from above - //keep the tic defect#541
            text = text.split(" ").join("");
            text = text.split("=>").join(">=");
            text = text.split("=<").join("<=");

            try  {
                text = this._markLibraryFormulas(text);
            } catch (ex) {
                if (this._rethrowExceptions) {
                    throw ex;
                } else {
                    return ex;
                }
            }

            ////Look for inner matching and parse pieces without parens with ParseSimple.
            if (!this._ignoreBracet) {
                while ((i = text.indexOf(')')) > -1) {
                    var k = text.substring(0, i).lastIndexOf('(');
                    if (k == -1) {
                        throw this.formulaErrorStrings[this._mismatched_parentheses];
                    }

                    if (k == i - 1) {
                        throw this.formulaErrorStrings[this._empty_expression];
                    }
                    var s = "";
                    if (this._ignoreBracet) {
                        s = this._substring(text, k, i - k + 1);
                    } else
                        s = this._substring(text,k + 1, i - k - 1);
                    text = text.substring(0, k) + this._parseSimple(s) + text.substring(i + 1);
                }
            }

            ////All parens should have been removed.
            if (!this._ignoreBracet && text.indexOf('(') > -1) {
                throw this.formulaErrorStrings[this._mismatched_parentheses];
            }

            var retValue = this._parseSimple(text);

            if (formulaStrings != null && formulaStrings.length > 0) {
                retValue = this._setStrings(retValue, formulaStrings);
            }
            return retValue;
        };
        /**
         * 
		 * @private
        */
		this._parseDouble = function (value) {
            return !isNaN(parseInt(value)) ? Number(value.replace(/[^0-9\.]-+/g,"")) * 1 : NaN;
        };
        /**
         * 
		 * @private
        */
		this._parseSimple = function (formulaText) {
            var text = formulaText;

            ////strip leading plus
            if (text.length > 0 && text[0] == '+') {
                text = text.substring(1);
            }

            if (text == "#N/A" || text == "#N~A") {
                return "#N/A";
            } else if (text.indexOf("#N/A") > -1) {
                text = text.split("#N/A").join("#N~A");
            }
            if (text == "#DIV/0!" || text == "#DIV~0!") {
                return "#DIV/0!";
            } else if (text.indexOf("#DIV/0!") > -1) {
                text = text.split("#DIV/0!").join("#DIV~0!");
            }

            text = this._handleEmbeddedEs(text);

            text = text.split(this._string_lesseq).join(this.char_lesseq);
            text = text.split(this._string_greatereq).join(this.char_greatereq);
            text = text.split(this._string_noequal).join(this.char_noequal);
            text = text.split(this._string_fixedreference).join(this._string_empty);
            text = text.split(this._string_or).join(this.char_or);
            text = text.split(this._string_and).join(this.char_and);

            if (text == "") {
                return text;
            }

            var needToContinue = true;

            ////doing things sequentially imposes computation hierarchy for 6 levels
            //// 0. E+ E- //handles exponential notation like 1.2e-1 or 1.2e+1 to 1.2e1
            //// 1. ^ exponentiation
            //// 2. * /
            //// 3. + -
            //// 4. < > = <= >= <>
            //// 5. & concatenation
            //// in each level parsing done left to right
            var expTokenArray = [this.token_EP, this.token_EM];
            var orTokenArray = [this.token_or];
            var mulTokenArray = [this.token_multiply, this.token_divide];
            var addTokenArray = [this.token_add, this.token_subtract];
            var compareTokenArray = [this.token_less, this.token_greater, this.token_equal, this.token_lesseq, this.token_greatereq, this.token_noequal];
            var notTokenArray = [this.token_NOTop];
            var logicTokenArray = [this.token_ORop, this.token_ANDop, this.token_XORop];
            var andTokenArray = [this.token_and];

            var expCharArray = [this.char_EP, this.char_EM];
            var orCharArray = [this.char_or];
            var mulCharArray = [this.char_multiply, this.char_divide];
            var addCharArray = [this.char_add, this.char_subtract];
            var compareCharArray = [this.char_less, this.char_greater, this.char_equal, this.char_lesseq, this.char_greatereq, this.char_noequal];
            var notCharArray = [this.char_NOTop];
            var logicCharArray = [this.char_ORop, this.char_ANDop, this.char_XORop];
            var andCharArray = [this.char_and];

            text = this._parseSimpleOperators(text, expTokenArray, expCharArray);

            text = this._parseSimpleOperators(text, orTokenArray, orCharArray);

            if (needToContinue) {
                text = this._parseSimpleOperators(text, mulTokenArray, mulCharArray);
            }

            if (needToContinue) {
                text = this._parseSimpleOperators(text, addTokenArray, addCharArray);
            }

            if (needToContinue) {
                text = this._parseSimpleOperators(text, compareTokenArray, compareCharArray);
            }

            if (needToContinue) {
                text = this._parseSimpleOperators(text, notTokenArray, notCharArray);
            }

            if (needToContinue) {
                text = this._parseSimpleOperators(text, logicTokenArray, logicCharArray);
            }

            if (needToContinue) {
                text = this._parseSimpleOperators(text, andTokenArray, andCharArray);
            }

            if (text.indexOf("#N~A") > -1) {
                text = text.split("#N~A").join("#N/A");
            }

            if (text.indexOf("#DIV~0!") > -1) {
                text = text.split("#DIV~0!").join("#DIV/0!");
            }
            return text;
        };
        /**
         * 
		 * @private
        */
		this._parseSimpleOperators = function (formulaText, markers, operators) {
            var text = formulaText;
            var i;

            ////op is string containing this.char_xxxx's for each operator in this level
            var op = "";
            for (var c = 0; c < operators.length; c++) {
                op = op + operators[c];
            }

            //text = sb.replace(",-", ",u").replace(this._leftBracket + "-", this._leftBracket + "u").replace("=-", "=u").replace(">-", ">u").replace("<-", "<u").replace("/-", "/u").replace("*-", "*u").replace("+-", "+u").replace("--", "-u").replace("w-", "wu").toString();
            text = text.split("---").join("-").split("--").join("+").split(this.getParseArgumentSeparator() + "-").join(this.getParseArgumentSeparator() + "u").split(this._leftBracket + "-").join(this._leftBracket + "u").split("=-").join("=u");
            text = text.split(">-").join(">u").split("<-").join("<u").split("/-").join("/u").split("*-").join("*u").split("+-").join("-").split("--").join("-u").split("w-").join("wu").split(this.tic + "-").join(this.tic + "u").toString();

            ////Get rid of leading pluses.
            text = text.split(",+").join(",").split(this._leftBracket + "+").join(this._leftBracket).split("=+").join("=").split(">+").join(">").split("<+").join("<").split("/+").join("/").split("*+").join("*").split("++").join("+").toString();

            if (text.length > 0 && text[0] == '-') {
                ////Leading unary minus.
                text = "0" + text;
            } else if (text.length > 0 && text[0] == '+') {
                ////Leading plus.
                text = text.substring(1);
            }

            if (this._indexOfAny(text, operators) > -1) {
                while ((i = this._indexOfAny(text, operators)) > -1) {
                    var left = "";
                    var right = "";

                    var leftIndex = 0;
                    var rightIndex = 0;
                    var isNotOperator = this._supportLogicalOperators && text[i] == this.char_NOTop;
                    var j = 0;

                    if (!isNotOperator) {
                        if (i < 1 && text[i] != '-') {
                            throw this.formulaErrorStrings[this._operators_cannot_start_an_expression];
                        }

                        j = i - 1;

                        if (i == 0 && text[i] == '-') {
                            ////Unary minus - block and continue.
                            text = this.bMARKER + "nu" + text.substring(1) + this.bMARKER;
                            continue;
                        } else if (text[j] == this.tic[0]) {
                            ////string
                            var k = text.substring(0, j - 1).lastIndexOf(this.tic);
                            if (k < 0) {
                                throw this.formulaErrorStrings[this._cannot_parse];
                            }

                            left = this._substring(text, k, j - k + 1); ////Keep the tics.
                            leftIndex = k;
                        } else if (text[j] == this.bMARKER) {
                            var k = this._findLastNonQB(text.substring(0, j - 1));
                            if (k < 0) {
                                throw this.formulaErrorStrings[this._cannot_parse];
                            }
                            left = this._substring(text, k + 1, j - k - 1);
                            leftIndex = k + 1;
                        } else if (text[j] == this._rightBracket) {
                            ////Library member.
                            var bracketCount = 0;
                            var k = j - 1;
                            while (k > 0 && (text[k] != 'q' || bracketCount != 0)) {
                                if (text[k] == 'q') {
                                    bracketCount--;
                                } else if (text[k] == this._rightBracket) {
                                    bracketCount++;
                                }

                                k--;
                            }

                            if (k < 0) {
                                throw this.formulaErrorStrings[this._cannot_parse];
                            }

                            left = this._substring(text, k, j - k + 1);
                            leftIndex = k;
                        } else if (!this._isDigit(text[j]) && text[j] != '%') {
                            while (j >= 0 && (this._isUpperChar(text[j]) || text[j] == '_' || text[j] == '.')) {
                                j--;
                            }

                            left = this._substring(text, j + 1, i - j - 1); ////'n' for number
                            leftIndex = j + 1;
                            var scopedRange = "";

                            if (this.getNamedRanges().containsKey(left) > -1) {
                                left = this._parse(this.getNamedRanges()[left]);
                            } else if (!isNaN(scopedRange = this._checkIfScopedRange(left, scopedRange))) {
                                left = this._parse(scopedRange);
                            } else if (left == this.trueValueStr) {
                                left = 'n' + this.trueValueStr;
                            } else if (left == this.falseValueStr) {
                                left = 'n' + this.falseValueStr;
                            } else {
                                if (this.getRethrowLibraryComputationExceptions())
                                    throw this.formulaErrorStrings[this._invalid_char_in_front_of]  + " " + text[i];
                                return this.getErrorStrings()[5].toString();
                            }
                        } else {
                            var period = false;
                            var percent = false;

                            while (j > -1 && (this._isDigit(text[j]) || (!period && text[j] == this.getParseDecimalSeparator()) || (!percent && text[j] == '%') || text[j] == 'u')) {
                                if (text[j] == this.getParseDecimalSeparator()) {
                                    period = true;
                                } else if (text[j] == '%') {
                                    percent = true;
                                }
                                j = j - 1;
                            }

                            ////Add error check for 2%.
                            if (j > -1 && period && text[j] == this.getParseDecimalSeparator()) {
                                throw this.formulaErrorStrings[this._number_contains_2_decimal_points];
                            }

                            j = j + 1;

                            if (j == 0 || (j > 0 && !this._isUpperChar(text[j - 1]))) {
                                left = 'n' + this._substring(text, j, i - j); ////'n' for number
                                leftIndex = j;
                            } else {
                                ////We have a cell reference.
                                j = j - 1;
                                while (j > -1 && this._isUpperChar(text[j])) {
                                    j = j - 1;
                                }

                                ////include any unary minus as part of the left piece
                                if (j > -1 && text[j] == 'u') {
                                    j = j - 1;
                                }
                                if (j > -1 && text[j] == this.sheetToken) {
                                    j = j - 1;
                                    while (j > -1 && text[j] != this.sheetToken) {
                                        j = j - 1;
                                    }

                                    if (j > -1 && text[j] == this.sheetToken) {
                                        j = j - 1;
                                    }
                                }

                                if (j > -1 && text[j] == ':') {
                                    //// handle range operands
                                    j = j - 1;
                                    while (j > -1 && this._isDigit(text[j])) {
                                        j = j - 1;
                                    }

                                    while (j > -1 && this._isUpperChar(text[j])) {
                                        j = j - 1;
                                    }

                                    if (j > -1 && text[j] == this.sheetToken) {
                                        j--;
                                        while (j > -1 && text[j] != this.sheetToken) {
                                            j--;
                                        }

                                        if (j > -1 && text[j] == this.sheetToken) {
                                            j--;
                                        }
                                    }

                                    j = j + 1;
                                    left = this._substring(text, j, i - j);
                                    left = this._getCellFrom(left);
                                } else {
                                    //// handle normal cell reference
                                    j = j + 1;
                                    left = this._substring(text, j, i - j);
                                }
                                this.updateDependencies(left);
                                leftIndex = j;
                            }
                        }
                    } else {
                        leftIndex = i;
                    }
                    if (i == text.length - 1) {
                        throw this.formulaErrorStrings[this._expression_cannot_end_with_an_operator];
                    } else {
                        j = i + 1;

                        var isU = text[j] == 'u';
                        if (isU) {
                            j++; ////ship for now, but add back later
                        }

                        if (text[j] == this.tic[0]) {
                            ////string
                            var k = text.substring(j + 1).indexOf(this.tic);
                            if (k < 0) {
                                throw this.formulaErrorStrings[this._cannot_parse];
                            }

                            right = this._substring(text, j, k + 2);
                            rightIndex = k + j + 2;
                        } else if (text[j] == this.bMARKER) {
                            ////Block of already parsed code.
                            var k = this._findNonQB(text.substring(j + 1));
                            if (k < 0) {
                                throw this.formulaErrorStrings[this._cannot_parse];
                            }

                            right = this._substring(text, j + 1, k);

                            if (isU) {
                                right = right + "nu1m"; ////multiply quantity by -1...
                            }

                            rightIndex = k + j + 2;
                        } else if (text[j] == 'q') {
                            ////library
                            var bracketCount = 0;
                            var k = j + 1;
                            while (k < text.length && (text[k] != this._rightBracket || bracketCount != 0)) {
                                if (text[k] == this._rightBracket) {
                                    bracketCount++;
                                } else if (text[k] == 'q') {
                                    bracketCount--;
                                }

                                k++;
                            }

                            if (k == text.length) {
                                throw this.formulaErrorStrings[this._cannot_parse];
                            }

                            right = this._substring(text, j, k - j + 1);

                            if (isU) {
                                right = 'u' + right;
                            }

                            rightIndex = k + 1;
                        } else if (this._isDigit(text[j]) || text[j] == this.getParseDecimalSeparator()) {
                            var period = text[j] == this.getParseDecimalSeparator();
                            j = j + 1;
                            while (j < text.length && (this._isDigit(text[j]) || (!period && text[j] == this.getParseDecimalSeparator()))) {
                                if (text[j] == this.getParseDecimalSeparator()) {
                                    period = true;
                                }

                                j = j + 1;
                            }

                            if (j < text.length && text[j] == '%') {
                                j += 1;
                            }

                            if (period && j < text.length && text[j] == this.getParseDecimalSeparator()) {
                                throw this.formulaErrorStrings[this._number_contains_2_decimal_points];
                            }
                            right = 'n' + this._substring(text, i + 1, j - i - 1);
                            rightIndex = j;
                        } else if (this._isUpperChar(text[j]) || text[j] == this.sheetToken || text[j] == 'u') {
                            if (text[j] == this.sheetToken) {
                                j++;
                                while (j < text.length && text[j] != this.sheetToken) {
                                    j++;
                                }
                            }
                            j = j + 1;
                            var j0 = 0;
                            while (j < text.length && (this._isUpperChar(text[j]) || text[j] == '_' || text[j] == '.')) {
                                j++;
                                j0++;
                            }

                            var noCellReference = (j == text.length) || !this._isDigit(text[j]);

                            if (j0 > 4) {
                                while (j < text.length && (this._isUpperChar(text[j]) || this._isDigit(text[j]))) {
                                    j++;
                                }

                                noCellReference = true;
                            }

                            while (j < text.length && this._isDigit(text[j])) {
                                j = j + 1;
                            }

                            if (j < text.length && text[j] == ':') {
                                //// handle range operands
                                j = j + 1;
                                if (j < text.length && text[j] == this.sheetToken) {
                                    j++;
                                    while (j < text.length && text[j] != this.sheetToken) {
                                        j = j + 1;
                                    }

                                    if (j < text.length && text[j] == this.sheetToken) {
                                        j++;
                                    }
                                }

                                while (j < text.length && this._isUpperChar(text[j])) {
                                    j = j + 1;
                                }

                                while (j < text.length && this._isDigit(text[j])) {
                                    j = j + 1;
                                }

                                j = j - 1;

                                right = this._substring(text, i + 1, j - i);
                                right = this._getCellFrom(right);
                            } else {
                                //// handle normal cell reference
                                j = j - 1;
                                right = this._substring(text, i + 1, j - i);
                                isU = text[j] == 'u';
                                if (isU) {
                                    right = 'u' + right;
                                }
                            }
                            if (!noCellReference) {
                                this.updateDependencies(right);
                            } else {
                                var scopedRange = "";
                                if (this.getNamedRanges().getItem(right) > -1) {
                                    right = this._parse(this.getNamedRanges()[right]);
                                } else if (!isNaN(scopedRange = this._checkIfScopedRange(right, scopedRange))) {
                                    right = this._parse(scopedRange);
                                } else if (right == this.trueValueStr) {
                                    right = 'n' + this.trueValueStr;
                                } else if (right == this.falseValueStr) {
                                    right = 'n' + this.falseValueStr;
                                } else {
                                    if(this.getRethrowLibraryComputationExceptions())
                                        throw this.formulaErrorStrings[this._invalid_characters_following_an_operator];
                                    return this.getErrorStrings()[5].toString();
                                }
                            }

                            rightIndex = j + 1;
                        } else {
                            if(this.getRethrowLibraryComputationExceptions())
                                        throw this.formulaErrorStrings[this._invalid_characters_following_an_operator];
                                    return this.getErrorStrings()[5].toString();
                        }
                    }
                    var p = op.indexOf(text[i]);
                    var s = this.bMARKER + this._zapBlocks(left) + this._zapBlocks(right) + markers[p] + this.bMARKER;
                    if (leftIndex > 0) {
                        s = text.substring(0, leftIndex) + s;
                    }

                    if (rightIndex < text.length) {
                        s = s + text.substring(rightIndex);
                    }

                    s = s.split(this.bMARKER2).join(this.bMARKER.toString());

                    //// s = s.replace(tic+tic, tic); removed forum post http://64.78.18.34/Support/Forums/message.aspx?MessageID=22483
                    text = s;
                }
            } else {
                ////Process left argument.
                var j = text.length - 1;
                if (text[j] == this.bMARKER) {
                    var k = this._findLastNonQB(text.substring(0, j - 1));
                    if (k < 0) {
                        throw this.formulaErrorStrings[this._cannot_parse];
                    }
                } else if (text[j] == this._rightBracket) {
                    ////library member
                    var bracketCount = 0;
                    var k = j - 1;
                    while (k > 0 && (text[k] != 'q' || bracketCount != 0)) {
                        if (text[k] == 'q') {
                            bracketCount--;
                        } else if (text[k] == this._rightBracket) {
                            bracketCount++;
                        }

                        k--;
                    }

                    if (k < 0) {
                        throw this.formulaErrorStrings[this._bad_library];
                    }
                } else if (!this._isDigit(text[j])) {
                    // return "ERROR";
                } else {
                    var period = false;
                    var percent = false;

                    while (j > -1 && (this._isDigit(text[j]) || (!period && text[j] == this.getParseDecimalSeparator()) || (!percent && text[j] == '%'))) {
                        if (text[j] == this.getParseDecimalSeparator()) {
                            period = true;
                        } else if (text[j] == '%') {
                            percent = true;
                        }

                        j = j - 1;
                    }

                    if (j > -1 && period && text[j] == this.getParseDecimalSeparator()) {
                        throw this.formulaErrorStrings[this._number_contains_2_decimal_points];
                    }
                }
                if (text.length > 0 && (this._isUpperChar(text[0]) || text[0] == this.sheetToken)) {
                    ////Check if cell reference.
                    var ok = true;
                    var checkLetter = true;
                    var oneTokenFound = false;
                    for (var k = 0; k < text.length; ++k) {
                        if (text[k] == this.sheetToken) {
                            if (k > 0 && !oneTokenFound) {
                                throw this.formulaErrorStrings[this._missing_sheet];
                                ////break;
                            }

                            oneTokenFound = true;
                            k++;
                            while (k < text.length && this._isDigit(text[k])) {
                                k++;
                            }

                            if (k == text.length || text[k] != this.sheetToken) {
                                ok = false;
                                break;
                            }
                        } else {
                            ////if(!checkLetter && char.IsUpper(text, k))
                            if (!checkLetter && this._isLetter(text, k)) {
                                ok = false;
                                break;
                            }

                            if (this._isLetterOrDigit(text[k]) || text[k] == this.sheetToken) {
                                checkLetter = this._isUpperChar(text[k]);
                            } else {
                                ok = false;
                                break;
                            }
                        }
                    }

                    if (ok) {
                        this.updateDependencies(text); ////cb
                        //needToContinue = false;
                    }
                }
            }
            return text;
        };
        /**
         * 
		 * @private
        */
		this._pop = function (_stack) {
            var o = _stack.pop();

            var s;
            if (o != null) {
                if (o.toString() == this.tic + this.tic) {
                    return NaN;
                } else
                    s = o.toString().split(this.tic).join("");
                if (this.getErrorStrings().indexOf(s) > -1) {
                    this._isErrorString = true;
                    return this.getErrorStrings().indexOf(s);
                }

                ////moved from ComputedValue above as result of DT26064
                if (s[0] == "#" || s == "") {
                    return 0;
                }

                if (s == this.trueValueStr) {
                    return 1;
                } else if (s == this.falseValueStr) {
                    return 0;
                }

                var d = this._parseDouble(s);
                if (!isNaN(d)) {
                    return d;
                } else if (this.getUseDatesInCalculations() && isNaN(this._parseDouble(o))) {
                    var dt = this._isDate(s);
                    if (!isNaN(dt))
                        return this._getSerialDateTimeFromDate(dt);
                    else
                        return 0;
                }
            }
            if (s == ""  && this.getTreatStringsAsZero()) {
                return 0;
            }
            else if (o != null && o.toString().length > 0) {
                return Number.NaN;
            }
            return 0;
        };
        /**
         * 
		 * @private
        */
		this._popString = function (_stack) {
            var o = _stack.pop();
            var number = this._parseDouble(o);
            if (o == null) {
                o = "";
            } else if (!isNaN(number)) {
                return number.toString();
            } else if (this.getUseDatesInCalculations() && isNaN(this._parseDouble(o.split(this.tic).join("")))) {
                var dt = this._isDate(o.split(this.tic).join(""));
                if (!isNaN(dt))
                    return this._getSerialDateTimeFromDate(dt).toString();
            }

            return this.removeTics(o.toString());
        };
        /**
         * 
		 * @private
        */
		this._populateNamedRangesNonScoped = function () {
            if (this._namedRangesNonScoped == null) {
                this._namedRangesNonScoped = new HashTable();
            }
            this._namedRangesNonScoped.clear();

            for (var k = 0; k < this.namedRanges.keys().length; k++) {
                this._checkAddNonScopedNamedRange(this.namedRanges.keys()[k]);
            }
        };
        /**
         * 
		 * @private
        */
		this._processUpperCase = function (formula, i, sheet) {
            var s = "";
            while (i < formula.length && this._isUpperChar(formula[i])) {
                s = s + formula[i];
                i = i + 1;
            }

            while (i < formula.length && this._isDigit(formula[i])) {
                s = s + formula[i];
                i = i + 1;
            }
            var firstCell = s;
            var firstIndex = i;
            if (i < formula.length && formula[i] == ':') {
                s = "";
                i = i + 1;
                if (i < formula.length && formula[i] == this.sheetToken) {
                    s = s + formula[i];
                    i = i + 1;

                    while (i < formula.length && formula[i] != this.sheetToken) {
                        s = s + formula[i];
                        i = i + 1;
                    }
                }

                while (i < formula.length && this._isUpperChar(formula[i])) {
                    s = s + formula[i];
                    i = i + 1;
                }

                while (i < formula.length && this._isDigit(formula[i])) {
                    s = s + formula[i];
                    i = i + 1;
                }
            } if (this._supportRangeOperands && firstCell != s) {
                s = sheet + this._getCellFrom(firstCell + ':' + s);
            } else {
                i = (firstCell != s) ? firstIndex : i;
                s = sheet + firstCell;
            }
            sheet = "";
            this._processUpperCaseFormula = formula;
            this._processUpperCaseIvalue = i;
            this._processUpperCaseSheet = sheet;
            return s;
        };
        /**
         * 
		 * @private
        */
		this._saveStrings = function (text) {
            var strings = null;
            var TICs2 = this.tic + this.tic;
            var id = 0;
            var i = -1;
            if ((i = text.indexOf(this.tic)) > -1) {
                while (i > -1 && i < text.length) {
                    if (strings == null) {
                        strings = new HashTable();
                    }

                    var j = (i + 1) < text.length ? text.indexOf(this.tic, i + 1) : -1;
                    if (j > -1) {
                        var key = this.tic + this._uniqueStringMarker + id.toString() + this.tic;
                        if (j < text.length - 2 && text[j + 1] == this.tic[0]) {
                            j = text.indexOf(this.tic, j + 2);
                            if (j == -1) {
                                throw this.formulaErrorStrings[this._mismatched_tics];
                            }
                        }

                        var s = this._substring(text, i, j - i + 1);
                        strings.add(key, s);
                        s = s.split(TICs2).join(this.tic);
                        id++;
                        text = text.substring(0, i) + key + text.substring(j + 1);
                        i = i + key.length;
                        if (i < text.length) {
                            i = text.indexOf(this.tic, i);
                        }
                    } else if (j == -1 && text.indexOf(this.sheetToken) > -1 && i < text.indexOf(this.sheetToken, i)) {
                        var sheetName = "";
                        for (var k = (text.indexOf(this.sheetToken, i)) - 1; k > -1; k--) {
                            if (this.getValidPrecedingChars().indexOf(text[k].toString()) == -1)
                                sheetName = text[k] + sheetName;
                            else
                                break;
                        }
                        if (!(sheetName[0] == "'" && sheetName[sheetName.length - 1] == "'")) {
                            throw this.formulaErrorStrings[this._mismatched_tics];
                        }
                        if (sheetName[0] == "'")
                            sheetName = sheetName.substring(1);
                        if (sheetName[sheetName.length - 1] == "'")
                            sheetName = sheetName.substring(0, sheetName.length - 1);
                        if (this.getSortedSheetNames().indexOf(sheetName.toUpperCase()) == -1) {
                            throw this.formulaErrorStrings[this._missing_sheet];
                        }
                        if ((i + 1) < text.length) {
                            i = text.indexOf(this.tic, i + 1);
                        }
                    } else {
                        throw this.formulaErrorStrings[this._mismatched_tics];
                    }
                }
            }
            this._saveStringsText = text;
            return strings;
        };
        /**
         * 
		 * @private
        */
		this._setStrings = function (retValue, strings) {
            var keys = strings.keys();
            for (var s = 0; s < keys.length; s++) {
                retValue = retValue.split(keys[s]).join(strings.getItem(keys[s]));
            }
            return retValue;
        };
        /**
         * 
		 * @private
        */
		this._sheetToken = function (s) {
            var i = 0;
            var s1 = "";
            if (i < s.length && s[i] == this.sheetToken) {
                i++;
                while (i < s.length && s[i] != this.sheetToken) {
                    i++;
                }

                s1 = s.substring(0, i + 1);
            }

            if (i < s.length) {
                return s1;
            }

            throw this.formulaErrorStrings[this._bad_index];
        };
        /**
         * 
		 * @private
        */
		this._splitArguments = function (args, argSeperator) {
            return args.split(argSeperator);
        };
        /**
         * 
		 * @private
        */
		this._stripTics0 = function (s) {
            if (s.length > 1 && s[0] == this.tic[0] && s[s.length - 1] == this.tic[0]) {
                s = this._substring(s, 1, s.length - 2);
            }

            return s;
        };
        /**
         * 
		 * @private
        */
		this._substring = function (text, startIndex, length) {
            return text.substring(startIndex, length + startIndex);
        };
        /**
         * 
		 * @private
        */
		this._isTextEmpty = function (s) {
            return s == null || s == "";
        };
        /**
         * 
		 * @private
        */
		this._toOADate = function (dateTime) {
            var result = (dateTime.getTime() - Date.parse(this._oaDate)) / this._millisecondsOfaDay;
            return result;
        };
        /**
         * 
		 * @private
        */
		this._zapBlocks = function (text) {
            if (text.indexOf(this.bMARKER) > -1) {
                var bracketLevel = 0;
                for (var i = text.length - 1; i > 0; --i) {
                    if (text[i] == this._rightBracket) {
                        bracketLevel--;
                    } else if (text[i] == this._leftBracket) {
                        bracketLevel++;
                    } else if (text[i] == this.bMARKER && bracketLevel == 0) {
                        text = text.substring(0, i - 1) + text.substring(i + 1);
                    }
                }
            }

            return text;
        };
        
		
		/**		
        * Add the custom formuls with function in CalcEngine library 
        * @return boolean
        * @param {string} FormulaName pass the formula name 
        * @param {string} FunctionName pass the custom function name to call 
        * @example 
        * &lt;div id="Grid"&gt;&lt;/div&gt; 
        * &lt;script&gt;
        * // Create Grid
        * $('#Grid').ejGrid({
        *     dataSource: window.gridData
        * });         
        * var calcObj = new CalcEngine($("#Grid").data("ejGrid"));
        * var sheetID = calcObj.createSheetFamilyID();
        * calcObj.registerGridAsSheet("sheet1", $("#Grid").data("ejGrid"), sheetID);
        * calcObj.addCustomFunction("ADD", "customAdd");
        *    customAdd = function (argsList) {
        *    var splitArgs = argsList.split(calcObj.getParseArgumentSeparator())
        *       var result = 0;
        *       for (var i in splitArgs) {
        *           var s1 = calcObj.getValueFromArg(splitArgs[i]);
        *           result = Number(result) + Number(s1);
        *       }
        *       return result;
        *    }
        * &lt;/script&gt;
		* @memberof ejCalculate
		* @instance
        */
        this.addCustomFunction = function (name, func) {
            name = name.toUpperCase();
            this._addFunction(name, func);
            if (this._customlibraryFunctions.getItem(name) == undefined) {
                this._customlibraryFunctions.add(name,func);
                return true;
            }
            return false;
        };
        this.UpdateDependentNamedRangeCell = function (key) {
            if (this.getDependentNamedRangeCells()!=null && this.getDependentNamedRangeCells().containsKey(key)) {
                var ht = this.getDependentNamedRangeCells().keys();
                  if (ht != null && ht.length > 0) {
                    for (var s = 0; s<ht.length; s++) {
                        var cell1 = this.getDependentNamedRangeCells().getItem(ht[s]);
                        var i = cell1.indexOf(this.sheetToken);
                        var row, col;
                        var grd = this.grid;
                        if (i > -1) {
                            var family = CalcEngine.getSheetFamilyItem(this.grid);
                           
                            this.grid = family.tokenToParentObject.getItem(cell1.substring(0, i + 3));
                            row = this.rowIndex(cell1);
                            col = this.colIndex(cell1);
                        }
                        else {
                            row = this.rowIndex(cell1);
                            col = this.colIndex(cell1);
                        }
                        this.recalculateRange(RangeInfo.cells(row, col,row,col), this.grid);

                        this.grid = grd;
                    }
                }
            }
        }

        this.RemoveNamedRangeDependency = function (key) {
            if (this.getDependentNamedRangeCells().containsKey(key)) {
                var ht = (Hashtable)(this.getDependentNamedRangeCells()[key]);
                ht.Clear();
                this.getDependentNamedRangeCells().remove(key);
            }
        }
        this.SetNamedRangeDependency = function (key, cell1) {
            var family = CalcEngine.getSheetFamilyItem(this.grid);
            if (family.sheetNameToParentObject != null && cell1.indexOf(this.sheetToken) == -1) {
                var token = family.GridModelToToken[this.grid];
                cell1 = token + cell1;
            }

            if (this.getDependentNamedRangeCells()!=null && this.getDependentNamedRangeCells().containsKey(key)) {
                var ht = this.getDependentNamedRangeCells()[key];
                if (!ht.containsKey(cell1)) {
                    ht.add(cell1, "0");
                }
            }
            else {
                var ht1 = new HashTable();
                ht1.add(cell1, "0");
                this.getDependentNamedRangeCells().add(key, cell1.toString());
            }
        }
        /**		
        * Adds a named range to the NamedRanges collection 
        * @return boolean
        * @param {string} Name pass the namedRange's name 
        * @param {string} cellRange pass the cell range of NamedRange
        * @example
        * &lt;div id="Grid"&gt;&lt;/div&gt; 
        * &lt;script&gt;
        * // Create Grid
        * $('#Grid').ejGrid({
        *     dataSource: window.gridData
        * });         
        * var calcObj = new CalcEngine($("#Grid").data("ejGrid"));
        * var sheetID = calcObj.createSheetFamilyID();
        * calcObj.registerGridAsSheet("sheet1", $("#Grid").data("ejGrid"), sheetID);
        * calcObj.addNamedRange("FIRSTCELL","A1");
        * &lt;/script&gt;
		* @memberof ejCalculate
		* @instance
        */
        this.addNamedRange = function (name, range) {
            name = name.toUpperCase();
            if (this.getNamedRanges().getItem(name) == null) {
                this.getNamedRanges().add(name, range);
                if (!this.getNameRangeValues().containsKey(name)) {
                    this.getNameRangeValues().add(name, range.toString());
                }
                if (this.getUndefinedNamedRanges().containsKey(name) || this.getUndefinedNamedRanges().containsKey(name.toUpperCase()) || this.getUndefinedNamedRanges().containsKey(name.toLowerCase())) {
                    this.SetNamedRangeDependency(name.toUpperCase(), this.cell);
                    this.UpdateDependentNamedRangeCell(name.toUpperCase());
                }
                namedRangesSized = null;
                this._checkAddNonScopedNamedRange(name);
                return true;
            }
            return false;
        };
        /**		
        * Accepts a possible parsed formula and returns the calculated value without quotes.
        * @return string
        * @param {string} Name pass the cell range to adjust its range
        * @example
        * var calcObj = new CalcEngine($("#Grid").data("ejGrid"));
        * var sheetID = calcObj.createSheetFamilyID();
        * calcObj.registerGridAsSheet("sheet1", $("#Grid").data("ejGrid"), sheetID);
        * calcObj.addNamedRange("FIRSTCELL","A1");
        * &lt;/script&gt;
		* @memberof ejCalculate
		* @instance
        */
        this.adjustRangeArg = function (range) {
            if (range.length > 1 && range[0] == this.bMARKER && range[range.length - 1] == this.bMARKER && this._substring(range, 1, range.length - 2).indexOf(this.bMARKER) == -1) {
                range = this.computedValue(range);
            }

            if (range.length > 1 && range[0] == this.tic[0] && range[range.length - 1] == this.tic[0]) {
                range = this._substring(range, 1, range.length - 2);
            }
            return range;
        };
        /**		
        * When a formula cell changes, call this method to clear it from its dependent cells.
        * @param {string} Cell pass the changed cell address
        * @example
        * var calcObj = new CalcEngine($("#Grid").data("ejGrid"));
        * calcObj.clearFormulaDependentCells("A1");
        * &lt;/script&gt;
		* @memberof ejCalculate
		* @instance
        */
        this.clearFormulaDependentCells = function (cell) {
            var ht = this.getDependentFormulaCells().getItem(cell);
            if (ht != null) {
                var keys = ht.keys();
                for (var o = 0; o < keys.length; o++) {
                    var s = keys[o];
                    var al = this.getDependentCells().getItem(s);
                    this._arrayRemove(al, cell);
                    if (al.length == 0) {
                        this.getDependentCells().remove(s);
                    }
                }

                this.getDependentFormulaCells().remove(cell);
            }
        };
        /**		
        *  Call this method to clear whether an exception was raised during the computation of a library function.
        * @example
        * var calcObj = new CalcEngine($("#Grid").data("ejGrid"));
        * calcObj.clearLibraryComputationException();
        * &lt;/script&gt;
		* @memberof ejCalculate
		* @instance
        */
        this.clearLibraryComputationException = function () {
            this._libraryComputationException = null;
        };
        /**		
        * Get the column index from a cell reference passed in.
        * @param {string} Cell pass the cell address
        * @example
        * var calcObj = new CalcEngine($("#Grid").data("ejGrid"));
        * calcObj.colIndex("A1");
        * &lt;/script&gt;
		* @memberof ejCalculate
		* @instance
        */
        this.colIndex = function (s) {
            var i = 0;
            var k = 0;
            s = s.toUpperCase();

            if (i < s.length && s[i] == this.sheetToken) {
                i++;
                while (i < s.length && s[i] != this.sheetToken) {
                    i++;
                }

                i++;
            }

            while (i < s.length && this._isLetter(s[i])) {
                var charCode = s[i].charCodeAt(0);
                k = k * 26 + charCode - 64;
                i++;
            }

            if (k == 0) {
                return -1;
            }

            return k;
        };
        /**		
        * Evaluates a parsed formula.
        * @return string
        * @param {string} Formula pass the parsed formula
        * @example
        * var calcObj = new CalcEngine($("#Grid").data("ejGrid"));
        * calcObj.computedValue("n10n2a");
        * &lt;/script&gt;
		* @memberof ejCalculate
		* @instance
        */
        this.computedValue = function (formula) {
            if (this._isTextEmpty(formula)) {
                return formula;
            }
            try  {
                this.computedValueLevel++;
                if (this.computedValueLevel > this._maximumRecursiveCalls) {
                    this.computedValueLevel = 0;
                    throw this.formulaErrorStrings[this._too_complex];
                }
                var _stack = [];

                var i = 0;
                _stack.length = 0;
                var sheet = "";
                if (this.getAllowShortCircuitIFs()) {
                    var loc = -1;
                    do {
                        ////code peels all only the outer most IF functions  and relies on a custom IF to handle the proper alternative
                        if (i < formula.length && (i = formula.indexOf(this.iFMarker, i)) > -1) {
                            loc = this._matchingRightBracket(formula.substring(i));
                            if (loc > -1) {
                                var result = "";
                                var nextIfLoc = formula.indexOf(this.iFMarker, loc);

                                do {
                                    loc = i;
                                    var sepLoc = this._findNextSeparator(formula, loc);
                                    if (!isNaN(sepLoc)) {
                                        loc = sepLoc;
                                    }
                                    var funcArgs = this._substring(formula, i + this.iFMarker.length, loc - this.iFMarker.length - 1);
                                    var ifArguments = [];
                                    var argLoc = 0;
                                    var argNo = 0;
                                    while (argLoc < funcArgs.length) {
                                        sepLoc = this._findNextSeparator(funcArgs, argLoc);
                                        if (!isNaN(sepLoc)) {
                                            argLoc = sepLoc;
                                            ifArguments.push(funcArgs.substring(0, argLoc));
                                            funcArgs = funcArgs.substring(Number(argLoc) + 1);
                                            argLoc = 0;
                                        }
                                        else if (argLoc > 0) {
                                            arguments.push(funcArgs.substring(0, argLoc));
                                        }
                                    }
                                    var ifResult = this.getValueFromArg(ifArguments[0]);
                                    if (ifResult == this.trueValueStr)
                                        result = this.getValueFromArg(ifArguments[1]);
                                    else
                                        result = this.getValueFromArg(ifArguments[2]);
                                    nextIfLoc = formula.indexOf(this.iFMarker, loc);
                                }
                                while (formula.indexOf(this.iFMarker) > -1 && nextIfLoc > -1);

                                result = this._markupResultToIncludeInFormula(result)
                                var rightPiece = "";
                                if (i + loc + 1 < formula.length)
                                    rightPiece = formula.substring(i + loc + 1);
                                formula = formula.substring(0, i) + result + rightPiece;
                            }
                        }
                    }
                    while (formula.indexOf(this.iFMarker) > -1 && loc > -1);
                }
                i = 0;
                while (i < formula.length) {
                    if (formula[i] == this.bMARKER) {
                        i = i + 1;
                        continue;
                    }

                    var uFound = formula[i] == 'u';
                    if (uFound) {
                        i++;
                        if (i >= formula.length) {
                            continue;
                        }

                        if (formula[i] == this.bMARKER) {
                            i++;
                        }

                        if (i >= formula.length) {
                            continue;
                        }
                    }

                    ////defect 8729
                    ////************
                    //// The % is the last thing in the cell contents here
                    if (formula[i] == '%' && _stack.length > 0) {
                        var o = _stack[0];
                        var d = this._parseDouble(o);
                        if (!isNaN(d)) {
                            _stack.pop(); ////remove it
                            _stack.push(Number(d) / 100); ////push it back
                        }
                        i = i + 1;
                        continue;
                    }
                    if (formula[i] == this.sheetToken) {
                        sheet = formula[i].toString();
                        i++;
                        while (i < formula.length && formula[i] != this.sheetToken) {
                            sheet += formula[i];
                            i++;
                        }

                        if (i < formula.length) {
                            sheet += formula[i];
                            i++;
                        } else {
                            continue;
                        }
                    }
                    if ((formula.substring(i)).indexOf(this.trueValueStr) == 0) {
                        _stack.push(this.trueValueStr);
                        i += this.trueValueStr.length;
                    } else if (formula.substring(i).indexOf(this.falseValueStr) == 0) {
                        _stack.push(this.falseValueStr);
                        i += this.falseValueStr.length;
                    } else if (formula[i] == this.tic[0] || formula[i] == '|') {
                        if (_stack.length == 3)
                            _stack = this._combineStack(formula, i - 2, _stack);

                        var s = formula[i].toString();
                        i++;
                        while (i < formula.length && formula[i] != this.tic[0]) {
                            s = s + formula[i];
                            i = i + 1;
                        }
                        if (this._multiTick) {
                            s = s.split("|").join(this.tic);
                        }
                        _stack.push(s + this.tic);
                        i += 1;
                    } else if (this._isUpperChar(formula[i])) {
                        ////cell loc
                        var s = this._processUpperCase(formula, i, sheet);
                        formula = this._processUpperCaseFormula;
                        i = this._processUpperCaseIvalue;
                        sheet = this._processUpperCaseSheet;
                        if (uFound) {
                            s = this.getValueFromParentObjectCell(s);
                            var d3;
                            if (!isNaN(this._parseDouble(s))) {
                                d3 = -d3;
                                _stack.push(d3.toString());
                            } else {
                                _stack.push(s);
                            }
                        } else {
                            if (this.getUseFormulaValues() && this.computedValueLevel > 50) {
                                if (this._breakedFormulaCells.indexOf(s) == -1 && this.getUseFormulaValues()) {
                                    var family = CalcEngine.getSheetFamilyItem(this.grid);
                                    var token = this.sheetToken + this.getSheetID(this.grid).toString() + this.sheetToken;
                                    s = token + s;
                                    this._breakedFormulaCells.add(s);
                                    this._tempBreakedFormulaCells.add(s);
                                    break;
                                }
                                _stack.push("FALSE");
                            } else
                                _stack.push(this.getValueFromParentObjectCell(s));
                        }
                    } else if (formula[i] == 'q') {
                        ////library
                        formula = this._computeInteriorFunctions(formula);

                        var ii = formula.substring(i + 1).indexOf(this._leftBracket);
                        if (ii > 0) {
                            var bracketCount = 0;
                            var bracketFound = false;
                            var start = ii + i + 2;
                            var k = start;
                            while (k < formula.length && (formula[k] != this._rightBracket || bracketCount > 0)) {
                                if (formula[k] == this._leftBracket) {
                                    bracketCount++;
                                    bracketFound = true;
                                } else if (formula[k] == this._leftBracket) {
                                    bracketCount--;
                                }

                                k++;
                            }

                            if (bracketFound) {
                                var s = this._substring(formula, start, k - start - 2);
                                var s1 = "";
                                var splits = this.splitArgsPreservingQuotedCommas(s);
                                for (var t = 0; t < splits.length; t++) {
                                    if (s1.length > 0) {
                                        s1 += ",";
                                    }

                                    var j = this._findLastqNotInBrackets(t);
                                    if (j > 0) {
                                        s1 += splits[t].substring(0, j) + this.computedValue(splits[t].substring(j));
                                    } else {
                                        s1 += this.computedValue(splits[t]);
                                    }
                                }

                                formula = formula.substring(0, start) + s1 + formula.substring(k - 2);
                            }

                            var name = this._substring(formula, i + 1, ii);
                            if (name == "AVG" && this._excelLikeComputations) {
                                throw this.formulaErrorStrings[this._bad_index];
                            }
                            if (this.getLibraryFunctions().getItem(name) != undefined) {
                                var j = formula.substring(i + ii + 1).indexOf(this._rightBracket);
                                var args = this._substring(formula, i + ii + 2, j - 1);
                                try  {
                                    var functionName = this.getLibraryFunctions().getItem(name);
                                    var result;
                                    if (this.getCustomLibraryFunctions().getItem(name) != undefined) {
                                        result = eval(functionName)(args);
                                    } else
                                        result = this[functionName](args);
                                    _stack.push(result);
                                } catch (ex) {
                                    if (this.getRethrowLibraryComputationExceptions()) {
                                        this._libraryComputationException = ex;
                                        throw ex;
                                    }

                                    return ex;
                                }

                                i += j + ii + 2;
                            } else {
                                if (this.getRethrowLibraryComputationExceptions()) {
                                    throw this.formulaErrorStrings[this._missing_formula];
                                    return this.getErrorStrings()[5].toString();
                                }

                            }
                        } else if (formula[0] == this.bMARKER) {
                            ////Restart the processing with the formula without library finctions.
                            i = 0;
                            _stack.length == 0;
                            continue;
                        } else {
                            throw this.formulaErrorStrings[this._improper_formula];
                        }
                    } else if (this._isDigit(formula[i]) || formula[i] == 'u') {
                        var s = "";
                        if (formula[i] == 'u' || uFound) {
                            s = "-";
                            if (!uFound) {
                                i++;
                            } else {
                                uFound = false;
                            }
                        }

                        if (i < formula.length && this._isUpperChar(formula[i])) {
                            s = s + this.getValueFromParentObjectCell(this._processUpperCase(formula, i, sheet));
                            formula = this._processUpperCaseFormula;
                            i = this._processUpperCaseIvalue;
                            sheet = this._processUpperCaseSheet;
                        } else {
                            while (i < formula.length && (this._isDigit(formula[i]) || formula[i] == this.getParseDecimalSeparator())) {
                                s = s + formula[i];
                                i = i + 1;
                            }
                        }

                        _stack.push(s);
                    } else {
                        switch (formula[i]) {
                            case '#': {
                                var errIndex = 0;
                                if (formula.indexOf('!') == -1) {
                                    errIndex = formula.indexOf('?') + 1;
                                } else
                                    errIndex = formula.indexOf('!') + 1;
                                _stack.push(this._substring(formula, i, errIndex - i));
                                i = errIndex;
                                break;
                            }

                            case 'n':
                                {
                                    i = i + 1;

                                    var s = "";
                                    if (formula.substring(i).indexOf("Infinity") == 0) {
                                        s = "Infinity";
                                        i += s.length;
                                    } else if (formula.substring(i).indexOf("uInfinity") == 0) {
                                        s = "Infinity";
                                        i += s.length + 1;
                                    } else if (formula.substring(i).indexOf(this.trueValueStr) == 0) {
                                        s = this.trueValueStr;
                                        i += s.length;
                                    } else if (formula.substring(i).indexOf(this.falseValueStr) == 0) {
                                        s = this.falseValueStr;
                                        i += s.length;
                                    } else if (i <= formula.length - 3 && formula.substring(i, 3) == "NaN") {
                                        i += 3;
                                        s = "0";
                                    } else {
                                        if (formula[i] == 'u' || uFound) {
                                            s = "-";
                                            if (!uFound) {
                                                i = i + 1;
                                            } else {
                                                uFound = false;
                                            }
                                        }

                                        while (i < formula.length && (this._isDigit(formula[i]) || formula[i] == this.getParseDecimalSeparator())) {
                                            s = s + formula[i];
                                            i = i + 1;
                                        }
                                        if (i < formula.length && formula[i] == '%') {
                                            i = i + 1;

                                            ////defect 8729
                                            ////**************
                                            if (s == "") {
                                                if (_stack.length > 0) {
                                                    var o = _stack[0];
                                                    var d = this._parseDouble(o.toString());
                                                    if (!isNaN(d)) {
                                                        _stack.pop(); ////remove it
                                                        s = (d / 100).toString(); ////push it back
                                                    }
                                                }
                                            } else {
                                                ////**************
                                                s = (Number(s) / 100).toString();
                                            }
                                        } else if (i < formula.length - 2 && formula[i] == 'E' && (formula[i + 1] == '+' || formula[i + 1] == '-')) {
                                            s += this._substring(formula, i, 4);
                                            i += 4;
                                        }
                                    }
                                    _stack.push(s);
                                }
                                break;
                            case this.token_add:
                                {
                                    var d = this._pop(_stack);
                                    var x = parseInt(d.toString());
                                    if (!isNaN(x) && this._isErrorString) {
                                        this._isErrorString = false;
                                        return this.getErrorStrings()[x].toString();
                                    }
                                    var d1 = this._pop(_stack);
                                    x = parseInt(d1.toString());
                                    if (!isNaN(x) && this._isErrorString) {
                                        this._isErrorString = false;
                                        return this.getErrorStrings()[x].toString();
                                    }
                                    if (isNaN(d) || isNaN(d1)) {
                                        _stack.push("#VALUE!");
                                    } else
                                        _stack.push((Number(d1) + Number(d)).toString());
                                    i = i + 1;
                                }

                                break;
                            case this.token_subtract:
                                {
                                    var d = this._pop(_stack);
                                    var x = parseInt(d.toString());
                                    if (!isNaN(x) && this._isErrorString) {
                                        this._isErrorString = false;
                                        return this.getErrorStrings()[x].toString();
                                    }
                                    var d1 = this._pop(_stack);
                                    x = parseInt(d1.toString());
                                    if (!isNaN(x) && this._isErrorString) {
                                        this._isErrorString = false;
                                        return this.getErrorStrings()[x].toString();
                                    }
                                    if (isNaN(d) || isNaN(d1)) {
                                        _stack.push("#VALUE!");
                                    } else {
                                        _stack.push((d1 - d).toString());
                                    }
                                    i = i + 1;
                                }

                                break;
                            case this.token_multiply:
                                {
                                    var d = this._pop(_stack);
                                    var x = parseInt(d.toString());
                                    if (!isNaN(x) && this._isErrorString) {
                                        this._isErrorString = false;
                                        return this.getErrorStrings()[x].toString();
                                    }
                                    var d1 = this._pop(_stack);
                                    x = parseInt(d1.toString());
                                    if (!isNaN(x) && this._isErrorString) {
                                        this._isErrorString = false;
                                        return this.getErrorStrings()[x].toString();
                                    }
                                    if (isNaN(d) || isNaN(d1)) {
                                        _stack.push("#VALUE!");
                                    } else {
                                        _stack.push((d1 * d).toString());
                                    }
                                    i = i + 1;
                                }

                                break;
                            case this.token_divide:
                                {
                                    var d = this._pop(_stack);
                                    var x = parseInt(d.toString());
                                    if (!isNaN(x) && this._isErrorString) {
                                        this._isErrorString = false;
                                        return this.getErrorStrings()[x].toString();
                                    }
                                    var d1 = this._pop(_stack);
                                    x = parseInt(d1.toString());
                                    if (!isNaN(x) && this._isErrorString) {
                                        this._isErrorString = false;
                                        return this.getErrorStrings()[x].toString();
                                    }
                                    if (isNaN(d) || isNaN(d1)) {
                                        _stack.push("#VALUE!");
                                    } else if (d == 0) {
                                        _stack.push(this.getErrorStrings()[3]);
                                    } else {
                                        _stack.push((d1 / d).toString());
                                    }
                                    i = i + 1;
                                }

                                break;
                            case this.token_EP:
                                {
                                    var d = this._pop(_stack);
                                    var d1 = this._pop(_stack);
                                    _stack.push((d1 * Math.pow(10, d)).toString());
                                    i = i + 1;
                                }
                                break;
                            case this.token_EM:
                                {
                                    var d = this._pop(_stack);
                                    var d1 = this._pop(_stack);
                                    _stack.push((Number(d1) * Math.pow(10, -Number(d))).toString());
                                    i = i + 1;
                                }
                                break;
                            case this.token_less:
                                {
                                    var s1 = this._popString(_stack);
                                    var s2 = this._popString(_stack);
                                    if (s1 == "" && this.getTreatStringsAsZero()) {
                                        s1 = "0";
                                    }
                                    if (s2 == "" && this.getTreatStringsAsZero()) {
                                        s2 = "0";
                                    }
                                    var d = this._parseDouble(s1);
                                    var d1 = this._parseDouble(s2);
                                    var val;
                                    if (!isNaN(d) && !isNaN(d1)) {
                                        val = (d1 < d) ? this.trueValueStr : this.falseValueStr;
                                    } else {
                                        if (s1 == "#VALUE!" || s2 == "#VALUE!")
                                            val = "#VALUE!";
                                        else
                                            val = (s2.toUpperCase().split(this.tic).join("").localeCompare(s1.toUpperCase().split(this.tic).join("")) < 0) ? this.trueValueStr : this.falseValueStr;
                                    }

                                    _stack.push(val);
                                    i = i + 1;
                                }
                                break;
                            case this.token_greater:
                                {
                                    var s1 = this._popString(_stack);
                                    var s2 = this._popString(_stack);
                                    if (s1 == "") {
                                        if (this.getTreatStringsAsZero())
                                            s1 = "0";
                                        else
                                            s1 = s2 + 1;
                                    }

                                    if (s2 == "") {
                                        if (this.getTreatStringsAsZero())
                                            s2 = "0";
                                        else
                                            s2 = s1 + 1;
                                    }
                                    var d = this._parseDouble(s1);
                                    var d1 = this._parseDouble(s2);
                                    var val;
                                    if (!isNaN(d) && !isNaN(d1)) {
                                        val = (Number(d1) > Number(d)) ? this.trueValueStr : this.falseValueStr;
                                    } else {
                                        if (s1 == "#VALUE!" || s2 == "#VALUE!")
                                            val = "#VALUE!";
                                        else
                                            val = (s2.toUpperCase().split(this.tic).join("").localeCompare(s1.toUpperCase().split(this.tic).join("")) > 0) ? this.trueValueStr : this.falseValueStr;
                                    }

                                    _stack.push(val);
                                    i = i + 1;
                                }
                                break;
                            case this.token_equal:
                                {
                                    var s1 = this._popString(_stack);
                                    var s2 = this._popString(_stack);
                                    if (s1 == "" && this.getTreatStringsAsZero()) {
                                        s1 = "0";
                                    }
                                    if (s2 == "" && this.getTreatStringsAsZero()) {
                                        s2 = "0";
                                    }
                                    var d = this._parseDouble(s1);
                                    var d1 = this._parseDouble(s2);
                                    var val;
                                    if (!isNaN(d) && !isNaN(d1)) {
                                        val = (Number(d1) == Number(d)) ? this.trueValueStr : this.falseValueStr;
                                    } else {
                                        if (s1 == "#VALUE!" || s2 == "#VALUE!")
                                            val = "#VALUE!";
                                        else
                                            val = (s1.toUpperCase().split(this.tic).join("") == s2.toUpperCase().split(this.tic).join("")) ? this.trueValueStr : this.falseValueStr;
                                    }
                                    _stack.push(val);
                                    i = i + 1;
                                }
                                break;
                            case this.token_lesseq:
                                {
                                    var s1 = this._popString(_stack);
                                    var s2 = this._popString(_stack);
                                    if (s1 == "" && this.getTreatStringsAsZero()) {
                                        s1 = "0";
                                    }
                                    if (s2 == "" && this.getTreatStringsAsZero()) {
                                        s2 = "0";
                                    }
                                    var d = this._parseDouble(s1);
                                    var d1 = this._parseDouble(s2);
                                    var val;
                                    if (!isNaN(d) && !isNaN(d1)) {
                                        val = (Number(d1) <= Number(d)) ? this.trueValueStr : this.falseValueStr;
                                    } else {
                                        if (s1 == "#VALUE!" || s2 == "#VALUE!")
                                            val = "#VALUE!";
                                        else
                                            val = (s1.toUpperCase().split(this.tic).join("").localeCompare(s2.toUpperCase().split(this.tic).join("")) <= 0) ? this.trueValueStr : this.falseValueStr;
                                    }

                                    _stack.push(val);
                                    i = i + 1;
                                }
                                break;
                            case this.token_greatereq:
                                {
                                    var s1 = this._popString(_stack);
                                    var s2 = this._popString(_stack);
                                    if (s1 == "" && this.getTreatStringsAsZero()) {
                                        s1 = "0";
                                    }
                                    if (s2 == "" && this.getTreatStringsAsZero()) {
                                        s2 = "0";
                                    }
                                    var d = this._parseDouble(s1);
                                    var d1 = this._parseDouble(s2);
                                    var val;
                                    if (!isNaN(d) && !isNaN(d1)) {
                                        val = (Number(d1) >= Number(d)) ? this.trueValueStr : this.falseValueStr;
                                    } else {
                                        if (s1 == "#VALUE!" || s2 == "#VALUE!")
                                            val = "#VALUE!";
                                        else
                                            val = (s1.toUpperCase().split(this.tic).join("").localeCompare(s2.toUpperCase().split(this.tic).join("")) >= 0) ? this.trueValueStr : this.falseValueStr;
                                    }
                                    _stack.push(val);
                                    i = i + 1;
                                }
                                break;
                            case this.token_noequal:
                                {
                                    var s1 = this._popString(_stack);
                                    var s2 = this._popString(_stack);
                                    if (s1 == "" && this.getTreatStringsAsZero()) {
                                        s1 = "0";
                                    }
                                    if (s2 == "" && this.getTreatStringsAsZero()) {
                                        s2 = "0";
                                    }
                                    var d = this._parseDouble(s1);
                                    var d1 = this._parseDouble(s2);
                                    var val;
                                    if (!isNaN(d) && !isNaN(d1)) {
                                        val = (Number(d1) != Number(d)) ? this.trueValueStr : this.falseValueStr;
                                    } else {
                                        if (s1 == "#VALUE!" || s2 == "#VALUE!")
                                            val = "#VALUE!";
                                        else
                                            val = (s1.toUpperCase().split(this.tic).join("") != s2.toUpperCase().split(this.tic).join("")) ? this.trueValueStr : this.falseValueStr;
                                    }
                                    _stack.push(val);
                                    i = i + 1;
                                }
                                break;
                            case this.token_and:
                                {
                                    var s1 = this._popString(_stack);
                                    var s2 = "";
                                    if (_stack.length > 0)
                                        s2 = this._popString(_stack);
                                    if (this.getUseNoAmpersandQuotes()) {
                                        _stack.push(s2 + s1);
                                    } else {
                                        _stack.push(this.tic + s2 + s1 + this.tic);
                                    }
                                    i = i + 1;
                                }
                                break;
                            case this.token_or:
                                {
                                    var d = this._pop(_stack);
                                    var d1 = this._pop(_stack);
                                    _stack.push(Math.pow(d1, d).toString());
                                    i = i + 1;
                                }
                                break;
                            case this.token_ORop:
                                {
                                    var s1 = this._popString(_stack);
                                    var s2 = this._popString(_stack);
                                    var d = this._parseDouble(s1);
                                    var d1 = this._parseDouble(s2);
                                    var val;
                                    if (s1 == "") {
                                        s1 = this.falseValueStr;
                                    } else if (!isNaN(d)) {
                                        s1 = (Number(s1) != 0) ? this.trueValueStr : this.falseValueStr;
                                    }

                                    if (s2 == "") {
                                        s2 = this.falseValueStr;
                                    } else if (!isNaN(d1)) {
                                        s2 = (Number(s2) != 0) ? this.trueValueStr : this.falseValueStr;
                                    }

                                    val = (s1.toUpperCase().split(this.tic).join("") == this.trueValueStr || s2.toUpperCase().split(this.tic).join("") == this.trueValueStr) ? this.trueValueStr : this.falseValueStr;

                                    _stack.push(val);
                                    i = i + 1;
                                }
                                break;
                            case this.token_ANDop:
                                {
                                    var s1 = this._popString(_stack);
                                    var s2 = this._popString(_stack);
                                    var d = this._parseDouble(s1);
                                    var d1 = this._parseDouble(s2);
                                    var val;
                                    if (s1 == "") {
                                        s1 = this.falseValueStr;
                                    } else if (!isNaN(d)) {
                                        s1 = (Number(s1) != 0) ? this.trueValueStr : this.falseValueStr;
                                    }

                                    if (s2 == "") {
                                        s2 = this.falseValueStr;
                                    } else if (!isNaN(d1)) {
                                        s2 = (Number(s2) != 0) ? this.trueValueStr : this.falseValueStr;
                                    }

                                    val = (s1.toUpperCase().split(this.tic).join("") == this.trueValueStr && s2.toUpperCase().split(this.tic).join("") == this.trueValueStr) ? this.trueValueStr : this.falseValueStr;

                                    _stack.push(val);
                                    i = i + 1;
                                }
                                break;
                            case this.token_XORop:
                                {
                                    var s1 = this._popString(_stack);
                                    var s2 = this._popString(_stack);
                                    var d = this._parseDouble(s1);
                                    var d1 = this._parseDouble(s2);
                                    var val;
                                    if (s1 == "") {
                                        s1 = this.falseValueStr;
                                    } else if (!isNaN(d)) {
                                        s1 = (Number(s1) != 0) ? this.trueValueStr : this.falseValueStr;
                                    }

                                    if (s2 == "") {
                                        s2 = this.falseValueStr;
                                    } else if (!isNaN(d1)) {
                                        s2 = (Number(s2) != 0) ? this.trueValueStr : this.falseValueStr;
                                    }

                                    val = ((s1.toUpperCase().split(this.tic).join("") == this.trueValueStr && s2.toUpperCase().split(this.tic).join("") != this.trueValueStr) || (s2.toUpperCase().split(this.tic).join("") == this.trueValueStr && s1.toUpperCase().split(this.tic).join("") != this.trueValueStr)) ? this.trueValueStr : this.falseValueStr;

                                    _stack.push(val);
                                    i = i + 1;
                                }
                                break;
                            case this.token_NOTop:
                                {
                                    var s1 = this._popString(_stack);
                                    var d = this._parseDouble(s1);
                                    var val;
                                    if (s1 == "") {
                                        s1 = this.falseValueStr;
                                    } else if (!isNaN(d)) {
                                        s1 = (Number(s1) != 0) ? this.trueValueStr : this.falseValueStr;
                                    }

                                    val = (s1.toUpperCase().split(this.tic).join("") == this.falseValueStr) ? this.trueValueStr : this.falseValueStr;

                                    _stack.push(val);
                                    i = i + 1;
                                }
                                break;
                            default: {
                                this.computedValueLevel = 0;
                                if(this.getRethrowLibraryComputationExceptions())
                                    throw this.formulaErrorStrings[this._invalid_expression];
								else
                                    return this.getErrorStrings()[1].toString();
                            }
                        }
                    }
                }
                if (this._checkDanglingStack && _stack.length > 1 && formula.length > 1 && (formula.indexOf(this.bmarker.toString()) != 0 || formula.indexOf(this.bmarker) != (formula.length - 1) || formula.indexOf(this.bmarker2) > -1)) {
                    this.computedValueLevel = 0;
                    return this.formulaErrorStrings[this._improper_formula];
                }

                if (_stack.length == 0) {
                    return "";
                } else {
                    var s = "";
                    var d;
                    var cc = _stack.length;
                    do {
                        s = _stack.pop().toString() + s;
                        return s;
                        cc--;
                    } while(cc > 0 && !(s.indexOf(this.FALSEVALUESTR) > -1 || s.indexOf(this.tRUEVALUESTR) > 1));

                    ////This check moved below in Pop as result of DT26064
                    ////if(_textIsEmpty(s))
                    ////    s = "0"; //Empty is zero in calculations.
                    return s;
                }
            } catch (ex) {
                this.computedValueLevel = 0;
                if (ex.toString().indexOf(this.formulaErrorStrings[this._circular_reference_]) > -1 || (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null)) {
                    if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                        throw this.getLibraryComputationException();
                    }

                    throw ex;
                }

                if (ex.toString().indexOf(this.formulaErrorStrings[this._cell_empty]) > -1) {
                    return "";
                } else {
                    if (this.getRethrowLibraryComputationExceptions()) {
                        this._libraryComputationException = ex;
                        throw ex;
                    }
                    return ex;
                }
            } finally {
                this.computedValueLevel--;
                if (this.computedValueLevel < 0) {
                    this.computedValueLevel = 0;
                }
            }
        };
        /**		
        * Evaluates a parsed formula.
        * @return string
        * @param {string} Formula pass the parsed formula
        * @example
        * var calcObj = new CalcEngine($("#Grid").data("ejGrid"));
        * calcObj.computedValue("n10n2a");
        * &lt;/script&gt;
		* @memberof ejCalculate
		* @instance
        */
        this.computeFormula = function (parsedFormula) {
            if (this.getThrowCircularException()) {
                if (this._iterationMaxCount > 0) {
                    if (this.computedValueLevel == 0) {
                        this._circCheckList.length = 0;
                        this._circCheckList.push(this.cell);
                    } else if (this._circCheckList.indexOf(this.cell) > -1) {
                        if (!this.getIterationValues().containsKey(this.cell)) {
                            this.getIterationValues().add(this.cell, "0");
                        }

                        return this.getIterationValues().getItem(this.cell).toString();
                    }
                } else {
                    if (this.computedValueLevel == 0) {
                        this._circCheckList.length = 0;
                    } else if (this._circCheckList.indexOf(this.cell) > -1) {
                        this.computedValueLevel = 0;
                        this._circCheckList.length = 0;
                        throw this.formulaErrorStrings[this._circular_reference_];
                    }

                    this._circCheckList.push(this.cell);
                }
            }

            var s = this.computedValue(parsedFormula);

            if (this.getUseNoAmpersandQuotes() && s.length > 1 && s[0] == this.tic[0] && s[s.length - 1] == this.tic[0]) {
                s = this._substring(s, 1, s.length - 2);
            }
            return s;
        };
        
        this.dispose = function () {
            if (!this._isDisposed) {
                var i = 0;
                if (this.grid != null) {
                    i = this.getSheetID(this.grid);
                }
                CalcEngine._tokenCount--;
                CalcEngine.sheetFamilyID--;
                if (CalcEngine._sheetFamiliesList != null && CalcEngine._sheetFamiliesList.length > 0) {
                    CalcEngine._sheetFamiliesList[i] = null;
                    CalcEngine._sheetFamiliesList.remove(i);
                }
                if (CalcEngine.modelToSheetID != null && CalcEngine.modelToSheetID.length > 0) {
                    CalcEngine.modelToSheetID[i] = null;
                    CalcEngine._sheetFamiliesList.remove(i);
                }
                if (this._formulaInfoTable != null) {
                    this._formulaInfoTable.clear();
                    this._formulaInfoTable = null;
                }
                if (this._circCheckList != null) {
                    this._circCheckList.length = 0;
                    this._circCheckList = null;
                }
                if (this._dependentCells != null) {
                    this._dependentCells.clear();
                    this._dependentCells = null;
                }
                if (this._dependentFormulaCells != null) {
                    this._dependentFormulaCells.clear();
                    this._dependentFormulaCells = null;
                }

                if (this.getIterationValues() != null) {
                    this.getIterationValues().clear();
                    this.getIterationValues(null);
                }
                if (this._libraryFunctions != null) {
                    this._libraryFunctions.clear();
                    this._libraryFunctions = null;
                }
                if (this._lookupTables != null) {
                    this._lookupTables.clear();
                    this._lookupTables = null;
                }
                this.grid = null;
                if (this.getLibraryFunctions() != null) {
                    this.getLibraryFunctions().clear();
                    this.setLibraryFunctions(null);
                }
                this._isDisposed = true;
            }
        };
        this.getCalcID = function () {
            return this._calcID;
        };

        this._getCellFrom = function (range)
        {
            var cellRange = "";
            var cells = this.getCellsFromArgs(range);
            var last = cells.length - 1;
            var r1 = this.rowIndex(cells[0]);
            var x;
            if (r1 == this.rowIndex(cells[last]))
            {
                var c1 = this.colIndex(cells[0]);
                var c2 = this.colIndex(cells[last]);
                var c = this.colIndex(this.cell);
                if (c >= c1 && c <= c2)
                {
                    cellRange = RangeInfo.getAlphaLabel(c).toString() + r1.toString();
                }
            }
            else if ((x = this.colIndex(cells[0])) == this.colIndex(cells[last]))
            {
                var r2 = this.rowIndex(cells[last]);
                var r = this.rowIndex(this.cell);
                if (r >= r1 && r <= r2)
                {
                    cellRange = RangeInfo.getAlphaLabel(x).toString() + r.toString();
                }
            }

            return cellRange;
        };

        this.getCellsFromArgs = function (args) {
            args = this._markColonsInQuotes(args);

            var row1;
            var col1;

            var i = args.indexOf(':');
            if (i == -1) {
                args = args.split(this._markerChar).join(':');
                i = args.indexOf(this.getParseArgumentSeparator());
                if (i == -1) {
                    row1 = this.rowIndex(args); ////maybe throw exception
                    col1 = this.colIndex(args); ////maybe throw exception
                    var argsArray = [];
                    argsArray.push(args);
                    return argsArray;
                } else {
                    return this.splitArgsPreservingQuotedCommas(args);
                }
            }

            this.getRowIndexFromName = function (str) {
                if (str.indexOf(":") != -1) {
                    return;
                }
                var count = "";
                for (var i = 0; i < str.length; i++) {
                    if (this._isDigit(str[i]))
                        count += str[i];
                }
                return count;
            }

            var sheet = "";
            var argsRet = args;
            var j = args.indexOf(this.sheetToken);
            if (j > -1) {
                var j1 = args.indexOf(this.sheetToken, j + 1);
                if (j1 > -1) {
                    sheet = this._substring(args, j, j1 - j + 1);
                    args = args.split(sheet).join("");
                    i = args.indexOf(':');
                }
            }

            ////check if column only range
            if (i > 0 && this._isLetter(args[i - 1])) {
                var count = (this._rowMaxCount > 0) ? this._rowMaxCount : 50;
                args = args.substring(0, i) + "1:" + args.substring(i + 1) + count.toString();
                i = args.indexOf(':');
            } else if (i > 0 && this._isDigit(args[i - 1])) {
                var k1 = i - 2;
                while (k1 >= 0 && this._isDigit(args[k1])) {
                    k1--;
                }

                if (k1 == -1 || !this._isLetter(args[k1])) {
                    var count = (this._columnMaxCount > 0) ? this._columnMaxCount : 50;
                    args = "A" + args.substring(0, i) + ":" + RangeInfo.getAlphaLabel(count) + args.substring(i + 1);
                    i = args.indexOf(':');
                }
            }

            // Check Whether rowindex can get from the arguments
            var isDigit = this._canGetRowIndex(args.substring(0, i));
            if (!isDigit) {
                // if unable to get index return the arguments
                this._ignoreCellValue = true;
                args = argsRet;
                return this.splitArgsPreservingQuotedCommas(args);
            }
            row1 = this.rowIndex(args.substring(0, i));
            var row2 = this.rowIndex(this._substring(args, i + 1, args.length - i - 1));
            var errorStr;
            if ((!(!(row1 == -1) || (row2 == -1)) == (((row1 == -1) || !(row2 == -1))))) {
                throw this.getErrorStrings()[5].toString();
                // errorStr[0] = this.getErrorStrings()[5].toString();
                // return errorStr;
            }

            col1 = this.colIndex(args.substring(0, i));

            var col2 = this.colIndex(this._substring(args, i + 1, args.length - i - 1));

            if (row1 > row2) {
                i = row2;
                row2 = row1;
                row1 = i;
            }

            if (col1 > col2) {
                i = col2;
                col2 = col1;
                col1 = i;
            }

            var numCells = (row2 - row1 + 1) * (col2 - col1 + 1);
            var cells = [];
            var k = 0;
            for (i = row1; i <= row2; ++i) {
                for (j = col1; j <= col2; ++j) {
                    try  {
                        cells[k++] = sheet + RangeInfo.getAlphaLabel(j) + i.toString();
                    } catch (ex) {
                        continue;
                    }
                }
            }
            return cells;
        };
        this.getFormulaRowCol = function (grd, row, col) {
            var family = CalcEngine.getSheetFamilyItem(grd);
            var s = RangeInfo.getAlphaLabel(col) + row.toString();
            if (family.sheetNameToParentObject != null) {
                var token = family.parentObjectToToken.getItem(grd);
                s = token + s;
            }

            if (this.getFormulaInfoTable().containsKey(s)) {
                var formula = this.getFormulaInfoTable.getItem(s);
                var value = formula.getFormulaText();
                this.getFormulaText(value);
                return value;
            }

            return "";
        };
        this.getFormulaText = function (s) {
            var e = new FormulaParsing(s);
            s = e.getText();
            return s;
        };
        this.getSheetID = function (grd) {
            var family = CalcEngine.getSheetFamilyItem(grd);
            if (family.sheetNameToParentObject != null && family.sheetNameToParentObject.length > 0) {
                var token = family.parentObjectToToken.getItem(grd);
                token = token.split("!").join("");
                var d = this._parseDouble(token);
                if (!isNaN(d)) {
                    return d;
                }
            }

            return -1;
        };
        this.getStringArray = function (s) {
            //ArrayList argList = new ArrayList();
            var argList = [];
            var argStart = 0;
            var inQuote = false;
            for (var argEnd = 0; argEnd < s.length; argEnd++) {
                var ch = s[argEnd];
                if (ch == this.tic[0]) {
                    inQuote = !inQuote;
                } else if (!inQuote && ch == this.getParseArgumentSeparator()) {
                    argList.push(this._substring(s, argStart, argEnd - argStart));
                    argStart = argEnd + 1;
                }
            }

            argList.push(s.substring(argStart));
            return argList;
        };
        this.getValueFromArg = function (arg) {
            var d;
            var tempDate = this._dateTime1900;

            ////handle special characters - probably need to revise...
            ////if(arg.IndexOf("%") > -1)
            ////	Console.WriteLine("special");
            ////arg = arg//.replace(TRUEVALUESTR, TRUEVALUE.toString())
            ////		//.replace(FALSEVALUESTR, FALSEVALUE.toString())
            ////		.replace("%", "");

            if (!isNaN(arg))
                arg = arg.toString();

            if (this._isTextEmpty(arg)) {
                return arg;
            } else if (arg[0] == this.tic[0]) {
                ////string
                var doubleValue;
                tempDate = this._isDate(arg.split(this.tic).join(""));
                if (this.getExcelLikeComputations() && this.getUseDatesInCalculations() && isNaN(this._parseDouble(arg.split(this.tic).join(""))) && !isNaN(tempDate) && !isNaN(tempDate.getDate()) && this._dateTime1900 <= tempDate) {
                    return this._toOADate(tempDate).toString();
                }
                return arg;
            } else if (arg[0] == this.bMARKER || arg[0] == 'q') {
                ////parsed formula
                arg = arg.split('{').join('(');
                arg = arg.split('}').join(')');
                return this.computedValue(arg);
            } else if (arg.length > 1 && arg.substring(0, 2) == "ub") {
                ////parsed formula
                arg = arg.split('{').join('(');
                arg = arg.split('}').join(')');
                var ggg = arg.substring(1);
                ggg = this.computedValue(ggg);
                var d2 = this._parseDouble(ggg);
                if (!isNaN(d2)) {
                    d2 = -d2;
                    return d2.toString();
                }
                return this.computedValue(arg);
            } else {
                if (arg.indexOf("unu") == 0) {
                    arg = "n" + arg.substring(3);
                } else if (arg.indexOf("un") == 0) {
                    arg = "-" + arg.substring(2);
                }

                arg = arg.split('u').join('-');
                if (!this._isUpperChar(arg[0]) && (this._isDigit(arg[0]) || arg[0] == this.getParseDecimalSeparator() || arg[0] == '-' || arg[0] == 'n')) {
                    if (arg[0] == 'n') {
                        arg = arg.substring(1);
                    }

                    d = this._parseDouble(arg);
                    if (!isNaN(d)) {
                        return this._preserveLeadingZeros ? arg : d.toString();
                    } else if (arg.indexOf(this.trueValueStr) == 0 || arg.indexOf(this.falseValueStr) == 0) {
                        return arg;
                    }
                }
            }
            if (this._ignoreCellValue && !(arg.indexOf(this.trueValueStr) == 0 || arg.indexOf(this.falseValueStr) == 0)) {
                this._ignoreCellValue = false;
                return arg;
            }

            var symbolArray = ['+', '-', '/', '*', ')', ')', '{'];

            ////Not a number.
            if ((this._indexOfAny(arg, symbolArray) == -1 && this._isUpperChar(arg[0])) || arg[0] == this.sheetToken) {

                if (((arg != this.trueValueStr && arg != this.falseValueStr)) && this._isCellReference(arg)) {
                    var family = CalcEngine.getSheetFamilyItem(this.grid);
                    if (family.sheetNameToParentObject != null && arg.indexOf(this.sheetToken) == -1) {
                        var token = family.parentObjectToToken.getItem(this.grid);
                        arg = token + arg;
                    }
                }
                ////Check for circular reference.
                if (arg == this.cell) {
                    var ht = this.getDependentCells().getItem(arg);
                    if (ht != null && ht.indexOf(arg) > -1) {
                        this._arrayRemove(ht, arg);
                    }
                    if (!this.getDependentFormulaCells().containsKey(this.cell))
                        this.clearFormulaDependentCells(this.cell);
                    throw this.formulaErrorStrings[this._circular_reference_] + arg;
                }

                var s1 = this.getValueFromParentObjectCell(arg);
                if (arg != this.trueValueStr && arg != this.falseValueStr) {
                    d = this._parseDouble(s1.split(this.tic).join(""));
                    if (!this._preserveLeadingZeros && s1.length > 0 && !isNaN(d)) {
                        s1 = d.toString();
                    }

                    this.updateDependencies(arg);
                }
                if (s1 == this.tic + this.tic) {
                    return "NaN";
                }
                var doubleValue;
                tempDate = this._isDate(s1);
                if (this.getExcelLikeComputations() && this.getUseDatesInCalculations() && !isNaN(tempDate) && isNaN(this._parseDouble(s1)) && !isNaN(tempDate.getDate()) && this._dateTime1900 <= tempDate) {
                    s1 = this._toOADate(tempDate).toString();
                }
                return s1;
            }

            ////Must be a formula, so try to parse it and compute.
            arg = arg.split('{').join('(');
            arg = arg.split('}').join(')');
            arg = this._parse(arg);

            d = this._parseDouble(arg.substring(0, arg.length - 1));
            if (arg.indexOf("%") == (arg.length - 1) && !isNaN(d)) {
                arg = (Number(d) / 100).toString();
            }
            if (this.getErrorStrings().indexOf(arg) > -1) {
                return arg;
            }

            return this.computedValue(arg);
        };
        this.getValueFromParentObjectCell = function (cell1) {
            if (cell1 == this.trueValueStr || cell1 == this.falseValueStr) {
                return cell1;
            }

            var i = cell1.lastIndexOf(this.sheetToken);
            var row = 0, col = 0;
            var grd = this.grid;
            var family = CalcEngine.getSheetFamilyItem(this.grid);
            if (i > -1 && family.tokenToParentObject != null) {
                this.grid = family.tokenToParentObject.getItem(cell1.substring(0, i + 1));
                row = this.rowIndex(cell1);
                col = this.colIndex(cell1);
            } else if (i == -1) {
                var j = 0;
                while (j < cell1.length && this._isLetter(cell1[j])) {
                    j++;
                }
                if (j == cell1.length) {
                    cell1 = cell1.toLowerCase();
                    if (this.getRethrowLibraryComputationExceptions())
                        throw this.formulaErrorStrings[this._bad_formula];
                    return this.getErrorStrings()[5].toString();
                } else {
                    row = this.rowIndex(cell1);
                    col = this.colIndex(cell1);
                    if (this.isSheetMember() && family.parentObjectToToken != null) {
                        cell1 = family.parentObjectToToken.getItem(this.grid) + cell1;
                    }
                }
            }

            var saveCell = (this.cell == "" || this.cell == null) ? "" : this.cell;
            this.cell = cell1;

            if (this._iterationMaxCount > 0) {
                if (this._circCheckList.indexOf(this.cell) > -1 && this.computedValueLevel > 0) {
                    this.grid = grd;
                    this.cell = saveCell;

                    if (!this.getIterationValues().containsKey(this.cell)) {
                        this.getIterationValues().add(this.cell, "0");
                    }

                    return this.getIterationValues().getItem(this.cell).toString();
                } else if (this.getIterationValues().containsKey(this.cell) && this.computedValueLevel > 0) {
                    return this.getIterationValues.getItem(this.cell).toString();
                }
            }

            var val = this._getValueComputeFormulaIfNecessary(row, col, this.grid);

            this.grid = grd;
            this.cell = saveCell;
            return val;
        };
        this.getValueFromParentObject = function (grd, row, col) {
            var family = CalcEngine.getSheetFamilyItem(grd);
            var cell1 = (family.parentObjectToToken == null || family.parentObjectToToken.length == 0) ? "" : family.parentObjectToToken.getItem(grd).toString();
            cell1 = cell1 + RangeInfo.getAlphaLabel(col) + row.toString();

            var saveGrid = this.grid;
            var saveCell = this.cell;
            this.cell = cell1;
            this.grid = grd;

            var val = this._getValueComputeFormulaIfNecessary(row, col, grd);
            var tempDate = new Date(Date.parse(val));
            var doubleValue = this._parseDouble(val);
            if (this.getExcelLikeComputations() && this.getUseDatesInCalculations() && isNaN(doubleValue) && !isNaN(tempDate.getDate()) && this._dateTime1900 <= tempDate) {
                val = this._toOADate(tempDate).toString();
            }
            this.grid = saveGrid;
            this.cell = saveCell;
            return val;
        };
        this.getValueFromParentObjectRowCol = function (row, col) {
            return this._getValueComputeFormulaIfNecessary(row, col, this.grid);
        }

        this.handleIteration = function (s, formula) {
            if (this.getFormulaInfoTable().containsKey(s)) {
                this.getFormulaInfoTable.add(s, formula);
            } else {
                this.getFormulaInfoTable.add(s, formula);
            }
            if (this._iterationMaxCount > 0) {
                if (s == this.cell) {
                    this._handleIterations(formula);
                }
            }
            return formula.getFormulaValue();
        };
        this.handleSheetRanges = function (text, family) {
            var sheetLoc = text.indexOf(this.sheetToken);
            var start = 0;
            while (sheetLoc > 0) {
                var colonLoc = this._substring(text, start, sheetLoc).lastIndexOf(':');
                if (colonLoc > -1) {
                    var rightSide = this._substring(text, start + colonLoc + 1, sheetLoc - colonLoc - 1).toUpperCase().split("'").join("");
                    var trimStr = (this._isIE8) ? rightSide.replace(/^\s+|\s+$/g, '') : rightSide.trim();
                    if (family.sheetNameToToken.containsKey(trimStr)) {
                        var leftStart = start + colonLoc - 1;
                        if (this._sortedSheetNames.contains(rightSide)) {
                            leftStart = leftStart - rightSide.length - 1;
                        } else {
                            while (leftStart > 0 && this._markers.indexOf(text[leftStart]) == -1) {
                                leftStart--;
                            }
                        }

                        var leftSide = this._substring(text, leftStart + 1, colonLoc - leftStart + start - 1).toUpperCase().split("'").join("");
                        trimStr = (this._isIE8) ? leftSide.replace(/^\s+|\s+$/g, '') : leftSide.trim();
                        if (family.sheetNameToToken.containsKey(trimStr)) {
                            var rightEnd = sheetLoc + start + 1;
                            if (this._sortedSheetNames.contains(trimStr)) {
                                rightEnd = text.length - 1;
                            } else {
                                while (rightEnd < text.length && this._markers.indexOf(text[rightEnd]) == -1) {
                                    rightEnd++;
                                }
                            }

                            var otherSide = this._substring(text, start + sheetLoc + 1, rightEnd - start - sheetLoc - 1);
                            var left = family.sheetNameToToken.getItem(trimStr).toString();
                            var right = family.sheetNameToToken.getItem(trimStr).toString();

                            ////make sure they are ordered properly
                            if (right < left) {
                                var s = left;
                                left = right;
                                right = s;
                            }

                            var replacement = "";

                            for (var name = 0; name < _sortedSheetNames.length; name++) {
                                var s = family.sheetNameToToken.getItem(this._sortedSheetNames[name]).toString();
                                var sint = parseInt(s.split("!").join(""));
                                var leftint = parseInt(left.split("!").join(""));
                                var rightint = parseInt(right.split("!").join(""));
                                if (sint > leftint && sint < rightint) {
                                    if (replacement.length > 0) {
                                        replacement += this.getParseArgumentSeparator();
                                    }

                                    replacement += name + String.fromCharCode(131) + otherSide;
                                }
                            }

                            text = text.substring(0, leftStart + 1) + replacement + text.substring(rightEnd);
                            start = text.length - rightEnd;
                        } else {
                            start = sheetLoc + start;
                        }
                    } else {
                        start = sheetLoc + start;
                    }
                } else {
                    start = sheetLoc + start;
                }

                sheetLoc = text.substring(start + 1).indexOf(this.sheetToken) + 1;
            }

            text = text.split(String.fromCharCode(131)).join(this.sheetToken);
            return text;
        };
        this.isSheetMember = function () {
            var family = CalcEngine.getSheetFamilyItem(this.grid);
            return (family == null || family == undefined) ? false : family.isSheetMember;
        };
        this.parseAndComputeFormula = function (formulaString) {
            var formula = formulaString;
            if (formula.length > 0 && formula[0] == this.getFormulaCharacter()) {
                formula = formula.substring(1);
            }

            if (formula.length > 0 && formula[0] == '+') {
                formula = formula.substring(1);
            }
            if (formula.length > 1 && formula[0] == ',') {
                if (formula[1] >= '0' && formula[1] <= '9')
                    formula = "0" + ',' + formula.substring(1);
            }
            var tempFormula = formula.split(" ").join("");

            for (var i = tempFormula.indexOf("("); i != -1 && i < tempFormula.length; i++) {
                if (i > 0) {
                    if (this._isDigit(tempFormula[i - 1])) {
                        if (!this._checkHasCharBeforeNumber(tempFormula.substring(0, i)))
                            throw (this.formulaErrorStrings[this._bad_formula] + " " + tempFormula.substring(0, i + 1));
                    }
                    var next = tempFormula.substring(i + 1).indexOf('(');
                    if (next == -1) {
                        break;
                    } else {
                        i += next;
                    }
                }
            }
            for (var i = tempFormula.indexOf(")"); i != -1 && i < tempFormula.length - 1; i++) {
                if (this._isDigit(tempFormula[i + 1])) {
                    throw (this.formulaErrorStrings[this._bad_formula] + " " + tempFormula.substring(0, i + 2));
                }
                var next = tempFormula.substring(i + 1).indexOf(')');
                if (next == -1) {
                    break;
                } else {
                    i += next;
                }
            }
            this._multiTick = false;

            var s = this._parse(formula);
            return this.computedValue(s);
        };
        this.parseFormula = function (formula) {
            if (formula.length > 0 && formula[0] == this.getFormulaCharacter()) {
                formula = formula.substring(1);
            }

            if (formula.length > 0 && formula[0] == '+') {
                formula = formula.substring(1);
            }

            this._isRangeOperand = this._supportRangeOperands && this._isRange(formula);
            if (this.getCheckDanglingStack() && (formula.split(" ").join("")).indexOf(this._braceRightNLeft) > -1) {
                this.computedValueLevel = 0;
                return this.formulaErrorStrings[this._improper_formula];
            }
            var trimStr = (this._isIE8) ? formula.replace(/^\s+|\s+$/g, '') : formula.trim();
            return this._parse(trimStr);
        };
        this.getUpdatedValueCell = function (cellRef) {
            var isUseFormulaValueChanged = false;
            this._inAPull = true;
            var grd = this.grid;
            var saveCell = this.cell;
            var family = CalcEngine.getSheetFamilyItem(this.grid);
            var s = cellRef.toUpperCase();
            var i;
            if ((i = s.indexOf(this.sheetToken)) == -1 && this.cell != "" && this.cell != undefined) {
                i = this.cell.indexOf(this.sheetToken, 1);
                if (i > -1 && family.tokenToParentObject != null) {
                    s = this.cell.substring(0, i + 1) + s;
                    this.grid = family.tokenToParentObject.getItem(this.cell.substring(0, i + 1));
                }
            } else {
                if (i > 0 && family.sheetNameToToken != null && family.tokenToParentObject != null) {
                    ////need sheet id
                    var token = family.sheetNameToToken.getItem(s.substring(0, i));
                    s = token + s.substring(i + 1);
                    this.grid = family.tokenToParentObject.getItem(token);
                    this.cell = s;
                }
            }

            this.updateCalcID();
            var txt;
            if (!this.getDependentFormulaCells().containsKey(s) && !this.getFormulaInfoTable().containsKey(s)) {
                txt = this.getValueFromParentObjectCell(s);
                while (this._breakedFormulaCells.length == 1) {
                    this.updateCalcID();
                    txt = this.getValueFromParentObjectCell(this._breakedFormulaCells[0].toString());
                    this._breakedFormulaCells.removeAt(0);
                    this.setUseFormulaValues(true);
                }
                if (this.getUseFormulaValues()) {
                    this.isUseFormulaValueChanged = true;
                    this.setUseFormulaValue(false);
                }
                if (this._tempBreakedFormulaCells.length > 0) {
                    for (var p = 1; p <= this._tempBreakedFormulaCells.length; p++) {
                        txt = this.getValueFromParentObjectCell(this._tempBreakedFormulaCells[this._tempBreakedFormulaCells.length - p].toString());
                    }
                    this._tempBreakedFormulaCells.length = 0;
                    txt = this.getValueFromParentObjectCell(s);
                }
                this.setUseFormulaValues(this.isUseFormulaValueChanged);
                var saveIVC = this.ignoreValueChanged;
                this.ignoreValueChanged = true;
                var row = this.rowIndex(s);

                var col = this.colIndex(s);
                if (this.getPreserveFormula()) {
                    var token = this._sheetToken(cellRef);
                    if (token == "") {
                        token = "!" + this.getSheetID(this.grid) + "!";
                        var formula = this.getFormulaInfoTable().getItem(token + s);
                        if (formula != null && formula != undefined) {
                            if (this.parentObject.setValueRowCol == undefined)
                                this.setValueRowCol(this.getSheetID(this.grid) + 1, formula.getFormulaText(), row, col);
                            else
                                this.parentObject.setValueRowCol(this.getSheetID(this.grid) + 1, formula.getFormulaText(), row, col);
                        }
                    } else if (this.parentObject.setValueRowCol == undefined)
                        this.setValueRowCol(this.getSheetID(this.grid) + 1, txt, row, col);
                    else
                        this.parentObject.setValueRowCol(this.getSheetID(this.grid) + 1, txt, row, col);
                } else if (this.parentObject.setValueRowCol == undefined)
                    this.setValueRowCol(this.getSheetID(this.grid) + 1, txt, row, col);
                else
                    this.parentObject.setValueRowCol(this.getSheetID(this.grid) + 1, txt, row, col);

                this.ignoreValueChanged = saveIVC;
            } else {
                this._processedCells.clear();
                this.updateDependenciesAndCell(s);
                this._processedCells.clear();
                txt = this.getValueFromParentObject(s);
            }

            this.grid = grd;
            this.cell = saveCell;
            this._inAPull = false;

            return txt;
        };
        this.getUpdatedValueRowCol = function (targetSheetID, row, col) {
            var saveGrid = this.grid;
            var family = CalcEngine.getSheetFamilyItem(this.grid);
            var token = this.sheetToken + targetSheetID.toString() + this.sheetToken;
            this.grid = family.tokenToParentObject.getItem(token);
            this._inAPull = true;
            var s = token + RangeInfo.getAlphaLabel(col) + row.toString();

            this.updateCalcID();

            if (!this.getDependentFormulaCells().containsKey(s) && !this.formulaInfoTable.containsKey(s)) {
                var txt = this.getValueFromParentObjectCell(s);
                var saveIVC = this.ignoreValueChanged;
                this.ignoreValueChanged = true;
                if (this.parentObject.setValueRowCol == undefined)
                    this.setValueRowCol(this.getSheetID(this.grid) + 1, txt, row, col);
                else
                    this.parentObject.setValueRowCol(this.getSheetID(this.grid) + 1, txt, row, col);
                this.ignoreValueChanged = saveIVC;
            } else {
                this._processedCells.clear();
                this.updateDependenciesAndCell(s);
                this._processedCells.clear();
            }

            this.grid = saveGrid;
            this._inAPull = false;
        };
        this.setTokensForSheets = function (text) {
            var family = CalcEngine.getSheetFamilyItem(this.grid);

            if (this.getSupportsSheetRanges()) {
                text = this.handleSheetRanges(text, family);
            }

            var sortedSheetNamesCollection = this.getSortedSheetNames();

            ////family.SheetNameToToken.Keys)
            if (sortedSheetNamesCollection != null) {
                for (var name = 0; name < sortedSheetNamesCollection.length; name++) {
                    var token = family.sheetNameToToken.getItem(sortedSheetNamesCollection[name]);
                    token = token.split(this.sheetToken).join(this._tempSheetPlaceHolder);

                    ////keep the tic defect#541 - TODO: Optimize this process - cache tic names for instance
                    var s = "'" + sortedSheetNamesCollection[name].toUpperCase() + "'" + this.sheetToken;
                    if (text.indexOf(s) == -1) {
                        s = sortedSheetNamesCollection[name].toUpperCase() + this.sheetToken;
                    }

                    text = text.split(s).join(token);

                    //do it again without the tics
                    s = sortedSheetNamesCollection[name].toUpperCase() + this.sheetToken;

                    text = text.split(s).join(token);
                }
            }

            text = text.split(this._tempSheetPlaceHolder).join(this.sheetToken);
            return text;
        };
        this.recalculateRange = function (range, data) {
            this._inRecalculateRange = true;
            for (var row = range.getTop(); row <= range.getBottom(); ++row) {
                for (var col = range.getLeft() ; col <= range.getRight() ; ++col) {
                    if (this.parentObject.getValueRowCol != undefined)
                        this.parentObject.setValueRowCol(this.getSheetID(data) + 1, this.parentObject.getValueRowCol(this.getSheetID(data) + 1, row, col), row, col);
                    else
                        data.setValueRowCol(this.getSheetID(data) + 1, data.getValueRowCol(this.getSheetID(data) + 1, row, col), row, col);
                }
            }
            this._inRecalculateRange = false;
        };
        this.refresh = function (s) {
            ////Don't refresh any cells.
            if (this.getCalculatingSuspended()) {
                return;
            }

            if (this._dependencyLevel == 0) {
                this._refreshedCells.clear();
            }

            if (this.getDependentCells().containsKey(s) && this.getDependentCells().getItem(s) != null) {
                this._dependencyLevel++;
                try  {
                    var family = CalcEngine.getSheetFamilyItem(this.grid);

                    var ht = this.getDependentCells().getItem(s);
                    var save1 = this._lockDependencies;
                    this._lockDependencies = true;
                    for (var o = 0; o < ht.length; o++) {
                        var s1 = ht[o];
                        if (s1 != null) {
                            var grd = this.grid;
                            var sheet = this._sheetToken(s1);
                            if (sheet.length > 0) {
                                this.grid = family.tokenToParentObject.getItem(sheet);
                            }
                            try  {
                                var row = this.rowIndex(s1);
                                var col = this.colIndex(s1);

                                var info = this.getFormulaInfoTable().getItem(s1);
                                if (info != null) {
                                    var save = this.cell;
                                    this.cell = s1;
                                    if (this.getAlwaysComputeDuringRefresh() || info.calcID != this._calcID || info.getFormulaValue() == "") {
                                        info.setFormulaValue(this.computeFormula(info.getParsedFormula()));
                                    }

                                    info.calcID = this._calcID;
                                    this.cell = save;
                                    var saveIVC = this.ignoreValueChanged;
                                    this.ignoreValueChanged = true;
                                    if (this.parentObject.setValueRowCol == undefined)
                                        this.setValueRowCol(this.getSheetID(this.grid) + 1, info.getFormulaValue(), row, col);
                                    else
                                        this.parentObject.setValueRowCol(this.getSheetID(this.grid) + 1, info.getFormulaValue(), row, col);
                                    this.ignoreValueChanged = saveIVC;
                                    if (!this._refreshedCells.containsKey(s1)) {
                                        this._refreshedCells.add(s1, 0); ////from below ...a
                                        this.refresh(s1); ////recursive call
                                    }
                                }
                            } catch (ex) {
                                continue;
                            }
                            this.grid = grd;
                        }
                    }

                    this._lockDependencies = save1;
                } finally {
                    if (!this._refreshedCells.containsKey(s)) {
                        this._refreshedCells.add(s, 0);
                    }

                    this._dependencyLevel--;
                    if (this._dependencyLevel == 0) {
                        this._refreshedCells.clear();
                    }
                }
            }
        };
        this.refreshRange = function (range) {
            for (var r = range.getTop(); r <= range.getBottom(); r++) {
                for (var c =range.getLeft(); c <= range.getRight(); c++) {
                    var s = RangeInfo.getAlphaLabel(c) + r.toString();
                    this._dependencyLevel = 0;
                    var family = CalcEngine.getSheetFamilyItem(this.grid);
                    var token = this.sheetToken + this.getSheetID(this.grid).toString() + this.sheetToken;
                    if (family.tokenToParentObject != null && family.tokenToParentObject.contains(token))
                        this.grid = family.tokenToParentObject.getItem(token);

                    s = token + s;
                    this.refresh(s);
                }
            }
        };
        this.registerGridAsSheet = function (refName, model, sheetFamilyID) {
            ////refName = refName.replace(" ", ""); //keep the spaces defect#541
            if (CalcEngine.modelToSheetID != null) {
                // this.wireParentObject();
            }


            if (CalcEngine.modelToSheetID == null) {
                CalcEngine.modelToSheetID = new HashTable();
            }

            if (CalcEngine.modelToSheetID.getItem(model) == null || CalcEngine.modelToSheetID.getItem(model) == undefined) {
                CalcEngine.modelToSheetID.add(model, sheetFamilyID);
            }

            var family = CalcEngine.getSheetFamilyItem(model);
            family.isSheetMember = true;

            var refName1 = refName.toUpperCase();
            if (family.sheetNameToParentObject == null) {
                family.sheetNameToParentObject = new HashTable();
            }

            if (family.tokenToParentObject == null) {
                family.tokenToParentObject = new HashTable();
            }

            if (family.sheetNameToToken == null) {
                family.sheetNameToToken = new HashTable();
            }

            if (family.parentObjectToToken == null) {
                family.parentObjectToToken = new HashTable();
            }

            if (family.sheetNameToParentObject.getItem(refName1) != undefined) {
                var token = family.sheetNameToToken.getItem(refName1);
                family.tokenToParentObject.add(token, model);
                family.parentObjectToToken.add(model, token);
            } else {
                var token = this.sheetToken + CalcEngine._tokenCount.toString() + this.sheetToken;
                CalcEngine._tokenCount++;
                family.tokenToParentObject.add(token, model);
                family.sheetNameToToken.add(refName1, token);
                family.sheetNameToParentObject.add(refName1, model);
                family.parentObjectToToken.add(model, token);
                this.sortedSheetNames = null;
            }
            return refName;
        };

        this.removeFunction = function (name) {
            if (this._customlibraryFunctions.getItem(name) != undefined) {
                this._customlibraryFunctions.remove(name);
            }
            if (this._libraryFunctions.getItem(name) != null) {
                this._libraryFunctions.remove(name);
                return true;
            }
            return false;
        };
        this.removeNamedRange = function (name) {
            name = name.toUpperCase();
            if (this.getNamedRanges().getItem(name) != null) {
                this.getNamedRanges().remove(name);
                this._populateNamedRangesNonScoped();
                return true;
            }
            return false;
        };
        this.rowIndex = function (s) {
            var i = 0;
            var result;

            var isLetter = false;
            if (i < s.length && s[i] == this.sheetToken) {
                i++;
                while (i < s.length && s[i] != this.sheetToken) {
                    i++;
                }

                i++;
            }

            while (i < s.length && this._isLetter(s[i])) {
                isLetter = true;
                i++;
            }
            result = parseInt(s.substring(i));
            if (i < s.length && !isNaN(result)) {
                return result;
            }

            if (isLetter) {
                return -1;
            }
            throw this.formulaErrorStrings[this._bad_index];
        };
        this.splitArgsPreservingQuotedCommas = function (args) {
            if (args.toString().indexOf(this.tic) == -1) {
                return args.toString().split(this._parseArgumentSeparator);
            }

            var formulaStrings = this._saveStrings(args);
            args = this._saveStringsText;
            var results = args.split(this._parseArgumentSeparator);
            var pieces = [];
            for (var s = 0; s < results.length; s++) {
                var s1 = results[s];
                s1 = this._setStrings(s1, formulaStrings); ////replace tokens with original strings
                pieces.push(s1);
            }
            return pieces;
        };
        this.removeTics = function (s) {
            if (s.length > 1 && s[0] == this.tic[0] && s[s.length - 1] == this.tic[0]) {
                if (this._substring(s, 1, s.length - 2).indexOf(this.tic) == -1) {
                    s = this._substring(s, 1, s.length - 2);
                } else if (this._multiTick) {
                    s = this._substring(s, 1, s.length - 2);
                }
            }
            return s;
        };
        this.updateCalcID = function () {
            this._calcID++;
            if (this._calcID == Number.MAX_SAFE_INTEGER) {
                this._calcID = Number.MIN_SAFE_INTEGER + 1;
            }
        };
        this.updateDependencies = function (s) {
            ////TraceUtil.TraceCurrentMethodInfoIf(Switches.FormulaCell.TraceVerbose, this);
            if (this._lockDependencies || !this.getUseDependencies()) {
                return;
            }
            var family = CalcEngine.getSheetFamilyItem(this.grid);
            var cell1 = this.cell;
            if (family.sheetNameToParentObject != null && cell1.indexOf(this.sheetToken) == -1) {
                var token = family.parentObjectToToken.getItem(this.grid);
                cell1 = token + cell1;
            }
            if (family.sheetNameToParentObject != null && s.indexOf(this.sheetToken) == -1) {
                var token = family.parentObjectToToken.getItem(this.grid);
                s = token + s;
            }

            if (!this.getDependentCells().containsKey(s)) {
                var ht1 = [];
                this.getDependentCells().add(s, ht1);

                ht1.push(cell1);

                if (this.getDependentFormulaCells().containsKey(s)) {
                    var ht = this.getDependentFormulaCells()[s];
                    if (ht != null) {
                        var keys = ht.keys();
                        for (var o = 0; o < keys.length; o++) {
                            var s1 = keys[o];
                            var ht2 = this.getDependentCells().getItem(s1);
                            if (ht2 == null) {
                                ht2 = [];
                                this.getDependentCells().add(s1, ht2);
                            }

                            if (ht2.indexOf(cell1) == -1) {
                                ht2.push(cell1);
                            }
                        }
                    }
                }

                ////	else
                this._addToFormulaDependentCells(s);

                if (this.getDependentCells().containsKey(cell1)) {
                    var htCells = this.getDependentCells().getItem(cell1);
                    if (htCells != null && htCells != ht1) {
                        for (var o = 0; o < htCells.length; o++) {
                            var s1 = htCells[o];
                            ht1.push(s1);
                        }
                    }
                }
            } else {
                var ht1 = this.getDependentCells().getItem(s);

                if (ht1.indexOf(cell1) == -1) {
                    ht1.push(cell1);
                }

                this._addToFormulaDependentCells(s);

                ////maybe remove this block ..... not needed if other dependencies working OK
                if (this.getDependentFormulaCells().containsKey(s)) {
                    var ht = this.getDependentFormulaCells().getItem(s);
                    if (ht != null) {
                        var keys = ht.keys();
                        for (var o = 0; o < keys.length; o++) {
                            var s1 = keys[o];
                            var ht2 = this.getDependentCells().getItem(s1);
                            if (ht2 == null) {
                                ht2 = [];
                                this.getDependentCells().add(s1, ht2);
                            }
                            if (ht2.indexOf(cell1) == -1) {
                                ht2.push(cell1);
                            }
                        }
                    }
                }
            }
        };
        this.updateDependenciesAndCell = function (cell1) {
            var grd = this.grid;
            var family = CalcEngine.getSheetFamilyItem(this.grid);

            var sheet = this._sheetToken(cell1);
            if (sheet.length > 0) {
                this.grid = family.tokenToParentObject.getItem(sheet);
            }

            if (this.formulaInfoTable.containsKey(cell1)) {
                var formula = this.formulaInfoTable[cell1];
                if (formula.calcID != this._calcID) {
                    var saveCell = this.cell;
                    this.cell = cell1;

                    if (this._iterationMaxCount > 0 && this._circCheckList.indexOf(this.cell) > -1) {
                        this._handleIterations(formula);
                    } else {
                        formula.setFormulaValue(this.computeFormula(formula.getParsedFormula()));
                    }

                    if (this.getDependentCells().containsKey(cell1)) {
                        var ht = this.getDependentCells().getItem(cell1);
                        for (var s = 0; s < ht.length; s++) {
                            var f = this.FormulaInfoTable.getItem(ht[s]);
                            if (f != null && f != undefined) {
                                f.calcID = Number.MIN_SAFE_INTEGER; ////mark as dirty
                            }
                        }
                    }

                    formula.calcID = this._calcID;
                    this.cell = saveCell;
                }

                var saveIVC = this.ignoreValueChanged;
                this.ignoreValueChanged = true;

                var row = this.rowIndex(cell1);
                var col = this.colIndex(cell1);
                if (this.getPreserveFormula()) {
                    if (this.parentObject.setValueRowCol == undefined)
                        this.setValueRowCol(this.getSheetID(this.grid) + 1, formula.getFormulaText(), row, col);
                    else
                        this.parentObject.setValueRowCol(this.getSheetID(this.grid) + 1, formula.getFormulaText(), row, col);
                }
                this.ignoreValueChanged = saveIVC;

                this.grid = grd;

                if (this._processedCells.contains(cell1)) {
                    return;
                } else {
                    this._processedCells.add(cell1);
                }
                if (this.parentObject.setValueRowCol == undefined)
                    this.setValueRowCol(this.getSheetID(this.grid) + 1, formula.getFormulaValue(), row, col);
                else
                    this.parentObject.setValueRowCol(this.getSheetID(this.grid) + 1, formula.getFormulaValue(), row, col);
                if (this.getDependentFormulaCells().containsKey(cell1)) {
                    var hthash = this.getDependentFormulaCells().getItem(cell1);
                    var keys = hthash.keys();
                    for (var c = 0; c < keys.length; c++) {
                        this.updateDependenciesAndCell(keys[c]); ////recursive call
                    }
                }
            }
        };
        this.valueChanged = function (grid, e) {
            if (this.ignoreValueChanged) {
                return;
            }

            var grd = grid;
            this.grid = grid;

            var computedValueChanged = true;
            var family = CalcEngine.getSheetFamilyItem(grd);
            var s = RangeInfo.getAlphaLabel(e.getColIndex()) + e.getRowIndex().toString();
            if (family.sheetNameToParentObject != null && family.sheetNameToParentObject.length > 0) {
                var token = family.parentObjectToToken.getItem(grd);
                s = token + s;
            }

            if (e.getValue().length > 0 && e.getValue()[0] == this.getFormulaCharacter()) {
                this.cell = s;
                var formula;
                var compute = true;
                if (this.getFormulaInfoTable().containsKey(s)) {
                    formula = this.getFormulaInfoTable().getItem(s);
                    if (e.getValue() != formula.getFormulaText() || formula.getParsedFormula() == null) {
                        formula.setFormulaText(e.getValue());
                        if (this.getDependentFormulaCells().containsKey(this.cell))
                            this.clearFormulaDependentCells(this.cell);
                        try  {
                            formula.setParsedFormula(this.parseFormula(e.getValue()));
                        } catch (ex) {
                            formula.setFormulaValue(ex);
                            compute = false;
                        }
                    }

                    if (compute) {
                        var s1 = this.computeFormula(formula.getParsedFormula());

                        computedValueChanged = (s1 != formula.getFormulaValue()) || this.getForceRefreshCall();

                        formula.setFormulaValue(s1);
                    }

                    formula.calcID = this._calcID;
                } else {
                    formula = new FormulaInfo();
                    formula.setFormulaText(e.getValue());
                    if (!this.getDependentFormulaCells().containsKey(s)) {
                        this.getDependentFormulaCells().add(s, new HashTable());
                    }

                    try  {
                        formula.setParsedFormula(this.parseFormula(e.getValue()));
                    } catch (ex) {
                        formula.setFormulaValue(ex);
                        compute = false;
                    }

                    if (compute) {
                        formula.setFormulaValue(this.computeFormula(formula.getParsedFormula()));
                        if (this.computeIsFormula(formula).toString() == "#NAME?" && !(this.getNamedRanges().containsKey(formula.getFormulaText().split("=")[1].toUpperCase())))
                            this.getUndefinedNamedRanges().add(formula.getFormulaText().split("=")[1].toUpperCase());
                    }

                    formula.calcID = this._calcID;

                    if (this.getFormulaInfoTable().containsKey(s)) {
                        this.getFormulaInfoTable().add(s, formula);
                    } else {
                        this.getFormulaInfoTable().add(s, formula);
                    }
                }

                if (this._iterationMaxCount > 0 && compute && !this._inHandleIterations) {
                    if (s == this.cell) {
                        this._handleIterations(formula);
                    }
                }

                var saveIVC = this.ignoreValueChanged;
                this.ignoreValueChanged = true;
                if (this.parentObject.setValueRowCol == undefined)
                    this.setValueRowCol(this.getSheetID(grd) + 1, formula.getFormulaValue(), e.getRowIndex(), e.getColIndex());
                else
                    this.parentObject.setValueRowCol(this.getSheetID(grd) + 1, formula.getFormulaValue(), e.getRowIndex(), e.getColIndex());
                if (formula != null && formula.getFormulaValue() == "" && e.getValue().startsWith(this.getFormulaCharacter()) && this.getTreatStringsAsZero()) {
                    if (this.parentObject.setValueRowCol == undefined)
                        this.setValueRowCol(this.getSheetID(this.grid) + 1, "0", e.getRowIndex(), e.getColIndex());
                    else
                        this.parentObject.setValueRowCol(this.getSheetID(this.grid) + 1, "0", e.getRowIndex(), e.getColIndex());
                }
                this.ignoreValueChanged = saveIVC;
            } else if (!this._inRecalculateRange && this.getFormulaInfoTable().containsKey(s)) {
                this.getFormulaInfoTable().remove(s);
                if (this.getDependentFormulaCells().containsKey(s))
                    this.clearFormulaDependentCells(s);
            }

            if (computedValueChanged && this.getDependentCells().containsKey(s)) {
                this._dependencyLevel = 0;
                this.refresh(s);
            }
        };
        this.getActiveCell = function () {
            return this.cell;
        };
        this.getAllowShortCircuitIFs = function () {
            return this._allowShortCircuitIFs;
        };
        this.setAllowShortCircuitIFs = function (value) {
            this._allowShortCircuitIFs = value;
        };
        this.getAlwaysComputeDuringRefresh = function () {
            return this._alwaysComputeDuringRefresh;
        };
        this.setAlwaysComputeDuringRefresh = function (value) {
            this._alwaysComputeDuringRefresh = value;
        };
        this.getCalculatingSuspended = function () {
            return this._calculatingSuspended;
        };
        this.setCalculatingSuspended = function (value) {
            this._calculatingSuspended = value;
        };
        this.getCheckDanglingStack = function () {
            return this._checkDanglingStack;
        };
        this.setCheckDanglingStack = function (value) {
            this._checkDanglingStack = value;
        };
        this.getCustomLibraryFunctions = function () {
            return this._customlibraryFunctions;
        };
        this.getDependentCells = function () {
            if (this.isSheetMember()) {
                var family = CalcEngine.getSheetFamilyItem(this.grid);
                if (family.sheetDependentCells == null) {
                    family.sheetDependentCells = new HashTable();
                }

                return family.sheetDependentCells;
            } else {
                if (this._dependentCells == null) {
                    this._dependentCells = new HashTable();
                }

                return this._dependentCells;
            }
        };
        this.getDependentFormulaCells = function () {
            if (this.isSheetMember()) {
                var family = CalcEngine.getSheetFamilyItem(this.grid);
                if (family.sheetDependentFormulaCells == null) {
                    family.sheetDependentFormulaCells = new HashTable();
                }

                return family.sheetDependentFormulaCells;
            } else {
                if (this._dependentFormulaCells == null) {
                    this._dependentFormulaCells = new HashTable();
                }

                return this._dependentFormulaCells;
            }
        };
        this.getEnableLookupTableCaching = function () {
            return this._enableLookupTableCaching;
        };
        this.setEnableLookupTableCaching = function (value) {
            this._enableLookupTableCaching = value;
        };
        this.getErrorStrings = function () {
            if (this._errorStrings == null) {
                this._errorStrings = ["#N/A", "#VALUE!", "#REF!", "#DIV/0!", "#NUM!", "#NAME?", "#NULL!"];
            }
            return this._errorStrings;
        };
        this.setErrorStrings = function (value) {
            this._errorStrings = value;
        };
        this.getExcelLikeComputations = function () {
            return this._excelLikeComputations;
        };
        this.setExcelLikeComputations = function (value) {
            this._excelLikeComputations = value;
        };
        this.getForceRefreshCall = function () {
            return this._forceRefreshCall;
        };
        this.setForceRefreshCall = function (value) {
            this._forceRefreshCall = value;
        };
        this.getFormulaCharacter = function () {
            if (CalcEngine._formulaChar == '\0') {
                CalcEngine._formulaChar = '=';
            }
            return CalcEngine._formulaChar;
        };
        this.setFormulaCharacter = function (value) {
            CalcEngine._formulaChar = value;
        };
        this.getFormulaInfoTable = function () {
            if (this.isSheetMember()) {
                var family = CalcEngine.getSheetFamilyItem(this.grid);
                if (family.sheetFormulaInfoTable == null) {
                    family.sheetFormulaInfoTable = new HashTable();
                }

                return family.sheetFormulaInfoTable;
            } else {
                if (this._formulaInfoTable == null) {
                    this._formulaInfoTable = new HashTable();
                }

                return this._formulaInfoTable;
            }
        };
        this.getPreserveLeadingZeros = function () {
            return this._preserveLeadingZeros;
        };
        this.setPreserveLeadingZeros = function (value) {
            this._preserveLeadingZeros = value;
        };
        this.getIterationMaxCount = function () {
            return this._iterationMaxCount;
        };
        this.setIterationMaxCount = function (value) {
            this._iterationMaxCount = value;
            if (this._iterationMaxCount > 0) {
                this.setThrowCircularException(true);
            }
        };
        this.getIterationMaxTolerance = function () {
            return this._iterationMaxTolerance;
        };
        this.setIterationMaxTolerance = function (value) {
            this._iterationMaxTolerance = value;
        };
        this.getIterationValues = function () {
            if (this._iterationValues == null) {
                this._iterationValues = new HashTable();
            }
            return this._iterationValues;
        };
        this.getLibraryComputationException = function () {
            return this._libraryComputationException;
        };
        this.getLibraryFunctions = function () {
            return this._libraryFunctions;
        };
        this.getLockDependencies = function () {
            return this._lockDependencies;
        };
        this.setLockDependencies = function (value) {
            this._lockDependencies = value;
        };
        this.getMaximumRecursiveCalls = function () {
            return this._maximumRecursiveCalls;
        };
        this.setMaximumRecursiveCalls = function (value) {
            this._maximumRecursiveCalls = value;
        };
        this.getNamedRanges = function () {
            if (this.namedRanges == null) {
                this.namedRanges = new HashTable();
                this._namedRangesNonScoped = new HashTable();
            }
            return this.namedRanges;
        };
        this.setNamedRanges = function (value) {
            this.namedRanges = value;
            this._populateNamedRangesNonScoped();
        };
        this.getUndefinedNamedRanges = function () {
            var family = CalcEngine.getSheetFamilyItem(this.grid);
            if (family != null || family != undefined) {
                if (this.undefinedsheetNamedRnages == null) {
                    this.undefinedsheetNamedRnages = new HashTable();
                }
                return this.undefinedsheetNamedRnages;
            }
            else {
                if (this.undefinednamedRange == null) {
                    this.undefinednamedRange = new HashTable();
                }
                return this.undefinednamedRange;
            }
        };
        this.getNameRangeValues = function () {
            var family = CalcEngine.getSheetFamilyItem(this.grid);
            if (family != null || family != undefined) {
                if (this.namedRangeValues == null) {
                    this.namedRangeValues = new HashTable();
                }
                return this.namedRangeValues;
            }
            else {
                if (this.rangeValues == null) {
                    this.rangeValues = new HashTable();
                }
                return this.rangeValues;
            }
        };
        this.getNamedRangesOriginalNames = function () {
            var family = CalcEngine.getSheetFamilyItem(this.grid);
            if (family != null || family != undefined) {
                if (this.sheetNamedRangesOriginalNames == null) {
                    this.sheetNamedRangesOriginalNames = new HashTable();
                }
                return this.sheetNamedRangesOriginalNames;
            }
            else {
                if (this.namedRangesOriginalNames == null) {
                    this.namedRangesOriginalNames = new HashTable();
                }
                return this.namedRangesOriginalNames;
            }
        };
        this.getNamedRangeCellCollection = function () {
            var family = CalcEngine.getSheetFamilyItem(this.grid);
            if (family != null || family != undefined) {
                if (this.sheetNamedRangeCellCollection == null) {
                    this.sheetNamedRangeCellCollection = new HashTable();
                }
                return this.sheetNamedRangeCellCollection;
            }
            else {
                if (this.namerangecellcollection == null) {
                    this.namerangecellcollection = new HashTable();
                }
                return this.namerangecellcollection;
            }
        };
        this.getDependentNamedRangeCells = function () {
            var family = CalcEngine.getSheetFamilyItem(this.grid);
            if (family != null || family != undefined) {
                if (this.sheetDependentNamedRangeCells == null) {
                    this.sheetDependentNamedRangeCells = new HashTable();
                }
                return this.sheetDependentNamedRangeCells;
            }
            else {
                if (this.dependentNamedRangeCells == null) {
                    this.dependentNamedRangeCells = new HashTable();
                }
                return this.dependentNamedRangeCells;
            }
        };
        this.getParseArgumentSeparator = function () {
            if (this._parseArgumentSeparator == '\0') {
                this._parseArgumentSeparator = ',';
            }
            var seperator = ',';
            if (!this._isParseArgumentSeparator && seperator != this._parseArgumentSeparator) {
                this._parseArgumentSeparator = seperator;
            }
            return this._parseArgumentSeparator;
        };
        this.setParseArgumentSeparator = function (value) {
            this._parseArgumentSeparator = value;
            this._isParseArgumentSeparator = true;
        };
        this.getParseDateTimeSeparator = function () {
            return this._parseDateTimeSeparator;
        };
        this.setParseDateTimeSeparator = function (value) {
            this._parseDateTimeSeparator = value;
        };
        this.getParseDecimalSeparator = function () {
            ////DT 26058 incident
            ////handle problems with threading by dynamically assigning the static values
            if (this._parseDecimalSeparator == '\0') {
                this._parseDecimalSeparator = '.';
            }

            var seperator = '.';
            if (!this._isParseDecimalSeparatorChanged && seperator != this._parseDecimalSeparator) {
                this._parseDecimalSeparator = seperator;
            }

            return this._parseDecimalSeparator;
        };
        this.setParseDecimalSeparator = function (value) {
            this._parseDecimalSeparator = value;
            this._parseDecimalSeparator = true;
        };
        this.getPreserveFormula = function () {
            return this._preserveFormula;
        };
        this.setPreserveFormula = function (value) {
            this._preserveFormula = value;
        };
        this.getReservedWordOperators = function () {
            if (this._reservedWordOperators == null) {
                this._reservedWordOperators = [" or ", " and ", " xor ", "if ", " then ", " else ", "not "];
            }

            return this._reservedWordOperators;
        };
        this.setReservedWordOperators = function (value) {
            this._reservedWordOperators = value;
        };
        this.getRethrowLibraryComputationExceptions = function () {
            return this._rethrowLibraryComputationExceptions;
        };
        this.setRethrowLibraryComputationExceptions = function (value) {
            this._rethrowLibraryComputationExceptions = value;
        };
        this.getRethrowParseExceptions = function () {
            return this._rethrowExceptions;
        };
        this.setRethrowParseExceptions = function (value) {
            this._rethrowExceptions = value;
        };
        this.getRowMaxCount = function () {
            return this._rowMaxCount;
        };
        this.setRowMaxCount = function (value) {
            this._rowMaxCount = value;
        };
        this.getSortedSheetNames = function () {
            if (this._sortedSheetNames == null) {
                var family = CalcEngine.getSheetFamilyItem(this.grid);
                if (family != null && family.sheetNameToToken != null) {
                    this._sortedSheetNames = family.sheetNameToToken.keys();
                    this._sortedSheetNames.sort(); //(new LenComparer());
                }
            }

            return this._sortedSheetNames;
        };
        this.getSupportLogicalOperators = function () {
            return this._supportLogicalOperators;
        };
        this.setSupportLogicalOperators = function (value) {
            this._supportLogicalOperators = value;
        };
        this.getSupportRangeOperands = function () {
            return this._supportRangeOperands;
        };
        this.setSupportRangeOperands = function (value) {
            this._supportRangeOperands = value;
        };
        this.getSupportsSheetRanges = function () {
            return this._supportsSheetRanges;
        };
        this.setSupportsSheetRanges = function (value) {
            this._supportsSheetRanges = value;
        };
        this.getThrowCircularException = function () {
            return this._throwCircularException;
        };
        this.setThrowCircularException = function (value) {
            this._throwCircularException = value;
        };
        this.getTreatStringsAsZero = function () {
            return this._treatStringsAsZero;
        };
        this.setTreatStringsAsZero = function (value) {
            this._treatStringsAsZero = value;
        };
        this.getUseDatesInCalculations = function () {
            return this._useDatesInCalcs;
        };
        this.setUseDatesInCalculations = function (value) {
            this._useDatesInCalcs = value;
        };
        this.getUseDependencies = function () {
            return this._useDependencies;
        };
        this.setUseDependencies = function (value) {
            this._useDependencies = value;
        };
        this.getUseFormulaValues = function () {
            return this._useFormulaValues;
        };
        this.setUseFormulaValues = function (value) {
            this._useFormulaValues = value;
        };
        this.getUseNoAmpersandQuotes = function () {
            return this._useNoAmpersandQuotes;
        };
        this.setUseNoAmpersandQuotes = function (value) {
            this._useNoAmpersandQuotes = value;
        };
        this.getValidPrecedingChars = function () {
            return this._validPrecedingChar + this.getParseArgumentSeparator();
        };
        this.setValidPrecedingChars = function (value) {
            this._validPrecedingChars = value;
        };
        this.getWeekEndType = function () {
            return ["", "6,0", "0,1", "1,2", "2,3", "3,4", "4,5", "5,6", "", "", "", "0", "1", "2", "3", "4", "5", "6"];
        };
        this.computeSum = function (range) {
            var sum = 0, s1, d, adjustRange;
            var ranges = this.splitArgsPreservingQuotedCommas(range);
            if (!range || range.length == 0) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            for (var key = 0; key < ranges.length; key++) {
                adjustRange = ranges[key];
                if (adjustRange.indexOf(':') > -1) {
                    if (adjustRange.startsWith(this.tic)) {
                        if (this._rethrowLibraryComputationExceptions)
                            throw this.formulaErrorStrings[this._bad_index];
                        return this.getErrorStrings()[4].toString();
                    }
                    var cellCollection = this.getCellsFromArgs(adjustRange);
                    for (var s = 0; s < cellCollection.length; s++) {
                        try {
                            if (cellCollection[s].startsWith(this.tic) && isNaN(this._parseDouble(cellCollection[s]))) {
                                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                                    throw this.getLibraryComputationException();
                                return this.getErrorStrings()[1].toString();
                            }
                            var family = CalcEngine.getSheetFamilyItem(this.grid);
							if(!ej.isNullOrUndefined(family.parentObjectToToken))
							{
                            var token = family.parentObjectToToken.getItem(this.grid) + cellCollection[s];
                            var formula = this.getFormulaInfoTable().getItem(token);
                            if (!ej.isNullOrUndefined(formula) && !ej.isNullOrUndefined(formula._formulaText.toUpperCase().match("SUBTOTAL")))
                                s1 = "0";
                            else
                                s1 = this.getValueFromArg(cellCollection[s]).split(this.tic).join("");
							}
							else
							    s1 = this.getValueFromArg(cellCollection[s]).split(this.tic).join("");
                            if (this.getErrorStrings().indexOf(s1) > -1) {
                                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                                    throw this.getLibraryComputationException();
                                return s1;
                            }
                        } catch (ex) {
                            if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null) {
                                throw this.getLibraryComputationException();
                            }

                            return ex;
                        }

                        if (s1 != "") {
                            d = (s1 == this.trueValueStr) ? true : (s1 == this.falseValueStr) ? false : this._parseDouble(s1);
                            if (this.getErrorStrings().indexOf(s1) > -1) {
                                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                                    throw this.getLibraryComputationException();
                                return s1;
                            }
                            if (isNaN(d)) {
                                s1 = "";
                            } else {
                                sum = sum + d;
                            }
                        }
                    }
                } else {
                    try {
                        if (adjustRange.startsWith(this.tic) && isNaN(this._parseDouble(adjustRange))) {
                            if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                                throw this.getLibraryComputationException();
                            return this.getErrorStrings()[1].toString();
                        }
                        s1 = this.getValueFromArg(adjustRange).split(this.tic).join("");
                        if (this.getErrorStrings().indexOf(s1) > -1) {
                            if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                                throw this.getLibraryComputationException();
                            return s1;
                        }
                    } catch (ex) {
                        if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null) {
                            throw this.getLibraryComputationException();
                        }

                        return ex;
                    }

                    if (s1.length > 0) {
                        d = (s1 == this.trueValueStr) ? true : (s1 == this.falseValueStr) ? false : this._parseDouble(s1);
                        if (this.getErrorStrings().indexOf(s1) > -1) {
                            return s1;
                        }
                        if (!isNaN(d)) {
                            sum = sum + d;
                        }
                    }
                }
            }
            return sum.toString();
        };

        this.computeDate = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 3) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]);
            }

            var year = this._parseDouble(args[0]);
            var month = this._parseDouble(args[1]);
            var day = this._parseDouble(args[2]);
            var days = 0;

            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                if (year < 0) {
                    if (this.getRethrowLibraryComputationExceptions())
                        throw this.getErrorStrings()[4].toString();
                    return this.getErrorStrings()[4].toString();
                }
                while (month > 12) {
                    month -= 12;
                    year++;
                }

                days = this._getSerialDateFromDate(year, month, day);
            }
            if (this._excelLikeComputations) {
                var date = this._fromOADate(days);
                if (date.toString() != "Invalid Date") {
                    return date.toLocaleDateString();
                }
            }
            return days.toString();
        };
        this.computeDatevalue = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var dt = new Date(Date.parse(args[0]));
            var dtNum = this._parseDouble(args[0]);
            try  {
                if (!isNaN(dtNum) || dt.toString() == "Invalid Date") {
                    if (dtNum > 0) {
                        dt = this._fromOADate(dtNum);
                    } else {
                        var ranges = argList.split(this.getParseDateTimeSeparator());
                        var argCount = ranges.length;
                        var arg = "";
                        for (var i = 0; i < argCount; ++i) {
                            ranges[i] = this.computedValue(ranges[i]);
                            if (i < argCount - 1)
                                arg += ranges[i] + this.getParseDateTimeSeparator();
                            else
                                arg += ranges[i];
                        }
                        arg = arg.split(this.tic).join(this._string_empty);
                        dt = new Date(Date.parse(arg));
                    }
                }
            } catch (ex) {
                return this.formulaErrorStrings[this.invalid_arguments];
            }
            if (args[0].indexOf("2001") == -1 && dt.getFullYear() == 2001) {
                dt.setFullYear((new Date(Date.now())).getFullYear());
            }
            var days = this._toOADate(dt);
            if (isNaN(days)) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._invalid_Math_argument];
                return this.getErrorStrings()[1].toString();
            }
            if (this.treat1900AsLeapYear && days > 59) {
                days += 1;
            }

            return Math.round(days).toString();
        };
        this.computeDay = function (argList) {
            var day = 1;
            var s = this.getValueFromArg(argList).split(this.tic).join("");
            var serialdate = this._parseDouble(s);
            if (!isNaN(serialdate)) {
                if (serialdate < 1) {
                    if (this.getRethrowLibraryComputationExceptions())
                        throw this.formulaErrorStrings[this._invalid_Math_argument];
                    return this.getErrorStrings()[4].toString();
                } else {
                    date = this._getDateFromSerialDate(serialdate);
                    day = date.getDate();
                }
            } else {
                var date = new Date(Date.parse(s));
                if (date.toString() != "Invalid Date") {
                    day = date.getDate();
                } else {
                    if (this.getRethrowLibraryComputationExceptions())
                        throw this.formulaErrorStrings[this._invalid_Math_argument];
                    return this.getErrorStrings()[1].toString();
                }
            }
            return day.toString();
        };
        this.computeDays = function (argList) {
            var argument = argList;
            var args = this.splitArgsPreservingQuotedCommas(argList);
            if (args.length != 2) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.getFormulaErrorStrings()[this._wrong_number_arguments];
                return this.getFormulaErrorStrings()[this._wrong_number_arguments];
            }

            var startDateValue = this.getValueFromArg(args[1]);
            var endDateValue = this.getValueFromArg(args[0]);

            var startDateTime, endDateTime;

            var startDateSerial = this._parseDouble(startDateValue.split(this.tic).join(""));
            var endDateSerial = this._parseDouble(endDateValue.split(this.tic).join(""));

            if (!isNaN(startDateSerial)) {
                startDateTime = this._getDateFromSerialDate(startDateSerial);
            } else
                startDateTime = new Date(Date.parse(startDateValue));

            if (!isNaN(endDateSerial)) {
                endDateTime = this._getDateFromSerialDate(endDateSerial);
            } else
                endDateTime = new Date(Date.parse(endDateValue));

            var timeDiff = endDateTime.getTime() - startDateTime.getTime();

            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return diffDays.toString();
        };
        this.computeDays360 = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 2 && argCount != 3) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var method = false;
            var days = 0;
            var dt1 = new Date(Date.parse(this.getValueFromArg(args[0]).split(this.tic).join("")));
            var dt2 = new Date(Date.parse(this.getValueFromArg(args[1]).split(this.tic).join("")));
            var serialdate1 = this._parseDouble(this.getValueFromArg(args[0]).split(this.tic).join(""));
            var serialdate2 = this._parseDouble(this.getValueFromArg(args[1]).split(this.tic).join(""));

            if ((!isNaN(serialdate1) || !isNaN(this._isDate(dt1))) && (!isNaN(serialdate2) || !isNaN(this._isDate(dt2)))) {
                dt1 = (serialdate1 > 0) ? this._getDateFromSerialDate(serialdate1) : dt1;
                dt2 = (serialdate2 > 0) ? this._getDateFromSerialDate(serialdate2) : dt2;
                var flipSign = false;
                var mathodStr = this.falseValueStr;
                if (argCount == 3)
                    mathodStr = this.getValueFromArg(args[2]);
                method = (mathodStr == this.trueValueStr) ? true : false;
                if (dt1.getDate() == 31) {
                    dt1 = new Date(dt1.setDate(dt1.getDate() - 1));
                }

                if (dt2.getDate() == 31 && !method && dt1.getDate() < 30) {
                    dt2 = new Date(dt2.setDate(dt2.getDate() + 1));
                } else if (dt2.getDate() == 31) {
                    dt2 = new Date(dt2.setDate(dt2.getDate() - 1));
                }

                if (dt2 < dt1) {
                    flipSign = true;
                    var t = dt1;
                    dt1 = dt2;
                    dt2 = t;
                }

                days = dt2.getDate() - dt1.getDate();
                days += 30 * (dt2.getMonth() - dt1.getMonth());
                days += 360 * (dt2.getFullYear() - dt1.getFullYear());
                if (flipSign) {
                    days = -days;
                }
            } else {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._invalid_Math_argument];
                return this.getErrorStrings()[1].toString();
            }
            return days.toString();
        };
        this.computeEDate = function (argList) {
            var argument = argList;
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 2) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var startDate = this.getValueFromArg(args[0]).split(this.tic).join("");
            var StartDateValue = parseInt(startDate);
            var startDateTime = (isNaN(startDate)) ? new Date(Date.parse(startDate)) : this._fromOADate(parseInt(startDate));
            var monthCount = this.getValueFromArg(args[1]).split(this.tic).join("");
            var month = parseInt(monthCount);
            if (startDateTime.toString() == "Invalid Date" && isNaN(month)) {
                try {
                    var today = new Date(Date.now());
                    var first = this._parseDouble(startDate);
                    var second = parseInt(monthCount);
                    if (second < 0 && second < first) {
                        if (this.getRethrowLibraryComputationExceptions())
                            throw this.formulaErrorStrings[this._bad_index];
                        return this.getErrorStrings()[4].toString();
                    }
                    if (first != 0) {
                        var dt = this.dateTime1900;
                        dt = this._fromOADate(first);
                        startDateTime = new Date(dt.setMonth(dt.getMonth() + second));
                    } else {
                        startDateTime = new Date(today.setMonth(today.getMonth() + second));
                        var days = this.computeDays(today.toLocaleDateString() + this.getParseArgumentSeparator() + startDateTime.toLocaleDateString());
                        return days;
                    }
                }
                catch (ex) {
                    if (this.getRethrowLibraryComputationExceptions())
                        throw this.formulaErrorStrings[this._bad_formula] + ex;
                    return this.getErrorStrings()[1].toString();
                }
            }
            startDateTime = new Date(startDateTime.setMonth(startDateTime.getMonth() + month));
            if (this.getExcelLikeComputations()) {
                return startDateTime.toLocaleDateString();
            } else {
                return parseInt(this._toOADate(startDateTime)).toString();
            }
        };
        this.computeEOMonth = function (argList) {
            var argument = argList;
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 2) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var startDate = this.getValueFromArg(args[0]).split(this.tic).join("");
            var startDateTime = new Date(startDate);
            var month = this._parseDouble(this.getValueFromArg(args[1]).split(this.TIC).join(""));
            if(startDateTime.toString() == "Invalid Date")
            {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_index];
                return this.getErrorStrings()[1].toString();
            }
            if (isNaN(month)) {
                try  {
                    var today = new Date(Date.now());
                    var first = parseInt(startDate);
                    month = this._parseDouble(this.getValueFromArg(args[1]).split(this.tic).join(""));
                    if (month < 0 && first <= 0 && month < first) {
                        if (this.getRethrowLibraryComputationExceptions())
                            throw this.formulaErrorStrings[this._bad_index];
                        return this.getErrorStrings()[4].toString();
                    }
                } catch (ex) {
                    if (this.getRethrowLibraryComputationExceptions())
                        throw this.formulaErrorStrings[this._bad_index];
                    return this.getErrorStrings()[1].toString();
                }
            }
            var dateValue = parseInt(startDate);
            if (!isNaN(dateValue) && startDateTime.getFullYear() > 9999) {
                startDateTime = this._fromOADate(dateValue);
            }
            startDateTime = new Date(startDateTime.setMonth(startDateTime.getMonth() + month));
            var totalDays = (new Date(startDateTime.getFullYear(), startDateTime.getMonth() + 1, 1, -1)).getDate();
            startDateTime = new Date(startDateTime.getFullYear(), startDateTime.getMonth(), totalDays);

            if (this.getExcelLikeComputations())
                return startDateTime.toLocaleDateString();
            else
                return this._getSerialDateTimeFromDate(startDateTime).toString();
        };
        this.computeHour = function (argList) {
            var time;
            var dt = new Date(Date.now());
            argList = this.getValueFromArg(argList);
            argList = argList.split(this.tic).join("");
            dt = new Date(Date.parse(argList));
            var hourValue = parseInt(argList);
            if (hourValue < 0)
            {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_index];
                return this.getErrorStrings()[4].toString();
            }
            if (dt.toString() == "Invalid Date") {
                var argVal = (new Date(Date.now())).toLocaleDateString() + " " + argList;
                dt = new Date(Date.parse(argVal));
            }
            if (dt.toString() == "Invalid Date") {
                dt = this._fromOADate(argList);
            }
            if (dt.toString() == "Invalid Date") {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_index];
                return this.getErrorStrings()[1].toString();
            }
            return dt.getHours().toString();
        };
        this.computeISOWeeknum = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var value = this.getValueFromArg(args[0]);
            if (value[0] == (this.tic) && this._isTextEmpty(value.split(this.tic).join(""))) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[1].toString();
            }
            if (this._isTextEmpty(value)) {
                argList = this.computeDatevalue(new Date(1990, 12, 28).toLocaleDateString());
            }

            if (argList.indexOf(":") > -1 || !this._isCellReference(this.getValueFromArg(args[0])) && this.getValueFromArg(this.DateFormatter(args[0])).indexOf(":") > -1) {
                argList = "0";
            }
            var weekDate = this.getValueFromArg(args[0]).split(this.tic).join("");
            var date = new Date(weekDate);
            var weekDateOnly = this.DateFormatter(weekDate);
    
            var weekDateTime = new Date(Date.parse(weekDateOnly)), firstDate = this.dateTime1900;
            ;
            if (weekDateTime.toString() == "Invalid Date") {
                try  {
                    var weeknumber = parseInt(weekDateOnly);
                    weekDateTime = this.fromOADate(weeknumber);
                    weekDate = weekDateTime.toLocaleDateString();
                } catch (ex) {
                    if (this.getRethrowLibraryComputationExceptions())
                        throw "Bad Cell reference";
                    return this.getErrorStrings()[1].toString();
                }
            }
            var isoarg = argList + this.getParseArgumentSeparator() + "21";
            var weekno = parseInt(this.computeWeeknum(isoarg));
            return weekno.toString();
        };

       this.DateFormatter= function  (date) {
           var d = new Date(date);
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var year = d.getFullYear();
            if (day < 10) {
                day = + day;
            }
            if (month < 10) {
                month =  month;
            }
            var date = month + "/" + day + "/" + year;

            return date;
        }; 

        this.computeMinute = function (argList) {
            var time;
            var dt = new Date(Date.now());
            argList = this.getValueFromArg(argList);
            argList = argList.split(this.tic).join("");
            dt = new Date(Date.parse(argList));
            if (argList < 0) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_index];
                return this.getErrorStrings()[4].toString();
            }
            if (dt.toString() == "Invalid Date") {
                var argVal = (new Date(Date.now())).toLocaleDateString() + " " + argList;
                dt = new Date(Date.parse(argVal));
            }
            if (dt.toString() == "Invalid Date") {
                dt = this._fromOADate(argList);
            }
            if (dt.toString() == "Invalid Date") {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_index];
                return this.getErrorStrings()[1].toString();
            }
            return dt.getMinutes().toString();
        };
        this.computeMonth = function (argList) {
            var month = 1;
            var s = this.getValueFromArg(argList);
            var date = new Date(Date.parse(s.split(this.tic).join("")));

            var dateValue = parseInt(s);
            if (!isNaN(dateValue) && date.getFullYear() > 9999) {
                date = this._fromOADate(dateValue);
            }
            if (s < 0) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_index];
                return this.getErrorStrings()[4].toString();
            }
            if (date.toString() == "Invalid Date") {
                argList = (new Date(Date.now())).toLocaleDateString() + " " + argList;
                date = new Date(Date.parse(argList));
            }
            if (date.toString() == "Invalid Date") {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_index];
                return this.getErrorStrings()[1].toString();
            }
            if (date.toString() != "Invalid Date") {
                month = date.getMonth() + 1;
            } else {
                var serialdate = this._parseDouble(this.getValueFromArg(argList));
                if (!isNaN(serialdate)) {
                    ////serialdate = serialdate - 1 - ((Treat1900AsLeapYear && serialdate > 59) ?  1 : 0);
                    if (serialdate < 1) {
                        month = 1;
                    } else {
                        date = this._getDateFromSerialDate(serialdate); ////dateTime1900.AddDays(serialdate);
                        month = date.getMonth() +1;
                    }
                } else {
                    return this.formulaErrorStrings[this._invalid_arguments];
                }
            }
            return month.toString();
        };
        this.computeNetworkDays = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            var adjustRange, s1;
            var date;
            var holidays = [];

            if (argCount != 2 && argCount != 3) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var startDate = this.getValueFromArg(args[0]).split(this.tic).join("");
            var endDate = this.getValueFromArg(args[1]).split(this.tic).join("");
            var startDateTime = new Date(Date.parse(startDate));
            var endDateTime = new Date(Date.parse(endDate));
            var dval = this._parseDouble(startDate);
            if (!isNaN(dval) && startDateTime.getFullYear() > 9999) {
                startDateTime = this._fromOADate(dval);
            }
            if (startDateTime.toString() == "Invalid Date") {
                startDateTime = this._fromOADate(dval);
            }
            if (startDateTime.toString() == "Invalid Date") {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.getErrorStrings()[1].toString();
                return this.getErrorStrings()[1].toString();
            }
            var dval = this._parseDouble(endDate);
            if (!isNaN(dval) && endDateTime.getFullYear() > 9999) {
                endDateTime = this._fromOADate(dval);
            }
            if (endDateTime.toString() == "Invalid Date") {
                endDateTime = this._fromOADate(dval);
            }
            if (endDateTime.toString() == "Invalid Date") {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.getErrorStrings()[1].toString();
                return this.getErrorStrings()[1].toString();
            }
            if (argCount == 3) {
                adjustRange = args[2];
                ////is a cellrange
                if (adjustRange.indexOf(':') > -1) {
                    var cells = this.getCellsFromArgs(adjustRange);
                    for (var s = 0; s < cells.length; s++) {
                        try  {
                            s1 = this.getValueFromArg(s).split(this.tic).join("");
                        } catch (ex) {
                            if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                                throw this.getLibraryComputationException();
                            }

                            return ex;
                        }

                        if (s1 != "") {
                            date = new Date(Date.parse(s1));
                            if (date.toString() != "Invalid Date" && (holidays.indexOf(date) == -1) && date > startDateTime && date < endDateTime && date.getDay() != 0 && date.getDay() != 6) {
                                holidays.push(date);
                            }
                        }
                    }
                } else {
                    var dateArray = this.splitArgsPreservingQuotedCommas(adjustRange.split(this.tic).join(""));
                    for (var i = 0; i < dateArray.length; i++) {
                        try {
                            s1 = this.getValueFromArg(dataArray[i]);
                        } catch (ex) {
                            if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                                throw this.getLibraryComputationException();
                            }

                            return ex;
                        }

                        if (s1.length > 0) {
                            date = new Date(Date.parse(s1));
                            if (date.toString() != "Invalid Date" && (holidays.indexOf(date) == -1) && date > startDateTime && date < endDateTime && date.getDay() != 0 && date.getDay() != 6) {
                                holidays.push(date);
                            }
                        }
                    }
                }
            }

            var numberOfWorkingDays = 0;
            var noofDays = parseInt(this.computeDatevalue(endDate)) - parseInt(this.computeDatevalue(startDate));
            var startWeekDay = startDateTime.getDay();
            var endWeekDay = endDateTime.getDay();
            var excesStartDays = startWeekDay - 1;
            var excesEndDays = 7 - endWeekDay;
            noofDays = noofDays + excesStartDays + excesEndDays;

            var noofholidays = parseInt(noofDays / 7) * 2;

            numberOfWorkingDays = noofDays - excesStartDays - excesEndDays - noofholidays + 1 - holidays.length;
            if (endWeekDay == 6 || startWeekDay == 0)
                numberOfWorkingDays--;
            return numberOfWorkingDays.toString();
        };
        this.computeNetworkDaysOintl = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            var adjustRange, s1;
            var date;
            var holidays = [];

            if (argCount != 2 && argCount  > 4) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var startDate = this.getValueFromArg(args[0]).split(this.tic).join("");
            var endDate = this.getValueFromArg(args[1]).split(this.tic).join("");
            var startDateTime = new Date(Date.parse(this._fromOADate(startDate)));
            var endDateTime = new Date(Date.parse(this._fromOADate(endDate)))
            if (startDateTime.toString() == "Invalid Date") {
                var dval = this._parseDouble(startDate);
                if (!isNaN(dval)) {
                    startDateTime = this.fromOADate(dval);
                } else {
                    if (this.getRethrowLibraryComputationExceptions())
                        throw this.getErrorStrings()[1].toString();
                    return this.getErrorStrings()[1].toString();
                }
            }
            if (endDateTime.toString() == "Invalid Date") {
                var dval = this._parseDouble(endDate);
                if (!isNaN(dval)) {
                    endDateTime = this._fromOADate(dval);
                } else {
                    if (this.getRethrowLibraryComputationExceptions())
                        throw this.getErrorStrings()[1].toString();
                    return this.getErrorStrings()[1].toString();
                }
            }
            if (argCount == 4) {
                adjustRange = args[3];
                adjustRange = this.adjustRangeArg(adjustRange);

                ////is a cellrange
                if (adjustRange.indexOf(':') > -1 || adjustRange.indexOf(',') > -1) {
                    var cells = this.getCellsFromArgs(adjustRange);
                    for (var s = 0; s < cells.length; s++) {
                        try  {
                            s1 = this.getValueFromArg(cells[s]).toString().split(this.tic).join("");
                        } catch (ex) {
                            if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                                throw this.getLibraryComputationException();
                            }

                            return ex;
                        }

                        if (s1 != "") {
                            date = new Date(Date.parse(s1));
                            if (date.toString() != "Invalid Date" && (holidays.indexOf(date) == -1) && date > startDateTime && date > endDateTime && date.getDay() != 0 && date.getDay() != 6) {
                                holidays.push(date);
                            }
                        }
                    }
                } else {
                    try  {
                        s1 = this.getValueFromArg(adjustRange).split(this.tic).join("");
                    } catch (ex) {
                        if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                            throw this.getLibraryComputationException();
                        }

                        return ex;
                    }

                    if (s1.length > 0) {
                        date = new Date(Date.parse(s1));
                        if (date.toString() != "Invalid Date" && (holidays.indexOf(date) == -1) && date > startDateTime && date < endDateTime && date.getDay() != 0 && date.getDay() != 6) {
                            holidays.push(date);
                        }
                    }
                }
            }

            var weekend = parseInt(args[2]);
            if ((argCount <=2 && !isNaN(weekend))) {
                weekend = 1;
            } else if(!isNaN(args[2])) {
                weekend = parseInt(args[2]);
            }
        else{ 
            
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[4].toString();
            }
            var weekendDays = this._splitArguments(this.getWeekEndType()[weekend].toString(), ',');
            var noofDays = parseInt(this.computeDatevalue(endDate)) - parseInt(this.computeDatevalue(startDate)) + 1;
            var netWorkDays = noofDays;
            var j = 1;
            var tempStartDate = startDateTime;
            while (j < noofDays) {
                var dayofweek = tempStartDate.getDay();
                if (weekendDays.indexOf(dayofweek.toString()) >= 0) {
                    netWorkDays--;
                } else if (holidays.indexOf(tempStartDate) >= 0) {
                    netWorkDays--;
                }
                tempStartDate = new Date(tempStartDate.setDate(tempStartDate.getDate() + 1));
                j++;
            }
            return netWorkDays.toString();
        };
        this.computeNow = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            return new Date(Date.now()).toString();
        };
        this.computeSecond = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var time;
            var dt = new Date(Date.now());
            argList = this.getValueFromArg(argList);
            argList = argList.split(this.tic).join("");
            dt = new Date(Date.parse(argList));
            if (argList < 0) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_index];
                return this.getErrorStrings()[4].toString();
            }
            if (dt.toString() == "Invalid Date") {
                var argVal = (new Date(Date.now())).toLocaleDateString() + " " + argList;
                dt = new Date(Date.parse(argVal));
            }
            if (dt.toString() == "Invalid Date") {
                dt = this._fromOADate(argList);
            }
            if (dt.toString() == "Invalid Date") {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_index];
                return this.getErrorStrings()[1].toString();
            }
            return dt.getSeconds().toString();
        };
        this.computeTime = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 3) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var hour = this._parseDouble(this.getValueFromArg(args[0]));
            var minute = this._parseDouble(this.getValueFromArg(args[1]));
            var second = this._parseDouble(this.getValueFromArg(args[2]));
            var time = 0;
            if (!isNaN(hour) && !isNaN(minute) && !isNaN(second)) {
                time = (3600 * hour + 60 * minute + second) / 86400;
                var dateString = (new Date(Date.now())).toLocaleDateString() + " " + time;
                dt = new Date(Date.parse(dateString));
                if (time < 0) {
                    if (this.getRethrowLibraryComputationExceptions())
                        throw this.formulaErrorStrings[this._bad_index];
                    return this.getErrorStrings()[4].toString();
                }
                return time.toString();
            }
            else {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_index];
                return this.getErrorStrings()[1].toString();
            }
        };
        this.computeTimevalue = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var argValue = this.getValueFromArg(args[0]).split(this.tic).join("");

            argValue = argValue.split(this.tic).join("");
            if (argValue.indexOf(":") > -1) {
                var date = new Date();
                var argValue = date.toLocaleDateString() + " " + argValue;
            }
            var dateTime = new Date(Date.parse(argValue));
            if (dateTime.toString() == "Invalid Date") {
                argList = (new Date(Date.now())).toLocaleDateString() + " " + argList;
                dateTime = new Date(Date.parse(argList));
            }
            if (dateTime.toString() == "Invalid Date") {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_index];
                return this.getErrorStrings()[1].toString();
            }
            var time = (3600 * dateTime.getHours() + 60 * dateTime.getMinutes() + dateTime.getSeconds()) / 86400;
            return time.toString();
        };
        this.computeToday = function (argList) {
            var dt = new Date(Date.now());

            if (this.getExcelLikeComputations()) {
                return dt.toLocaleDateString();
            } else
                return this._toOADate(dt).toString();
        };
       
        this.computeWeekday = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1 && argCount != 2) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var dateString = this.getValueFromArg(args[0]);

            var dt = new Date(Date.parse(dateString.split(this.tic).join("")));
            var dateValue = parseInt(dateString);
            if (!isNaN(dateValue) && dt.getFullYear() > 9999) {
                dt = this._fromOADate(dateValue);
            }
            args[1] = (argCount == 2) ? args[1] : "1";
            if (dt.toString() == "Invalid Date")
                dt = this._fromOADate(dateValue);
            var return_type = parseInt(this.getValueFromArg(args[1]));
            var day = dt.getDay();

            if (return_type == 1) {
                day += 1;
            } else {
                if (day == 0) {
                    day = 7;
                }

                if (return_type == 3) {
                    day -= 1;
                }
            }
            return day.toString();
        };
        this.computeWeeknum = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount > 3) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var weekDate;
            if (this._fromOADate(this.DateFormatter(this.getValueFromArg(args[0]).split(this.tic).join(""))) == "Invalid Date")

                weekDate = this.getValueFromArg(args[0]).split(this.tic).join("");
            else
                weekDate = this.DateFormatter(this.getValueFromArg(args[0]).split(this.tic).join(""));
            var weeknumber = parseInt(weekDate);
            var d = new Date(weekDate);
            var weekDateTime = new Date(Date.parse(weekDate));
           // weekDateTime = this._fromOADate(weekDateTime);

            if (weekDateTime.toString() == "Invalid Date")
            {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[4].toString();
            }
            var weekStart = ["", "0", "1", "", "", "", "", "", "", "", "", "1", "2", "3", "4", "5", "6", "0", "", "", "", "1"];

            var weektype ;
            if (argCount != 2) {
                weektype = 1;
            }
            else
                weektype = this.getValueFromArg(args[1]);
            
            if (!isNaN(weektype)) {
            }
            var weehStartValue = parseInt(weekStart[weektype]);
            var firstDate = new Date(weekDateTime.getFullYear(), 0, 1);
            var firstDay = firstDate.getDate();
            var offset = (firstDay < weehStartValue) ? weehStartValue - firstDay + 1 : firstDay - weehStartValue;
            var dt = this._fromOADate(this._toOADate(firstDate) - offset);
            var noofDays = this._toOADate(weekDateTime) - this._toOADate(dt);
            var dval = Math.floor(noofDays / 7) +1 + weehStartValue;
            return dval.toString();
        };
        this.computeWorkDay = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;

            if (argCount != 2 && argCount > 3) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var argString = "";
            var dateValue = 0;
            if (argCount == 3) {
                argString = args[0] + this.getParseArgumentSeparator() + args[1] + this.getParseArgumentSeparator() + "1" + this.getParseArgumentSeparator() + args[2];
            } else
                argString = args[0] + this.getParseArgumentSeparator() + args[1] + this.getParseArgumentSeparator() + "1";
            var value = this.computeWorkDayOintl(argString);

            var dateTime = new Date(Date.parse(this._fromOADate(value).toString()));

            if (isNaN(Date.parse(value)) && parseInt(value)) {
                dateTime = this._fromOADate(value);
            }

            if (dateTime.toString() == "Invalid Date") {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this.bad_formula];
                return this.getErrorStrings()[1].toString();
            }

            return this._toOADate(dateTime).toString();
        };
        this.computeWorkDayOintl = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;

            if (argCount > 4 || argCount < 2) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var adjustRange, s1;
            var date;
            var holidays = [];

            var startDate = this.getValueFromArg(args[0]).split(this.tic).join("");
            var startDateTime = new Date(Date.parse(startDate));

            var temp = this.getValueFromArg(args[1]).split(this.tic).join("");
            var dateval;

            if (!isNaN(Date.parse(startDate)) && parseInt(startDate)) {
                startDateTime = this._fromOADate(startDate);
            }

            if (isNaN(temp)) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this.bad_formula];
                return this.getErrorStrings()[1].toString();
            } else {
                dateval = this._toOADate(startDateTime) + temp;
            }

            if (startDate.split(this.tic).join("") == "") {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this.bad_formula];
                return this.getErrorStrings()[0].toString();
            } else if (startDateTime.toString() == "Invalid Date") {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this.bad_formula];
                return this.getErrorStrings()[1].toString();
            }
            var totalDays = parseInt(temp.toString());
            if (argCount == 4) {
                adjustRange = args[3];
                adjustRange = this.adjustRangeArg(adjustRange);

                ////is a cellrange
                if (adjustRange.indexOf(':') > -1 || adjustRange.indexOf(',') > -1) {
                    var cells = this.getCellsFromArgs(adjustRange);
                    for (var s = 0; s < cells.length; s++) {
                        try {
                            s1 = this.getValueFromArg(cells[s]).split(this.tic).join("");
                        } catch (ex) {
                            if (this.getRethrowLibraryComputationExceptions())
                                throw this.formulaErrorStrings[this.bad_formula];
                            return this.getErrorStrings()[4].toString();
                        }

                        if (s1 != "") {
                            var dt = new Date(Date.parse(s1));
                            if (dt.toString() != "Invalid Date" && holidays.indexOf(dt) == -1 && dt > startDateTime) {
                                holidays.push(dt.toString());
                            }
                        }
                    }
                } else {
                    try {
                        s1 = this.getValueFromArg(adjustRange).split(this.tic).join("");
                    } catch (Exception) {
                        if (this.getRethrowLibraryComputationExceptions())
                            throw this.formulaErrorStrings[this.bad_formula];
                        return this.getErrorStrings()[4].toString();
                    }

                    if (s1 != "") {
                        var dt = new Date(Date.parse(s1));

                        if (isNaN(Date.parse(s1)) && parseInt(s1)) {
                            dt = this._fromOADate(s1);
                        }

                        if (dt.toString() != "Invalid Date" && holidays.indexOf(dt) == -1 && dt > startDateTime) {
                            holidays.push(dt);
                        }
                    }
                }
            }
            
            var weekend = parseInt(args[2]);
            if (!(argCount > 2 && !isNaN(weekend))) {
                weekend = 1;
            }
            if (weekend == 0) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this.bad_formula];
                return this.getErrorStrings()[4].toString();
            }
            var weekendDays = this._splitArguments(_weekEndType[weekend].toString(), ",");
            var j = 0;
            var tempStartDate = startDateTime;
            if (totalDays < 0) {
                while (j > totalDays) {
                    tempStartDate = new Date(tempStartDate.setDate(tempStartDate.getDate() - 1));
                    var dayofweek = tempStartDate.getDay();
                    if (weekendDays.indexOf(dayofweek.toString()) < 0 && holidays.indexOf(tempStartDate) < 0) {
                        j--;
                    }
                }
            } else {
                while (j < totalDays) {
                    tempStartDate = new Date(tempStartDate.setDate(tempStartDate.getDate() + 1));
                    var dayofweek = tempStartDate.getDay();
                    if (weekendDays.indexOf(dayofweek.toString()) < 0 && holidays.indexOf(tempStartDate.toString()) < 0) {
                        j++;
                    }
                }
            }
            return this._toOADate(tempStartDate).toString();
        };
        this.computeYear = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;

            if (argCount != 1) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var startDate = this.getValueFromArg(args[0]).split(this.tic).join("");
            var startDateTime = new Date(Date.parse(startDate));
            var dateValue = parseInt(startDate);
            if (!isNaN(dateValue) && startDateTime.getFullYear() > 9999) {
                startDateTime = this._fromOADate(dateValue);
            }
            if (dateValue == 0) {
                return "1900";
            }
            if (dateValue < 0) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this.bad_formula];
                return this.getErrorStrings()[4].toString();
            }
            if (startDate.split(this.tic).join("") == "") {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this.bad_formula];
                return this.getErrorStrings()[0].toString();
            } else if (startDateTime.toString() == "Invalid Date") {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this.bad_formula];
                return this.getErrorStrings()[1].toString();
            }

            return startDateTime.getFullYear().toString();
        };


        this.computeChar = function (arg) {
            var ranges = this.splitArgsPreservingQuotedCommas(arg);
            var argCount = ranges.length;
            if (argCount != 1) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var s = this.getValueFromArg(ranges[0]).split(this.tic).join("");
            var i = this._parseDouble(s);
            if (!isNaN(i) && i > 0 && i < 256) {
                return String.fromCharCode(s);
            }
            if (this.getErrorStrings().indexOf(s) > -1) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return s;
            }
            return (s[0] == this.tic) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
        };
        this.computeCode = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var text = this.getValueFromArg(args[0]).split(this.tic).join("");
            var num =  parseInt(text);
            if (!isNaN(num))
            {
                return text.charCodeAt(0).toString();
            }
            if (text == null || text == "") {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return (args[0].length > 4) ? this.getErrorStrings()[5].toString() : this.getErrorStrings()[1].toString();
            }
            if (!this._isCellReference(args[0]) && args[0].indexOf(this.tic) == -1) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[5].toString();
            }
            var code = text;

            return code.charCodeAt(0).toString();
        };
        this.computeUniCode = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var text = this.getValueFromArg(args[0]);
            if (this._isCellReference(args[0])) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[5].toString();
            }
            var str = this._parseDouble(text);
            if (text == "invalid expression" || text == null || text == "" || !isNaN(str)) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[1].toString();
            }
            var unicodeString = text.split(this.tic).join("").charCodeAt(0);
            return unicodeString.toString();
        };
        this.computeUpper = function (args) {

            if (!this._isCellReference(args) && args[0].indexOf(this.tic) == -1)
            {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[5].toString();
            }
            return this._stripTics0(this.getValueFromArg(args)).toUpperCase();
        };
        this.computeLower = function (args) {

            if (!this._isCellReference(args) && args[0].indexOf(this.tic) == -1) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[5].toString();
            }
            return this._stripTics0(this.getValueFromArg(args)).toLowerCase();
        };
        this.computeLen = function (range) {

            var args = this.splitArgsPreservingQuotedCommas(range);
            var argCount = args.length;
            if (argCount != 1) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }            
            var s1 = this._stripTics0(this.getValueFromArg(args[0]));

            if(isNaN(parseInt(s1))){
                var dt = new Date(Date.parse(s1));
                if (dt != "Invalid Date") {
                    s1 = this.DateFormatter(s1);
                }
            }
            var hasTics = s1[0] == this.tic && s1[s1.length - 1] == this.tic;
            return (hasTics ? s1.length - 2 : s1.length).toString();
        };
        this.computeMid = function (range) {
            var args = this.splitArgsPreservingQuotedCommas(range);
            var argCount = args.length;
            if (argCount != 3) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var s1 = args[0];
            s1 = this.getValueFromArg(s1);
            if (!this._isCellReference(args[0]) && args[0][0] != this.tic)
            {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[5].toString();
            }
            var hasTics = s1[0] == this.tic && s1[s1.length - 1] == this.tic;
            var s2 = this.getValueFromArg(args[1]);
            var len = this._parseDouble(args[2]);
            s2 = this.getValueFromArg(args[1]);
            var start = Number(s2) + Number(hasTics ? 0 : -1);

            if (args[1].indexOf("#VALUE!") > -1) {
                return "#VALUE!";
            }
            if (Number(start) > s1.length) {
                return "";
            }
            if (start + len > s1.length) {
                s1 = s1.substring(start);
            }
            else
                s1 = this._substring(s1, start, len);
            if (hasTics && s1[0] != this.tic) {
                s1 = this.tic + s1;
            }

            if (hasTics && s1) {
                s1 = s1 + this.tic;
            }

            return this._stripTics0(s1);
        };
        this.computeLeft = function (range) {
            var args = this.splitArgsPreservingQuotedCommas(range);
            var argCount = args.length;
            if (argCount != 1 && argCount != 2) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var s1 = this._stripTics0(this.getValueFromArg(args[0]));
            if (!this._isCellReference(args[0]) && args[0].indexOf(this.tic) == -1) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[5].toString();
            }
            var hasTics = s1[0] == this.tic && s1[s1.length - 1] == this.tic;
            var s2 = (argCount == 2) ? args[1] : "1";
            s2 = this.computedValue(s2);
            var len = Number(s2) + Number(hasTics ? 1 : 0);
            len = (s1.length >= len) ? len : s1.length;
            len = (s1.length >= len) ? len : s1.length;
            if (len < 1) {
                return this.getErrorStrings()[1].toString();
            }
            s1 = s1.substring(0, len);
            if (hasTics && s1[s1.length - 1] != this.tic) {
                s1 = s1 + this.tic;
            }
            if (this.getUseNoAmpersandQuotes() && s1.length > 1 && s1[0] == this.tic[0] && s1[s1.length - 1] == this.tic[0]) {
                s1 = this._substring(s1,1, s1.length - 2);
            }
            return s1;
        };
        this.computeRight = function (range) {
            var args = this.splitArgsPreservingQuotedCommas(range);
            var argCount = args.length;
            if (argCount != 1 && argCount != 2) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }           
            s1 = this._stripTics0(this.getValueFromArg(args[0]));
            if (!this._isCellReference(args[0]) && args[0].indexOf(this.tic) == -1) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[5].toString();
            }
            var hasTics = s1[0] == this.tic && s1[s1.length - 1] == this.tic;
            var s2 = (argCount == 2) ? this.getValueFromArg(args[1]) : "1";
            var len = parseInt(s2);
            if (isNaN(len) || len <0 || s2.indexOf("#VALUE!") > -1) {
                return "#VALUE!";
            }
            if (len == 0)
                return "";
            var len = Number(s2) + Number(hasTics ? 1 : 0);
            var start = (s1.length >= len) ? s1.length - len : 0;
            s1 = s1.substring(start);
            if (hasTics && s1[0] != this.tic) {
                s1 = this.tic + s1;
            }

            return s1;
        };
        this.computeReplace = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 4) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var firstText = this._stripTics0(this.getValueFromArg(args[0]));
            var newText = this._stripTics0(this.getValueFromArg(args[3]));
            var resultText = "";
            var startIndex = this._parseDouble(this.getValueFromArg(args[1]));
            var noOfChar = this._parseDouble(this.getValueFromArg(args[2]));
            if ((!this._isCellReference(args[0]) && args[0][0] != this.tic) || (!this._isCellReference(args[3]) && args[3][0] != this.tic)) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[5].toString();
            }
            if (startIndex == 0 && noOfChar == 0)
            {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                else
                    return this.getErrorStrings()[1].toString();
            }
            if (!isNaN(startIndex) && !isNaN(noOfChar)) {
                try {
                    var replaceText = "";
                    if (firstText == null || firstText == "") {
                        return newText;
                    }
                    if (firstText.length <= startIndex && startIndex > noOfChar) {
                        resultText = firstText + newText;
                    } else if (firstText.length <= startIndex) {
                        replaceText = firstText;
                        resultText = firstText.split(replaceText).join(newText);
                    } else if (noOfChar == 0) {
                        resultText = newText + firstText;
                    }else {
                        replaceText = this._substring(firstText, startIndex - 1, noOfChar);
                        resultText = firstText.split(replaceText).join(newText);
                    }
                } catch (ex) {
                    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                        throw this.getLibraryComputationException();
                    else
                        return this.getErrorStrings()[1].toString();
                }
            } else {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                else
                    return this.getErrorStrings()[1].toString();
            }

            return resultText;
        };
        this.computeExact = function (range) {
            //this.AdjustRangeArg(ref range);
            var args = this.splitArgsPreservingQuotedCommas(range);
            if (args.length != 2) {
                return this.formulaErrorStrings[this._requires_2_args];
            }

            var s1, s2, d;

            s1 = this.getValueFromArg(args[0]);
            s2 = this.getValueFromArg(args[1]);
            var str1 = this._parseDouble(s1);
            var str2 = this._parseDouble(s2);

            if ((!this._isCellReference(args[0]) && args[0].indexOf(this.tic) == -1) || (!this._isCellReference(args[1]) && args[1].indexOf(this.tic) == -1)) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[5].toString();
            }
            if (!isNaN(str1)) {
                s1 = str1.toString();
            }

            if (!isNaN(str2)) {
                s2 = str2.toString();
            }

            return (s1.split(this.tic).join("") == s2.split(this.tic).join("")) ? "TRUE" : "FALSE";
        };
        this.computeFind = function (arg) {
            var args = this.splitArgsPreservingQuotedCommas(arg);
            if (args.length != 2 && args.length != 3) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            if ((!this._isCellReference(args[0]) && args[0].indexOf(this.tic) == -1) || (!this._isCellReference(args[1]) && args[1].indexOf(this.tic) == -1) || (!this._isCellReference(args[0]) && args[0].indexOf(this.tic) == -1)) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[5].toString();
            }
            ////strip off outside tics (if any) on the evaluated arguments
            var lookFor = this._stripTics0(this.getValueFromArg(args[0]));
            var lookIn = this._stripTics0(this.getValueFromArg(args[1]));
            var start = 1;

            if (args.length == 3) {
                var s3 = this.getValueFromArg(args[2]);
                start = this._parseDouble(s3);
                if (isNaN(start)) {
                    start = 1;
                }
            }

            if (start <= 0 || start > lookIn.length) {
                return "#VALUE!";
            }

            var loc = lookIn.indexOf(lookFor, start - 1);
            if (loc < 0) {
                return "#VALUE!";
            }

            return (Number(loc) + Number(1)).toString();
        };
        this.computeSearch = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            var index;
            var startNum = 1;
            if (argCount != 2 && argCount != 3) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var firstStr = this._stripTics0(this.getValueFromArg(args[0])).toUpperCase();
            var secondStr = this._stripTics0(this.getValueFromArg(args[1])).toUpperCase();
            if ((!this._isCellReference(args[0]) && args[0][0] != this.tic) || (!this._isCellReference(args[1]) && args[1][0] != this.tic)) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[5].toString();
            }

            var qusfirstStr = firstStr;
            if (firstStr.indexOf("*") >-1)
            {
                firstStr = firstStr.split("*").join("")[0].toString();
            }
            else if (firstStr.indexOf("?") >-1)
            {
                var subStr = qusfirstStr.substring(0, qusfirstStr.indexOf("?"));
                var strIndex = Number(secondStr.indexOf(subStr));
                while (secondStr.indexOf(qusfirstStr) == -1)
                {
                    strIndex = Number(secondStr.substring(strIndex).indexOf(subStr)) + Number(strIndex) + 1;
                    qusfirstStr = firstStr;
                    while (qusfirstStr.indexOf("?") != -1)
                    {
                        if (secondStr.length <= strIndex)
                            return this.getErrorStrings()[1].toString();
                        qusfirstStr = qusfirstStr.substring(0, qusfirstStr.indexOf("?")) + secondStr[strIndex] + firstStr.substring(qusfirstStr.indexOf("?") + 1);
                        strIndex++;
                    }
                }
                firstStr = qusfirstStr;
            }
            index = Number(secondStr.indexOf(firstStr)) + 1;
            if (argCount == 3) {

                var startNum = parseInt(this.getValueFromArg(args[2]));
                if (startNum == 1 && firstStr[0] == secondStr[0])
                {
                    return startNum;
                }
                if (!isNaN(startNum)) {
                    try {
                        index = Number(secondStr.indexOf(firstStr, startNum)) + 1;
                    } catch (ex) {
                        return this.getErrorStrings()[1].toString();
                    }
                }
            }
            if (index == 0) {
                return this.getErrorStrings()[1].toString();
            }

            return index.toString();
        };
        this.computeSubstitute = function (range) {
            var args = this.splitArgsPreservingQuotedCommas(range);
            if (args.length != 3 && args.length != 4) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            ////strip off outside tics (if any) on the evaluated arguments
            var s1 = this._stripTics0(this.getValueFromArg(args[0]));
            var s2 = this._stripTics0(this.getValueFromArg(args[1]));
            var s3 = this._stripTics0(this.getValueFromArg(args[2]));
            if ((!this._isCellReference(args[0]) && args[0][0] != this.tic) || (!this._isCellReference(args[1]) && args[1][0] != this.tic)
                || (!this._isCellReference(args[2]) && args[2][0] != this.tic)) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[5].toString();
            }
            if (args.length == 3) {
                if(s2=="" || s2==null)
                {
                    return s1;
                }
                s1 = s1.split(s2).join(s3);
            } else {
                var s4 = this.getValueFromArg(args[3]);
                if (!this._isCellReference(args[3]) && args[3][0] == this.tic) {
                    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                        throw this.getLibraryComputationException();
                    return this.getErrorStrings()[5].toString();
                }
                var d = parseInt(s4)

                if (!isNaN(d)) {
                    var count = d;
                    var loc = -1;
                    while (count > 0 && (loc = s1.indexOf(s2, Number(loc) + 1)) > -1) {
                        count--;
                    }
                    if (count == 0) {
                        s1 = s1.substring(0, loc) + s3 + s1.substring(Number(loc) + Number(s2.length));
                    }
                }
            }
            return  s1;
        };
        this.computeUniChar = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var text = this.getValueFromArg(args[0]);
            var code = this._parseDouble(this._stripTics0(text));
            if (isNaN(code) || code <=0) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return (text[0] == this.tic) ? this.getErrorStrings()[5].toString() : this.getErrorStrings()[1].toString();
            }
            var unicharString = String.fromCharCode(text);
            return unicharString.toString();
        };
        this.computeClean = function (arg) {
            var args = this.splitArgsPreservingQuotedCommas(arg);
            var result;
            if (args.length != 1) {
                return this.formulaErrorStrings[this._wrong_number_arguments].toString();
            }
            var cleanedArg = this.getValueFromArg(args[0]);
            var isLogic = true;
            if (!this._isCellReference(args[0]) && args[0][0] != this.tic) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[5].toString();
            }
            var boolFlag = (cleanedArg == "TRUE" || cleanedArg == "FALSE") ? true : false;
            if (this.getErrorStrings().indexOf(cleanedArg) > -1)
            {
                return cleanedArg;
            }
            if (cleanedArg.indexOf(this.tic) == -1 && !this._isCellReference(arg) && isNaN(this._parseDouble(cleanedArg)) && !boolFlag) {
                return this.getErrorStrings()[5].toString();
            }
            for (var i = 0; i <= 31; i++) {
                var nonPrintChar = this.computeChar(i.toString());
                if (cleanedArg.indexOf(nonPrintChar) > -1)
                    cleanedArg = cleanedArg.replace(nonPrintChar, "");
            }
            if (cleanedArg[0] == this.tic && cleanedArg[cleanedArg.length - 1] == this.tic) {
                cleanedArg = this._substring(cleanedArg, 1, cleanedArg.length - 1);
            }
            return cleanedArg;
        };
        this.computeTrim = function (args) {
            var s = this._stripTics0(this.getValueFromArg(args));
            var arr = [this.tic, ''];
            s = s.split(this.tic).join("");
            var len = 0;
            if (!this._isCellReference(args) && args[0] != this.tic) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[5].toString();
            }
            while (s.length != len) {
                len = s.length;
                s = s.split("  ").join(" ");
            }

            return s;
        };
        this.computeRept = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 2) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var text = this._stripTics0(this.getValueFromArg(args[0]));
            if (!this._isCellReference(args[0]) && args[0][0] != this.tic) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[5].toString();
            }
            var repeatTime = 1;
            var value = parseInt(this.getValueFromArg(args[1].split(this.tic).join("")));
            if (value == null || value == "") {
                return "";
            }
            if (value < 0 || isNaN(value)) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_index];
                return this.getErrorStrings()[1].toString();
            }
            var reptString = "";
            for (var i = 0; i < value ; i++) {
                if (reptString.length > 32767) {
                    if (this.getRethrowLibraryComputationExceptions())
                        throw this.formulaErrorStrings[this._bad_index];
                    return this.getErrorStrings()[1].toString();
                }
                reptString = reptString.concat(text);
            }

            return reptString;
        };
        this.computeProper = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var textValue = this.getValueFromArg(args[0]);
            if (!this._isCellReference(args[0]) && args[0][0] != this.tic) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[5].toString();
            }
            var text = this._stripTics0(textValue);

            var quoteIndex = text.indexOf("'");

            if (quoteIndex >= 0 && quoteIndex < text.length - 1) {
                text = text.replace(/[']/, " '");
            }
            if (/[^a - zA - Z]/.test(text)) {

                text = text.replace(/\w\S*/g, function (text) {
                    var i = 0;
                    var charCode = (text[i].toString().toUpperCase()).charCodeAt(0);
                    while (!(charCode > 64 && charCode < 91))
                    {
                        i++;
                        if (text[i] != undefined)
                            charCode = (text[i].toUpperCase()).charCodeAt(0);
                        else
                        {
                            i--;
                            charCode = 0;
                        }
                    }
                    return text.substr(0, i) + text.charAt(i).toUpperCase() + text.substr(i + 1).toLowerCase();
                });
            }
            else if (/[a - zA - Z0 - 9] + $/.test(text)) {
                text = text.replace(/[^a-zA-Z0-9_\\]/, "");
            }

            return text;

            if (text == null || text == "") {
                return "";
            }
            text = text[0].toUpperCase() + text.slice(1).split(" '").join("'");
            return text.toString();
        };
        this.computeT = function (args) {
            var elements = 0;
            var arg = this.splitArgsPreservingQuotedCommas(args);
            if (arg.length > 1) {
                for (var r = 0; r < arg.length; r++) {
                    elements++;
                    if (r.indexOf(':') > -1) {
                        --elements;
                        var cells1 = this.getCellsFromArgs(r);
                        for (var s1 = 0; s1 < cells1.length; s1++) {
                            elements++;
                        }
                    }
                }
            }
            if (elements > 1) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var s = this.getValueFromArg(args);
            var d;
            var pattern = /[a-zA-Z0-9!#$%&'()*+,/:;<=>?@\^_`{|}~-]/;
            var flag = (s == "TRUE" || s == "FALSE") ? true : false;
            if (!isNaN(this._parseDouble(s)) || flag || !isNaN(this._isDate(s))) {
                return " ";
            } else if (/[a-zA-Z0-9!#$%&'()*+,/:;<=>?@\^_`{|}~-]/.test(s)) {
                s = this._stripTics0(s);
                return s;
            } else {
                return " ";
            }
        };

        this.computeNumberValue = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            var decimalseparator = this._parseDecimalSeparator;
            var groupseparator = this._parseArgumentSeparator;
            if (argCount > 3) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var text = this._stripTics0(this.getValueFromArg(args[0]));
            if (argCount > 1) {
                try {
                    var deci = (args.length > 1 && args[2] != null) ? this._stripTics0(this.getValueFromArg(args[1])) : groupseparator;
                    var gro = (args.length > 1 && args[2]!=null) ? this._stripTics0(this.getValueFromArg(args[2])) : decimalseparator;
                    if ((deci == "invalid expression" || gro == "invalid expression") || ((deci == null || deci == "") && (gro == null || gro == ""))) {
                        if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                            throw this.getLibraryComputationException();
                        return this.getErrorStrings()[1].toString();
                    } else {
                        decimalseparator = this._stripTics0(deci)[0];
                        groupseparator = this._stripTics0(gro)[0];
                    }
                } catch (ex) {
                    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                        throw this.getLibraryComputationException();
                    return this.getErrorStrings()[1].toString();
                }
            }
            if (text == "" || text == null) {
                return "0";
            }
            var indexDecimal = text.indexOf(decimalseparator);
            var indexGroup = text.indexOf(groupseparator);
            if ((indexGroup >= indexDecimal) && (indexDecimal != -1 || indexGroup != -1) && args.length>2) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[1].toString();
            }
            text = text.replace(this.tic, "");
            text = text.replace(" ", "");
            text = text.replace(groupseparator.toString(), "");
            text = text.replace(decimalseparator, this._parseDecimalSeparator);
            var compText = this.computeValue(text);
            if (isNaN(compText) || (text[text.length - 1] == "$")) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[1].toString();
            }
            return compText;
        };
        this.computeConcatenate = function (range) {
            var text = "";
            var ar = this.splitArgsPreservingQuotedCommas(range);
            if (!range || range.length == 0){
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            for (var r = 0; r < ar.length; r++) {
                if ((!this._isCellReference(ar[r]) && ar[r].indexOf(this.tic) == -1)) {
                    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                        throw this.getLibraryComputationException();
                    return this.getErrorStrings()[5].toString();
                }
                else if ((this._isCellReference(ar[r]) && ar[r].indexOf(":") != -1)) {
                    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                        throw this.getLibraryComputationException();
                    return this.getErrorStrings()[1].toString();
                }
                var toAppend = ar[r];
                text = text.concat(this._stripTics0(this.getValueFromArg(ar[r])));
            }
            if (text.indexOf("#N/A") > -1) {
                text = "#N/A";
            }
            return text;
        };
        this.computeValue = function (range) {
            var val = "";
            try {
                var args = this.splitArgsPreservingQuotedCommas(range);
                var argCount = args.length;
                if (argCount == 1) {
                    var s1 = args[0];
                    var ticContains = false;
                    var quotation = false;
                    if (s1.indexOf(this.tic) > -1)
                        ticContains = true;
                    s1 = this._stripTics0(this.getValueFromArg(s1));
                    if ((s1 != null || s1 != "") && !this._isCellReference(s1) && ticContains && isNaN(this._parseDouble(s1.split(",").join("").split("$").join("")))) {
                        s1 = s1.split(this.tic).join("");
                        quotation = true;
                    }
                    if (!this._isCellReference(args[0]) && args[0].indexOf(this.tic) == -1 && isNaN(this._parseDouble(s1))) {
                        if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                            throw this.getLibraryComputationException();
                        return this.getErrorStrings()[5].toString();
                    }
                    if ((s1 == null || s1 == "") && ticContains) {
                        if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                            throw this.getLibraryComputationException();
                        return this.getErrorStrings()[1].toString();
                    } else if ((s1 == null || s1 == "") && !ticContains) {
                        if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                            throw this.getLibraryComputationException();
                        return this.formulaErrorStrings[this._invalid_arguments];
                    }
                    if (s1.indexOf(":") > -1)
                    {
                        val = this.computeTimevalue(s1);
                        return val.toString();
                    }
                    if (s1[0] == "$") {
                        s1 = s1.split("$").join("");
                    }
                    if (s1.indexOf(",") > -1) {
                        s1 = s1.split(",").join("");
                    }
                    if (s1[0] == "%" || s1[s1.length - 1] == "%") {
                        s1 = s1.split("%").join("");
                        var per = this._parseDouble(s1);
                        if (!isNaN(per)) {
                            s1 = (per / 100).toString();
                        }
                    }
                    var dt = new Date(Date.parse(s1));
                    var dous = this._parseDouble(s1);
                    if (!isNaN(dous)) {
                        val = dous.toString();
                    } else if (dt.toString() != "Invalid Date") {
                        val = this._toOADate(dt);
                    } else {
                        if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                            throw this.getLibraryComputationException();
                        return this.getErrorStrings()[1].toString();
                    }
                } else {
                    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                        throw this.getLibraryComputationException();
                    return this.formulaErrorStrings[this._wrong_number_arguments];
                }
            } catch (ex) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[1].toString();
            }

            return val.toString();
        };
        this.computeDollar = function (args) {
            var argsArray = this.splitArgsPreservingQuotedCommas(args);
            var s1 = argsArray[0];
            var s2 = "2";
            if (argsArray.length == 2) {
                s2 = argsArray[1];
            }
            if (argsArray.length > 2) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }           
            s1 = this.getValueFromArg(s1);
            s2 = this.getValueFromArg(s2);
            var number = this._parseDouble(s1);
            var emptyCell = false;
            if ( isNaN(this._parseDouble(s2))) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[5].toString();
            }
            if ((s1 == null || s1 == "") && this._isCellReference(argsArray[0]) && (s1[0] != this.tic && s1[s1.length - 1] != this.tic))
            {
                number=0;
                emptyCell=true;
            }            
            if (isNaN(number) && !emptyCell) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[1].toString();
            }
            var decimals = this._parseDouble(s2);
            var round = 0.0;
            if (isNaN(decimals)) {
                decimals = (s2 == "") ? 0 : 2;
            }
            if (decimals > 0) {
                return ej.format(number, "c" + decimals);
            }
            else {
                var mult = Math.pow(10, -decimals);
                round = Math.round(number / mult) * mult;
                return ej.format(round, "c0");
            }
        };
        this.computeFixed = function (args) {
            var argsArray = this.splitArgsPreservingQuotedCommas(args);
            var s1 = argsArray[0];
            var s2 = "2";
            var s3 = "FALSE";

            var argCount = argsArray.length;
            if (argCount > 1) {
                s2 = argsArray[1];
            }

            if (argCount > 2) {
                s3 = argsArray[2];
            }

            s1 = this.getValueFromArg(s1);
            s2 = this.getValueFromArg(s2);
            s3 = this.getValueFromArg(s3);

            var numbers, decimals;
            numbers = this._parseDouble(s1);
            if (isNaN(numbers)) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[1].toString();
            }
            decimals = this._parseDouble(s2);
            if (isNaN(decimals)) {
                decimals = (s2 == "") ? 0 : 2;
            }
            var no_commas_flag;
            var no_commas;
            no_commas_flag = this._parseDouble(s3);
            if (!isNaN(no_commas_flag)) {
                if (no_commas_flag == 0) {
                    no_commas = false;
                } else {
                    no_commas = true;
                }
            } else {
                if (s3.toUpperCase() == this.falseValueStr) {
                    no_commas = false;
                } else {
                    if (s3.toUpperCase() == this.trueValueStr) {
                        no_commas = true;
                    } else {
                        return "#NAME?";
                    }
                }
            }
            if (no_commas)
            {
               ej.preferredCulture().numberFormat[","] = "";
            }
            if (decimals > 0) {
                return ej.format(numbers, "n" + decimals)
            } else {
                var mult = Math.pow(10, -decimals);
                numbers = Math.round(numbers / mult) * mult;
                return ej.format(numbers, "n0");
            }
        };
        this.computeBin2Dec = function (argList) {
            var ranges = this.splitArgsPreservingQuotedCommas(argList);
            if (ranges.length > 1) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                else
                    return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var value = this.getValueFromArg(ranges[0]).replace(this.tic, "");
            if (!/^[01]{1,10}$/.test(value))
                return this.getErrorStrings()[4].toString();
            try {
                if (value == "")
                    value = "0";

                // Convert binary number to decimal
                var result = parseInt(value, 2);

                // Handle negative numbers
                if (value.length == 10 && value.substring(0, 1) == "1") {
                    return (parseInt(value.substring(1), 2) - 512).toString();
                } else {
                    return result.toString();
                }
            } catch (Exception) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.getErrorStrings()[1].toString();
            }
        };
        this.computeBin2Oct = function (argList) {
            var charCount = 0;
            var ranges = this.splitArgsPreservingQuotedCommas(argList);
            var number = this.getValueFromArg(ranges[0]).replace(this.tic, "");
            var result = "";
            // Return error if number is not binary or contains more than 10 characters (10 digits)
            if (!/^[01]{1,10}$/.test(number))
                return this.getErrorStrings()[4].toString();

            if (ranges.length > 2) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                else
                    return this.formulaErrorStrings[this._wrong_number_arguments];
            } else if (ranges.length > 1) {
                places = parseInt(this.getValueFromArg(ranges[1]).replace(this.tic, ""));
            }

            // Ignore places and return a 10-character octal number if number is negative
            var value = ranges.toString();
            if (value.length == 10 && value.substring(0, 1) == "1") {
                var i = 10;
                var s = "";
                for (var j = 0; j < 3; j++) {
                    i = i - 3;
                    var rmv = this._substring(value, i ,3)
                    var valResult = this._parseDouble(parseInt(rmv, 2).toString(8));
                    var sum = 0;
                    for (var n = valResult; n > 0; sum += parseInt(n % 10), n = parseInt(n / 10));
                        s = sum.toString() + s;
                }
                return "7777777" + s;
            }

            //try {
            //    if (value.length > 10) {
            //        if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
            //            throw this.getLibraryComputationException();
            //        else
            //            return this.getErrorStrings()[4].toString();
            //    } else {
            //        result = parseInt(value, 2).toString(8);
            //        if (ranges.length > 1) {
            //            if (charCount >= result.length && charCount <= 10) {
            //                result = this._padLeft('0', charCount, result);
            //            } else {
            //                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
            //                    throw this.getLibraryComputationException();
            //                else
            //                    result = this.getErrorStrings()[4].toString();
            //            }
            //        }
            //    }
            //} catch (Exception) {
            //    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
            //        throw this.getLibraryComputationException();
            //            result = this.getErrorStrings()[5].toString();
            //    }

            // Ignore places and return a 10-character octal number if number is negative
            if (number < 0) {
                return (1073741824 + number).toString(8);
            }

            // Convert decimal number to octal
            var result = parseInt(number, 10).toString(8);

            // Return octal number using the minimum number of characters necessary if places is undefined
            if (typeof places === 'undefined') {
                return result;
            } else {
                // Return error if places is nonnumeric
                if (isNaN(places)) return '#VALUE!';

                // Return error if places is negative
                if (places < 0) return '#NUM!';

                // Truncate places in case it is not an integer
                places = Math.floor(places);

                // Pad return value with leading 0s (zeros) if necessary (using Underscore.string)
                if (places >= result.length && places <= 10) {
                    while (places- result.length > 0) {
                        result = "0" + result;
                        places--;
                    }
                }
                else
                    if (this.getRethrowLibraryComputationExceptions())
                        throw new this.getErrorStrings()[4].toString();
                    
                return  result;
            }
            //return result;
        };
        this.computeBin2Hex = function (argList) {
            var charCount = 0;
            var ranges = this.splitArgsPreservingQuotedCommas(argList);
            var value = this.getValueFromArg(ranges[0]).replace(this.tic, "");
            var result = "";

            if (ranges.length > 2) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                else
                    return this.formulaErrorStrings[this._wrong_number_arguments];
            } else if (ranges.length > 1) {
                charCount = this._parseDouble(ranges[1]);
            }

            if (value == "1111111111") {
                return value.replace('1', 'F');
            }

            // Ignore places and return a 10-character octal number if number is negative
            if (value.length == 10 && value.substring(0, 1) == "1") {
                return (1073741312 + parseInt(value, 2).toString(8)).toString();
            }

            try {
                if (value.length > 10 || this._parseDouble(value) < 0 || isNaN(value)) {
                    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                        throw this.getLibraryComputationException();
                    else
                        return this.getErrorStrings()[4].toString();
                } else {
                    result = parseInt(value, 2).toString(16);
                    if (ranges.length > 1) {
                        if (charCount >= result.length && charCount <= 10) {
                            result = this._padLeft('0', charCount, result);
                        } else {
                            if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                                throw this.getLibraryComputationException();
                            else
                                result = this.getErrorStrings()[4].toString();
                        }
                    }
                }
            } catch (Exception) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                else {
                    if (this.computeIsText(value) == this.trueValueStr)
                        result = this.getErrorStrings()[5].toString();
                    else if (value == "")
                        return "0";
                    else
                        return this.getErrorStrings()[4].toString();
                }
            }

            return result.toUpperCase();
        };
        this.computeDec2Bin = function (argList) {
            var charCount = 0;
            var ranges = this.splitArgsPreservingQuotedCommas(argList);
            var value = this.getValueFromArg(ranges[0]).replace(this.tic, "");
            var range1 = (ranges.length > 1) ? this.getValueFromArg(ranges[1]).replace(this.tic, "") : "10";
            var result = "";
            if (argList == null || argList == "" || ranges.length > 2 || ranges.length < 1) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            // double d1, d2;
            if (isNaN(this._parseDouble(value)) && isNaN(this._parseDouble(range1))) {
                if (((value != null || value != "") && (this.computeIsText(value) == this.trueValueStr)) || ((range1 != null || range1 != "") && (this.computeIsText(range1) == this.trueValueStr))) {
                    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                        throw this.getLibraryComputationException();
                    return this.getErrorStrings()[1].toString();
                }
                if (((value != null && value != "") && (this.computeIsText(value) == this.falseValueStr)) || ((value != null && value != "") && (this.computeIsText(range1) == this.falseValueStr))) {
                    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                        throw this.getLibraryComputationException();
                    return this.getErrorStrings()[1].toString();
                }
                if ((value == null && value == "") || (range1 == null || range1 == "")) {
                    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                        throw this.getLibraryComputationException();
                    return this.getErrorStrings()[1].toString();
                }
            }
            try {
                if (ranges.length > 1) {
                    var value1 = this.getValueFromArg(ranges[1]).replace(this.tic, "");
                    charCount = this._parseDouble(value1);
                }

                if ((this._parseDouble(value) < -512 || this._parseDouble(value) > 511)) {
                    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                        throw this.getLibraryComputationException();
                    else
                        return this.getErrorStrings()[4].toString();
                } else {
                    result = (value>>>0).toString(2); //BaseToBase(value, 10, 2);
                    if (!isNaN(this._parseDouble(value)) && this._parseDouble(value) < 0) {
                        result = result.substring(result.length - 10);
                    }
                    if (ranges.length > 1) {
                        if (charCount > 10) {
                            if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                                throw this.getLibraryComputationException();
                            return this.getErrorStrings()[4].toString();
                        }
                        if (charCount <= 10)
                            result = this._padLeft('0', charCount, result);
                    }
                }
            } catch (Exception) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
            }
            return result;
        };
       
        this.computeDec2Oct = function (argList) {
            var charCount = 0;
            var ranges = this.splitArgsPreservingQuotedCommas(argList);
            var value = this.getValueFromArg(ranges[0]).replace(this.tic, "");
            var range1 = (ranges.length > 1) ? this.getValueFromArg(ranges[1]).replace(this.tic, "") : "10";
            var result = "";
            if (argList == null || argList == "" || ranges.length > 2 || ranges.length < 1) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            if (isNaN(this._parseDouble(value)) && isNaN(this._parseDouble(range1))) {
                if (((value != null || value != "") && (this.computeIsText(value) == this.trueValueStr)) || ((range1 != null || range1 != "") && (this.computeIsText(range1) == this.trueValueStr))) {
                    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                        throw this.getLibraryComputationException();
                    return this.getErrorStrings()[1].toString();
                }

                if (this.getErrorStrings().indexOf(value) > -1)
                    return value;
                if (this.getErrorStrings().indexOf(range1) > -1)
                    return range1;

                if (((value != null && value != "") && (this.computeIsText(value) == this.falseValueStr)) || ((value != null && value != "") && (this.computeIsText(range1) == this.falseValueStr))) {
                    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                        throw this.getLibraryComputationException();
                    return this.getErrorStrings()[1].toString();
                }
                if ((value == null && value == "") || (range1 == null || range1 == "")) {
                    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                        throw this.getLibraryComputationException();
                    return this.getErrorStrings()[1].toString();
                }
            }
            try {
                if (ranges.length > 1) {
                    var value1 = this.getValueFromArg(ranges[1]).replace(this.tic, "");
                    charCount = this._parseDouble(value1);
                }

                if ((this._parseDouble(value) < -536870912 || this._parseDouble(value) > 536870911)) {
                    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                        throw this.getLibraryComputationException();
                    else
                        return this.getErrorStrings()[4].toString();
                } else if (this._parseDouble(value) < 0) {
                    result = parseInt((value) >>> 0, 10).toString(8);
                    if (!isNaN(this._parseDouble(value)) && this._parseDouble(value) < 0) {
                        result = result.substring(result.length - 10);
                    }
                }
                else {
                    result = parseInt(value, 10).toString(8);
                    if (!isNaN(this._parseDouble(value)) && this._parseDouble(value) < 0) {
                        result = result.substring(result.length - 10);
                    }
                    if (ranges.length > 1) {
                        if (charCount > 10) {
                            if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                                throw this.getLibraryComputationException();
                            return this.getErrorStrings()[4].toString();
                        }
                        if (charCount <= 10)
                            result = this._padLeft('0', charCount, result);
                    }
                }
            } catch (Exception) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
            }
            return result;
        };
        this.computeHex2Bin = function (argList) {
            var charCount = 0;
            var ranges = this.splitArgsPreservingQuotedCommas(argList);
            if (argList == this._parseArgumentSeparator.toString()) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                else
                    return this.getErrorStrings()[0].toString();
            }
            var value = this.getValueFromArg(ranges[0]);
            var chars = (ranges.length == 2) ? this.getValueFromArg(ranges[1]) : "0";

            if (value != "") {
                if (value[0] != this.tic && !this._isCellReference(value) && isNaN(this._parseDouble(value))) {
                    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                        throw this.getLibraryComputationException();
                    else
                        return this.getErrorStrings()[5].toString();
                }
            } else if (this._isCellReference(ranges[0]) && value == "") {
                return "0";
            }
            if ((value[0] == this.tic) && (value.split(this.tic).join("") == null || value.split(this.tic).join("") == "")) {
                return "0";
            }
            if (chars[0] == this.tic) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                else
                    return this.getErrorStrings()[1].toString();
            } else if (isNaN(this._parseDouble(chars.split(this.tic).join("")))) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                else
                    return this.getErrorStrings()[5].toString();
            }
            charCount = this._parseDouble(chars);
            if (charCount < 0 || value[0] == "-") {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                else
                    return this.getErrorStrings()[4].toString();
            }
            var result = "";
            value = value.split(this.tic).join("");
            try {
                for (var i = 0; i < value.length; i++) {
                    // Convert to decimal
                    var output = this._padLeft('0', 4, parseInt(value.charAt(i), 16).toString(2));
                    result += output;
                }
                if (value.split(this.tic).join("") == "FFFFFFFFFF") {
                    return this._parseDouble(value.split('F').join('1'));
                }

                if (result.length > 10 || charCount > 10 || (charCount < result.length && charCount != 0)) {
                    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                        throw this.getLibraryComputationException();
                    else
                        return this.getErrorStrings()[4].toString();
                }

                if (charCount >= result.length)
                    result = this._padLeft('0', charCount, result);
                else if (charCount != 0) {
                    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                        throw this.getLibraryComputationException();
                    else
                        return this.getErrorStrings()[4].toString();
                }

                if (!isNaN(this._parseDouble(result)) && (this._parseDouble(result) > 536870911.0)) {
                    if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                        throw this.getLibraryComputationException();
                    else
                        return this.getErrorStrings()[4].toString();
                }
            } catch (ex) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                else
                    return this.getErrorStrings()[4].toString();
            }

            return result;
        };
        
        this.computeHex2Oct = function (argList) {
            var charCount = 0;
            var ranges = this.splitArgsPreservingQuotedCommas(argList);
            if (argList == this._parseArgumentSeparator.toString()) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                else
                    return this.getErrorStrings()[0].toString();
            }
            var value = this.getValueFromArg(ranges[0]);
            ranges[0] = ranges[0].split(this.TIC).join("");
            var chars = (ranges.length == 2) ? this.getValueFromArg(ranges[1]) : "0";
            if ((value[0] == this.tic) && (value.split(this.tic).join("") == null || value.split(this.tic).join("") == "")) {
                return "0";
            } else if (value.indexOf(this._parseArgumentSeparator.toString()) > -1) {
                var len = value.indexOf(this._parseArgumentSeparator);
                value = value.split(this.tic).join("").substring(0, len - 1);
            }
            var result = "";
            if (isNaN(this._parseDouble(chars.split(this.tic).join("")))) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                else
                    return this.getErrorStrings()[5].toString();
            }
            charCount = this._parseDouble(chars);
            if (charCount < 0 || value[0] == "-") {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                else
                    return this.getErrorStrings()[4].toString();
            }
            if (ranges.length > 2) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                else
                    return this.getErrorStrings()[4].toString();
            }

            if (ranges.length > 1)
                charCount = this._parseDouble(ranges[1]);
            try {
                value = value.split(this.tic).join("");
                result = parseInt(value, 16).toString(8);
                if (!isNaN(this._parseDouble(result)) && result.length > 10) {
                    result = result.substring(result.length - 10);
                }
                if (ranges.length > 1) {
                    if (charCount >= result.length && charCount <= 10)
                        result = this._padLeft('0', charCount, result);
                    else {
                        if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                            throw this.getLibraryComputationException();
                        else
                            return this.getErrorStrings()[4].toString();
                    }
                    if (!isNaN(this._parseDouble(result)) && (this._parseDouble(result) > 536870911.0)) {
                        if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                            throw this.getLibraryComputationException();
                        else
                            return this.getErrorStrings()[4].toString();
                    }
                }
            } catch (Exception) {
                if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null)
                    throw this.getLibraryComputationException();
                else {
                    if (this.computeIsText(value) == this.trueValueStr)
                        return this.getErrorStrings()[4].toString();
                    else if (value == "")
                        return "0";
                    else
                        return this.getErrorStrings()[4].toString();
                }
            }
            return result;
        };
        this._padLeft = function (paddingChar, length, stringpad) {
            var strlen = stringpad.length;
            if ((stringpad.length < length) && (paddingChar.toString().length > 0)) {
                for (var i = 0; i < (length - strlen) ; i++)
                    stringpad = paddingChar.toString().charAt(0).concat(stringpad);
            }
            return stringpad;
        };


        this.computeAddress = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            var ans = this._string_empty;
            var arg0 = this.getValueFromArg(args[0].split(this.tic).join(this._string_empty));
            var arg1 = this.getValueFromArg(args[1].split(this.tic).join(this._string_empty));
            var row = this._parseDouble(arg0);
            var col = this._parseDouble(arg1);
            if (row < 1 || col < 1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.getErrorStrings()[1].toString();
                return this.getErrorStrings()[1].toString();
            }
            var absNum = (argCount > 2) ? this.getValueFromArg(args[2].split(this.tic).join(this._string_empty)) : "1";
            var temp = col;
            var rem = temp % 26;
            temp = parseInt(temp / 26);
            ans = ans + this._charTable[rem];
            ans = ans + this._charTable[parseInt(temp)];
            var arr = (ans.split('').join(',')).split(this.getParseArgumentSeparator());
            arr.reverse();
            var ans1 = arr;
            ans = '$' + ans1 + '$' + arg0;
            if (argCount > 2) {
                switch (absNum) {
                    case "":
                        break;
                    case "1":
                        break;
                    case "2":
                        ans = ans1 + '$' + arg0;
                        break;
                    case "3":
                        ans = '$' + ans1 + arg0;
                        break;
                    case "4":
                        ans = ans1 + arg0;
                        break;
                }
            }
            if (argCount > 3 && (this.getValueFromArg(args[3].split(this.tic).join(this._string_empty)) == "FALSE" || this.getValueFromArg(args[3].split(this.tic).join(this._string_empty)) == "0")) {
                switch (absNum) {
                    case "":
                        ans = "R" + row + "C" + col;
                        break;
                    case "1":
                        ans = "R" + row + "C" + col;
                        break;
                    case "2":
                        ans = "R" + row + "C[" + col + "]";
                        break;
                    case "3":
                        ans = "R[" + row + "]C" + col;
                        break;
                    case "4":
                        ans = "R[" + row + "]C[" + col + "]";
                        break;
                }
            }
            if ((argCount > 4 && this.getValueFromArg(args[4].split(this.tic).join(this._string_empty)) == this._string_empty)) {
                args[4] = this.getValueFromArg(args[4]);
                ans = args[4].split(this.tic).join(this._string_empty) + "!" + ans;
            }
            return ans;
        };
        this.computeAreas = function (arg) {
            if (arg.indexOf(" ") > 0) {
                arg = arg.substring(0, arg.indexOf(" "));
            }
            if (!this._isCellReference(arg) && !this.getNamedRanges().containsKey(arg) && !arg.indexOf(")")) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._invalid_arguments];
                return this.formulaErrorStrings[this._invalid_arguments];
            }
            var args1;
            args1 = this._splitArguments(arg, ')');
            if (args1.length > 2) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.getErrorStrings()[1].toString();
            }
            var argument = args1[0].split("(").join(this._string_empty);
            var args;
            args = this.splitArgsPreservingQuotedCommas(argument);
            var argCount = args.length;
            for (var i = 0; i < args.length; i++) {
                if (!this._isCellReference(args[i])) {
                    if (this._rethrowLibraryComputationExceptions)
                        throw this.formulaErrorStrings[this._invalid_arguments];
                    return this.getErrorStrings()[1].toString();
                }
            }
            return args.length.toString();
        };
        this.computeChoose = function (arg) {
            var args;
            args = this.splitArgsPreservingQuotedCommas(arg);
            if (args.length < 2) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var s3 = this.getValueFromArg(args[0]).split(this.tic).join("");
            var indexArgs = this.splitArgsPreservingQuotedCommas(s3);
            s3 = indexArgs[0];
            var loc = parseInt(s3);
            if (isNaN(loc) || loc > args.length - 1 || loc < 1) {
                return "#VALUE!";
            }
            if (this._isInteriorFunction)
            {
                this._isInteriorFunction = !this._isInteriorFunction;
                return args[loc];
            }
            var value = this.getValueFromArg(args[loc]);
            if (value == "")
            {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._invalid_Math_argument];
                return this.getErrorStrings()[5].toString();
            }
            return value;
        };
        this.computeColumn = function (arg) {
            var rowInd, colInd;
            if (arg == null || arg == this._string_empty) {
                colInd = this.colIndex(this.cell).toString();
                rowInd = this.rowIndex(this.cell).toString();
                return colInd;
            }

            colInd =  this.colIndex(arg).toString();
            rowInd = this.rowIndex(arg).toString();
            if (rowInd <= 0)
            {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._invalid_Math_argument];
                return this.getErrorStrings()[5].toString();
            }
            return colInd;
        };
        this.computeColumns = function (arg) {
            var args;
            args = this.splitArgsPreservingQuotedCommas(arg);
            if (args.length != 1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var val = -1;
            if (this._parseDouble(args[0], val)) {
                return "1";
            } else if ((args[0].indexOf(this.tic) && !args[0].indexOf(";") && !args[0].indexOf(this.getParseArgumentSeparator().toString())) || (!this._isCellReference(args[0]) && !this.getNamedRanges().containsValue(args[0]) && !arg.indexOf(";") && !arg.indexOf(this.getParseArgumentSeparator().toString()))) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.getErrorStrings()[1].toString();
                return this.getErrorStrings()[1].toString();
            }

            var firstCol, LastCol, totalCols = 1;
            if (arg.indexOf(':') > -1) {
                var cells;
                cells = this.getCellsFromArgs(arg);
                firstCol = this.colIndex(cells[0].toString());
                LastCol = this.colIndex(cells[cells.length - 1].toString());
                totalCols = LastCol - firstCol + 1;
                totalCols = (totalCols > 0) ? totalCols : 1;
            } else if (arg.indexOf(';') > -1) {
                var arrayArg;
                arrayArg = this._splitArguments(arg.split(this.tic).join(this._string_empty), ';');
                for (var i = 1; i < arrayArg.length; i++) {
                    if (this.splitArgsPreservingQuotedCommas(arrayArg[i - 1]).length != this.splitArgsPreservingQuotedCommas(arrayArg[1]).length) {
                        if (this._rethrowLibraryComputationExceptions)
                            throw this.formulaErrorStrings[this._wrong_number_arguments];
                        return this.formulaErrorStrings[this._wrong_number_arguments];
                    }
                    totalCols = this.splitArgsPreservingQuotedCommas(arrayArg[0]).length;
                }
            } else {
                var arrayArg;
                arrayArg = this.splitArgsPreservingQuotedCommas(args[0].split(this.tic).join(this._string_empty));
                totalCols = arrayArg.length;
            }
            return totalCols.toString();
        };
        this.computeFormulaText = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            var value = this._string_empty;
            if (argCount != 1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            value = this.getValueFromArg(args[0]);
            if (this.getNamedRanges().containsValue(value)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_index];
                return this.getErrorStrings()[1].toString();
            }
            var family = CalcEngine.getSheetFamilyItem(this.grid);
            if (args[0].indexOf(this.sheetToken) == -1 && this.isSheetMember() && family.parentObjectToToken != null) {
                args[0] = family.parentObjectToToken.getItem(this.grid) + args[0];
            }
            if (this.getFormulaInfoTable().containsKey(args[0])) {
                var formula = this.getFormulaInfoTable().getItem(args[0]);
                value = formula.getFormulaText();
                this.getFormulaText(value);
            } else {
                if (this._rethrowLibraryComputationExceptions) {
                    throw this.formulaErrorStrings[this._bad_formula];
                }
                return (this.rowIndex(args[0]) <= 0) ? this.getErrorStrings()[5].toString() : this.getErrorStrings()[0].toString();
            }

            return value;
        };
        this.computeHyperlink = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount > 2) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var firstStr = this._stripTics0(this.getValueFromArg(args[0]));
            if (argCount == 2) {
                var displayText = this._stripTics0(this.getValueFromArg(args[1]));

                if (displayText == null) {
                    return "0";
                }
                if (displayText == this._string_empty) {
                    return this._string_empty;
                }
                return displayText;
            }
            return firstStr;
        };
        this.computeAbs = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var argValue = this.getValueFromArg(args[0]);
            argValue = (argValue.split(this.tic).join("") == "TRUE") ? "1" : (argValue.split(this.tic).join("") == "FALSE") ? "0" : argValue;
            var dVal = this._parseDouble(argValue.split(this.tic).join(""));
            if (isNaN(dVal)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argValue[0] == this.tic || this._isCellReference(args[0])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
            return Math.abs(dVal).toString();
        };
        this.computeAcos = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var argValue = this.getValueFromArg(args[0]);
            var dVal = this._parseDouble(argValue);
            if (isNaN(dVal)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argValue[0] == this.tic || this._isCellReference(args[0])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
            if (dVal > 1 || dVal < -1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[4].toString();
            }
            return Math.acos(dVal).toString();
        };
        this.computeAcosh = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var argValue = this.getValueFromArg(args[0]);
            var dVal = this._parseDouble(argValue);
            if (isNaN(dVal)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argValue[0] == this.tic || this._isCellReference(args[0])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
            z = Math.log(dVal + Math.sqrt(dVal * dVal - 1));
            if (dVal <= 0 || z == Infinity) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[4].toString();
            }
            return z.toString();
        };
        this.computeAcot = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var argValue = this.getValueFromArg(args[0]);
            var dVal = this._parseDouble(argValue);
            if (isNaN(dVal)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argValue[0] == this.tic || this._isCellReference(args[0])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
            if (dVal < 1 && dVal > -1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[4].toString();
            }
            var d1 = this._parseDouble(argList), d2 = 0;

            if (!isNaN(d1)) {
                d2 = Math.PI / 2 - Math.atan(d1);
            }
            return d2.toString();
        };
        this.computeAcoth = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var argValue = this.getValueFromArg(args[0]);
            var dVal = this._parseDouble(argValue);
            if (isNaN(dVal)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argValue[0] == this.tic || this._isCellReference(args[0])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
            if (dVal < 1 && dVal > -1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[4].toString();
            }
            var acothVal = (Math.log((dVal + 1) / (dVal - 1)) / 2).toString();

            if (this.computeIsErr(acothVal) == this.trueValueStr)
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
            return this.getErrorStrings()[4].toString();

            return acothVal;
        };
        this.computeArabic = function (arg) {
            var args = this.splitArgsPreservingQuotedCommas(arg);
            if (args.length != 1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var text = this.getValueFromArg(args[0]);
            var dvalue = parseInt(text.split(this.tic).join("").toUpperCase());
            if (!isNaN(dvalue) || (!this._isCellReference(args[0]) && args[0][0] != this.tic)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (!isNaN(dvalue)) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
            text = text.split(this.tic).join("").toUpperCase()
            var i = 0;
            var ch = null;
            var result = 0;
            var new_value = 0;
            var old_value = 0;
            old_value = 1000;
            var isNegative = false;
            for (i = 1; i <= text.length; i++) {
                // See what the next character is worth.
                ch = this._substring(text, i - 1, 1);
                switch (ch) {
                    case "-":
                        isNegative = true;
                        break;
                    case "I":
                        new_value = 1;
                        break;
                    case "V":
                        new_value = 5;
                        break;
                    case "X":
                        new_value = 10;
                        break;
                    case "L":
                        new_value = 50;
                        break;
                    case "C":
                        new_value = 100;
                        break;
                    case "D":
                        new_value = 500;
                        break;
                    case "M":
                        new_value = 1000;
                        break;
                    default: {
                        if (this._rethrowLibraryComputationExceptions)
                            throw this.formulaErrorStrings[this._bad_formula];
                        return this.getErrorStrings()[1].toString();
                    }
                }

                // See if this character is bigger
                // than the previous one.
                if (new_value > old_value) {
                    // The new value > the previous one.
                    // Add this value to the result
                    // and subtract the previous one twice.
                    result = result + new_value - 2 * old_value;
                } else {
                    // The new value <= the previous one.
                    // Add it to the result.
                    result = result + new_value;
                }
                old_value = new_value;
            }
            if (isNegative)
                result = -result;
            return result.toString();
        };
        this.computeAsin = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var argValue = this.getValueFromArg(args[0]);
            var dVal = this._parseDouble(argValue);
            if (isNaN(dVal)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argValue[0] == this.tic || this._isCellReference(args[0])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
            if (dVal > 1 || dVal < -1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[4].toString();
            }
            var d1 = this._parseDouble(argValue), d2 = 0;

            if (!isNaN(d1)) {
                d2 = Math.asin(d1);
            }
            return d2.toString();
        };
        this.computeAtan = function (args) {
            return this._computeMath(args, Math.atan).toString();
        };
        this.computeAtan2 = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 2) {
                return this.formulaErrorStrings[this.requires_2_args];
            }

            var x;
            var y = 0;
            var atan2 = 0;
            var param1, param2;
            var flag1, flag2;
            param1 = this.getValueFromArg(args[0]);
            param2 = this.getValueFromArg(args[1]);

            flag1 = (param1 == "true") ? true : false;
            flag2 = (param2 == "true") ? true : false;

            if (flag1)
                param1 = (flag1).toString();
            else if (param1 == (this._string_empty))
                param1 = "0";
            if (flag2)
                param2 = flag2.toString();
            else if (param2 == (this._string_empty))
                param2 = "0";
            if (this.getErrorStrings().indexOf(param1) > -1) {
                return param1;
            }
            if (this.getErrorStrings().indexOf(param2) > -1) {
                return param2;
            }
            x = this._parseDouble(param1);
            y = this._parseDouble(param2);
            if (isNaN(x) || isNaN(y)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.getErrorStrings()[1].toString();
                else
                    return this.getErrorStrings()[1].toString();
            } else if (y == 0 && x == 0) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.getErrorStrings()[3].toString();
                else
                    return this.getErrorStrings()[3].toString();
            }
            atan2 = Math.atan2(y, x);
            return atan2.toString();
        };
        this.computeCeilingMath = function (args) {
            var range = this.splitArgsPreservingQuotedCommas(args);
            var argCount = range.length;
            if (this._isTextEmpty(args) || argCount > 3 || argCount < 1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var range0 = this.getValueFromArg(range[0]);
            var range1 = (argCount > 1 && range[1].length != 0) ? this.getValueFromArg(range[1]) : "1";
            var range2 = (argCount == 3 && range[2].length != 0) ? this.getValueFromArg(range[2]) : "1";

            var d1, d2 = -1, d3 = -1, result;
            var numberresult = false, signresult = false, moderesult = false;
            numberresult = (range0.split(this.tic).join(this._string_empty) == "true") ? true : false;
            signresult = (range1.split(this.tic).join(this._string_empty) == "true") ? true : false;
            moderesult = (range2.split(this.tic).join(this._string_empty) == "true") ? true : false;
            range0 = numberresult ? (numberresult).toString() : range0;
            range1 = signresult ? (signresult).toString() : range1;
            range2 = moderesult ? (moderesult).toString() : range2;

            if (this.getErrorStrings().indexOf(range0) != -1)
                return range0;
            if (this.getErrorStrings().indexOf(range1) != -1)
                return range1;
            if (this.getErrorStrings().indexOf(range2) != -1)
                return range2;
            if (range1.indexOf(" ") > -1) {

                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_index];
                return this.getErrorStrings()[1].toString();
            }
            else if (range1.startsWith(this.tic))
            {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_index];
                return this.getErrorStrings()[4].toString();
            }


            d1 = this._parseDouble(range0); //.split(this.tic).join(this._string_empty);
            d2 = this._parseDouble(range1); //.split(this.tic).join(this._string_empty);
            d3 = this._parseDouble(range2); //.split(this.tic).join(this._string_empty);
            if (isNaN(d1) && !isNaN(d2) && !isNaN(d3)) {
                if ((d1 == 0 && !this._isTextEmpty(range0) && (this.computeIsText(range0) == this.falseValueStr)) || (d2 == 0 && !this._isTextEmpty(range1) && (this.computeIsText(range1) == this.falseValueStr) || (d3 == 0 && !this._isTextEmpty(range2) && (this.computeIsText(range2) == this.falseValueStr)))) {
                    if (this._rethrowLibraryComputationExceptions)
                        throw this.formulaErrorStrings[this._bad_index];
                    return this.getErrorStrings()[5].toString();
                }
                if ((this._isTextEmpty(range0.split(this.tic).join(this._string_empty)) && range0[0] == (this.tic)) || (this._isTextEmpty(range1.split(this.tic).join(this._string_empty)) && range1[1] == (this.tic)) || (this._isTextEmpty(range2.split(this.tic).join(this._string_empty)) && range2[2] == (this.tic))) {
                    if (this._rethrowLibraryComputationExceptions)
                        throw this.formulaErrorStrings[this._invalid_arguments];
                    return this.getErrorStrings()[1].toString();
                }
                if (this._isTextEmpty(range0.split(this.tic).join(this._string_empty)) || this._isTextEmpty(range1.split(this.tic).join(this._string_empty)) || this._isTextEmpty(range2.split(this.tic).join(this._string_empty))) {
                    return "0";
                }
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._invalid_arguments];
                return this.getErrorStrings()[1].toString();
            }

            if (d1 < 0 && d3 < 0) {
                d2 = -1;
            }

            if (d1 == 0 || d2 == 0) {
                return "0";
            }
            var divideResult = 0;
            d1 = this._parseDouble(d1.toString());
            if (d1 > 0) {

                d1+=.4999999999;
            }
            if (d1 < 0 && -0.5 >= d1 - parseInt(d1)) {
                d1 -= .4999999999;
            }
            d1 =  Math.round(d1);
            divideResult = Math.floor(d1 / d2);

            result = divideResult * d2;

            if (d1 < 0 && (d1 % 2 != 0)) {
                if (d3 == 0) {
                    result += d2;
                }
            }

            return result.toString();
        };
        this.computeCeiling = function (args) {
            var range = this.splitArgsPreservingQuotedCommas(args);
            var argCount = range.length;
            if (argCount != 2) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var range0 = (argCount > 1) ? this.getValueFromArg(range[0]) : "1";
            var range1 = (argCount > 1 && range[1].length != 0) ? this.getValueFromArg(range[1]) : "0";
            range1 = (range1 == "" || range1 == null) ? "0" : range1;
            var numberresult = false, signresult = false;

            numberresult = (range0.split(this.tic).join(this._string_empty) == "true") ? true : false;
            signresult = (range1.split(this.tic).join(this._string_empty) == "true") ? true : false;
            range0 = numberresult ? numberresult.toString() : range0;
            range1 = signresult ? signresult.toString() : range1;

            if (range1 == this.trueValueStr)
                return "1";
            else if (range1 == this.falseValueStr)
                return "0";
            if (range1.indexOf(" ") > -1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_index];
                return this.getErrorStrings()[1].toString();
            }

            if (this.getErrorStrings().indexOf(range0) != -1)
                return range0;
            if (this.getErrorStrings().indexOf(range1) != -1)
                return range1;
            var d1, d2 = -1, d3 = -1;
            d1 = this._parseDouble(range0);
            d2 = this._parseDouble(range1);
            if (isNaN(d1) && !isNaN(d2)) {
                if ((d1 == 0 && !this._isTextEmpty(range0) && (this.computeIsText(range0) == this.falseValueStr)) || (d2 == 0 && !this._isTextEmpty(range1) && (this.computeIsText(range1) == this.falseValueStr))) {
                    if (this._rethrowLibraryComputationExceptions)
                        throw this.formulaErrorStrings[this._bad_index];
                    return this.getErrorStrings()[5].toString();
                }
                if ((this._isTextEmpty(range0.split(this.tic).join(this._string_empty)) && range0[0] == (this.tic)) || (this._isTextEmpty(range1.split(this.tic).join(this._string_empty)) && range1[0] == (this.TIC))) {
                    if (this._rethrowLibraryComputationExceptions)
                        throw this.formulaErrorStrings[this.invalid_arguments];
                    return this.getErrorStrings()[1].toString();
                }
                if (this._isTextEmpty(range0.split(this.tic).join(this._string_empty)) || this._isTextEmpty(range1.split(this.tic).join(this._string_empty))) {
                    return "0";
                }
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._invalid_arguments];
                return this.getErrorStrings()[1].toString();
            }
            d1 = this._parseDouble(range0);
            d2 = this._parseDouble(range1);
            if (!isNaN(d1) && !isNaN(d2)) {
                if (d1 > 0 && d2 < 0)
                {
                    if (this._rethrowLibraryComputationExceptions)
                        throw this.formulaErrorStrings[this._invalid_arguments];
                    return this.getErrorStrings()[4].toString();
                }
                if (d1 == 0 || d2 == 0)
                    return "0";
                d3 = Math.floor(d1 / d2) * d2;
                if (d2 > 0) {
                    while (d3 < d1) {
                        d3 += d2;
                    }
                } else {
                    while (d3 > d1) {
                        d3 += d2;
                    }
                }
            }
            return d3.toString();
        };
        this.computeDecimal2 = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount > 3) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var Base64 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";
            if (!this.getValueFromArg(args[0]).indexOf(this.tic) && !this._isCellReference(args[0])) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._invalid_Math_argument];
                return this.getErrorStrings()[1].toString();
            }
            var strValue;
            var radix = 0;
            try {
                strValue = this.getValueFromArg(args[0]).split(this.tic).join("");
                radix = parseInt(this.getValueFromArg(args[1]).split(this.tic).join(""));
            } catch (ex) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._invalid_Math_argument] + ex;
                return this.getErrorStrings()[1].toString();
            }
            var result;
            if (radix < 2 || radix > Base64.length) {
                if (this._rethrowLibraryComputationExceptions)
                    throw "Base requested outside range, it should be from 2 - 16";
                return this.getErrorStrings()[4].toString();
            }
            strValue = (this._isIE8) ? strValue.replace(/^\s+|\s+$/g, '') : strValue.trim();
            if (radix <= 36)
                strValue = strValue.toUpperCase();
            var pos = 0;
            result = 0;

            while (pos < strValue.length && !this._isWhiteSpace(strValue[pos])) {
                var digit = strValue.substring(pos, 1);
                var i = Base64.indexOf(digit);
                if (i >= 0 && i < radix) {
                    result *= radix;
                    result += i;
                    pos++;
                } else {
                    if (this._rethrowLibraryComputationExceptions)
                        throw "Base requested outside range, it should be from 2 - 16";
                    return this.getErrorStrings()[4].toString();
                }
            }
            return result.toString();
        };
        this.computeCombin = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 2) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._this.requires_2_args];
                else
                    return this.formulaErrorStrings[this.requires_2_args];
            }

            ////N things taken k at the time.
            var nd;
            var kd;
            var combin = 0;
            if (args[0].split(this.tic).join("") == (this._string_empty) || args[1].split(this.tic).join("") == (this._string_empty)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.getErrorStrings()[1].toString();
                else
                    return this.getErrorStrings()[1].toString();
            }
            nd = this._parseDouble(this.getValueFromArg(args[0]).split(this.tic).join(""));
            kd = this._parseDouble(this.getValueFromArg(args[1]).split(this.tic).join(""));
            if (!isNaN(nd) && !isNaN(kd)) {
                var k = parseInt((kd + 0.1).toString());
                var n = parseInt((nd + 0.1).toString());
                if (n < k || n < 1) {
                    if (this._rethrowLibraryComputationExceptions)
                        throw this.getErrorStrings()[1].toString();
                    else
                        return this.getErrorStrings()[4].toString();
                }
                combin = this._comb(k, n);
            } else {
                if (!this._rethrowLibraryComputationExceptions)
                    throw this.getErrorStrings()[1].toString();
                else
                    return this.formulaErrorStrings[this._invalid_arguments];
            }
            return combin.toString();
        };
        this.computeCombinA = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argList.indexOf("u") > -1) {
                if (this._rethrowLibraryComputationExceptions) {
                    throw this.getErrorStrings()[4].toString();
                }
                return this.getErrorStrings()[4].toString();
            }
            if (argCount != 2) {
                if (this._rethrowLibraryComputationExceptions) {
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                }
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            if (argList.length > 15) {
                if (this._rethrowLibraryComputationExceptions) {
                    throw this.getErrorStrings()[4].toString();
                }
                return this.getErrorStrings()[4].toString();
            }
            var number1 = parseInt(this.getValueFromArg(args[0]).split(this.tic).join(""));
            var choosedNumber = parseInt(this.getValueFromArg(args[1]).split(this.tic).join(""));
            var result;
            if (number1 == 0 && choosedNumber == 0) {
                result = "1";
            } else {
                var number2 = number1 + choosedNumber - 1;
                var pass = number2 + "," + (number1 - 1);
                result = this.computeCombin(pass);
            }
            return result;
        };
        this.computeCos = function (args) {
            return this._computeMath(args, Math.cos).toString();
        };
       
        this.computeCosh = function (args) {
            var arg = this._splitArguments(args, this.getParseArgumentSeparator().toString());
            var argCount = arg.length;
            if (argCount > 1) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var argVal = this.getValueFromArg(arg[0]);
            var value = this._parseDouble(argVal.split(this.tic).join(""));
            if (isNaN(value)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argVal[0] == this.tic || this._isCellReference(arg[0])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
            var y = Math.exp(value);
            return (y + 1 / y) / 2;
        };
        this.computeCot = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            var argCount = args.length;
            if (argCount != 1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            if (argList[0] == (this.tic) && argList[length - 1] == (this.tic))
                argList = argList.split(this.tic).join("");
            if (argList == this._string_empty) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.getErrorStrings()[4].toString();
                return this.getErrorStrings()[4].toString();
            }
            var isNumber = this.computeIsNumber(argList);
            if (isNumber == this.trueValueStr) {
                var tempList = argList;
                tempList = tempList.indexOf("u") ? tempList.split("u").join(this._string_empty) : tempList;
                var number = this._parseDouble(tempList);
                if (number >= 134217728) {
                    if (this._rethrowLibraryComputationExceptions)
                        throw this.getErrorStrings()[4].toString();
                    return this.getErrorStrings()[4].toString();
                }
            } else {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.getErrorStrings()[4].toString();
                return this.getErrorStrings()[5].toString();
            }
            if (argList == "0") {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.getErrorStrings()[3].toString();
                return this.getErrorStrings()[3].toString();
            }
            var cotVal = this._computeMath(argList, Math.tan);
            if (cotVal != "#NUM!" || cotVal != "#VALUE!") {
                cotVal = (1 / parseFloat(cotVal)).toString();
            }
            return cotVal;
        };
        this.computeCsc = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var argValue = this.getValueFromArg(args[0]);
            var dVal = this._parseDouble(argValue);
            if (isNaN(dVal)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argValue[0] == this.tic || this._isCellReference(args[0])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
            if (dVal >= 134217728) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[4].toString();
            }
            
            var cscVal = (1 / parseFloat(Math.sin(dVal))).toString();
            return cscVal;
        };
        
        this.computeCsch = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var argValue = this.getValueFromArg(args[0]);
            var dVal = this._parseDouble(argValue);
            var isNumber = this.computeIsNumber(argList);
            if (isNaN(dVal)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argValue[0] == this.tic || this._isCellReference(args[0])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
            if (dVal == 0) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[3].toString();
            }
            if (dVal > 709) {
                return "0";
            }
            var cschVal = (2 / (Math.exp(dVal) - Math.exp(-dVal))).toString();

            return cschVal;
        };
        this.computeDecimal = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount > 3) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var Base64 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";
            if (this.getValueFromArg(args[0]).indexOf(this.tic) != -1 && !this._isCellReference(args[0])) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._invalid_Math_argument];
                return this.getErrorStrings()[1].toString();
            }
            var strValue;
            var radix = 0;
            try {
                strValue = this.getValueFromArg(args[0]).split(this.tic).join("");
                radix = parseInt(this.getValueFromArg(args[1]).split(this.tic).join(""));
            } catch (ex) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._invalid_Math_argument] + ex;
                return this.getErrorStrings()[1].toString();
            }
            var result;
            if (radix < 2 || radix > Base64.length) {
                if (this._rethrowLibraryComputationExceptions)
                    throw "Base requested outside range, it should be from 2 - 16";
                return this.getErrorStrings()[4].toString();
            }

            strValue = (this._isIE8) ? strValue.replace(/^\s+|\s+$/g, '') : strValue.trim();
            if (radix <= 36)
                strValue = strValue.toUpperCase();
            var pos = 0;
            result = 0;

            while (pos < strValue.length ) {
                var digit = this._substring(strValue, pos, 1);
                var i = Base64.indexOf(digit);
                if (i >= 0 && i < radix) {
                    result *= radix;
                    result += i;
                    pos++;
                    
                } else {
                    if (this._rethrowLibraryComputationExceptions)
                        throw "Base requested outside range, it should be from 2 - 16";
                    return this.getErrorStrings()[4].toString();
                }
            }

            return result.toString();
        };
        this.computeDegrees = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var argValue = this.getValueFromArg(args[0]);
            var radians = this._parseDouble(argValue);
            if (isNaN(radians)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argValue[0] == this.tic || this._isCellReference(args[0])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
            var degrees = 0;
            degrees = 180 * radians / Math.PI;
            return degrees.toString();
        };
        
        this.computeExp = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount > 1) {
                return this.formulaErrorStrings[this.invalid_arguments];
            }
            var argVal = this.getValueFromArg(args[0]);
            if (argVal == "")
                argList = "0";
            var x = this._parseDouble(argVal);
            if (x > 709) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[4].toString();
            }
            return this._computeMath(argList, Math.exp).toString();
        };

        this.computeEven = function (argList) {
            var even = 0;
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount > 1) {
                return this.formulaErrorStrings[this.invalid_arguments];
            }
            var argVal = this.getValueFromArg(args[0]);
            var number = this._parseDouble(argVal);
            if (!isNaN(number)) {
                var sgn = number > 0 ? 1 : (number === 0 || isNaN(number)) ? x : -1;
                number = Math.abs(number);
                number = Math.ceil(number);
                if ((number % 2) == 1) {
                    even = sgn * (number + 1);
                }
                else {
                    even = sgn * number;
                }
            }
            else {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argVal[0] == this.tic || this._isCellReference(args[0])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }

            return even.toString();
        }

        this.computeFact = function (args) {
            var fact = 0;
            var numList = this.splitArgsPreservingQuotedCommas(args);
            if (numList.length > 1) {
                return this.formulaErrorStrings[this.invalid_arguments];
            }
            number = parseInt(this.getValueFromArg(args));
            if (isNaN(number)) {
                return this.getErrorStrings()[1].toString();
            } else if (number < 0) {
                return this.getErrorStrings()[4].toString();
            } else {
                var x = number;
                if (x > 12) {
                    fact = this._factorialTable[12];
                    for (var i = 13; i <= x; i++) {
                        fact *= i;
                    }
                } else {
                    fact = this._factorialTable[x];
                }
            }
            return fact.toString();
        };
        this.computeFactdouble = function (args) {
            var number;
            var fact = 1;
            var numList = this.splitArgsPreservingQuotedCommas(args);
            if (numList.length > 1) {
                return this.formulaErrorStrings[this.invalid_arguments];
            }
            number = parseInt(this.getValueFromArg(args));
            if (isNaN(number)) {
                return this.getErrorStrings()[1].toString();
            } else if (number < 0) {
                return this.getErrorStrings()[4].toString();
            } else {
                var x = number;
                var n = x;
                if (x > 3) {
                    while (n > 0) {
                        fact = fact * n;
                        n = n - 2;
                    }
                } else if (x == 0)
                    fact = 1;
                else
                    fact = x;
            }
            return fact.toString();
        };
        this.computeFloor = function (args) {
            var range = this.splitArgsPreservingQuotedCommas(args);
            var argCount = range.length;
            if (argCount != 2) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var d1 = this._parseDouble(this.getValueFromArg(range[0]));
            var d2 = this._parseDouble(this.getValueFromArg(range[1])), d3 = 0;
            if (!isNaN(d1) && !isNaN(d2)) {
                if (d1 == 0)
                    return d3.toString();
                if (d1 * d2 <= 0 && !(d1 < 0)) {
                    return this.formulaErrorStrings[this._invalid_arguments];
                }

                d3 = Math.ceil(d1 / d2) * d2;
                if (d2 > 0) {
                    while (d3 > d1) {
                        d3 -= d2;
                    }
                } else {
                    while (d3 < d1) {
                        d3 -= d2;
                    }
                }
                if (d2 == 0.1) {
                    d3 = d1;
                }
            }
            return d3.toString();
        };
        this.computeInt = function (range) {
            var args = this.splitArgsPreservingQuotedCommas(range);
            var argCount = args.length;
            if (argCount > 1) {
                return this.formulaErrorStrings[this.invalid_arguments];
            }
            var argVal = this.getValueFromArg(args[0]);
            var x;
           
            x = Math.floor(argVal).toString();
          
            if (!isNaN(x)) {
                return x;
            }
            else {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argVal[0] == this.tic || this._isCellReference(args[0])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
        };
        this.computeLn = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount > 1) {
                return this.formulaErrorStrings[this.invalid_arguments];
            }
            var argVal = this.getValueFromArg(args[0]);
            var x = this._parseDouble(argVal);
            if (x <= 0) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[4].toString();
            }
            if (!isNaN(x)) {
                return (Math.log(x)).toString();
            }
            else {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argVal[0] == this.tic || this._isCellReference(args[0])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
        };
        this.computeLog = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount > 2) {
                return this.formulaErrorStrings[this.invalid_arguments];
            }
            var argVal = this.getValueFromArg(args[0]);
            var x = this._parseDouble(argVal);
            var baseVal = (argCount == 2) ? this.getValueFromArg(args[1]) : "10";
            var b =  this._parseDouble(baseVal);
            if (x <= 0 || b <= 0) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[4].toString();
            }
            if (!isNaN(x) && !isNaN(b)) {
                return ((Math.log(x) / Math.LN10) / (Math.log(b) / Math.LN10)).toString();
            }
            else {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argVal[0] == this.tic || baseVal[0] == this.tic) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
        };
        this.computeLogTen = function (args) {
            var arg = this._splitArguments(args, this.getParseArgumentSeparator().toString());
            var argCount = arg.length;
            if (argCount > 1) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var argVal = this.getValueFromArg(arg[0]);
            var value = this._parseDouble(argVal.split(this.tic).join(""));
            if (isNaN(value)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argVal[0] == this.tic || this._isCellReference(arg[0])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
            if (value <= 0) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[4].toString();
            }
            return (this._computeMath(args, Math.log)/Math.LN10).toString();
        };
        
        this.computePI = function (args) {
            return Math.PI.toString();
        };
        this.computeProduct = function (range) {
            var prod = 1;
            var d;
            var s1;
            var nohits = true;
            this.adjustRangeArg(range);
            var ranges = this.splitArgsPreservingQuotedCommas(range);
            for (var r = 0; r < ranges.length; r++) {
                var adjustRange = ranges[r];

                ////is a cellrange
                if (ranges[r].indexOf(':') > -1) {
                    var cellCollection = this.getCellsFromArgs(adjustRange);
                    for (var s = 0; s < cellCollection.length; s++) {
                        try {
                            s1 = this.getValueFromArg(cellCollection[s]);
                        } catch (ex) {
                            return ex;
                        }

                        if (s1.length > 0) {
                            d = this._parseDouble(s1);
                            if (!isNaN(d)) {
                                prod = prod * d;
                                nohits = false;
                            } else if (this.getErrorStrings().indexOf(s1) > -1) {
                                return s1;
                            }
                            else {
                                if (this._rethrowLibraryComputationExceptions)
                                    throw this.formulaErrorStrings[this._bad_formula];
                                return this.getErrorStrings()[1].toString();
                            }
                        }
                    }
                } else {
                    try {
                        s1 = this.getValueFromArg(ranges[r]);
                    } catch (ex) {
                        return ex;
                    }

                    if (s1.length > 0) {
                        d = this._parseDouble(s1);
                        if (!isNaN(d)) {
                            prod = prod * d;
                            nohits = false;
                        } else if (this.getErrorStrings().indexOf(s1) > -1) {
                            return s1;
                        }
                        else {
                            if (this._rethrowLibraryComputationExceptions)
                                throw this.formulaErrorStrings[this._bad_formula];
                            return (s1 == this.tic || this._isCellReference(ranges[r])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
                        }
                    }
                }
            }
            return nohits ? "0" : prod.toString();
        };
        this.computeSecant = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            argList = this.getValueFromArg(argList);
            var argCount = args.length;
            if (argCount != 1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            if (argList[0] == (this.tic) && argList[length - 1] == (this.tic))
                argList = argList.split(this.tic).join("");
            if (argList == this._string_empty) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.getErrorStrings()[4].toString();
                return this.getErrorStrings()[4].toString();
            }
            var isNumber = this.computeIsNumber(argList);
            if (isNumber == this.trueValueStr) {
                var tempList = argList;
                tempList = tempList.indexOf("u") ? tempList.split("u").join("") : tempList;
                var number = parseFloat(tempList);
                if (number >= 134217728) {
                    if (this._rethrowLibraryComputationExceptions)
                        throw this.getErrorStrings()[4].toString();
                    return this.getErrorStrings()[4].toString();
                }
            } else {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.getErrorStrings()[4].toString();
                return this.getErrorStrings()[5].toString();
            }
            var secVal = this._computeMath(argList, Math.cos);
            if (secVal != "#NUM!" || secVal != "#VALUE!")
                secVal = (1 / parseFloat(secVal)).toString();
            return secVal;
        };
        this.computeSeriessum = function (arg) {
            var args = this.splitArgsPreservingQuotedCommas(arg);
            if (args.length != 4) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var xValue = 0, nValue = 0, mValue = 0, coeff = 0, result = 0;
            var arrayArg;
            if (args[3].indexOf(';') > -1) {
                arrayArg = this._splitArguments(args[3].split(this.tic).join(""), ';');
            } else {
                arrayArg = this.getCellsFromArgs(args[3].split(this.tic).join(""));
            }
            if (args[0] == "" || args[1] == "" || args[2] == "") {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[0].toString();
            }
            xValue = this._parseDouble(this.getValueFromArg(args[0]));
            nValue = this._parseDouble(this.getValueFromArg(args[1]));
            mValue = this._parseDouble(this.getValueFromArg(args[2]));
            if (isNaN(xValue) || isNaN(nValue) || isNaN(mValue)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argVal[0] == this.tic || this._isCellReference(arg[0])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
            arrayArg = this.getCellsFromArgs(args[3].split(this.tic).join(""));
            for (var i = 0; i < arrayArg.length; i++) {
                coeff = this._parseDouble(this.getValueFromArg(arrayArg[i]));
                if (!isNaN(coeff)) {
                    result = result + (coeff * Math.pow(xValue, (nValue + (i * mValue))));
                } else {
                    if (this._rethrowLibraryComputationExceptions)
                        throw this.formulaErrorStrings[this._bad_formula];
                    return this.getErrorStrings()[1].toString();
                }
            }
            if (isNaN(result)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[4].toString();
            }
            return result.toString();
        };
        this.computeSin = function (args) {
            return this._computeMath(args, Math.sin).toString();
        };
        this.computeSinh = function (args) {
            var arg = this._splitArguments(args, this.getParseArgumentSeparator().toString());
            var argCount = arg.length;
            if (argCount > 1) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var argVal = this.getValueFromArg(arg[0]);
            var value = this._parseDouble(argVal.split(this.tic).join(""));
            if (isNaN(value)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argVal[0] == this.tic || this._isCellReference(arg[0])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
           
            var y = Math.exp(value);
            return (y - 1 / y) / 2;
        };
        this.computeSqrt = function (args) {
            var arg = this._splitArguments(args, this.getParseArgumentSeparator().toString());
            var argCount = arg.length;
            if (argCount > 1) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var argVal = this.getValueFromArg(arg[0]);
            var value = parseInt(argVal.split(this.tic).join(""));
            if (isNaN(value)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argVal[0] == this.tic) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
            if (value < 0) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[4].toString();
            }
            return this._computeMath(args, Math.sqrt).toString();
        };
        this.computeSubTotal = function (args) {
            var ignoreSubtotal = false;
            var cellReference = this._string_empty;
            var val;
            var index = 0;
            var arg = this._splitArguments(args, this.getParseArgumentSeparator().toString());
            var argCount = arg.length;
            if (argCount < 2) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            if (this._isCellReference(arg[0])) {
                cellReference = this.getValueFromArg(arg[0]);
            } else {
                cellReference = arg[0].toString();
            }
            val = this._parseDouble(cellReference);
            if (!isNaN(val)) {
                index = parseInt(val.toString());
                if ((index < 1 || index > 11) && (index < 101 || index > 111)) {
                    return this.getErrorStrings()[1].toString();
                }
            }
            else
            {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[5].toString();
            }
            if (ignoreSubtotal)
                return "0";

            cellReference = args.substring((arg[0].toString()).length + 1);
            ignoreSubtotal = true;
            var value = this._string_empty;
            switch (index) {
                case 1:
                case 101:
                    value = this.computeAverage(cellReference);
                    break;
                case 2:
                case 102:
                    value = this.computeCount(cellReference);
                    break;
                case 3:
                case 103:
                    value = this.computeCounta(cellReference);
                    break;
                case 4:
                case 104:
                    value = this.computeMax(cellReference);
                    break;
                case 5:
                case 105:
                    value = this.computeMin(cellReference);
                    break;
                case 6:
                case 106:
                    value = this.computeProduct(cellReference);
                    break;
                case 7:
                case 107:
                    value = this.computeStdev(cellReference);
                    break;
                case 8:
                case 108:
                    value = this.computeStdevp(cellReference);
                    break;
                case 9:
                case 109:
                    value = this.computeSum(cellReference);
                    break;
                case 10:
                case 110:
                    value = this.computeVar(cellReference);
                    break;
                case 11:
                case 111:
                    value = this.ComputeVarp(cellReference);
                    break;
                default:
                    value = this.getErrorStrings()[1].toString();
                    break;
            }
            ignoreSubtotal = false;
            return value;
        };
        this.computeSumif = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 2 && argCount != 3) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var criteriaRange = args[0];
            var criteria = args[1];
            if (criteria.length < 1) {
                return "0";
            }

            var op = this.token_equal;
            if (criteria[0] != this.tic[0] && "=><".indexOf(criteria[0]) == -1) {
                ////cell reference
                criteria = this.getValueFromArg(criteria);
            }

            var offset = (criteria.length > 0 && criteria[0] == this.tic[0]) ? 1 : 0;
            var compare = this.minValue;
            if (criteria.substring(offset)[0] == (">=")) {
                criteria = this._substring(criteria, offset + 2, criteria.length - 2 - 2 * offset);
                op = this.token_greatereq;
            } else if (criteria.substring(offset)[0] == ("<=")) {
                criteria = this._substring(criteria, offset + 2, criteria.length - 2 - 2 * offset);
                op = this.token_lesseq;
            } else if (criteria.substring(offset)[0] == ("<")) {
                criteria = this._substring(criteria, offset + 1, criteria.length - 1 - 2 * offset);
                op = this.token_less;
            } else if (criteria.substring(offset)[0] == (">")) {
                criteria = this._substring(criteria, offset + 1, criteria.length - 1 - 2 * offset);
                op = this.token_greater;
            } else if (criteria.substring(offset)[0] == ("=")) {
                criteria = this._substring(criteria, offset + 1, criteria.length - 1 - 2 * offset);
            }

            criteria = criteria.split(this.tic).join("");
            var numer = this._parseDouble(criteria, compare);

            var sumRange = (argCount == 2) ? criteriaRange : args[2];

            var s1 = this.getCellsFromArgs(criteriaRange);
            var s2 = this.getCellsFromArgs(sumRange);

            var count = s1.length;

            if (count > s2.length) {
                var i = sumRange.indexOf(':');
                if (i > -1) {
                    var startRow = this.rowIndex(this._substring(sumRange, 0, i));
                    var startCol = this.colIndex(this._substring(sumRange, 0, i));
                    var row = this.rowIndex(this._substring(sumRange, i + 1));
                    var col = this.CclIndex(this._substring(sumRange, i + 1));
                    if (startRow != row) {
                        row += count - s2.length;
                    } else if (startCol != col) {
                        col += count - s2.length;
                    }

                    sumRange = this._substring(sumRange, 0, i + 1) + RangeInfo.getAlphaLabel(col) + row.toString();
                    s2 = this.getCellsFromArgs(sumRange);
                }
            }

            var sum = 0;

            var d;
            var s;
            switch (op) {
                case this.token_equal:
                    {
                        for (var index = 0; index < count; ++index) {
                            s = this.getValueFromArg(s1[index]); //// +criteria;

                            if (s.split(this.tic).join("") == criteria) {
                                s = s2[index];
                                s = this.getValueFromArg(s);
                                d = this._parseDouble((s.split(this.tic).join("")).split("$").join(""));
                                if (!isNaN(d)) {
                                    sum += d;
                                }
                            }
                        }
                    }

                    break;
                case this.token_greatereq:
                    {
                        for (var index = 0; index < count; ++index) {
                            s = this.getValueFromArg(s1[index]); //// +criteria;
                            d = this._parseDouble((s.split(this.tic).join("")).split("$").join(""));
                            if (!isNaN(d)) {
                                if (d >= compare) {
                                    s = s2[index];
                                    s = this.getValueFromArg(s);
                                    d = this._parseDouble(s);
                                    if (!isNaN(d)) {
                                        sum += d;
                                    }
                                }
                            }
                        }
                    }

                    break;
                case this.token_greater:
                    {
                        for (var index = 0; index < count; ++index) {
                            s = this.getValueFromArg(s1[index]); //// +criteria;
                            d = this._parseDouble((s.split(this.tic).join("")).split("$").join(""));
                            if (!isNaN(d)) {
                                if (d > compare) {
                                    s = s2[index];
                                    s = this.getValueFromArg(s);
                                    d = this._parseDouble(s);
                                    if (!isNaN(d)) {
                                        sum += d;
                                    }
                                }
                            }
                        }
                    }

                    break;
                case this.token_less:
                    {
                        for (var index = 0; index < count; ++index) {
                            s = this.getValueFromArg(s1[index]); //// +criteria;
                            d = this._parseDouble((s.split(this.tic).join("")).split("$").join(""));
                            if (!isNaN(d)) {
                                if (d < compare) {
                                    s = s2[index];
                                    s = this.getValueFromArg(s);
                                    d = this._parseDouble(s);
                                    if (!isNaN(d)) {
                                        sum += d;
                                    }
                                }
                            }
                        }
                    }

                    break;
                case this.token_lesseq:
                    {
                        for (var index = 0; index < count; ++index) {
                            s = this.getValueFromArg(s1[index]); //// +criteria;
                            d = this._parseDouble((s.split(this.tic).join("")).split("$").join(""));
                            if (!isNaN(d)) {
                                if (d <= compare) {
                                    s = s2[index];
                                    s = this.getValueFromArg(s);
                                    d = this._parseDouble(s);
                                    if (!isNaN(d)) {
                                        sum += d;
                                    }
                                }
                            }
                        }
                    }

                    break;
                default:
                    break;
            }
            return sum.toString();
        };
        this.computeTan = function (args) {
            return this._computeMath(args, Math.tan).toString();
        };
        this.computeTrunc = function (range) {
            var args = this.splitArgsPreservingQuotedCommas(range);
            var argCount = args.length;
            var digits = 0;

            if (argCount == 2) {
                ////ignore return value...
                digits = this._parseDouble(this.getValueFromArg(args[1]));
            }
            var argVal = this.getValueFromArg(args[0]);
            var value = this._parseDouble(argVal.split(this.tic).join(""));
            if (isNaN(value)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argVal[0] == this.tic || this._isCellReference(args[0])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
            var normalizer = Math.pow(10, digits);
            var d1 = (value < 0) ? -1 : 1;
            return (d1 * Math.floor(normalizer * Math.abs(value)) / normalizer).toString();
        };
        this.computeLognormOdist = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 4) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var x;
            var u;
            var s;
            var dist = 0;

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]).split(this.trueValueStr).join(this._string_empty);
            }
            x = this._parseDouble(args[0]);
            u = this._parseDouble(args[1]);
            s = this._parseDouble(args[2]);
            if (!isNaN(x) && !isNaN(u) && !isNaN(s)) {
                if (x <= 0 || s <= 0) {
                    if (this._rethrowLibraryComputationExceptions) {
                        throw "#Num! Passsed value is incorrect";
                    }
                    return this.getErrorStrings()[4].toString();
                }
                if (args[3] == this.falseValueStr) {
                    var mean = 0;
                    var std = 0;

                    // mean = Math.Exp(u+Math.Pow(u,2))
                    dist = (Math.exp(-(Math.pow((Math.log(x) - u), 2) / (2 * Math.pow(s, 2))))); //this.normaldist(Math.Log(x), u, s);
                    dist = dist / (x * s * Math.sqrt(2 * Math.PI));
                } else {
                    dist = this._standardNormalCumulativeDistribution((Math.log(x) - u) / s);
                }
            } else {
                if (this._rethrowLibraryComputationExceptions) {
                    throw "#Value! Passsed value is non - numeric";
                }
                return this.getErrorStrings()[1].toString();
            }
            return dist.toString();
        };
        this.computeLognormOinv = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 3) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var p;
            var u;
            var s;
            var dist = 0;

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]);
            }
            p = this._parseDouble(args[0]);
            u = this._parseDouble(args[1]);
            s = this._parseDouble(args[2]);
            if (!isNaN(p) && !isNaN(u) && !isNaN(s)) {
                dist = Math.exp(this._normalinv(p, u, s));
            }
            return dist.toString();
        };
        this.computeNormOinv = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 3) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var p;
            var u;
            var s;
            var invdist = 0;

            for (var i = 0; i < argCount; ++i)
                args[i] = this.getValueFromArg(args[i]).split(this.tic).join(this._string_empty);

            p = this._parseDouble(args[0]);
            u = this._parseDouble(args[1]);
            s = this._parseDouble(args[2]);
            if (!isNaN(p) && !isNaN(u) && !isNaN(s)) {
                if (p >= 0 && p <= 0 || s <= 0) {
                    if (this._rethrowLibraryComputationExceptions) {
                        throw this.formulaErrorStrings[this._wrong_number_arguments] + this.getErrorStrings()[4].toString();
                    }
                    return this.getErrorStrings()[4].toString();
                }
                invdist = this._normalCumulativeDistributionFunctionInverse(p, u, s); //this.normalinv(p, u, s);
            }

            if (invdist <= 0) {
                return this.formulaErrorStrings[this._iterations_dont_converge];
            }
            return invdist.toString();
        };
        this.computeNormOdist = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 4) {
                if (this._rethrowLibraryComputationExceptions) {
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                }
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var x;
            var u;
            var s;
            var cum = 0;
            var dist = 0;

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]);
            }
            x = this._parseDouble(args[0]);
            u = this._parseDouble(args[1]);
            s = this._parseDouble(args[2]);
            if (!isNaN(x) && !isNaN(u) && !isNaN(s)) {
                if (argCount != 3) {
                    cum = (args[3] == this.trueValueStr) ? 1 : 0;
                    var check = 0;
                    check = this._parseDouble(args[3]);
                    if (!isNaN(check))
                        cum = 1;
                }

                if (cum == 0) {
                    dist = this._normalProbabilityDensity(x, u, s);
                } else {
                    dist = this._normaldist(x, u, s);
                }
            }
            return dist.toString();
        };
        this.computeNormOsODist = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1 && argCount != 2) {
                if (this._rethrowLibraryComputationExceptions) {
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                }
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var x;
            var cum = 0;
            var dist = 0;

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]).split(this.tic).join(this._string_empty);
            }
            x = this._parseDouble(args[0]);
            if (!isNaN(x)) {
                if (argCount == 2) {
                    cum = (args[1] == this.trueValueStr) ? 1 : 0;
                    var check = 0;
                    check = this._parseDouble(args[1]);
                    if (!isNaN(check))
                        cum = 1;
                }

                if (cum == 0) {
                    dist = this._standardNormalProbabilityDensityFunction(x);
                } else {
                    dist = this._standardNormalCumulativeDistributionFunction(x);
                }
            } else {
                if (this._rethrowLibraryComputationExceptions) {
                    throw "#VALUE! Passed argument value is non numeric";
                }
                return this.getErrorStrings()[1].toString();
            }
            return dist.toString();
        };
        this.computeNormOsOInv = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                if (this._rethrowLibraryComputationExceptions) {
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                }
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var x;
            var dist = 0;

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]).split(this.tic).join(this._string_empty);
            }
            x = this._parseDouble(args[0]);
            if (!isNaN(x)) {
                if (x <= 0 || x >= 1) {
                    if (this._rethrowLibraryComputationExceptions) {
                        throw "#NUM! Passed argument value doesnot match with in range level";
                    }
                    return this.getErrorStrings()[4].toString();
                }
                dist = this._standardNormalCumulativeDistributionFunctionInverse(x);
            } else {
                if (this._rethrowLibraryComputationExceptions) {
                    throw "#VALUE! Passed argument value is non numeric";
                }
                return this.getErrorStrings()[1].toString();
            }
            return dist.toString();
        };
        this.computePermut = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 2) {
                return this.formulaErrorStrings[this.requires_2_args];
            }

            ////N things taken k at the time.
            var nd;
            var kd;
            var combin = 0;
            nd = this._parseDouble(this.getValueFromArg(args[0]));
            kd = this._parseDouble(this.getValueFromArg(args[1]));
            if (!isNaN(nd) && !isNaN(kd)) {
                var k = (kd + 0.1);
                var n = (nd + 0.1);

                var top = 1;
                for (var i = (n - k) + 1; i <= n; ++i) {
                    top = top * i;
                }

                combin = top;
            } else {
                return this.formulaErrorStrings[this._invalid_arguments];
            }
            return combin.toString();
        };
        this.computePermutationA = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 2) {
                return this.formulaErrorStrings[this.requires_2_args];
            }

            var nd;
            var kd;
            var combin = 0;
            nd = this._parseDouble(args[0]);
            kd = this._parseDouble(args[1]);
            if (!isNaN(nd) && !isNaN(kd)) {
                var k = (kd + 0.1);
                var n = (nd + 0.1);
            } else {
                return this.formulaErrorStrings[this._invalid_arguments];
            }
            return Math.pow(nd, kd).toString();
        };
        this.computeStandardize = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 3) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var x;
            var u;
            var sd = 0;
            var dist = 0;

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]);
            }
            x = this._parseDouble(args[0]);
            u = this._parseDouble(args[1]);
            sd = this._parseDouble(args[2]);
            if (!isNaN(x) && !isNaN(u) && !isNaN(sd)) {
                dist = (x - u) / sd;
            }
            return dist.toString();
        };
        this.computeBinomOdist = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 4) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var successes;
            var trials;
            var p;
            var cum = 0;
            var dist = 0;

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]).split(this.tic).join(this._string_empty);
            }
            successes = this._parseDouble(args[0]);
            trials = this._parseDouble(args[1]);
            p = this._parseDouble(args[2]);
            if (!isNaN(successes) && !isNaN(trials) && !isNaN(p)) {
                if (successes < 0 || successes > trials || p < 0 || p > 1) {
                    if (this._rethrowLibraryComputationExceptions) {
                        throw "#NAME! Passed argument value is not equal to minimum par value";
                    }
                    return this.getErrorStrings()[4].toString();
                }
                cum = (args[3] == this.trueValueStr) ? 1 : 0;
                if (cum == 0) {
                    dist = this._comb(successes, trials) * Math.pow(p, successes) * Math.pow(1 - p, trials - successes);
                } else {
                    dist = this._binomdist(trials, successes, p);
                }
            } else {
                if (this._rethrowLibraryComputationExceptions) {
                    throw "#VALUE! Passed value is nonnumeric";
                }
                return this.getErrorStrings()[1].toString();
            }
            return dist.toString();
        };
        this.computeChisqOinvOrt = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 2) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var p;
            var v;
            var dist = 0;

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]);
            }
            p = this._parseDouble(args[0]);
            v = this._parseDouble(args[1]);
            if (!isNaN(p) && !isNaN(v)) {
                dist = this._chiinv(p, v);
            }
            return dist.toString();
        };
        this.computeChisqOdistOrt = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 2) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var x;
            var v;
            var dist = 0;

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]);
            }
            x = this._parseDouble(args[0]);
            v = this._parseDouble(args[1]);
            if (!isNaN(x) && !isNaN(v)) {
                if (v == 1 && this._excelLikeComputations) {
                    //continue;
                } else if (v < 1) {
                    if (this._excelLikeComputations)
                        return "#NUM!";
                    return this.formulaErrorStrings[this._invalid_arguments];
                }

                dist = 1 - this._chidist(x, v);
                for (var i = 0; i < dist.toString().length; i++) {
                }
                var ss = Math.round(dist);
            }
            return dist.toString();
        };
        this.computeFOdist = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 4) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var x;
            var df1 = 0;
            var df2 = 0;
            var dist = 0;

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]).split(this.tic).join(this._string_empty);
            }
            x = this._parseDouble(args[0]);
            df1 = this._parseDouble(args[1]);
            df2 = this._parseDouble(args[2]);
            if (!isNaN(x) && !isNaN(df1) && !isNaN(df2)) {
                if (df1 < 1 || df2 < 1 || (x[0] == ("-"))) {
                    if (this._rethrowLibraryComputationExceptions) {
                        throw "#NUM! Passed argument value is incorrect";
                    }
                    return this.getErrorStrings()[4].toString();
                }

                if (args[3] == this.trueValueStr) {
                    dist = this._fCumulativeDensity(x, df1, df2);
                } else if (args[3] == this.falseValueStr) {
                    dist = this._fProbabilityDensity(x, df1, df2);
                }
            } else {
                if (this._rethrowLibraryComputationExceptions) {
                    throw "#VALUE! Passed argument value is incorrect";
                }
                return this.getErrorStrings()[1].toString();
            }
            return dist.toString();
        };
        this.computeGammaln = function (argList) {
            var x = 0;
            x = this._parseDouble(argList);
            if (!isNaN(x) && x > 0) {
                x = this._gammaln(x);
            } else {
                return this.formulaErrorStrings[this._invalid_arguments];
            }
            return x.toString();
        };
        this.computeConfidenceOnorm = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 3) {
                if (this._rethrowLibraryComputationExceptions) {
                    throw "Wrong number of arguments";
                }
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var alpha;
            var s;
            var sz;
            var val = 0;

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]).split(this.tic).join(this._string_empty);
            }

            alpha = this._parseDouble(args[0]);
            s = this._parseDouble(args[1]);
            sz = this._parseDouble(args[2]);
            if (!isNaN(alpha) && !isNaN(s) && !isNaN(sz)) {
                if (alpha <= 0 || alpha >= 1 || s <= 0 || sz < 1) {
                    if (this._rethrowLibraryComputationExceptions) {
                        throw "Passed argument value is different from minimum par";
                    }
                    return this.getErrorStrings()[4].toString();
                }

                //// 1 - alpha  would be from -inf to 1-alpha. adding alpha + 2
                //// takes away the left tail making the integral from alpha-1 to 1-alpha.
                if (this._excelLikeComputations)
                    val = this._normalinv(1 - alpha + alpha / 2, 0, 1);
                else
                    val = this._newnormalinv(1 - alpha + alpha / 2);
                val = val * s / Math.sqrt(sz);
            }

            return val.toString();
        };
        this.computeExponOdist = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 3) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var x;
            var lambda;
            var cum = 0;
            var dist = 0;

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]);
            }
            x = this._parseDouble(args[0]);
            lambda = this._parseDouble(args[1]);
            if (!isNaN(x) && !isNaN(lambda)) {
                if (x < 0 || lambda <= 0) {
                    if (this._rethrowLibraryComputationExceptions)
                        throw "Passed argument value is below or equal to 0";
                    return this.getErrorStrings()[4].toString();
                }
                cum = (args[2] == this.trueValueStr) ? 1 : 0;
                var check = this._parseDouble(args[2]);
                if (!isNaN(check))
                    cum = 0;
                if (cum == 0) {
                    dist = lambda * Math.exp(-lambda * x);
                } else {
                    dist = 1 - Math.exp(-lambda * x);
                }
            } else {
                if (this._rethrowLibraryComputationExceptions)
                    throw "Passed argument value is non-numerical";
                return this.getErrorStrings()[1].toString();
            }
            return dist.toString();
        };
        this.computeFisher = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var x;
            var z = 0;

            var s = this.getValueFromArg(args[0]);

            x = this._parseDouble(s);
            if (!isNaN(x) && (x > -1 && x < 1)) {
                z = 0.5 * Math.log((1 + x) / (1 - x));
            }
            return z.toString();
        };
        this.computeFisherInv = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var y;
            var x = 0;

            var s = this.getValueFromArg(args[0]);

            y = this._parseDouble(s);
            if (!isNaN(y)) {
                var d = Math.exp(2 * y);
                x = (d - 1) / (d + 1);
            }
            return x.toString();
        };
        this.computeGammalnOPrecise = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (args[0] == this.tic + this.tic) {
                if (this._rethrowLibraryComputationExceptions)
                    throw "Passed Argument is empty";
                return this.getErrorStrings()[1].toString();
            }

            if (argCount != 1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var x = 0;
            x = this._parseDouble(args.toString());
            if (!isNaN(x) && x > 0)
                x = this._gammaln(x);
            else {
                if (x <= 0) {
                    if (this._rethrowLibraryComputationExceptions)
                        throw "Passed Argument value is less than or equal to minimum value 0";
                    return this.getErrorStrings()[4].toString();
                }
                if (this._rethrowLibraryComputationExceptions)
                    throw "Passed Argument is non numerical";
                return this.getErrorStrings()[1].toString();
            }
            return x.toString();
        };
        
        this.computeLarge = function (range) {
            var args = this.splitArgsPreservingQuotedCommas(range);
            var argCount = args.length;
            if (argCount != 2) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var x0;
            var s1 = this.getValueFromArg(args[1]);
            x0 = this._parseDouble(s1);
            if (isNaN(x0)) {
                return this.formulaErrorStrings[this._invalid_arguments];
            }

            var k = x0;
            var dd = this._getDoubleArray(args[0]);
            var n = dd.length;
            if (k < 1 || k > n) {
                return this.formulaErrorStrings[this._invalid_arguments];
            }

            dd.sort(function (a, b) {
                if (isNaN(a) || isNaN(b)) {
                    if (a > b) return 1;
                    else return -1;
                }
                return a - b;
            });
            return dd[n - k].toString();
        };
        this.computeSmall = function (range) {
            var args = this.splitArgsPreservingQuotedCommas(range);
            var argCount = args.length;
            if (argCount != 2) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var s1 = this.getValueFromArg(args[1]);
            var x0 = this._parseDouble(s1);
            if (isNaN(x0)) {
                return this.formulaErrorStrings[this._invalid_arguments];
            }

            var k = x0;
            var dd = this._getDoubleArray(args[0]);
            var n = dd.length;
            if (k < 1 || k > dd.length) {
                return this.formulaErrorStrings[this._invalid_arguments];
            }
           
            dd.sort(function (a, b) {
                if (isNaN(a) || isNaN(b)) {
                    if (a < b) return 1;
                    else return -1;
                }
                return b - a;
            });
            return dd[n-k].toString();
        };
        this.computeCounta = function (range) {
            var count = 0;
            var s1;
            var ranges = this.splitArgsPreservingQuotedCommas(range);
            var argsRange;

            if (this._isTextEmpty(range)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this.invalid_arguments];
                else
                    return this.formulaErrorStrings[this.invalid_arguments];
            }
            for (var r = 0; r < ranges.length; r++) {
                argsRange = ranges[r];

                ////is a cellrange
                if (argsRange.indexOf(':') > -1) {
                    var cellCollection = this.getCellsFromArgs(argsRange);
                    for (var s = 0; s < cellCollection.length; s++) {
                        try {
                            s1 = this.getValueFromArg(cellCollection[s]).split(this.tic).join(this._string_empty);
                        } catch (ex) {
                            if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                                throw this.getLibraryComputationException();
                            }

                            return ex;
                        }

                        if (s1.length > 0) {
                            count++;
                        }
                    }
                } else if (argsRange == "") {
                    count++;
                } else if (this._isLetter(argsRange[0])) {
                    s1 = this.getValueFromArg(argsRange);
                    if (s1.length > 0) {
                        count++;
                    }
                } else {
                    if (argsRange.indexOf(this.getParseArgumentSeparator()) > -1) {
                        var array = this.splitArgsPreservingQuotedCommas(argsRange.split(this.tic).join(""));
                        for (var str = 0; str < array.length; str++) {
                            if (str[0] != this.tic && this._isCellReference(array[str])) {
                                if (this._rethrowLibraryComputationExceptions)
                                    throw this.formulaErrorStrings[this.invalid_arguments];
                                else
                                    return this.formulaErrorStrings[this.invalid_arguments];
                            }
                            if (str.length > 0 || str == "") {
                                count++;
                            }
                        }
                    }
                    else if (r.length > 0) {
                        count++;
                    }
                }
            }
            return count.toString();
        };
        this.computeAverage = function (range) {
            var sum = 0, count = 0, d, s1, adjustRange = [];
            var ranges = this.splitArgsPreservingQuotedCommas(range);
            if (ranges.length < 1) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this.invalid_arguments];
                else
                    return this.formulaErrorStrings[this.invalid_arguments];
            }
            for (var r = 0; r < ranges.length; r++) {
                adjustRange = ranges[r];
                if (adjustRange.indexOf(':') > -1) {
                    var cellCollection = this.getCellsFromArgs(adjustRange);
                    for (var s = 0; s < cellCollection.length; s++) {
                        try {
                            s1 = this.getValueFromArg(cellCollection[s]).split(this.tic).join("");
                        } catch (ex) {
                            if (this._rethrowLibraryComputationExceptions)
                                throw this.getErrorStrings()[4].toString();
                            else
                                return this.getErrorStrings()[4].toString();
                        }

                        if (s1.length > 0) {
                            if(!isNaN(s1)){
                                d = this._parseDouble(s1);
                                if (!isNaN(d)) {
                                    sum = Number(sum) + Number(d);
                                    count++;
                                } else if (this.getErrorStrings().indexOf(s1) == -1) {
                                    return s1;
                                } else {
                                    if (this._rethrowLibraryComputationExceptions)
                                        throw this.getErrorStrings()[5].toString();
                                    else
                                        return this.getErrorStrings()[5].toString();
                                }
                            }
                        }
                    }
                } else {
                    try {
                        s1 = this.getValueFromArg(adjustRange).split(this.tic).join(this._string_empty);
                        var s2 = this.getValueFromArg(adjustRange);
                    } catch (ex) {
                        if (this._rethrowLibraryComputationExceptions)
                            throw this.getErrorStrings()[4].toString();
                        else
                            return this.getErrorStrings()[4].toString();
                    }

                    if (s1.length > 0) {
                        d = this._parseDouble(s1);
                        if (!isNaN(d)) {
                            sum = Number(sum) + Number(d);
                            count++;
                        } 
                        else if (s2[0] == (this.tic)) {
                            if (this._rethrowLibraryComputationExceptions)
                                throw this.getErrorStrings()[1].toString();
                            else
                                return this.getErrorStrings()[1].toString();
                        } else {
                            if (this._rethrowLibraryComputationExceptions)
                                throw this.getErrorStrings()[5].toString();
                            else
                                return this.getErrorStrings()[5].toString();
                        }
                    }
                }
            }

            if (count > 0) {
                sum = Number(sum) / Number(count);
            }
            return sum.toString();
        };
        this.computeAverageA = function (range) {
            var ranges = this.splitArgsPreservingQuotedCommas(range);
            var newargs = this._string_empty;
            var d = 0;
            if (ranges == this.trueValueStr || ranges == this.falseValueStr) {
                var boolvalue = (ranges == this.trueValueStr);
                if (boolvalue)
                    return +boolvalue;
                else
                    return +boolvalue;
            }

            for (var i = 0; i < ranges.length; i++) {
                if (ranges[i].indexOf(this.getParseArgumentSeparator().toString()) > -1) {
                    var temp = this.splitArgsPreservingQuotedCommas(ranges[i].split(this.tic).join(this._string_empty));
                    var j = 0;
                    for (var item = 0; item < temp.length; item++) {
                        var adjustRange = temp[item];
                        newargs = newargs + adjustRange + this.getParseArgumentSeparator().toString();
                        ranges[j] = adjustRange;
                    }
                } else if (this._isCellReference(ranges[i]))
                    newargs += ranges[i] + this.getParseArgumentSeparator().toString();
                else if (!this._parseDouble(ranges[i], d))
                    newargs = newargs + "0" + this.getParseArgumentSeparator().toString();
                else
                    newargs = newargs + ranges[i] + this.getParseArgumentSeparator().toString();
            }

            // if (newargs.endsWith(this.getParseArgumentSeparator().toString()))
            if (newargs[newargs.length - 1] == (","))
                newargs = newargs.substring(0, newargs.length - 1);

            var sum = this.computeAverage(newargs);
            return sum;
        };
        this.computeMax = function (range) {
            var max = this.minValue;
            var d;
            var s1;
            var argslist;
            this.adjustRangeArg(range);
            var ranges = this.splitArgsPreservingQuotedCommas(range);
            for (var r = 0; r < ranges.length; r++) {
                argslist = ranges[r];

                ////cell range
                if (argslist.indexOf(':') > -1) {
                    var cellCollection = this.getCellsFromArgs(argslist);
                    for (var s = 0; s < cellCollection.length; s++) {
                        try {
                            s1 = this.getValueFromArg(cellCollection[s]).split(this.tic).join(this._string_empty);
                        } catch (ex) {
                            if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                                throw this.getLibraryComputationException();
                            }

                            return ex;
                        }

                        if (s1.length > 0) {
                            d = this._parseDouble(s1);
                            if (!isNaN(d)) {
                                max = Math.max(max, d);
                            } else if (this.getErrorStrings().indexOf(s1)) {
                                return max;
                            }
                        }
                    }
                } else {
                    try {
                        s1 = (argslist == this._string_empty) ? "0" : this.getValueFromArg(argslist);
                    } catch (ex) {
                        if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                            throw this.getLibraryComputationException();
                        }

                        return ex;
                    }

                    if (s1.length > 0) {
                        d = this._parseDouble(s1);
                        if (!isNaN(d)) {
                            max = Math.max(max, d);
                        } else if (this.getErrorStrings().indexOf(s1)) {
                            return s1;
                        }
                    }
                }
            }
            if (max != this.minValue) {
                return max.toString();
            }

            return this._string_empty;
        };
        this.computeMaxa = function (range) {
            var max = this.minValue;
            var d;
            var s1;

            this.adjustRangeArg(range);
            var ranges = this.splitArgsPreservingQuotedCommas(range);
            for (var r = 0; r < ranges.length; r++) {
                ////cell range
                if (ranges[r].indexOf(':') > -1) {
                    var cell = this.getCellsFromArgs(ranges[r]);
                    for (var s = 0; s < cell.length; s++) {
                        try {
                            s1 = this.getValueFromArg(cell[s]);
                        } catch (ex) {
                            if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                                throw this.getLibraryComputationException();
                                return ex;
                            }
                        }

                        ////ignore if empty
                        if (s1.length > 0) {
                            d = 0;
                            if (s1.toUpperCase() == (this.trueValueStr)) {
                                d = 1;
                            } else if (this.getErrorStrings().indexOf(s1) > -1) {
                                return s1;
                            } else {
                                d = this._parseDouble(s1);
                            }

                            max = Math.max(max, d);
                        }
                    }
                } else {
                    try {
                        s1 = this.getValueFromArg(ranges[r]);
                    } catch (ex) {
                        if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                            throw this.getLibraryComputationException();
                            return ex;
                        }
                    }

                    if (s1.length > 0) {
                        d = 0;
                        if (s1.toUpperCase() == (this.trueValueStr)) {
                            d = 1;
                        } else if (this.getErrorStrings().indexOf(s1) == -1) {
                            return s1;
                        } else {
                            d = this._parseDouble(s1);
                        }

                        max = Math.max(max, d);
                    }
                }
            }
            if (max != this.minValue) {
                return max.toString();
            }

            return this._string_empty;
        };
        this.computeMedian = function (range) {
            var dd = this._getDoubleArray(range);
            dd.sort(function (a, b) {
                if (isNaN(a) || isNaN(b)) {
                    if (a > b) return 1;
                    else return -1;
                }
                return a - b;
            });
            var n = parseInt((dd.length / 2).toString());
            var s1 = "";
            if (dd.length % 2 == 1) {
                s1 = dd[n].toString();
            } else {
                s1 = ((dd[n] + dd[n - 1]) / 2).toString();
            }
            return s1;
        };
        this.computeMin = function (range) {
            var min = this.maxValue;
            var d;
            var s1;

            this.adjustRangeArg(range);
            var ranges = this.splitArgsPreservingQuotedCommas(range);
            var rang = range.split(';');
            if (rang.length > 1) {
                for (var r = 0; r < rang.length; r++) {
                    var valRange = this.splitArgsPreservingQuotedCommas(rang[r]);
                    for (var s = 0; s < valRange.length; s++) {
                        var tempval = this.getValueFromArg(valRange[s]);
                        if (tempval.length > 0) {
                            d = this._parseDouble(tempval);
                            if (!isNaN(d)) {
                                min = Math.min(min, d);
                            } else if (this.getErrorStrings().indexOf(tempval) == -1) {
                                return tempval;
                            }
                        }
                    }
                }
                if (min != this.maxValue) {
                    return min.toString();
                }
            }
            for (var r = 0; r < ranges.length; r++) {
                ////cell range
                if (ranges[r].indexOf(':') > -1) {
                    var cell = this.getCellsFromArgs(ranges[r]);
                    for (var s = 0; s < cell.length; s++) {
                        try {
                            s1 = this.getValueFromArg(cell[s]);
                        } catch (ex) {
                            if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                                throw this.getLibraryComputationException();
                            }

                            return ex;
                        }

                        if (s1.length > 0) {
                            d = this._parseDouble(s1);
                            if (!isNaN(d)) {
                                min = Math.min(min, d);
                            } else if (this.getErrorStrings().indexOf(s1) == -1) {
                                return min;
                            }
                        }
                    }
                } else {
                    try {
                        s1 = (ranges[r] == this._string_empty) ? "0" : this.getValueFromArg(ranges[r]);
                    } catch (ex) {
                        if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                            throw this.getLibraryComputationException();
                        }

                        return ex;
                    }

                    if (s1.length > 0) {
                        d = this._parseDouble(s1);
                        if (!isNaN(d)) {
                            min = Math.min(min, d);
                        } else if (this.getErrorStrings().indexOf(s1) == -1) {
                            return s1;
                        }
                    }
                }
            }
            if (min != this.maxValue) {
                return min.toString();
            }

            return this._string_empty;
        };
        this.computeMina = function (range) {
            var min = this.maxValue;
            var d;
            var s1;

            this.adjustRangeArg(range);
            var ranges = this.splitArgsPreservingQuotedCommas(range);
            var rang = range.split(';');
            if (rang.length > 1) {
                for (var r = 0; r < rang.length; r++) {
                    var valRange = this.splitArgsPreservingQuotedCommas(rang[r]);
                    for (var s = 0; s < valRange.length; s++) {
                        var tempval = this.getValueFromArg(valRange[s]);
                        if (tempval.length > 0) {
                            d = 0;
                            if (tempval.toUpperCase() == (this.trueValueStr)) {
                                d = 1;
                            } else if (this.getErrorStrings().indexOf(tempval) == -1) {
                                return tempval;
                            } else {
                                d = this._parseDouble(tempval);
                            }

                            min = Math.min(min, d);
                        }
                    }
                }
                if (min != this.maxValue) {
                    return min.toString();
                }
            }
            for (var r = 0; r < ranges.length; r++) {
                ////cell range
                if (ranges[r].indexOf(':') > -1) {
                    var cell = this.getCellsFromArgs(ranges[r]);
                    for (var s = 0; s < cell.length; s++) {
                        try {
                            s1 = this.getValueFromArg(cell[s]);
                        } catch (ex) {
                            if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                                throw this.getLibraryComputationException();
                            }

                            return ex;
                        }

                        if (s1.length > 0) {
                            d = 0;
                            if (s1.toUpperCase() == (this.trueValueStr)) {
                                d = 1;
                            } else if (s1.toUpperCase() == (this.falseValueStr)) {
                                d = 0
                            } else if (this.getErrorStrings().indexOf(s1) != -1) {
                                return s1;
                            } else {
                                d = this._parseDouble(s1);
                            }

                            min = Math.min(min, d);
                        }
                    }
                } else {
                    try {
                        s1 = this.getValueFromArg(ranges[r]);
                    } catch (ex) {
                        if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                            throw this.getLibraryComputationException();
                        }

                        return ex;
                    }

                    if (s1.length > 0) {
                        d = 0;
                        if (s1.toUpperCase() == (this.trueValueStr)) {
                            d = 1;
                        } else if (this.getErrorStrings().indexOf(s1) == -1) {
                            return s1;
                        } else {
                            d = this._parseDouble(s1);
                        }

                        min = Math.min(min, d);
                    }
                }
            }
            if (min != this.maxValue) {
                return min.toString();
            }

            return this._string_empty;
        };
       
        this.computePercentrankInc = function (range) {
            var args = this.splitArgsPreservingQuotedCommas(range);
            var argCount = args.length;
            if (argCount != 2 && argCount != 3) {
                if (this._rethrowLibraryComputationExceptions) {
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                }
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var x;
            var signif = 3;
            var s1 = this.getValueFromArg(args[1]);
            x = this._parseDouble(s1);
            if (isNaN(x)) {
                if (this._rethrowLibraryComputationExceptions) {
                    throw this.formulaErrorStrings[this._invalid_arguments];
                }
                return this.formulaErrorStrings[this._invalid_arguments];
            } else if (x == 0) {
            }

            if (argCount == 3) {
                s1 = this.getValueFromArg(args[2]);
                signif = this._parseDouble(s1);
                if (isNaN(signif) && signif < 1) {
                    if (this._rethrowLibraryComputationExceptions) {
                        throw this.formulaErrorStrings[this._invalid_arguments];
                    }
                    return this.formulaErrorStrings[this._invalid_arguments];
                }
            }
            var dd = this._getDoubleArray(args[0]);
            var n = dd.length;

            dd.sort();

            var d = 1;
            for (var i = 0; i < n; ++i) {
                if (dd[i] == x) {
                    var k = 0;
                    while (k + i < n && dd[k + i] == x) {
                        k++;
                    }

                    d = ((i - 1)) / (i + n - i - k - 1);

                    if (i > 0 && dd[i - 1] < x) {
                        var di = (i) / (n - 1);
                        d = di + (d - di) * (1 - (x - dd[i - 1]) / (dd[i] - dd[i - 1]));
                    }

                    break;
                }
            }
            var fmt = "0." + ('#', parseInt(signif.toString()));
            return d.toString();
        };
        
        this.computeRankOEq = function (range) {
            var args = this.splitArgsPreservingQuotedCommas(range);
            var argCount = args.length;
            if (argCount != 2 && argCount != 3) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var rank = 0;
            var x;
            var s1 = this.getValueFromArg(args[0]);
            if (args[0] == this._string_empty || args[1] == this._string_empty || !(this._isCellReference(args[1])))
                return this.getErrorStrings()[4].toString();
            x = this._parseDouble(s1);
            if (!isNaN(x)) {
                var order = 0;
                if (argCount == 3) {
                    s1 = this.getValueFromArg(args[2]);
                    if (s1 == this._string_empty)
                        s1 = "0";
                    else if (this._parseDouble(s1) > 1)
                        s1 = "1";
                    order = this._parseDouble(s1);
                }

                var r = args[1];

                var d = 0;
                var eq = false;
                if (r.indexOf(":") == -1)
                    return this.getErrorStrings()[4].toString();
                if (r.indexOf(':') > -1) {
                    var cells1 = this.getCellsFromArgs(r);
                    for (var s = 0; s < cells1.length; s++) {
                        try {
                            s1 = this._getDoubleArray(cells1[s]);
                        } catch (ex) {
                            if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                                throw this.getLibraryComputationException();
                            }

                            return ex;
                        }
                        d = this._parseDouble(s1.toString());
                        if (!isNaN(d)) {
                            if (order == 1) {
                                if (d < x) {
                                    rank += 1;
                                } else if (d == x) {
                                    eq = true;
                                }
                            } else {
                                if (d > x) {
                                    rank += 1;
                                } else if (d == x) {
                                    eq = true;
                                }
                            }
                        }
                    }

                    if (eq) {
                        rank += 1;
                    }
                }
            }
            return rank.toString();
        };
        this.computePercentile = function (range) {
            var args = this.splitArgsPreservingQuotedCommas(range);
            var argCount = args.length;
            if (argCount != 2) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var k;
            var s1 = this.getValueFromArg(args[1]);
            k = this._parseDouble(s1);
            if (isNaN(k) && (k < 0 || k > 1)) {
                return this.formulaErrorStrings[this._invalid_arguments];
            }

            var dd = this._getDoubleArray(args[0]);
            var n = dd.length;

            dd.sort(function (a, b) {
                if (isNaN(a) || isNaN(b)) {
                    if (a < b) return 1;
                    else return -1;
                }
                return a - b;
            });

            var h = 1 / (n - 1);
            var d = dd[n - 1];
            for (var i = 0; i < n - 1; ++i) {
                if ((i + 1) * h > k) {
                    k = (k - i * h) / h;
                    d = dd[i] + k * (dd[i + 1] - dd[i]);
                    break;
                }
            }
            return d.toString();
        };
        this.computePoissonODist = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 3) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var x;
            var u;
            var cum = 0;
            var dist = 0;

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]);
            }
            x = this._parseDouble(args[0]);
            u = this._parseDouble(args[1]);
            if (!isNaN(x) && !isNaN(u)) {
                cum = (args[2] == this.trueValueStr) ? 1 : 0;
                var n = x;
                if (cum == 0) {
                    var prod = 1;
                    for (var i = 2; i <= n; ++i) {
                        prod *= i;
                    }
                    dist = Math.exp(-u) * Math.pow(u, n) / prod;
                } else {
                    var prod = 1;
                    dist = 0;
                    var ui = 1;
                    for (var i = 0; i <= n; ++i) {
                        dist += ui / prod;
                        prod *= i + 1;
                        ui *= u;
                    }

                    dist = Math.exp(-u) * dist;
                }
            }
            return dist.toString();
        };
        this.computeWeiBullODist = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;

            if (argCount != 4) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var x;
            var alpha;
            var beta;
            var cumulative = 0;
            var cumBool = true;

            for (var i = 0; i < argCount; ++i)
                args[i] = this.getValueFromArg(args[i]).split(this.tic).join(this._string_empty);
            x = this._parseDouble(args[0]);
            alpha = this._parseDouble(args[1]);
            beta = this._parseDouble(args[2]);
            if (!isNaN(x) && !isNaN(alpha) && !isNaN(beta)) {
                if (x < 0 || alpha <= 0 || beta <= 0) {
                    if (this._rethrowLibraryComputationExceptions)
                        throw "Passed argument value is below 0";
                    return this.getErrorStrings()[4].toString();
                }
                if (alpha.toString().length >= 5 && beta.toString().length >= 3) {
                    if (this._rethrowLibraryComputationExceptions)
                        throw "Passed argument length exceeded the minimum length";
                    return this.getErrorStrings()[4].toString();
                }
                if (argCount != 3) {
                    cumulative = (args[3] == this.trueValueStr) ? 1 : 0;
                    var check = 0;
                    check = this._parseDouble(args[3]);
                    if (!isNaN(check))
                        cumulative = 1;
                }

                cumBool = (cumulative == 1) ? true : false;
                cumulative = ((cumBool) ? 1 - Math.exp(-Math.pow(x / beta, alpha)) : Math.pow(x, alpha - 1) * Math.exp(-Math.pow(x / beta, alpha)) * alpha / Math.pow(beta, alpha));
            } else {
                if (this._rethrowLibraryComputationExceptions)
                    throw "Passed argument value is non-numerical";
                return this.getErrorStrings()[1].toString();
            }
            return cumulative.toString();
        };
        this.computeFOinvOrt = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 3) {
                if (this._rethrowLibraryComputationExceptions) {
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                }
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var p;
            var df1;
            var df2;
            var invdist = 0;

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]);
            }
            p = this._parseDouble(args[0]);
            df1 = this._parseDouble(args[1]);
            df2 = this._parseDouble(args[2]);

            if (!isNaN(p) && (p > 0 && p < 1) && !isNaN(df1) && !isNaN(df2)) {
                invdist = this._finv(p, df1, df2);
            }

            if (invdist <= 0) {
                if (this._rethrowLibraryComputationExceptions) {
                    throw this.formulaErrorStrings[this._iterations_dont_converge];
                }
                return this.formulaErrorStrings[this._iterations_dont_converge];
            }
            return invdist.toString();
        };
        this.computeTOdist = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 3) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var x;
            var df1 = 0;
            var dist = 0;

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]).split(this.tic).join(this._string_empty);
            }
            x = this._parseDouble(args[0]);
            df1 = this._parseDouble(args[1]);
            if (!isNaN(x) && !isNaN(df1)) {
                if (df1 < 1 || (x[0] == ("-"))) {
                    if (this._rethrowLibraryComputationExceptions) {
                        throw "#NUM! Passed argument value is incorrect";
                    }
                    return this.getErrorStrings()[4].toString();
                }

                if (args[2] == this.trueValueStr) {
                    dist = this._tCumulativeDensity(x, df1);
                    //dist = StudentsTCumulativeDistributionFunctionInverse(x, (int)u);
                } else if (args[2] == this.falseValueStr) {
                    dist = this._tProbabilityDensity(x, df1);
                }
            } else {
                if (this._rethrowLibraryComputationExceptions) {
                    throw "#VALUE! Passed argument value is incorrect";
                }
                return this.getErrorStrings()[1].toString();
            }

            return dist.toString();
        };
        this.computeAvedev = function (range) {
            var sum = 0, s1, d, ranges;
            var x = [];
            ranges = this.splitArgsPreservingQuotedCommas(range);
            var adjustRange;
            for (var r = 0; r < ranges.length; r++) {
                adjustRange = ranges[r];

                ////is a cellrange
                if (adjustRange.indexOf(':') > -1) {
                    var cellCollection = this.getCellsFromArgs(adjustRange);
                    for (var s = 0; s < cellCollection.length; s++) {
                        try {
                            s1 = this.getValueFromArg(cellCollection[s]).split(this.tic).join(this._string_empty);
                        } catch (ex) {
                            if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                                throw this.getLibraryComputationException();
                            }
                            return ex;
                        }

                        if (s1.length > 0) {
                            d = this._parseDouble(s1);
                            if (!isNaN(d)) {
                                sum = sum + d;
                                x.push(d);
                            } else if ((this.getErrorStrings().indexOf(s1)) > 0) {
                                return s1;
                            }
                        }
                    }
                } else {
                    try {
                        s1 = this.getValueFromArg(adjustRange).split(this.tic).join(this._string_empty);
                    } catch (ex) {
                        if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                            throw this.getLibraryComputationException();
                        }

                        return ex;
                    }
                    if (s1.length > 0) {
                        d = this._parseDouble(s1);
                        if (!isNaN(d)) {
                            sum = sum + d;
                            x.push(d);
                        } else if ((this.getErrorStrings().indexOf(s1) == -1)) {
                            return s1;
                        }
                    }
                }
            }

            if (x.length > 0) {
                var ave = sum / x.length;
                sum = 0;
                for (var i = 0; i < x.length; ++i) {
                    sum = sum + Math.abs((x[i]) - ave);
                }

                sum = sum / x.length;
            }
            return sum.toString();
        };
        this.computeTOinv = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 2) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var x;
            var df1 = 0;
            var dist = 0;

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]).split(this.tic).join(this._string_empty);
            }
            x = this._parseDouble(args[0]);
            df1 = this._parseDouble(args[1]);
            if (!isNaN(x) && !isNaN(df1)) {
                if (df1 < 1 || x < 0 || (x[0] == ("-"))) {
                    if (this._rethrowLibraryComputationExceptions) {
                        throw "#NUM! Passed argument value is incorrect";
                    }
                    return this.getErrorStrings()[4].toString();
                }
                dist = this._tCumulativeDistributionInverse(x, df1);
            } else {
                if (this._rethrowLibraryComputationExceptions) {
                    throw "#VALUE! Passed argument value is incorrect";
                }
                return this.getErrorStrings()[1].toString();
            }
            return dist.toString();
        };
       
        this.computeChisqOinv = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 2) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var p;
            var v;
            var dist = 0;

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]);
            }

            p = this._parseDouble(args[0]);
            v = this._parseDouble(args[1]);
            if (!isNaN(p) && !isNaN(v)) {
                dist = this._chiinv(p, v);
                return dist.toString();
            }
        };
        this.computeCount = function (range) {
            var count = 0;
            var s1;
            var d;
            var dt = new Date;

            var ranges = this.splitArgsPreservingQuotedCommas(range);
            for (var r = 0; r < ranges.length; r++) {
                ////is a cellrange
                if (ranges[r].indexOf(':') > -1) {
                    var cell = this.getCellsFromArgs(ranges[r].split(this.tic).join(""));
                    for (var s = 0; s < cell.length; s++) {
                        try {
                            s1 = this.getValueFromArg(cell[s]);
                        } catch (Exception) {
                            if (this._rethrowLibraryComputationExceptions)
                                throw this.getLibraryComputationException();
                            return this.getErrorStrings()[4].toString();
                        }

                        if (s1.length > 0) {
                            if (s1 == (this.formulaErrorStrings[19])) {
                                if (this.geLibraryComputationException() != null)
                                    throw this.getLibraryComputationException();
                                return this.formulaErrorStrings[19];
                            }
                            d = this._parseDouble(s1);
                            dt = new Date(Date.parse(s1));
                            if ((!isNaN(d) || dt.toString() != "Invalid Date") && this.getErrorStrings().indexOf(s1) == -1) {
                                count++;
                            }
                        }
                    }
                } else {
                    try {
                        if (ranges[r] == this._string_empty && !(ranges[r][0] == (this.tic)))
                            count++;
                        s1 = this.getValueFromArg(r.split(this.tic).join(""));
                    } catch (Exception) {
                        if (this.getLibraryComputationException() != null)
                            throw this.getLibraryComputationException();
                        throw this.getErrorStrings()[4].toString();
                    }

                    if (s1.length > 0) {
                        if (s1[0] == (this.formulaErrorStrings[19])) {
                            if (this.getLibraryComputationException() != null)
                                throw this.getLibraryComputationException();
                            return this.formulaErrorStrings[19];
                        }
                        d = this._parseDouble(s1);
                        dt = new Date(Date.parse(s1));
                        if ((!isNaN(d) || dt.toString() != "Invalid Date") && this.getErrorStrings().indexOf(s1) == -1) {
                            count++;
                        }
                    }
                }
            }
            return count.toString();
        };
        this.computeFOdistORt = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 3) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var x;
            var df1 = 0;
            var df2 = 0;
            var dist = 0;

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]).split(this.tic).join("");
            }
            x = this._parseDouble(args[0]);
            df1 = this._parseDouble(args[1]);
            df2 = this._parseDouble(args[2]);
            if (!isNaN(x) && !isNaN(df1) && !isNaN(df2)) {
                var mult = Math.exp(this._gammaln((df1 + df2) / 2) - this._gammaln(df1 / 2) - this._gammaln(df2 / 2) + (df1 / 2) * Math.log(df1 / df2));

                dist = 1 - mult * this._fdist(x, parseInt(df1.toString()), parseInt(df2.toString()));
            } else {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this.invalid_Math_argument];
                return this._formulaErrorStrings[this._invalid_Math_argument];
            }
            return dist.toString();
        };
        this.computeGeomean = function (range) {
            var sum = 1;
            var s1;
            var d;
            var count = 0;

            this.adjustRangeArg(range);
            var ranges = this.splitArgsPreservingQuotedCommas(range);
            for (var r = 0; r < ranges.length; r++) {
                ////is a cellrange
                if (ranges[r].indexOf(':') > -1) {
                    var cell = this.getCellsFromArgs(ranges[r]);
                    for (var s = 0; s < cell.length; s++) {
                        try {
                            s1 = this.getValueFromArg(cell[s]);
                        } catch (ex) {
                            if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                                throw this.getLibraryComputationException();
                            }

                            return ex;
                        }

                        if (s1.length > 0) {
                            d = this._parseDouble(s1);
                            if (!isNaN(d)) {
                                count++;
                                sum = sum * d;
                            } else if (this.getErrorStrings().indexOf(s1) == -1) {
                                return s1;
                            }
                        }
                    }
                } else {
                    try {
                        s1 = this.getValueFromArg(ranges[r]);
                    } catch (ex) {
                        if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                            throw this.getLibraryComputationException();
                        }

                        return ex;
                    }

                    if (s1.length > 0) {
                        d = this._parseDouble(s1);
                        if (!isNaN(d)) {
                            count++;
                            sum = sum * d;
                        } else if (this.getErrorStrings().indexOf(s1) == -1) {
                            return s1;
                        }
                    }
                }
            }

            if (count > 0) {
                sum = Math.pow(sum, 1 / count);
            }
            return sum.toString();
        };
        this.computeHarmean = function (range) {
            var sum = 0;
            var s1;
            var d;
            var count = 0;

            this.adjustRangeArg(range);
            var ranges = this.splitArgsPreservingQuotedCommas(range);
            for (var r = 0; r < ranges.length; r++) {
                ////is a cellrange
                if (ranges[r].indexOf(':') > -1) {
                    var cell = this.getCellsFromArgs(ranges[r]);
                    for (var s = 0; s < cell.length; s++) {
                        try {
                            s1 = this.getValueFromArg(cell[s]);
                        } catch (ex) {
                            if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                                throw this.getLibraryComputationException();
                            }

                            return ex;
                        }

                        if (s1.length > 0) {
                            d = this._parseDouble(s1);
                            if (!isNaN(d) && d != 0) {
                                count++;
                                sum = sum + 1 / d;
                            } else if (this.getErrorStrings().indexOf(s1) == -1) {
                                return s1;
                            }
                        }
                    }
                } else {
                    try {
                        s1 = this.getValueFromArg(ranges[r]);
                    } catch (ex) {
                        if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                            throw this.getLibraryComputationException();
                        }

                        return ex;
                    }

                    if (s1.length > 0) {
                        d = this._parseDouble(s1);
                        if (!isNaN(d) && d != 0) {
                            count++;
                            sum = sum + 1 / d;
                        } else if (this.getErrorStrings().indexOf(s1)) {
                            return s1;
                        }
                    }
                }
            }

            if (count > 0) {
                sum = (count) / sum;
            }
            return sum.toString();
        };
        this.computeIntercept = function (range) {
            var args = this.splitArgsPreservingQuotedCommas(range);
            var argCount = args.length;
            if (argCount != 2) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var y = this._getDoubleArray(args[0]);
            var x = this._getDoubleArray(args[1]);
            var n = x.length;

            if (n <= 0 || n != y.length) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var sumx = 0;
            var sumy = 0;
            for (var i = 0; i < n; ++i) {
                sumx += x[i];
                sumy += y[i];
            }

            sumx = sumx / n;
            sumy = sumy / n;

            var sumxy = 0;
            var sumx2 = 0;
            var d;
            for (var i = 0; i < n; ++i) {
                d = x[i] - sumx;
                sumxy += d * (y[i] - sumy);
                sumx2 += d * d;
            }
            return (sumy - sumxy / sumx2 * sumx).toString();
        };
        this.computeCountblank = function (range) {
            var count = 0;
            var s1;

            this.adjustRangeArg(range);
            var ranges = this.splitArgsPreservingQuotedCommas(range);
            var arglist;
            if (this._isTextEmpty(range)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this.invalid_arguments];
                else
                    return this.formulaErrorStrings[this.invalid_arguments];
            }
            for (var r = 0; r < ranges.length; r++) {
                arglist = ranges[r];

                ////is a cellrange
                if (arglist.indexOf(':') > -1) {
                    var cellCollection = this.getCellsFromArgs(arglist);
                    for (var s = 0; s < cellCollection.length; s++) {
                        try {
                            s1 = this.getValueFromArg(cellCollection[s]);
                        } catch (Exception) {
                            if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                                throw this.getLibraryComputationException();
                            }

                            return this.getErrorStrings()[4].toString();
                        }

                        if (s1 == this._string_empty) {
                            count++;
                        }
                    }
                } else {
                    try {
                        s1 = this.getValueFromArg(ranges);
                    } catch (Exception) {
                        if (this._rethrowLibraryComputationExceptions && this.getLibraryComputationException() != null) {
                            throw this.getLibraryComputationException();
                        } else
                            return this.getErrorStrings()[4].toString();
                    }
                    if (!this._isCellReference(arglist)) {
                        var temp = this._parseDouble(s1);

                        if (!isNaN(temp) || this.getErrorStrings.indexOf(s1)) {
                            if (this._rethrowLibraryComputationExceptions)
                                throw this.formulaErrorStrings[this.invalid_arguments].toString();
                            else
                                return this.formulaErrorStrings[this.invalid_arguments].toString();
                        }
                        if (!(s1.split(this.tic).join(this._string_empty) == (this._string_empty))) {
                            if (this._rethrowLibraryComputationExceptions)
                                throw this.getErrorStrings()[5].toString();
                            else
                                return this.getErrorStrings()[5].toString();
                        } else {
                            if (this._rethrowLibraryComputationExceptions)
                                throw this.formulaErrorStrings[this.invalid_arguments].toString();
                            else
                                return this.formulaErrorStrings[this.invalid_arguments].toString();
                        }
                    }
                    if (s1 == this._string_empty) {
                        count++;
                    }
                }
            }
            return count.toString();
        };
        this.computeDevsq = function (range) {
            var d;
            var ranges = this.splitArgsPreservingQuotedCommas(range);
            var x = this._getDoubleArray(range);
            var n = x.length;
            if (ranges.length != 1 || range == "") {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            if (x.length <= 0)
            {
                if (this.getLibraryComputationException() != null)
                    throw this.formulaErrorStrings[this._bad_formula];
                throw this.getErrorStrings()[4].toString();
            }
            var sumx = 0;
            for (var i = 0; i < n; ++i) {
                sumx = sumx + x[i];
            }

            sumx = sumx / n;
            var sumx2 = 0;

            for (var i = 0; i < n; ++i) {
                d = x[i] - sumx;
                sumx2 = sumx2 + d * d;
            }
            return sumx2.toString();
        };
        this.computeForecast = function (range) {
            var args = this.splitArgsPreservingQuotedCommas(range);
            var argCount = args.length;
            if (argCount != 3) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var x0, d;
            var s1 = this.getValueFromArg(args[0]);
            x0 = this._parseDouble(s1);
            if (isNaN(x0)) {
                return this.formulaErrorStrings[this._invalid_arguments];
            }
            var y, x;
            y = this._getDoubleArray(args[1]);
            x = this._getDoubleArray(args[2]);
            var n = x.length;

            if (n <= 0 || n != y.length) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var sumx = 0;
            var sumy = 0;
            for (var i = 0; i < n; ++i) {
                sumx = sumx + x[i];
                sumy = sumy + y[i];
            }

            sumx = sumx / n;
            sumy = sumy / n;

            var sumxy = 0;
            var sumx2 = 0;
            for (var i = 0; i < n; ++i) {
                d = x[i] - sumx;
                sumxy = sumxy + d * (y[i] - sumy);
                sumx2 = sumx2 + d * d;
            }

            var b = sumxy / sumx2;
            var a = sumy - b * sumx;
            return (a + b * x0).toString();
        };
        
        this.computeStdevOp = function (range) {
            var dd = this._getDoubleArrayA(range);
            var n = dd.length;

            if (n < 2) {
                if (this._rethrowLibraryComputationExceptions) {
                    throw this.formulaErrorStrings[this._invalid_arguments];
                }
                return this.formulaErrorStrings[this.invalid_arguments];
            }
            return this._stdevdotP(dd).toString();
        };
        this.computeStdevOS = function (range) {
            var dd = this._getDoubleArrayA(range);
            var n = dd.length;

            if (n < 2) {
                if (this._rethrowLibraryComputationExceptions) {
                    throw this.formulaErrorStrings[this._invalid_arguments];
                }
                return this.formulaErrorStrings[this.invalid_arguments];
            }
            var xbar = 0;
            return this._sd(dd, xbar).toString();
        };
        this.computeStdeva = function (range) {
            var dd = this._getDoubleArrayA(range);
            var n = dd.length;
            if (n < 2) {
                return this.formulaErrorStrings[this._invalid_arguments];
            }

            var xbar = 0;
            return this._sd(dd, xbar).toString();
        };
        this.computeStdevpa = function (range) {
            var dd = this._getDoubleArrayA(range);
            var n = dd.length;
            if (n < 2) {
                return this.formulaErrorStrings[this._invalid_arguments];
            }

            var xbar = 0;
            var sdev = this._sd(dd, xbar);
            return (sdev * Math.sqrt(n - 1) / Math.sqrt(n)).toString();
        };
        this.computeVarp = function (range) {
            var dd = this._getDoubleArray(range);
            var n = dd.length;
            return ((n - 1) * this._var(dd) / n).toString();
        };
        this.computeVara = function (range) {
            var dd = this._getDoubleArrayA(range);
            return this._var(dd).toString();
        };
        this.computeVarpa = function (range) {
            var dd = this._getDoubleArrayA(range);
            var n = dd.length;
            return ((n - 1) * this._var(dd) / n).toString();
        };
        this.computeCorrel = function (range) {
            var args = this.splitArgsPreservingQuotedCommas(range);
            var argCount = args.length;
            if (argCount != 2) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var y, x;
            y = this._getDoubleArray(args[0]);
            x = this._getDoubleArray(args[1]);
            var n = x.length;
            if (n <= 0 || n != y.length) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var sumx = 0;
            var sumy = 0;
            for (var i = 0; i < n; ++i) {
                sumx = sumx + x[i];
                sumy = sumy + y[i];
            }

            sumx = sumx / n;
            sumy = sumy / n;

            var sumxy = 0;
            var sumxb2 = 0;
            var sumyb2 = 0;
            var xb = 0;
            var yb = 0;

            for (var i = 0; i < n; ++i) {
                xb = x[i] - sumx;
                yb = y[i] - sumy;
                sumxy = sumxy + xb * yb;
                sumxb2 = sumxb2 + xb * xb;
                sumyb2 = sumyb2 + yb * yb;
            }

            //  var v = (sumxy / Math.Sqrt(sumxb2 * sumyb2)).toString();
            //        return v;
            return (sumxy / Math.sqrt(sumxb2 * sumyb2)).toString();
        };

        this.computeNegbinomODist = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 4) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var successes;
            var failures;
            var p;
            var dist = 0;

            for (var i = 0; i < argCount; ++i) {
                args[i] = this.getValueFromArg(args[i]);
            }
            failures = this._parseDouble(args[0]);
            successes = this._parseDouble(args[1]);
            p = this._parseDouble(args[2]);
            if (!isNaN(failures) && !isNaN(successes) && !isNaN(p)) {
                dist = this._negbinomdensity(parseInt(failures.toString()), parseInt(successes.toString()), p);
            }
            return dist.toString();
        };

        this.computePercentileExc = function (range) {
            var args = this.splitArgsPreservingQuotedCommas(range);
            var argCount = args.length;
            if (argCount != 2) {
                if (this._rethrowLibraryComputationExceptions) {
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                }
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var k;
            var s1 = this.getValueFromArg(args[1]);
            k = this._parseDouble(s1);
            if (isNaN(k) && (k < 0 || k > 1)) {
                return this.formulaErrorStrings[this._invalid_arguments];
            }
            var ss = this._parseDouble(s1);
            if (ss == 0 || ss <= 0 || ss >= 1) {
                if (this._rethrowLibraryComputationExceptions) {
                    throw this.getErrorStrings()[4].toString();
                }
                return this.getErrorStrings()[4].toString();
            }
            var dd = this._getDoubleArray(args[0]);
            var n = dd.length;

            dd.sort(function (a, b) {
                if (isNaN(a) || isNaN(b)) {
                    if (a < b) return 1;
                    else return -1;
                }
                return a - b;
            });

            var num = dd.length;
            if (k <= this._parseDouble((1 / (num + 1)).toString()) || k >= this._parseDouble((num / (num + 1)).toString())) {
                if (this._rethrowLibraryComputationExceptions) {
                    throw this.getErrorStrings()[4].toString();
                }
                return this.getErrorStrings()[4].toString();
            }
            var l = k * (num + 1);
            return l.toString();
        };

        this.computePercentileOInc = function (range) {
            var args = this.splitArgsPreservingQuotedCommas(range);
            var argCount = args.length;
            if (argCount != 2) {
                if (this._rethrowLibraryComputationExceptions) {
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                }
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var k;
            var s1 = this.getValueFromArg(args[1]);
            k = this._parseDouble(s1);
            if (isNaN(k) && (k < 0 || k > 1)) {
                return this.formulaErrorStrings[this._invalid_arguments];
            }
            var ss = this._parseDouble(s1);
            if (ss == 0 || ss <= 0 || ss >= 1) {
                if (this._rethrowLibraryComputationExceptions) {
                    throw this.getErrorStrings()[4].toString();
                }
                return this.getErrorStrings()[4].toString();
            }
            var dd = this._getDoubleArray(args[0]);
            var n = dd.length;

            dd.sort();

            var h = 1 / (n - 1);
            var d = dd[n - 1];
            for (var i = 0; i < n - 1; ++i) {
                if ((i + 1) * h > k) {
                    k = (k - i * h) / h;
                    d = dd[i] + k * (dd[i + 1] - dd[i]);
                    break;
                }
            }
            return d.toString();
        };

        this.computeTrimmean = function (range) {
            var args = this.splitArgsPreservingQuotedCommas(range);
            var argCount = args.length;
            if (argCount != 2) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var percent;
            var s1 = this.getValueFromArg(args[1]);
            percent = this._parseDouble(s1);
            if (isNaN(percent)) {
                return this.formulaErrorStrings[this._invalid_arguments];
            }

            var dd = this._getDoubleArray(args[0]);
            var n = dd.length;
            var k = parseInt((percent * n).toString());
            k = parseInt(k / 2);
            if (k < 1 || 2 * k >= n) {
                return this.formulaErrorStrings[this._invalid_arguments];
            }
            dd.sort(function (a, b) {
                if (isNaN(a) || isNaN(b)) {
                    if (a > b) return 1;
                    else return -1;
                }
                return a - b;
            });
            var sum = 0;
            n = n - k;
            for (var i = k; i < n; ++i) {
                sum += dd[i];
            }
            return (sum / (n - k)).toString();
        };

        this.computePearson = function (range) {
            var args = this.splitArgsPreservingQuotedCommas(range);
            var argCount = args.length;
            if (argCount != 2) {
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            var y = this._getDoubleArray(args[0]);
            var x = this._getDoubleArray(args[1]);
            var n = y.length;
            if (n <= 0 || !isNaN(y)) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._invalid_Math_argument];
                return this.getErrorStrings()[4].toString();
            }
            var result = this._pearson(x, y, n).toString();

            if ( this.computeIsErr(result) == this.trueValueStr) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._invalid_Math_argument];
                return this.getErrorStrings()[3].toString();
            }
            return result;
        };

        this.computeRsq = function (range) {

            var s = this.computePearson(range).toString();
                var d = 0;
                d = this._parseDouble(s);
                if (!isNaN(d)) {
                    d = d * d;
                } else if (this.getErrorStrings().indexOf(s) == -1) {
                    return s;
                }
                return d.toString();
            try {
            }
            catch (ex) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._invalid_Math_argument];
                return this.getErrorStrings()[5].toString();
            }
        };

        this.computeHLookUp = function (range) {
            var cachingEnabled = this._isHLookupCachingEnabled();
            var optimizedMatchesEnabled = this._isOptimizedMatchesEnabled();
            if (cachingEnabled && this._lookupTables == null)
                this.lookupTables = new HashTable();

            var s = this.splitArgsPreservingQuotedCommas(range);
            var lookUp = this.getValueFromArg(s[0]);
            lookUp = lookUp.split(this.tic).join("").toUpperCase();
            var r = s[1].split("\"").join("");
            var o1 = this.getValueFromArg(s[2]).split(this.tic).join("");
            var d = this._parseDouble(o1);
            if (isNaN(d)) {
                return "#N/A";
            }

            ////int row = int.Parse(o1);
            var row = parseInt(o1);

            var match = true;
            if (s.length == 4) {
                match = this.getValueFromArg(s[3]) == this.trueValueStr;
            }

            d = this._parseDouble(lookUp);
            var typeIsNumber = match ? !isNaN(d) : false;

            var i = r.indexOf(":");

            ////single cell
            if (i == -1) {
                r = r + ":" + r;
                i = r.indexOf(":");
            }

            var k = r.substring(0, i).lastIndexOf(this.sheetToken);
            var grd = this.grid;
            var family = CalcEngine.getSheetFamilyItem(this.grid);

            if (k > -1) {
                this.grid = family.tokenToParentObject.getItem(r.substring(0, k + 1));
            }

            var row1 = this.rowIndex(r.substring(0, i));
            var row2 = this.rowIndex(r.substring(i + 1));
            if (!(row1 != -1 || row2 == -1) == (row1 == -1 || row2 != -1)) {
                return this.getErrorStrings()[5].toString();
            }

            var col1 = this.colIndex(r.substring(0, i));
            var col2 = this.colIndex(r.substring(i + 1));

            var newTable = false;
            var key = "";
            var lookUpTable = null;
            var matchedTable = null;
            if (cachingEnabled) {
                key = row1.toString() + "_" + col1.toString() + "_" + col2.toString() + "_" + this.grid.GetHashCode();

                if (!this._lookupTables.containsKey(key)) {
                    if (optimizedMatchesEnabled) {
                        var _lookUp = new LookUps();
                        _lookUp.setMatchLookUpList(new HashTable());
                        this._lookupTables.add(key, _lookUp);
                    } else {
                        var _lookUp = new LookUps();
                        this._lookupTables.add(key, _lookUp);
                    }
                    newTable = true;
                }
                lookUpTable = this._lookupTables.getItem(key).getLinearLookUpList();
                if (optimizedMatchesEnabled) {
                    matchedTable = this._lookupTables.getItem(key).getMatchLookUpList();
                }
            }

            var val = "";
            var lastCol = col1;
            var s1 = "";
            var d1 = 0;
            var doLastColMark = true;
            var exactMatch = false;
            if (cachingEnabled && optimizedMatchesEnabled && matchedTable.containsKey(lookUp)) {
                lastCol = matchedTable.getItem(lookUp);
                s1 = lookUp;
            } else {
                for (var col = col1; col <= col2; ++col) {
                    if (!cachingEnabled || col - col1 >= lookUpTable.length || newTable) {
                        s1 = this.getValueFromParentObject(this.grid, row1, col).toString().toUpperCase().split("\"").join("");
                        if (cachingEnabled) {
                            lookUpTable.push(s1);
                            if (optimizedMatchesEnabled) {
                                matchedTable.add(s1, col);
                            }
                        }
                    } else {
                        s1 = lookUpTable[col - col1];
                    }
                    d1 = (typeIsNumber) ? this._parseDouble(s1) : d1;
                    if (s1 == lookUp || (match && (typeIsNumber ? (!isNaN(d1) && d1 > d) : (s1 > lookUp)))) {
                        if (s1 == lookUp) {
                            lastCol = col;
                            match = true;
                            exactMatch = true;
                        }

                        if (!newTable)
                            break;
                        else
                            doLastColMark = false;
                    }
                    if (doLastColMark)
                        lastCol = col;
                    match = newTable = true;
                }
            }

            if (match || s1 == lookUp) {
                if (!exactMatch && !typeIsNumber) {
                    this.grid = grd;
                    return "#N/A";
                }
                if ((row + row1 - 1) > row2)
                    return "#REF!";
                val = this.getValueFromParentObject(this.grid, row + row1 - 1, lastCol).toString();
                if (val.length > 0 && val[0] == this.getFormulaCharacter()) {
                    val = this.parseFormula(val);
                }

                d = this._parseDouble(val);
                if (val.length > 0 && val[0] != this.tic[0] && isNaN(d)) {
                    val =   val ;
                }
            } else {
                val = "#N/A";
            }

            ////val = "\"#N/A\"";
            this.grid = grd;

            return val;
        };
        this.computeIndex = function (arg) {
            var args = this.splitArgsPreservingQuotedCommas(arg);
            var argCount = args.length;

            if (argCount < 2) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var r = args[0];
            r = r.split(this.tic).join("");
            var i = r.indexOf(":");

            ////single cell
            if (i == -1) {
                if (this._isCellReference(r)) {
                    r = r + ":" + r;
                } else {
                    if (r.indexOf(";") > -1)
                    {
                        var rowNumber = parseInt(this.getValueFromArg(args[1]));
                        var arr = this._splitArguments(r, ';');
                        var colInd = (argCount == 3) ? parseInt(this.getValueFromArg(args[2])) : 1;
                        try
                        {
                            rowNumber = (rowNumber == 0) ? 1 : rowNumber;
                            colInd = (colInd == 0) ? 1 : colInd;
                            var colArray = this.splitArgsPreservingQuotedCommas(arr[rowNumber -1]);
                            return colArray[colInd -1];
                        }
                        catch(ex)
                        {
                            if (this.getRethrowLibraryComputationExceptions())
                                throw this.formulaErrorStrings[this._invalid_Math_argument];
                            return this.getErrorStrings()[2].toString();
                        }
                    }
                    var indexArray = this.splitArgsPreservingQuotedCommas(r);
                    if (!isNaN(rowNumber) && rowNumber > 0) {
                        if (indexArray.length >= rowNumber) {
                            return (parseInt(rowNumber.toString()) == 0) ? indexArray[0] : indexArray[parseInt(rowNumber.toString()) - 1];
                        } else {
                            if (this.getRethrowLibraryComputationExceptions())
                                throw this.formulaErrorStrings[this._invalid_arguments];
                            return "#REF";
                        }
                    } else {
                        if (this.getRethrowLibraryComputationExceptions())
                            throw this.formulaErrorStrings[this._invalid_arguments];
                        return this.getErrorStrings()[1].toString();
                    }
                }
            }
            i = r.indexOf(":");
            if (arg.indexOf("#N/A") > -1 || arg.indexOf("#N~A") > -1) {
                return "#N/A";
            }
            if (arg.indexOf("#DIV/0!") > -1 || arg.indexOf("#DIV~0!") > -1) {
                return "#DIV/0!";
            }
            var sheet = this._getSheetTokenFromReference(r);
            args[1] = (argCount == 1 || args[1] == "") ? "1" : args[1];
            args[2] = (argCount <= 2 || args[2] == "") ? "1" : args[2];
            var d = parseInt(this.getValueFromArg(args[1]));
            var row = !isNaN(d) ? d: -1;
            d = parseInt(this.getValueFromArg(args[2]));
            var col = !isNaN(d) ? d : -1;
            if (row == -1 || col == -1) {
                return "#REF";
            }

            var top = this.rowIndex(r.substring(0, i));
            var bot = this.rowIndex(r.substring(i + 1));
            if (!(top != -1 || bot == -1) == (top == -1 || bot != -1)) {
                return this.getErrorStrings()[5].toString();
            }

            var left = this.colIndex(r.substring(0, i));
            var right = this.colIndex(r.substring(i + 1));

            if (row > bot - top + 1 || col > right - left + 1) {
                return "#REF";
            }

            row = this.rowIndex(r.substring(0, i)) + row - 1;

            col = this.colIndex(r.substring(0, i)) + col - 1;

            var argsVal = sheet + RangeInfo.getAlphaLabel(col) + row;
            var result = this.getValueFromArg(argsVal);
            if (this._isTextEmpty(result))
                return "0";
            return result;
        };
        this.computeIndirect = function (args) {
            var arg = this.splitArgsPreservingQuotedCommas(args);
            var argCount = arg.length;

            if (argCount > 2 || argCount == 0) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }

            arg[0] = arg[0].toUpperCase();
            arg[0] = this.setTokensForSheets(arg[0]);
            var sheetToken1 = this._sheetToken(arg[0].split(this.tic).join(""));

            ////Remove SheetToken
            if (sheetToken1 != "") {
                arg[0] = arg[0].split(sheetToken1).join("");
            }

            if (arg.length == 2 && arg[1] == this.falseValueStr) {
                var hasTIC = arg[0][0] == this.tic && arg[0][args[0].length - 1] == this.tic;
                var rcCell = (arg[0].toUpperCase()).split(this.tic).join("");
                var cells = rcCell.split(':');
                
                var rc = (cells[0].split("R").join("C")).split("C");
                var index = rc.indexOf("");
                if (index > -1)
                    rc.splice(index, 1);
                if (rc.length > 2) {
                    return this.getErrorStrings()[2].toString();
                }

                arg[0] = RangeInfo.getAlphaLabel(parseInt(rc[1])) + rc[0];

                if (cells.length == 2) {
                    var st = this._sheetToken(cells[1]);
                    if (st != null || st != "") {
                        cells[1] = cells[1].split(st).join("");
                    }

                    rc = (cells[0].split("R").join("C")).split("C");
                    arg[0] += ":" + RangeInfo.getAlphaLabel(parseInt(rc[1])) + rc[0];
                }

                if (hasTIC) {
                    arg[0] = this.tic + arg[0] + this.tic;
                }
            }

            var cellReference = "";

            ////String
            if (arg[0][0] == this.tic) {
                cellReference = sheetToken1 + arg[0].split(this.tic).join("");
            } else {
                if (this._isCellReference(arg[0])) {
                    var scopedRange = "";
                    cellReference = this.getValueFromArg(sheetToken1 + arg[0]);
                    if (cellReference == null || cellReference == "") {
                        return "0";
                    }
                    if (this._isInteriorFunction) {
                        this._isInteriorFunction = !this._isInteriorFunction;
                        return arg[0].split(this._string_fixedreference).join("");
                    }

                    scopedRange = this._checkIfScopedRange(cellReference.toUpperCase());
                    if (this.getNamedRanges().containsKey(cellReference.toUpperCase())) {
                        cellReference = this.getNamedRanges().getItem(cellReference.toUpperCase());
                        cellReference = cellReference.toUpperCase();
                        cellReference = cellReference.split(this._string_fixedreference).join("");
                        cellReference = this.setTokensForSheets(cellReference);
                        if (cellReference[0] != this.sheetToken) {
                            cellReference = sheetToken1 + cellReference;
                        }
                    } else if (scopedRange != "NaN") {
                        cellReference = scopedRange;
                        cellReference = cellReference.toUpperCase();
                        cellReference = cellReference.split(this._string_fixedreference).join("");
                        cellReference = this.setTokensForSheets(cellReference);
                        if (cellReference[0] != this.sheetToken) {
                            cellReference = sheetToken1 + cellReference;
                        }
                    } else if (this._isCellReference(cellReference)) {
                        return this.getValueFromArg(cellReference);
                    } else if (cellReference.indexOf("Invalid" == 0))
                        return this.getErrorStrings()[2].toString();
                    else {
                        return cellReference;
                    }
                } else {
                    cellReference = arg[0];
                }
            }

            if (!this._isCellReference(cellReference.split(this._string_fixedreference).join(""))) {
                var scopedRange = "";
                scopedRange = this._checkIfScopedRange(cellReference.toUpperCase());
                if (this.getNamedRanges().containsKey(cellReference.toUpperCase())) {
                    cellReference = this.getNamedRanges().getItem(cellReference.toUpperCase());
                    if (cellReference[0] != this.sheetToken) {
                        cellReference = sheetToken1 + cellReference;
                    }
                } else if (scopedRange != "NaN") {
                    cellReference = scopedRange;
                    if (cellReference[0] != this.sheetToken) {
                        cellReference = sheetToken1 + cellReference;
                    }
                } else {
                    return this.getErrorStrings()[2].toString();
                }
            }

            if ((cellReference.indexOf(":") > -1 && this._isInteriorFunction) || (this.computedValueLevel>1)) {
                this._isInteriorFunction = !this._isInteriorFunction;

                return cellReference.split(this._string_fixedreference).join("");
            }
            return this.getValueFromArg(cellReference);
        };
        this.computeLookUp = function (range) {
            var cachingEnabled = this._isHLookupCachingEnabled();
            var optimizedMatchesEnabled = this._isOptimizedMatchesEnabled();
            if (cachingEnabled && this._lookupTables == null)
                this.lookupTables = new HashTable();

            var s = this.splitArgsPreservingQuotedCommas(range);
            var lookUp = this.getValueFromArg(s[0]);
            lookUp = lookUp.split(this.tic).join("").toUpperCase();

            var finalResult = "";
            var r = s[1].split("\"").join("");
            s[2] = (s.length = 3) ? s[2].split(this.tic).join("") : s[2];
            var tempLookUp = this.getValueFromArg(s[0]);
            var cellValue =  [];
            var resultValue = [];

            var o1 = this.getValueFromArg(s[2]).split(this.tic).join("");
            //var d = this._parseDouble(o1);
            //if (isNaN(d)) {
            //    return "#N/A";
            //}
            if (s.length == 2) {
                var secondOne = s[1];
                var stringArg = this.splitArgsPreservingQuotedCommas(s[1]);
                if (s[1].indexOf(";") > -1) {
                    var sepArg = this._splitArguments(s[1], ';');
                    if (sepArg.length == 1) {
                        var string1 = this.splitArgsPreservingQuotedCommas(sepArg[0].toUpperCase());
                        for (var cell = 0; cell < string1.length; cell++)  {
                            cellValue.push(this.getValueFromArg(string1[cell]).toUpperCase());
                            resultValue.push(this.getValueFromArg(string1[cell]).toUpperCase());
                        }
                    } else if (sepArg.length == 2) {
                        var strin1 = this.splitArgsPreservingQuotedCommas(sepArg[0].toUpperCase());
                        var strin2 = this.splitArgsPreservingQuotedCommas(sepArg[1].toUpperCase());
                        for (var cell = 0; cell < strin1.length; cell++) {
                            cellValue.push(this.getValueFromArg(strin1[cell]).toUpperCase());
                        }
                        for (var cell = 0; cell < strin2.length; cell++)  {
                            resultValue.push(this.getValueFromArg(strin2[cell]).toUpperCase());
                        }
                    } else
                        for (var y = 0; y < sepArg.length; y++) {
                            var strin1 = this.splitArgsPreservingQuotedCommas(sepArg[y].toUpperCase());
                            cellValue.push(this.getValueFromArg(strin1[0]).toUpperCase());
                            resultValue.push(this.getValueFromArg(strin1[1]).toUpperCase());
                        }
                } else {
                    if (s[1].indexOf(':') > -1) {
                        var cells = this.getCellsFromArgs(s[1]);
                        for (var cell1 = 0; cell1 < cells.length; cell1++)  {
                            cellValue.push(this.getValueFromArg(cells[cell1]).toUpperCase());
                            resultValue.push(this.getValueFromArg(cells[cell1]).toUpperCase());
                        }
                    } else {
                        var string1 = this.splitArgsPreservingQuotedCommas(s[1].toUpperCase());
                        for (var cell = 0; cell < string1.length; cell++)  {
                            cellValue.push(this.getValueFromArg(string1[cell]).toUpperCase());
                            resultValue.push(this.getValueFromArg(string1[cell]).toUpperCase());
                        }
                    }
                }
            } else if (s.length == 3) {
                if (r.indexOf(':') > -1) {
                    var cells = this.getCellsFromArgs(r);

                    for (var cell1 = 0; cell1 < cells.length; cell1++)  {
                        try  {
                            cellValue.push(this.getValueFromArg(cells[cell1]).toUpperCase());
                        } catch (ex) {
                            return this.getErrorStrings()[0].toString();
                        }
                    }
                } else {
                    var s2 = this.splitArgsPreservingQuotedCommas(s[1]);
                    for (var cell1 = 0; cell1 < s2.length; cell1++) {
                        try  {
                            cellValue.push(this.getValueFromArg(s2[cell1]).toUpperCase());
                        } catch (ex) {
                            return this.getErrorStrings()[0].toString();
                        }
                    }
                }
                var result = s[2];
                //Fix for the issue JS-29951.
                var str = s[2].split(":");
                var startCount = this.getRowIndexFromName(str[0]);
                var endCount = this.getRowIndexFromName(str[str.length - 1]);
                //deal with row wise
                if (startCount != endCount) {
                    str[str.length - 1] = str[str.length - 1].replace(endCount, +startCount + cellValue.length - 1);
                    result = str.join(':');
                }
                //deals with single cell and column wise
                else {
                    var columnIndex = this.computeColumn(result);
                    var resultIndex = +columnIndex + cellValue.length - 1;
                    var resultName = this.computeAddress(startCount + "," + resultIndex + ",4");
                    result = str[0] + ":" + resultName;
                }
                if (!this._isCellReference(result))
                    return this.getErrorStrings()[0].toString();
                if (result.indexOf(':') > -1) {
                    var cells = this.getCellsFromArgs(result);

                    for (var cell1 = 0; cell1 < cells.length; cell1++)  {
                        try  {
                            resultValue.push(this.getValueFromArg(cells[cell1]).toUpperCase());
                        } catch (ex) {
                            return this.getErrorStrings()[0].toString();
                        }
                    }
                } else {
                    var s2 = this.splitArgsPreservingQuotedCommas(s[1]);
                    for (var cell1 = 0; cell1 < s2.length; cell1++) {
                        try  {
                            resultValue.push(this.getValueFromArg(s2[cell1]).toUpperCase());
                        } catch (ex) {
                            return this.getErrorStrings()[0].toString();
                        }
                    }
                }
            }
            if (cellValue.indexOf(lookUp) == -1) {
                var temp = cellValue[0];
                var valCount = 0;
                for (var x = 0; x < cellValue.length; x++) {
                    if ((cellValue[x] > temp && lookUp > cellValue[x] && temp > lookUp) || lookUp > cellValue[x]) {
                        temp = (lookUp > cellValue[x]) ? cellValue[x] : cellValue[x+1];
                        valCount++;
                    } else if (valCount != 0)
                        break;
                }
                if (valCount == 0) {
                    return this.getErrorStrings()[0].toString();
                }
                lookUp = temp;
            }
            var no = 0;
            var index = 0;
            if (s.length == 3 && s[2].indexOf(':') > -1) {
                for (var y = 0; y < cellValue.length; y++) {
                    if (cellValue[y] == lookUp) {
                        index = cellValue.indexOf(lookUp);
                        no++;
                    } else if (no != 0)
                        break;
                }

                finalResult = resultValue[index + no - 1];
            } else {
                for (var y = 0; y < cellValue.length; y++) {
                    if (cellValue[y] == lookUp) {
                        index = cellValue.indexOf(lookUp);
                        no++;
                    } else if (no != 0)
                        break;
                }
                finalResult = resultValue[index + no - 1];
            }
            return finalResult;
        };
        this.computeOffSet = function (arg) {
            var args = this.splitArgsPreservingQuotedCommas(arg);
            var argCount = args.length;

            if (argCount < 3 || argCount > 5) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var r = args[0];
            var result;
            var d = this._parseDouble(this.getValueFromArg(args[1]));
            var rows = (!isNaN(d)) ? parseInt(d.toString()) : -1;
            d = this._parseDouble(this.getValueFromArg(args[2]));

            var cols = (!isNaN(d)) ? parseInt(d.toString()) : -1;
            var hightNum = (argCount >= 4) ? args[3] : "-1";
            d = parseInt(this.getValueFromArg(hightNum));
            var height = (!isNaN(d) ? (d) : 1);
            var widthNum = (argCount == 5) ? args[4] : "-1";
            d = parseInt(this.getValueFromArg(widthNum));
            var width = (!isNaN(d) ? (d) : 1);

            var i = r.indexOf(":");
            var singleCell = i == -1;

            ////single cell
            if (singleCell) {
                r = r + ":" + r;
                i = r.indexOf(":");
            }

            singleCell = (singleCell && width <= 1 && height <= 1); ////only treat as single cell if no hieght or width given...
            if (width == -1)
                singleCell = true;
            var sheet = this._getSheetTokenFromReference(r);

            var row1 = this.rowIndex(r.substring(0, i)) + rows;
            var row2 = this.rowIndex(r.substring(i + 1)) + rows;
            if (!(this.rowIndex(r.substring(0, i)) != -1 || this.rowIndex(r.substring(i + 1)) != -1) == ((this.rowIndex(r.substring(0, i)) == -1 || this.rowIndex(r.substring(i + 1)) != -1))) {
                return this.getErrorStrings()[5].toString();
            }

            var col1 = this.colIndex(r.substring(0, i)) + cols;
            var col2 = this.colIndex(r.substring(i + 1)) + cols;

            if (row1 <= 0 || col1 <= 0) {
                return this.getErrorStrings()[2].toString();
            }
            if ((height > 0 && width < 0) || (height < 1 && width > 1)) {
                row1 = this.rowIndex(this.cell);
            }
            if (col2 == (parseInt(this.computeColumn(r)) - 1))
                singleCell = true;
            var cellArg = sheet + RangeInfo.getAlphaLabel(col1) + row1;
            result = singleCell ? this.computedValue(cellArg) : cellArg + ":" + RangeInfo.getAlphaLabel(col1 + width - 1) + (row1 + height - 1);
            return result;
        };
        this.computeTranspose = function (arg) {
            if (!this._isCellReference(arg) && !this.getNamedRanges().containsKey(arg) && arg.indexOf(";") == -1) {
                var arrayArg = this._splitArguments(arg.split(this.tic).join(""), ';');
                if (arrayArg.length == 1) {
                    return this.getValueFromArg(this.splitArgsPreservingQuotedCommas(arrayArg[0])[0]);
                } else {
                    if (this.getRethrowLibraryComputationExceptions())
                        throw this.formulaErrorStrings[this._invalid_arguments];
                    return this.formulaErrorStrings[this._invalid_arguments];
                }
            }
            var args = this.splitArgsPreservingQuotedCommas(arg);
            var argCount = args.length;

            if (argCount != 1) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var firstRow, LastRow, firstCol, LastCol;
            var result = "";
            if (arg.indexOf(';') > -1) {
                var arrayArg = this._splitArguments(arg.split(this.tic).join(""), ';');
                for (var i = 1; i < arrayArg.length; i++) {
                    if (this.splitArgsPreservingQuotedCommas(arrayArg[i - 1]).length != this.splitArgsPreservingQuotedCommas(arrayArg[1]).length) {
                        if (this.getRethrowLibraryComputationExceptions())
                            throw this.formulaErrorStrings[this._wrong_number_arguments];
                        return this.formulaErrorStrings[this._wrong_number_arguments];
                    }
                }
                result = this.splitArgsPreservingQuotedCommas(arrayArg[0])[0];
            } else {
                var cells = this.getCellsFromArgs(arg);
                firstRow = this.rowIndex(cells[0].toString());
                LastRow = this.rowIndex(cells[cells.length - 1].toString());
                firstCol = this.colIndex(cells[0].toString());
                LastCol = this.colIndex(cells[cells.length - 1].toString());
                var currentCell = this.cell;
                var currentColIndex = this.colIndex(currentCell);
                var currentRowIndex = this.rowIndex(currentCell);
                var arrayHeight = LastRow - firstRow + 1;
                var arrayWidth = LastCol - firstCol + 1;
                var startRow, startCol, endRow, endCol;

                this._getFormulaArrayBounds(this.cell, arrayHeight, arrayWidth);

                startRow = this._getFormulaArrayBoundsfirstRowIndex;
                startCol = this._getFormulaArrayBoundsfirstColIndex;
                endRow = this._getFormulaArrayBoundslastRowIndex;
                endCol = this._getFormulaArrayBoundslastColIndex;

                var x = currentRowIndex - startRow;
                var y = currentColIndex - startCol;
                var i1 = arg.indexOf(":");

                ////single cell
                if (i1 == -1) {
                    arg = arg + ":" + arg;
                    i1 = arg.indexOf(":");
                }

                var k = arg.substring(0, i1).lastIndexOf(this.sheetToken);
                var grd = this.grid;
                var family = CalcEngine.getSheetFamilyItem(this.grid);

                if (k > -1) {
                    this.grid = family.tokenToParentObject[arg.substring(0, k + 1)];
                }
                result = this._getValueComputeFormulaIfNecessary(firstRow + y, firstCol + x, this.grid);
                this.grid = grd;
            }
            if (result == null || result == "")
                result = "0";
            return result;
        };
        this.computeEncodeURL = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;

            if (argCount != 1) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            if (!this._isCellReference(args[0]) && !this.getNamedRanges().containsKey(args[0]) && args[0].indexOf(";") == -1) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._invalid_arguments];
                return this.getErrorStrings()[5];
            }
            var text = this._stripTics0(this.getValueFromArg(args[0]));
            return encodeURIComponent(text);
        };
        

        this.computeAnd = function (range) {
            var sum = true, s1, d;
            if (range == null || range == "") {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_formula];
                else
                    return this.formulaErrorStrings[this._bad_formula];
            }
            var ranges = this.splitArgsPreservingQuotedCommas(range);
            for (var r = 0; r < ranges.length; r++) {
                if (ranges[r] == (this.tic)) {
                    if (this.getRethrowLibraryComputationExceptions())
                        throw this.getErrorStrings()[1].toString();
                    else
                        return this.getErrorStrings()[1].toString();
                }
                if (ranges[r].indexOf(':') > -1) {
                    cells = this.getCellsFromArgs(ranges[r]);
                    for (var s = 0; s < cells.length; s++) {
                        if (this.getErrorStrings().indexOf(s) > -1) {
                            return s;
                        } else if (s.startsWith(this.tic)) {
                            if (this.getRethrowLibraryComputationExceptions)
                                throw new this.getErrorStrings()[5].toString();
                            else
                                return this.getErrorStrings()[5].toString();
                        }
                        try {
                            s1 = this.getValueFromArg(s);
                            if (this.getErrorStrings().indexOf(s1) > -1) {
                                return s1;
                            }
                        } catch (ex) {
                            if (this.rethrowLibraryComputationExceptions && this.getLibraryComputationException != null) {
                                throw this.getErrorStrings()[4].toString();
                            }
                            return this.getErrorStrings()[4].toString();
                        }

                        sum = (sum & (s1 == "" ? true : ((s1.split(this.tic).join("").toUpperCase() == this.trueValueStr) || (d = this._parseDouble(s1)) && d != 0)));
                    }
                } else {
                    try {
                        s1 = this.getValueFromArg(ranges[r]);
                        var tempdate = Date.parse(s1.split(this.tic).join(""));
                        d = this._parseDouble(s1.split(this.tic).join(""))
                        if (!isNaN(tempdate)) {
                            return this.trueValueStr;
                        } else if (isNaN(d) && !(s1 == this._string_empty) && !(s1.split(this.tic).join("").toUpperCase() == this.trueValueStr || s1.split(this.tic).join("").toUpperCase() == this.falseValueStr)) {
                            if (this.getRethrowLibraryComputationExceptions())
                                throw this.getErrorStrings()[1].toString();
                            else
                                return (this._isCellReference(ranges[r]) || s1[0] == this.tic) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
                        }
                    } catch (Exception) {
                        if (this.getRethrowLibraryComputationExceptions() && this.getLibraryComputationException() != null) {
                            throw this.getErrorStrings()[4].toString();
                        }

                        return this.getErrorStrings()[4].toString();
                    }
                    var dp = this._parseDouble(s1);
                    sum = (sum & ((s1.split(this.tic).join("").toUpperCase() == this.trueValueStr) || (!isNaN(dp) && d != 0)));
                    // sum &= (s1 == this.trueValueStr) || (d = this._parseDouble(s1)) && d != 0;
                }
            }
            return sum ? this.trueValueStr : this.falseValueStr;
        };
        this.computeFalse = function (empty) {
            return this.falseValueStr;
        };
        this.computeIf = function (args) {
            var s1 = this._string_empty;
            var array1 = [this.getParseArgumentSeparator(), ':'];

            ////parsed formula
            if (args.length > 0 && this._indexOfAny(args, array1) == -1) {
                return this.getFormulaErrorStrings();
            } else {
                var s = this.getCellsFromArgs(args);

                if (s.length >= 2) {
                    try {
                        s1 = this.getValueFromArg(s[0]);
                        var d;
                        if (s1.split(this.tic).join("") == this.trueValueStr || (d = this._parseDouble(s1)) && d != 0) {
                            s1 = this.getValueFromArg(s[1]);
                        } else if (s1 == this.falseValueStr || (s1 == "") || (d = this._parseDouble(s1)) && d == 0) {
                            s1 = s.length == 3 ? this.getValueFromArg(s[2]) : false;
                        } else {
                            //  if (this.tic().indexOf(s[0]) == -1)
                            if (s.indexOf(this.tic) > -1) {
                                var first = s[0].indexOf(this.tic) + 1;
                                var last = s[0].lastIndexOf(this.tic) - 1;
                                var st = s[0].substring(first, last - first + 1);
                                for (var err = 0; err < this.getFormulaErrorStrings().length; err++) {
                                    if (st === (err))
                                        return err;
                                }
                            }
                            s1 = "NaN";
                        }
                    } catch (ex) {
                        if (this.rethrowLibraryComputationExceptions && this.getLibraryComputationException != null) {
                            throw this.getLibraryComputationException;
                        }

                        return ex;
                    }
                } else {
                    return this.getFormulaErrorStrings();
                }
            }
            return s1.split(this.tic).join("");
        };
        this.computeIfError = function (args) {
            var argsArray = args.split(this.getParseArgumentSeparator());
            var range = argsArray[0];

            //    var arrgsArray = [this.getParseArgumentSeparator, ];
            if (argsArray.length != 2) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            if (range[0] == this.tic)
                return this.getValueFromArg(argsArray[0]);
            try {
                if (range[0] == this.bMARKER) {
                    range = range.replace(this.bMARKER, ' ');
                    range = (this._isIE8) ? range.replace(/^\s+|\s+$/g, '') : range.trim();
                    if (range[0] == ("NAN") || range[0] == ("-NAN") || range[0] == ("INFINITY") || range[0] == ("-INFINITY") || range[0] == ("#") || range[0] == ("n#"))
                        return this.getValueFromArg(argsArray[1]);
                }
                range = argsArray[0];

                range = this.getValueFromArg(range).toUpperCase().split(this.tic).join(this._string_empty);
            } catch (ex) {
                range = range.toUpperCase();
            }
            if (range[0] == ("NAN") || range[0] == ("-NAN") || range[0] == ("INFINITY") || range[0] == ("-INFINITY") || range[0] == ("#") || range[0] == ("n#"))
                return this.getValueFromArg(argsArray[1]);
            else
                return this.getValueFromArg(argsArray[0]);
        };
        this.computeIfNA = function (range) {
            var args = this.splitArgsPreservingQuotedCommas(range);
            var argCount = args.length, arg1 = this._string_empty, index = -1, result;
            if (argCount != 2) {
                return this.getFormulaErrorStrings();
            }

            if (this.computeIsNA(args[0]) == this.trueValueStr) {
                if ((this.tic.indexOf(args[1]) == -1) && !this._isCellReference(args[1]) && !(result = this._parseDouble(args[0])) && !this.namedRanges.containsKey(args[1])) {
                    return this.getErrorStrings()[5].toString();
                    ;
                }
                arg1 = this.getValueFromArg(args[1]);
            } else {
                if (this._isRange(args[0])) {
                    arg1 = this.getErrorStrings()[1].toString();
                } else {
                    if ((this.tic.indexOf(args[0]) == -1) && !this._isCellReference(args[0]) && !(result = this._parseDouble(args[0])) && !this.NamedRanges.ContainsKey(args[0])) {
                        return this.getErrorStrings()[5].toString();
                    }
                    arg1 = this.getValueFromArg(args[0]);
                }
            }
            if (arg1[0] == this.tic && arg1[length - 1] == this.tic) {
                arg1 = this.substring(arg1, 1, arg1.length - 2);
            }
            return arg1;
        };
        this.computeNot = function (args) {
            var s = args;
            var d1;
            var array1 = [this.getParseArgumentSeparator, ':'];

            //var array1 = [this.getParseArgumentSeparator()];
            ////parsed formula
            if ((args.length > 0) && this._indexOfAny(args, array1) > -1) {
                return this.getFormulaErrorStrings();
            } else {
                try {
                    s = this.getValueFromArg(s);
                    if (s == this.trueValueStr) {
                        s = this.falseValueStr;
                    } else if (s == this.falseValueStr) {
                        s = this.trueValueStr;
                    } else if (d1 = this._parseDouble(s)) {
                        ////Flip the value.
                        if (Math.abs(d1) > 1e-10) {
                            s = this.falseValueStr;
                        } else {
                            s = this.trueValueStr;
                        }
                    }
                } catch (ex) {
                    if (this.rethrowLibraryComputationExceptions && this.getLibraryComputationException != null) {
                        throw this.getLibraryComputationException;
                    }

                    return ex;
                }
            }

            return s;
        };
        this.computeOr = function (args) {
            var sum = this.falseValueStr;
            var s1;
            var d;

            // args = this.adjustRangeArg(args);
            var ranges = this.splitArgsPreservingQuotedCommas(args);
            for (var r = 0; r < ranges.length; r++) {
                ////is a cellrange
                if (ranges[r].indexOf(':') > -1 && this._isCellReference(r)) {
                    cells = this.getCellsFromArgs(ranges[r]);
                    for (var s = 0; s < cells.length; s++) {
                        try {
                            s1 = this.getValueFromArg(cells[s]);
                        } catch (ex) {
                            if (this.rethrowLibraryComputationExceptions && this.getLibraryComputationException != null) {
                                throw this.getLibraryComputationException;
                            }

                            return ex;
                        }
                        sum |= (s1 == this.trueValueStr) || (d == this._parseDouble(s1) && d != 0);
                    }
                } else {
                    try {
                        s1 = this.getValueFromArg(ranges[r]);
                    } catch (ex) {
                        if (this.rethrowLibraryComputationExceptions && this.getLibraryComputationException != null) {
                            throw this.getLibraryComputationException;
                        }

                        return ex;
                    }

                    sum |= (s1 == this.trueValueStr) || (d == this._parseDouble(s1) && d != 0);
                }
            }
            return sum ? this.trueValueStr : this.falseValueStr;
        };
        this.computeTrue = function (empty) {
            return this.trueValueStr;
        };
        this.computeXor = function (arg) {
            var sum = false, s1, d;

            // range = this.adjustRangeArg;
            var ranges = this.splitArgsPreservingQuotedCommas(arg);
            for (var r = 0; r < ranges.length; r++) {
                ////is a cellrange
                if (ranges[r].indexOf(':') > -1 && this._isCellReference(r)) {
                    var cells =this.getCellsFromArgs(ranges[r])
                    for (var s = 0; s < cells.length; s++) {
                        try {
                            s1 = this.getValueFromArg(cells[s]);
                        } catch (ex) {
                            if (this.rethrowLibraryComputationExceptions && this.getLibraryComputationException != null) {
                                throw this.getLibraryComputationException;
                            }

                            return ex;
                        }

                        sum = (s1 == this.trueValueStr) || (d == this._parseDouble(s1) && (d != 0));
                    }
                } else {
                    try {
                        s1 = this.getValueFromArg(ranges[r]);
                    } catch (ex) {
                        if (this.rethrowLibraryComputationExceptions && this.getLibraryComputationException != null) {
                            throw this.getLibraryComputationException;
                        }

                        return ex;
                    }

                    sum = (s1 == this.trueValueStr) || (d == this._parseDouble(s1)) && (d != 0);
                }
            }
            return sum ? this.trueValueStr : this.falseValueStr;
        };

        this.computeCell = function (arg) {
            var args = this.splitArgsPreservingQuotedCommas(arg);
            if (args.length > 2) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var reference = "";
            if (args.length == 2) {
                if (!this._isCellReference(args[1]) && !this.namedRanges.containsKey(args[1])) {
                    if (this.getRethrowLibraryComputationExceptions())
                        throw this.formulaErrorStrings[this._bad_formula];
                    return this.getErrorStrings()[5].toString();
                }
                reference = args[1];
            } else {
                reference = this.cell;
            }
            var type = args[0].split(this.tic).join(this._string_empty).toLowerCase(), result = "";
            switch (type) {
                case "address":
                    result = this.rowIndex(reference).toString() + this.getParseArgumentSeparator() + this.colIndex(reference).toString();
                    result = this.computeAddress(result);
                    break;
                case "col":
                    result = this.computeColumn(reference);
                    break;
                case "color":
                    break;
                case "contents":
                    result = this.getValueFromArg(reference);
                    break;
                case "filename":
                    result = "Not Supported";
                    break;
                case "format":
                    break;
                case "parentheses":
                    break;
                case "prefix":
                    break;
                case "protect":
                    break;
                case "row":
                    result = this.computeRow(reference);
                    break;
                case "type":
                    if (this.computeIsBlank(reference) == this.trueValueStr)
                        result = "b";
                    else if (this.computeIsText(reference) == this.trueValueStr)
                        result = "l";
                    else
                        result = "v";
                    break;
                case "width":
                    break;
                default:
                    break;
            }
            return result.toString();
        };
        this.computeErrorType = function (args) {
            var cellReference = this._string_empty;
            var arg = this._splitArguments(args, this.getParseArgumentSeparator());
            var argCount = arg.length;
            if (argCount != 1) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            if (this._isCellReference(args)) {
                cellReference = this.getValueFromArg(args);
            } else {
                cellReference = args;
            }
            if (cellReference.length > 1 && cellReference[0] == this.tic[0] && cellReference[cellReference.length - 1] == this.tic[0]) {
                return "#N/A";
            }
            if (cellReference == "#NULL!")
                return "1";
            else if (cellReference == "#DIV/0!")
                return "2";
            else if (cellReference == "#VALUE!")
                return "3";
            else if (cellReference == "#REF!")
                return "4";
            else if (cellReference == "#NAME?")
                return "5";
            else if (cellReference == "#NUM!")
                return "6";
            else if (cellReference == "#N/A")
                return "7";
            else if (cellReference == "#GETTING_DATA")
                return "8";
            return "#N/A";
        };
        this.computeInfo = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            if (argCount != 1 || argList=="") {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var firstStr = this._stripTics0(this.getValueFromArg(args[0])).toLowerCase();
            var result = this._string_empty;
            switch (firstStr) {
                case "directory":
                    result = window.location.toString();
                    break;
                case "numfile":
                    if (this.getSortedSheetNames() != null && CalcEngine._sheetFamiliesList.length == 0)
                        result = this.getSortedSheetNames().length.toString();
                    else
                        result = "1";
                    break;
                case "origin":
                    var cell = this.rowIndex(this.cell).toString() + this.getParseArgumentSeparator() + this.colIndex(this.cell).toString();
                    result = "$A: " + this.computeAddress(cell);
                    break;
                case "osversion":
                    result = navigator.platform.toString();
                    break;
                case "recalc":
                    if (this._alwaysComputeDuringRefresh)
                        result = "Automatic";
                    else
                        result = "Manual";
                    break;
                case "release":
                    result = this.System.Reflection.Assembly.GetExecutingAssembly().GetName().Version.toString();
                    break;
                case "system":
                    switch (navigator.appVersion.indexOf()) {
                        case navigator.platform:
                            result = "unix";
                            break;
                        case navigator.platform:
                            result = "mac";
                            break;
                        default:
                            result = "pcdos";
                            break;
                    }
                    break;
                default:
                    if (this.getRethrowLibraryComputationExceptions())
                        throw this.formulaErrorStrings[this._bad_formula];
                    return this.getErrorStrings()[1].toString();
            }
            return result;
        };
        this.computeIsBlank = function (args) {

            var arg = this.splitArgsPreservingQuotedCommas(args);
            var argCount = arg.length;
            if (argCount != 1 || args == "") {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            if (this.getValueFromArg(args) == "") {
                return this.trueValueStr;
            }
            return this.falseValueStr;
        };
        this.computeIsErr = function (range) {
            var arg = this.splitArgsPreservingQuotedCommas(range);
            var argCount = arg.length;
            if (argCount != 1 || range == "") {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            range = this.getValueFromArg(range).toUpperCase().split(this.tic).join(this._string_empty);
            if (range.count > 1) {

            }
            if ((range == ("NAN") || range == ("-NAN") || range == ("INFINITY") || range == ("-INFINITY") || range == ("#") || range == ("n#")) && !(range == ("#N/A"))) {
                return this.trueValueStr;
            } else {
                return this.falseValueStr;
            }
        };

        this.computeIsError = function (range) {

            var arg = this.splitArgsPreservingQuotedCommas(range);
            var argCount = arg.length;
            if (argCount != 1 || range == "") {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            try {
                range = this.getValueFromArg(range).toUpperCase().split(this.tic).join(this._string_empty);
            }
            catch (ex) {
                return this.trueValueStr;
            }
            if (range.indexOf("NAN") == 0 || range.indexOf("-NAN") == 0 || range.indexOf("INFINITY") == 0 || range.indexOf("-INFINITY") == 1 || range.indexOf("#") == 0 || range.indexOf("n#") == 0) {
                return this.trueValueStr;
            } else {
                return this.falseValueStr;
            }
        };

        this.computeIsEven = function (args) {
            var cellReference = this._string_empty;
            var val = 0.0;
            var arg = this.splitArgsPreservingQuotedCommas(args);
            var argCount = arg.length;
            if (argCount != 1 || args == "") {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var argVal = this.getValueFromArg(arg[0]);
            var value = parseInt(argVal.split(this.tic).join(""));
            if (isNaN(value)) {
                if (this._rethrowLibraryComputationExceptions)
                    throw this.formulaErrorStrings[this._bad_formula];
                return (argVal[0] == this.tic || this._isCellReference(arg[0])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
            }
            var dt = new Date(Date.parse(argVal));
            if (isNaN(value) && dt.toString() != "invalid Date") {
                value = this._toOADate(dt);
            }
            var result = value;
            if (result % 2 == 0) {
                return this.trueValueStr;
            }
            return this.falseValueStr;
        };
        this.computeIsFormula = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            var value = this._string_empty;
            if (argCount != 1) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            value = this.getValueFromArg(args[0]);
            if (this.namedRanges.containsValue(value)) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[1].toString();
            }
            var intVal = parseInt(value.split(this.tic).join(""));
            if (isNaN(intVal) || !this._isCellReference(args[0])) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[5].toString();
            }
            var family = CalcEngine.getSheetFamilyItem(this.grid);
            if (this.isSheetMember() && family.parentObjectToToken != null) {
                args[0] = family.parentObjectToToken.getItem(this.grid) + args[0];
            }
            if (this.getFormulaInfoTable().containsKey(args[0])) {
                return this.trueValueStr;
            } else {
                return this.falseValueStr;
            }
        };
        this.computeIsLogical = function (args) {

            args = this.getValueFromArg(args);
            if (args == this.falseValueStr || args == this.trueValueStr) {
                return this.trueValueStr;
            }
            return this.falseValueStr;
        };
        this.computeIsNA = function (args) {
            if (this.getErrorStrings().indexOf(args.toUpperCase()) != -1) {
                if (args.toUpperCase() == ("#N/A")) {
                    return this.trueValueStr;
                } else {
                    return this.falseValueStr;
                }
            }
            try {
                args = this.getValueFromArg(args).toUpperCase();
            } catch (ex) {
                return this.falseValueStr;
            }
            if (args[0] == ("#N/A")) {
                return this.trueValueStr;
            }
            return this.falseValueStr;
        };
        this.computeIsNonText = function (args) {
            if (this.computeIsText(args) == this.trueValueStr) {
                return this.falseValueStr;
            } else {
                return this.trueValueStr;
            }
        };
        this.computeIsNumber = function (range) {
            var d;
            range = this.getValueFromArg(range);
            if (!isNaN(this._parseDouble(range))) {
                return this.trueValueStr;
            } else {
                return this.falseValueStr;
            }
        };
        this.computeIsRef = function (args) {
            var arg = this.splitArgsPreservingQuotedCommas(args);
            if (arg.length != 1) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            return ((this.namedRanges.containsKey(args) || this._isCellReference(args)) && args[0] != (this.tic) && args[length - 1] != (this.tic)).toString().toUpperCase();
        };
        this.computeIsOdd = function (args) {
            var cellReference = this._string_empty;
            var val = 0.0;
            var arg = this._splitArguments(args, this.getParseArgumentSeparator());
            var argCount = arg.length;
            var array1 = [this.getParseArgumentSeparator(), ':'];
            if (argCount != 1) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            if (args != this._string_empty) {
                if (this._indexOfAny(args, array1) != -1) {
                    return "#VALUE!";
                }
                cellReference = this.getValueFromArg(arg[0]);
                val = parseInt(cellReference.split(this.tic).join(this._string_empty))
                if (isNaN(val)) {
                    if (this._rethrowLibraryComputationExceptions)
                        throw this.formulaErrorStrings[this._bad_formula];
                    return (cellReference[0] == this.tic || this._isCellReference(arg[0])) ? this.getErrorStrings()[1].toString() : this.getErrorStrings()[5].toString();
                }
                if (val % 2 != 0) {
                    return this.trueValueStr;
                }
                return this.falseValueStr;
            }
            return this.trueValueStr;
        };
        this.computeIsText = function (args) {
            var isCell = this._isCellReference(args);
            var s = (isCell) ? this.getValueFromArg(args) : args;
            if ((isCell || s[0] == this.tic) && s.length > 0 && isNaN(this._parseDouble(s))) {
                return this.trueValueStr;
            } else {
                return this.falseValueStr;
            }
        };
        this.computeN = function (args) {
            var cellReference = this._string_empty;
            var val = 0.0;
            var date;
            var arg = this._splitArguments(args, this.getParseArgumentSeparator());
            var argCount = arg.length;
            if (argCount != 1) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            
            cellReference = this.getValueFromArg(args);
            date = new Date(Date.parse(cellReference));
            if (this._parseDouble(cellReference))
            {
                val = this._parseDouble(cellReference);
                return val.toString();
            }
            else if (new Date(Date.parse(cellReference)))
           {
                val = this._getSerialDateTimeFromDate(date);
           }
            if (cellReference == this.trueValueStr) {
                val = 1;
            }
            else if (cellReference == this.falseValueStr) {
                val = 0;
            }
            else if (this.getErrorStrings().indexOf(cellReference) > -1 || this.formulaErrorStrings.indexOf(cellReference) > -1) {
                return cellReference;
            }
            else if (!isNaN(val)) {
                return val.toString();
            }
            else {
                return "0";
            }

            return val.toString();
        };
        this.computeNA = function () {
            return "#N/A";
        };
        this.computeSheet = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            var value = this._string_empty;
            if (argCount > 1) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var cellReference = args[0].toUpperCase();
            cellReference = (cellReference == null || cellReference == this._string_empty) ? this.cell : cellReference;
            if (cellReference == null || cellReference == this._string_empty) {
                return "1";
            }
            if (this.getErrorStrings().indexOf(cellReference)>-1) {
                return cellReference;
            }
            if (!this._isCellReference(cellReference) && !this.namedRanges.containsKey(cellReference) && this.getSortedSheetNames().indexOf(cellReference) == -1) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[0].toString();
            }
            var family = this.getSheetFamilyItem(this.grid);
            var sheet1 = this._getSheetTokenFromReference(cellReference);
            var sheetNumber = 0;
            if ((sheet1 == null || sheet1 == this._string_empty) && this.getSortedSheetNames().indexOf(cellReference) == -1 && !cellReference.indexOf(this.sheetToken.toString())) {
                sheetNumber = this.getSheetID(this.grid) + 1;
            } else if (sheet1.length > 0) {
                sheetNumber = parseInt(sheet1.Replace(this.sheetToken.split(this.tic).join(this._string_empty))) + 1;
            } else {
                try {

                    for (var s = 0; s < family.tokenToParentObject().length; s++){
                        if (family.sheetNameToParentObject[cellReference].Equals(family.tokenToParentObject()[s].Value)) {
                            var gg = griddata.Value;
                            sheetNumber = this.getSheetID(gg) + 1;
                            break;
                        }
                    }
                } catch (ex) {
                    if (this.getRethrowLibraryComputationExceptions())
                        throw this.formulaErrorStrings[this._bad_formula];
                    return this.getErrorStrings()[2].toString();
                }
            }
            return sheetNumber.toString();
        };
        this.computeSheets = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            var value = this._string_empty;
            if (argCount > 1) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var sheetNumber = 0;
            var cellReference = args[0].toUpperCase();
            if (this.getErrorStrings().indexOf(cellReference) > -1) {
                return cellReference;
            }
            if (cellReference == null || cellReference == this._string_empty) {
                return this.getSortedSheetNames().length.toString();
            }
            else if (cellReference.split(this.tic).join(this._string_empty) == "") {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[5].toString();
            } else if (!this._isCellReference(cellReference) && !this.namedRanges.containsKey(cellReference) && this.getSortedSheetNames().indexOf(cellReference) == -1) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._bad_formula];
                return this.getErrorStrings()[5].toString();
            }
            try {
                var sheetsCount = this._splitArguments(cellReference, '!');
                sheetNumber = (sheetsCount.length - 1) / 2;
                if (sheetNumber == 0) {
                    if (this.getRethrowLibraryComputationExceptions())
                        throw this.formulaErrorStrings[this._bad_formula];
                    return this.getErrorStrings()[5].toString();
                }
            } catch (ex) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.getErrorStrings()[2].toString();
                return this.getErrorStrings()[2].toString();
            }
            return sheetNumber.toString();
        };
        this.computeType = function (argList) {
            var args = this.splitArgsPreservingQuotedCommas(argList);
            var argCount = args.length;
            var result = 0;
            if (argCount != 1) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            var text = this.getValueFromArg(args[0]);
            if (text == null || text == this._string_empty) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.getErrorStrings()[1].toString();
                return this.getErrorStrings()[1].toString();
            } else if (argList.indexOf(this.getParseArgumentSeparator()) > -1) {
                result = 64;
            } else if (this.computeIsNumber(text) == this.trueValueStr) {
                result = 1;
            } else if (this.computeIsLogical(text) == this.trueValueStr) {
                result = 4;
            } else if (this.getErrorStrings().indexOf(text) > -1) {
                result = 16;
            } else if (this.computeIsText(text) == this.trueValueStr) {
                result = 2;
            }
            return result.toString();
        };
        
        this.computeRow = function (arg) {
            var args = this.splitArgsPreservingQuotedCommas(arg);
            var argCount = args.length;
            if (argCount != 1) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            if (args[0] == this._string_empty) {
                return this.rowIndex(this.cell).toString();
            }
            if (!this._isCellReference(args[0]) && !this.namedRanges.containsKey(args[0])) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.getErrorStrings()[4].toString();
                return this.getErrorStrings()[4].toString();
            }
            if (arg.indexOf(':') > -1) {
                arg = this.getCellsFromArgs(arg)[0]; //considers first cell reference from the range of cells.
            }
            return this.rowIndex(arg).toString();
        };
        this.computeRows = function (arg) {
            var args = this.splitArgsPreservingQuotedCommas(arg);
            if (args.length != 1) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.formulaErrorStrings[this._wrong_number_arguments];
                return this.formulaErrorStrings[this._wrong_number_arguments];
            }
            if (!this._isCellReference(args[0]) && arg.indexOf(';') == -1) {
                if (this.getRethrowLibraryComputationExceptions())
                    throw this.getErrorStrings()[4].toString();
                return this.getErrorStrings()[4].toString();
            }
            var firstRow, LastRow, totalRows = 1;
            if (args[0].indexOf(':') > -1) {
                var cells = this.getCellsFromArgs(arg);
                firstRow = this.rowIndex(cells[0].toString());
                LastRow = this.rowIndex(cells[cells.length - 1].toString());
                totalRows = LastRow - firstRow + 1;
                totalRows = (totalRows > 0) ? totalRows : 1;
            } else if (args[0].indexOf(';') > -1) {
                var arrayArg = this._splitArguments(arg.split(this.tic).join(this._string_empty), ';');
                for (var i = 1; i < arrayArg.length; i++) {
                    if (this.splitArgsPreservingQuotedCommas(arrayArg[i - 1]).length != this.splitArgsPreservingQuotedCommas(arrayArg[1]).length) {
                        if (this.getRethrowLibraryComputationExceptions())
                            throw this.getErrorStrings()[4].toString();
                        return this.getErrorStrings()[4].toString();
                    }
                    totalRows = arrayArg.length;
                }
            }
            return totalRows.toString();
        };


        //this.grid.wireParentObject();
        this._initLibraryFunctions();
        //var _rangeInfo = new RangeInfo();
    }



    CalcEngine.CalcEngine = function () {
    };

    CalcEngine.getFormulaCharacter= function () {
        if (this._formulaChar == '\0') {
            this._formulaChar = '=';
        }

        return this._formulaChar;
    };

    CalcEngine._formulaChar = '=';

    CalcEngine.sheetFamilyID = 0;
    CalcEngine._tokenCount = 0;
    CalcEngine.modelToSheetID = null;
    CalcEngine._sheetFamiliesList = null;

    CalcEngine._defaultFamilyItem = null;

    CalcEngine.createSheetFamilyID = function () {
        if (this.sheetFamilyID == Number.MAX_SAFE_INTEGER) {
            this.sheetFamilyID = Number.MIN_SAFE_INTEGER;
        }
        return this.sheetFamilyID++;
    };

    CalcEngine.getSheetFamilyItem = function (model) {
        if (this.sheetFamilyID == 0) {
            if (CalcEngine._defaultFamilyItem == null) {
                CalcEngine._defaultFamilyItem = new GridSheetFamilyItem();
            }

            return CalcEngine._defaultFamilyItem;
        }

        if (CalcEngine._sheetFamiliesList == null) {
            CalcEngine._sheetFamiliesList = new HashTable();
        }

        var i = CalcEngine.modelToSheetID.getItem(model);

        if (!CalcEngine._sheetFamiliesList.containsKey(i)) {
            CalcEngine._sheetFamiliesList.add(i, new GridSheetFamilyItem());
        }

        return CalcEngine._sheetFamiliesList.getItem(i);
    };

    CalcEngine.resetSheetFamilyID = function () {
        this.sheetFamilyID = 0;

        if (CalcEngine.modelToSheetID != null) {
            CalcEngine.modelToSheetID.clear();
            CalcEngine.modelToSheetID = null;
        }

        if (CalcEngine._sheetFamiliesList != null) {
            CalcEngine._sheetFamiliesList.clear();
            CalcEngine._sheetFamiliesList = null;

            //Fix for defect #12445.
            this.resetSheetIDs();
        }
    };

    CalcEngine.resetSheetIDs = function () {
        this._tokenCount = 0;
    };

    CalcEngine.unregisterGridAsSheet = function (refName, model) {
        var family = CalcEngine.getSheetFamilyItem(model);
        var refName1 = refName.toUpperCase();
        if (family.sheetNameToParentObject != null && family.sheetNameToParentObject.containsKey(refName1)) {
            family.sheetNameToParentObject.remove(refName1);
            var token = family.sheetNameToToken.getItem(refName1);
            family.sheetNameToToken.remove(refName1);
            family.tokenToParentObject.remove(token);
            family.parentObjectToToken.remove(model);
        }
    };
    return CalcEngine;
})(jQuery, Syncfusion);

var LookupCachingMode;
(function (LookupCachingMode) {
    LookupCachingMode[LookupCachingMode["None"] = 0] = "None";
    LookupCachingMode[LookupCachingMode["VLOOKUP"] = 1] = "VLOOKUP";
    LookupCachingMode[LookupCachingMode["HLOOKUP"] = 2] = "HLOOKUP";
    LookupCachingMode[LookupCachingMode["Both"] = 3] = "Both";
    LookupCachingMode[LookupCachingMode["OptimizeForMatches"] = 4] = "OptimizeForMatches";
})(LookupCachingMode || (LookupCachingMode = {}));
;

var FormulaInfoSetAction;
(function (FormulaInfoSetAction) {
    FormulaInfoSetAction[FormulaInfoSetAction["FormulaSet"] = 0] = "FormulaSet";
    FormulaInfoSetAction[FormulaInfoSetAction["NonFormulaSet"] = 1] = "NonFormulaSet";
    FormulaInfoSetAction[FormulaInfoSetAction["CalculatedValueSet"] = 2] = "CalculatedValueSet";
})(FormulaInfoSetAction || (FormulaInfoSetAction = {}));
;

var CalcQuickBase = (function () {
    /// <summary>
    /// Constructor that resets the CalcEngine object.
    /// </summary>
    /// <param name="resetStaticMembers">
    /// Indicates whether the static members of the CalcEngine class will be cleared.</param>
    function CalcQuickBase(resetStaticMembers) {
        this.resetStaticMembers = resetStaticMembers;
        this._calcQuickID = 0;
        this._controlModifiedFlags = null;
        this._dataStore = null;
        this._engine = new Object;
        this._keyToRowsMap = null;
        this._keyToVectors = null;
        this._nameToControlMap = null;
        this._rowsToKeyMap = null;
        this._isValueSetEventChanged = false;
        this._autoCalc = false;
        this._isIE8 = false;
        // Used internally to name the calcsheets.
        this._cellPrefix = "!0!A";
        this._checkKeys = true;
        this._disposeEngineResource = true;
        this._ignoreChanges = false;
        this._leftBrace = "{";
        this._tic = "\"";
        ////Used to change the Hashtable key references to
        ////row,col references needed by the CalcEngine.
        ////Every key is swapped for a reference like A1 or A2 or A14.
        this._leftBracket = "[";
        this._rightBracket = "]";
        this._validLeftChars = "+-*/><=^(&,";
        this._validRightChars = "+-*/><=^)&,";
        this.getKeyValue = function (key) {
            key = key.toUpperCase();

            if (this.getDataStore().containsKey(key)) {
                var fInfo = this.getDataStore().getItem(key);
                var s = fInfo.getFormulaText();
                if (s.length > 0 && s[0] == CalcEngine.getFormulaCharacter() && fInfo.calcID != this.getEngine().getCalcID()) {
                    this.getEngine().cell = this._cellPrefix + this.getKeyToRowsMap().getItem(key).toString();

                    s = s.substring(1); ////strip out formulaChar.

                    try {
                        fInfo.setParsedFormula(this.getEngine().parseFormula(this._markKeys(s)));
                        ;
                    } catch (ex) {
                        if (this.getCheckKeys()) {
                            fInfo.setFormulaValue(ex.Message);
                            fInfo.calcID = this.getEngine().getCalcID();

                            if (this._valueSetEvent != null) {
                                this._valueSetEvent.trigger(this, new ValueSetEventArgs(key, fInfo.getFormulaValue(), 2 /* CalculatedValueSet */));
                            }

                            return this.getDataStore().getItem(key).getFormulaValue();
                        }
                    }

                    try {
                        fInfo.setFormulaValue(this.getEngine().computeFormula(fInfo.getParsedFormula()));
                    } catch (ex) {
                        if (this.getThrowCircularException() && ex.toString().indexOf(this.getEngine().formulaErrorStrings[this.getEngine().circular_reference_]) == 0) {
                            throw ex;
                        }
                    }

                    fInfo.calcID = this.getEngine().getCalcID();

                    if (this._valueSetEvent != null) {
                        this._valueSetEvent.trigger(this, new ValueSetEventArgs(key, fInfo.getFormulaValue(), 2 /* CalculatedValueSet */));
                    }
                }
                if (this.getEngine().getThrowCircularException()) {
                    if (this.getEngine().getIterationMaxCount() > 0) {
                        fInfo.setFormulaValue(this.getEngine().handleIteration(this.getEngine().cell, fInfo));
                    }
                }
                return this.getDataStore().getItem(key).getFormulaValue();
            } else if (this.getKeyToVectors().containsKey(key)) {
                return this.getKeyToVectors().getItem(key).toString();
            } else {
                return "";
            }
        };
        this.setKeyValue = function (key, value) {
            key = key.toUpperCase();
            var s = (this._isIE8) ? value.toString().replace(/^\s+|\s+$/g, '') : value.toString().trim();

            if (!this.getDataStore().containsKey(key) || s.indexOf(this._leftBrace) == 0) {
                ////support for vectors
                if (s.indexOf(this._leftBrace) == 0) {
                    if (!this.getKeyToVectors().containsKey(key)) {
                        this.getKeyToVectors().add(key, "");
                    }

                    s = s.substring(1, s.length - 2);
                    var i = this.getKeyToRowsMap().length + 1;
                    var ss = s.split(this.getEngine().getParseArgumentSeparator());
                    var range = "A" + i + ":A" + (i + ss.length - 1);
                    this.getKeyToVectors()[key] = range;
                    for (var index = 0; index < ss.length; index++) {
                        var key1 = "Q_" + (this.getKeyToRowsMap().length + 1);
                        this.getDataStore().add(key1, new FormulaInfo());
                        this.getKeyToRowsMap().add(key1, this.getKeyToRowsMap().length + 1);
                        this.getRowsToKeyMap().add(this.getRowsToKeyMap().length + 1, key1);

                        var fInfo1 = this.getDataStore().getItem(key1);
                        fInfo1.setFormulaText("");
                        fInfo1.setParsedFormula("");

                        ////fInfo1.FormulaValue = s1;
                        fInfo1.setFormulaValue(this.parseAndCompute(ss[index]));
                    }

                    return;
                } else {
                    this.getDataStore().add(key, new FormulaInfo());
                    this.getKeyToRowsMap().add(key, this.getKeyToRowsMap().length + 1);
                    this.getRowsToKeyMap().add(this.getRowsToKeyMap().length + 1, key);
                }
            }

            if (this.getKeyToVectors().containsKey(key)) {
                this.getKeyToVectors().remove(key);
            }
            var fInfo = this.getDataStore().getItem(key);

            if (!this.ignoreChanges && fInfo.getFormulaText() != null && fInfo.getFormulaText().length > 0 && fInfo.getFormulaText() != s) {
                ////Reset its dependencies if there are any...
                var s1 = this._cellPrefix+ this.getKeyToRowsMap().getItem(key).toString();
                var ht = this.getEngine().getDependentFormulaCells().getItem(s1);
                if (ht != null) {
                    this.getEngine().clearFormulaDependentCells(s1);
                }
            }

            if (s.length > 0 && s[0] == CalcEngine.getFormulaCharacter()) {
                fInfo.setFormulaText(s);
                if (this._valueSetEvent != null) {
                    this._valueSetEvent.trigger(this, new ValueSetEventArgs(key, fInfo.getFormulaValue(), 2 /* CalculatedValueSet */));
                }
            } else if (fInfo.getFormulaValue() != s) {
                fInfo.setFormulaText("");
                fInfo.setParsedFormula("");
                fInfo.setFormulaValue(s);
                if (this._valueSetEvent != null) {
                    this._valueSetEvent.trigger(this, new ValueSetEventArgs(key, fInfo.getFormulaValue(), 2 /* CalculatedValueSet */));
                }
            }

            if (this.getAutoCalc()) {
                this.updateDependencies(key);
            }
        };
        /// <summary>
        /// A method to reset all the keys registered with CalcQuickBase object.
        /// </summary>
        this.resetKeys = function () {
            this.getDataStore().clear();
            this.getKeyToRowsMap().clear();
            this.getRowsToKeyMap().clear();
            this.getKeyToVectors().clear();
            this.getNameToControlMap().clear();
        };
        this._checkAdjacentPiece = function (s, validChars, first) {
            var b = true;
            s = (this._isIE8) ? s.replace(/^\s+|\s+$/g, '') : s.trim();
            if (s.length > 0) {
                b = validChars.indexOf(s[first ? 0 : s.length - 1]) > -1;
            }

            return b;
        };
        /// <summary>
        /// Creates the <see cref="CalcEngine"/> object used by this CalQuick object.
        /// </summary>
        /// <returns>Returns an instance of a CalcEngine object.</returns>
        /// <remarks>You can override this method and return a derived CalcEngine object use
        /// by the derived CalcQuick object.
        /// </remarks>
        this.createEngine = function () {
            return new CalcEngine(this);
        };
        this.dispose = function () {
            this._dataStore = null;
            this._rowsToKeyMap = null;
            this._keyToRowsMap = null;
            this._keyToVectors = null;

            this._controlModifiedFlags = null;
            this._nameToControlMap = null;

            //this.ValueChanged -= new ValueChangedEventHandler(this._engine.grid_ValueChanged);
            if (this.getDisposeEngineResource()) {
                ////CalcEngine.ResetSheetFamilyID();
                this._engine.getDependentFormulaCells().clear();
                this._engine.getDependentCells().clear();

                if (this._engine != null) {
                    this._engine.dispose();
                }

                this._engine = null;
            }
        };
        /// <summary>
        /// A method that parses and computes a well-formed algebraic expression passed in.
        /// </summary>
        /// <param name="formulaText">The text of the formula.</param>
        /// <returns>The computed value.</returns>
        /// <remarks>You would use this method if you have a formula string which
        /// contains only constants or library function references. Such formulas
        /// do not depend upon other values. If you have registered a variable through
        /// an indexer, then that variable can be used in a formula expression passed into this
        /// method. This method will return the Exception text if an exception is thrown
        /// during the computation.
        /// </remarks>
        this.tryParseAndCompute = function (formulaText) {
            var ret = "";
            try {
                ret = this.parseAndCompute(formulaText);
            } catch (ex) {
                ret = ex.message;
            }

            return ret;
        };
        /// <summary>
        /// A method that returns the formula string associated with the key passed in from a FormulaInfo object.
        /// </summary>
        /// <param name="key">The Hashtable key associated with the FormulaInfo object.</param>
        /// <returns>The formula string may be the empty string if no formula is stored with this key.</returns>
        this.getFormula = function (key) {
            key = key.toUpperCase();
            if (this.getDataStore().containsKey(key)) {
                return this.getDataStore().getItem(key).getFormulaText();
            }

            return "";
            ;
        };
        /// <summary>
        /// A method to get the value of the cell referred. For internal CalcQuick use only.
        /// </summary>
        /// <param name="row">Row index.</param>
        /// <param name="col">Column index.</param>
        /// <returns>(row, col) data.</returns>
        /// <remarks>
        /// CalcQuick does not expose a (row, col) data access model.
        /// But since CalcEngine requires such a model, CalcQuick uses
        /// a row, col access model internally, but only exposes the
        /// formula Key model to access values.
        /// </remarks>
        this.getValueRowCol = function (grid, row, col) {
            ////CalcQuick objects do not expose a row, col data access model.
            ////But the CalcEngine requires such a model. So, CalcQuick uses
            ////a row, col access model internally, but only exposes using
            ////formula Key values to access formulas.
            var key = this.getRowsToKeyMap().getItem(row).toString();
            var s = this.getKeyValue(key).toString();
            if (s != null && s[s.length - 1] == ("%") && s.length > 1) {
                var d = this.parseDouble(s.substring(0, s.length - 1));
                if (isNaN(d)) {
                    s = (Number(d) / 100).toString();
                }
            }

            return s;
        };
        /// <summary>
        /// Initializes any structures needed by this instance.
        /// </summary>
        /// <param name="resetStaticMembers">
        /// Indicates whether the static members of the CalcEngine class will be cleared.</param>
        this.initCalcQuick = function (resetStaticMembers) {
            this._dataStore = new HashTable();
            this._rowsToKeyMap = new HashTable();
            this._keyToRowsMap = new HashTable();
            this._keyToVectors = new HashTable();

            this._controlModifiedFlags = new HashTable();
            this._nameToControlMap = new HashTable();
            var i = CalcEngine.createSheetFamilyID();
            this._engine = this.createEngine();
            if (resetStaticMembers) {
                CalcEngine.resetSheetFamilyID();
                this._engine.getDependentFormulaCells().clear();
                this._engine.getDependentCells().clear();
            }

            
            this._cellPrefix= "!" + i + "!A";
            this._engine.registerGridAsSheet(RangeInfo.getAlphaLabel(this.getCalcQuickID()), this, i);

            ////By default, we will trigger the calculations locally,
            ////so turn off the engine calculating mechanism.
            this._engine.setCalculatingSuspended(true);
            this._engine.ignoreValueChanged = true;
            this._isIE8 = (ej.browserInfo().name == 'msie' && ej.browserInfo().version == '8.0') ? true : false;
        };
        /// <summary>
        /// Change the calcQuick keys into cell range. i.e mark the key A as A1
        /// </summary>
        /// <param name="formula">formula to compute value</param>
        /// <returns>marked fommula</returns>
        this._markKeys = function (formula) {
            var left = formula.indexOf(this._leftBracket);
            while (left > -1) {
                var len = formula.substring(left).indexOf(this._rightBracket) - 1;
                var key = "";

                if (len > 0) {
                    key = formula.substring(left + 1, len + left + 1).toUpperCase();
                    if (this.getKeyToVectors().containsKey(key)) {
                        var rightPiece = (left + len + 2 < formula.length) ? formula.substring(left + len + 2) : "";
                        if (this.getCheckKeys() && !this._checkAdjacentPiece(rightPiece, this._validRightChars, true)) {
                            throw "not followed properly" + key;
                        }

                        var leftPiece = (left > 0) ? formula.substring(0, left) : "";
                        if (this.getCheckKeys() && !this._checkAdjacentPiece(leftPiece, this._validLeftChars, false)) {
                            throw "not followed properly" + key;
                        }

                        formula = leftPiece + this.getKeyToVectors().getItem(key).toString() + rightPiece;
                        left = formula.indexOf(this._leftbraket);
                    } else if (this.getKeyToRowsMap().containsKey(key)) {
                        var rightPiece = (left + len + 2 < formula.length) ? formula.substring(left + len + 2) : "";
                        if (this.getCheckKeys() && !this._checkAdjacentPiece(rightPiece, this._validRightChars, true)) {
                            throw "not followed properly" + key;
                        }

                        var leftPiece = (left > 0) ? formula.substring(0, left) : "";
                        if (this.getCheckKeys() && !this._checkAdjacentPiece(leftPiece, this._validLeftChars, false)) {
                            throw "not followed properly" + key;
                        }

                        formula = leftPiece + "A" + this.getKeyToRowsMap().getItem(key).toString() + rightPiece;
                        left = formula.indexOf(this._leftBracket);
                    } else {
                        if (formula.toUpperCase().indexOf(this._tic + this._leftBracket + key + this._rightBracket + this.tic) > 0) {
                            break;
                        } else {
                            throw "Unknown key: " + key;
                        }
                    }
                } else {
                    left = -1;
                }
            }

            return formula;
        };
        /// <summary>
        /// A method that parses and computes a well-formed algebraic expression passed in.
        /// </summary>
        /// <param name="formulaText">The text of the formula.</param>
        /// <returns>The computed value.</returns>
        /// <remarks>You would use this method if you have a formula string which
        /// contains only constants or library function references. Such formulas
        /// do not depend upon other values. If you have registered a variable through
        /// an indexer, then that variable can be used in a formula expression passed into this
        /// method.
        /// </remarks>
        this.parseAndCompute = function (formulaText) {
            if (formulaText.length > 0 && formulaText[0] == this.getEngine().getFormulaCharacter()) {
                formulaText = formulaText.substring(1);
            }

            return this.getEngine().parseAndComputeFormula(this._markKeys(formulaText));
        };
        /// <summary>
        /// A method that recompute any formulas stored in the CalcQuick instance.
        /// </summary>
        /// <remarks>
        /// This method only has is used when AutoCalc is False. It loops through
        /// all FormulaInfo objects stored in the CalcQuick object and recomputes
        /// any formulas.
        /// </remarks>
        this.refreshAllCalculations = function () {
            if (!this.getAutoCalc()) {
                return;
            }

            this.setDirty();

            this.ignoreChanges = true;

            for (var keyIndex = 0; keyIndex < this.getDataStore().keys().length; keyIndex++) {
                var key = this.getDataStore().keys()[keyIndex];
                var fInfo = this.getDataStore().getItem(key);
                var s = fInfo.getFormulaText();
                if (s.length > 0 && s[0] == this.getEngine().getFormulaCharacter() && fInfo.calcID != this.getEngine().getCalcID()) {
                    s = s.substring(1); ////strip out formulaChar.
                    this.getEngine().cell = this._cellPrefix+ this.getKeyToRowsMap().getItem(key).toString();
                    fInfo.setParsedFormula(this.getEngine().parseFormula(this._markKeys(s)));
                    fInfo.setFormulaValue(this.getEngine().computeFormula(fInfo.getParsedFormula()));
                    fInfo.calcID = this.getEngine().getCalcID();
                    var rowNumber = parseInt(this.getKeyToRowsMap().getItem(key));
                    this.getEngine().valueChanged(this, new ValueChangedArgs(rowNumber, 1, fInfo.getFormulaValue()));
                }
                if (this._valueSetEvent != null) {
                    this._valueSetEvent.trigger(this, new ValueSetEventArgs(key, fInfo.getFormulaValue(), 2 /* CalculatedValueSet */));
                }
            }

            this.ignoreChanges = false;
        };
        /// <summary>
        /// A method to force all calculations to be performed the next time the CalcQuick object is
        /// accessed with an indexer requesting the value.
        /// </summary>
        /// <remarks>
        /// Each FormulaInfo object contained in the CalcQuick instance
        /// has a calculation index that is checked any time the computed value is needed. If this index
        /// is current, no calculation is done, and the last computed value is returned. If this index
        /// is not current, the calculation is redone before the value is returned. Calling this method
        /// guarantees that no FormulaInfo object's calculation indexes will be current.
        /// </remarks>
        this.setDirty = function () {
            this.getEngine().updateCalcID();
        };
        /// <summary>
        /// A method to set value to the specified cell. For internal CalcQuick use only.
        /// </summary>
        this.setValueRowCol = function (value, row, col) {
            ////No implementation code in this class.
            //// TODO:  Add CalcQuick.SetValueRowCol implementation
        };
        /// <summary>
        /// Loops through and updates all formula items that depend
        /// on the FormulaInfo object pointed to by the key.
        /// </summary>
        /// <param name="key">Identifies FormulaInfo object that triggered the update.</param>
        this.updateDependencies = function (key) {
            if (this.getAutoCalc()) {
                var s = this._cellPrefix+ this.getKeyToRowsMap().getItem(key).toString();
                var ht = this.getEngine().getDependentCells().getItem(s);
                this.setDirty();
                if (ht != null) {
                    for (var ind = 0; ind < ht.length; ind++) {
                        var i = ht[ind].indexOf('A');
                        if (i > -1) {
                            i = parseInt(ht[ind].substring(i + 1));
                            key = this.getRowsToKeyMap().getItem(i).toString();
                            this.ignoreChanges = true;
                            this.setKeyValue(key, this.getKeyValue(key)); ////triggers calculation in the getter
                            this.ignoreChanges = false;
                        }
                    }
                }
            }
        };
        this.initCalcQuick(resetStaticMembers);
    }
        /// <summary>
        /// A property that gets/sets the auto calculation mode of the CalcQuick.
        /// </summary>
        /// <remarks>
        /// By default, the CalcQuick will not update other values when you change
        /// a FormulaInfo object. By default, you explicitly call SetDirty()
        /// of the CalcQuick instance to force calculations to be done the next time
        /// they are required. Setting AutoCalc to True tells the CalcQuick to maintain
        /// the dependency information necessary to automatically update
        /// dependent formulas when values that affect these formulas change.
        /// </remarks>
    CalcQuickBase.prototype.getAutoCalc= function () {
        return this._autoCalc;
    };
    CalcQuickBase.prototype.setAutoCalc =  function (value) {
        this._autoCalc = value;
        this.getEngine().setCalculatingSuspended(!value);

        //this.getEngine().setIgnoreValueChanged(!value);
        this.getEngine().setUseDependencies(value);
        if (value) {
            this.setDirty();
        }
    };

        /// <summary>
        /// Get the calaQuick id of object.
        /// </summary>
    CalcQuickBase.prototype.getCalcQuickID= function () {
        this._calcQuickID++;
        if (this._calcQuickID == Number.MAX_VALUE) {
            this._calcQuickID = 1;
        }

        return this._calcQuickID;
    };

        /// <summary>
        /// Gets or sets whether formulas should be checked for syntax during key substitutions. Default is true.
        /// </summary>
    CalcQuickBase.prototype.getCheckKeys = function () {
        return this._checkKeys;
    };
    CalcQuickBase.prototype.setCheckKeys = function (value) {
        this._checkKeys = value;
    };

        /// <summary>
        /// Maintains a set of modified flags indicating whether
        /// any control has had a value changed.
        /// </summary>
    CalcQuickBase.prototype.getControlModifiedFlags = function () {
        return this._controlModifiedFlags;
    };

        /// <summary>
        /// Maintains a collection of FormulaInfo objects.
        /// </summary>
        /// <remarks>
        ///  This Hashtable serves as the data store for the
        ///  CalcQuick instance. The keys are the strings used
        ///  to identify formulas and the values are FormulaInfo
        ///  objects that hold the information on each formula or value.
        /// </remarks>
    CalcQuickBase.prototype.getDataStore = function () {
        return this._dataStore;
    };

        /// <summary>
        /// Determines whether the CalcEngine object of this CalcQuick should be disposed on disposing this object.
        /// <para/>Default value is true.
        /// </summary>
    CalcQuickBase.prototype.getDisposeEngineResource = function () {
        return this._disposeEngineResource;
    };
    CalcQuickBase.prototype.setDisposeEngineResource = function (value) {
        this._disposeEngineResource = value;
    };
    
        /// <summary>
        /// A read-only property that gets the reference to the CalcEngine object being used by this CalcQuick instance.
        /// </summary>
    CalcQuickBase.prototype.getEngine = function () {
        return this._engine;
    };

        /// <summary>
        /// A property that gets/sets character by which string starts with, are treated as
        /// formulas when indexing a CalcQuick object.
        /// </summary>
        /// <remarks>If you use the technique of indexing the CalcQuick object
        /// to set a varaible value, then you indicate that the value should be a
        /// formula by starting the string with this character. If you do not want
        /// to require your formulas to start with this character, then you will not
        /// be able to use the indexing technique. Instead, you will have to call
        /// ParseAndCompute directly to handle formulas not starting with this
        /// character.</remarks>
    CalcQuickBase.prototype.getFormulaCharacter = function () {
        return this.getEngine().getFormulaCharacter();
    };
    CalcQuickBase.prototype.setFormulaCharacter = function (value) {
        this.getEngine().setFormulaCharacter(value);
    };


        /// <summary>
        /// Maintains a mapping between the string key and the row
        /// used in a CalcSheet to identify a FormulaInfo object.
        /// </summary>
    CalcQuickBase.prototype.getKeyToRowsMap = function () {
        return this._keyToRowsMap;
    };

        /// <summary>
        /// Maintains a mapping between the string key and a
        /// vector of numbers entered using a brace expression.
        /// </summary>
    CalcQuickBase.prototype.getKeyToVectors = function () {
        return this._keyToVectors;
    };

        /// <summary>
        /// Maintains a mapping between the string key and the control
        /// which is being used to identify a FormulaInfo object.
        /// </summary>
    CalcQuickBase.prototype.getNameToControlMap = function () {
        return this._nameToControlMap;
    };

        /// <summary>
        /// Maintains a mapping between the row used in a CalcSheet
        /// and the string key used to identify a FormulaInfo object.
        /// </summary>
    CalcQuickBase.prototype.getRowsToKeyMap = function () {
        return this._rowsToKeyMap;
    };

        /// <summary>
        /// Gets / sets whether the CalcQuick should throw an exception when a circular calculation is encountered.
        /// </summary>
        /// <remarks>If this property is True, the CalcQuick will throw an exception
        /// when it detects a circular calculation. If ThrowCircularException is False, then
        /// no exception is thrown and the calculation will loop recursively until Engine.MaximumRecursiveCalls
        /// is exceeded.
        /// </remarks>
    CalcQuickBase.prototype.getThrowCircularException = function () {
        return this.getEngine().getThrowCircularException();
    };
    CalcQuickBase.prototype.setThrowCircularException = function (value) {
        this.getEngine().setThrowCircularException(value);
    };

    CalcQuickBase.prototype.getValueSetEventHandler = function () {
        if (this._valueSetEvent == null) {
            this._valueSetEvent = new ValueSetEvent();
        }
        return this._valueSetEvent.getValueSet();
    };
    CalcQuickBase.prototype.setValueSetEventHandler = function (value) {
        if (this._valueSetEvent == null) {
            this._valueSetEvent = new ValueSetEvent();
        }
        this._valueSetEvent.setValueSet(value);
    };

    return CalcQuickBase;
})();

 window.CalcQuick = (function (_super) {
    this.__calcQuickextends(CalcQuick, _super);
    function CalcQuick() {
        _super.apply(this, arguments);
        this.registerControlArray = function (controls) {
            for (var c = 0; c < controls.length; c++) {
                this.registerControl(controls[c]);
            }

            this.setAutoCalc(true);
        };
        /// <summary>
        /// Used to register a control as a calculation object in this CalcQuick instance.
        /// </summary>
        /// <param name="c">The control to register.</param>
        /// <remarks>
        /// To reference this calculation object from another calculation in this CalcQuick
        /// object, you use the Control.Name string. The value of this calculation object is
        /// bound to the Control.Text property.
        /// </remarks>
        this.registerControl = function (c) {
            ////Subscribe once.
            if (this.getNameToControlMap().length == 0) {
                this.setValueSetEventHandler(this.calcQuickValueSet);
            }

            if (this.getControlModifiedFlags().containsKey(c.id) || this.getNameToControlMap().containsKey(c.id)) {
                throw "error";
            }

            this.getControlModifiedFlags().add(c.id, false);
            this.getNameToControlMap().add(c.id.toUpperCase(), c.id);

            this.setKeyValue(c.id, c.value);
            if (c.type == "select-one") {
                var proxy = $.proxy(this.controlTextChanged, this, this);
                c.onchange = proxy;
            } else {
                var proxy = $.proxy(this.controlTextChanged, this, this);
                if (this._isIE8)
                    c.onpropertychange = proxy;
                else
                    c.oninput = proxy;
            }
            var proxy = $.proxy(this.controlLeave, this, this);
            c.onblur = proxy;
        };
        ////Used to autoset the value back to the control.
        this.calcQuickValueSet = function (eventObj, e) {
            if (eventObj.getNameToControlMap().containsKey(e.getKey())) {
                var c = eventObj.getNameToControlMap().getItem(e.getKey());
                document.getElementById(c).value = e.getValue();
            }
        };
        ////When using controls as keys, this event is
        ////used to mark a control as modified.
        this.controlTextChanged = function (e, sender) {
            var srcElement = (e._isIE8) ? event.srcElement : sender.target;
            if (srcElement != null && !e.ignoreChanges
                && e.getControlModifiedFlags().containsKey(srcElement.id)) {
                e.getControlModifiedFlags().items[srcElement.id] = true;
            }

        };
        ////When using controls as keys, this event is
        ////used to trigger an autochange if needed.
        this.controlLeave = function (e, sender) {
            var srcElement = (e._isIE8) ? event.srcElement : sender.target;
            if (srcElement != null) {
                if (this.getControlModifiedFlags().containsKey(srcElement.id)) {
                    if (e.getControlModifiedFlags().getItem(srcElement.id)) {
                        e.setKeyValue(srcElement.id, srcElement.value); ////triggers a possible recalculate
                        e.getControlModifiedFlags().items[srcElement.id] = false;
                    }
                    ////this.getControlModifiedFlags()[c] = false;
                }
            }
        };
    }
    return CalcQuick;
})(CalcQuickBase);


window.ValueSetEventArgs = (function () {
    function ValueSetEventArgs(key, value, action) {
        this._id = key;
        this._val = value;
        this._action = action;
    }
        /// <summary>
        /// The reason the event was raised.
        /// </summary>
    ValueSetEventArgs.prototype.getAction = function () {
        return this._action;
    };
    ValueSetEventArgs.prototype.setAction =  function (value) {
        this._action = value;
    };


    /// <summary>
    /// A property that gets/sets the Hashtable lookup object for the FormulaInfo object being changed.
    /// </summary>
    ValueSetEventArgs.prototype.getKey = function () {
        return this._id;
    };
    ValueSetEventArgs.prototype.setKey = function (value) {
        this._id = value;
    };

        /// <summary>
        /// A property that gets/sets the new value being set.
        /// </summary>
    ValueSetEventArgs.prototype.getValue = function () {
        return this._val;
    };
    ValueSetEventArgs.prototype.setValue = function (value) {
        this._val = value;
    };

    return ValueSetEventArgs;
})();

var FormulaInfoSetAction;
(function (FormulaInfoSetAction) {
    /// <summary>
    /// A formula (string starting with FormulaCharacter) was assigned.
    /// </summary>
    FormulaInfoSetAction[FormulaInfoSetAction["FormulaSet"] = 0] = "FormulaSet";

    /// <summary>
    /// Something other than a formula was assigned.
    /// </summary>
    FormulaInfoSetAction[FormulaInfoSetAction["NonFormulaSet"] = 1] = "NonFormulaSet";

    /// <summary>
    /// A calculated value was assigned.
    /// </summary>
    FormulaInfoSetAction[FormulaInfoSetAction["CalculatedValueSet"] = 2] = "CalculatedValueSet";
})(FormulaInfoSetAction || (FormulaInfoSetAction = {}));
;


var FormulaInfoHashtable = (function () {

    function FormulaInfoHashtable() {
        this.get = function (key) {
            return new FormulaInfo();
        };
        this.set = function (key, value) {
            return new FormulaInfo();
        };
    }
    return FormulaInfoHashtable;
})();
var HashTable = (function () {
    function HashTable() {
        this.length = 0;
        this.items = [];
        this.add = function (key, value) {
            this.previous = undefined;
            if (this.containsKey(key)) {
                this.previous = this.items[key];
            } else {
                this.length++;
            }
            this.items[key] = value;
            return this.previous;
        };
        this.clear = function () {
            this.items = {};
            this.length = 0;
        };
        this.contains = function (key) {
            return this.items.hasOwnProperty(key);
        };
        this.containsKey = function (key) {
            return this.items.hasOwnProperty(key);
        };
        this.containsValue = function (key) {
            return (this.items.hasOwnProperty(key) && this.items[key] != undefined) ? true : false;
        };
        this.getItem = function (key) {
            if (this.containsKey(key))
            {

                return this.items[key]
            }
            else
            {
                return  undefined;
            }
        };
        this.keys = function () {
            var keys = [];
            for (var k in this.items) {
                if (this.containsKey(k)) {
                    keys.push(k);
                }
            }
            return keys;
        };
        this.remove = function (key) {
            if (this.containsKey(key)) {
                this.previous = this.items[key];
                this.length--;
                delete this.items[key];
                return this.previous;
            } else {
                return undefined;
            }
        };
        this.values = function () {
            var values = [];
            for (var k in this.items) {
                if (this.containsKey(k)) {
                    values.push(this.items[k]);
                }
            }
            return values;
        };
        this.each = function (fn) {
            for (var k in this.items) {
                if (this.containsKey(k)) {
                    fn(k, this.items[k]);
                }
            }
        };
        var previous = undefined;
    }
    return HashTable;
})();

 window.RangeInfo = (function () {
    function RangeInfo(top, left, bottom,right) {
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
        this.getBottom = function () {
            return this.bottom;
        };
        this.setBottom = function (value) {
            this.bottom = value;
        };
        this.getTop = function () {
            return this.top;
        };
        this.setTop = function (value) {
            this.top = value;
        };
        this.getLeft = function () {
            return this.left;
        };
        this.setLeft = function (value) {
            this.left = value;
        };
        this.getRight = function () {
            return this.right;
        };
        this.setRight = function (value) {
            this.right = value;
        };
    }
    RangeInfo.cells = function (top, left, bottom, right) {
        return new RangeInfo(top, left, bottom,right);
    };

    RangeInfo.getAlphaLabel = function (col) {
        var cols = [];
        var n = 0;
        var charText = "A";
        while (col > 0 && n < 9) {
            col--;
            var aCharNo = charText.charCodeAt(0);
            cols[n] = String.fromCharCode(col % 26 + aCharNo);
            col = parseInt((col / 26).toString());
            n++;
        }

        var chs = [];
        for (var i = 0; i < n; i++) {
            chs[n - i - 1] = cols[i];
        }

        return chs.join("");
    };
    return RangeInfo;
})();

window.GridSheetFamilyItem = (function () {
    function GridSheetFamilyItem() {
        this.isSheetMember = false;
        this.parentObjectToToken = null;
        this.sheetDependentCells = null;
        this.sheetDependentFormulaCells = null;
        this.sheetFormulaInfoTable = null;
        /// <summary>
        /// Holds mapping from sheet name to parent object.
        /// </summary>
        this.sheetNameToParentObject = null;
        /// <summary>
        /// Holds mapping from parent object to sheet name.
        /// </summary>
        this.sheetNameToToken = null;
        /// <summary>
        /// Holds mapping from sheet token to parent object.
        /// </summary>
        this.tokenToParentObject = null;
    }
    return GridSheetFamilyItem;
})();

window.FormulaInfo = (function () {
    function FormulaInfo() {
        this.calcID = Number.MIN_SAFE_INTEGER + 1;
        /// <summary>
        /// A property that gets/sets the text of the initial formula.
        /// </summary>
        this.getFormulaText = function () {
            return this._formulaText;
        };
        this.setFormulaText = function (value) {
            this._formulaText = value;
        };
        /// <summary>
        /// A property that gets/sets the last computed value of this formula.
        /// </summary>
        this.getFormulaValue = function () {
            return this._formulaValue;
        };
        this.setFormulaValue = function (value) {
            this._formulaValue = value;
        };
        /// <summary>
        /// A property that gets/sets the formula as a parsed string.
        /// </summary>
        this.getParsedFormula = function () {
            return this._parsedFormula;
        };
        this.setParsedFormula = function (value) {
            this._parsedFormula = value;
        };
        var _formulaText;
        var _formulaValue;
        var _parsedFormula;
        var _calcID = Number.MIN_SAFE_INTEGER + 1;
    }
    return FormulaInfo;
})();

window.ValueChangedArgs = (function () {
    function ValueChangedArgs(row, col, value) {
        this.row = row;
        this.col = col;
        this.value = value;
        this.getRowIndex = function () {
            return this.row;
        };
        this.setRowIndex = function (value) {
            this.row = value;
        };
        this.getColIndex = function () {
            return this.col;
        };
        this.setColIndex = function (value) {
            this.col = value;
        };
        this.getValue = function () {
            return this.value;
        };
        this.setValue = function (value) {
            this.value = value;
        };
    }
    return ValueChangedArgs;
})();

window.FormulaParsing = (function () {
    function FormulaParsing(_text) {
        this._text = _text;
        this.getText = function () {
            return this._text;
        };
        this.setText = function (value) {
            this._text = value;
        };
    }
    return FormulaParsing;
})();

window.UnknownFunctionEventArgs = (function () {
    function UnknownFunctionEventArgs() {
        /// <summary>
        /// Gets the name of the unknown function.
        /// </summary>
        this.getMissingFunctionName = function () {
            return this.m_missingFunctionName;
        };
        this.setMissingFunctionName = function (value) {
            this.m_missingFunctionName = value;
        };
        this.getCellLocation = function () {
            return this.m_cellLocation;
        };
        this.setCellLocation = function (value) {
            this.m_cellLocation = value;
        };
    }
    return UnknownFunctionEventArgs;
})();

window.LookUps = (function () {
    function LookUps() {
        this.getLinearLookUpList = function () {
            return this._linearLookUpList;
        };
        this.setLinearLookUpList = function (value) {
            this._linearLookUpList = value;
        };
        this.getMatchLookUpList = function () {
            return this._matchLookUpList;
        };
        this.setMatchLookUpList = function (value) {
            this._matchLookUpList = value;
        };
    }
    return LookUps;
})();

window.ValueSetEvent = (function () {
    // Private member vars
    function ValueSetEvent() {
    }
    ValueSetEvent.prototype.getValueSet = function () {
        return this.eventFn;
    };
    ValueSetEvent.prototype.setValueSet = function (value) {
        this.eventFn = value;
    };

    ValueSetEvent.prototype.trigger = function () {
        var a = [];
        for (var _i = 0; _i < (arguments.length - 0) ; _i++) {
            a[_i] = arguments[_i + 0];
        }
        /// <summary>Invokes all of the listeners for this event.</summary>
        /// <param name="args">Optional set of arguments to pass to listners.</param>
        var context = {};
        this.getValueSet().apply(context, a || []);
    };
    return ValueSetEvent;
})();;

});