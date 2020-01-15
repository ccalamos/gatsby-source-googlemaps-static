<div align="center" style="margin-bottom:2em;">
<h1>
  Gatsby Source Google Maps Static Plugin
  <br>
  <span style="font-size:small">
    <b>GSGS</b> (gatsby-source-googlemaps-static)
  </span>
</h1>

<div style="margin-bottom:1em;">
<img alt="gatsby" src="https://img.shields.io/badge/Gatsby.js-Source%20Plugin-blueviolet?style=for-the-badge&logo=gatsby&labelColor=blueviolet&color=555">
</div>

<img alt="npm" src="https://img.shields.io/npm/v/gatsby-source-googlemaps-static?style=flat-square">
<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/ccalamos/gatsby-source-googlemaps-static?label=updated&style=flat-square">
<img alt="typescript" src="https://camo.githubusercontent.com/92e9f7b1209bab9e3e9cd8cdf62f072a624da461/68747470733a2f2f666c61742e62616467656e2e6e65742f62616467652f4275696c74253230576974682f547970655363726970742f626c7565">
<img alt="PRs" src="https://img.shields.io/badge/PRs-welcome-green?style=flat-square">
</div>

This source plugin for Gatsby will make location information from [Google Maps](https://cloud.google.com/maps-platform/) available in GraphQL queries and provide a link to open that map on [Google Maps](https://developers.google.com/maps/documentation/urls/guide#top_of_page). **GSGS** (gatsby-source-googlemaps-static) plugin will also cache the image response and only make a call to the API when the cache is invalid or empty. The cache is invalidated when you change any of the values below *(Omitting the key and secret)*.

**GSGS** will also obscure your API key by only holding onto the key, or secret, when an API call is necessary. After the key, or secret, has been deemed unnecessary, it will be deleted from memory.

<br>
<br>

## Install

```sh
# Install the plugin
npm install gatsby-source-googlemaps-static

# or using Yarn
yarn add gatsby-source-googlemaps-static
```

<br>
<br>

## How to use

In `gatsby-config.js`:

**Minimum Setup**
```js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-googlemaps-static`,
      options: {
        key: `YOUR_GOOGLE_MAPS_STATIC_API_KEY`,
        center: `LATITUDE,LONGITUDE || CITY,REGION`,
      },
    }
  ]
};
```
**NOTE:** To get a Google Maps Static API key, [register for a Google Maps dev account](https://console.cloud.google.com/google/maps-apis).

<br>
<br>

## Options

The configuration options for this plugin are currently an expansive set of the [static API parameters](https://developers.google.com/maps/documentation/maps-static/intro). Please review those docs for more details and feel free to contribute to this repo to expand the accepted parameters.

```js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-googlemaps-static`,
      options: {
        key: `YOUR_GOOGLE_MAPS_STATIC_API_KEY`,
        center: `LATITUDE,LONGITUDE || CITY,REGION`,
        zoom: `ZOOM_LEVEL`,
        size: `SIZE || WIDTHxHEIGHT`,
        scale: `SCALE_VALUE`,
        format: `IMAGE_EXTENSION`,
        mapType: `MAP_FORMAT`,
        styles: [
          {
            feature: `FEATURE`,
            element: `ELEMENT`,
            rules:
          },
        ] || `PREFORMATTED_STYLES_URI_STRING`,
        markers: [
          {
            location: `LATITUDE,LONGITUDE || CITY,REGION`,
            color: `COLOR`,
            size: `SIZE`,
            label: `A_SINGLE_ALPHANUMERIC_CHARACTER`,
            icon: `URI`,
            anchor: `ANCHOR_POSITION`,
          },
        ] || `PREFORMATTED_MARKERS_URI_STRING`,
        paths: [
          {
            weight: `WEIGHT`,
            color: `COLOR`,
            fillColor: `FILL_COLOR`,
            geoDesic: true || false,
            points: [
              `LATITUDE,LONGITUDE || CITY,REGION`,
            ] || `PREFORMATTED_LIST_OF_POINTS`,
          },
        ] || `PREFORMATTED_PATHS_URI_STRING`,
        visible: [
          `LATITUDE,LONGITUDE || CITY,REGION`,
        ] || `PREFORMATTED_VISIBLE_URI_STRING`,
        clientID: `GOOGLE_MAPS_STATIC_CLIENT_ID`,
        secret: `GOOGLE_MAPS_SECRET_FOR_SIGNED_URLS`,
        query: `GOOGLE_MAPS_URL_QUERY`,
      },
    }
  ]
};
```

<br>

| Option           | Default   | Description     | Notes                                                                                                                                                                                                                                                           |
| ---------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------|
| `key`            |           | **[required\*\*]** Your application's API key. This key identifies your application for purposes of quota management.           | This is not required if you provide both `clientID` and `secret`
| `center`       |           | **[required\*]** The latitude and longitude or address of the center of the map.                                                     | This is not required if you are using Implicit Mapping. See [Google Maps Static Docs](https://developers.google.com/maps/documentation/maps-static/dev-guide#ImplicitPositioning) for more information.
| `zoom`      |     `14`    | The zoom level of the map.                                                     |
| `size`      |     `640x640`    | The width and height of the image returned from Google.                                                     | It is optional to include the `x` character if the height and width are equal.
| `scale`      |         | The scale value for the map returned by Google.                                                    |
| `format`      |   `png`      | The file format and extension for the image.                                                    |
| `mapType`      |         | The type of map that Google should use to render the image.                                                    |
| `clientID`      |         | **[required\*\*]** The client ID from [Google Cloud Platform Console](https://console.cloud.google.com/projectselector/apis/).                                                    | This field is not required when using `key` field.
| `secret`      |         | **[required\*]** The modified base64 secret from [Google Cloud Platform Console](https://console.cloud.google.com/projectselector/apis/) used for signing URLs.                                                    | This field is only required when attempting to create a [signature](https://developers.google.com/maps/documentation/maps-static/get-api-key).
| `query`      |         | A custom query to replace your center for the generated map URL.                                                    |
| `styles`      |         | Provides custom styles to the returned image.                                                     | Either a preformatted URI string or an Array of Objects. Please see [Google Maps Static Styled Maps](https://developers.google.com/maps/documentation/maps-static/styling) for more information about these fields.
| `markers`      |         | Places markers on the return map image.                                                     | Either a preformatted URI string or an Array of Objects. Please see [Google Maps Static Markers](https://developers.google.com/maps/documentation/maps-static/dev-guide#Markers) for more information about these fields.
| `paths`      |         | Places a path or a polygonal area over top of the map.                                                     | Either a preformatted URI string or an Array of Objects. Please see [Google Maps Static API Paths](https://developers.google.com/maps/documentation/maps-static/dev-guide#Paths) for more information about these fields.
| `visible`      |         | Ensures that the provided points are visible on the map.                                                     | Either a preformatted URI string or an Array of Strings. This has precedence over zoom level. Please see [Google Maps Static Viewports](https://developers.google.com/maps/documentation/maps-static/dev-guide#Viewports) for more information about these fields.

> ** If provided with both `key` and `clientID`, **GSGS** will prefer to use `clientID`.

> If map is generated using Implicit Mapping, then the generated URL will be using [Google Directions Waypoints](https://developers.google.com/maps/documentation/urls/guide#directions-examples-using-waypoints). The first `paths` `points` will be the waypoints, if that is not provided then it will use the `markers` `locations`, if that is not provided then it will use the `visible` `locations`.

<br>
<br>

### Example Configuration

*A Very Simple Configuration Example*
```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-googlemaps-static',
      options: {
        key: process.env.GOOGLE_MAPS_STATIC_API_KEY,
        center: '41.8781,-87.6298',
      }
    }
  ]
};
```

<br>

*Another Very Simple Configuration Example*
```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-googlemaps-static',
      options: {
        key: process.env.GOOGLE_MAPS_STATIC_API_KEY,
        center: 'Chicago, IL',
      }
    }
  ]
};
```

<br>

*An Implicit Mapping Configuration Example*
```js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-googlemaps-static`,
      options: {
        key: process.env.GOOGLE_MAPS_STATIC_API_KEY,
        paths: [
          {
            color: `0x00000000`,
            weight: `5`,
            fillColor: `0xFFFF0033`,
            points: [
              `8th Avenue & 34th St, New York, NY`,
              `8th Avenue & 42nd St,New York,NY`,
              `Park Ave & 42nd St,New York,NY,NY`,
              `Park Ave & 34th St,New York,NY,NY`
            ]
          }
        ]
      }
    }
  ]
};
```

<br>

*Signature Configuration Example (Using API KEY)*
```js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-googlemaps-static`,
      options: {
        key: process.env.GOOGLE_MAPS_STATIC_API_KEY,
        secret: process.env.GOOGLE_MAPS_STATIC_SECRET,
        center: `New York, NY`,
      }
    }
  ]
};
```

<br>

*Signature Configuration Example (Using Client ID)*
```js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-googlemaps-static`,
      options: {
        clientID: process.env.GOOGLE_MAPS_STATIC_CLIENT_ID,
        secret: process.env.GOOGLE_MAPS_STATIC_SECRET,
        center: `New York, NY`,
      }
    }
  ]
};
```

<br>

*Query Configuration Example*
```js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-googlemaps-static`,
      options: {
        key: process.env.GOOGLE_MAPS_STATIC_API_KEY,
        center: `Chicago, IL`,
        query: `Willis Tower`,
      }
    }
  ]
};
```
<br>
<br>

### GraphQl Queries

Once the plugin is configured, one new query is available in GraphQL: `staticMap`.

Here’s an example query to load the **image** of a Static Map:

```gql
query StaticMapQuery {
  staticMap {
    childFile {
      childImageSharp {
        ...GatsbyImageSharpFluid
      }
    }
  }
}
```
<br>

Here’s an example query to get the generated [**Google Maps URL**](https://developers.google.com/maps/documentation/urls/guide#top_of_page) of the Static Map:

```gql
query StaticMapQuery {
  staticMap {
    mapUrl
  }
}
```

<br>

If you are using `format: 'gif'` _Image Sharp_ will not be able to process your image, however you can still access your cached/downloaded image like so:

```gql
query StaticMapGifQuery {
  staticMap {
    childFile {
      publicURL
    }
  }
}
```

<br>
<br>

See the [Image Sharp Plugin](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-image) or the GraphiQL UI for info on all returned fields.
