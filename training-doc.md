It is the final week of the training program, and you are going to make a real-world application for Shopify named: Simple Sales Notfication. By making this app, you will get your hand on making a functional application for Shopify and experience the same develoment working process of the Avada team.

There will be a few things to remember about this:

This would be your final test during the training program.
Since this a real-world experience, you will be having deadline. The task must be done within a time of 2 working-week time.
App requirements and guideline would be divided into several parts for easier management. After finishing each part, you need to inform the trainer to review the work and then decide whether you can move on to the next section.
No copying codes from other trainees.
Description
App name: Simple Sales Notifications
Description: This is a Shopify application which helps merchants to display recent sales as notifications on their store. Whenever there is new sales, the notification list should be updated as well. With this app, merchants can customize how the popup display from our app backend easily with beautiful design.Sales pop

Requirements
In order to make this application, you need to follow the given business logic described as app requirements. Here are a list of requirements for the application also known as features that this app needs to have:

Roadmap
The roadmap of making this application will be divided into sections so that we can do it step by step. Each sections will contain guideline and tips on accomplishing the task. Please read carefully and follow with restriction

Before you start

Part 0: Get the app boilerplate.
Before we all start making a Shopify app, you need to create app boilerplate with Avada CLI. Please see this guide to get started: Getting started with Avada CLI

Part 1: Get the React App in shape.
As you learned in week 2 about React app as the frontend of our application. Before you dive into the backend code with heavy business logic, first, you need to setup the app layout according to this mockup on Figma

The design of the sale notification can be found here You can inspect and get the CSS from the page.

There are something IMPORTANT you need to note about this sections:

You only need to design the form using the Polaris component. No input onChange logic needed yet.
The design of the notification should be converted into a reusable React component.
Your design must use Shopify Polaris Do not try to use custom HTML tag and style to do things already done in Polaris like LegacyStack, InlineStack, etc
Your design must look like the mockup to about at least 90%. You should use Shopify Polaris 12. If the mockup use previous Polaris versions, try to find equivalent components or settings to match.

Part 2.1: Getting to design the data structure
Setting up the data structure
Your database should contain two more collections, apart from the 3 collections created by the Avada Core: shopInfos, shops, subscriptions.

3 default collections

You will be creating two more collections: settings and notifications to store your app data

settings: To save the input of the form in the Settings page
Setting form

notifications: List of notification based on store recent sales:
Notifications list

Collection Settings
Name: settings
Database structure: See below
Field	Type	Value list (optional)	Description
position	string	’bottom-left’ - ‘bottom-right’ - ‘top-left’ - ‘top-right’	Show position where the notification will display on merchant store
hideTimeAgo	boolean	true	false
truncateProductName	boolean		Whether you truncate the product name if it is too long
displayDuration	number	integer	Seconds of each notification will display for
firstDelay	number	integer	Seconds before the first popup
popsInterval	number	integer	Seconds between notifications
maxPopsDisplay	number	integer	Maximum numbers of notifications each page load
includedUrls	string	string	List of page URL which the popup will display separated by breakline.
excludedUrls	string	string	List of page URL which the popup will NOT display separated by breakline.
allowShow	string	’all’ - ‘specific’	Show all or specific page
shopId	string	Firestore ID	ID of the shops which this setting belongs to
Collection Notifications
Name: notifications
Database structure: See below
Field	Type	Value list (optional)	Description
firstName	string		Customer first name
city	string		Customer city of the order
productName	string		Product name which the customer bought
country	string		Customer country of the order
productId	number	integer	Shopify product ID
timestamp	Date		Timestamp of the order
productImage	string		Product image link
Next, you will need to map this data structure to you React app input.


Part 2.2: Getting the backend API to work.
There are tasks that you need to do in this section:

Having a KoaJS API endpoint to save the setting input
Having a KoaJS API to get the list of notifications
Map the KoaJS API to React App. Remember to use the useFetchApi we learnt in Week 2: React
API Endpoints
Method	Route	Description	Parameter
GET	/api/settings	Get the setting by shopId in the session	None
PUT	/api/settings	Update the setting API endpoint by shopId in the session	None
GET	/api/notifications	Get the list of the notifications	None

Part 3: After installation logic
In this part 3, we will implement the installation logic for the app. We will only handle two logics:

Sync first 30 orders from the store to notifications
Create default setting for the store. Remember that this is default setting.

Note

This part is the most complex part which requires you to leverage NodeJS skills to its best. Remember to handle NodeJS async programming in the most optimized way.

Note

In this part, you should consider using the GraphQL over Rest API if needed to save effort querying with Shopify API

Part 4: Webhook
In this part, you will need to:

Register webhook after installation
Create a handler endpoint to create new notification when a new order arrives.
The function that convert orders to notifications has to be shared with the sync orders logic.

Note

If you cannot create the Webhook using Shopify API because of 403 error, you should set up the Protected Customer Data

Note

You need to register webhook using Cloudflare URL established after npm run dev, which is filled in .runtimeconfig.json file. With this one, you should be able to tunnel to your local Firebase Functions using appConfig.baseUrl to access its value

But in this part, when you register the new /webhook endpoint. You will need to configure proxy option for this endpoint in vite.config.js so that the endpoint is tunneled successfully via Vite proxy to Firebase.

const proxyConfig = {
  ...
  '^/webhook(/|(\\?.*)?$)': proxyOptions,
};

You can use its dynamic value by using appConfig.baseUrl to access its value. Sometimes, you may want to add the logic to register webhooks again afterLogin hook in auth.js to make sure the webhook is register every time your run npm run dev again.







Part 5: Client API
In this section, you will need to create a public API endpoint that return something like this:

{
  "data": {
    "setting": {
      "position": "top-left",
      "hideTimeAgo": true,
      ...
    },
    "notifications": [
      {
        "id": "JKJFD9454jFdf",
        "city": "Hanoi",
        "productName: "Product name",
        ...
      }
    ]
  }
}


Part 6: Javascript SDK
Note

Before working on this section, download this scripttag snippet: https://cdnapps.avada.io/scripttag.zip

This is the final section of the project, where you will implement the displaying logic of the popup on the store. Please take a look at this diagram first:



You should see the above logic to implement a pseudocode version first.

Note

Don’t try to use setTimeout with callback, it is not going to work, use Javascript async/await instead.

You will need to implement:

Register scripttag after installation
Implement the display logic for the scripttag
Note

Since our app boilerplate have integrated the ViteJS. So, the Firebase Hosting will take the static folder as the public folder. You will be able to access the scripttag file at: http://localhost:5050/scripttag/avada-sale-pop.min.js However, you cannot register this with scripttag API

In order for this to work, you need to run the avada start command by running npm run start -f 5050 -p 3000. So there would be https at the port 3000, and you can access at https://localhost:3000/scripttag/avada-sale-pop.min.js


Part 7: Theme App Extension - OS 2.0
