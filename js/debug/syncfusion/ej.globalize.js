/*!
*  filename: ej.globalize.js
*  version : 14.2.0.26
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./ej.core"], fn) : fn();
})
(function () {
	
(function($, undefined){
    
ej.globalize = {};
ej.cultures = {};

ej.cultures['default'] = ej.cultures['en-US'] = $.extend(true, {
    name: 'en-US',
    englishName: "English",
    nativeName: "English",
    language: 'en',
    isRTL: false,
    numberFormat: {
        pattern: ["-n"],
        decimals: 2,
        ',': ",",
        '.': ".",
        groupSizes: [3],
        '+': "+",
        '-': "-",
        percent: {
            pattern: ["-n %", "n %"],
            decimals: 2,
            groupSizes: [3],
            ',': ",",
            '.': ".",
            symbol: '%'
        },
        currency: {
            pattern: ["($n)", "$n"],
            decimals: 2,
            groupSizes: [3],
            ',': ",",
            '.': ".",
            symbol: '$'
        }
    },
    calendars: {
    	standard: {
	        '/': '/',
	        ':': ':',
	        firstDay: 0,
	        days: {
	            names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	            namesAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	            namesShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
	        },
	        months: {
	            names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
	            namesAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""]
	        },
	        AM: ['AM', 'am', 'AM'],
	        PM: ['PM', 'pm', 'PM'],
            twoDigitYearMax: 2029,
	        patterns: {
                d: "M/d/yyyy",
                D: "dddd, MMMM dd, yyyy",
                t: "h:mm tt",
                T: "h:mm:ss tt",
                f: "dddd, MMMM dd, yyyy h:mm tt",
                F: "dddd, MMMM dd, yyyy h:mm:ss tt",
                M: "MMMM dd",
                Y: "yyyy MMMM",
                S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss"

	        }
    	}
    }
}, ej.cultures['en-US']);

ej.cultures['en-US'].calendar = ej.cultures['en-US'].calendar || ej.cultures['en-US'].calendars.standard; 



// *************************************** Numbers ***************************************
var regexTrim = /^\s+|\s+$/g,
    regexInfinity = /^[+-]?infinity$/i,
    regexHex = /^0x[a-f0-9]+$/i,
    regexParseFloat = /^[+-]?\d*\.?\d*(e[+-]?\d+)?$/;

function patternStartsWith(value, pattern) {
    return value.indexOf( pattern ) === 0;
}

function patternEndsWith(value, pattern) {
    return value.substr( value.length - pattern.length ) === pattern;
}

function trim(value) {
    return (value+"").replace( regexTrim, "" );
}

function truncate(value){
    if(isNaN(value))
        return NaN;
    
    return Math[value < 0 ? "ceil" : "floor"](value);
}

function padWithZero(str, count, left) {
    for (var l = str.length; l < count; l++) {
        str = (left ? ('0' + str) : (str + '0'));
    }
    return str;
}

function parseNumberWithNegativePattern(value, nf, negativePattern) {
    var neg = nf["-"],
        pos = nf["+"],
        ret;
    switch (negativePattern) {
        case "n -":
            neg = ' ' + neg;
            pos = ' ' + pos;
            // fall through
        case "n-":
            if ( patternEndsWith( value, neg ) ) {
                ret = [ '-', value.substr( 0, value.length - neg.length ) ];
            }
            else if ( patternEndsWith( value, pos ) ) {
                ret = [ '+', value.substr( 0, value.length - pos.length ) ];
            }
            break;
        case "- n":
            neg += ' ';
            pos += ' ';
            // fall through
        case "-n":
            if ( patternStartsWith( value, neg ) ) {
                ret = [ '-', value.substr( neg.length ) ];
            }
            else if ( patternStartsWith(value, pos) ) {
                ret = [ '+', value.substr( pos.length ) ];
            }
            break;
        case "(n)":
            if ( patternStartsWith( value, '(' ) && patternEndsWith( value, ')' ) ) {
                ret = [ '-', value.substr( 1, value.length - 2 ) ];
            }
            break;
    }
    return ret || [ '', value ];
}

function getFullNumber(number, precision, formatInfo) {
    var groupSizes = formatInfo.groupSizes || [3],
        curSize = groupSizes[0],
        curGroupIndex = 1,
        factor = Math.pow(10, precision),
        rounded = Math.round(number * factor) / factor;
    if (!isFinite(rounded)) {
        rounded = number;
    }
    number = rounded;

    var numberString = number + "",
        right = "",
        split = numberString.split(/e/i),
        exponent = split.length > 1 ? parseInt(split[1], 10) : 0;
    numberString = split[0];
    split = numberString.split(".");
    numberString = split[0];
    right = split.length > 1 ? split[1] : "";

    var l;
    if (exponent > 0) {
        right = padWithZero(right, exponent, false);
        numberString += right.slice(0, exponent);
        right = right.substr(exponent);
    } else if (exponent < 0) {
        exponent = -exponent;
        numberString = padWithZero(numberString, exponent + 1);
        right = numberString.slice(-exponent, numberString.length) + right;
        numberString = numberString.slice(0, -exponent);
    }

    var dot = formatInfo['.'] || '.';
    if (precision > 0) {
        right = dot +
            ((right.length > precision) ? right.slice(0, precision) : padWithZero(right, precision));
    } else {
        right = "";
    }

    var stringIndex = numberString.length - 1,
        sep = formatInfo[","] || ',',
        ret = "";

    while (stringIndex >= 0) {
        if (curSize === 0 || curSize > stringIndex) {
            return numberString.slice(0, stringIndex + 1) + (ret.length ? (sep + ret + right) : right);
        }
        ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1) + (ret.length ? (sep + ret) : "");

        stringIndex -= curSize;

        if (curGroupIndex < groupSizes.length) {
            curSize = groupSizes[curGroupIndex];
            curGroupIndex++;
        }
    }
    return numberString.slice(0, stringIndex + 1) + sep + ret + right;
}

function formatNumberToCulture(value, format, culture) {
    if (!format || format === 'i') {
        return culture.name.length ? value.toLocaleString() : value.toString();
    }
    format = format || "D";

    var nf = culture.numberFormat,
        number = Math.abs(value),
        precision = -1,
        pattern;

    if (format.length > 1) precision = parseInt(format.slice(1), 10);

    var current = format.charAt(0).toUpperCase(),
        formatInfo;

    switch (current) {
        case 'D':
            pattern = 'n';
            number = truncate(number);
            if (precision !== -1) {
                number = padWithZero("" + number, precision, true);
            }
            if (value < 0) number = -number;
            break;
        case 'N':
            formatInfo = nf;
            formatInfo.pattern = formatInfo.pattern || ['-n'];
            // fall through
        case 'C':
            formatInfo = formatInfo || nf.currency;
            formatInfo.pattern = formatInfo.pattern || ['-$n', '$n'];
            // fall through
        case 'P':
            formatInfo = formatInfo || nf.percent;
            formatInfo.pattern = formatInfo.pattern || ['-n %', 'n %'];
            pattern = value < 0 ? (formatInfo.pattern[0] || "-n") : (formatInfo.pattern[1] || "n");
            if (precision === -1) precision = formatInfo.decimals;
            number = getFullNumber(number * (current === "P" ? 100 : 1), precision, formatInfo);
            break;
        default:
            throw "Bad number format specifier: " + current;
    }

    return matchNumberToPattern(number, pattern, nf);
}



function matchNumberToPattern(number, pattern, nf){
    var patternParts = /n|\$|-|%/g,
        ret = "";
    for (;;) {
        var index = patternParts.lastIndex,
            ar = patternParts.exec(pattern);

        ret += pattern.slice(index, ar ? ar.index : pattern.length);

        if (!ar) {
            break;
        }

        switch (ar[0]) {
            case "n":
                ret += number;
                break;
            case "$":
                ret += nf.currency.symbol || "$";
                break;
            case "-":
                // don't make 0 negative
                if (/[1-9]/.test(number)) {
                    ret += nf["-"] || "-";
                }
                break;
            case "%":
                ret += nf.percent.symbol || "%";
                break;
        }
    }

    return ret;
}

// *************************************** Dates ***************************************

var dateFormat = {
    DAY_OF_WEEK_THREE_LETTER : "ddd",
    DAY_OF_WEEK_FULL_NAME : "dddd",
    DAY_OF_MONTH_SINGLE_DIGIT : "d",
    DAY_OF_MONTH_DOUBLE_DIGIT : "dd",
    MONTH_THREE_LETTER : "MMM",
    MONTH_FULL_NAME : "MMMM",
    MONTH_SINGLE_DIGIT : "M",
    MONTH_DOUBLE_DIGIT : "MM",
    YEAR_SINGLE_DIGIT : "y",
    YEAR_DOUBLE_DIGIT : "yy",
    YEAR_FULL : "yyyy",
    HOURS_SINGLE_DIGIT_12_HOUR_CLOCK : "h",
    HOURS_DOUBLE_DIGIT_12_HOUR_CLOCK : "hh",
    HOURS_SINGLE_DIGIT_24_HOUR_CLOCK : "H",
    HOURS_DOUBLE_DIGIT_24_HOUR_CLOCK : "HH",
    MINUTES_SINGLE_DIGIT : "m",
    MINUTES_DOUBLE_DIGIT : "mm",
    SECONDS_SINGLE_DIGIT : "s",
    SECONDS_DOUBLE_DIGIT : "ss",
    MERIDIAN_INDICATOR_SINGLE : "t",
    MERIDIAN_INDICATOR_FULL : "tt",
    DECISECONDS : "f",
    CENTISECONDS: "ff",
    MILLISECONDS : "fff",
    TIME_ZONE_OFFSET_SINGLE_DIGIT : "z",
    TIME_ZONE_OFFSET_DOUBLE_DIGIT : "zz",
    TIME_ZONE_OFFSET_FULL : "zzz",
    DATE_SEPARATOR : "/"
};

function valueOutOfRange(value, low, high) {
    return value < low || value > high;
}

function expandYear(cal, year) {
    // expands 2-digit year into 4 digits.
    var now = new Date();
    if ( year < 100 ) {
        var twoDigitYearMax = cal.twoDigitYearMax;
        twoDigitYearMax = typeof twoDigitYearMax === 'string' ? new Date().getFullYear() % 100 + parseInt( twoDigitYearMax, 10 ) : twoDigitYearMax;
        var curr = now.getFullYear();
        year += curr - ( curr % 100 );
        if ( year > twoDigitYearMax ) {
            year -= 100;
        }
    }
    return year;
}

function arrayIndexOf( array, item ) {
    if ( array.indexOf ) {
        return array.indexOf( item );
    }
    for ( var i = 0, length = array.length; i < length; i++ ) {
        if ( array[ i ] === item ) return i;
    }
    return -1;
}

function toUpper(value) {
    // 'he-IL' has non-breaking space in weekday names.
    return value.split( "\u00A0" ).join(' ').toUpperCase();
}

function toUpperArray(arr) {
    var results = [];
    for ( var i = 0, l = arr.length; i < l; i++ ) {
        results[i] = toUpper(arr[i]);
    }
    return results;
}

function getIndexOfDay(cal, value, abbr) {
    var ret,
        days = cal.days,
        upperDays = cal._upperDays;
    if ( !upperDays ) {
        cal._upperDays = upperDays = [
            toUpperArray( days.names ),
            toUpperArray( days.namesAbbr ),
            toUpperArray( days.namesShort )
        ];
    }
    value = toUpper( value );
    if ( abbr ) {
        ret = arrayIndexOf( upperDays[ 1 ], value );
        if ( ret === -1 ) {
            ret = arrayIndexOf( upperDays[ 2 ], value );
        }
    }
    else {
        ret = arrayIndexOf( upperDays[ 0 ], value );
    }
    return ret;
}

function getIndexOfMonth(cal, value, abbr) {
    var months = cal.months,
        monthsGen = cal.monthsGenitive || cal.months,
        upperMonths = cal._upperMonths,
        upperMonthsGen = cal._upperMonthsGen;
    if ( !upperMonths ) {
        cal._upperMonths = upperMonths = [
            toUpperArray( months.names ),
            toUpperArray( months.namesAbbr )
        ];
        cal._upperMonthsGen = upperMonthsGen = [
            toUpperArray( monthsGen.names ),
            toUpperArray( monthsGen.namesAbbr )
        ];
    }
    value = toUpper( value );
    var i = arrayIndexOf( abbr ? upperMonths[ 1 ] : upperMonths[ 0 ], value );
    if ( i < 0 ) {
        i = arrayIndexOf( abbr ? upperMonthsGen[ 1 ] : upperMonthsGen[ 0 ], value );
    }
    return i;
}

function appendMatchStringCount(preMatch, strings) {
    var quoteCount = 0,
        escaped = false;
    for ( var i = 0, il = preMatch.length; i < il; i++ ) {
        var c = preMatch.charAt( i );
        if(c == '\''){
            escaped ? strings.push( "'" ) : quoteCount++;
            escaped = false;
        } else if( c == '\\'){
            if (escaped) strings.push( "\\" );
            escaped = !escaped;
        } else {
            strings.push( c );
            escaped = false;
        }
    }
    return quoteCount;
}

function getFullDateFormat(cal, format) {
    // expands unspecified or single character date formats into the full pattern.
    format = format || "F";
    var pattern,
        patterns = cal.patterns,
        len = format.length;
    if ( len === 1 ) {
        pattern = patterns[ format ];
        if ( !pattern ) {
            throw "Invalid date format string '" + format + "'.";
        }
        format = pattern;
    }
    else if ( len === 2  && format.charAt(0) === "%" ) {
        // %X escape format -- intended as a custom format string that is only one character, not a built-in format.
        format = format.charAt( 1 );
    }
    return format;
}

function getDateParseRegExp(cal, format) {
    // converts a format string into a regular expression with groups that
    // can be used to extract date fields from a date string.
    // check for a cached parse regex.
    var re = cal._parseRegExp;
    if ( !re ) {
        cal._parseRegExp = re = {};
    }
    else {
        var reFormat = re[ format ];
        if ( reFormat ) {
            return reFormat;
        }
    }

    // expand single digit formats, then escape regular expression characters.
    var expFormat = getFullDateFormat( cal, format ).replace( /([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1" ),
        regexp = ["^"],
        groups = [],
        index = 0,
        quoteCount = 0,
        tokenRegExp = /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g,
        match;

    // iterate through each date token found.
    while ( (match = tokenRegExp.exec( expFormat )) !== null ) {
        var preMatch = expFormat.slice( index, match.index );
        index = tokenRegExp.lastIndex;

        // don't replace any matches that occur inside a string literal.
        quoteCount += appendMatchStringCount( preMatch, regexp );
        if ( quoteCount % 2 ) {
            regexp.push( match[ 0 ] );
            continue;
        }

        // add a regex group for the token.
        var m = match[ 0 ],
            len = m.length,
            add;
            
        switch ( m ) {
            case dateFormat.DAY_OF_WEEK_THREE_LETTER: case dateFormat.DAY_OF_WEEK_FULL_NAME:
            case dateFormat.MONTH_FULL_NAME: case dateFormat.MONTH_THREE_LETTER:
                add = "(\\D+)";
                break;
            case dateFormat.MERIDIAN_INDICATOR_FULL: case dateFormat.MERIDIAN_INDICATOR_SINGLE:
                add = "(\\D*)";
                break;
            case dateFormat.YEAR_FULL:
            case dateFormat.MILLISECONDS:
            case dateFormat.CENTISECONDS:
            case dateFormat.DECISECONDS:
                add = "(\\d{" + len + "})";
                break;
            case dateFormat.DAY_OF_MONTH_DOUBLE_DIGIT: case dateFormat.DAY_OF_MONTH_SINGLE_DIGIT:
            case dateFormat.MONTH_DOUBLE_DIGIT: case dateFormat.MONTH_SINGLE_DIGIT:
            case dateFormat.YEAR_DOUBLE_DIGIT: case dateFormat.YEAR_SINGLE_DIGIT:
            case dateFormat.HOURS_DOUBLE_DIGIT_24_HOUR_CLOCK: case dateFormat.HOURS_SINGLE_DIGIT_24_HOUR_CLOCK:
            case dateFormat.HOURS_DOUBLE_DIGIT_12_HOUR_CLOCK: case dateFormat.HOURS_SINGLE_DIGIT_12_HOUR_CLOCK:
            case dateFormat.MINUTES_DOUBLE_DIGIT: case dateFormat.MINUTES_SINGLE_DIGIT:
            case dateFormat.SECONDS_DOUBLE_DIGIT: case dateFormat.SECONDS_SINGLE_DIGIT:
                add = "(\\d\\d?)";
                break;
            case dateFormat.TIME_ZONE_OFFSET_FULL:
                add = "([+-]?\\d\\d?:\\d{2})";
                break;
            case dateFormat.TIME_ZONE_OFFSET_DOUBLE_DIGIT: case dateFormat.TIME_ZONE_OFFSET_SINGLE_DIGIT:
                add = "([+-]?\\d\\d?)";
                break;
            case dateFormat.DATE_SEPARATOR:
                add = "(\\" + cal["/"] + ")";
                break;
            default:
                throw "Invalid date format pattern '" + m + "'.";
                break;
        }
        if ( add ) {
            regexp.push( add );
        }
        groups.push( match[ 0 ] );
    }
    appendMatchStringCount( expFormat.slice( index ), regexp );
    regexp.push( "$" );

    // allow whitespace to differ when matching formats.
    var regexpStr = regexp.join( '' ).replace( /\s+/g, "\\s+" ),
        parseRegExp = {'regExp': regexpStr, 'groups': groups};

    // cache the regex for this format.
    return re[ format ] = parseRegExp;
}

function getParsedDate(value, format, culture) {
    // try to parse the date string by matching against the format string
    // while using the specified culture for date field names.
    value = trim( value );
    var cal = culture.calendar,
        // convert date formats into regular expressions with groupings.
        parseInfo = getDateParseRegExp(cal, format),
        match = new RegExp(parseInfo.regExp).exec(value);
    if (match === null) {
        return null;
    }
    // found a date format that matches the input.
    var groups = parseInfo.groups,
        year = null, month = null, date = null, weekDay = null,
        hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null,
        pmHour = false;
    // iterate the format groups to extract and set the date fields.
    for ( var j = 0, jl = groups.length; j < jl; j++ ) {
        var matchGroup = match[ j + 1 ];
        if ( matchGroup ) {
            var current = groups[ j ],
                clength = current.length,
                matchInt = parseInt( matchGroup, 10 );
            
            switch ( current ) {
                case dateFormat.DAY_OF_MONTH_DOUBLE_DIGIT: case dateFormat.DAY_OF_MONTH_SINGLE_DIGIT:
                    date = matchInt;
                    if ( valueOutOfRange( date, 1, 31 ) ) return null;
                    break;
                case dateFormat.MONTH_THREE_LETTER:
                case dateFormat.MONTH_FULL_NAME:
                    month = getIndexOfMonth( cal, matchGroup, clength === 3 );
                    if ( valueOutOfRange( month, 0, 11 ) ) return null;
                    break;
                case dateFormat.MONTH_SINGLE_DIGIT: case dateFormat.MONTH_DOUBLE_DIGIT:
                    month = matchInt - 1;
                    if ( valueOutOfRange( month, 0, 11 ) ) return null;
                    break;
                case dateFormat.YEAR_SINGLE_DIGIT: case dateFormat.YEAR_DOUBLE_DIGIT:
                case dateFormat.YEAR_FULL:
                    year = clength < 4 ? expandYear( cal, matchInt ) : matchInt;
                    if ( valueOutOfRange( year, 0, 9999 ) ) return null;
                    break;
                case dateFormat.HOURS_SINGLE_DIGIT_12_HOUR_CLOCK: case dateFormat.HOURS_DOUBLE_DIGIT_12_HOUR_CLOCK:
                    hour = matchInt;
                    if ( hour === 12 ) hour = 0;
                    if ( valueOutOfRange( hour, 0, 11 ) ) return null;
                    break;
                case dateFormat.HOURS_SINGLE_DIGIT_24_HOUR_CLOCK: case dateFormat.HOURS_DOUBLE_DIGIT_24_HOUR_CLOCK:
                    hour = matchInt;
                    if ( valueOutOfRange( hour, 0, 23 ) ) return null;
                    break;
                case dateFormat.MINUTES_SINGLE_DIGIT: case dateFormat.MINUTES_DOUBLE_DIGIT:
                    min = matchInt;
                    if ( valueOutOfRange( min, 0, 59 ) ) return null;
                    break;
                case dateFormat.SECONDS_SINGLE_DIGIT: case dateFormat.SECONDS_DOUBLE_DIGIT:
                    sec = matchInt;
                    if ( valueOutOfRange( sec, 0, 59 ) ) return null;
                    break;
                case dateFormat.MERIDIAN_INDICATOR_FULL: case dateFormat.MERIDIAN_INDICATOR_SINGLE:
                    pmHour = cal.PM && ( matchGroup === cal.PM[0] || matchGroup === cal.PM[1] || matchGroup === cal.PM[2] );
                    if ( !pmHour && ( !cal.AM || (matchGroup !== cal.AM[0] && matchGroup !== cal.AM[1] && matchGroup !== cal.AM[2]) ) ) return null;
                    break;
                case dateFormat.DECISECONDS:
                case dateFormat.CENTISECONDS:
                case dateFormat.MILLISECONDS:
                    msec = matchInt * Math.pow( 10, 3-clength );
                    if ( valueOutOfRange( msec, 0, 999 ) ) return null;
                    break;
                case dateFormat.DAY_OF_WEEK_THREE_LETTER:
                case dateFormat.DAY_OF_WEEK_FULL_NAME:
                    weekDay = getIndexOfDay( cal, matchGroup, clength === 3 );
                    if ( valueOutOfRange( weekDay, 0, 6 ) ) return null;
                    break;
                case dateFormat.TIME_ZONE_OFFSET_FULL:
                    var offsets = matchGroup.split( /:/ );
                    if ( offsets.length !== 2 ) return null;

                    hourOffset = parseInt( offsets[ 0 ], 10 );
                    if ( valueOutOfRange( hourOffset, -12, 13 ) ) return null;
                    
                    var minOffset = parseInt( offsets[ 1 ], 10 );
                    if ( valueOutOfRange( minOffset, 0, 59 ) ) return null;
                    
                    tzMinOffset = (hourOffset * 60) + (patternStartsWith( matchGroup, '-' ) ? -minOffset : minOffset);
                    break;
                case dateFormat.TIME_ZONE_OFFSET_SINGLE_DIGIT: case dateFormat.TIME_ZONE_OFFSET_DOUBLE_DIGIT:
                    // Time zone offset in +/- hours.
                    hourOffset = matchInt;
                    if ( valueOutOfRange( hourOffset, -12, 13 ) ) return null;
                    tzMinOffset = hourOffset * 60;
                    break;
            }
        }
    }
    var result = new Date(), defaultYear, convert = cal.convert;
    defaultYear = convert ? convert.fromGregorian( result )[ 0 ] : result.getFullYear();
    if ( year === null ) {
        year = defaultYear;
    }
    
    // set default day and month to 1 and January, so if unspecified, these are the defaults
    // instead of the current day/month.
    if ( month === null ) {
        month = 0;
    }
    if ( date === null ) {
        date = 1;
    }
    // now have year, month, and date, but in the culture's calendar.
    if ( convert ) {
        result = convert.toGregorian( year, month, date );
        if ( result === null ) return null;
    }
    else {
        // have to set year, month and date together to avoid overflow based on current date.
        result.setFullYear( year, month, date );
        // check to see if date overflowed for specified month (only checked 1-31 above).
        if ( result.getDate() !== date ) return null;
        // invalid day of week.
        if ( weekDay !== null && result.getDay() !== weekDay ) {
            return null;
        }
    }
    // if pm designator token was found make sure the hours fit the 24-hour clock.
    if ( pmHour && hour < 12 ) {
        hour += 12;
    }
    result.setHours( hour, min, sec, msec );
    if ( tzMinOffset !== null ) {
        var adjustedMin = result.getMinutes() - ( tzMinOffset + result.getTimezoneOffset() );
        result.setHours( result.getHours() + parseInt( adjustedMin / 60, 10 ), adjustedMin % 60 );
    }
    return result;
}


function formatDateToCulture(value, format, culture) {
    var cal = culture.calendar,
        convert = cal.convert;
    if ( !format || !format.length || format === 'i' ) {
        var ret;
        if ( culture && culture.name.length ) {
            if ( convert ) {
                // non-gregorian calendar, so we cannot use built-in toLocaleString()
                ret = formatDateToCulture( value, cal.patterns.F, culture );
            }
            else {
                ret = value.toLocaleString();
            }
        }
        else {
            ret = value.toString();
        }
        return ret;
    }

    var sortable = format === "s";
        format = getFullDateFormat(cal, format);


    // Start with an empty string
    ret = [];
    var hour,
        zeros = ['0','00','000'],
        foundDay,
        checkedDay,
        dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g,
        quoteCount = 0,
        tokenRegExp = /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g,
        converted;

    function padWithZeros(num, c) {
        var r, s = num+'';
        if ( c > 1 && s.length < c ) {
            r = ( zeros[ c - 2 ] + s);
            return r.substr( r.length - c, c );
        }
        else {
            r = s;
        }
        return r;
    }

    function hasDay() {
        if ( foundDay || checkedDay ) {
            return foundDay;
        }
        foundDay = dayPartRegExp.test( format );
        checkedDay = true;
        return foundDay;
    }

    if ( !sortable && convert ) {
        converted = convert.fromGregorian( value );
    }

    for (;;) {
        // Save the current index
        var index = tokenRegExp.lastIndex,
            // Look for the next pattern
            ar = tokenRegExp.exec( format );

        // Append the text before the pattern (or the end of the string if not found)
        var preMatch = format.slice( index, ar ? ar.index : format.length );
        quoteCount += appendMatchStringCount( preMatch, ret );

        if ( !ar ) {
            break;
        }

        // do not replace any matches that occur inside a string literal.
        if ( quoteCount % 2 ) {
            ret.push( ar[ 0 ] );
            continue;
        }

        var current = ar[ 0 ],
            clength = current.length;


        switch ( current ) {
            case dateFormat.DAY_OF_WEEK_THREE_LETTER:
            case dateFormat.DAY_OF_WEEK_FULL_NAME:
                var names = (clength === 3) ? cal.days.namesAbbr : cal.days.names;
                ret.push( names[ value.getDay() ] );
                break;
            case dateFormat.DAY_OF_MONTH_SINGLE_DIGIT:
            case dateFormat.DAY_OF_MONTH_DOUBLE_DIGIT:
                foundDay = true;
                ret.push( padWithZeros( (converted ? converted[2] : value.getDate()), clength ) );
                break;
            case dateFormat.MONTH_THREE_LETTER:
            case dateFormat.MONTH_FULL_NAME:
                var part = converted ? converted[1] : value.getMonth();
                ret.push( (cal.monthsGenitive && hasDay())
                    ? cal.monthsGenitive[ clength === 3 ? "namesAbbr" : "names" ][ part ]
                    : cal.months[ clength === 3 ? "namesAbbr" : "names" ][ part ] );
                break;
            case dateFormat.MONTH_SINGLE_DIGIT:
            case dateFormat.MONTH_DOUBLE_DIGIT:
                ret.push( padWithZeros((converted ? converted[1] : value.getMonth()) + 1, clength ) );
                break;
            case dateFormat.YEAR_SINGLE_DIGIT:
            case dateFormat.YEAR_DOUBLE_DIGIT:
            case dateFormat.YEAR_FULL:
                part = converted ? converted[ 0 ] : value.getFullYear();
                if ( clength < 4 ) {
                    part = part % 100;
                }
                ret.push( padWithZeros( part, clength ) );
                break;
            case dateFormat.HOURS_SINGLE_DIGIT_12_HOUR_CLOCK:
            case dateFormat.HOURS_DOUBLE_DIGIT_12_HOUR_CLOCK:
                hour = value.getHours() % 12;
                if ( hour === 0 ) hour = 12;
                ret.push( padWithZeros( hour, clength ) );
                break;
            case dateFormat.HOURS_SINGLE_DIGIT_24_HOUR_CLOCK:
            case dateFormat.HOURS_DOUBLE_DIGIT_24_HOUR_CLOCK:
                ret.push( padWithZeros( value.getHours(), clength ) );
                break;
            case dateFormat.MINUTES_SINGLE_DIGIT:
            case dateFormat.MINUTES_DOUBLE_DIGIT:
                ret.push( padWithZeros( value.getMinutes(), clength ) );
                break;
            case dateFormat.SECONDS_SINGLE_DIGIT:
            case dateFormat.SECONDS_DOUBLE_DIGIT:
                ret.push( padWithZeros(value .getSeconds(), clength ) );
                break;
            case dateFormat.MERIDIAN_INDICATOR_SINGLE:
            case dateFormat.MERIDIAN_INDICATOR_FULL:
                part = value.getHours() < 12 ? (cal.AM ? cal.AM[0] : " ") : (cal.PM ? cal.PM[0] : " ");
                ret.push( clength === 1 ? part.charAt( 0 ) : part );
                break;
            case dateFormat.DECISECONDS:
            case dateFormat.CENTISECONDS:
            case dateFormat.MILLISECONDS:
                ret.push( padWithZeros( value.getMilliseconds(), 3 ).substr( 0, clength ) );
                break;
            case dateFormat.TIME_ZONE_OFFSET_SINGLE_DIGIT:
            case dateFormat.TIME_ZONE_OFFSET_DOUBLE_DIGIT:
                hour = value.getTimezoneOffset() / 60;
                ret.push( (hour <= 0 ? '+' : '-') + padWithZeros( Math.floor( Math.abs( hour ) ), clength ) );
                break;
            case dateFormat.TIME_ZONE_OFFSET_FULL:
                hour = value.getTimezoneOffset() / 60;
                ret.push( (hour <= 0 ? '+' : '-') + padWithZeros( Math.floor( Math.abs( hour ) ), 2 ) +
                    ":" + padWithZeros( Math.abs( value.getTimezoneOffset() % 60 ), 2 ) );
                break;
            case dateFormat.DATE_SEPARATOR:
                ret.push( cal["/"] || "/" );
                break;
            default:
                throw "Invalid date format pattern '" + current + "'.";
                break;
        }
    }
    return ret.join( '' );
}

//add new culture into ej 
ej.globalize.addCulture = function(name, culture){
    ej.cultures[name] = $.extend(true, $.extend(true, {}, ej.cultures['default'], culture), ej.cultures[name]);
	ej.cultures[name].calendar = ej.cultures[name].calendars.standard;
}

//return the specified culture or default if not found
ej.globalize.preferredCulture = function (culture) {
    culture = (typeof culture != "undefined" && typeof culture === typeof this.cultureObject) ? culture.name : culture;
    this.cultureObject = ej.globalize.findCulture(culture);
    ej.cultures.current = this.cultureObject;
    return this.cultureObject;
}
ej.globalize.culture=function(name){
	ej.cultures.current=ej.globalize.findCulture(culture);
}

//return the specified culture or current else default if not found
ej.globalize.findCulture = function (culture) {
    var cultureObject;
    if (culture) {

        if ($.isPlainObject(culture) && culture.numberFormat) {
            cultureObject = culture;
        }
        if (typeof culture === "string") {
            var cultures = ej.cultures;
            if (cultures[culture]) {
                return cultures[culture];
            }
            else {
                if (culture.indexOf("-") > -1) {
                    var cultureShortName = culture.split("-")[0];
                    if (cultures[cultureShortName]) {
                        return cultures[cultureShortName];
                    }
                }
                else {
                    var cultureArray = $.map(cultures, function (el) { return el });
                    for (var i = 0; i < cultureArray.length; i++) {
                        var shortName = cultureArray[i].name.split("-")[0];
                        if (shortName === culture) {
                            return cultureArray[i];
                        }
                    };
                }
            }
            return ej.cultures["default"];
        }
    }
    else {
        cultureObject = ej.cultures.current || ej.cultures["default"];
    }

    return cultureObject;
}
//formatting date and number based on given format
ej.globalize.format = function(value, format, culture) {
    var cultureObject =  ej.globalize.findCulture(culture);
    if (typeof(value) === 'number') {
        value = formatNumberToCulture(value, format, cultureObject);
    } else if(value instanceof Date){
    	value = formatDateToCulture(value, format, cultureObject);
    }

    return value;
}

//parsing integer takes string as input and return as number
ej.globalize.parseInt = function(value, radix, culture) {
    return Math.floor( this.parseFloat( value, radix, culture ) );
}

//parsing floationg poing number takes string as input and return as number
ej.globalize.parseFloat = function(value, radix, culture) {
    // make radix optional
    if (typeof radix === "string") {
        culture = radix;
        radix = 10;
    }

    culture = ej.globalize.findCulture(culture);
    var ret = NaN,
        nf = culture.numberFormat,
        npattern = culture.numberFormat.pattern[0];

    if (value.indexOf(culture.numberFormat.currency.symbol) > -1) {
        // remove currency symbol
        value = value.replace(culture.numberFormat.currency.symbol || "$", "");
        // replace decimal seperator
        value = value.replace(culture.numberFormat.currency["."] || ".", culture.numberFormat["."] || ".");
        // pattern of the currency
        npattern = trim(culture.numberFormat.currency.pattern[0].replace("$", ""));
    } else if (value.indexOf(culture.numberFormat.percent.symbol) > -1) {
        // remove percentage symbol
        value = value.replace(culture.numberFormat.percent.symbol || "%", "");
        // replace decimal seperator
        value = value.replace(culture.numberFormat.percent["."] || ".", culture.numberFormat["."] || ".");
        // pattern of the percent
        npattern = trim(culture.numberFormat.percent.pattern[0].replace("%", ""));
    }

    // trim leading and trailing whitespace
    value = trim( value );

    // allow infinity or hexidecimal
    if (regexInfinity.test(value)) {
        ret = parseFloat(value, radix);
    }
    else if (!radix && regexHex.test(value)) {
        ret = parseInt(value, 16);
    }
    else {
        var signInfo = parseNumberWithNegativePattern( value, nf, npattern ),
            sign = signInfo[0],
            num = signInfo[1];
        // determine sign and number
        if ( sign === "" && nf.pattern[0] !== "-n" ) {
            signInfo = parseNumberWithNegativePattern( value, nf, "-n" );
            sign = signInfo[0];
            num = signInfo[1];
        }
        sign = sign || "+";
        // determine exponent and number
        var exponent,
            intAndFraction,
            exponentPos = num.indexOf( 'e' );
        if ( exponentPos < 0 ) exponentPos = num.indexOf( 'E' );
        if ( exponentPos < 0 ) {
            intAndFraction = num;
            exponent = null;
        }
        else {
            intAndFraction = num.substr( 0, exponentPos );
            exponent = num.substr( exponentPos + 1 );
        }
        // determine decimal position
        var integer,
            fraction,
            decSep = nf['.'] || '.',
            decimalPos = intAndFraction.indexOf( decSep );
        if ( decimalPos < 0 ) {
            integer = intAndFraction;
            fraction = null;
        }
        else {
            integer = intAndFraction.substr( 0, decimalPos );
            fraction = intAndFraction.substr( decimalPos + decSep.length );
        }
        // handle groups (e.g. 1,000,000)
        var groupSep = nf[","] || ",";
        integer = integer.split(groupSep).join('');
        var altGroupSep = groupSep.replace(/\u00A0/g, " ");
        if ( groupSep !== altGroupSep ) {
            integer = integer.split(altGroupSep).join('');
        }
        // build a natively parsable number string
        var p = sign + integer;
        if ( fraction !== null ) {
            p += '.' + fraction;
        }
        if ( exponent !== null ) {
            // exponent itself may have a number patternd
            var expSignInfo = parseNumberWithNegativePattern( exponent, nf, npattern );
            p += 'e' + (expSignInfo[0] || "+") + expSignInfo[1];
        }
        if ( regexParseFloat.test( p ) ) {
            ret = parseFloat( p );
        }
    }
    return ret;
}

//parsing date takes string as input and return as date object
ej.globalize.parseDate = function(value, formats, culture) {
    culture = ej.globalize.findCulture(culture);

    var date, prop, patterns;
    if ( formats ) {
        if ( typeof formats === "string" ) {
            formats = [ formats ];
        }
        if ( formats.length ) {
            for ( var i = 0, l = formats.length; i < l; i++ ) {
                var format = formats[ i ];
                if ( format ) {
                    date = getParsedDate( value, format, culture );
                    if ( date ) break;
                }
            }
        }
    }
    else {
        patterns = culture.calendar.patterns;
        for ( prop in patterns ) {
            date = getParsedDate( value, patterns[prop], culture );
            if ( date ) break;
        }
    }
    return date || null;
}

function getControlObject(obj, stringArray){
    return stringArray.length ? getControlObject(obj[stringArray[0]], stringArray.slice(1)) : obj;
}

//return localized constants as object for the given widget control and culture
ej.globalize.getLocalizedConstants = function(controlName, culture){
    var returnObject,
        controlNameArray = controlName.replace("ej.", "").split(".");
    
    returnObject = getControlObject(ej, controlNameArray);

    return ( $.extend(true, {}, returnObject.Locale['default'], returnObject.Locale[culture ? culture : this.cultureObject.name]) ) ;
}

$.extend(ej, ej.globalize);

}(jQuery));;

});