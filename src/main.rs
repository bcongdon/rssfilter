#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
extern crate atom_syndication;
extern crate failure;
extern crate regex;
extern crate reqwest;
extern crate rss;

mod feed;
pub mod routes;

fn main() {
    rocket::ignite()
        .mount("/", routes![routes::index, routes::get_feed])
        .launch();
}
