const express = require("express");
const https = require('https');
var querystring = require('querystring');
require('dotenv').config();
const Amadeus = require("amadeus");
const cors = require('cors');

const app = express();

let PORT = process.env.PORT || 5000;

//gobals
let api_switch = "amadeus";
var AmaduesOauthTokenExpires = 0;
var AmadeusAccessToken = "";

app.use(cors({
    origin: '*'
}));

//amadeus setup
var amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET
});
  
//getting Amadues OAuth2 access token
function Amadues_OAuth(){

    //form data
    let req_data = querystring.stringify({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET
    });

    // request option
    var options = {
        host: 'test.api.amadeus.com',
        method: 'POST',
        path: '/v1/security/oauth2/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': req_data.length
        }
    };

    // request object
    var req = https.request(options, function (res) {
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {

        let data = JSON.parse(result)
        AmaduesOauthTokenExpires = data.expires_in;
        AmadeusAccessToken = data.access_token;

        setTimeout(()=>{
            Amadues_OAuth();
            console.log(data.expires_in);
        },(data.expires_in * 1000));
        
        console.log("Gotten new access token from Amadues")
        //console.log(result);
        });
        res.on('error', function (err) {
            console.log(err);
        });
    });

    // req error
    req.on('error', function (err) {
        console.log(err);
    });

    //send request with the req_data form
    req.write(req_data);
    req.end();
}

if(AmaduesOauthTokenExpires === 0){
    Amadues_OAuth();
}

//sabre setup

//tripPro setup

//Middlewares
// For parsing application/json 
app.use(express.json()); 
// For parsing application/x-www-form-urlencoded 
app.use(express.urlencoded({ extended: true }));

//Routes
//Searching Flight Offers
app.post('/searchflight/', (req, res, next)=>{

    //console.log(req.body);
    console.log(req.query);
    
    let search_obj = {};
    
    if(api_switch === "amadeus"){
        if(req.body.trip_round === "one-way"){
    
            let origin = req.body.origin_iata;
            let destination = req.body.destination_iata;
            let depart_date = req.body.departure_date;
            let num_of_adults = req.body.number_of_adults;
            let num_of_children = req.body.number_of_children;
            let num_of_infants = req.body.number_of_infants;
            let flight_class = req.body.flight_class;
            let currency = req.body.currencyCode;
            
            search_obj = {
                currencyCode: currency,
                originLocationCode: origin,
                destinationLocationCode: destination,
                departureDate: depart_date,
                adults: num_of_adults,
                children: num_of_children,
                infants: num_of_infants,
                travelClass: flight_class
            }

            amadeus.shopping.flightOffersSearch.get(search_obj).then(function(response){
                //console.log(response.data);
                res.send(response.data);
            }).catch(function(responseError){
                res.json([]);
                console.log(responseError);
            });
    
        }else if(req.body.trip_round === "multi-city"){
    
            search_obj = req.body.itinerary;
    
            amadeus.shopping.flightOffersSearch.post(JSON.stringify(search_obj)).then(function(response){
                //console.log(response.data);
                res.send(response.data);
            }).catch(function(responseError){
                res.json([]);
                console.log(responseError);
            });
        }
    }else if(api_switch === "sabre"){

    }else if(api_switch === "trippro"){

    }
  
});

//Getting Final Flight Price
app.post('/getfinalflightprice/', async (req, res, next)=>{

    //res.json(req.body);
    if(api_switch === "amadeus"){
        let inputFlight = [req.body];
        console.log(inputFlight)
  
        const responsePricing = await amadeus.shopping.flightOffers.pricing.post(
            JSON.stringify({
            data: {
                type: 'flight-offers-pricing',
                flightOffers: inputFlight
            }})
        ).catch(err=>{
            console.log(err)
        });
            
        try {
        await res.json(JSON.parse(responsePricing.body));
        } catch (err) {
        await res.json(err);
        }
    }else if(api_switch === "sabre"){

    }else if(api_switch === "trippro"){

    }

});
  
//Creating Fligh Order
app.post('/amadues_flight_create_order/', async (req, res, next)=>{
  
    if(api_switch === "amadeus"){
        let responseOrder = await amadeus.booking.flightOrders.post(
            JSON.stringify({
                data: {
                type: 'flight-order',
                flightOffers: req.body.data.flightOffers,
                travelers: req.body.data.travelers,
                remarks: req.body.data.remarks,
                contacts: req.body.data.contacts
            }})
        ).catch((err) =>{
            console.log(err);
        });
    
        try{
            if(responseOrder){
                await res.json(JSON.parse(responseOrder.body));
            }else{
                await res.json({failed: true, msg: "order not fullfilled!"});
            }
        }catch(err){
            await res.json(err);
        }
    }else if(api_switch === "sabre"){

    }else if(api_switch === "trippro"){

    }
  
});

app.get("/", (req, res, next)=>{
    res.send({Worked: "Ahrive api test"});
});

app.listen(PORT, ()=>{
    console.log(`server started on ${PORT}`);
});