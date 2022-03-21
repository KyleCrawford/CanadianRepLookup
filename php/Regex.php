<?php
/**
 * Checks the string argument to ensure it is one postal code in correct format
 * Does allow the user to enter a space, no space, or a hyphen. Removes the space or hypen before returning
 * @param string $str = the string argument to check if it is a postal code
 * @return mixed if not a proper postal code, returns the postal code without any spacing or extra characters
 */
function TestPostal($str) {
    // Regex that accepts -, ' ', or ''
    $fullReg = "/[a-zA-Z][0-9][a-zA-Z](-?|\s)[0-9][a-zA-Z][0-9]/";

    // Regex that looks for - or ' ' in the middle of the postal code
    $specialReg = "/[a-zA-Z][0-9][a-zA-Z](-|\s)[0-9][a-zA-Z][0-9]/";

    // Check if we have any matches
    if (preg_match($fullReg, $str))
    {
        // Remove the characters in the middle if they exist
        if (preg_match($specialReg, $str)) {
            $str = str_replace('-', '', $str);
            $str = str_replace(' ', '', $str);
        }

        // check the length, if we are too long or somehow too short, return false
        if (strlen($str) !== 6)
        {
            return false;
        }
        else {
            return $str;
        }
    }
    else {
        return false;
    }
}