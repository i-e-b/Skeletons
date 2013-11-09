#!/bin/bash

# To install PHP tools on debian / ubuntu.
# sudo apt-get install apache2 apache2-mpm-prefork apache2-utils apache2.2-common libapache2-mod-php5 libapr1 libaprutil1 libdbd-mysql-perl libdbi-perl libnet-daemon-perl libplrpc-perl libpq5 mysql-client-5.5 mysql-common mysql-server mysql-server-5.5 php5-common php5-mysql curl

if [[ ! -f "compose.phar" ]]; then
    curl -sS https://getcomposer.org/installer > comp.phar && \
        cat comp.phar | php && \
        rm comp.phar
fi

php composer.phar update

