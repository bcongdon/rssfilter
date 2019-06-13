#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
extern crate regex;
extern crate rss;
extern crate reqwest;
extern crate atom_syndication;
extern crate failure;

mod feed;
pub mod routes;

fn main() {
    rocket::ignite()
        .mount("/", routes![routes::index, routes::get_feed])
        .launch();
}
