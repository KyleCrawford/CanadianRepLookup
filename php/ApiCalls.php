<?php

/**
 * A call to the google geocode api to get a location code based on a postal code
 * @param string $postalCode the postal code used to call the google api
 * @return string JSON results from the api call
 */
function call_google($postalCode, $apiKey)
{
    $googleUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=". $postalCode ."&key=" . $apiKey;

    $ch = curl_init($googleUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($ch);

    curl_close($ch);

    return $result;
}

/**
 * A call to the opennorth api to get a list of representatives based on a geocode
 * @param float $lat the latitude to search
 * @param float $lng the longitude to search
 * @return string JSON results from the api call
 */
function call_opennorth($lat, $lng)
{
    $opennorthUrl = "http://represent.opennorth.ca/representatives/?point=";
    $opennorthUrl .= ($lat . "," . $lng);
    $ch = curl_init($opennorthUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($ch);

    curl_close($ch);

    return $result;
}