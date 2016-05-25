var request = require('request');
var console = process.console;

var profile = {

    get: function(req, res, next) {

        // var test_user = {
        //     "UserId": "025ecc8c-bb88-4b4e-b202-5a7c45db570c",
        //     "Title": "Mrs",
        //     "Forename": "Mandy",
        //     "Surname": "Jackson",
        //     "PostalAddresses": [{
        //         "postalAddressType": "HOME",
        //         "line1": "74A-74c",
        //         "line3": "Green Lanes",
        //         "line5": "London",
        //         "postcode": "N4 1DX",
        //         "country": "UK",
        //         "migrationId": 1
        //     }],
        //     "Clubcards": ["634004025040362849"]
        // };
        // var test_body = { "Device_Type": "iOS", "Barcode_Type": 0, "Clubcard_Digits": "4036", "Locations": [{ "Latitude": "51.50719197", "Longitude": "-0.127214091", "Relevant_Text": "Charing Cross Express" }, { "Latitude": "51.50719197", "Longitude": "-0.127214091", "Relevant_Text": "Charing Cross Express 2" }] }

        var options = {
            url: 'https://profile.api.tesco.com/v2/CustomerProfile/Profile?fields=userId,title,forename,surname,clubcards,postalAddresses',
            headers: {
                'User-Agent': 'Clubcardv2.2.1',
                'x-newrelic-id': 'XQMOVVJaGwIDUVNTBAkD',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + req.headers.authorization,
                'Accept-Encoding': 'gzip'
            }
        };

        function callback(_err, _res) {
            // req.user = test_user;
            // req.body = test_body;
            // next();

            var token = req.headers.authorization;
            if (_err) {
                console.tag("Error").error("500" + "\n_err: " + _err + "\nreq.body: " + JSON.stringify(req.body)+"\ntoken: "+token);
                res.status('500').send("Internal server error while getting profile, " + _err);
            } else if (_res.statusCode != 200) {
                console.tag("Error").error("_res.statusCode: " + _res.statusCode + "\n_res.body: " + JSON.stringify(_res.body) + "\nreq.body: " + JSON.stringify(req.body)+"\ntoken: "+token);
                res.status(_res.statusCode).send(_res.body || {});
            } else {
                req.user = JSON.parse(_res.body);
                next();
            }
        }
        request(options, callback);
    }
}

module.exports = profile;
