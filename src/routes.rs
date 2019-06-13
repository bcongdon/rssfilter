use std::io::Cursor;

use crate::feed::{Feed, FeedItem};
use regex::Regex;
use rocket::http::hyper::header::{CacheControl, CacheDirective};
use rocket::http::{ContentType, RawStr};
use rocket::request::{Form, FromFormValue, Request};
use rocket::response::status;
use rocket::response::{self, Responder, Response};

#[derive(Debug)]
struct FilterRegex(Regex);

impl<'v> FromFormValue<'v> for FilterRegex {
    type Error = &'v RawStr;

    fn from_form_value(form_value: &'v RawStr) -> Result<FilterRegex, &'v RawStr> {
        match Regex::new(form_value.url_decode_lossy().as_str()) {
            Ok(regex) => Ok(FilterRegex(regex)),
            _ => Err(form_value),
        }
    }
}

#[derive(FromForm, Debug)]
pub struct FeedQuery {
    url: String,
    title_reject: Option<FilterRegex>,
    title_allow: Option<FilterRegex>,
}

impl FeedQuery {
    fn filter(&self, item: FeedItem) -> bool {
        let mut accepted = true;
        if let Some(reject_re) = &self.title_reject {
            accepted &= !reject_re.0.is_match(&item.title);
        }

        if let Some(allow_re) = &self.title_allow {
            accepted &= allow_re.0.is_match(&item.title);
        }

        accepted
    }
}

#[derive(Responder)]
#[response(status = 200, content_type = "xml")]
pub struct FeedQueryResponder {
    inner: String,
    cache_control: CacheControl,
}

#[get("/")]
pub fn index() -> &'static str {
    "Application successfully started!"
}

impl<'r> Responder<'r> for Feed {
    fn respond_to(self, _: &Request) -> response::Result<'r> {
        Response::build()
            .sized_body(Cursor::new(self.to_string()))
            .header(ContentType::XML)
            .header(CacheControl(vec![CacheDirective::MaxAge(3600)]))
            .ok()
    }
}

#[get("/feed?<feed_query..>")]
pub fn get_feed(feed_query: Form<FeedQuery>) -> Result<Feed, status::BadRequest<String>> {
    let raw_url_str: &RawStr = feed_query.url.as_str().into();

    match Feed::from_url(&raw_url_str.url_decode_lossy()) {
        Ok(mut feed) => {
            feed.filter(|item| feed_query.filter(item));
            Ok(feed)
        }
        Err(err) => Err(status::BadRequest(Some(err.to_string()))),
    }
}
