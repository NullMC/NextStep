FROM php:8.2-apache

# Installa estensioni MySQL
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Abilita moduli Apache
RUN a2enmod rewrite headers

# Copia il codice
COPY ./src /var/www/html

# Permessi
RUN chown -R www-data:www-data /var/www/html

WORKDIR /var/www/html