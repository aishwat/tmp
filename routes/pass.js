var createTemplate = require("passbook");
var fs = require('fs');
// var test_cc = "634004025040362849";
var console = process.console;
var template = createTemplate("storeCard", {
    passTypeIdentifier: "pass.com.tesco.tescoclubcard",
    teamIdentifier: "FEY6Z943BR",
    organizationName: "Tesco Clubcard",
    serialNumber: "448868000000022204",
    description: "Clubcard Pass",
    foregroundColor: "rgb(255, 255, 255)",
    backgroundColor: "rgb(65,150,243)",
    labelColor: "rgb(34,85,171)",
    "associatedStoreIdentifiers": [
        351841850
    ]
});

var pass = {
    generate: function(req, res, next) {
        template.loadImagesFrom("images");
        template.fields.barcode = {
            "format": "PKBarcodeFormatAztec",
            "message": GetMachineReadableClubCardNumber(req.user.Clubcards[0]), //clubcard number
            "messageEncoding": "iso-8859-1"
        }
        template.locations = req.body.Locations;

        // not a good approach
        var stores = "";
        for (i = 0; i < req.body.Locations.length; i++) {
            stores = stores + ("• " + req.body.Locations[i].Relevant_Text + "\n");
        }

        var pass = template.createPass();
        pass.secondaryFields.add("Name", "Name", req.user['Title'] + " " + req.user['Forename'] + " " + req.user['Surname']);
        pass.secondaryFields.add("ClubcardNumber", "Clubcard Number", req.user.Clubcards[0]);
        pass.backFields.add("FavouriteStores", "FAVOURITE STORES", stores.toString());

        var name = req.user['Forename'] + " " + req.user['Surname'];
        var token = req.headers.authorization;
        res.on('finish', function() { console.tag("Success").log("Pass generated successfully for " + name + " with token " + token); });

        pass.render(res, function(err) {
            if (err) {
                console.tag("Error").error("500" + "\n_err: " + err + "\nreq.body: " + JSON.stringify(req.body) + "\nName: " + name + "\ntoken: " + token);
                res.status('500').send("Internal server error while generating pass, " + err);
            }
        });
    }
}
module.exports = pass;

function GetMachineReadableClubCardNumber(clubcardNumber) {
    var ccNo = clubcardNumber.substring(6);
    var replacedCCNo = clubcardNumber;

    if (clubcardNumber.startsWith("634004")) {
        if (clubcardNumber.length == 18) {
            replacedCCNo = "9794" + ccNo;
        } else if (clubcardNumber.length == 16) {
            replacedCCNo = "97944" + ccNo;
        }

    } else if (clubcardNumber.startsWith("634000")) {
        replacedCCNo = "9790" + ccNo;

    }

    return replacedCCNo;
}
