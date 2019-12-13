# WeLife

WeLife is a combination of LinkedIn and Instagram, which is a social media that you could not only share live demos of your epic projects, but also show your awesome personalities.

## Usage

Go to https://welife.herokuapp.com to see some interesting post

## Technologies

FrontEnd : ReactJS, HTML5, SASS, Javascript.

BackEnd : NodeJS, ExpressJS.

Database : MongoDB

## Local host Start

Do command

```bash
npm install
```

in both root folder "WeLife/" and client folder "WeLife/client/"

and run

```bash
npm run dev
```

in root folder to start this application at localhost

## Hint

The database is connect to the cloud cluster of MongoDB. The connection speed is somehow really slow.
Almost all actions (load post, add comment, delete post...) require 5 - 10 seconds to complete,
and sometimes even more depends on the internet speed. Hence, a little patient is needed for this project :P

PS:If you want to try without online database, you could check out to the following commit on master branch

```bash
git checkout fa5b06739ac9f0772da88ce4fcaf51b4ad78cff5
```

That way, the application is running without the database, but with complete functionality of frontend and backend.
