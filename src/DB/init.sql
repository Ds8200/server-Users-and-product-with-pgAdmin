-- CREATE SCHEMA schemaUsers;

create table
    schemaUsers.users(
        user_id serial primary key,
        email TEXT not null UNIQUE,
        password TEXT not null,
        date_create TIMESTAMP,
		date_update TIMESTAMP
    );

create table
    schemaUsers.products(
        product_id serial primary key,
        product_name TEXT not null UNIQUE,
        date_create_prod TIMESTAMP,
        date_update_prod TIMESTAMP
    );

create table
    schemaUsers.usersProducts(
        usersProducts_id serial primary key,
        user_id integer,
        foreign Key (user_id) references schemaUsers.users (user_id),
        product_id integer,
        foreign Key (product_id) references schemaUsers.products (product_id)
    );



select *
from
    schemaUsers.users
    natural join schemaUsers.usersProducts
    natural join schemaUsers.products