This is a demo app for [remoteStorage.js](http://remotestorage.io/integrate/).

# Quick Start

[1] Visit https://myfavoritedrinks.remotestorage.io/

* it's this app hosted
* the app needs to be hosted using a Web server--don't just run [index.html](index.html) from file system

[2] Start a remotestorage server

* there are [many options](https://wiki.remotestorage.io/Servers)

> If using node/npm ecosystem:
>
> 1. clone https://github.com/remotestorage/armadietto
> 1. cd $armadietto
> 1. npm install
> 1. npm run dev

[3] Click on the *remotestorage* widget (logo)

[4] type in `tester@localhost:8000` in the input field of the widget, click through

* *tester* being a test username
* *localhost:8000* is where the *remotestorage* server is responding as per step 2.

[5] what happens at this point is server specific, OAuth flow should redirect you to onboarding and login

> If using node/npm ecosystem ([armadietto](https://github.com/remotestorage/armadietto) (as per step 2)):
>
> 1. the login page should show up
> 1. register your new *tester* user
>     1. click *Sign up* in the upper right corner
>     1. type in `tester@acme.com` as a fake email
>     1. type in some password
>     1. click through
>     1. back out into the app
>         * sorry, no redirect when registering
>         * there is a nice *oauth* redirect when just logging in an already registered user
