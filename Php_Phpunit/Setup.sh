#!/bin/sh

# Setup script for debian / ubuntu.
# Assumes PHP already installed
#apt-get install curl

if [[ ! -f "compose.phar" ]] ; then
    curl -sS https://getcomposer.org/installer > comp.phar && \
        cat comp.phar | php && \
        rm comp.phar
fi

php composer.phar update

