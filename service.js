module.exports = {
    name: "My Product Provider", // The name of your provider...
    version: "1.0", // The version of the product provider specification targeted. (1.0)
    operations: {
        get_product: {           // This method is *required*
            // The URL to the endpoint for getting products. Can be relative or absolute.
            url: '/products/:id' 
        }
    },
    
    services: {
        // Define the service that provides package search and reservation
        // There are other kinds of provider for hotel/accommodation, and flights.
        packages: {
            config: {
                // If all your package SKUs have a set format
                // you can describe it as a regular expression.
                // Searches which contain a SKU not matching this expression will not be forwarded
                // to your provider.
                package_code_regexp: "/^product_/"
            },
            
            operations: {
                // URL of the package search endpoint
                package_search: {
                    url: '/products/search',
                    
                    // Specify the filtering options which are supported.
                    // Criteria for filters which are not supported are not 
                    // forwarded to the provider.
                    supported_features: [
                        "price_value_filter"
                    ]
                },
                
                // URL to create a package reservation
                book_package: {
                    url: '/reservations',
                },
                
                // URL to cancel a reservation
                cancel_booking: {
                    url: '/reservations/cancel'
                }
            }
        }
    }
}