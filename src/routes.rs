use std::io::Cursor;

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
    fn filter(&self, item: &rss::Item) -> bool {
        let mut accepted = true;
        if let Some(title) = item.title() {
            if let Some(reject_re) = &self.title_reject {
                accepted &= !reject_re.0.is_match(title);
            }

            if let Some(allow_re) = &self.title_allow {
                accepted &= allow_re.0.is_match(title);
            }
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

pub struct ChannelResponse(rss::Channel);

impl<'r> Responder<'r> for ChannelResponse {
    fn respond_to(self, _: &Request) -> response::Result<'r> {
        Response::build()
            .sized_body(Cursor::new(self.0.to_string()))
            .header(ContentType::XML)
            .header(CacheControl(vec![CacheDirective::MaxAge(3600)]))
            .ok()
    }
}

#[get("/feed?<feed..>")]
pub fn get_feed(feed: Form<FeedQuery>) -> Result<ChannelResponse, status::BadRequest<String>> {
    let raw_url_str: &RawStr = feed.url.as_str().into();

    match rss::Channel::from_url(&raw_url_str.url_decode_lossy()) {
        Ok(mut channel) => {
            let items: Vec<rss::Item> = channel
                .items()
                .iter()
                .filter(|&item| feed.filter(item))
                .cloned()
                .collect();
            channel.set_items(items);
            Ok(ChannelResponse(channel))
        }
        Err(err) => Err(status::BadRequest(Some(err.to_string()))),
    }
}
