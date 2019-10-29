use std::io::Cursor;

use crate::feed::{Feed, FeedItem};
use regex::Regex;
use rocket::http::hyper::header::{CacheControl, CacheDirective};
use rocket::http::{ContentType, RawStr};
use rocket::request::{Form, FromFormValue, Request};
use rocket::response::status;
use rocket::response::{self, Responder, Response};
use rocket_contrib::json::Json;

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
    author_reject: Option<FilterRegex>,
    author_allow: Option<FilterRegex>,
    url_reject: Option<FilterRegex>,
    url_allow: Option<FilterRegex>,
}

impl FeedQuery {
    fn filter(&self, item: FeedItem) -> bool {
        let mut accepted = true;
        if let Some(title_reject) = &self.title_reject {
            accepted &= !title_reject.0.is_match(&item.title);
        }

        if let Some(title_allow) = &self.title_allow {
            accepted &= title_allow.0.is_match(&item.title);
        }

        if let Some(author_reject) = &self.author_reject {
            accepted &= !author_reject.0.is_match(&item.title);
        }

        if let Some(author_allow) = &self.author_allow {
            accepted &= author_allow.0.is_match(&item.title);
        }

        if let Some(url_reject) = &self.url_reject {
            accepted &= !url_reject.0.is_match(&item.url)
        }

        if let Some(url_allow) = &self.url_allow {
            accepted &= url_allow.0.is_match(&item.url)
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

#[derive(Serialize)]
pub struct FeedPreviewItem {
    item: FeedItem,
    included: bool,
}

#[derive(Serialize)]
pub struct FeedPreview {
    items: Vec<FeedPreviewItem>,
}

#[get("/preview_feed?<feed_query..>")]
pub fn preview_feed(
    feed_query: Form<FeedQuery>,
) -> Result<Json<FeedPreview>, status::BadRequest<String>> {
    let raw_url_str: &RawStr = feed_query.url.as_str().into();

    match Feed::from_url(&raw_url_str.url_decode_lossy()) {
        Ok(feed) => Ok(Json(FeedPreview {
            items: feed
                .items()
                .iter()
                .cloned()
                .map(|item| FeedPreviewItem {
                    item: item.clone(),
                    included: feed_query.filter(item),
                })
                .collect(),
        })),
        Err(err) => Err(status::BadRequest(Some(err.to_string()))),
    }
}
