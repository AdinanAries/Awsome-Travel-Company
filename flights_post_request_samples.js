//initial request object
  //one-way
var fligh_search_data = {
  currencyCode: "USD",
  trip_round: "one-way",
  origin_iata: "",
  destination_iata: "",
  departure_date: formatted_date,
  return_date: formatted_future_date,
  number_of_seniors: 0,
  number_of_adults: default_adults, //including youth, seniors, students
  number_of_actual_adults: 0,
  number_of_students: 0,
  number_of_youth: 0,
  number_of_children: 0,
  number_of_infants: 0, //held infant
  number_of_toddlers: 0, //seated infant
  flight_class: "BUSINESS"
};

//initial request object
  //multi-city
flight_multi_city_search_data = {
  trip_round: "multi-city",
  itinerary: {
    currencyCode: "USD",
    originDestinations: [ 
      { 
        id: 1, 
        originLocationCode: "MAD", 
        destinationLocationCode: "PAR", 
        departureDateTimeRange: { 
          date: "2021-04-03" 
        } 
      }, 
      { 
        id: 2, 
        originLocationCode: "PAR", 
        destinationLocationCode: "MUC", 
        departureDateTimeRange: { 
          date: "2021-04-05" 
        } 
      }, 
      { 
        id: "3", 
        originLocationCode: "MUC", 
        destinationLocationCode: "AMS", 
        departureDateTimeRange: { 
          date: "2021-04-08" 
        } 
      }, 
      { 
        id: 4, 
        originLocationCode: "AMS", 
        destinationLocationCode: "MAD", 
        departureDateTimeRange: { 
          date: "2021-04-11" 
        } 
      }
    ], 
    travelers: [ 
      { 
        id: 1, 
        travelerType: "ADULT", 
        fareOptions: [ 
          "STANDARD" 
        ] 
      },
      {
        id: 2,
        travelerType: "CHILD",
        fareOptions: [ 
          "STANDARD" 
        ] 
      },
      {
        id: 2,
        travelerType: "INFANT",
        fareOptions: [ 
          "STANDARD" 
        ] 
      }
    ], 
    sources: [ 
      "GDS" 
    ], 
    searchCriteria: { 
      maxFlightOffers: 100,
      flightFilters: {
        cabinRestrictions: [
          {
            cabin: "BUSINESS",
            coverage: "MOST_SEGMENTS",
            originDestinationIds: [1]
          }
        ],
        carrierRestrictions: {
          excludedCarrierCodes: ["NON"]
        }
      }
    } 
  }
};
//for creating flight orders at final stage
var amadues_create_flight_order_post_data = {
    data: {
        type: "flight-order",
        flightOffers: [],
        travelers: [],
        remarks: {
            general: [
                {
                    subType: "GENERAL_MISCELLANEOUS",
                    text: "ONLINE BOOKING FROM ANIDASO.COM"
                }
            ]
        },
        ticketingAgreement: {
            option: "DELAY_TO_CANCEL",
            delay: "6D"
        },
        contacts: [
            {
              addresseeName: {
                firstName: "Mohammed",
                lastName: "Adinan"
              },
              companyName: "Anidaso.com",
              purpose: "STANDARD",
              phones: [
                {
                  deviceType: "LANDLINE",
                  countryCallingCode: "34",
                  number: "480080071"
                },
                {
                  deviceType: "MOBILE",
                  countryCallingCode: "33",
                  number: "480080072"
                }
              ],
              emailAddress: "support@increibleviajes.es",
              address: {
                lines: [
                  "Calle Prado, 16"
                ],
                postalCode: "28014",
                cityName: "Madrid",
                countryCode: "ES"
              }
            }
        ]
    }
}
