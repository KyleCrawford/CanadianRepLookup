<?php

require_once './Regex.php';
require_once './ApiCalls.php';

// This is the key I used for this project. I will keep it active for a couple weeks and then deactivate it.
$GOOGLE_API_KEY = "AIzaSyAPeYs_Yvqa6514EJRHc51KoGYSwvIjBeU";
/**
 * This script takes a postal code, verifies that it is in correct format. 
 * Uses that postal code to call Google's geocoding api to return a geocode for that postal code
 * We then use that geocode to call opennorth's api for representatives to return a JSON list of representatives by that location.
 * returns a JSON list of representatives sorted by representative set name
 * or on an error returns errorMessage and errorType
 */
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['postal']))
{
    $postalCode = $_GET['postal'];
    $postalCode = TestPostal($postalCode);

    // doing literal comparison as the function returns either false, or a string
    if ($postalCode === false){
        // we got an error
        http_response_code(400);
        echo json_encode(
            array('errorMessage' => "Postal Code Incorrect", 'errorType' => 'postal_code')
        );
        die();
    }
    else {
        // We are good to go (could remove this, leaving it in just because)
    }
}
else
{
    http_response_code(400);
    echo json_encode(
        array('errorMessage' => "Incorrect Access", 'errorType' => 'access_error')
    );
    die();
}

// call google for the geocode
$geocode = json_decode(call_google($postalCode, $GOOGLE_API_KEY));

// check to make sure geocode is ok
if (!isset($geocode->results[0]->geometry)) {
    // something went wrong, probably a postal code that doesn't exist
    http_response_code(400);
    echo json_encode(
        array('errorMessage' => "Postal Code Returned No Location", 'errorType' => 'postal_code')
    );
    die();
}

// use that code to call opennorth for representative list
$results = json_decode(call_opennorth($geocode->results[0]->geometry->location->lat, $geocode->results[0]->geometry->location->lng));

$objectList = $results->objects;

if (count($objectList) == 0)
{
    http_response_code(400);
    echo json_encode(
        array('errorMessage' => "No Results Returned", 'errorType' => "no_results")
    );
    die();
}

// sort the results on representative set name
usort($objectList, function($a, $b) {return strcmp($a->representative_set_name, $b->representative_set_name);});

http_response_code(200);
echo json_encode($objectList);

