# Backend for the Social Enterprise directory

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

The directory uses Node, Swagger and Mongo on the backend.
For detailed technical documentation, see the wiki.

## To install
* `npm install`

## To install and start Mongo
* https://docs.mongodb.com/manual/installation/

### (Optional) Load test data into Mongo
* First delete any previous data from Mongo (if so desired)

 `mongo socialEnterpriseDirectory --eval "db.dropDatabase()"`
* Now import the test data with these commands

 `mongoimport --db socialEnterpriseDirectory --collection enterprises --file /path/to/api/mocks/test_data_mongo_public.json --jsonArray`

 `mongoimport --db socialEnterpriseDirectory --collection enterprisePrivateFields --file /path/to/api/mocks/test_data_mongo_private.json --jsonArray`

  `mongoimport --db socialEnterpriseDirectory --collection enterpriseLogos --file /path/to/api/mocks/test_data_mongo_logos.json --jsonArray`

## To configure

### Session secret
* Add a session secret to config/production.json
```
  "sessionSecret": "Any secret string here"
```

### Oauth configuration
* The directory uses OAuth to authenticate administrators. To configure OAuth, create a file called `oauth.json` and place it in directory `config/oauth/`. The contents should look like:

```
{
  "twitterCallbackURL": "https://<your url>/api/v1/account/login/twitter/callback",
  "facebookCallbackURL": "https://<your url>/api/v1/account/login/facebook/callback",
  "instagramCallbackURL": "https://<your url>/api/v1/account/login/instagram/callback",

  "redirectURLOnSuccessfulLogin": "your URL",

  "twitterConsumerKey" : "your key",
  "twitterConsumerSecret": "your secret",

  "facebookClientId": "your client id",
  "facebookSecret": "your secret",

  "instagramClientId": "your client id",
  "instagramSecret": "your secret "
}
```

### Directory Administrators
* A directory administrator is someone who has full privileges over the directory content as well as other administrators. If the database does not already contain a directory administrator, an administrator can be bootstrapped into the database.
Create a file called `config/admins.txt` where each line holds one email address of a directory administrator. This will be loaded into the database on startup (only if there is not already an administrator present in the database).

## To start
* `npm start`

## To use
Full API documentation is available here:
* https://app.swaggerhub.com/api/chad.adams/SocialEnterpriseDirectory/1

Sample operations:
* Browse directory: http://localhost:10010/api/v1/directory
* Search directory: http://localhost:10010/api/v1/directory?q=key+words+here
* Get Enterprise: http://localhost:10010/api/v1/enterprise/{id}
* Get Enterprise Logo: http://localhost:10010/api/v1/enterprise/{id}/logo
* POST Enterprise (requires authentication): http://localhost:10010/api/v1/enterprise

## To test
See wiki.

# Swagger commands for development/testing
First install the swagger command line
* `npm install -g swagger`
* Further reference: https://github.com/swagger-api/swagger-node

Starting server
* as alternative to `npm start` you can use `swagger project start`
* the advantage is that it will auto-detect any file modifications and nicely restart the server for you (it wraps nodemon)

To view our API documentation in Swagger UI:
* `swagger project edit` then open browser to the URL shown in the console (if it does not automatically open for you)
* One neat thing is that you can use the "Try this operation" button to send requests to the server from this UI
