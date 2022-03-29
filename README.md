# CanadianRepLookup
 Tool to lookup a Canadian Representative by postal code

** Note the Google API key contained within is not activated and will not work.

This project uses the Google GeoCaching API as well as the OpenNorth Representative API - https://represent.opennorth.ca/api/

The project allows a user to enter a Canadian postal code, and the program will return a list of representatives that are for that area.

The OpenNorth API does allow for a search using just postal codes, but state in their documentation that this is not accurrate. As a result, this program uses the Google GeoCoding API to enter a postal code and get a GeoCode back. This GeoCode is then used in the OpenNorth API to retrieve the list of representatives.
