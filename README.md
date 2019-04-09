This is a demo app for [remoteStorage.js](http://remotestorage.io/integrate/).

# Quick Start

1. Visit https://remotestorage.github.io/myfavoritedrinks<sup>[1]</sup>
    * the app needs to be hosted using a Web server--don't just run [index.html](index.html) from file system
    * easiest way is to visit this repo's GitHub "pages"
1. Start a remotestorage server
    * if using node/npm ecosystem:
        1. clone https://github.com/remotestorage/armadietto
        1. cd $armadietto
        1. npm install
        1. npm run dev
1. Click on the *remotestorage* widget (logo)
1. type in `tester@localhost:8000` in the input field of the widget, click through
    * *tester* being a test username
    * *localhost:8000* is where the *remotestorage* server is responding as per step 2.
1. what happens at this point is server specific<sup>[2]</sup>, if you're running [armadietto](https://github.com/remotestorage/armadietto) (as per step 2) continue on
    1. the login page should show up
    1. register your new *tester* user
        1. click *Sign up* in the upper right corner
        1. type in `tester@acme.com` as a fake email
        1. type in some password
        1. click through
    1. back out into the app
        * sorry, no redirect when registering
        * there is a nice *oauth* redirect when just logging in an already registered user
 
---
<sup>[1]</sup> Alternatively visit https://drinks-unhosted.5apps.com/ for a [5apps](https://5apps.com/) hosted version of this application--slightly different look and feel, same functionality. 
 
<sup>[2]</sup> If you're not running [armadietto](https://github.com/remotestorage/armadietto), you may need to first on-board a *tester* user in that server's specific way.
