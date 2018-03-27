#!/bin/bash

useradd svs -m -s /bin/bash -G ubuntu
usermod ubuntu -a -G svs

curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -

sudo apt-get update -q

sudo DEBIAN_FRONTEND=noninteractive apt-get install -q -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" nodejs postgresql-client

npm -g i yarn

mkdir -p /opt
cd /opt

git clone git@bitbucket.org:chrisdell/svs.git

chown -R svs:svs svs

cd svs/client
sudo -u svs yarn
sudo -u svs yarn run build

cd ../server
sudo -u svs yarn
sudo -u svs yarn run build

cp svs-server\@.service /etc/systemd/system

systemctl daemon-reload
systemctl enable svs-server\@staging.service
systemctl enable svs-server\@production.service
systemctl start svs-server\@staging.service
systemctl start svs-server\@production.service
