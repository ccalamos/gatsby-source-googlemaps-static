# gatsby-source-googlemaps-static

## Description
x
This source plugin for Gatsby will make location information from [Google Maps](https://cloud.google.com/maps-platform/) available in GraphQL queries.

## How to install

```sh
# Install the plugin
yarn add gatsby-source-googlemaps-static
```

In `gatsby-config.js`:

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-googlemaps-static',
      options: {
        key: 'YOUR_GOOGLE_MAPS_STATIC_API_KEY',
        latitude: 'LATITUDE',
        longitude: 'LONGITUDE',
      },
    }
  ]
};
```

**NOTE:** To get a Google Maps Static API key, [register for a Google Maps dev account](https://console.cloud.google.com/google/maps-apis).

## Configuration Options

The configuration options for this plugin are currently a small subset of the [static API parameters](https://developers.google.com/maps/documentation/maps-static/intro). Please review those docs for more details and feel free to contribute to this repo to expand the accepted parameters.

| Option           | Default   | Description                                                                                                                                                                                                                                                                |
| ---------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`            |           | **[required]** Your application's API key. This key identifies your application for purposes of quota management.                                                                                                                                                                                                                                        |
| `latitude`       |           | **[required]** The latitude you want to use as the center of the map.                                                                                                                                            |
| `longitude`       |           | **[required]** The longitude you want to use as the center of the map.                                                                                                                                             |

### Example Configuration

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-googlemaps-static',
      options: {
        key: process.env.GOOGLE_MAPS_STATIC_API_KEY,
        latitude: '41.8781',
        longitude: '-87.6298'
      }
    }
  ]
};
```

## Querying Google Maps geocoding information

Once the plugin is configured, one new query is available in GraphQL: `allLocationData`.

Here’s an example query to load the latitude and longitude for Boston, MA:

```gql
query LocationQuery {
  allLocationData {
    edges {
      node {
        results {
          geometry {
            location_type
            location {
              lat
              lng
            }
          }
        }
      }
    }
  }
}
```

See the [Google Maps Static API docs](https://developers.google.com/maps/documentation/maps-static/intro) or the GraphiQL UI for info on all returned fields.

## Acknowledgements

Huge thank you to [Matt Dionis' Gatsby Plugin for Google Maps Geocode API](https://github.com/Matt-Dionis/gatsby-source-googlemaps-geocoding) as I based a lot of this structure off of his plugin.
